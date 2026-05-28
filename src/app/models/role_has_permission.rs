use rustbasic_core::model;

model! {
    table: "role_has_permissions",
    Model {
        pub id: i32,
        pub permission_id: i32,
        pub role_id: i32,
    }
}
