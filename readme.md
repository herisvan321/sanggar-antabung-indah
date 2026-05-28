# 🦀 RustBasic Starter Kit — Modern SPA Edition

## 📝 Kata Pengantar

Selamat datang di **RustBasic Starter Kit — Modern SPA Edition**. RustBasic adalah framework Full-stack modern berkinerja tinggi untuk bahasa pemrograman Rust. Pada edisi **Modern SPA** ini, framework ini mendobrak batasan web tradisional dengan menyatukan ketangguhan backend **RustBasic** dan reaktivitas stateful **React.js** melalui jembatan elegan **Inertia.js**, serta dibekali teknologi **Single-Binary Asset Embedding** berbasis `rust-embed`. Starter kit ini dirancang untuk memberikan pengalaman pengembangan yang sangat cepat dengan performa produksi tingkat tinggi.

---

## 🛠️ Script Contoh

### A. Alur Pembangunan Kompilasi Produksi (Build Pipeline)
```bash
# 1. Compile aset React.js + Inertia ke folder public/build/
npm run build

# 2. Compile biner Rust dengan kompresi release penuh
cargo build --release
```

### B. Menampilkan Halaman SPA dari Controller Rust (`src/app/http/controllers/welcome_controller.rs`)
```rust
use rustbasic_core::{Request, Response, IntoResponse, serde_json::json};
use crate::app::inertia::inertia;

pub async fn welcome(req: Request) -> impl IntoResponse {
    // Mengirim data props awal ke komponen React "Welcome"
    inertia(&req, "Welcome", json!({
        "title": "Selamat Datang di RustBasic SPA",
        "version": "2026.1"
    }))
}
```

### C. Navigasi Bebas Reload di React (`src/resources/js/Pages/Welcome.jsx`)
```jsx
import React from 'react';
import { Link } from '@inertiajs/react';

export default function Welcome({ title, version }) {
  return (
    <div className="p-8 bg-slate-950 text-white min-h-screen">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-slate-400">Versi: {version}</p>
      {/* Gunakan <Link> untuk navigasi instan SPA tanpa memuat ulang halaman */}
      <Link href="/about" className="mt-4 inline-block text-indigo-400 hover:underline">
        Pelajari Tentang Kami
      </Link>
    </div>
  );
}
```

---

## 🔄 Perbandingan Pemakaian (Debug Mode vs Production Mode)

Berikut adalah tabel perbandingan perilaku framework RustBasic saat dijalankan dalam mode pengembangan (Debug) dan mode rilis (Production):

| Karakteristik | Mode Pengembangan (Debug) | Mode Rilis (Production) |
| :--- | :--- | :--- |
| **Nilai `APP_DEBUG`** | `true` | `false` |
| **Sumber Aset Web** | Dibaca dinamis langsung dari disk fisik komputer. | Dibaca super cepat langsung dari RAM memori biner terkompilasi. |
| **Hot Reload / HMR** | Aktif untuk React (Vite dev server) & Rust (cargo watch). | Non-aktif. Aset telah dibundel permanen di dalam satu file biner. |
| **Pembersihan Server** | Folder `src/` dan `public/` wajib dipertahankan. | Folder `src/` dan `public/` bebas dihapus dari disk produksi server. |
| **Beban Memory (RAM)** | Lebih rendah untuk buffering berkas. | Sedikit lebih tinggi untuk caching seluruh aset web di memori. |

---

## 📊 Tabel Ringkasan Struktur Folder Utama

Berikut adalah panduan direktori utama di dalam proyek starter kit RustBasic:

| Nama Direktori | Fungsi & Tanggung Jawab Utama | Deskripsi Berkas di Dalamnya |
| :--- | :--- | :--- |
| **`src/app/http/controllers/`** | Pengolahan Logika Web | Berkas kontroller backend yang memproses input request & menyuplai props Inertia. |
| **`src/resources/js/Pages/`** | Visual Halaman Utama | Komponen halaman React (.jsx) yang dirender dinamis di browser klien. |
| **`src/routes/`** | Pendaftaran URL Web | Berkas `web.rs` untuk memetakan rute URL ke controller atau closure inline. |
| **`database/migrations/`** | Skema Struktur Database | Skema blueprint pembuatan tabel database relasional. |
| **`docs/`** | Dokumentasi Internal | Buku panduan lengkap cara penggunaan dan arsitektur internal framework. |

---

## 🏁 Penutup

Dengan memadukan kecepatan kompilasi backend RustBasic dan fleksibilitas React.js, RustBasic memberikan pengalaman pengembangan web modern monolitik yang andal, aman, serta sangat mudah untuk dideploy ke server VPS menggunakan file biner tunggal. Selamat membangun aplikasi SPA berskala besar yang kencang dan aman!
