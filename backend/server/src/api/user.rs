use actix_web::{web, HttpResponse, Responder};
use crate::db::AppState;
use crate::models::User;
use mongodb::bson::doc;

// Get User Profile
pub async fn get_profile(data: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let wallet_id = path.into_inner();
    let collection = data.db.collection::<User>("users");
    
    match collection.find_one(doc! { "wallet_id": &wallet_id }, None).await {
        Ok(Some(user)) => HttpResponse::Ok().json(user),
        Ok(None) => HttpResponse::NotFound().json("User not found"),
        Err(_) => HttpResponse::InternalServerError().json("Database error"),
    }
}

#[derive(serde::Deserialize)]
pub struct AddBeneficiaryRequest {
    pub wallet_id: String,
    pub beneficiary_wallet_id: String,
}

// Add Beneficiary
pub async fn add_beneficiary(data: web::Data<AppState>, req: web::Json<AddBeneficiaryRequest>) -> impl Responder {
    let collection = data.db.collection::<User>("users");

    // Check if beneficiary wallet exists
    let beneficiary_exists = collection
        .find_one(doc! { "wallet_id": &req.beneficiary_wallet_id }, None)
        .await;

    match beneficiary_exists {
        Ok(Some(_)) => {
            // Beneficiary exists, proceed to add
            let update_result = collection.update_one(
                doc! { "wallet_id": &req.wallet_id },
                doc! { "$addToSet": { "beneficiaries": &req.beneficiary_wallet_id } },
                None
            ).await;
            match update_result {
                Ok(_) => HttpResponse::Ok().json("Beneficiary added successfully"),
                Err(_) => HttpResponse::InternalServerError().json("Failed to add beneficiary"),
            }
        },
        Ok(None) => HttpResponse::BadRequest().json("Beneficiary wallet does not exist"),
        Err(_) => HttpResponse::InternalServerError().json("Database error while checking beneficiary"),
    }
}

// Get Beneficiaries (Simple list for now)
pub async fn get_beneficiaries(data: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let wallet_id = path.into_inner();
    let collection = data.db.collection::<User>("users");
    
    match collection.find_one(doc! { "wallet_id": &wallet_id }, None).await {
        Ok(Some(user)) => HttpResponse::Ok().json(user.beneficiaries),
        Ok(None) => HttpResponse::NotFound().json("User not found"),
        Err(_) => HttpResponse::InternalServerError().json("Database error"),
    }
}
