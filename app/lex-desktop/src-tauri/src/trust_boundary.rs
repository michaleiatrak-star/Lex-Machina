use base64::{
    engine::general_purpose::URL_SAFE_NO_PAD,
    Engine as _,
};
use ed25519_dalek::{
    Signer,
    SigningKey,
};
use getrandom::fill as random_fill;
use keyring::{Entry, Error as KeyringError};
use serde_json::{json, Value};
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
const MANAGED_LOGIN: &str = "local-admin";
const MANAGED_KEYRING_SERVICE: &str = "LexMachina/Desktop";
const PROVIDER_KEYRING_SERVICE: &str = "LexMachina/ProviderCredential";
const SUPPORT_KEYRING_SERVICE: &str = "LexMachina/SupportIdentity";
const SUPPORT_INSTALLATION_ACCOUNT: &str = "installation-id";
const SUPPORT_SIGNING_KEY_ACCOUNT: &str = "challenge-signing-key";
const NATIVE_LOGIN_SENTINEL: &str = "__LEX_NATIVE_LOGIN__";
const NATIVE_REAUTH_SENTINEL: &str = "__LEX_NATIVE_REAUTH__";

struct BridgeState {
    address: Option<SocketAddr>,
    bootstrap_token: String,
    session_token: Option<String>,
    service_token: Option<String>,
    managed_password: Option<String>,
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
                service_token: None,
                managed_password: None,
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

        let support_identity =
            load_or_create_support_identity()
                .ok();

        let mut command = Command::new(&executable);
        command
            .env("LEX_HOST", "127.0.0.1")
            .env("LEX_PORT", "0")
            .env(
                "LEX_DESKTOP_BOOTSTRAP_TOKEN",
                &state.bootstrap_token,
            )
            .stdin(Stdio::null())
            .stdout(Stdio::piped())
            .stderr(Stdio::null());

        if let Some(identity) =
            support_identity.as_ref()
        {
            command.env(
                "LEX_SUPPORT_INSTALLATION_ID",
                &identity.installation_id,
            );
            command.env(
                "LEX_SUPPORT_CHALLENGE_PUBLIC_KEY",
                &identity.public_key,
            );
        }
        if let Some(public_key) =
            option_env!(
                "LEX_SUPPORT_VENDOR_PUBLIC_KEY_PEM"
            )
        {
            command.env(
                "LEX_SUPPORT_VENDOR_PUBLIC_KEY_PEM",
                public_key,
            );
        }
        if let Some(key_id) =
            option_env!(
                "LEX_SUPPORT_VENDOR_KEY_ID"
            )
        {
            command.env(
                "LEX_SUPPORT_VENDOR_KEY_ID",
                key_id,
            );
        }

        let mut child = command
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

    pub fn shutdown(&self) -> Result<(), String> {
        let mut state = self
            .state
            .lock()
            .map_err(|_| "DESKTOP_STATE_POISONED".to_string())?;

        state.address = None;
        if let Some(mut token) = state.session_token.take() {
            unsafe_zero_string(&mut token);
        }
        if let Some(mut token) = state.service_token.take() {
            unsafe_zero_string(&mut token);
        }
        if let Some(mut secret) = state.managed_password.take() {
            unsafe_zero_string(&mut secret);
        }

        if let Some(mut child) = state.child.take() {
            #[cfg(target_os = "windows")]
            {
                let pid = child.id().to_string();
                let _ = Command::new("taskkill.exe")
                    .args(["/PID", &pid, "/T", "/F"])
                    .stdout(Stdio::null())
                    .stderr(Stdio::null())
                    .status();
            }

            #[cfg(not(target_os = "windows"))]
            {
                let _ = child.kill();
            }

            let _ = child.wait();
        }

        Ok(())
    }

