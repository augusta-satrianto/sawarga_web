<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SuratDokumen extends Model
{
    protected $table = 'surat_dokumen';

    // Tabel ini hanya punya created_at.
    public const UPDATED_AT = null;

    protected $fillable = ['surat_id', 'nama_asli', 'nama_file', 'mime', 'ukuran', 'created_at'];

    public function surat(): BelongsTo
    {
        return $this->belongsTo(Surat::class);
    }
}
