use rustbasic_core::{Schema, SchemaManager, MigrationTrait, DbErr};
use rustbasic_core::async_trait;

pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    fn name(&self) -> &str {
        "m20260528_230500_create_settings_table"
    }

    async fn up<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        Schema::create(manager, "settings", |table| {
            table.id();
            table.no_timestamps();
            table.string("app_name").not_null();
            table.string("app_logo_name").not_null();
            table.string("meta_title").not_null();
            table.string("meta_description").not_null();
            table.string("footer_description").not_null();
            table.string("footer_copyright").not_null();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await
    }

    async fn down<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        Schema::drop(manager, "settings").await
    }
}
