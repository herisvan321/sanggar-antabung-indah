use crate::app::helpers::guest::render_guest;
use crate::app::services::page_section_service::PageSectionService;
use crate::app::services::article_service::ArticleService;
use crate::app::services::schedule_service::ScheduleService;
use crate::app::services::program_service::ProgramService;
use crate::app::services::metric_service::MetricService;
use crate::app::services::structure_service::StructureService;
use crate::app::services::philosophical_value_service::PhilosophicalValueService;
use crate::app::services::gallery_service::GalleryService;
use crate::app::services::join_step_service::JoinStepService;
use crate::app::services::booking_package_service::BookingPackageService;
use crate::app::services::sop_rule_service::SopRuleService;
use crate::app::services::contact_info_service::ContactInfoService;

use rustbasic_core::requests::Request;
use rustbasic_core::responses::ResponseHelper;
use rustbasic_core::server::AppState;
use rustbasic_core::{State, IntoResponse, Redirect};
use rustbasic_core::serde_json::json;

async fn is_page_active(db: &rustbasic_core::sqlx::AnyPool, req: &Request, page_key: &str) -> bool {
    let setting = rustbasic_core::database::DB::table(db, "settings")
        .first::<rustbasic_core::serde_json::Value>()
        .await
        .unwrap_or(None);
    if let Some(s) = setting {
        if let Some(active_json) = s.get("active_pages").and_then(|v| v.as_str()) {
            if let Ok(parsed) = rustbasic_core::serde_json::from_str::<rustbasic_core::serde_json::Value>(active_json) {
                if let Some(active) = parsed.get(page_key) {
                    let active_bool = active.as_bool().unwrap_or(true);
                    if !active_bool {
                        return false;
                    }
                }
            }
        }
    }

    // Check permission if logged in
    let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
    if user_id > 0 {
        let permissions = crate::app::http::controllers::admin::helper::get_user_permissions(db, user_id).await;
        let required_permission = format!("halaman_{}", page_key);
        if !permissions.contains(&required_permission) {
            return false;
        }
    }

    true
}

pub async fn index(req: Request) -> impl IntoResponse {
    let auth_installed = std::path::Path::new("src/app/http/controllers/auth").exists();
    render_guest(&req, "Welcome", json!({
        "title": "Selamat Datang di RustBasic",
        "auth_installed": auth_installed,
    }))
}

