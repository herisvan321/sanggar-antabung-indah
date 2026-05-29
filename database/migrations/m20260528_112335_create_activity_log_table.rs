use rustbasic_core::{Schema, SchemaManager, MigrationTrait, DbErr};
use rustbasic_core::async_trait;

pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    fn name(&self) -> &str {
        "m20260528_112335_create_activity_log_table"
    }

    async fn up<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        Schema::create(manager, "activity_log", |table| {
            table.id();
            table.no_timestamps();
            table.string("log_name").nullable();
            table.string("description").not_null();
            table.string("subject_type").nullable();
            table.integer("subject_id").nullable();
            table.string("causer_type").nullable();
            table.integer("causer_id").nullable();
            table.string("properties").nullable(); // JSON disimpan sebagai VARCHAR
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await
    }

    async fn down<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        Schema::drop(manager, "activity_log").await
    }
}
