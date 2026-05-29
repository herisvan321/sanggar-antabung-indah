/* ---------------------------------------------------------
 * 📑 LABEL: PageSectionObserver (observers/page_section_observer.rs)
 * --------------------------------------------------------- */

use crate::app::models::page_section::Model as PageSection;
use rustbasic_core::serde_json::Value;

pub trait PageSectionObserver {
    fn creating(data: &mut Value);
    fn created(model: &PageSection);
    fn updating(data: &mut Value);
    fn updated(model: &PageSection);
    fn deleting(id: i32);
    fn deleted(id: i32);
}

pub struct PageSectionObserverImpl;

impl PageSectionObserver for PageSectionObserverImpl {
    fn creating(data: &mut Value) {
        if let Some(obj) = data.as_object_mut() {
            let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
            obj.insert("created_at".to_string(), rustbasic_core::serde_json::json!(now));
            obj.insert("updated_at".to_string(), rustbasic_core::serde_json::json!(now));
        }
    }

    fn created(_model: &PageSection) {
        // After Create
    }

    fn updating(data: &mut Value) {
        if let Some(obj) = data.as_object_mut() {
            let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
            obj.insert("updated_at".to_string(), rustbasic_core::serde_json::json!(now));
        }
    }

    fn updated(_model: &PageSection) {
        // After Update
    }

    fn deleting(_id: i32) {
        // Before Delete
    }

    fn deleted(_id: i32) {
        // After Delete
    }
}
