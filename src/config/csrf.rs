/* ---------------------------------------------------------
 * 📑 LABEL: CSRF PROTECTION (config/csrf.rs)
 * Melindungi aplikasi dari Cross-Site Request Forgery.
 * --------------------------------------------------------- */

use rustbasic_core::{Request, Response, Next, IntoResponse};
use rustbasic_core::rand::distr::SampleString;
use rustbasic_core::http::{StatusCode, Method};

pub async fn csrf_middleware(
    req: Request,
    next: Next,
) -> Response {
    // 1. Pastikan ada token CSRF di session
    let token = match req.session.get::<String>("_token") {
        Some(t) => t,
        None => {
            let new_token = rustbasic_core::rand::distr::Alphanumeric.sample_string(&mut rustbasic_core::rand::rng(), 40);
            req.session.set("_token", new_token.clone());
            new_token
        }
    };

    // 2. Validasi untuk request yang mengubah data (POST, PUT, DELETE, dll)
    let method = &req.method;
    if method == Method::POST || method == Method::PUT || method == Method::PATCH || method == Method::DELETE {
        // Ambil token dari header
        let header_token = req.headers.get("x-csrf-token").map(|s| s.as_str());
        
        if let Some(h_token) = header_token {
            if h_token != token {
                return StatusCode::from_u16(419).unwrap().into_response();
            }
        } else {
            return StatusCode::from_u16(419).unwrap().into_response();
        }
    }

    next.run(req).await
}
