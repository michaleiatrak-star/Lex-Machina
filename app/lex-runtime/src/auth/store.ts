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
  CaseRole,
  LocalUserStatus,
  StoredLocalUser,
  StoredRecoveryEnvelope
} from "./types.js";
import type {
  CaseListItem,
  StoredCaseAccess,
  StoredCaseRecord,
  StoredUserSharingKeys
} from "../case-access-types.js";

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

      CREATE TABLE IF NOT EXISTS user_crypto (
        user_id TEXT PRIMARY KEY
          REFERENCES users(user_id)
          ON DELETE CASCADE,
        algorithm TEXT NOT NULL
          CHECK (algorithm = 'X25519'),
        public_key_der BLOB NOT NULL,
        private_wrap_nonce BLOB NOT NULL,
        private_wrap_ciphertext BLOB NOT NULL,
        private_wrap_tag BLOB NOT NULL,
        key_version INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      ) STRICT;

      CREATE TABLE IF NOT EXISTS user_recovery (
        user_id TEXT PRIMARY KEY
          REFERENCES users(user_id)
          ON DELETE CASCADE,
        algorithm TEXT NOT NULL
          CHECK (algorithm = 'HKDF-SHA256-AES-256-GCM'),
        salt BLOB NOT NULL,
        nonce BLOB NOT NULL,
        ciphertext BLOB NOT NULL,
        tag BLOB NOT NULL,
        key_version INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      ) STRICT;

      CREATE TABLE IF NOT EXISTS cases (
        case_id TEXT PRIMARY KEY,
        created_by_user_id TEXT NOT NULL
          REFERENCES users(user_id),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        key_version INTEGER NOT NULL,
        display_name TEXT
      ) STRICT;

      CREATE TABLE IF NOT EXISTS case_access (
        case_id TEXT NOT NULL
          REFERENCES cases(case_id)
          ON DELETE CASCADE,
        user_id TEXT NOT NULL
          REFERENCES users(user_id)
          ON DELETE CASCADE,
        role TEXT NOT NULL
          CHECK (role IN (
            'OWNER',
            'EDITOR',
            'ANALYST',
            'VIEWER'
          )),
        can_reidentify INTEGER NOT NULL
          CHECK (can_reidentify IN (0,1)),
        envelope_algorithm TEXT NOT NULL
          CHECK (envelope_algorithm IN (
            'UMK-HKDF-SHA256-AES-256-GCM',
            'X25519-HKDF-SHA256-AES-256-GCM'
          )),
        envelope_ephemeral_public BLOB,
        envelope_nonce BLOB NOT NULL,
        envelope_ciphertext BLOB NOT NULL,
        envelope_tag BLOB NOT NULL,
        envelope_key_version INTEGER NOT NULL,
        granted_by_user_id TEXT NOT NULL
          REFERENCES users(user_id),
        granted_at TEXT NOT NULL,
        PRIMARY KEY(case_id, user_id)
      ) STRICT;

      CREATE INDEX IF NOT EXISTS
        idx_case_access_user
      ON case_access(user_id, case_id);

      INSERT OR IGNORE INTO auth_schema(version)
      VALUES (2);

      INSERT OR IGNORE INTO auth_schema(version)
      VALUES (3);
    `);

    const caseColumns =
      this.db.prepare(
        "PRAGMA table_info(cases)"
      ).all() as
        Record<string, unknown>[];
    if (
      !caseColumns.some(
        (column) =>
          column.name ===
            "archived_at"
      )
    ) {
      this.db.exec(
        "ALTER TABLE cases " +
        "ADD COLUMN archived_at TEXT"
      );
    }
    this.db.prepare(
      "INSERT OR IGNORE INTO auth_schema(version) VALUES (4)"
    ).run();
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

  createUser(
    user: StoredLocalUser
  ): void {
    this.insertUser(user);
  }

  listUsers():
    StoredLocalUser[] {
    const rows = this.db
      .prepare(
        "SELECT * FROM users ORDER BY created_at, user_id"
      )
      .all() as
      Record<string, unknown>[];
    return rows.map((row) =>
      this.mapUser(row)
    );
  }

  getUserCaseRelationCounts(
    userId: string
  ): {
    createdCases: number;
    accessRows: number;
    grantedRows: number;
  } {
    const row = this.db.prepare(`
      SELECT
        (
          SELECT COUNT(*)
          FROM cases
          WHERE created_by_user_id = ?
        ) AS created_cases,
        (
          SELECT COUNT(*)
          FROM case_access
          WHERE user_id = ?
        ) AS access_rows,
        (
          SELECT COUNT(*)
          FROM case_access
          WHERE granted_by_user_id = ?
        ) AS granted_rows
    `).get(
      userId,
      userId,
      userId
    ) as
      | Record<string, unknown>
      | undefined;

    return {
      createdCases: numberValue(
        row?.created_cases,
        "created_cases"
      ),
      accessRows: numberValue(
        row?.access_rows,
        "access_rows"
      ),
      grantedRows: numberValue(
        row?.granted_rows,
        "granted_rows"
      )
    };
  }

  deleteUser(
    userId: string
  ): boolean {
    const result =
      this.db.prepare(`
        DELETE FROM users
        WHERE user_id = ?
      `).run(userId);
    return Number(
      result.changes
    ) === 1;
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

  getRecoveryEnvelope(
    userId: string
  ): StoredRecoveryEnvelope | null {
    const row = this.db.prepare(`
      SELECT *
      FROM user_recovery
      WHERE user_id = ?
      LIMIT 1
    `).get(userId) as
      | Record<string, unknown>
      | undefined;
    if (!row) {
      return null;
    }
    return {
      userId:
        textValue(
          row.user_id,
          "user_id"
        ),
      algorithm:
        "HKDF-SHA256-AES-256-GCM",
      salt:
        bufferValue(
          row.salt,
          "salt"
        ),
      nonce:
        bufferValue(
          row.nonce,
          "nonce"
        ),
      ciphertext:
        bufferValue(
          row.ciphertext,
          "ciphertext"
        ),
      tag:
        bufferValue(
          row.tag,
          "tag"
        ),
      keyVersion:
        numberValue(
          row.key_version,
          "key_version"
        ),
      createdAt:
        textValue(
          row.created_at,
          "created_at"
        ),
      updatedAt:
        textValue(
          row.updated_at,
          "updated_at"
        )
    };
  }

  putRecoveryEnvelope(
    value: StoredRecoveryEnvelope
  ): void {
    this.db.prepare(`
      INSERT INTO user_recovery (
        user_id,
        algorithm,
        salt,
        nonce,
        ciphertext,
        tag,
        key_version,
        created_at,
        updated_at
      ) VALUES (
        ?,
        'HKDF-SHA256-AES-256-GCM',
        ?, ?, ?, ?, ?, ?, ?
      )
      ON CONFLICT(user_id)
      DO UPDATE SET
        algorithm = excluded.algorithm,
        salt = excluded.salt,
        nonce = excluded.nonce,
        ciphertext = excluded.ciphertext,
        tag = excluded.tag,
        key_version = excluded.key_version,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at
    `).run(
      value.userId,
      value.salt,
      value.nonce,
      value.ciphertext,
      value.tag,
      value.keyVersion,
      value.createdAt,
      value.updatedAt
    );
  }

  updatePasswordEnvelopeAndIncrementEpoch(
    args: {
      userId: string;
      updatedAt: string;
      kdf: AuthKdfPolicy;
      kdfSalt: Buffer;
      nonce: Buffer;
      ciphertext: Buffer;
      tag: Buffer;
      keyVersion: number;
    }
  ): number {
    this.db.exec(
      "BEGIN IMMEDIATE"
    );
    try {
      this.updatePasswordEnvelope(
        args
      );
      this.db.prepare(`
        UPDATE users
        SET auth_epoch =
              auth_epoch + 1,
            updated_at = ?
        WHERE user_id = ?
      `).run(
        args.updatedAt,
        args.userId
      );
      const row = this.db
        .prepare(`
          SELECT auth_epoch
          FROM users
          WHERE user_id = ?
        `)
        .get(
          args.userId
        ) as
          | {
              auth_epoch?:
                number | bigint;
            }
          | undefined;
      const epoch =
        numberValue(
          row?.auth_epoch,
          "auth_epoch"
        );
      this.db.exec("COMMIT");
      return epoch;
    } catch (error) {
      if (this.db.isTransaction) {
        this.db.exec(
          "ROLLBACK"
        );
      }
      throw error;
    }
  }

  recoverPasswordAndRotateRecovery(
    args: {
      password: {
        userId: string;
        updatedAt: string;
        kdf: AuthKdfPolicy;
        kdfSalt: Buffer;
        nonce: Buffer;
        ciphertext: Buffer;
        tag: Buffer;
        keyVersion: number;
      };
      recovery:
        StoredRecoveryEnvelope;
    }
  ): number {
    this.db.exec(
      "BEGIN IMMEDIATE"
    );
    try {
      this.updatePasswordEnvelope(
        args.password
      );
      this.putRecoveryEnvelope(
        args.recovery
      );
      this.db.prepare(`
        UPDATE users
        SET auth_epoch =
              auth_epoch + 1,
            updated_at = ?
        WHERE user_id = ?
      `).run(
        args.password.updatedAt,
        args.password.userId
      );
      const row = this.db
        .prepare(`
          SELECT auth_epoch
          FROM users
          WHERE user_id = ?
        `)
        .get(
          args.password.userId
        ) as
          | {
              auth_epoch?:
                number | bigint;
            }
          | undefined;
      const epoch =
        numberValue(
          row?.auth_epoch,
          "auth_epoch"
        );
      this.db.exec("COMMIT");
      return epoch;
    } catch (error) {
      if (this.db.isTransaction) {
        this.db.exec(
          "ROLLBACK"
        );
      }
      throw error;
    }
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

  getUserSharingKeys(
    userId: string
  ): StoredUserSharingKeys | null {
    const row = this.db.prepare(`
      SELECT *
      FROM user_crypto
      WHERE user_id = ?
      LIMIT 1
    `).get(userId) as
      | Record<string, unknown>
      | undefined;
    if (!row) return null;
    return {
      userId,
      algorithm: "X25519",
      publicKeyDer:
        bufferValue(
          row.public_key_der,
          "public_key_der"
        ),
      privateKeyWrapNonce:
        bufferValue(
          row.private_wrap_nonce,
          "private_wrap_nonce"
        ),
      privateKeyWrapCiphertext:
        bufferValue(
          row.private_wrap_ciphertext,
          "private_wrap_ciphertext"
        ),
      privateKeyWrapTag:
        bufferValue(
          row.private_wrap_tag,
          "private_wrap_tag"
        ),
      keyVersion:
        numberValue(
          row.key_version,
          "key_version"
        ),
      createdAt:
        textValue(
          row.created_at,
          "created_at"
        ),
      updatedAt:
        textValue(
          row.updated_at,
          "updated_at"
        )
    };
  }

  putUserSharingKeys(
    value: StoredUserSharingKeys
  ): void {
    this.db.prepare(`
      INSERT INTO user_crypto (
        user_id,
        algorithm,
        public_key_der,
        private_wrap_nonce,
        private_wrap_ciphertext,
        private_wrap_tag,
        key_version,
        created_at,
        updated_at
      ) VALUES (
        ?, 'X25519', ?, ?, ?, ?, ?, ?, ?
      )
      ON CONFLICT(user_id)
      DO UPDATE SET
        algorithm = excluded.algorithm,
        public_key_der =
          excluded.public_key_der,
        private_wrap_nonce =
          excluded.private_wrap_nonce,
        private_wrap_ciphertext =
          excluded.private_wrap_ciphertext,
        private_wrap_tag =
          excluded.private_wrap_tag,
        key_version =
          excluded.key_version,
        updated_at =
          excluded.updated_at
    `).run(
      value.userId,
      value.publicKeyDer,
      value.privateKeyWrapNonce,
      value.privateKeyWrapCiphertext,
      value.privateKeyWrapTag,
      value.keyVersion,
      value.createdAt,
      value.updatedAt
    );
  }

  createCaseWithOwner(args: {
    caseRecord: StoredCaseRecord;
    ownerAccess: StoredCaseAccess;
  }): void {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db.prepare(`
        INSERT INTO cases (
          case_id,
          created_by_user_id,
          created_at,
          updated_at,
          key_version,
          display_name
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        args.caseRecord.caseId,
        args.caseRecord.createdByUserId,
        args.caseRecord.createdAt,
        args.caseRecord.updatedAt,
        args.caseRecord.keyVersion,
        args.caseRecord.displayName ?? null
      );
      this.insertCaseAccess(
        args.ownerAccess
      );
      this.db.exec("COMMIT");
    } catch (error) {
      if (this.db.isTransaction) {
        this.db.exec("ROLLBACK");
      }
      throw error;
    }
  }

  updateCaseDisplayName(
    caseId: string,
    displayName: string | null,
    updatedAt: string
  ): void {
    const result =
      this.db.prepare(`
        UPDATE cases
        SET display_name = ?,
            updated_at = ?
        WHERE case_id = ?
      `).run(
        displayName,
        updatedAt,
        caseId
      );
    if (result.changes !== 1) {
      throw new Error(
        "CASE_RECORD_NOT_FOUND"
      );
    }
  }

  setCaseArchivedAt(
    caseId: string,
    archivedAt: string | null,
    updatedAt: string
  ): void {
    const result =
      this.db.prepare(`
        UPDATE cases
        SET archived_at = ?,
            updated_at = ?
        WHERE case_id = ?
      `).run(
        archivedAt,
        updatedAt,
        caseId
      );
    if (result.changes !== 1) {
      throw new Error(
        "CASE_RECORD_NOT_FOUND"
      );
    }
  }

  deleteCaseRegistration(
    caseId: string
  ): void {
    this.db.prepare(
      "DELETE FROM cases WHERE case_id = ?"
    ).run(caseId);
  }

  getCase(
    caseId: string
  ): StoredCaseRecord | null {
    const row = this.db.prepare(`
      SELECT *
      FROM cases
      WHERE case_id = ?
      LIMIT 1
    `).get(caseId) as
      | Record<string, unknown>
      | undefined;
    return row
      ? this.mapCase(row)
      : null;
  }

  listCasesForUser(
    userId: string
  ): CaseListItem[] {
    const rows = this.db.prepare(`
      SELECT
        c.*,
        a.role,
        a.can_reidentify
      FROM cases c
      JOIN case_access a
        ON a.case_id = c.case_id
      WHERE a.user_id = ?
      ORDER BY c.updated_at DESC,
               c.case_id
    `).all(userId) as
      Record<string, unknown>[];
    return rows.map((row) => ({
      ...this.mapCase(row),
      role:
        textValue(
          row.role,
          "role"
        ) as CaseRole,
      canReidentify:
        numberValue(
          row.can_reidentify,
          "can_reidentify"
        ) === 1
    }));
  }

  getCaseAccess(
    caseId: string,
    userId: string
  ): StoredCaseAccess | null {
    const row = this.db.prepare(`
      SELECT *
      FROM case_access
      WHERE case_id = ?
        AND user_id = ?
      LIMIT 1
    `).get(
      caseId,
      userId
    ) as
      | Record<string, unknown>
      | undefined;
    return row
      ? this.mapCaseAccess(row)
      : null;
  }

  listCaseAccess(
    caseId: string
  ): StoredCaseAccess[] {
    const rows = this.db.prepare(`
      SELECT *
      FROM case_access
      WHERE case_id = ?
      ORDER BY granted_at, user_id
    `).all(caseId) as
      Record<string, unknown>[];
    return rows.map((row) =>
      this.mapCaseAccess(row)
    );
  }

  upsertCaseAccess(
    access: StoredCaseAccess
  ): void {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db.prepare(`
        DELETE FROM case_access
        WHERE case_id = ?
          AND user_id = ?
      `).run(
        access.caseId,
        access.userId
      );
      this.insertCaseAccess(access);
      this.db.prepare(`
        UPDATE cases
        SET updated_at = ?
        WHERE case_id = ?
      `).run(
        access.grantedAt,
        access.caseId
      );
      this.db.exec("COMMIT");
    } catch (error) {
      if (this.db.isTransaction) {
        this.db.exec("ROLLBACK");
      }
      throw error;
    }
  }

  revokeAccessAndRotate(args: {
    caseId: string;
    revokedUserId: string;
    newKeyVersion: number;
    updatedAt: string;
    remaining:
      StoredCaseAccess[];
  }): void {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db.prepare(`
        DELETE FROM case_access
        WHERE case_id = ?
          AND user_id = ?
      `).run(
        args.caseId,
        args.revokedUserId
      );
      this.db.prepare(`
        DELETE FROM case_access
        WHERE case_id = ?
      `).run(args.caseId);
      for (
        const access
        of args.remaining
      ) {
        this.insertCaseAccess(
          access
        );
      }
      this.db.prepare(`
        UPDATE cases
        SET key_version = ?,
            updated_at = ?
        WHERE case_id = ?
      `).run(
        args.newKeyVersion,
        args.updatedAt,
        args.caseId
      );
      this.db.exec("COMMIT");
    } catch (error) {
      if (this.db.isTransaction) {
        this.db.exec("ROLLBACK");
      }
      throw error;
    }
  }

  private insertCaseAccess(
    access: StoredCaseAccess
  ): void {
    this.db.prepare(`
      INSERT INTO case_access (
        case_id,
        user_id,
        role,
        can_reidentify,
        envelope_algorithm,
        envelope_ephemeral_public,
        envelope_nonce,
        envelope_ciphertext,
        envelope_tag,
        envelope_key_version,
        granted_by_user_id,
        granted_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `).run(
      access.caseId,
      access.userId,
      access.role,
      access.canReidentify ? 1 : 0,
      access.envelope.algorithm,
      access.envelope
        .ephemeralPublicKeyDer ?? null,
      access.envelope.nonce,
      access.envelope.ciphertext,
      access.envelope.tag,
      access.envelope.keyVersion,
      access.grantedByUserId,
      access.grantedAt
    );
  }

  private mapCase(
    row: Record<string, unknown>
  ): StoredCaseRecord {
    const displayName =
      optionalText(
        row.display_name
      );
    const archivedAt =
      optionalText(
        row.archived_at
      );
    return {
      caseId:
        textValue(
          row.case_id,
          "case_id"
        ),
      createdByUserId:
        textValue(
          row.created_by_user_id,
          "created_by_user_id"
        ),
      createdAt:
        textValue(
          row.created_at,
          "created_at"
        ),
      updatedAt:
        textValue(
          row.updated_at,
          "updated_at"
        ),
      keyVersion:
        numberValue(
          row.key_version,
          "key_version"
        ),
      ...(displayName
        ? { displayName }
        : {}),
      ...(archivedAt
        ? { archivedAt }
        : {})
    };
  }

  private mapCaseAccess(
    row: Record<string, unknown>
  ): StoredCaseAccess {
    const ephemeral =
      row.envelope_ephemeral_public ==
        null
        ? undefined
        : bufferValue(
            row.envelope_ephemeral_public,
            "envelope_ephemeral_public"
          );
    return {
      caseId:
        textValue(
          row.case_id,
          "case_id"
        ),
      userId:
        textValue(
          row.user_id,
          "user_id"
        ),
      role:
        textValue(
          row.role,
          "role"
        ) as CaseRole,
      canReidentify:
        numberValue(
          row.can_reidentify,
          "can_reidentify"
        ) === 1,
      envelope: {
        algorithm:
          textValue(
            row.envelope_algorithm,
            "envelope_algorithm"
          ) as StoredCaseAccess[
            "envelope"
          ]["algorithm"],
        ...(ephemeral
          ? {
              ephemeralPublicKeyDer:
                ephemeral
            }
          : {}),
        nonce:
          bufferValue(
            row.envelope_nonce,
            "envelope_nonce"
          ),
        ciphertext:
          bufferValue(
            row.envelope_ciphertext,
            "envelope_ciphertext"
          ),
        tag:
          bufferValue(
            row.envelope_tag,
            "envelope_tag"
          ),
        keyVersion:
          numberValue(
            row.envelope_key_version,
            "envelope_key_version"
          )
      },
      grantedByUserId:
        textValue(
          row.granted_by_user_id,
          "granted_by_user_id"
        ),
      grantedAt:
        textValue(
          row.granted_at,
          "granted_at"
        )
    };
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
