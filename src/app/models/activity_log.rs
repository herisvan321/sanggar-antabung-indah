use rustbasic_core::model;

model! {
    table: "activity_log",
    Model {
        pub id: i32,
        pub log_name: Option<String>,
        pub description: String,
        pub subject_type: Option<String>,
        pub subject_id: Option<i32>,
        pub causer_type: Option<String>,
        pub causer_id: Option<i32>,
        pub properties: Option<String>, // JSON string
    }
}
