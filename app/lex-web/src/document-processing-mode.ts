/**
 * How one file is processed; the user picks it per file. Nothing runs on
 * upload. The local model (e.g. Bielik) only helps with OCR correction and
 * personal-data detection - never with the legal answer.
 */
export type DocumentProcessingMode =
  | "OCR"
  | "OCR_AI"
  | "ANONYMIZE"
  | "ANONYMIZE_AI";

export const DOCUMENT_PROCESSING_MODES: ReadonlyArray<{
  mode: DocumentProcessingMode;
  label: string;
  title: string;
}> = [
  {
    mode: "ANONYMIZE",
    label: "OCR + anonimizacja",
    title: "Tekst i OCR stron bez warstwy tekstowej, dane osobowe zastąpione symbolami; osobny zaszyfrowany klucz dokumentu."
  },
  {
    mode: "ANONYMIZE_AI",
    label: "OCR + anonimizacja z AI",
    title: "Jak wyżej, a model lokalny dodatkowo wyszukuje dane osobowe (rozstrzyga z całego zdania) i poprawia błędy OCR w skanach. Wymaga uruchomionego modelu lokalnego."
  },
  {
    mode: "OCR",
    label: "Tylko OCR",
    title: "Sam tekst i OCR, bez anonimizacji: do modelu trafia tekst jawny z danymi osobowymi."
  },
  {
    mode: "OCR_AI",
    label: "Tylko OCR z korektą AI",
    title: "Tekst i OCR, a model lokalny poprawia błędy OCR w skanach (ogonki, sklejone słowa, przeniesienia); bez anonimizacji - tekst jawny. Wymaga uruchomionego modelu lokalnego."
  }
];

export const DEFAULT_DOCUMENT_PROCESSING_MODE: DocumentProcessingMode = "ANONYMIZE";

export function processingModeUsesLocalAi(mode: DocumentProcessingMode): boolean {
  return mode === "ANONYMIZE_AI" || mode === "OCR_AI";
}

/** Without anonymization the text goes to models in clear. */
export function processingModeKeepsClearText(mode: DocumentProcessingMode): boolean {
  return mode === "OCR" || mode === "OCR_AI";
}

/** Options for the runtime: localAi = AI personal-data check, ocrFix = AI OCR correction. */
export function processingModeOptions(
  mode: DocumentProcessingMode
): { localAi?: true; ocrFix?: boolean } | undefined {
  switch (mode) {
    case "ANONYMIZE_AI":
      return { localAi: true, ocrFix: true };
    case "OCR_AI":
      return { ocrFix: true };
    default:
      return undefined;
  }
}

export function processingModeLabel(mode: DocumentProcessingMode): string {
  return DOCUMENT_PROCESSING_MODES.find((item) => item.mode === mode)?.label ?? mode;
}
