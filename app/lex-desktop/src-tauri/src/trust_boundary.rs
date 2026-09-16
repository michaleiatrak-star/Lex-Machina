use getrandom::fill as random_fill;
use serde_json::Value;
use std::{
    env,
    io::{BufRead, BufReader, Read, Write},
    net::{SocketAddr, TcpStream},
    path::Path,
    process::{Child, Command, Stdio},
    sync::{mpsc, Mutex},
    thread,
    time::Duration,
};
use tauri::http::{Request, Response, StatusCode};

const MAX_REQUEST_BYTES: usize = 160 * 1024 * 1024;
const MAX_RESPONSE_BYTES: usize = 192 * 1024 * 1024;

struct BridgeState {
    address: Option<SocketAddr>,
    bootstrap_token: String,
    session_token: Option<String>,
    child: Option<Child>,
}

pub struct RuntimeBridge {
    state: Mutex<BridgeState>,
}

impl RuntimeBridge {
    pub fn new() -> Result<Self, String> {
        let mut bytes = [0_u8; 32];
        random_fill(&mut bytes)
            .map_err(|error| format!("DESKTOP_RANDOM_FAILED:{error}"))?;
        let bootstrap_token = bytes
            .iter()
            .map(|byte| format!("{byte:02x}"))
            .collect::<String>();
        bytes.fill(0);

        Ok(Self {
            state: Mutex::new(BridgeState {
                address: None,
                bootstrap_token,
                session_token: None,
                child: None,
            }),
        })
    }

    pub fn start(&self, resource_dir: &Path) -> Result<(), String> {
        let mut state = self
            .state
            .lock()
            .map_err(|_| "DESKTOP_STATE_POISONED".to_string())?;

        if state.address.is_some() {
            return Ok(());
        }

        if let Ok(raw) = env::var("LEX_DESKTOP_RUNTIME_ADDR") {
            let address = parse_loopback_address(&raw)?;
            state.address = Some(address);
            if let Ok(token) = env::var("LEX_DESKTOP_RUNTIME_BOOTSTRAP_TOKEN") {
                state.bootstrap_token = token;
            } else {
                state.bootstrap_token.clear();
            }
            return Ok(());
        }

        let executable = env::var_os("LEX_DESKTOP_RUNTIME_EXECUTABLE")
            .map(std::path::PathBuf::from)
            .unwrap_or_else(|| {
                resource_dir
                    .join("runtime")
                    .join(runtime_executable_name())
            });

        if !executable.is_file() {
            return Err(format!(
                "DESKTOP_RUNTIME_MISSING:{}",
                executable.display()
            ));
        }

        let mut child = Command::new(&executable)
            .env("LEX_HOST", "127.0.0.1")
            .env("LEX_PORT", "0")
            .env(
                "LEX_DESKTOP_BOOTSTRAP_TOKEN",
                &state.bootstrap_token,
            )
            .stdin(Stdio::null())
            .stdout(Stdio::piped())
            .stderr(Stdio::null())
            .spawn()
            .map_err(|error| format!("DESKTOP_RUNTIME_SPAWN_FAILED:{error}"))?;

        let stdout = child
            .stdout
            .take()
            .ok_or_else(|| "DESKTOP_RUNTIME_STDOUT_MISSING".to_string())?;
        let (tx, rx) = mpsc::channel();

        thread::spawn(move || {
            let reader = BufReader::new(stdout);
            for line in reader.lines().map_while(Result::ok) {
                if let Some(address) = runtime_address_from_line(&line) {
                    let _ = tx.send(address);
                    break;
                }
            }
        });

        let address = match rx.recv_timeout(Duration::from_secs(60)) {
            Ok(address) => address,
            Err(_) => {
                let _ = child.kill();
                let _ = child.wait();
                return Err("DESKTOP_RUNTIME_START_TIMEOUT".to_string());
            }
        };

        state.address = Some(address);
        state.child = Some(child);
        Ok(())
    }

