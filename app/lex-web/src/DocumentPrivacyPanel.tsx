import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  finalizeDocument,
  reviewDocument,
  uploadCaseFile,
  type DocumentAttachmentSelection,
  type DocumentIngestionResponse,
  type DocumentReviewResponse,
  type PagePrivacyDirective,
  type PiiKind,
  type PrivacyAction,
  type StoredUploadResponse
} from "./api.js";

const PII_KINDS: Array<{
  value: PiiKind;
  label: string;
}> = [
  { value: "PERSON", label: "Osoba" },
  { value: "ADDRESS", label: "Adres" },
  { value: "PESEL", label: "PESEL" },
  { value: "NIP", label: "NIP" },
  { value: "REGON", label: "REGON" },
  { value: "IBAN", label: "Rachunek / IBAN" },
  { value: "EMAIL", label: "E-mail" },
  { value: "PHONE", label: "Telefon" },
  { value: "CUSTOM", label: "Inne" }
];

function rangesOverlap(
  a: { start: number; end: number },
  b: { start: number; end: number }
): boolean {
  return a.start < b.end && a.end > b.start;
}

export function DocumentPrivacyPanel({
  caseId,
  incomingFile,
  onIncomingFileConsumed,
  onAttachmentSelectionChange,
  onCaseFilesChange
}: {
  caseId: string;
  incomingFile?: File | null;
  onIncomingFileConsumed?: () => void;
  onAttachmentSelectionChange?: (
    selection: DocumentAttachmentSelection | null
  ) => void;
  onCaseFilesChange?: () => void;
}) {
  const textRef =
    useRef<HTMLTextAreaElement>(null);
  const [review, setReview] =
    useState<DocumentReviewResponse | null>(
      null
    );
  const [finalized, setFinalized] =
    useState<DocumentIngestionResponse | null>(
      null
    );
  const [page, setPage] = useState(1);
  const [selection, setSelection] =
    useState<{ start: number; end: number } | null>(
      null
    );
  const [action, setAction] =
    useState<PrivacyAction>("PSEUDONYMIZE");
  const [kind, setKind] =
    useState<PiiKind>("PERSON");
  const [label, setLabel] = useState("");
  const [directives, setDirectives] =
    useState<PagePrivacyDirective[]>([]);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState("");
  const [selectedChunkIndices, setSelectedChunkIndices] =
    useState<number[]>([]);
  const [archiveUpload, setArchiveUpload] =
    useState<StoredUploadResponse | null>(null);

  useEffect(() => {
    if (!incomingFile) return;
    let cancelled = false;
    void openFile(
      incomingFile
    ).finally(() => {
      if (!cancelled) {
        onIncomingFileConsumed?.();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [incomingFile]);

  const currentPage = useMemo(
    () =>
      review?.pages.find(
        (item) => item.page === page
      ) ?? null,
    [review, page]
  );

  const pageSuggestions = useMemo(
    () =>
      review?.suggestions.filter(
        (item) => item.page === page
      ) ?? [],
    [review, page]
  );

  const selectedText =
    selection && currentPage
      ? currentPage.text.slice(
          selection.start,
          selection.end
        )
      : "";

  async function openFile(
    file: File | undefined
  ): Promise<void> {
    if (!file) return;
    setLoading(true);
    setError("");
    setReview(null);
    setFinalized(null);
    setArchiveUpload(null);
    setDirectives([]);
    setSelection(null);
    setSelectedChunkIndices([]);
    onAttachmentSelectionChange?.(null);

    try {
      if (!caseId) {
        throw new Error("CASE_STORAGE_NOT_READY");
      }

      const isZip =
        file.type === "application/zip" ||
        file.name.toLowerCase().endsWith(".zip");

      if (isZip) {
        const stored =
          await uploadCaseFile(
            caseId,
            file
          );
        setArchiveUpload(stored);
        onCaseFilesChange?.();
        return;
      }

      const result =
        await reviewDocument(
          file,
          caseId
        );
      setReview(result);
      onCaseFilesChange?.();
      setPage(
        result.pages[0]?.page ?? 1
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "DOCUMENT_REVIEW_FAILED"
      );
    } finally {
      setLoading(false);
    }
  }

  function captureSelection(): void {
    const target = textRef.current;
    if (!target) return;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    setSelection(
      end > start
        ? { start, end }
        : null
    );
  }

  function addDirective(
    candidate?: PagePrivacyDirective
  ): void {
    if (!currentPage) return;

    const next =
      candidate ??
      (
        selection
          ? {
              page: currentPage.page,
              start: selection.start,
              end: selection.end,
              action,
              ...(action === "PSEUDONYMIZE"
                ? { kind }
                : {}),
              ...(
                (action === "LABEL" ||
                  action === "PSEUDONYMIZE") &&
                label.trim()
                  ? { label: label.trim() }
                  : {}
              )
            }
          : null
      );

    if (!next) return;
    if (
      next.action === "LABEL" &&
      !next.label?.trim()
    ) {
      setError(
        "Podaj etykietę dla oznaczenia."
      );
      return;
    }

    if (
      directives.some(
        (item) =>
          item.page === next.page &&
          rangesOverlap(item, next)
      )
    ) {
      setError(
        "To zaznaczenie nachodzi na wcześniejszą decyzję. Usuń konfliktujące zaznaczenie."
      );
      return;
    }

    setDirectives((items) => [
      ...items,
      next
    ]);
    setSelection(null);
    setLabel("");
    setError("");
  }

  async function finalize(): Promise<void> {
    if (!review) return;
    setLoading(true);
    setError("");
    try {
      const result =
        await finalizeDocument(
          caseId,
          review.documentId,
          directives
        );
      setFinalized(result);
      setSelectedChunkIndices([]);
      onAttachmentSelectionChange?.(null);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "DOCUMENT_PRIVACY_FINALIZATION_FAILED"
      );
    } finally {
      setLoading(false);
    }
  }

  function setChunkSelected(
    index: number,
    selected: boolean
  ): void {
    setSelectedChunkIndices((current) => {
      const next = selected
        ? [...new Set([...current, index])].sort(
            (a, b) => a - b
          )
        : current.filter(
            (item) => item !== index
          );

      if (next.length > 32) {
        setError(
          "Do jednej sesji można dołączyć maksymalnie 32 chunki. Wybierz mniejszy zakres."
        );
        return current;
      }

      setError("");
      if (finalized) {
        onAttachmentSelectionChange?.(
          next.length > 0
            ? {
                caseId,
                documentId:
                  finalized.documentId,
                chunkIndices: next
              }
            : null
        );
      }
      return next;
    });
  }

  return (
    <section className="document-workbench">
      <div className="document-workbench-head">
        <div>
          <p className="eyebrow">
            Dokumenty lokalne
          </p>
          <h3>
            Akta sprawy, OCR i ręczna anonimizacja
          </h3>
          <p>
            PDF, obrazy, TXT/Markdown, DOCX/ODT oraz XLSX/XLSM/CSV/TSV są przetwarzane lokalnie i zapisywane
            w szyfrowanym kontekście sprawy. Cyfrowy PDF korzysta z warstwy tekstowej bez OCR, jeśli tekst jest wystarczający. ZIP jest bezpiecznie rozpakowywany do katalogu
            sprawy; żaden plik z archiwum nie trafia automatycznie do providera.
          </p>
        </div>

        <label className="file-button">
          {loading
            ? "Przetwarzanie…"
            : "Wybierz PDF, dokument, arkusz, zdjęcie lub ZIP"}
          <input
            type="file"
            accept=".pdf,.docx,.odt,.xlsx,.xlsm,.csv,.tsv,.txt,.md,.zip,application/pdf,application/zip,text/plain,text/markdown,text/csv,text/tab-separated-values,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroenabled.12,image/jpeg,image/png,image/webp,image/tiff"
            disabled={loading || !caseId}
            onChange={(event) => {
              void openFile(
                event.target.files?.[0]
              );
              event.currentTarget.value = "";
            }}
          />
        </label>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {archiveUpload && (
        <div className="document-finalized">
          <strong>
            Archiwum zapisane i rozpakowane lokalnie
          </strong>
          <span>
            {archiveUpload.filename} · {archiveUpload.extracted.length} plików ·
            {" "}{archiveUpload.extracted.filter((item) => item.processable).length} możliwych do dalszego przetwarzania
          </span>
          {archiveUpload.extracted.length > 0 && (
            <ul>
              {archiveUpload.extracted.slice(0, 20).map((entry) => (
                <li key={entry.relativePath}>
                  {entry.relativePath}
                  {entry.processable ? " · obsługiwalny" : " · zapisany tylko lokalnie"}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {review && currentPage && (
        <div className="privacy-review-grid">
          <div className="privacy-document">
            <div className="privacy-toolbar">
              <label>
                Strona
                <select
                  value={page}
                  onChange={(event) => {
                    setPage(
                      Number(event.target.value)
                    );
                    setSelection(null);
                  }}
                >
                  {review.pages.map(
                    (item) => (
                      <option
                        key={item.page}
                        value={item.page}
                      >
                        {item.page} · {item.source}
                      </option>
                    )
                  )}
                </select>
              </label>
              <span>
                {review.mediaType}
                {currentPage.confidence !== undefined
                  ? ` · OCR ${Math.round(
                      currentPage.confidence * 100
                    )}%`
                  : ""}
              </span>
            </div>

            <textarea
              ref={textRef}
              className="privacy-text"
              readOnly
              value={currentPage.text}
              onSelect={captureSelection}
              aria-label="Tekst dokumentu do ręcznego oznaczania"
            />

            <p className="field-help">
              Zaznacz fragment tekstu powyżej,
              następnie wybierz akcję.
            </p>
          </div>

          <aside className="privacy-controls">
            <h4>Decyzja użytkownika</h4>

            <div className="selection-preview">
              {selectedText
                ? `„${selectedText}”`
                : "Brak zaznaczenia"}
            </div>

            <label>
              Akcja
              <select
                value={action}
                onChange={(event) =>
                  setAction(
                    event.target
                      .value as PrivacyAction
                  )
                }
              >
                <option value="PSEUDONYMIZE">
                  Anonimizuj / pseudonimizuj
                </option>
                <option value="KEEP">
                  Pozostaw bez anonimizacji
                </option>
                <option value="LABEL">
                  Oznacz, co ten fragment znaczy
                </option>
              </select>
            </label>

            {action === "PSEUDONYMIZE" && (
              <label>
                Typ
                <select
                  value={kind}
                  onChange={(event) =>
                    setKind(
                      event.target
                        .value as PiiKind
                    )
                  }
                >
                  {PII_KINDS.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {(action === "LABEL" ||
              action === "PSEUDONYMIZE") && (
              <label>
                Etykieta
                <input
                  value={label}
                  maxLength={120}
                  placeholder={
                    action === "LABEL"
                      ? "np. świadek, pełnomocnik, adres korespondencyjny"
                      : "opcjonalnie: np. klient"
                  }
                  onChange={(event) =>
                    setLabel(
                      event.target.value
                    )
                  }
                />
              </label>
            )}

            <button
              type="button"
              className="primary-button"
              disabled={!selection}
              onClick={() => addDirective()}
            >
              Dodaj decyzję
            </button>

            {pageSuggestions.length > 0 && (
              <div className="privacy-suggestions">
                <strong>
                  Sugestie automatyczne
                </strong>
                {pageSuggestions.map(
                  (suggestion, index) => {
                    const preview =
                      currentPage.text.slice(
                        suggestion.start,
                        suggestion.end
                      );
                    const exists =
                      directives.some(
                        (item) =>
                          item.page === page &&
                          rangesOverlap(
                            item,
                            suggestion
                          )
                      );
                    return (
                      <button
                        type="button"
                        key={
                          suggestion.kind +
                          "-" +
                          suggestion.start +
                          "-" +
                          index
                        }
                        disabled={exists}
                        onClick={() =>
                          addDirective({
                            page,
                            start:
                              suggestion.start,
                            end:
                              suggestion.end,
                            action:
                              "PSEUDONYMIZE",
                            kind:
                              suggestion.kind
                          })
                        }
                      >
                        {suggestion.kind}:{" "}
                        {preview}
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </aside>
        </div>
      )}

      {review && (
        <div className="privacy-decisions">
          <div className="privacy-decision-head">
            <strong>
              Decyzje: {directives.length}
            </strong>
            <button
              type="button"
              className="primary-button"
              disabled={loading}
              onClick={() => {
                void finalize();
              }}
            >
              Zastosuj i przygotuj chunki
            </button>
          </div>

          {directives.length > 0 && (
            <ul>
              {directives.map(
                (directive, index) => {
                  const source =
                    review.pages.find(
                      (item) =>
                        item.page ===
                        directive.page
                    )?.text ?? "";
                  return (
                    <li key={index}>
                      <span>
                        s. {directive.page} ·{" "}
                        {directive.action} ·{" "}
                        {source.slice(
                          directive.start,
                          directive.end
                        )}
                        {directive.label
                          ? ` · ${directive.label}`
                          : ""}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setDirectives(
                            (items) =>
                              items.filter(
                                (_, itemIndex) =>
                                  itemIndex !==
                                  index
                              )
                          )
                        }
                      >
                        Usuń
                      </button>
                    </li>
                  );
                }
              )}
            </ul>
          )}
        </div>
      )}

      {finalized && (
        <>
          <div className="document-finalized">
            <strong>
              Dokument przygotowany lokalnie
            </strong>
            <span>
              {finalized.totalPages} stron ·{" "}
              {finalized.ocrPages} OCR ·{" "}
              {finalized.chunks.length} chunków ·{" "}
              {finalized.privacy.findings} anonimizacji
              ·{" "}
              {finalized.privacy.annotations.length} oznaczeń
            </span>
          </div>

          <div className="attachment-selector">
            <div className="attachment-selector-head">
              <div>
                <strong>
                  Chunki do analizy AI
                </strong>
                <p>
                  Domyślnie nic nie jest wysyłane do providera. Zaznacz tylko te
                  chronione chunki, które mają wejść do kontekstu sesji.
                  Backend nie przekazuje mapy reidentyfikacji.
                </p>
              </div>
              <span>
                {selectedChunkIndices.length}/32 wybranych
              </span>
            </div>

            {finalized.chunks.length <= 32 && (
              <div className="attachment-actions">
                <button
                  type="button"
                  onClick={() => {
                    const all =
                      finalized.chunks.map(
                        (chunk) => chunk.index
                      );
                    setSelectedChunkIndices(all);
                    onAttachmentSelectionChange?.({
                      caseId,
                      documentId:
                        finalized.documentId,
                      chunkIndices: all
                    });
                  }}
                >
                  Zaznacz wszystkie
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedChunkIndices([]);
                    onAttachmentSelectionChange?.(null);
                  }}
                >
                  Wyczyść wybór
                </button>
              </div>
            )}

            <div className="attachment-chunk-list">
              {finalized.chunks.map((chunk) => (
                <label
                  key={chunk.index}
                  className="attachment-chunk"
                >
                  <input
                    type="checkbox"
                    checked={selectedChunkIndices.includes(
                      chunk.index
                    )}
                    onChange={(event) =>
                      setChunkSelected(
                        chunk.index,
                        event.target.checked
                      )
                    }
                  />
                  <span>
                    Chunk {chunk.index} · strony{" "}
                    {chunk.pageStart}-{chunk.pageEnd}
                  </span>
                  <small>
                    {chunk.text.length.toLocaleString(
                      "pl-PL"
                    )} znaków
                  </small>
                </label>
              ))}
            </div>

            {finalized.chunks.length > 32 && (
              <p className="field-help">
                Dokument ma więcej niż 32 chunki. Do jednej sesji wybierz
                maksymalnie 32; kolejne partie możesz analizować osobno.
              </p>
            )}

            <p className="field-help">
              Uwaga: fragmenty oznaczone wcześniej jako KEEP pozostają jawne
              zgodnie z decyzją użytkownika i mogą trafić do providera, jeśli
              wybierzesz zawierający je chunk.
            </p>
          </div>
        </>
      )}
    </section>
  );
}
