oke setiap halaman /Users/herisvanhendra/Desktop/project rust/sanggar-antabung-indah/src/resources/js/Pages/Other disini memliki list jadi saya mau membuatnya menjadi masing-masing model dan migration sesuai dengan apa yang ada pada perhalaman contohnya berita itu dan datanya berulang dan minta yang terbaru jadi saya ingin juga di buatkan form yang profesional seperti wordpress lalu menggunakan npm install quill@2.0.3 dan juga upload2 mengunakan media liblary
/Users/herisvanhendra/Desktop/project rust/sanggar-antabung-indah/agents.md
setiap halaman tidak boleh loadingnya lambat, jika lambat saya akan cancel, jadi harus di optimasi
pada front-end harus terintegrasi dengan ini npm i react-loading-skeleton tampa terkecuali
bisnis logic tidak boleh di controller gunakan observer dan service, dan gunakan orm atau model dari dari /Users/herisvanhendra/Desktop/project rust/sanggar-antabung-indah/docs/cli.md
lalu hindari query n+1
database harus menggunakan migration bukan dari query mentah
sekarang saya mau agar /Users/herisvanhendra/Desktop/project rust/sanggar-antabung-indah/src/resources/js/Pages/Other/Home.tsx dibuatkan model dan migrasinya menggunakan /Users/herisvanhendra/Desktop/project rust/sanggar-antabung-indah/docs/cli.md dan ditampilkan pada dasbord sebagai menu halaman sesuai dari nama file dan di cek didalamnya menggunakan dropdown contoh halaman -> (home -> section(sesuai fungsi) buatkan juga model dan migration), (menu selanjutnya), jika ingin upload gunakan rustbasic-medialiblary yang terlah di install, lalu jika uploadnya gambar ubah menjadi webp dengna rustbasic-webp yang telah diinstall

ingat semua halaman atau menu itu adalah permission

pelajari ini
# 🖼️ rustbasic-medialibrary

Pustaka manajemen media, unggahan berkas (file upload), kompresi gambar otomatis, dan pembuatan thumbnail berkinerja tinggi untuk **RustBasic Framework**. Pustaka ini dirancang asinkron, sangat aman, dan **kompatibel di seluruh sistem operasi (Windows, macOS, Linux)** tanpa membutuhkan dependensi library C eksternal (seperti `imagemagick` atau `libvips`), berkat pemanfaatan engine pengolah gambar murni Rust (**pure-Rust `image` crate**).

---

## ✨ Fitur Utama

- **Pemasangan Zero-Config (`build.rs`)**: Secara otomatis menyuntikkan template pembantu siap pakai ke dalam `src/app/helpers/media.rs` dan mendaftarkan modul-modul modular di starter kit saat proses kompilasi pertama.
- **Validasi Unggahan Tangguh**:
  - Pembatasan ukuran file maksimal secara fleksibel (`.max_size(bytes)`).
  - Pembatasan format berkas berbasis MIME type yang ketat (`.allow_mime(mime)`).
- **Penamaan Unik & Anti-Bentrok (SHA-256 Hashing)**:
  - Setiap file yang diunggah akan dihitung nilai hash SHA-256-nya secara otomatis sebagai nama unik file fisik di disk (deduplikasi data).
  - Menghilangkan risiko bentrok nama file secara mutlak dan mencegah file ganda dengan konten yang sama untuk menghemat penyimpanan disk.
- **Pengolah Gambar Murni Rust (Pure-Rust Image Processor)**:
  - **Pembuat Thumbnail Presisi**: Melakukan pemotongan (*cropping*) dan pengubahan dimensi (*resizing*) gambar dengan algoritma interpolasi Lanczos3 berkualitas tinggi untuk menghasilkan thumbnail yang tajam.
  - **Konversi WebP Modern**: Mengonversi berkas JPEG/PNG ke dalam format `.webp` secara instan untuk memperkecil ukuran file secara drastis hingga **70% lebih ringan** tanpa mengurangi kualitas visual secara signifikan.
