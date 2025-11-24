use ed25519_dalek::{Keypair, Signer};
use rand::rngs::OsRng;
use sha2::{Sha256, Digest};
use hex;

pub struct Wallet {
    pub keypair: Keypair,
}

impl Wallet {
    pub fn new() -> Self {
        let mut csprng = OsRng{};
        let keypair = Keypair::generate(&mut csprng);
        Wallet { keypair }
    }

    pub fn from_private_key(hex_key: &str) -> Result<Self, String> {
        let bytes = hex::decode(hex_key).map_err(|_| "Invalid hex".to_string())?;
        let secret_bytes: [u8; 32] = bytes.try_into().map_err(|_| "Invalid key length".to_string())?;
        let secret = ed25519_dalek::SecretKey::from_bytes(&secret_bytes).map_err(|e| e.to_string())?;
        let public = ed25519_dalek::PublicKey::from(&secret);
        let keypair = Keypair { secret, public };
        Ok(Wallet { keypair })
    }

    pub fn get_wallet_id(&self) -> String {
        let mut hasher = Sha256::new();
        hasher.update(self.keypair.public.as_bytes());
        hex::encode(hasher.finalize())
    }

    pub fn sign_transaction(&self, message: &str) -> String {
        let signature = self.keypair.sign(message.as_bytes());
        hex::encode(signature.to_bytes())
    }
    
    pub fn get_public_key_hex(&self) -> String {
        hex::encode(self.keypair.public.as_bytes())
    }
}
