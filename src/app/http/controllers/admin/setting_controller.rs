use crate::app::inertia::inertia;
use crate::app::services::setting_service::SettingService;
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

#[derive(Deserialize)]
pub struct SettingUpdateRequest {
    pub app_name: String,
    pub app_logo_name: String,
    pub meta_title: String,
    pub meta_description: String,
    pub footer_description: String,
    pub footer_copyright: String,
}

impl Validate for SettingUpdateRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errors = HashMap::new();
        if self.app_name.trim().is_empty() {
            errors.insert("app_name".to_string(), "Nama aplikasi wajib diisi".to_string());
        }
        if self.app_logo_name.trim().is_empty() {
            errors.insert("app_logo_name".to_string(), "Identitas logo wajib diisi".to_string());
        }
        if self.meta_title.trim().is_empty() {
            errors.insert("meta_title".to_string(), "Meta title wajib diisi".to_string());
        }
        if self.meta_description.trim().is_empty() {
            errors.insert("meta_description".to_string(), "Meta description wajib diisi".to_string());
        }
        if self.footer_description.trim().is_empty() {
            errors.insert("footer_description".to_string(), "Footer description wajib diisi".to_string());
        }
        if self.footer_copyright.trim().is_empty() {
            errors.insert("footer_copyright".to_string(), "Footer copyright wajib diisi".to_string());
        }

        if errors.is_empty() {
            Ok(())
        } else {
            Err(errors)
        }
    }
}

pub struct SettingController;

impl SettingController {
    pub async fn index(State(state): State<AppState>, req: Request) -> Response {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let user = DB::table(&state.db, "users").where_("id", user_id).first::<users::Model>().await.ok().flatten();
        let permissions = get_user_permissions(&state.db, user_id).await;

        let service = SettingService::new(state.db.clone());
        let settings = service.get_settings().await.unwrap_or(None);

        inertia(&req, "Admin/Settings", json!({
            "settings": settings,
            "userName": user.as_ref().map(|u| u.name.clone()).unwrap_or("Guest".to_string()),
            "userEmail": user.as_ref().map(|u| u.email.clone()).unwrap_or_default(),
            "permissions": permissions,
        }))
    }

    pub async fn update(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data = match req.validate::<SettingUpdateRequest>() {
            Ok(d) => d,
            Err(res) => return res.into_response(),
        };

        let service = SettingService::new(state.db.clone());
        match service.update_settings(
            data.app_name,
            data.app_logo_name,
            data.meta_title,
            data.meta_description,
            data.footer_description,
            data.footer_copyright,
        ).await {
            Ok(_) => {
                req.session.set("success", "Pengaturan berhasil diperbarui");
            }
            Err(e) => {
                req.session.set("error", format!("Gagal memperbarui pengaturan: {}", e));
            }
        }

        Redirect::to("/dashboard/settings").into_response()
    }
}
