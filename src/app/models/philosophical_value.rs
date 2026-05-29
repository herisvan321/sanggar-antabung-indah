use rustbasic_core::model;

model! {
    table: "philosophical_values",
    fillable: [title, description, icon, tag, created_at, updated_at],
    Model {
        pub id: i32,
        pub title: String,
        pub description: String,
        pub icon: String,
        pub tag: Option<String>,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
