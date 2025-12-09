use serde::{Serialize, Deserialize};
use mongodb::bson::oid::ObjectId;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum UserRole {
    Admin,
    User,
}

impl Default for UserRole {
    fn default() -> Self {
        UserRole::User
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub full_name: String,
    pub email: String,
    pub cnic: String,
    #[serde(default)]
    pub wallet_id: String,
    #[serde(default)]
    pub public_key: String,
    #[serde(default)]
    pub encrypted_private_key: String,
    #[serde(default)]
    pub beneficiaries: Vec<String>,
    #[serde(default)]
    pub created_at: i64,
    #[serde(default)]
    pub otp: Option<String>,
    #[serde(default)]
    pub otp_expiry: Option<i64>,
    #[serde(default)]
    pub role: UserRole,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Log {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub action: String,
    pub timestamp: i64,
    pub details: String,
    pub status: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct LogEntry {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub action: String,
    pub timestamp: i64,
    pub details: String,
    pub status: String,
    #[serde(default)]
    pub ip_address: Option<String>,
    #[serde(default)]
    pub block_hash: Option<String>,
}


// Re-export blockchain types for DB usage if needed, or wrap them
pub use blockchain::{Block, Transaction, TxOutput};
