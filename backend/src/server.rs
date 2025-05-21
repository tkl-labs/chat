use backend::database::init::init_pool;

use actix_web;
use actix_ws;



#[tokio::main]
async fn main() {
    let result = init_pool(5).await;

    match result {
        Err(e) => eprintln!("{}", e),
        Ok(_) => println!("connection pool created"),
    }
}
