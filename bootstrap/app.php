<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectGuestsTo('/');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Semua kesalahan di /api/* dikirim sebagai {ok: false, error: "..."} agar bisa dibaca app.js.
        // Detail teknis hanya dicatat di storage/logs, tidak dikirim ke browser.
        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            if ($e instanceof HttpResponseException) {
                return $e->getResponse();
            }

            if ($e instanceof AuthenticationException) {
                [$code, $pesan] = [401, 'Silakan login terlebih dahulu.'];
            } elseif ($e instanceof HttpExceptionInterface) {
                $code = $e->getStatusCode();
                $pesan = match ($code) {
                    404 => 'Halaman tidak ditemukan.',
                    405 => 'Metode tidak diizinkan.',
                    413 => 'Ukuran file terlalu besar.',
                    419 => 'Sesi tidak valid. Muat ulang halaman lalu coba lagi.',
                    429 => 'Terlalu banyak permintaan. Coba lagi sebentar lagi.',
                    default => 'Terjadi kesalahan pada server.',
                };
            } else {
                [$code, $pesan] = [500, 'Terjadi kesalahan pada server.'];
            }

            return response()->json(['ok' => false, 'error' => $pesan], $code, ['Cache-Control' => 'no-store']);
        });
    })->create();