- **Abstraksi Penyimpanan Modular (`StorageBackend` Trait)**:
  - **`LocalStorageBackend`**: Menyimpan aset ke folder lokal (cth: `public/uploads/`).
  - **`S3StorageBackend`**: Cloud storage mock layout terstruktur yang siap dihubungkan langsung ke AWS S3, Cloudflare R2, atau Google Cloud Storage.

---

## 📊 Integrasi Database & Kategorisasi Otomatis

Pustaka ini secara cerdas memadukan penyimpanan disk fisik dengan pencatatan metadata di database relasional melalui SQLx atau skema Blueprint bawaan.

### 1. Struktur Tabel Database (`media`)

Setiap unggahan berkas generik dicatat di dalam tabel `media` dengan skema relasional berikut:

| Nama Kolom | Tipe Data | Kunci | Deskripsi |
| :--- | :--- | :---: | :--- |
| `id` | `INTEGER` | **PK** | Primary key unik dengan auto-increment. |
| `filename` | `VARCHAR` | **Unique** | Nama unik file fisik di disk (SHA-256 hash konten). |
| `original_name` | `VARCHAR` | - | Nama asli berkas saat pertama kali diunggah pengguna. |
| `mime_type` | `VARCHAR` | - | MIME type resmi dari berkas (cth: `image/webp`, `application/pdf`). |
| `category` | `VARCHAR` | **Index** | Kategori berkas hasil deteksi instan oleh pengolah media. |
| `size` | `BIGINT` | - | Ukuran berkas fisik dalam satuan bytes. |
| `url` | `VARCHAR` | - | URL publik relatif untuk merender aset di web browser. |
| `created_at` | `DATETIME` | - | Waktu pembuatan baris berkas. |
| `updated_at` | `DATETIME` | - | Waktu modifikasi baris berkas terakhir. |

### 2. Matriks Kategorisasi Otomatis Berkas (MIME-to-Category)

Saat data masuk, berkas **langsung dikategorikan** secara instan ke salah satu kategori utama di bawah ini:

| Kategori (`category`) | Indikator MIME Type | Ekstensi Contoh |
| :--- | :--- | :--- |
| **`image`** | `image/*` | `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg` |
| **`video`** | `video/*` | `.mp4`, `.mkv`, `.avi`, `.mov`, `.webm` |
| **`audio`** | `audio/*` | `.mp3`, `.wav`, `.ogg`, `.aac`, `.flac` |
| **`document`** | `application/pdf`, `text/*`, MIME mengandung `document`/`sheet`/`presentation`/`msword` | `.pdf`, `.txt`, `.docx`, `.xlsx`, `.pptx`, `.csv` |
| **`archive`** | MIME mengandung `zip`/`tar`/`rar`/`compressed`/`archive` | `.zip`, `.tar.gz`, `.rar`, `.7z` |
| **`other`** | Format lain yang tidak memenuhi kriteria di atas | `.bin`, `.dat`, `.exe` |

---

## 🚀 Template Pembantu Siap Pakai (Scaffold Presets)

Setelah paket diaktifkan, helper siap pakai otomatis terpasang di `src/app/helpers/media.rs` proyek Anda:

1. **`initialize_media_library(upload_dir: &str) -> MediaLibrary`**: Inisialisasi media khusus gambar & PDF dengan batas ukuran 10MB.
2. **`initialize_generic_media_library(upload_dir: &str) -> MediaLibrary`**: Inisialisasi media generik tanpa batasan format (mengizinkan ZIP, MP4, Excel, PDF, dll) dengan batas maksimal 100MB.
3. **`handle_user_avatar_upload(bytes, original_name, mime)`**: Alur avatar lengkap (simpan -> WebP transcoder -> crop 150x150 -> pembersihan cache file mentah).
4. **`handle_generic_file_upload(bytes, original_name, mime, target_subfolder)`**: Alur upload generik instan yang dapat menyimpan file jenis apa saja (MIME-free) ke dalam subfolder pilihan Anda di bawah direktori `public/uploads/` dengan penamaan SHA-256 hash unik secara otomatis.

---

## 📂 Contoh Penggunaan Praktis

### 1. Inisialisasi Media Library (RustBasic Handler)

