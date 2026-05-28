# 🚀 Panduan Dasar-Dasar RustBasic SPA

## 📝 Kata Pengantar
Selamat datang di panduan dasar **RustBasic SPA (Single Page Application)**. Dokumentasi ini dibuat untuk memandu Anda memahami tiga pilar utama pembangunan aplikasi web dengan RustBasic: **Routing**, **Controllers**, dan **Views (React)**. Panduan ini dirancang dari tingkat pemula agar siapa pun dapat memahaminya, hingga tingkat lanjutan untuk arsitek sistem yang menginginkan pemahaman mendalam tentang siklus request-response.

---

## 🛠️ Script Contoh

### A. Definisikan Routing (`src/routes/web.rs`)
```rust
use rustbasic_core::{Router, get, AppState};
use crate::app::http::controllers::welcome_controller;

pub fn router() -> Router<AppState> {
    Router::new()
        // Memetakan rute beranda ke controller
        .route("/", get(welcome_controller::index))
}
```

### B. Definisikan Controller (`src/app/http/controllers/welcome_controller.rs`)
```rust
use crate::app::inertia;
use rustbasic_core::{Request, IntoResponse, serde_json::json};

pub async fn index(req: Request) -> impl IntoResponse {
    // Mengembalikan response Inertia ke halaman Welcome.jsx
    inertia(&req, "Welcome", json!({
        "title": "Selamat Datang di RustBasic SPA!",
        "version": "2026.1"
    }))
}
```

### C. Definisikan View (`src/resources/js/Pages/Welcome.jsx`)
```jsx
import React from 'react';
import { Link } from '@inertiajs/react';

export default function Welcome({ title, version }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
      <h1 className="text-4xl font-extrabold mb-2">{title}</h1>
      <p className="text-slate-400 mb-6">Versi Aplikasi: {version}</p>
      <Link href="/about" className="px-4 py-2 bg-indigo-600 rounded-lg">Tentang Kami</Link>
    </div>
  );
}
```

---

## 🔄 Perbandingan Pemakaian (MPA vs SPA)

Berikut adalah tabel perbandingan pemakaian antara arsitektur Multi-Page Application (MPA) tradisional berbasis server template dan arsitektur Single Page Application (SPA) berbasis React-Inertia di RustBasic:

| Fitur / Karakteristik | Multi-Page Application (MPA) | Single-Page Application (SPA) |
| :--- | :--- | :--- |
| **Siklus Navigasi** | Memuat ulang seluruh halaman (full reload), layar berkedip putih. | Navigasi instan tanpa reload, hanya bertukar data via AJAX. |
| **Integrasi State** | State hilang setiap kali berpindah halaman. | State global tetap terjaga menggunakan React Context. |
| **Routing** | Ditangani penuh di sisi server (misal: Minijinja template). | Ditangani server & dihidrasi instan di sisi client React. |
| **Kecepatan Respon** | Lambat karena harus merender seluruh kerangka HTML di server. | Sangat cepat karena server hanya mengirim data JSON mentah. |

---

## 📊 Tabel Ringkasan Komponen Dasar

Berikut adalah ringkasan berkas utama yang terlibat dalam arsitektur dasar RustBasic SPA:

| Nama Komponen | Lokasi Berkas | Deskripsi Fungsi |
| :--- | :--- | :--- |
| **Web Router** | `src/routes/web.rs` | Tempat mendaftarkan URL aplikasi dan memetakannya ke fungsi controller yang sesuai. |
| **Controller** | `src/app/http/controllers/` | Mengolah data request, berinteraksi dengan database, dan menyuplai data ke React. |
| **React Pages** | `src/resources/js/Pages/` | Berkas visual antarmuka pengguna (.jsx) yang dirender di browser klien. |
| **Root Template** | `src/resources/views/app.rb.html` | File HTML utama yang bertindak sebagai kontainer awal SPA. |

---

## 🏁 Penutup
Dengan memahami alur kerja dasar antara perutean (`Router`), pengolahan data (`Controller`), dan presentasi visual (`View` React), Anda kini siap untuk membangun modul aplikasi yang kompleks dan responsif secara mandiri.
