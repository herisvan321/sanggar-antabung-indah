use crate::app::inertia;
use rustbasic_core::requests::Request;
use rustbasic_core::responses::ResponseHelper;
use rustbasic_core::server::AppState;
use rustbasic_core::{State, IntoResponse};
use rustbasic_core::serde_json::json;

pub async fn index(req: Request) -> impl IntoResponse {
    // Cek apakah fitur Auth sudah terinstal (scaffolded)
    let auth_installed = std::path::Path::new("src/app/http/controllers/auth").exists();
    let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
    let is_logged_in = user_id > 0;

    // Render komponen "Welcome" melalui Inertia dengan data props
    inertia(&req, "Welcome", json!({
        "title": "Selamat Datang di RustBasic",
        "auth_installed": auth_installed,
        "is_logged_in": is_logged_in,
    }))
}

pub async fn about(req: Request) -> impl IntoResponse {
    // Render komponen "About" melalui Inertia dengan data props
    inertia(&req, "About", json!({
        "title": "Tentang RustBasic SPA",
        "description": "Aplikasi ini telah sepenuhnya bermigrasi dari Multi-Page Application (MPA) tradisional berbasis template Minijinja menjadi Single Page Application (SPA) modern yang ditenagai oleh React.js dan Inertia.js pada backend kustom Rust!",
        "version": "1.0.0",
        "backend": "Rust (Custom HTTP Engine)",
        "frontend": "React.js + Vite",
        "bridge": "Inertia.js"
    }))
}

pub async fn dev_info(State(state): State<AppState>, _req: Request) -> impl IntoResponse {
    ResponseHelper::json(rustbasic_core::serde_json::json!({
        "status": "success",
        "app_name": state.config.app_name,
        "environment": if state.config.app_debug { "development" } else { "production" },
        "timezone": state.config.app_timezone,
        "rate_limit": state.config.app_limit_request
    }))
}
pub async fn other(req: Request) -> impl IntoResponse {
    inertia(&req, "Other/Home", json!({}))
}

pub async fn other_profil(req: Request) -> impl IntoResponse {
    inertia(&req, "Other/Profil", json!({}))
}

pub async fn other_filosofi(req: Request) -> impl IntoResponse {
    inertia(&req, "Other/Filosofi", json!({}))
}

pub async fn other_galeri(req: Request) -> impl IntoResponse {
    inertia(&req, "Other/Galeri", json!({}))
}

pub async fn other_jadwal(req: Request) -> impl IntoResponse {
    inertia(&req, "Other/Jadwal", json!({}))
}

pub async fn other_program(req: Request) -> impl IntoResponse {
    inertia(&req, "Other/Program", json!({}))
}

pub async fn other_join(req: Request) -> impl IntoResponse {
    inertia(&req, "Other/Join", json!({}))
}

pub async fn other_berita(req: Request) -> impl IntoResponse {
    inertia(&req, "Other/Berita", json!({}))
}

pub async fn other_booking(req: Request) -> impl IntoResponse {
    inertia(&req, "Other/Booking", json!({}))
}

pub async fn other_kontak(req: Request) -> impl IntoResponse {
    inertia(&req, "Other/Kontak", json!({}))
}

pub async fn other_sop(req: Request) -> impl IntoResponse {
    inertia(&req, "Other/Sop", json!({}))
}

