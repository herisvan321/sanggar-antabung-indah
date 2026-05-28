/* ---------------------------------------------------------
 * 📑 LABEL: ProfileController (controllers/admin/profile_controller.rs)
 * --------------------------------------------------------- */

use crate::app::models::users;
use crate::app::inertia::inertia;
use crate::app::http::controllers::admin::helper::get_user_permissions;
use crate::app::services::profile_service::ProfileService;
use rustbasic_core::requests::Request;
use rustbasic_core::server::AppState;
use rustbasic_core::{IntoResponse, Response, Redirect, State};
use rustbasic_core::database::DB;
use rustbasic_core::serde::Deserialize;
use rustbasic_core::serde_json::json;
use rustbasic_core::validator::Validate;
use std::collections::HashMap;

#[derive(Deserialize)]
pub struct ProfileUpdateRequest {
    pub name: String,
    pub email: String,
    pub password: Option<String>,
}

impl Validate for ProfileUpdateRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errors = HashMap::new();
        if self.name.len() < 3 {
            errors.insert("name".to_string(), "Nama minimal 3 karakter".to_string());
        }
        if !self.email.contains('@') {
            errors.insert("email".to_string(), "Email tidak valid".to_string());
        }
        if errors.is_empty() { Ok(()) } else { Err(errors) }
    }
}

pub struct ProfileController;

impl ProfileController {
    pub async fn edit(State(state): State<AppState>, req: Request) -> Response {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let user = DB::table(&state.db, "users").where_("id", user_id).first::<users::Model>().await.ok().flatten();
        let permissions = get_user_permissions(&state.db, user_id).await;

        inertia(&req, "Admin/Profile", json!({
            "user": user,
            "userName": user.as_ref().map(|u| u.name.clone()).unwrap_or("Guest".to_string()),
            "userEmail": user.as_ref().map(|u| u.email.clone()).unwrap_or_default(),
            "permissions": permissions,
        }))
    }

    pub async fn update(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let data = match req.validate::<ProfileUpdateRequest>() {
            Ok(d) => d,
            Err(res) => return res.into_response(),
        };

        let service = ProfileService::new(state.db.clone());
        if let Err(e) = service.update_profile(user_id, &data.name, &data.email, data.password).await {
            req.session.set("error", format!("Gagal memperbarui profil: {}", e));
        } else {
            req.session.set("success", "Profil berhasil diperbarui");
        }

        Redirect::to("/dashboard/profile").into_response()
    }
}
