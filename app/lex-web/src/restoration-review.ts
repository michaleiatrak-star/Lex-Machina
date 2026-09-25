import type { RestorationMark } from "./workspace-client.js";

/** Values below this confidence are shown as "check this" (runtime uses the same). */
export const REVIEW_CONFIDENCE = 0.8;

export type RestorationTone = "certain" | "rule" | "review" | "manual" | "stored";

/**
 * certain: dictionary form (SGJP) or a form the user confirmed earlier;
 * rule: inflected by a rule, likely right; review: low confidence or an
 * ambiguous name; manual: corrected by the user; stored: value restored
 * exactly as found in the document (PESEL, address, ...).
 */
export function restorationTone(mark: Pick<RestorationMark, "source" | "status" | "confidence">): RestorationTone {
  if (mark.source === "manual") return "manual";
  if (mark.status !== "ok" || mark.confidence < REVIEW_CONFIDENCE) return "review";
  if (mark.source === "vault" || mark.source === "stored") return "stored";
  if (/rule|unresolved/.test(mark.source)) return "rule";
  return "certain";
}

export const TONE_LABEL: Record<RestorationTone, string> = {
  certain: "słownik (SGJP) / zatwierdzona forma",
  rule: "odmiana regułowa",
  review: "do sprawdzenia",
  manual: "poprawione ręcznie",
  stored: "wartość z dokumentu"
};

const CASE_LABEL: Record<string, string> = {
  NOM: "mianownik",
  GEN: "dopełniacz",
  DAT: "celownik",
  ACC: "biernik",
  INS: "narzędnik",
  LOC: "miejscownik",
  VOC: "wołacz"
};

export function caseLabel(value: string | undefined): string {
  return value ? CASE_LABEL[value] ?? value : "";
}

/** Replace one restored value; later marks shift by the length difference. */
export function applyRestorationCorrection(
  content: string,
  marks: RestorationMark[],
  index: number,
  text: string
): { content: string; marks: RestorationMark[] } {
  const target = marks[index];
  if (!target || !text.trim()) return { content, marks };
  const value = text.trim();
  const delta = value.length - (target.end - target.start);
  return {
    content: content.slice(0, target.start) + value + content.slice(target.end),
    marks: marks.map((mark, position) => {
      if (position === index) {
        return { ...mark, end: mark.start + value.length, source: "manual", confidence: 1, status: "ok" };
      }
      return mark.start >= target.end
        ? { ...mark, start: mark.start + delta, end: mark.end + delta }
        : mark;
    })
  };
}

/** Marks from the runtime refer to the answer; the message may carry a prefix. */
export function shiftMarks(marks: RestorationMark[] | undefined, offset: number): RestorationMark[] | undefined {
  if (!marks?.length) return undefined;
  return offset === 0
    ? marks
    : marks.map((mark) => ({ ...mark, start: mark.start + offset, end: mark.end + offset }));
}

/** Marks that no longer point at valid text are dropped rather than shown wrong. */
export function validMarks(content: string, marks: RestorationMark[] | undefined): RestorationMark[] {
  const sorted = [...(marks ?? [])].sort((a, b) => a.start - b.start);
  const result: RestorationMark[] = [];
  let lastEnd = 0;
  for (const mark of sorted) {
    if (mark.start < lastEnd || mark.end > content.length || mark.end <= mark.start) continue;
    result.push(mark);
    lastEnd = mark.end;
  }
  return result;
}

const LEFTOVER_TOKEN = /\[(?:PII|LMPII):[A-Z0-9_:]+(?:\|[A-Z]{2,4})?\]/g;

/** Placeholders the local key could not resolve. */
export function unresolvedPlaceholders(content: string): string[] {
  return [...new Set(content.match(LEFTOVER_TOKEN) ?? [])];
}

export type SubstitutionRow = {
  // Placeholder as the model wrote it, with its case suffix.
  placeholder: string;
  kind: string;
  case?: string;
  caseMissing: boolean;
  text: string;
  occurrences: number;
  tone: RestorationTone;
};

type KeyMark = Pick<RestorationMark, "start" | "end" | "kind" | "case" | "source" | "status" | "confidence"> & {
  token?: string;
  caseMissing?: boolean;
};

/**
 * The reverse of the anonymization key: which placeholder, in which case,
 * became which words - one row per placeholder, case and restored form.
 */
export function substitutionKey(content: string, marks: KeyMark[]): SubstitutionRow[] {
  const rows = new Map<string, SubstitutionRow>();
  for (const mark of marks) {
    const text = content.slice(mark.start, mark.end);
    const base = mark.token ?? mark.kind;
    const placeholder =
      mark.case && !mark.caseMissing && /\]$/.test(base) ? `${base.slice(0, -1)}|${mark.case}]` : base;
    const key = `${placeholder}\u0000${text}`;
    const existing = rows.get(key);
    if (existing) {
      existing.occurrences += 1;
      if (restorationTone(mark) === "review") existing.tone = "review";
      continue;
    }
    rows.set(key, {
      placeholder,
      kind: mark.kind,
      ...(mark.case ? { case: mark.case } : {}),
      caseMissing: Boolean(mark.caseMissing),
      text,
      occurrences: 1,
      tone: restorationTone(mark)
    });
  }
  return [...rows.values()].sort((a, b) => a.placeholder.localeCompare(b.placeholder, "en"));
}
