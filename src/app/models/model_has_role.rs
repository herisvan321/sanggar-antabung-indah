use rustbasic_core::model;

model! {
    table: "model_has_roles",
    Model {
        pub id: i32,
        pub role_id: i32,
        pub model_type: String,
        pub model_id: i32,
    }
}
