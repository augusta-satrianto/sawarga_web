<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = ['username', 'password', 'role', 'nama', 'nik', 'wa', 'alamat'];

    protected $hidden = ['password'];

    // Tidak memakai fitur "ingat saya".
    protected $rememberTokenName = '';

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function surat(): HasMany
    {
        return $this->hasMany(Surat::class);
    }

    public function isRt(): bool
    {
        return $this->role === 'rt';
    }

    // Data akun yang aman dikirim ke browser.
    public function toPublic(): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'role' => $this->role,
            'nama' => $this->nama,
            'nik' => $this->nik,
            'wa' => $this->wa,
            'alamat' => $this->alamat,
        ];
    }
}
