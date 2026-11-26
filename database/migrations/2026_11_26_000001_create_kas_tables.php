<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Kas RT, mengikuti sheet di "Laporan Keuangan RT":
//   kas_warga        = sheet Data Warga (rumah + nominal iuran)
//   kas_iuran        = sheet Input Iuran (satu baris = satu kali bayar / setoran)
//   kas_iuran_bulan  = bulan yang dilunasi oleh pembayaran tersebut (dasar ceklis Pelaporan Iuran)
//   kas_pengeluaran  = sheet Pengeluaran
// Sheet Rekap dihitung dari kas_iuran dan kas_pengeluaran, tidak disimpan.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kas_warga', function (Blueprint $table) {
            $table->id();
            $table->string('no_rumah', 40);
            $table->string('nama', 100)->nullable();
            $table->unsignedInteger('nominal_iuran')->default(30000);
            $table->string('keterangan', 40)->nullable();
            $table->timestamps();
        });

        Schema::create('kas_iuran', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->foreignId('kas_warga_id')->nullable()->constrained('kas_warga')->nullOnDelete();
            $table->string('uraian', 150)->nullable();
            $table->unsignedInteger('total');
            $table->string('metode', 20)->default('Tunai');
            $table->string('catatan', 255)->nullable();
            $table->foreignId('dicatat_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index('tanggal');
        });

        Schema::create('kas_iuran_bulan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kas_iuran_id')->constrained('kas_iuran')->cascadeOnDelete();
            $table->foreignId('kas_warga_id')->constrained('kas_warga')->cascadeOnDelete();
            $table->unsignedSmallInteger('tahun');
            $table->unsignedTinyInteger('bulan');
            $table->unsignedInteger('nominal');
            $table->index(['tahun', 'kas_warga_id']);
        });

        Schema::create('kas_pengeluaran', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->string('kategori', 40);
            $table->string('peruntukan', 100)->nullable();
            $table->string('uraian', 200);
            $table->unsignedInteger('nominal');
            $table->string('dibayar_kepada', 100)->nullable();
            $table->foreignId('dicatat_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index('tanggal');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kas_pengeluaran');
        Schema::dropIfExists('kas_iuran_bulan');
        Schema::dropIfExists('kas_iuran');
        Schema::dropIfExists('kas_warga');
    }
};
