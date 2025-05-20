use diesel_async::AsyncPgConnection;
use diesel_async::pooled_connection::AsyncDieselConnectionManager;
use diesel_async::pooled_connection::deadpool::{BuildError, Pool};
use dotenv::dotenv;
use std::env;

pub async fn init_pool() -> Result<Pool<AsyncPgConnection>, BuildError> {
    dotenv().ok(); // load .env

    let database_url =
        env::var("DATABASE_URL").expect("ERROR: DATABASE_URL must be present in '.env'");

    let pool_config = AsyncDieselConnectionManager::<AsyncPgConnection>::new(&database_url);
    let pool_result = Pool::builder(pool_config).build();

    let pool = match pool_result {
        Err(e) => return Err(e),
        Ok(value) => value,
    };

    return Ok(pool);
}
