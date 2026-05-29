use crate::app::models::gallery;
use crate::app::observers::gallery_observer::{GalleryObserver, GalleryObserverImpl};
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct GalleryService {
    db: AnyPool,
}

impl GalleryService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_all_galleries(&self) -> Result<Vec<gallery::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "galleries")
            .order_by("id", "desc")
            .get::<gallery::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_galleries_by_category(&self, category: &str) -> Result<Vec<gallery::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "galleries")
            .where_("category", category)
            .order_by("id", "desc")
            .get::<gallery::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_gallery_by_id(&self, id: i32) -> Result<Option<gallery::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "galleries")
            .where_("id", id)
            .first::<gallery::Model>()
            .await?;
        Ok(item)
    }

    pub async fn create_gallery(
        &self,
        category: String,
        title: String,
        description: Option<String>,
        media_url: String,
    ) -> Result<gallery::Model, rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "category": category,
            "title": title,
            "description": description,
            "media_url": media_url,
        });
        GalleryObserverImpl::creating(&mut data);
        let item = gallery::Model::create(&self.db, data).await?;
        GalleryObserverImpl::created(&item);
        Ok(item)
    }

    pub async fn update_gallery(
        &self,
        id: i32,
        category: String,
        title: String,
        description: Option<String>,
        media_url: String,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "category": category,
            "title": title,
            "description": description,
            "media_url": media_url,
        });
        GalleryObserverImpl::updating(&mut data);
        DB::table(&self.db, "galleries")
            .where_("id", id)
            .update(data)
            .await?;
        
        if let Some(item) = self.get_gallery_by_id(id).await? {
            GalleryObserverImpl::updated(&item);
        }
        Ok(())
    }

    pub async fn delete_gallery(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        GalleryObserverImpl::deleting(id);
        DB::table(&self.db, "galleries")
            .where_("id", id)
            .delete()
            .await?;
        GalleryObserverImpl::deleted(id);
        Ok(())
    }
}
