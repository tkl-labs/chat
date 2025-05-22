mod login;
use login::{get_login, post_login};

use actix_web::web;

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg
        .service(get_login)
        .service(post_login);
}

