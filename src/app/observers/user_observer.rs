/* ---------------------------------------------------------
 * 📑 LABEL: UserObserver (observers/user_observer.rs)
 * --------------------------------------------------------- */

use crate::app::models::users::Model as User;
use rustbasic_core::serde_json::Value;
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;

pub struct UserObserverImpl;

impl UserObserverImpl {
    pub fn creating(_data: &mut Value) {
        // Lakukan sesuatu sebelum data disimpan ke database (Before Create)
    }

    pub fn created(_model: &User) {
        // Lakukan sesuatu setelah data berhasil disimpan ke database (After Create)
    }

    pub fn updating(_data: &mut Value) {
        // Lakukan sesuatu sebelum data diupdate di database (Before Update)
    }

    pub fn updated(_model: &User) {
        // Lakukan sesuatu setelah data berhasil diupdate di database (After Update)
    }

    pub async fn deleting(db: &AnyPool, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        // Clean up role mappings when user is deleted using ORM QueryBuilder
        DB::table(db, "model_has_roles")
            .where_("model_type", "User")
            .where_("model_id", id)
            .delete()
            .await?;
        Ok(())
    }

    pub fn deleted(_id: i32) {
        // Lakukan sesuatu setelah data berhasil dihapus dari database (After Delete)
    }
}
