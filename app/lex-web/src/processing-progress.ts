import type { ProcessingProgress } from "./api.js";

type Stage = ProcessingProgress["stage"];

// Share of the whole bar per stage; OCR dominates on scans.
const RANGES: Record<Stage, [number, number]> = {
  READING: [0, 5],
  OCR: [5, 60],
  DETECTING: [60, 72],
  AI_CHECK: [72, 85],
  PSEUDONYMIZING: [85, 96],
  SAVING: [96, 100]
};

const LABELS: Record<Stage, string> = {
  READING: "Odczyt pliku",
  OCR: "OCR",
  DETECTING: "Wykrywanie danych osobowych",
  AI_CHECK: "Lokalne AI sprawdza w kontekście zdania",
  PSEUDONYMIZING: "Anonimizacja",
  SAVING: "Zapis zaszyfrowanego klucza"
};

export function progressPercent(progress: Pick<ProcessingProgress, "stage" | "done" | "total">): number {
  const [from, to] = RANGES[progress.stage];
  const fraction =
    progress.total && progress.total > 0 ? Math.min(1, Math.max(0, (progress.done ?? 0) / progress.total)) : 0;
  return Math.round(from + (to - from) * fraction);
}

export function progressLabel(progress: Pick<ProcessingProgress, "stage" | "done" | "total" | "item">): string {
  const label = LABELS[progress.stage];
  if (progress.stage === "AI_CHECK") {
    const count = progress.total ? ` (${Math.min(progress.done ?? 0, progress.total)} z ${progress.total} sprawdzonych)` : "";
    return progress.item ? `${label}: ${progress.item}${count}` : `${label}${count}`;
  }
  if (!progress.total || progress.stage === "SAVING" || progress.stage === "READING") return `${label}…`;
  const current = Math.min(progress.total, (progress.done ?? 0) + (progress.stage === "OCR" ? 0 : 1));
  return progress.stage === "OCR"
    ? `${label}: ${progress.done ?? 0} z ${progress.total} stron`
    : `${label}: strona ${current} z ${progress.total}`;
}
