export const CURRENT_APPLICATION_VERSION =
  "0.1.5";

export type UpdateAvailability =
  | "NO_RELEASE"
  | "UP_TO_DATE"
  | "AVAILABLE"
  | "UNAVAILABLE";

export type VerifiedReleaseAsset = {
  name: string;
  url: string;
  sha256: string;
  bytes?: number;
};

export type UpdateDiscoveryResult = {
  currentVersion: string;
  status: UpdateAvailability;
  checkedAt: string;
  latestVersion?: string;
  latestSkillVersion?: string;
  releaseUrl?: string;
  releaseName?: string;
  publishedAt?: string;
  installer?: VerifiedReleaseAsset;
  skillsBundle?: VerifiedReleaseAsset;
  skillsIndex?: VerifiedReleaseAsset;
  skillsSignature?: VerifiedReleaseAsset;
  modelPackIndex?: VerifiedReleaseAsset;
  modelPackSignature?: VerifiedReleaseAsset;
};

export interface UpdateDiscovery {
  check(): Promise<UpdateDiscoveryResult>;
}

type GitHubAsset = {
  name?: unknown;
  browser_download_url?: unknown;
  digest?: unknown;
  size?: unknown;
};

type GitHubRelease = {
  tag_name?: unknown;
  html_url?: unknown;
  name?: unknown;
  published_at?: unknown;
  draft?: unknown;
  prerelease?: unknown;
  assets?: unknown;
};

function parseSemver(
  value: string
): [number, number, number] | null {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(value);
  if (!match) return null;
  const parts = match.slice(1).map(Number);
  if (
    parts.some(
      (part) => !Number.isSafeInteger(part) || part < 0
    )
  ) {
    return null;
  }
  return [parts[0]!, parts[1]!, parts[2]!];
}

export function compareVersions(
  left: string,
  right: string
): number {
  const a = parseSemver(left);
  const b = parseSemver(right);
  if (!a || !b) {
    throw new Error("INVALID_APPLICATION_VERSION");
  }
  for (let index = 0; index < 3; index += 1) {
    if (a[index]! < b[index]!) return -1;
    if (a[index]! > b[index]!) return 1;
  }
  return 0;
}

function releaseVersion(tag: string): string | null {
  const normalized = tag.startsWith("v") ? tag.slice(1) : tag;
  return parseSemver(normalized) ? normalized : null;
}

function skillPackReleaseVersion(
  tag: string
): string | null {
  const match =
    /^(?:skill-pack|skills)-v?(\d+\.\d+\.\d+)$/i.exec(
      tag
    );
  if (!match) {
    return null;
  }
  return parseSemver(
    match[1]!
  )
    ? match[1]!
    : null;
}

function modelPackReleaseVersion(
  tag: string
): string | null {
  const match =
    /^model-pack-v?(\d+\.\d+\.\d+)$/i.exec(
      tag
    );
  if (!match) {
    return null;
  }
  return parseSemver(
    match[1]!
  )
    ? match[1]!
    : null;
}

function trustedReleaseUrl(
  value: string,
  repository: string
): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "github.com" &&
      url.pathname.startsWith(`/${repository}/releases/`)
    );
  } catch {
    return false;
  }
}

function verifiedAsset(
  value: unknown,
  repository: string
): VerifiedReleaseAsset | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const asset = value as GitHubAsset;
  if (
    typeof asset.name !== "string" ||
    typeof asset.browser_download_url !== "string" ||
    typeof asset.digest !== "string" ||
    !trustedReleaseUrl(asset.browser_download_url, repository)
  ) {
    return null;
  }
  const digest = /^sha256:([a-fA-F0-9]{64})$/.exec(asset.digest);
  if (!digest) return null;
  return {
    name: asset.name,
    url: asset.browser_download_url,
    sha256: digest[1]!.toLowerCase(),
    ...(typeof asset.size === "number" && Number.isSafeInteger(asset.size)
      ? { bytes: asset.size }
      : {})
  };
}

