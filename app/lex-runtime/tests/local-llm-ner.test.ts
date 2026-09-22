import {
  describe,
  expect,
  it,
  vi
} from "vitest";
import {
  LocalLlmPrivacyNamedEntityRecognizer
} from "../src/privacy/local-llm-ner.js";
import {
  LocalPolishPseudonymizer,
  PseudonymizationVault
} from "../src/privacy/pseudonymizer.js";
import type {
  LocalModelRuntime
} from "../src/local-model-runtime.js";
import type {
  ProviderGateway
} from "../src/providers/gateway.js";

describe(
  "local LLM privacy recognizer",
  () => {
    it(
      "detects exact inflected names, addresses and document identifiers in OCR text",
      async () => {
        const text =
          "Zaświadczenie dla Jana Kowalskiego, zamieszkałego przy ul. Długiej 10 w Warszawie. Dowód osobisty ABC123456.";

        const stream =
          vi.fn(
            async () => ({
              fullText:
                JSON.stringify([
                  {
                    kind:
                      "PERSON",
                    value:
                      "Jana Kowalskiego"
                  },
                  {
                    kind:
                      "ADDRESS",
                    value:
                      "ul. Długiej 10 w Warszawie"
                  },
                  {
                    kind:
                      "CUSTOM",
                    value:
                      "ABC123456"
                  },
                  {
                    kind:
                      "PERSON",
                    value:
                      "Jan Kowalski"
                  }
                ])
            })
          );
        const gateway = {
          stream
        } as unknown as
          ProviderGateway;
        const localModels = {
          configuredModelId:
            () =>
              "local/bielik-11b-v3-q4km",
          status:
            () => ({
              configured:
                true
            })
        } as unknown as
          LocalModelRuntime;

        const recognizer =
          new LocalLlmPrivacyNamedEntityRecognizer(
            gateway,
            localModels
          );
        const spans =
          await recognizer
            .recognize(text);

        expect(
          spans.map(
            (span) => ({
              kind:
                span.kind,
              value:
                span.value,
              exact:
                text.slice(
                  span.start,
                  span.end
                )
            })
          )
        ).toEqual([
          {
            kind:
              "PERSON",
            value:
              "Jana Kowalskiego",
            exact:
              "Jana Kowalskiego"
          },
          {
            kind:
              "ADDRESS",
            value:
              "ul. Długiej 10 w Warszawie",
            exact:
              "ul. Długiej 10 w Warszawie"
          },
          {
            kind:
              "CUSTOM",
            value:
              "ABC123456",
            exact:
              "ABC123456"
          }
        ]);

        const pseudonymizer =
          new LocalPolishPseudonymizer(
            new PseudonymizationVault(),
            recognizer
          );
        const protectedText =
          await pseudonymizer
            .pseudonymize(text);

        expect(
          protectedText.text
        ).toContain(
          "[PII:PERSON:0001]"
        );
        expect(
          protectedText.text
        ).toContain(
          "[PII:ADDRESS:0001]"
        );
        expect(
          protectedText.text
        ).toContain(
          "[PII:CUSTOM:0001]"
        );
        expect(
          protectedText.text
        ).not.toContain(
          "Jana Kowalskiego"
        );
      }
    );

    it(
      "falls back without failing document review when local semantic inference is unavailable",
      async () => {
        const text =
          "Anna Nowak podpisała dokument.";
        const start =
          text.indexOf(
            "Anna Nowak"
          );
        const fallback = {
          recognize:
            vi.fn(
              async () => [{
                start,
                end:
                  start +
                  "Anna Nowak".length,
                kind:
                  "PERSON" as const,
                value:
                  "Anna Nowak"
              }]
            )
        };
        const gateway = {
          stream:
            vi.fn(
              async () => {
                throw new Error(
                  "LOCAL_MODEL_INFERENCE_FAILED"
                );
              }
            )
        } as unknown as
          ProviderGateway;
        const localModels = {
          configuredModelId:
            () =>
              "local/bielik-11b-v3-q4km",
          status:
            () => ({
              configured:
                true
            })
        } as unknown as
          LocalModelRuntime;

        const recognizer =
          new LocalLlmPrivacyNamedEntityRecognizer(
            gateway,
            localModels,
            fallback
          );
        await expect(
          recognizer.recognize(
            text
          )
        ).resolves.toEqual([
          expect.objectContaining({
            kind:
              "PERSON",
            value:
              "Anna Nowak"
          })
        ]);
      }
    );
  }
);
