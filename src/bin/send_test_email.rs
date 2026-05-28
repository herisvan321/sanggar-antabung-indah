use rustbasic_core::dotenvy::dotenv;
use rustbasic_core::MailService;

#[tokio::main]
async fn main() {
    // Muat file .env jika ada
    dotenv().ok();
    
    println!("📧 Mengirim email uji coba...");
    
    let to = "test@example.com";
    let subject = "Test Email dari RustBasic";
    let body = "<h1>Halo!</h1><p>Ini adalah email uji coba yang dikirim menggunakan modul <code>rustbasic-email</code>.</p>";
    
    match MailService::send_email(to, subject, body).await {
        Ok(_) => println!("✅ Email uji coba berhasil dikirim ke {}!", to),
        Err(e) => eprintln!("❌ Gagal mengirim email uji coba: {}", e),
    }
}
