pub mod web;
pub mod api;

use rustbasic_core::{Router, AppState};

pub fn build_router() -> Router<AppState> {
    web::router().merge(api::router())
}
pub mod auth;
