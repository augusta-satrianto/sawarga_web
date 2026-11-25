<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Pengajuan surat.
        // Kolom prioritas diisi sistem (bukan oleh warga). Untuk sementara memakai nilai default;
        // nanti dapat diisi oleh penilaian otomatis/AI (sumber_prioritas = 'ai').
        Schema::create('surat', function (Blueprint $table) {
            $table->id();
            $table->string('no_pengajuan', 20)->nullable()->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('jenis', 60);
            $table->text('keperluan');
            $table->enum('status', ['Menunggu Verifikasi', 'Perlu Perbaikan', 'Diproses', 'Siap Diunduh', 'Ditolak'])
                ->default('Menunggu Verifikasi')->index();
            $table->text('catatan')->nullable();
            $table->enum('prioritas', ['Tinggi', 'Sedang', 'Rendah'])->default('Sedang')->index();
            $table->decimal('skor_prioritas', 3, 1)->nullable();
            $table->enum('sumber_prioritas', ['default', 'manual', 'ai'])->default('default');
            $table->foreignId('diverifikasi_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('diverifikasi_pada')->nullable();
            $table->timestamps();
        });

        // Dokumen persyaratan (KTP/KK). File disimpan di storage/app/private/uploads dengan nama acak.
        Schema::create('surat_dokumen', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_id')->constrained('surat')->cascadeOnDelete();
            $table->string('nama_asli', 255);
            $table->string('nama_file', 64);
            $table->string('mime', 60);
            $table->unsignedInteger('ukuran');
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_dokumen');
        Schema::dropIfExists('surat');
    }
};
