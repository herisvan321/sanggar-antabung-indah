/* ---------------------------------------------------------
 * 📑 LABEL: PageContentController (admin/page_content_controller.rs)
 * --------------------------------------------------------- */

use crate::app::inertia::inertia;
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
use crate::app::services::setting_service::SettingService;
use crate::app::services::booking_request_service::BookingRequestService;
use crate::app::services::join_request_service::JoinRequestService;
use crate::app::services::booking_category_service::BookingCategoryService;
use crate::app::services::join_category_service::JoinCategoryService;

use crate::app::models::users;
use crate::app::http::controllers::admin::helper::get_user_permissions;
use rustbasic_core::database::DB;
use rustbasic_core::requests::Request;
use rustbasic_core::router::Response;
use rustbasic_core::server::AppState;
use rustbasic_core::{IntoResponse, Redirect, State};
use rustbasic_core::serde::Deserialize;
use rustbasic_core::serde_json::json;
use rustbasic_core::validator::Validate;
use std::collections::HashMap;

fn slugify(text: &str) -> String {
    text.to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<&str>>()
        .join("-")
}

// Page Section Update
#[derive(Deserialize)]
pub struct PageSectionUpdateRequest {
    pub page_key: String,
    pub section_key: String,
    pub title: Option<String>,
    pub subtitle: Option<String>,
    pub content: Option<String>,
    pub video_url: Option<String>,
    pub image_base64: Option<String>,
    pub image_filename: Option<String>,
    pub image_mime: Option<String>,
}

impl Validate for PageSectionUpdateRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        Ok(())
    }
}

// Active Pages Update
#[derive(Deserialize)]
pub struct ActivePagesUpdateRequest {
    pub active_pages: String,
}

impl Validate for ActivePagesUpdateRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errs = HashMap::new();
        if self.active_pages.trim().is_empty() {
            errs.insert("active_pages".to_string(), "Status aktif tidak boleh kosong".to_string());
        }
        if errs.is_empty() { Ok(()) } else { Err(errs) }
    }
}

// 1. Article
#[derive(Deserialize)]
pub struct ArticleRequest {
    pub title: String,
    pub content: Option<String>,
    pub image_base64: Option<String>,
    pub image_filename: Option<String>,
    pub image_mime: Option<String>,
}

impl Validate for ArticleRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errs = HashMap::new();
        if self.title.trim().is_empty() {
            errs.insert("title".to_string(), "Judul tidak boleh kosong".to_string());
        }
        if errs.is_empty() { Ok(()) } else { Err(errs) }
    }
}

// 2. Schedule
#[derive(Deserialize)]
pub struct ScheduleRequest {
    pub date: String,
    pub title: String,
    pub place: String,
    pub time: Option<String>,
    pub activity: Option<String>,
    pub category: String,
}

impl Validate for ScheduleRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errs = HashMap::new();
        if self.date.trim().is_empty() { errs.insert("date".to_string(), "Tanggal tidak boleh kosong".to_string()); }
        if self.title.trim().is_empty() { errs.insert("title".to_string(), "Judul tidak boleh kosong".to_string()); }
        if self.place.trim().is_empty() { errs.insert("place".to_string(), "Tempat tidak boleh kosong".to_string()); }
        if self.category.trim().is_empty() { errs.insert("category".to_string(), "Kategori tidak boleh kosong".to_string()); }
        if errs.is_empty() { Ok(()) } else { Err(errs) }
    }
}

// 3. Program
#[derive(Deserialize)]
pub struct ProgramRequest {
    pub title: String,
    pub description: String,
    pub icon: String,
    pub category: String,
}

impl Validate for ProgramRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errs = HashMap::new();
        if self.title.trim().is_empty() { errs.insert("title".to_string(), "Judul tidak boleh kosong".to_string()); }
        if self.description.trim().is_empty() { errs.insert("description".to_string(), "Deskripsi tidak boleh kosong".to_string()); }
        if self.icon.trim().is_empty() { errs.insert("icon".to_string(), "Icon tidak boleh kosong".to_string()); }
        if self.category.trim().is_empty() { errs.insert("category".to_string(), "Kategori tidak boleh kosong".to_string()); }
        if errs.is_empty() { Ok(()) } else { Err(errs) }
    }
}

