use rustbasic_core::{Request, Response, Next, IntoResponse, Redirect};

pub async fn auth_middleware(req: Request, next: Next) -> Response {
    if req.session.get::<i32>("user_id").is_none() {
        req.session.set("error", "Silakan login terlebih dahulu");
        return Redirect::to("/login").into_response();
    }
    next.run(req).await
}

pub async fn guest_middleware(req: Request, next: Next) -> Response {
    if req.session.get::<i32>("user_id").is_some() {
        return Redirect::to("/dashboard").into_response();
    }
    next.run(req).await
}
