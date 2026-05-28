use rustbasic_core::{Schema, SchemaManager, MigrationTrait, DbErr};
use rustbasic_core::async_trait;

pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    fn name(&self) -> &str {
        "m20260528_111646_create_rbac_tables"
    }

    async fn up<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        // 1. Table roles
        Schema::create(manager, "roles", |table| {
            table.string("name").unique().not_null();
            table.string("guard_name").default("web").not_null();
        }).await?;

        // 2. Table permissions
        Schema::create(manager, "permissions", |table| {
            table.string("name").unique().not_null();
            table.string("guard_name").default("web").not_null();
        }).await?;

        // 3. Table model_has_roles
        Schema::create(manager, "model_has_roles", |table| {
            table.no_timestamps();
            table.integer("role_id").not_null();
            table.string("model_type").not_null();
            table.integer("model_id").not_null();
        }).await?;

        // 4. Table model_has_permissions
        Schema::create(manager, "model_has_permissions", |table| {
            table.no_timestamps();
            table.integer("permission_id").not_null();
            table.string("model_type").not_null();
            table.integer("model_id").not_null();
        }).await?;

        // 5. Table role_has_permissions
        Schema::create(manager, "role_has_permissions", |table| {
            table.no_timestamps();
            table.integer("permission_id").not_null();
            table.integer("role_id").not_null();
        }).await?;

        Ok(())
    }

    async fn down<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        Schema::drop(manager, "role_has_permissions").await?;
        Schema::drop(manager, "model_has_permissions").await?;
        Schema::drop(manager, "model_has_roles").await?;
        Schema::drop(manager, "permissions").await?;
        Schema::drop(manager, "roles").await?;
        Ok(())
    }
}
