use crate::app::models::article;
use crate::app::observers::article_observer::{ArticleObserver, ArticleObserverImpl};
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct ArticleService {
    db: AnyPool,
}

impl ArticleService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_all_articles(&self) -> Result<Vec<article::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "articles")
            .order_by("id", "desc")
            .get::<article::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_article_by_id(&self, id: i32) -> Result<Option<article::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "articles")
            .where_("id", id)
            .first::<article::Model>()
            .await?;
        Ok(item)
    }

    pub async fn get_article_by_slug(&self, slug: &str) -> Result<Option<article::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "articles")
            .where_("slug", slug)
            .first::<article::Model>()
            .await?;
        Ok(item)
    }

    pub async fn create_article(
        &self,
        title: String,
        slug: String,
        content: Option<String>,
        media_url: Option<String>,
    ) -> Result<article::Model, rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "title": title,
            "slug": slug,
            "content": content,
            "media_url": media_url,
        });
        ArticleObserverImpl::creating(&mut data);
        let item = article::Model::create(&self.db, data).await?;
        ArticleObserverImpl::created(&item);
        Ok(item)
    }

    pub async fn update_article(
        &self,
        id: i32,
        title: String,
        slug: String,
        content: Option<String>,
        media_url: Option<String>,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "title": title,
            "slug": slug,
            "content": content,
            "media_url": media_url,
        });
        ArticleObserverImpl::updating(&mut data);
        DB::table(&self.db, "articles")
            .where_("id", id)
            .update(data)
            .await?;
        
        if let Some(item) = self.get_article_by_id(id).await? {
            ArticleObserverImpl::updated(&item);
        }
        Ok(())
    }

    pub async fn delete_article(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        ArticleObserverImpl::deleting(id);
        DB::table(&self.db, "articles")
            .where_("id", id)
            .delete()
            .await?;
        ArticleObserverImpl::deleted(id);
        Ok(())
    }
}
