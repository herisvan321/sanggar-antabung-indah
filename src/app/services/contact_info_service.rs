use crate::app::models::contact_info;
use crate::app::observers::contact_info_observer::{ContactInfoObserver, ContactInfoObserverImpl};
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct ContactInfoService {
    db: AnyPool,
}

impl ContactInfoService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_all_infos(&self) -> Result<Vec<contact_info::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "contact_infos")
            .order_by("id", "asc")
            .get::<contact_info::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_info_by_id(&self, id: i32) -> Result<Option<contact_info::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "contact_infos")
            .where_("id", id)
            .first::<contact_info::Model>()
            .await?;
        Ok(item)
    }

    pub async fn create_info(
        &self,
        icon: String,
        label: String,
        value: String,
    ) -> Result<contact_info::Model, rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "icon": icon,
            "label": label,
            "value": value,
        });
        ContactInfoObserverImpl::creating(&mut data);
        let item = contact_info::Model::create(&self.db, data).await?;
        ContactInfoObserverImpl::created(&item);
        Ok(item)
    }

    pub async fn update_info(
        &self,
        id: i32,
        icon: String,
        label: String,
        value: String,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "icon": icon,
            "label": label,
            "value": value,
        });
        ContactInfoObserverImpl::updating(&mut data);
        DB::table(&self.db, "contact_infos")
            .where_("id", id)
            .update(data)
            .await?;
        
        if let Some(item) = self.get_info_by_id(id).await? {
            ContactInfoObserverImpl::updated(&item);
        }
        Ok(())
    }

    pub async fn delete_info(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        ContactInfoObserverImpl::deleting(id);
        DB::table(&self.db, "contact_infos")
            .where_("id", id)
            .delete()
            .await?;
        ContactInfoObserverImpl::deleted(id);
        Ok(())
    }
}
