<?php

namespace App\Http\Controllers;

use App\Models\KasIuran;
use App\Models\KasIuranBulan;
use App\Models\KasPengeluaran;
use App\Models\KasWarga;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

// Menu Kas Warga (khusus pengurus RT). Isinya mengikuti sheet "Laporan Keuangan RT":
// Rekap, Input Iuran, Pelaporan Iuran, Pengeluaran, Data Warga.
// Ceklis Pelaporan Iuran hanya berasal dari pembayaran yang dicatat di Input Iuran.
class KasController extends Controller
{
    private const BULAN = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    // GET /api/kas?tahun=2026 - semua data yang dibutuhkan tampilan untuk satu tahun laporan.
    public function index(Request $request): JsonResponse
    {
        $this->rtSaja($request);
        $tahun = $this->tahun($request->query('tahun'));

        $warga = KasWarga::orderBy('no_rumah')->orderBy('id')->get();

        $iuran = KasIuran::with(['warga', 'bulan'])
            ->whereYear('tanggal', $tahun)
            ->orderByDesc('tanggal')->orderByDesc('id')
            ->get()
            ->map(fn (KasIuran $i) => [
                'id' => $i->id,
                'tanggal' => $i->tanggal->toDateString(),
                'warga_id' => $i->kas_warga_id,
                'no_rumah' => $i->warga?->no_rumah,
                'nama' => $i->warga?->nama,
                'uraian' => $i->uraian,
                'bulan' => $i->bulan->map(fn ($b) => [$b->tahun, $b->bulan])->all(),
                'total' => $i->total,
                'metode' => $i->metode,
                'catatan' => $i->catatan,
            ]);

        // Ceklis dari Input Iuran: { warga_id: { bulan: nominal } } untuk tahun laporan.
        $bayar = [];
        foreach (KasIuranBulan::where('tahun', $tahun)->get(['kas_warga_id', 'bulan', 'nominal']) as $b) {
            $bayar[$b->kas_warga_id][$b->bulan] = ($bayar[$b->kas_warga_id][$b->bulan] ?? 0) + $b->nominal;
        }

        $pengeluaran = KasPengeluaran::whereYear('tanggal', $tahun)
            ->orderByDesc('tanggal')->orderByDesc('id')
            ->get()
            ->map(fn (KasPengeluaran $p) => [
                'id' => $p->id,
                'tanggal' => $p->tanggal->toDateString(),
                'kategori' => $p->kategori,
                'peruntukan' => $p->peruntukan,
                'uraian' => $p->uraian,
                'nominal' => $p->nominal,
                'dibayar_kepada' => $p->dibayar_kepada,
            ]);

        // Rekap per bulan berdasarkan tanggal transaksi.
        $masuk = KasIuran::whereYear('tanggal', $tahun)
            ->selectRaw('MONTH(tanggal) b, SUM(total) n')->groupBy('b')->pluck('n', 'b');
        $keluar = KasPengeluaran::whereYear('tanggal', $tahun)
            ->selectRaw('MONTH(tanggal) b, SUM(nominal) n')->groupBy('b')->pluck('n', 'b');
        $rekap = [];
        for ($m = 1; $m <= 12; $m++) {
            $rekap[] = ['bulan' => $m, 'masuk' => (int) ($masuk[$m] ?? 0), 'keluar' => (int) ($keluar[$m] ?? 0)];
        }
        $awalTahun = Carbon::create($tahun, 1, 1)->toDateString();
        $saldoAwal = (int) KasIuran::where('tanggal', '<', $awalTahun)->sum('total')
            - (int) KasPengeluaran::where('tanggal', '<', $awalTahun)->sum('nominal');

        return $this->ok([
            'tahun' => $tahun,
            'tahun_list' => $this->daftarTahun(),
            'saldo_awal' => $saldoAwal,
            'saldo_total' => (int) KasIuran::sum('total') - (int) KasPengeluaran::sum('nominal'),
            'rekap' => $rekap,
            'warga' => $warga->map(fn (KasWarga $w) => [
                'id' => $w->id,
                'no_rumah' => $w->no_rumah,
                'nama' => $w->nama,
                'nominal' => $w->nominal_iuran,
                'keterangan' => $w->keterangan,
            ]),
            'iuran' => $iuran,
            'bayar' => (object) $bayar,
            'pengeluaran' => $pengeluaran,
            'kategori' => KasPengeluaran::KATEGORI,
            'keterangan' => KasWarga::KETERANGAN,
            'metode' => KasIuran::METODE,
        ]);
    }

