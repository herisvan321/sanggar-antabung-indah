use rustbasic_core::model;

model! {
    table: "permissions",
    Model {
        pub id: i32,
        pub name: String,
        pub guard_name: String,
    }
}
