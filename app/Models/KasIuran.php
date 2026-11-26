<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

// Satu baris pada sheet "Input Iuran": pembayaran satu rumah, atau setoran gabungan (kas_warga_id kosong).
class KasIuran extends Model
{
    protected $table = 'kas_iuran';

    protected $fillable = ['tanggal', 'kas_warga_id', 'uraian', 'total', 'metode', 'catatan', 'dicatat_oleh'];

    protected $casts = ['tanggal' => 'date'];

    public const METODE = ['Tunai', 'Transfer'];

    public function warga(): BelongsTo
    {
        return $this->belongsTo(KasWarga::class, 'kas_warga_id');
    }

    public function bulan(): HasMany
    {
        return $this->hasMany(KasIuranBulan::class)->orderBy('tahun')->orderBy('bulan');
    }
}
