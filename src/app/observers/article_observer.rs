use crate::app::models::article::Model as Article;
use rustbasic_core::serde_json::Value;

pub trait ArticleObserver {
    fn creating(data: &mut Value);
    fn created(model: &Article);
    fn updating(data: &mut Value);
    fn updated(model: &Article);
    fn deleting(id: i32);
    fn deleted(id: i32);
}

pub struct ArticleObserverImpl;

impl ArticleObserver for ArticleObserverImpl {
    fn creating(data: &mut Value) {
        if let Some(obj) = data.as_object_mut() {
            let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
            obj.insert("created_at".to_string(), rustbasic_core::serde_json::json!(now));
            obj.insert("updated_at".to_string(), rustbasic_core::serde_json::json!(now));
        }
    }

    fn created(_model: &Article) {}

    fn updating(data: &mut Value) {
        if let Some(obj) = data.as_object_mut() {
            let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
            obj.insert("updated_at".to_string(), rustbasic_core::serde_json::json!(now));
        }
    }

    fn updated(_model: &Article) {}
    fn deleting(_id: i32) {}
    fn deleted(_id: i32) {}
}
