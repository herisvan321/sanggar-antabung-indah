use rustbasic_core::model;

model! {
    table: "roles",
    Model {
        pub id: i32,
        pub name: String,
        pub guard_name: String,
    }
}