    pub fn handle(&self, request: Request<Vec<u8>>) -> Response<Vec<u8>> {
        if request.method() == "OPTIONS" {
            return cors_response(StatusCode::NO_CONTENT, Vec::new(), None);
        }

        let path = request.uri().path();
        if !route_allowed(request.method().as_str(), path) {
            return json_error(StatusCode::FORBIDDEN, "DESKTOP_ROUTE_NOT_ALLOWED");
        }

        if request.body().len() > MAX_REQUEST_BYTES {
            return json_error(StatusCode::PAYLOAD_TOO_LARGE, "DESKTOP_REQUEST_TOO_LARGE");
        }

        match self.proxy(request) {
            Ok(response) => response,
            Err(error) => json_error(
                StatusCode::BAD_GATEWAY,
                &format!("DESKTOP_RUNTIME_PROXY_FAILED:{error}"),
            ),
        }
    }

    fn proxy(&self, request: Request<Vec<u8>>) -> Result<Response<Vec<u8>>, String> {
        let path = request.uri().path().to_string();
        let (address, bootstrap_token, session_token) = {
            let state = self
                .state
                .lock()
                .map_err(|_| "DESKTOP_STATE_POISONED".to_string())?;
            (
                state
                    .address
                    .ok_or_else(|| "DESKTOP_RUNTIME_NOT_READY".to_string())?,
                state.bootstrap_token.clone(),
                state.session_token.clone(),
            )
        };

        let authenticated = requires_session(&path);
        let bearer = if authenticated {
            session_token.as_deref()
        } else {
            None
        };

        let mut proxied = raw_http_request(
            address,
            &bootstrap_token,
            bearer,
            &request,
        )?;

        let status = proxied.status;
        if status == StatusCode::UNAUTHORIZED {
            self.clear_session();
        }

        if session_producing_route(&path) && status.is_success() {
            if let Some((token, sanitized)) = extract_and_strip_session_token(&proxied.body)? {
                self.replace_session(token);
                proxied.body = sanitized;
            } else {
                self.clear_session();
                return Err("DESKTOP_SESSION_TOKEN_MISSING".to_string());
            }
        }

        if path == "/api/auth/logout" || path == "/api/auth/lock" {
            self.clear_session();
        }

        Ok(build_response(proxied))
    }

    fn replace_session(&self, token: String) {
        if let Ok(mut state) = self.state.lock() {
            if let Some(mut previous) = state.session_token.take() {
                unsafe_zero_string(&mut previous);
            }
            state.session_token = Some(token);
        }
    }

    fn clear_session(&self) {
        if let Ok(mut state) = self.state.lock() {
            if let Some(mut token) = state.session_token.take() {
                unsafe_zero_string(&mut token);
            }
        }
    }

    #[cfg(test)]
    fn has_session(&self) -> bool {
        self.state
            .lock()
            .map(|state| state.session_token.is_some())
            .unwrap_or(false)
    }
}

impl Drop for RuntimeBridge {
    fn drop(&mut self) {
        if let Ok(mut state) = self.state.lock() {
            if let Some(mut token) = state.session_token.take() {
                unsafe_zero_string(&mut token);
            }
            unsafe_zero_string(&mut state.bootstrap_token);
            if let Some(child) = state.child.as_mut() {
                let _ = child.kill();
                let _ = child.wait();
            }
        }
    }
}

fn runtime_executable_name() -> &'static str {
    #[cfg(target_os = "windows")]
    {
        "lex-runtime-sidecar.exe"
    }
    #[cfg(not(target_os = "windows"))]
    {
        "lex-runtime-sidecar"
    }
}

fn parse_loopback_address(raw: &str) -> Result<SocketAddr, String> {
    let address: SocketAddr = raw
        .parse()
        .map_err(|_| "DESKTOP_RUNTIME_ADDR_INVALID".to_string())?;
    if !address.ip().is_loopback() {
        return Err("DESKTOP_RUNTIME_ADDR_NOT_LOOPBACK".to_string());
    }
    Ok(address)
}

fn runtime_address_from_line(line: &str) -> Option<SocketAddr> {
    let marker = "http://";
    let start = line.find(marker)? + marker.len();
    let raw = line[start..].trim();
    parse_loopback_address(raw).ok()
}

fn requires_session(path: &str) -> bool {
    !matches!(
        path,
        "/health"
            | "/api/auth/status"
            | "/api/auth/bootstrap"
            | "/api/auth/login"
            | "/api/auth/recover"
    )
}

fn session_producing_route(path: &str) -> bool {
    matches!(
        path,
        "/api/auth/bootstrap"
            | "/api/auth/login"
            | "/api/auth/recover"
            | "/api/auth/password"
    )
}

