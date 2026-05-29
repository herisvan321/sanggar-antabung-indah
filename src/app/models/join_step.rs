use rustbasic_core::model;

model! {
    table: "join_steps",
    fillable: [step, title, description, category, created_at, updated_at],
    Model {
        pub id: i32,
        pub step: Option<String>,
        pub title: Option<String>,
        pub description: String,
        pub category: String,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
