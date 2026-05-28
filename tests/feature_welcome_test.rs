/* ---------------------------------------------------------
 * 🧪 FEATURE TEST: Welcome (tests/feature_welcome_test.rs)
 * --------------------------------------------------------- */

use rustbasic_core::testing::TestClient;
use rustbasic_core::Config;

#[tokio::test]
async fn test_welcome_page() {
    // 1. Muat konfigurasi
    let _ = rustbasic_core::dotenvy::dotenv();
    let cfg = Config::load();
    
    // Register embedded files
    rustbasic_core::view::set_embedded_templates(rustbasic::config::app::EmbeddedTemplates::get);
    rustbasic_core::server::set_embedded_public(rustbasic::config::app::EmbeddedPublic::get);
    
    // 2. Bangun router aplikasi
    let router = rustbasic::routes::build_router();
    
    // 3. Setup TestClient in-memory
    let client = TestClient::new(cfg, router).await;
    
    // 4. Kirim request ke endpoint (misalnya '/')
    let response = client.get("/").await;
    
    // 5. Asersi response status & konten
    response.assert_status(200);
}