fn route_allowed(method: &str, path: &str) -> bool {
    match path {
        "/health" => method == "GET",
        "/api/auth/status" | "/api/auth/me" => method == "GET",
        "/api/auth/bootstrap"
        | "/api/auth/login"
        | "/api/auth/recover"
        | "/api/auth/password"
        | "/api/auth/recovery-code"
        | "/api/auth/lock"
        | "/api/auth/logout"
        | "/api/deanonymization/reauthorize"
        | "/api/deanonymization/finalize"
        | "/api/sessions/execute"
        | "/api/routes/validate" => method == "POST",
        "/api/cases"
        | "/api/providers"
        | "/api/routes"
        | "/api/update/status" => method == "GET" || (path == "/api/cases" && method == "POST"),
        "/api/firm-knowledge" | "/api/shared/templates" => {
            method == "GET" || method == "POST"
        }
        _ if path.starts_with("/api/admin/users") => {
            matches!(method, "GET" | "POST" | "PATCH" | "DELETE")
        }
        _ if path.starts_with("/api/admin/providers/") => {
            matches!(method, "GET" | "PUT" | "DELETE")
        }
        _ if path.starts_with("/api/cases/") => {
            matches!(method, "GET" | "POST" | "PATCH" | "DELETE")
        }
        _ if path.starts_with("/api/documents/") => {
            matches!(method, "GET" | "POST")
        }
        _ if path.starts_with("/api/models/") => method == "GET",
        _ if path.starts_with("/api/sensitive-download/") => method == "GET",
        _ => false,
    }
}

struct ProxiedResponse {
    status: StatusCode,
    headers: Vec<(String, String)>,
    body: Vec<u8>,
}

fn raw_http_request(
    address: SocketAddr,
    bootstrap_token: &str,
    bearer: Option<&str>,
    request: &Request<Vec<u8>>,
) -> Result<ProxiedResponse, String> {
    let mut stream = TcpStream::connect_timeout(&address, Duration::from_secs(5))
        .map_err(|error| format!("CONNECT:{error}"))?;
    stream
        .set_read_timeout(Some(Duration::from_secs(120)))
        .map_err(|error| format!("READ_TIMEOUT:{error}"))?;
    stream
        .set_write_timeout(Some(Duration::from_secs(30)))
        .map_err(|error| format!("WRITE_TIMEOUT:{error}"))?;

    let target = request
        .uri()
        .path_and_query()
        .map(|value| value.as_str())
        .unwrap_or(request.uri().path());

    let mut head = format!(
        "{} {} HTTP/1.1\r\nHost: {}\r\nConnection: close\r\nAccept-Encoding: identity\r\n",
        request.method(),
        target,
        address
    );

    if !bootstrap_token.is_empty() {
        head.push_str("X-Lex-Desktop-Bootstrap: ");
        head.push_str(bootstrap_token);
        head.push_str("\r\n");
    }

    if let Some(token) = bearer {
        head.push_str("Authorization: Bearer ");
        head.push_str(token);
        head.push_str("\r\n");
    }

    for (name, value) in request.headers() {
        let lower = name.as_str().to_ascii_lowercase();
        let allowed = matches!(
            lower.as_str(),
            "accept" | "content-type" | "cache-control"
        ) || (lower.starts_with("x-lex-")
            && lower != "x-lex-desktop-bootstrap");
        if !allowed {
            continue;
        }
        let value = value
            .to_str()
            .map_err(|_| "REQUEST_HEADER_INVALID".to_string())?;
        if value.contains('\r') || value.contains('\n') {
            return Err("REQUEST_HEADER_INVALID".to_string());
        }
        head.push_str(name.as_str());
        head.push_str(": ");
        head.push_str(value);
        head.push_str("\r\n");
    }

    head.push_str(&format!("Content-Length: {}\r\n\r\n", request.body().len()));

    stream
        .write_all(head.as_bytes())
        .and_then(|_| stream.write_all(request.body()))
        .and_then(|_| stream.flush())
        .map_err(|error| format!("WRITE:{error}"))?;

    let mut raw = Vec::new();
    stream
        .take((MAX_RESPONSE_BYTES + 1024 * 1024) as u64)
        .read_to_end(&mut raw)
        .map_err(|error| format!("READ:{error}"))?;

    if raw.len() > MAX_RESPONSE_BYTES {
        return Err("RESPONSE_TOO_LARGE".to_string());
    }

    parse_http_response(raw)
}

