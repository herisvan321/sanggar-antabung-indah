use rustbasic_core::{Config, MigratorTrait};

pub async fn handle(args: &[String], cfg: &Config) -> bool {
    if args.len() < 2 {
        return false;
    }

    let command = args[1].as_str();

    let is_migration_cmd = command.starts_with("migrate") || command == "db:seed";
    let is_storage_cmd = command == "storage:link";

    if !is_migration_cmd && !is_storage_cmd {
        return false;
    }

    println!("🛠️  RustBasic Local CLI - Command: {}", command);

    if is_storage_cmd {
        handle_storage_link();
        return true;
    }

    // Hubungkan ke database
    let pool = rustbasic_core::database::connect(cfg).await;

    match command {
        "migrate" => {
            println!("🚀 Menjalankan migrasi database...");
            if let Err(e) = crate::migrations::Migrator::up(&pool, None).await {
                println!("❌ Gagal menjalankan migrasi: {}", e);
            } else {
                println!("✅ Migrasi selesai!");
            }
        }
        "migrate:refresh" => {
            println!("🔄 Mereset dan menjalankan ulang migrasi...");
            if let Err(e) = crate::migrations::Migrator::fresh(&pool).await {
                println!("❌ Gagal refresh migrasi: {}", e);
            } else {
                println!("✅ Database berhasil di-refresh!");
            }
        }
        "migrate:back" | "migrate:rollback" => {
            println!("⬅️  Rollback migrasi terakhir...");
            if let Err(e) = crate::migrations::Migrator::down(&pool, None).await {
                println!("❌ Gagal rollback: {}", e);
            } else {
                println!("✅ Rollback berhasil!");
            }
        }
        "db:seed" => {
            crate::app::seeder::run(&pool).await;
        }
        _ => return false,
    }

    true
}

fn handle_storage_link() {
    let target = crate::config::app::STORAGE_TARGET;
    let source = crate::config::app::STORAGE_SOURCE;

    if let Err(e) = std::fs::create_dir_all(source) {
        println!("❌ Gagal membuat direktori storage: {}", e);
        return;
    }

    let path = std::path::Path::new(target);
    if path.exists() || path.is_symlink() {
        println!("ℹ️  Link 'public/storage' sudah ada atau berupa file/folder lain.");
        return;
    }

    println!("🔗 Membuat symbolic link...");

    #[cfg(unix)]
    {
        use std::os::unix::fs::symlink;
        if let Err(e) = symlink("../storage/app/public", target) {
            println!("❌ Gagal membuat symlink: {}", e);
        } else {
            println!("✅ Link storage berhasil dibuat! [public/storage -> storage/app/public]");
        }
    }

    #[cfg(windows)]
    {
        use std::os::windows::fs::symlink_dir;
        if let Err(e) = symlink_dir("../storage/app/public", target) {
            println!("❌ Gagal membuat symlink: {}", e);
        } else {
            println!("✅ Link storage berhasil dibuat! [public/storage -> storage/app/public]");
        }
    }
}