    pub fn ensure_managed_identity(&self) -> Result<bool, String> {
        let entry = match Entry::new(
            MANAGED_KEYRING_SERVICE,
            MANAGED_LOGIN,
        ) {
            Ok(entry) => entry,
            Err(_) => return Ok(false),
        };

        let stored_password = match entry.get_password() {
            Ok(password) => Some(password),
            Err(KeyringError::NoEntry) => None,
            Err(_) => return Ok(false),
        };

        let status_response = self.internal_json_request(
            "GET",
            "/api/auth/status",
            None,
        )?;
        if !status_response.status().is_success() {
            return Err(format!(
                "DESKTOP_AUTH_STATUS_FAILED:{}",
                status_response.status()
            ));
        }
        let status: Value = serde_json::from_slice(
            status_response.body()
        )
        .map_err(|_| "DESKTOP_AUTH_STATUS_INVALID".to_string())?;
        let requires_bootstrap = status
            .get("requiresBootstrap")
            .and_then(Value::as_bool)
            .ok_or_else(|| "DESKTOP_AUTH_STATUS_INVALID".to_string())?;

        let mut password = stored_password;
        if requires_bootstrap {
            if password.is_none() {
                let mut generated = random_secret()?;
                if entry
                    .set_password(&generated)
                    .is_err()
                {
                    unsafe_zero_string(&mut generated);
                    return Ok(false);
                }
                password = Some(generated);
            }

            let secret = password
                .as_ref()
                .ok_or_else(|| "DESKTOP_MANAGED_PASSWORD_MISSING".to_string())?;
            let response = self.internal_json_request(
                "POST",
                "/api/auth/bootstrap-managed",
                Some(json!({
                    "password": secret
                })),
            )?;
            if !response.status().is_success() {
                return Err(format!(
                    "DESKTOP_NATIVE_BOOTSTRAP_FAILED:{}",
                    response.status()
                ));
            }
        } else if let Some(secret) = password.as_ref() {
            let response = self.internal_json_request(
                "POST",
                "/api/auth/login",
                Some(json!({
                    "loginName": MANAGED_LOGIN,
                    "password": secret
                })),
            )?;
            if !response.status().is_success() {
                // Existing multi-user or manually changed account: keep
                // the normal login UI available rather than fail startup.
                return Ok(false);
            }
        } else {
            return Ok(false);
        }

        if let Some(secret) = password {
            self.replace_managed_password(secret);
        }
        self.restore_provider_credentials()?;
        Ok(true)
    }

    fn restore_provider_credentials(&self) -> Result<(), String> {
        for provider in ["openai", "anthropic", "xai"] {
            let entry = Entry::new(
                PROVIDER_KEYRING_SERVICE,
                provider,
            )
            .map_err(|error| format!(
                "DESKTOP_PROVIDER_KEYRING_OPEN_FAILED:{error}"
            ))?;
            let api_key = match entry.get_password() {
                Ok(value) => value,
                Err(KeyringError::NoEntry) => continue,
                Err(error) => {
                    return Err(format!(
                        "DESKTOP_PROVIDER_KEYRING_READ_FAILED:{error}"
                    ));
                }
            };

            let response = self.internal_json_request(
                "PUT",
                &format!(
                    "/api/admin/providers/{provider}/credential"
                ),
                Some(json!({
                    "apiKey": api_key
                })),
            )?;
            if !response.status().is_success() {
                return Err(format!(
                    "DESKTOP_PROVIDER_RESTORE_FAILED:{provider}:{}",
                    response.status()
                ));
            }
        }
        Ok(())
    }

    fn persist_provider_credential(
        &self,
        provider: &str,
        api_key: &str,
    ) -> Result<(), String> {
        Entry::new(
            PROVIDER_KEYRING_SERVICE,
            provider,
        )
        .map_err(|error| format!(
            "DESKTOP_PROVIDER_KEYRING_OPEN_FAILED:{error}"
        ))?
        .set_password(api_key)
        .map_err(|error| format!(
            "DESKTOP_PROVIDER_KEYRING_WRITE_FAILED:{error}"
        ))
    }

    fn delete_provider_credential(
        &self,
        provider: &str,
    ) -> Result<(), String> {
        let entry = Entry::new(
            PROVIDER_KEYRING_SERVICE,
            provider,
        )
        .map_err(|error| format!(
            "DESKTOP_PROVIDER_KEYRING_OPEN_FAILED:{error}"
        ))?;
        match entry.delete_credential() {
            Ok(()) | Err(KeyringError::NoEntry) => Ok(()),
            Err(error) => Err(format!(
                "DESKTOP_PROVIDER_KEYRING_DELETE_FAILED:{error}"
            )),
        }
    }

