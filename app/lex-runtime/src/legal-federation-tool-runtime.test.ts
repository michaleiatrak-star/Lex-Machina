import {
  describe,
  expect,
  it
} from "vitest";
import {
  FEDERATED_LEGAL_TOOL_NAMES,
  LegalFederationToolRuntime
} from "./legal-federation-tool-runtime.js";

describe("LegalFederationToolRuntime", () => {
  it("exposes the compact federation surface plus the local source assessor", () => {
    const runtime =
      new LegalFederationToolRuntime();
    const names =
      runtime.schemas()
        .map(
          (schema) =>
            schema.function.name
        );

    expect(names).toEqual([
      "list_federated_legal_sources",
      "search_federated_legal_sources",
      "get_federated_legal_document",
      "call_federated_legal_source",
      "assess_legal_source",
      "federated_legal_coverage"
    ]);
    expect(
      [...FEDERATED_LEGAL_TOOL_NAMES]
    ).toEqual(names);
  });

  it("keeps native verification authoritative", () => {
    const prompt =
      new LegalFederationToolRuntime()
        .systemPromptAppendix();

    expect(prompt).toContain(
      "DISCOVERY/RESEARCH ONLY"
    );
    expect(prompt).toContain(
      "verify_legal_reference remains authoritative"
    );
    expect(prompt).toContain(
      "do not present them as generally binding statutory law"
    );
    expect(prompt).toContain(
      "do not replace the native Lex verification path"
    );
  });

  it("does not claim absence when a federated source fails", async () => {
    const runtime =
      new LegalFederationToolRuntime();

    const [result] =
      await runtime.runTools([
        {
          id: "bad-source",
          name:
            "search_federated_legal_sources",
          input: {
            source:
              "not-a-source",
            query:
              "art. 5"
          }
        }
      ]);

    expect(
      JSON.parse(
        result!.content
      )
    ).toMatchObject({
      status:
        "SOURCE_UNAVAILABLE",
      instruction:
        expect.stringContaining(
          "Do not infer absence of law"
        )
    });
  });
});
