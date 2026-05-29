use rustbasic_core::model;

model! {
    table: "metrics",
    fillable: [value, label, created_at, updated_at],
    Model {
        pub id: i32,
        pub value: String,
        pub label: String,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
