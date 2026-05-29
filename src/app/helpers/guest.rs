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
    }
    
    inertia(req, component, props)
}
