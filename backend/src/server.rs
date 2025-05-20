use backend::database::init::init_pool;

#[tokio::main]
async fn main() {
    let result = init_pool(5).await;

    match result {
        Err(e) => eprintln!("{}", e),
        Ok(_) => println!("connection pool created"),
    }
}
