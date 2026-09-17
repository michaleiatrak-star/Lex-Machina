mod trust_boundary;

use std::{
    env,
    io,
    path::{Path, PathBuf},
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

fn valid_workspace_open_token(token: &str) -> bool {
    if token.contains('/')
        || token.contains('\\')
        || token.contains('\r')
        || token.contains('\n')
        || token.contains("..")
    {
        return false;
    }
    let Some(rest) = token.strip_prefix("open_") else {
        return false;
    };
    let (hex, extension) = match rest.split_once('.') {
        Some((hex, extension)) => (hex, Some(extension)),
        None => (rest, None),
    };
    if hex.len() != 32
        || !hex.bytes().all(|value| value.is_ascii_hexdigit())
    {
        return false;
    }
    extension.map_or(true, |value| {
        !value.is_empty()
            && value.len() <= 10
            && value
                .bytes()
                .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit())
    })
}

fn authorized_workspace_open_path(token: &str) -> Result<PathBuf, String> {
    if !valid_workspace_open_token(token) {
        return Err("WORKSPACE_OPEN_TOKEN_INVALID".to_string());
    }
    let root = env::temp_dir().join("LexMachinaOpen");
    let root = root
        .canonicalize()
        .map_err(|_| "WORKSPACE_OPEN_ROOT_MISSING".to_string())?;
    let target = root.join(token);
    let target = target
        .canonicalize()
        .map_err(|_| "WORKSPACE_OPEN_FILE_MISSING".to_string())?;
    if !target.starts_with(&root) || !target.is_file() {
        return Err("WORKSPACE_OPEN_PATH_NOT_ALLOWED".to_string());
    }
    Ok(target)
}

fn launch_default_handler(target: &Path) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    let status = Command::new("rundll32.exe")
        .arg("url.dll,FileProtocolHandler")
        .arg(target)
        .status();

    #[cfg(target_os = "macos")]
    let status = Command::new("open")
        .arg(target)
        .status();

    #[cfg(all(unix, not(target_os = "macos")))]
    let status = Command::new("xdg-open")
        .arg(target)
        .status();

    let status = status
        .map_err(|_| "DEFAULT_HANDLER_LAUNCH_FAILED".to_string())?;
    if status.success() {
        Ok(())
    } else {
        Err("DEFAULT_HANDLER_LAUNCH_FAILED".to_string())
    }
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

#[tauri::command]
fn open_workspace_file(token: String) -> Result<(), String> {
    let target = authorized_workspace_open_path(&token)?;
    launch_default_handler(&target)
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
            tauri::generate_handler![
                open_external_url,
                open_workspace_file
            ]
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

#[cfg(test)]
mod tests {
    use super::{
        is_allowed_external_url,
        valid_workspace_open_token,
    };

    #[test]
    fn external_url_requires_https() {
        assert!(is_allowed_external_url("https://example.com/path"));
        assert!(!is_allowed_external_url("http://example.com"));
        assert!(!is_allowed_external_url("file:///C:/secret.txt"));
        assert!(!is_allowed_external_url("https://example.com\r\nX-Test: 1"));
    }

    #[test]
    fn workspace_open_token_cannot_escape_temp_root() {
        assert!(valid_workspace_open_token(
            "open_0123456789abcdef0123456789abcdef.pdf"
        ));
        assert!(valid_workspace_open_token(
            "open_0123456789abcdef0123456789abcdef"
        ));
        assert!(!valid_workspace_open_token("../secret.pdf"));
        assert!(!valid_workspace_open_token(
            "open_0123456789abcdef0123456789abcdef/secret.pdf"
        ));
        assert!(!valid_workspace_open_token(
            "open_0123456789abcdef0123456789abcdef.PDF"
        ));
    }
}