    fn internal_json_request(
        &self,
        method: &str,
        path: &str,
        body: Option<Value>,
    ) -> Result<Response<Vec<u8>>, String> {
        let bytes = match body {
            Some(value) => serde_json::to_vec(&value)
                .map_err(|_| "DESKTOP_INTERNAL_JSON_INVALID".to_string())?,
            None => Vec::new(),
        };
        let mut builder = Request::builder()
            .method(method)
            .uri(path)
            .header("Accept", "application/json");
        if !bytes.is_empty() {
            builder = builder.header("Content-Type", "application/json");
        }
        let request = builder
            .body(bytes)
            .map_err(|_| "DESKTOP_INTERNAL_REQUEST_INVALID".to_string())?;
        self.proxy(request)
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

    fn proxy(&self, mut request: Request<Vec<u8>>) -> Result<Response<Vec<u8>>, String> {
        let path = request.uri().path().to_string();
        let method = request.method().as_str().to_string();
        let provider_credential_input =
            provider_credential_from_request(
                &method,
                &path,
                request.body(),
            )?;
        let completes_managed_password_setup =
            managed_password_setup_from_request(
                &method,
                &path,
                request.body(),
            )?;
        let (
            address,
            bootstrap_token,
            session_token,
            service_token,
            managed_password,
        ) = {
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
                state.service_token.clone(),
                state.managed_password.clone(),
            )
        };

        if let Some(secret) = managed_password.as_ref() {
            inject_managed_password(
                &path,
                &mut request,
                secret,
            )?;
        }

        let authenticated = requires_session(&path);
        let bearer = if authenticated {
            session_token.as_deref()
        } else {
            None
        };
        let service_bearer =
            if path.starts_with("/api/support/") {
                service_token.as_deref()
            } else {
                None
            };

        let mut proxied = raw_http_request(
            address,
            &bootstrap_token,
            bearer,
            service_bearer,
            &request,
        )?;

        let status = proxied.status;
        if status == StatusCode::UNAUTHORIZED {
            if path.starts_with("/api/support/") {
                self.clear_service_session();
            } else {
                self.clear_session();
            }
        }
        if (
            completes_managed_password_setup
                && status.is_success()
        ) {
            self.clear_managed_identity_secret()?;
        }

        if (
            path == "/api/admin/support/challenge"
                && status.is_success()
        ) {
            proxied.body =
                sign_support_challenge_response(
                    &proxied.body
                )?;
        }

        if (
            path == "/api/admin/support/activate"
                && status.is_success()
        ) {
            if let Some((token, sanitized)) =
                extract_and_strip_service_token(
                    &proxied.body
                )?
            {
                self.replace_service_session(token);
                proxied.body = sanitized;
            } else {
                self.clear_service_session();
                return Err(
                    "DESKTOP_SERVICE_TOKEN_MISSING"
                        .to_string()
                );
            }
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
        if path == "/api/support/logout" {
            self.clear_service_session();
        }

        if status.is_success() {
            if let Some((provider, operation)) =
                provider_credential_input
            {
                match operation {
                    ProviderCredentialOperation::Set {
                        mut api_key,
                        persist,
                    } => {
                        let result =
                            if persist {
                                self.persist_provider_credential(
                                    &provider,
                                    &api_key,
                                )
                            } else {
                                self.delete_provider_credential(
                                    &provider
                                )
                            };
                        unsafe_zero_string(&mut api_key);
                        result?;
                    }
                    ProviderCredentialOperation::Delete => {
                        self.delete_provider_credential(
                            &provider
                        )?;
                    }
                }
            }
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

    fn replace_service_session(&self, token: String) {
        if let Ok(mut state) = self.state.lock() {
            if let Some(mut previous) =
                state.service_token.take()
            {
                unsafe_zero_string(&mut previous);
            }
            state.service_token = Some(token);
        }
    }

    fn clear_service_session(&self) {
        if let Ok(mut state) = self.state.lock() {
            if let Some(mut token) =
                state.service_token.take()
            {
                unsafe_zero_string(&mut token);
            }
        }
    }

    fn clear_managed_identity_secret(&self) -> Result<(), String> {
        let entry = Entry::new(
            MANAGED_KEYRING_SERVICE,
            MANAGED_LOGIN,
        )
        .map_err(|error| format!(
            "DESKTOP_KEYRING_OPEN_FAILED:{error}"
        ))?;
        match entry.delete_credential() {
            Ok(()) | Err(KeyringError::NoEntry) => {}
            Err(error) => {
                return Err(format!(
                    "DESKTOP_KEYRING_DELETE_FAILED:{error}"
                ));
            }
        }

        let mut state = self
            .state
            .lock()
            .map_err(|_| "DESKTOP_STATE_POISONED".to_string())?;
        if let Some(mut password) =
            state.managed_password.take()
        {
            unsafe_zero_string(&mut password);
        }
        Ok(())
    }

    fn replace_managed_password(&self, password: String) {
        if let Ok(mut state) = self.state.lock() {
            if let Some(mut previous) = state.managed_password.take() {
                unsafe_zero_string(&mut previous);
            }
            state.managed_password = Some(password);
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
            if let Some(mut token) = state.service_token.take() {
                unsafe_zero_string(&mut token);
            }
            if let Some(mut password) = state.managed_password.take() {
                unsafe_zero_string(&mut password);
            }
            unsafe_zero_string(&mut state.bootstrap_token);
            if let Some(child) = state.child.as_mut() {
                let _ = child.kill();
                let _ = child.wait();
            }
        }
    }
}

enum ProviderCredentialOperation {
    Set {
        api_key: String,
        persist: bool,
    },
    Delete,
}

fn provider_credential_from_request(
    method: &str,
    path: &str,
    body: &[u8],
) -> Result<Option<(String, ProviderCredentialOperation)>, String> {
    let prefix = "/api/admin/providers/";
    let suffix = "/credential";
    if !path.starts_with(prefix)
        || !path.ends_with(suffix)
    {
        return Ok(None);
    }
    let provider = &path[
        prefix.len()..
        path.len() - suffix.len()
    ];
    if !matches!(
        provider,
        "openai" | "anthropic" | "xai"
    ) {
        return Err(
            "DESKTOP_PROVIDER_INVALID".to_string()
        );
    }

    if method == "DELETE" {
        return Ok(Some((
            provider.to_string(),
            ProviderCredentialOperation::Delete,
        )));
    }
    if method != "PUT" {
        return Ok(None);
    }

    let value: Value = serde_json::from_slice(body)
        .map_err(|_|
            "DESKTOP_PROVIDER_CREDENTIAL_REQUEST_INVALID"
                .to_string()
        )?;
    let mut api_key = value
        .get("apiKey")
        .and_then(Value::as_str)
        .filter(|value| {
            !value.trim().is_empty()
                && value.len() <= 16_384
        })
        .ok_or_else(||
            "DESKTOP_PROVIDER_CREDENTIAL_REQUEST_INVALID"
                .to_string()
        )?
        .to_string();

    let persist = match value
        .get("persistence")
        .and_then(Value::as_str)
    {
        Some("OS_KEYRING") => true,
        Some("PROCESS_MEMORY") | None => false,
        _ => {
            unsafe_zero_string(&mut api_key);
            return Err(
                "DESKTOP_PROVIDER_CREDENTIAL_PERSISTENCE_INVALID"
                    .to_string()
            );
        }
    };

    Ok(Some((
        provider.to_string(),
        ProviderCredentialOperation::Set {
            api_key,
            persist,
        },
    )))
}

struct SupportIdentity {
    installation_id: String,
    public_key: String,
}

fn load_or_create_support_identity(
) -> Result<SupportIdentity, String> {
    let installation_entry = Entry::new(
        SUPPORT_KEYRING_SERVICE,
        SUPPORT_INSTALLATION_ACCOUNT,
    )
    .map_err(|error| format!(
        "DESKTOP_SUPPORT_KEYRING_OPEN_FAILED:{error}"
    ))?;
    let signing_entry = Entry::new(
        SUPPORT_KEYRING_SERVICE,
        SUPPORT_SIGNING_KEY_ACCOUNT,
    )
    .map_err(|error| format!(
        "DESKTOP_SUPPORT_KEYRING_OPEN_FAILED:{error}"
    ))?;

    let installation_id =
        match installation_entry.get_password() {
            Ok(value)
                if value.starts_with("install_")
                    && value.len() == 40 =>
            {
                value
            }
            Ok(_) => {
                return Err(
                    "DESKTOP_SUPPORT_INSTALLATION_ID_INVALID"
                        .to_string()
                );
            }
            Err(KeyringError::NoEntry) => {
                let mut bytes = [0_u8; 16];
                random_fill(&mut bytes)
                    .map_err(|error| format!(
                        "DESKTOP_RANDOM_FAILED:{error}"
                    ))?;
                let value = format!(
                    "install_{}",
                    bytes
                        .iter()
                        .map(|byte| format!("{byte:02x}"))
                        .collect::<String>()
                );
                bytes.fill(0);
                installation_entry
                    .set_password(&value)
                    .map_err(|error| format!(
                        "DESKTOP_SUPPORT_KEYRING_WRITE_FAILED:{error}"
                    ))?;
                value
            }
            Err(error) => {
                return Err(format!(
                    "DESKTOP_SUPPORT_KEYRING_READ_FAILED:{error}"
                ));
            }
        };

    let signing_key =
        match signing_entry.get_password() {
            Ok(mut encoded) => {
                let mut decoded =
                    URL_SAFE_NO_PAD
                        .decode(encoded.as_bytes())
                        .map_err(|_|
                            "DESKTOP_SUPPORT_SIGNING_KEY_INVALID"
                                .to_string()
                        )?;
                unsafe_zero_string(&mut encoded);
                if decoded.len() != 32 {
                    decoded.fill(0);
                    return Err(
                        "DESKTOP_SUPPORT_SIGNING_KEY_INVALID"
                            .to_string()
                    );
                }
                let mut seed = [0_u8; 32];
                seed.copy_from_slice(&decoded);
                decoded.fill(0);
                let key =
                    SigningKey::from_bytes(&seed);
                seed.fill(0);
                key
            }
            Err(KeyringError::NoEntry) => {
                let mut seed = [0_u8; 32];
                random_fill(&mut seed)
                    .map_err(|error| format!(
                        "DESKTOP_RANDOM_FAILED:{error}"
                    ))?;
                let mut encoded =
                    URL_SAFE_NO_PAD.encode(seed);
                signing_entry
                    .set_password(&encoded)
                    .map_err(|error| format!(
                        "DESKTOP_SUPPORT_KEYRING_WRITE_FAILED:{error}"
                    ))?;
                unsafe_zero_string(
                    &mut encoded
                );
                let key =
                    SigningKey::from_bytes(&seed);
                seed.fill(0);
                key
            }
            Err(error) => {
                return Err(format!(
                    "DESKTOP_SUPPORT_KEYRING_READ_FAILED:{error}"
                ));
            }
        };

    let public_key = format!(
        "ed25519:{}",
        URL_SAFE_NO_PAD.encode(
            signing_key
                .verifying_key()
                .to_bytes()
        )
    );
    Ok(SupportIdentity {
        installation_id,
        public_key,
    })
}

fn load_support_signing_key(
) -> Result<SigningKey, String> {
    let entry = Entry::new(
        SUPPORT_KEYRING_SERVICE,
        SUPPORT_SIGNING_KEY_ACCOUNT,
    )
    .map_err(|error| format!(
        "DESKTOP_SUPPORT_KEYRING_OPEN_FAILED:{error}"
    ))?;
    let mut encoded = entry
        .get_password()
        .map_err(|error| format!(
            "DESKTOP_SUPPORT_KEYRING_READ_FAILED:{error}"
        ))?;
    let mut decoded =
        URL_SAFE_NO_PAD
            .decode(encoded.as_bytes())
            .map_err(|_|
                "DESKTOP_SUPPORT_SIGNING_KEY_INVALID"
                    .to_string()
            )?;
    unsafe_zero_string(&mut encoded);
    if decoded.len() != 32 {
        decoded.fill(0);
        return Err(
            "DESKTOP_SUPPORT_SIGNING_KEY_INVALID"
                .to_string()
        );
    }
    let mut seed = [0_u8; 32];
    seed.copy_from_slice(&decoded);
    decoded.fill(0);
    let key =
        SigningKey::from_bytes(&seed);
    seed.fill(0);
    Ok(key)
}

fn sign_support_challenge_response(
    body: &[u8],
) -> Result<Vec<u8>, String> {
    let mut value: Value =
        serde_json::from_slice(body)
            .map_err(|_|
                "DESKTOP_SUPPORT_CHALLENGE_INVALID"
                    .to_string()
            )?;
    let object = value
        .as_object_mut()
        .ok_or_else(||
            "DESKTOP_SUPPORT_CHALLENGE_INVALID"
                .to_string()
        )?;

    let installation_id = object
        .get("installationId")
        .and_then(Value::as_str)
        .ok_or_else(||
            "DESKTOP_SUPPORT_CHALLENGE_INVALID"
                .to_string()
        )?;
    let challenge_public_key = object
        .get("challengePublicKey")
        .and_then(Value::as_str)
        .ok_or_else(||
            "DESKTOP_SUPPORT_CHALLENGE_INVALID"
                .to_string()
        )?;
    let nonce = object
        .get("nonce")
        .and_then(Value::as_str)
        .ok_or_else(||
            "DESKTOP_SUPPORT_CHALLENGE_INVALID"
                .to_string()
        )?;
    let issued_at = object
        .get("issuedAt")
        .and_then(Value::as_str)
        .ok_or_else(||
            "DESKTOP_SUPPORT_CHALLENGE_INVALID"
                .to_string()
        )?;
    let expires_at = object
        .get("expiresAt")
        .and_then(Value::as_str)
        .ok_or_else(||
            "DESKTOP_SUPPORT_CHALLENGE_INVALID"
                .to_string()
        )?;

    let canonical = format!(
        "{installation_id}\n{challenge_public_key}\n{nonce}\n{issued_at}\n{expires_at}"
    );
    let signing_key =
        load_support_signing_key()?;
    let signature =
        signing_key.sign(
            canonical.as_bytes()
        );
    object.insert(
        "challengeSignature".to_string(),
        Value::String(
            URL_SAFE_NO_PAD.encode(
                signature.to_bytes()
            )
        ),
    );
    object.insert(
        "challengeProofAlgorithm".to_string(),
        Value::String(
            "Ed25519".to_string()
        ),
    );
    serde_json::to_vec(&value)
        .map_err(|_|
            "DESKTOP_SUPPORT_CHALLENGE_INVALID"
                .to_string()
        )
}

fn random_secret() -> Result<String, String> {
    let mut bytes = [0_u8; 48];
    random_fill(&mut bytes)
        .map_err(|error| format!("DESKTOP_RANDOM_FAILED:{error}"))?;
    let secret = bytes
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect::<String>();
    bytes.fill(0);
    Ok(secret)
}

fn managed_password_setup_from_request(
    method: &str,
    path: &str,
    body: &[u8],
) -> Result<bool, String> {
    if method != "POST"
        || path != "/api/auth/password"
    {
        return Ok(false);
    }
    let value: Value = serde_json::from_slice(body)
        .map_err(|_| "DESKTOP_MANAGED_REQUEST_INVALID".to_string())?;
    let object = value
        .as_object()
        .ok_or_else(|| "DESKTOP_MANAGED_REQUEST_INVALID".to_string())?;
    Ok(
        object
            .get("currentPassword")
            .and_then(Value::as_str)
            == Some(NATIVE_REAUTH_SENTINEL)
    )
}

fn inject_managed_password(
    path: &str,
    request: &mut Request<Vec<u8>>,
    managed_password: &str,
) -> Result<(), String> {
    if path != "/api/auth/login"
        && path != "/api/deanonymization/reauthorize"
        && path != "/api/auth/password"
    {
        return Ok(());
    }
    let mut value: Value = serde_json::from_slice(request.body())
        .map_err(|_| "DESKTOP_MANAGED_REQUEST_INVALID".to_string())?;
    let object = value
        .as_object_mut()
        .ok_or_else(|| "DESKTOP_MANAGED_REQUEST_INVALID".to_string())?;
    let field = if path == "/api/auth/password" {
        "currentPassword"
    } else {
        "password"
    };
    let password = object
        .get(field)
        .and_then(Value::as_str)
        .unwrap_or("");

    let allowed = if path == "/api/auth/login" {
        object
            .get("loginName")
            .and_then(Value::as_str)
            == Some(MANAGED_LOGIN)
            && password == NATIVE_LOGIN_SENTINEL
    } else {
        password == NATIVE_REAUTH_SENTINEL
    };

    if !allowed {
        return Ok(());
    }

    object.insert(
        field.to_string(),
        Value::String(managed_password.to_string()),
    );
    *request.body_mut() = serde_json::to_vec(&value)
        .map_err(|_| "DESKTOP_MANAGED_REQUEST_INVALID".to_string())?;
    Ok(())
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
    if path.starts_with("/api/support/") {
        return false;
    }
    !matches!(
        path,
        "/health"
            | "/api/auth/status"
            | "/api/auth/bootstrap"
            | "/api/auth/bootstrap-managed"
            | "/api/auth/login"
            | "/api/auth/recover"
    )
}

fn session_producing_route(path: &str) -> bool {
    matches!(
        path,
        "/api/auth/bootstrap"
            | "/api/auth/bootstrap-managed"
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
        | "/api/update/status"
        | "/api/local-models"
        | "/api/skills/update/status" => {
            method == "GET" || (path == "/api/cases" && method == "POST")
        }
        "/api/update/download"
        | "/api/local-models/provision"
        | "/api/local-models/start"
        | "/api/local-models/stop"
        | "/api/skills/update/apply" => method == "POST",
        "/api/firm-knowledge" | "/api/shared/templates" => {
            method == "GET" || method == "POST"
        }
        _ if path.starts_with("/api/admin/users") => {
            matches!(method, "GET" | "POST" | "PATCH" | "DELETE")
        }
        _ if path.starts_with("/api/admin/providers/") => {
            matches!(method, "GET" | "PUT" | "DELETE")
        }
        _ if path.starts_with("/api/admin/support") => {
            matches!(method, "GET" | "POST")
        }
        _ if path.starts_with("/api/support/") => {
            matches!(method, "GET" | "POST")
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
    service_bearer: Option<&str>,
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
    if let Some(token) = service_bearer {
        head.push_str(
            "X-Lex-Service-Authorization: Bearer "
        );
        head.push_str(token);
        head.push_str("\r\n");
    }

    for (name, value) in request.headers() {
        let lower = name.as_str().to_ascii_lowercase();
        let allowed = matches!(
            lower.as_str(),
            "accept" | "content-type" | "cache-control"
        ) || (lower.starts_with("x-lex-")
            && lower != "x-lex-desktop-bootstrap"
            && lower != "x-lex-service-authorization");
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

fn extract_and_strip_service_token(
    body: &[u8],
) -> Result<Option<(String, Vec<u8>)>, String> {
    let mut value: Value =
        serde_json::from_slice(body)
            .map_err(|_|
                "DESKTOP_SUPPORT_RESPONSE_INVALID"
                    .to_string()
            )?;
    let object = value
        .as_object_mut()
        .ok_or_else(||
            "DESKTOP_SUPPORT_RESPONSE_INVALID"
                .to_string()
        )?;
    let Some(token) = object
        .remove("serviceToken")
        .and_then(|value|
            value.as_str().map(ToOwned::to_owned)
        )
    else {
        return Ok(None);
    };
    if token.len() < 32 || token.len() > 4096 {
        return Err(
            "DESKTOP_SERVICE_TOKEN_INVALID"
                .to_string()
        );
    }
    let sanitized =
        serde_json::to_vec(&value)
            .map_err(|_|
                "DESKTOP_SUPPORT_RESPONSE_INVALID"
                    .to_string()
            )?;
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
        assert!(route_allowed("POST", "/api/update/download"));
        assert!(route_allowed("GET", "/api/local-models"));
        assert!(route_allowed("POST", "/api/local-models/provision"));
        assert!(route_allowed("POST", "/api/local-models/start"));
        assert!(route_allowed("POST", "/api/local-models/stop"));
        assert!(route_allowed("GET", "/api/skills/update/status"));
        assert!(route_allowed("POST", "/api/skills/update/apply"));
        assert!(!route_allowed("DELETE", "/api/local-models"));
        assert!(!route_allowed("POST", "/api/auth/bootstrap-managed"));
        assert!(route_allowed("POST", "/api/admin/support/challenge"));
        assert!(route_allowed("POST", "/api/admin/support/activate"));
        assert!(route_allowed("GET", "/api/support/diagnostics"));
        assert!(route_allowed("POST", "/api/support/logout"));
        assert!(!route_allowed("DELETE", "/api/support/diagnostics"));
        assert!(!route_allowed("GET", "/api/arbitrary"));
        assert!(!route_allowed("GET", "https://example.com/"));
    }

    #[test]
    fn provider_credentials_require_explicit_keyring_opt_in() {
        let memory = provider_credential_from_request(
            "PUT",
            "/api/admin/providers/openai/credential",
            br#"{"apiKey":"memory-key-123456","persistence":"PROCESS_MEMORY"}"#,
        )
        .expect("memory request")
        .expect("provider operation");
        match memory.1 {
            ProviderCredentialOperation::Set {
                mut api_key,
                persist,
            } => {
                assert!(!persist);
                assert_eq!(api_key, "memory-key-123456");
                unsafe_zero_string(&mut api_key);
            }
            ProviderCredentialOperation::Delete => {
                panic!("unexpected delete");
            }
        }

        let persistent = provider_credential_from_request(
            "PUT",
            "/api/admin/providers/openai/credential",
            br#"{"apiKey":"stored-key-123456","persistence":"OS_KEYRING"}"#,
        )
        .expect("persistent request")
        .expect("provider operation");
        match persistent.1 {
            ProviderCredentialOperation::Set {
                mut api_key,
                persist,
            } => {
                assert!(persist);
                assert_eq!(api_key, "stored-key-123456");
                unsafe_zero_string(&mut api_key);
            }
            ProviderCredentialOperation::Delete => {
                panic!("unexpected delete");
            }
        }

        assert!(
            provider_credential_from_request(
                "PUT",
                "/api/admin/providers/openai/credential",
                br#"{"apiKey":"bad-key-123456","persistence":"UNKNOWN"}"#,
            )
            .is_err()
        );
    }

    #[test]
    fn managed_password_setup_uses_native_secret_injection() {
        let body = br#"{"currentPassword":"__LEX_NATIVE_REAUTH__","newPassword":"user-password-123456789"}"#;
        assert!(
            managed_password_setup_from_request(
                "POST",
                "/api/auth/password",
                body,
            )
            .expect("setup detection")
        );

        let mut request = Request::builder()
            .method("POST")
            .uri("/api/auth/password")
            .body(body.to_vec())
            .expect("request");
        inject_managed_password(
            "/api/auth/password",
            &mut request,
            "managed-bootstrap-secret",
        )
        .expect("secret injection");
        let value: Value =
            serde_json::from_slice(request.body())
                .expect("json");
        assert_eq!(
            value
                .get("currentPassword")
                .and_then(Value::as_str),
            Some("managed-bootstrap-secret")
        );
        assert_eq!(
            value
                .get("newPassword")
                .and_then(Value::as_str),
            Some("user-password-123456789")
        );
    }

    #[test]
    fn support_response_token_is_removed_before_webview() {
        let raw = br#"{"serviceToken":"abcdefghijklmnopqrstuvwxyz0123456789SERVICE","session":{"sessionId":"support_abc","role":"SERVICE"}}"#;
        let (token, sanitized) =
            extract_and_strip_service_token(raw)
                .expect("support response")
                .expect("service token");
        assert_eq!(
            token,
            "abcdefghijklmnopqrstuvwxyz0123456789SERVICE"
        );
        let value: Value =
            serde_json::from_slice(&sanitized)
                .expect("sanitized json");
        assert!(
            value.get("serviceToken").is_none()
        );
        assert_eq!(
            value
                .get("session")
                .and_then(|session|
                    session.get("role")
                )
                .and_then(Value::as_str),
            Some("SERVICE")
        );
    }

    #[test]
    fn service_routes_do_not_require_user_session() {
        assert!(!requires_session(
            "/api/support/me"
        ));
        assert!(!requires_session(
            "/api/support/diagnostics"
        ));
        assert!(requires_session(
            "/api/admin/support/activate"
        ));
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
