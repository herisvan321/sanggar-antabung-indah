use rustbasic_core::model;

model! {
    table: "booking_requests",
    fillable: [name, email, whatsapp, date, show_type, details, created_at, updated_at],
    Model {
        pub id: i32,
        pub name: String,
        pub email: String,
        pub whatsapp: String,
        pub date: String,
        pub show_type: String,
        pub details: Option<String>,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
