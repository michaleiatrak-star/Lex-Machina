import {
  describe,
  expect,
  it
} from "vitest";
import {
  GitHubReleaseUpdateDiscovery
} from "./update-discovery.js";

function fakeFetch(
  payload: unknown
): typeof fetch {
  return (async () =>
    new Response(
      JSON.stringify(payload),
      {
        status: 200,
        headers: {
          "content-type":
            "application/json"
        }
      }
    )) as typeof fetch;
}

function asset(
  name: string,
  sha: string,
  tag: string
) {
  return {
    name,
    browser_download_url:
      `https://github.com/michaleiatrak-star/Lex-Machina/releases/download/${tag}/${name}`,
    digest:
      `sha256:${sha}`,
    size: 123
  };
}

describe(
  "GitHub release update discovery",
  () => {
    it(
      "discovers model-pack releases independently from application releases",
      async () => {
        const releases = [
          {
            tag_name:
              "model-pack-v0.1.7",
            html_url:
              "https://github.com/michaleiatrak-star/Lex-Machina/releases/tag/model-pack-v0.1.7",
            name:
              "Model Pack 0.1.7",
            published_at:
              "2026-09-18T09:30:00Z",
            draft: false,
            prerelease: false,
            assets: [
              asset(
                "LexMachina-ModelPack-Index.json",
                "a".repeat(64),
                "model-pack-v0.1.7"
              ),
              asset(
                "LexMachina-ModelPack-Index.sig",
                "b".repeat(64),
                "model-pack-v0.1.7"
              )
            ]
          },
          {
            tag_name: "v0.1.3",
            html_url:
              "https://github.com/michaleiatrak-star/Lex-Machina/releases/tag/v0.1.3",
            name:
              "Lex Machina 0.1.3",
            published_at:
              "2026-09-17T10:00:00Z",
            draft: false,
            prerelease: false,
            assets: [
              asset(
                "LexMachina-Windows-Online-Installer.exe",
                "c".repeat(64),
                "v0.1.3"
              )
            ]
          }
        ];

        const discovery =
          new GitHubReleaseUpdateDiscovery(
            "0.1.3",
            "michaleiatrak-star/Lex-Machina",
            fakeFetch(releases),
            () =>
              Date.parse(
                "2026-09-18T10:00:00Z"
              )
          );

        const result =
          await discovery.check();

        expect(result.status)
          .toBe("UP_TO_DATE");
        expect(
          result.latestVersion
        ).toBe("0.1.3");
        expect(
          result.modelPackIndex
            ?.name
        ).toBe(
          "LexMachina-ModelPack-Index.json"
        );
        expect(
          result.modelPackSignature
            ?.name
        ).toBe(
          "LexMachina-ModelPack-Index.sig"
        );
      }
    );

    it(
      "returns model-pack assets even when there is no application release",
      async () => {
        const releases = [
          {
            tag_name:
              "model-pack-v0.2.0",
            html_url:
              "https://github.com/michaleiatrak-star/Lex-Machina/releases/tag/model-pack-v0.2.0",
            draft: false,
            prerelease: false,
            assets: [
              asset(
                "LexMachina-ModelPack-Index.json",
                "d".repeat(64),
                "model-pack-v0.2.0"
              ),
              asset(
                "LexMachina-ModelPack-Index.sig",
                "e".repeat(64),
                "model-pack-v0.2.0"
              )
            ]
          }
        ];

        const discovery =
          new GitHubReleaseUpdateDiscovery(
            "0.1.3",
            "michaleiatrak-star/Lex-Machina",
            fakeFetch(releases)
          );

        const result =
          await discovery.check();

        expect(result.status)
          .toBe("NO_RELEASE");
        expect(
          result.modelPackIndex
        ).toBeDefined();
        expect(
          result.modelPackSignature
        ).toBeDefined();
        expect(
          result.latestVersion
        ).toBeUndefined();
      }
    );
  }
);
