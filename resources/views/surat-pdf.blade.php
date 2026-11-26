<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>{{ $surat->jenis }} - {{ $surat->no_pengajuan }}</title>
    <style>
        @page { margin: 2.2cm 2.5cm; }
        body { font-family: "DejaVu Sans", sans-serif; font-size: 11.5pt; line-height: 1.6; color: #0f172a; }
        .kop { text-align: center; border-bottom: 1.5px solid #0f172a; padding-bottom: 12px; }
        .kop b { display: block; }
        .kop .rt { font-size: 15pt; }
        .kop small { display: block; color: #64748b; font-size: 9.5pt; }
        .jd { text-align: center; margin: 26px 0 20px; }
        .jd b { display: block; text-decoration: underline; }
        p { margin: 12px 0; text-align: justify; }
        table.data { margin: 10px 0 10px 18px; border-collapse: collapse; }
        table.data td { padding: 3px 0; vertical-align: top; }
        table.data td.k { width: 110px; color: #64748b; font-size: 10pt; }
        /* Blok tanda tangan di sisi kanan, isinya rata tengah. */
        .ttd { margin-top: 30px; margin-left: auto; width: 240px; text-align: center; }
        /* Ruang kosong untuk tanda tangan basah (QR tanda tangan elektronik dinonaktifkan sementara). */
        .ttd .kosong { height: 70px; }
        .ttd u { font-weight: bold; }
    </style>
</head>
<body>
    <div class="kop">
        <b class="rt">RUKUN TETANGGA 24</b>
        <b>RUKUN WARGA 03, KELURAHAN SUKAMAJU</b>
        <small>Kecamatan Sukasari, Kota Bandung</small>
    </div>

    <div class="jd">
        <b>{{ mb_strtoupper($surat->jenis) }}</b>
        <span>Nomor: {{ $nomor }}</span>
    </div>

    <p>Yang bertanda tangan di bawah ini, Ketua RT 24 RW 03 Kelurahan Sukamaju, menerangkan bahwa:</p>

    <table class="data">
        <tr><td class="k">Nama</td><td>: {{ $surat->user->nama }}</td></tr>
        <tr><td class="k">NIK</td><td>: {{ $surat->user->nik ?? '—' }}</td></tr>
        <tr><td class="k">Alamat</td><td>: {{ $surat->user->alamat ?? '—' }}, RT 24/RW 03</td></tr>
        <tr><td class="k">Keperluan</td><td>: {{ $surat->keperluan }}</td></tr>
    </table>

    <p>
        @if (str_contains($surat->jenis, 'Usaha'))
            Benar merupakan warga kami dan memiliki usaha sebagaimana tersebut di atas.
        @else
            Benar merupakan warga kami dan berdomisili di wilayah RT 24 RW 03 sebagaimana tersebut di atas.
        @endif
        Surat ini dibuat untuk digunakan sebagaimana mestinya.
    </p>

    <div class="ttd">
        Bandung, {{ $tanggal }}<br>
        Ketua RT 24<br>
        <div class="kosong"></div>
        <u>{{ $surat->verifikator?->nama ?? 'Ketua RT 24' }}</u>
    </div>
</body>
</html>