Anda dapat mengambil data berkas berformat Base64 langsung dari JSON request input, lalu memprosesnya melalui helper asinkron:

```rust
use rustbasic_core::{Request, Response, ResponseHelper};
use crate::app::helpers::media::handle_user_avatar_upload;

pub async fn upload_avatar_handler(req: Request) -> Response {
    // 1. Ambil data Base64 berkas avatar dari request input JSON
    let base64_image = match req.input_as_str("avatar") {
        Some(img) => img,
        None => return ResponseHelper::error("Berkas avatar (base64) tidak ditemukan."),
    };

    // 2. Bersihkan metadata data URL jika ada (misal: "data:image/png;base64,...")
    let clean_base64 = if let Some(index) = base64_image.find("base64,") {
        &base64_image[index + 7..]
    } else {
        base64_image
    };

    // Decode base64 menjadi raw bytes
    let file_bytes = match rustbasic_core::base64::decode(clean_base64) {
        Ok(bytes) => bytes,
        Err(_) => return ResponseHelper::error("Format base64 tidak valid."),
    };

    let file_name = req.input_as_str("filename").unwrap_or("avatar.png");
    let mime_type = req.input_as_str("mime_type").unwrap_or("image/png");

    // 3. Gunakan helper media untuk validasi, konversi WebP, dan crop 150x150
    match handle_user_avatar_upload(&file_bytes, file_name, mime_type) {
        Ok(media_file) => {
            ResponseHelper::json(serde_json::json!({
                "status": "success",
                "message": "Avatar berhasil diunggah dan dioptimalkan!",
                "data": {
                    "filename": media_file.filename,
                    "original_name": media_file.original_name,
                    "size": media_file.size,
                    "url": media_file.url // URL relatif siap pakai (cth: /uploads/avatars/abc_thumb_150x150.png)
                }
            }))
        }
        Err(err) => {
            ResponseHelper::error(&format!("Gagal memproses avatar: {}", err))
        }
    }
}
```

---

### 2. Membuat Instansi Media Library Kustom Sendiri

Jika Anda ingin menyimpan berkas non-gambar (misal file laporan PDF atau CSV) dengan folder kustom, Anda dapat membangunnya secara manual:

```rust
use std::sync::Arc;
use rustbasic_medialibrary::{MediaLibrary, LocalStorageBackend};

fn process_invoice_upload(pdf_bytes: &[u8], filename: &str) -> Result<(), String> {
    // 1. Arahkan direktori penyimpanan ke public/uploads/invoices
    let backend = Arc::new(LocalStorageBackend::new("public/uploads/invoices"));

    // 2. Batasi hanya menerima format PDF dengan ukuran maksimal 5MB
    let library = MediaLibrary::new(backend)
        .max_size(5 * 1024 * 1024)
        .allow_mime("application/pdf");

    // 3. Lakukan upload (berkas akan otomatis diberi nama SHA-256 unik agar aman)
    let media = library.upload(filename, "application/pdf", pdf_bytes)?;

    println!("📄 Invoice PDF berhasil diunggah ke: {}", media.url);
    Ok(())
}
```

---

## 🧪 Uji Coba Cepat (Unit Tests)

Jalankan perintah pengujian unit murni di bawah ini untuk memverifikasi fungsionalitas validasi, hashing SHA-256 unik, pengubahan ukuran Lanczos3, konversi WebP, serta pembersihan file:

```bash
cd rustbasic-medialibrary
cargo test -- --nocapture
```

Pustaka `rustbasic-medialibrary` memberikan performa pemrosesan media tingkat tinggi, aman, dan hemat bandwidth untuk website modern Anda!

dan ini # 🖼️ rustbasic-webp

Package **WebP Image Processing & Optimization** yang sangat elegan, cepat, dan terintegrasi penuh untuk framework **RustBasic**, mendukung kompresi kualitas tinggi dan *dynamic resizing* otomatis.

Dirancang khusus untuk ekosistem **RustBasic** dan aplikasi modern berbasis **React + Inertia SPA** maupun **MiniJinja MPA**, package ini memungkinkan Anda mengoptimalkan ukuran gambar yang diunggah pengguna menjadi format WebP berkinerja tinggi secara instan sebelum disimpan ke media penyimpanan.

