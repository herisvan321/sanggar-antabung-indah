use crate::app::http::controllers::{auth, admin, dashboard_controller};
use crate::app::http::middleware::activity_log::activity_log_middleware;
use crate::app::http::middleware::auth::auth_middleware;
use rustbasic_core::{Router, get, post, from_fn, AppState};
use crate::routes::auth as auth_routes;
use crate::app::http::controllers::welcome_controller;

pub fn router() -> Router<AppState> {
    let auth_protected_routes = Router::new()
        .route("/dashboard", get(dashboard_controller::DashboardController::index))
        .route("/logout", post(auth::auth_controller::AuthController::logout))
        
        // Admin Users CRUD
        .route("/dashboard/users", get(admin::user_controller::UserController::index))
        .route("/dashboard/users", post(admin::user_controller::UserController::store))
        .route("/dashboard/users/:id", post(admin::user_controller::UserController::update))
        .route("/dashboard/users/:id/delete", post(admin::user_controller::UserController::delete))
        
        // Admin RBAC CRUD
        .route("/dashboard/rbac", get(admin::rbac_controller::RbacController::index))
        .route("/dashboard/rbac/role", post(admin::rbac_controller::RbacController::store_role))
        .route("/dashboard/rbac/role/:id", post(admin::rbac_controller::RbacController::update_role))
        .route("/dashboard/rbac/role/:id/delete", post(admin::rbac_controller::RbacController::delete_role))
        .route("/dashboard/rbac/permission", post(admin::rbac_controller::RbacController::store_permission))
        .route("/dashboard/rbac/permission/:id", post(admin::rbac_controller::RbacController::update_permission))
        .route("/dashboard/rbac/permission/:id/delete", post(admin::rbac_controller::RbacController::delete_permission))
        
        // Admin Matrix
        .route("/dashboard/matrix", get(admin::rbac_controller::RbacController::matrix))
        .route("/dashboard/matrix/toggle", post(admin::rbac_controller::RbacController::toggle_permission))
        
        // Admin Profile
        .route("/dashboard/profile", get(admin::profile_controller::ProfileController::edit))
        .route("/dashboard/profile", post(admin::profile_controller::ProfileController::update))
        
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
        .layer(from_fn(activity_log_middleware))
}
