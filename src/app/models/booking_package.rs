use rustbasic_core::model;

model! {
    table: "booking_packages",
    fillable: [name, description, created_at, updated_at],
    Model {
        pub id: i32,
        pub name: String,
        pub description: String,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
