use diesel_async::pooled_connection::deadpool::{Pool, BuildError };
use diesel_async::pooled_connection::AsyncDieselConnectionManager;
use diesel_async::AsyncPgConnection;



pub async fn initi_pool() -> Result<Pool<AsyncPgConnection>, BuildError> {

    let pool_config = AsyncDieselConnectionManager::<AsyncPgConnection>::new( "test");
    let pool_result = Pool::builder(pool_config).build(); 


    let pool= match pool_result {
        Err(e) => return Err(e),
        Ok(value) => value
    };

    return Ok(pool);
}
