use rustbasic_core::seeder;
use rustbasic_core::database::DB;
use crate::app::models::users;
use crate::app::models::role;
use crate::app::models::permission;
use rustbasic_core::bcrypt::{hash, DEFAULT_COST};
use rustbasic_core::colored::Colorize;
use rustbasic_core::serde_json;
use rustbasic_core::sqlx;
use sqlx::Row;

seeder! {
    run(db) {
        println!("   {} Sedang memproses DatabaseSeeder...", "⏳".blue());

        // 1. Seed Permissions
        let permissions = vec![
            ("manage_users", "web"),
            ("manage_schedules", "web"),
            ("manage_bookings", "web"),
            ("view_dashboard", "web"),
            ("manage_roles", "web"),
            ("manage_permissions", "web"),
            ("manage_settings", "web"),
        ];

        let mut permission_ids = std::collections::HashMap::new();

        for (name, guard) in permissions {
            let row = sqlx::query("SELECT id, name, guard_name FROM permissions WHERE name = ?")
                .bind(name)
                .fetch_optional(db)
                .await
                .unwrap_or(None);

            let exists = if let Some(r) = row {
                Some(permission::Model {
                    id: r.get("id"),
                    name: r.get("name"),
                    guard_name: r.get("guard_name"),
                })
            } else {
                None
            };

            let id = if let Some(p) = exists {
                println!("   {} Permission '{}' sudah ada, melewati...", "⏩".yellow(), name);
                p.id
            } else {
                let _ = DB::table(db, "permissions").insert(serde_json::json!({
                    "name": name,
                    "guard_name": guard,
                })).await;
                
                let created_row = sqlx::query("SELECT id, name, guard_name FROM permissions WHERE name = ?")
                    .bind(name)
                    .fetch_optional(db)
                    .await
                    .ok()
                    .flatten()
                    .expect("Gagal memuat permission yang baru dibuat");
                
                let p_id: i32 = created_row.get("id");
                println!("   {} Permission '{}' berhasil dibuat", "✅".green(), name);
                p_id
            };
            permission_ids.insert(name.to_string(), id);
        }

        // 2. Seed Roles
        let roles = vec![
            ("admin", "web"),
            ("instructor", "web"),
            ("member", "web"),
        ];

        let mut role_ids = std::collections::HashMap::new();

        for (name, guard) in roles {
            let row = sqlx::query("SELECT id, name, guard_name FROM roles WHERE name = ?")
                .bind(name)
                .fetch_optional(db)
                .await
                .unwrap_or(None);

            let exists = if let Some(r) = row {
                Some(role::Model {
                    id: r.get("id"),
                    name: r.get("name"),
                    guard_name: r.get("guard_name"),
                })
            } else {
                None
            };

            let id = if let Some(r) = exists {
                println!("   {} Role '{}' sudah ada, melewati...", "⏩".yellow(), name);
                r.id
            } else {
                let _ = DB::table(db, "roles").insert(serde_json::json!({
                    "name": name,
                    "guard_name": guard,
                })).await;

                let created_row = sqlx::query("SELECT id, name, guard_name FROM roles WHERE name = ?")
                    .bind(name)
                    .fetch_optional(db)
                    .await
                    .ok()
                    .flatten()
                    .expect("Gagal memuat role yang baru dibuat");
                
                let r_id: i32 = created_row.get("id");
                println!("   {} Role '{}' berhasil dibuat", "✅".green(), name);
                r_id
            };
            role_ids.insert(name.to_string(), id);
        }

        // 3. Assign Permissions to Roles (role_has_permissions)
        let role_permissions = vec![
            ("admin", vec!["manage_users", "manage_schedules", "manage_bookings", "view_dashboard", "manage_roles", "manage_permissions", "manage_settings"]),
            ("instructor", vec!["manage_schedules", "view_dashboard"]),
            ("member", vec!["view_dashboard"]),
        ];

        for (role_name, perm_names) in role_permissions {
            let role_id = role_ids.get(role_name).copied().unwrap();
            for perm_name in perm_names {
                let permission_id = permission_ids.get(perm_name).copied().unwrap();
                
                // Cek relasi
                let relation_exists = sqlx::query("SELECT 1 FROM role_has_permissions WHERE role_id = ? AND permission_id = ?")
                    .bind(role_id)
                    .bind(permission_id)
                    .fetch_optional(db)
                    .await
                    .unwrap_or(None)
                    .is_some();

                if !relation_exists {
                    let _ = sqlx::query("INSERT INTO role_has_permissions (role_id, permission_id) VALUES (?, ?)")
                        .bind(role_id)
                        .bind(permission_id)
                        .execute(db)
                        .await;
                }
            }
        }
        println!("   {} Relasi Role dan Permission berhasil dikonfigurasi", "✅".green());

        // 4. Seed Users and assign roles
        let password_hash = hash("password123", DEFAULT_COST).unwrap();

        let users_data = vec![
            ("admin@antabung.art", "Administrator Sanggar", "admin"),
            ("buyung@antabung.art", "Buyung Saluang", "instructor"),
            ("siti@antabung.art", "Siti Rahma", "instructor"),
            ("aditya@antabung.art", "Aditya Pratama", "member"),
            ("randi@antabung.art", "Randi Pacik", "member"),
        ];

        for (email, name, role_name) in users_data {
            let row = sqlx::query("SELECT id, name, email, password FROM users WHERE email = ?")
                .bind(email)
                .fetch_optional(db)
                .await
                .unwrap_or(None);

            let exists = if let Some(r) = row {
                Some(users::Model {
                    id: r.get("id"),
                    name: r.get("name"),
                    email: r.get("email"),
                    email_verified_at: None,
                    password: r.get("password"),
                    remember_token: None,
                })
            } else {
                None
            };

            let user_id = if let Some(u) = exists {
                println!("   {} User '{}' sudah ada, melewati...", "⏩".yellow(), email);
                u.id
            } else {
                let _ = DB::table(db, "users").insert(serde_json::json!({
                    "name": name,
                    "email": email,
                    "password": password_hash.clone(),
                })).await;

                let created_row = sqlx::query("SELECT id, name, email, password FROM users WHERE email = ?")
                    .bind(email)
                    .fetch_optional(db)
                    .await
                    .ok()
                    .flatten()
                    .expect("Gagal memuat user yang baru dibuat");
                
                let u_id: i32 = created_row.get("id");
                println!("   {} User '{}' ({}) berhasil dibuat", "✅".green(), name, email);
                u_id
            };

            // Assign Role (model_has_roles)
            let role_id = role_ids.get(role_name).copied().unwrap();
            
            let user_role_exists = sqlx::query("SELECT 1 FROM model_has_roles WHERE role_id = ? AND model_id = ? AND model_type = ?")
                .bind(role_id)
                .bind(user_id)
                .bind("User")
                .fetch_optional(db)
                .await
                .unwrap_or(None)
                .is_some();

            if !user_role_exists {
                let _ = sqlx::query("INSERT INTO model_has_roles (role_id, model_type, model_id) VALUES (?, ?, ?)")
                    .bind(role_id)
                    .bind("User")
                    .bind(user_id)
                    .execute(db)
                    .await;
            }
        }
        println!("   {} Penugasan Role ke Pengguna berhasil diselesaikan", "✅".green());

        // 5. Seed default settings
        let settings_count = DB::table(db, "settings").count().await.unwrap_or(0);
        if settings_count == 0 {
            let _ = DB::table(db, "settings").insert(serde_json::json!({
                "app_name": "Sanggar Antabung Indah",
                "app_logo_name": "ANTABUNG.ART",
                "meta_title": "Sanggar Antabung Indah | Nagari Sisawah Sijunjung",
                "meta_description": "Sanggar Antabung Indah - Digitalisasi Kesenian Randai, Tari Pijak Galeh, dan Musik Talempong Ungah khas Kenagarian Sisawah, Sumpur Kudus, Sijunjung.",
                "footer_description": "Pusat Pelestarian Kesenian Tradisional Randai & Kaba khas Nagari Wisata Sisawah, Kecamatan Sumpur Kudus, Kabupaten Sijunjung, Sumatera Barat.",
                "footer_copyright": "2026 SANGGAR ANTABUNG INDAH",
                "created_at": rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string(),
                "updated_at": rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string(),
            })).await;
            println!("   {} Default settings successfully seeded", "✅".green());
        }

        Ok(())
    }
}
