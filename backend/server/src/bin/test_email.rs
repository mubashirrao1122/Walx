
use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use std::env;

#[tokio::main]
async fn main() {
    // Load .env file if it exists
    dotenv::dotenv().ok();

    let smtp_username = env::var("SMTP_USERNAME").expect("SMTP_USERNAME not set");
    let smtp_password = env::var("SMTP_PASSWORD")
        .map(|p| p.replace(" ", ""))
        .expect("SMTP_PASSWORD not set");

    println!("Testing email with user: '{}'", smtp_username);
    println!("Password length: {}", smtp_password.len());

    let email = Message::builder()
        .from("Walx Security <walx771@gmail.com>".parse().unwrap())
        .to("test@example.com".parse().unwrap()) // Replace with a valid email if needed, or just check connection
        .subject("Test Email")
        .header(ContentType::TEXT_PLAIN)
        .body(String::from("This is a test email."))
        .unwrap();

    let creds = Credentials::new(smtp_username, smtp_password);

    let mailer = SmtpTransport::relay("smtp.gmail.com")
        .unwrap()
        .credentials(creds)
        .build();

    match mailer.send(&email) {
        Ok(_) => println!("Email sent successfully!"),
        Err(e) => println!("Failed to send email: {:?}", e),
    }
}
