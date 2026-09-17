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
  trustedUpdateSignerThumbprints
} from "./application-update-verifier.js";

const roots: string[] = [];

function manifest(
  applicationUpdate: unknown
): string {
  const root = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "lex-app-update-trust-"
    )
  );
  roots.push(root);
  const target =
    path.join(
      root,
      "release-source.json"
    );
  fs.writeFileSync(
    target,
    JSON.stringify({
      applicationUpdate
    }),
    "utf8"
  );
  return target;
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
  "application update signer policy",
  () => {
    it(
      "normalizes and deduplicates trusted SHA-1 certificate thumbprints",
      () => {
        const path =
          manifest({
            verification:
              "SHA256_AND_AUTHENTICODE_PINNED_PUBLISHER",
            trustedSignerThumbprints: [
              "aa bb cc dd ee ff 00 11 22 33 44 55 66 77 88 99 aa bb cc dd",
              "AABBCCDDEEFF00112233445566778899AABBCCDD"
            ]
          });

        expect(
          trustedUpdateSignerThumbprints(
            path
          )
        ).toEqual([
          "AABBCCDDEEFF00112233445566778899AABBCCDD"
        ]);
      }
    );

    it(
      "fails closed when no production signer is configured",
      () => {
        const path =
          manifest({
            verification:
              "SHA256_AND_AUTHENTICODE_PINNED_PUBLISHER",
            trustedSignerThumbprints: []
          });

        expect(() =>
          trustedUpdateSignerThumbprints(
            path
          )
        ).toThrow(
          "APPLICATION_UPDATE_SIGNER_POLICY_MISSING"
        );
      }
    );

    it(
      "rejects malformed thumbprints",
      () => {
        const path =
          manifest({
            verification:
              "SHA256_AND_AUTHENTICODE_PINNED_PUBLISHER",
            trustedSignerThumbprints: [
              "not-a-thumbprint"
            ]
          });

        expect(() =>
          trustedUpdateSignerThumbprints(
            path
          )
        ).toThrow(
          "APPLICATION_UPDATE_SIGNER_POLICY_MISSING"
        );
      }
    );

    it(
      "rejects a manifest that weakens the verification policy",
      () => {
        const path =
          manifest({
            verification:
              "SHA256_ONLY",
            trustedSignerThumbprints: [
              "AABBCCDDEEFF00112233445566778899AABBCCDD"
            ]
          });

        expect(() =>
          trustedUpdateSignerThumbprints(
            path
          )
        ).toThrow(
          "APPLICATION_UPDATE_SIGNER_POLICY_MISSING"
        );
      }
    );
  }
);
