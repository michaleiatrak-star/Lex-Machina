import {
  randomBytes
} from "node:crypto";
import type {
  AuthenticatedContext,
  CaseRole,
  PublicLocalUser
} from "./auth/types.js";
import type {
  AuthService
} from "./auth/service.js";
import {
  LocalAuthStore
} from "./auth/store.js";
import type {
  CaseListItem,
  StoredCaseAccess,
  StoredCaseRecord
} from "./case-access-types.js";
import {
  randomCaseDataKey,
  unwrapCaseKeyForOfflineUser,
  unwrapCaseKeyForSessionUser,
  unwrapUserSharingPrivateKey,
  wrapCaseKeyForOfflineUser,
  wrapCaseKeyForSessionUser
} from "./case-crypto.js";
import {
  LocalCaseFileStore,
  type StoredCaseMetadata
} from "./case-file-store.js";

export type CaseCapability =
  | "READ"
  | "WRITE"
  | "ANALYZE"
  | "MANAGE"
  | "REIDENTIFY";

export type CaseAccessErrorCode =
  | "CASE_ACCESS_DENIED"
  | "CASE_NOT_FOUND"
  | "INVALID_CASE_ACCESS_REQUEST"
  | "TARGET_USER_NOT_FOUND"
  | "TARGET_CRYPTO_NOT_READY"
  | "OWNER_ACCESS_IMMUTABLE"
  | "LEGACY_CASE_REQUIRES_IMPORT"
  | "LEGACY_CASE_ALREADY_IMPORTED"
  | "CASE_KEY_UNAVAILABLE";

export class CaseAccessError extends Error {
  constructor(
    readonly code: CaseAccessErrorCode,
    readonly httpStatus: number
  ) {
    super(code);
    this.name = "CaseAccessError";
  }
}

const ROLE_CAPABILITIES:
  Record<
    CaseRole,
    ReadonlySet<CaseCapability>
  > = {
    OWNER: new Set([
      "READ",
      "WRITE",
      "ANALYZE",
      "MANAGE"
    ]),
    EDITOR: new Set([
      "READ",
      "WRITE",
      "ANALYZE"
    ]),
    ANALYST: new Set([
      "READ",
      "ANALYZE"
    ]),
    VIEWER: new Set([
      "READ"
    ])
  };

function validCaseId(
  value: string
): boolean {
  return /^case_[a-f0-9]{32}$/
    .test(value);
}

function validUserId(
  value: string
): boolean {
  return /^user_[a-f0-9]{32}$/
    .test(value);
}

function cleanDisplayName(
  value: string | undefined
): string | undefined {
  const cleaned =
    value
      ?.normalize("NFKC")
      .trim()
      .slice(0, 160);
  return cleaned || undefined;
}

export type CaseView =
  StoredCaseRecord & {
    role: CaseRole;
    canReidentify: boolean;
  };

export type CaseAccessView = {
  user: PublicLocalUser;
  role: CaseRole;
  canReidentify: boolean;
  grantedByUserId: string;
  grantedAt: string;
  keyVersion: number;
};

export class LocalCaseAccessService {
  constructor(
    private readonly store:
      LocalAuthStore,
    private readonly auth:
      AuthService,
    private readonly files:
      LocalCaseFileStore
  ) {}

