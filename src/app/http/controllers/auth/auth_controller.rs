/* ---------------------------------------------------------
 * 📑 LABEL: AUTH CONTROLLER (auth/auth_controller.rs)
 * Menangani pendaftaran, login, dan logout user.
 * --------------------------------------------------------- */

use crate::app::inertia::inertia;
use crate::app::services::auth_service::AuthService;
use rustbasic_core::requests::Request;
use rustbasic_core::server::AppState;
use rustbasic_core::{IntoResponse, Response, Redirect, State};
use rustbasic_core::serde::Deserialize;
use rustbasic_core::validator::Validate;
use rustbasic_core::serde_json::json;
use std::collections::HashMap;

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub name: String,
    pub email: String,
    pub password: String,
}

impl Validate for RegisterRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errors = HashMap::new();
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
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errors = HashMap::new();
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
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errors = HashMap::new();
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
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errors = HashMap::new();
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
        let data = match req.validate::<RegisterRequest>() {
            Ok(d) => d,
            Err(res) => return res.into_response(),
        };

        let service = AuthService::new(state.db.clone());
        match service.register(data.name, data.email, data.password).await {
            Ok(_) => {
                req.session.set("success", "Pendaftaran berhasil! Silakan login.");
                Redirect::to("/login").into_response()
            }
            Err(err_msg) => {
                req.session.set("error", err_msg);
                Redirect::to("/register").into_response()
            }
        }
    }

    /// Proses Login
    pub async fn login(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<LoginRequest>() {
            Ok(d) => d,
            Err(res) => return res.into_response(),
        };

        let service = AuthService::new(state.db.clone());
        match service.login(data.email, data.password).await {
            Ok(user) => {
                req.session.set("user_id", user.id);
                req.session.set("success", "Selamat datang kembali!");
                Redirect::to("/dashboard").into_response()
            }
            Err(err_msg) => {
                req.session.set("error", err_msg);
                Redirect::to("/login").into_response()
            }
        }
    }

    /// Menampilkan halaman lupa password
    pub async fn forgot_password_page(req: Request) -> Response {
        inertia(&req, "Auth/ForgotPassword", json!({ "title": "Lupa Password" }))
    }

    /// Kirim link reset password
    pub async fn send_reset_link(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<ForgotPasswordRequest>() {
            Ok(d) => d,
            Err(res) => return res.into_response(),
        };

        let service = AuthService::new(state.db.clone());
        let _ = service.send_reset_link(data.email).await;

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
            Err(res) => return res.into_response(),
        };

        let service = AuthService::new(state.db.clone());
        match service.update_password(data.token, data.password).await {
            Ok(_) => {
                req.session.set("success", "Password berhasil diubah. Silakan login.");
                Redirect::to("/login").into_response()
            }
            Err(err_msg) => {
                req.session.set("error", err_msg);
                Redirect::to("/login").into_response()
            }
        }
    }

    /// Proses Logout
    pub async fn logout(req: Request) -> impl IntoResponse {
        req.session.remove("user_id");
        req.session.set("success", "Anda telah keluar.");
        Redirect::to("/").into_response()
    }
}
