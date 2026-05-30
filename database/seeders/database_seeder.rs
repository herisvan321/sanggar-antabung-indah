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
            ("halaman_jadwal", "web"),
            ("manage_bookings", "web"),
            ("view_dashboard", "web"),
            ("manage_roles", "web"),
            ("manage_permissions", "web"),
            ("manage_settings", "web"),
            ("halaman_pages", "web"),
            ("halaman_berita", "web"),
            ("halaman_program", "web"),
            ("halaman_home", "web"),
            ("halaman_profil", "web"),
            ("halaman_filosofi", "web"),
            ("halaman_galeri", "web"),
            ("halaman_join", "web"),
            ("halaman_booking", "web"),
            ("halaman_sop", "web"),
            ("halaman_kontak", "web"),

            // CRUD Permissions
            ("create_berita", "web"), ("update_berita", "web"), ("delete_berita", "web"),
            ("create_jadwal", "web"), ("update_jadwal", "web"), ("delete_jadwal", "web"),
            ("create_program", "web"), ("update_program", "web"), ("delete_program", "web"),
            ("create_home", "web"), ("update_home", "web"), ("delete_home", "web"),
            ("create_profil", "web"), ("update_profil", "web"), ("delete_profil", "web"),
            ("create_filosofi", "web"), ("update_filosofi", "web"), ("delete_filosofi", "web"),
            ("create_galeri", "web"), ("update_galeri", "web"), ("delete_galeri", "web"),
            ("create_join", "web"), ("update_join", "web"), ("delete_join", "web"),
            ("create_booking", "web"), ("update_booking", "web"), ("delete_booking", "web"),
            ("create_sop", "web"), ("update_sop", "web"), ("delete_sop", "web"),
            ("create_kontak", "web"), ("update_kontak", "web"), ("delete_kontak", "web"),
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
            ("admin", vec![
                "manage_users", "halaman_jadwal", "manage_bookings", "view_dashboard",
                "manage_roles", "manage_permissions", "manage_settings", "halaman_pages",
                "halaman_berita", "halaman_program", "halaman_home", "halaman_profil",
                "halaman_filosofi", "halaman_galeri", "halaman_join",
                "halaman_booking", "halaman_sop", "halaman_kontak",
                
                // CRUD Permissions for Admin
                "create_berita", "update_berita", "delete_berita",
                "create_jadwal", "update_jadwal", "delete_jadwal",
                "create_program", "update_program", "delete_program",
                "create_home", "update_home", "delete_home",
                "create_profil", "update_profil", "delete_profil",
                "create_filosofi", "update_filosofi", "delete_filosofi",
                "create_galeri", "update_galeri", "delete_galeri",
                "create_join", "update_join", "delete_join",
                "create_booking", "update_booking", "delete_booking",
                "create_sop", "update_sop", "delete_sop",
                "create_kontak", "update_kontak", "delete_kontak"
            ]),
            ("instructor", vec![
                "halaman_jadwal", "view_dashboard",
                "create_jadwal", "update_jadwal", "delete_jadwal"
            ]),
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
                "active_pages": "{\"home\":true,\"profil\":true,\"filosofi\":true,\"galeri\":true,\"jadwal\":true,\"program\":true,\"join\":true,\"berita\":true,\"booking\":true,\"kontak\":true,\"sop\":true}",
                "created_at": rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string(),
                "updated_at": rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string(),
            })).await;
            println!("   {} Default settings successfully seeded", "✅".green());
        }

        // 6. Seed default page sections
        let sections_count = DB::table(db, "page_sections").count().await.unwrap_or(0);
        if sections_count == 0 {
            let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();

            // 6.1 HOME PAGE
            let home_secs: Vec<(&str, &str, Option<&str>, Option<&str>, Option<&str>, Option<&str>, Option<&str>)> = vec![
                ("home", "hero", Some("Seni Randai \nLembah Sisawah."), Some("Selamat datang di portal resmi Sanggar Antabung Indah. Menjaga denyut nadi kesenian tradisional Randai, musik Talempong Ungah, dan warisan budaya adat Kenagarian Sisawah, Sumpur Kudus, Sijunjung."), Some(r#"[{"text": "Gabung Gelanggang", "link": "/join"}, {"text": "Booking Pementasan", "link": "/booking"}]"#), None, None),
                ("home", "video", Some("Randai Anak Nagari Sisawah"), Some("Dokumentasi pertunjukan teater kolosal Randai Minangkabau. Nikmati keselarasan langkah silat gelanggang yang diwariskan turun-temurun di Sijunjung."), Some(r#"{"badge": "PEMENTASAN KABA", "status": "LIVE DOCUMENTARY"}"#), None, Some("https://www.youtube.com/embed/R9Z_Gf21y18")),
                ("home", "legalitas", Some("Gelanggang Sanggar"), Some("Alam Takambang Jadi Guru — Seni Menjaga Adat Salingka Nagari."), Some(r#"[{"icon": "fa-check-double", "text": "Terdaftar di Dinas Pendidikan & Kebudayaan Sijunjung"}, {"icon": "fa-stamp", "text": "SK Pendirian Nomor: 430/128/Disparpora-SJJ/2012"}, {"icon": "fa-map-pin", "text": "Jorong Tarok, Nagari Sisawah, Sijunjung"}]"#), None, None),
                ("home", "agenda", Some("Jadwal Terdekat"), None, Some(r#"[{"date": "12 Sep 2026", "title": "Pementasan Randai Kolosal di Pelataran Ngalau Antabuang", "place": "Desa Wisata Sisawah"}, {"date": "28 Okt 2026", "title": "Prosesi Budaya Bakaua Adat Nagari Sisawah", "place": "Gelanggang Balai Adat"}, {"date": "15 Des 2026", "title": "Festival Budaya Lansek Manih Sijunjung", "place": "Muaro Sijunjung"}]"#), None, None),
                ("home", "metrik", Some("Metrik Kesenian"), None, Some(r#"[{"value": "120+", "label": "Anak Sasian"}, {"value": "15+", "label": "Mitra Wisata"}, {"value": "80+", "label": "Pementasan"}, {"value": "14 Th", "label": "Mengabdi"}]"#), None, None),
                ("home", "services", Some("Layanan & Atraksi Budaya"), None, Some(r#"[{"title": "Pendidikan Randai Anak Nagari", "desc": "Pelatihan rutin gerakan silek (silat) dan teater tutur bagi generasi muda Sisawah.", "icon": "fa-users"}, {"title": "Konservasi Sastra Kaba", "desc": "Perpustakaan naskah digital cerita rakyat Minang, seperti Cindua Mato dan Nan Tongga.", "icon": "fa-book-open"}, {"title": "Kelas Talempong Ungah & Canang", "desc": "Eksplorasi permainan alat musik perkusi etnis khas Sijunjung.", "icon": "fa-music"}, {"title": "Ekowisata Seni Ngalau Antabuang", "desc": "Paket pertunjukan seni menyatu dengan petualangan alam menyusuri gua karst.", "icon": "fa-mountain-sun"}]"#), None, None),
            ];

            for (page, sec, title, subtitle, content, media, video) in home_secs {
                let _ = DB::table(db, "page_sections").insert(serde_json::json!({
                    "page_key": page,
                    "section_key": sec,
                    "title": title,
                    "subtitle": subtitle,
                    "content": content,
                    "media_url": media,
                    "video_url": video,
                    "created_at": now.clone(),
                    "updated_at": now.clone(),
                })).await;
            }

            // 6.2 PROFIL PAGE
            let profil_secs: Vec<(&str, &str, Option<&str>, Option<&str>, Option<&str>, Option<&str>, Option<&str>)> = vec![
                ("profil", "header", Some("Adat Pusako, \nKreativitas Tanpa Batas."), Some("Didirikan di Kenagarian Sisawah, Sijunjung, kami berdedikasi menjaga warisan leluhur melalui teater Randai dan kesenian tradisional Minangkabau."), None, None, None),
                ("profil", "sejarah", Some("Terinspirasi Keindahan Ngalau Antabuang"), Some("Sanggar Antabung Indah didirikan oleh para pemuda dan pemuka adat Nagari Sisawah. Nama \"Antabung\" diambil dari objek wisata gua alam termahsyur di Sisawah, yaitu Ngalau Antabuang. Sanggar ini dibentuk sebagai wadah anak nagari untuk berlatih silat (silek) dan randai setelah pulang dari sawah, guna melestarikan adat salingka nagari di tengah derasnya arus modernisasi."), Some(r#""Kesenian Randai di Sisawah bukan sekadar hiburan, melainkan sarana musyawarah adat dan penyampaian petuah moral kehidupan.""#), None, None),
                ("profil", "visi_misi", Some("Pilar Kebudayaan Nagari Sisawah"), None, Some(r#"[{"text": "Melestarikan randai, musik Talempong Ungah, dan seni tari tradisi di kalangan anak sasian (generasi muda)."}, {"text": "Mengintegrasikan pementasan seni tradisi sebagai daya tarik pariwisata unggulan Desa Wisata Nagari Sisawah."}, {"text": "Memanfaatkan media digital untuk mengenalkan keelokan budaya Sijunjung ke mata dunia internasional."}]"#), None, None),
                ("profil", "struktur", Some("Struktur Pengurus & Tokoh Adat"), None, Some(r#"[{"name": "Datuak Bagindo Rajo", "role": "Penasihat Adat / Ninik Mamak", "icon": "fa-user-tie"}, {"name": "Andi Saputra M.Sn", "role": "Ketua Pengurus & Kurator Seni", "icon": "fa-users-cog"}, {"name": "Rina Permata Sari", "role": "Sekretaris & Hubungan Wisata", "icon": "fa-file-signature"}, {"name": "Doni Aliansyah", "role": "Bendahara & Manajemen Alat", "icon": "fa-file-invoice-dollar"}, {"name": "Sutan Mangkuto", "role": "Guru Gadang Silek (Silat)", "icon": "fa-shoe-prints"}, {"name": "Novianti M.Pd", "role": "Pelatih Randai & Sastra Tutur", "icon": "fa-feather-alt"}, {"name": "Ilham Rahmadani", "role": "Pemain Talempong Ungah", "icon": "fa-music"}, {"name": "Agung Gunawan", "role": "Koordinator Gelanggang Latihan", "icon": "fa-tools"}, {"name": "Bundo Kanduang Sisawah", "role": "Pelestari Busana Adat", "icon": "fa-female"}]"#), None, None),
            ];

            for (page, sec, title, subtitle, content, media, video) in profil_secs {
                let _ = DB::table(db, "page_sections").insert(serde_json::json!({
                    "page_key": page,
                    "section_key": sec,
                    "title": title,
                    "subtitle": subtitle,
                    "content": content,
                    "media_url": media,
                    "video_url": video,
                    "created_at": now.clone(),
                    "updated_at": now.clone(),
                })).await;
            }

            // 6.3 FILOSOFI PAGE
            let filosofi_secs: Vec<(&str, &str, Option<&str>, Option<&str>, Option<&str>, Option<&str>, Option<&str>)> = vec![
                ("filosofi", "header", Some("Makna Langkah \n& Kaba Nagari."), Some("Di Sanggar Antabung Indah, seni Randai bukan sekadar gerakan fisik, melainkan jembatan penyampaian pesan luhur adat salingka nagari Sisawah."), None, None, None),
                ("filosofi", "nilai", Some("Nilai-Nilai Adat"), None, Some(r#"[{"title": "Galuang (Lingkaran)", "desc": "Gerak melingkar melambangkan kebulatan tekad mufakat di Minangkabau. Gelanggang randai yang bulat melambangkan kesetaraan derajat seluruh anak nagari.", "icon": "fa-dot-circle", "tag": "Gerak Gelanggang"}, {"title": "Silek Sisawah (Bela Diri)", "desc": "Pondasi fisik utama randai. Gerakan silat tradisional khas Sumpur Kudus yang defensif, mengajarkan kerendahan hati.", "icon": "fa-fist-raised", "tag": "Silek Tradisional"}, {"title": "Bakaba Kuno (Sastra Lisan)", "desc": "Penyampaian cerita moral (kaba) oleh Tukang Kaba. Menjaga tuturan sejarah pahlawan dan silsilah suku di Sijunjung agar tidak punah.", "icon": "fa-book-open", "tag": "Teater Tutur"}, {"title": "Talempong Ungah (Irama)", "desc": "Tabuhan instrumen khas daerah Sijunjung yang rancak. Denting logamnya melambangkan semangat kerja sama bergotong-royong.", "icon": "fa-music", "tag": "Ritme Nagari"}]"#), None, None),
            ];

            for (page, sec, title, subtitle, content, media, video) in filosofi_secs {
                let _ = DB::table(db, "page_sections").insert(serde_json::json!({
                    "page_key": page,
                    "section_key": sec,
                    "title": title,
                    "subtitle": subtitle,
                    "content": content,
                    "media_url": media,
                    "video_url": video,
                    "created_at": now.clone(),
                    "updated_at": now.clone(),
                })).await;
            }

            // 6.4 GALERI PAGE
            let _ = DB::table(db, "page_sections").insert(serde_json::json!({
                "page_key": "galeri",
                "section_key": "header",
                "title": "Dokumentasi Gelanggang \n& Aktivitas Budaya.",
                "subtitle": "Kumpulan visual rekam jejak latihan rutin anak sasian, pementasan randai, dan pesona alam Ngalau Antabuang.",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;

            // 6.5 JADWAL PAGE
            let jadwal_secs: Vec<(&str, &str, Option<&str>, Option<&str>, Option<&str>, Option<&str>, Option<&str>)> = vec![
                ("jadwal", "header", Some("Jadwal Gelanggang \n& Pentas Budaya."), Some("Ikuti dan saksikan pementasan rutin serta jadwal latihan terbuka kami di Nagari Sisawah."), None, None, None),
                ("jadwal", "latihan", Some("Jadwal Latihan Terbuka"), None, Some(r#"[{"day": "Selasa & Jumat", "time": "20:00 - 23:00 WIB", "activity": "Latihan Silek & Randai Terbuka", "place": "Gelanggang Utama Jorong Tarok"}, {"day": "Sabtu", "time": "14:00 - 17:00 WIB", "activity": "Kelas Talempong Ungah & Canang Anak-Anak", "place": "Pendopo Sanggar"}]"#), None, None),
                ("jadwal", "pertunjukan", Some("Jadwal Pertunjukan Besar"), None, Some(r#"[{"date": "12 Sep 2026", "title": "Pementasan Randai Kolosal di Pelataran Ngalau Antabuang", "place": "Desa Wisata Sisawah"}, {"date": "28 Okt 2026", "title": "Prosesi Budaya Bakaua Adat Nagari Sisawah", "place": "Gelanggang Balai Adat"}]"#), None, None),
            ];

            for (page, sec, title, subtitle, content, media, video) in jadwal_secs {
                let _ = DB::table(db, "page_sections").insert(serde_json::json!({
                    "page_key": page,
                    "section_key": sec,
                    "title": title,
                    "subtitle": subtitle,
                    "content": content,
                    "media_url": media,
                    "video_url": video,
                    "created_at": now.clone(),
                    "updated_at": now.clone(),
                })).await;
            }

            // 6.6 PROGRAM PAGE
            let program_secs: Vec<(&str, &str, Option<&str>, Option<&str>, Option<&str>, Option<&str>, Option<&str>)> = vec![
                ("program", "header", Some("Program Pelestarian \nSeni Tradisi."), Some("Kami menyelenggarakan berbagai program berkelanjutan untuk menjaga warisan adat budaya tetap hidup."), None, None, None),
                ("program", "reguler", Some("Kelas Seni & Budaya Reguler"), None, Some(r#"[{"title": "Kelas Silek Tradisi", "desc": "Pelatihan bela diri silat Minang aliran Sisawah untuk melatih fisik.", "icon": "fa-shoe-prints"}, {"title": "Teater tutur Randai", "desc": "Kelas akting teater rakyat, vokal dendang, dan tepukan celana galembong.", "icon": "fa-users"}]"#), None, None),
                ("program", "ekowisata", Some("Ekowisata Seni Sisawah"), None, Some(r#"[{"title": "Pentas Budaya Gua", "desc": "Menyaksikan randai di mulut Gua Ngalau Antabuang yang eksotis.", "icon": "fa-mountain-sun"}, {"title": "Jelajah Wisata Adat", "desc": "Tur keliling nagari mengenal sejarah adat dan prosesi pertanian tradisional.", "icon": "fa-leaf"}]"#), None, None),
            ];

            for (page, sec, title, subtitle, content, media, video) in program_secs {
                let _ = DB::table(db, "page_sections").insert(serde_json::json!({
                    "page_key": page,
                    "section_key": sec,
                    "title": title,
                    "subtitle": subtitle,
                    "content": content,
                    "media_url": media,
                    "video_url": video,
                    "created_at": now.clone(),
                    "updated_at": now.clone(),
                })).await;
            }

            // 6.7 JOIN PAGE
            let join_secs: Vec<(&str, &str, Option<&str>, Option<&str>, Option<&str>, Option<&str>, Option<&str>)> = vec![
                ("join", "header", Some("Gabung Sasian \nSanggar Antabung."), Some("Mari menjadi bagian dari penjaga nyala api kesenian tradisional Minangkabau di Sijunjung."), None, None, None),
                ("join", "syarat", Some("Persyaratan Anggota Baru"), None, Some(r#"[{"text": "Terbuka untuk anak nagari Sisawah maupun umum usia 7 - 25 tahun"}, {"text": "Memiliki komitmen tinggi untuk mengikuti latihan rutin secara disiplin"}, {"text": "Mendapatkan izin tertulis dari orang tua bagi yang berusia di bawah 17 tahun"}]"#), None, None),
                ("join", "pendaftaran", Some("Alur Pendaftaran"), None, Some(r#"[{"step": "1", "title": "Isi Formulir", "desc": "Kunjungi gelanggang utama Jorong Tarok setiap hari latihan untuk mengambil formulir."}, {"step": "2", "title": "Seleksi Fisik & Wawancara", "desc": "Wawancara pengenalan minat bakat bersama guru gadang sanggar."}, {"step": "3", "title": "Pengukuhan Sasian", "desc": "Prosesi adat pengukuhan murid baru gelanggang (sasasian)."}]"#), None, None),
            ];

            for (page, sec, title, subtitle, content, media, video) in join_secs {
                let _ = DB::table(db, "page_sections").insert(serde_json::json!({
                    "page_key": page,
                    "section_key": sec,
                    "title": title,
                    "subtitle": subtitle,
                    "content": content,
                    "media_url": media,
                    "video_url": video,
                    "created_at": now.clone(),
                    "updated_at": now.clone(),
                })).await;
            }

            // 6.8 BERITA PAGE
            let berita_secs: Vec<(&str, &str, Option<&str>, Option<&str>, Option<&str>, Option<&str>, Option<&str>)> = vec![
                ("berita", "header", Some("Warta & Kabar \nTerbaru Sanggar."), Some("Ikuti terus perkembangan aktivitas pementasan, dokumentasi budaya, dan pengumuman terbaru kami."), None, None, None),
                ("berita", "artikel", Some("Kumpulan Artikel Berita"), None, Some(r#"[{"date": "15 Mei 2026", "title": "Sukses Gelar Randai Kolosal di Festival Lansek Manih", "summary": "Sanggar Antabung Indah tampil memukau ratusan penonton di Muaro Sijunjung..."}, {"date": "10 Apr 2026", "title": "Digitalisasi Sastra Lisan Kaba Minang", "summary": "Kolaborasi bersama akademisi mendokumentasikan kaba kuno Sisawah secara digital..."}]"#), None, None),
            ];

            for (page, sec, title, subtitle, content, media, video) in berita_secs {
                let _ = DB::table(db, "page_sections").insert(serde_json::json!({
                    "page_key": page,
                    "section_key": sec,
                    "title": title,
                    "subtitle": subtitle,
                    "content": content,
                    "media_url": media,
                    "video_url": video,
                    "created_at": now.clone(),
                    "updated_at": now.clone(),
                })).await;
            }

            // 6.9 BOOKING PAGE
            let booking_secs: Vec<(&str, &str, Option<&str>, Option<&str>, Option<&str>, Option<&str>, Option<&str>)> = vec![
                ("booking", "header", Some("Undang Pementasan \nAdat & Festival."), Some("Kami menerima undangan pertunjukan Randai, Talempong Ungah, dan tari penyambutan tamu untuk berbagai acara."), None, None, None),
                ("booking", "paket", Some("Pilihan Paket Pertunjukan"), None, Some(r#"[{"name": "Paket Randai Kolosal", "desc": "Pertunjukan randai lengkap 1-2 jam dengan 25+ pemusik dan pesilat gelanggang."}, {"name": "Paket Musik Talempong", "desc": "Tabuhan instrumen Talempong Ungah penyambutan tamu resmi."}]"#), None, None),
                ("booking", "form", Some("Petunjuk Reservasi Panggung"), None, Some(r#"[{"icon": "fa-phone-alt", "text": "Hubungi kontak perwakilan pengurus minimal 14 hari sebelum acara."}, {"icon": "fa-file-signature", "text": "Lengkapi surat izin kegiatan dari kepolisian/setempat."}]"#), None, None),
            ];

            for (page, sec, title, subtitle, content, media, video) in booking_secs {
                let _ = DB::table(db, "page_sections").insert(serde_json::json!({
                    "page_key": page,
                    "section_key": sec,
                    "title": title,
                    "subtitle": subtitle,
                    "content": content,
                    "media_url": media,
                    "video_url": video,
                    "created_at": now.clone(),
                    "updated_at": now.clone(),
                })).await;
            }

            // 6.10 KONTAK PAGE
            let kontak_secs: Vec<(&str, &str, Option<&str>, Option<&str>, Option<&str>, Option<&str>, Option<&str>)> = vec![
                ("kontak", "header", Some("Hubungi Gelanggang \nKami."), Some("Pintu sanggar kami selalu terbuka untuk diskusi kebudayaan, undangan pementasan, dan kunjungan wisata."), None, None, None),
                ("kontak", "info", Some("Informasi Kontak Resmi"), None, Some(r#"[{"icon": "fa-envelope", "label": "Email Kami", "val": "info@antabung.art"}, {"icon": "fa-phone", "label": "Telepon / WA", "val": "+62 823-8899-7711"}, {"icon": "fa-map-marker-alt", "label": "Alamat Fisik", "val": "Jorong Tarok, Nagari Sisawah, Sijunjung, Sumatera Barat"}]"#), None, None),
                ("kontak", "peta", Some("Lokasi Google Maps"), None, Some(r#"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.020580971032!2d100.865!3d-0.455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2b34a6!2sSisawah!5e0!3m2!1sid!2sid!4v1700000000000"#), None, None),
            ];

            for (page, sec, title, subtitle, content, media, video) in kontak_secs {
                let _ = DB::table(db, "page_sections").insert(serde_json::json!({
                    "page_key": page,
                    "section_key": sec,
                    "title": title,
                    "subtitle": subtitle,
                    "content": content,
                    "media_url": media,
                    "video_url": video,
                    "created_at": now.clone(),
                    "updated_at": now.clone(),
                })).await;
            }

            // 6.11 SOP PAGE
            let sop_secs: Vec<(&str, &str, Option<&str>, Option<&str>, Option<&str>, Option<&str>, Option<&str>)> = vec![
                ("sop", "header", Some("Aturan Gelanggang \n& SOP Sanggar."), Some("Panduan etika perilaku (adab) bersilat dan berlatih bagi seluruh murid dan pengurus Sanggar."), None, None, None),
                ("sop", "aturan", Some("Aturan Etika Berlatih"), None, Some(r#"[{"icon": "fa-user-clock", "text": "Hadir di gelanggang 15 menit sebelum latihan dimulai"}, {"icon": "fa-pray", "text": "Menjaga adab saling menghormati guru gadang dan teman sejawat"}, {"icon": "fa-tshirt", "text": "Wajib mengenakan pakaian latihan hitam longgar (celana galembong) resmi"}]"#), None, None),
            ];

            for (page, sec, title, subtitle, content, media, video) in sop_secs {
                let _ = DB::table(db, "page_sections").insert(serde_json::json!({
                    "page_key": page,
                    "section_key": sec,
                    "title": title,
                    "subtitle": subtitle,
                    "content": content,
                    "media_url": media,
                    "video_url": video,
                    "created_at": now.clone(),
                    "updated_at": now.clone(),
                })).await;
            }

            println!("   {} Default page sections successfully seeded", "✅".green());
        }

        // 7. Seed 11 Normalized Tables
        let now = rustbasic_core::chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();

        // 7.1 Articles
        if DB::table(db, "articles").count().await.unwrap_or(0) == 0 {
            let _ = DB::table(db, "articles").insert(serde_json::json!({
                "title": "Sukses Gelar Randai Kolosal di Festival Lansek Manih",
                "slug": "sukses-gelar-randai-kolosal-di-festival-lansek-manih",
                "content": "Sanggar Antabung Indah tampil memukau ratusan penonton di Muaro Sijunjung dengan pementasan teater kolosal Randai Minangkabau...",
                "media_url": null,
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "articles").insert(serde_json::json!({
                "title": "Digitalisasi Sastra Lisan Kaba Minang",
                "slug": "digitalisasi-sastra-lisan-kaba-minang",
                "content": "Kolaborasi bersama akademisi mendokumentasikan kaba kuno Sisawah secara digital...",
                "media_url": null,
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            println!("   {} Normalized 'articles' seeded", "✅".green());
        }

        // 7.2 Schedules
        if DB::table(db, "schedules").count().await.unwrap_or(0) == 0 {
            let _ = DB::table(db, "schedules").insert(serde_json::json!({
                "date": "12 Sep 2026",
                "title": "Pementasan Randai Kolosal di Pelataran Ngalau Antabuang",
                "place": "Desa Wisata Sisawah",
                "time": "19:30 WIB",
                "activity": "Pementasan Teater",
                "category": "pertunjukan",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "schedules").insert(serde_json::json!({
                "date": "28 Okt 2026",
                "title": "Prosesi Budaya Bakaua Adat Nagari Sisawah",
                "place": "Gelanggang Balai Adat",
                "time": "09:00 WIB",
                "activity": "Prosesi Adat",
                "category": "pertunjukan",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "schedules").insert(serde_json::json!({
                "date": "Selasa & Jumat",
                "title": "Latihan Silek & Randai Terbuka",
                "place": "Gelanggang Utama Jorong Tarok",
                "time": "20:00 - 23:00 WIB",
                "activity": "Latihan Rutin",
                "category": "latihan",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "schedules").insert(serde_json::json!({
                "date": "Sabtu",
                "title": "Kelas Talempong Ungah & Canang Anak-Anak",
                "place": "Pendopo Sanggar",
                "time": "14:00 - 17:00 WIB",
                "activity": "Latihan Musik",
                "category": "latihan",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            println!("   {} Normalized 'schedules' seeded", "✅".green());
        }

        // 7.3 Programs
        if DB::table(db, "programs").count().await.unwrap_or(0) == 0 {
            let _ = DB::table(db, "programs").insert(serde_json::json!({
                "title": "Kelas Silek Tradisi",
                "description": "Pelatihan bela diri silat Minang aliran Sisawah untuk melatih fisik.",
                "icon": "fa-shoe-prints",
                "category": "reguler",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "programs").insert(serde_json::json!({
                "title": "Teater tutur Randai",
                "description": "Kelas akting teater rakyat, vokal dendang, dan tepukan celana galembong.",
                "icon": "fa-users",
                "category": "reguler",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "programs").insert(serde_json::json!({
                "title": "Pentas Budaya Gua",
                "description": "Menyaksikan randai di mulut Gua Ngalau Antabuang yang eksotis.",
                "icon": "fa-mountain-sun",
                "category": "ekowisata",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "programs").insert(serde_json::json!({
                "title": "Jelajah Wisata Adat",
                "description": "Tur keliling nagari mengenal sejarah adat dan prosesi pertanian tradisional.",
                "icon": "fa-leaf",
                "category": "ekowisata",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            println!("   {} Normalized 'programs' seeded", "✅".green());
        }

        // 7.4 Metrics
        if DB::table(db, "metrics").count().await.unwrap_or(0) == 0 {
            let _ = DB::table(db, "metrics").insert(serde_json::json!({
                "value": "120+",
                "label": "Anak Sasian",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "metrics").insert(serde_json::json!({
                "value": "15+",
                "label": "Mitra Wisata",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "metrics").insert(serde_json::json!({
                "value": "80+",
                "label": "Pementasan",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "metrics").insert(serde_json::json!({
                "value": "14 Th",
                "label": "Mengabdi",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            println!("   {} Normalized 'metrics' seeded", "✅".green());
        }

        // 7.5 Structures
        if DB::table(db, "structures").count().await.unwrap_or(0) == 0 {
            let items = vec![
                ("Datuak Bagindo Rajo", "Penasihat Adat / Ninik Mamak", "fa-user-tie"),
                ("Andi Saputra M.Sn", "Ketua Pengurus & Kurator Seni", "fa-users-cog"),
                ("Rina Permata Sari", "Sekretaris & Hubungan Wisata", "fa-file-signature"),
                ("Doni Aliansyah", "Bendahara & Manajemen Alat", "fa-file-invoice-dollar"),
                ("Sutan Mangkuto", "Guru Gadang Silek (Silat)", "fa-shoe-prints"),
                ("Novianti M.Pd", "Pelatih Randai & Sastra Tutur", "fa-feather-alt"),
                ("Ilham Rahmadani", "Pemain Talempong Ungah", "fa-music"),
                ("Agung Gunawan", "Koordinator Gelanggang Latihan", "fa-tools"),
                ("Bundo Kanduang Sisawah", "Pelestari Busana Adat", "fa-female"),
            ];
            for (name, role, icon) in items {
                let _ = DB::table(db, "structures").insert(serde_json::json!({
                    "name": name,
                    "role": role,
                    "icon": icon,
                    "created_at": now.clone(),
                    "updated_at": now.clone(),
                })).await;
            }
            println!("   {} Normalized 'structures' seeded", "✅".green());
        }

        // 7.6 Philosophical Values
        if DB::table(db, "philosophical_values").count().await.unwrap_or(0) == 0 {
            let items = vec![
                ("Galuang (Lingkaran)", "Gerak melingkar melambangkan kebulatan tekad mufakat di Minangkabau. Gelanggang randai yang bulat melambangkan kesetaraan derajat seluruh anak nagari.", "fa-dot-circle", "Gerak Gelanggang"),
                ("Silek Sisawah (Bela Diri)", "Pondasi fisik utama randai. Gerakan silat tradisional khas Sumpur Kudus yang defensif, mengajarkan kerendahan hati.", "fa-fist-raised", "Silek Tradisional"),
                ("Bakaba Kuno (Sastra Lisan)", "Penyampaian cerita moral (kaba) oleh Tukang Kaba. Menjaga tuturan sejarah pahlawan dan silsilah suku di Sijunjung agar tidak punah.", "fa-book-open", "Teater Tutur"),
                ("Talempong Ungah (Irama)", "Tabuhan instrumen khas daerah Sijunjung yang rancak. Denting logamnya melambangkan semangat kerja sama bergotong-royong.", "fa-music", "Ritme Nagari"),
            ];
            for (title, description, icon, tag) in items {
                let _ = DB::table(db, "philosophical_values").insert(serde_json::json!({
                    "title": title,
                    "description": description,
                    "icon": icon,
                    "tag": tag,
                    "created_at": now.clone(),
                    "updated_at": now.clone(),
                })).await;
            }
            println!("   {} Normalized 'philosophical_values' seeded", "✅".green());
        }

        // 7.7 Galleries
        if DB::table(db, "galleries").count().await.unwrap_or(0) == 0 {
            let _ = DB::table(db, "galleries").insert(serde_json::json!({
                "category": "Latihan",
                "title": "Latihan Silek Gelanggang",
                "description": "Latihan rutin silek Minangkabau anak sasian di malam hari.",
                "media_url": "/uploads/galeri/latihan1.jpg",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "galleries").insert(serde_json::json!({
                "category": "Pertunjukan",
                "title": "Festival Seni Lansek Manih",
                "description": "Dokumentasi penampilan panggung kolosal Randai.",
                "media_url": "/uploads/galeri/pentas1.jpg",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            println!("   {} Normalized 'galleries' seeded", "✅".green());
        }

        // 7.8 Join Steps
        if DB::table(db, "join_steps").count().await.unwrap_or(0) == 0 {
            // Pendaftaran
            let _ = DB::table(db, "join_steps").insert(serde_json::json!({
                "step": "1",
                "title": "Isi Formulir",
                "description": "Kunjungi gelanggang utama Jorong Tarok setiap hari latihan untuk mengambil formulir.",
                "category": "pendaftaran",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "join_steps").insert(serde_json::json!({
                "step": "2",
                "title": "Seleksi Fisik & Wawancara",
                "description": "Wawancara pengenalan minat bakat bersama guru gadang sanggar.",
                "category": "pendaftaran",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "join_steps").insert(serde_json::json!({
                "step": "3",
                "title": "Pengukuhan Sasian",
                "description": "Prosesi adat pengukuhan murid baru gelanggang (sasasian).",
                "category": "pendaftaran",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            // Syarat
            let _ = DB::table(db, "join_steps").insert(serde_json::json!({
                "step": null,
                "title": null,
                "description": "Terbuka untuk anak nagari Sisawah maupun umum usia 7 - 25 tahun",
                "category": "syarat",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "join_steps").insert(serde_json::json!({
                "step": null,
                "title": null,
                "description": "Memiliki komitmen tinggi untuk mengikuti latihan rutin secara disiplin",
                "category": "syarat",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "join_steps").insert(serde_json::json!({
                "step": null,
                "title": null,
                "description": "Mendapatkan izin tertulis dari orang tua bagi yang berusia di bawah 17 tahun",
                "category": "syarat",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            println!("   {} Normalized 'join_steps' seeded", "✅".green());
        }

        // 7.9 Booking Packages
        if DB::table(db, "booking_packages").count().await.unwrap_or(0) == 0 {
            let _ = DB::table(db, "booking_packages").insert(serde_json::json!({
                "name": "Paket Randai Kolosal",
                "description": "Pertunjukan randai lengkap 1-2 jam dengan 25+ pemusik dan pesilat gelanggang.",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "booking_packages").insert(serde_json::json!({
                "name": "Paket Musik Talempong",
                "description": "Tabuhan instrumen Talempong Ungah penyambutan tamu resmi.",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            println!("   {} Normalized 'booking_packages' seeded", "✅".green());
        }

        // 7.10 Sop Rules
        if DB::table(db, "sop_rules").count().await.unwrap_or(0) == 0 {
            let _ = DB::table(db, "sop_rules").insert(serde_json::json!({
                "icon": "fa-user-clock",
                "text": "Hadir di gelanggang 15 menit sebelum latihan dimulai",
                "category": "aturan",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "sop_rules").insert(serde_json::json!({
                "icon": "fa-pray",
                "text": "Menjaga adab saling menghormati guru gadang dan teman sejawat",
                "category": "aturan",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "sop_rules").insert(serde_json::json!({
                "icon": "fa-tshirt",
                "text": "Wajib mengenakan pakaian latihan hitam longgar (celana galembong) resmi",
                "category": "aturan",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            println!("   {} Normalized 'sop_rules' seeded", "✅".green());
        }

        // 7.11 Contact Infos
        if DB::table(db, "contact_infos").count().await.unwrap_or(0) == 0 {
            let _ = DB::table(db, "contact_infos").insert(serde_json::json!({
                "icon": "fa-envelope",
                "label": "Email Kami",
                "value": "info@antabung.art",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "contact_infos").insert(serde_json::json!({
                "icon": "fa-phone",
                "label": "Telepon / WA",
                "value": "+62 823-8899-7711",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            let _ = DB::table(db, "contact_infos").insert(serde_json::json!({
                "icon": "fa-map-marker-alt",
                "label": "Alamat Fisik",
                "value": "Jorong Tarok, Nagari Sisawah, Sijunjung, Sumatera Barat",
                "created_at": now.clone(),
                "updated_at": now.clone(),
            })).await;
            println!("   {} Normalized 'contact_infos' seeded", "✅".green());
        }

        Ok(())
    }
}
