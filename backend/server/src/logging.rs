// src/logging.rs
use crate::db::AppState;
use crate::models::LogEntry;
use mongodb::bson::doc;
use actix_web::web;
use chrono::Utc;

/// Inserts a log entry into the `logs` collection.
/// `action` – description of what happened (e.g., "UserRegistered", "TransactionSent")
/// `details` – additional context (JSON string or plain text)
/// `status` – "success" or "error"
pub async fn log_action(state: &web::Data<AppState>, action: &str, details: &str, status: &str, ip: Option<String>, block_hash: Option<String>) {
    let collection = state.db.collection::<LogEntry>("logs");
    let log = LogEntry {
        id: None,
        action: action.to_string(),
        timestamp: Utc::now().timestamp(),
        details: details.to_string(),
        status: status.to_string(),
        ip_address: ip,
        block_hash: block_hash,
    };
    // Ignore errors for now; in production you might handle them.
    let _ = collection.insert_one(log, None).await;
}
