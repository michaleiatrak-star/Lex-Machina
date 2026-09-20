# Windows user data and account lifecycle

This file documents the canonical Windows behavior enforced by
`windows-installer-defaults.json` and the installer self-test.

## Local account location

Unless `LEX_DATA_DIR` is explicitly set for a development/runtime scenario,
the desktop runtime resolves the current Windows user's home directory and
stores application data under:

`%USERPROFILE%\.lex-machina\data`

The local authentication database is:

`%USERPROFILE%\.lex-machina\data\auth\auth.sqlite`

The authentication rate-limit secret is stored beside it as:

`%USERPROFILE%\.lex-machina\data\auth\rate-limit.key`

Case data, encrypted documents and workspace state are stored below:

`%USERPROFILE%\.lex-machina\data\cases`

Authentication session tokens and unlocked session key material are not
persisted in this directory; they remain process-memory state.

## Install / reinstall policy

If the installer detects the existing authentication database, interactive
installation asks whether to preserve the existing account and local data or
reset the complete local user-data root. Preserve is the default and is also
the silent-install default.

A confirmed reset removes `%USERPROFILE%\.lex-machina\data`. On the first
runtime start after that reset, the existing application bootstrap creates the
temporary default administrator account `admin` / `admin`. The application
permits normal use while that temporary credential remains active, but displays
a persistent security warning and recommends an immediate password change. The
warning disappears only after a successful password rotation is committed.

If no account exists, the same bootstrap path is used automatically on first
runtime start. The default account remains usable until the user changes its
password; the application does not silently replace or reset that credential.

## Uninstall policy

Interactive uninstall asks whether to delete the local account and user data.
The destructive choice removes `%USERPROFILE%\.lex-machina\data`, including
accounts, cases, documents, settings and account-bound key material.

Preserve is the default, including silent uninstall, so unattended uninstall
never destroys user data.

Local AI model files and the verified bootstrap download cache are outside the
account-data deletion policy and remain available for reuse unless a separate
cleanup policy is introduced explicitly.

## Frozen installer mechanics

After the current branding/account-lifecycle work is accepted, installer
mechanics are treated as frozen defaults. Normal program development may update
application payload files, dependency versions, URLs and their pinned SHA-256
values without changing these lifecycle rules.
