/* ---------------------------------------------------------
 * 📑 LABEL: PageSectionService (services/page_section_service.rs)
 * --------------------------------------------------------- */

use crate::app::models::page_section;
use crate::app::observers::page_section_observer::{PageSectionObserver, PageSectionObserverImpl};
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct PageSectionService {
    db: AnyPool,
}

impl PageSectionService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    /// Get all sections of all pages
    pub async fn get_all_sections(&self) -> Result<Vec<page_section::Model>, rustbasic_core::sqlx::Error> {
        let sections = DB::table(&self.db, "page_sections")
            .get::<page_section::Model>()
            .await?;
        Ok(sections)
    }

    /// Get all sections for a specific page (loads in bulk, avoiding N+1 queries)
    pub async fn get_sections_by_page(&self, page_key: &str) -> Result<Vec<page_section::Model>, rustbasic_core::sqlx::Error> {
        let sections = DB::table(&self.db, "page_sections")
            .where_("page_key", page_key)
            .get::<page_section::Model>()
            .await?;
        Ok(sections)
    }

    /// Get a single page section by page and section key
    pub async fn get_section(&self, page_key: &str, section_key: &str) -> Result<Option<page_section::Model>, rustbasic_core::sqlx::Error> {
        let section = DB::table(&self.db, "page_sections")
            .where_("page_key", page_key)
            .where_("section_key", section_key)
            .first::<page_section::Model>()
            .await?;
        Ok(section)
    }

    /// Update or insert a page section
    pub async fn update_section(
        &self,
        page_key: String,
        section_key: String,
        title: Option<String>,
        subtitle: Option<String>,
        content: Option<String>,
        media_url: Option<String>,
        video_url: Option<String>,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "title": title,
            "subtitle": subtitle,
            "content": content,
            "media_url": media_url,
            "video_url": video_url,
        });

        PageSectionObserverImpl::updating(&mut data);

        let existing = self.get_section(&page_key, &section_key).await?;
        if let Some(section) = existing {
            DB::table(&self.db, "page_sections")
                .where_("id", section.id)
                .update(data)
                .await?;

            if let Some(updated_section) = self.get_section(&page_key, &section_key).await? {
                PageSectionObserverImpl::updated(&updated_section);
            }
        } else {
            let mut new_data = json!({
                "page_key": page_key,
                "section_key": section_key,
                "title": title,
                "subtitle": subtitle,
                "content": content,
                "media_url": media_url,
                "video_url": video_url,
            });
            PageSectionObserverImpl::creating(&mut new_data);
            let new_section = page_section::Model::create(&self.db, new_data).await?;
            PageSectionObserverImpl::created(&new_section);
        }

        Ok(())
    }
}
