import {
  describe,
  expect,
  it
} from "vitest";
import {
  runGateIRuntimePrelude
} from "./gate-i-runtime-prelude.js";
import {
  VerificationLedger
} from "./verification-ledger.js";
import type {
  NormalizedToolCall,
  NormalizedToolResult
} from "./providers/types.js";

describe(
  "Gate I runtime prelude",
  () => {
    it(
      "automatically verifies a legal reference already present in the user message",
      async () => {
        const ledger =
          new VerificationLedger();
        const seen:
          NormalizedToolCall[] = [];

        const report =
          await runGateIRuntimePrelude({
            workflow:
              "STATUTE_ANALYSIS_V1",
            query:
              "Wyjaśnij art. 5 KC.",
            ledger,
            runTools:
              async (calls) => {
                seen.push(
                  ...calls
                );
                for (
                  const call
                  of calls
                ) {
                  ledger.add({
                    claim:
                      String(
                        call.input
                          .claim
                      ),
                    kind:
                      "statute",
                    status:
                      "VERIFIED",
                    sourceUrl:
                      "https://eli.gov.pl/",
                    sourceTier:
                      "R1",
                    fetchedAt:
                      "2026-09-18T12:00:00.000Z",
                    verificationMethod:
                      "web_fetch",
                    temporalMode:
                      "CURRENT",
                    temporalFreshnessStatus:
                      "CURRENT",
                    freshnessCheckedAt:
                      "2026-09-18T11:59:59.000Z"
                  });
                }
                return calls.map(
                  (
                    call
                  ): NormalizedToolResult => ({
                    tool_use_id:
                      call.id,
                    content:
                      JSON.stringify({
                        status:
                          "VERIFIED"
                      })
                  })
                );
              }
          });

        expect(report.result)
          .toBe("PASS");
        expect(seen.length)
          .toBeGreaterThan(0);
        expect(
          seen.some(
            (call) =>
              call.name ===
                "verify_legal_reference"
          )
        ).toBe(true);
        expect(report.appendix)
          .toContain(
            "PREVERIFIED USER REFERENCES"
          );
        expect(
          ledger.all()
        ).toHaveLength(
          seen.length
        );
      }
    );

    it(
      "automatically performs baseline SAOS and CBOSA discovery for case-law workflow",
      async () => {
        const ledger =
          new VerificationLedger();
        const seen:
          NormalizedToolCall[] = [];

        const report =
          await runGateIRuntimePrelude({
            workflow:
              "CASE_LAW_V1",
            query:
              "Znajdź orzeczenia o nadużyciu prawa.",
            ledger,
            runTools:
              async (calls) => {
                seen.push(
                  ...calls
                );
                return calls.map(
                  (
                    call
                  ): NormalizedToolResult => ({
                    tool_use_id:
                      call.id,
                    content:
                      JSON.stringify({
                        status: "OK",
                        source:
                          call.input
                            .source,
                        results: [],
                        verificationStatus:
                          "DISCOVERY_ONLY"
                      })
                  })
                );
              }
          });

        expect(report.result)
          .toBe("PASS");
        expect(
          seen.map(
            (call) =>
              call.input.source
          )
        ).toEqual([
          "SAOS",
          "CBOSA"
        ]);
        expect(report.appendix)
          .toContain(
            "RUNTIME CASE-LAW DISCOVERY"
          );
        expect(report.appendix)
          .toContain(
            "DISCOVERY_ONLY"
          );
      }
    );

    it(
      "permits deterministic fallback after an attempted lookup but never fabricates a result",
      async () => {
        const report =
          await runGateIRuntimePrelude({
            workflow:
              "CASE_LAW_V1",
            query:
              "Znajdź linię orzeczniczą.",
            ledger:
              new VerificationLedger(),
            runTools:
              async (calls) =>
                calls.map(
                  (
                    call
                  ): NormalizedToolResult => ({
                    tool_use_id:
                      call.id,
                    content:
                      JSON.stringify({
                        status:
                          "BLOCKED",
                        error:
                          "NETWORK_UNAVAILABLE"
                      })
                  })
                )
          });

        expect(report.result)
          .toBe("PASS");
        expect(
          report.actions
            .filter(
              (action) =>
                action.kind ===
                  "CASE_LAW_DISCOVERY"
            )
            .every(
              (action) =>
                action.result ===
                  "BLOCKED"
            )
        ).toBe(true);
        expect(report.appendix)
          .toContain(
            "RUNTIME TOOL FALLBACK"
          );
      }
    );

    it(
      "blocks when mandatory runtime tooling itself is unavailable",
      async () => {
        const report =
          await runGateIRuntimePrelude({
            workflow:
              "CASE_LAW_V1",
            query:
              "Znajdź orzeczenia.",
            ledger:
              new VerificationLedger()
          });

        expect(report.result)
          .toBe("BLOCKED");
        expect(
          report.actions[0]
            ?.detail
        ).toBe(
          "CASE_LAW_DISCOVERY_RUNTIME_UNAVAILABLE"
        );
      }
    );
  }
);
