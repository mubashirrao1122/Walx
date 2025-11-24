use crate::block::Block;
use crate::transaction::{Transaction, TxOutput};
use std::collections::HashMap;

pub struct Blockchain {
    pub chain: Vec<Block>,
    pub pending_transactions: Vec<Transaction>,
    pub difficulty: usize,
    pub mining_reward: u64,
    pub utxos: HashMap<(String, usize), TxOutput>, // (TxID, OutputIndex) -> Output
}

impl Blockchain {
    pub fn new() -> Self {
        let mut chain = Blockchain {
            chain: Vec::new(),
            pending_transactions: Vec::new(),
            difficulty: 2,
            mining_reward: 100,
            utxos: HashMap::new(),
        };
        chain.create_genesis_block();
        chain
    }

    fn create_genesis_block(&mut self) {
        let genesis_block = Block::new(0, Vec::new(), "0".to_string());
        self.chain.push(genesis_block);
    }

    pub fn get_latest_block(&self) -> &Block {
        self.chain.last().unwrap()
    }

    pub fn mine_pending_transactions(&mut self, mining_reward_address: &str) {
        // Create reward transaction
        let reward_tx = Transaction {
            id: uuid::Uuid::new_v4().to_string(), // Simple ID for now
            sender_wallet_id: "SYSTEM_REWARD".to_string(),
            receiver_wallet_id: mining_reward_address.to_string(),
            amount: self.mining_reward,
            note: Some("Mining Reward".to_string()),
            timestamp: chrono::Utc::now().timestamp(),
            sender_public_key: String::new(),
            signature: String::new(),
            inputs: Vec::new(),
            outputs: vec![TxOutput {
                amount: self.mining_reward,
                receiver_wallet_id: mining_reward_address.to_string(),
            }],
        };

        let mut transactions = self.pending_transactions.clone();
        transactions.push(reward_tx);

        let previous_hash = self.get_latest_block().hash.clone();
        let new_block = Block::new(
            self.chain.len() as u64,
            transactions,
            previous_hash,
        );

        self.update_utxos(&new_block);
        self.chain.push(new_block);
        self.pending_transactions.clear();
    }

    pub fn add_transaction(&mut self, transaction: Transaction) -> bool {
        if transaction.sender_wallet_id.is_empty() || transaction.receiver_wallet_id.is_empty() {
            return false;
        }
        
        // 1. Verify Signature and Hash
        if !transaction.verify_signature() {
            println!("Transaction signature verification failed");
            return false;
        }

        // 2. Validate Inputs (UTXOs)
        // Skip UTXO check for system rewards (they have no inputs usually, or special ones)
        if transaction.sender_wallet_id != "SYSTEM_REWARD" && transaction.sender_wallet_id != "ZAKAT_POOL" {
            let mut input_sum = 0;
            for input in &transaction.inputs {
                if let Some(output) = self.utxos.get(&(input.tx_id.clone(), input.output_index)) {
                    if output.receiver_wallet_id != transaction.sender_wallet_id {
                        println!("Input not owned by sender");
                        return false; // Input not owned by sender
                    }
                    input_sum += output.amount;
                } else {
                    println!("UTXO not found for input: {}:{}", input.tx_id, input.output_index);
                    return false; // UTXO not found (double spend or invalid)
                }
            }

            if input_sum < transaction.amount {
                println!("Insufficient input balance: {} < {}", input_sum, transaction.amount);
                return false;
            }
        }
        
        self.pending_transactions.push(transaction);
        true
    }

    pub fn create_transaction(&self, sender: &crate::wallet::Wallet, receiver_id: String, amount: u64, note: Option<String>) -> Result<Transaction, String> {
        let sender_id = sender.get_wallet_id();
        let mut inputs = Vec::new();
        let mut input_sum = 0;

        // 1. Find UTXOs
        for ((tx_id, index), output) in &self.utxos {
            if output.receiver_wallet_id == sender_id {
                input_sum += output.amount;
                // Sign the input
                // Message to sign: tx_id + index.to_string() (Simplified for now, usually sign the whole tx)
                // In Bitcoin, you sign the transaction hash *after* creating it, but you need the signature *in* the input.
                // So you sign a modified version of the tx.
                // For simplicity here, we'll sign the input reference.
                let message = format!("{}{}", tx_id, index);
                let signature = sender.sign_transaction(&message);
                
                inputs.push(crate::transaction::TxInput {
                    tx_id: tx_id.clone(),
                    output_index: *index,
                    signature,
                });

                if input_sum >= amount {
                    break;
                }
            }
        }

        if input_sum < amount {
            return Err("Insufficient balance".to_string());
        }

        // 2. Create Outputs
        let mut outputs = Vec::new();
        outputs.push(TxOutput {
            amount,
            receiver_wallet_id: receiver_id.clone(),
        });

        if input_sum > amount {
            outputs.push(TxOutput {
                amount: input_sum - amount,
                receiver_wallet_id: sender_id.clone(),
            });
        }

        // 3. Create Transaction
        let mut tx = Transaction {
            id: String::new(), // Will calculate
            sender_wallet_id: sender_id,
            receiver_wallet_id: receiver_id,
            amount,
            note,
            timestamp: chrono::Utc::now().timestamp(),
            sender_public_key: sender.get_public_key_hex(),
            signature: String::new(), // Sign the whole tx
            inputs,
            outputs,
        };

        tx.id = tx.calculate_hash();
        
        // Sign the transaction ID/Hash
        tx.signature = sender.sign_transaction(&tx.id);

        Ok(tx)
    }

    fn update_utxos(&mut self, block: &Block) {
        for tx in &block.transactions {
            // Remove spent outputs
            for input in &tx.inputs {
                self.utxos.remove(&(input.tx_id.clone(), input.output_index));
            }
            // Add new outputs
            for (index, output) in tx.outputs.iter().enumerate() {
                self.utxos.insert((tx.id.clone(), index), output.clone());
            }
        }
    }

    pub fn get_balance(&self, address: &str) -> u64 {
        let mut balance = 0;
        for output in self.utxos.values() {
            if output.receiver_wallet_id == address {
                balance += output.amount;
            }
        }
        balance
    }

    pub fn is_chain_valid(&self) -> bool {
        for i in 1..self.chain.len() {
            let current_block = &self.chain[i];
            let previous_block = &self.chain[i - 1];

            if current_block.hash != current_block.calculate_hash() {
                return false;
            }
            if current_block.previous_hash != previous_block.hash {
                return false;
            }
        }
        true
    }
}
