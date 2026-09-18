import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  WindowsAuthenticodeInstallerVerifier,
  type ApplicationInstallerVerifier,
  type VerifiedApplicationPublisher
} from "./application-update-verifier.js";
import { LexSkillRegistry } from "./registry.js";
import {
  skillUpdateTrustReady,
  verifySkillUpdateIndex,
  type SkillUpdateIndex,
  type VerifiedSkillIndex
} from "./skill-update-verifier.js";
import {
  modelPackTrustReady,
  verifyModelPackIndex,
  type ModelPackEntry,
  type VerifiedModelPackIndex
} from "./model-pack-verifier.js";
import {
  CURRENT_APPLICATION_VERSION,
  compareVersions,
  type UpdateDiscovery,
  type UpdateDiscoveryResult,
  type VerifiedReleaseAsset
} from "./update-discovery.js";

export type ApplicationUpdateDownload = {
  version: string;
  token: string;
  receiptToken: string;
  filename: string;
  sha256: string;
  bytes: number;
  stagedAt: string;
  publisher: VerifiedApplicationPublisher;
};

export type ApplicationUpdateReceipt = {
  schemaVersion: 1;
  kind: "LEX_MACHINA_APPLICATION_UPDATE";
  version: string;
  installerToken: string;
  originalFilename: string;
  sha256: string;
  bytes: number;
  stagedAt: string;
  publisher: VerifiedApplicationPublisher;
};

export type SkillUpdateStatus = {
  currentVersion: string;
  status: "UP_TO_DATE" | "AVAILABLE" | "UNAVAILABLE";
  latestVersion?: string;
  checkedAt: string;
  bundleReady: boolean;
  verificationReady: boolean;
  blockedReason?:
    | "SIGNED_INDEX_MISSING"
    | "SIGNER_POLICY_MISSING";
};

export type SkillUpdateApplyResult = {
  previousVersion: string;
  installedVersion: string;
  installedAt: string;
  restartRequired: true;
  skillRoot: string;
};

export type ModelPackUpdateStatus = {
  status:
    | "NOT_CONFIGURED"
    | "UP_TO_DATE"
    | "AVAILABLE"
    | "UNAVAILABLE"
    | "BLOCKED";
  checkedAt: string;
  modelId?: string;
  currentSha256?: string;
  latestPackVersion?: string;
  targetSha256?: string;
  verificationReady: boolean;
  signerKeyId?: string;
  blockedReason?:
    | "SIGNED_INDEX_MISSING"
    | "SIGNER_POLICY_MISSING"
    | "APP_INCOMPATIBLE"
    | "MODEL_NOT_IN_INDEX"
    | "PACK_VERSION_ROLLBACK"
    | "PACK_VERSION_HASH_CONFLICT"
    | "INDEX_INVALID";
};

export type VerifiedModelPackTarget = {
  packVersion: string;
  signerKeyId: string;
  indexSha256: string;
  model: ModelPackEntry;
};

function localAppDataRoot(): string {
  const base = process.env.LOCALAPPDATA?.trim();
  if (base) return path.resolve(base, "LexMachina");
  return path.resolve(os.homedir(), ".lex-machina");
}

export function installedSkillOverlayRoot(): string {
  return path.join(localAppDataRoot(), "skills", "current");
}

export function installedSkillOverlayPreviousRoot(): string {
  return path.join(localAppDataRoot(), "skills", "previous");
}

export type SkillOverlayStartupResult = {
  root: string | null;
  action:
    | "BUNDLED"
    | "CURRENT_HEALTHY"
    | "ROLLED_BACK_TO_PREVIOUS"
    | "ROLLED_BACK_TO_BUNDLED";
  version: string | null;
  rolledBackFromVersion?: string;
};

