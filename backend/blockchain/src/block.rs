use serde::{Serialize, Deserialize};
use sha2::{Sha256, Digest};
use chrono::Utc;
use crate::transaction::Transaction;
use hex;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Block {
    pub index: u64,
    pub timestamp: i64,
    pub transactions: Vec<Transaction>,
    pub previous_hash: String,
    pub nonce: u64,
    pub hash: String,
}

impl Block {
    pub fn new(index: u64, transactions: Vec<Transaction>, previous_hash: String) -> Self {
        let timestamp = Utc::now().timestamp();
        let mut block = Block {
            index,
            timestamp,
            transactions,
            previous_hash,
            nonce: 0,
            hash: String::new(),
        };
        block.mine_block(2); // Default difficulty, can be adjusted
        block
    }

    pub fn calculate_hash(&self) -> String {
        let tx_data = serde_json::to_string(&self.transactions).unwrap();
        let input = format!("{}{}{}{}{}", 
            self.index, 
            self.timestamp, 
            tx_data, 
            self.previous_hash, 
            self.nonce
        );
        let mut hasher = Sha256::new();
        hasher.update(input);
        hex::encode(hasher.finalize())
    }

    pub fn mine_block(&mut self, difficulty: usize) {
        let target = "0".repeat(difficulty);
        loop {
            self.hash = self.calculate_hash();
            if self.hash.starts_with(&target) {
                break;
            }
            self.nonce += 1;
        }
        println!("Block mined: {}", self.hash);
    }
}
