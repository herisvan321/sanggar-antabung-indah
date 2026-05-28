/* ---------------------------------------------------------
 * 📑 LABEL: AUTH CONTROLLER (auth/auth_controller.rs)
 * Menangani pendaftaran, login, dan logout user.
 * --------------------------------------------------------- */

use crate::app::inertia::inertia;
use crate::app::models::{User, PasswordReset};
use rustbasic_core::requests::Request;
use rustbasic_core::server::AppState;
use rustbasic_core::{IntoResponse, Response, Redirect, State};
use rustbasic_core::bcrypt::{hash, verify, DEFAULT_COST};
use rustbasic_core::uuid::Uuid;
use rustbasic_core::serde::Deserialize;
use rustbasic_core::validator::Validate;
use rustbasic_core::MailService;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub name: String,
    pub email: String,
    pub password: String,
}

impl Validate for RegisterRequest {
    fn validate(&self) -> Result<(), std::collections::HashMap<String, String>> {
        let mut errors = std::collections::HashMap::new();
        if self.name.trim().len() < 3 {
            errors.insert("name".to_string(), "Nama minimal 3 karakter".to_string());
        }
        if !self.email.contains('@') {
            errors.insert("email".to_string(), "Format email tidak valid".to_string());
        }
        if self.password.len() < 8 {
            errors.insert("password".to_string(), "Password minimal 8 karakter".to_string());
        }
        if errors.is_empty() { Ok(()) } else { Err(errors) }
    }
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
    pub remember: Option<bool>,
}

impl Validate for LoginRequest {
    fn validate(&self) -> Result<(), std::collections::HashMap<String, String>> {
        let mut errors = std::collections::HashMap::new();
        if !self.email.contains('@') {
            errors.insert("email".to_string(), "Format email tidak valid".to_string());
        }
        if errors.is_empty() { Ok(()) } else { Err(errors) }
    }
}

#[derive(Deserialize)]
pub struct ForgotPasswordRequest {
    pub email: String,
}

impl Validate for ForgotPasswordRequest {
    fn validate(&self) -> Result<(), std::collections::HashMap<String, String>> {
        let mut errors = std::collections::HashMap::new();
        if !self.email.contains('@') {
            errors.insert("email".to_string(), "Format email tidak valid".to_string());
        }
        if errors.is_empty() { Ok(()) } else { Err(errors) }
    }
}

#[derive(Deserialize)]
pub struct ResetPasswordRequest {
    pub token: String,
    pub password: String,
}

impl Validate for ResetPasswordRequest {
    fn validate(&self) -> Result<(), std::collections::HashMap<String, String>> {
        let mut errors = std::collections::HashMap::new();
        if self.password.len() < 8 {
            errors.insert("password".to_string(), "Password minimal 8 karakter".to_string());
        }
        if errors.is_empty() { Ok(()) } else { Err(errors) }
    }
}

pub struct AuthController;

impl AuthController {
    /// Menampilkan halaman login
    pub async fn login_page(req: Request) -> Response {
        inertia(&req, "Auth/Login", json!({ "title": "Login" }))
    }

    /// Menampilkan halaman register
    pub async fn register_page(req: Request) -> Response {
        inertia(&req, "Auth/Register", json!({ "title": "Daftar Akun" }))
    }

    /// Proses Pendaftaran
    pub async fn register(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        // 1. Validasi Input
        let data = match req.validate::<RegisterRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/register").into_response(),
        };

        // 2. Cek apakah email sudah terdaftar
        let existing = DB::table(&state.db, "users")
            .where_("email", &data.email)
            .first::<User>()
            .await
            .ok()
            .flatten();

        if existing.is_some() {
            req.session.set("error", "Email sudah terdaftar");
            return Redirect::to("/register").into_response();
        }

        // 3. Hash Password
        let hashed = hash(data.password, DEFAULT_COST).unwrap();

        // 4. Simpan ke Database
        let create_result = User::create(&state.db, rustbasic_core::serde_json::json!({
            "name": data.name,
            "email": data.email,
            "password": hashed,
        })).await;

        if let Err(e) = create_result {
            rustbasic_core::tracing::error!("Gagal menyimpan user: {}", e);
            req.session.set("error", "Gagal mendaftar, coba lagi.");
            return Redirect::to("/register").into_response();
        }

