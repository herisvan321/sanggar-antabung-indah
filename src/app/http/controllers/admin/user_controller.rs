/* ---------------------------------------------------------
 * 📑 LABEL: UserController (controllers/admin/user_controller.rs)
 * --------------------------------------------------------- */

use crate::app::models::users;
use crate::app::inertia::inertia;
use crate::app::http::controllers::admin::helper::get_user_permissions;
use crate::app::services::user_service::UserService;
use rustbasic_core::requests::Request;
use rustbasic_core::server::AppState;
use rustbasic_core::{IntoResponse, Response, Redirect, State};
use rustbasic_core::database::DB;
use rustbasic_core::serde::Deserialize;
use rustbasic_core::serde_json::json;
use rustbasic_core::validator::Validate;
use std::collections::HashMap;

#[derive(Deserialize)]
pub struct UserRequest {
    pub name: String,
    pub email: String,
    pub password: Option<String>,
    pub roles: Vec<i32>,
}

impl Validate for UserRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        Ok(())
    }
}

pub struct UserController;

impl UserController {
    pub async fn index(State(state): State<AppState>, req: Request) -> Response {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let user = DB::table(&state.db, "users").where_("id", user_id).first::<users::Model>().await.ok().flatten();
        let permissions = get_user_permissions(&state.db, user_id).await;

        if !permissions.contains(&"manage_users".to_string()) {
            return rustbasic_core::http::Response::builder()
                .status(rustbasic_core::http::StatusCode::FORBIDDEN)
                .body("403 Forbidden: Anda tidak memiliki izin untuk mengelola pengguna.".into())
                .unwrap()
                .into_response();
        }

        let service = UserService::new(state.db.clone());
        let (users, roles, user_roles) = service.list_users().await.unwrap_or_default();

        inertia(&req, "Admin/Users", json!({
            "users": users,
            "roles": roles,
            "userRoles": user_roles,
            "userName": user.as_ref().map(|u| u.name.clone()).unwrap_or("Guest".to_string()),
            "userEmail": user.as_ref().map(|u| u.email.clone()).unwrap_or_default(),
            "permissions": permissions,
        }))
    }

    pub async fn store(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let data: UserRequest = req.validate::<UserRequest>().unwrap();
        
        let service = UserService::new(state.db.clone());
        if let Err(e) = service.store_user(data.name, data.email, data.password, data.roles).await {
            req.session.set("error", format!("Gagal membuat user: {}", e));
        } else {
            req.session.set("success", "User berhasil dibuat");
        }

        Redirect::to("/dashboard/users").into_response()
    }

    pub async fn update(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id_str = req.param("id").unwrap_or("0");
        let id = id_str.parse::<i32>().unwrap_or(0);
        let data: UserRequest = req.validate::<UserRequest>().unwrap();

        let service = UserService::new(state.db.clone());
        if let Err(e) = service.update_user(id, data.name, data.email, data.password, data.roles).await {
            req.session.set("error", format!("Gagal memperbarui user: {}", e));
        } else {
            req.session.set("success", "User berhasil diperbarui");
        }

        Redirect::to("/dashboard/users").into_response()
    }

    pub async fn delete(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let id_str = req.param("id").unwrap_or("0");
        let id = id_str.parse::<i32>().unwrap_or(0);

        let service = UserService::new(state.db.clone());
        if let Err(e) = service.delete_user(id).await {
            req.session.set("error", format!("Gagal menghapus user: {}", e));
        } else {
            req.session.set("success", "User berhasil dihapus");
        }

        Redirect::to("/dashboard/users").into_response()
    }
}
