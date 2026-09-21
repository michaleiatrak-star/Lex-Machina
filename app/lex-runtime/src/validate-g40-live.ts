import {
  LegalFederationToolRuntime
} from "./legal-federation-tool-runtime.js";

const SOURCES = [
  "saos",
  "nsa",
  "isap",
  "krs",
  "eureka",
  "kio",
  "uodo",
  "eu-sparql",
  "eu-compliance",
  "legalize"
] as const;

async function main():
  Promise<void> {
  const runtime =
    new LegalFederationToolRuntime();

  try {
    const [coverage] =
      await runtime.runTools([
        {
          id:
            "g40-coverage",
          name:
            "federated_legal_coverage",
          input: {}
        }
      ]);

    if (
      !coverage ||
      coverage.content.includes(
        "SOURCE_UNAVAILABLE"
      )
    ) {
      throw new Error(
        "G40_COVERAGE_FAILED"
      );
    }

    for (
      const source
      of SOURCES
    ) {
      const [result] =
        await runtime.runTools([
          {
            id:
              "g40-" +
              source,
            name:
              "list_federated_legal_sources",
            input: {
              sourceId:
                source
            }
          }
        ]);

      if (!result) {
        throw new Error(
          "G40_SOURCE_NO_RESULT:" +
            source
        );
      }

      if (
        result.content.includes(
          "SOURCE_UNAVAILABLE"
        ) ||
        result.content.includes(
          "[source_unavailable]"
        )
      ) {
        throw new Error(
          "G40_SOURCE_UNAVAILABLE:" +
            source +
            ":" +
            result.content.slice(
              0,
              800
            )
        );
      }

      console.log(
        "G40_SOURCE_PASS",
        source
      );
    }

    console.log(
      "G40_LEGAL_MCP_FLEET_PASS",
      SOURCES.join(",")
    );
  } finally {
    await runtime.close();
  }
}

main().catch(
  (error) => {
    console.error(
      error instanceof Error
        ? error.stack ??
          error.message
        : String(
            error
          )
    );
    process.exitCode = 1;
  }
);
