export class CaseSecurityRotationCoordinator {
    vault;
    uploads;
    documents;
    artifacts;
    workspace;
    schedule;
    constructor(vault, uploads, documents, artifacts, workspace, schedule) {
        this.vault = vault;
        this.uploads = uploads;
        this.documents = documents;
        this.artifacts = artifacts;
        this.workspace = workspace;
        this.schedule = schedule;
    }
    async rekeyCaseVault(args) {
        let vaultChanged = false;
        let uploadsChanged = false;
        let documentsChanged = false;
        let artifactsChanged = false;
        let workspaceChanged = false;
        let scheduleChanged = false;
        const reverse = {
            caseId: args.caseId,
            oldCaseDataKey: args.newCaseDataKey,
            oldKeyVersion: args.newKeyVersion,
            newCaseDataKey: args.oldCaseDataKey,
            newKeyVersion: args.oldKeyVersion
        };
        try {
            vaultChanged =
                await this.vault
                    .rekeyCaseVault(args);
            uploadsChanged =
                await this.uploads
                    .rekeyCaseIncoming(args);
            if (this.documents) {
                documentsChanged =
                    await this.documents
                        .rekeyCaseDocuments(args);
            }
            if (this.artifacts) {
                artifactsChanged =
                    await this.artifacts
                        .rekeyCaseArtifacts(args);
            }
            if (this.workspace) {
                workspaceChanged =
                    await this.workspace
                        .rekeyCaseWorkspace(args);
            }
            if (this.schedule) {
                scheduleChanged =
                    await this.schedule
                        .rekeyCaseSchedule(args);
            }
            return (vaultChanged ||
                uploadsChanged ||
                documentsChanged ||
                artifactsChanged ||
                workspaceChanged ||
                scheduleChanged);
        }
        catch (error) {
            try {
                if (scheduleChanged &&
                    this.schedule) {
                    await this.schedule
                        .rekeyCaseSchedule(reverse);
                }
                if (workspaceChanged &&
                    this.workspace) {
                    await this.workspace
                        .rekeyCaseWorkspace(reverse);
                }
                if (artifactsChanged &&
                    this.artifacts) {
                    await this.artifacts
                        .rekeyCaseArtifacts(reverse);
                }
                if (documentsChanged &&
                    this.documents) {
                    await this.documents
                        .rekeyCaseDocuments(reverse);
                }
                if (uploadsChanged) {
                    await this.uploads
                        .rekeyCaseIncoming(reverse);
                }
                if (vaultChanged) {
                    await this.vault
                        .rekeyCaseVault(reverse);
                }
            }
            catch {
                throw new Error("CASE_SECURITY_REKEY_ROLLBACK_FAILED");
            }
            throw error;
        }
    }
}
