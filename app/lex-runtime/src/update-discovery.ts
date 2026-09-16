export const CURRENT_APPLICATION_VERSION =
  "0.1.0";

export type UpdateAvailability =
  | "NO_RELEASE"
  | "UP_TO_DATE"
  | "AVAILABLE"
  | "UNAVAILABLE";

export type UpdateDiscoveryResult = {
  currentVersion: string;
  status: UpdateAvailability;
  checkedAt: string;
  latestVersion?: string;
  releaseUrl?: string;
  releaseName?: string;
  publishedAt?: string;
};

export interface UpdateDiscovery {
  check(): Promise<UpdateDiscoveryResult>;
}

type GitHubRelease = {
  tag_name?: unknown;
  html_url?: unknown;
  name?: unknown;
  published_at?: unknown;
  draft?: unknown;
  prerelease?: unknown;
};

function parseSemver(
  value: string
): [number, number, number] | null {
  const match =
    /^(\d+)\.(\d+)\.(\d+)$/
      .exec(value);
  if (!match) return null;
  const parts = match
    .slice(1)
    .map(Number);
  if (
    parts.some(
      (part) =>
        !Number.isSafeInteger(
          part
        ) ||
        part < 0
    )
  ) {
    return null;
  }
  return [
    parts[0]!,
    parts[1]!,
    parts[2]!
  ];
}

export function compareVersions(
  left: string,
  right: string
): number {
  const a = parseSemver(left);
  const b = parseSemver(right);
  if (!a || !b) {
    throw new Error(
      "INVALID_APPLICATION_VERSION"
    );
  }
  for (
    let index = 0;
    index < 3;
    index += 1
  ) {
    if (a[index]! < b[index]!) {
      return -1;
    }
    if (a[index]! > b[index]!) {
      return 1;
    }
  }
  return 0;
}

function releaseVersion(
  tag: string
): string | null {
  const normalized =
    tag.startsWith("v")
      ? tag.slice(1)
      : tag;
  return parseSemver(
    normalized
  )
    ? normalized
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
      url.hostname ===
        "github.com" &&
      url.pathname.startsWith(
        `/${repository}/releases/`
      )
    );
  } catch {
    return false;
  }
}

export class GitHubReleaseUpdateDiscovery
implements UpdateDiscovery {
  constructor(
    private readonly currentVersion:
      string =
        CURRENT_APPLICATION_VERSION,
    private readonly repository:
      string =
        "michaleiatrak-star/Lex-Machina",
    private readonly fetchImpl:
      typeof fetch =
        fetch,
    private readonly now:
      () => number =
        () => Date.now(),
    private readonly includePrerelease =
      false
  ) {
    if (
      !parseSemver(
        this.currentVersion
      ) ||
      !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/
        .test(
          this.repository
        )
    ) {
      throw new Error(
        "INVALID_UPDATE_DISCOVERY_CONFIG"
      );
    }
  }

  async check():
    Promise<UpdateDiscoveryResult> {
    const checkedAt =
      new Date(
        this.now()
      ).toISOString();
    try {
      const response =
        await this.fetchImpl(
          `https://api.github.com/repos/${this.repository}/releases?per_page=20`,
          {
            headers: {
              Accept:
                "application/vnd.github+json",
              "X-GitHub-Api-Version":
                "2022-11-28"
            }
          }
        );
      if (!response.ok) {
        return {
          currentVersion:
            this.currentVersion,
          status:
            "UNAVAILABLE",
          checkedAt
        };
      }

      const payload =
        await response.json();
      if (
        !Array.isArray(
          payload
        )
      ) {
        return {
          currentVersion:
            this.currentVersion,
          status:
            "UNAVAILABLE",
          checkedAt
        };
      }

      const candidates =
        (payload as GitHubRelease[])
          .flatMap(
            (release) => {
              if (
                release.draft ===
                  true ||
                (
                  !this
                    .includePrerelease &&
                  release
                    .prerelease ===
                    true
                ) ||
                typeof release
                  .tag_name !==
                  "string" ||
                typeof release
                  .html_url !==
                  "string" ||
                !trustedReleaseUrl(
                  release.html_url,
                  this.repository
                )
              ) {
                return [];
              }
              const version =
                releaseVersion(
                  release.tag_name
                );
              if (!version) {
                return [];
              }
              return [{
                version,
                releaseUrl:
                  release.html_url,
                ...(typeof release
                  .name ===
                  "string" &&
                release.name.trim()
                  ? {
                      releaseName:
                        release.name
                          .trim()
                          .slice(
                            0,
                            200
                          )
                    }
                  : {}),
                ...(typeof release
                  .published_at ===
                  "string" &&
                !Number.isNaN(
                  Date.parse(
                    release
                      .published_at
                  )
                )
                  ? {
                      publishedAt:
                        new Date(
                          release
                            .published_at
                        )
                          .toISOString()
                    }
                  : {})
              }];
            }
          )
          .sort(
            (a, b) =>
              compareVersions(
                b.version,
                a.version
              )
          );

      const latest =
        candidates[0];
      if (!latest) {
        return {
          currentVersion:
            this.currentVersion,
          status:
            "NO_RELEASE",
          checkedAt
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
          : {})
      };
    } catch {
      return {
        currentVersion:
          this.currentVersion,
        status:
          "UNAVAILABLE",
        checkedAt
      };
    }
  }
}
