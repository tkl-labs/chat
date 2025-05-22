use actix_web::{HttpResponse, Responder, get, post};

// IMPORTANT: do not handle login through a GET request, only use POST for submitting data!

#[get("/login")]
pub async fn get_login() -> impl Responder {
    HttpResponse::Ok().body("hit get-login, serve login page here")
}

#[post("/login")]
pub async fn post_login() -> impl Responder {
    HttpResponse::Ok().body("hit post-login, handle logging in here")
}
