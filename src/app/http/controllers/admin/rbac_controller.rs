/* ---------------------------------------------------------
 * 📑 LABEL: RbacController (controllers/admin/rbac_controller.rs)
 * --------------------------------------------------------- */

use crate::app::inertia::inertia;
use crate::app::models::users;
use crate::app::http::controllers::admin::helper::get_user_permissions;
use crate::app::services::rbac_service::RbacService;
use rustbasic_core::requests::Request;
use rustbasic_core::server::AppState;
use rustbasic_core::{IntoResponse, Response, Redirect, State};
use rustbasic_core::database::DB;
use rustbasic_core::serde::Deserialize;
use rustbasic_core::serde_json::json;
use rustbasic_core::validator::Validate;
use std::collections::HashMap;

#[derive(Deserialize)]
pub struct RoleRequest {
    pub name: String,
    pub guard_name: Option<String>,
}

impl Validate for RoleRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        Ok(())
    }
}

#[derive(Deserialize)]
pub struct PermissionRequest {
    pub name: String,
    pub guard_name: Option<String>,
}

impl Validate for PermissionRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        Ok(())
    }
}

#[derive(Deserialize)]
pub struct TogglePermissionRequest {
    pub role_id: i32,
    pub permission_id: i32,
}

impl Validate for TogglePermissionRequest {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        Ok(())
    }
}

pub struct RbacController;

impl RbacController {
    /// List roles and permissions
    pub async fn index(State(state): State<AppState>, req: Request) -> Response {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let user = DB::table(&state.db, "users").where_("id", user_id).first::<users::Model>().await.ok().flatten();
        let permissions = get_user_permissions(&state.db, user_id).await;

        if !permissions.contains(&"manage_roles".to_string()) {
            return rustbasic_core::http::Response::builder()
                .status(rustbasic_core::http::StatusCode::FORBIDDEN)
                .body("403 Forbidden: Anda tidak memiliki izin untuk mengelola role.".into())
                .unwrap()
                .into_response();
        }

        let service = RbacService::new(state.db.clone());
        let (roles, permissions_list) = service.list_rbac().await.unwrap_or_default();

        inertia(&req, "Admin/Rbac", json!({
            "roles": roles,
            "permissions_list": permissions_list,
            "userName": user.as_ref().map(|u| u.name.clone()).unwrap_or("Guest".to_string()),
            "userEmail": user.as_ref().map(|u| u.email.clone()).unwrap_or_default(),
            "permissions": permissions,
        }))
    }

    pub async fn store_role(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let permissions = get_user_permissions(&state.db, user_id).await;

        if !permissions.contains(&"manage_roles".to_string()) {
            req.session.set("error", "Anda tidak memiliki izin untuk membuat role.");
            return Redirect::to("/dashboard/rbac").into_response();
        }

        let data: RoleRequest = req.validate::<RoleRequest>().unwrap();
        let service = RbacService::new(state.db.clone());
        
        if let Err(e) = service.create_role(data.name, data.guard_name).await {
            req.session.set("error", format!("Gagal membuat role: {}", e));
        } else {
            req.session.set("success", "Role berhasil dibuat");
        }
        Redirect::to("/dashboard/rbac").into_response()
    }

    pub async fn update_role(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let permissions = get_user_permissions(&state.db, user_id).await;

        if !permissions.contains(&"manage_roles".to_string()) {
            req.session.set("error", "Anda tidak memiliki izin untuk memperbarui role.");
            return Redirect::to("/dashboard/rbac").into_response();
        }

        let id_str = req.param("id").unwrap_or("0");
        let id = id_str.parse::<i32>().unwrap_or(0);
        let data: RoleRequest = req.validate::<RoleRequest>().unwrap();
        
        let service = RbacService::new(state.db.clone());
        if let Err(e) = service.update_role(id, data.name, data.guard_name).await {
            req.session.set("error", format!("Gagal memperbarui role: {}", e));
        } else {
            req.session.set("success", "Role berhasil diperbarui");
        }
        Redirect::to("/dashboard/rbac").into_response()
    }

    pub async fn delete_role(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let permissions = get_user_permissions(&state.db, user_id).await;

        if !permissions.contains(&"manage_roles".to_string()) {
            req.session.set("error", "Anda tidak memiliki izin untuk menghapus role.");
            return Redirect::to("/dashboard/rbac").into_response();
        }

        let id_str = req.param("id").unwrap_or("0");
        let id = id_str.parse::<i32>().unwrap_or(0);
        
        let service = RbacService::new(state.db.clone());
        if let Err(e) = service.delete_role(id).await {
            req.session.set("error", format!("Gagal menghapus role: {}", e));
        } else {
            req.session.set("success", "Role berhasil dihapus");
        }
        Redirect::to("/dashboard/rbac").into_response()
    }

