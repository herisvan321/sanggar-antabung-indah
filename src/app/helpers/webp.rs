/* ---------------------------------------------------------
 * 📑 LABEL: WEBP UTILITY HELPER (app/helpers/webp.rs)
 * Otomatis dikonfigurasi dan dipelihara oleh rustbasic-webp.
 * --------------------------------------------------------- */

use std::path::Path;
pub use rustbasic_webp::ImageInfo;

/// Konversi gambar mentah (JPEG/PNG/dll) menjadi format WebP berkinerja tinggi.
pub fn to_webp(image_data: &[u8], quality: f32) -> Result<Vec<u8>, String> {
    rustbasic_webp::convert_to_webp(image_data, quality)
}

/// Konversi gambar mentah menjadi WebP dengan mengubah dimensi maksimal (resize).
pub fn to_webp_resized(image_data: &[u8], max_width: u32, max_height: u32, quality: f32) -> Result<Vec<u8>, String> {
    rustbasic_webp::convert_and_resize(image_data, max_width, max_height, quality)
}

/// Konversi gambar mentah menjadi WebP dengan mengubah lebar maksimal (resize width) menjaga aspek rasio.
pub fn to_webp_resized_width(image_data: &[u8], max_width: u32, quality: f32) -> Result<Vec<u8>, String> {
    rustbasic_webp::convert_and_resize_width(image_data, max_width, quality)
}

/// Konversi gambar mentah menjadi WebP dengan mengubah tinggi maksimal (resize height) menjaga aspek rasio.
pub fn to_webp_resized_height(image_data: &[u8], max_height: u32, quality: f32) -> Result<Vec<u8>, String> {
    rustbasic_webp::convert_and_resize_height(image_data, max_height, quality)
}

/// Mendapatkan informasi metadata (lebar, tinggi, format, byte) dari data gambar biner.
pub fn get_image_info(image_data: &[u8]) -> Result<ImageInfo, String> {
    rustbasic_webp::get_image_info(image_data)
}

/// Konversi gambar dari file lokal dan simpan langsung ke file WebP baru.
pub fn convert_file_to_webp<P: AsRef<Path>>(input_path: P, output_path: P, quality: f32) -> Result<(), String> {
    rustbasic_webp::convert_file_to_webp(input_path, output_path, quality)
}
