/* ---------------------------------------------------------
 * 🧪 UNIT TEST: String Helpers (tests/unit_string_test.rs)
 * --------------------------------------------------------- */

use rustbasic_core::support::Str;

#[test]
fn test_str_helpers() {
    // 1. after & before
    assert_eq!(Str::after("hello-world", "-"), "world");
    assert_eq!(Str::before("hello-world", "-"), "hello");

    // 2. between
    assert_eq!(Str::between("this [secret] msg", "[", "]"), "secret");

    // 3. contains, starts_with, ends_with
    assert!(Str::contains("RustBasic framework", "Basic"));
    assert!(Str::starts_with("RustBasic", "Rust"));
    assert!(Str::ends_with("RustBasic", "Basic"));

    // 4. lower & upper
    assert_eq!(Str::lower("RUST"), "rust");
    assert_eq!(Str::upper("rust"), "RUST");

    // 5. limit & replace
    assert_eq!(Str::limit("Belajar Rust", 7, "..."), "Belajar...");
    assert_eq!(Str::replace("pagi", "malam", "selamat pagi"), "selamat malam");

    // 6. uuid & is_uuid
    let uuid = Str::uuid();
    assert!(Str::is_uuid(&uuid));
}

#[test]
fn test_stringable_chaining() {
    let result = Str::of("Belajar Rust")
        .append(" Keren Sekali")
        .upper()
        .slug()
        .get();

    assert_eq!(result, "belajar-rust-keren-sekali");
}
