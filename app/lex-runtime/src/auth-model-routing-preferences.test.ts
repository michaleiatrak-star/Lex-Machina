import {
  randomBytes
} from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  afterEach,
  describe,
  expect,
  it
} from "vitest";
import {
  LocalAuthStore
} from "./auth/store.js";
import type {
  StoredLocalUser
} from "./auth/types.js";

const roots: string[] = [];

function user(
  userId: string
): StoredLocalUser {
  const now =
    "2026-09-18T08:00:00.000Z";
  return {
    userId,
    loginName:
      "routing-test",
    normalizedLoginName:
      "routing-test",
    displayName:
      "Routing Test",
    appRole: "ADMIN",
    status: "ACTIVE",
    passwordSetupPending: false,
    createdAt: now,
    updatedAt: now,
    authEpoch: 1,
    kdf: {
      algorithm:
        "ARGON2ID",
      memoryKiB:
        64 * 1024,
      iterations: 3,
      parallelism: 1,
      keyLength: 32,
      version: 1
    },
    kdfSalt:
      randomBytes(16),
    umkWrapNonce:
      randomBytes(12),
    umkWrapCiphertext:
      randomBytes(32),
    umkWrapTag:
      randomBytes(16),
    umkKeyVersion: 1
  };
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, {
      recursive: true,
      force: true
    });
  }
});

describe(
  "per-user auxiliary model routing preference",
  () => {
    it(
      "persists, updates and cascades with the local user",
      () => {
        const root =
          fs.mkdtempSync(
            path.join(
              os.tmpdir(),
              "lex-model-routing-"
            )
          );
        roots.push(root);
        const store =
          new LocalAuthStore({
            rootDir: root
          });
        try {
          const account =
            user(
              "user_" +
                "a".repeat(32)
            );
          expect(
            store.createFirstUser(
              account
            )
          ).toBe(true);
          expect(
            store
              .getModelRoutingPreferences(
                account.userId
              )
          ).toBeNull();

          store
            .setModelRoutingPreferences(
              account.userId,
              {
                auxiliaryEnabled:
                  true,
                auxiliaryProvider:
                  "openai",
                auxiliaryModel:
                  "local/bielik-11b-v3-q4km",
                updatedAt:
                  "2026-09-18T08:01:00.000Z"
              }
            );

          expect(
            store
              .getModelRoutingPreferences(
                account.userId
              )
          ).toEqual({
            auxiliaryEnabled:
              true,
            auxiliaryProvider:
              "openai",
            auxiliaryModel:
              "local/bielik-11b-v3-q4km",
            updatedAt:
              "2026-09-18T08:01:00.000Z"
          });

          store
            .setModelRoutingPreferences(
              account.userId,
              {
                auxiliaryEnabled:
                  false,
                auxiliaryProvider:
                  "anthropic",
                auxiliaryModel:
                  "claude-helper-test",
                updatedAt:
                  "2026-09-18T08:02:00.000Z"
              }
            );

          expect(
            store
              .getModelRoutingPreferences(
                account.userId
              )
          ).toMatchObject({
            auxiliaryEnabled:
              false,
            auxiliaryProvider:
              "anthropic",
            auxiliaryModel:
              "claude-helper-test"
          });

          expect(
            store.deleteUser(
              account.userId
            )
          ).toBe(true);
          expect(
            store
              .getModelRoutingPreferences(
                account.userId
              )
          ).toBeNull();
        } finally {
          store.close();
        }
      }
    );
  }
);
