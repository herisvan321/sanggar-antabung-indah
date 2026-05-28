/* ---------------------------------------------------------
 * 📑 LABEL: AuthService (services/auth_service.rs)
 * --------------------------------------------------------- */

use crate::app::models::{User, PasswordReset, role, model_has_role};
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;
use rustbasic_core::bcrypt::{hash, verify, DEFAULT_COST};
use rustbasic_core::uuid::Uuid;
use rustbasic_core::MailService;

pub struct AuthService {
    db: AnyPool,
}

impl AuthService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn register(&self, name: String, email: String, password: String) -> Result<(), &'static str> {
        // 1. Cek apakah email sudah terdaftar
        let existing = DB::table(&self.db, "users")
            .where_("email", &email)
            .first::<User>()
            .await
            .ok()
            .flatten();

        if existing.is_some() {
            return Err("Email sudah terdaftar");
        }

        // 2. Hash Password
        let hashed = hash(password, DEFAULT_COST).unwrap();

        // 3. Simpan ke Database
        let create_result = User::create(&self.db, json!({
            "name": name,
            "email": email,
            "password": hashed,
        })).await;

        if create_result.is_err() {
            return Err("Gagal mendaftar, coba lagi.");
        }

        // 4. Hubungkan user baru dengan role 'member'
        let new_user = DB::table(&self.db, "users")
            .where_("email", &email)
            .first::<User>()
            .await
            .ok()
            .flatten();

        if let Some(u) = new_user {
            let member_role = DB::table(&self.db, "roles")
                .where_("name", "member")
                .first::<role::Model>()
                .await
                .ok()
                .flatten();

            if let Some(role) = member_role {
                let _ = model_has_role::Model::create(&self.db, json!({
                    "role_id": role.id,
                    "model_type": "User",
                    "model_id": u.id,
                })).await;
            }
        }

        Ok(())
    }

    pub async fn login(&self, email: String, password: String) -> Result<User, &'static str> {
        let user = DB::table(&self.db, "users")
            .where_("email", &email)
            .first::<User>()
            .await
            .ok()
            .flatten();

        if let Some(u) = user {
            if verify(&password, &u.password).unwrap_or(false) {
                return Ok(u);
            }
        }

        Err("Email atau password salah")
    }

    pub async fn send_reset_link(&self, email: String) -> Result<(), &'static str> {
        let user = DB::table(&self.db, "users")
            .where_("email", &email)
            .first::<User>()
            .await
            .ok()
            .flatten();

        if let Some(u) = user {
            let token = Uuid::new_v4().to_string();

            // Hapus token lama jika ada
            let _ = DB::table(&self.db, "password_resets")
                .where_("email", &u.email)
                .delete()
                .await;
            
            // Insert token baru
            let _ = PasswordReset::create(&self.db, json!({
                "email": u.email.clone(),
                "token": token.clone(),
                "created_at": rustbasic_core::chrono::Utc::now().naive_utc(),
            })).await;

            // Kirim email
            let config = rustbasic_core::Config::load();
            let app_name = std::env::var("APP_NAME").unwrap_or_else(|_| "RustBasic".to_string());
            let reset_url = format!("{}/reset-password?token={}", config.app_url, token);

            let subject = format!("Reset Password - {}", app_name);
            let body = rustbasic_core::view::render_to_string("emails/reset.rb.html", rustbasic_core::minijinja::context! {
                app_name => app_name,
                reset_url => reset_url,
            });

            if let Err(e) = MailService::send_email(&u.email, &subject, &body).await {
                rustbasic_core::tracing::error!("Gagal mengirim email reset: {}", e);
                return Err("Gagal mengirim email reset");
            }
        }

        Ok(())
    }

    pub async fn update_password(&self, token: String, password: String) -> Result<(), &'static str> {
        let reset = DB::table(&self.db, "password_resets")
            .where_("token", &token)
            .first::<PasswordReset>()
            .await
            .ok()
            .flatten();

        if let Some(r) = reset {
            let now = rustbasic_core::chrono::Utc::now().naive_utc();
            let created_at = rustbasic_core::chrono::NaiveDateTime::parse_from_str(
                &r.created_at.replace("Z", "").split('.').next().unwrap_or(&r.created_at),
                "%Y-%m-%dT%H:%M:%S"
            ).unwrap_or(now);
            let duration = now.signed_duration_since(created_at);
            
            if duration.num_minutes() > 60 {
                let _ = DB::table(&self.db, "password_resets")
                    .where_("email", &r.email)
                    .delete()
                    .await;
                return Err("Tautan reset password sudah kadaluarsa (melebihi 60 menit).");
            }

            let hashed = hash(password, DEFAULT_COST).unwrap();

            // Update user password
            let _ = DB::table(&self.db, "users")
                .where_("email", &r.email)
                .update(json!({
                    "password": hashed
                }))
                .await;

            // Hapus Token
            let _ = DB::table(&self.db, "password_resets")
                .where_("email", &r.email)
                .delete()
                .await;

            return Ok(());
        }

        Err("Token tidak valid atau sudah kadaluarsa.")
    }
}
