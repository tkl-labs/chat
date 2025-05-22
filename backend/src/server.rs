use backend::database::init::init_pool;
use backend::actix;

use actix_ws;
use actix_web;


use std::io::{Error, ErrorKind};


#[actix_web::main]
async fn main() -> std::io::Result<()> {

    let result = init_pool(5).await;
    match result {
        Err(e) => { 
            eprintln!("{}", e);
            return Err(Error::new(ErrorKind::Other, e));
        },
        Ok(_) => println!("connection pool created"),
    };

    actix::start_server().await
}


