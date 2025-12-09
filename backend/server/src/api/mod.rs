use actix_web::web;

pub mod auth;
pub mod wallet;
pub mod blockchain;
pub mod logs;
pub mod user;
pub mod admin;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/auth")
            .route("/register", web::post().to(auth::register))
            .route("/login", web::post().to(auth::login))
            .route("/verify-otp", web::post().to(auth::verify_otp))
            .route("/generate", web::post().to(auth::generate_wallet))
    );
    cfg.service(
        web::scope("/admin")
            .route("/stats", web::get().to(admin::get_system_stats))
            .route("/users", web::get().to(admin::get_all_users))
            .route("/promote", web::post().to(admin::promote_to_admin))
            .route("/mint", web::post().to(admin::mint_coins))
    );
    cfg.service(
        web::scope("/user")
            .route("/{id}/profile", web::get().to(user::get_profile))
            .route("/beneficiary", web::post().to(user::add_beneficiary))
            .route("/{id}/beneficiaries", web::get().to(user::get_beneficiaries))
    );
    cfg.service(
        web::scope("/wallet")
            .route("/{id}/balance", web::get().to(wallet::get_balance))
            .route("/{id}/history", web::get().to(wallet::get_history))
            .route("/send", web::post().to(wallet::send_transaction))
    );
    cfg.service(
        web::scope("/blockchain")
            .route("/blocks", web::get().to(blockchain::get_blocks))
            .route("/mine", web::post().to(blockchain::mine_block))
    );
    cfg.service(
        web::scope("/logs")
            .route("", web::get().to(logs::get_logs))
    );
}
