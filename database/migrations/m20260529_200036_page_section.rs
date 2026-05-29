use rustbasic_core::{Schema, SchemaManager, MigrationTrait, DbErr};
use rustbasic_core::async_trait;

pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    fn name(&self) -> &str {
        "m20260529_200036_page_section"
    }

    async fn up<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        Schema::create(manager, "page_sections", |table| {
            table.id();
            table.no_timestamps();
            table.string("page_key").not_null();
            table.string("section_key").not_null();
            table.string("title").nullable();
            table.string("subtitle").nullable();
            table.string("content").nullable();
            table.string("media_url").nullable();
            table.string("video_url").nullable();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        let is_mysql = if let Ok(conn) = manager.pool.acquire().await {
            conn.backend_name() == "MySQL"
        } else {
            false
        };

        if is_mysql {
            rustbasic_core::sqlx::query("ALTER TABLE page_sections MODIFY content VARCHAR(8000) NULL")
                .execute(manager.pool)
                .await?;
            rustbasic_core::sqlx::query("ALTER TABLE page_sections MODIFY subtitle VARCHAR(2000) NULL")
                .execute(manager.pool)
                .await?;
        }

        Ok(())
    }

    async fn down<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        Schema::drop(manager, "page_sections").await
    }
}