// 4. Metric
#[derive(Deserialize)]
pub struct MetricRequest {
    pub value: String,
    pub label: String,
}

impl Validate for MetricRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errs = HashMap::new();
        if self.value.trim().is_empty() { errs.insert("value".to_string(), "Nilai tidak boleh kosong".to_string()); }
        if self.label.trim().is_empty() { errs.insert("label".to_string(), "Label tidak boleh kosong".to_string()); }
        if errs.is_empty() { Ok(()) } else { Err(errs) }
    }
}

// 5. Structure
#[derive(Deserialize)]
pub struct StructureRequest {
    pub name: String,
    pub role: String,
    pub icon: Option<String>,
}

impl Validate for StructureRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errs = HashMap::new();
        if self.name.trim().is_empty() { errs.insert("name".to_string(), "Nama tidak boleh kosong".to_string()); }
        if self.role.trim().is_empty() { errs.insert("role".to_string(), "Peran tidak boleh kosong".to_string()); }
        if errs.is_empty() { Ok(()) } else { Err(errs) }
    }
}

// 6. Philosophical Value
#[derive(Deserialize)]
pub struct PhilosophicalValueRequest {
    pub title: String,
    pub description: String,
    pub icon: String,
    pub tag: Option<String>,
}

impl Validate for PhilosophicalValueRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errs = HashMap::new();
        if self.title.trim().is_empty() { errs.insert("title".to_string(), "Judul tidak boleh kosong".to_string()); }
        if self.description.trim().is_empty() { errs.insert("description".to_string(), "Deskripsi tidak boleh kosong".to_string()); }
        if self.icon.trim().is_empty() { errs.insert("icon".to_string(), "Icon tidak boleh kosong".to_string()); }
        if errs.is_empty() { Ok(()) } else { Err(errs) }
    }
}

// 7. Gallery
#[derive(Deserialize)]
pub struct GalleryRequest {
    pub category: String,
    pub title: String,
    pub description: Option<String>,
    pub image_base64: Option<String>,
    pub image_filename: Option<String>,
    pub image_mime: Option<String>,
}

impl Validate for GalleryRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errs = HashMap::new();
        if self.category.trim().is_empty() { errs.insert("category".to_string(), "Kategori tidak boleh kosong".to_string()); }
        if self.title.trim().is_empty() { errs.insert("title".to_string(), "Judul tidak boleh kosong".to_string()); }
        if errs.is_empty() { Ok(()) } else { Err(errs) }
    }
}

// 8. Join Step
#[derive(Deserialize)]
pub struct JoinStepRequest {
    pub step: Option<String>,
    pub title: Option<String>,
    pub description: String,
    pub category: String,
}

impl Validate for JoinStepRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errs = HashMap::new();
        if self.description.trim().is_empty() { errs.insert("description".to_string(), "Deskripsi tidak boleh kosong".to_string()); }
        if self.category.trim().is_empty() { errs.insert("category".to_string(), "Kategori tidak boleh kosong".to_string()); }
        if errs.is_empty() { Ok(()) } else { Err(errs) }
    }
}

// 9. Booking Package
#[derive(Deserialize)]
pub struct BookingPackageRequest {
    pub name: String,
    pub description: String,
}

impl Validate for BookingPackageRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errs = HashMap::new();
        if self.name.trim().is_empty() { errs.insert("name".to_string(), "Nama paket tidak boleh kosong".to_string()); }
        if self.description.trim().is_empty() { errs.insert("description".to_string(), "Deskripsi paket tidak boleh kosong".to_string()); }
        if errs.is_empty() { Ok(()) } else { Err(errs) }
    }
}

// 10. SOP Rule
#[derive(Deserialize)]
pub struct SopRuleRequest {
    pub icon: String,
    pub text: String,
    pub category: String,
}

impl Validate for SopRuleRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errs = HashMap::new();
        if self.icon.trim().is_empty() { errs.insert("icon".to_string(), "Icon tidak boleh kosong".to_string()); }
        if self.text.trim().is_empty() { errs.insert("text".to_string(), "Isi aturan tidak boleh kosong".to_string()); }
        if self.category.trim().is_empty() { errs.insert("category".to_string(), "Kategori tidak boleh kosong".to_string()); }
        if errs.is_empty() { Ok(()) } else { Err(errs) }
    }
}

