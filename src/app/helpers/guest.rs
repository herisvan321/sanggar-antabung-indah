use rustbasic_core::requests::Request;
use rustbasic_core::serde_json::{json, Value};
use crate::app::inertia::inertia;

/// Helper to render guest pages, ensuring settings and login state are included in the props
pub fn render_guest(req: &Request, component: &str, mut props: Value) -> rustbasic_core::Response {
    let user_id = req.session.get::<i32>("user_id").unwrap_or(0);
    let is_logged_in = user_id > 0;
    
    if let Value::Object(ref mut map) = props {
        if !map.contains_key("is_logged_in") {
            map.insert("is_logged_in".to_string(), json!(is_logged_in));
        }
        if is_logged_in {
            let db = req.state.db.clone();
            let permissions = tokio::task::block_in_place(|| {
                tokio::runtime::Handle::current().block_on(async {
                    crate::app::http::controllers::admin::helper::get_user_permissions(&db, user_id).await
                })
            });
            map.insert("permissions".to_string(), json!(permissions));
        }
    }
    
    inertia(req, component, props)
}
