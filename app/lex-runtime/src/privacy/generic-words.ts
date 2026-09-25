import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type GenericWords = {
  generic: ReadonlySet<string>;
  institutions: ReadonlySet<string>;
  partyRoles: ReadonlySet<string>;
  personOnlyTriggers: ReadonlySet<string>;
};

let cached: GenericWords | null = null;

function defaultPath(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "../../../privacy/generic_words.json");
}

/**
 * Case forms of nouns that head an institution name ("Bank", "Rada", "Skarb")
 * or name a party role ("Najemca"), from app/privacy/generic_words.json (the
 * same list the SGJP recognizer uses).
 */
export function genericWords(file = process.env.LEX_GENERIC_WORDS ?? defaultPath()): GenericWords {
  if (cached) return cached;
  try {
    const data = JSON.parse(readFileSync(file, "utf8")) as {
      institutions?: string[];
      partyRoles?: string[];
      personOnlyTriggers?: string[];
    };
    cached = {
      generic: new Set([...(data.institutions ?? []), ...(data.partyRoles ?? [])]),
      institutions: new Set(data.institutions ?? []),
      partyRoles: new Set(data.partyRoles ?? []),
      personOnlyTriggers: new Set(data.personOnlyTriggers ?? [])
    };
  } catch (error) {
    process.stderr.write(
      `LEX_GENERIC_WORDS_UNAVAILABLE:${error instanceof Error ? error.message : String(error)}\n`
    );
    cached = { generic: new Set(), institutions: new Set(), partyRoles: new Set(), personOnlyTriggers: new Set() };
  }
  return cached;
}

const WORD = /[\p{L}]+(?:[-'’][\p{L}]+)*/gu;

/**
 * A detected "person" that starts with an institution noun ("Bank", "Bank
 * Pekao", "Rada Gminy") is not a person, unless a person-only word stands
 * right before it ("pani Rada"): null. A leading party role ("Najemca Jan
 * Kowalski") is cut off: the span of the name. Otherwise the span unchanged.
 */
export function personPart<T extends { start: number; end: number; value: string }>(text: string, span: T): T | null {
  const words = genericWords();
  const tokens = [...span.value.matchAll(WORD)];
  const first = tokens[0]?.[0]?.toLowerCase();
  if (!first) return span;
  const before = text.slice(Math.max(0, span.start - 40), span.start).match(WORD);
  const previous = before?.[before.length - 1]?.toLowerCase();
  if (previous && words.personOnlyTriggers.has(previous)) return span;
  if (words.institutions.has(first)) return null;
  let index = 0;
  while (index < tokens.length && words.partyRoles.has(tokens[index]![0].toLowerCase())) index += 1;
  if (index === 0) return span;
  if (index === tokens.length) return null;
  const offset = tokens[index]!.index!;
  return { ...span, start: span.start + offset, value: span.value.slice(offset) };
}

/** A span a local model should confirm from its sentence. */
export function isAmbiguousPerson(span: { value: string; ambiguous?: boolean }): boolean {
  if (span.ambiguous) return true;
  const words = span.value.match(WORD) ?? [];
  return words.length <= 1 || words.some((word) => genericWords().generic.has(word.toLowerCase()));
}

/** The sentence around a span, with the span marked by ⟦ ⟧ (at most ~400 characters). */
export function sentenceAround(text: string, span: { start: number; end: number }): string {
  let start = span.start;
  while (start > 0 && span.start - start < 250 && !/[.!?\n]/.test(text[start - 1]!)) start -= 1;
  let end = span.end;
  while (end < text.length && end - span.end < 250 && !/[.!?\n]/.test(text[end]!)) end += 1;
  if (end < text.length && /[.!?]/.test(text[end]!)) end += 1;
  return (
    text.slice(start, span.start) + "⟦" + text.slice(span.start, span.end) + "⟧" + text.slice(span.end, end)
  )
    .replace(/\s+/g, " ")
    .trim();
}
