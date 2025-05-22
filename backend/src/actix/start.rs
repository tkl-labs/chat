use actix_web::{web, App, HttpServer};
use super::routes::apply_routes;
use crate::database::init::{init_pool, PGPool};




const HTTP_SERVER_URL: &str = "127.0.0.1";
const HTTP_SERVER_PORT: u16 = 8080;

pub async fn start_server(pool: PGPool) -> std::io::Result<()> {
    println!("Starting Actix web server on {}:{}", HTTP_SERVER_URL, HTTP_SERVER_PORT);

    HttpServer::new( move || 
        App::new().configure(apply_routes)
            .app_data(web::Data::new(pool.clone()))

        )
        .bind((HTTP_SERVER_URL, HTTP_SERVER_PORT))?
        .run()
        .await



}
