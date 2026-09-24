import type {
  EditableBlock,
  EditableModel,
  EditableRun
} from "./office-edit.js";

export type TextRestorer = (text: string) => { text: string; count: number; unresolved: string[] };

const TOKEN = /\[PII:[A-Z_]+:\d{4}(?:\|[A-Z]{2,4})?\]/g;
const HAS_TOKEN = /\[PII:[A-Z_]+:\d{4}(?:\|[A-Z]{2,4})?\]/;

/**
 * Puts values back into a document's runs. A token inside one run keeps that
 * run's formatting; a token split across runs (Word splits text freely)
 * merges the paragraph into the first run's formatting.
 */
function restoreRuns(runs: EditableRun[], restore: TextRestorer, sink: Sink): EditableRun[] {
  const joined = runs.map((run) => run.text).join("");
  if (!HAS_TOKEN.test(joined)) return runs;
  const whole = [...joined.matchAll(TOKEN)].length;
  const inRuns = runs.reduce((total, run) => total + [...run.text.matchAll(TOKEN)].length, 0);
  if (whole === inRuns) {
    return runs.map((run) => ({ ...run, text: sink(restore(run.text)) }));
  }
  const first = runs[0]!;
  return [{ ...first, text: sink(restore(joined)) }];
}

type Sink = (result: ReturnType<TextRestorer>) => string;

export function deanonymizeModel(
  model: EditableModel,
  restore: TextRestorer
): { model: EditableModel; count: number; unresolved: string[] } {
  let count = 0;
  const unresolved = new Set<string>();
  const sink: Sink = (result) => {
    count += result.count;
    result.unresolved.forEach((token) => unresolved.add(token));
    return result.text;
  };
  if (model.kind === "sheet") {
    return {
      model: {
        ...model,
        sheets: model.sheets.map((sheet) => ({
          ...sheet,
          rows: sheet.rows.map((row) => row.map((cell) => sink(restore(cell))))
        }))
      },
      count,
      unresolved: [...unresolved]
    };
  }
  const blocks: EditableBlock[] = model.blocks.map((block) => {
    switch (block.type) {
      case "heading":
      case "paragraph":
        return { ...block, runs: restoreRuns(block.runs, restore, sink) };
      case "list":
        return { ...block, items: block.items.map((item) => restoreRuns(item, restore, sink)) };
      case "table":
        return { ...block, rows: block.rows.map((row) => row.map((cell) => sink(restore(cell)))) };
    }
  });
  return { model: { kind: "document", blocks }, count, unresolved: [...unresolved] };
}
