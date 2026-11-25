<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <meta name="theme-color" content="#0f172a">
    <title>Verifikasi Surat | SaWarga 24</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Warna sama dengan public/css/style.css (kartu datar, garis tepi tipis, tanpa shadow). */
        :root {
            --bg: #f8fafc; --card: #fff; --ink: #0f172a; --mut: #64748b; --line: #e5e9f0;
            --blue: #1d5ff5; --ok: #059669; --okS: #e7f8f0; --bad: #e11d48; --badS: #e11d4814;
        }
        @media (prefers-color-scheme: dark) {
            :root {
                color-scheme: dark;
                --bg: #0b1220; --card: #131c2e; --ink: #f1f5f9; --mut: #94a3b8; --line: #243049;
                --okS: #10372c; --badS: #e11d4824;
            }
        }
        *, *:before, *:after { box-sizing: border-box; }
        body {
            margin: 0; min-height: 100vh; display: flex; flex-direction: column; align-items: center;
            justify-content: center; gap: 20px; padding: 32px 16px;
            background: var(--bg); color: var(--ink); font: 15px/1.5 Inter, system-ui, sans-serif;
        }
        .logo { display: flex; gap: 12px; align-items: center; width: 100%; max-width: 520px; }
        .logo i {
            width: 44px; height: 44px; border-radius: 12px; background: var(--blue);
            display: grid; place-items: center; color: #fff;
        }
        .logo svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .logo b { display: block; font-size: 16px; }
        .logo b em { color: var(--blue); font-style: normal; }
        .logo small { display: block; color: var(--mut); font-size: 12px; }
        .card {
            width: 100%; max-width: 520px; background: var(--card);
            border: 1px solid var(--line); border-radius: 18px; padding: 28px;
        }
        .tag {
            display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 99px;
            font-size: 13px; font-weight: 600;
        }
        .tag svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
        .tag.g { background: var(--okS); color: var(--ok); }
        .tag.r { background: var(--badS); color: var(--bad); }
        h1 { font-size: 20px; margin: 16px 0 6px; }
        p { color: var(--mut); margin: 0; font-size: 14px; }
        dl { display: grid; grid-template-columns: 150px 1fr; margin: 22px 0 0; border-top: 1px solid var(--line); }
        dt, dd { padding: 12px 0; border-bottom: 1px solid var(--line); font-size: 14px; }
        dt { color: var(--mut); }
        dd { margin: 0; font-weight: 500; }
        .mono { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 13px; }
        .foot { color: var(--mut); font-size: 12px; text-align: center; }
        @media (max-width: 480px) {
            .card { padding: 22px; }
            dl { grid-template-columns: 1fr; }
            dt { padding-bottom: 0; border-bottom: 0; font-size: 12px; }
            dd { padding-top: 2px; }
        }
    </style>
</head>
<body>
    <div class="logo">
        <i><svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg></i>
        <div><b>SaWarga <em>24</em></b><small>Verifikasi keaslian surat</small></div>
    </div>

    <div class="card">
        @if ($surat)
            <span class="tag g"><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>Surat sah</span>
            <h1>{{ $surat->jenis }}</h1>
            <p>Surat ini benar diterbitkan dan ditandatangani secara elektronik oleh pengurus RT 24 / RW 03 melalui SaWarga 24.</p>
            <dl>
                <dt>Nomor pengajuan</dt><dd class="mono">{{ $surat->no_pengajuan }}</dd>
                <dt>Nama pemohon</dt><dd>{{ $surat->user->nama }}</dd>
                <dt>NIK</dt><dd class="mono">{{ $surat->user->nik ? substr($surat->user->nik, 0, 6) . str_repeat('*', 6) . substr($surat->user->nik, -4) : '—' }}</dd>
                <dt>Ditandatangani oleh</dt><dd>{{ $surat->verifikator?->nama ?? 'Ketua RT 24' }}</dd>
                <dt>Tanggal disetujui</dt><dd>{{ $surat->diverifikasi_pada?->translatedFormat('d F Y, H.i') }} WIB</dd>
            </dl>
        @else
            <span class="tag r"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>Tidak ditemukan</span>
            <h1>Surat tidak dapat diverifikasi</h1>
            <p>Kode verifikasi tidak dikenal atau surat sudah dibatalkan. Hubungi pengurus RT 24 untuk memastikan keaslian surat.</p>
        @endif
    </div>

    <div class="foot">SaWarga 24 &middot; RT 24 / RW 03 Quanta 2 Kuningan</div>
</body>
</html>
