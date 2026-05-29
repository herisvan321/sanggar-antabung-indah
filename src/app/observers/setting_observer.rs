/* ---------------------------------------------------------
 * 📑 LABEL: SettingObserver (observers/setting_observer.rs)
 * --------------------------------------------------------- */

use crate::app::models::setting::Model as Setting;
use rustbasic_core::serde_json::Value;

pub trait SettingObserver {
    fn creating(data: &mut Value);
    fn created(model: &Setting);
    fn updating(data: &mut Value);
    fn updated(model: &Setting);
    fn deleting(id: i32);
    fn deleted(id: i32);
}

pub struct SettingObserverImpl;

impl SettingObserver for SettingObserverImpl {
    fn creating(data: &mut Value) {
        if let Some(obj) = data.as_object_mut() {
            let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
            obj.insert("created_at".to_string(), rustbasic_core::serde_json::json!(now));
            obj.insert("updated_at".to_string(), rustbasic_core::serde_json::json!(now));
        }
    }

    fn created(_model: &Setting) {
        // Lakukan sesuatu setelah data berhasil disimpan ke database (After Create)
    }

    fn updating(data: &mut Value) {
        if let Some(obj) = data.as_object_mut() {
            let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
            obj.insert("updated_at".to_string(), rustbasic_core::serde_json::json!(now));
        }
    }

    fn updated(_model: &Setting) {
        // Lakukan sesuatu setelah data berhasil diupdate di database (After Update)
    }

    fn deleting(_id: i32) {
        // Lakukan sesuatu sebelum data dihapus dari database (Before Delete)
    }

    fn deleted(_id: i32) {
        // Lakukan sesuatu setelah data berhasil dihapus dari database (After Delete)
    }
}
