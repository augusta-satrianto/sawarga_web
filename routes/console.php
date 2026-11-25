<?php

use App\Models\User;
use Illuminate\Support\Facades\Artisan;

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
