use actix_web::{HttpResponse, Responder, get, post, web};

// IMPORTANT: do not handle login through a GET request, only use POST for submitting data!

use crate::database::init::PGPool;

#[get("/login")]
pub async fn get_login(pool: web::Data<PGPool>) -> impl Responder {
    let conn = pool.get().await.expect("failed to acquire db connection");
    println!("connection made");


    HttpResponse::Ok().body("hit get-login")
}

#[post("/login")]
pub async fn post_login() -> impl Responder {
    HttpResponse::Ok().body("hit post-login, handle logging in here")
}
