use actix_web::{HttpResponse, Responder, get, post, web};
use serde::Deserialize;

#[derive(Deserialize)]
struct RegisterForm {
    username: String,
    email: String,
    phone_number: String,
    password: String,
}

// IMPORTANT: do not handle registration through a GET request, only use POST for submitting data

#[get("/register")]
pub async fn get_register() -> impl Responder {
    HttpResponse::Ok().body("hit get-register, serve register page here")
}

#[post("/register")]
pub async fn post_register(req_body: web::Json<RegisterForm>) -> impl Responder {
    // TODO: send http 400 if the request is bad
    // TODO: send http 409 if the user already exists
    // TODO: send http 500 for internal server error

    let username = &req_body.username;
    let email = &req_body.email;
    let phone_number = &req_body.phone_number;
    let password = &req_body.password;
    
    HttpResponse::Ok().body(format!("Submitted: {} {} {} {}", &username, &email, &phone_number, &password))
}
