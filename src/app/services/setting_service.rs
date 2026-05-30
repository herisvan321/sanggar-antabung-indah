/* ---------------------------------------------------------
 * 📑 LABEL: SettingService (services/setting_service.rs)
 * --------------------------------------------------------- */

use crate::app::models::setting;
use crate::app::observers::setting_observer::{SettingObserver, SettingObserverImpl};
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct SettingService {
    db: AnyPool,
}

impl SettingService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    /// Retrieve the settings record from the database
    pub async fn get_settings(&self) -> Result<Option<setting::Model>, rustbasic_core::sqlx::Error> {
        let setting = DB::table(&self.db, "settings")
            .first::<setting::Model>()
            .await?;
        Ok(setting)
    }

    /// Update settings values in the database, triggering the observer hooks
    pub async fn update_settings(
        &self,
        app_name: String,
        app_logo_name: String,
        meta_title: String,
        meta_description: String,
        footer_description: String,
        footer_copyright: String,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "app_name": app_name,
            "app_logo_name": app_logo_name,
            "meta_title": meta_title,
            "meta_description": meta_description,
            "footer_description": footer_description,
            "footer_copyright": footer_copyright,
        });

        // Trigger observer updating hook
        SettingObserverImpl::updating(&mut data);

        let existing = self.get_settings().await?;
        if let Some(setting) = existing {
            DB::table(&self.db, "settings")
                .where_("id", setting.id)
                .update(data)
                .await?;

            if let Some(updated_setting) = self.get_settings().await? {
                SettingObserverImpl::updated(&updated_setting);
            }
        } else {
            // Fallback (though seeded)
            let new_setting = setting::Model::create(&self.db, data).await?;
            SettingObserverImpl::created(&new_setting);
        }

        Ok(())
    }

    /// Update only the active_pages field in settings
    pub async fn update_active_pages(&self, active_pages: String) -> Result<(), rustbasic_core::sqlx::Error> {
        let existing = self.get_settings().await?;
        if let Some(setting) = existing {
            let data = json!({
                "active_pages": active_pages,
            });
            DB::table(&self.db, "settings")
                .where_("id", setting.id)
                .update(data)
                .await?;
        }
        Ok(())
    }
}