function chooseAssets(
  release: GitHubRelease,
  repository: string
): {
  installer?: VerifiedReleaseAsset;
  skillsBundle?: VerifiedReleaseAsset;
  skillsIndex?: VerifiedReleaseAsset;
  skillsSignature?: VerifiedReleaseAsset;
  modelPackIndex?: VerifiedReleaseAsset;
  modelPackSignature?: VerifiedReleaseAsset;
} {
  const assets = Array.isArray(release.assets)
    ? release.assets
        .map((asset) => verifiedAsset(asset, repository))
        .filter((asset): asset is VerifiedReleaseAsset => Boolean(asset))
    : [];

  const installer =
    assets.find((asset) =>
      /lexmachina.*windows.*online.*installer.*\.exe$/i.test(asset.name)
    ) ??
    assets.find((asset) =>
      /lex.?machina.*setup.*\.exe$/i.test(asset.name)
    ) ??
    assets.find((asset) =>
      /lex.?machina.*\.exe$/i.test(asset.name) &&
      !/offline/i.test(asset.name)
    );

  const skillsBundle = assets.find((asset) =>
    /lex.?machina.*skills.*\.zip$/i.test(asset.name)
  );
  const skillsIndex = assets.find((asset) =>
    /^LexMachina-Skills-Index\.json$/i.test(asset.name)
  );
  const skillsSignature = assets.find((asset) =>
    /^LexMachina-Skills-Index\.sig$/i.test(asset.name)
  );
  const modelPackIndex = assets.find((asset) =>
    /^LexMachina-ModelPack-Index\.json$/i.test(asset.name)
  );
  const modelPackSignature = assets.find((asset) =>
    /^LexMachina-ModelPack-Index\.sig$/i.test(asset.name)
  );

  return {
    ...(installer ? { installer } : {}),
    ...(skillsBundle ? { skillsBundle } : {}),
    ...(skillsIndex ? { skillsIndex } : {}),
    ...(skillsSignature ? { skillsSignature } : {}),
    ...(modelPackIndex ? { modelPackIndex } : {}),
    ...(modelPackSignature ? { modelPackSignature } : {})
  };
}