export function validateSkillOverlayRoot(
  root: string,
  options?: {
    requireVersionMarker?: boolean;
    fallbackVersion?: string;
  }
): {
  healthy: boolean;
  version: string | null;
  issues: string[];
} {
  const resolved = path.resolve(root);
  if (
    !fs.existsSync(resolved) ||
    !fs.statSync(resolved).isDirectory()
  ) {
    return {
      healthy: false,
      version: null,
      issues: ["ROOT_MISSING"]
    };
  }

  let version: string | null = null;
  const versionMarker =
    markerPath(resolved);
  if (
    fs.existsSync(
      versionMarker
    )
  ) {
    try {
      const marker = JSON.parse(
        fs.readFileSync(
          versionMarker,
          "utf8"
        )
      ) as {
        version?: unknown;
      };
      if (
        typeof marker.version !==
          "string" ||
        !/^\d+\.\d+\.\d+$/.test(
          marker.version
        )
      ) {
        return {
          healthy: false,
          version: null,
          issues: [
            "VERSION_MARKER_INVALID"
          ]
        };
      }
      version = marker.version;
    } catch {
      return {
        healthy: false,
        version: null,
        issues: [
          "VERSION_MARKER_INVALID"
        ]
      };
    }
  } else if (
    options?.requireVersionMarker ??
    true
  ) {
    return {
      healthy: false,
      version: null,
      issues: [
        "VERSION_MARKER_MISSING"
      ]
    };
  } else {
    version =
      options?.fallbackVersion ??
      null;
  }

  const registry =
    new LexSkillRegistry(resolved);
  const issues = [
    ...registry.scan(),
    ...registry.validateDeclarations()
  ].map(
    (issue) =>
      issue.code +
      ":" +
      (issue.skill ?? "") +
      ":" +
      (issue.target ?? "")
  );
  if (
    registry.skills.size === 0
  ) {
    issues.push("NO_SKILLS");
  }

  return {
    healthy:
      issues.length === 0,
    version,
    issues
  };
}

function writeSkillHealthMarker(
  root: string,
  patch: Record<string, unknown>
): void {
  const target =
    markerPath(root);
  let existing:
    Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(
      fs.readFileSync(
        target,
        "utf8"
      )
    ) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      existing =
        parsed as
          Record<string, unknown>;
    }
  } catch {
    // Validation runs before this helper is used.
  }

  const temporary =
    target + ".tmp";
  fs.writeFileSync(
    temporary,
    JSON.stringify(
      {
        ...existing,
        ...patch
      },
      null,
      2
    ) + "\n",
    "utf8"
  );
  fs.renameSync(
    temporary,
    target
  );
}

export function recoverSkillOverlayForStartup(
  bundledRoot?: string
): SkillOverlayStartupResult {
  const current =
    installedSkillOverlayRoot();
  const previous =
    installedSkillOverlayPreviousRoot();

  if (
    !fs.existsSync(current)
  ) {
    return {
      root: null,
      action: "BUNDLED",
      version: null
    };
  }

  const currentHealth =
    validateSkillOverlayRoot(
      current
    );
  if (
    currentHealth.healthy
  ) {
    writeSkillHealthMarker(
      current,
      {
        health:
          "ACTIVE_HEALTHY",
        validatedAt:
          new Date().toISOString()
      }
    );
    return {
      root: current,
      action:
        "CURRENT_HEALTHY",
      version:
        currentHealth.version
    };
  }

  const previousHealth =
    validateSkillOverlayRoot(
      previous
    );
  if (
    !previousHealth.healthy
  ) {
    const bundledHealth =
      bundledRoot
        ? validateSkillOverlayRoot(
            bundledRoot,
            {
              requireVersionMarker:
                false,
              fallbackVersion:
                CURRENT_APPLICATION_VERSION
            }
          )
        : {
            healthy: false,
            version: null,
            issues: [
              "BUNDLED_ROOT_NOT_PROVIDED"
            ]
          };

    if (
      bundledRoot &&
      bundledHealth.healthy
    ) {
      const failed =
        path.join(
          path.dirname(current),
          "failed-" +
          Date.now() +
          "-" +
          randomBytes(4)
            .toString("hex")
        );
      fs.renameSync(
        current,
        failed
      );
      try {
        fs.rmSync(
          failed,
          {
            recursive: true,
            force: true
          }
        );
      } catch {
        // Keeping a quarantined failed overlay is safer than restoring it.
      }
      return {
        root:
          path.resolve(
            bundledRoot
          ),
        action:
          "ROLLED_BACK_TO_BUNDLED",
        version:
          bundledHealth.version,
        ...(currentHealth.version
          ? {
              rolledBackFromVersion:
                currentHealth.version
            }
          : {})
      };
    }

    throw new Error(
      "SKILL_OVERLAY_STARTUP_INVALID_NO_ROLLBACK:current=" +
      currentHealth.issues.join(",") +
      ":previous=" +
      previousHealth.issues.join(",") +
      ":bundled=" +
      bundledHealth.issues.join(",")
    );
  }

  const failed =
    path.join(
      path.dirname(current),
      "failed-" +
      Date.now() +
      "-" +
      randomBytes(4).toString("hex")
    );

  fs.renameSync(
    current,
    failed
  );
  try {
    fs.renameSync(
      previous,
      current
    );
  } catch (error) {
    fs.renameSync(
      failed,
      current
    );
    throw error;
  }

  try {
    writeSkillHealthMarker(
      current,
      {
        health:
          "ROLLED_BACK_HEALTHY",
        validatedAt:
          new Date().toISOString(),
        rolledBackFromVersion:
          currentHealth.version,
        rollbackReason:
          currentHealth.issues
      }
    );
    fs.rmSync(
      failed,
      {
        recursive: true,
        force: true
      }
    );
  } catch (error) {
    throw error;
  }

  return {
    root: current,
    action:
      "ROLLED_BACK_TO_PREVIOUS",
    version:
      previousHealth.version,
    ...(currentHealth.version
      ? {
          rolledBackFromVersion:
            currentHealth.version
        }
      : {})
  };
}

