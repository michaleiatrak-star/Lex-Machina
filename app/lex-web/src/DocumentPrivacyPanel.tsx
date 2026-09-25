import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  ApiError,
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
  { value: "ID_CARD", label: "Dowód osobisty" },
  { value: "PASSPORT", label: "Paszport" },
  { value: "BIRTH_DATE", label: "Data urodzenia" },
  { value: "LAND_REGISTRY", label: "Księga wieczysta" },
  { value: "KRS", label: "KRS" },
  { value: "VEHICLE_PLATE", label: "Nr rejestracyjny" },
  { value: "PAYMENT_CARD", label: "Karta płatnicza" },
  { value: "CUSTOM", label: "Inne" }
];

export type PrivacyDecisionMode =
  | "AUTO_PSEUDONYMIZE"
  | "MANUAL"
  | "KEEP_CLEAR";

export type DocumentPrivacyDraft = {
  file: File;
  fileName: string;
  review: DocumentReviewResponse;
  directives: PagePrivacyDirective[];
  privacyMode: PrivacyDecisionMode;
};

export type DocumentProcessingEvent = {
  fileName: string;
  stage:
    | "ANALYZING"
    | "OCR_COMPLETE"
    | "PRIVACY_REQUIRED"
    | "PRIVACY_STAGED"
    | "FINALIZED"
    | "ARCHIVE_STORED";
  documentId?: string;
  totalPages?: number;
  ocrPages?: number;
  suggestions?: number;
  privacyMode?: PrivacyDecisionMode;
};

type PrivacyMode =
  | "ASK"
  | "MANUAL";

type FinalizedBatchItem = {
  fileName: string;
  result: DocumentIngestionResponse;
  selectedChunkIndices: number[];
};

function rangesOverlap(
  a: { start: number; end: number },
  b: { start: number; end: number }
): boolean {
  return a.start < b.end && a.end > b.start;
}

function keepAllAutomaticFindings(
  review: DocumentReviewResponse
): PagePrivacyDirective[] {
  const accepted: PagePrivacyDirective[] = [];
  const suggestions = [...review.suggestions].sort(
    (a, b) =>
      a.page - b.page ||
      a.start - b.start ||
      (b.end - b.start) - (a.end - a.start)
  );

  for (const suggestion of suggestions) {
    if (
      accepted.some(
        (item) =>
          item.page === suggestion.page &&
          rangesOverlap(item, suggestion)
      )
    ) {
      continue;
    }
    accepted.push({
      page: suggestion.page,
      start: suggestion.start,
      end: suggestion.end,
      action: "KEEP"
    });
  }
  return accepted;
}

function sourceText(
  review: DocumentReviewResponse,
  range: { page: number; start: number; end: number }
): string {
  const text = review.pages.find(
    (item) => item.page === range.page
  )?.text ?? "";
  return text.slice(range.start, range.end);
}

function decisionModeLabel(mode: PrivacyDecisionMode): string {
  if (mode === "AUTO_PSEUDONYMIZE") {
    return "Automatyczna anonimizacja / pseudonimizacja";
  }
  if (mode === "KEEP_CLEAR") {
    return "Pozostaw wykryte elementy jawne";
  }
  return "Ręczna korekta + automatyczne wykrywanie";
}

function decisionLabel(directive: PagePrivacyDirective): string {
  if (directive.action === "KEEP") {
    return "POZOSTAW JAWNE";
  }
  if (directive.action === "LABEL") {
    return `ETYKIETA${directive.label ? `: ${directive.label}` : ""}`;
  }
  return `PSEUDONIMIZUJ${directive.kind ? ` · ${directive.kind}` : ""}${
    directive.label ? ` · ${directive.label}` : ""
  }`;
}

function finalDecisionForSuggestion(
  draft: DocumentPrivacyDraft,
  suggestion: DocumentReviewResponse["suggestions"][number]
): string {
  const override = draft.directives.find(
    (directive) =>
      directive.page === suggestion.page &&
      rangesOverlap(directive, suggestion)
  );
  if (override) {
    return decisionLabel(override);
  }
  return `PSEUDONIMIZUJ AUTOMATYCZNIE · ${suggestion.kind}`;
}