---

## ✨ Fitur Premium

- **High-Performance WebP Encoding**: Ditenagai oleh encoder libwebp native (via safe Rust interface) dengan kualitas kompresi luar biasa.
- **Dynamic Resize with Aspect Ratio**: Mengubah ukuran gambar (resize) secara otomatis dengan tetap mempertahankan rasio aspek menggunakan Lanczos3 filter beresolusi tajam.
- **Zero-Config Scaffolding**: Cukup tambahkan dependensi, dan pustaka akan otomatis merakit modul `src/app/helpers/webp.rs` pada proyek Anda.
- **Integration Ready**: Siap digunakan langsung di Controller untuk memproses file upload atau byte gambar secara asinkron.

---

## 🚀 Panduan Instalasi & Penggunaan Lengkap

### 1. Instalasi
Tambahkan `rustbasic-webp` ke dalam berkas `Cargo.toml` pada proyek aplikasi Anda:

```toml
[dependencies]
rustbasic-webp = "0.0"
```

---

### 2. Inisialisasi Otomatis (Magic Scaffolding)
Cukup jalankan build pada proyek Anda, dan `rustbasic-webp` akan secara otomatis membuat dan mendaftarkan helper yang diperlukan:

```bash
cargo build
```

Perintah ini akan secara otomatis membuat:
- 📂 **Helpers file**: `src/app/helpers/webp.rs` berisi fungsi wrapper konversi file & memori.
- 🔗 **Module Registry**: Mendaftarkan `pub mod helpers;` di `src/app/mod.rs` dan `pub mod webp;` di `src/app/helpers/mod.rs`.

---

### 3. Penggunaan di Controller (Contoh Handler RustBasic)

Di bawah ini adalah contoh bagaimana menerima unggahan berkas gambar (dikodekan dalam Base64 atau byte biner), mengonversinya menjadi WebP dengan kualitas 80% (sekaligus memperkecil dimensi maksimal ke 800px), lalu menyimpannya:

```rust
use crate::app::helpers::webp;
use rustbasic_core::{Request, IntoResponse, ResponseHelper};
use std::fs;

pub async fn upload_avatar(req: Request) -> impl IntoResponse {
    // Ambil data Base64 gambar dari input request
    if let Some(base64_str) = req.input_as_str("avatar") {
        // Dekode data Base64 ke bytes biner
        // Catatan: Anda bisa menggunakan pustaka dekode base64 bawaan atau standar
        if let Ok(data) = rustbasic_core::base64::decode(base64_str) {
            // Konversi gambar langsung ke WebP dengan kualitas 80% & lebar/tinggi maks 800px
            match webp::to_webp_resized(&data, 800, 800, 80.0) {
                Ok(webp_data) => {
                    // Simpan gambar WebP yang telah dioptimalkan
                    let file_name = format!("storage/app/public/avatar_{}.webp", chrono::Local::now().timestamp());
                    if fs::write(&file_name, webp_data).is_ok() {
                        return ResponseHelper::success(&format!("Avatar berhasil disimpan: {}", file_name));
                    }
                    return ResponseHelper::error("Gagal menulis file gambar ke penyimpanan");
                }
                Err(e) => return ResponseHelper::error(&format!("Gagal memproses gambar: {}", e)),
            }
        }
    }
    ResponseHelper::error("File avatar tidak valid")
}
```

---

### 4. Penggunaan Fungsi Memori & File Langsung

```rust
use crate::app::helpers::webp;

// Contoh 1: Konversi file lokal JPEG ke WebP
webp::convert_file_to_webp("raw_photo.jpg", "optimized_photo.webp", 85.0)?;

// Contoh 2: Konversi buffer gambar biner mentah
let original_bytes: Vec<u8> = load_image_bytes();
let webp_bytes = webp::to_webp(&original_bytes, 90.0)?;
```

---

## 📄 Lisensi

Package ini dirilis di bawah lisensi **MIT**. Anda bebas memodifikasi dan mendistribusikannya untuk kebutuhan komersial maupun sumber terbuka.


