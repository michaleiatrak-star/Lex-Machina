# Lex Machina Windows installer build policy

This is the mandatory installer-generation contract.

- Development and installer repair stay outside `main`.
- Online and offline builds use the same `install-private-python.ps1` helper.
- Private Python is the SHA-256-pinned CPython `amd64.zip`, extracted app-locally to `runtime\python`. Builds must not install or depend on system Python and must not use `TargetDir=`.
- Every build verifies the exact private Python version and `pip` before installing pinned packages.
- Acceptance installs into a path containing spaces and validates the installed-copy private runtime against the manifest.
- The app EXE, NSIS installer and uninstaller use only `src-tauri/icons/lex-machina-brand-source.png`. The source hash is pinned and `materialize-brand-icon.ps1` deterministically generates the multisize `icon.ico`.
- Publication requires PASS for Lex Runtime Validation, F-138 structural audit, G39 Installer State Machine and Lex Windows Online Installer on the exact same source SHA.
- Failed, cancelled, stale or different-SHA runs are not release evidence.