export function DocumentPrivacyPanel({
  caseId,
  incomingFile,
  onIncomingFileConsumed,
  onAttachmentSelectionChange,
  onCaseFilesChange,
  onProcessingEvent
}: {
  caseId: string;
  incomingFile?: File | null;
  onIncomingFileConsumed?: () => void;
  onAttachmentSelectionChange?: (
    selection: DocumentAttachmentSelection | null
  ) => void;
  onCaseFilesChange?: () => void;
  onProcessingEvent?: (
    event: DocumentProcessingEvent
  ) => void;
}) {
  const textRef =
    useRef<HTMLTextAreaElement>(null);
  const autoStartedFiles =
    useRef<WeakSet<File>>(new WeakSet());
  const activeFileRef =
    useRef<File | null>(null);
  const [activeFileName, setActiveFileName] =
    useState("");
  const [review, setReview] =
    useState<DocumentReviewResponse | null>(
      null
    );
  const [privacyMode, setPrivacyMode] =
    useState<PrivacyMode>("ASK");
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
  const [batchFinalizing, setBatchFinalizing] =
    useState(false);
  const [error, setError] = useState("");
  const [batchDrafts, setBatchDrafts] =
    useState<DocumentPrivacyDraft[]>([]);
  const [finalizedBatch, setFinalizedBatch] =
    useState<FinalizedBatchItem[]>([]);
  const [archiveUpload, setArchiveUpload] =
    useState<StoredUploadResponse | null>(null);

  useEffect(() => {
    if (!incomingFile) return;
    if (autoStartedFiles.current.has(incomingFile)) return;
    autoStartedFiles.current.add(incomingFile);
    void openFile(incomingFile);
  }, [incomingFile, caseId]);

  useEffect(() => {
    setBatchDrafts([]);
    setFinalizedBatch([]);
    setReview(null);
    setDirectives([]);
    activeFileRef.current = null;
  }, [caseId]);

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

  const reviewStats = useMemo(() => {
    if (!review) return null;
    const ocrPages = review.pages.filter(
      (item) => item.source === "OCR"
    ).length;
    const digitalPages = review.pages.filter(
      (item) => item.source === "DIGITAL"
    ).length;
    return {
      ocrPages,
      digitalPages,
      scannedPdf:
        review.mediaType === "application/pdf" &&
        ocrPages > 0
    };
  }, [review]);

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
    setActiveFileName(file.name);
    activeFileRef.current = file;
    setReview(null);
    setArchiveUpload(null);
    setPrivacyMode("ASK");
    setDirectives([]);
    setSelection(null);
    if (batchDrafts.length === 0) {
      setFinalizedBatch([]);
    }
    onProcessingEvent?.({
      fileName: file.name,
      stage: "ANALYZING"
    });

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
        activeFileRef.current = null;
        setActiveFileName("");
        onCaseFilesChange?.();
        onProcessingEvent?.({
          fileName: file.name,
          stage: "ARCHIVE_STORED"
        });
        onIncomingFileConsumed?.();
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
      const ocrPages = result.pages.filter(
        (item) => item.source === "OCR"
      ).length;
      if (ocrPages > 0) {
        onProcessingEvent?.({
          fileName: file.name,
          stage: "OCR_COMPLETE",
          documentId: result.documentId,
          totalPages: result.totalPages,
          ocrPages
        });
      }
      onProcessingEvent?.({
        fileName: file.name,
        stage: "PRIVACY_REQUIRED",
        documentId: result.documentId,
        totalPages: result.totalPages,
        ocrPages,
        suggestions: result.suggestions.length
      });
    } catch (cause) {
      setError(
        cause instanceof ApiError &&
        cause.description
          ? `${cause.code}: ${cause.description}`
          : cause instanceof Error
            ? cause.message
            : "DOCUMENT_REVIEW_FAILED"
      );
    } finally {
      setLoading(false);
    }
  }

  function editDraft(
    draft: DocumentPrivacyDraft
  ): void {
    activeFileRef.current = draft.file;
    setActiveFileName(draft.fileName);
    setReview(draft.review);
    setPage(draft.review.pages[0]?.page ?? 1);
    setDirectives(draft.directives);
    setPrivacyMode(
      draft.privacyMode === "MANUAL"
        ? "MANUAL"
        : "ASK"
    );
    setSelection(null);
    setLabel("");
    setError("");
    setArchiveUpload(null);
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

  function stageWith(
    decisions: PagePrivacyDirective[],
    mode: PrivacyDecisionMode
  ): void {
    if (!review || !activeFileRef.current) return;
    const draft: DocumentPrivacyDraft = {
      file: activeFileRef.current,
      fileName:
        activeFileName ||
        activeFileRef.current.name ||
        review.documentId,
      review,
      directives: decisions,
      privacyMode: mode
    };
    setBatchDrafts((current) => {
      const existing = current.findIndex(
        (item) => item.review.documentId === review.documentId
      );
      if (existing < 0) {
        return [...current, draft];
      }
      return current.map((item, index) =>
        index === existing ? draft : item
      );
    });
    onProcessingEvent?.({
      fileName: draft.fileName,
      stage: "PRIVACY_STAGED",
      documentId: review.documentId,
      totalPages: review.totalPages,
      ocrPages: review.pages.filter(
        (item) => item.source === "OCR"
      ).length,
      suggestions: review.suggestions.length,
      privacyMode: mode
    });
    setReview(null);
    setDirectives([]);
    setSelection(null);
    setPrivacyMode("ASK");
    activeFileRef.current = null;
    setActiveFileName("");
    onIncomingFileConsumed?.();
  }

  async function finalizeBatch(): Promise<void> {
    if (
      batchFinalizing ||
      batchDrafts.length === 0 ||
      incomingFile ||
      loading
    ) return;
    setBatchFinalizing(true);
    setError("");
    const successful: FinalizedBatchItem[] = [];
    const failed: DocumentPrivacyDraft[] = [];
    const failures: string[] = [];

    for (const draft of batchDrafts) {
      try {
        const result = await finalizeDocument(
          caseId,
          draft.review.documentId,
          draft.directives
        );
        const selectedChunkIndices = result.chunks
          .slice(0, 32)
          .map((chunk) => chunk.index);
        successful.push({
          fileName: draft.fileName,
          result,
          selectedChunkIndices
        });
        if (selectedChunkIndices.length > 0) {
          onAttachmentSelectionChange?.({
            caseId,
            documentId: result.documentId,
            chunkIndices: selectedChunkIndices
          });
        }
        onProcessingEvent?.({
          fileName: draft.fileName,
          stage: "FINALIZED",
          documentId: result.documentId,
          totalPages: result.totalPages,
          ocrPages: result.ocrPages,
          suggestions: result.privacy.findings,
          privacyMode: draft.privacyMode
        });
      } catch (cause) {
        failed.push(draft);
        failures.push(
          `${draft.fileName}: ${
            cause instanceof Error
              ? cause.message
              : "DOCUMENT_PRIVACY_FINALIZATION_FAILED"
          }`
        );
      }
    }

    setFinalizedBatch((current) => [
      ...current.filter(
        (item) =>
          !successful.some(
            (next) => next.result.documentId === item.result.documentId
          )
      ),
      ...successful
    ]);
    setBatchDrafts(failed);
    onCaseFilesChange?.();
    if (failures.length > 0) {
      setError(
        `Nie zatwierdzono ${failures.length} plików. ${failures.join(" · ")}`
      );
    }
    setBatchFinalizing(false);
  }

  function setChunkSelected(
    documentId: string,
    index: number,
    selected: boolean
  ): void {
    setFinalizedBatch((current) =>
      current.map((item) => {
        if (item.result.documentId !== documentId) {
          return item;
        }
        const next = selected
          ? [...new Set([
              ...item.selectedChunkIndices,
              index
            ])].sort((a, b) => a - b)
          : item.selectedChunkIndices.filter(
              (chunkIndex) => chunkIndex !== index
            );
        if (next.length > 32) {
          setError(
            "Do jednej sesji można dołączyć maksymalnie 32 chunki z jednego dokumentu. Wybierz mniejszy zakres."
          );
          return item;
        }
        setError("");
        onAttachmentSelectionChange?.(
          next.length > 0
            ? {
                caseId,
                documentId,
                chunkIndices: next
              }
            : null
        );
        return {
          ...item,
          selectedChunkIndices: next
        };
      })
    );
  }

  return (
    <section className="document-workbench">
      <div className="document-workbench-head">
        <div>
          <p className="eyebrow">
            Dokumenty lokalne
          </p>
          <h3>
            OCR automatyczny i anonimizacja per plik
          </h3>
          <p>
            Zdjęcia są od razu kierowane do lokalnego OCR. PDF jest analizowany strona po stronie:
            jeśli ma użyteczną warstwę tekstową, OCR nie jest potrzebny, a strony skanowane są OCR-owane
            automatycznie. Gdy lokalny model AI jest skonfigurowany, analizuje wydobyty tekst i uzupełnia
            wykrywanie danych do anonimizacji — m.in. odmienionych imion i nazwisk, adresów oraz innych
            identyfikatorów. Do anonimizacji trafiają wyłącznie dokładne fragmenty obecne w tekście źródłowym.
          </p>
          <p>
            Każdy plik otrzymuje osobny documentId i osobną zaszyfrowaną mapę reidentyfikacji. Model AI
            nie modyfikuje OCR, offsetów ani vaultu: proponuje wykrycia, a tokenizacja i odwracalne
            mapowanie pozostają deterministyczne i lokalne. Dla wielu plików przed zastosowaniem zmian
            zobaczysz zbiorczy podgląd wykryć automatycznych, ręcznych zaznaczeń i końcowego efektu.
          </p>
          {activeFileName ? (
            <small>
              Aktualny plik: {activeFileName}
            </small>
          ) : null}
        </div>

        <label className="file-button">
          {loading
            ? "Przetwarzanie…"
            : "Wybierz PDF, dokument, arkusz, zdjęcie lub ZIP"}
          <input
            type="file"
            accept=".pdf,.docx,.odt,.xlsx,.xlsm,.csv,.tsv,.txt,.md,.zip,application/pdf,application/zip,text/plain,text/markdown,text/csv,text/tab-separated-values,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroenabled.12,image/jpeg,image/png,image/webp,image/tiff"
            disabled={loading || batchFinalizing || !caseId}
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
          <span>{error}</span>
          {incomingFile ? (
            <button
              type="button"
              onClick={() => {
                setReview(null);
                setDirectives([]);
                setSelection(null);
                setArchiveUpload(null);
                activeFileRef.current = null;
                setActiveFileName("");
                setError("");
                onIncomingFileConsumed?.();
              }}
            >
              Pomiń ten plik
            </button>
          ) : null}
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

      {review && privacyMode === "ASK" ? (
        <div className="privacy-decisions">
          <div className="privacy-decision-head">
            <div>
              <strong>
                Decyzja prywatności dla „{activeFileName || review.documentId}”
              </strong>
              <p>
                {reviewStats?.ocrPages
                  ? `OCR wykonano automatycznie na ${reviewStats.ocrPages} z ${review.totalPages} stron${reviewStats.scannedPdf ? " skanowanego PDF" : ""}.`
                  : "Dokument ma użyteczną warstwę tekstową; OCR nie był potrzebny."}
                {" "}Wykryto {review.suggestions.length} lokalnych sugestii danych wrażliwych.
              </p>
              <p>
                Ta decyzja jest na razie wersją roboczą dla tego pliku. Zostanie zastosowana dopiero po
                przejściu wszystkich plików i zatwierdzeniu zbiorczego podglądu.
              </p>
            </div>
          </div>
          <div className="attachment-actions">
            <button
              type="button"
              className="primary-button"
              disabled={loading || batchFinalizing}
              onClick={() =>
                stageWith(
                  [],
                  "AUTO_PSEUDONYMIZE"
                )
              }
            >
              Anonimizuj / pseudonimizuj automatycznie
            </button>
            <button
              type="button"
              disabled={loading || batchFinalizing}
              onClick={() => setPrivacyMode("MANUAL")}
            >
              Przejrzyj ręcznie
            </button>
            <button
              type="button"
              disabled={loading || batchFinalizing}
              onClick={() =>
                stageWith(
                  keepAllAutomaticFindings(review),
                  "KEEP_CLEAR"
                )
              }
            >
              Pozostaw ten plik bez anonimizacji
            </button>
          </div>
        </div>
      ) : null}

      {review && currentPage && privacyMode === "MANUAL" && (
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

      {review && privacyMode === "MANUAL" && (
        <div className="privacy-decisions">
          <div className="privacy-decision-head">
            <strong>
              Ręczne decyzje dla tego pliku: {directives.length}
            </strong>
            <button
              type="button"
              className="primary-button"
              disabled={loading || batchFinalizing}
              onClick={() =>
                stageWith(
                  directives,
                  "MANUAL"
                )
              }
            >
              Dodaj plik do zbiorczego podglądu
            </button>
          </div>

          {directives.length > 0 && (
            <ul>
              {directives.map(
                (directive, index) => (
                  <li key={index}>
                    <span>
                      s. {directive.page} ·{" "}
                      {decisionLabel(directive)} ·{" "}
                      {sourceText(review, directive)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDirectives(
                          (items) =>
                            items.filter(
                              (_, itemIndex) =>
                                itemIndex !== index
                            )
                        )
                      }
                    >
                      Usuń
                    </button>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      )}

      {batchDrafts.length > 0 && !review && !incomingFile && !loading ? (
        <div className="privacy-decisions privacy-batch-preview">
          <div className="privacy-decision-head">
            <div>
              <p className="eyebrow">Przed zatwierdzeniem</p>
              <h3>
                Zbiorczy podgląd anonimizacji · {batchDrafts.length} plików
              </h3>
              <p>
                To jest wersja robocza. Poniżej dla każdego pliku widać elementy wykryte automatycznie,
                Twoje ręczne zaznaczenia i końcową decyzję, która zostanie zastosowana. Każdy plik nadal
                zachowuje własny documentId i własną zaszyfrowaną mapę reidentyfikacji.
              </p>
            </div>
            <button
              type="button"
              className="primary-button"
              disabled={batchFinalizing}
              onClick={() => void finalizeBatch()}
            >
              {batchFinalizing
                ? "Zatwierdzanie…"
                : `Zatwierdź decyzje dla ${batchDrafts.length} plików`}
            </button>
          </div>

          {batchDrafts.map((draft) => {
            const manualOnly = draft.directives.filter(
              (directive) =>
                !draft.review.suggestions.some(
                  (suggestion) =>
                    suggestion.page === directive.page &&
                    rangesOverlap(directive, suggestion)
                )
            );
            return (
              <details
                key={draft.review.documentId}
                className="privacy-batch-file"
                open
              >
                <summary>
                  <strong>{draft.fileName}</strong>
                  {" · "}{decisionModeLabel(draft.privacyMode)}
                  {" · "}{draft.review.suggestions.length} wykryć
                  {" · "}{draft.directives.length} ręcznych decyzji
                </summary>

                <div className="privacy-review-grid">
                  <section className="privacy-document">
                    <h4>Wykryte automatycznie</h4>
                    {draft.review.suggestions.length === 0 ? (
                      <p className="field-help">
                        Nie wykryto automatycznych elementów do anonimizacji.
                      </p>
                    ) : (
                      <ul>
                        {draft.review.suggestions.map((suggestion, index) => (
                          <li key={`${suggestion.page}-${suggestion.start}-${suggestion.end}-${index}`}>
                            <span>
                              s. {suggestion.page} · {suggestion.kind} ·{" "}
                              „{sourceText(draft.review, suggestion)}”
                            </span>
                            <strong>
                              {finalDecisionForSuggestion(draft, suggestion)}
                            </strong>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  <aside className="privacy-controls">
                    <h4>Moje ręczne zaznaczenia</h4>
                    {draft.privacyMode !== "MANUAL" || draft.directives.length === 0 ? (
                      <p className="field-help">
                        {draft.privacyMode === "MANUAL"
                          ? "Brak dodatkowych ręcznych zaznaczeń; niezmienione wykrycia automatyczne zostaną pseudonimizowane."
                          : "Ten plik korzysta z decyzji zbiorczej bez pojedynczych ręcznych zaznaczeń."}
                      </p>
                    ) : (
                      <ul>
                        {draft.directives.map((directive, index) => (
                          <li key={`${directive.page}-${directive.start}-${directive.end}-${index}`}>
                            s. {directive.page} · {decisionLabel(directive)} ·{" "}
                            „{sourceText(draft.review, directive)}”
                          </li>
                        ))}
                      </ul>
                    )}

                    <h4>Końcowa decyzja dla pliku</h4>
                    <p>
                      <strong>{decisionModeLabel(draft.privacyMode)}</strong>
                    </p>
                    <p className="field-help">
                      Wykrycia bez ręcznej decyzji są pseudonimizowane automatycznie. Ręczne KEEP i LABEL
                      wyłączają nakładające się wykrycie automatyczne, a ręczne PSEUDONYMIZE ma pierwszeństwo.
                    </p>
                    {manualOnly.length > 0 ? (
                      <div>
                        <strong>Dodatkowe ręczne elementy poza auto-wykryciami</strong>
                        <ul>
                          {manualOnly.map((directive, index) => (
                            <li key={`${directive.page}-${directive.start}-${index}`}>
                              s. {directive.page} · {decisionLabel(directive)} ·{" "}
                              „{sourceText(draft.review, directive)}”
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      disabled={batchFinalizing}
                      onClick={() => editDraft(draft)}
                    >
                      Wróć do edycji tego pliku
                    </button>
                  </aside>
                </div>
              </details>
            );
          })}

          <p className="field-help">
            Zatwierdzenie jest wykonywane osobno dla każdego documentId. Jeśli pojedynczy plik zgłosi błąd,
            pliki zatwierdzone poprawnie pozostaną gotowe, a niezatwierdzony plik wróci do tego podglądu.
          </p>
        </div>
      ) : null}

      {finalizedBatch.length > 0 && (
        <div className="privacy-decisions">
          <div className="privacy-decision-head">
            <div>
              <strong>
                Zatwierdzone dokumenty: {finalizedBatch.length}
              </strong>
              <p>
                Mapy reidentyfikacji pozostają odrębne dla każdego documentId, zaszyfrowane lokalnie
                i nie są przekazywane providerowi.
              </p>
            </div>
          </div>

          {finalizedBatch.map((item) => (
            <details
              key={item.result.documentId}
              className="attachment-selector"
            >
              <summary>
                <strong>{item.fileName}</strong>
                {" · "}{item.result.totalPages} stron
                {" · "}{item.result.ocrPages} OCR
                {" · "}{item.result.privacy.findings} anonimizacji
                {" · "}{item.result.chunks.length} chunków
              </summary>

              <div className="attachment-selector-head">
                <div>
                  <strong>Chunki do analizy AI</strong>
                  <p>
                    Maksymalnie 32 chunki z dokumentu są zaznaczane automatycznie po zatwierdzeniu.
                    Możesz zmienić wybór.
                  </p>
                </div>
                <span>
                  {item.selectedChunkIndices.length}/32 wybranych
                </span>
              </div>

              {item.result.chunks.length <= 32 && (
                <div className="attachment-actions">
                  <button
                    type="button"
                    onClick={() => {
                      const all = item.result.chunks.map(
                        (chunk) => chunk.index
                      );
                      setFinalizedBatch((current) =>
                        current.map((entry) =>
                          entry.result.documentId === item.result.documentId
                            ? {
                                ...entry,
                                selectedChunkIndices: all
                              }
                            : entry
                        )
                      );
                      onAttachmentSelectionChange?.({
                        caseId,
                        documentId: item.result.documentId,
                        chunkIndices: all
                      });
                    }}
                  >
                    Zaznacz wszystkie
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFinalizedBatch((current) =>
                        current.map((entry) =>
                          entry.result.documentId === item.result.documentId
                            ? {
                                ...entry,
                                selectedChunkIndices: []
                              }
                            : entry
                        )
                      );
                      onAttachmentSelectionChange?.(null);
                    }}
                  >
                    Wyczyść wybór
                  </button>
                </div>
              )}

              <div className="attachment-chunk-list">
                {item.result.chunks.map((chunk) => (
                  <label
                    key={chunk.index}
                    className="attachment-chunk"
                  >
                    <input
                      type="checkbox"
                      checked={item.selectedChunkIndices.includes(
                        chunk.index
                      )}
                      onChange={(event) =>
                        setChunkSelected(
                          item.result.documentId,
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

              {item.result.chunks.length > 32 && (
                <p className="field-help">
                  Dokument ma więcej niż 32 chunki. Pierwsze 32 zostały zaznaczone automatycznie;
                  kolejne partie możesz analizować osobno.
                </p>
              )}

              <p className="field-help">
                Uwaga: fragmenty oznaczone jako KEEP pozostają jawne zgodnie z decyzją użytkownika
                i mogą trafić do providera, jeśli wybierzesz zawierający je chunk.
              </p>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