        req.session.set("success", "Pendaftaran berhasil! Silakan login.");
        Redirect::to("/login").into_response()
    }

    /// Proses Login
    pub async fn login(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        // 1. Validasi Input
        let data = match req.validate::<LoginRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/login").into_response(),
        };

        // 2. Ambil User dari DB
        let user = DB::table(&state.db, "users")
            .where_("email", &data.email)
            .first::<User>()
            .await
            .ok()
            .flatten();

        if let Some(u) = user {
            // 3. Verifikasi Password
            if verify(data.password, &u.password).unwrap_or(false) {
                // 4. Set Session
                req.session.set("user_id", u.id);
                req.session.set("success", "Selamat datang kembali!");
                return Redirect::to("/dashboard").into_response();
            }
        }

        req.session.set("error", "Email atau password salah");
        Redirect::to("/login").into_response()
    }

    /// Menampilkan halaman lupa password
    pub async fn forgot_password_page(req: Request) -> Response {
        inertia(&req, "Auth/ForgotPassword", json!({ "title": "Lupa Password" }))
    }

    /// Kirim link reset password
    pub async fn send_reset_link(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<ForgotPasswordRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/forgot-password").into_response(),
        };

        // 1. Cek apakah user ada
        let user = DB::table(&state.db, "users")
            .where_("email", &data.email)
            .first::<User>()
            .await
            .ok()
            .flatten();

        if let Some(u) = user {
            // 2. Generate Token
            let token = Uuid::new_v4().to_string();

            // 3. Simpan Token (Hapus token lama jika ada, lalu insert)
            let _ = DB::table(&state.db, "password_resets")
                .where_("email", &u.email)
                .delete()
                .await;
            
            let _ = PasswordReset::create(&state.db, rustbasic_core::serde_json::json!({
                "email": u.email.clone(),
                "token": token.clone(),
                "created_at": rustbasic_core::chrono::Utc::now().naive_utc(),
            })).await;

            // 4. Kirim Email (Gunakan Config::load().mail_*)
            let config = rustbasic_core::Config::load();
            let app_name = std::env::var("APP_NAME").unwrap_or_else(|_| "RustBasic".to_string());
            let reset_url = format!("{}/reset-password?token={}", config.app_url, token);

            let subject = format!("Reset Password - {}", app_name);
            let body = rustbasic_core::view::render_to_string("emails/reset.rb.html", rustbasic_core::minijinja::context! {
                app_name => app_name,
                reset_url => reset_url,
            });

            if let Err(e) = MailService::send_email(&u.email, &subject, &body).await {
                rustbasic_core::tracing::error!("Gagal mengirim email reset: {}", e);
            }

            rustbasic_core::tracing::info!("Reset link for {}: {}", u.email, reset_url);
        }

        req.session.set("success", "Jika email terdaftar, link reset password akan dikirim.");
        Redirect::to("/login").into_response()
    }

    /// Menampilkan halaman reset password
    pub async fn reset_password_page(req: Request) -> Response {
        let token = req.input_as_str("token").unwrap_or_default();
        inertia(&req, "Auth/ResetPassword", json!({ "title": "Reset Password", "token": token }))
    }

    /// Proses update password baru
    pub async fn update_password(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<ResetPasswordRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/login").into_response(),
        };

        // 1. Cari Token
        let reset = DB::table(&state.db, "password_resets")
            .where_("token", &data.token)
            .first::<PasswordReset>()
            .await
            .ok()
            .flatten();

        if let Some(r) = reset {
            // 2. Cek Kadaluarsa (60 Menit)
            let now = rustbasic_core::chrono::Utc::now().naive_utc();
            let duration = now.signed_duration_since(r.created_at);
            
            if duration.num_minutes() > 60 {
                // Hapus token yang sudah kadaluarsa
                let _ = DB::table(&state.db, "password_resets")
                    .where_("email", &r.email)
                    .delete()
                    .await;
                    
                req.session.set("error", "Tautan reset password sudah kadaluarsa (melebihi 60 menit).");
                return Redirect::to("/login").into_response();
            }

            // 3. Hash Password Baru
            let hashed = rustbasic_core::bcrypt::hash(data.password, rustbasic_core::bcrypt::DEFAULT_COST).unwrap();

            // 4. Update User
            let _ = DB::table(&state.db, "users")
                .where_("email", &r.email)
                .update(rustbasic_core::serde_json::json!({
                    "password": hashed
                }))
                .await;

            // 5. Hapus Token
            let _ = DB::table(&state.db, "password_resets")
                .where_("email", &r.email)
                .delete()
                .await;

            req.session.set("success", "Password berhasil diubah. Silakan login.");
            return Redirect::to("/login").into_response();
        }

        req.session.set("error", "Token tidak valid atau sudah kadaluarsa.");
        Redirect::to("/login").into_response()
    }

    /// Proses Logout
    pub async fn logout(req: Request) -> impl IntoResponse {
        req.session.remove("user_id");
        req.session.set("success", "Anda telah keluar.");
        Redirect::to("/").into_response()
    }
}
