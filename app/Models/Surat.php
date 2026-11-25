<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Surat extends Model
{
    protected $table = 'surat';

    public const JENIS = [
        'Surat Keterangan Domisili',
        'Surat Pengantar SKCK',
        'Surat Keterangan Usaha',
        'Surat Pengantar Nikah',
        'Surat Keterangan Tidak Mampu',
    ];

    // Keputusan yang boleh diberikan pengurus RT.
    public const KEPUTUSAN = ['Diproses', 'Siap Diunduh', 'Perlu Perbaikan', 'Ditolak'];

    // Prioritas awal untuk setiap pengajuan baru. Tidak diisi oleh warga.
    public const PRIORITAS_DEFAULT = 'Sedang';

    protected $fillable = [
        'no_pengajuan', 'user_id', 'jenis', 'keperluan', 'status', 'catatan',
        'prioritas', 'skor_prioritas', 'sumber_prioritas', 'diverifikasi_oleh', 'diverifikasi_pada', 'kode_verifikasi',
        'created_at', 'updated_at',
    ];

    protected function casts(): array
    {
        return [
            'skor_prioritas' => 'float',
            'diverifikasi_pada' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Pengurus RT yang memberi keputusan (penanda tangan surat).
    public function verifikator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diverifikasi_oleh');
    }

    // Kode unik untuk QR tanda tangan elektronik.
    public static function buatKodeVerifikasi(): string
    {
        return bin2hex(random_bytes(16));
    }

    public function dokumen(): HasMany
    {
        return $this->hasMany(SuratDokumen::class)->orderBy('id');
    }
}