// 11. Contact Info
#[derive(Deserialize)]
pub struct ContactInfoRequest {
    pub icon: String,
    pub label: String,
    pub value: String,
}

impl Validate for ContactInfoRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errs = HashMap::new();
        if self.icon.trim().is_empty() { errs.insert("icon".to_string(), "Icon tidak boleh kosong".to_string()); }
        if self.label.trim().is_empty() { errs.insert("label".to_string(), "Label tidak boleh kosong".to_string()); }
        if self.value.trim().is_empty() { errs.insert("value".to_string(), "Nilai kontak tidak boleh kosong".to_string()); }
        if errs.is_empty() { Ok(()) } else { Err(errs) }
    }
}

fn upload_base64_as_webp(
    base64_str: &str,
    filename_opt: Option<String>,
    mime_opt: Option<String>,
    folder: &str,
) -> Result<String, String> {
    let clean_base64 = if let Some(index) = base64_str.find("base64,") {
        &base64_str[index + 7..]
    } else {
        base64_str
    };

    let bytes = rustbasic_core::base64::decode(clean_base64)
        .map_err(|e| format!("Base64 decode error: {:?}", e))?;

    let filename = filename_opt.unwrap_or_else(|| "image.webp".to_string());
    let mime = mime_opt.unwrap_or_else(|| "image/png".to_string());

    if mime.starts_with("image/") {
        let webp_bytes = crate::app::helpers::webp::to_webp_resized(&bytes, 1200, 1200, 85.0)
            .map_err(|e| format!("WebP convert error: {:?}", e))?;

        let path = std::path::Path::new(&filename);
        let base_name = path.file_stem().and_then(|s| s.to_str()).unwrap_or("image");
        let webp_filename = format!("{}.webp", base_name);

        let media_file = crate::app::helpers::media::handle_generic_file_upload(
            &webp_bytes,
            &webp_filename,
            "image/webp",
            folder,
        ).map_err(|e| format!("Media upload error: {:?}", e))?;

        Ok(format!("{}/{}", media_file.url, media_file.filename))
    } else {
        let media_file = crate::app::helpers::media::handle_generic_file_upload(
            &bytes,
            &filename,
            &mime,
            folder,
        ).map_err(|e| format!("Media upload error: {:?}", e))?;

        Ok(format!("{}/{}", media_file.url, media_file.filename))
    }
}

pub struct PageContentController;

impl PageContentController {
    pub async fn index(State(state): State<AppState>, req: Request) -> Response {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let user = DB::table(&state.db, "users").where_("id", user_id).first::<users::Model>().await.ok().flatten();
        let permissions = get_user_permissions(&state.db, user_id).await;

        let section_service = PageSectionService::new(state.db.clone());
        let sections = section_service.get_all_sections().await.unwrap_or_default();

        // Load 11 normalized collections
        let articles = ArticleService::new(state.db.clone()).get_all_articles().await.unwrap_or_default();
        let schedules = ScheduleService::new(state.db.clone()).get_all_schedules().await.unwrap_or_default();
        let programs = ProgramService::new(state.db.clone()).get_all_programs().await.unwrap_or_default();
        let metrics = MetricService::new(state.db.clone()).get_all_metrics().await.unwrap_or_default();
        let structures = StructureService::new(state.db.clone()).get_all_structures().await.unwrap_or_default();
        let philosophical_values = PhilosophicalValueService::new(state.db.clone()).get_all_values().await.unwrap_or_default();
        let galleries = GalleryService::new(state.db.clone()).get_all_galleries().await.unwrap_or_default();
        let join_steps = JoinStepService::new(state.db.clone()).get_all_steps().await.unwrap_or_default();
        let booking_packages = BookingPackageService::new(state.db.clone()).get_all_packages().await.unwrap_or_default();
        let sop_rules = SopRuleService::new(state.db.clone()).get_all_rules().await.unwrap_or_default();
        let contact_infos = ContactInfoService::new(state.db.clone()).get_all_infos().await.unwrap_or_default();
        let booking_requests = BookingRequestService::new(state.db.clone()).get_all_requests().await.unwrap_or_default();
        let join_requests = JoinRequestService::new(state.db.clone()).get_all_requests().await.unwrap_or_default();
        let booking_categories = BookingCategoryService::new(state.db.clone()).get_all_categories().await.unwrap_or_default();
        let join_categories = JoinCategoryService::new(state.db.clone()).get_all_categories().await.unwrap_or_default();

        inertia(&req, "Admin/PageContent", json!({
            "sections": sections,
            "articles": articles,
            "schedules": schedules,
            "programs": programs,
            "metrics": metrics,
            "structures": structures,
            "philosophical_values": philosophical_values,
            "galleries": galleries,
            "join_steps": join_steps,
            "booking_packages": booking_packages,
            "sop_rules": sop_rules,
            "contact_infos": contact_infos,
            "booking_requests": booking_requests,
            "join_requests": join_requests,
            "booking_categories": booking_categories,
            "join_categories": join_categories,
            "userName": user.as_ref().map(|u| u.name.clone()).unwrap_or("Guest".to_string()),
            "userEmail": user.as_ref().map(|u| u.email.clone()).unwrap_or_default(),
            "permissions": permissions,
        }))
    }