export class GitHubReleaseUpdateDiscovery
implements UpdateDiscovery {
  constructor(
    private readonly currentVersion: string = CURRENT_APPLICATION_VERSION,
    private readonly repository: string = "michaleiatrak-star/Lex-Machina",
    private readonly fetchImpl: typeof fetch = fetch,
    private readonly now: () => number = () => Date.now(),
    private readonly includePrerelease = false
  ) {
    if (
      !parseSemver(this.currentVersion) ||
      !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(this.repository)
    ) {
      throw new Error("INVALID_UPDATE_DISCOVERY_CONFIG");
    }
  }

  async check(): Promise<UpdateDiscoveryResult> {
    const checkedAt = new Date(this.now()).toISOString();
    try {
      const response = await this.fetchImpl(
        `https://api.github.com/repos/${this.repository}/releases?per_page=20`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
          }
        }
      );
      if (!response.ok) {
        return {
          currentVersion: this.currentVersion,
          status: "UNAVAILABLE",
          checkedAt
        };
      }

      const payload = await response.json();
      if (!Array.isArray(payload)) {
        return {
          currentVersion: this.currentVersion,
          status: "UNAVAILABLE",
          checkedAt
        };
      }

      const releases =
        payload as GitHubRelease[];
      const eligible = (
        release: GitHubRelease
      ) =>
        release.draft !== true &&
        (
          this.includePrerelease ||
          release.prerelease !==
            true
        ) &&
        typeof release.tag_name ===
          "string" &&
        typeof release.html_url ===
          "string" &&
        trustedReleaseUrl(
          release.html_url,
          this.repository
        );

      const candidates = releases
        .flatMap((release) => {
          if (!eligible(release)) {
            return [];
          }
          const version =
            releaseVersion(
              release.tag_name as string
            );
          if (!version) {
            return [];
          }
          return [{
            version,
            releaseUrl:
              release.html_url as string,
            release,
            ...(typeof release.name === "string" && release.name.trim()
              ? { releaseName: release.name.trim().slice(0, 200) }
              : {}),
            ...(typeof release.published_at === "string" &&
            !Number.isNaN(Date.parse(release.published_at))
              ? {
                  publishedAt: new Date(release.published_at).toISOString()
                }
              : {})
          }];
        })
        .sort((a, b) =>
          compareVersions(
            b.version,
            a.version
          )
        );

      const skillPackCandidates =
        releases
          .flatMap((release) => {
            if (!eligible(release)) {
              return [];
            }
            const version =
              skillPackReleaseVersion(
                release.tag_name as string
              );
            if (!version) {
              return [];
            }
            const assets =
              chooseAssets(
                release,
                this.repository
              );
            if (
              !assets.skillsBundle ||
              !assets.skillsIndex
            ) {
              return [];
            }
            return [{
              version,
              release,
              assets
            }];
          })
          .sort((a, b) =>
            compareVersions(
              b.version,
              a.version
            )
          );

      const modelPackCandidates =
        releases
          .flatMap((release) => {
            if (!eligible(release)) {
              return [];
            }
            const version =
              modelPackReleaseVersion(
                release.tag_name as string
              );
            if (!version) {
              return [];
            }
            const assets =
              chooseAssets(
                release,
                this.repository
              );
            if (
              !assets.modelPackIndex ||
              !assets.modelPackSignature
            ) {
              return [];
            }
            return [{
              version,
              release,
              assets
            }];
          })
          .sort((a, b) =>
            compareVersions(
              b.version,
              a.version
            )
          );

      const latest =
        candidates[0];
      const dedicatedSkillPack =
        skillPackCandidates[0];
      const dedicatedModelPack =
        modelPackCandidates[0];
      const applicationAssets =
        latest
          ? chooseAssets(
              latest.release,
              this.repository
            )
          : {};
      const skillPackAssets =
        dedicatedSkillPack
          ? {
              latestSkillVersion:
                dedicatedSkillPack.version,
              skillsBundle:
                dedicatedSkillPack
                  .assets
                  .skillsBundle!,
              skillsIndex:
                dedicatedSkillPack
                  .assets
                  .skillsIndex!,
              ...(dedicatedSkillPack
                .assets
                .skillsSignature
                ? {
                    skillsSignature:
                      dedicatedSkillPack
                        .assets
                        .skillsSignature
                  }
                : {})
            }
          : (
              applicationAssets
                .skillsBundle &&
              applicationAssets
                .skillsIndex &&
              latest
                ? {
                    latestSkillVersion:
                      latest.version,
                    skillsBundle:
                      applicationAssets
                        .skillsBundle,
                    skillsIndex:
                      applicationAssets
                        .skillsIndex,
                    ...(applicationAssets
                      .skillsSignature
                      ? {
                          skillsSignature:
                            applicationAssets
                              .skillsSignature
                        }
                      : {})
                  }
                : {}
            );
      const modelPackAssets =
        dedicatedModelPack
          ? {
              modelPackIndex:
                dedicatedModelPack
                  .assets
                  .modelPackIndex!,
              modelPackSignature:
                dedicatedModelPack
                  .assets
                  .modelPackSignature!
            }
          : {
              ...(applicationAssets
                .modelPackIndex
                ? {
                    modelPackIndex:
                      applicationAssets
                        .modelPackIndex
                  }
                : {}),
              ...(applicationAssets
                .modelPackSignature
                ? {
                    modelPackSignature:
                      applicationAssets
                        .modelPackSignature
                  }
                : {})
            };

      if (!latest) {
        return {
          currentVersion:
            this.currentVersion,
          status: "NO_RELEASE",
          checkedAt,
          ...skillPackAssets,
          ...modelPackAssets
        };
      }

      const comparison =
        compareVersions(
          this.currentVersion,
          latest.version
        );
      return {
        currentVersion:
          this.currentVersion,
        status:
          comparison < 0
            ? "AVAILABLE"
            : "UP_TO_DATE",
        checkedAt,
        latestVersion:
          latest.version,
        releaseUrl:
          latest.releaseUrl,
        ...(latest.releaseName
          ? {
              releaseName:
                latest.releaseName
            }
          : {}),
        ...(latest.publishedAt
          ? {
              publishedAt:
                latest.publishedAt
            }
          : {}),
        ...(applicationAssets.installer
          ? {
              installer:
                applicationAssets
                  .installer
            }
          : {}),
        ...skillPackAssets,
        ...modelPackAssets
      };
    } catch {
      return {
        currentVersion: this.currentVersion,
        status: "UNAVAILABLE",
        checkedAt
      };
    }
  }
}
