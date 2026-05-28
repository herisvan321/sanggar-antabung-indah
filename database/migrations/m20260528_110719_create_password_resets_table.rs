use rustbasic_core::{Schema, SchemaManager, MigrationTrait, DbErr};
use rustbasic_core::async_trait;

pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    fn name(&self) -> &str {
        "m20260528_110719_create_password_resets_table"
    }

    async fn up<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        Schema::create(manager, "password_resets", |table| {
            table.no_id();
            table.string("email").not_null().primary_key();
            table.string("token").not_null();
        }).await
    }

    async fn down<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        Schema::drop(manager, "password_resets").await
    }
}
