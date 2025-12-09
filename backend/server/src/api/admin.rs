use actix_web::{web, HttpResponse, Responder, HttpRequest};
use crate::db::AppState;
use crate::models::{User, UserRole};
use mongodb::bson::doc;
use futures::stream::TryStreamExt;
use blockchain::{Transaction, TxOutput};

// Helper to check if wallet_id belongs to an Admin
async fn is_admin(data: &web::Data<AppState>, wallet_id: &str) -> bool {
    let collection = data.db.collection::<User>("users");
    if let Ok(Some(user)) = collection.find_one(doc! { "wallet_id": wallet_id }, None).await {
        return user.role == UserRole::Admin;
    }
    false
}

// Get System Stats (Admin only)
pub async fn get_system_stats(data: web::Data<AppState>, req: HttpRequest) -> impl Responder {
    // Check for wallet_id in query or header
    let wallet_id = req.headers()
        .get("X-Wallet-Id")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    if !is_admin(&data, wallet_id).await {
        return HttpResponse::Forbidden().json("Admin access required");
    }

    let user_collection = data.db.collection::<User>("users");
    let blockchain = match data.blockchain.lock() {
        Ok(b) => b,
        Err(_) => return HttpResponse::InternalServerError().json("Blockchain lock poisoned"),
    };
    
    let total_users = match user_collection.count_documents(doc! {}, None).await {
        Ok(count) => count,
        Err(_) => 0,
    };

    let total_blocks = blockchain.chain.len();
    let total_transactions = blockchain.chain.iter().map(|b| b.transactions.len()).sum::<usize>();
    
    // Calculate total coins mined (simplified)
    let total_coins = total_blocks as u64 * 50; // Assuming 50 coins per block reward

    HttpResponse::Ok().json(serde_json::json!({
        "total_users": total_users,
        "total_blocks": total_blocks,
        "total_transactions": total_transactions,
        "total_coins_mined": total_coins,
        "difficulty": blockchain.difficulty
    }))
}

// Get All Users (Admin only)
pub async fn get_all_users(data: web::Data<AppState>, req: HttpRequest) -> impl Responder {
    // Check for wallet_id in header
    let wallet_id = req.headers()
        .get("X-Wallet-Id")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    if !is_admin(&data, wallet_id).await {
        return HttpResponse::Forbidden().json("Admin access required");
    }

    let collection = data.db.collection::<User>("users");
    
    let mut cursor = match collection.find(doc! {}, None).await {
        Ok(cursor) => cursor,
        Err(_) => return HttpResponse::InternalServerError().json("Database error"),
    };

    let mut users = Vec::new();
    while let Ok(Some(user)) = cursor.try_next().await {
        users.push(serde_json::json!({
            "full_name": user.full_name,
            "email": user.email,
            "wallet_id": user.wallet_id,
            "created_at": user.created_at,
            "role": format!("{:?}", user.role)
        }));
    }

    HttpResponse::Ok().json(users)
}

#[derive(serde::Deserialize)]
pub struct PromoteRequest {
    pub target_wallet_id: String,
}

// Promote User to Admin (Admin only)
pub async fn promote_to_admin(data: web::Data<AppState>, req: HttpRequest, body: web::Json<PromoteRequest>) -> impl Responder {
    // Check for wallet_id in header
    let wallet_id = req.headers()
        .get("X-Wallet-Id")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    if !is_admin(&data, wallet_id).await {
        return HttpResponse::Forbidden().json("Admin access required");
    }

    let collection = data.db.collection::<User>("users");
    let result = collection.update_one(
        doc! { "wallet_id": &body.target_wallet_id },
        doc! { "$set": { "role": "Admin" } },
        None
    ).await;

    match result {
        Ok(update_result) => {
            if update_result.modified_count > 0 {
                HttpResponse::Ok().json("User promoted to Admin")
            } else {
                HttpResponse::NotFound().json("User not found")
            }
        },
        Err(_) => HttpResponse::InternalServerError().json("Database error"),
    }
}

#[derive(serde::Deserialize)]
pub struct MintRequest {
    pub target_wallet_id: String,
    pub amount: u64,
}

// Mint coins to a wallet (Admin only) - Creates coins from system
pub async fn mint_coins(data: web::Data<AppState>, req: HttpRequest, body: web::Json<MintRequest>) -> impl Responder {
    // Check for wallet_id in header
    let wallet_id = req.headers()
        .get("X-Wallet-Id")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    if !is_admin(&data, wallet_id).await {
        return HttpResponse::Forbidden().json("Admin access required");
    }

    // Verify target wallet exists
    let collection = data.db.collection::<User>("users");
    let target_user = collection.find_one(doc! { "wallet_id": &body.target_wallet_id }, None).await;
    
    if let Ok(None) = target_user {
        return HttpResponse::NotFound().json("Target wallet not found");
    }
    if let Err(_) = target_user {
        return HttpResponse::InternalServerError().json("Database error");
    }

    let mut blockchain = match data.blockchain.lock() {
        Ok(b) => b,
        Err(_) => return HttpResponse::InternalServerError().json("Blockchain lock poisoned"),
    };

    // Create a system mint transaction
    let tx_id = format!("mint_{}_{}", body.target_wallet_id, chrono::Utc::now().timestamp_millis());
    let mint_tx = Transaction {
        id: tx_id,
        sender_wallet_id: "SYSTEM_MINT".to_string(),
        receiver_wallet_id: body.target_wallet_id.clone(),
        amount: body.amount,
        note: Some(format!("Admin minted {} coins", body.amount)),
        timestamp: chrono::Utc::now().timestamp(),
        sender_public_key: String::new(),
        signature: String::new(),
        inputs: Vec::new(),
        outputs: vec![TxOutput {
            amount: body.amount,
            receiver_wallet_id: body.target_wallet_id.clone(),
        }],
    };

    // Add directly to pending and mine immediately
    blockchain.pending_transactions.push(mint_tx);
    blockchain.mine_pending_transactions(&body.target_wallet_id);

    let new_balance = blockchain.get_balance(&body.target_wallet_id);

    HttpResponse::Ok().json(serde_json::json!({
        "status": "success",
        "message": format!("Minted {} coins to wallet", body.amount),
        "target_wallet_id": body.target_wallet_id,
        "new_balance": new_balance
    }))
}
