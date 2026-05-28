/* ---------------------------------------------------------
 * 📑 LABEL: APPLICATION CORE (app/mod.rs)
 * Entry point untuk modul aplikasi.
 * --------------------------------------------------------- */

pub mod http;
pub mod models;
pub mod seeder;
pub mod inertia;

// Re-export view helpers dari config untuk backward compatibility
pub use rustbasic_core::view::{render, view};
pub use inertia::inertia;


pub mod helpers;
pub mod services;
pub mod observers;
