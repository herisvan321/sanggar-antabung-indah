/* ---------------------------------------------------------
 * 📑 LABEL: ProfileService (services/profile_service.rs)
 * --------------------------------------------------------- */

use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;
use rustbasic_core::bcrypt::{hash, DEFAULT_COST};

pub struct ProfileService {
    db: AnyPool,
}

impl ProfileService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn update_profile(
        &self,
        user_id: i32,
        name: &str,
        email: &str,
        password: Option<String>,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        if let Some(pwd) = password {
            if !pwd.trim().is_empty() {
                let hashed = hash(pwd, DEFAULT_COST).unwrap();
                DB::table(&self.db, "users")
                    .where_("id", user_id)
                    .update(json!({
                        "name": name,
                        "email": email,
                        "password": hashed,
                    }))
                    .await?;
                return Ok(());
            }
        }

        DB::table(&self.db, "users")
            .where_("id", user_id)
            .update(json!({
                "name": name,
                "email": email,
            }))
            .await?;
        Ok(())
    }
}
