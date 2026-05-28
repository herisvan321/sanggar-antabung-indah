use rustbasic_core::seeder;
use rustbasic_core::database::DB;
use crate::app::models::users;
use rustbasic_core::bcrypt::{hash, DEFAULT_COST};
use rustbasic_core::colored::Colorize;
use rustbasic_core::serde_json;

seeder! {
    run(db) {
        println!("   {} Sedang memproses DatabaseSeeder...", "⏳".blue());
        
        // 1. Cek apakah user admin sudah ada
        let admin_exists = DB::table(db, "users")
            .where_("email", "admin@rustbasic.com")
            .first::<users::Model>()
            .await
            .map(|r| r.is_some())
            .unwrap_or(false);

        if !admin_exists {
            let hashed_password = hash("password123", DEFAULT_COST).unwrap();
            
            let _ = DB::table(db, "users").insert(serde_json::json!({
                "name": "Administrator",
                "email": "admin@rustbasic.com",
                "password": hashed_password,
            })).await;

            println!("   {} User admin default berhasil dibuat (admin@rustbasic.com / password123)", "✅".green());
        } else {
            println!("   {} User admin sudah ada, melewati...", "⏩".yellow());
        }

        Ok(())
    }
}
