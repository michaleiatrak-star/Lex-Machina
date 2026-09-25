import { describe, expect, it } from "vitest";
import { deanonymizeModel, type TextRestorer } from "../src/deanonymize-file.js";

const VALUES: Record<string, string> = {
  "[PII:PERSON:0001|DAT]": "Janowi Kowalskiemu",
  "[PII:PERSON:0001]": "Jan Kowalski",
  "[PII:PESEL:0001]": "44051401359"
};

const restore: TextRestorer = (text) => {
  let count = 0;
  const unresolved: string[] = [];
  const out = text.replace(/\[PII:[A-Z_]+:\d{4}(?:\|[A-Z]{2,4})?\]/g, (token) => {
    if (VALUES[token]) {
      count += 1;
      return VALUES[token]!;
    }
    unresolved.push(token);
    return token;
  });
  return { text: out, count, unresolved };
};

const run = (text: string, b = false) => ({ text, b, i: false, u: false });

describe("deanonymizing a file with placeholders", () => {
  it("keeps run formatting when a token sits in one run and merges split tokens", () => {
    const result = deanonymizeModel(
      {
        kind: "document",
        blocks: [
          { type: "paragraph", runs: [run("Pozew przeciwko "), run("[PII:PERSON:0001|DAT]", true), run(".")] },
          { type: "paragraph", runs: [run("PESEL [PII:PES"), run("EL:0001] i [PII:X:0009]")] },
          { type: "table", rows: [["Strona", "[PII:PERSON:0001]"]] }
        ]
      },
      restore
    );
    expect(result.model).toEqual({
      kind: "document",
      blocks: [
        { type: "paragraph", runs: [run("Pozew przeciwko "), run("Janowi Kowalskiemu", true), run(".")] },
        { type: "paragraph", runs: [run("PESEL 44051401359 i [PII:X:0009]")] },
        { type: "table", rows: [["Strona", "Jan Kowalski"]] }
      ]
    });
    expect(result.count).toBe(3);
    expect(result.unresolved).toEqual(["[PII:X:0009]"]);
  });

  it("restores sheet cells", () => {
    const result = deanonymizeModel(
      { kind: "sheet", truncated: false, sheets: [{ name: "A", rows: [["[PII:PESEL:0001]", "x"]] }] },
      restore
    );
    expect(result.model).toMatchObject({ sheets: [{ rows: [["44051401359", "x"]] }] });
  });
});
