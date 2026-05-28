# 🛣️ Panduan Perutean Inline

## 📝 Kata Pengantar
Selamat datang di panduan **Perutean Inline RustBasic**. Dokumentasi ini dirancang khusus untuk memandu Anda memahami cara menulis rute web, memproses data request, dan langsung mengembalikan respon visual secara instan menggunakan closure asinkron secara langsung, tanpa harus memisahkan kode ke dalam berkas controller.

---

## 🛠️ Script Contoh

### A. Perutean Teks Sederhana Inline (`src/routes/web.rs`)
```rust
use rustbasic_core::{Router, get, AppState};

pub fn router() -> Router<AppState> {
    Router::new()
        // Mengembalikan teks murni secara langsung
        .route("/quick-test", get(|| async { 
            "Ini rute inline instan!" 
        }))
}
```

### B. Logika Bisnis & Parameter Request di Rute Inline
```rust
use rustbasic_core::{Router, get, AppState, Request};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/sambut", get(|req: Request| async move {
            let nama = req.query("nama").unwrap_or("Tamu");
            format!("Selamat datang di rute inline, {}!", nama)
        }))
}
```

### C. Merender Komponen React SPA Secara Inline
```rust
use rustbasic_core::{Router, AppState, serde_json::json};
use crate::routes::RouterExt;

pub fn router() -> Router<AppState> {
    Router::new()
        // Langsung menyajikan komponen Welcome.jsx dengan props tersemat
        .get_inertia("/halaman-statis", "Welcome", json!({
            "title": "FAQ Bantuan Aplikasi"
        }))
}
```

---

## 🔄 Perbandingan Pemakaian (Rute Inline vs Rute Controller)

Berikut adalah perbandingan pemakaian dan penulisan jalur logika rute aplikasi:

| Kriteria Keputusan | Perutean Inline (Closure) | Perutean Controller (Class Method) |
| :--- | :--- | :--- |
| **Sintaksis** | `.route("/url", get(|| async { ... }))` | `.route("/url", get(welcome_controller::index))` |
| **Lokasi Logika** | Ditulis menyatu di berkas `src/routes/web.rs`. | Ditulis di berkas `src/app/http/controllers/`. |
| **Kasus Terbaik** | Halaman bantuan, FAQ, redirect, & uji coba API cepat. | Transaksi database kompleks, pengolahan form masif. |
| **Keterbacaan Kode** | Rawan berantakan jika logika melebihi 15 baris. | Sangat rapi karena logika dipisah rapi secara modular. |

---

## 📊 Tabel Ringkasan Pintasan Perutean Builder

Berikut adalah daftar fungsi builder instan Router yang disediakan oleh framework RustBasic:

| Nama Fungsi Builder | Kegunaan Utama Pintasan | Contoh Penulisan Kode |
| :--- | :--- | :--- |
| **`.get_inertia`** | Merender komponen React statis. | `.get_inertia("/about", "About", props)` |
| **`.get_json`** | Mengembalikan data JSON secara instan. | `.get_json("/status", json!({"ok": true}))` |
| **`.get_redirect`** | Mengalihkan URL secara langsung (status 303). | `.get_redirect("/lama", "/baru")` |

---

## 🏁 Penutup
Perutean inline memberikan kemudahan luar biasa bagi pengembang untuk membuat halaman statis atau purwarupa (mockup) dengan cepat, menghemat penulisan berkas controller untuk tugas-tugas yang sederhana.
