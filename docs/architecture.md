# 🏛️ Panduan Arsitektur Monolith SPA

## 📝 Kata Pengantar
Selamat datang di panduan **Arsitektur Monolith SPA RustBasic**. Dokumentasi ini dirancang khusus untuk memandu pengembang memahami bagaimana server Rust (backend) dapat terintegrasi secara mulus dengan React.js (frontend) melalui jembatan protokol Inertia.js. Melalui panduan ini, Anda akan mempelajari siklus hidup request, proses hidrasi awal, dan teknik pengiriman data global secara instan.

---

## 🛠️ Script Contoh

### A. Mengakses Shared Page Props di React (`src/resources/js/Components/Navbar.jsx`)
```jsx
import React from 'react';
import { usePage } from '@inertiajs/react';

export default function Navbar() {
  //usePage().props otomatis berisi data auth user dari server Rust
  const { auth, flash } = usePage().props;

  return (
    <nav className="p-4 bg-slate-900 text-white flex justify-between">
      <span>My SPA Project</span>
      {auth.user ? (
        <span>User: {auth.user.name}</span>
      ) : (
        <a href="/login" className="text-indigo-400">Masuk Akun</a>
      )}
    </nav>
  );
}
```

### B. Mengirim Flash Message dari Controller Rust
```rust
use rustbasic_core::{Request, IntoResponse, Redirect};

pub async fn login_user(req: Request) -> impl IntoResponse {
    // Menyimpan flash message sukses ke dalam sesi
    req.session.set("success", "Anda berhasil masuk sistem!");
    Redirect::to("/dashboard")
}
```

---

## 🔄 Perbandingan Pemakaian (Traditional MVC vs Monolith SPA)

Berikut adalah perbandingan pemakaian arsitektur antarmuka aplikasi:

| Aspek Arsitektur | Traditional MVC (Template Server) | Monolith SPA (React-Inertia) |
| :--- | :--- | :--- |
| **Bahasa Tampilan** | Menulis markup Jinja/HTML di sisi backend Rust. | Menulis komponen modern React (.jsx) di frontend. |
| **Siklus Navigasi** | Browser memuat ulang seluruh halaman saat klik link. | Halaman dimuat instan tanpa reload (AJAX swap). |
| **Metode Pengiriman Data** | Data digabungkan ke template sebelum HTML dikirim. | Data dikirim berupa props JSON mentah secara berkala. |
| **Reusable Component** | Tergantung pada potongan berkas HTML template. | Komponen React modular, dinamis, dan terisolasi. |

---

## 📊 Tabel Ringkasan Siklus Hidup Request SPA

Berikut adalah urutan proses saat pengguna berinteraksi dengan aplikasi Monolith SPA RustBasic:

| Tahap Siklus | Aksi Pengguna / Browser | Respon Server RustBasic |
| :--- | :--- | :--- |
| **1. Kunjungan Awal** | Mengetik URL di address bar (atau tekan F5). | Merender HTML root kontainer `app.rb.html` beserta data awal. |
| **2. React Hydration** | React memuat data di atribut `'data-page'`. | Selesai bertugas, browser dihidupkan menjadi aplikasi dinamis. |
| **3. Navigasi Tautan** | Pengguna mengklik `<Link href="/about">`. | Memotong rute request, mengirim AJAX dengan header Inertia. |
| **4. JSON Delivery** | Inertia menangkap respon JSON terbaru. | Server hanya mengembalikan JSON props tanpa kerangka HTML. |
| **5. Page Render** | React langsung menukar komponen di layar. | Siap menerima interaksi navigasi berikutnya. |

---

## 🏁 Penutup
Arsitektur Monolith SPA memberikan efisiensi luar biasa dalam proses *development* karena menghilangkan kebutuhan REST API yang kompleks, sambil memberikan pengalaman visual tingkat tinggi bagi pengguna akhir aplikasi Anda.