  async createCase(
    context:
      AuthenticatedContext,
    displayName?: string
  ): Promise<CaseView> {
    const caseId =
      "case_" +
      randomBytes(16)
        .toString("hex");
    const keyVersion = 1;
    const caseDataKey =
      randomCaseDataKey();
    const now =
      new Date().toISOString();

    try {
      const ownerEnvelope =
        await this.auth
          .withSessionUserMasterKey(
            context.session
              .sessionId,
            (userMasterKey) =>
              wrapCaseKeyForSessionUser(
                userMasterKey,
                {
                  userId:
                    context.user
                      .userId,
                  caseId,
                  caseDataKey,
                  keyVersion
                }
              )
          );

      let metadata:
        StoredCaseMetadata;
      try {
        const cleanedName =
          cleanDisplayName(
            displayName
          );
        metadata =
          await this.files
            .createCase({
              caseId,
              ...(cleanedName
                ? {
                    displayName:
                      cleanedName
                  }
                : {}),
              createdByUserId:
                context.user.userId,
              keyVersion
            });
      } catch (error) {
        throw error;
      }

      const record:
        StoredCaseRecord = {
          caseId,
          createdByUserId:
            context.user.userId,
          createdAt:
            metadata.createdAt,
          updatedAt:
            metadata.createdAt,
          keyVersion,
          ...(metadata.displayName
            ? {
                displayName:
                  metadata.displayName
              }
            : {})
        };
      const ownerAccess:
        StoredCaseAccess = {
          caseId,
          userId:
            context.user.userId,
          role: "OWNER",
          canReidentify: true,
          envelope:
            ownerEnvelope,
          grantedByUserId:
            context.user.userId,
          grantedAt:
            metadata.createdAt
        };

      try {
        this.store
          .createCaseWithOwner({
            caseRecord: record,
            ownerAccess
          });
      } catch (error) {
        await this.files
          .removeCase(caseId);
        throw error;
      }

      this.audit(
        context.user.userId,
        "case_created",
        now,
        {
          caseId,
          keyVersion
        }
      );

      return {
        ...record,
        role: "OWNER",
        canReidentify: true
      };
    } finally {
      caseDataKey.fill(0);
    }
  }

  listCases(
    context:
      AuthenticatedContext
  ): CaseListItem[] {
    return this.store
      .listCasesForUser(
        context.user.userId
      );
  }

  openCase(
    context:
      AuthenticatedContext,
    caseId: string
  ): CaseView {
    const access =
      this.assertAccess(
        context,
        caseId,
        "READ"
      );
    const record =
      this.store.getCase(caseId);
    if (!record) {
      throw new CaseAccessError(
        "CASE_NOT_FOUND",
        404
      );
    }
    return {
      ...record,
      role: access.role,
      canReidentify:
        access.canReidentify
    };
  }

  async listLegacyCases(
    context:
      AuthenticatedContext
  ): Promise<
    StoredCaseMetadata[]
  > {
    this.assertAdmin(context);
    return await this.files
      .listLegacyCases();
  }

  async importLegacyCase(
    context:
      AuthenticatedContext,
    caseId: string
  ): Promise<CaseView> {
    this.assertAdmin(context);
    if (!validCaseId(caseId)) {
      throw new CaseAccessError(
        "INVALID_CASE_ACCESS_REQUEST",
        400
      );
    }
    if (
      this.store.getCase(caseId)
    ) {
      throw new CaseAccessError(
        "LEGACY_CASE_ALREADY_IMPORTED",
        409
      );
    }

    let metadata:
      StoredCaseMetadata;
    try {
      metadata =
        await this.files
          .readCaseMetadata(
            caseId
          );
    } catch {
      throw new CaseAccessError(
        "CASE_NOT_FOUND",
        404
      );
    }
    if (
      metadata.createdByUserId ||
      metadata.keyVersion
    ) {
      throw new CaseAccessError(
        "LEGACY_CASE_ALREADY_IMPORTED",
        409
      );
    }

    const caseDataKey =
      randomCaseDataKey();
    const keyVersion = 1;
    const now =
      new Date().toISOString();

    try {
      const ownerEnvelope =
        await this.auth
          .withSessionUserMasterKey(
            context.session
              .sessionId,
            (userMasterKey) =>
              wrapCaseKeyForSessionUser(
                userMasterKey,
                {
                  userId:
                    context.user
                      .userId,
                  caseId,
                  caseDataKey,
                  keyVersion
                }
              )
          );

      const record:
        StoredCaseRecord = {
          caseId,
          createdByUserId:
            context.user.userId,
          createdAt:
            metadata.createdAt,
          updatedAt: now,
          keyVersion,
          ...(metadata.displayName
            ? {
                displayName:
                  metadata.displayName
              }
            : {})
        };
      const ownerAccess:
        StoredCaseAccess = {
          caseId,
          userId:
            context.user.userId,
          role: "OWNER",
          canReidentify: true,
          envelope:
            ownerEnvelope,
          grantedByUserId:
            context.user.userId,
          grantedAt: now
        };

      this.store
        .createCaseWithOwner({
          caseRecord: record,
          ownerAccess
        });
      try {
        await this.files
          .updateCaseSecurityMetadata(
            caseId,
            {
              createdByUserId:
                context.user
                  .userId,
              keyVersion
            }
          );
      } catch (error) {
        this.store
          .deleteCaseRegistration(
            caseId
          );
        throw error;
      }

      this.audit(
        context.user.userId,
        "legacy_case_imported",
        now,
        {
          caseId,
          keyVersion
        }
      );
      return {
        ...record,
        role: "OWNER",
        canReidentify: true
      };
    } finally {
      caseDataKey.fill(0);
    }
  }

