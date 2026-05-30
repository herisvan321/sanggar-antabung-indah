use rustbasic_core::{MigratorTrait, MigrationTrait, async_trait};

pub struct Migrator;

#[async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260501_000001_create_sessions_table::Migration),
            Box::new(m20260501_000002_create_users_table::Migration),
            Box::new(m20260528_110719_create_password_resets_table::Migration),
            Box::new(m20260528_111646_create_rbac_tables::Migration),
            Box::new(m20260528_112335_create_activity_log_table::Migration),
            Box::new(m20260528_230500_create_settings_table::Migration),
            Box::new(m20260529_200036_page_section::Migration),
            Box::new(m20260529_210000_create_cms_tables::Migration),
            Box::new(m20260530_104500_create_form_tables::Migration),
        ]
    }
}

pub mod m20260501_000001_create_sessions_table;
pub mod m20260501_000002_create_users_table;

pub mod m20260528_110719_create_password_resets_table;

pub mod m20260528_111646_create_rbac_tables;

pub mod m20260528_112335_create_activity_log_table;
pub mod m20260528_230500_create_settings_table;
pub mod m20260529_200036_page_section;
pub mod m20260529_210000_create_cms_tables;
pub mod m20260530_104500_create_form_tables;
