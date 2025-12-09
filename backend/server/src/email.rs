// src/email.rs
use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};

pub async fn send_otp_email(to_email: &str, otp: &str, user_name: &str) -> Result<(), String> {
    // Get SMTP credentials from environment
    let smtp_username = std::env::var("SMTP_USERNAME")
        .map_err(|_| "SMTP_USERNAME not configured in .env")?;
    let smtp_password = std::env::var("SMTP_PASSWORD")
        .map(|p| p.replace(" ", "")) // Remove spaces from App Password
        .map_err(|_| "SMTP_PASSWORD not configured in .env")?;
    let smtp_server = std::env::var("SMTP_SERVER")
        .unwrap_or_else(|_| "smtp.gmail.com".to_string());
    // If SMTP_SERVER is set to an email address, fallback to smtp.gmail.com
    let smtp_server = if smtp_server.contains("@") {
        "smtp.gmail.com".to_string()
    } else {
        smtp_server
    };
    let smtp_port: u16 = std::env::var("SMTP_PORT")
        .unwrap_or_else(|_| "587".to_string())
        .parse()
        .unwrap_or(587);

    // Build email message
    let email_body = format!(
        r#"
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }}
                .container {{ max-width: 600px; margin: 50px auto; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .header {{ background: linear-gradient(135deg, #907CFF 0%, #AB9FF2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ padding: 40px 30px; }}
                .otp-box {{ background: #f8f9fa; border: 2px solid #907CFF; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }}
                .otp-code {{ font-size: 32px; font-weight: bold; color: #907CFF; letter-spacing: 8px; }}
                .footer {{ background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 10px 10px; }}
                .warning {{ color: #e74c3c; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Walx Login Verification</h1>
                </div>
                <div class="content">
                    <p>Hello <strong>{}</strong>,</p>
                    <p>You requested to login to your Walx wallet. Please use the following One-Time Password (OTP) to complete your authentication:</p>
                    
                    <div class="otp-box">
                        <div class="otp-code">{}</div>
                        <p style="margin-top: 10px; color: #666;">This code will expire in 5 minutes</p>
                    </div>
                    
                    <p>If you didn't request this code, please ignore this email or contact support if you're concerned about your account security.</p>
                    
                    <div class="warning">
                        <strong>Security Notice:</strong> Never share this OTP with anyone. Walx staff will never ask for your OTP.
                    </div>
                </div>
                <div class="footer">
                    <p>2024 Walx - Decentralized Crypto Wallet</p>
                    <p>This is an automated message, please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        "#,
        user_name, otp
    );

    let from_addr = "Walx Security <p229063@cfd.nu.edu.pk>"
        .parse()
        .map_err(|e| format!("Invalid from address: {}", e))?;
    let to_addr = to_email.parse().map_err(|e| format!("Invalid email address: {}", e))?;
    let email = Message::builder()
        .from(from_addr)
        .to(to_addr)
    .subject("Your Walx Login OTP Code")
        .header(ContentType::TEXT_HTML)
        .body(email_body)
        .map_err(|e| format!("Failed to build email: {}", e))?;

    // Configure SMTP transport using STARTTLS for port 587
    let creds = Credentials::new(smtp_username, smtp_password);
    
    let mailer = SmtpTransport::starttls_relay(&smtp_server)
        .map_err(|e| format!("Failed to create SMTP transport: {}", e))?
        .port(smtp_port)
        .credentials(creds)
        .build();

    // Send email
    mailer
        .send(&email)
        .map_err(|e| format!("Failed to send email: {}", e))?;

    Ok(())
}
