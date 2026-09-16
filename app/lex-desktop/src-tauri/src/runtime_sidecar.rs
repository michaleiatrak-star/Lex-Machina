use serde_json::Value;
use sha2::{Digest, Sha256};
use std::{
    env,
    fs::File,
    io::{Read, Write},
    path::{Component, Path, PathBuf},
    process::{Command, ExitCode, Stdio},
};

fn required_file(
    path: PathBuf,
    code: &str,
) -> Result<PathBuf, String> {
    if path.is_file() {
        Ok(path)
    } else {
        Err(format!(
            "{code}:{}",
            path.display()
        ))
    }
}

fn required_dir(
    path: PathBuf,
    code: &str,
) -> Result<PathBuf, String> {
    if path.is_dir() {
        Ok(path)
    } else {
        Err(format!(
            "{code}:{}",
            path.display()
        ))
    }
}

fn safe_relative_path(
    root: &Path,
    raw: &str,
) -> Result<PathBuf, String> {
    let relative = Path::new(raw);
    if relative.is_absolute() {
        return Err(
            "SIDECAR_LOCK_ABSOLUTE_PATH".to_string()
        );
    }
    for part in relative.components() {
        match part {
            Component::Normal(_) => {}
            _ => {
                return Err(
                    "SIDECAR_LOCK_PATH_TRAVERSAL".to_string()
                );
            }
        }
    }
    Ok(root.join(relative))
}

fn sha256_file(
    path: &Path,
) -> Result<String, String> {
    let mut file = File::open(path)
        .map_err(|error|
            format!(
                "SIDECAR_HASH_OPEN_FAILED:{}:{error}",
                path.display()
            )
        )?;
    let mut hasher = Sha256::new();
    let mut buffer = [0_u8; 1024 * 1024];
    loop {
        let read = file
            .read(&mut buffer)
            .map_err(|error|
                format!(
                    "SIDECAR_HASH_READ_FAILED:{}:{error}",
                    path.display()
                )
            )?;
        if read == 0 {
            break;
        }
        hasher.update(&buffer[..read]);
    }
    buffer.fill(0);
    Ok(format!("{:x}", hasher.finalize()))
}

fn verify_component_lock(
    root: &Path,
) -> Result<(), String> {
    let lock_path = required_file(
        root.join("component-lock.json"),
        "SIDECAR_COMPONENT_LOCK_MISSING",
    )?;
    let raw = std::fs::read(&lock_path)
        .map_err(|error|
            format!(
                "SIDECAR_COMPONENT_LOCK_READ_FAILED:{error}"
            )
        )?;
    let lock: Value = serde_json::from_slice(&raw)
        .map_err(|_|
            "SIDECAR_COMPONENT_LOCK_INVALID_JSON"
                .to_string()
        )?;

    if lock
        .get("schemaVersion")
        .and_then(Value::as_u64)
        != Some(1)
    {
        return Err(
            "SIDECAR_COMPONENT_LOCK_VERSION_INVALID"
                .to_string()
        );
    }
    if lock
        .get("target")
        .and_then(Value::as_str)
        != Some("windows-x86_64")
    {
        return Err(
            "SIDECAR_COMPONENT_LOCK_TARGET_INVALID"
                .to_string()
        );
    }
    if lock
        .get("networkRequiredAtInstall")
        .and_then(Value::as_bool)
        != Some(false)
    {
        return Err(
            "SIDECAR_COMPONENT_LOCK_NETWORK_POLICY_INVALID"
                .to_string()
        );
    }

    let files = lock
        .get("files")
        .and_then(Value::as_array)
        .ok_or_else(||
            "SIDECAR_COMPONENT_LOCK_FILES_MISSING"
                .to_string()
        )?;
    if files.is_empty() {
        return Err(
            "SIDECAR_COMPONENT_LOCK_FILES_EMPTY"
                .to_string()
        );
    }

    for entry in files {
        let relative = entry
            .get("path")
            .and_then(Value::as_str)
            .ok_or_else(||
                "SIDECAR_COMPONENT_LOCK_ENTRY_INVALID"
                    .to_string()
            )?;
        let expected = entry
            .get("sha256")
            .and_then(Value::as_str)
            .ok_or_else(||
                "SIDECAR_COMPONENT_LOCK_ENTRY_INVALID"
                    .to_string()
            )?;
        if expected.len() != 64
            || !expected
                .bytes()
                .all(|byte|
                    byte.is_ascii_hexdigit()
                )
        {
            return Err(
                "SIDECAR_COMPONENT_LOCK_HASH_INVALID"
                    .to_string()
            );
        }

        let target =
            safe_relative_path(
                root,
                relative,
            )?;
        if !target.is_file() {
            return Err(format!(
                "SIDECAR_COMPONENT_FILE_MISSING:{relative}"
            ));
        }
        let actual =
            sha256_file(
                &target
            )?;
        if !actual
            .eq_ignore_ascii_case(
                expected
            )
        {
            return Err(format!(
                "SIDECAR_COMPONENT_HASH_MISMATCH:{relative}"
            ));
        }
    }

    Ok(())
}

struct RuntimePaths {
    node: PathBuf,
    python: PathBuf,
    server: PathBuf,
    corpus: PathBuf,
    stanza: PathBuf,
    paddle: PathBuf,
}

