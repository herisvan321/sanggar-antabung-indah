# 📘 Catatan Dokumentasi RustBasic (React SPA Edition)

## 📝 Kata Pengantar

Selamat datang di **Catatan Dokumentasi RustBasic (React SPA Edition)**. Berkas catatan ini merangkum riwayat pembaruan, detail fungsionalitas pengerasan keamanan backend (hardening), modularitas direktori, integrasi skema database blueprint, serta pintasan pengembangan di dalam ekosistem **RustBasic**. Melalui catatan ini, pengembang dapat menelusuri bagaimana setiap bagian dari sistem monolith ini bekerja sama menciptakan aplikasi web SPA yang cepat, stabil, dan aman.

---

## 🛠️ Script Contoh

Berikut adalah contoh skrip blueprint schema migrasi tabel database relasional bergaya fluent:

```rust
use rustbasic_core::{Schema, SchemaManager, MigrationTrait, DbErr};
use rustbasic_core::async_trait;

pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    fn name(&self) -> &str { "m2026_create_users" }

    async fn up<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        // Mendefinisikan tabel baru menggunakan helper Schema bergaya fluent
        Schema::create(manager, "users", |table| {
            table.id();
            table.string("name").not_null();
            table.string("email").not_null().unique().index();
            table.string("password").not_null();
            table.timestamps();
        }).await
    }

    async fn down<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        Schema::drop(manager, "users").await
    }
}
```

---

## 🔄 Perbandingan Pemakaian (Penyimpanan Sesi Cookie vs Penyimpanan Sesi Database)

Berikut adalah perbandingan pemakaian metode penyimpanan data sesi (session management) pada backend RustBasic:

| Karakteristik Sesi | Cookie Session Store (Stateless) | Database Session Store (Stateful) |
| :--- | :--- | :--- |
| **Lokasi Penyimpanan** | Data tersimpan sepenuhnya di cookie browser user. | Hanya Session ID di cookie, data asli tersimpan di DB. |
| **Kapasitas Penyimpanan**| Sangat terbatas (maksimal ~4KB). | Sangat besar (tidak terbatas, bergantung disk database). |
| **Proteksi Manipulasi**  | Harus dienkripsi kuat di tingkat client. | Lebih aman karena client tidak bisa memodifikasi isi data. |
| **Pembatalan Sesi (Revoke)**| Sulit dibatalkan sebelum cookie kadaluarsa. | Sangat mudah dibatalkan langsung dengan menghapus baris DB. |

---

## 📊 Tabel Ringkasan Fitur Pengerasan Keamanan Sistem (Hardened Security)

Berikut adalah ringkasan mekanisme pertahanan dan audit keamanan yang diimplementasikan di tingkat core RustBasic:

| Fitur Hardening | Cara Kerja Fitur Keamanan | Manfaat Bagi Aplikasi |
| :--- | :--- | :--- |
| **Mandatory .env** | Aplikasi memicu `panic!` jika berkas konfigurasi tidak ada. | Mencegah salah konfigurasi port & database di produksi. |
| **Session-IP Binding** | ID Sesi dikunci erat ke alamat IP browser pengguna. | Menghentikan aksi pembajakan sesi (Session Hijacking). |
| **Dual Logging** | Log konsol berwarna, log file `storage/logs/` tanpa warna. | Membantu peninjauan error visual & audit log terstruktur. |
| **CSRF Verifier** | Melakukan verifikasi token otomatis pada request POST/PUT/DELETE. | Melindungi aplikasi dari ancaman eksploitasi lintas situs. |
| **Live Reload Watcher** | Mengaktifkan `tower-livereload` hanya pada mode debug. | Membantu pengembangan lokal tanpa membebani server rilis. |

---

## 🏁 Penutup

Catatan dokumentasi ini diperbarui pada Mei 2026 untuk mencerminkan implementasi React SPA Edition, Standalone CLI biner global, serta Blueprint Migration Schema. Dengan memahami catatan sistem ini, pengembang dapat menjaga efisiensi dan keamanan aplikasi web yang dibangun di atas framework RustBasic.
