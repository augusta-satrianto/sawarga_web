<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Satu baris pada sheet "Pengeluaran".
class KasPengeluaran extends Model
{
    protected $table = 'kas_pengeluaran';

    protected $fillable = ['tanggal', 'kategori', 'peruntukan', 'uraian', 'nominal', 'dibayar_kepada', 'dicatat_oleh'];

    protected $casts = ['tanggal' => 'date'];

    public const KATEGORI = [
        'Keamanan', 'Sampah', 'Listrik/Fasilitas', 'Perawatan Lingkungan',
        'Kas Sosial', 'Acara Warga', 'Administrasi', 'Lainnya',
    ];
}
