import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  LocalPdfTextExtractor,
  type PdfTextExtractor
} from "./pdf-text-extractor.js";

/**
 * Core law: every Dz.U. act named in the domain act maps (dr-* MAPA-AKTOW.md)
 * and the central prawo-polskie routing map, fetched from the official Sejm
 * ELI API in the version the map points to, split into articles and kept
 * locally so every model (local ones included) can read the exact wording,
 * also offline. The text is never generated from model memory.
 */
export type CoreActRef = {
  eli: string;
  // The map marks this reference as a consolidated text (t.j.).
  consolidated: boolean;
  labels: string[];
  domains: string[];
  notes: string[];
};

export type CoreActRecord = {
  eli: string;
  title: string;
  type: string | null;
  status: string | null;
  promulgation: string | null;
  textSource: "html" | "pdf" | "none";
  fetchedAt: string;
  sourceUrl: string;
  articleOrder: string[];
  articles: Record<string, string>;
  text: string;
};

export type CoreActSummary = {
  eli: string;
  title: string | null;
  status: string | null;
  consolidated: boolean;
  labels: string[];
  domains: string[];
  textSource: CoreActRecord["textSource"] | null;
  articleCount: number;
  fetchedAt: string | null;
  lastError: string | null;
  // ELI of the consolidated text actually served (a newer t.j. than the map's).
  currentEli: string;
  amendmentsAfter: CoreAmendment[];
};

export type CoreAmendment = {
  eli: string;
  title: string | null;
  promulgation: string | null;
};

export type CoreLawFetch = (
  input: string,
  init?: RequestInit
) => Promise<Response>;

const ELI_API = "https://api.sejm.gov.pl/eli";
// Texts are downloaded once. Consolidated texts are re-checked (ELI relations
// only, no text) at most once a day for new amendments or a newer t.j.
const CHECK_AFTER_MS = 24 * 60 * 60 * 1000;
const RETRY_AFTER_BLOCK_MS = 60 * 60 * 1000;
const REQUEST_GAP_MS = 750;
const REQUEST_TIMEOUT_MS = 90_000;
const MAX_CONSECUTIVE_FAILURES = 5;
const NOTE_CHARS = 400;

const REF_PATTERN =
  /Dz\.\s?U\.\s?(?:z\s)?(\d{4})\s?(?:r\.\s)?(?:nr\s\d+\s)?poz\.\s?(\d+)((?:\s*,\s*(?:\d{4}\s?poz\.\s?)?\d+(?!\d|\.\d))*)(\s*t\.\s?j\.)?/g;

function cleanNote(line: string): string {
  return line
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, NOTE_CHARS);
}

function labelFor(line: string): string | null {
  const bold = /\*\*(?:Baza\s+)?([^*:]{1,40}):\*\*/.exec(line);
  if (bold?.[1]) return bold[1].trim();
  if (line.trim().startsWith("|")) {
    const cell = line.split("|")[1]?.replace(/\*\*/g, "").trim();
    if (cell && !/^-+$/.test(cell) && !/^Akt prawny$/i.test(cell) && !/^Zakres$/i.test(cell)) {
      return cell.slice(0, 80);
    }
  }
  return null;
}

function mapFiles(corpusRoot: string): Array<{ domain: string; file: string }> {
  const files: Array<{ domain: string; file: string }> = [];
  for (const entry of fs.readdirSync(corpusRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith("dr-")) continue;
    const file = path.join(corpusRoot, entry.name, "MAPA-AKTOW.md");
    if (fs.existsSync(file)) files.push({ domain: entry.name, file });
  }
  const routing = path.join(corpusRoot, "prawo-polskie-v2", "ROUTING-MAP.md");
  if (fs.existsSync(routing)) {
    files.push({ domain: "prawo-polskie-v2", file: routing });
  }
  return files.sort((a, b) => a.domain.localeCompare(b.domain));
}

