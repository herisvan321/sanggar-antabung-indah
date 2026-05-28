/* ---------------------------------------------------------
 * 📑 LABEL: RbacService (services/rbac_service.rs)
 * --------------------------------------------------------- */

use crate::app::models::{role, permission, role_has_permission};
use crate::app::observers::role_observer::RoleObserverImpl;
use crate::app::observers::permission_observer::PermissionObserverImpl;
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct RbacService {
    db: AnyPool,
}

impl RbacService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn list_rbac(&self) -> Result<(Vec<role::Model>, Vec<permission::Model>), rustbasic_core::sqlx::Error> {
        let roles = DB::table(&self.db, "roles").get::<role::Model>().await.unwrap_or_default();
        let permissions = DB::table(&self.db, "permissions").get::<permission::Model>().await.unwrap_or_default();
        Ok((roles, permissions))
    }

    pub async fn create_role(&self, name: String, guard_name: Option<String>) -> Result<(), rustbasic_core::sqlx::Error> {
        role::Model::create(&self.db, json!({
            "name": name,
            "guard_name": guard_name.unwrap_or("web".to_string()),
        })).await?;
        Ok(())
    }

    pub async fn update_role(&self, id: i32, name: String, guard_name: Option<String>) -> Result<(), rustbasic_core::sqlx::Error> {
        DB::table(&self.db, "roles")
            .where_("id", id)
            .update(json!({
                "name": name,
                "guard_name": guard_name.unwrap_or("web".to_string()),
            }))
            .await?;
        Ok(())
    }

    pub async fn delete_role(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        // Trigger RoleObserver deleting hook explicitly for cascading cleanups
        RoleObserverImpl::deleting(&self.db, id).await?;

        DB::table(&self.db, "roles")
            .where_("id", id)
            .delete()
            .await?;
        Ok(())
    }

    pub async fn create_permission(&self, name: String, guard_name: Option<String>) -> Result<(), rustbasic_core::sqlx::Error> {
        permission::Model::create(&self.db, json!({
            "name": name,
            "guard_name": guard_name.unwrap_or("web".to_string()),
        })).await?;
        Ok(())
    }

    pub async fn update_permission(&self, id: i32, name: String, guard_name: Option<String>) -> Result<(), rustbasic_core::sqlx::Error> {
        DB::table(&self.db, "permissions")
            .where_("id", id)
            .update(json!({
                "name": name,
                "guard_name": guard_name.unwrap_or("web".to_string()),
            }))
            .await?;
        Ok(())
    }

    pub async fn delete_permission(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        // Trigger PermissionObserver deleting hook explicitly for cascading cleanups
        PermissionObserverImpl::deleting(&self.db, id).await?;

        DB::table(&self.db, "permissions")
            .where_("id", id)
            .delete()
            .await?;
        Ok(())
    }

    pub async fn get_matrix(&self) -> Result<(Vec<role::Model>, Vec<permission::Model>, Vec<role_has_permission::Model>), rustbasic_core::sqlx::Error> {
        let roles = DB::table(&self.db, "roles").get::<role::Model>().await.unwrap_or_default();
        let permissions = DB::table(&self.db, "permissions").get::<permission::Model>().await.unwrap_or_default();
        let relations = DB::table(&self.db, "role_has_permissions").get::<role_has_permission::Model>().await.unwrap_or_default();
        Ok((roles, permissions, relations))
    }

    pub async fn toggle_permission(&self, role_id: i32, permission_id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        let existing = DB::table(&self.db, "role_has_permissions")
            .where_("role_id", role_id)
            .where_("permission_id", permission_id)
            .first::<role_has_permission::Model>()
            .await
            .ok()
            .flatten();

        if let Some(rel) = existing {
            DB::table(&self.db, "role_has_permissions")
                .where_("id", rel.id)
                .delete()
                .await?;
        } else {
            role_has_permission::Model::create(&self.db, json!({
                "role_id": role_id,
                "permission_id": permission_id,
            })).await?;
        }
        Ok(())
    }
}
