use rustbasic_core::requests::Request;
use rustbasic_core::http::StatusCode;
use rustbasic_core::{IntoResponse, Next, Response};
use crate::app::http::controllers::admin::helper::get_user_permissions;

pub async fn permission_middleware(req: Request, next: Next, required_permission: &'static str) -> Response {
    let state = req.state.clone();
    let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
    
    if user_id == 0 {
        return rustbasic_core::Redirect::to("/login").into_response();
    }
    
    let permissions = get_user_permissions(&state.db, user_id).await;
    
    if permissions.contains(&required_permission.to_string()) {
        next.run(req).await
    } else {
        rustbasic_core::http::Response::builder()
            .status(StatusCode::FORBIDDEN)
            .body("403 Forbidden: Anda tidak memiliki akses ke halaman ini.".into())
            .unwrap()
            .into_response()
    }
}
