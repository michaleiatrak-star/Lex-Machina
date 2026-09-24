export type TextSelection = {
  text: string;
  start: number;
  end: number;
};

export type FormatAction =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "h1"
  | "h2"
  | "h3"
  | "bullet"
  | "numbered"
  | "quote"
  | "code"
  | "rule"
  | "link";

const INLINE: Partial<Record<FormatAction, [string, string]>> = {
  bold: ["**", "**"],
  italic: ["_", "_"],
  underline: ["<u>", "</u>"],
  strike: ["~~", "~~"],
  code: ["`", "`"]
};

const LINE_PREFIX: Partial<Record<FormatAction, string>> = {
  h1: "# ",
  h2: "## ",
  h3: "### ",
  bullet: "- ",
  quote: "> "
};

const ANY_LINE_PREFIX = /^(#{1,6} |- |\* |\d+\. |> )/;

function lineBounds(text: string, start: number, end: number): [number, number] {
  const from = text.lastIndexOf("\n", start - 1) + 1;
  const newline = text.indexOf("\n", end > start && text[end - 1] === "\n" ? end - 1 : end);
  return [from, newline === -1 ? text.length : newline];
}

/** Markdown-style formatting of the selection; a second click on the same format removes it. */
export function applyFormat(selection: TextSelection, action: FormatAction): TextSelection {
  const { text, start, end } = selection;
  const inline = INLINE[action];
  if (inline) {
    const [open, close] = inline;
    const selected = text.slice(start, end);
    if (
      text.slice(start - open.length, start) === open &&
      text.slice(end, end + close.length) === close
    ) {
      return {
        text: text.slice(0, start - open.length) + selected + text.slice(end + close.length),
        start: start - open.length,
        end: end - open.length
      };
    }
    return {
      text: text.slice(0, start) + open + selected + close + text.slice(end),
      start: start + open.length,
      end: end + open.length
    };
  }
  if (action === "rule") {
    const insert = `${start > 0 && text[start - 1] !== "\n" ? "\n" : ""}\n---\n\n`;
    return {
      text: text.slice(0, start) + insert + text.slice(end),
      start: start + insert.length,
      end: start + insert.length
    };
  }
  if (action === "link") {
    const label = text.slice(start, end) || "tekst";
    const insert = `[${label}](https://)`;
    const urlStart = start + label.length + 3;
    return {
      text: text.slice(0, start) + insert + text.slice(end),
      start: urlStart,
      end: urlStart + "https://".length
    };
  }
  const [from, to] = lineBounds(text, start, end);
  const lines = text.slice(from, to).split("\n");
  const prefixFor = (index: number) =>
    action === "numbered" ? `${index + 1}. ` : LINE_PREFIX[action]!;
  const alreadyApplied = lines.every((line, index) =>
    action === "numbered" ? /^\d+\. /.test(line) : line.startsWith(prefixFor(index))
  );
  const next = lines
    .map((line, index) => {
      const bare = line.replace(ANY_LINE_PREFIX, "");
      return alreadyApplied ? bare : prefixFor(index) + bare;
    })
    .join("\n");
  return {
    text: text.slice(0, from) + next + text.slice(to),
    start: from,
    end: from + next.length
  };
}

export function countOccurrences(text: string, needle: string, matchCase: boolean): number {
  if (!needle) return 0;
  const haystack = matchCase ? text : text.toLocaleLowerCase("pl");
  const target = matchCase ? needle : needle.toLocaleLowerCase("pl");
  let count = 0;
  for (let index = haystack.indexOf(target); index !== -1; index = haystack.indexOf(target, index + target.length)) {
    count += 1;
  }
  return count;
}

/** Next match after `from` (wraps around); null when absent. */
export function findNext(
  text: string,
  needle: string,
  from: number,
  matchCase: boolean
): { start: number; end: number } | null {
  if (!needle) return null;
  const haystack = matchCase ? text : text.toLocaleLowerCase("pl");
  const target = matchCase ? needle : needle.toLocaleLowerCase("pl");
  const index = haystack.indexOf(target, from);
  const found = index === -1 ? haystack.indexOf(target) : index;
  return found === -1 ? null : { start: found, end: found + needle.length };
}

export function replaceAll(
  text: string,
  needle: string,
  replacement: string,
  matchCase: boolean
): { text: string; count: number } {
  if (!needle) return { text, count: 0 };
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let count = 0;
  const next = text.replace(new RegExp(escaped, matchCase ? "gu" : "giu"), () => {
    count += 1;
    return replacement;
  });
  return { text: next, count };
}

/** UTF-8 first; legacy Polish files (Windows-1250) otherwise decode to U+FFFD. */
export function decodeTextFile(bytes: Uint8Array): { text: string; encoding: "utf-8" | "windows-1250" } {
  const utf8 = new TextDecoder("utf-8").decode(bytes);
  if (!utf8.includes("�")) {
    return { text: utf8.replace(/^﻿/, ""), encoding: "utf-8" };
  }
  try {
    return { text: new TextDecoder("windows-1250").decode(bytes), encoding: "windows-1250" };
  } catch {
    return { text: utf8, encoding: "utf-8" };
  }
}

/** "pismo.txt" -> "pismo (edycja).txt"; an existing "(edycja N)" suffix is bumped. */
export function editedFilename(filename: string): string {
  const dot = filename.lastIndexOf(".");
  const stem = dot > 0 ? filename.slice(0, dot) : filename;
  const extension = dot > 0 ? filename.slice(dot) : "";
  const match = /^(.*) \(edycja(?: (\d+))?\)$/.exec(stem);
  if (!match) return `${stem} (edycja)${extension}`;
  const next = match[2] ? Number(match[2]) + 1 : 2;
  return `${match[1]} (edycja ${next})${extension}`;
}

export function textStats(text: string): { words: number; characters: number; lines: number } {
  const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
  return { words, characters: text.length, lines: text ? text.split("\n").length : 0 };
}

export type MarkdownInline =
  | { kind: "text"; text: string }
  | { kind: "bold" | "italic" | "underline" | "strike"; children: MarkdownInline[] }
  | { kind: "code"; text: string }
  | { kind: "link"; text: string; href: string };

export type MarkdownBlock =
  | { kind: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; content: MarkdownInline[] }
  | { kind: "paragraph"; content: MarkdownInline[] }
  | { kind: "list"; ordered: boolean; items: MarkdownInline[][] }
  | { kind: "quote"; content: MarkdownInline[] }
  | { kind: "code"; text: string }
  | { kind: "rule" };

const INLINE_PATTERN =
  /(\*\*(.+?)\*\*|__(.+?)__|<u>(.+?)<\/u>|~~(.+?)~~|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|(?<![\w*])[*_](?![\s*_])(.+?)(?<![\s*_])[*_](?![\w*]))/u;

export function parseInline(source: string): MarkdownInline[] {
  const result: MarkdownInline[] = [];
  let rest = source;
  while (rest) {
    const match = INLINE_PATTERN.exec(rest);
    if (!match) {
      result.push({ kind: "text", text: rest });
      break;
    }
    if (match.index > 0) result.push({ kind: "text", text: rest.slice(0, match.index) });
    const [, , bold, boldAlt, underline, strike, code, linkText, href, italic] = match;
    if (bold ?? boldAlt) result.push({ kind: "bold", children: parseInline((bold ?? boldAlt)!) });
    else if (underline) result.push({ kind: "underline", children: parseInline(underline) });
    else if (strike) result.push({ kind: "strike", children: parseInline(strike) });
    else if (code) result.push({ kind: "code", text: code });
    else if (linkText) result.push({ kind: "link", text: linkText, href: href! });
    else result.push({ kind: "italic", children: parseInline(italic!) });
    rest = rest.slice(match.index + match[0].length);
  }
  return result;
}

/** Small Markdown subset rendered as React elements - never as HTML. */
export function parseMarkdown(source: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) blocks.push({ kind: "paragraph", content: parseInline(paragraph.join(" ")) });
    paragraph = [];
  };
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]!;
    if (line.startsWith("```")) {
      flush();
      const code: string[] = [];
      for (index += 1; index < lines.length && !lines[index]!.startsWith("```"); index += 1) {
        code.push(lines[index]!);
      }
      blocks.push({ kind: "code", text: code.join("\n") });
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      blocks.push({
        kind: "heading",
        level: heading[1]!.length as 1 | 2 | 3 | 4 | 5 | 6,
        content: parseInline(heading[2]!)
      });
      continue;
    }
    if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      flush();
      blocks.push({ kind: "rule" });
      continue;
    }
    const listItem = /^\s*([-*]|\d+\.)\s+(.*)$/.exec(line);
    if (listItem) {
      flush();
      const ordered = /\d/.test(listItem[1]!);
      const last = blocks[blocks.length - 1];
      if (last?.kind === "list" && last.ordered === ordered) last.items.push(parseInline(listItem[2]!));
      else blocks.push({ kind: "list", ordered, items: [parseInline(listItem[2]!)] });
      continue;
    }
    const quote = /^>\s?(.*)$/.exec(line);
    if (quote) {
      flush();
      blocks.push({ kind: "quote", content: parseInline(quote[1]!) });
      continue;
    }
    if (!line.trim()) {
      flush();
      continue;
    }
    paragraph.push(line.trim());
  }
  flush();
  return blocks;
}
