import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import {
  createHmac,
  randomBytes
} from "node:crypto";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type {
  AppRole,
  AuthKdfPolicy,
  LocalUserStatus,
  StoredLocalUser
} from "./types.js";

export type AuthRateLimitRecord = {
  consecutiveFailures: number;
  lastFailureAt?: string;
  retryAfter?: string;
};

export type LocalAuthStoreOptions = {
  rootDir?: string;
  dbPath?: string;
  rateKeyPath?: string;
};

function defaultRootDir(): string {
  return path.resolve(
    process.env.LEX_DATA_DIR ??
      path.join(
        os.homedir(),
        ".lex-machina",
        "data"
      )
  );
}

function bufferValue(
  value: unknown,
  field: string
): Buffer {
  if (
    value instanceof Uint8Array ||
    Buffer.isBuffer(value)
  ) {
    return Buffer.from(value);
  }
  throw new Error(
    `AUTH_DB_INVALID_BLOB:${field}`
  );
}

function textValue(
  value: unknown,
  field: string
): string {
  if (typeof value === "string") {
    return value;
  }
  throw new Error(
    `AUTH_DB_INVALID_TEXT:${field}`
  );
}

function numberValue(
  value: unknown,
  field: string
): number {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }
  if (typeof value === "bigint") {
    const result = Number(value);
    if (Number.isSafeInteger(result)) {
      return result;
    }
  }
  throw new Error(
    `AUTH_DB_INVALID_NUMBER:${field}`
  );
}

function optionalText(
  value: unknown
): string | undefined {
  return typeof value === "string"
    ? value
    : undefined;
}

export class LocalAuthStore {
  readonly rootDir: string;
  readonly authDir: string;
  readonly dbPath: string;
  readonly rateKeyPath: string;
  private readonly db: DatabaseSync;
  private readonly rateKey: Buffer;

  constructor(
    options: LocalAuthStoreOptions = {}
  ) {
    this.rootDir = path.resolve(
      options.rootDir ?? defaultRootDir()
    );
    this.authDir = path.join(
      this.rootDir,
      "auth"
    );
    mkdirSync(this.authDir, {
      recursive: true,
      mode: 0o700
    });

    this.dbPath = path.resolve(
      options.dbPath ??
        path.join(
          this.authDir,
          "auth.sqlite"
        )
    );
    this.rateKeyPath = path.resolve(
      options.rateKeyPath ??
        path.join(
          this.authDir,
          "rate-limit.key"
        )
    );

    this.rateKey =
      this.loadOrCreateRateKey();

    this.db = new DatabaseSync(
      this.dbPath,
      { timeout: 5_000 }
    );
    try {
      chmodSync(this.dbPath, 0o600);
    } catch {
      // Best effort on platforms without POSIX modes.
    }

    this.db.exec(
      "PRAGMA foreign_keys = ON;" +
      "PRAGMA journal_mode = WAL;" +
      "PRAGMA synchronous = FULL;"
    );
    this.migrate();
  }

  private loadOrCreateRateKey(): Buffer {
    if (existsSync(this.rateKeyPath)) {
      const existing =
        readFileSync(this.rateKeyPath);
      if (existing.byteLength !== 32) {
        throw new Error(
          "AUTH_RATE_KEY_INVALID"
        );
      }
      return Buffer.from(existing);
    }

    const key = randomBytes(32);
    writeFileSync(
      this.rateKeyPath,
      key,
      {
        flag: "wx",
        mode: 0o600
      }
    );
    return key;
  }

