use rustbasic_core::sqlx::{AnyPool, Row};

pub async fn get_user_permissions(db: &AnyPool, user_id: i32) -> Vec<String> {
    // Logic: users -> model_has_roles -> role_has_permissions -> permissions
    let sql = r#"
        SELECT DISTINCT p.name 
        FROM permissions p
        JOIN role_has_permissions rhp ON p.id = rhp.permission_id
        JOIN model_has_roles mhr ON rhp.role_id = mhr.role_id
        WHERE mhr.model_id = ? AND mhr.model_type = 'User'
    "#;
    
    let rows = rustbasic_core::sqlx::query(sql)
        .bind(user_id)
        .fetch_all(db)
        .await
        .unwrap_or_default();
        
    rows.into_iter().map(|row| row.get::<String, _>("name")).collect()
}

pub async fn get_user_roles(db: &AnyPool, user_id: i32) -> Vec<String> {
    let sql = r#"
        SELECT r.name 
        FROM roles r
        JOIN model_has_roles mhr ON r.id = mhr.role_id
        WHERE mhr.model_id = ? AND mhr.model_type = 'User'
    "#;
    
    let rows = rustbasic_core::sqlx::query(sql)
        .bind(user_id)
        .fetch_all(db)
        .await
        .unwrap_or_default();
        
    rows.into_iter().map(|row| row.get::<String, _>("name")).collect()
}