/** All Dz.U. acts named in the domain act maps and the routing map. */
export function extractCoreActs(corpusRoot: string): CoreActRef[] {
  const acts = new Map<string, CoreActRef>();
  const add = (
    eli: string,
    consolidated: boolean,
    domain: string,
    label: string | null,
    note: string
  ) => {
    const current =
      acts.get(eli) ??
      { eli, consolidated: false, labels: [], domains: [], notes: [] };
    current.consolidated ||= consolidated;
    if (label && !current.labels.includes(label)) current.labels.push(label);
    if (!current.domains.includes(domain)) current.domains.push(domain);
    if (note && current.notes.length < 6 && !current.notes.includes(note)) {
      current.notes.push(note);
    }
    acts.set(eli, current);
  };

  for (const { domain, file } of mapFiles(corpusRoot)) {
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const label = labelFor(line);
      const note = cleanNote(line);
      for (const match of line.matchAll(REF_PATTERN)) {
        const year = match[1]!;
        const tail = match[3] ?? "";
        const consolidated = Boolean(match[4]) && tail.trim() === "";
        add(`DU/${year}/${Number(match[2])}`, consolidated, domain, label, note);
        let currentYear = year;
        for (const item of tail.split(",").map((part) => part.trim()).filter(Boolean)) {
          const withYear = /^(\d{4})\s?poz\.\s?(\d+)$/.exec(item);
          if (withYear) {
            currentYear = withYear[1]!;
            add(`DU/${currentYear}/${Number(withYear[2])}`, false, domain, null, note);
          } else if (/^\d+$/.test(item)) {
            add(`DU/${currentYear}/${Number(item)}`, false, domain, null, note);
          }
        }
      }
    }
  }
  return [...acts.values()].sort(
    (a, b) =>
      Number(b.consolidated) - Number(a.consolidated) ||
      a.eli.localeCompare(b.eli, "en", { numeric: true })
  );
}

const ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: "\"",
  apos: "'",
  ndash: "–",
  mdash: "—",
  sect: "§",
  bdquo: "„",
  rdquo: "”",
  hellip: "…"
};

export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style|head)[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr|table|section|article)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (entity, name: string) => ENTITIES[name.toLowerCase()] ?? entity)
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Article number -> article text. The first occurrence of a number wins. */
export function splitArticles(text: string): {
  order: string[];
  articles: Record<string, string>;
} {
  const pattern = /(?:^|\n)\s*Art\.\s*(\d+[a-z]{0,4})\.(?=\s)/g;
  const marks = [...text.matchAll(pattern)].map((match) => ({
    id: match[1]!,
    start: match.index! + (match[0].startsWith("\n") ? 1 : 0)
  }));
  const order: string[] = [];
  const articles: Record<string, string> = {};
  marks.forEach((mark, index) => {
    if (articles[mark.id] !== undefined) return;
    const end = marks[index + 1]?.start ?? text.length;
    articles[mark.id] = text.slice(mark.start, end).trim();
    order.push(mark.id);
  });
  return { order, articles };
}

export function normalizeForSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .toLocaleLowerCase("pl");
}

type ActState = {
  title: string | null;
  status: string | null;
  textSource: CoreActRecord["textSource"] | null;
  articleCount: number;
  fetchedAt: string | null;
  lastError: string | null;
  checkedAt?: string | null;
  currentEli?: string;
  amendmentsAfter?: CoreAmendment[];
};

type IndexState = {
  acts: Record<string, ActState>;
  blockedUntil: string | null;
};

type EliActLink = {
  eli: string;
  year: number;
  pos: number;
  title: string | null;
  promulgation: string | null;
  status: string;
};

function eliLinks(refs: unknown, relation: (key: string) => boolean): EliActLink[] {
  if (!refs || typeof refs !== "object") return [];
  const links: EliActLink[] = [];
  for (const [key, value] of Object.entries(refs as Record<string, unknown>)) {
    if (!relation(key) || !Array.isArray(value)) continue;
    for (const item of value) {
      const wrapper = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      const act = (wrapper.act && typeof wrapper.act === "object" ? wrapper.act : wrapper) as Record<string, unknown>;
      const match = /^DU\/(\d{4})\/(\d+)$/i.exec(String(act.ELI ?? "").trim());
      if (!match) continue;
      links.push({
        eli: `DU/${match[1]}/${Number(match[2])}`,
        year: Number(match[1]),
        pos: Number(match[2]),
        title: typeof act.title === "string" ? act.title : null,
        promulgation: typeof act.promulgation === "string" ? act.promulgation : null,
        status: typeof act.status === "string" ? act.status : ""
      });
    }
  }
  return links;
}

