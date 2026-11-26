<?php

namespace Database\Seeders;

use App\Http\Controllers\SuratController;
use App\Models\KasIuran;
use App\Models\KasIuranBulan;
use App\Models\KasPengeluaran;
use App\Models\KasWarga;
use App\Models\Surat;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

// Data contoh untuk pengembangan lokal.
//
//   php artisan db:seed                 isi data contoh (hanya jika tabel users masih kosong)
//   php artisan migrate:fresh --seed    KOSONGKAN semua tabel + dokumen upload, lalu isi ulang
//
// Akun contoh (JANGAN dipakai di hosting/produksi):
//   Pengurus RT : ketua.rt   / rt24rahasia
//   Warga       : budi       / warga123
//                 siti       / warga123
//                 ahmad      / warga123
//                 dewi       / warga123
//
// Semua surat contoh memakai prioritas default sistem (Sedang, sumber 'default').
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (User::exists()) {
            $this->command->error('Tabel users sudah berisi data. Jalankan `php artisan migrate:fresh --seed` untuk mengosongkan dan mengisi ulang.');

            return;
        }

        // Tabel kosong: hapus juga dokumen lama yang tersisa di folder upload.
        $disk = Storage::disk('local');
        $disk->delete($disk->files(SuratController::UPLOAD_DIR));

        // ---------- Akun ----------
        $users = [
            ['ketua.rt', 'rt24rahasia', 'rt', 'Agus Setiawan', null, '081200000024', 'Sekretariat RT 24'],
            ['budi', 'warga123', 'warga', 'Budi Santoso', '3273011208900004', '081234567801', 'Jl. Melati No. 12'],
            ['siti', 'warga123', 'warga', 'Siti Aminah', '3273015411920006', '081234567802', 'Jl. Melati No. 12'],
            ['ahmad', 'warga123', 'warga', 'Ahmad Fauzi', '3273011807850002', '081234567803', 'Jl. Mawar No. 08'],
            ['dewi', 'warga123', 'warga', 'Dewi Lestari', '3273016509900009', '081234567804', 'Jl. Anggrek No. 21'],
        ];

        $akun = [];
        foreach ($users as [$username, $password, $role, $nama, $nik, $wa, $alamat]) {
            $akun[$username] = User::create(compact('username', 'password', 'role', 'nama', 'nik', 'wa', 'alamat'));
        }
        $this->command->info('Akun dibuat: ' . count($users));

        // ---------- Surat ----------
        // [username, jenis, keperluan, status, catatan, dibuat (hari lalu), diverifikasi (hari lalu / null)]
        $surat = [
            ['budi', 'Surat Pengantar Nikah', 'Persyaratan administrasi pernikahan di KUA.', 'Ditolak',
                'Alamat pada KTP tidak sesuai dengan wilayah RT 24. Lampirkan bukti domisili.', 20, 18],
            ['budi', 'Surat Keterangan Usaha', 'Pengajuan pinjaman modal usaha kuliner rumahan.', 'Siap Diunduh', null, 12, 10],
            ['budi', 'Surat Pengantar SKCK', 'Persyaratan melamar pekerjaan.', 'Perlu Perbaikan',
                'Foto KTP kurang jelas. Mohon unggah kembali.', 6, 5],
            ['budi', 'Surat Keterangan Domisili', 'Administrasi pembukaan rekening bank.', 'Diproses', null, 3, 2],
            ['dewi', 'Surat Keterangan Tidak Mampu', 'Pengajuan keringanan biaya sekolah anak.', 'Menunggu Verifikasi', null, 2, null],
            ['ahmad', 'Surat Pengantar SKCK', 'Persyaratan melamar pekerjaan.', 'Menunggu Verifikasi', null, 1, null],
            ['siti', 'Surat Keterangan Domisili', 'Administrasi pendaftaran sekolah anak.', 'Menunggu Verifikasi', null, 0, null],
        ];

        DB::transaction(function () use ($surat, $akun, $disk) {
            foreach ($surat as [$username, $jenis, $keperluan, $status, $catatan, $hari, $verif]) {
                $dibuat = now()->subDays($hari)->setTime(9, random_int(0, 59));
                $verifPada = $verif !== null ? now()->subDays($verif)->setTime(14, 10) : null;

                $s = Surat::create([
                    'user_id' => $akun[$username]->id,
                    'jenis' => $jenis,
                    'keperluan' => $keperluan,
                    'status' => $status,
                    'catatan' => $catatan,
                    'diverifikasi_oleh' => $verif !== null ? $akun['ketua.rt']->id : null,
                    'diverifikasi_pada' => $verifPada,
                    'kode_verifikasi' => $status === 'Siap Diunduh' ? Surat::buatKodeVerifikasi() : null,
                    'created_at' => $dibuat,
                    'updated_at' => $verifPada ?? $dibuat,
                ]);
                $s->no_pengajuan = sprintf('SRT-%s-%03d', $dibuat->format('Y'), $s->id);
                $s->timestamps = false;
                $s->save();

                $nama = $akun[$username]->nama;
                $dokumen = [
                    'KTP_' . str_replace(' ', '_', $nama) . '.pdf' => 'KTP ' . $nama,
                    'Kartu_Keluarga.pdf' => 'Kartu Keluarga ' . $nama,
                ];
                foreach ($dokumen as $asli => $judul) {
                    $isi = $this->pdfContoh('CONTOH - ' . $judul);
                    $file = bin2hex(random_bytes(16)) . '.pdf';
                    $disk->put(SuratController::UPLOAD_DIR . '/' . $file, $isi);
                    $s->dokumen()->create([
                        'nama_asli' => $asli,
                        'nama_file' => $file,
                        'mime' => 'application/pdf',
                        'ukuran' => strlen($isi),
                        'created_at' => $dibuat,
                    ]);
                }
            }
        });

        $this->command->info('Surat contoh dibuat: ' . count($surat) . ' (masing-masing 2 dokumen)');

        $this->kasContoh($akun['ketua.rt']->id);
    }

    // Data kas contoh (nama fiktif). Data asli diimpor dari Excel: php artisan sawarga:impor-kas "file.xlsx" --hapus
    private function kasContoh(int $rtId): void
    {
        $th = (int) now()->year;
        $rumah = [
            ['A1 No. 01', 'Bpk Andi Wijaya', 30000, 'Ada'],
            ['A1 No. 02', 'Ibu Rina Kurnia', 30000, 'Ada'],
            ['A1 No. 03', 'Bpk Hendra Saputra', 30000, 'Visit'],
            ['A2 No. 01', 'Bpk Joko Prasetyo', 30000, 'Ada'],
            ['A2 No. 02', null, 30000, 'Rumah Kosong'],
            ['B1 No. 05', 'Ibu Lina Marlina', 20000, 'Ada'],
            ['B1 No. 06', 'Bpk Rudi Hartono', 30000, 'Pengurus'],
            ['C1 No. 01', 'Toko Berkah', 50000, 'Ruko'],
        ];

        DB::transaction(function () use ($th, $rumah, $rtId) {
            $w = [];
            foreach ($rumah as [$no, $nama, $nominal, $ket]) {
                $w[] = KasWarga::create(['no_rumah' => $no, 'nama' => $nama, 'nominal_iuran' => $nominal, 'keterangan' => $ket]);
            }

            // [rumah, tanggal bayar (bulan-hari), bulan yang dibayar, metode, catatan]
            $bayar = [
                [0, '01-05', [1, 2, 3], 'Transfer', 'Bulan Jan - Mar'],
                [1, '01-10', [1], 'Tunai', null],
                [3, '01-12', [1, 2, 3, 4, 5, 6], 'Transfer', 'Bulan Jan - Jun'],
                [5, '02-03', [1, 2], 'Tunai', null],
                [1, '02-08', [2], 'Tunai', null],
                [7, '02-15', [1, 2, 3], 'Transfer', null],
                [0, '04-04', [4, 5, 6], 'Transfer', 'Bulan Apr - Jun'],
                [1, '03-09', [3], 'Tunai', null],
                [2, '03-20', [1, 2, 3], 'Tunai', null],
                [6, '03-21', [1, 2, 3, 4], 'Tunai', null],
            ];
            foreach ($bayar as [$i, $tgl, $bulan, $metode, $catatan]) {
                $iuran = KasIuran::create([
                    'tanggal' => "$th-$tgl",
                    'kas_warga_id' => $w[$i]->id,
                    'total' => $w[$i]->nominal_iuran * count($bulan),
                    'metode' => $metode,
                    'catatan' => $catatan,
                    'dicatat_oleh' => $rtId,
                ]);
                foreach ($bulan as $b) {
                    KasIuranBulan::create([
                        'kas_iuran_id' => $iuran->id, 'kas_warga_id' => $w[$i]->id,
                        'tahun' => $th, 'bulan' => $b, 'nominal' => $w[$i]->nominal_iuran,
                    ]);
                }
            }
            KasIuran::create([
                'tanggal' => "$th-01-31", 'uraian' => 'Setoran iuran tunai Blok A-C Januari-Maret (kolektor)',
                'total' => 3200000, 'metode' => 'Tunai', 'dicatat_oleh' => $rtId,
            ]);

            // [tanggal, kategori, peruntukan, uraian, nominal, dibayar kepada]
            $keluar = [
                ['01-07', 'Keamanan', 'Gaji Satpam', 'Gaji keamanan Januari', 750000, 'Petugas keamanan'],
                ['01-15', 'Sampah', null, 'Retribusi sampah DLHK', 375000, 'DLHK'],
                ['01-20', 'Listrik/Fasilitas', 'Token Listrik', 'Token listrik pos satpam', 50000, null],
                ['02-07', 'Keamanan', 'Gaji Satpam', 'Gaji keamanan Februari', 750000, 'Petugas keamanan'],
                ['02-11', 'Kas Sosial', 'Dana Sosial Warga Sakit', 'Menjenguk warga sakit', 100000, null],
                ['02-15', 'Sampah', null, 'Retribusi sampah DLHK', 375000, 'DLHK'],
                ['03-02', 'Acara Warga', 'Rapat Rutin', 'Konsumsi rapat warga', 120000, null],
                ['03-07', 'Keamanan', 'Gaji Satpam', 'Gaji keamanan Maret', 750000, 'Petugas keamanan'],
                ['03-25', 'Administrasi', 'Honor Pengurus', 'Honor RT', 200000, 'Ketua RT'],
            ];
            foreach ($keluar as [$tgl, $kat, $per, $uraian, $nominal, $kepada]) {
                KasPengeluaran::create([
                    'tanggal' => "$th-$tgl", 'kategori' => $kat, 'peruntukan' => $per, 'uraian' => $uraian,
                    'nominal' => $nominal, 'dibayar_kepada' => $kepada, 'dicatat_oleh' => $rtId,
                ]);
            }
        });

        $this->command->info('Kas contoh dibuat: ' . count($rumah) . ' rumah');
    }

    // PDF kecil sebagai pengganti dokumen KTP/KK asli.
    private function pdfContoh(string $judul): string
    {
        $teks = 'BT /F1 18 Tf 72 720 Td (' . str_replace(['(', ')'], '', $judul) . ') Tj ET';
        $objs = [
            '<< /Type /Catalog /Pages 2 0 R >>',
            '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
            '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
            '<< /Length ' . strlen($teks) . " >>\nstream\n$teks\nendstream",
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
        ];
        $pdf = "%PDF-1.4\n";
        $off = [];
        foreach ($objs as $i => $o) {
            $off[] = strlen($pdf);
            $pdf .= ($i + 1) . " 0 obj\n$o\nendobj\n";
        }
        $xref = strlen($pdf);
        $pdf .= "xref\n0 " . (count($objs) + 1) . "\n0000000000 65535 f \n";
        foreach ($off as $o) {
            $pdf .= sprintf("%010d 00000 n \n", $o);
        }

        return $pdf . "trailer\n<< /Size " . (count($objs) + 1) . " /Root 1 0 R >>\nstartxref\n$xref\n%%EOF\n";
    }
}
