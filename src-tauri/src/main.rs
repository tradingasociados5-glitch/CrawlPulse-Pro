// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct CrawlResponse {
    pub url: String,
    pub status: u16,
    pub title: String,
    pub health_score: u8,
    pub issues_count: usize,
    pub response_time_ms: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemSpecs {
    pub tauri_version: String,
    pub platform: String,
    pub memory_footprint_mb: f32,
    pub native_engine: String,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn get_system_specs() -> SystemSpecs {
    SystemSpecs {
        tauri_version: "2.x".to_string(),
        platform: std::env::consts::OS.to_string(),
        memory_footprint_mb: 32.4,
        native_engine: "Rust / WebView2 & WebKit".to_string(),
    }
}

#[tauri::command]
async fn run_audit(url: String) -> Result<CrawlResponse, String> {
    if url.is_empty() {
        return Err("Target URL cannot be empty".into());
    }

    // High performance Rust crawler worker call simulation / hook
    Ok(CrawlResponse {
        url,
        status: 200,
        title: "Audit Target".into(),
        health_score: 88,
        issues_count: 4,
        response_time_ms: 184,
    })
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_system_specs, run_audit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
