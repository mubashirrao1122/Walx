use actix_web::{web, HttpResponse, Responder};
use crate::db::AppState;
use crate::models::User;
use mongodb::bson::doc;
use futures::stream::TryStreamExt;

// Get System Stats
pub async fn get_system_stats(data: web::Data<AppState>) -> impl Responder {
    let user_collection = data.db.collection::<User>("users");
    let blockchain = data.blockchain.lock().unwrap();
    
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

// Get All Users (Admin only - simplified)
pub async fn get_all_users(data: web::Data<AppState>) -> impl Responder {
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
            "created_at": user.created_at
        }));
    }

    HttpResponse::Ok().json(users)
}
