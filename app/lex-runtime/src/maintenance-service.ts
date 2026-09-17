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
};

export type SkillUpdateApplyResult = {
  previousVersion: string;
  installedVersion: string;
  installedAt: string;
  restartRequired: true;
  skillRoot: string;
};

function localAppDataRoot(): string {
  const base = process.env.LOCALAPPDATA?.trim();
  if (base) return path.resolve(base, "LexMachina");
  return path.resolve(os.homedir(), ".lex-machina");
}

export function installedSkillOverlayRoot(): string {
  return path.join(localAppDataRoot(), "skills", "current");
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
      new WindowsAuthenticodeInstallerVerifier()
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
      const publisher = this.installerVerifier.verify(target);
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
      bundleReady: Boolean(status.skillsBundle)
    };
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

    const bytes = await downloadVerified(status.skillsBundle, this.fetchImpl);
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

    const installedAt = new Date().toISOString();
    fs.writeFileSync(
      markerPath(candidate),
      JSON.stringify({ version, installedAt }, null, 2),
      "utf8"
    );

    const current = installedSkillOverlayRoot();
    const backup = path.join(skillsRoot, "previous");
    fs.rmSync(backup, { recursive: true, force: true });
    if (fs.existsSync(current)) {
      fs.renameSync(current, backup);
    }
    try {
      fs.renameSync(candidate, current);
      fs.rmSync(backup, { recursive: true, force: true });
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
