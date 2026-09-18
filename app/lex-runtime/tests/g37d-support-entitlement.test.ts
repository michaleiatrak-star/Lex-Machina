import {
  generateKeyPairSync,
  sign
} from "node:crypto";
import {
  describe,
  expect,
  it
} from "vitest";
import type {
  AuthenticatedContext
} from "../src/auth/types.js";
import {
  canonicalSupportEntitlement,
  LocalSupportService,
  SupportError,
  type SupportEntitlement
} from "../src/support-service.js";

function actor(
  role: "ADMIN" | "USER"
): AuthenticatedContext {
  return {
    user: {
      userId:
        role === "ADMIN"
          ? "user_admin"
          : "user_regular",
      loginName:
        role.toLowerCase(),
      displayName: role,
      appRole: role,
      status: "ACTIVE",
      createdAt:
        "2026-09-17T00:00:00.000Z"
    },
    session: {
      sessionId:
        "authsess_test",
      userId:
        role === "ADMIN"
          ? "user_admin"
          : "user_regular",
      createdAt:
        "2026-09-17T00:00:00.000Z",
      lastActivityAt:
        "2026-09-17T00:00:00.000Z",
      lastFullAuthenticationAt:
        "2026-09-17T00:00:00.000Z",
      idleExpiresAt:
        "2026-09-17T01:00:00.000Z",
      overallExpiresAt:
        "2026-09-17T04:00:00.000Z"
    }
  };
}

describe("G37D signed SERVICE support entitlement", () => {
  it("binds a signed one-use entitlement to installation, challenge and ADMIN approval", () => {
    let now =
      Date.parse(
        "2026-09-17T00:00:00.000Z"
      );
    const events:
      Array<{
        eventType: string;
        result: string;
      }> = [];
    const pair =
      generateKeyPairSync(
        "ed25519"
      );
    const publicPem =
      pair.publicKey.export({
        type: "spki",
        format: "pem"
      }).toString();

    const service =
      new LocalSupportService({
        installationId:
          "install_" +
          "a".repeat(32),
        challengePublicKey:
          "ed25519:" +
          "b".repeat(43),
        vendorPublicKeyPem:
          publicPem,
        vendorKeyId:
          "vendor-support-2026",
        clock: {
          now: () => now
        },
        securityEvents: {
          recordSecurityEvent:
            (event) => {
              events.push({
                eventType:
                  event.eventType,
                result:
                  event.result
              });
            }
        }
      });

    expect(
      () =>
        service.issueChallenge(
          actor("USER")
        )
    ).toThrowError(
      expect.objectContaining({
        code:
          "SUPPORT_ADMIN_REQUIRED"
      })
    );

    const challenge =
      service.issueChallenge(
        actor("ADMIN")
      );
    const entitlement:
      SupportEntitlement = {
        version: 1,
        installationId:
          challenge.installationId,
        challengePublicKey:
          challenge
            .challengePublicKey,
        nonce: challenge.nonce,
        challengeSignature:
          "native-proof-" +
          "c".repeat(64),
        capabilities: [
          "DIAGNOSTICS"
        ],
        issuedAt:
          new Date(now)
            .toISOString(),
        expiresAt:
          new Date(
            now +
            30 * 60 * 1000
          ).toISOString(),
        ticket:
          "SUP-2026-0001"
      };
    const signature =
      sign(
        null,
        Buffer.from(
          canonicalSupportEntitlement(
            entitlement
          ),
          "utf8"
        ),
        pair.privateKey
      ).toString(
        "base64url"
      );

    const activated =
      service.activate(
        actor("ADMIN"),
        {
          keyId:
            "vendor-support-2026",
          entitlement,
          signature
        }
      );
    expect(
      activated.session.role
    ).toBe("SERVICE");
    expect(
      activated.session
        .approvedByUserId
    ).toBe("user_admin");
    expect(
      activated.serviceToken
    ).toHaveLength(43);

    const session =
      service.authenticateAuthorization(
        "Bearer " +
        activated.serviceToken
      );
    service.assertCapability(
      session,
      "DIAGNOSTICS"
    );
    expect(
      () =>
        service.assertCapability(
          session,
          "ACCOUNT_READ"
        )
    ).toThrowError(
      expect.objectContaining({
        code:
          "SUPPORT_CAPABILITY_DENIED"
      })
    );

    expect(
      () =>
        service.activate(
          actor("ADMIN"),
          {
            keyId:
              "vendor-support-2026",
            entitlement,
            signature
          }
        )
    ).toThrowError(
      expect.objectContaining({
        code:
          "SUPPORT_CHALLENGE_INVALID"
      })
    );

    now +=
      31 * 60 * 1000;
    expect(
      () =>
        service.authenticateAuthorization(
          "Bearer " +
          activated.serviceToken
        )
    ).toThrowError(
      expect.objectContaining({
        code:
          "SUPPORT_SESSION_EXPIRED"
      })
    );

    expect(
      events.some(
        (event) =>
          event.eventType ===
            "support_session_activated" &&
          event.result ===
            "PASS"
      )
    ).toBe(true);
  });

  it("fails closed when vendor trust or native installation identity is unavailable", () => {
    const noNative =
      new LocalSupportService({
        installationId:
          "install_" +
          "d".repeat(32)
      });
    expect(
      () =>
        noNative.issueChallenge(
          actor("ADMIN")
        )
    ).toThrowError(
      expect.objectContaining({
        code:
          "SUPPORT_NATIVE_IDENTITY_UNAVAILABLE"
      })
    );

    const challengeOnly =
      new LocalSupportService({
        installationId:
          "install_" +
          "e".repeat(32),
        challengePublicKey:
          "ed25519:" +
          "f".repeat(43)
      });
    const status =
      challengeOnly.status();
    expect(status.configured)
      .toBe(false);
    expect(
      status.nativeIdentityReady
    ).toBe(true);
  });

  it("rejects tampered signatures", () => {
    const pair =
      generateKeyPairSync(
        "ed25519"
      );
    const service =
      new LocalSupportService({
        installationId:
          "install_" +
          "1".repeat(32),
        challengePublicKey:
          "ed25519:" +
          "2".repeat(43),
        vendorPublicKeyPem:
          pair.publicKey.export({
            type: "spki",
            format: "pem"
          }).toString(),
        vendorKeyId:
          "vendor-key"
      });
    const challenge =
      service.issueChallenge(
        actor("ADMIN")
      );
    const entitlement:
      SupportEntitlement = {
        version: 1,
        installationId:
          challenge.installationId,
        challengePublicKey:
          challenge
            .challengePublicKey,
        nonce: challenge.nonce,
        challengeSignature:
          "native-proof-" +
          "x".repeat(64),
        capabilities: [
          "DIAGNOSTICS"
        ],
        issuedAt:
          new Date().toISOString(),
        expiresAt:
          new Date(
            Date.now() +
            10 * 60 * 1000
          ).toISOString(),
        ticket:
          "SUP-TAMPER"
      };

    expect(
      () =>
        service.activate(
          actor("ADMIN"),
          {
            keyId:
              "vendor-key",
            entitlement,
            signature:
              Buffer.alloc(
                64,
                7
              ).toString(
                "base64url"
              )
          }
        )
    ).toThrowError(
      SupportError
    );
  });
});
