use rustbasic_core::{Schema, SchemaManager, MigrationTrait, DbErr};
use rustbasic_core::async_trait;

pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    fn name(&self) -> &str {
        "m20260501_000001_create_sessions_table"
    }

    async fn up<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        Schema::create(manager, "sessions", |table| {
            table.no_id();
            table.string("id").not_null().primary_key();
            table.string("user_id").nullable();
            table.string("ip_address").nullable();
            table.text("user_agent").nullable();
            table.text("payload").not_null();
            table.integer("last_activity").not_null();
            table.no_timestamps();
        }).await?;

        // Mengatasi type mismatch decoding BLOB ke String pada driver SQLx Any di MySQL
        let is_mysql = if let Ok(conn) = manager.pool.acquire().await {
            conn.backend_name() == "MySQL"
        } else {
            false
        };

        if is_mysql {
            rustbasic_core::sqlx::query("ALTER TABLE sessions MODIFY payload VARCHAR(8000) NOT NULL")
                .execute(manager.pool)
                .await?;
        }

        Ok(())
    }

    async fn down<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        Schema::drop(manager, "sessions").await
    }
}
