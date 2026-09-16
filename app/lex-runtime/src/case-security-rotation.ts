import type {
  CaseKeyRotationParticipant
} from "./case-access.js";
import type {
  SecureCaseUploadStore
} from "./case-secure-store.js";
import type {
  EncryptedPrivacyVaultStore
} from "./privacy/vault-store.js";

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
      >
  ) {}

  async rekeyCaseVault(
    args: RotationArgs
  ): Promise<boolean> {
    const vaultChanged =
      await this.vault
        .rekeyCaseVault(
          args
        );

    try {
      const uploadsChanged =
        await this.uploads
          .rekeyCaseIncoming(
            args
          );
      return (
        vaultChanged ||
        uploadsChanged
      );
    } catch (error) {
      if (vaultChanged) {
        try {
          await this.vault
            .rekeyCaseVault({
              caseId:
                args.caseId,
              oldCaseDataKey:
                args
                  .newCaseDataKey,
              oldKeyVersion:
                args
                  .newKeyVersion,
              newCaseDataKey:
                args
                  .oldCaseDataKey,
              newKeyVersion:
                args
                  .oldKeyVersion
            });
        } catch {
          throw new Error(
            "CASE_SECURITY_REKEY_ROLLBACK_FAILED"
          );
        }
      }
      throw error;
    }
  }
}
