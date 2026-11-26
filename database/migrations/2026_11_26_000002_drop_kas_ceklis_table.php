<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

// Ceklis manual (sheet Data Iuran Warga) tidak dipakai lagi:
// ceklis Pelaporan Iuran hanya berasal dari pembayaran di Input Iuran.
// Migrasi ini hanya membersihkan tabel kas_ceklis di database yang sempat membuatnya.
return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('kas_ceklis');
    }

    // Tabel tidak dipakai lagi, jadi tidak dibuat ulang saat rollback.
    public function down(): void {}
};
