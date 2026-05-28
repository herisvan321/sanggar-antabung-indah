# 🎨 Panduan Views, JSX Komponen, & Desain UI

## 📝 Kata Pengantar
Selamat datang di panduan pembangunan **Views & JSX Komponen**. Dokumentasi ini dirancang untuk memandu Anda merancang antarmuka pengguna (UI) modern yang reaktif, interaktif, dan ultra-premium menggunakan **React.js**, **Tailwind CSS**, dan jembatan **Inertia.js** pada framework **RustBasic**. Melalui panduan ini, Anda akan memahami pembagian struktur halaman hingga teknik penyajian aset berkinerja tinggi.

---

## 🛠️ Script Contoh

### A. Penggunaan Link Navigasi Tanpa Reload (`src/resources/js/Pages/About.jsx`)
```jsx
import React from 'react';
import { Link } from '@inertiajs/react';

export default function About() {
  return (
    <div className="p-8 bg-slate-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Tentang Kami</h1>
      {/* WAJIB menggunakan <Link> untuk navigasi SPA instan */}
      <Link href="/" className="text-indigo-400 hover:underline">
        ← Kembali ke Beranda
      </Link>
    </div>
  );
}
```

### B. Formulir Reaktif dengan Validasi Error (`src/resources/js/Pages/Contact.jsx`)
```jsx
import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Contact() {
  const { data, setData, post, processing, errors } = useForm({
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/contact/send'); // Mengirim data formulir via POST
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-800 rounded-xl">
      <textarea
        value={data.message}
        onChange={e => setData('message', e.target.value)}
        className="w-full p-2 bg-slate-950 text-white rounded-lg"
      />
      {errors.message && <span className="text-red-500 text-xs">{errors.message}</span>}
      <button type="submit" disabled={processing} className="mt-2 px-4 py-2 bg-indigo-600 rounded">
        {processing ? 'Mengirim...' : 'Kirim Pesan'}
      </button>
    </form>
  );
}
```

---

## 🔄 Perbandingan Pemakaian (Anchor Link vs Inertia Link)

Berikut adalah perbandingan pemakaian navigasi di dalam arsitektur React SPA:

| Kriteria | Tag Anchor Biasa (`<a>`) | Inertia Link (`<Link>`) |
| :--- | :--- | :--- |
| **Sintaksis** | `<a href="/about">About</a>` | `<Link href="/about">About</Link>` |
| **Siklus Request** | Memicu full round-trip reload ke server. | Mengirimkan request AJAX latar belakang. |
| **Kecepatan** | Lambat (mengunduh ulang seluruh file CSS/JS). | Sangat cepat (hanya menukar data JSON di halaman). |
| **State Preservation** | Semua state React terhapus/direset. | State React global tetap terjaga. |

---

## 📊 Tabel Ringkasan Estetika Desain & Lokasi Folder

Berikut adalah direktori penting dan utilitas styling untuk merancang halaman premium:

| Direktori / Utilitas | Jalur Folder / Kode Tailwind | Deskripsi & Kegunaan |
| :--- | :--- | :--- |
| **Halaman Utama** | `src/resources/js/Pages/` | Folder berisi halaman visual utama (.jsx) yang dipetakan oleh rute. |
| **Komponen Reusable**| `src/resources/js/Components/` | Folder berisi modular UI kecil yang digunakan berulang kali. |
| **Glassmorphism** | `bg-slate-900/60 backdrop-blur-md` | Memberikan efek kaca transparan blur yang modern dan elegan. |
| **Mesh Gradient** | `bg-gradient-to-tr from-slate-950 via-slate-900` | Kombinasi gradien warna gelap premium untuk latar belakang. |

---

## 🏁 Penutup
Dengan menerapkan teknik navigasi bebas reload, pemanfaatan hook `useForm`, dan desain bergaya glassmorphism, Anda dapat menyajikan antarmuka pengguna yang sangat cepat, indah, dan nyaman untuk digunakan.
