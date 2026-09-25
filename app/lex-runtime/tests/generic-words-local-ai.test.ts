import { describe, expect, it, vi } from "vitest";
import { personPart, sentenceAround } from "../src/privacy/generic-words.js";
import {
  LocalLlmPrivacyNamedEntityRecognizer,
  privacyRecognizerFor
} from "../src/privacy/local-llm-ner.js";
import type { PiiSpan } from "../src/privacy/pseudonymizer.js";

function span(text: string, value: string, from = 0): PiiSpan {
  const start = text.indexOf(value, from);
  return { start, end: start + value.length, kind: "PERSON", value };
}

describe("institutions and party roles are not persons", () => {
  it("drops institution names, keeps them after a person-only word", () => {
    const text = "Pozwany Bank odmówił. Bank Pekao S.A. wezwał. Pani Rada zeznała. Wierzyciel Skarb Państwa.";
    expect(personPart(text, span(text, "Bank"))).toBeNull();
    expect(personPart(text, span(text, "Bank Pekao"))).toBeNull();
    expect(personPart(text, span(text, "Skarb Państwa"))).toBeNull();
    expect(personPart(text, span(text, "Rada"))).toEqual(span(text, "Rada"));
  });

  it("cuts a leading role off a name and drops a role alone", () => {
    const text = "Najemca Jan Kowalski oraz Wierzycielka Anna Nowak. Dłużnik zapłacił.";
    expect(personPart(text, span(text, "Najemca Jan Kowalski"))?.value).toBe("Jan Kowalski");
    expect(personPart(text, span(text, "Wierzycielka Anna Nowak"))?.value).toBe("Anna Nowak");
    expect(personPart(text, span(text, "Dłużnik"))).toBeNull();
    expect(personPart(text, span(text, "Jan Kowalski"))?.value).toBe("Jan Kowalski");
  });

  it("gives the local model the whole sentence with the word marked", () => {
    const text = "Umowę zawarto 1 maja. Bank wypowiedział umowę kredytu z dniem 30 czerwca. Dalej.";
    expect(sentenceAround(text, span(text, "Bank"))).toBe("⟦Bank⟧ wypowiedział umowę kredytu z dniem 30 czerwca.");
  });
});

describe("anonymization with local AI", () => {
  const ready = {
    configuredModelId: () => "local/bielik",
    status: () => ({ configured: true, state: "READY" })
  } as never;

  it("drops an ambiguous match only when the model says it is not a person", async () => {
    const text = "Bank naliczył odsetki. Pani Bank zeznała jako świadek.";
    const fallback = {
      recognize: async () => [
        { ...span(text, "Bank"), ambiguous: true },
        { ...span(text, "Bank", 25), ambiguous: true }
      ]
    };
    const questions: string[] = [];
    const gateway = {
      stream: vi.fn(async (_provider: string, params: { systemPrompt: string; messages: Array<{ content: string }> }) => {
        if (!params.systemPrompt.includes("⟦")) return { fullText: "[]" };
        questions.push(params.messages[0]!.content);
        return { fullText: '[{"id":1,"person":false,"type":"instytucja"},{"id":2,"person":true,"type":"osoba"}]' };
      })
    };
    const checks: Array<[string, number, number]> = [];
    const recognizer = privacyRecognizerFor(
      new LocalLlmPrivacyNamedEntityRecognizer(gateway as never, ready, fallback),
      false,
      { onCheck: (item, done, total) => checks.push([item, done, total]) }
    );
    const found = await recognizer.recognize(text);
    expect(found.map((item) => item.start)).toEqual([text.indexOf("Bank", 25)]);
    expect(questions[0]).toContain("1. ⟦Bank⟧ naliczył odsetki.");
    expect(questions[0]).toContain("2. Pani ⟦Bank⟧ zeznała jako świadek.");
    expect(checks[0]).toEqual(["Bank, Bank", 0, 2]);
    expect(checks.at(-1)).toEqual(["", 2, 2]);
  });

  it("keeps a match the model does not answer about", async () => {
    const text = "Kowalski przyszedł.";
    const fallback = { recognize: async () => [{ ...span(text, "Kowalski"), ambiguous: true }] };
    const gateway = { stream: vi.fn(async () => ({ fullText: "nie wiem" })) };
    const recognizer = privacyRecognizerFor(
      new LocalLlmPrivacyNamedEntityRecognizer(gateway as never, ready, fallback),
      false,
      {}
    );
    expect(await recognizer.recognize(text)).toHaveLength(1);
  });

  it("refuses when the local model is not running instead of silently skipping it", async () => {
    const stopped = { configuredModelId: () => "local/bielik", status: () => ({ configured: true, state: "STOPPED" }) } as never;
    const recognizer = privacyRecognizerFor(
      new LocalLlmPrivacyNamedEntityRecognizer({ stream: vi.fn() } as never, stopped, { recognize: async () => [] }),
      false,
      {}
    );
    await expect(recognizer.recognize("Jan Kowalski")).rejects.toThrow("LOCAL_PRIVACY_MODEL_NOT_READY");
  });
});
