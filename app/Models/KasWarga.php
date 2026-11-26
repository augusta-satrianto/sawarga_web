<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

// Satu rumah pada sheet "Data Warga" di laporan keuangan (bukan akun login).
class KasWarga extends Model
{
    protected $table = 'kas_warga';

    protected $fillable = ['no_rumah', 'nama', 'nominal_iuran', 'keterangan'];

    public const KETERANGAN = ['Ada', 'Visit', 'Rumah Kosong', 'Ruko', 'Pengurus'];

    public function iuran(): HasMany
    {
        return $this->hasMany(KasIuran::class);
    }

    // "A0 No. 01 - Ibu Maria"
    public function label(): string
    {
        return $this->no_rumah . ($this->nama ? ' - ' . $this->nama : '');
    }
}
