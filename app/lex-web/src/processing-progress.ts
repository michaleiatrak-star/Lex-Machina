import type { ProcessingProgress } from "./api.js";

type Stage = ProcessingProgress["stage"];

// Share of the whole bar per stage; OCR dominates on scans.
const RANGES: Record<Stage, [number, number]> = {
  READING: [0, 5],
  OCR: [5, 60],
  DETECTING: [60, 80],
  PSEUDONYMIZING: [80, 96],
  SAVING: [96, 100]
};

const LABELS: Record<Stage, string> = {
  READING: "Odczyt pliku",
  OCR: "OCR",
  DETECTING: "Wykrywanie danych osobowych",
  PSEUDONYMIZING: "Anonimizacja",
  SAVING: "Zapis zaszyfrowanego klucza"
};

export function progressPercent(progress: Pick<ProcessingProgress, "stage" | "done" | "total">): number {
  const [from, to] = RANGES[progress.stage];
  const fraction =
    progress.total && progress.total > 0 ? Math.min(1, Math.max(0, (progress.done ?? 0) / progress.total)) : 0;
  return Math.round(from + (to - from) * fraction);
}

export function progressLabel(progress: Pick<ProcessingProgress, "stage" | "done" | "total">): string {
  const label = LABELS[progress.stage];
  if (!progress.total || progress.stage === "SAVING" || progress.stage === "READING") return `${label}…`;
  const current = Math.min(progress.total, (progress.done ?? 0) + (progress.stage === "OCR" ? 0 : 1));
  return progress.stage === "OCR"
    ? `${label}: ${progress.done ?? 0} z ${progress.total} stron`
    : `${label}: strona ${current} z ${progress.total}`;
}
