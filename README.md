# SaWarga 24 (Laravel)

Sistem informasi pelayanan warga RT 24 / RW 03 Quanta 2 Kuningan.
Versi Laravel 12 dari proyek `SaWarga` (PHP native). Berjalan di **PHP 8.2+** dan MySQL.

Tampilan tetap sama (HTML/CSS/JS di `public/`), backend dipindah ke controller Laravel.
Yang tersambung ke database: **login/daftar akun**, **pengajuan surat**
(ajukan, verifikasi pengurus RT, minta perbaikan, unggah ulang, lihat dokumen), dan **kas warga**.
Laporan masyarakat dan data warga (menu Data Warga di luar Kas) masih memakai data contoh di `public/js/app.js`.

## Menjalankan di komputer (Laragon)

1. Nyalakan **MySQL** di Laragon (Start All), pastikan PHP yang aktif versi 8.2.
2. Pasang dependensi dan konfigurasi (lewati jika `vendor/` dan `.env` sudah ada):
   ```
   composer install
   copy .env.example .env
   php artisan key:generate
   ```
3. Buat database `sawarga_web` (nama bisa diubah di `.env`, bagian `DB_*`):
   ```
   mysql -uroot -e "CREATE DATABASE sawarga_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
   ```
4. Buat tabel dan isi data contoh (akun RT, 4 akun warga, 7 surat + dokumen, kas contoh). Daftar akun ada di
   bagian atas `database/seeders/DatabaseSeeder.php`:
   ```
   php artisan migrate --seed
   php artisan migrate:fresh --seed   # kosongkan semua data lalu isi ulang
   ```
   Untuk pemakaian sungguhan, lewati seeder dan buat akun pengurus RT sendiri (password diketik saat diminta):
   ```
   php artisan migrate
   php artisan sawarga:buat-rt ketua.rt "Nama Ketua RT"
   ```
5. Jalankan server lalu buka `http://localhost:8000`:
   ```
   php artisan serve
   ```
   Atau lewat Laragon: arahkan document root ke folder `public/`.

Akun warga dibuat sendiri lewat tombol **Daftar sekarang** di halaman login.

## Struktur

```
routes/web.php                    Semua URL (halaman + /api/*)
app/Http/Controllers/
  Controller.php                  helper ok() / fail() untuk respons JSON
  AuthController.php              me, login, register, logout
  SuratController.php             daftar, ajukan, keputusan RT, perbaikan, lihat dokumen
  KasController.php               menu Kas Warga (iuran, pengeluaran, data rumah, rekap)
app/Models/                       User, Surat, SuratDokumen, KasWarga, KasIuran, KasIuranBulan,
                                  KasPengeluaran
database/migrations/              struktur tabel
database/seeders/DatabaseSeeder.php  data contoh
routes/console.php                perintah `sawarga:buat-rt` dan `sawarga:impor-kas`
resources/views/app.blade.php     halaman utama (pengganti index.html)
public/css/style.css, public/js/app.js   Tampilan
storage/app/private/uploads/      dokumen KTP/KK (nama file acak, tidak bisa diakses langsung)
bootstrap/app.php                 format error JSON untuk /api/*
```

## Endpoint API

| Lama (PHP native)              | Baru (Laravel)                |
|--------------------------------|-------------------------------|
| GET  api/me.php                | GET  /api/me                  |
| POST api/login.php             | POST /api/login               |
| POST api/register.php          | POST /api/register            |
| POST api/logout.php            | POST /api/logout              |
| GET/POST api/surat.php         | GET/POST /api/surat           |
| POST api/surat_keputusan.php   | POST /api/surat/keputusan     |
| POST api/surat_perbaikan.php   | POST /api/surat/perbaikan     |
| GET  api/dokumen.php?id=1      | GET  /api/dokumen/1           |

Format respons tetap sama: `{ "ok": true, ... }` atau `{ "ok": false, "error": "..." }`.

Endpoint kas (khusus pengurus RT): `GET /api/kas?tahun=2026`, `POST /api/kas/iuran`, `/api/kas/iuran/hapus`,
`/api/kas/pengeluaran`, `/api/kas/pengeluaran/hapus`, `/api/kas/warga`, `/api/kas/warga/hapus`.

## Kas Warga

