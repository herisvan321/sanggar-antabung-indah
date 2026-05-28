use crate::app::inertia::inertia;
use crate::app::models::users;
use rustbasic_core::requests::Request;
use rustbasic_core::server::AppState;
use rustbasic_core::{Response, State};
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct DashboardController;

impl DashboardController {
    pub async fn index(State(state): State<AppState>, req: Request) -> Response {
        let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
        let user = DB::table(&state.db, "users").where_("id", user_id).first::<users::Model>().await.ok().flatten();
        let total_users = DB::table(&state.db, "users").count().await.unwrap_or(0);

        inertia(&req, "Dashboard", json!({
            "title": "Dashboard",
            "userName": user.as_ref().map(|u| u.name.clone()).unwrap_or("Guest".to_string()),
            "userEmail": user.as_ref().map(|u| u.email.clone()).unwrap_or_default(),
            "totalUsers": total_users,
        }))
    }
}
