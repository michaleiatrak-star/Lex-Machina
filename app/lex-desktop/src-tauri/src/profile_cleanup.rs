use keyring::{Entry, Error as KeyringError};
use std::{
    env,
    fs,
    path::{Path, PathBuf},
    process::ExitCode,
};

const MANAGED_KEYRING_SERVICE: &str = "LexMachina/Desktop";
const MANAGED_LOGIN: &str = "local-admin";
const PROVIDER_KEYRING_SERVICE: &str = "LexMachina/ProviderCredential";
const SUPPORT_KEYRING_SERVICE: &str = "LexMachina/SupportIdentity";
const SUPPORT_INSTALLATION_ACCOUNT: &str = "installation-id";
const SUPPORT_SIGNING_KEY_ACCOUNT: &str = "challenge-signing-key";

fn credential_targets() -> Vec<(&'static str, &'static str)> {
    vec![
        (MANAGED_KEYRING_SERVICE, MANAGED_LOGIN),
        (PROVIDER_KEYRING_SERVICE, "openai"),
        (PROVIDER_KEYRING_SERVICE, "anthropic"),
        (PROVIDER_KEYRING_SERVICE, "xai"),
        (SUPPORT_KEYRING_SERVICE, SUPPORT_INSTALLATION_ACCOUNT),
        (SUPPORT_KEYRING_SERVICE, SUPPORT_SIGNING_KEY_ACCOUNT),
    ]
}

fn data_roots() -> Vec<PathBuf> {
    let mut roots = Vec::new();
    if let Some(value) = env::var_os("USERPROFILE") {
        roots.push(PathBuf::from(value).join(".lex-machina"));
    }
    if let Some(value) = env::var_os("LOCALAPPDATA") {
        let base = PathBuf::from(value);
        roots.push(base.join("LexMachina"));
        roots.push(base.join("pl.lexmachina.desktop"));
        roots.push(base.join("lex-machina"));
    }
    if let Some(value) = env::var_os("APPDATA") {
        let base = PathBuf::from(value);
        roots.push(base.join("LexMachina"));
        roots.push(base.join("pl.lexmachina.desktop"));
        roots.push(base.join("lex-machina"));
    }
    if let Some(value) = env::var_os("TEMP") {
        let base = PathBuf::from(value);
        roots.push(base.join("LexMachinaUpdate"));
        roots.push(base.join("LexMachinaOpen"));
    }
    roots
}

fn path_is_app_scoped(path: &Path) -> bool {
    let normalized = path.to_string_lossy().replace('\\', "/").to_ascii_lowercase();
    normalized.contains("/.lex-machina")
        || normalized.contains("/lexmachina")
        || normalized.contains("/lex-machina")
        || normalized.contains("/pl.lexmachina.desktop")
}

fn purge_path(path: &Path) -> Result<(), String> {
    if !path_is_app_scoped(path) {
        return Err(format!("PROFILE_CLEANUP_UNSAFE_PATH:{}", path.display()));
    }
    let metadata = match fs::symlink_metadata(path) {
        Ok(value) => value,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(()),
        Err(error) => {
            return Err(format!(
                "PROFILE_CLEANUP_METADATA_FAILED:{}:{error}",
                path.display()
            ));
        }
    };

    if metadata.file_type().is_symlink() || metadata.is_file() {
        fs::remove_file(path).map_err(|error| {
            format!("PROFILE_CLEANUP_FILE_DELETE_FAILED:{}:{error}", path.display())
        })
    } else {
        fs::remove_dir_all(path).map_err(|error| {
            format!("PROFILE_CLEANUP_DIR_DELETE_FAILED:{}:{error}", path.display())
        })
    }
}

fn delete_credential(service: &str, account: &str) -> Result<(), String> {
    let entry = Entry::new(service, account)
        .map_err(|error| format!("PROFILE_CLEANUP_KEYRING_OPEN_FAILED:{service}:{account}:{error}"))?;
    match entry.delete_credential() {
        Ok(()) | Err(KeyringError::NoEntry) => Ok(()),
        Err(error) => Err(format!(
            "PROFILE_CLEANUP_KEYRING_DELETE_FAILED:{service}:{account}:{error}"
        )),
    }
}

fn purge_all() -> Result<(), String> {
    let mut failures = Vec::new();

    for (service, account) in credential_targets() {
        if let Err(error) = delete_credential(service, account) {
            failures.push(error);
        }
    }

    for root in data_roots() {
        if let Err(error) = purge_path(&root) {
            failures.push(error);
        }
    }

    if failures.is_empty() {
        println!("LEX_PROFILE_CLEANUP_PASS");
        Ok(())
    } else {
        Err(format!(
            "PROFILE_CLEANUP_INCOMPLETE:{}",
            failures.join(" | ")
        ))
    }
}