    // POST /api/kas/warga - tambah (tanpa id) atau ubah (dengan id) data rumah.
    public function simpanWarga(Request $request): JsonResponse
    {
        $this->rtSaja($request);
        $noRumah = $this->teks($request->input('no_rumah'), 40);
        $nama = $this->teks($request->input('nama'), 100);
        $nominal = $this->angka($request->input('nominal'));
        $ket = $this->teks($request->input('keterangan'), 40);

        if ($noRumah === '') {
            $this->fail('Blok / No. Rumah wajib diisi.');
        }
        if ($nominal < 0 || $nominal > 10000000) {
            $this->fail('Nominal iuran tidak valid.');
        }

        $warga = $request->filled('id') ? KasWarga::find((int) $request->input('id')) : new KasWarga;
        if (! $warga) {
            $this->fail('Data rumah tidak ditemukan.', 404);
        }
        $dobel = KasWarga::where('no_rumah', $noRumah)->where('nama', $nama ?: null)
            ->when($warga->exists, fn ($q) => $q->whereKeyNot($warga->id))->exists();
        if ($dobel) {
            $this->fail('Rumah dan nama tersebut sudah ada di Data Warga.');
        }

        $warga->fill([
            'no_rumah' => $noRumah,
            'nama' => $nama ?: null,
            'nominal_iuran' => $nominal,
            'keterangan' => $ket ?: null,
        ])->save();

        return $this->ok(['id' => $warga->id]);
    }

    // POST /api/kas/warga/hapus
    public function hapusWarga(Request $request): JsonResponse
    {
        $this->rtSaja($request);
        $warga = KasWarga::find((int) $request->input('id'));
        if (! $warga) {
            $this->fail('Data rumah tidak ditemukan.', 404);
        }
        if ($warga->iuran()->exists() || KasIuranBulan::where('kas_warga_id', $warga->id)->exists()) {
            $this->fail('Rumah ini sudah punya riwayat pembayaran. Hapus dulu pembayarannya di Input Iuran.');
        }
        $warga->delete();

        return $this->ok();
    }

    // POST /api/kas/iuran - catat pembayaran.
    //   Per rumah   : warga_id + bulan [[tahun, bulan], ...]
    //   Gabungan    : tanpa warga_id, isi uraian (contoh "Iuran Warga Agus-Okt")
    public function simpanIuran(Request $request): JsonResponse
    {
        $user = $this->rtSaja($request);
        $tanggal = $this->tanggal($request->input('tanggal'));
        $total = $this->angka($request->input('total'));
        $metode = in_array($request->input('metode'), KasIuran::METODE, true) ? $request->input('metode') : 'Tunai';
        $catatan = $this->teks($request->input('catatan'), 255);
        $uraian = $this->teks($request->input('uraian'), 150);

        if ($total < 1 || $total > 1000000000) {
            $this->fail('Total bayar harus lebih dari 0.');
        }

        $warga = null;
        $bulan = [];
        if ($request->filled('warga_id')) {
            $warga = KasWarga::find((int) $request->input('warga_id'));
            if (! $warga) {
                $this->fail('Rumah tidak ditemukan di Data Warga.');
            }
            foreach ((array) $request->input('bulan', []) as $b) {
                $t = (int) ($b[0] ?? 0);
                $m = (int) ($b[1] ?? 0);
                if ($t < 2000 || $t > 2100 || $m < 1 || $m > 12) {
                    $this->fail('Bulan pembayaran tidak valid.');
                }
                $bulan[$t * 100 + $m] = [$t, $m];
            }
            if (! $bulan) {
                $this->fail('Pilih minimal satu bulan yang dibayar.');
            }
            if (count($bulan) > 36) {
                $this->fail('Maksimal 36 bulan dalam satu pembayaran.');
            }
            $sudah = KasIuranBulan::where('kas_warga_id', $warga->id)
                ->where(function ($q) use ($bulan) {
                    foreach ($bulan as [$t, $m]) {
                        $q->orWhere(fn ($w) => $w->where('tahun', $t)->where('bulan', $m));
                    }
                })->first();
            if ($sudah) {
                $this->fail('Iuran ' . self::BULAN[$sudah->bulan] . ' ' . $sudah->tahun . ' untuk rumah ini sudah tercatat.');
            }
        } elseif ($uraian === '') {
            $this->fail('Pilih rumah, atau isi uraian untuk setoran gabungan.');
        }

        $iuran = DB::transaction(function () use ($tanggal, $warga, $uraian, $total, $metode, $catatan, $user, $bulan) {
            $iuran = KasIuran::create([
                'tanggal' => $tanggal,
                'kas_warga_id' => $warga?->id,
                'uraian' => $warga ? null : $uraian,
                'total' => $total,
                'metode' => $metode,
                'catatan' => $catatan ?: null,
                'dicatat_oleh' => $user->id,
            ]);
            foreach ($bulan as [$t, $m]) {
                KasIuranBulan::create([
                    'kas_iuran_id' => $iuran->id,
                    'kas_warga_id' => $warga->id,
                    'tahun' => $t,
                    'bulan' => $m,
                    'nominal' => $warga->nominal_iuran,
                ]);
            }

            return $iuran;
        });

        return $this->ok(['id' => $iuran->id]);
    }