  assertAccess(
    context:
      AuthenticatedContext,
    caseId: string,
    capability:
      CaseCapability
  ): StoredCaseAccess {
    if (!validCaseId(caseId)) {
      throw new CaseAccessError(
        "CASE_ACCESS_DENIED",
        403
      );
    }
    const access =
      this.store
        .getCaseAccess(
          caseId,
          context.user.userId
        );
    if (!access) {
      throw new CaseAccessError(
        "CASE_ACCESS_DENIED",
        403
      );
    }
    if (
      capability ===
        "REIDENTIFY"
    ) {
      if (
        !access.canReidentify
      ) {
        throw new CaseAccessError(
          "CASE_ACCESS_DENIED",
          403
        );
      }
      return access;
    }
    if (
      !ROLE_CAPABILITIES[
        access.role
      ].has(capability)
    ) {
      throw new CaseAccessError(
        "CASE_ACCESS_DENIED",
        403
      );
    }
    return access;
  }

  listAccess(
    context:
      AuthenticatedContext,
    caseId: string
  ): CaseAccessView[] {
    this.assertAccess(
      context,
      caseId,
      "MANAGE"
    );
    return this.store
      .listCaseAccess(caseId)
      .map((access) => {
        const user =
          this.store
            .getUserById(
              access.userId
            );
        if (!user) {
          throw new Error(
            "CASE_ACCESS_USER_MISSING"
          );
        }
        return {
          user: {
            userId:
              user.userId,
            loginName:
              user.loginName,
            displayName:
              user.displayName,
            appRole:
              user.appRole,
            status:
              user.status,
            createdAt:
              user.createdAt,
            ...(user.lastLoginAt
              ? {
                  lastLoginAt:
                    user.lastLoginAt
                }
              : {})
          },
          role: access.role,
          canReidentify:
            access.canReidentify,
          grantedByUserId:
            access
              .grantedByUserId,
          grantedAt:
            access.grantedAt,
          keyVersion:
            access.envelope
              .keyVersion
        };
      });
  }

  async grantAccess(
    context:
      AuthenticatedContext,
    caseId: string,
    input: {
      userId: string;
      role:
        Exclude<
          CaseRole,
          "OWNER"
        >;
      canReidentify: boolean;
    }
  ): Promise<CaseAccessView> {
    this.assertAccess(
      context,
      caseId,
      "MANAGE"
    );
    if (
      !validUserId(
        input.userId
      ) ||
      input.userId ===
        context.user.userId ||
      ![
        "EDITOR",
        "ANALYST",
        "VIEWER"
      ].includes(input.role)
    ) {
      throw new CaseAccessError(
        "INVALID_CASE_ACCESS_REQUEST",
        400
      );
    }

    const target =
      this.store.getUserById(
        input.userId
      );
    if (
      !target ||
      target.status !== "ACTIVE"
    ) {
      throw new CaseAccessError(
        "TARGET_USER_NOT_FOUND",
        404
      );
    }
    const targetKeys =
      this.store
        .getUserSharingKeys(
          target.userId
        );
    if (!targetKeys) {
      throw new CaseAccessError(
        "TARGET_CRYPTO_NOT_READY",
        409
      );
    }

    const record =
      this.store.getCase(
        caseId
      );
    if (!record) {
      throw new CaseAccessError(
        "CASE_NOT_FOUND",
        404
      );
    }

    const now =
      new Date().toISOString();
    await this.withCaseDataKey(
      context,
      caseId,
      "MANAGE",
      async (caseDataKey) => {
        const envelope =
          wrapCaseKeyForOfflineUser(
            targetKeys
              .publicKeyDer,
            {
              targetUserId:
                target.userId,
              caseId,
              caseDataKey,
              keyVersion:
                record.keyVersion
            }
          );
        this.store
          .upsertCaseAccess({
            caseId,
            userId:
              target.userId,
            role: input.role,
            canReidentify:
              input.canReidentify,
            envelope,
            grantedByUserId:
              context.user.userId,
            grantedAt: now
          });
      }
    );

    this.audit(
      context.user.userId,
      "case_access_granted",
      now,
      {
        caseId,
        targetUserId:
          target.userId,
        role: input.role,
        canReidentify:
          input.canReidentify,
        keyVersion:
          record.keyVersion
      }
    );

    return {
      user: {
        userId:
          target.userId,
        loginName:
          target.loginName,
        displayName:
          target.displayName,
        appRole:
          target.appRole,
        status:
          target.status,
        createdAt:
          target.createdAt,
        ...(target.lastLoginAt
          ? {
              lastLoginAt:
                target.lastLoginAt
            }
          : {})
      },
      role: input.role,
      canReidentify:
        input.canReidentify,
      grantedByUserId:
        context.user.userId,
      grantedAt: now,
      keyVersion:
        record.keyVersion
    };
  }

