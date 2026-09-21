import { describe, expect, it, vi } from "vitest";
import {
  OfficialLegalSourceVerifier
} from "../src/legal-source-verifier.js";
import { VerificationLedger } from "../src/verification-ledger.js";
import { LegalVerificationToolRuntime } from "../src/verification-tool-runtime.js";

describe("LegalVerificationToolRuntime", () => {
  it("publishes a tool schema without transport URL/title inputs", () => {
    const runtime = new LegalVerificationToolRuntime(
      new VerificationLedger(),
      new OfficialLegalSourceVerifier(async () =>
        new Response("", {
          status: 200,
          headers: { "content-type": "text/html" }
        })
      )
    );

    const parameters =
      runtime.schemas()[0]?.function.parameters as {
        required?: string[];
        properties?: Record<string, unknown>;
      };

    expect(parameters.required).toEqual([
      "claim",
      "kind",
      "act"
    ]);
    expect(parameters.properties).toHaveProperty("act");
    expect(parameters.properties).not.toHaveProperty("url");
    expect(parameters.properties).not.toHaveProperty(
      "expectedTitle"
    );
  });

  it("resolves KC internally and fetches the pinned official source", async () => {
    const fetcher = vi.fn(async (input: string | URL) => {
      expect(String(input)).toBe(
        "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.html"
      );
      return new Response(
        "<html><title>Kodeks cywilny</title><body><h2>Art. 5.</h2><p>Treść.</p></body></html>",
        {
          status: 200,
          headers: { "content-type": "text/html" }
        }
      );
    });

    const ledger = new VerificationLedger();
    const runtime = new LegalVerificationToolRuntime(
      ledger,
      new OfficialLegalSourceVerifier(
        fetcher,
        () => "2026-09-15T19:00:00.000Z"
      )
    );

    const [result] = await runtime.runTools([{
      id: "tool-kc-1",
      name: "verify_legal_reference",
      input: {
        claim: "art. 5 KC",
        kind: "statute",
        act: "k.c."
      }
    }]);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(JSON.parse(result?.content ?? "{}")).toMatchObject({
      status: "VERIFIED",
      act: {
        id: "KC",
        eli: "DU/2026/795"
      }
    });
    expect(ledger.latest("art. 5 KC")).toMatchObject({
      status: "VERIFIED",
      sourceUrl:
        "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.html"
    });
  });

  it("denies unknown acts before any network fetch", async () => {
    const fetcher = vi.fn(async () =>
      new Response("network-call-should-not-happen")
    );
    const runtime = new LegalVerificationToolRuntime(
      new VerificationLedger(),
      new OfficialLegalSourceVerifier(fetcher)
    );

    const [result] = await runtime.runTools([{
      id: "tool-unknown-1",
      name: "verify_legal_reference",
      input: {
        claim: "art. 1 XYZ",
        kind: "statute",
        act: "XYZ"
      }
    }]);

    expect(fetcher).not.toHaveBeenCalled();
    expect(JSON.parse(result?.content ?? "{}")).toEqual({
      status: "DENIED",
      error: "UNKNOWN_LEGAL_ACT"
    });
    expect(runtime.auditEvents().at(-1)).toMatchObject({
      decision: "DENY",
      reason: "UNKNOWN_LEGAL_ACT"
    });
  });
});
