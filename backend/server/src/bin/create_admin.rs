
use mongodb::{bson::doc, Client, options::ClientOptions};
use server::models::{User, UserRole};
use std::env;
use blockchain::Wallet;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv::dotenv().ok();

    let database_url = env::var("MONGODB_URI").expect("MONGODB_URI must be set");
    let client_options = ClientOptions::parse(&database_url).await?;
    let client = Client::with_options(client_options)?;
    let db = client.database("crypto_wallet");
    let collection = db.collection::<User>("users");

    let args: Vec<String> = env::args().collect();
    
    // If --create flag is passed, create a new admin user
    if args.len() >= 2 && args[1] == "--create" {
        let email = if args.len() >= 3 { &args[2] } else { "admin@walx.com" };
        
        // Check if user already exists
        if let Some(_) = collection.find_one(doc! { "email": email }, None).await? {
            println!("User with email {} already exists.", email);
            return Ok(());
        }
        
        // Generate wallet
        let wallet = Wallet::new();
        let wallet_id = wallet.get_wallet_id();
        let public_key = wallet.get_public_key_hex();
        let private_key = hex::encode(wallet.keypair.to_bytes());
        
        let admin_user = User {
            id: None,
            full_name: "System Admin".to_string(),
            email: email.to_string(),
            cnic: "00000-0000000-0".to_string(),
            wallet_id: wallet_id.clone(),
            public_key: public_key.clone(),
            encrypted_private_key: private_key.clone(),
            beneficiaries: vec![],
            created_at: chrono::Utc::now().timestamp(),
            otp: None,
            otp_expiry: None,
            role: UserRole::Admin,
        };
        
        collection.insert_one(admin_user, None).await?;
        
        println!("========================================");
        println!("Admin user created successfully!");
        println!("========================================");
        println!("Email: {}", email);
        println!("Wallet ID: {}", wallet_id);
        println!("Public Key: {}", public_key);
        println!("Private Key: {}", private_key);
        println!("Role: Admin");
        println!("========================================");
        println!("SAVE THESE CREDENTIALS SECURELY!");
        println!("========================================");
        
        return Ok(());
    }
    
    // Otherwise, promote existing user
    if args.len() < 2 {
        println!("Usage:");
        println!("  cargo run --bin create_admin --create [email]  # Create new admin");
        println!("  cargo run --bin create_admin <email>           # Promote existing user");
        return Ok(());
    }

    let email = &args[1];

    match collection.find_one(doc! { "email": email }, None).await? {
        Some(user) => {
            println!("Found user: {}", user.email);
            collection.update_one(
                doc! { "email": email },
                doc! { "$set": { "role": "Admin" } },
                None
            ).await?;
            println!("User {} promoted to Admin.", email);
            println!("Wallet ID: {}", user.wallet_id);
        },
        None => {
            println!("User with email {} not found. Please register first or use --create flag.", email);
        }
    }

    Ok(())
}
