use rustbasic_core::{Schema, SchemaManager, MigrationTrait, DbErr};
use rustbasic_core::async_trait;

pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    fn name(&self) -> &str {
        "m20260529_210000_create_cms_tables"
    }

    async fn up<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        // 1. Articles (Berita)
        Schema::create(manager, "articles", |table| {
            table.id();
            table.no_timestamps();
            table.string("title").not_null();
            table.string("slug").not_null().unique();
            table.string("content").nullable();
            table.string("media_url").nullable();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // 2. Schedules (Jadwal/Agenda)
        Schema::create(manager, "schedules", |table| {
            table.id();
            table.no_timestamps();
            table.string("date").not_null();
            table.string("title").not_null();
            table.string("place").not_null();
            table.string("time").nullable();
            table.string("activity").nullable();
            table.string("category").not_null();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // 3. Programs (Layanan/Program Kerja)
        Schema::create(manager, "programs", |table| {
            table.id();
            table.no_timestamps();
            table.string("title").not_null();
            table.string("description").not_null();
            table.string("icon").not_null();
            table.string("category").not_null();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // 4. Metrics (Metrik Kesenian)
        Schema::create(manager, "metrics", |table| {
            table.id();
            table.no_timestamps();
            table.string("value").not_null();
            table.string("label").not_null();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // 5. Structures (Struktur Pengurus)
        Schema::create(manager, "structures", |table| {
            table.id();
            table.no_timestamps();
            table.string("name").not_null();
            table.string("role").not_null();
            table.string("icon").nullable();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // 6. Philosophical Values (Nilai Filosofi)
        Schema::create(manager, "philosophical_values", |table| {
            table.id();
            table.no_timestamps();
            table.string("title").not_null();
            table.string("description").not_null();
            table.string("icon").not_null();
            table.string("tag").nullable();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // 7. Galleries (Galeri Foto)
        Schema::create(manager, "galleries", |table| {
            table.id();
            table.no_timestamps();
            table.string("category").not_null();
            table.string("title").not_null();
            table.string("description").nullable();
            table.string("media_url").not_null();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // 8. Join Steps (Syarat & Alur Gabung)
        Schema::create(manager, "join_steps", |table| {
            table.id();
            table.no_timestamps();
            table.string("step").nullable();
            table.string("title").nullable();
            table.string("description").not_null();
            table.string("category").not_null();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // 9. Booking Packages (Paket Reservasi)
        Schema::create(manager, "booking_packages", |table| {
            table.id();
            table.no_timestamps();
            table.string("name").not_null();
            table.string("description").not_null();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // 10. Sop Rules (Aturan Etika / SOP)
        Schema::create(manager, "sop_rules", |table| {
            table.id();
            table.no_timestamps();
            table.string("icon").not_null();
            table.string("text").not_null();
            table.string("category").not_null();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // 11. Contact Infos (Informasi Kontak)
        Schema::create(manager, "contact_infos", |table| {
            table.id();
            table.no_timestamps();
            table.string("icon").not_null();
            table.string("label").not_null();
            table.string("value").not_null();
            table.string("created_at").nullable();
            table.string("updated_at").nullable();
        }).await?;

        // Ubah kapasitas kolom di MySQL secara dinamis agar tidak dibatasi VARCHAR(255) bawaan Schema
        let is_mysql = if let Ok(conn) = manager.pool.acquire().await {
            conn.backend_name() == "MySQL"
        } else {
            false
        };

        if is_mysql {
            // Ubah kapasitas deskripsi/konten agar muat teks panjang & markup HTML dari editor Quill
            let _ = rustbasic_core::sqlx::query("ALTER TABLE articles MODIFY content VARCHAR(8000) NULL").execute(manager.pool).await;
            let _ = rustbasic_core::sqlx::query("ALTER TABLE programs MODIFY description VARCHAR(1000) NOT NULL").execute(manager.pool).await;
            let _ = rustbasic_core::sqlx::query("ALTER TABLE philosophical_values MODIFY description VARCHAR(1000) NOT NULL").execute(manager.pool).await;
            let _ = rustbasic_core::sqlx::query("ALTER TABLE galleries MODIFY description VARCHAR(1000) NULL").execute(manager.pool).await;
            let _ = rustbasic_core::sqlx::query("ALTER TABLE join_steps MODIFY description VARCHAR(1000) NOT NULL").execute(manager.pool).await;
            let _ = rustbasic_core::sqlx::query("ALTER TABLE booking_packages MODIFY description VARCHAR(1000) NOT NULL").execute(manager.pool).await;
            let _ = rustbasic_core::sqlx::query("ALTER TABLE sop_rules MODIFY text VARCHAR(1000) NOT NULL").execute(manager.pool).await;
        }

        Ok(())
    }

    async fn down<'a>(&self, manager: &'a SchemaManager<'a>) -> Result<(), DbErr> {
        Schema::drop(manager, "contact_infos").await?;
        Schema::drop(manager, "sop_rules").await?;
        Schema::drop(manager, "booking_packages").await?;
        Schema::drop(manager, "join_steps").await?;
        Schema::drop(manager, "galleries").await?;
        Schema::drop(manager, "philosophical_values").await?;
        Schema::drop(manager, "structures").await?;
        Schema::drop(manager, "metrics").await?;
        Schema::drop(manager, "programs").await?;
        Schema::drop(manager, "schedules").await?;
        Schema::drop(manager, "articles").await?;
        Ok(())
    }
}
