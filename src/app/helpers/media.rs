/* ---------------------------------------------------------
 * 🖼️ LABEL: MEDIA LIBRARY HELPERS (app/helpers/media.rs)
 * Pengolahan upload berkas, validasi MIME, kompresi WebP, dan thumbnail.
 * --------------------------------------------------------- */

use std::sync::Arc;
use rustbasic_medialibrary::{MediaLibrary, LocalStorageBackend, MediaFile};

/// Menginisialisasi instansi MediaLibrary lokal bawaan khusus gambar & PDF
pub fn initialize_media_library(upload_dir: &str) -> MediaLibrary {
    // 1. Buat local storage backend (menyimpan aset ke folder publik)
    let backend = Arc::new(LocalStorageBackend::new(upload_dir));

    // 2. Buat manager dengan batas maksimal 10MB dan pembatasan MIME type
    MediaLibrary::new(backend)
        .max_size(10 * 1024 * 1024) // Maksimal 10MB
        .allow_mime("image/jpeg")
        .allow_mime("image/png")
        .allow_mime("image/webp")
        .allow_mime("application/pdf")
}

/// Menginisialisasi instansi MediaLibrary lokal generik untuk SEMUA jenis berkas (ZIP, PDF, MP4, Excel, dll)
pub fn initialize_generic_media_library(upload_dir: &str) -> MediaLibrary {
    let backend = Arc::new(LocalStorageBackend::new(upload_dir));
    
    // Tanpa mendaftarkan allow_mime, MediaLibrary mengizinkan SEMUA format berkas secara default!
    MediaLibrary::new(backend)
        .max_size(100 * 1024 * 1024) // Batas 100MB untuk semua jenis berkas generik
}

/// Menangani unggahan avatar pengguna: validasi, ubah ke WebP, dan crop kotak 150x150!
pub fn handle_user_avatar_upload(
    raw_bytes: &[u8],
    original_name: &str,
    mime_type: &str
) -> Result<MediaFile, String> {
    // 1. Inisialisasi media library pada folder public/uploads/avatars
    let library = initialize_media_library("public/uploads/avatars");

    // 2. Upload file asli (akan divalidasi MIME type dan ukuran filenya)
    let original_file = library.upload(original_name, mime_type, raw_bytes)?;

    println!("🖼️ [Media Library] Berkas avatar berhasil diunggah: {}", original_file.filename);

    // 3. Konversi format berkas gambar ke WebP modern agar sangat hemat bandwidth!
    let webp_file = library.convert_to_webp(&original_file)?;
    println!("⚡ [Media Library] Transcoded ke WebP: {} -> {}", original_file.filename, webp_file.filename);

    // 4. Potong (crop) dan ubah ukuran (resize) menjadi avatar kotak presisi 150x150 piksel
    let avatar_thumbnail = library.create_thumbnail(&webp_file, 150, 150)?;
    println!("✅ [Media Library] Avatar thumbnail siap pakai: {}", avatar_thumbnail.filename);

    // Hapus file asli dan file Webp mentah agar ruang penyimpanan lokal efisien dan bersih!
    let _ = library.delete(&original_file);
    if webp_file.filename != avatar_thumbnail.filename {
        let _ = library.delete(&webp_file);
    }

    Ok(avatar_thumbnail)
}

/// Menangani unggahan berkas APAPUN (PDF, ZIP, CSV, MP4, docx, xlsx, dll) ke subfolder tujuan
pub fn handle_generic_file_upload(
    raw_bytes: &[u8],
    original_name: &str,
    mime_type: &str,
    target_subfolder: &str
) -> Result<MediaFile, String> {
    // 1. Inisialisasi library di folder public/uploads/<target_subfolder>
    let destination = format!("public/uploads/{}", target_subfolder.trim_matches('/'));
    let library = initialize_generic_media_library(&destination);

    // 2. Unggah berkas secara generik (nama berkas SHA-256 unik)
    let uploaded_file = library.upload(original_name, mime_type, raw_bytes)?;
    
    println!("📁 [Media Library] Berkas non-gambar berhasil diunggah: {} -> {}", uploaded_file.original_name, uploaded_file.url);
    Ok(uploaded_file)
}
