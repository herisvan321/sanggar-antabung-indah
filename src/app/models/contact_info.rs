use rustbasic_core::model;

model! {
    table: "contact_infos",
    fillable: [icon, label, value, created_at, updated_at],
    Model {
        pub id: i32,
        pub icon: String,
        pub label: String,
        pub value: String,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
