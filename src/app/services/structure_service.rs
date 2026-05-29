use crate::app::models::structure;
use crate::app::observers::structure_observer::{StructureObserver, StructureObserverImpl};
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct StructureService {
    db: AnyPool,
}

impl StructureService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_all_structures(&self) -> Result<Vec<structure::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "structures")
            .order_by("id", "asc")
            .get::<structure::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_structure_by_id(&self, id: i32) -> Result<Option<structure::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "structures")
            .where_("id", id)
            .first::<structure::Model>()
            .await?;
        Ok(item)
    }

    pub async fn create_structure(
        &self,
        name: String,
        role: String,
        icon: Option<String>,
    ) -> Result<structure::Model, rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "name": name,
            "role": role,
            "icon": icon,
        });
        StructureObserverImpl::creating(&mut data);
        let item = structure::Model::create(&self.db, data).await?;
        StructureObserverImpl::created(&item);
        Ok(item)
    }

    pub async fn update_structure(
        &self,
        id: i32,
        name: String,
        role: String,
        icon: Option<String>,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "name": name,
            "role": role,
            "icon": icon,
        });
        StructureObserverImpl::updating(&mut data);
        DB::table(&self.db, "structures")
            .where_("id", id)
            .update(data)
            .await?;
        
        if let Some(item) = self.get_structure_by_id(id).await? {
            StructureObserverImpl::updated(&item);
        }
        Ok(())
    }

    pub async fn delete_structure(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        StructureObserverImpl::deleting(id);
        DB::table(&self.db, "structures")
            .where_("id", id)
            .delete()
            .await?;
        StructureObserverImpl::deleted(id);
        Ok(())
    }
}
