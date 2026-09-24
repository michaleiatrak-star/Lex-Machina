/**
 * Progress of a long document operation (OCR, detection, pseudonymization),
 * so the case view can show a bar while the request runs. The client picks a
 * random id, sends it as X-Lex-Progress and polls it within the same case.
 * Only stage names and counts are kept, plus the words the local AI is
 * checking (in memory, readable only within the same case).
 */
export type ProcessingStage =
  | "READING"
  | "OCR"
  | "DETECTING"
  | "AI_CHECK"
  | "PSEUDONYMIZING"
  | "SAVING";

export type ProcessingProgress = {
  stage: ProcessingStage;
  done?: number;
  total?: number;
  // AI_CHECK: the words the local model is checking now (shown only in this case).
  item?: string;
};

export type ProgressReporter = (progress: ProcessingProgress) => void;

const PROGRESS_ID = /^[a-z0-9]{16,64}$/;
const TTL_MS = 15 * 60 * 1000;
const MAX_ENTRIES = 500;

export function progressIdFrom(value: unknown): string | undefined {
  const id = typeof value === "string" ? value.trim().toLowerCase() : "";
  return PROGRESS_ID.test(id) ? id : undefined;
}

export class ProcessingProgressRegistry {
  private readonly entries = new Map<
    string,
    { caseId: string; progress: ProcessingProgress; updatedAt: number }
  >();

  constructor(private readonly now: () => number = Date.now) {}

  reporter(caseId: string, progressId: string | undefined): ProgressReporter | undefined {
    if (!progressId) return undefined;
    return (progress) => {
      this.prune();
      const existing = this.entries.get(progressId);
      // An id is bound to the case that first used it.
      if (existing && existing.caseId !== caseId) return;
      this.entries.set(progressId, { caseId, progress: { ...progress }, updatedAt: this.now() });
    };
  }

  get(caseId: string, progressId: string): (ProcessingProgress & { updatedAt: string }) | undefined {
    this.prune();
    const entry = this.entries.get(progressId);
    if (!entry || entry.caseId !== caseId) return undefined;
    return { ...entry.progress, updatedAt: new Date(entry.updatedAt).toISOString() };
  }

  private prune(): void {
    const limit = this.now() - TTL_MS;
    for (const [id, entry] of this.entries) {
      if (entry.updatedAt < limit) this.entries.delete(id);
    }
    while (this.entries.size > MAX_ENTRIES) {
      this.entries.delete(this.entries.keys().next().value!);
    }
  }
}
