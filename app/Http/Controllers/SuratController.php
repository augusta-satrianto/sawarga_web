<?php

namespace App\Http\Controllers;

use App\Models\Surat;
use App\Models\SuratDokumen;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class SuratController extends Controller
{
    // Batas ukuran per dokumen (byte) dan jumlah dokumen per pengiriman.
    private const UPLOAD_MAX = 5 * 1024 * 1024;
    private const UPLOAD_MAX_FILE = 5;

    // Folder penyimpanan di disk "local" (storage/app/private), tidak bisa diakses langsung dari browser.
    public const UPLOAD_DIR = 'uploads';

    // GET /api/surat - warga: miliknya sendiri, pengurus RT: semua.
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $surat = Surat::with(['user', 'verifikator', 'dokumen'])
            ->when(! $user->isRt(), fn ($q) => $q->where('user_id', $user->id))
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get();

        $data = $surat->map(fn (Surat $s) => [
            'id' => $s->id,
            'no' => $s->no_pengajuan,
            'nama' => $s->user->nama,
            'nik' => $s->user->nik,
            'alamat' => $s->user->alamat,
            'jenis' => $s->jenis,
            'keperluan' => $s->keperluan,
            'status' => $s->status,
            'catatan' => $s->catatan,
            'prioritas' => $s->prioritas,
            'skor_prioritas' => $s->skor_prioritas,
            'sumber_prioritas' => $s->sumber_prioritas,
            'diverifikasi_pada' => $s->diverifikasi_pada?->format('Y-m-d H:i:s'),
            'verifikator' => $s->verifikator?->nama,
            // Tanda tangan elektronik (QR) hanya untuk surat yang disetujui.
            'qr' => $s->status === 'Siap Diunduh' && $s->kode_verifikasi
                ? route('verifikasi.qr', $s->kode_verifikasi, false)
                : null,
            'url_verifikasi' => $s->status === 'Siap Diunduh' && $s->kode_verifikasi
                ? route('verifikasi', $s->kode_verifikasi)
                : null,
            'dibuat' => $s->created_at->format('Y-m-d H:i:s'),
            'diperbarui' => $s->updated_at->format('Y-m-d H:i:s'),
            'dokumen' => $s->dokumen->map(fn (SuratDokumen $d) => [
                'id' => $d->id,
                'nama' => $d->nama_asli,
                'ukuran' => $d->ukuran,
                'mime' => $d->mime,
            ])->all(),
        ]);

        return $this->ok(['surat' => $data]);
    }

    // POST /api/surat (multipart: jenis, keperluan, dokumen[]) - warga mengajukan surat baru.
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->isRt()) {
            $this->fail('Hanya warga yang dapat mengajukan surat.', 403);
        }

        $jenis = trim((string) $request->input('jenis'));
        $keperluan = trim((string) $request->input('keperluan'));
        if (! in_array($jenis, Surat::JENIS, true)) $this->fail('Jenis surat tidak dikenal.');
        if ($keperluan === '') $this->fail('Keperluan pengajuan wajib diisi.');
        if (mb_strlen($keperluan) > 1000) $this->fail('Keperluan maksimal 1000 karakter.');

        $docs = $this->simpanUploads($request);

        try {
            $surat = DB::transaction(function () use ($user, $jenis, $keperluan, $docs) {
                // Prioritas tidak diambil dari input warga: diisi nilai default oleh sistem.
                $surat = Surat::create([
                    'user_id' => $user->id,
                    'jenis' => $jenis,
                    'keperluan' => $keperluan,
                    'prioritas' => Surat::PRIORITAS_DEFAULT,
                    'sumber_prioritas' => 'default',
                ]);
                $surat->update(['no_pengajuan' => sprintf('SRT-%s-%03d', date('Y'), $surat->id)]);
                $surat->dokumen()->createMany($docs);

                return $surat;
            });
        } catch (Throwable $e) {
            $this->hapusUploads($docs);
            throw $e;
        }

        return $this->ok([
            'id' => $surat->id,
            'no' => $surat->no_pengajuan,
            'jumlah_dokumen' => count($docs),
        ], 201);
    }

    // POST /api/surat/keputusan {id, status, catatan} - pengurus RT memberi keputusan verifikasi.
    public function keputusan(Request $request): JsonResponse
    {
        $rt = $request->user();
        if (! $rt->isRt()) {
            $this->fail('Anda tidak memiliki akses untuk tindakan ini.', 403);
        }

        $status = trim((string) $request->input('status'));
        $catatan = trim((string) $request->input('catatan'));

        if (! in_array($status, Surat::KEPUTUSAN, true)) $this->fail('Status keputusan tidak dikenal.');
        if (in_array($status, ['Perlu Perbaikan', 'Ditolak'], true) && $catatan === '') {
            $this->fail('Catatan wajib diisi agar warga tahu alasannya.');
        }
        if (mb_strlen($catatan) > 1000) $this->fail('Catatan maksimal 1000 karakter.');

        $surat = Surat::find((int) $request->input('id'));
        if (! $surat) $this->fail('Pengajuan tidak ditemukan.', 404);

        $surat->update([
            'status' => $status,
            'catatan' => $catatan !== '' ? $catatan : null,
            'diverifikasi_oleh' => $rt->id,
            'diverifikasi_pada' => now(),
            // Saat disetujui, surat otomatis mendapat kode untuk QR tanda tangan elektronik.
            'kode_verifikasi' => $status === 'Siap Diunduh'
                ? ($surat->kode_verifikasi ?? Surat::buatKodeVerifikasi())
                : $surat->kode_verifikasi,
        ]);

        return $this->ok();
    }

    // POST /api/surat/perbaikan (multipart: id, dokumen[]) - warga mengunggah ulang dokumen
    // untuk surat berstatus "Perlu Perbaikan". Setelah itu surat kembali ke "Menunggu Verifikasi".
    public function perbaikan(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->isRt()) {
            $this->fail('Anda tidak memiliki akses untuk tindakan ini.', 403);
        }

        $surat = Surat::where('id', (int) $request->input('id'))->where('user_id', $user->id)->first();
        if (! $surat) $this->fail('Pengajuan tidak ditemukan.', 404);
        if ($surat->status !== 'Perlu Perbaikan') $this->fail('Pengajuan ini tidak sedang menunggu perbaikan.');

        $docs = $this->simpanUploads($request);

        try {
            DB::transaction(function () use ($surat, $docs) {
                $surat->dokumen()->createMany($docs);
                $surat->update(['status' => 'Menunggu Verifikasi', 'catatan' => null]);
            });
        } catch (Throwable $e) {
            $this->hapusUploads($docs);
            throw $e;
        }

        return $this->ok();
    }

    // GET /api/dokumen/{id} - menampilkan dokumen. Hanya pemilik surat atau pengurus RT.
    public function dokumen(Request $request, int $id): BinaryFileResponse
    {
        $user = $request->user();
        $doc = SuratDokumen::with('surat')->find($id);

        if (! $doc || (! $user->isRt() && (int) $doc->surat->user_id !== (int) $user->id)) {
            $this->fail('Dokumen tidak ditemukan.', 404);
        }

        $path = self::UPLOAD_DIR . '/' . basename($doc->nama_file);
        if (! Storage::disk('local')->exists($path)) {
            $this->fail('Berkas tidak ditemukan di server.', 404);
        }

        $nama = str_replace(['"', "\r", "\n"], '', $doc->nama_asli);

        return response()->file(Storage::disk('local')->path($path), [
            'Content-Type' => $doc->mime,
            'Content-Disposition' => 'inline; filename="' . $nama . '"',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'private, no-store',
        ]);
    }

    // GET /api/surat/{id}/pdf - unduh surat yang sudah disetujui sebagai file PDF (dengan QR tanda tangan).
    public function pdf(Request $request, int $id): Response
    {
        $user = $request->user();
        $surat = Surat::with(['user', 'verifikator'])->find($id);

        if (! $surat || (! $user->isRt() && (int) $surat->user_id !== (int) $user->id)) {
            $this->fail('Pengajuan tidak ditemukan.', 404);
        }
        if ($surat->status !== 'Siap Diunduh' || ! $surat->kode_verifikasi) {
            $this->fail('Surat belum disetujui sehingga belum dapat diunduh.', 403);
        }

        $romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        $urut = substr((string) $surat->no_pengajuan, strrpos((string) $surat->no_pengajuan, '-') + 1);
        $nomor = $urut . '/RT24/' . $romawi[$surat->created_at->month - 1] . '/' . $surat->created_at->year;

        $qr = VerifikasiController::qrSvg(route('verifikasi', $surat->kode_verifikasi));

        $pdf = Pdf::loadView('surat-pdf', [
            'surat' => $surat,
            'nomor' => $nomor,
            'tanggal' => ($surat->diverifikasi_pada ?? $surat->created_at)->translatedFormat('d F Y'),
            'qr' => 'data:image/svg+xml;base64,' . base64_encode($qr),
        ])->setPaper('a4')->setOption('isFontSubsettingEnabled', true);

        $nama = str_replace(' ', '_', $surat->jenis) . '_' . $surat->no_pengajuan . '.pdf';

        return $pdf->download($nama);
    }

    // Validasi lalu simpan file dari input "dokumen" / "dokumen[]" (maks. UPLOAD_MAX_FILE).
    // Semua file dicek dulu; jika ada satu yang tidak valid, tidak ada file yang disimpan.
    // Mengembalikan daftar data untuk tabel surat_dokumen.
    private function simpanUploads(Request $request): array
    {
        $files = $request->file('dokumen');
        $files = array_values(array_filter(is_array($files) ? $files : [$files]));

        if (! $files) $this->fail('Unggah KTP dan Kartu Keluarga terlebih dahulu.');
        if (count($files) > self::UPLOAD_MAX_FILE) $this->fail('Maksimal ' . self::UPLOAD_MAX_FILE . ' file per pengiriman.');

        // Tipe file dicek dari isi file, bukan dari nama/ekstensi kiriman browser.
        $allowed = ['application/pdf' => 'pdf', 'image/jpeg' => 'jpg', 'image/png' => 'png'];
        $siap = [];
        /** @var UploadedFile $f */
        foreach ($files as $f) {
            $label = '"' . basename($f->getClientOriginalName()) . '"';
            if (in_array($f->getError(), [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)) {
                $this->fail("File $label melebihi 5 MB.");
            }
            if (! $f->isValid()) $this->fail("File $label gagal diunggah. Coba lagi.");
            if ($f->getSize() <= 0 || $f->getSize() > self::UPLOAD_MAX) $this->fail("File $label melebihi 5 MB.");

            $mime = $f->getMimeType();
            if (! isset($allowed[$mime])) $this->fail("File $label harus berformat PDF, JPG, atau PNG.");

            $asli = preg_replace('/[^\w.\- ]+/u', '_', basename($f->getClientOriginalName()));
            $siap[] = [
                'file' => $f,
                'nama_asli' => mb_substr($asli !== '' ? $asli : 'dokumen.' . $allowed[$mime], 0, 255),
                'nama_file' => bin2hex(random_bytes(16)) . '.' . $allowed[$mime],
                'mime' => $mime,
                'ukuran' => (int) $f->getSize(),
            ];
        }

        $hasil = [];
        foreach ($siap as $s) {
            if (! $s['file']->storeAs(self::UPLOAD_DIR, $s['nama_file'], 'local')) {
                $this->hapusUploads($hasil);
                $this->fail('File gagal disimpan.', 500);
            }
            unset($s['file']);
            $hasil[] = $s;
        }

        return $hasil;
    }

    // Hapus file yang sudah tersimpan (dipakai saat penyimpanan ke database gagal).
    private function hapusUploads(array $docs): void
    {
        foreach ($docs as $d) {
            Storage::disk('local')->delete(self::UPLOAD_DIR . '/' . $d['nama_file']);
        }
    }
}
