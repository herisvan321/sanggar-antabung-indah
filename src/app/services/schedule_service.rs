use crate::app::models::schedule;
use crate::app::observers::schedule_observer::{ScheduleObserver, ScheduleObserverImpl};
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct ScheduleService {
    db: AnyPool,
}

impl ScheduleService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_all_schedules(&self) -> Result<Vec<schedule::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "schedules")
            .order_by("id", "desc")
            .get::<schedule::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_schedules_by_category(&self, category: &str) -> Result<Vec<schedule::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "schedules")
            .where_("category", category)
            .order_by("id", "desc")
            .get::<schedule::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_schedule_by_id(&self, id: i32) -> Result<Option<schedule::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "schedules")
            .where_("id", id)
            .first::<schedule::Model>()
            .await?;
        Ok(item)
    }

    pub async fn create_schedule(
        &self,
        date: String,
        title: String,
        place: String,
        time: Option<String>,
        activity: Option<String>,
        category: String,
    ) -> Result<schedule::Model, rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "date": date,
            "title": title,
            "place": place,
            "time": time,
            "activity": activity,
            "category": category,
        });
        ScheduleObserverImpl::creating(&mut data);
        let item = schedule::Model::create(&self.db, data).await?;
        ScheduleObserverImpl::created(&item);
        Ok(item)
    }

    pub async fn update_schedule(
        &self,
        id: i32,
        date: String,
        title: String,
        place: String,
        time: Option<String>,
        activity: Option<String>,
        category: String,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "date": date,
            "title": title,
            "place": place,
            "time": time,
            "activity": activity,
            "category": category,
        });
        ScheduleObserverImpl::updating(&mut data);
        DB::table(&self.db, "schedules")
            .where_("id", id)
            .update(data)
            .await?;
        
        if let Some(item) = self.get_schedule_by_id(id).await? {
            ScheduleObserverImpl::updated(&item);
        }
        Ok(())
    }

    pub async fn delete_schedule(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        ScheduleObserverImpl::deleting(id);
        DB::table(&self.db, "schedules")
            .where_("id", id)
            .delete()
            .await?;
        ScheduleObserverImpl::deleted(id);
        Ok(())
    }
}
