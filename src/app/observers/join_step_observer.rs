use crate::app::models::join_step::Model as JoinStep;
use rustbasic_core::serde_json::Value;

pub trait JoinStepObserver {
    fn creating(data: &mut Value);
    fn created(model: &JoinStep);
    fn updating(data: &mut Value);
    fn updated(model: &JoinStep);
    fn deleting(id: i32);
    fn deleted(id: i32);
}

pub struct JoinStepObserverImpl;

impl JoinStepObserver for JoinStepObserverImpl {
    fn creating(data: &mut Value) {
        if let Some(obj) = data.as_object_mut() {
            let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
            obj.insert("created_at".to_string(), rustbasic_core::serde_json::json!(now));
            obj.insert("updated_at".to_string(), rustbasic_core::serde_json::json!(now));
        }
    }

    fn created(_model: &JoinStep) {}

    fn updating(data: &mut Value) {
        if let Some(obj) = data.as_object_mut() {
            let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
            obj.insert("updated_at".to_string(), rustbasic_core::serde_json::json!(now));
        }
    }

    fn updated(_model: &JoinStep) {}
    fn deleting(_id: i32) {}
    fn deleted(_id: i32) {}
}
