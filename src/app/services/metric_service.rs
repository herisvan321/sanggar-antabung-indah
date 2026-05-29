use crate::app::models::metric;
use crate::app::observers::metric_observer::{MetricObserver, MetricObserverImpl};
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct MetricService {
    db: AnyPool,
}

impl MetricService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_all_metrics(&self) -> Result<Vec<metric::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "metrics")
            .order_by("id", "asc")
            .get::<metric::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_metric_by_id(&self, id: i32) -> Result<Option<metric::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "metrics")
            .where_("id", id)
            .first::<metric::Model>()
            .await?;
        Ok(item)
    }

    pub async fn create_metric(
        &self,
        value: String,
        label: String,
    ) -> Result<metric::Model, rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "value": value,
            "label": label,
        });
        MetricObserverImpl::creating(&mut data);
        let item = metric::Model::create(&self.db, data).await?;
        MetricObserverImpl::created(&item);
        Ok(item)
    }

    pub async fn update_metric(
        &self,
        id: i32,
        value: String,
        label: String,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "value": value,
            "label": label,
        });
        MetricObserverImpl::updating(&mut data);
        DB::table(&self.db, "metrics")
            .where_("id", id)
            .update(data)
            .await?;
        
        if let Some(item) = self.get_metric_by_id(id).await? {
            MetricObserverImpl::updated(&item);
        }
        Ok(())
    }

    pub async fn delete_metric(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        MetricObserverImpl::deleting(id);
        DB::table(&self.db, "metrics")
            .where_("id", id)
            .delete()
            .await?;
        MetricObserverImpl::deleted(id);
        Ok(())
    }
}
