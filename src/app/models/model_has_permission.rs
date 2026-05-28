use rustbasic_core::model;

model! {
    table: "model_has_permissions",
    Model {
        pub id: i32,
        pub permission_id: i32,
        pub model_type: String,
        pub model_id: i32,
    }
}