pub async fn about(req: Request) -> impl IntoResponse {
    render_guest(&req, "About", json!({
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

pub async fn other(State(state): State<AppState>, req: Request) -> impl IntoResponse {
    let sections = PageSectionService::new(state.db.clone()).get_sections_by_page("home").await.unwrap_or_default();
    let metrics = MetricService::new(state.db.clone()).get_all_metrics().await.unwrap_or_default();
    let programs = ProgramService::new(state.db.clone()).get_all_programs().await.unwrap_or_default();
    let schedules = ScheduleService::new(state.db.clone()).get_schedules_by_category("pertunjukan").await.unwrap_or_default();
    
    render_guest(&req, "Other/Home", json!({
        "sections": sections,
        "metrics": metrics,
        "programs": programs,
        "schedules": schedules
    }))
}

pub async fn other_profil(State(state): State<AppState>, req: Request) -> impl IntoResponse {
    if !is_page_active(&state.db, &req, "profil").await {
        return Redirect::to("/").into_response();
    }
    let sections = PageSectionService::new(state.db.clone()).get_sections_by_page("profil").await.unwrap_or_default();
    let structures = StructureService::new(state.db.clone()).get_all_structures().await.unwrap_or_default();
    
    render_guest(&req, "Other/Profil", json!({
        "sections": sections,
        "structures": structures
    })).into_response()
}

pub async fn other_filosofi(State(state): State<AppState>, req: Request) -> impl IntoResponse {
    if !is_page_active(&state.db, &req, "filosofi").await {
        return Redirect::to("/").into_response();
    }
    let sections = PageSectionService::new(state.db.clone()).get_sections_by_page("filosofi").await.unwrap_or_default();
    let values = PhilosophicalValueService::new(state.db.clone()).get_all_values().await.unwrap_or_default();
    
    render_guest(&req, "Other/Filosofi", json!({
        "sections": sections,
        "philosophical_values": values
    })).into_response()
}

pub async fn other_galeri(State(state): State<AppState>, req: Request) -> impl IntoResponse {
    if !is_page_active(&state.db, &req, "galeri").await {
        return Redirect::to("/").into_response();
    }
    let sections = PageSectionService::new(state.db.clone()).get_sections_by_page("galeri").await.unwrap_or_default();
    let galleries = GalleryService::new(state.db.clone()).get_all_galleries().await.unwrap_or_default();
    
    render_guest(&req, "Other/Galeri", json!({
        "sections": sections,
        "galleries": galleries
    })).into_response()
}

pub async fn other_jadwal(State(state): State<AppState>, req: Request) -> impl IntoResponse {
    if !is_page_active(&state.db, &req, "jadwal").await {
        return Redirect::to("/").into_response();
    }
    let sections = PageSectionService::new(state.db.clone()).get_sections_by_page("jadwal").await.unwrap_or_default();
    let schedules = ScheduleService::new(state.db.clone()).get_all_schedules().await.unwrap_or_default();
    
    render_guest(&req, "Other/Jadwal", json!({
        "sections": sections,
        "schedules": schedules
    })).into_response()
}

pub async fn other_program(State(state): State<AppState>, req: Request) -> impl IntoResponse {
    if !is_page_active(&state.db, &req, "program").await {
        return Redirect::to("/").into_response();
    }
    let sections = PageSectionService::new(state.db.clone()).get_sections_by_page("program").await.unwrap_or_default();
    let programs = ProgramService::new(state.db.clone()).get_all_programs().await.unwrap_or_default();
    
    render_guest(&req, "Other/Program", json!({
        "sections": sections,
        "programs": programs
    })).into_response()
}

pub async fn other_join(State(state): State<AppState>, req: Request) -> impl IntoResponse {
    if !is_page_active(&state.db, &req, "join").await {
        return Redirect::to("/").into_response();
    }
    let sections = PageSectionService::new(state.db.clone()).get_sections_by_page("join").await.unwrap_or_default();
    let steps = JoinStepService::new(state.db.clone()).get_all_steps().await.unwrap_or_default();
    
    render_guest(&req, "Other/Join", json!({
        "sections": sections,
        "join_steps": steps
    })).into_response()
}

pub async fn other_berita(State(state): State<AppState>, req: Request) -> impl IntoResponse {
    if !is_page_active(&state.db, &req, "berita").await {
        return Redirect::to("/").into_response();
    }
    let sections = PageSectionService::new(state.db.clone()).get_sections_by_page("berita").await.unwrap_or_default();
    let articles = ArticleService::new(state.db.clone()).get_all_articles().await.unwrap_or_default();
    
    render_guest(&req, "Other/Berita", json!({
        "sections": sections,
        "articles": articles
    })).into_response()
}

pub async fn other_booking(State(state): State<AppState>, req: Request) -> impl IntoResponse {
    if !is_page_active(&state.db, &req, "booking").await {
        return Redirect::to("/").into_response();
    }
    let sections = PageSectionService::new(state.db.clone()).get_sections_by_page("booking").await.unwrap_or_default();
    let packages = BookingPackageService::new(state.db.clone()).get_all_packages().await.unwrap_or_default();
    
    render_guest(&req, "Other/Booking", json!({
        "sections": sections,
        "booking_packages": packages
    })).into_response()
}

pub async fn other_kontak(State(state): State<AppState>, req: Request) -> impl IntoResponse {
    if !is_page_active(&state.db, &req, "kontak").await {
        return Redirect::to("/").into_response();
    }
    let sections = PageSectionService::new(state.db.clone()).get_sections_by_page("kontak").await.unwrap_or_default();
    let infos = ContactInfoService::new(state.db.clone()).get_all_infos().await.unwrap_or_default();
    
    render_guest(&req, "Other/Kontak", json!({
        "sections": sections,
        "contact_infos": infos
    })).into_response()
}

pub async fn other_sop(State(state): State<AppState>, req: Request) -> impl IntoResponse {
    if !is_page_active(&state.db, &req, "sop").await {
        return Redirect::to("/").into_response();
    }
    let sections = PageSectionService::new(state.db.clone()).get_sections_by_page("sop").await.unwrap_or_default();
    let rules = SopRuleService::new(state.db.clone()).get_all_rules().await.unwrap_or_default();
    
    render_guest(&req, "Other/Sop", json!({
        "sections": sections,
        "sop_rules": rules
    })).into_response()
}
