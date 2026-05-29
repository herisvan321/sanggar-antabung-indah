use rustbasic_core::model;

model! {
    table: "programs",
    fillable: [title, description, icon, category, created_at, updated_at],
    Model {
        pub id: i32,
        pub title: String,
        pub description: String,
        pub icon: String,
        pub category: String,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
