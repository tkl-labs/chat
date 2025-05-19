use tokio_tungstenite::connect_async;
use url::Url;
use futures_util::{SinkExt, StreamExt};

pub struct ChatRoom {
    id: u64,
    members: Vec<u64>,
    active: Vec<u64>,
}