fn parse_http_response(raw: Vec<u8>) -> Result<ProxiedResponse, String> {
    let header_end = raw
        .windows(4)
        .position(|window| window == b"\r\n\r\n")
        .ok_or_else(|| "HTTP_RESPONSE_HEADER_INVALID".to_string())?;

    let header_bytes = &raw[..header_end];
    let header_text = std::str::from_utf8(header_bytes)
        .map_err(|_| "HTTP_RESPONSE_HEADER_UTF8".to_string())?;
    let mut lines = header_text.split("\r\n");
    let status_line = lines
        .next()
        .ok_or_else(|| "HTTP_RESPONSE_STATUS_MISSING".to_string())?;
    let status_code = status_line
        .split_whitespace()
        .nth(1)
        .ok_or_else(|| "HTTP_RESPONSE_STATUS_INVALID".to_string())?
        .parse::<u16>()
        .map_err(|_| "HTTP_RESPONSE_STATUS_INVALID".to_string())?;
    let status = StatusCode::from_u16(status_code)
        .map_err(|_| "HTTP_RESPONSE_STATUS_INVALID".to_string())?;

    let mut headers = Vec::new();
    let mut chunked = false;
    for line in lines {
        let Some((name, value)) = line.split_once(':') else {
            return Err("HTTP_RESPONSE_HEADER_INVALID".to_string());
        };
        let name = name.trim().to_ascii_lowercase();
        let value = value.trim().to_string();
        if name == "transfer-encoding"
            && value.to_ascii_lowercase().contains("chunked")
        {
            chunked = true;
        }
        headers.push((name, value));
    }

    let body = raw[(header_end + 4)..].to_vec();
    let body = if chunked {
        decode_chunked(&body)?
    } else {
        body
    };

    Ok(ProxiedResponse {
        status,
        headers,
        body,
    })
}

fn decode_chunked(raw: &[u8]) -> Result<Vec<u8>, String> {
    let mut cursor = 0_usize;
    let mut output = Vec::new();

    loop {
        let line_end = raw[cursor..]
            .windows(2)
            .position(|window| window == b"\r\n")
            .map(|offset| cursor + offset)
            .ok_or_else(|| "HTTP_CHUNK_SIZE_MISSING".to_string())?;
        let size_text = std::str::from_utf8(&raw[cursor..line_end])
            .map_err(|_| "HTTP_CHUNK_SIZE_INVALID".to_string())?;
        let size_text = size_text.split(';').next().unwrap_or(size_text);
        let size = usize::from_str_radix(size_text.trim(), 16)
            .map_err(|_| "HTTP_CHUNK_SIZE_INVALID".to_string())?;
        cursor = line_end + 2;

        if size == 0 {
            break;
        }
        let end = cursor
            .checked_add(size)
            .ok_or_else(|| "HTTP_CHUNK_OVERFLOW".to_string())?;
        if end + 2 > raw.len() || &raw[end..end + 2] != b"\r\n" {
            return Err("HTTP_CHUNK_TRUNCATED".to_string());
        }
        if output.len() + size > MAX_RESPONSE_BYTES {
            return Err("RESPONSE_TOO_LARGE".to_string());
        }
        output.extend_from_slice(&raw[cursor..end]);
        cursor = end + 2;
    }

    Ok(output)
}

fn extract_and_strip_session_token(
    body: &[u8],
) -> Result<Option<(String, Vec<u8>)>, String> {
    let mut value: Value = serde_json::from_slice(body)
        .map_err(|_| "DESKTOP_AUTH_RESPONSE_INVALID".to_string())?;
    let object = value
        .as_object_mut()
        .ok_or_else(|| "DESKTOP_AUTH_RESPONSE_INVALID".to_string())?;
    let Some(token) = object
        .remove("sessionToken")
        .and_then(|value| value.as_str().map(ToOwned::to_owned))
    else {
        return Ok(None);
    };
    if token.len() < 32 || token.len() > 4096 {
        return Err("DESKTOP_SESSION_TOKEN_INVALID".to_string());
    }
    let sanitized = serde_json::to_vec(&value)
        .map_err(|_| "DESKTOP_AUTH_RESPONSE_INVALID".to_string())?;
    Ok(Some((token, sanitized)))
}