    pub async fn update(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<PageSectionUpdateRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = PageSectionService::new(state.db.clone());
        let existing = service.get_section(&data.page_key, &data.section_key).await.unwrap_or(None);

        let media_url = if let Some(ref base64_str) = data.image_base64 {
            if !base64_str.trim().is_empty() {
                upload_base64_as_webp(
                    base64_str,
                    data.image_filename.clone(),
                    data.image_mime.clone(),
                    &data.page_key,
                ).ok()
            } else {
                None
            }
        } else {
            None
        };

        let final_media_url = media_url.or_else(|| existing.as_ref().and_then(|s| s.media_url.clone()));

        match service.update_section(
            data.page_key,
            data.section_key,
            data.title,
            data.subtitle,
            data.content,
            final_media_url,
            data.video_url,
        ).await {
            Ok(_) => { req.session.set("success", "Section halaman berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui section: {}", e)); }
        }

        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn update_active_pages(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<ActivePagesUpdateRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = SettingService::new(state.db.clone());
        match service.update_active_pages(data.active_pages).await {
            Ok(_) => { req.session.set("success", "Status aktivasi halaman berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui status aktivasi: {}", e)); }
        }

        Redirect::to("/dashboard/pages").into_response()
    }

    // 1. Articles CRUD
    pub async fn store_article(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<ArticleRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let media_url = if let Some(ref base64_str) = data.image_base64 {
            if !base64_str.trim().is_empty() {
                upload_base64_as_webp(base64_str, data.image_filename.clone(), data.image_mime.clone(), "berita").ok()
            } else { None }
        } else { None };

        let slug = slugify(&data.title);
        let service = ArticleService::new(state.db.clone());
        match service.create_article(data.title, slug, data.content, media_url).await {
            Ok(_) => { req.session.set("success", "Berita berhasil ditambahkan"); }
            Err(e) => { req.session.set("error", format!("Gagal menambahkan berita: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn update_article(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let data = match req.validate::<ArticleRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = ArticleService::new(state.db.clone());
        let existing = service.get_article_by_id(id).await.unwrap_or(None);
        if existing.is_none() {
            req.session.set("error", "Berita tidak ditemukan");
            return Redirect::to("/dashboard/pages").into_response();
        }

        let media_url = if let Some(ref base64_str) = data.image_base64 {
            if !base64_str.trim().is_empty() {
                upload_base64_as_webp(base64_str, data.image_filename.clone(), data.image_mime.clone(), "berita").ok()
            } else { None }
        } else { None };

        let final_media_url = media_url.or_else(|| existing.and_then(|e| e.media_url));
        let slug = slugify(&data.title);

        match service.update_article(id, data.title, slug, data.content, final_media_url).await {
            Ok(_) => { req.session.set("success", "Berita berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui berita: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn delete_article(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = ArticleService::new(state.db.clone());
        match service.delete_article(id).await {
            Ok(_) => { req.session.set("success", "Berita berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus berita: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // 2. Schedules CRUD
    pub async fn store_schedule(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<ScheduleRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = ScheduleService::new(state.db.clone());
        match service.create_schedule(data.date, data.title, data.place, data.time, data.activity, data.category).await {
            Ok(_) => { req.session.set("success", "Agenda/Jadwal berhasil ditambahkan"); }
            Err(e) => { req.session.set("error", format!("Gagal menambahkan agenda: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn update_schedule(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let data = match req.validate::<ScheduleRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = ScheduleService::new(state.db.clone());
        match service.update_schedule(id, data.date, data.title, data.place, data.time, data.activity, data.category).await {
            Ok(_) => { req.session.set("success", "Agenda/Jadwal berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui agenda: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn delete_schedule(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = ScheduleService::new(state.db.clone());
        match service.delete_schedule(id).await {
            Ok(_) => { req.session.set("success", "Agenda/Jadwal berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus agenda: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // 3. Programs CRUD
    pub async fn store_program(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<ProgramRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = ProgramService::new(state.db.clone());
        match service.create_program(data.title, data.description, data.icon, data.category).await {
            Ok(_) => { req.session.set("success", "Program berhasil ditambahkan"); }
            Err(e) => { req.session.set("error", format!("Gagal menambahkan program: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn update_program(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let data = match req.validate::<ProgramRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = ProgramService::new(state.db.clone());
        match service.update_program(id, data.title, data.description, data.icon, data.category).await {
            Ok(_) => { req.session.set("success", "Program berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui program: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn delete_program(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = ProgramService::new(state.db.clone());
        match service.delete_program(id).await {
            Ok(_) => { req.session.set("success", "Program berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus program: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // 4. Metrics CRUD
    pub async fn store_metric(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<MetricRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = MetricService::new(state.db.clone());
        match service.create_metric(data.value, data.label).await {
            Ok(_) => { req.session.set("success", "Metrik berhasil ditambahkan"); }
            Err(e) => { req.session.set("error", format!("Gagal menambahkan metrik: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn update_metric(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let data = match req.validate::<MetricRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = MetricService::new(state.db.clone());
        match service.update_metric(id, data.value, data.label).await {
            Ok(_) => { req.session.set("success", "Metrik berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui metrik: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn delete_metric(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = MetricService::new(state.db.clone());
        match service.delete_metric(id).await {
            Ok(_) => { req.session.set("success", "Metrik berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus metrik: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // 5. Structures CRUD
    pub async fn store_structure(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<StructureRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = StructureService::new(state.db.clone());
        match service.create_structure(data.name, data.role, data.icon).await {
            Ok(_) => { req.session.set("success", "Pengurus berhasil ditambahkan"); }
            Err(e) => { req.session.set("error", format!("Gagal menambahkan pengurus: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn update_structure(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let data = match req.validate::<StructureRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = StructureService::new(state.db.clone());
        match service.update_structure(id, data.name, data.role, data.icon).await {
            Ok(_) => { req.session.set("success", "Pengurus berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui pengurus: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn delete_structure(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = StructureService::new(state.db.clone());
        match service.delete_structure(id).await {
            Ok(_) => { req.session.set("success", "Pengurus berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus pengurus: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // 6. Philosophical Values CRUD
    pub async fn store_philosophical_value(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<PhilosophicalValueRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = PhilosophicalValueService::new(state.db.clone());
        match service.create_value(data.title, data.description, data.icon, data.tag).await {
            Ok(_) => { req.session.set("success", "Nilai Filosofi berhasil ditambahkan"); }
            Err(e) => { req.session.set("error", format!("Gagal menambahkan nilai filosofi: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn update_philosophical_value(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let data = match req.validate::<PhilosophicalValueRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = PhilosophicalValueService::new(state.db.clone());
        match service.update_value(id, data.title, data.description, data.icon, data.tag).await {
            Ok(_) => { req.session.set("success", "Nilai Filosofi berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui nilai filosofi: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn delete_philosophical_value(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = PhilosophicalValueService::new(state.db.clone());
        match service.delete_value(id).await {
            Ok(_) => { req.session.set("success", "Nilai Filosofi berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus nilai filosofi: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // 7. Galleries CRUD
    pub async fn store_gallery(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<GalleryRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let media_url = if let Some(ref base64_str) = data.image_base64 {
            if !base64_str.trim().is_empty() {
                upload_base64_as_webp(base64_str, data.image_filename.clone(), data.image_mime.clone(), "galeri").unwrap_or_default()
            } else { "".to_string() }
        } else { "".to_string() };

        let service = GalleryService::new(state.db.clone());
        match service.create_gallery(data.category, data.title, data.description, media_url).await {
            Ok(_) => { req.session.set("success", "Galeri foto berhasil ditambahkan"); }
            Err(e) => { req.session.set("error", format!("Gagal menambahkan galeri: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn update_gallery(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let data = match req.validate::<GalleryRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = GalleryService::new(state.db.clone());
        let existing = service.get_gallery_by_id(id).await.unwrap_or(None);
        if existing.is_none() {
            req.session.set("error", "Galeri tidak ditemukan");
            return Redirect::to("/dashboard/pages").into_response();
        }

        let media_url = if let Some(ref base64_str) = data.image_base64 {
            if !base64_str.trim().is_empty() {
                upload_base64_as_webp(base64_str, data.image_filename.clone(), data.image_mime.clone(), "galeri").ok()
            } else { None }
        } else { None };

        let final_media_url = media_url.or_else(|| existing.map(|e| e.media_url)).unwrap_or_default();

        match service.update_gallery(id, data.category, data.title, data.description, final_media_url).await {
            Ok(_) => { req.session.set("success", "Galeri foto berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui galeri: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn delete_gallery(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = GalleryService::new(state.db.clone());
        match service.delete_gallery(id).await {
            Ok(_) => { req.session.set("success", "Galeri foto berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus galeri: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // 8. Join Steps CRUD
    pub async fn store_join_step(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<JoinStepRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = JoinStepService::new(state.db.clone());
        match service.create_step(data.step, data.title, data.description, data.category).await {
            Ok(_) => { req.session.set("success", "Syarat/Alur gabung berhasil ditambahkan"); }
            Err(e) => { req.session.set("error", format!("Gagal menambahkan syarat/alur: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn update_join_step(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let data = match req.validate::<JoinStepRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = JoinStepService::new(state.db.clone());
        match service.update_step(id, data.step, data.title, data.description, data.category).await {
            Ok(_) => { req.session.set("success", "Syarat/Alur gabung berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui syarat/alur: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn delete_join_step(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = JoinStepService::new(state.db.clone());
        match service.delete_step(id).await {
            Ok(_) => { req.session.set("success", "Syarat/Alur gabung berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus syarat/alur: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // 9. Booking Packages CRUD
    pub async fn store_booking_package(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<BookingPackageRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = BookingPackageService::new(state.db.clone());
        match service.create_package(data.name, data.description).await {
            Ok(_) => { req.session.set("success", "Paket reservasi berhasil ditambahkan"); }
            Err(e) => { req.session.set("error", format!("Gagal menambahkan paket: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn update_booking_package(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let data = match req.validate::<BookingPackageRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = BookingPackageService::new(state.db.clone());
        match service.update_package(id, data.name, data.description).await {
            Ok(_) => { req.session.set("success", "Paket reservasi berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui paket: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn delete_booking_package(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = BookingPackageService::new(state.db.clone());
        match service.delete_package(id).await {
            Ok(_) => { req.session.set("success", "Paket reservasi berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus paket: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // 10. SOP Rules CRUD
    pub async fn store_sop_rule(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<SopRuleRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = SopRuleService::new(state.db.clone());
        match service.create_rule(data.icon, data.text, data.category).await {
            Ok(_) => { req.session.set("success", "Aturan SOP berhasil ditambahkan"); }
            Err(e) => { req.session.set("error", format!("Gagal menambahkan aturan SOP: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn update_sop_rule(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let data = match req.validate::<SopRuleRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = SopRuleService::new(state.db.clone());
        match service.update_rule(id, data.icon, data.text, data.category).await {
            Ok(_) => { req.session.set("success", "Aturan SOP berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui aturan SOP: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn delete_sop_rule(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = SopRuleService::new(state.db.clone());
        match service.delete_rule(id).await {
            Ok(_) => { req.session.set("success", "Aturan SOP berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus aturan SOP: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // 11. Contact Infos CRUD
    pub async fn store_contact_info(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<ContactInfoRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = ContactInfoService::new(state.db.clone());
        match service.create_info(data.icon, data.label, data.value).await {
            Ok(_) => { req.session.set("success", "Informasi kontak berhasil ditambahkan"); }
            Err(e) => { req.session.set("error", format!("Gagal menambahkan kontak: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn update_contact_info(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let data = match req.validate::<ContactInfoRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };

        let service = ContactInfoService::new(state.db.clone());
        match service.update_info(id, data.icon, data.label, data.value).await {
            Ok(_) => { req.session.set("success", "Informasi kontak berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui kontak: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn delete_contact_info(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = ContactInfoService::new(state.db.clone());
        match service.delete_info(id).await {
            Ok(_) => { req.session.set("success", "Informasi kontak berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus kontak: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // Booking Category CRUD
    pub async fn store_booking_category(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<CategoryRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };
        let service = BookingCategoryService::new(state.db.clone());
        match service.create_category(data.name, data.description).await {
            Ok(_) => { req.session.set("success", "Kategori Booking berhasil ditambahkan"); }
            Err(e) => { req.session.set("error", format!("Gagal menambahkan kategori: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn update_booking_category(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let data = match req.validate::<CategoryRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };
        let service = BookingCategoryService::new(state.db.clone());
        match service.update_category(id, data.name, data.description).await {
            Ok(_) => { req.session.set("success", "Kategori Booking berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui kategori: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn delete_booking_category(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = BookingCategoryService::new(state.db.clone());
        match service.delete_category(id).await {
            Ok(_) => { req.session.set("success", "Kategori Booking berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus kategori: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // Join Category CRUD
    pub async fn store_join_category(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<CategoryRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };
        let service = JoinCategoryService::new(state.db.clone());
        match service.create_category(data.name, data.description).await {
            Ok(_) => { req.session.set("success", "Kategori Kelas Sasian berhasil ditambahkan"); }
            Err(e) => { req.session.set("error", format!("Gagal menambahkan kategori: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn update_join_category(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let data = match req.validate::<CategoryRequest>() {
            Ok(d) => d,
            Err(_) => return Redirect::to("/dashboard/pages").into_response(),
        };
        let service = JoinCategoryService::new(state.db.clone());
        match service.update_category(id, data.name, data.description).await {
            Ok(_) => { req.session.set("success", "Kategori Kelas Sasian berhasil diperbarui"); }
            Err(e) => { req.session.set("error", format!("Gagal memperbarui kategori: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    pub async fn delete_join_category(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = JoinCategoryService::new(state.db.clone());
        match service.delete_category(id).await {
            Ok(_) => { req.session.set("success", "Kategori Kelas Sasian berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus kategori: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // Booking Request delete
    pub async fn delete_booking_request(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = BookingRequestService::new(state.db.clone());
        match service.delete_request(id).await {
            Ok(_) => { req.session.set("success", "Permintaan Booking berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus permintaan: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // Join Request delete
    pub async fn delete_join_request(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let service = JoinRequestService::new(state.db.clone());
        match service.delete_request(id).await {
            Ok(_) => { req.session.set("success", "Pendaftaran Join berhasil dihapus"); }
            Err(e) => { req.session.set("error", format!("Gagal menghapus pendaftaran: {}", e)); }
        }
        Redirect::to("/dashboard/pages").into_response()
    }

    // Booking Request mark as read
    pub async fn read_booking_request(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let _ = rustbasic_core::sqlx::query("UPDATE booking_requests SET status = 1 WHERE id = ?")
            .bind(id)
            .execute(&state.db)
            .await;
        Redirect::to("/dashboard/pages").into_response()
    }

    // Join Request mark as read
    pub async fn read_join_request(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id: i32 = req.param("id").unwrap_or("0").parse().unwrap_or(0);
        let _ = rustbasic_core::sqlx::query("UPDATE join_requests SET status = 1 WHERE id = ?")
            .bind(id)
            .execute(&state.db)
            .await;
        Redirect::to("/dashboard/pages").into_response()
    }
}

#[derive(Deserialize)]
pub struct CategoryRequest {
    pub name: String,
    pub description: Option<String>,
}

impl Validate for CategoryRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errs = HashMap::new();
        if self.name.trim().is_empty() { errs.insert("name".to_string(), "Nama kategori tidak boleh kosong".to_string()); }
        if errs.is_empty() { Ok(()) } else { Err(errs) }
    }
}
