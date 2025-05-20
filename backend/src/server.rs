use backend::database::init::initi_pool;

#[tokio::main]
async fn main() {
    let result = initi_pool().await;


    match result {
        Err(e) => eprintln!("{}", e),
        Ok(_) => println!("connected"),
    }
    

}
