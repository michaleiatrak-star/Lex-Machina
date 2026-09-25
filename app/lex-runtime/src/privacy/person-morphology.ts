import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Grammatical cases a model may request for a person token:
 * [PII:PERSON:0001|INS] -> "Janem Kowalskim".
 */
export const PERSON_CASES = [
  "NOM",
  "GEN",
  "DAT",
  "ACC",
  "INS",
  "LOC",
  "VOC"
] as const;

export type PersonCase = typeof PERSON_CASES[number];

const WORKER_CASE: Record<string, PersonCase> = {
  nom: "NOM",
  gen: "GEN",
  dat: "DAT",
  acc: "ACC",
  inst: "INS",
  loc: "LOC",
  voc: "VOC"
};

export type PersonForm = {
  text: string;
  // sgjp, rule, exception, frozen, unresolved - or "+"-joined for multi-word names.
  source: string;
  confidence: number;
};

export type PersonEntity = {
  canonical: string;
  // m1/f for persons; m3/n also for addresses (the gender the street name agrees with).
  gender: "m1" | "f" | "m3" | "n";
  genderAlternatives: string[];
  status: "ok" | "gender_ambiguous" | "needs_review";
  forms: Record<PersonCase, PersonForm>;
  warnings: string[];
};

export interface PersonMorphology {
  analyze(surfaces: string[]): Promise<Array<PersonEntity | null>>;
  // Whether each word is a form in the SGJP dictionary (OCR correction).
  knownWords?(words: string[]): Promise<boolean[]>;
  // "ul. Długiej 5" -> "ul. Długa 5" with its seven case forms.
  analyzeAddresses?(surfaces: string[]): Promise<Array<PersonEntity | null>>;
  saveCorrection?(correction: NameFormCorrection): Promise<void>;
}

export type NameFormCorrection = {
  canonical: string;
  gender: "m1" | "f";
  case: PersonCase;
  text: string;
};

const CASE_TO_WORKER: Record<PersonCase, string> = {
  NOM: "nom",
  GEN: "gen",
  DAT: "dat",
  ACC: "acc",
  INS: "inst",
  LOC: "loc",
  VOC: "voc"
};

const NAME_TEXT = /^[\p{L}\p{M}'’. -]{1,200}$/u;

/**
 * Word forms the user confirmed ("Müller" -> DAT "Müllerowi"). Stored per
 * word, not per person or case, so the file is a spelling dictionary rather
 * than a list of clients.
 */
export function defaultNameExceptionsPath(env: NodeJS.ProcessEnv = process.env): string {
  const override = env.LEX_NAME_EXCEPTIONS?.trim();
  if (override) return path.resolve(override);
  const base = env.LOCALAPPDATA?.trim();
  return base
    ? path.resolve(base, "LexMachina", "privacy", "name-forms.json")
    : path.resolve(os.homedir(), ".lex-machina", "privacy", "name-forms.json");
}

type ExceptionFile = Record<string, Record<string, Record<string, string>>>;

export async function saveNameFormCorrection(
  file: string,
  correction: NameFormCorrection
): Promise<void> {
  if (
    !NAME_TEXT.test(correction.canonical) ||
    !NAME_TEXT.test(correction.text) ||
    !(PERSON_CASES as readonly string[]).includes(correction.case) ||
    (correction.gender !== "m1" && correction.gender !== "f")
  ) {
    throw new Error("NAME_FORM_INVALID");
  }
  const words = correction.canonical.trim().split(/[\s-]+/u);
  const forms = correction.text.trim().split(/[\s-]+/u);
  if (words.length !== forms.length) {
    throw new Error("NAME_FORM_WORDS_MISMATCH");
  }
  let entries: ExceptionFile = {};
  try {
    entries = JSON.parse(await readFile(file, "utf8")) as ExceptionFile;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  words.forEach((word, index) => {
    const byGender = (entries[word] ??= {});
    const paradigm = (byGender[correction.gender] ??= {});
    paradigm.nom ??= word;
    paradigm[CASE_TO_WORKER[correction.case]] = forms[index]!;
  });
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(entries, null, 1), { encoding: "utf8", mode: 0o600 });
  await rename(temporary, file);
}

function defaultWorkerPath(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "../../../privacy/polish_person_morphology.py");
}

function toEntity(raw: unknown): PersonEntity | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const forms = value.forms as Record<string, PersonForm> | undefined;
  if (typeof value.canonical !== "string" || !forms) return null;
  const mapped = {} as Record<PersonCase, PersonForm>;
  for (const [key, form] of Object.entries(forms)) {
    const personCase = WORKER_CASE[key];
    if (!personCase || typeof form?.text !== "string") return null;
    mapped[personCase] = {
      text: form.text,
      source: String(form.source ?? "unresolved"),
      confidence: Number(form.confidence ?? 0)
    };
  }
  if (PERSON_CASES.some((personCase) => !mapped[personCase])) return null;
  return {
    canonical: value.canonical,
    gender:
      value.gender === "f" || value.gender === "m3" || value.gender === "n"
        ? value.gender
        : "m1",
    genderAlternatives: Array.isArray(value.genderAlternatives)
      ? value.genderAlternatives.map(String)
      : [],
    status:
      value.status === "gender_ambiguous" || value.status === "needs_review"
        ? value.status
        : "ok",
    forms: mapped,
    warnings: Array.isArray(value.warnings) ? value.warnings.map(String) : []
  };
}

