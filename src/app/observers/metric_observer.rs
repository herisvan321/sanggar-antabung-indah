use crate::app::models::metric::Model as Metric;
use rustbasic_core::serde_json::Value;

pub trait MetricObserver {
    fn creating(data: &mut Value);
    fn created(model: &Metric);
    fn updating(data: &mut Value);
    fn updated(model: &Metric);
    fn deleting(id: i32);
    fn deleted(id: i32);
}

pub struct MetricObserverImpl;

impl MetricObserver for MetricObserverImpl {
    fn creating(data: &mut Value) {
        if let Some(obj) = data.as_object_mut() {
            let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
            obj.insert("created_at".to_string(), rustbasic_core::serde_json::json!(now));
            obj.insert("updated_at".to_string(), rustbasic_core::serde_json::json!(now));
        }
    }

    fn created(_model: &Metric) {}

    fn updating(data: &mut Value) {
        if let Some(obj) = data.as_object_mut() {
            let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
            obj.insert("updated_at".to_string(), rustbasic_core::serde_json::json!(now));
        }
    }

    fn updated(_model: &Metric) {}
    fn deleting(_id: i32) {}
    fn deleted(_id: i32) {}
}
