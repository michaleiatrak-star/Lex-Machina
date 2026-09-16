use std::{
    env,
    path::PathBuf,
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

    let status =
        Command::new(node)
            .arg(server)
            .current_dir(
                root.join("app")
            )
            .env(
                "LEX_SKILLS_PATH",
                corpus
            )
            .env(
                "LEX_OCR_PYTHON",
                &python
            )
            .env(
                "LEX_NER_PYTHON",
                &python
            )
            .env(
                "LEX_STORAGE_PYTHON",
                &python
            )
            .env(
                "STANZA_RESOURCES_DIR",
                stanza
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
