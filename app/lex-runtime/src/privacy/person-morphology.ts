import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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
  gender: "m1" | "f";
  genderAlternatives: string[];
  status: "ok" | "gender_ambiguous" | "needs_review";
  forms: Record<PersonCase, PersonForm>;
  warnings: string[];
};

export interface PersonMorphology {
  analyze(surfaces: string[]): Promise<Array<PersonEntity | null>>;
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
    gender: value.gender === "f" ? "f" : "m1",
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
  private readonly cache = new Map<string, PersonEntity | null>();

  constructor(
    options: {
      python?: string;
      workerPath?: string;
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
  }

  async analyze(surfaces: string[]): Promise<Array<PersonEntity | null>> {
    const missing = [...new Set(surfaces)].filter((surface) => !this.cache.has(surface));
    if (missing.length > 0) {
      const results = await this.run(missing);
      missing.forEach((surface, index) => {
        this.cache.set(surface, results[index] ?? null);
      });
    }
    return surfaces.map((surface) => this.cache.get(surface) ?? null);
  }

  private async run(surfaces: string[]): Promise<Array<PersonEntity | null>> {
    const tempRoot = await mkdtemp(path.join(os.tmpdir(), "lex-person-morphology-"));
    const input = path.join(tempRoot, "input.json");
    const output = path.join(tempRoot, "output.json");
    try {
      await writeFile(
        input,
        JSON.stringify({ persons: surfaces.map((surface) => ({ surface })) }),
        "utf8"
      );
      await new Promise<void>((resolve, reject) => {
        const child = spawn(
          this.python,
          ["-X", "utf8", this.workerPath, "--input", input, "--output", output],
          { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] }
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
      const parsed = JSON.parse(await readFile(output, "utf8")) as { persons?: unknown[] };
      return (parsed.persons ?? []).map(toEntity);
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  }
}
