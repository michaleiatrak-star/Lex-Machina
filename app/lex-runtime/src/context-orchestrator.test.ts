import {
  describe,
  expect,
  it
} from "vitest";
import type {
  SessionDocumentAttachment
} from "./session-executor.js";
import {
  orchestrateDocumentContext
} from "./context-orchestrator.js";

function attachment(
  id: string,
  scope:
    SessionDocumentAttachment["sourceScope"],
  chunks: Array<{
    index: number;
    text: string;
  }>
): SessionDocumentAttachment {
  return {
    documentId: id,
    ...(scope
      ? { sourceScope: scope }
      : {}),
    chunks: chunks.map((chunk) => ({
      index: chunk.index,
      pageStart: chunk.index + 1,
      pageEnd: chunk.index + 1,
      text: chunk.text
    }))
  };
}

describe(
  "deterministic context orchestrator",
  () => {
    it(
      "keeps manual evidence intact when it fits the selected model window",
      () => {
        const manual = attachment(
          "doc_manual_1234567890abcdef",
          "MANUAL",
          [
            {
              index: 0,
              text: "A".repeat(9_000)
            },
            {
              index: 1,
              text: "B".repeat(9_000)
            }
          ]
        );
        const result =
          orchestrateDocumentContext({
            attachments: [manual],
            query: "Przeanalizuj dokument.",
            systemPrompt:
              "System legalny.",
            modelContextTokens:
              64_000
          });

        expect(
          result.attachments
        ).toHaveLength(1);
        expect(
          result.attachments[0]!
            .chunks
        ).toHaveLength(2);
        expect(
          result.report
            .omittedChunks
        ).toBe(0);
        expect(
          result.report.strategy
        ).toBe(
          "MODEL_CONTEXT_WINDOW"
        );
      }
    );

    it(
      "never silently truncates user-selected manual evidence",
      () => {
        const manual = attachment(
          "doc_manual_abcdef1234567890",
          "MANUAL",
          [
            {
              index: 0,
              text: "A".repeat(
                180_000
              )
            }
          ]
        );

        expect(() =>
          orchestrateDocumentContext({
            attachments: [manual],
            query: "Analiza",
            modelContextTokens:
              64_000
          })
        ).toThrow(
          "MANUAL_DOCUMENT_CONTEXT_EXCEEDS_BUDGET"
        );
      }
    );

    it(
      "fills remaining capacity with retrieved knowledge at chunk boundaries",
      () => {
        const manual = attachment(
          "doc_manual_1111111111111111",
          "MANUAL",
          [
            {
              index: 0,
              text: "M".repeat(12_000)
            }
          ]
        );
        const knowledge = attachment(
          "doc_case_2222222222222222",
          "CASE_KNOWLEDGE",
          [
            {
              index: 0,
              text: "K".repeat(45_000)
            },
            {
              index: 1,
              text: "L".repeat(45_000)
            },
            {
              index: 2,
              text: "N".repeat(45_000)
            }
          ]
        );

        const result =
          orchestrateDocumentContext({
            attachments: [
              manual,
              knowledge
            ],
            query:
              "Znajdź związane dowody.",
            modelContextTokens:
              64_000
          });

        expect(
          result.attachments[0]!
            .documentId
        ).toBe(
          manual.documentId
        );
        expect(
          result.report
            .selectedChunks
        ).toBeGreaterThan(1);
        expect(
          result.report
            .compressedChunks
        ).toBeGreaterThan(0);
        expect(
          result.report
            .backlinkedChunks
        ).toBe(
          result.report
            .compressedChunks
        );
        expect(
          result.report
            .compressionSavedTokens
        ).toBeGreaterThan(0);
      }
    );

    it(
      "keeps full originals as citation sources when retrieved chunks are represented by exact extractive digests",
      () => {
        const original =
          [
            "Wstęp bez znaczenia.",
            "Termin zapłaty wynosi 14 dni od doręczenia faktury.",
            "Dalsza część dokumentu opisuje odpowiedzialność i wykonanie świadczenia.",
            "Koniec."
          ].join(
            " ".repeat(2_000)
          );
        const knowledge =
          attachment(
            "doc_case_5555555555555555",
            "CASE_KNOWLEDGE",
            [
              {
                index: 7,
                text:
                  original.repeat(20)
              }
            ]
          );

        const result =
          orchestrateDocumentContext({
            attachments: [
              knowledge
            ],
            query:
              "Jaki jest termin zapłaty faktury?",
            systemPrompt:
              "S".repeat(90_000),
            modelContextTokens:
              64_000
          });

        const promptChunk =
          result.attachments[0]
            ?.chunks[0];
        const sourceChunk =
          result.citationSources[0]
            ?.chunks[0];

        expect(
          promptChunk
            ?.representation
        ).toBe(
          "EXTRACTIVE_DIGEST"
        );
        expect(
          sourceChunk
            ?.representation
        ).toBe("FULL");
        expect(
          sourceChunk?.text
        ).toBe(
          knowledge.chunks[0]
            ?.text
        );
        expect(
          knowledge.chunks[0]
            ?.text.includes(
              promptChunk?.text ??
                "__missing__"
            )
        ).toBe(true);
        expect(
          promptChunk?.text
        ).toContain(
          "Termin zapłaty wynosi 14 dni"
        );
        expect(
          result.report
            .compressedChunks
        ).toBe(1);
        expect(
          result.report
            .backlinkedChunks
        ).toBe(1);
      }
    );

    it(
      "preserves the legacy hard cap when a model context window is unknown",
      () => {
        const small = attachment(
          "doc_legacy_3333333333333333",
          "MANUAL",
          [
            {
              index: 0,
              text: "X".repeat(8_000)
            }
          ]
        );
        expect(
          orchestrateDocumentContext({
            attachments: [small],
            query: "Analiza"
          }).report.strategy
        ).toBe("LEGACY_CHAR_CAP");

        const large = attachment(
          "doc_legacy_4444444444444444",
          "MANUAL",
          [
            {
              index: 0,
              text: "X".repeat(
                160_001
              )
            }
          ]
        );
        expect(() =>
          orchestrateDocumentContext({
            attachments: [large],
            query: "Analiza"
          })
        ).toThrow(
          "DOCUMENT_ATTACHMENT_CONTEXT_TOO_LARGE"
        );
      }
    );
  }
);
