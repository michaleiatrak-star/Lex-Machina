import { createHash, createPublicKey, randomBytes, verify } from "node:crypto";
export class SupportError extends Error {
    code;
    httpStatus;
    constructor(code, httpStatus) {
        super(code);
        this.code = code;
        this.httpStatus = httpStatus;
        this.name = "SupportError";
    }
}
const SYSTEM_CLOCK = {
    now: () => Date.now()
};
const CAPABILITIES = new Set([
    "DIAGNOSTICS",
    "ACCOUNT_READ",
    "UPDATE_READ"
]);
const CHALLENGE_TTL_MS = 10 * 60 * 1000;
const MAX_ENTITLEMENT_TTL_MS = 4 * 60 * 60 * 1000;
const MAX_CLOCK_SKEW_MS = 2 * 60 * 1000;
function tokenDigest(value) {
    return createHash("sha256")
        .update(value, "utf8")
        .digest("hex");
}
function iso(ms) {
    return new Date(ms).toISOString();
}
function safeTicket(value) {
    return (value.length >= 3 &&
        value.length <= 120 &&
        /^[A-Za-z0-9._:/# -]+$/
            .test(value));
}
function validInstallationId(value) {
    return /^install_[a-f0-9]{32}$/
        .test(value);
}
function normalizeCapabilities(value) {
    if (!Array.isArray(value) ||
        value.length < 1 ||
        value.length > 3) {
        return null;
    }
    const unique = [...new Set(value)];
    if (unique.some((candidate) => typeof candidate !== "string" ||
        !CAPABILITIES.has(candidate))) {
        return null;
    }
    return unique.sort();
}
export function canonicalSupportEntitlement(entitlement) {
    return JSON.stringify({
        version: 1,
        installationId: entitlement.installationId,
        challengePublicKey: entitlement.challengePublicKey,
        nonce: entitlement.nonce,
        challengeSignature: entitlement.challengeSignature,
        capabilities: [...entitlement.capabilities]
            .sort(),
        issuedAt: entitlement.issuedAt,
        expiresAt: entitlement.expiresAt,
        ticket: entitlement.ticket
    });
}
function assertAdmin(actor) {
    if (actor.user.appRole !== "ADMIN") {
        throw new SupportError("SUPPORT_ADMIN_REQUIRED", 403);
    }
}
export class LocalSupportService {
    installationId;
    challengePublicKey;
    vendorPublicKey;
    vendorKeyId;
    clock;
    events;
    challenges = new Map();
    sessions = new Map();
    constructor(options) {
        const installationId = options.installationId?.trim() ??
            "";
        this.installationId =
            validInstallationId(installationId)
                ? installationId
                : "install_" +
                    randomBytes(16)
                        .toString("hex");
        this.challengePublicKey =
            options.challengePublicKey
                ?.trim() || undefined;
        this.vendorKeyId =
            options.vendorKeyId
                ?.trim() || undefined;
        this.vendorPublicKey =
            undefined;
        this.clock =
            options.clock ?? SYSTEM_CLOCK;
        this.events =
            options.securityEvents;
        const pem = options.vendorPublicKeyPem
            ?.trim();
        if (pem) {
            try {
                const key = createPublicKey(pem);
                if (key.asymmetricKeyType !==
                    "ed25519") {
                    throw new Error("SUPPORT_VENDOR_KEY_NOT_ED25519");
                }
                this.vendorPublicKey = key;
            }
            catch {
                this.vendorPublicKey =
                    undefined;
            }
        }
    }
    status() {
        this.purgeExpired();
        return {
            installationId: this.installationId,
            roleModel: [
                "SERVICE",
                "ADMIN",
                "USER"
            ],
            configured: Boolean(this.vendorPublicKey &&
                this.vendorKeyId),
            nativeIdentityReady: Boolean(this.challengePublicKey),
            ...(this.vendorKeyId
                ? {
                    vendorKeyId: this.vendorKeyId
                }
                : {}),
            activeSessions: this.sessions.size
        };
    }
    issueChallenge(actor) {
        assertAdmin(actor);
        if (!this.challengePublicKey) {
            throw new SupportError("SUPPORT_NATIVE_IDENTITY_UNAVAILABLE", 503);
        }
        this.purgeExpired();
        const now = this.clock.now();
        const nonce = randomBytes(32)
            .toString("base64url");
        const challenge = {
            installationId: this.installationId,
            challengePublicKey: this.challengePublicKey,
            nonce,
            issuedAt: iso(now),
            expiresAt: iso(now + CHALLENGE_TTL_MS)
        };
        this.challenges.set(nonce, {
            issuedAtMs: now,
            expiresAtMs: now + CHALLENGE_TTL_MS
        });
        this.audit(actor.user.userId, "support_challenge_issued", "PASS", {
            nonceDigest: tokenDigest(nonce),
            expiresAt: challenge.expiresAt
        });
        return challenge;
    }
    activate(actor, signed) {
        assertAdmin(actor);
        this.purgeExpired();
        if (!this.vendorPublicKey ||
            !this.vendorKeyId) {
            throw new SupportError("SUPPORT_NOT_CONFIGURED", 503);
        }
        if (!signed ||
            signed.keyId !==
                this.vendorKeyId ||
            typeof signed.signature !==
                "string" ||
            signed.signature.length < 40) {
            throw new SupportError("SUPPORT_ENTITLEMENT_INVALID", 400);
        }
        const raw = signed.entitlement;
        if (!raw ||
            raw.version !== 1 ||
            raw.installationId !==
                this.installationId ||
            raw.challengePublicKey !==
                this.challengePublicKey ||
            typeof raw.nonce !==
                "string" ||
            raw.nonce.length < 32 ||
            typeof raw
                .challengeSignature !==
                "string" ||
            raw.challengeSignature
                .length < 40 ||
            typeof raw.issuedAt !==
                "string" ||
            typeof raw.expiresAt !==
                "string" ||
            typeof raw.ticket !==
                "string" ||
            !safeTicket(raw.ticket)) {
            throw new SupportError("SUPPORT_ENTITLEMENT_INVALID", 400);
        }
        const capabilities = normalizeCapabilities(raw.capabilities);
        if (!capabilities) {
            throw new SupportError("SUPPORT_ENTITLEMENT_INVALID", 400);
        }
        const challenge = this.challenges.get(raw.nonce);
        const now = this.clock.now();
        if (!challenge ||
            now >= challenge.expiresAtMs) {
            this.audit(actor.user.userId, "support_activation", "BLOCKED", {
                reason: "SUPPORT_CHALLENGE_INVALID",
                ticket: raw.ticket
            });
            throw new SupportError("SUPPORT_CHALLENGE_INVALID", 409);
        }
        const issuedAt = Date.parse(raw.issuedAt);
        const expiresAt = Date.parse(raw.expiresAt);
        if (!Number.isFinite(issuedAt) ||
            !Number.isFinite(expiresAt) ||
            issuedAt >
                now + MAX_CLOCK_SKEW_MS ||
            expiresAt <= now ||
            expiresAt <= issuedAt ||
            expiresAt - issuedAt >
                MAX_ENTITLEMENT_TTL_MS ||
            issuedAt <
                challenge.issuedAtMs -
                    MAX_CLOCK_SKEW_MS) {
            throw new SupportError("SUPPORT_ENTITLEMENT_EXPIRED", 409);
        }
        let signature;
        try {
            signature =
                Buffer.from(signed.signature, "base64url");
        }
        catch {
            throw new SupportError("SUPPORT_ENTITLEMENT_INVALID", 400);
        }
        const canonical = canonicalSupportEntitlement({
            ...raw,
            capabilities
        });
        const valid = verify(null, Buffer.from(canonical, "utf8"), this.vendorPublicKey, signature);
        signature.fill(0);
        if (!valid) {
            this.audit(actor.user.userId, "support_activation", "BLOCKED", {
                reason: "INVALID_SIGNATURE",
                ticket: raw.ticket
            });
            throw new SupportError("SUPPORT_ENTITLEMENT_INVALID", 403);
        }
        this.challenges.delete(raw.nonce);
        const token = randomBytes(32)
            .toString("base64url");
        const sessionId = "support_" +
            randomBytes(16)
                .toString("hex");
        const view = {
            sessionId,
            role: "SERVICE",
            installationId: this.installationId,
            capabilities,
            ticket: raw.ticket,
            approvedByUserId: actor.user.userId,
            activatedAt: iso(now),
            expiresAt: new Date(expiresAt).toISOString()
        };
        this.sessions.set(tokenDigest(token), {
            view,
            expiresAtMs: expiresAt
        });
        this.audit(actor.user.userId, "support_session_activated", "PASS", {
            sessionId,
            ticket: raw.ticket,
            capabilities,
            expiresAt: view.expiresAt
        });
        return {
            serviceToken: token,
            session: view
        };
    }
    authenticateAuthorization(authorization) {
        const match = /^Bearer\s+([A-Za-z0-9_-]{32,})$/i
            .exec(authorization?.trim() ??
            "");
        if (!match) {
            throw new SupportError("SUPPORT_SESSION_REQUIRED", 401);
        }
        const token = match[1];
        if (!token) {
            throw new SupportError("SUPPORT_SESSION_REQUIRED", 401);
        }
        const digest = tokenDigest(token);
        const stored = this.sessions.get(digest);
        if (!stored) {
            throw new SupportError("SUPPORT_SESSION_REQUIRED", 401);
        }
        if (this.clock.now() >=
            stored.expiresAtMs) {
            this.sessions.delete(digest);
            this.audit(stored.view
                .approvedByUserId, "support_session_expired", "PASS", {
                sessionId: stored.view.sessionId,
                ticket: stored.view.ticket
            });
            throw new SupportError("SUPPORT_SESSION_EXPIRED", 401);
        }
        return {
            ...stored.view,
            capabilities: [...stored.view
                    .capabilities]
        };
    }
    assertCapability(session, capability) {
        if (!session.capabilities
            .includes(capability)) {
            this.audit(session.approvedByUserId, "support_operation", "BLOCKED", {
                sessionId: session.sessionId,
                ticket: session.ticket,
                capability,
                reason: "SUPPORT_CAPABILITY_DENIED"
            });
            throw new SupportError("SUPPORT_CAPABILITY_DENIED", 403);
        }
    }
    recordOperation(session, operation) {
        this.audit(session.approvedByUserId, "support_operation", "PASS", {
            sessionId: session.sessionId,
            ticket: session.ticket,
            operation
        });
    }
    deactivateAuthorization(authorization) {
        const match = /^Bearer\s+([A-Za-z0-9_-]{32,})$/i
            .exec(authorization?.trim() ??
            "");
        if (!match) {
            return;
        }
        const token = match[1];
        if (!token) {
            return;
        }
        const digest = tokenDigest(token);
        const stored = this.sessions.get(digest);
        if (!stored) {
            return;
        }
        this.sessions.delete(digest);
        this.audit(stored.view
            .approvedByUserId, "support_session_revoked", "PASS", {
            sessionId: stored.view.sessionId,
            ticket: stored.view.ticket
        });
    }
    close() {
        this.sessions.clear();
        this.challenges.clear();
    }
    purgeExpired() {
        const now = this.clock.now();
        for (const [nonce, challenge] of this.challenges) {
            if (now >=
                challenge.expiresAtMs) {
                this.challenges.delete(nonce);
            }
        }
        for (const [digest, stored] of this.sessions) {
            if (now >=
                stored.expiresAtMs) {
                this.sessions.delete(digest);
            }
        }
    }
    audit(userId, eventType, result, metadata) {
        this.events
            ?.recordSecurityEvent({
            eventId: "event_" +
                randomBytes(16)
                    .toString("hex"),
            userId,
            eventType,
            occurredAt: iso(this.clock.now()),
            result,
            metadata
        });
    }
}
