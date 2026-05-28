use rustbasic_activitylog::ActivityLogger;
use rustbasic_core::middleware::Next;
use rustbasic_core::requests::Request;
use rustbasic_core::router::Response;
use rustbasic_core::serde_json::json;
use std::time::Instant;

pub async fn activity_log_middleware(req: Request, next: Next) -> Response {
    let start = Instant::now();
    let method = req.method.to_string();
    let uri = req.path.clone();
    let db = req.state.db.clone();
    let user_id: Option<i32> = req.session.get("user_id");
    let should_log = should_log_activity(&method, &uri, user_id.is_some());

    let response = next.run(req).await;

    if should_log {
        let status = response.status().as_u16();
        let mut logger = ActivityLogger::new(db)
            .use_log(if user_id.is_some() { "crud_activity" } else { "public_request" })
            .with_properties(json!({
                "method": method,
                "uri": uri,
                "status": status,
                "duration_ms": start.elapsed().as_millis(),
            }));

        if let Some(user_id) = user_id {
            logger = logger.caused_by("users", user_id);
        }

        let _ = logger.log(&format!("{} {}", method, uri)).await;
    }

    response
}

fn should_log_activity(method: &str, uri: &str, is_authenticated: bool) -> bool {
    if is_static_asset(uri) {
        return false;
    }

    if !is_authenticated {
        return true;
    }

    is_crud_request(method, uri)
}

fn is_crud_request(method: &str, uri: &str) -> bool {
    if method == "GET" || uri == "/logout" {
        return false;
    }

    uri.starts_with("/dashboard/users")
        || uri.starts_with("/dashboard/rbac")
        || uri.starts_with("/dashboard/matrix")
        || uri.starts_with("/dashboard/profile")
}

fn is_static_asset(uri: &str) -> bool {
    uri.starts_with("/assets/")
        || uri.starts_with("/dist/")
        || uri.ends_with(".css")
        || uri.ends_with(".js")
        || uri.ends_with(".png")
        || uri.ends_with(".jpg")
        || uri.ends_with(".jpeg")
        || uri.ends_with(".svg")
        || uri.ends_with(".ico")
        || uri.ends_with(".woff")
        || uri.ends_with(".woff2")
}
