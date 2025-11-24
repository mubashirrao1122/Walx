use actix_web::{web, HttpResponse, Responder};
use crate::db::AppState;
use crate::models::LogEntry;
use mongodb::bson::doc;
use futures::StreamExt;

#[derive(serde::Deserialize)]
pub struct LogQuery {
    pub limit: Option<usize>,
    pub offset: Option<usize>,
}

pub async fn get_logs(data: web::Data<AppState>, query: web::Query<LogQuery>) -> impl Responder {
    let collection = data.db.collection::<LogEntry>("logs");
    let find_options = mongodb::options::FindOptions::builder()
        .limit(query.limit.map(|l| l as i64))
        .skip(query.offset.map(|o| o as u64))
        .sort(doc! { "timestamp": -1 })
        .build();
    match collection.find(None, find_options).await {
        Ok(mut cursor) => {
            let mut logs: Vec<LogEntry> = Vec::new();
            while let Some(Ok(log)) = cursor.next().await {
                logs.push(log);
            }
            HttpResponse::Ok().json(logs)
        }
        Err(_) => HttpResponse::InternalServerError().json("Failed to fetch logs"),
    }
}
