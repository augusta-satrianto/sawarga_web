<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\KasController;
use App\Http\Controllers\SuratController;
use App\Http\Controllers\VerifikasiController;
use Illuminate\Support\Facades\Route;

// Halaman utama (tampilan dibuat oleh public/js/app.js).
Route::view('/', 'app');

// Verifikasi tanda tangan elektronik (QR code di surat). Bisa dibuka siapa saja tanpa login.
Route::get('verifikasi/{kode}', [VerifikasiController::class, 'show'])->name('verifikasi');
Route::get('verifikasi/{kode}/qr.svg', [VerifikasiController::class, 'qr'])->name('verifikasi.qr');

// Endpoint yang dipanggil public/js/app.js. Semua POST wajib membawa header X-CSRF-TOKEN.
Route::prefix('api')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::middleware('auth')->group(function () {
        Route::get('surat', [SuratController::class, 'index']);
        Route::post('surat', [SuratController::class, 'store']);
        Route::post('surat/keputusan', [SuratController::class, 'keputusan']);
        Route::post('surat/perbaikan', [SuratController::class, 'perbaikan']);
        Route::get('surat/{id}/pdf', [SuratController::class, 'pdf'])->whereNumber('id');
        Route::get('dokumen/{id}', [SuratController::class, 'dokumen'])->whereNumber('id');

        // Kas Warga (khusus pengurus RT).
        Route::get('kas', [KasController::class, 'index']);
        Route::post('kas/warga', [KasController::class, 'simpanWarga']);
        Route::post('kas/warga/hapus', [KasController::class, 'hapusWarga']);
        Route::post('kas/iuran', [KasController::class, 'simpanIuran']);
        Route::post('kas/iuran/hapus', [KasController::class, 'hapusIuran']);
        Route::post('kas/pengeluaran', [KasController::class, 'simpanPengeluaran']);
        Route::post('kas/pengeluaran/hapus', [KasController::class, 'hapusPengeluaran']);
    });
});
