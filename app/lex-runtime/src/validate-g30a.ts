import {
  CaseLawSearchService
} from "./case-law-search.js";
import {
  LegalVerificationToolRuntime
} from "./verification-tool-runtime.js";
import {
  VerificationLedger
} from "./verification-ledger.js";

const fetcher =
  async (
    input: string | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const url =
      String(input);

    if (
      url.startsWith(
        "https://www.saos.org.pl/api/search/judgments"
      )
    ) {
      return new Response(
        JSON.stringify({
          info: {
            totalResults: 1
          },
          items: [
            {
              id: 778899,
              courtType:
                "COMMON",
              judgmentDate:
                "2026-01-15",
              courtCases: [
                {
                  caseNumber:
                    "I ACa 77/26"
                }
              ],
              division: {
                court: {
                  name:
                    "Sąd Apelacyjny w Warszawie"
                }
              }
            }
          ]
        }),
        {
          status: 200,
          headers: {
            "content-type":
              "application/json"
          }
        }
      );
    }

    if (
      url ===
        "https://orzeczenia.nsa.gov.pl/cbo/search" &&
      init?.method === "POST"
    ) {
      return new Response(
        [
          "<html><body>",
          "Znaleziono 1 orzeczenie",
          '<a href="/doc/ZXCVBN1234">wynik</a>',
          "</body></html>"
        ].join(""),
        {
          status: 200
        }
      );
    }

    if (
      url ===
      "https://orzeczenia.nsa.gov.pl/doc/ZXCVBN1234"
    ) {
      return new Response(
        [
          "<html><head>",
          "<title>II SAB/Wa 77/26 - Wyrok WSA</title>",
          "</head><body><table>",
          '<tr><td class="lista-label">Sąd</td>',
          '<td class="info-list-value">Wojewódzki Sąd Administracyjny w Warszawie</td></tr>',
          '<tr><td class="lista-label">Data orzeczenia</td>',
          '<td class="info-list-value">2026-01-20</td></tr>',
          "</table></body></html>"
        ].join(""),
        {
          status: 200
        }
      );
    }

    throw new Error(
      "UNEXPECTED_G30A_URL:" +
      url
    );
  };

const searcher =
  new CaseLawSearchService(
    fetcher
  );

const runtime =
  new LegalVerificationToolRuntime(
    new VerificationLedger(),
    undefined,
    undefined,
    null,
    undefined,
    searcher
  );

const schemas =
  runtime.schemas();
const searchSchema =
  schemas.find(
    (schema) =>
      schema.function.name ===
      "search_case_law"
  );

const searchParameters =
  searchSchema
    ?.function
    .parameters as
      | {
          properties?: {
            source?: {
              enum?: unknown;
            };
          };
        }
      | undefined;

const saosTool =
  await runtime.runTools([
    {
      id: "g30a-saos",
      name:
        "search_case_law",
      input: {
        query:
          "bezpodstawne wzbogacenie",
        source:
          "SAOS",
        limit: 1
      }
    }
  ]);

const cbosaTool =
  await runtime.runTools([
    {
      id: "g30a-cbosa",
      name:
        "search_case_law",
      input: {
        query:
          "bezczynność",
        source:
          "CBOSA",
        limit: 1
      }
    }
  ]);

const saos =
  JSON.parse(
    saosTool[0]?.content ??
    "{}"
  ) as Record<string, unknown>;
const cbosa =
  JSON.parse(
    cbosaTool[0]?.content ??
    "{}"
  ) as Record<string, unknown>;

const checks = {
  providerToolExposed:
    Boolean(searchSchema),
  sourceEnum:
    JSON.stringify(
      searchParameters
        ?.properties
        ?.source
        ?.enum ?? []
    ) ===
      JSON.stringify([
        "SAOS",
        "CBOSA"
      ]),
  saosDiscovery:
    saos.status === "FOUND" &&
    saos.verificationStatus ===
      "DISCOVERY_ONLY" &&
    Array.isArray(
      saos.candidates
    ) &&
    (
      saos.candidates[0] as
        | Record<
            string,
            unknown
          >
        | undefined
    )?.contentScope ===
      "DISCOVERY",
  cbosaDiscovery:
    cbosa.status === "FOUND" &&
    cbosa.verificationStatus ===
      "DISCOVERY_ONLY" &&
    Array.isArray(
      cbosa.candidates
    ) &&
    (
      cbosa.candidates[0] as
        | Record<
            string,
            unknown
          >
        | undefined
    )?.contentScope ===
      "DISCOVERY",
  promptRequiresVerification:
    runtime
      .systemPromptAppendix()
      .includes(
        "never creates a VERIFIED ledger record"
      ),
  networkPolicyAudited:
    runtime
      .auditEvents()
      .filter(
        (event) =>
          event.tool ===
          "search_case_law"
      )
      .every(
        (event) =>
          event.decision ===
          "ALLOW"
      )
};

const pass =
  Object.values(
    checks
  ).every(Boolean);

console.log(
  JSON.stringify(
    {
      gate:
        "G30A_CASE_LAW_DISCOVERY_SAOS_CBOSA",
      result:
        pass
          ? "PASS"
          : "BLOCKED",
      checks,
      semantics: {
        search:
          "DISCOVERY_ONLY",
        citation:
          "REQUIRES_SEPARATE_VERIFICATION"
      }
    },
    null,
    2
  )
);

if (!pass) {
  process.exitCode = 1;
}
