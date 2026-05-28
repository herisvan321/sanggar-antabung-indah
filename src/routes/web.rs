use crate::app::http::controllers::{auth, dashboard_controller};
use crate::app::http::middleware::auth::auth_middleware;
use rustbasic_core::{Router, get, post, from_fn, AppState};
use crate::routes::auth as auth_routes;
use crate::app::http::controllers::welcome_controller;

pub fn router() -> Router<AppState> {
    let auth_protected_routes = Router::new()
        .route("/dashboard", get(dashboard_controller::DashboardController::index))
        .route("/logout", post(auth::auth_controller::AuthController::logout))
        .layer(from_fn(auth_middleware));

    Router::new()
        .route("/a", get(welcome_controller::index))
        // .route("/about", get(welcome_controller::about))
        // .route("/dev", get(welcome_controller::dev_info))
        .route("/", get(welcome_controller::other))
        .route("/profil", get(welcome_controller::other_profil))
        .route("/filosofi", get(welcome_controller::other_filosofi))
        .route("/galeri", get(welcome_controller::other_galeri))
        .route("/jadwal", get(welcome_controller::other_jadwal))
        .route("/program", get(welcome_controller::other_program))
        .route("/join", get(welcome_controller::other_join))
        .route("/berita", get(welcome_controller::other_berita))
        .route("/booking", get(welcome_controller::other_booking))
        .route("/kontak", get(welcome_controller::other_kontak))
        .route("/sop", get(welcome_controller::other_sop))
        .merge(auth_routes::router())
        .merge(auth_protected_routes)
        
        
        .route("/inline", get(|| async { "Ini rute dalam satu baris!" }))
}
