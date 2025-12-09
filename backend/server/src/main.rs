use actix_web::{web, App, HttpServer, middleware::Logger};
use actix_cors::Cors;
use dotenv::dotenv;
use std::env;

use server::{db, models, api, zakat, logging, email};
use db::AppState;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Check required environment variables at startup
    let required_env = ["MONGODB_URI", "SMTP_USERNAME", "SMTP_PASSWORD"];
    let mut missing = Vec::new();
    for &key in &required_env {
        if std::env::var(key).is_err() {
            missing.push(key);
        }
    }
    if !missing.is_empty() {
    eprintln!("Missing required environment variables: {:?}", missing);
        std::process::exit(1);
    }

    let db = db::init_db().await.expect("Failed to connect to MongoDB");
    let blockchain = blockchain::Blockchain::new();
    let app_state = AppState { 
        db, 
        blockchain: std::sync::Arc::new(std::sync::Mutex::new(blockchain)) 
    };

    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let address = format!("0.0.0.0:{}", port);

    log::info!("Starting server at http://{}", address);

    let app_state_data = web::Data::new(app_state.clone());

    // Spawn Zakat Scheduler
    let zakat_data = app_state_data.clone();
    tokio::spawn(async move {
        zakat::start_zakat_scheduler(zakat_data).await;
    });

    HttpServer::new(move || {
        let cors = Cors::permissive(); // For development, allow all

        App::new()
            .wrap(Logger::default())
            .wrap(cors)
            .app_data(app_state_data.clone())
            .service(
                web::scope("/api")
                    .configure(api::config)
            )
    })
    .bind(address)?
    .run()
    .await
}