Menu **Kas Warga** (pengurus RT) mengikuti sheet di file Excel *Laporan Keuangan RT*:

| Tab               | Sheet Excel        | Isi                                                                 |
|-------------------|--------------------|---------------------------------------------------------------------|
| Rekap             | Rekap              | Pemasukan, pengeluaran, selisih, saldo kumulatif per bulan (otomatis) |
| Input Iuran       | Input Iuran        | Satu baris per pembayaran: pilih rumah + bulan yang dibayar, atau setoran gabungan |
| Pelaporan Iuran   | Pelaporan Iuran    | Ceklis ✓ per bulan per rumah, otomatis dari Input Iuran + total dibayar |
| Pengeluaran       | Pengeluaran        | Tanggal, kategori, peruntukan, uraian, nominal, dibayarkan kepada    |
| Data Warga        | Data Warga         | Blok/no. rumah, nama, nominal iuran, keterangan                      |
| Petunjuk          | Petunjuk           | Cara pakai                                                          |

Ceklis hanya berasal dari pembayaran per rumah di Input Iuran (tidak ada ceklis manual), sama seperti
rumus sheet Pelaporan Iuran di Excel. Karena itu sheet *Data Iuran Warga* tidak dipakai dan tidak diimpor.
Setoran gabungan menambah pemasukan kas tetapi tidak memberi ceklis.

Perbedaan lain dengan Excel: satu bulan hanya bisa dicatat sekali per rumah, dan saldo kumulatif ikut
membawa sisa kas tahun sebelumnya. Setiap tab bisa diunduh sebagai CSV.

**Impor data dari Excel** (data hanya masuk ke database lokal, file Excel tidak ikut disimpan di proyek):
```
php artisan sawarga:impor-kas "C:\Users\HP\Downloads\Laporan Keuangan RT 24 Perum Quanta.xlsx" --hapus
```
`--hapus` mengosongkan data kas lama dulu. Tanpa `--hapus`, impor ditolak jika data kas sudah ada.
Perintah `php artisan migrate:fresh --seed` juga mengganti data kas dengan data contoh, jadi impor ulang
setelahnya.

## Tanda tangan elektronik (QR code)

Saat pengurus RT menekan **Setujui Pengajuan** (status `Siap Diunduh`), surat otomatis mendapat
`kode_verifikasi` unik. Di bagian tanda tangan surat muncul QR code + nama pengurus yang menyetujui.
QR berisi alamat `/verifikasi/{kode}`, halaman publik (tanpa login) yang menampilkan apakah surat sah,
nomor, nama pemohon, NIK yang disamarkan, penanda tangan, dan tanggal disetujui.
Jika status surat diubah lagi (mis. ditolak), halaman verifikasi otomatis menyatakan surat tidak sah.
Kode: `app/Http/Controllers/VerifikasiController.php`, `resources/views/verifikasi.blade.php`.

Supaya QR bisa dipindai dari HP lain, isi `APP_URL` di `.env` dengan alamat yang bisa diakses publik.

## Prioritas surat

Setiap pengajuan baru otomatis mendapat `prioritas = 'Sedang'` dan `sumber_prioritas = 'default'`.
Nilainya diisi sistem, bukan oleh warga. Nilai default diatur lewat `Surat::PRIORITAS_DEFAULT`
di `app/Models/Surat.php`. Kolom `skor_prioritas` dan `sumber_prioritas = 'ai'` sudah disiapkan
untuk penilaian otomatis nanti.

## Keamanan

- Password disimpan sebagai hash (bcrypt bawaan Laravel).
- Query lewat Eloquent (prepared statement).
- Session Laravel (`HttpOnly`, `SameSite=Lax`) + token CSRF (header `X-CSRF-TOKEN`) untuk setiap POST.
- Cek peran: warga hanya melihat suratnya sendiri, hanya pengurus RT yang bisa memberi keputusan.
- Upload dicek dari isi file (PDF/JPG/PNG, maks. 5 MB, maks. 5 file) dan disimpan dengan nama acak.
- Login dibatasi 5 kali gagal per menit per sesi.

Saat dipasang di hosting: aktifkan HTTPS, set `APP_ENV=production`, `APP_DEBUG=false`,
isi password database di `.env`, dan arahkan document root ke folder `public/`.