  async revokeAccess(
    context:
      AuthenticatedContext,
    caseId: string,
    targetUserId: string
  ): Promise<{
    caseId: string;
    revokedUserId: string;
    keyVersion: number;
  }> {
    this.assertAccess(
      context,
      caseId,
      "MANAGE"
    );
    const targetAccess =
      this.store.getCaseAccess(
        caseId,
        targetUserId
      );
    if (!targetAccess) {
      throw new CaseAccessError(
        "CASE_ACCESS_DENIED",
        403
      );
    }
    if (
      targetAccess.role ===
        "OWNER"
    ) {
      throw new CaseAccessError(
        "OWNER_ACCESS_IMMUTABLE",
        409
      );
    }

    const result =
      await this.rotateCaseKey(
        context,
        caseId,
        targetUserId
      );
    this.audit(
      context.user.userId,
      "case_access_revoked",
      new Date().toISOString(),
      {
        caseId,
        targetUserId,
        keyVersion:
          result.keyVersion
      }
    );
    return {
      caseId,
      revokedUserId:
        targetUserId,
      keyVersion:
        result.keyVersion
    };
  }

  async rotateCaseKey(
    context:
      AuthenticatedContext,
    caseId: string,
    revokedUserId?: string
  ): Promise<{
    caseId: string;
    keyVersion: number;
  }> {
    this.assertAccess(
      context,
      caseId,
      "MANAGE"
    );
    const record =
      this.store.getCase(
        caseId
      );
    if (!record) {
      throw new CaseAccessError(
        "CASE_NOT_FOUND",
        404
      );
    }

    const currentAccess =
      this.store
        .listCaseAccess(caseId)
        .filter(
          (item) =>
            item.userId !==
              revokedUserId
        );
    if (
      !currentAccess.some(
        (item) =>
          item.userId ===
            context.user.userId &&
          item.role === "OWNER"
      )
    ) {
      throw new CaseAccessError(
        "CASE_ACCESS_DENIED",
        403
      );
    }

    await this.withCaseDataKey(
      context,
      caseId,
      "MANAGE",
      () => undefined
    );

    const nextKeyVersion =
      record.keyVersion + 1;
    const nextKey =
      randomCaseDataKey();
    const now =
      new Date().toISOString();

    try {
      const remaining:
        StoredCaseAccess[] = [];
      for (
        const existing
        of currentAccess
      ) {
        let envelope:
          StoredCaseAccess[
            "envelope"
          ];

        if (
          existing.userId ===
            context.user.userId
        ) {
          envelope =
            await this.auth
              .withSessionUserMasterKey(
                context.session
                  .sessionId,
                (userMasterKey) =>
                  wrapCaseKeyForSessionUser(
                    userMasterKey,
                    {
                      userId:
                        existing.userId,
                      caseId,
                      caseDataKey:
                        nextKey,
                      keyVersion:
                        nextKeyVersion
                    }
                  )
              );
        } else {
          const userKeys =
            this.store
              .getUserSharingKeys(
                existing.userId
              );
          if (!userKeys) {
            throw new CaseAccessError(
              "TARGET_CRYPTO_NOT_READY",
              409
            );
          }
          envelope =
            wrapCaseKeyForOfflineUser(
              userKeys
                .publicKeyDer,
              {
                targetUserId:
                  existing.userId,
                caseId,
                caseDataKey:
                  nextKey,
                keyVersion:
                  nextKeyVersion
              }
            );
        }

        remaining.push({
          ...existing,
          envelope
        });
      }

      await this.files
        .updateCaseKeyVersion(
          caseId,
          nextKeyVersion
        );
      try {
        this.store
          .revokeAccessAndRotate({
            caseId,
            revokedUserId:
              revokedUserId ??
              "__none__",
            newKeyVersion:
              nextKeyVersion,
            updatedAt: now,
            remaining
          });
      } catch (error) {
        try {
          await this.files
            .updateCaseKeyVersion(
              caseId,
              record.keyVersion
            );
        } catch {
          // DB remains unchanged; metadata repair is surfaced
          // by the original transaction failure path.
        }
        throw error;
      }

      this.audit(
        context.user.userId,
        "case_key_rotated",
        now,
        {
          caseId,
          previousKeyVersion:
            record.keyVersion,
          keyVersion:
            nextKeyVersion,
          ...(revokedUserId
            ? { revokedUserId }
            : {})
        }
      );
      return {
        caseId,
        keyVersion:
          nextKeyVersion
      };
    } finally {
      nextKey.fill(0);
    }
  }

