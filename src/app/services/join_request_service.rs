use crate::app::models::join_request;
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct JoinRequestService {
    db: AnyPool,
}

impl JoinRequestService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_all_requests(&self) -> Result<Vec<join_request::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "join_requests")
            .order_by("id", "desc")
            .get::<join_request::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_request_by_id(&self, id: i32) -> Result<Option<join_request::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "join_requests")
            .where_("id", id)
            .first::<join_request::Model>()
            .await?;
        Ok(item)
    }

    pub async fn create_request(
        &self,
        name: String,
        email: String,
        origin: String,
        whatsapp: String,
        class_category: String,
        motivation: Option<String>,
    ) -> Result<join_request::Model, rustbasic_core::sqlx::Error> {
        let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
        let data = json!({
            "name": name,
            "email": email,
            "origin": origin,
            "whatsapp": whatsapp,
            "class_category": class_category,
            "motivation": motivation,
            "created_at": now.clone(),
            "updated_at": now,
        });
        let item = join_request::Model::create(&self.db, data).await?;
        Ok(item)
    }

    pub async fn delete_request(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        DB::table(&self.db, "join_requests")
            .where_("id", id)
            .delete()
            .await?;
        Ok(())
    }
}