export function applicationUpdateStagingRoot(): string {
  return path.join(os.tmpdir(), "LexMachinaUpdate");
}

function markerPath(root: string): string {
  return path.join(root, ".lex-skills-version.json");
}

export function installedSkillOverlayVersion(): string | null {
  try {
    const parsed = JSON.parse(
      fs.readFileSync(markerPath(installedSkillOverlayRoot()), "utf8")
    ) as { version?: unknown };
    return typeof parsed.version === "string"
      ? parsed.version
      : null;
  } catch {
    return null;
  }
}

function sha256(data: Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

async function downloadVerified(
  asset: VerifiedReleaseAsset,
  fetchImpl: typeof fetch
): Promise<Uint8Array> {
  const response = await fetchImpl(asset.url, {
    headers: {
      Accept: "application/octet-stream"
    },
    redirect: "follow",
    signal: AbortSignal.timeout(30 * 60_000)
  });
  if (!response.ok) {
    throw new Error(`UPDATE_ASSET_DOWNLOAD_FAILED:${response.status}`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  const actual = sha256(bytes);
  if (actual !== asset.sha256.toLowerCase()) {
    throw new Error("UPDATE_ASSET_HASH_MISMATCH");
  }
  if (asset.bytes !== undefined && bytes.byteLength !== asset.bytes) {
    throw new Error("UPDATE_ASSET_SIZE_MISMATCH");
  }
  return bytes;
}

function requireLatestVersion(
  status: UpdateDiscoveryResult
): string {
  if (!status.latestVersion) {
    throw new Error("UPDATE_RELEASE_VERSION_MISSING");
  }
  return status.latestVersion;
}

function extractZip(zipPath: string, destination: string): void {
  fs.mkdirSync(destination, { recursive: true });
  const result = process.platform === "win32"
    ? spawnSync(
        "powershell.exe",
        [
          "-NoProfile",
          "-NonInteractive",
          "-ExecutionPolicy",
          "Bypass",
          "-Command",
          "Expand-Archive -LiteralPath $args[0] -DestinationPath $args[1] -Force",
          zipPath,
          destination
        ],
        { encoding: "utf8", windowsHide: true }
      )
    : spawnSync(
        "unzip",
        ["-q", zipPath, "-d", destination],
        { encoding: "utf8" }
      );
  if (result.status !== 0) {
    throw new Error(
      `SKILL_UPDATE_EXTRACT_FAILED:${result.stderr || result.stdout || result.status}`
    );
  }
}

function skillFileSha256(
  filePath: string
): string {
  return createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");
}

export function validateSkillCandidateAgainstIndex(
  registry: LexSkillRegistry,
  index: SkillUpdateIndex
): void {
  const actualIds = [
    ...registry.skills.keys()
  ].sort();
  const indexedIds =
    index.skills
      .map((skill) => skill.id)
      .sort();

  if (
    JSON.stringify(actualIds) !==
    JSON.stringify(indexedIds)
  ) {
    throw new Error(
      "SKILL_UPDATE_INDEX_SKILL_SET_MISMATCH"
    );
  }

  for (const expected of index.skills) {
    const actual =
      registry.get(expected.id);
    if (!actual) {
      throw new Error(
        "SKILL_UPDATE_INDEX_SKILL_SET_MISMATCH"
      );
    }
    const version =
      typeof actual.frontmatter.version ===
        "string"
        ? actual.frontmatter.version.trim()
        : "";
    if (version !== expected.version) {
      throw new Error(
        `SKILL_UPDATE_INDEX_VERSION_MISMATCH:${expected.id}`
      );
    }

    const actualHash =
      skillFileSha256(
        actual.skillFile
      );
    if (
      actualHash !==
      expected.sha256.toLowerCase()
    ) {
      throw new Error(
        `SKILL_UPDATE_INDEX_HASH_MISMATCH:${expected.id}`
      );
    }

    const dependencies = [
      ...new Set(
        actual.frontmatter
          .dependencies?.requires ??
          []
      )
    ].sort();
    if (
      JSON.stringify(dependencies) !==
      JSON.stringify(
        [...expected.dependencies]
          .sort()
      )
    ) {
      throw new Error(
        `SKILL_UPDATE_INDEX_DEPENDENCY_MISMATCH:${expected.id}`
      );
    }
  }
}

function locateSkillRoot(stage: string): string {
  for (const candidate of [
    path.join(stage, "Wersja rozwojowa rozpakowana"),
    path.join(stage, "corpus"),
    stage
  ]) {
    if (!fs.existsSync(candidate) || !fs.statSync(candidate).isDirectory()) {
      continue;
    }
    const registry = new LexSkillRegistry(candidate);
    const issues = [
      ...registry.scan(),
      ...registry.validateDeclarations()
    ];
    if (registry.skills.size > 0 && issues.length === 0) {
      return candidate;
    }
  }
  throw new Error("SKILL_UPDATE_CORPUS_INVALID");
}

export class MaintenanceService {
  constructor(
    private readonly discovery: UpdateDiscovery,
    private readonly fetchImpl: typeof fetch = fetch,
    private readonly installerVerifier: ApplicationInstallerVerifier =
      new WindowsAuthenticodeInstallerVerifier(),
    private readonly skillTrustReady:
      () => boolean =
        skillUpdateTrustReady,
    private readonly skillIndexVerifier:
      (
        indexBytes: Uint8Array,
        signatureBytes: Uint8Array
      ) => VerifiedSkillIndex =
        (indexBytes, signatureBytes) =>
          verifySkillUpdateIndex(
            indexBytes,
            signatureBytes
          ),
    private readonly modelPackTrustPolicyReady:
      () => boolean =
        modelPackTrustReady,
    private readonly modelPackIndexVerifier:
      (
        indexBytes: Uint8Array,
        signatureBytes: Uint8Array
      ) => VerifiedModelPackIndex =
        (indexBytes, signatureBytes) =>
          verifyModelPackIndex(
            indexBytes,
            signatureBytes
          )
  ) {}

  async applicationStatus(): Promise<UpdateDiscoveryResult> {
    return await this.discovery.check();
  }

  async downloadApplicationUpdate(): Promise<ApplicationUpdateDownload> {
    const status = await this.discovery.check();
    if (status.status !== "AVAILABLE") {
      throw new Error("APPLICATION_UPDATE_NOT_AVAILABLE");
    }
    if (!status.installer) {
      throw new Error("APPLICATION_UPDATE_INSTALLER_NOT_VERIFIED");
    }
    const version = requireLatestVersion(status);
    const bytes = await downloadVerified(status.installer, this.fetchImpl);
    const root = applicationUpdateStagingRoot();
    fs.mkdirSync(root, { recursive: true });
    const nonce = randomBytes(8).toString("hex");
    const token = `update_${version.replaceAll(".", "-")}_${nonce}.exe`;
    const receiptToken = token.replace(/\.exe$/i, ".json");
    const target = path.join(root, token);
    const temporary = `${target}.tmp`;
    const receiptPath = path.join(root, receiptToken);
    const receiptTemporary = `${receiptPath}.tmp`;

    try {
      fs.writeFileSync(temporary, bytes, { flag: "wx" });
      fs.renameSync(temporary, target);
      const publisher =
        this.installerVerifier.verify(
          target,
          version
        );
      const stagedAt = new Date().toISOString();
      const receipt: ApplicationUpdateReceipt = {
        schemaVersion: 1,
        kind: "LEX_MACHINA_APPLICATION_UPDATE",
        version,
        installerToken: token,
        originalFilename: status.installer.name,
        sha256: status.installer.sha256.toLowerCase(),
        bytes: bytes.byteLength,
        stagedAt,
        publisher
      };
      fs.writeFileSync(
        receiptTemporary,
        `${JSON.stringify(receipt, null, 2)}\n`,
        { encoding: "utf8", flag: "wx" }
      );
      fs.renameSync(receiptTemporary, receiptPath);
      return {
        version,
        token,
        receiptToken,
        filename: status.installer.name,
        sha256: status.installer.sha256.toLowerCase(),
        bytes: bytes.byteLength,
        stagedAt,
        publisher
      };
    } catch (error) {
      fs.rmSync(temporary, { force: true });
      fs.rmSync(receiptTemporary, { force: true });
      fs.rmSync(receiptPath, { force: true });
      fs.rmSync(target, { force: true });
      throw error;
    }
  }

  async skillStatus(): Promise<SkillUpdateStatus> {
    const status = await this.discovery.check();
    const currentVersion =
      installedSkillOverlayVersion() ??
      CURRENT_APPLICATION_VERSION;
    const latestVersion = status.latestVersion;
    const available =
      Boolean(status.skillsBundle && latestVersion) &&
      compareVersions(currentVersion, latestVersion!) < 0;
    const signedAssetsReady = Boolean(
      status.skillsBundle &&
      status.skillsIndex &&
      status.skillsSignature
    );
    const verificationReady =
      this.skillTrustReady();
    return {
      currentVersion,
      status:
        status.status === "UNAVAILABLE" || status.status === "NO_RELEASE"
          ? "UNAVAILABLE"
          : available
            ? "AVAILABLE"
            : "UP_TO_DATE",
      ...(latestVersion ? { latestVersion } : {}),
      checkedAt: status.checkedAt,
      bundleReady:
        signedAssetsReady &&
        verificationReady,
      verificationReady,
      ...(available && !signedAssetsReady
        ? {
            blockedReason:
              "SIGNED_INDEX_MISSING" as const
          }
        : available && !verificationReady
          ? {
              blockedReason:
                "SIGNER_POLICY_MISSING" as const
            }
          : {})
    };
  }

  async verifiedModelPackTarget(
    modelId: string
  ): Promise<VerifiedModelPackTarget> {
    const status =
      await this.discovery.check();
    if (
      !status.modelPackIndex ||
      !status.modelPackSignature
    ) {
      throw new Error(
        "MODEL_PACK_SIGNED_INDEX_MISSING"
      );
    }
    if (
      !this.modelPackTrustPolicyReady()
    ) {
      throw new Error(
        "MODEL_PACK_SIGNER_POLICY_MISSING"
      );
    }

    const [
      indexBytes,
      signatureBytes
    ] = await Promise.all([
      downloadVerified(
        status.modelPackIndex,
        this.fetchImpl
      ),
      downloadVerified(
        status.modelPackSignature,
        this.fetchImpl
      )
    ]);
    const verified =
      this.modelPackIndexVerifier(
        indexBytes,
        signatureBytes
      );
    const index =
      verified.index;

    if (
      compareVersions(
        CURRENT_APPLICATION_VERSION,
        index.compatibility
          .minAppVersion
      ) < 0 ||
      (
        index.compatibility
          .maxAppVersion &&
        compareVersions(
          CURRENT_APPLICATION_VERSION,
          index.compatibility
            .maxAppVersion
        ) > 0
      )
    ) {
      throw new Error(
        "MODEL_PACK_APP_INCOMPATIBLE"
      );
    }

    const model =
      index.models.find(
        (item) =>
          item.id === modelId
      );
    if (!model) {
      throw new Error(
        "MODEL_PACK_MODEL_NOT_IN_INDEX"
      );
    }

    return {
      packVersion:
        index.version,
      signerKeyId:
        verified.signerKeyId,
      indexSha256:
        verified.indexSha256,
      model
    };
  }

  async modelPackStatus(
    installed:
      | {
          modelId: string;
          sha256: string;
          packVersion?: string;
        }
      | null
  ): Promise<ModelPackUpdateStatus> {
    const discovery =
      await this.discovery.check();
    const verificationReady =
      this.modelPackTrustPolicyReady();

    if (!installed) {
      return {
        status:
          "NOT_CONFIGURED",
        checkedAt:
          discovery.checkedAt,
        verificationReady
      };
    }

    if (
      discovery.status ===
        "UNAVAILABLE" ||
      discovery.status ===
        "NO_RELEASE"
    ) {
      return {
        status:
          "UNAVAILABLE",
        checkedAt:
          discovery.checkedAt,
        modelId:
          installed.modelId,
        currentSha256:
          installed.sha256,
        verificationReady
      };
    }

    if (
      !discovery.modelPackIndex ||
      !discovery.modelPackSignature
    ) {
      return {
        status: "BLOCKED",
        checkedAt:
          discovery.checkedAt,
        modelId:
          installed.modelId,
        currentSha256:
          installed.sha256,
        verificationReady,
        blockedReason:
          "SIGNED_INDEX_MISSING"
      };
    }

    if (!verificationReady) {
      return {
        status: "BLOCKED",
        checkedAt:
          discovery.checkedAt,
        modelId:
          installed.modelId,
        currentSha256:
          installed.sha256,
        verificationReady,
        blockedReason:
          "SIGNER_POLICY_MISSING"
      };
    }

    try {
      const target =
        await this
          .verifiedModelPackTarget(
            installed.modelId
          );
      if (
        installed.packVersion
      ) {
        const packComparison =
          compareVersions(
            target.packVersion,
            installed.packVersion
          );
        if (
          packComparison < 0
        ) {
          return {
            status: "BLOCKED",
            checkedAt:
              discovery.checkedAt,
            modelId:
              installed.modelId,
            currentSha256:
              installed.sha256
                .toLowerCase(),
            latestPackVersion:
              target.packVersion,
            targetSha256:
              target.model.sha256,
            verificationReady:
              true,
            signerKeyId:
              target.signerKeyId,
            blockedReason:
              "PACK_VERSION_ROLLBACK"
          };
        }
        if (
          packComparison === 0 &&
          target.model.sha256 !==
            installed.sha256
              .toLowerCase()
        ) {
          return {
            status: "BLOCKED",
            checkedAt:
              discovery.checkedAt,
            modelId:
              installed.modelId,
            currentSha256:
              installed.sha256
                .toLowerCase(),
            latestPackVersion:
              target.packVersion,
            targetSha256:
              target.model.sha256,
            verificationReady:
              true,
            signerKeyId:
              target.signerKeyId,
            blockedReason:
              "PACK_VERSION_HASH_CONFLICT"
          };
        }
      }

      const available =
        target.model.sha256 !==
          installed.sha256
            .toLowerCase();
      return {
        status:
          available
            ? "AVAILABLE"
            : "UP_TO_DATE",
        checkedAt:
          discovery.checkedAt,
        modelId:
          installed.modelId,
        currentSha256:
          installed.sha256
            .toLowerCase(),
        latestPackVersion:
          target.packVersion,
        targetSha256:
          target.model.sha256,
        verificationReady:
          true,
        signerKeyId:
          target.signerKeyId
      };
    } catch (error) {
      const code =
        error instanceof Error
          ? error.message
          : String(error);
      const blockedReason:
        ModelPackUpdateStatus["blockedReason"] =
        code ===
          "MODEL_PACK_APP_INCOMPATIBLE"
          ? "APP_INCOMPATIBLE"
          : code ===
              "MODEL_PACK_MODEL_NOT_IN_INDEX"
            ? "MODEL_NOT_IN_INDEX"
            : "INDEX_INVALID";
      return {
        status: "BLOCKED",
        checkedAt:
          discovery.checkedAt,
        modelId:
          installed.modelId,
        currentSha256:
          installed.sha256,
        verificationReady:
          true,
        blockedReason
      };
    }
  }

  async applySkillUpdate(): Promise<SkillUpdateApplyResult> {
    const status = await this.discovery.check();
    const version = requireLatestVersion(status);
    const previousVersion =
      installedSkillOverlayVersion() ??
      CURRENT_APPLICATION_VERSION;
    if (compareVersions(previousVersion, version) >= 0) {
      throw new Error("SKILL_UPDATE_NOT_AVAILABLE");
    }
    if (!status.skillsBundle) {
      throw new Error("SKILL_UPDATE_BUNDLE_NOT_VERIFIED");
    }
    if (
      !status.skillsIndex ||
      !status.skillsSignature
    ) {
      throw new Error(
        "SKILL_UPDATE_SIGNED_INDEX_MISSING"
      );
    }
    if (!this.skillTrustReady()) {
      throw new Error(
        "SKILL_UPDATE_SIGNER_POLICY_MISSING"
      );
    }

    const [
      indexBytes,
      signatureBytes
    ] = await Promise.all([
      downloadVerified(
        status.skillsIndex,
        this.fetchImpl
      ),
      downloadVerified(
        status.skillsSignature,
        this.fetchImpl
      )
    ]);
    const verifiedIndex =
      this.skillIndexVerifier(
        indexBytes,
        signatureBytes
      );
    const index =
      verifiedIndex.index;

    if (index.version !== version) {
      throw new Error(
        "SKILL_UPDATE_INDEX_RELEASE_VERSION_MISMATCH"
      );
    }
    if (
      compareVersions(
        CURRENT_APPLICATION_VERSION,
        index.compatibility.minAppVersion
      ) < 0 ||
      (
        index.compatibility.maxAppVersion &&
        compareVersions(
          CURRENT_APPLICATION_VERSION,
          index.compatibility.maxAppVersion
        ) > 0
      )
    ) {
      throw new Error(
        "SKILL_UPDATE_APP_INCOMPATIBLE"
      );
    }
    if (
      index.bundle.filename !==
        status.skillsBundle.name ||
      index.bundle.sha256 !==
        status.skillsBundle.sha256
          .toLowerCase() ||
      (
        status.skillsBundle.bytes !==
          undefined &&
        index.bundle.bytes !==
          status.skillsBundle.bytes
      )
    ) {
      throw new Error(
        "SKILL_UPDATE_INDEX_BUNDLE_MISMATCH"
      );
    }

    const bytes = await downloadVerified(
      status.skillsBundle,
      this.fetchImpl
    );
    if (
      sha256(bytes) !==
        index.bundle.sha256 ||
      bytes.byteLength !==
        index.bundle.bytes
    ) {
      throw new Error(
        "SKILL_UPDATE_SIGNED_BUNDLE_MISMATCH"
      );
    }
    const skillsRoot = path.join(localAppDataRoot(), "skills");
    const workRoot = path.join(
      skillsRoot,
      `update-${Date.now()}-${randomBytes(4).toString("hex")}`
    );
    const zipPath = path.join(workRoot, "skills.zip");
    const extracted = path.join(workRoot, "extracted");
    const candidate = path.join(workRoot, "candidate");
    fs.mkdirSync(workRoot, { recursive: true });
    fs.writeFileSync(zipPath, bytes);
    extractZip(zipPath, extracted);
    const sourceRoot = locateSkillRoot(extracted);
    fs.cpSync(sourceRoot, candidate, { recursive: true, force: true });

    const validation = new LexSkillRegistry(candidate);
    const issues = [
      ...validation.scan(),
      ...validation.validateDeclarations()
    ];
    if (validation.skills.size === 0 || issues.length > 0) {
      fs.rmSync(workRoot, { recursive: true, force: true });
      throw new Error("SKILL_UPDATE_VALIDATION_FAILED");
    }
    try {
      validateSkillCandidateAgainstIndex(
        validation,
        index
      );
    } catch (error) {
      fs.rmSync(
        workRoot,
        {
          recursive: true,
          force: true
        }
      );
      throw error;
    }

    const installedAt = new Date().toISOString();
    fs.writeFileSync(
      markerPath(candidate),
      JSON.stringify(
        {
          version,
          installedAt,
          indexSha256:
            verifiedIndex.indexSha256,
          signerKeyId:
            verifiedIndex.signerKeyId
        },
        null,
        2
      ),
      "utf8"
    );

    const current = installedSkillOverlayRoot();
    const backup = installedSkillOverlayPreviousRoot();
    fs.rmSync(backup, { recursive: true, force: true });
    if (fs.existsSync(current)) {
      fs.renameSync(current, backup);
    }
    try {
      fs.renameSync(candidate, current);
      writeSkillHealthMarker(
        current,
        {
          health:
            "PENDING_RESTART_VALIDATION"
        }
      );
    } catch (error) {
      fs.rmSync(current, { recursive: true, force: true });
      if (fs.existsSync(backup)) {
        fs.renameSync(backup, current);
      }
      throw error;
    } finally {
      fs.rmSync(workRoot, { recursive: true, force: true });
    }

    return {
      previousVersion,
      installedVersion: version,
      installedAt,
      restartRequired: true,
      skillRoot: current
    };
  }
}
