#[cfg(test)]
mod tests {
    use crate::chain::Blockchain;
    use crate::wallet::Wallet;
    use crate::transaction::Transaction;

    #[test]
    fn test_wallet_creation() {
        let wallet = Wallet::new();
        assert_eq!(wallet.get_public_key_hex().len(), 64);
    }

    #[test]
    fn test_genesis_block() {
        let chain = Blockchain::new();
        assert_eq!(chain.chain.len(), 1);
        assert_eq!(chain.get_latest_block().index, 0);
    }

    #[test]
    fn test_transaction_signing_and_verification() {
        let sender = Wallet::new();
        let receiver = Wallet::new();
        
        let mut tx = Transaction {
            id: String::new(),
            sender_wallet_id: sender.get_wallet_id(),
            receiver_wallet_id: receiver.get_wallet_id(),
            amount: 50,
            note: None,
            timestamp: 1234567890,
            sender_public_key: sender.get_public_key_hex(),
            signature: String::new(),
            inputs: vec![],
            outputs: vec![],
        };
        
        tx.id = tx.calculate_hash();
        tx.signature = sender.sign_transaction(&tx.id);

        assert!(tx.verify_signature());
    }

    #[test]
    fn test_mining_rewards() {
        let mut chain = Blockchain::new();
        let miner_wallet = Wallet::new();
        
        chain.mine_pending_transactions(&miner_wallet.get_wallet_id());
        
        assert_eq!(chain.chain.len(), 2);
        assert_eq!(chain.get_balance(&miner_wallet.get_wallet_id()), 100);
    }

    #[test]
    fn test_full_transaction_flow() {
        let mut chain = Blockchain::new();
        let sender = Wallet::new();
        let receiver = Wallet::new();
        let miner = Wallet::new();

        // 1. Fund sender via mining (needs 2 blocks to confirm and spend usually, but here immediate)
        chain.mine_pending_transactions(&sender.get_wallet_id());
        assert_eq!(chain.get_balance(&sender.get_wallet_id()), 100);

        // 2. Create Transaction
        let tx = chain.create_transaction(
            &sender, 
            receiver.get_wallet_id(), 
            50, 
            Some("Test".to_string())
        ).expect("Failed to create transaction");

        // 3. Add to chain
        assert!(chain.add_transaction(tx));

        // 4. Mine block to process
        chain.mine_pending_transactions(&miner.get_wallet_id());

        // 5. Check balances
        assert_eq!(chain.get_balance(&sender.get_wallet_id()), 50); // 100 - 50
        assert_eq!(chain.get_balance(&receiver.get_wallet_id()), 50);
    }
}
