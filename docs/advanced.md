# ⚙️ Panduan Topik Lanjutan (Validation, Session, & Logs)

## 📝 Kata Pengantar
Selamat datang di panduan **Topik Lanjutan RustBasic**. Dokumentasi ini dirancang khusus untuk memandu Anda menerapkan sistem validasi input data yang kuat di sisi server, mengelola siklus stateful menggunakan sesi terenkripsi, merekam jejak aktivitas aplikasi secara harian (rolling logs), dan menangani cache-busting aset web secara otomatis demi performa optimal di tingkat produksi.

---

## 🛠️ Script Contoh

### A. Validasi Struct Input Data (`src/app/http/controllers/post_controller.rs`)
```rust
use rustbasic_core::serde::Deserialize;
use rustbasic_core::validator::Validate;

#[derive(Validate, Deserialize)]
pub struct CreatePostRequest {
    #[validate(length(min = 5, message = "Judul minimal harus berisi 5 karakter"))]
    pub title: String,
    
    #[validate(email(message = "Format alamat email salah"))]
    pub email: String,
}
```

### B. Menyimpan & Mengambil Sesi HTTP Kompleks
```rust
use rustbasic_core::requests::Request;

// 1. Simpan data ke Sesi
req.session.set("user_role", "admin".to_string());

// 2. Ambil data dari Sesi
let role: Option<String> = req.session.get("user_role");
```

### C. Merekam Jejak Log Menggunakan Tracing Crate
```rust
use rustbasic_core::tracing::{info, warn, error};

pub fn process_order(order_id: i32) {
    info!("Memulai proses transaksi order ber-ID: {}", order_id);
    if order_id <= 0 {
        warn!("ID order tidak valid ditemukan!");
    }
}
```

---

## 🔄 Perbandingan Pemakaian (Tingkat Log/Log Levels)

Berikut adalah perbandingan pemakaian tingkatan log yang digunakan dalam proses tracing aplikasi:

| Tingkat Log | Kapan Harus Digunakan | Contoh Kasus Penggunaan |
| :--- | :--- | :--- |
| **TRACE** | Informasi sangat detail tingkat rendah. | Perekaman aliran bytes data masuk di jaringan. |
| **DEBUG** | Detail alur teknis untuk developer. | Mencetak isi parameter internal variabel. |
| **INFO** | Catatan peristiwa penting yang sukses. | Server berhasil berjalan, pembayaran dikonfirmasi. |
| **WARN** | Peringatan masalah potensial. | Gagal login berulang kali, performa db menurun. |
| **ERROR** | Gangguan fatal yang menghentikan proses. | Koneksi database terputus, API gateway down. |

---

## 📊 Tabel Ringkasan Proteksi Lanjutan

Berikut adalah ringkasan mekanisme pengamanan dan optimasi tingkat lanjut pada RustBasic:

| Nama Sistem | Cara Kerja Sistem | Deskripsi Manfaat |
| :--- | :--- | :--- |
| **Daily Rolling Log** | Logs otomatis diarsipkan harian di folder `storage/logs/`. | Mencegah file log membengkak menyumbat kapasitas disk. |
| **Validation Filter** | Menghentikan request di server jika data tidak sesuai aturan. | Menghindari data sampah/injeksi berbahaya masuk ke DB. |
| **Session Encryption** | ID Sesi dienkripsi kuat menggunakan Application Key (`APP_KEY`).| Menjamin sesi pengguna aman dari manipulasi cookie. |
| **Cache-Busting Aset** | Menambahkan hash konten unik ke nama file JS/CSS terkompilasi. | Memastikan browser user selalu mengunduh visual teranyar. |

---

## 🏁 Penutup
Dengan menerapkan validasi input yang ketat, logging harian terstruktur, dan sesi terenkripsi, aplikasi Anda siap menghadapi beban trafik produksi yang tinggi secara aman dan andal.
