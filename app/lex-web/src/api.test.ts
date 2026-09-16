import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearAuthSession,
  createCase,
  createDeanonymizationIntent,
  downloadSensitiveArtifact,
  executeSession,
  finalizeDeanonymization,
  generateLegalDocument,
  finalizeDocument,
  getHealth,
  getModels,
  getUpdateStatus,
  getFirmKnowledgeWorkspace,
  createFirmKnowledgeWorkspace,
  searchCaseKnowledge,
  login,
  listCases,
  logoutAuth,
  reauthorizeDeanonymization,
  listCaseAccess,
  listCaseAccessCandidates,
  grantCaseAccess,
  revokeCaseAccess,
  reviewDocument,
  setProviderApiKey,
  clearProviderApiKey,
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

  it("uses the native Tauri protocol without exposing a bearer to React", async () => {
    const previousWindow =
      Object.getOwnPropertyDescriptor(
        globalThis,
        "window"
      );
    Object.defineProperty(
      globalThis,
      "window",
      {
        value: {
          __TAURI_INTERNALS__: {}
        },
        configurable: true
      }
    );

    const authPayload = {
      user: {
        userId:
          "user_0123456789abcdef0123456789abcdef",
        loginName: "desktop",
        displayName:
          "Desktop User",
        appRole: "ADMIN",
        status: "ACTIVE",
        createdAt:
          "2026-09-16T08:00:00.000Z"
      },
      session: {
        sessionId:
          "authsess_0123456789abcdef0123456789abcdef",
        userId:
          "user_0123456789abcdef0123456789abcdef",
        createdAt:
          "2026-09-16T08:00:00.000Z",
        lastActivityAt:
          "2026-09-16T08:00:00.000Z",
        lastFullAuthenticationAt:
          "2026-09-16T08:00:00.000Z",
        idleExpiresAt:
          "2026-09-16T08:15:00.000Z",
        overallExpiresAt:
          "2026-09-16T16:00:00.000Z"
      }
    };
    const fetchMock =
      vi.spyOn(
        globalThis,
        "fetch"
      )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify(
              authPayload
            ),
            { status: 200 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              cases: []
            }),
            { status: 200 }
          )
        );

    try {
      await login({
        loginName: "desktop",
        password:
          "Desktop test password 2026"
      });
      await listCases();

      expect(
        fetchMock.mock.calls[0]
          ?.[0]
      ).toBe(
        "http://lex-api.localhost/api/auth/login"
      );
      expect(
        fetchMock.mock.calls[1]
          ?.[0]
      ).toBe(
        "http://lex-api.localhost/api/cases"
      );
      expect(
        fetchMock.mock.calls[1]
          ?.[1]?.headers
      ).not.toEqual(
        expect.objectContaining({
          Authorization:
            expect.any(String)
        })
      );
    } finally {
      if (previousWindow) {
        Object.defineProperty(
          globalThis,
          "window",
          previousWindow
        );
      } else {
        delete (
          globalThis as
            typeof globalThis & {
              window?: unknown;
            }
        ).window;
      }
    }
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

  it("supports the case collaboration client contract", async () => {
    const authPayload = {
      user: {
        userId:
          "user_0123456789abcdef0123456789abcdef",
        loginName:
          "owner",
        displayName:
          "Owner",
        appRole:
          "ADMIN",
        status:
          "ACTIVE",
        createdAt:
          "2026-09-16T08:00:00.000Z"
      },
      session: {
        sessionId:
          "authsess_0123456789abcdef0123456789abcdef",
        userId:
          "user_0123456789abcdef0123456789abcdef",
        createdAt:
          "2026-09-16T08:00:00.000Z",
        lastActivityAt:
          "2026-09-16T08:00:00.000Z",
        lastFullAuthenticationAt:
          "2026-09-16T08:00:00.000Z",
        idleExpiresAt:
          "2026-09-16T08:15:00.000Z",
        overallExpiresAt:
          "2026-09-16T16:00:00.000Z"
      },
      sessionToken:
        "C".repeat(43)
    };
    const caseId =
      "case_0123456789abcdef0123456789abcdef";
    const colleagueId =
      "user_11111111111111111111111111111111";
    const colleague = {
      userId:
        colleagueId,
      loginName:
        "anna",
      displayName:
        "Anna",
      appRole:
        "USER",
      status:
        "ACTIVE",
      createdAt:
        "2026-09-16T08:00:00.000Z"
    };

    const fetchMock =
      vi.spyOn(
        globalThis,
        "fetch"
      )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify(
              authPayload
            ),
            { status: 200 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              access: []
            }),
            { status: 200 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              users: [
                colleague
              ]
            }),
            { status: 200 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              user: colleague,
              role: "EDITOR",
              canReidentify:
                false,
              grantedByUserId:
                authPayload.user
                  .userId,
              grantedAt:
                "2026-09-16T08:02:00.000Z",
              keyVersion: 1
            }),
            { status: 201 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              caseId,
              revokedUserId:
                colleagueId,
              keyVersion: 2
            }),
            { status: 200 }
          )
        );

    await login({
      loginName:
        "owner",
      password:
        "Owner bezpieczne haslo testowe 2026"
    });
    await listCaseAccess(
      caseId
    );
    await listCaseAccessCandidates(
      caseId
    );
    await grantCaseAccess(
      caseId,
      {
        userId:
          colleagueId,
        role:
          "EDITOR",
        canReidentify:
          false
      }
    );
    await revokeCaseAccess(
      caseId,
      colleagueId
    );

    expect(
      fetchMock.mock.calls[1]
        ?.[0]
    ).toBe(
      `http://127.0.0.1:4317/api/cases/${caseId}/access`
    );
    expect(
      fetchMock.mock.calls[2]
        ?.[0]
    ).toBe(
      `http://127.0.0.1:4317/api/cases/${caseId}/access-candidates`
    );
    expect(
      fetchMock.mock.calls[3]
        ?.[1]?.body
    ).toBe(
      JSON.stringify({
        userId:
          colleagueId,
        role:
          "EDITOR",
        canReidentify:
          false
      })
    );
    expect(
      fetchMock.mock.calls[4]
        ?.[1]?.method
    ).toBe("DELETE");
    for (
      const call
      of fetchMock.mock.calls
        .slice(1)
    ) {
      expect(
        call[1]?.headers
      ).toEqual(
        expect.objectContaining({
          Authorization:
            `Bearer ${authPayload.sessionToken}`
        })
      );
    }
  });

  it("supports firm knowledge workspace and local retrieval client calls", async () => {
    const authPayload = {
      user: {
        userId:
          "user_0123456789abcdef0123456789abcdef",
        loginName:
          "knowledge-admin",
        displayName:
          "Knowledge Admin",
        appRole:
          "ADMIN",
        status:
          "ACTIVE",
        createdAt:
          "2026-09-16T08:00:00.000Z"
      },
      session: {
        sessionId:
          "authsess_0123456789abcdef0123456789abcdef",
        userId:
          "user_0123456789abcdef0123456789abcdef",
        createdAt:
          "2026-09-16T08:00:00.000Z",
        lastActivityAt:
          "2026-09-16T08:00:00.000Z",
        lastFullAuthenticationAt:
          "2026-09-16T08:00:00.000Z",
        idleExpiresAt:
          "2026-09-16T08:15:00.000Z",
        overallExpiresAt:
          "2026-09-16T16:00:00.000Z"
      },
      sessionToken:
        "D".repeat(43)
    };
    const workspace = {
      caseId:
        "case_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      caseKind:
        "FIRM_KNOWLEDGE",
      displayName:
        "Wiedza kancelarii",
      createdByUserId:
        authPayload.user
          .userId,
      createdAt:
        "2026-09-16T08:10:00.000Z",
      updatedAt:
        "2026-09-16T08:10:00.000Z",
      keyVersion: 1,
      role: "OWNER",
      canReidentify:
        true
    };

    const fetchMock =
      vi.spyOn(
        globalThis,
        "fetch"
      )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify(
              authPayload
            ),
            { status: 200 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              workspace: null
            }),
            { status: 200 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              workspace
            }),
            { status: 201 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              caseId:
                workspace.caseId,
              caseKind:
                "FIRM_KNOWLEDGE",
              hits: [{
                documentId:
                  "doc_0123456789abcdef01234567",
                chunkIndex: 1,
                pageStart: 1,
                pageEnd: 1,
                score: 9.5,
                text:
                  "Praktyka kancelarii dotycząca kary umownej."
              }]
            }),
            { status: 200 }
          )
        );

    await login({
      loginName:
        "knowledge-admin",
      password:
        "Knowledge admin bezpieczne haslo 2026"
    });
    await expect(
      getFirmKnowledgeWorkspace()
    ).resolves.toEqual({
      workspace: null
    });
    await expect(
      createFirmKnowledgeWorkspace()
    ).resolves.toEqual({
      workspace
    });
    await expect(
      searchCaseKnowledge(
        workspace.caseId,
        "kara umowna",
        6
      )
    ).resolves.toMatchObject({
      caseId:
        workspace.caseId,
      caseKind:
        "FIRM_KNOWLEDGE"
    });

    expect(
      fetchMock.mock.calls[1]
        ?.[0]
    ).toBe(
      "http://127.0.0.1:4317/api/firm-knowledge"
    );
    expect(
      fetchMock.mock.calls[2]
        ?.[1]?.method
    ).toBe("POST");
    expect(
      fetchMock.mock.calls[3]
        ?.[1]?.body
    ).toBe(
      JSON.stringify({
        query:
          "kara umowna",
        limit: 6
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

  it("infers spreadsheet media types from file extensions when the browser omits File.type", async () => {
    const payload = {
      documentId:
        "doc_0123456789abcdef01234567",
      mediaType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      complete: true,
      totalPages: 1,
      pages: [{
        page: 1,
        text:
          "[ARKUSZ: Dane]\nA1=Klient",
        source:
          "DIGITAL"
      }],
      suggestions: []
    };
    const fetchMock =
      vi.spyOn(
        globalThis,
        "fetch"
      )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify(
              payload
            ),
            { status: 201 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              ...payload,
              mediaType:
                "application/vnd.ms-excel.sheet.macroenabled.12"
            }),
            { status: 201 }
          )
        );

    const caseId =
      "case_0123456789abcdef0123456789abcdef";
    await reviewDocument(
      new File(
        [new Uint8Array([1])],
        "dane.xlsx",
        { type: "" }
      ),
      caseId
    );
    await reviewDocument(
      new File(
        [new Uint8Array([1])],
        "makra.xlsm",
        { type: "" }
      ),
      caseId
    );

    expect(
      fetchMock.mock.calls[0]
        ?.[1]?.headers
    ).toEqual(
      expect.objectContaining({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      })
    );
    expect(
      fetchMock.mock.calls[1]
        ?.[1]?.headers
    ).toEqual(
      expect.objectContaining({
        "Content-Type":
          "application/vnd.ms-excel.sheet.macroenabled.12"
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
      "case_0123456789abcdef0123456789abcdef",
      "doc_0123456789abcdef01234567",
      directives
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:4317/api/documents/doc_0123456789abcdef01234567/finalize",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          caseId:
            "case_0123456789abcdef0123456789abcdef",
          directives
        })
      })
    );
  });

  it("sends a provider credential through the authenticated API client without expecting the value back", async () => {
    const authPayload = {
      user: {
        userId: "user_0123456789abcdef0123456789abcdef",
        loginName: "provider-admin",
        displayName: "Provider Admin",
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
      sessionToken: "B".repeat(43)
    };
    const key =
      "memory-provider-key-example-123456";
    const fetchMock =
      vi.spyOn(globalThis, "fetch")
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify(authPayload),
            { status: 200 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              provider: "openai",
              configured: true,
              storage: "PROCESS_MEMORY"
            }),
            { status: 200 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              provider: "openai",
              cleared: true,
              storage: "PROCESS_MEMORY"
            }),
            { status: 200 }
          )
        );

    await login({
      loginName: "provider-admin",
      password:
        "Provider admin bardzo dlugie haslo 2026"
    });
    const saved =
      await setProviderApiKey(
        "openai",
        key
      );
    expect(
      JSON.stringify(saved)
    ).not.toContain(key);
    expect(
      fetchMock.mock.calls[1]
        ?.[1]?.body
    ).toBe(
      JSON.stringify({
        apiKey: key
      })
    );
    expect(
      fetchMock.mock.calls[1]
        ?.[1]?.headers
    ).toEqual(
      expect.objectContaining({
        Authorization:
          `Bearer ${authPayload.sessionToken}`
      })
    );

    await clearProviderApiKey(
      "openai"
    );
    expect(
      fetchMock.mock.calls[2]
        ?.[1]?.method
    ).toBe("DELETE");
  });

  it("uses the secure authoring reauth and one-use download client contract", async () => {
    const caseId =
      "case_0123456789abcdef0123456789abcdef";
    const tokenizedArtifactId =
      "artifact_11111111111111111111111111111111";
    const finalArtifactId =
      "artifact_22222222222222222222222222222222";
    const authPayload = {
      user: {
        userId:
          "user_0123456789abcdef0123456789abcdef",
        loginName: "author",
        displayName: "Author",
        appRole: "USER",
        status: "ACTIVE",
        createdAt:
          "2026-09-16T08:00:00.000Z"
      },
      session: {
        sessionId:
          "authsess_0123456789abcdef0123456789abcdef",
        userId:
          "user_0123456789abcdef0123456789abcdef",
        createdAt:
          "2026-09-16T08:00:00.000Z",
        lastActivityAt:
          "2026-09-16T08:00:00.000Z",
        lastFullAuthenticationAt:
          "2026-09-16T08:00:00.000Z",
        idleExpiresAt:
          "2026-09-16T08:15:00.000Z",
        overallExpiresAt:
          "2026-09-16T16:00:00.000Z"
      },
      sessionToken:
        "E".repeat(43)
    };
    const fetchMock =
      vi.spyOn(
        globalThis,
        "fetch"
      )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify(
              authPayload
            ),
            { status: 200 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              sessionId:
                "session_generation",
              artifact: {
                schemaVersion: 1,
                caseId,
                artifactId:
                  tokenizedArtifactId,
                filename:
                  "tokenized.docx",
                mediaType:
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                sha256:
                  "a".repeat(64),
                bytes: 100,
                createdAt:
                  "2026-09-16T12:00:00.000Z",
                sensitivity:
                  "PROTECTED",
                storage:
                  "ENCRYPTED_LME1"
              },
              format: "docx",
              tokenizedSha256:
                "a".repeat(64),
              vaultGeneration: 1,
              aliasesUsed: [
                "[LMPII:D01:PERSON:0001]"
              ]
            }),
            { status: 201 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              intent: {
                intentId:
                  "intent_" +
                  "1".repeat(32),
                caseId,
                artifactId:
                  tokenizedArtifactId,
                artifactFormat:
                  "docx",
                expiresAt:
                  "2026-09-16T12:05:00.000Z",
                status:
                  "PENDING"
              }
            }),
            { status: 201 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              grant: {
                grantId:
                  "grant_" +
                  "2".repeat(32),
                intentId:
                  "intent_" +
                  "1".repeat(32),
                caseId,
                artifactId:
                  tokenizedArtifactId,
                artifactFormat:
                  "docx",
                expiresAt:
                  "2026-09-16T12:01:30.000Z"
              },
              session:
                authPayload.session
            }),
            { status: 200 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              artifact: {
                schemaVersion: 1,
                caseId,
                artifactId:
                  finalArtifactId,
                filename:
                  "LexMachina-final.docx",
                mediaType:
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                sha256:
                  "b".repeat(64),
                bytes: 120,
                createdAt:
                  "2026-09-16T12:00:05.000Z",
                sensitivity:
                  "CLEAR_PII",
                storage:
                  "ENCRYPTED_LME1"
              },
              format: "docx",
              sha256:
                "b".repeat(64),
              replacements: 1,
              downloadTicket: {
                ticketId:
                  "download_" +
                  "3".repeat(32),
                caseId,
                artifactId:
                  finalArtifactId,
                finalSha256:
                  "b".repeat(64),
                expiresAt:
                  "2026-09-16T12:01:05.000Z",
                remainingUses: 1
              }
            }),
            { status: 201 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            "DOCX-BYTES",
            {
              status: 200,
              headers: {
                "Content-Type":
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              }
            }
          )
        );

    await login({
      loginName: "author",
      password:
        "Bardzo dlugie haslo autora 2026"
    });

    const generated =
      await generateLegalDocument(
        caseId,
        {
          query:
            "Przygotuj pismo.",
          provider:
            "openai",
          model:
            "gpt-test",
          primarySkill:
            "dr-02-test",
          mode:
            "PRAWNIK",
          format:
            "docx",
          documentType:
            "letter",
          styleProfile:
            "lex-classic-clean-v1",
          attachments: [{
            caseId,
            documentId:
              "doc_0123456789abcdef01234567",
            chunkIndices: [1]
          }]
        }
      );
    const intent =
      await createDeanonymizationIntent(
        caseId,
        generated
          .artifact
          .artifactId
      );
    const authorized =
      await reauthorizeDeanonymization(
        intent.intent
          .intentId,
        "Bardzo dlugie haslo autora 2026"
      );
    const final =
      await finalizeDeanonymization(
        authorized.grant
          .grantId
      );
    const blob =
      await downloadSensitiveArtifact(
        final.downloadTicket!
          .ticketId
      );

    expect(blob.size)
      .toBeGreaterThan(0);
    expect(
      fetchMock.mock.calls[1]
        ?.[0]
    ).toBe(
      `http://127.0.0.1:4317/api/cases/${caseId}/artifacts/generate`
    );
    expect(
      fetchMock.mock.calls[2]
        ?.[0]
    ).toContain(
      "/deanonymization-intent"
    );
    expect(
      fetchMock.mock.calls[3]
        ?.[1]?.body
    ).toBe(
      JSON.stringify({
        intentId:
          "intent_" +
          "1".repeat(32),
        password:
          "Bardzo dlugie haslo autora 2026"
      })
    );
    expect(
      fetchMock.mock.calls[5]
        ?.[0]
    ).toContain(
      "/api/sensitive-download/download_"
    );
    expect(
      fetchMock.mock.calls[5]
        ?.[1]?.headers
    ).toEqual(
      expect.objectContaining({
        Authorization:
          `Bearer ${authPayload.sessionToken}`
      })
    );
  });

  it("checks update status through a read-only authenticated request", async () => {
    const payload = {
      currentVersion:
        "0.1.0",
      status:
        "UP_TO_DATE",
      checkedAt:
        "2026-09-16T12:00:00.000Z",
      latestVersion:
        "0.1.0",
      releaseUrl:
        "https://github.com/michaleiatrak-star/Lex-Machina/releases/tag/v0.1.0"
    };
    const fetchMock =
      vi.spyOn(
        globalThis,
        "fetch"
      ).mockResolvedValue(
        new Response(
          JSON.stringify(
            payload
          ),
          { status: 200 }
        )
      );

    await expect(
      getUpdateStatus()
    ).resolves.toEqual(
      payload
    );
    expect(
      fetchMock.mock.calls[0]
        ?.[1]?.method
    ).toBeUndefined();
    expect(
      fetchMock.mock.calls[0]
        ?.[1]?.body
    ).toBeUndefined();
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
