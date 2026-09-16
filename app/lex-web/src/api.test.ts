import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearAuthSession,
  createCase,
  executeSession,
  finalizeDocument,
  getHealth,
  getModels,
  login,
  logoutAuth,
  reviewDocument,
  uploadCaseFile,
  validateRoute
} from "./api.js";

afterEach(() => {
  clearAuthSession();
  vi.restoreAllMocks();
});

describe("local API client", () => {

  it("keeps the login bearer in memory and attaches it to private requests", async () => {
    const authPayload = {
      user: {
        userId: "user_0123456789abcdef0123456789abcdef",
        loginName: "owner",
        displayName: "Owner",
        appRole: "ADMIN",
        status: "ACTIVE",
        createdAt: "2026-09-16T08:00:00.000Z"
      },
      session: {
        sessionId: "authsess_0123456789abcdef0123456789abcdef",
        userId: "user_0123456789abcdef0123456789abcdef",
        createdAt: "2026-09-16T08:00:00.000Z",
        lastActivityAt: "2026-09-16T08:00:00.000Z",
        lastFullAuthenticationAt: "2026-09-16T08:00:00.000Z",
        idleExpiresAt: "2026-09-16T08:15:00.000Z",
        overallExpiresAt: "2026-09-16T16:00:00.000Z"
      },
      sessionToken: "A".repeat(43)
    };
    const casePayload = {
      caseId: "case_0123456789abcdef0123456789abcdef",
      createdAt: "2026-09-16T08:01:00.000Z"
    };
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify(authPayload), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(casePayload), { status: 201 })
      )
      .mockResolvedValueOnce(
        new Response(null, { status: 204 })
      );

    await login({
      loginName: "owner",
      password: "Bardzo dlugie haslo testowe 2026"
    });
    await createCase();

    expect(fetchMock.mock.calls[1]?.[1]?.headers)
      .toEqual(expect.objectContaining({
        Authorization: `Bearer ${authPayload.sessionToken}`
      }));

    await logoutAuth();
    expect(fetchMock.mock.calls[2]?.[1]?.headers)
      .toEqual(expect.objectContaining({
        Authorization: `Bearer ${authPayload.sessionToken}`
      }));
  });

  it("uses the localhost runtime by default", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        status: "ok",
        service: "lex-machina-runtime",
        localOnly: true
      }), { status: 200 })
    );

    await getHealth();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:4317/health",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json"
        })
      })
    );
  });

  it("creates a local case before file work", async () => {
    const payload = {
      caseId: "case_0123456789abcdef0123456789abcdef",
      createdAt: "2026-09-16T12:00:00.000Z"
    };
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 201 })
    );

    await expect(createCase()).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:4317/api/cases",
      expect.objectContaining({
        method: "POST"
      })
    );
  });

  it("posts only a route identifier for route validation", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        valid: true,
        primarySkill: "dr-02-test"
      }), { status: 200 })
    );

    await validateRoute("dr-02-test");

    const init = fetchMock.mock.calls[0]?.[1];
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe(
      JSON.stringify({ primarySkill: "dr-02-test" })
    );
  });

  it("posts the selected runtime configuration and user query for execution", async () => {
    const payload = {
      sessionId: "session-1",
      status: "DRAFT_PRESENTABLE",
      provider: "openai",
      model: "gpt-test",
      primarySkill: "dr-02-test",
      answer: "Wynik.",
      finalization: "PASS",
      blockedReferences: [],
      verification: {
        records: 1,
        verified: 1,
        supported: 0,
        unverified: 0
      },
      evidence: [{
        claim: "art. 5 KC",
        kind: "statute",
        status: "VERIFIED",
        sourceUrl:
          "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.pdf",
        sourceTier: "R1",
        fetchedAt:
          "2026-09-15T20:00:00Z",
        sourceFormat: "PDF"
      }],
      audit: {
        result: "PASS",
        eventCount: 9,
        closed: true
      }
    };

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 200 })
    );

    const request = {
      query: "Przeanalizuj umowę.",
      provider: "openai" as const,
      model: "gpt-test",
      primarySkill: "dr-02-test",
      mode: "PRAWNIK" as const
    };

    await expect(executeSession(request)).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:4317/api/sessions/execute",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(request),
        headers: expect.objectContaining({
          "Content-Type": "application/json"
        })
      })
    );
  });

  it("uploads PDF/image bytes for local privacy review without wrapping them in JSON", async () => {
    const payload = {
      documentId: "doc_0123456789abcdef01234567",
      mediaType: "image/png",
      complete: true,
      totalPages: 1,
      pages: [{
        page: 1,
        text: "Jan Kowalski",
        source: "OCR"
      }],
      suggestions: []
    };

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 201 })
    );

    const file = new File(
      [new Uint8Array([137, 80, 78, 71])],
      "scan.png",
      { type: "image/png" }
    );

    await expect(
      reviewDocument(
        file,
        "case_0123456789abcdef0123456789abcdef"
      )
    ).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:4317/api/documents/review",
      expect.objectContaining({
        method: "POST",
        body: file,
        headers: expect.objectContaining({
          "Content-Type": "image/png",
          "X-Lex-Case-Id":
            "case_0123456789abcdef0123456789abcdef",
          "X-Lex-Filename":
            encodeURIComponent("scan.png")
        })
      })
    );
  });

  it("uploads ZIP directly to the local case store", async () => {
    const payload = {
      caseId: "case_0123456789abcdef0123456789abcdef",
      uploadId: "upload_0123456789abcdef0123456789abcdef",
      filename: "akta.zip",
      mediaType: "application/zip",
      sha256: "a".repeat(64),
      bytes: 4,
      storedAt: "2026-09-16T12:00:00.000Z",
      archive: true,
      extracted: []
    };

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 201 })
    );
    const file = new File(
      [new Uint8Array([80, 75, 3, 4])],
      "akta.zip",
      { type: "application/zip" }
    );

    await expect(
      uploadCaseFile(
        payload.caseId,
        file
      )
    ).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      `http://127.0.0.1:4317/api/cases/${payload.caseId}/files`,
      expect.objectContaining({
        method: "POST",
        body: file,
        headers: expect.objectContaining({
          "Content-Type": "application/zip",
          "X-Lex-Filename":
            encodeURIComponent("akta.zip")
        })
      })
    );
  });

  it("posts user privacy directives to local finalization", async () => {
    const payload = {
      documentId: "doc_0123456789abcdef01234567",
      mediaType: "image/png",
      complete: true,
      totalPages: 1,
      digitalPages: 0,
      ocrPages: 1,
      blankPages: 0,
      sourceChars: 12,
      pseudonymizedChars: 17,
      chunks: [],
      privacy: {
        findings: 1,
        counts: { PERSON: 1 },
        manualPseudonymizations: 1,
        keptRanges: 0,
        annotations: [],
        reversibleLocally: true
      }
    };
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 200 })
    );

    const directives = [{
      page: 1,
      start: 0,
      end: 12,
      action: "PSEUDONYMIZE" as const,
      kind: "PERSON" as const,
      label: "świadek"
    }];

    await finalizeDocument(
      "doc_0123456789abcdef01234567",
      directives
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:4317/api/documents/doc_0123456789abcdef01234567/finalize",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ directives })
      })
    );
  });

  it("surfaces sanitized model discovery failures", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        error: "PROVIDER_NOT_CONFIGURED",
        provider: "openai"
      }), { status: 503 })
    );

    await expect(getModels("openai")).rejects.toThrow(
      "PROVIDER_NOT_CONFIGURED"
    );
  });

  it("surfaces sanitized execution failures without provider secrets", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        error: "PROVIDER_EXECUTION_FAILED",
        provider: "anthropic"
      }), { status: 502 })
    );

    await expect(executeSession({
      query: "Test",
      provider: "anthropic",
      model: "claude-test",
      primarySkill: "dr-02-test",
      mode: "LAIK"
    })).rejects.toThrow("PROVIDER_EXECUTION_FAILED");
  });
});
