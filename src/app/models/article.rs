use rustbasic_core::model;

model! {
    table: "articles",
    fillable: [title, slug, content, media_url, created_at, updated_at],
    Model {
        pub id: i32,
        pub title: String,
        pub slug: String,
        pub content: Option<String>,
        pub media_url: Option<String>,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
