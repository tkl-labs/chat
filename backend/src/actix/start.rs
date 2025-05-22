use actix_web::{App, HttpServer};
use super::routes::apply_routes;

const HTTP_SERVER_URL: &str = "127.0.0.1";
const HTTP_SERVER_PORT: u16 = 8080;

pub async fn start_server() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .configure(apply_routes)
    })
    .bind((HTTP_SERVER_URL, HTTP_SERVER_PORT))?
        .run()
        .await

}