function eliOrder(eli: string): [number, number] {
  const match = /^DU\/(\d{4})\/(\d+)$/.exec(eli);
  return match ? [Number(match[1]), Number(match[2])] : [0, 0];
}

export function defaultCoreLawDir(env: NodeJS.ProcessEnv = process.env): string {
  const override = env.LEX_CORE_LAW_DIR?.trim();
  if (override) return path.resolve(override);
  const base = env.LOCALAPPDATA?.trim();
  return base
    ? path.resolve(base, "LexMachina", "core-law")
    : path.resolve(os.homedir(), ".lex-machina", "core-law");
}

function fileNameFor(eli: string): string {
  return eli.replace(/\//g, "_") + ".json";
}

export class CoreLawIndex {
  private refs: CoreActRef[] = [];
  private state: IndexState = { acts: {}, blockedUntil: null };
  private readonly cache = new Map<string, CoreActRecord>();
  private refreshing: Promise<void> | null = null;

  constructor(
    private readonly directory: string = defaultCoreLawDir(),
    private readonly fetcher: CoreLawFetch = globalThis.fetch.bind(globalThis),
    private readonly pdf: PdfTextExtractor = new LocalPdfTextExtractor(),
    private readonly now: () => number = () => Date.now(),
    private readonly gapMs: number = REQUEST_GAP_MS
  ) {}

  load(corpusRoot: string): void {
    this.refs = extractCoreActs(corpusRoot);
    fs.mkdirSync(this.directory, { recursive: true });
    try {
      this.state = JSON.parse(
        fs.readFileSync(path.join(this.directory, "index.json"), "utf8")
      ) as IndexState;
    } catch {
      this.state = { acts: {}, blockedUntil: null };
    }
  }

  summaries(): CoreActSummary[] {
    return this.refs.map((ref) => {
      const state = this.state.acts[ref.eli];
      return {
        eli: ref.eli,
        title: state?.title ?? null,
        status: state?.status ?? null,
        consolidated: ref.consolidated,
        labels: ref.labels,
        domains: ref.domains,
        textSource: state?.textSource ?? null,
        articleCount: state?.articleCount ?? 0,
        fetchedAt: state?.fetchedAt ?? null,
        lastError: state?.lastError ?? null,
        currentEli: state?.currentEli ?? ref.eli,
        amendmentsAfter: state?.amendmentsAfter ?? []
      };
    });
  }

  summary(eli: string): CoreActSummary | null {
    return this.summaries().find((act) => act.eli === eli) ?? null;
  }

  /** The text to serve for a map act: its newest downloaded t.j. */
  currentRecord(eli: string): CoreActRecord | null {
    const current = this.state.acts[eli]?.currentEli ?? eli;
    return this.record(current) ?? this.record(eli);
  }

  ref(eli: string): CoreActRef | undefined {
    return this.refs.find((item) => item.eli === eli);
  }

  // Amendments downloaded after a consolidated text are readable by ELI too.
  private refOrAmendment(eli: string): CoreActRef | null {
    const ref = this.ref(eli);
    if (ref) return ref;
    for (const [mapEli, state] of Object.entries(this.state.acts)) {
      if (state.amendmentsAfter?.some((item) => item.eli === eli)) {
        return {
          eli,
          consolidated: false,
          labels: [],
          domains: this.ref(mapEli)?.domains ?? [],
          notes: [`Nowelizacja po tekście jednolitym ${state.currentEli ?? mapEli}`]
        };
      }
    }
    return null;
  }

  /** ELI, "Dz.U. 2025 poz. 383", a map label (KK, Kodeks spółek handlowych) or a title fragment. */
  resolve(act: string): CoreActRef | null {
    const trimmed = act.trim();
    const eli = /^DU\/(\d{4})\/(\d+)$/i.exec(trimmed);
    if (eli) return this.refOrAmendment(`DU/${eli[1]}/${Number(eli[2])}`);
    const dzu = /(\d{4})\s*(?:r\.\s*)?poz\.\s*(\d+)/i.exec(trimmed);
    if (dzu) return this.refOrAmendment(`DU/${dzu[1]}/${Number(dzu[2])}`);
    const wanted = normalizeForSearch(trimmed).replace(/[.\s]+/g, "");
    if (!wanted) return null;
    const scored = this.refs
      .map((ref) => {
        const names = [
          ...ref.labels,
          this.state.acts[ref.eli]?.title ?? ""
        ].map((name) => normalizeForSearch(name).replace(/[.\s]+/g, ""));
        const exact = names.some((name) => name === wanted);
        const partial = names.some((name) => name.length > 0 && name.includes(wanted));
        return { ref, score: exact ? 2 : partial ? 1 : 0 };
      })
      .filter((item) => item.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          Number(b.ref.consolidated) - Number(a.ref.consolidated)
      );
    return scored[0]?.ref ?? null;
  }

  record(eli: string): CoreActRecord | null {
    const cached = this.cache.get(eli);
    if (cached) return cached;
    try {
      const record = JSON.parse(
        fs.readFileSync(path.join(this.directory, fileNameFor(eli)), "utf8")
      ) as CoreActRecord;
      if (this.cache.size > 24) {
        this.cache.delete(this.cache.keys().next().value!);
      }
      this.cache.set(eli, record);
      return record;
    } catch {
      return null;
    }
  }

  /** Background refresh; returns immediately when one is already running. */
  refresh(): Promise<void> {
    this.refreshing ??= this.refreshAll().finally(() => {
      this.refreshing = null;
    });
    return this.refreshing;
  }

  private saveState(): void {
    const target = path.join(this.directory, "index.json");
    fs.writeFileSync(`${target}.tmp`, JSON.stringify(this.state, null, 1));
    fs.renameSync(`${target}.tmp`, target);
  }

  private async store(eli: string): Promise<CoreActRecord> {
    const record = await this.fetchAct(eli);
    fs.writeFileSync(
      path.join(this.directory, fileNameFor(eli)),
      JSON.stringify(record)
    );
    this.cache.delete(eli);
    return record;
  }

  private async pause(): Promise<void> {
    if (this.gapMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.gapMs));
    }
  }

  /**
   * A consolidated text is re-read only when ELI shows a newer t.j. of the
   * same act; a new amendment after the t.j. is downloaded on its own.
   */
  private async checkConsolidated(ref: CoreActRef, state: ActState): Promise<void> {
    const current = state.currentEli ?? ref.eli;
    const references = await (
      await this.get(`${ELI_API}/acts/${current}/references`, "application/json")
    ).json();

    const known = new Set((state.amendmentsAfter ?? []).map((item) => item.eli));
    const amendments = eliLinks(references, (key) => /^Nowelizacje po tekście jednolitym$/i.test(key));
    for (const amendment of amendments) {
      if (known.has(amendment.eli)) continue;
      await this.pause();
      if (!this.record(amendment.eli)) {
        await this.store(amendment.eli);
      }
      state.amendmentsAfter = [
        ...(state.amendmentsAfter ?? []),
        { eli: amendment.eli, title: amendment.title, promulgation: amendment.promulgation }
      ];
      known.add(amendment.eli);
    }

    const base = eliLinks(references, (key) => /jednolit\S* dla/i.test(key))[0];
    if (base) {
      await this.pause();
      const baseReferences = await (
        await this.get(`${ELI_API}/acts/${base.eli}/references`, "application/json")
      ).json();
      const [currentYear, currentPos] = eliOrder(current);
      const newest = eliLinks(baseReferences, (key) => /^Inf\. o tekście jednolitym$/i.test(key))
        .filter((link) => !/uchyl|nieobowi/i.test(link.status))
        .sort((a, b) => a.year - b.year || a.pos - b.pos)
        .at(-1);
      if (
        newest &&
        (newest.year > currentYear ||
          (newest.year === currentYear && newest.pos > currentPos))
      ) {
        await this.pause();
        const record = await this.store(newest.eli);
        state.currentEli = newest.eli;
        // Amendments before the new t.j. are part of it now.
        state.amendmentsAfter = [];
        state.title = record.title;
        state.status = record.status;
        state.textSource = record.textSource;
        state.articleCount = record.articleOrder.length;
        state.fetchedAt = record.fetchedAt;
      }
    }
    state.checkedAt = new Date(this.now()).toISOString();
  }

  private async refreshAll(): Promise<void> {
    if (
      this.state.blockedUntil &&
      Date.parse(this.state.blockedUntil) > this.now()
    ) {
      return;
    }
    let consecutiveFailures = 0;
    for (const ref of this.refs) {
      const state: ActState =
        this.state.acts[ref.eli] ??
        { title: null, status: null, textSource: null, articleCount: 0, fetchedAt: null, lastError: null };
      const downloaded = this.record(state.currentEli ?? ref.eli) !== null;
      const checkDue =
        downloaded &&
        ref.consolidated &&
        (!state.checkedAt || this.now() - Date.parse(state.checkedAt) >= CHECK_AFTER_MS);
      if (downloaded && !checkDue) continue;

      try {
        if (!downloaded) {
          const record = await this.store(ref.eli);
          Object.assign(state, {
            title: record.title,
            status: record.status,
            textSource: record.textSource,
            articleCount: record.articleOrder.length,
            fetchedAt: record.fetchedAt,
            currentEli: ref.eli,
            checkedAt: new Date(this.now()).toISOString()
          });
        } else {
          await this.checkConsolidated(ref, state);
        }
        state.lastError = null;
        consecutiveFailures = 0;
      } catch (error) {
        // Keep the text already held; only record why this attempt failed.
        state.lastError = error instanceof Error ? error.message : String(error);
        consecutiveFailures += 1;
      }
      this.state.acts[ref.eli] = state;
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        this.state.blockedUntil = new Date(this.now() + RETRY_AFTER_BLOCK_MS).toISOString();
        this.saveState();
        return;
      }
      this.saveState();
      await this.pause();
    }
    this.state.blockedUntil = null;
    this.saveState();
  }

  private async get(url: string, accept: string): Promise<Response> {
    const response = await this.fetcher(url, {
      headers: {
        Accept: accept,
        "User-Agent": "LexMachina-core-law-index/1.0"
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
    if (!response.ok) {
      throw new Error(`ELI_HTTP_${response.status}`);
    }
    return response;
  }

  private async fetchAct(eli: string): Promise<CoreActRecord> {
    const base = `${ELI_API}/acts/${eli}`;
    const meta = (await (await this.get(base, "application/json")).json()) as Record<string, unknown>;
    const text = (value: unknown) => (typeof value === "string" ? value : null);

    let body = "";
    let textSource: CoreActRecord["textSource"] = "none";
    let sourceUrl = base;
    if (meta.textHTML === true) {
      sourceUrl = `${base}/text.html`;
      body = htmlToText(await (await this.get(sourceUrl, "text/html")).text());
      textSource = "html";
    } else if (meta.textPDF === true) {
      sourceUrl = `${base}/text.pdf`;
      const bytes = new Uint8Array(
        await (await this.get(sourceUrl, "application/pdf")).arrayBuffer()
      );
      body = (await this.pdf.extract(bytes)).text;
      textSource = "pdf";
    }
    const { order, articles } = splitArticles(body);
    return {
      eli,
      title: text(meta.title) ?? eli,
      type: text(meta.type),
      status: text(meta.status),
      promulgation: text(meta.promulgation),
      textSource,
      fetchedAt: new Date(this.now()).toISOString(),
      sourceUrl,
      articleOrder: order,
      articles,
      text: body
    };
  }
}
