# 🔤 Panduan Pengolahan String & Fluent Stringable

Dokumentasi ini menjelaskan penggunaan utilitas manipulasi string bawaan **RustBasic** menggunakan helper `Str` dan kelas fluent `Stringable` yang kuat dan modular.

---

## 🚀 Memulai Penggunaan

Seluruh utilitas string berada di dalam modul `rustbasic_core::support::Str`. Anda dapat mengimpornya langsung di controller atau berkas logika lainnya:

```rust
use rustbasic_core::support::Str;
```

---

## 🛠️ Daftar Method Static Helper (`Str`)

### 1. `Str::of(value: &str) -> Stringable`
Membuat instance `Stringable` baru untuk melakukan perantaian (chaining) operasi string:
```rust
let fluent = Str::of("Halo Dunia");
```

### 2. `Str::uuid() -> String`
Menghasilkan string UUID (version 4) acak yang valid:
```rust
let token = Str::uuid(); // Contoh: "d2d2a450-4d56-42d4-a8eb-ccdfa2ef0413"
```

### 3. `Str::random(length: usize) -> String`
Menghasilkan string acak alfanumerik sepanjang jumlah karakter yang diinginkan:
```rust
let key = Str::random(16); // Contoh: "aB8f7K2lPn5mQqZs"
```

### 4. `Str::slug(title: &str) -> String`
Mengubah teks menjadi URL-friendly slug (huruf kecil, dipisah oleh tanda hubung):
```rust
let slug = Str::slug("Panduan Belajar RustBasic"); // "panduan-belajar-rustbasic"
```

### 5. `Str::after(subject: &str, search: &str) -> String`
Mengambil porsi string setelah kemunculan pertama karakter pencari:
```rust
let result = Str::after("user-profile-avatar", "profile-"); // "avatar"
```

### 6. `Str::before(subject: &str, search: &str) -> String`
Mengambil porsi string sebelum kemunculan pertama karakter pencari:
```rust
let result = Str::before("user-profile-avatar", "-profile"); // "user"
```

### 7. `Str::between(subject: &str, from: &str, to: &str) -> String`
Mengambil bagian string di antara dua karakter penanda:
```rust
let text = Str::between("hello [world] rust", "[", "]"); // "world"
```

### 8. `Str::contains(haystack: &str, needle: &str) -> bool`
Memeriksa apakah string mengandung kata pencari:
```rust
let has_rust = Str::contains("belajar rustbasic", "rust"); // true
```

### 9. `Str::starts_with(subject: &str, needle: &str) -> bool`
Memeriksa apakah string diawali dengan teks tertentu:
```rust
let match_start = Str::starts_with("prefix_data", "prefix"); // true
```

### 10. `Str::ends_with(subject: &str, needle: &str) -> bool`
Memeriksa apakah string diakhiri dengan teks tertentu:
```rust
let match_end = Str::ends_with("data_suffix", "suffix"); // true
```

### 11. `Str::is_uuid(value: &str) -> bool`
Memeriksa apakah string merupakan format UUID v4 yang valid:
```rust
let is_valid = Str::is_uuid("123e4567-e89b-12d3-a456-426614174000"); // true
```

### 12. `Str::lower(value: &str) -> String`
Mengubah string ke huruf kecil (Unicode-Safe):
```rust
let lower = Str::lower("RUSTBASIC"); // "rustbasic"
```

### 13. `Str::upper(value: &str) -> String`
Mengubah string ke huruf besar (Unicode-Safe):
```rust
let upper = Str::upper("rustbasic"); // "RUSTBASIC"
```

### 14. `Str::limit(value: &str, max: usize, end: &str) -> String`
Membatasi jumlah karakter string dan menambahkan akhiran pemotong:
```rust
let cut = Str::limit("Teks yang sangat panjang sekali", 15, "..."); // "Teks yang sanga..."
```

### 15. `Str::replace(search: &str, replace: &str, subject: &str) -> String`
Menggantikan semua kemunculan kata kunci target dengan kata kunci baru:
```rust
let replaced = Str::replace("pagi", "malam", "selamat pagi"); // "selamat malam"
```

---

## ⛓️ Fluent Stringable (Method Chaining)

Sistem `Stringable` memungkinkan Anda merantai beberapa operasi modifikasi string secara berturut-turut dengan sintaksis yang bersih secara fluent.

Gunakan method static `Str::of()` untuk membuat objek builder `Stringable` dan akhiri dengan `.get()` untuk mendapatkan nilai string akhirnya.

### Contoh Pemakaian:

```rust
use rustbasic_core::support::Str;

let result = Str::of(" Panduan  Belajar   Rust  ")
    .append(" Keren  Sekali ")
    .upper()
    .slug()
    .get();

// Hasil: "panduan-belajar-rust-keren-sekali"
```

### Method Chaining yang Didukung:
Setiap method ini mengembalikan instance `Stringable` kembali sehingga dapat langsung dirantai:

*   `.upper()`: Mengubah teks ke huruf besar.
*   `.lower()`: Mengubah teks ke huruf kecil.
*   `.append(val: &str)`: Menambahkan string di akhir.
*   `.prepend(val: &str)`: Menambahkan string di awal.
*   `.slug()`: Mengubah teks menjadi slug URL.
*   `.after(search: &str)`: Mengambil teks setelah pencarian.
*   `.before(search: &str)`: Mengambil teks sebelum pencarian.
*   `.between(from: &str, to: &str)`: Mengambil teks di antara dua tanda.
*   `.limit(max: usize, end: &str)`: Membatasi panjang teks.
*   `.replace(search: &str, replace: &str)`: Mengganti teks pencarian.
*   **.get() -> String**: Mengembalikan nilai string akhir (mengonsumsi builder).