fn self_test() -> Result<(), String> {
    let temp_root = env::temp_dir().join(format!(
        "LexMachinaProfileCleanupSelfTest-{}",
        std::process::id()
    ));
    fs::create_dir_all(temp_root.join("profiles").join("nested"))
        .map_err(|error| format!("PROFILE_CLEANUP_SELFTEST_CREATE_FAILED:{error}"))?;
    fs::write(
        temp_root.join("profiles").join("nested").join("auth.sqlite"),
        b"test",
    )
    .map_err(|error| format!("PROFILE_CLEANUP_SELFTEST_WRITE_FAILED:{error}"))?;

    purge_path(&temp_root)?;
    if temp_root.exists() {
        return Err("PROFILE_CLEANUP_SELFTEST_PATH_SURVIVED".to_string());
    }

    let service = "LexMachina/ProfileCleanupSelfTest";
    let account = format!("ci-{}", std::process::id());
    let entry = Entry::new(service, &account)
        .map_err(|error| format!("PROFILE_CLEANUP_SELFTEST_KEYRING_OPEN_FAILED:{error}"))?;
    entry
        .set_password("self-test-secret")
        .map_err(|error| format!("PROFILE_CLEANUP_SELFTEST_KEYRING_WRITE_FAILED:{error}"))?;
    let read_back = entry
        .get_password()
        .map_err(|error| format!("PROFILE_CLEANUP_SELFTEST_KEYRING_READ_FAILED:{error}"))?;
    if read_back != "self-test-secret" {
        let _ = entry.delete_credential();
        return Err("PROFILE_CLEANUP_SELFTEST_KEYRING_VALUE_INVALID".to_string());
    }
    match entry.delete_credential() {
        Ok(()) => {}
        Err(error) => {
            return Err(format!(
                "PROFILE_CLEANUP_SELFTEST_KEYRING_DELETE_FAILED:{error}"
            ));
        }
    }
    match entry.get_password() {
        Err(KeyringError::NoEntry) => {}
        Ok(_) => return Err("PROFILE_CLEANUP_SELFTEST_KEYRING_SURVIVED".to_string()),
        Err(error) => {
            return Err(format!(
                "PROFILE_CLEANUP_SELFTEST_KEYRING_VERIFY_FAILED:{error}"
            ));
        }
    }

    if credential_targets().len() != 6 {
        return Err("PROFILE_CLEANUP_SELFTEST_TARGET_COUNT_INVALID".to_string());
    }
    let roots = data_roots();
    if roots.is_empty() || roots.iter().any(|path| !path_is_app_scoped(path)) {
        return Err("PROFILE_CLEANUP_SELFTEST_ROOT_POLICY_INVALID".to_string());
    }

    println!("LEX_PROFILE_CLEANUP_SELFTEST_PASS");
    Ok(())
}

fn run() -> Result<(), String> {
    let args = env::args().skip(1).collect::<Vec<_>>();
    match args.as_slice() {
        [flag] if flag == "--purge-all" => purge_all(),
        [flag] if flag == "--self-test" => self_test(),
        _ => Err(
            "PROFILE_CLEANUP_USAGE: expected --purge-all or --self-test"
                .to_string(),
        ),
    }
}

fn main() -> ExitCode {
    match run() {
        Ok(()) => ExitCode::SUCCESS,
        Err(error) => {
            eprintln!("{error}");
            ExitCode::FAILURE
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{credential_targets, path_is_app_scoped};
    use std::path::Path;

    #[test]
    fn all_production_credential_targets_are_declared() {
        let targets = credential_targets();
        assert!(targets.contains(&("LexMachina/Desktop", "local-admin")));
        assert!(targets.contains(&("LexMachina/ProviderCredential", "openai")));
        assert!(targets.contains(&("LexMachina/ProviderCredential", "anthropic")));
        assert!(targets.contains(&("LexMachina/ProviderCredential", "xai")));
        assert!(targets.contains(&("LexMachina/SupportIdentity", "installation-id")));
        assert!(targets.contains(&("LexMachina/SupportIdentity", "challenge-signing-key")));
        assert_eq!(targets.len(), 6);
    }

    #[test]
    fn purge_policy_rejects_non_lex_paths() {
        assert!(path_is_app_scoped(Path::new(
            r"C:\Users\User\.lex-machina"
        )));
        assert!(path_is_app_scoped(Path::new(
            r"C:\Users\User\AppData\Local\LexMachina"
        )));
        assert!(path_is_app_scoped(Path::new(
            r"C:\Users\User\AppData\Local\pl.lexmachina.desktop"
        )));
        assert!(!path_is_app_scoped(Path::new(r"C:\Users\User\Documents")));
        assert!(!path_is_app_scoped(Path::new(r"C:\")));
    }
}
