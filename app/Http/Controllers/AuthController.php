<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

class AuthController extends Controller
{
    // GET /api/me - data akun yang sedang login (null jika belum) + token CSRF.
    public function me(Request $request): JsonResponse
    {
        return $this->ok([
            'user' => $request->user()?->toPublic(),
            'csrf' => csrf_token(),
        ]);
    }

    // POST /api/login {username, password, role: 'warga'|'rt'}
    public function login(Request $request): JsonResponse
    {
        $username = strtolower(trim((string) $request->input('username')));
        $password = (string) $request->input('password');
        $role = $request->input('role') === 'rt' ? 'rt' : 'warga';

        if ($username === '' || $password === '') {
            $this->fail('Username dan password wajib diisi.');
        }

        // Batasi 5 kali gagal per menit per sesi.
        $kunci = 'login:' . $request->session()->getId();
        if (RateLimiter::tooManyAttempts($kunci, 5)) {
            $this->fail('Terlalu banyak percobaan login. Coba lagi dalam 1 menit.', 429);
        }

        $user = User::where('username', $username)->first();

        // Tetap cek hash walau akun tidak ada, agar waktu respons tidak membocorkan username.
        $hash = $user ? $user->password : Hash::make('akun-tidak-ada');
        $valid = Hash::check($password, $hash) && $user && $user->role === $role;

        if (! $valid) {
            RateLimiter::hit($kunci, 60);
            $this->fail('Username atau password salah, atau akun belum terdaftar.', 401);
        }

        if (Hash::needsRehash($user->password)) {
            $user->update(['password' => $password]);
        }

        RateLimiter::clear($kunci);
        Auth::login($user);
        $request->session()->regenerate();
        $request->session()->regenerateToken();

        return $this->ok(['user' => $user->toPublic(), 'csrf' => csrf_token()]);
    }

    // POST /api/register {nik, nama, wa, alamat, username, password, password2, setuju}
    // Pendaftaran hanya untuk warga. Akun pengurus RT dibuat lewat `php artisan sawarga:buat-rt`.
    public function register(Request $request): JsonResponse
    {
        $nik = trim((string) $request->input('nik'));
        $nama = trim((string) $request->input('nama'));
        $wa = preg_replace('/[\s-]/', '', trim((string) $request->input('wa')));
        $alamat = trim((string) $request->input('alamat'));
        $username = strtolower(trim((string) $request->input('username')));
        $password = (string) $request->input('password');
        $password2 = (string) $request->input('password2');

        if (! preg_match('/^\d{16}$/', $nik)) $this->fail('NIK harus 16 digit angka.');
        if (mb_strlen($nama) < 3 || mb_strlen($nama) > 100) $this->fail('Nama lengkap wajib diisi.');
        if (! preg_match('/^(0|\+?62)8\d{7,12}$/', $wa)) $this->fail('Nomor WhatsApp tidak valid. Contoh: 081234567890.');
        if (mb_strlen($alamat) < 5 || mb_strlen($alamat) > 255) $this->fail('Alamat wajib diisi lengkap.');
        if (! preg_match('/^[a-z0-9._]{4,20}$/', $username)) $this->fail('Username 4–20 karakter: huruf kecil, angka, titik, atau garis bawah.');
        if (strlen($password) < 6) $this->fail('Password minimal 6 karakter.');
        if (strlen($password) > 72) $this->fail('Password maksimal 72 karakter.');
        if ($password !== $password2) $this->fail('Konfirmasi password tidak sama.');
        if (! $request->boolean('setuju')) $this->fail('Centang pernyataan untuk melanjutkan.');

        if (User::where('username', $username)->exists()) $this->fail('Username sudah dipakai.');
        if (User::where('nik', $nik)->exists()) $this->fail('NIK sudah terdaftar.');

        try {
            User::create([
                'username' => $username,
                'password' => $password,
                'role' => 'warga',
                'nama' => $nama,
                'nik' => $nik,
                'wa' => $wa,
                'alamat' => $alamat,
            ]);
        } catch (QueryException $e) {
            // Dua pendaftaran bersamaan dengan username/NIK sama.
            if ($e->getCode() === '23000') $this->fail('Username atau NIK sudah terdaftar.');
            throw $e;
        }

        return $this->ok(['username' => $username], 201);
    }

    // POST /api/logout
    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->ok(['csrf' => csrf_token()]);
    }
}
