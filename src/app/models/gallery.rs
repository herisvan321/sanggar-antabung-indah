use rustbasic_core::model;

model! {
    table: "galleries",
    fillable: [category, title, description, media_url, created_at, updated_at],
    Model {
        pub id: i32,
        pub category: String,
        pub title: String,
        pub description: Option<String>,
        pub media_url: String,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
