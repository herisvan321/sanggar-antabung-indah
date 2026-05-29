use rustbasic_core::model;

model! {
    table: "structures",
    fillable: [name, role, icon, created_at, updated_at],
    Model {
        pub id: i32,
        pub name: String,
        pub role: String,
        pub icon: Option<String>,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
