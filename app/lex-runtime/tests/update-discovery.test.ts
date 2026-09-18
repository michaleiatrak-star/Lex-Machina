import {
  describe,
  expect,
  it,
  vi
} from "vitest";
import {
  GitHubReleaseUpdateDiscovery,
  compareVersions
} from "../src/update-discovery.js";

describe("GitHub release update discovery", () => {
  it("compares strict semantic versions", () => {
    expect(
      compareVersions(
        "0.1.0",
        "0.1.1"
      )
    ).toBe(-1);
    expect(
      compareVersions(
        "1.2.3",
        "1.2.3"
      )
    ).toBe(0);
    expect(
      compareVersions(
        "2.0.0",
        "1.9.9"
      )
    ).toBe(1);
  });

  it("reports a newer trusted stable release", async () => {
    const fetchImpl =
      vi.fn(async () =>
        new Response(
          JSON.stringify([
            {
              tag_name:
                "v0.2.0",
              html_url:
                "https://github.com/michaleiatrak-star/Lex-Machina/releases/tag/v0.2.0",
              name:
                "Lex Machina 0.2.0",
              published_at:
                "2026-09-20T10:00:00Z",
              draft: false,
              prerelease: false
            }
          ]),
          { status: 200 }
        )
      ) as unknown as
        typeof fetch;

    const discovery =
      new GitHubReleaseUpdateDiscovery(
        "0.1.0",
        "michaleiatrak-star/Lex-Machina",
        fetchImpl,
        () =>
          Date.parse(
            "2026-09-21T08:00:00Z"
          )
      );

    await expect(
      discovery.check()
    ).resolves.toEqual({
      currentVersion:
        "0.1.0",
      status:
        "AVAILABLE",
      checkedAt:
        "2026-09-21T08:00:00.000Z",
      latestVersion:
        "0.2.0",
      releaseUrl:
        "https://github.com/michaleiatrak-star/Lex-Machina/releases/tag/v0.2.0",
      releaseName:
        "Lex Machina 0.2.0",
      publishedAt:
        "2026-09-20T10:00:00.000Z"
    });
  });

  it("ignores drafts, prereleases and untrusted release URLs", async () => {
    const fetchImpl =
      vi.fn(async () =>
        new Response(
          JSON.stringify([
            {
              tag_name:
                "v9.0.0",
              html_url:
                "https://evil.example/releases/v9.0.0",
              draft: false,
              prerelease: false
            },
            {
              tag_name:
                "v8.0.0",
              html_url:
                "https://github.com/michaleiatrak-star/Lex-Machina/releases/tag/v8.0.0",
              draft: true,
              prerelease: false
            },
            {
              tag_name:
                "v7.0.0",
              html_url:
                "https://github.com/michaleiatrak-star/Lex-Machina/releases/tag/v7.0.0",
              draft: false,
              prerelease: true
            }
          ]),
          { status: 200 }
        )
      ) as unknown as
        typeof fetch;

    const discovery =
      new GitHubReleaseUpdateDiscovery(
        "0.1.0",
        "michaleiatrak-star/Lex-Machina",
        fetchImpl
      );

    await expect(
      discovery.check()
    ).resolves.toMatchObject({
      currentVersion:
        "0.1.0",
      status:
        "NO_RELEASE"
    });
  });

  it("fails closed to UNAVAILABLE on network or payload errors", async () => {
    const discovery =
      new GitHubReleaseUpdateDiscovery(
        "0.1.0",
        "michaleiatrak-star/Lex-Machina",
        vi.fn(
          async () => {
            throw new Error(
              "offline"
            );
          }
        ) as unknown as
          typeof fetch
      );

    await expect(
      discovery.check()
    ).resolves.toMatchObject({
      status:
        "UNAVAILABLE"
    });
  });
});
