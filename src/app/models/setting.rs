use rustbasic_core::model;

model! {
    table: "settings",
    fillable: [app_name, app_logo_name, meta_title, meta_description, footer_description, footer_copyright, created_at, updated_at],
    Model {
        pub id: i32,
        pub app_name: String,
        pub app_logo_name: String,
        pub meta_title: String,
        pub meta_description: String,
        pub footer_description: String,
        pub footer_copyright: String,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
