use rustbasic_core::model;

model! {
    table: "sop_rules",
    fillable: [icon, text, category, created_at, updated_at],
    Model {
        pub id: i32,
        pub icon: String,
        pub text: String,
        pub category: String,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
