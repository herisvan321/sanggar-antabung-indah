use rustbasic_core::{Router, get, post, from_fn, AppState};
use crate::app::http::controllers::auth;
use crate::app::http::middleware::auth::guest_middleware;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/login", get(auth::auth_controller::AuthController::login_page))
        .route("/login", post(auth::auth_controller::AuthController::login))
        .route("/register", get(auth::auth_controller::AuthController::register_page))
        .route("/register", post(auth::auth_controller::AuthController::register))
        .route("/forgot-password", get(auth::auth_controller::AuthController::forgot_password_page))
        .route("/forgot-password", post(auth::auth_controller::AuthController::send_reset_link))
        .route("/reset-password", get(auth::auth_controller::AuthController::reset_password_page))
        .route("/reset-password", post(auth::auth_controller::AuthController::update_password))
        .layer(from_fn(guest_middleware))
}
