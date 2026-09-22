use sha2::{Digest, Sha256};
use std::{
    env,
    fs,
    io::{Read, Write},
    path::{Path, PathBuf},
    process::{Command, ExitCode, Stdio},
};

fn required_file(path: PathBuf, code: &str) -> Result<PathBuf, String> {
    if path.is_file() { Ok(path) } else { Err(format!("{code}:{}", path.display())) }
}

fn required_dir(path: PathBuf, code: &str) -> Result<PathBuf, String> {
    if path.is_dir() { Ok(path) } else { Err(format!("{code}:{}", path.display())) }
}

fn runtime_root() -> Result<PathBuf, String> {
    let executable = env::current_exe()
        .map_err(|error| format!("SIDECAR_CURRENT_EXE_FAILED:{error}"))?;
    executable.parent().map(Path::to_path_buf)
        .ok_or_else(|| "SIDECAR_RUNTIME_ROOT_MISSING".to_string())
}

fn safe_relative_path(root: &Path, relative: &str) -> Result<PathBuf, String> {
    if relative.is_empty() || relative.starts_with('/') || relative.starts_with('\\') || relative.contains(':') {
        return Err("SIDECAR_LOCK_PATH_INVALID".to_string());
    }
    let normalized = relative.replace('/', "\\");
    if normalized.split('\\').any(|part| part.is_empty() || part == "." || part == "..") {
        return Err("SIDECAR_LOCK_PATH_INVALID".to_string());
    }
    Ok(root.join(normalized))
}

fn sha256_file(path: &Path) -> Result<String, String> {
    let mut file = fs::File::open(path)
        .map_err(|error| format!("SIDECAR_HASH_OPEN_FAILED:{error}"))?;
    let mut hasher = Sha256::new();
    let mut buffer = [0_u8; 64 * 1024];
    loop {
        let read = file.read(&mut buffer)
            .map_err(|error| format!("SIDECAR_HASH_READ_FAILED:{error}"))?;
        if read == 0 { break; }
        hasher.update(&buffer[..read]);
    }
    buffer.fill(0);
    Ok(format!("{:x}", hasher.finalize()))
}

fn validate_component_lock(root: &Path) -> Result<usize, String> {
    let lock_path = required_file(root.join("component-lock.json"), "SIDECAR_COMPONENT_LOCK_MISSING")?;
    let raw = fs::read(&lock_path)
        .map_err(|error| format!("SIDECAR_COMPONENT_LOCK_READ_FAILED:{error}"))?;
    let lock: serde_json::Value = serde_json::from_slice(&raw)
        .map_err(|error| format!("SIDECAR_COMPONENT_LOCK_INVALID:{error}"))?;

    if lock.get("networkRequiredAtInstall").and_then(|value| value.as_bool()).is_none() {
        return Err("SIDECAR_COMPONENT_LOCK_INSTALL_NETWORK_POLICY".to_string());
    }
    if lock.get("runtimeNetworkRequiredAfterBootstrap").and_then(|value| value.as_bool()) != Some(false) {
        return Err("SIDECAR_COMPONENT_LOCK_RUNTIME_NETWORK_POLICY".to_string());
    }
    if lock.get("expectedUserActionAfterInstall").and_then(|value| value.as_str())
        != Some("PROVIDER_API_KEY_OR_OPTIONAL_LOCAL_AI_SETUP")
    {
        return Err("SIDECAR_COMPONENT_LOCK_USER_ACTION_POLICY".to_string());
    }
    if lock
        .get("localAi")
        .and_then(|value| value.get("requiredForApplicationHealth"))
        .and_then(|value| value.as_bool())
        != Some(false)
    {
        return Err("SIDECAR_COMPONENT_LOCK_LOCAL_AI_POLICY".to_string());
    }

    let required_ids = [
        "node-runtime", "python-runtime", "lex-runtime", "legal-corpus",
        "paddle-ocr-pl", "stanza-pl-ner", "runtime-sidecar",
    ];
    let components = lock.get("components").and_then(|value| value.as_array())
        .ok_or_else(|| "SIDECAR_COMPONENT_LOCK_COMPONENTS_INVALID".to_string())?;
    for required in required_ids {
        let present = components.iter().any(|component| {
            component.get("id").and_then(|value| value.as_str()) == Some(required)
                && component.get("required").and_then(|value| value.as_bool()) == Some(true)
        });
        if !present {
            return Err(format!("SIDECAR_COMPONENT_LOCK_REQUIRED_MISSING:{required}"));
        }
    }

    let files = lock.get("files").and_then(|value| value.as_array())
        .ok_or_else(|| "SIDECAR_COMPONENT_LOCK_FILES_INVALID".to_string())?;
    let mut verified = 0_usize;
    for entry in files {
        let relative = entry.get("path").and_then(|value| value.as_str())
            .ok_or_else(|| "SIDECAR_COMPONENT_LOCK_FILE_PATH_INVALID".to_string())?;
        let expected = entry.get("sha256").and_then(|value| value.as_str())
            .ok_or_else(|| "SIDECAR_COMPONENT_LOCK_FILE_HASH_INVALID".to_string())?;
        if expected.len() != 64 || !expected.bytes().all(|byte| byte.is_ascii_hexdigit()) {
            return Err("SIDECAR_COMPONENT_LOCK_FILE_HASH_INVALID".to_string());
        }
        let path = safe_relative_path(root, relative)?;
        if !path.is_file() {
            return Err(format!("SIDECAR_COMPONENT_FILE_MISSING:{relative}"));
        }
        let actual = sha256_file(&path)?;
        if !actual.eq_ignore_ascii_case(expected) {
            return Err(format!("SIDECAR_COMPONENT_HASH_MISMATCH:{relative}"));
        }
        verified += 1;
    }
    Ok(verified)
}

