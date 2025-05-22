use actix_web::{App, HttpServer};
use super::routes::apply_routes;


pub async fn start_server() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .configure(apply_routes)
    })
    .bind(("127.0.0.1", 8080))?
        .run()
        .await

}