fn runtime_paths(
    root: &Path,
) -> Result<RuntimePaths, String> {
    let node =
        required_file(
            root
                .join("node")
                .join("node.exe"),
            "SIDECAR_NODE_MISSING",
        )?;
    let server =
        required_file(
            root
                .join("app")
                .join("dist")
                .join("http")
                .join("server.js"),
            "SIDECAR_SERVER_MISSING",
        )?;
    let python =
        required_file(
            root
                .join("python")
                .join("python.exe"),
            "SIDECAR_PYTHON_MISSING",
        )?;
    let corpus =
        required_dir(
            root.join("corpus"),
            "SIDECAR_CORPUS_MISSING",
        )?;
    let stanza =
        required_dir(
            root
                .join("models")
                .join("stanza"),
            "SIDECAR_STANZA_MODELS_MISSING",
        )?;
    let paddle =
        required_dir(
            root
                .join("models")
                .join("paddle")
                .join("official_models"),
            "SIDECAR_PADDLE_MODELS_MISSING",
        )?;

    for model in [
        "PP-LCNet_x1_0_doc_ori",
        "UVDoc",
        "PP-LCNet_x1_0_textline_ori",
        "PP-OCRv6_medium_det",
        "PP-OCRv6_medium_rec",
    ] {
        required_dir(
            paddle.join(model),
            "SIDECAR_PADDLE_MODEL_MISSING",
        )?;
    }

    required_file(
        stanza.join("resources.json"),
        "SIDECAR_STANZA_RESOURCES_MISSING",
    )?;
    required_dir(
        stanza.join("pl"),
        "SIDECAR_STANZA_PL_MISSING",
    )?;

    Ok(RuntimePaths {
        node,
        python,
        server,
        corpus,
        stanza,
        paddle,
    })
}

fn run_command(
    executable: &Path,
    args: &[&str],
    code: &str,
) -> Result<(), String> {
    let output =
        Command::new(executable)
            .args(args)
            .stdin(Stdio::null())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .output()
            .map_err(|error|
                format!(
                    "{code}_START_FAILED:{error}"
                )
            )?;
    if !output.status.success() {
        let stderr =
            String::from_utf8_lossy(
                &output.stderr
            );
        return Err(format!(
            "{code}_FAILED:{}",
            stderr.trim()
        ));
    }
    Ok(())
}

fn self_test(
    root: &Path,
) -> Result<(), String> {
    verify_component_lock(root)?;
    let paths =
        runtime_paths(root)?;

    run_command(
        &paths.node,
        &["--version"],
        "SIDECAR_NODE_SELFTEST",
    )?;
    run_command(
        &paths.python,
        &[
            "-c",
            "import fitz,numpy,PIL,paddle,paddleocr,stanza,torch; print('PYTHON_IMPORTS_PASS')",
        ],
        "SIDECAR_PYTHON_SELFTEST",
    )?;

    let mut stdout =
        std::io::stdout();
    writeln!(
        stdout,
        "{{\"gate\":\"G33D_INSTALLER_SELFTEST\",\"result\":\"PASS\"}}"
    )
    .map_err(|error|
        format!(
            "SIDECAR_SELFTEST_OUTPUT_FAILED:{error}"
        )
    )?;

    Ok(())
}

fn run() -> Result<i32, String> {
    let executable =
        env::current_exe()
            .map_err(|error|
                format!(
                    "SIDECAR_CURRENT_EXE_FAILED:{error}"
                )
            )?;
    let root =
        executable
            .parent()
            .ok_or_else(||
                "SIDECAR_RUNTIME_ROOT_MISSING"
                    .to_string()
            )?
            .to_path_buf();

    let self_test_only =
        env::args()
            .skip(1)
            .any(|arg|
                arg == "--self-test"
            );

    if self_test_only {
        self_test(&root)?;
        return Ok(0);
    }

    verify_component_lock(
        &root
    )?;
    let paths =
        runtime_paths(
            &root
        )?;

    let status =
        Command::new(
            &paths.node
        )
            .arg(
                &paths.server
            )
            .current_dir(
                root.join("app")
            )
            .env(
                "LEX_SKILLS_PATH",
                &paths.corpus
            )
            .env(
                "LEX_OCR_PYTHON",
                &paths.python
            )
            .env(
                "LEX_NER_PYTHON",
                &paths.python
            )
            .env(
                "LEX_STORAGE_PYTHON",
                &paths.python
            )
            .env(
                "STANZA_RESOURCES_DIR",
                &paths.stanza
            )
            .env(
                "LEX_PADDLE_MODEL_DIR",
                &paths.paddle
            )
            .env(
                "PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK",
                "True"
            )
            .env(
                "PYTHONNOUSERSITE",
                "1"
            )
            .env(
                "PYTHONUTF8",
                "1"
            )
            .stdin(
                Stdio::null()
            )
            .stdout(
                Stdio::inherit()
            )
            .stderr(
                Stdio::inherit()
            )
            .status()
            .map_err(|error|
                format!(
                    "SIDECAR_NODE_START_FAILED:{error}"
                )
            )?;

    Ok(
        status.code()
            .unwrap_or(1)
    )
}

fn main() -> ExitCode {
    match run() {
        Ok(code) =>
            ExitCode::from(
                u8::try_from(
                    code.clamp(0, 255)
                )
                .unwrap_or(1)
            ),
        Err(error) => {
            eprintln!("{error}");
            ExitCode::FAILURE
        }
    }
}
