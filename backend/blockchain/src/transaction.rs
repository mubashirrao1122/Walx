use serde::{Serialize, Deserialize};
use sha2::{Sha256, Digest};
use ed25519_dalek::{Verifier, Signature, PublicKey};
use hex;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TxInput {
    pub tx_id: String,
    pub output_index: usize,
    pub signature: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TxOutput {
    pub amount: u64,
    pub receiver_wallet_id: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Transaction {
    pub id: String,
    pub sender_wallet_id: String,
    pub receiver_wallet_id: String,
    pub amount: u64,
    pub note: Option<String>,
    pub timestamp: i64,
    pub sender_public_key: String,
    pub signature: String,
    pub inputs: Vec<TxInput>,
    pub outputs: Vec<TxOutput>,
}

impl Transaction {
    pub fn calculate_hash(&self) -> String {
        let input_data = format!("{}{}{}{}{}", 
            self.sender_wallet_id, 
            self.receiver_wallet_id, 
            self.amount, 
            self.timestamp, 
            match &self.note {
                Some(n) => n.clone(),
                None => String::new(),
            }
        );
        let mut hasher = Sha256::new();
        hasher.update(input_data);
        hex::encode(hasher.finalize())
    }

    pub fn verify_signature(&self) -> bool {
        if self.sender_wallet_id == "SYSTEM_REWARD" || self.sender_wallet_id == "ZAKAT_POOL" {
            return true; 
        }

        let pub_key_bytes = match hex::decode(&self.sender_public_key) {
            Ok(bytes) => bytes,
            Err(_) => return false,
        };

        let signature_bytes = match hex::decode(&self.signature) {
            Ok(bytes) => bytes,
            Err(_) => return false,
        };

        if pub_key_bytes.len() != 32 || signature_bytes.len() != 64 {
            return false;
        }

        let pub_key_array: [u8; 32] = match pub_key_bytes.try_into() {
            Ok(arr) => arr,
            Err(_) => return false,
        };

        let public_key = match PublicKey::from_bytes(&pub_key_array) {
            Ok(pk) => pk,
            Err(_) => return false,
        };

        let signature = match Signature::try_from(&signature_bytes[..]) {
            Ok(sig) => sig,
            Err(_) => return false,
        };

        // Verify that the signature matches the transaction ID (which is the hash of content)
        // AND that the ID is actually the hash of the content
        if self.id != self.calculate_hash() {
            return false;
        }

        public_key.verify(self.id.as_bytes(), &signature).is_ok()
    }
}
