use mongodb::{Client, Database, options::ClientOptions};
use std::env;
use std::error::Error;
use std::sync::Mutex;
use blockchain::Blockchain;

#[derive(Clone)]
pub struct AppState {
    pub db: Database,
    pub blockchain: std::sync::Arc<Mutex<Blockchain>>,
}

pub async fn init_db() -> Result<Database, Box<dyn Error>> {
    let client_uri = env::var("MONGODB_URI").expect("MONGODB_URI must be set");
    let client_options = ClientOptions::parse(&client_uri).await?;
    let client = Client::with_options(client_options)?;
    let db = client.database("crypto_wallet");
    Ok(db)
}