  private migrate(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS auth_schema (
        version INTEGER PRIMARY KEY
      ) STRICT;

      INSERT OR IGNORE INTO auth_schema(version)
      VALUES (1);

      CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        login_name TEXT NOT NULL,
        normalized_login_name TEXT NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        app_role TEXT NOT NULL
          CHECK (app_role IN ('ADMIN','USER')),
        status TEXT NOT NULL
          CHECK (status IN ('ACTIVE','DISABLED')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        last_login_at TEXT,
        auth_epoch INTEGER NOT NULL,

        kdf_algorithm TEXT NOT NULL
          CHECK (kdf_algorithm = 'ARGON2ID'),
        kdf_memory_kib INTEGER NOT NULL,
        kdf_iterations INTEGER NOT NULL,
        kdf_parallelism INTEGER NOT NULL,
        kdf_key_length INTEGER NOT NULL,
        kdf_version INTEGER NOT NULL,
        kdf_salt BLOB NOT NULL,

        umk_wrap_algorithm TEXT NOT NULL
          CHECK (umk_wrap_algorithm = 'AES-256-GCM'),
        umk_wrap_nonce BLOB NOT NULL,
        umk_wrap_ciphertext BLOB NOT NULL,
        umk_wrap_tag BLOB NOT NULL,
        umk_key_version INTEGER NOT NULL
      ) STRICT;

      CREATE TABLE IF NOT EXISTS auth_rate_limits (
        login_tag BLOB PRIMARY KEY,
        consecutive_failures INTEGER NOT NULL,
        last_failure_at TEXT,
        retry_after TEXT
      ) STRICT;

      CREATE TABLE IF NOT EXISTS security_events (
        event_id TEXT PRIMARY KEY,
        user_id TEXT,
        event_type TEXT NOT NULL,
        occurred_at TEXT NOT NULL,
        result TEXT NOT NULL,
        metadata_json TEXT NOT NULL
      ) STRICT;
    `);
  }

  close(): void {
    if (this.db.isOpen) {
      this.db.close();
    }
    this.rateKey.fill(0);
  }

  countUsers(): number {
    const row = this.db
      .prepare(
        "SELECT COUNT(*) AS count FROM users"
      )
      .get() as
      | { count?: number | bigint }
      | undefined;
    return numberValue(
      row?.count,
      "count"
    );
  }

  createFirstUser(
    user: StoredLocalUser
  ): boolean {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      if (this.countUsers() !== 0) {
        this.db.exec("ROLLBACK");
        return false;
      }
      this.insertUser(user);
      this.db.exec("COMMIT");
      return true;
    } catch (error) {
      if (this.db.isTransaction) {
        this.db.exec("ROLLBACK");
      }
      throw error;
    }
  }

  private insertUser(
    user: StoredLocalUser
  ): void {
    this.db.prepare(`
      INSERT INTO users (
        user_id,
        login_name,
        normalized_login_name,
        display_name,
        app_role,
        status,
        created_at,
        updated_at,
        last_login_at,
        auth_epoch,
        kdf_algorithm,
        kdf_memory_kib,
        kdf_iterations,
        kdf_parallelism,
        kdf_key_length,
        kdf_version,
        kdf_salt,
        umk_wrap_algorithm,
        umk_wrap_nonce,
        umk_wrap_ciphertext,
        umk_wrap_tag,
        umk_key_version
      ) VALUES (
        ?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,
        ?,?,?,?,?
      )
    `).run(
      user.userId,
      user.loginName,
      user.normalizedLoginName,
      user.displayName,
      user.appRole,
      user.status,
      user.createdAt,
      user.updatedAt,
      user.lastLoginAt ?? null,
      user.authEpoch,
      user.kdf.algorithm,
      user.kdf.memoryKiB,
      user.kdf.iterations,
      user.kdf.parallelism,
      user.kdf.keyLength,
      user.kdf.version,
      user.kdfSalt,
      "AES-256-GCM",
      user.umkWrapNonce,
      user.umkWrapCiphertext,
      user.umkWrapTag,
      user.umkKeyVersion
    );
  }

  getUserByNormalizedLogin(
    normalizedLoginName: string
  ): StoredLocalUser | null {
    const row = this.db.prepare(`
      SELECT *
      FROM users
      WHERE normalized_login_name = ?
      LIMIT 1
    `).get(normalizedLoginName) as
      | Record<string, unknown>
      | undefined;
    return row
      ? this.mapUser(row)
      : null;
  }

  getUserById(
    userId: string
  ): StoredLocalUser | null {
    const row = this.db.prepare(`
      SELECT *
      FROM users
      WHERE user_id = ?
      LIMIT 1
    `).get(userId) as
      | Record<string, unknown>
      | undefined;
    return row
      ? this.mapUser(row)
      : null;
  }

  private mapUser(
    row: Record<string, unknown>
  ): StoredLocalUser {
    const role =
      textValue(
        row.app_role,
        "app_role"
      ) as AppRole;
    const status =
      textValue(
        row.status,
        "status"
      ) as LocalUserStatus;
    const kdf: AuthKdfPolicy = {
      algorithm: "ARGON2ID",
      memoryKiB: numberValue(
        row.kdf_memory_kib,
        "kdf_memory_kib"
      ),
      iterations: numberValue(
        row.kdf_iterations,
        "kdf_iterations"
      ),
      parallelism: numberValue(
        row.kdf_parallelism,
        "kdf_parallelism"
      ),
      keyLength: numberValue(
        row.kdf_key_length,
        "kdf_key_length"
      ),
      version: numberValue(
        row.kdf_version,
        "kdf_version"
      )
    };
    return {
      userId: textValue(
        row.user_id,
        "user_id"
      ),
      loginName: textValue(
        row.login_name,
        "login_name"
      ),
      normalizedLoginName:
        textValue(
          row.normalized_login_name,
          "normalized_login_name"
        ),
      displayName: textValue(
        row.display_name,
        "display_name"
      ),
      appRole: role,
      status,
      createdAt: textValue(
        row.created_at,
        "created_at"
      ),
      updatedAt: textValue(
        row.updated_at,
        "updated_at"
      ),
      ...(optionalText(row.last_login_at)
        ? {
            lastLoginAt:
              optionalText(
                row.last_login_at
              )!
          }
        : {}),
      authEpoch: numberValue(
        row.auth_epoch,
        "auth_epoch"
      ),
      kdf,
      kdfSalt: bufferValue(
        row.kdf_salt,
        "kdf_salt"
      ),
      umkWrapNonce: bufferValue(
        row.umk_wrap_nonce,
        "umk_wrap_nonce"
      ),
      umkWrapCiphertext: bufferValue(
        row.umk_wrap_ciphertext,
        "umk_wrap_ciphertext"
      ),
      umkWrapTag: bufferValue(
        row.umk_wrap_tag,
        "umk_wrap_tag"
      ),
      umkKeyVersion: numberValue(
        row.umk_key_version,
        "umk_key_version"
      )
    };
  }

  updateLastLogin(
    userId: string,
    at: string
  ): void {
    this.db.prepare(`
      UPDATE users
      SET last_login_at = ?,
          updated_at = ?
      WHERE user_id = ?
    `).run(at, at, userId);
  }

  updatePasswordEnvelope(args: {
    userId: string;
    updatedAt: string;
    kdf: AuthKdfPolicy;
    kdfSalt: Buffer;
    nonce: Buffer;
    ciphertext: Buffer;
    tag: Buffer;
    keyVersion: number;
  }): void {
    this.db.prepare(`
      UPDATE users
      SET updated_at = ?,
          kdf_algorithm = 'ARGON2ID',
          kdf_memory_kib = ?,
          kdf_iterations = ?,
          kdf_parallelism = ?,
          kdf_key_length = ?,
          kdf_version = ?,
          kdf_salt = ?,
          umk_wrap_algorithm = 'AES-256-GCM',
          umk_wrap_nonce = ?,
          umk_wrap_ciphertext = ?,
          umk_wrap_tag = ?,
          umk_key_version = ?
      WHERE user_id = ?
    `).run(
      args.updatedAt,
      args.kdf.memoryKiB,
      args.kdf.iterations,
      args.kdf.parallelism,
      args.kdf.keyLength,
      args.kdf.version,
      args.kdfSalt,
      args.nonce,
      args.ciphertext,
      args.tag,
      args.keyVersion,
      args.userId
    );
  }

  setUserStatusAndIncrementEpoch(
    userId: string,
    status: LocalUserStatus,
    updatedAt: string
  ): void {
    this.db.prepare(`
      UPDATE users
      SET status = ?,
          auth_epoch = auth_epoch + 1,
          updated_at = ?
      WHERE user_id = ?
    `).run(
      status,
      updatedAt,
      userId
    );
  }

  loginTag(
    normalizedLoginName: string
  ): Buffer {
    return createHmac(
      "sha256",
      this.rateKey
    )
      .update(
        normalizedLoginName,
        "utf8"
      )
      .digest();
  }

  getRateLimit(
    loginTag: Buffer
  ): AuthRateLimitRecord | null {
    const row = this.db.prepare(`
      SELECT
        consecutive_failures,
        last_failure_at,
        retry_after
      FROM auth_rate_limits
      WHERE login_tag = ?
    `).get(loginTag) as
      | Record<string, unknown>
      | undefined;
    if (!row) return null;
    return {
      consecutiveFailures:
        numberValue(
          row.consecutive_failures,
          "consecutive_failures"
        ),
      ...(optionalText(
        row.last_failure_at
      )
        ? {
            lastFailureAt:
              optionalText(
                row.last_failure_at
              )!
          }
        : {}),
      ...(optionalText(row.retry_after)
        ? {
            retryAfter:
              optionalText(
                row.retry_after
              )!
          }
        : {})
    };
  }

  setRateLimit(
    loginTag: Buffer,
    record: AuthRateLimitRecord
  ): void {
    this.db.prepare(`
      INSERT INTO auth_rate_limits (
        login_tag,
        consecutive_failures,
        last_failure_at,
        retry_after
      ) VALUES (?, ?, ?, ?)
      ON CONFLICT(login_tag)
      DO UPDATE SET
        consecutive_failures =
          excluded.consecutive_failures,
        last_failure_at =
          excluded.last_failure_at,
        retry_after =
          excluded.retry_after
    `).run(
      loginTag,
      record.consecutiveFailures,
      record.lastFailureAt ?? null,
      record.retryAfter ?? null
    );
  }

  clearRateLimit(
    loginTag: Buffer
  ): void {
    this.db.prepare(`
      DELETE FROM auth_rate_limits
      WHERE login_tag = ?
    `).run(loginTag);
  }

  recordSecurityEvent(args: {
    eventId: string;
    userId?: string;
    eventType: string;
    occurredAt: string;
    result: string;
    metadata?: Record<string, unknown>;
  }): void {
    this.db.prepare(`
      INSERT INTO security_events (
        event_id,
        user_id,
        event_type,
        occurred_at,
        result,
        metadata_json
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      args.eventId,
      args.userId ?? null,
      args.eventType,
      args.occurredAt,
      args.result,
      JSON.stringify(
        args.metadata ?? {}
      )
    );
  }
}
