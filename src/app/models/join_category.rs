use rustbasic_core::model;

model! {
    table: "join_categories",
    fillable: [name, description, created_at, updated_at],
    Model {
        pub id: i32,
        pub name: String,
        pub description: Option<String>,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
