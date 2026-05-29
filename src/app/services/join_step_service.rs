use crate::app::models::join_step;
use crate::app::observers::join_step_observer::{JoinStepObserver, JoinStepObserverImpl};
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct JoinStepService {
    db: AnyPool,
}

impl JoinStepService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_all_steps(&self) -> Result<Vec<join_step::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "join_steps")
            .order_by("id", "asc")
            .get::<join_step::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_steps_by_category(&self, category: &str) -> Result<Vec<join_step::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "join_steps")
            .where_("category", category)
            .order_by("id", "asc")
            .get::<join_step::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_step_by_id(&self, id: i32) -> Result<Option<join_step::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "join_steps")
            .where_("id", id)
            .first::<join_step::Model>()
            .await?;
        Ok(item)
    }

    pub async fn create_step(
        &self,
        step: Option<String>,
        title: Option<String>,
        description: String,
        category: String,
    ) -> Result<join_step::Model, rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "step": step,
            "title": title,
            "description": description,
            "category": category,
        });
        JoinStepObserverImpl::creating(&mut data);
        let item = join_step::Model::create(&self.db, data).await?;
        JoinStepObserverImpl::created(&item);
        Ok(item)
    }

    pub async fn update_step(
        &self,
        id: i32,
        step: Option<String>,
        title: Option<String>,
        description: String,
        category: String,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "step": step,
            "title": title,
            "description": description,
            "category": category,
        });
        JoinStepObserverImpl::updating(&mut data);
        DB::table(&self.db, "join_steps")
            .where_("id", id)
            .update(data)
            .await?;
        
        if let Some(item) = self.get_step_by_id(id).await? {
            JoinStepObserverImpl::updated(&item);
        }
        Ok(())
    }

    pub async fn delete_step(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        JoinStepObserverImpl::deleting(id);
        DB::table(&self.db, "join_steps")
            .where_("id", id)
            .delete()
            .await?;
        JoinStepObserverImpl::deleted(id);
        Ok(())
    }
}
