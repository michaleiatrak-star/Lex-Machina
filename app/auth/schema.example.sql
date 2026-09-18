-- G34 design schema example.
-- NOT a migration. Exact SQLite/Rust implementation remains to be selected.

CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  login_name TEXT NOT NULL,
  normalized_login_name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  app_role TEXT NOT NULL CHECK (app_role IN ('ADMIN','USER')),
  status TEXT NOT NULL CHECK (status IN ('ACTIVE','DISABLED')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_login_at TEXT,

  kdf_algorithm TEXT NOT NULL CHECK (kdf_algorithm = 'ARGON2ID'),
  kdf_salt BLOB NOT NULL,
  kdf_memory_kib INTEGER NOT NULL,
  kdf_iterations INTEGER NOT NULL,
  kdf_parallelism INTEGER NOT NULL,
  kdf_version INTEGER NOT NULL,

  umk_wrap_algorithm TEXT NOT NULL CHECK (umk_wrap_algorithm = 'AES-256-GCM'),
  umk_wrap_nonce BLOB NOT NULL,
  umk_wrap_ciphertext BLOB NOT NULL,
  umk_wrap_tag BLOB NOT NULL,
  umk_key_version INTEGER NOT NULL,

  public_key_algorithm TEXT,
  public_key BLOB,

  failed_attempts INTEGER NOT NULL DEFAULT 0,
  retry_after TEXT
);

CREATE TABLE user_recovery (
  user_id TEXT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  recovery_kdf_salt BLOB NOT NULL,
  recovery_nonce BLOB NOT NULL,
  recovery_ciphertext BLOB NOT NULL,
  recovery_tag BLOB NOT NULL,
  created_at TEXT NOT NULL,
  used_at TEXT
);

CREATE TABLE cases (
  case_id TEXT PRIMARY KEY,
  created_by_user_id TEXT NOT NULL REFERENCES users(user_id),
  created_at TEXT NOT NULL,
  key_version INTEGER NOT NULL,
  display_name TEXT
);

CREATE TABLE case_access (
  case_id TEXT NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('OWNER','EDITOR','ANALYST','VIEWER')),
  can_reidentify INTEGER NOT NULL CHECK (can_reidentify IN (0,1)),
  envelope_algorithm TEXT NOT NULL,
  envelope BLOB NOT NULL,
  envelope_key_version INTEGER NOT NULL,
  granted_by_user_id TEXT NOT NULL REFERENCES users(user_id),
  granted_at TEXT NOT NULL,
  PRIMARY KEY(case_id,user_id)
);

CREATE TABLE auth_failures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  normalized_login_name TEXT NOT NULL,
  occurred_at TEXT NOT NULL
);

CREATE TABLE security_events (
  event_id TEXT PRIMARY KEY,
  user_id TEXT,
  case_id TEXT,
  event_type TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  result TEXT NOT NULL,
  metadata_json TEXT NOT NULL
);

-- Session secrets/UMKs/CDKs are intentionally NOT persisted here.


-- Normative G34B throttling uses an HMAC tag of normalized login, not plaintext
-- guessed usernames. AuthRateKey is protected outside this database.
CREATE TABLE auth_rate_limits (
  login_tag BLOB PRIMARY KEY,
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  last_failure_at TEXT,
  retry_after TEXT
);

-- Persistent authenticated sessions are intentionally forbidden.
-- Live session / UMK / CDK / reauthorization grant state stays in trusted process memory.
-- Session lifecycle and transaction grants are specified in
-- app/reports/G34-AUTH-SESSION-REAUTH-PROTOCOL.md.