    // POST /api/kas/iuran/hapus - ceklis bulan yang terkait ikut terhapus.
    public function hapusIuran(Request $request): JsonResponse
    {
        $this->rtSaja($request);
        $iuran = KasIuran::find((int) $request->input('id'));
        if (! $iuran) {
            $this->fail('Data pembayaran tidak ditemukan.', 404);
        }
        $iuran->delete();

        return $this->ok();
    }

    // POST /api/kas/pengeluaran - tambah (tanpa id) atau ubah (dengan id).
    public function simpanPengeluaran(Request $request): JsonResponse
    {
        $user = $this->rtSaja($request);
        $tanggal = $this->tanggal($request->input('tanggal'));
        $kategori = $request->input('kategori');
        $uraian = $this->teks($request->input('uraian'), 200);
        $nominal = $this->angka($request->input('nominal'));

        if (! in_array($kategori, KasPengeluaran::KATEGORI, true)) {
            $this->fail('Pilih kategori pengeluaran.');
        }
        if ($uraian === '') {
            $this->fail('Uraian pengeluaran wajib diisi.');
        }
        if ($nominal < 1 || $nominal > 1000000000) {
            $this->fail('Nominal harus lebih dari 0.');
        }

        $p = $request->filled('id') ? KasPengeluaran::find((int) $request->input('id')) : new KasPengeluaran;
        if (! $p) {
            $this->fail('Data pengeluaran tidak ditemukan.', 404);
        }
        $p->fill([
            'tanggal' => $tanggal,
            'kategori' => $kategori,
            'peruntukan' => $this->teks($request->input('peruntukan'), 100) ?: null,
            'uraian' => $uraian,
            'nominal' => $nominal,
            'dibayar_kepada' => $this->teks($request->input('dibayar_kepada'), 100) ?: null,
        ]);
        if (! $p->exists) {
            $p->dicatat_oleh = $user->id;
        }
        $p->save();

        return $this->ok(['id' => $p->id]);
    }

    // POST /api/kas/pengeluaran/hapus
    public function hapusPengeluaran(Request $request): JsonResponse
    {
        $this->rtSaja($request);
        $p = KasPengeluaran::find((int) $request->input('id'));
        if (! $p) {
            $this->fail('Data pengeluaran tidak ditemukan.', 404);
        }
        $p->delete();

        return $this->ok();
    }

    private function rtSaja(Request $request)
    {
        $user = $request->user();
        if (! $user->isRt()) {
            $this->fail('Menu kas hanya untuk pengurus RT.', 403);
        }

        return $user;
    }

    private function tahun($v): int
    {
        $t = (int) $v;

        return $t >= 2000 && $t <= 2100 ? $t : (int) now()->year;
    }

    private function daftarTahun(): array
    {
        $t = collect([(int) now()->year])
            ->merge(KasIuran::selectRaw('DISTINCT YEAR(tanggal) t')->pluck('t'))
            ->merge(KasIuranBulan::distinct()->pluck('tahun'))
            ->merge(KasPengeluaran::selectRaw('DISTINCT YEAR(tanggal) t')->pluck('t'))
            ->map(fn ($x) => (int) $x)->unique()->sort()->values();

        return $t->push($t->last() + 1)->all();
    }

    private function tanggal($v): string
    {
        if (! is_string($v) || ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $v) || ! checkdate((int) substr($v, 5, 2), (int) substr($v, 8, 2), (int) substr($v, 0, 4))) {
            $this->fail('Tanggal wajib diisi dengan benar.');
        }

        return $v;
    }

    private function teks($v, int $max): string
    {
        return mb_substr(trim(preg_replace('/\s+/u', ' ', (string) $v)), 0, $max);
    }

    private function angka($v): int
    {
        return is_numeric($v) ? (int) round((float) $v) : -1;
    }
}
