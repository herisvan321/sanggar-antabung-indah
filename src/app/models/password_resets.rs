use rustbasic_core::model;

model! {
    table: "password_resets",
    timestamps: false,
    fillable: [email, token, created_at],
    guarded: [],
    Model {
        pub email: String,
        pub token: String,
        pub created_at: String,
    }
}
