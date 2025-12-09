use actix_web::{web, HttpResponse, Responder};
use crate::logging;
use crate::db::AppState;
use crate::models::User;
use blockchain::{Transaction, TxInput, TxOutput};
use mongodb::bson::doc;

pub async fn get_balance(data: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let wallet_id = path.into_inner();
    let blockchain = match data.blockchain.lock() {
        Ok(b) => b,
        Err(_) => return HttpResponse::InternalServerError().json("Blockchain lock poisoned"),
    };
    let balance = blockchain.get_balance(&wallet_id);
    
    // Log balance query
    logging::log_action(&data, "GetBalance", &format!("Wallet {} balance queried", wallet_id), "success", None, None).await;
    HttpResponse::Ok().json(serde_json::json!({
        "wallet_id": wallet_id,
        "balance": balance
    }))
}

#[derive(serde::Deserialize)]
pub struct SendRequest {
    pub sender_wallet_id: String,
    pub receiver_wallet_id: String,
    pub amount: u64,
    pub note: Option<String>,
}

pub async fn send_transaction(data: web::Data<AppState>, req: web::Json<SendRequest>) -> impl Responder {
    let mut blockchain = match data.blockchain.lock() {
        Ok(b) => b,
        Err(_) => return HttpResponse::InternalServerError().json("Blockchain lock poisoned"),
    };
    
    // 1. Fetch sender user to get keys (In real app, we need auth token here)
    let collection = data.db.collection::<User>("users");
    let sender = collection.find_one(doc! { "wallet_id": &req.sender_wallet_id }, None).await;
    
    let sender_user = match sender {
        Ok(Some(u)) => u,
        _ => return HttpResponse::BadRequest().json("Sender not found"),
    };

    // 2. Check balance (Simple check, real check happens in add_transaction)
    if blockchain.get_balance(&req.sender_wallet_id) < req.amount {
        return HttpResponse::BadRequest().json("Insufficient balance");
    }

    // 3. Create Transaction
    // Reconstruct wallet from encrypted key (Mock decryption)
    let wallet = match blockchain::Wallet::from_private_key(&sender_user.encrypted_private_key) {
        Ok(w) => w,
        Err(_) => return HttpResponse::InternalServerError().json("Failed to load wallet"),
    };

    let transaction = match blockchain.create_transaction(
        &wallet, 
        req.receiver_wallet_id.clone(), 
        req.amount, 
        req.note.clone()
    ) {
        Ok(tx) => tx,
        Err(e) => return HttpResponse::BadRequest().json(e),
    };

    // 4. Add to pending
    if blockchain.add_transaction(transaction.clone()) {
        // Log successful transaction submission
        logging::log_action(&data, "TransactionSent", &format!("Tx {} sent", transaction.id), "success", None, None).await;
        HttpResponse::Ok().json(serde_json::json!({
            "status": "success",
            "transaction_id": transaction.id
        }))
    } else {
        logging::log_action(&data, "TransactionSent", &format!("Tx {} failed to add", transaction.id), "error", None, None).await;
        HttpResponse::BadRequest().json("Failed to add transaction")
    }
}

// Get transaction history for a wallet
pub async fn get_history(data: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let wallet_id = path.into_inner();
    let blockchain = match data.blockchain.lock() {
        Ok(b) => b,
        Err(_) => return HttpResponse::InternalServerError().json("Blockchain lock poisoned"),
    };
    let mut txs = Vec::new();
    for block in &blockchain.chain {
        for tx in &block.transactions {
            if tx.sender_wallet_id == wallet_id || tx.receiver_wallet_id == wallet_id {
                txs.push(tx.clone());
            }
        }
    }
    HttpResponse::Ok().json(txs)
}
