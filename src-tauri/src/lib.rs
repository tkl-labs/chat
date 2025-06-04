#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(reqwest::Client::new())
        .invoke_handler(tauri::generate_handler![proxy_api_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn proxy_api_request(client: tauri::State<'_, reqwest::Client>, path: String) -> Result<String, String> {
    // build the backend URL
    let url = format!("http://localhost:8080/{}", path);

    // forward the request to your backend
    let res = client.get(&url).send().await.map_err(|e| e.to_string())?;
    let body = res.text().await.map_err(|e| e.to_string())?;

    Ok(body)
}