fn build_response(response: ProxiedResponse) -> Response<Vec<u8>> {
    let content_type = header_value(&response.headers, "content-type");
    let content_disposition = header_value(&response.headers, "content-disposition");
    let retry_after = header_value(&response.headers, "retry-after");
    let cache_control = header_value(&response.headers, "cache-control");

    let mut builder = Response::builder()
        .status(response.status)
        .header("Access-Control-Allow-Origin", "*")
        .header(
            "Access-Control-Expose-Headers",
            "Content-Disposition, Retry-After",
        )
        .header("X-Content-Type-Options", "nosniff")
        .header("Content-Length", response.body.len().to_string());

    if let Some(value) = content_type {
        builder = builder.header("Content-Type", value);
    }
    if let Some(value) = content_disposition {
        builder = builder.header("Content-Disposition", value);
    }
    if let Some(value) = retry_after {
        builder = builder.header("Retry-After", value);
    }
    if let Some(value) = cache_control {
        builder = builder.header("Cache-Control", value);
    }

    builder
        .body(response.body)
        .unwrap_or_else(|_| {
            json_error(StatusCode::INTERNAL_SERVER_ERROR, "DESKTOP_RESPONSE_BUILD_FAILED")
        })
}

fn header_value(headers: &[(String, String)], name: &str) -> Option<String> {
    headers
        .iter()
        .find(|(candidate, _)| candidate == name)
        .map(|(_, value)| value.clone())
}

fn cors_response(
    status: StatusCode,
    body: Vec<u8>,
    content_type: Option<&str>,
) -> Response<Vec<u8>> {
    let mut builder = Response::builder()
        .status(status)
        .header("Access-Control-Allow-Origin", "*")
        .header(
            "Access-Control-Allow-Methods",
            "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        )
        .header(
            "Access-Control-Allow-Headers",
            "Accept, Content-Type, Cache-Control, X-Lex-Filename, X-Lex-Case-Id",
        )
        .header(
            "Access-Control-Expose-Headers",
            "Content-Disposition, Retry-After",
        )
        .header("Cache-Control", "no-store")
        .header("Content-Length", body.len().to_string());

    if let Some(content_type) = content_type {
        builder = builder.header("Content-Type", content_type);
    }

    builder.body(body).unwrap_or_else(|_| Response::new(Vec::new()))
}

fn json_error(status: StatusCode, code: &str) -> Response<Vec<u8>> {
    let body = serde_json::to_vec(&serde_json::json!({ "error": code }))
        .unwrap_or_else(|_| b"{\"error\":\"DESKTOP_INTERNAL_ERROR\"}".to_vec());
    cors_response(status, body, Some("application/json"))
}

fn unsafe_zero_string(value: &mut String) {
    unsafe {
        value.as_bytes_mut().fill(0);
    }
    value.clear();
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn allowlist_rejects_unknown_routes_and_methods() {
        assert!(route_allowed("GET", "/api/cases"));
        assert!(route_allowed("POST", "/api/cases/case_abc/files"));
        assert!(route_allowed("GET", "/api/sensitive-download/download_abc"));
        assert!(!route_allowed("POST", "/api/update/status"));
        assert!(!route_allowed("GET", "/api/arbitrary"));
        assert!(!route_allowed("GET", "https://example.com/"));
    }

    #[test]
    fn auth_response_token_is_removed_before_webview() {
        let raw = br#"{"user":{"userId":"u"},"session":{"sessionId":"s"},"sessionToken":"abcdefghijklmnopqrstuvwxyz0123456789TOKEN"}"#;
        let (token, sanitized) = extract_and_strip_session_token(raw)
            .expect("valid response")
            .expect("token present");
        assert!(token.contains("TOKEN"));
        let text = String::from_utf8(sanitized).expect("utf8");
        assert!(!text.contains("sessionToken"));
        assert!(!text.contains("TOKEN"));
    }

    #[test]
    fn bridge_session_is_native_only() {
        let bridge = RuntimeBridge::new().expect("bridge");
        assert!(!bridge.has_session());
        bridge.replace_session("x".repeat(64));
        assert!(bridge.has_session());
        bridge.clear_session();
        assert!(!bridge.has_session());
    }

    #[test]
    fn runtime_address_parser_is_loopback_only() {
        assert!(parse_loopback_address("127.0.0.1:4317").is_ok());
        assert!(parse_loopback_address("0.0.0.0:4317").is_err());
        assert!(parse_loopback_address("192.168.1.10:4317").is_err());
    }
}
