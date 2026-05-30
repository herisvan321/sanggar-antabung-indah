use rustbasic_core::{Schema, SchemaManager, MigrationTrait, DbErr};
use rustbasic_core::async_trait;

pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    fn name(&self) -> &str {
        "m20260530_104500_create_form_tables"
    }

    async fn up<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        // 1. booking_requests
        Schema::create(manager, "booking_requests", |table| {
            table.id();
            table.no_timestamps();
            table.string("name").not_null();
            table.string("email").not_null();
            table.string("whatsapp").not_null();
            table.string("date").not_null();
            table.string("show_type").not_null();
            table.string("details").nullable();
            table.integer("status").default(0);
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // 2. join_requests
        Schema::create(manager, "join_requests", |table| {
            table.id();
            table.no_timestamps();
            table.string("name").not_null();
            table.string("email").not_null();
            table.string("origin").not_null();
            table.string("whatsapp").not_null();
            table.string("class_category").not_null();
            table.string("motivation").nullable();
            table.integer("status").default(0);
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // 3. booking_categories
        Schema::create(manager, "booking_categories", |table| {
            table.id();
            table.no_timestamps();
            table.string("name").not_null();
            table.string("description").nullable();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // 4. join_categories
        Schema::create(manager, "join_categories", |table| {
            table.id();
            table.no_timestamps();
            table.string("name").not_null();
            table.string("description").nullable();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // Modify column sizes in MySQL if necessary
        let is_mysql = if let Ok(conn) = manager.pool.acquire().await {
            conn.backend_name() == "MySQL"
        } else {
            false
        };

        if is_mysql {
            let _ = rustbasic_core::sqlx::query("ALTER TABLE booking_requests MODIFY details VARCHAR(2000) NULL").execute(manager.pool).await;
            let _ = rustbasic_core::sqlx::query("ALTER TABLE join_requests MODIFY motivation VARCHAR(2000) NULL").execute(manager.pool).await;
        }

        Ok(())
    }

    async fn down<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        Schema::drop(manager, "join_categories").await?;
        Schema::drop(manager, "booking_categories").await?;
        Schema::drop(manager, "join_requests").await?;
        Schema::drop(manager, "booking_requests").await?;
        Ok(())
    }
}