    pub async fn store_permission(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let permissions = get_user_permissions(&state.db, user_id).await;

        if !permissions.contains(&"manage_roles".to_string()) {
            req.session.set("error", "Anda tidak memiliki izin untuk membuat permission.");
            return Redirect::to("/dashboard/rbac").into_response();
        }

        let data: PermissionRequest = req.validate::<PermissionRequest>().unwrap();
        let service = RbacService::new(state.db.clone());

        if let Err(e) = service.create_permission(data.name, data.guard_name).await {
            req.session.set("error", format!("Gagal membuat permission: {}", e));
        } else {
            req.session.set("success", "Permission berhasil dibuat");
        }
        Redirect::to("/dashboard/rbac").into_response()
    }

    pub async fn update_permission(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let permissions = get_user_permissions(&state.db, user_id).await;

        if !permissions.contains(&"manage_roles".to_string()) {
            req.session.set("error", "Anda tidak memiliki izin untuk memperbarui permission.");
            return Redirect::to("/dashboard/rbac").into_response();
        }

        let id_str = req.param("id").unwrap_or("0");
        let id = id_str.parse::<i32>().unwrap_or(0);
        let data: PermissionRequest = req.validate::<PermissionRequest>().unwrap();
        
        let service = RbacService::new(state.db.clone());
        if let Err(e) = service.update_permission(id, data.name, data.guard_name).await {
            req.session.set("error", format!("Gagal memperbarui permission: {}", e));
        } else {
            req.session.set("success", "Permission berhasil diperbarui");
        }
        Redirect::to("/dashboard/rbac").into_response()
    }

    pub async fn delete_permission(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let permissions = get_user_permissions(&state.db, user_id).await;

        if !permissions.contains(&"manage_roles".to_string()) {
            req.session.set("error", "Anda tidak memiliki izin untuk menghapus permission.");
            return Redirect::to("/dashboard/rbac").into_response();
        }

        let id_str = req.param("id").unwrap_or("0");
        let id = id_str.parse::<i32>().unwrap_or(0);
        
        let service = RbacService::new(state.db.clone());
        if let Err(e) = service.delete_permission(id).await {
            req.session.set("error", format!("Gagal menghapus permission: {}", e));
        } else {
            req.session.set("success", "Permission berhasil dihapus");
        }
        Redirect::to("/dashboard/rbac").into_response()
    }

    pub async fn matrix(State(state): State<AppState>, req: Request) -> Response {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let user = DB::table(&state.db, "users").where_("id", user_id).first::<users::Model>().await.ok().flatten();
        let permissions = get_user_permissions(&state.db, user_id).await;

        if !permissions.contains(&"manage_permissions".to_string()) {
            return rustbasic_core::http::Response::builder()
                .status(rustbasic_core::http::StatusCode::FORBIDDEN)
                .body("403 Forbidden: Anda tidak memiliki izin untuk mengelola matriks hak akses.".into())
                .unwrap()
                .into_response();
        }

        let service = RbacService::new(state.db.clone());
        let (roles, permissions_list, relations) = service.get_matrix().await.unwrap_or_default();

        inertia(&req, "Admin/Matrix", json!({
            "roles": roles,
            "permissions_list": permissions_list,
            "relations": relations,
            "userName": user.as_ref().map(|u| u.name.clone()).unwrap_or("Guest".to_string()),
            "userEmail": user.as_ref().map(|u| u.email.clone()).unwrap_or_default(),
            "permissions": permissions,
        }))
    }

    pub async fn toggle_permission(State(state): State<AppState>, req: Request) -> impl IntoResponse {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let permissions = get_user_permissions(&state.db, user_id).await;

        if !permissions.contains(&"manage_permissions".to_string()) {
            req.session.set("error", "Anda tidak memiliki izin untuk mengelola matriks hak akses.");
            return Redirect::to("/dashboard/matrix").into_response();
        }

        let data: TogglePermissionRequest = req.validate::<TogglePermissionRequest>().unwrap();
        
        let service = RbacService::new(state.db.clone());
        if let Err(e) = service.toggle_permission(data.role_id, data.permission_id).await {
            req.session.set("error", format!("Gagal mengubah hak akses: {}", e));
        } else {
            req.session.set("success", "Hak akses diperbarui");
        }

        Redirect::to("/dashboard/matrix").into_response()
    }
}
