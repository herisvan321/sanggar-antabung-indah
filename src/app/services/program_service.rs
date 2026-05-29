use crate::app::models::program;
use crate::app::observers::program_observer::{ProgramObserver, ProgramObserverImpl};
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct ProgramService {
    db: AnyPool,
}

impl ProgramService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_all_programs(&self) -> Result<Vec<program::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "programs")
            .order_by("id", "asc")
            .get::<program::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_programs_by_category(&self, category: &str) -> Result<Vec<program::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "programs")
            .where_("category", category)
            .order_by("id", "asc")
            .get::<program::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_program_by_id(&self, id: i32) -> Result<Option<program::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "programs")
            .where_("id", id)
            .first::<program::Model>()
            .await?;
        Ok(item)
    }

    pub async fn create_program(
        &self,
        title: String,
        description: String,
        icon: String,
        category: String,
    ) -> Result<program::Model, rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "title": title,
            "description": description,
            "icon": icon,
            "category": category,
        });
        ProgramObserverImpl::creating(&mut data);
        let item = program::Model::create(&self.db, data).await?;
        ProgramObserverImpl::created(&item);
        Ok(item)
    }

    pub async fn update_program(
        &self,
        id: i32,
        title: String,
        description: String,
        icon: String,
        category: String,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "title": title,
            "description": description,
            "icon": icon,
            "category": category,
        });
        ProgramObserverImpl::updating(&mut data);
        DB::table(&self.db, "programs")
            .where_("id", id)
            .update(data)
            .await?;
        
        if let Some(item) = self.get_program_by_id(id).await? {
            ProgramObserverImpl::updated(&item);
        }
        Ok(())
    }

    pub async fn delete_program(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        ProgramObserverImpl::deleting(id);
        DB::table(&self.db, "programs")
            .where_("id", id)
            .delete()
            .await?;
        ProgramObserverImpl::deleted(id);
        Ok(())
    }
}
