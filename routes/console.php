<?php

use App\Models\KasIuran;
use App\Models\KasIuranBulan;
use App\Models\KasPengeluaran;
use App\Models\KasWarga;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

// Membuat atau mengganti password akun pengurus RT.
// Pemakaian: php artisan sawarga:buat-rt ketua.rt "Nama Ketua RT"
Artisan::command('sawarga:buat-rt {username} {nama=Ketua RT 24}', function (string $username, string $nama) {
    $username = strtolower(trim($username));
    if (! preg_match('/^[a-z0-9._]{4,20}$/', $username)) {
        $this->error('Username 4-20 karakter: huruf kecil, angka, titik, atau garis bawah.');

        return 1;
    }

    // Password diketik saat diminta (tidak muncul di layar maupun riwayat terminal).
    $password = (string) $this->secret('Password (min. 8 karakter)');
    if (strlen($password) < 8) {
        $this->error('Password minimal 8 karakter.');

        return 1;
    }

    $user = User::where('username', $username)->first();
    if ($user && $user->role !== 'rt') {
        $this->error("Username '$username' sudah dipakai akun warga.");

        return 1;
    }

    if ($user) {
        $user->update(['password' => $password, 'nama' => $nama]);
        $this->info("Password akun pengurus '$username' diperbarui.");
    } else {
        User::create(['username' => $username, 'password' => $password, 'role' => 'rt', 'nama' => $nama]);
        $this->info("Akun pengurus '$username' dibuat.");
    }

    return 0;
})->purpose('Membuat atau mengganti password akun pengurus RT');