fn installed_skill_overlay() -> Option<PathBuf> {
    let local = env::var_os("LOCALAPPDATA")?;
    let root = PathBuf::from(local)
        .join("LexMachina")
        .join("skills")
        .join("current");
    if root.join(".lex-skills-version.json").is_file() && root.is_dir() {
        Some(root)
    } else {
        None
    }
}

fn self_test(root: &Path) -> Result<(), String> {
    required_file(root.join("node").join("node.exe"), "SIDECAR_NODE_MISSING")?;
    required_file(root.join("app").join("dist").join("http").join("server.js"), "SIDECAR_SERVER_MISSING")?;
    required_file(root.join("app").join("node_modules").join(".bin").join("codex.cmd"), "SIDECAR_CODEX_MISSING")?;
    required_file(root.join("app").join("node_modules").join(".bin").join("claude.cmd"), "SIDECAR_CLAUDE_MISSING")?;
    required_file(root.join("python").join("python.exe"), "SIDECAR_PYTHON_MISSING")?;
    required_file(root.join("python").join("Scripts").join("uvx.exe"), "SIDECAR_UVX_MISSING")?;
    required_dir(root.join("corpus"), "SIDECAR_CORPUS_MISSING")?;
    required_dir(root.join("models").join("paddle").join("official_models"), "SIDECAR_PADDLE_MODELS_MISSING")?;
    required_dir(root.join("models").join("stanza").join("pl"), "SIDECAR_STANZA_MODELS_MISSING")?;

    let verified_files = validate_component_lock(root)?;
    println!("{}", serde_json::json!({
        "gate": "G33_PAYLOAD_NATIVE_SELF_TEST",
        "result": "PASS",
        "verifiedFiles": verified_files,
        "runtimeNetworkRequiredAfterBootstrap": false,
        "expectedUserActionAfterInstall": "PROVIDER_API_KEY_OR_OPTIONAL_LOCAL_AI_SETUP",
        "localAiRequiredForApplicationHealth": false
    }));
    Ok(())
}

fn run_runtime(root: &Path) -> Result<i32, String> {
    let node = required_file(root.join("node").join("node.exe"), "SIDECAR_NODE_MISSING")?;
    let server = required_file(root.join("app").join("dist").join("http").join("server.js"), "SIDECAR_SERVER_MISSING")?;
    let python = required_file(root.join("python").join("python.exe"), "SIDECAR_PYTHON_MISSING")?;
    let uvx = required_file(root.join("python").join("Scripts").join("uvx.exe"), "SIDECAR_UVX_MISSING")?;
    let inherited_path = env::var_os("PATH").unwrap_or_default();
    let mut runtime_paths = vec![
        root.join("node"),
        root.join("python").join("Scripts"),
        root.join("python"),
    ];
    runtime_paths.extend(env::split_paths(&inherited_path));
    let runtime_path = env::join_paths(runtime_paths)
        .map_err(|error| format!("SIDECAR_PATH_BUILD_FAILED:{error}"))?;
    let bundled_corpus = required_dir(root.join("corpus"), "SIDECAR_CORPUS_MISSING")?;
    let skills = installed_skill_overlay().unwrap_or(bundled_corpus);
    let paddle = required_dir(root.join("models").join("paddle"), "SIDECAR_PADDLE_MODELS_MISSING")?;
    let paddle_official = required_dir(paddle.join("official_models"), "SIDECAR_PADDLE_OFFICIAL_MODELS_MISSING")?;
    let stanza = required_dir(root.join("models").join("stanza"), "SIDECAR_STANZA_MODELS_MISSING")?;

    let status = Command::new(node)
        .arg(server)
        .current_dir(root.join("app"))
        .env("LEX_RUNTIME_ROOT", root)
        .env("LEX_SKILLS_PATH", skills)
        .env("LEX_OCR_PYTHON", &python)
        .env("LEX_NER_PYTHON", &python)
        .env("LEX_STORAGE_PYTHON", &python)
        .env("LEX_LEGAL_MCP_UVX", &uvx)
        .env("PATH", runtime_path)
        .env("PADDLE_PDX_CACHE_HOME", &paddle)
        .env("LEX_PADDLE_MODEL_DIR", &paddle_official)
        .env("PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK", "True")
        .env("STANZA_RESOURCES_DIR", stanza)
        .env("PYTHONNOUSERSITE", "1")
        .env("PYTHONUTF8", "1")
        .stdin(Stdio::null())
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .status()
        .map_err(|error| format!("SIDECAR_NODE_START_FAILED:{error}"))?;

    Ok(status.code().unwrap_or(1))
}

fn run() -> Result<i32, String> {
    let root = runtime_root()?;
    if env::args().skip(1).any(|arg| arg == "--self-test") {
        self_test(&root)?;
        return Ok(0);
    }
    run_runtime(&root)
}

fn main() -> ExitCode {
    match run() {
        Ok(code) => ExitCode::from(u8::try_from(code.clamp(0, 255)).unwrap_or(1)),
        Err(error) => {
            let _ = writeln!(std::io::stderr(), "{error}");
            ExitCode::FAILURE
        }
    }
}
