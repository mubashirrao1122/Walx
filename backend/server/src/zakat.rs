use crate::db::AppState;
use crate::models::User;
use actix_web::web;
use std::time::Duration;
use tokio::time;
use futures::StreamExt;
use mongodb::bson::doc;

pub async fn start_zakat_scheduler(data: web::Data<AppState>) {
    let mut interval = time::interval(Duration::from_secs(30 * 24 * 60 * 60)); // 30 days
    
    loop {
        interval.tick().await;
        log::info!("Running Monthly Zakat Deduction...");
        
        let collection = data.db.collection::<User>("users");
        let mut cursor = match collection.find(None, None).await {
            Ok(c) => c,
            Err(e) => {
                log::error!("Failed to fetch users for Zakat: {}", e);
                continue;
            }
        };

        let mut deductions = Vec::new();

        // 1. Calculate Deductions (Read-only phase)
        while let Some(user) = cursor.next().await {
            if let Ok(u) = user {
                let balance = {
                    let chain = data.blockchain.lock().unwrap();
                    chain.get_balance(&u.wallet_id)
                };

                let deduction = (balance as f64 * 0.025) as u64;
                if deduction > 0 {
                    deductions.push((u, deduction));
                }
            }
        }

        // 2. Apply Deductions (Write phase)
        let mut transactions_added = false;
        {
            let mut chain = data.blockchain.lock().unwrap();
            
            for (u, deduction) in deductions {
                if let Ok(wallet) = blockchain::Wallet::from_private_key(&u.encrypted_private_key) {
                    // Note: In a real app, we should re-check balance here to be safe
                    // But for now, we assume it hasn't changed drastically in milliseconds
                    if let Ok(tx) = chain.create_transaction(
                        &wallet, 
                        "ZAKAT_POOL".to_string(), 
                        deduction, 
                        Some("zakat_deduction".to_string())
                    ) {
                        if chain.add_transaction(tx) {
                            log::info!("Deducted {} from {}", deduction, u.wallet_id);
                            transactions_added = true;
                        }
                    }
                }
            }

            if transactions_added {
                chain.mine_pending_transactions("SYSTEM_MINER");
                log::info!("Mined Zakat Block");
            }
        }
    }
}
