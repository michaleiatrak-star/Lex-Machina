import type {
  CaseKeyRotationParticipant
} from "./case-access.js";
import type {
  SecureCaseUploadStore
} from "./case-secure-store.js";
import type {
  EncryptedPrivacyVaultStore
} from "./privacy/vault-store.js";
import type {
  SecureCaseDocumentStore
} from "./case-document-store.js";

type RotationArgs =
  Parameters<
    CaseKeyRotationParticipant[
      "rekeyCaseVault"
    ]
  >[0];

export class CaseSecurityRotationCoordinator
implements CaseKeyRotationParticipant {
  constructor(
    private readonly vault:
      Pick<
        EncryptedPrivacyVaultStore,
        "rekeyCaseVault"
      >,
    private readonly uploads:
      Pick<
        SecureCaseUploadStore,
        "rekeyCaseIncoming"
      >,
    private readonly documents?:
      Pick<
        SecureCaseDocumentStore,
        "rekeyCaseDocuments"
      >
  ) {}

  async rekeyCaseVault(
    args: RotationArgs
  ): Promise<boolean> {
    let vaultChanged = false;
    let uploadsChanged = false;
    let documentsChanged = false;

    const reverse = {
      caseId:
        args.caseId,
      oldCaseDataKey:
        args.newCaseDataKey,
      oldKeyVersion:
        args.newKeyVersion,
      newCaseDataKey:
        args.oldCaseDataKey,
      newKeyVersion:
        args.oldKeyVersion
    };

    try {
      vaultChanged =
        await this.vault
          .rekeyCaseVault(
            args
          );
      uploadsChanged =
        await this.uploads
          .rekeyCaseIncoming(
            args
          );
      if (
        this.documents
      ) {
        documentsChanged =
          await this.documents
            .rekeyCaseDocuments(
              args
            );
      }
      return (
        vaultChanged ||
        uploadsChanged ||
        documentsChanged
      );
    } catch (error) {
      try {
        if (
          documentsChanged &&
          this.documents
        ) {
          await this.documents
            .rekeyCaseDocuments(
              reverse
            );
        }
        if (
          uploadsChanged
        ) {
          await this.uploads
            .rekeyCaseIncoming(
              reverse
            );
        }
        if (
          vaultChanged
        ) {
          await this.vault
            .rekeyCaseVault(
              reverse
            );
        }
      } catch {
        throw new Error(
          "CASE_SECURITY_REKEY_ROLLBACK_FAILED"
        );
      }
      throw error;
    }
  }
}
