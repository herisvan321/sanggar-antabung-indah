use crate::app::http::controllers::{auth, admin, dashboard_controller};
use crate::app::http::middleware::activity_log::activity_log_middleware;
use crate::app::http::middleware::auth::auth_middleware;
use crate::app::http::middleware::permission::permission_middleware;
use rustbasic_core::{Router, get, post, from_fn, AppState};
use crate::routes::auth as auth_routes;
use crate::app::http::controllers::welcome_controller;

pub fn router() -> Router<AppState> {
    let user_routes = Router::new()
        .route("/dashboard/users", get(admin::user_controller::UserController::index))
        .route("/dashboard/users", post(admin::user_controller::UserController::store))
        .route("/dashboard/users/:id", post(admin::user_controller::UserController::update))
        .route("/dashboard/users/:id/delete", post(admin::user_controller::UserController::delete))
        .layer(from_fn(|req, next| permission_middleware(req, next, "manage_users")));

    let rbac_routes = Router::new()
        .route("/dashboard/rbac", get(admin::rbac_controller::RbacController::index))
        .route("/dashboard/rbac/role", post(admin::rbac_controller::RbacController::store_role))
        .route("/dashboard/rbac/role/:id", post(admin::rbac_controller::RbacController::update_role))
        .route("/dashboard/rbac/role/:id/delete", post(admin::rbac_controller::RbacController::delete_role))
        .route("/dashboard/rbac/permission", post(admin::rbac_controller::RbacController::store_permission))
        .route("/dashboard/rbac/permission/:id", post(admin::rbac_controller::RbacController::update_permission))
        .route("/dashboard/rbac/permission/:id/delete", post(admin::rbac_controller::RbacController::delete_permission))
        .layer(from_fn(|req, next| permission_middleware(req, next, "manage_roles")));

    let matrix_routes = Router::new()
        .route("/dashboard/matrix", get(admin::rbac_controller::RbacController::matrix))
        .route("/dashboard/matrix/toggle", post(admin::rbac_controller::RbacController::toggle_permission))
        .layer(from_fn(|req, next| permission_middleware(req, next, "manage_permissions")));

    let setting_routes = Router::new()
        .route("/dashboard/settings", get(admin::setting_controller::SettingController::index))
        .route("/dashboard/settings", post(admin::setting_controller::SettingController::update))
        .layer(from_fn(|req, next| permission_middleware(req, next, "manage_settings")));

    let page_routes = Router::new()
        .route("/dashboard/pages", get(admin::page_content_controller::PageContentController::index))
        .route("/dashboard/pages", post(admin::page_content_controller::PageContentController::update))
        .route("/dashboard/pages/active-pages", post(admin::page_content_controller::PageContentController::update_active_pages))
        .layer(from_fn(|req, next| permission_middleware(req, next, "halaman_pages")));

    let article_routes = Router::new()
        .merge(Router::new().route("/dashboard/articles", post(admin::page_content_controller::PageContentController::store_article)).layer(from_fn(|req, next| permission_middleware(req, next, "create_berita"))))
        .merge(Router::new().route("/dashboard/articles/:id", post(admin::page_content_controller::PageContentController::update_article)).layer(from_fn(|req, next| permission_middleware(req, next, "update_berita"))))
        .merge(Router::new().route("/dashboard/articles/:id/delete", post(admin::page_content_controller::PageContentController::delete_article)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_berita"))));

    let schedule_routes = Router::new()
        .merge(Router::new().route("/dashboard/schedules", post(admin::page_content_controller::PageContentController::store_schedule)).layer(from_fn(|req, next| permission_middleware(req, next, "create_jadwal"))))
        .merge(Router::new().route("/dashboard/schedules/:id", post(admin::page_content_controller::PageContentController::update_schedule)).layer(from_fn(|req, next| permission_middleware(req, next, "update_jadwal"))))
        .merge(Router::new().route("/dashboard/schedules/:id/delete", post(admin::page_content_controller::PageContentController::delete_schedule)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_jadwal"))));

    let program_routes = Router::new()
        .merge(Router::new().route("/dashboard/programs", post(admin::page_content_controller::PageContentController::store_program)).layer(from_fn(|req, next| permission_middleware(req, next, "create_program"))))
        .merge(Router::new().route("/dashboard/programs/:id", post(admin::page_content_controller::PageContentController::update_program)).layer(from_fn(|req, next| permission_middleware(req, next, "update_program"))))
        .merge(Router::new().route("/dashboard/programs/:id/delete", post(admin::page_content_controller::PageContentController::delete_program)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_program"))));

    let metric_routes = Router::new()
        .merge(Router::new().route("/dashboard/metrics", post(admin::page_content_controller::PageContentController::store_metric)).layer(from_fn(|req, next| permission_middleware(req, next, "create_home"))))
        .merge(Router::new().route("/dashboard/metrics/:id", post(admin::page_content_controller::PageContentController::update_metric)).layer(from_fn(|req, next| permission_middleware(req, next, "update_home"))))
        .merge(Router::new().route("/dashboard/metrics/:id/delete", post(admin::page_content_controller::PageContentController::delete_metric)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_home"))));

    let structure_routes = Router::new()
        .merge(Router::new().route("/dashboard/structures", post(admin::page_content_controller::PageContentController::store_structure)).layer(from_fn(|req, next| permission_middleware(req, next, "create_profil"))))
        .merge(Router::new().route("/dashboard/structures/:id", post(admin::page_content_controller::PageContentController::update_structure)).layer(from_fn(|req, next| permission_middleware(req, next, "update_profil"))))
        .merge(Router::new().route("/dashboard/structures/:id/delete", post(admin::page_content_controller::PageContentController::delete_structure)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_profil"))));

    let philosophical_routes = Router::new()
        .merge(Router::new().route("/dashboard/philosophical_values", post(admin::page_content_controller::PageContentController::store_philosophical_value)).layer(from_fn(|req, next| permission_middleware(req, next, "create_filosofi"))))
        .merge(Router::new().route("/dashboard/philosophical_values/:id", post(admin::page_content_controller::PageContentController::update_philosophical_value)).layer(from_fn(|req, next| permission_middleware(req, next, "update_filosofi"))))
        .merge(Router::new().route("/dashboard/philosophical_values/:id/delete", post(admin::page_content_controller::PageContentController::delete_philosophical_value)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_filosofi"))));

    let gallery_routes = Router::new()
        .merge(Router::new().route("/dashboard/galleries", post(admin::page_content_controller::PageContentController::store_gallery)).layer(from_fn(|req, next| permission_middleware(req, next, "create_galeri"))))
        .merge(Router::new().route("/dashboard/galleries/:id", post(admin::page_content_controller::PageContentController::update_gallery)).layer(from_fn(|req, next| permission_middleware(req, next, "update_galeri"))))
        .merge(Router::new().route("/dashboard/galleries/:id/delete", post(admin::page_content_controller::PageContentController::delete_gallery)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_galeri"))));

    let join_step_routes = Router::new()
        .merge(Router::new().route("/dashboard/join_steps", post(admin::page_content_controller::PageContentController::store_join_step)).layer(from_fn(|req, next| permission_middleware(req, next, "create_join"))))
        .merge(Router::new().route("/dashboard/join_steps/:id", post(admin::page_content_controller::PageContentController::update_join_step)).layer(from_fn(|req, next| permission_middleware(req, next, "update_join"))))
        .merge(Router::new().route("/dashboard/join_steps/:id/delete", post(admin::page_content_controller::PageContentController::delete_join_step)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_join"))));

    let booking_package_routes = Router::new()
        .merge(Router::new().route("/dashboard/booking_packages", post(admin::page_content_controller::PageContentController::store_booking_package)).layer(from_fn(|req, next| permission_middleware(req, next, "create_booking"))))
        .merge(Router::new().route("/dashboard/booking_packages/:id", post(admin::page_content_controller::PageContentController::update_booking_package)).layer(from_fn(|req, next| permission_middleware(req, next, "update_booking"))))
        .merge(Router::new().route("/dashboard/booking_packages/:id/delete", post(admin::page_content_controller::PageContentController::delete_booking_package)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_booking"))));

    let sop_rule_routes = Router::new()
        .merge(Router::new().route("/dashboard/sop_rules", post(admin::page_content_controller::PageContentController::store_sop_rule)).layer(from_fn(|req, next| permission_middleware(req, next, "create_sop"))))
        .merge(Router::new().route("/dashboard/sop_rules/:id", post(admin::page_content_controller::PageContentController::update_sop_rule)).layer(from_fn(|req, next| permission_middleware(req, next, "update_sop"))))
        .merge(Router::new().route("/dashboard/sop_rules/:id/delete", post(admin::page_content_controller::PageContentController::delete_sop_rule)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_sop"))));

    let contact_info_routes = Router::new()
        .merge(Router::new().route("/dashboard/contact_infos", post(admin::page_content_controller::PageContentController::store_contact_info)).layer(from_fn(|req, next| permission_middleware(req, next, "create_kontak"))))
        .merge(Router::new().route("/dashboard/contact_infos/:id", post(admin::page_content_controller::PageContentController::update_contact_info)).layer(from_fn(|req, next| permission_middleware(req, next, "update_kontak"))))
        .merge(Router::new().route("/dashboard/contact_infos/:id/delete", post(admin::page_content_controller::PageContentController::delete_contact_info)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_kontak"))));

    let booking_request_routes = Router::new()
        .merge(Router::new().route("/dashboard/booking_requests/:id/delete", post(admin::page_content_controller::PageContentController::delete_booking_request)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_booking"))))
        .merge(Router::new().route("/dashboard/booking_requests/:id/read", post(admin::page_content_controller::PageContentController::read_booking_request)).layer(from_fn(|req, next| permission_middleware(req, next, "update_booking"))));

    let join_request_routes = Router::new()
        .merge(Router::new().route("/dashboard/join_requests/:id/delete", post(admin::page_content_controller::PageContentController::delete_join_request)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_join"))))
        .merge(Router::new().route("/dashboard/join_requests/:id/read", post(admin::page_content_controller::PageContentController::read_join_request)).layer(from_fn(|req, next| permission_middleware(req, next, "update_join"))));

    let booking_category_routes = Router::new()
        .merge(Router::new().route("/dashboard/booking_categories", post(admin::page_content_controller::PageContentController::store_booking_category)).layer(from_fn(|req, next| permission_middleware(req, next, "create_booking"))))
        .merge(Router::new().route("/dashboard/booking_categories/:id", post(admin::page_content_controller::PageContentController::update_booking_category)).layer(from_fn(|req, next| permission_middleware(req, next, "update_booking"))))
        .merge(Router::new().route("/dashboard/booking_categories/:id/delete", post(admin::page_content_controller::PageContentController::delete_booking_category)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_booking"))));

    let join_category_routes = Router::new()
        .merge(Router::new().route("/dashboard/join_categories", post(admin::page_content_controller::PageContentController::store_join_category)).layer(from_fn(|req, next| permission_middleware(req, next, "create_join"))))
        .merge(Router::new().route("/dashboard/join_categories/:id", post(admin::page_content_controller::PageContentController::update_join_category)).layer(from_fn(|req, next| permission_middleware(req, next, "update_join"))))
        .merge(Router::new().route("/dashboard/join_categories/:id/delete", post(admin::page_content_controller::PageContentController::delete_join_category)).layer(from_fn(|req, next| permission_middleware(req, next, "delete_join"))));

    let dashboard_route = Router::new()
        .route("/dashboard", get(dashboard_controller::DashboardController::index))
        .layer(from_fn(|req, next| permission_middleware(req, next, "view_dashboard")));

    let other_protected_routes = Router::new()
        .route("/logout", post(auth::auth_controller::AuthController::logout))
        .route("/dashboard/profile", get(admin::profile_controller::ProfileController::edit))
        .route("/dashboard/profile", post(admin::profile_controller::ProfileController::update));

    let auth_protected_routes = Router::new()
        .merge(dashboard_route)
        .merge(user_routes)
        .merge(rbac_routes)
        .merge(matrix_routes)
        .merge(setting_routes)
        .merge(page_routes)
        .merge(article_routes)
        .merge(schedule_routes)
        .merge(program_routes)
        .merge(metric_routes)
        .merge(structure_routes)
        .merge(philosophical_routes)
        .merge(gallery_routes)
        .merge(join_step_routes)
        .merge(booking_package_routes)
        .merge(sop_rule_routes)
        .merge(contact_info_routes)
        .merge(booking_request_routes)
        .merge(join_request_routes)
        .merge(booking_category_routes)
        .merge(join_category_routes)
        .merge(other_protected_routes)
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
        .route("/join/request", post(welcome_controller::submit_join_request))
        .route("/berita", get(welcome_controller::other_berita))
        .route("/berita/:slug", get(welcome_controller::other_berita_detail))
        .route("/booking", get(welcome_controller::other_booking))
        .route("/booking/request", post(welcome_controller::submit_booking_request))
        .route("/kontak", get(welcome_controller::other_kontak))
        .route("/sop", get(welcome_controller::other_sop))
        .merge(auth_routes::router())
        .merge(auth_protected_routes)
        
        
        .route("/inline", get(|| async { "Ini rute dalam satu baris!" }))
        .layer(from_fn(activity_log_middleware))
}
