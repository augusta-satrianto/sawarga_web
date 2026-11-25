<?php

namespace App\Http\Controllers;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

abstract class Controller
{
    // Respons JSON berhasil: {ok: true, ...}
    protected function ok(array $data = [], int $code = 200): JsonResponse
    {
        return response()->json(['ok' => true] + $data, $code, ['Cache-Control' => 'no-store']);
    }

    // Hentikan permintaan dengan respons {ok: false, error: "..."}
    protected function fail(string $pesan, int $code = 400): never
    {
        throw new HttpResponseException(
            response()->json(['ok' => false, 'error' => $pesan], $code, ['Cache-Control' => 'no-store'])
        );
    }
}
