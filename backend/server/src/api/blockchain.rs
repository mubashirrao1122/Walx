use actix_web::{web, HttpResponse, Responder};
use crate::db::AppState;

#[derive(serde::Deserialize)]
pub struct MineRequest {
    pub miner_wallet_id: String,
}

pub async fn get_blocks(data: web::Data<AppState>) -> impl Responder {
    let blockchain = match data.blockchain.lock() {
        Ok(b) => b,
        Err(_) => return HttpResponse::InternalServerError().json("Blockchain lock poisoned"),
    };
    HttpResponse::Ok().json(&blockchain.chain)
}

pub async fn mine_block(data: web::Data<AppState>, req: web::Json<MineRequest>) -> impl Responder {
    let mut blockchain = match data.blockchain.lock() {
        Ok(b) => b,
        Err(_) => return HttpResponse::InternalServerError().json("Blockchain lock poisoned"),
    };
    blockchain.mine_pending_transactions(&req.miner_wallet_id);
    HttpResponse::Ok().json("Block Mined Successfully")
}
