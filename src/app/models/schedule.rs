use rustbasic_core::model;

model! {
    table: "schedules",
    fillable: [date, title, place, time, activity, category, created_at, updated_at],
    Model {
        pub id: i32,
        pub date: String,
        pub title: String,
        pub place: String,
        pub time: Option<String>,
        pub activity: Option<String>,
        pub category: String,
        pub created_at: Option<String>,
        pub updated_at: Option<String>,
    }
}
