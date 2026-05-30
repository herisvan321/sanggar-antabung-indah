use rustbasic_core::model;

model! {
    table: "join_requests",
    fillable: [name, origin, whatsapp, class_category, motivation, created_at, updated_at],
    Model {
        pub id: i32,
        pub name: String,
        pub origin: String,
        pub whatsapp: String,
        pub class_category: String,
        pub motivation: Option<String>,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
