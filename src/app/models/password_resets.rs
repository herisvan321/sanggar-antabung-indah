use rustbasic_core::model;
use rustbasic_core::chrono::NaiveDateTime;

model! {
    table: "password_resets",
    timestamps: false,
    fillable: [email, token, created_at],
    guarded: [],
    Model {
        pub email: String,
        pub token: String,
        pub created_at: NaiveDateTime,
    }
}