/** Morfeusz2/SGJP engine in the payload Python (same interpreter as Stanza NER). */
export class LocalPersonMorphology implements PersonMorphology {
  private readonly python: string;
  private readonly workerPath: string;
  private readonly exceptionsPath: string;
  private readonly cache = new Map<string, PersonEntity | null>();
  private readonly addressCache = new Map<string, PersonEntity | null>();

  constructor(
    options: {
      python?: string;
      workerPath?: string;
      exceptionsPath?: string;
      timeoutMs?: number;
    } = {},
    private readonly timeoutMs = options.timeoutMs ?? 120_000
  ) {
    this.python =
      options.python ??
      process.env.LEX_NER_PYTHON ??
      "python3";
    this.workerPath =
      options.workerPath ??
      process.env.LEX_PERSON_MORPHOLOGY_WORKER ??
      defaultWorkerPath();
    this.exceptionsPath =
      options.exceptionsPath ??
      defaultNameExceptionsPath();
  }

  async saveCorrection(correction: NameFormCorrection): Promise<void> {
    await saveNameFormCorrection(this.exceptionsPath, correction);
    this.cache.clear();
    this.addressCache.clear();
  }

  async analyze(surfaces: string[]): Promise<Array<PersonEntity | null>> {
    return this.cached(surfaces, this.cache, (missing) => this.run(missing, []).then((r) => r.persons));
  }

  async analyzeAddresses(surfaces: string[]): Promise<Array<PersonEntity | null>> {
    return this.cached(surfaces, this.addressCache, (missing) => this.run([], missing).then((r) => r.addresses));
  }

  async knownWords(words: string[]): Promise<boolean[]> {
    if (!words.length) return [];
    return (await this.run([], [], words)).known;
  }

  private async cached(
    surfaces: string[],
    cache: Map<string, PersonEntity | null>,
    load: (missing: string[]) => Promise<Array<PersonEntity | null>>
  ): Promise<Array<PersonEntity | null>> {
    const missing = [...new Set(surfaces)].filter((surface) => !cache.has(surface));
    if (missing.length > 0) {
      const results = await load(missing);
      missing.forEach((surface, index) => {
        cache.set(surface, results[index] ?? null);
      });
    }
    return surfaces.map((surface) => cache.get(surface) ?? null);
  }

  private async run(
    surfaces: string[],
    addresses: string[],
    words: string[] = []
  ): Promise<{ persons: Array<PersonEntity | null>; addresses: Array<PersonEntity | null>; known: boolean[] }> {
    const tempRoot = await mkdtemp(path.join(os.tmpdir(), "lex-person-morphology-"));
    const input = path.join(tempRoot, "input.json");
    const output = path.join(tempRoot, "output.json");
    try {
      await writeFile(
        input,
        JSON.stringify({
          persons: surfaces.map((surface) => ({ surface })),
          addresses: addresses.map((surface) => ({ surface })),
          words
        }),
        "utf8"
      );
      await new Promise<void>((resolve, reject) => {
        const child = spawn(
          this.python,
          ["-X", "utf8", this.workerPath, "--input", input, "--output", output],
          {
            windowsHide: true,
            stdio: ["ignore", "ignore", "pipe"],
            env: { ...process.env, LEX_NAME_EXCEPTIONS: this.exceptionsPath }
          }
        );
        let stderr = "";
        child.stderr?.on("data", (chunk) => {
          stderr = (stderr + String(chunk)).slice(-4000);
        });
        const timer = setTimeout(() => {
          child.kill();
          reject(new Error("PERSON_MORPHOLOGY_TIMEOUT"));
        }, this.timeoutMs);
        child.once("error", (error) => {
          clearTimeout(timer);
          reject(error);
        });
        child.once("exit", (code) => {
          clearTimeout(timer);
          if (code === 0) resolve();
          else reject(new Error(`PERSON_MORPHOLOGY_FAILED:${code}:${stderr.trim().slice(-400)}`));
        });
      });
      const parsed = JSON.parse(await readFile(output, "utf8")) as {
        persons?: unknown[];
        addresses?: unknown[];
        known?: unknown[];
      };
      return {
        persons: (parsed.persons ?? []).map(toEntity),
        addresses: (parsed.addresses ?? []).map(toEntity),
        known: words.map((_, index) => parsed.known?.[index] === true)
      };
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  }
}
