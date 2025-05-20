use futures_util::{SinkExt, StreamExt};
use tokio_tungstenite::connect_async;
use url::Url;

pub struct ChatRoom {
    id: u64,
    members: Vec<u64>,
    active: Vec<u64>,
}