// Impor data kas dari file Excel "Laporan Keuangan RT" (sheet Data Warga, Input Iuran, Pengeluaran).
// Sheet Data Iuran Warga (ceklis manual) tidak diimpor: ceklis hanya berasal dari Input Iuran,
// sama seperti rumus sheet Pelaporan Iuran di Excel.
// Data hanya masuk ke database lokal, tidak ikut tersimpan di repositori.
// Pemakaian: php artisan sawarga:impor-kas "C:\path\Laporan Keuangan RT.xlsx" [--hapus]
Artisan::command('sawarga:impor-kas {file} {--hapus : Kosongkan data kas lama sebelum impor}', function (string $file) {
    if (! is_file($file)) {
        $this->error("File tidak ditemukan: $file");

        return 1;
    }
    if (KasWarga::exists() && ! $this->option('hapus')) {
        $this->error('Data kas sudah ada. Tambahkan --hapus untuk mengosongkan data kas lama lalu impor ulang.');

        return 1;
    }

    try {
        $wb = bacaXlsx($file);
    } catch (Throwable $e) {
        $this->error('File Excel tidak dapat dibaca: ' . $e->getMessage());

        return 1;
    }
    foreach (['Data Warga', 'Input Iuran', 'Pengeluaran'] as $s) {
        if (! isset($wb[$s])) {
            $this->error("Sheet \"$s\" tidak ada di file ini.");

            return 1;
        }
    }

    $teks = fn ($v) => trim(preg_replace('/\s+/u', ' ', (string) $v));
    $kunci = fn ($v) => mb_strtolower(str_replace(' ', '', (string) $v));
    $tgl = fn ($v) => is_numeric($v) ? Carbon::create(1899, 12, 30)->addDays((int) $v)->toDateString() : null;
    $tahunDari = fn ($v, $def) => preg_match('/(20\d\d)/', (string) $v, $m) ? (int) $m[1] : $def;
    $rtId = User::where('role', 'rt')->value('id');
    $hasil = ['warga' => 0, 'iuran' => 0, 'bulan' => 0, 'pengeluaran' => 0];
    $lewat = [];

    DB::transaction(function () use ($wb, $teks, $kunci, $tgl, $tahunDari, $rtId, &$hasil, &$lewat) {
        if ($this->option('hapus')) {
            foreach (['kas_iuran_bulan', 'kas_iuran', 'kas_pengeluaran', 'kas_warga'] as $t) {
                DB::table($t)->delete();
            }
        }

        // 1. Data Warga (mulai baris 5: B rumah, C nama, D nominal, E keterangan).
        $byRumah = [];
        foreach ($wb['Data Warga']['rows'] as $r => $c) {
            if ($r < 5 || $teks($c['B'] ?? '') === '') {
                continue;
            }
            $w = KasWarga::create([
                'no_rumah' => mb_substr($teks($c['B']), 0, 40),
                'nama' => mb_substr($teks($c['C'] ?? ''), 0, 100) ?: null,
                'nominal_iuran' => is_numeric($c['D'] ?? null) ? (int) $c['D'] : 30000,
                'keterangan' => mb_substr($teks($c['E'] ?? ''), 0, 40) ?: null,
            ]);
            $byRumah[$kunci($w->no_rumah)][] = $w;
            $hasil['warga']++;
        }

        // 2. Input Iuran. Satu pembayaran bisa beberapa baris (satu baris per bulan);
        //    total bayar (kolom K) hanya ada di baris pertama.
        $sh = $wb['Input Iuran']['rows'];
        $th1 = $tahunDari($sh[4]['B'] ?? '', (int) now()->year);
        $th2 = $tahunDari($sh[4]['C'] ?? '', $th1 + 1);
        $cur = null;
        $sudah = [];
        foreach ($sh as $r => $c) {
            $tanggal = $r >= 5 ? $tgl($c['A'] ?? null) : null;
            if (! $tanggal) {
                continue;
            }
            $g = $teks($c['G'] ?? '');
            $nama = $teks($c['H'] ?? '');
            $calon = $byRumah[$kunci($g)] ?? [];
            $warga = collect($calon)->first(fn ($w) => $nama !== '' && $kunci($w->nama) === $kunci($nama)) ?? ($calon[0] ?? null);
            $total = is_numeric($c['K'] ?? null) ? (int) $c['K'] : 0;

            $lanjut = $cur && $total === 0 && $cur['g'] === $g && $cur['tgl'] === $tanggal;
            if (! $lanjut) {
                $iuran = KasIuran::create([
                    'tanggal' => $tanggal,
                    'kas_warga_id' => $warga?->id,
                    'uraian' => $warga ? null : (mb_substr($g, 0, 150) ?: 'Iuran warga'),
                    'total' => $total,
                    'metode' => str_starts_with(strtolower($teks($c['M'] ?? '')), 'transfer') ? 'Transfer' : 'Tunai',
                    'catatan' => mb_substr($teks($c['N'] ?? ''), 0, 255) ?: null,
                    'dicatat_oleh' => $rtId,
                ]);
                $cur = ['id' => $iuran->id, 'g' => $g, 'tgl' => $tanggal];
                $hasil['iuran']++;
            }
            if (! $warga) {
                continue;
            }
            foreach ([['B', 'I', $th1], ['C', 'J', $th2]] as [$kb, $kn, $th]) {
                $bl = $c[$kb] ?? null;
                if (! is_numeric($bl) || $bl < 1 || $bl > 12) {
                    continue;
                }
                $k = $warga->id . '-' . $th . '-' . (int) $bl;
                if (isset($sudah[$k])) {
                    $lewat[] = "Input Iuran baris $r: bulan $bl/$th untuk {$warga->no_rumah} tercatat dua kali, dilewati.";

                    continue;
                }
                $sudah[$k] = true;
                KasIuranBulan::create([
                    'kas_iuran_id' => $cur['id'],
                    'kas_warga_id' => $warga->id,
                    'tahun' => $th,
                    'bulan' => (int) $bl,
                    'nominal' => is_numeric($c[$kn] ?? null) ? (int) $c[$kn] : $warga->nominal_iuran,
                ]);
                $hasil['bulan']++;
            }
        }

        // 3. Pengeluaran. Baris lanjutan (kategori kosong, tanggal sama) ikut kategori baris sebelumnya.
        $prev = null;
        foreach ($wb['Pengeluaran']['rows'] as $r => $c) {
            $tanggal = $r >= 5 ? $tgl($c['A'] ?? null) : null;
            if (! $tanggal || ! is_numeric($c['G'] ?? null) || (int) $c['G'] <= 0) {
                continue;
            }
            $kat = $teks($c['D'] ?? '');
            $per = $teks($c['E'] ?? '');
            if ($kat === '' && $prev && $prev['tgl'] === $tanggal) {
                $kat = $prev['kat'];
                $per = $per ?: $prev['per'];
            }
            if (! in_array($kat, KasPengeluaran::KATEGORI, true)) {
                $kat = 'Lainnya';
            }
            // Kolom H kadang berisi rumus subtotal, bukan nama penerima.
            $h = $c['H'] ?? '';
            $kepada = isset($wb['Pengeluaran']['rumus']["H$r"]) || is_numeric($h) ? '' : $teks($h);
            KasPengeluaran::create([
                'tanggal' => $tanggal,
                'kategori' => $kat,
                'peruntukan' => mb_substr($per, 0, 100) ?: null,
                'uraian' => mb_substr($teks($c['F'] ?? '') ?: ($per ?: '-'), 0, 200),
                'nominal' => (int) $c['G'],
                'dibayar_kepada' => mb_substr($kepada, 0, 100) ?: null,
                'dicatat_oleh' => $rtId,
            ]);
            $prev = ['tgl' => $tanggal, 'kat' => $kat, 'per' => $per];
            $hasil['pengeluaran']++;
        }
    });

    foreach ($lewat as $l) {
        $this->warn($l);
    }
    $this->info("Impor selesai: {$hasil['warga']} rumah, {$hasil['iuran']} pembayaran ({$hasil['bulan']} bulan), "
        . "{$hasil['pengeluaran']} pengeluaran.");

    return 0;
})->purpose('Impor data kas dari file Excel Laporan Keuangan RT');

