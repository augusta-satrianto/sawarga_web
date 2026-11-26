<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Bulan iuran yang dilunasi oleh satu pembayaran.
class KasIuranBulan extends Model
{
    protected $table = 'kas_iuran_bulan';

    public $timestamps = false;

    protected $fillable = ['kas_iuran_id', 'kas_warga_id', 'tahun', 'bulan', 'nominal'];
}
