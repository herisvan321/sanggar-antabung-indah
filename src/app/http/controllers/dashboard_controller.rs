/* ---------------------------------------------------------
 * 📑 LABEL: DashboardController (controllers/dashboard_controller.rs)
 * --------------------------------------------------------- */

use crate::app::inertia::inertia;
use crate::app::models::users;
use crate::app::http::controllers::admin::helper::{get_user_permissions, get_user_roles};
use crate::app::services::dashboard_service::DashboardService;
use rustbasic_core::requests::Request;
use rustbasic_core::server::AppState;
use rustbasic_core::{Response, State, IntoResponse};
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct DashboardController;

impl DashboardController {
    pub async fn index(State(state): State<AppState>, req: Request) -> Response {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let user = DB::table(&state.db, "users").where_("id", user_id).first::<users::Model>().await.ok().flatten();
        let permissions = get_user_permissions(&state.db, user_id).await;
        let roles = get_user_roles(&state.db, user_id).await;

        if !permissions.contains(&"view_dashboard".to_string()) {
            return rustbasic_core::http::Response::builder()
                .status(rustbasic_core::http::StatusCode::FORBIDDEN)
                .body("403 Forbidden: Anda tidak memiliki izin untuk mengakses Dashboard.".into())
                .unwrap()
                .into_response();
        }

        let service = DashboardService::new(state.db.clone());
        let mut data = service.get_dashboard_data(req.input_as_str("period").as_deref()).await;

        // Inject page-specific metadata
        if let Some(obj) = data.as_object_mut() {
            obj.insert("title".to_string(), json!("Dashboard"));
            obj.insert("userName".to_string(), json!(user.as_ref().map(|u| u.name.clone()).unwrap_or("Guest".to_string())));
            obj.insert("userEmail".to_string(), json!(user.as_ref().map(|u| u.email.clone()).unwrap_or_default()));
            obj.insert("permissions".to_string(), json!(permissions));
            obj.insert("roles".to_string(), json!(roles));
        }

        inertia(&req, "Dashboard", data)
    }
}
