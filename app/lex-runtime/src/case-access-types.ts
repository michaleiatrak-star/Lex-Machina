import type {
  CaseRole
} from "./auth/types.js";
import type {
  CaseKeyEnvelope
} from "./case-crypto.js";

export type StoredUserSharingKeys = {
  userId: string;
  algorithm: "X25519";
  publicKeyDer: Buffer;
  privateKeyWrapNonce: Buffer;
  privateKeyWrapCiphertext: Buffer;
  privateKeyWrapTag: Buffer;
  keyVersion: number;
  createdAt: string;
  updatedAt: string;
};

export type StoredCaseRecord = {
  caseId: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  keyVersion: number;
  displayName?: string;
};

export type StoredCaseAccess = {
  caseId: string;
  userId: string;
  role: CaseRole;
  canReidentify: boolean;
  envelope: CaseKeyEnvelope;
  grantedByUserId: string;
  grantedAt: string;
};

export type CaseListItem =
  StoredCaseRecord & {
    role: CaseRole;
    canReidentify: boolean;
  };
