/* ---------------------------------------------------------
 * 📑 LABEL: UserService (services/user_service.rs)
 * --------------------------------------------------------- */

use crate::app::models::{users, role, model_has_role};
use crate::app::observers::user_observer::UserObserverImpl;
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;
use rustbasic_core::bcrypt::{hash, DEFAULT_COST};

pub struct UserService {
    db: AnyPool,
}

impl UserService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn list_users(&self) -> Result<(Vec<users::Model>, Vec<role::Model>, Vec<model_has_role::Model>), rustbasic_core::sqlx::Error> {
        let users = DB::table(&self.db, "users").get::<users::Model>().await.unwrap_or_default();
        let roles = DB::table(&self.db, "roles").get::<role::Model>().await.unwrap_or_default();
        let user_roles = DB::table(&self.db, "model_has_roles")
            .where_("model_type", "User")
            .get::<model_has_role::Model>()
            .await
            .unwrap_or_default();
        Ok((users, roles, user_roles))
    }

    pub async fn store_user(
        &self,
        name: String,
        email: String,
        password: Option<String>,
        roles: Vec<i32>,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let hashed_password = hash(password.unwrap_or_else(|| "password".to_string()), DEFAULT_COST).unwrap();

        let create_result = users::Model::create(&self.db, json!({
            "name": name,
            "email": email,
            "password": hashed_password,
        })).await;

        if let Ok(_) = create_result {
            let new_user = DB::table(&self.db, "users")
                .where_("email", &email)
                .first::<users::Model>()
                .await
                .ok()
                .flatten();

            if let Some(u) = new_user {
                for role_id in roles {
                    let _ = model_has_role::Model::create(&self.db, json!({
                        "role_id": role_id,
                        "model_type": "User",
                        "model_id": u.id,
                    })).await;
                }
            }
        }
        Ok(())
    }

    pub async fn update_user(
        &self,
        id: i32,
        name: String,
        email: String,
        password: Option<String>,
        roles: Vec<i32>,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        if let Some(ref pwd) = password {
            if !pwd.is_empty() {
                let hashed = hash(pwd, DEFAULT_COST).unwrap();
                DB::table(&self.db, "users")
                    .where_("id", id)
                    .update(json!({
                        "name": name,
                        "email": email,
                        "password": hashed,
                    }))
                    .await?;
            } else {
                DB::table(&self.db, "users")
                    .where_("id", id)
                    .update(json!({
                        "name": name,
                        "email": email,
                    }))
                    .await?;
            }
        } else {
            DB::table(&self.db, "users")
                .where_("id", id)
                .update(json!({
                    "name": name,
                    "email": email,
                }))
                .await?;
        }

        // Sync roles: delete old, insert new
        DB::table(&self.db, "model_has_roles")
            .where_("model_type", "User")
            .where_("model_id", id)
            .delete()
            .await?;

        for role_id in roles {
            let _ = model_has_role::Model::create(&self.db, json!({
                "role_id": role_id,
                "model_type": "User",
                "model_id": id,
            })).await;
        }

        Ok(())
    }

    pub async fn delete_user(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        // Trigger UserObserver deleting hook explicitly for cascading cleanups
        UserObserverImpl::deleting(&self.db, id).await?;

        DB::table(&self.db, "users")
            .where_("id", id)
            .delete()
            .await?;

        Ok(())
    }
}
