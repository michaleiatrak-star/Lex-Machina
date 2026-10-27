// WYGENEROWANE z aplikacji Lex Machina (app/lex-runtime/src: pdf-text-extractor.ts, core-law-index.ts,
// core-law-footnotes.ts, source-anchor.ts; commit 560c510) — nie edytować ręcznie.
// Ten sam odczyt PDF t.j. co RAG aplikacji (wiersze z geometrii, przypisy, brzmienie obowiązujące).
// Regeneracja: w aplikacji `npm run build:akt-pdf` (app/lex-runtime/scripts/akt-pdf.entry.ts).

// src/pdf-text-extractor.ts
var DEFAULT_PDF_MAX_BYTES = 16 * 1024 * 1024;
var GLUE_GAP_EM = 0.12;
var SMALL_LINE_MARK = "\u2063";
var SMALL_LINE_RATIO = 0.93;
function joinLineItems(items, markSmall = false) {
  if (markSmall) {
    const weight = /* @__PURE__ */ new Map();
    for (const raw of items) {
      const item = raw;
      if (typeof item.str !== "string" || !Array.isArray(item.transform)) continue;
      const size = Math.round(Math.hypot(item.transform[2] ?? 0, item.transform[3] ?? 0) * 10) / 10;
      weight.set(size, (weight.get(size) ?? 0) + item.str.trim().length);
    }
    const body = [...weight.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;
    const lines = [0];
    for (const raw of items) {
      const item = raw;
      if (typeof item.str !== "string") continue;
      if (item.str.trim() && Array.isArray(item.transform)) {
        const size = Math.hypot(item.transform[2] ?? 0, item.transform[3] ?? 0);
        lines[lines.length - 1] = Math.max(lines[lines.length - 1], size);
      }
      if (item.hasEOL) lines.push(0);
    }
    const joined = joinLineItems(items).split("\n");
    return joined.map((text, index) => {
      const size = lines[index] ?? 0;
      return body > 0 && size > 0 && size < body * SMALL_LINE_RATIO && text.trim() ? SMALL_LINE_MARK + text : text;
    }).join("\n");
  }
  let out = "";
  let previous = null;
  for (const raw of items) {
    const item = raw;
    if (typeof item.str !== "string") continue;
    const transform = Array.isArray(item.transform) ? item.transform : null;
    const x = transform?.[4] ?? 0;
    const y = transform?.[5] ?? 0;
    const size = transform ? Math.hypot(transform[2] ?? 0, transform[3] ?? 0) : 0;
    if (previous) {
      if (previous.eol) {
        out += "\n";
      } else {
        const em = Math.max(previous.size, size);
        const gap = x - previous.end;
        const glue = transform !== null && em > 0 && Math.abs(y - previous.y) < em * 0.5 && gap < em * GLUE_GAP_EM && gap > -em * 0.5 && /\p{L}$/u.test(previous.str) && // Dywiz przeniesienia bywa osobnym elementem innym fontem („przedsię” + „-”).
        /^(?:\p{L}|-$)/u.test(item.str);
        const touching = transform !== null && em > 0 && Math.abs(y - previous.y) < em * 0.1 && Math.abs(size - previous.size) < em * 0.05 && Math.abs(gap) < em * 0.05 && /[\p{L}\d]$/u.test(previous.str) && // Bez nawiasu: znacznik odnośnika „25 )” musi zostać rozdzielony.
        /^[\p{L}\d.]/u.test(item.str);
        out += glue || touching ? "" : " ";
      }
    }
    out += item.str;
    previous = {
      str: item.str,
      x,
      y,
      end: x + (typeof item.width === "number" ? item.width : 0),
      size,
      eol: Boolean(item.hasEOL)
    };
  }
  return out;
}

// src/warsaw-date.ts
var WARSAW_DATE = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Warsaw",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

// src/core-law-search.ts
var STOPWORDS = new Set(
  "a aby albo ale bez by byc byl byla bylo czy dla do gdy gdzie i ich ile im jak jaka jakie jaki jest jestem jego jej juz ktora ktore ktory kto lub ma mam mi moge moze mozna na nad nie niz o od oraz po pod przez przy sa sie so ta tak tego tej to tu ty w we wiec z za ze zeby zgodnie art ust pkt lit par paragraf ustawa ustawy kodeks kodeksu prosze czym jesli jezeli co mnie moj moja moje".split(" ")
);

// src/core-law-footnotes.ts
var NOTE_START = /^(\d{1,3})\)\s+(?=\p{Lu})/u;
var NOTE_START_SMALL = /^(\d{1,3}) ?\)\s+(?=\p{Lu})/u;
var NOTE_VOCABULARY = /^(?:W brzmieniu|W tym brzmieniu|Zdani[ae]|Wyraz|Dodan|Uchylon|Skreślon|Ze zmian|Przez art|Zmian[ay] tekstu|Niniejsz|Oznaczenie|Utracił|Utracił[ay]|Z dniem|Stosownie|Na podstawie|Część wspólna|Wyrok|Uznan|Tracą|Obowiązuje|Wejdzie|Wchodzi|Uchylony|Uchylona|Uchylone|Utrac|Nowe brzmienie|Obecnie|Treść|Zgodnie z|Ustawa|Art\. \d)/u;
var NOTE_MARKER = /(?<![\p{L}\d])(\d{1,3})(?: \)(?=\s|$|[.,;:)])|\)(?= ?\)))/gu;
function extractPageFootnotes(pageTexts) {
  const footnotes = {};
  let open = null;
  const pages = pageTexts.map((page) => {
    if (!page.includes(SMALL_LINE_MARK)) return page;
    const lines = page.split("\n");
    let start = lines.length;
    while (start > 0 && (lines[start - 1].startsWith(SMALL_LINE_MARK) || !lines[start - 1].trim())) start -= 1;
    const block = lines.slice(start).map((line) => line.replaceAll(SMALL_LINE_MARK, "").trim()).filter(Boolean);
    const numbered = block.some((line) => NOTE_START_SMALL.test(line));
    if (!block.length || !numbered && open === null) return page.replaceAll(SMALL_LINE_MARK, "");
    let current = NOTE_START_SMALL.test(block[0]) ? null : open;
    for (const line of block) {
      const number = NOTE_START_SMALL.exec(line)?.[1];
      if (number) {
        current = number;
        footnotes[number] = line.replace(NOTE_START_SMALL, "").trim();
      } else if (current) {
        footnotes[current] = `${footnotes[current]} ${line}`.trim();
      }
    }
    open = current;
    return lines.slice(0, start).join("\n").replaceAll(SMALL_LINE_MARK, "");
  });
  if (pages.some((page, index) => page !== pageTexts[index])) return { pages: pages.map(spacedMarkers), footnotes };
  return extractFootnotesByContent(pageTexts, footnotes);
}
function spacedMarkers(page) {
  return page.replace(/\) (\d{1,3})\)(?=\s|$)/gu, ") $1 )");
}
function extractFootnotesByContent(pageTexts, footnotes) {
  const pages = pageTexts.map((page) => {
    const lines = page.split("\n");
    const start = lines.findIndex((line, index) => {
      const number = NOTE_START.exec(line)?.[1];
      if (!number || !NOTE_VOCABULARY.test(line.replace(NOTE_START, ""))) return false;
      if (lines.slice(index + 1).some((next) => /^(?:Art\.\s*\d|§\s*\d+[a-z]*\.)/u.test(next))) return false;
      const above = lines.slice(0, index).join("\n");
      return new RegExp(`[^\\n\\d]\\s?${number}\\s?\\)`, "u").test(above);
    });
    if (start < 0) return page;
    let current = null;
    for (const line of lines.slice(start)) {
      const number = NOTE_START.exec(line)?.[1];
      if (number) {
        current = number;
        footnotes[number] = line.replace(NOTE_START, "").trim();
      } else if (current) {
        footnotes[current] = `${footnotes[current]} ${line.trim()}`.trim();
      }
    }
    return lines.slice(0, start).join("\n");
  });
  return { pages, footnotes };
}
var STRUCTURE_HEADING = /\n(?:(?:KSIĘGA|CZĘŚĆ|Część|TYTUŁ|Tytuł|DZIAŁ|Dział|Rozdział|ROZDZIAŁ|Oddział|ODDZIAŁ|Podrozdział)\s+(?:[IVXLCDM]+[a-z]{0,2}|\d+[a-z]*(?:\s*\[\s*\d+\s*\]|\s+\d{1,2}(?=\s*\n))?|[A-ZĄĆĘŁŃÓŚŹŻ]+)(?:\s|$)|Załącznik(?:i|\s+nr\s+\d+)?\s+do\s+ustawy\s)/u;
function stripTrailingHeadings(text) {
  const match = STRUCTURE_HEADING.exec(text);
  return match ? text.slice(0, match.index).trimEnd() : text;
}
var LABEL_MARKER = /(?<=^(?:§ \d+[a-z]*(?:\s*\[\s*\d+[a-z]*\s*\])?|\d+[a-z]*|Art\.\s*\d+[a-z]*(?:\s*\[\s*\d+[a-z]*\s*\][a-z]*|\s+\d{1,3}[a-z]*)?)\s*\.\s*)(\d{1,3})\)(?=\s+(?:\p{Lu}|\d+[a-z]*\.\s|§))/gmu;
var POINT_LINE = /^(\d{1,3})[a-z]*\)\s/u;
var SPACED_POINT = /^(\d{1,3})([a-z]*) \)(?=\s)/u;
function protectPointLabels(text) {
  const lines = text.split("\n");
  const number = (line) => {
    const match = line === void 0 ? null : POINT_LINE.exec(line) ?? SPACED_POINT.exec(line);
    return match ? Number(match[1]) : null;
  };
  return lines.map((line, index) => {
    const spaced = SPACED_POINT.exec(line);
    if (!spaced) return line;
    const own = Number(spaced[1]);
    const before = lines.slice(0, index).reverse().find((other) => number(other) !== null);
    const after = lines.slice(index + 1).find((other) => number(other) !== null);
    const neighbour = number(before) === own - 1 || number(after) === own + 1;
    return neighbour ? line.replace(SPACED_POINT, "$1$2)") : line;
  }).join("\n");
}
function articleFootnotes(text, footnotes) {
  const notes = [];
  const strip = (marker, number) => {
    if (footnotes[number] === void 0) return marker;
    notes.push(number);
    return "";
  };
  const cleaned = protectPointLabels(text).replace(NOTE_MARKER, strip).replace(
    LABEL_MARKER,
    (marker, number) => NOTE_VOCABULARY.test(footnotes[number] ?? "") ? strip(marker, number) : marker
  );
  return { text: cleaned.replace(/[ \t]{2,}/g, " ").replace(/ +\n/g, "\n"), notes };
}
var MONTHS = {
  stycznia: 1,
  lutego: 2,
  marca: 3,
  kwietnia: 4,
  maja: 5,
  czerwca: 6,
  lipca: 7,
  sierpnia: 8,
  wrze\u015Bnia: 9,
  pa\u017Adziernika: 10,
  listopada: 11,
  grudnia: 12
};
function futureDate(note) {
  const match = /wejd(?:zie|ą) w życie z dniem (\d{1,2}) (\p{L}+) (\d{4}) r\./u.exec(note);
  const month = match ? MONTHS[match[2].toLocaleLowerCase("pl")] : void 0;
  if (!match || !month) return null;
  return `${match[3]}-${String(month).padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}
function noteDate(note, footnotes, depth = 0) {
  const act = depth > 0 ? /któr[aey] (?:weszł[ay]|wchodzi|wchodzą|wejdzie|wejdą) w życie z dniem (\d{1,2} \p{L}+ \d{4} r\.)/u.exec(note)?.[1] : void 0;
  if (act) return futureDate(`wejdzie w \u017Cycie z dniem ${act}`);
  const direct = futureDate(note) ?? futureDate(note.replace(/weszł[ay] w życie/u, "wejdzie w \u017Cycie"));
  if (direct || depth >= 3) return direct;
  const next = /o której mowa w odnośniku (\d{1,3})/u.exec(note)?.[1];
  return next && footnotes[next] !== void 0 ? noteDate(footnotes[next], footnotes, depth + 1) : null;
}
var ARTICLE_LABEL = String.raw`Art\.\s*\d+[a-z]*(?:\s*\[\s*\d+[a-z]*\s*\]\s*[a-z]*|\s+\d{1,3}[a-z]*(?=\s+\.))?\s*\.`;
var UNIT_LABEL = new RegExp(String.raw`^(${ARTICLE_LABEL}|§ \d+[a-z]*(?:\s*\[\s*\d+[a-z]*\s*\]|\s+\d{1,2}(?=\s*\.))?\s*\.|\d+[a-z]*\.(?=\s)|\d+[a-z]*\)|[a-z]{1,2}\))`, "u");
var UNIT_LINE = new RegExp(String.raw`^(${ARTICLE_LABEL}|§ \d+[a-z]*(?:\s*\[\s*\d+[a-z]*\s*\]|\s+\d{1,2}(?=\s*\.))?\s*\.|\d+[a-z]*\.(?=\s)|\d+[a-z]*\)|[a-z]{1,2}\))\s*(?:(\d{1,3}) \)|(?<=[.]\s*)(\d{1,3})\)(?=\s+\p{Lu}))`, "u");
var FIRST_UNIT_IN_HEADING = new RegExp(String.raw`^(${ARTICLE_LABEL})\s+(?=§ \d+[a-z]*(?:\s*\[\s*\d+[a-z]*\s*\])?\s*\.|\d+[a-z]*\.\s)`, "u");
function unitLevel(label) {
  if (label.startsWith("Art")) return -1;
  if (label.startsWith("\xA7")) return 0;
  if (label.endsWith(".")) return 1;
  if (/^\d/u.test(label)) return 2;
  return 3;
}
function articleWording(markedText, footnotes, today) {
  const joinNext = /* @__PURE__ */ new Set();
  const lines = [];
  for (const raw of protectPointLabels(markedText).split("\n")) {
    const line = raw.replace(LABEL_MARKER, (marker, number) => footnotes[number] === void 0 ? marker : `${number} )`);
    const head = FIRST_UNIT_IN_HEADING.exec(line);
    if (head) {
      joinNext.add(lines.length);
      lines.push(head[1], line.slice(head[0].length));
    } else {
      lines.push(line);
    }
  }
  const units = [];
  lines.forEach((line, index) => {
    const unit = UNIT_LINE.exec(line);
    const label = unit?.[1] ?? UNIT_LABEL.exec(line)?.[1];
    if (!label) return;
    const note = unit?.[2] ?? (unit?.[3] && NOTE_VOCABULARY.test(footnotes[unit[3]] ?? "") ? unit[3] : null);
    units.push({ label, level: unitLevel(label), note: note && footnotes[note] !== void 0 ? note : null, start: index, end: lines.length });
  });
  units.forEach((unit, index) => {
    const next = units.slice(index + 1).find((other) => other.level <= unit.level);
    unit.end = next ? next.start : lines.length;
    if (unit.level < 0 && unit.note === null) {
      const child = units[index + 1] && units[index + 1].start < unit.end ? units[index + 1].start : unit.end;
      const own = lines.slice(unit.start, Math.max(child, unit.start + 1)).join("\n");
      for (const match of own.matchAll(NOTE_MARKER)) {
        if (footnotes[match[1]] !== void 0) {
          unit.note = match[1];
          break;
        }
      }
    }
  });
  const drop = /* @__PURE__ */ new Set();
  const pending = [];
  let unresolved = false;
  units.forEach((unit, index) => {
    const note = unit.note ? footnotes[unit.note] ?? "" : "";
    const until = /[Oo]bowiązuje do wejścia w życie zmiany, o której mowa w odnośniku (\d{1,3})/u.exec(note)?.[1];
    const body = () => lines.slice(unit.start, unit.end).join("\n");
    if (until) {
      const next = units.slice(index + 1).find((other) => other.level <= unit.level);
      const from = noteDate(footnotes[until] ?? "", footnotes);
      if (!from || !next || next.note !== until) {
        unresolved = true;
        return;
      }
      const [keep, skip] = today < from ? [unit, next] : [next, unit];
      for (let line = skip.start; line < skip.end; line += 1) drop.add(line);
      if (today < from) pending.push({ from, text: lines.slice(next.start, next.end).join("\n") });
      void keep;
      return;
    }
    if (/^Dodan[yaei]\b/u.test(note)) {
      const from = noteDate(note, footnotes);
      if (from && today < from) {
        for (let line = unit.start; line < unit.end; line += 1) drop.add(line);
        pending.push({ from, text: body() });
      }
    } else if (/wejdzie w życie/u.test(note) && !noteDate(note, footnotes)) {
      unresolved = true;
    }
  });
  const unitNotes = new Set(units.map((unit) => unit.note).filter((note) => note !== null));
  lines.forEach((line, index) => {
    if (drop.has(index)) return;
    for (const match of line.matchAll(NOTE_MARKER)) {
      const number = match[1];
      if (!unitNotes.has(number) && /obowiązuje do wejścia w życie zmiany/u.test(footnotes[number] ?? "")) unresolved = true;
    }
  });
  const keptLines = [];
  let glue = false;
  lines.forEach((line, index) => {
    if (drop.has(index)) return;
    if (glue && keptLines.length) keptLines[keptLines.length - 1] += ` ${line}`;
    else keptLines.push(line);
    glue = joinNext.has(index);
  });
  const kept = keptLines.map((line) => line.replace(LABEL_MARKER, (marker, number) => footnotes[number] === void 0 ? marker : "")).join("\n");
  return {
    text: kept.replace(NOTE_MARKER, (marker, number) => footnotes[number] === void 0 ? marker : "").replace(/[ \t]{2,}/g, " ").replace(/ +\n/g, "\n"),
    pending,
    unresolved
  };
}
function hasPendingWording(markedText, footnotes, today) {
  const wording = articleWording(markedText, footnotes, today);
  return wording.unresolved || wording.pending.length > 0;
}

// src/source-anchor.ts
var TO_SUPERSCRIPT = ["\u2070", "\xB9", "\xB2", "\xB3", "\u2074", "\u2075", "\u2076", "\u2077", "\u2078", "\u2079"];
function articleHeadingPattern() {
  return /(?:^|\n)\s*(?:Art\.\s*(?<num>\d+[a-z]{0,4})(?:\s*\[\s*(?<sup>\d+)\s*(?<supIn>[a-z]{0,4})\s*\]\s*(?<supAfter>[a-z]{0,4})|\s+(?<supSpaced>\d{1,3})(?<supSpacedLetters>[a-z]{0,4})(?=\s+\.))?\s*\.|Artykuł\s+(?<treaty>\d+[a-z]{0,4})\.?|Art\.\s*(?<from>\d+)\s*[–—-]\s*(?<to>\d+)\s*\.)(?=\s)/gu;
}
var MAX_RANGE = 500;
function articleIdsFromHeading(match) {
  const group = match.groups ?? {};
  if (group.from && group.to) {
    const from = Number(group.from);
    const to = Number(group.to);
    if (to <= from || to - from > MAX_RANGE) return [`${group.from}\u2013${group.to}`];
    return Array.from({ length: to - from + 1 }, (_, index) => String(from + index));
  }
  if (group.treaty) return [group.treaty];
  const digits = group.sup ?? group.supSpaced ?? "";
  const sup = [...digits].map((digit) => TO_SUPERSCRIPT[Number(digit)]).join("");
  return [`${group.num}${sup}${group.supIn || group.supAfter || group.supSpacedLetters || ""}`];
}
function normalizeArticleId(raw) {
  const value = raw.replace(/^art\.?\s*/iu, "").replace(/\s+/gu, "").toLocaleLowerCase("pl");
  const marked = /^(\d+[a-z]{0,4})(?:\[(\d+)([a-z]{0,4})\]|\^(\d+)([a-z]{0,4}))$/u.exec(value);
  if (!marked) return value;
  const digits = marked[2] ?? marked[4];
  const letters = marked[3] ?? marked[5] ?? "";
  return `${marked[1]}${[...digits].map((digit) => TO_SUPERSCRIPT[Number(digit)]).join("")}${letters}`;
}

// src/core-law-index.ts
var CHECK_AFTER_MS = 24 * 60 * 60 * 1e3;
var RETRY_AFTER_BLOCK_MS = 60 * 60 * 1e3;
var SCHEDULE_TICK_MS = 60 * 60 * 1e3;
var CORE_LAW_PDF_LIMITS = { maxBytes: 128 * 1024 * 1024, maxPages: 5e3, maxTextChars: 6e7 };
var PDF_TIMEOUT_MS = 10 * 6e4;
var USE_CHECK_AFTER_MS = 15 * 60 * 1e3;
function stripPdfPageHeaders(text) {
  const plain = (line) => line.replaceAll(SMALL_LINE_MARK, "");
  return text.split("\n").filter((line) => !/^\s*©?\s*Kancelaria Sejmu\s+s\.\s*\d+\s*\/\s*\d+\s*$/iu.test(plain(line))).filter((line) => !/^\s*\d{4}-\d{2}-\d{2}\s*$/u.test(plain(line))).filter((line) => !/^\s*Dziennik Ustaw(?:\s+Nr\s*\d+)?\s*[–—-]\s*\d+\s*[–—-]\s*Poz\.\s*\d+(?:\s+www\.rcl\.gov\.pl)?\s*$/iu.test(plain(line))).filter((line) => !/^\s*www\.rcl\.gov\.pl\s*$/iu.test(plain(line))).filter((line) => !/^\s*Dziennik Ustaw(?:\s+Nr\s*\d+)?\s*[–—-]\s*\d+\s*[–—-]?\s*$/iu.test(plain(line))).filter((line) => !/^\s*Poz\.\s*\d+\s*$/iu.test(plain(line))).join("\n").replace(new RegExp(`(\\p{L})-\\n${SMALL_LINE_MARK}?(\\p{Ll})`, "gu"), "$1$2").replace(
    /(?<!\p{L})([Nn]ie)(później|wcześniej|dłużej|dłuższ\p{L}*|krócej|krótsz\p{L}*|wyżej|wyższ\p{L}*|niżej|niższ\p{L}*|większ\p{L}*|mniejsz\p{L}*|więcej|rzadziej|częściej|dawniej|dalej|bliżej|prędzej)(?!\p{L})/gu,
    "$1 $2"
  ).replace(/(?<!\p{L})([Nn]ie)(mniej)(?=\s+niż(?!\p{L}))/gu, "$1 $2");
}
var DZU_FONT_MAP = {
  "\xE0": "\u0105",
  "\xE7": "\u0107",
  "\xB4": "\u0119",
  "\u220F": "\u0142",
  "\u0192": "\u0144",
  "\xCA": "\u015B",
  "\xEA": "\u017A",
  "\u02DD": "\u017C",
  "\xA5": "\u0104",
  "\xC6": "\u0106",
  "\xA3": "\u0141",
  "\u0152": "\u015A",
  "\xAF": "\u017B"
};
function repairDzuPdfEncoding(text) {
  if (!/\p{L}[´∏˝ƒ]|[∏˝]\p{L}/u.test(text)) return text;
  return text.replace(/[àç´∏ƒÊê˝¥Æ£Œ¯]/gu, (char) => DZU_FONT_MAP[char] ?? char);
}
function articleBase(id) {
  return Number.parseInt(id, 10);
}
function checkArticleExtraction(text, order) {
  const headings = [...text.matchAll(articleHeadingPattern())];
  const marks = headings.map((match) => articleIdsFromHeading(match)[0]);
  const startOf = /* @__PURE__ */ new Map();
  headings.forEach((match, index) => {
    if (!startOf.has(marks[index])) startOf.set(marks[index], match.index);
  });
  const gaps = [];
  const suspect = /* @__PURE__ */ new Set();
  let outOfOrder = 0;
  for (let index = 1; index < order.length; index += 1) {
    const previous = articleBase(order[index - 1]);
    const current = articleBase(order[index]);
    const between = text.slice(startOf.get(order[index - 1]) ?? 0, startOf.get(order[index]) ?? 0);
    if (current > previous + 1 && /\n(?:Rozdział|ROZDZIAŁ|DZIAŁ|Dział|Oddział|TYTUŁ|Tytuł)\s[^\n]*\n\s*\(uchylon[yae]\)/u.test(between)) {
      continue;
    }
    if (current > previous + 1) {
      gaps.push(current === previous + 2 ? String(previous + 1) : `${previous + 1}\u2013${current - 1}`);
      suspect.add(order[index - 1]);
    } else if (current < previous) {
      outOfOrder += 1;
      suspect.add(order[index - 1]);
    }
  }
  const seen = /* @__PURE__ */ new Set();
  let duplicates = 0;
  marks.forEach((id, index) => {
    if (seen.has(id)) {
      duplicates += 1;
      if (index > 0) suspect.add(marks[index - 1]);
    }
    seen.add(id);
  });
  return { gaps, outOfOrder, duplicates, suspectArticles: [...suspect].filter((id) => order.includes(id)) };
}
function splitArticles(text) {
  const marks = [...text.matchAll(articleHeadingPattern())].map((match) => ({
    ids: articleIdsFromHeading(match),
    start: match.index + (match[0].startsWith("\n") ? 1 : 0)
  }));
  const order = [];
  const articles = {};
  const repeats = {};
  marks.forEach((mark, index) => {
    const end = marks[index + 1]?.start ?? text.length;
    const body = text.slice(mark.start, end).trim();
    if (articles[mark.ids[0]] !== void 0) {
      if (mark.ids.length === 1) (repeats[mark.ids[0]] ??= []).push(body);
      return;
    }
    for (const id of mark.ids) {
      if (articles[id] !== void 0) continue;
      articles[id] = body;
      order.push(id);
    }
  });
  return { order, articles, repeats };
}
var PERMANENT_RETRY_MS = 24 * 60 * 60 * 1e3;
export {
  SMALL_LINE_MARK,
  articleFootnotes,
  articleWording,
  checkArticleExtraction,
  extractPageFootnotes,
  hasPendingWording,
  joinLineItems,
  normalizeArticleId,
  repairDzuPdfEncoding,
  splitArticles,
  stripPdfPageHeaders,
  stripTrailingHeadings
};
