# 🌐 Panduan HTTP Stack, CSRF, & Middleware

## 📝 Kata Pengantar
Selamat datang di panduan **HTTP Stack, CSRF, & Middleware**. Dokumentasi ini dirancang khusus untuk memandu Anda memahami cara server memproses permintaan request, menyaring akses melalui tumpukan middleware, menangani keamanan CSRF secara otomatis, dan mengembalikan respon yang ramah terhadap protokol komunikasi React SPA.

---

## 🛠️ Script Contoh

### A. Registrasi Middleware pada Rute (`src/routes/web.rs`)
```rust
use rustbasic_core::{Router, get, from_fn, AppState};
use crate::app::http::controllers::admin_controller;
use crate::app::http::middleware::admin_auth::admin_auth_middleware;

pub fn router() -> Router<AppState> {
    Router::new()
        // Mengamankan rute dashboard menggunakan middleware kustom
        .route("/admin/dashboard", get(admin_controller::index))
        .layer(from_fn(admin_auth_middleware))
}
```

### B. Struktur Middleware Kustom (`src/app/http/middleware/auth.rs`)
```rust
use rustbasic_core::{Request, Response, Next, IntoResponse, Redirect};

pub async fn check_auth_middleware(req: Request, next: Next) -> Response {
    // Mengecek apakah user session ID ada di memori sesi
    if req.session.get::<i32>("user_id").is_none() {
        return Redirect::to("/login").into_response();
    }
    // Teruskan request jika lolos pengecekan
    next.run(req).await
}
```

### C. Redirect 303 Khusus SPA di Controller
```rust
use rustbasic_core::{IntoResponse, Redirect};

pub async fn store_data() -> impl IntoResponse {
    // Wajib status 303 agar browser React SPA Inertia melakukan reload data
    Redirect::to("/dashboard")
}
```

## 📡 HTTP Client (Fluent API Client)

RustBasic menyediakan wrapper HTTP Client fluent yang terintegrasi secara asinkron di atas library `reqwest` dan `serde`. Fitur ini memungkinkan Anda mengirim permintaan API eksternal (seperti integrasi Payment Gateway atau API pihak ketiga) dengan sintaksis berantai secara fluent.

### A. GET Request dengan Query Parameter & Token
Anda dapat mengirimkan request GET dengan bearer token, kustom header, dan query parameter secara terantai, kemudian melakukan deserialisasi respon JSON ke typed `struct` secara otomatis:

```rust
use rustbasic_core::{Http, serde::Deserialize};

#[derive(Deserialize, Debug)]
struct GithubUser {
    id: i64,
    login: String,
    name: Option<String>,
}

let response = Http::get("https://api.github.com/users/octocat")
    .with_token("secret_github_token")
    .header("User-Agent", "RustBasic-App")
    .query(serde_json::json!({ "page": 1 }))
    .send()
    .await?;

if response.is_success() {
    let user: GithubUser = response.json().await?;
    println!("User: {} ({:?})", user.login, user.name);
}
```

### B. POST Request dengan JSON Payload & Basic Auth
Untuk request POST yang mengirimkan data JSON dan menggunakan autentikasi Basic Auth:

```rust
use rustbasic_core::{Http, serde::Serialize};

#[derive(Serialize)]
struct CreateProduct {
    name: String,
    price: u64,
}

let payload = CreateProduct {
    name: "Laptop Asus ROG".to_string(),
    price: 15_000_000,
};

let response = Http::post("https://api.example.com/products")
    .basic_auth("username_api", Some("password_api"))
    .json(&payload)
    .send()
    .await?;

if response.status().as_u16() == 201 {
    let result: serde_json::Value = response.json_value().await?;
    println!("Produk berhasil dibuat: {:?}", result);
}
```

### C. Ringkasan Method HTTP Client

| Method Builder | Deskripsi | Kasus Penggunaan |
| :--- | :--- | :--- |
| **`Http::get(url)`** | Inisialisasi request GET. | Mengambil data dari API luar. |
| **`Http::post(url)`** | Inisialisasi request POST. | Mengirimkan data baru ke API luar. |
| **`Http::put(url)`** | Inisialisasi request PUT. | Memperbarui data secara penuh di API luar. |
| **`Http::delete(url)`** | Inisialisasi request DELETE. | Menghapus data di API luar. |
| **`with_token(token)`** | Menambahkan header `Authorization: Bearer <token>`. | Autentikasi OAuth / JWT. |
| **`basic_auth(user, pass)`** | Menambahkan header `Authorization: Basic <base64>`. | Autentikasi API key basic. |
| **`header(key, val)`** | Menambahkan kustom header HTTP. | Menyertakan format data khusus (misal `User-Agent`). |
| **`query(params)`** | Menambahkan query parameter pada URL. | Pagination, filter pencarian. |
| **`json(body)`** | Menyematkan payload data JSON. | Mengirimkan request body data model. |
| **`timeout(duration)`** | Membatasi durasi tunggu request. | Mencegah aplikasi terhenti jika server luar lambat. |

---

## 🔄 Perbandingan Pemakaian (Redirect 302 vs Redirect 303)

Berikut adalah perbandingan pemakaian kode status HTTP redirect untuk aplikasi Single Page Application (SPA):

| Kode Status HTTP | Redirect 302 (Found) | Redirect 303 (See Other) |
| :--- | :--- | :--- |
| **Deskripsi** | Standard HTTP Redirect biasa. | Redirect khusus untuk mereset metode HTTP request. |
| **Respon Browser SPA** | Browser Inertia mendeteksi kegagalan karena metode request (POST/PUT) tetap dipertahankan. | Browser Inertia mendeteksi perubahan halaman dan meminta data JSON mentah baru (GET). |
| **Kasus Penggunaan** | Redirect rute statis di luar request AJAX. | Redirect wajib setelah proses submit form (POST/PUT/DELETE). |

---

## 📊 Tabel Ringkasan Respon Server

Berikut adalah jenis respon HTTP yang disediakan oleh backend RustBasic:

| Jenis Respon | Sintaks Kode | Deskripsi & Kegunaan |
| :--- | :--- | :--- |
| **Inertia Render** | `inertia(&req, "Welcome", props)` | Merender halaman React SPA dengan data props yang dinamis. |
| **Redirect SPA** | `Redirect::to("/url")` | Mengalihkan halaman browser SPA dengan status 303 secara otomatis. |
| **JSON API** | `Json(json!({ ... }))` | Mengembalikan respon JSON murni untuk integrasi API pihak ketiga. |
| **HTML Polos** | `Html(content)` | Menyajikan file teks HTML murni secara langsung ke browser. |

---

## 🏁 Penutup
Dengan memanfaatkan tumpukan middleware, perlindungan CSRF otomatis berbasis cookie, dan pemilihan respon HTTP yang tepat, aplikasi web Anda tidak hanya memiliki performa secepat kilat tetapi juga memiliki pertahanan keamanan yang sangat kokoh dari ancaman pembajakan sesi.
