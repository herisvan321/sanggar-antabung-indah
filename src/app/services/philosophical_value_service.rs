use crate::app::models::philosophical_value;
use crate::app::observers::philosophical_value_observer::{PhilosophicalValueObserver, PhilosophicalValueObserverImpl};
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct PhilosophicalValueService {
    db: AnyPool,
}

impl PhilosophicalValueService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_all_values(&self) -> Result<Vec<philosophical_value::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "philosophical_values")
            .order_by("id", "asc")
            .get::<philosophical_value::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_value_by_id(&self, id: i32) -> Result<Option<philosophical_value::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "philosophical_values")
            .where_("id", id)
            .first::<philosophical_value::Model>()
            .await?;
        Ok(item)
    }

    pub async fn create_value(
        &self,
        title: String,
        description: String,
        icon: String,
        tag: Option<String>,
    ) -> Result<philosophical_value::Model, rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "title": title,
            "description": description,
            "icon": icon,
            "tag": tag,
        });
        PhilosophicalValueObserverImpl::creating(&mut data);
        let item = philosophical_value::Model::create(&self.db, data).await?;
        PhilosophicalValueObserverImpl::created(&item);
        Ok(item)
    }

    pub async fn update_value(
        &self,
        id: i32,
        title: String,
        description: String,
        icon: String,
        tag: Option<String>,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "title": title,
            "description": description,
            "icon": icon,
            "tag": tag,
        });
        PhilosophicalValueObserverImpl::updating(&mut data);
        DB::table(&self.db, "philosophical_values")
            .where_("id", id)
            .update(data)
            .await?;
        
        if let Some(item) = self.get_value_by_id(id).await? {
            PhilosophicalValueObserverImpl::updated(&item);
        }
        Ok(())
    }

    pub async fn delete_value(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        PhilosophicalValueObserverImpl::deleting(id);
        DB::table(&self.db, "philosophical_values")
            .where_("id", id)
            .delete()
            .await?;
        PhilosophicalValueObserverImpl::deleted(id);
        Ok(())
    }
}
