use crate::app::models::booking_request;
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct BookingRequestService {
    db: AnyPool,
}

impl BookingRequestService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_all_requests(&self) -> Result<Vec<booking_request::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "booking_requests")
            .order_by("id", "desc")
            .get::<booking_request::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_request_by_id(&self, id: i32) -> Result<Option<booking_request::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "booking_requests")
            .where_("id", id)
            .first::<booking_request::Model>()
            .await?;
        Ok(item)
    }

    pub async fn create_request(
        &self,
        name: String,
        email: String,
        whatsapp: String,
        date: String,
        show_type: String,
        details: Option<String>,
    ) -> Result<booking_request::Model, rustbasic_core::sqlx::Error> {
        let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
        let data = json!({
            "name": name,
            "email": email,
            "whatsapp": whatsapp,
            "date": date,
            "show_type": show_type,
            "details": details,
            "created_at": now.clone(),
            "updated_at": now,
        });
        let item = booking_request::Model::create(&self.db, data).await?;
        Ok(item)
    }

    pub async fn delete_request(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        DB::table(&self.db, "booking_requests")
            .where_("id", id)
            .delete()
            .await?;
        Ok(())
    }
}