  async withCaseDataKey<T>(
    context:
      AuthenticatedContext,
    caseId: string,
    capability:
      CaseCapability,
    callback: (
      caseDataKey: Buffer
    ) => T | Promise<T>
  ): Promise<T> {
    const access =
      this.assertAccess(
        context,
        caseId,
        capability
      );
    const record =
      this.store.getCase(caseId);
    if (
      !record ||
      access.envelope
        .keyVersion !==
        record.keyVersion
    ) {
      throw new CaseAccessError(
        "CASE_KEY_UNAVAILABLE",
        409
      );
    }

    return await this.auth
      .withSessionUserMasterKey(
        context.session.sessionId,
        async (userMasterKey) => {
          let caseDataKey:
            Buffer | undefined;
          try {
            if (
              access.envelope
                .algorithm ===
                "UMK-HKDF-SHA256-AES-256-GCM"
            ) {
              caseDataKey =
                unwrapCaseKeyForSessionUser(
                  userMasterKey,
                  {
                    userId:
                      context.user.userId,
                    caseId,
                    keyVersion:
                      record.keyVersion,
                    envelope:
                      access.envelope
                  }
                );
            } else {
              const userKeys =
                this.store
                  .getUserSharingKeys(
                    context.user.userId
                  );
              if (!userKeys) {
                throw new CaseAccessError(
                  "CASE_KEY_UNAVAILABLE",
                  409
                );
              }
              const privateKey =
                unwrapUserSharingPrivateKey(
                  userMasterKey,
                  context.user.userId,
                  userKeys.keyVersion,
                  {
                    nonce:
                      userKeys
                        .privateKeyWrapNonce,
                    ciphertext:
                      userKeys
                        .privateKeyWrapCiphertext,
                    tag:
                      userKeys
                        .privateKeyWrapTag
                  }
                );
              caseDataKey =
                unwrapCaseKeyForOfflineUser(
                  privateKey,
                  {
                    userId:
                      context.user.userId,
                    caseId,
                    keyVersion:
                      record.keyVersion,
                    envelope:
                      access.envelope
                  }
                );
            }

            if (
              caseDataKey.length !== 32
            ) {
              throw new CaseAccessError(
                "CASE_KEY_UNAVAILABLE",
                409
              );
            }
            return await callback(
              caseDataKey
            );
          } catch (error) {
            if (
              error instanceof
                CaseAccessError
            ) {
              throw error;
            }
            throw new CaseAccessError(
              "CASE_KEY_UNAVAILABLE",
              409
            );
          } finally {
            caseDataKey?.fill(0);
          }
        }
      );
  }

  private assertAdmin(
    context:
      AuthenticatedContext
  ): void {
    if (
      context.user.appRole !==
        "ADMIN"
    ) {
      throw new CaseAccessError(
        "CASE_ACCESS_DENIED",
        403
      );
    }
  }

  private audit(
    userId: string,
    eventType: string,
    occurredAt: string,
    metadata:
      Record<string, unknown>
  ): void {
    this.store.recordSecurityEvent({
      eventId:
        "event_" +
        randomBytes(16)
          .toString("hex"),
      userId,
      eventType,
      occurredAt,
      result: "PASS",
      metadata
    });
  }
}
