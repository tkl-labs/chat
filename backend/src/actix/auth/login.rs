use actix_web::{get, post, HttpResponse, Responder};

#[get("/login")]
pub async fn get_login() -> impl Responder {
    HttpResponse::Ok().body("hit get-login")
}


#[post("/login")]
pub async fn post_login() -> impl Responder {
    HttpResponse::Ok().body("hit post-login")
}

