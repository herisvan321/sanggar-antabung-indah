use crate::app::models::booking_category;
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct BookingCategoryService {
    db: AnyPool,
}

impl BookingCategoryService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_all_categories(&self) -> Result<Vec<booking_category::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "booking_categories")
            .order_by("id", "asc")
            .get::<booking_category::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_category_by_id(&self, id: i32) -> Result<Option<booking_category::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "booking_categories")
            .where_("id", id)
            .first::<booking_category::Model>()
            .await?;
        Ok(item)
    }

    pub async fn create_category(
        &self,
        name: String,
        description: Option<String>,
    ) -> Result<booking_category::Model, rustbasic_core::sqlx::Error> {
        let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
        let data = json!({
            "name": name,
            "description": description,
            "created_at": now.clone(),
            "updated_at": now,
        });
        let item = booking_category::Model::create(&self.db, data).await?;
        Ok(item)
    }

    pub async fn update_category(
        &self,
        id: i32,
        name: String,
        description: Option<String>,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
        let data = json!({
            "name": name,
            "description": description,
            "updated_at": now,
        });
        DB::table(&self.db, "booking_categories")
            .where_("id", id)
            .update(data)
            .await?;
        Ok(())
    }

    pub async fn delete_category(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        DB::table(&self.db, "booking_categories")
            .where_("id", id)
            .delete()
            .await?;
        Ok(())
    }
}
