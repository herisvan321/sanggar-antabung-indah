use rustbasic_core::model;

model! {
    table: "page_sections",
    fillable: [page_key, section_key, title, subtitle, content, media_url, video_url, created_at, updated_at],
    Model {
        pub id: i32,
        pub page_key: String,
        pub section_key: String,
        pub title: Option<String>,
        pub subtitle: Option<String>,
        pub content: Option<String>,
        pub media_url: Option<String>,
        pub video_url: Option<String>,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