// Baca isi .xlsx tanpa library tambahan: [nama sheet => ['rows' => [baris => [kolom => nilai]], 'rumus' => [sel => true]]].
// Untuk sel berumus, yang dipakai adalah nilai hasil hitung terakhir yang tersimpan di file.
function bacaXlsx(string $file): array
{
    $zip = new ZipArchive;
    if ($zip->open($file) !== true) {
        throw new RuntimeException('bukan file .xlsx yang valid');
    }
    $xml = function (string $path) use ($zip) {
        $isi = $zip->getFromName($path);

        return $isi === false ? null : simplexml_load_string($isi);
    };

    $teks = [];
    if ($ss = $xml('xl/sharedStrings.xml')) {
        foreach ($ss->si as $si) {
            $s = '';
            foreach ($si->xpath('.//*[local-name()="t"]') as $t) {
                $s .= (string) $t;
            }
            $teks[] = $s;
        }
    }

    $rel = [];
    foreach ($xml('xl/_rels/workbook.xml.rels')->Relationship as $r) {
        $rel[(string) $r['Id']] = ltrim(preg_replace('#^/?xl/#', '', (string) $r['Target']), '/');
    }

    $hasil = [];
    foreach ($xml('xl/workbook.xml')->sheets->sheet as $s) {
        $rid = (string) $s->attributes('http://schemas.openxmlformats.org/officeDocument/2006/relationships')['id'];
        $sh = $xml('xl/' . $rel[$rid]);
        $rows = [];
        $rumus = [];
        foreach ($sh->sheetData->row ?? [] as $row) {
            foreach ($row->c as $c) {
                if (! preg_match('/^([A-Z]+)(\d+)$/', (string) $c['r'], $m)) {
                    continue;
                }
                $v = isset($c->v) ? (string) $c->v : null;
                if ((string) $c['t'] === 's' && $v !== null) {
                    $v = $teks[(int) $v] ?? '';
                } elseif ((string) $c['t'] === 'inlineStr') {
                    $v = (string) ($c->is->t ?? '');
                }
                if (isset($c->f)) {
                    $rumus[$m[1] . $m[2]] = true;
                }
                if ($v !== null && $v !== '') {
                    $rows[(int) $m[2]][$m[1]] = $v;
                }
            }
        }
        ksort($rows);
        $hasil[(string) $s['name']] = ['rows' => $rows, 'rumus' => $rumus];
    }
    $zip->close();

    return $hasil;
}
