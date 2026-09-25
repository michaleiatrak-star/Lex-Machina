/**
 * An anonymized document prepared for a model outside Lex Machina: the
 * legend and the placeholder key first, then the text with page markers.
 * Only symbols - no names, addresses or other values leave with it.
 */
export function modelExportText(input: {
  filename: string;
  modelKey: string | null;
  totalPages: number;
  chunks: ReadonlyArray<{ pageStart: number; pageEnd: number; text: string }>;
}): string {
  const pages = (chunk: { pageStart: number; pageEnd: number }) =>
    chunk.pageStart === chunk.pageEnd
      ? `=== STRONA ${chunk.pageStart}/${input.totalPages} ===`
      : `=== STRONY ${chunk.pageStart}-${chunk.pageEnd}/${input.totalPages} ===`;
  return [
    ...(input.modelKey
      ? [input.modelKey]
      : [
          "# LEGENDA",
          "Dokument nie zawiera symboli osób ani adresów; pozostałe symbole przepisuj bez zmian."
        ]),
    "",
    "# ODPOWIEDŹ",
    "Odpowiadaj wyłącznie symbolami zgodnie z legendą i kluczem powyżej. Odpowiedź wklej potem w Lex Machina („Deanonimizuj plik” przy tym dokumencie) - dane wrócą lokalnie w formach, które wskażesz przypadkami.",
    "",
    `# DOKUMENT (zanonimizowany): ${input.filename}`,
    ...input.chunks.flatMap((chunk) => ["", pages(chunk), chunk.text])
  ].join("\n");
}

export function modelExportFilename(filename: string): string {
  return `${filename.replace(/\.[^.]+$/, "")}-dla-modelu.txt`;
}
