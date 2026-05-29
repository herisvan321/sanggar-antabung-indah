use crate::app::models::structure::Model as Structure;
use rustbasic_core::serde_json::Value;

pub trait StructureObserver {
    fn creating(data: &mut Value);
    fn created(model: &Structure);
    fn updating(data: &mut Value);
    fn updated(model: &Structure);
    fn deleting(id: i32);
    fn deleted(id: i32);
}

pub struct StructureObserverImpl;

impl StructureObserver for StructureObserverImpl {
    fn creating(data: &mut Value) {
        if let Some(obj) = data.as_object_mut() {
            let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
            obj.insert("created_at".to_string(), rustbasic_core::serde_json::json!(now));
            obj.insert("updated_at".to_string(), rustbasic_core::serde_json::json!(now));
        }
    }

    fn created(_model: &Structure) {}

    fn updating(data: &mut Value) {
        if let Some(obj) = data.as_object_mut() {
            let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
            obj.insert("updated_at".to_string(), rustbasic_core::serde_json::json!(now));
        }
    }

    fn updated(_model: &Structure) {}
    fn deleting(_id: i32) {}
    fn deleted(_id: i32) {}
}
