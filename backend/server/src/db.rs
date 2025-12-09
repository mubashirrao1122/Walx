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
    let client_uri = env::var("MONGODB_URI").unwrap_or_else(|_| {
        log::error!("MONGODB_URI environment variable is not set!");
        log::error!("Please set it in your deployment platform (Railway/Render)");
        log::error!("Example: mongodb+srv://username:password@cluster.mongodb.net/walx");
        panic!("MONGODB_URI environment variable is required. Cannot start server without database connection.");
    });
    
    log::info!("Connecting to MongoDB...");
    let client_options = ClientOptions::parse(&client_uri).await?;
    let client = Client::with_options(client_options)?;
    let db = client.database("crypto_wallet");
    log::info!("Connected to MongoDB successfully!");
    Ok(db)
}
