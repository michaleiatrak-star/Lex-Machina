mod trust_boundary;

use std::{
    io,
    process::Command,
    sync::Arc,
};
use tauri::Manager;
use trust_boundary::RuntimeBridge;

fn is_allowed_external_url(url: &str) -> bool {
    let normalized = url.trim().to_ascii_lowercase();
    normalized.starts_with("https://")
        && !normalized.contains('\r')
        && !normalized.contains('\n')
}

#[tauri::command]
fn open_external_url(url: String) -> Result<(), String> {
    if !is_allowed_external_url(&url) {
        return Err("EXTERNAL_URL_NOT_ALLOWED".to_string());
    }

    #[cfg(target_os = "windows")]
    let status = Command::new("rundll32.exe")
        .arg("url.dll,FileProtocolHandler")
        .arg(&url)
        .status();

    #[cfg(target_os = "macos")]
    let status = Command::new("open")
        .arg(&url)
        .status();

    #[cfg(all(unix, not(target_os = "macos")))]
    let status = Command::new("xdg-open")
        .arg(&url)
        .status();

    let status = status
        .map_err(|_| "EXTERNAL_BROWSER_LAUNCH_FAILED".to_string())?;
    if status.success() {
        Ok(())
    } else {
        Err("EXTERNAL_BROWSER_LAUNCH_FAILED".to_string())
    }
}

pub fn run() {
    let bridge = Arc::new(
        RuntimeBridge::new()
            .expect("failed to initialize desktop trust boundary")
    );
    let protocol_bridge = Arc::clone(&bridge);
    let setup_bridge = Arc::clone(&bridge);

    tauri::Builder::default()
        .invoke_handler(
            tauri::generate_handler![open_external_url]
        )
        .register_asynchronous_uri_scheme_protocol(
            "lex-api",
            move |_context, request, responder| {
                let bridge = Arc::clone(&protocol_bridge);
                std::thread::spawn(move || {
                    responder.respond(
                        bridge.handle(request)
                    );
                });
            },
        )
        .setup(move |app| {
            let resource_dir =
                app.path().resource_dir()?;
            setup_bridge
                .start(&resource_dir)
                .map_err(io::Error::other)?;
            setup_bridge
                .ensure_managed_identity()
                .map_err(io::Error::other)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Lex Machina desktop");
}
