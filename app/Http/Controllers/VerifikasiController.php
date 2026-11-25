<?php

namespace App\Http\Controllers;

use App\Models\Surat;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\Response;
use Illuminate\View\View;

// Tanda tangan elektronik: QR code pada surat yang disetujui mengarah ke halaman verifikasi publik.
class VerifikasiController extends Controller
{
    // GET /verifikasi/{kode} - halaman publik untuk memeriksa keaslian surat.
    public function show(string $kode): View
    {
        $surat = $this->cari($kode);

        return view('verifikasi', ['surat' => $surat]);
    }

    // GET /verifikasi/{kode}/qr.svg - gambar QR code berisi alamat halaman verifikasi.
    public function qr(string $kode): Response
    {
        $surat = $this->cari($kode);
        abort_unless($surat, 404);

        $svg = self::qrSvg(route('verifikasi', $surat->kode_verifikasi));

        return response($svg, 200, [
            'Content-Type' => 'image/svg+xml',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    // Buat gambar QR (SVG) dari sebuah teks/URL. Dipakai juga untuk PDF surat.
    public static function qrSvg(string $isi): string
    {
        $writer = new Writer(new ImageRenderer(new RendererStyle(240, 1), new SvgImageBackEnd()));

        return $writer->writeString($isi);
    }

    // Hanya surat yang masih berstatus disetujui yang dianggap sah.
    private function cari(string $kode): ?Surat
    {
        return Surat::with(['user', 'verifikator'])
            ->where('kode_verifikasi', $kode)
            ->where('status', 'Siap Diunduh')
            ->first();
    }
}
