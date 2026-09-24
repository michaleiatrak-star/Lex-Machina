import { useEffect, useMemo, useState } from "react";
import {
  ApiError,
  deanonymizeUpload,
  finalizeDocument,
  getProcessingProgress,
  joinSharedKey,
  keepAllDirectives,
  listCaseArtifacts,
  isDesktopShell,
  newProgressId,
  listCaseFiles,
  processStoredCaseFile,
  searchCaseKnowledge,
  uploadCaseFile,
  type CaseArtifact,
  type CaseKnowledgeHit,
  type ProcessingProgress,
  type StoredUploadResponse
} from "./api.js";
import {
  filterWorkspaceItems,
  type DocumentScopeFilter,
  type DocumentTypeFilter
} from "./search-filters.js";
import {
  createWorkspaceFolder,
  deleteWorkspaceFolder,
  deleteWorkspaceItem,
  getWorkspace,
  moveWorkspaceItem,
  openWorkspaceItemInSystem,
  getEditableItem,
  previewWorkspaceItem,
  renderEditable,
  type EditableBlock,
  type EditableDocument,
  type EditableFormat,
  type EditableSheets,
  type WorkspaceFolder,
  type WorkspaceItem,
  type WorkspaceResponse
} from "./workspace-client.js";
import { PdfPreview } from "./PdfPreview.js";
import { TextFileEditor } from "./TextFileEditor.js";
import { DocumentEditor } from "./DocumentEditor.js";
import { SheetEditor } from "./SheetEditor.js";
import { documentFormatFor, sheetFormatFor } from "./office-editing.js";
import { progressLabel, progressPercent } from "./processing-progress.js";
import { AnonymizedDocumentView } from "./AnonymizedDocumentView.js";
import { ArtifactDeanonymize } from "./ArtifactDeanonymize.js";
import { decodeTextFile } from "./text-editing.js";

const TEXT_EXTENSIONS = /\.(txt|md|markdown|json|xml|log)$/i;
const DOCUMENT_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.oasis.opendocument.text"
]);
const SHEET_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel.sheet.macroenabled.12",
  "text/csv",
  "text/tab-separated-values"
]);

export function previewKind(
  mediaType: string,
  filename: string
): "text" | "pdf" | "image" | "document" | "sheet" | "none" {
  const type = mediaType.split(";")[0]!.trim().toLowerCase();
  if (type === "application/pdf" || /\.pdf$/i.test(filename)) return "pdf";
  if (type.startsWith("image/")) return "image";
  if (DOCUMENT_TYPES.has(type) || /\.(docx|odt)$/i.test(filename)) return "document";
  if (SHEET_TYPES.has(type) || /\.(xlsx|xlsm|csv|tsv)$/i.test(filename)) return "sheet";
  if (
    type.startsWith("text/") ||
    type === "application/json" ||
    type === "application/xml" ||
    TEXT_EXTENSIONS.test(filename)
  ) {
    return "text";
  }
  return "none";
}

export function documentProcessingFailureMessage(
  failure: unknown
): string {
  if (!(failure instanceof Error)) {
    return String(failure);
  }
  const code =
    failure instanceof ApiError
      ? failure.code
      : failure.message;
  const reason =
    failure instanceof ApiError
      ? failure.reason ?? ""
      : "";
  if (code.startsWith("DESKTOP_RUNTIME_PROXY_FAILED")) {
    return `Przetwarzanie dokumentu nie zakończyło się w limicie czasu połączenia z lokalnym runtime. Kod: ${code}`;
  }
  if (code !== "STORED_FILE_PROCESSING_FAILED") {
    return code;
  }
  const cause =
    reason === "OCR_REQUIRED" || reason === "OCR_ENGINE_MISSING"
      ? "dokument wymaga OCR, ale lokalny silnik OCR nie jest zainstalowany lub jest niekompletny"
      : reason === "OCR_ENGINE_START_FAILED"
        ? "nie udało się uruchomić lokalnego silnika OCR (Python)"
      : reason.startsWith("OCR_")
        ? "lokalny OCR nie przetworzył stron wymagających rozpoznania tekstu"
        : reason.startsWith("DOCUMENT_")
          ? "dokument przekracza limity bezpieczeństwa przetwarzania"
          : reason
            ? "błąd lokalnego przetwarzania dokumentu"
            : "nieokreślony błąd lokalnego przetwarzania dokumentu";
  return `Nie udało się przetworzyć dokumentu: ${cause}.${reason ? ` Kod: ${reason}` : ""}`;
}

function canRunPrivacyPipeline(
  item: WorkspaceItem
): boolean {
  return (
    item.kind === "UPLOAD" &&
    !item.archive &&
    (
      item.mediaType.startsWith("image/") ||
      item.mediaType === "application/pdf" ||
      item.mediaType === "text/plain" ||
      item.mediaType === "text/markdown" ||
      item.mediaType === "text/csv" ||
      item.mediaType === "text/tab-separated-values" ||
      item.mediaType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      item.mediaType ===
        "application/vnd.oasis.opendocument.text" ||
      item.mediaType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      item.mediaType ===
        "application/vnd.ms-excel.sheet.macroenabled.12"
    )
  );
}

function bytesLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function folderPath(folder: WorkspaceFolder, all: WorkspaceFolder[]): string {
  const names = [folder.name];
  let current = folder;
  const seen = new Set([folder.folderId]);
  while (current.parentId) {
    const parent = all.find((item) => item.folderId === current.parentId);
    if (!parent || seen.has(parent.folderId)) break;
    seen.add(parent.folderId);
    names.unshift(parent.name);
    current = parent;
  }
  return names.join(" / ");
}

function folderDepth(folder: WorkspaceFolder, all: WorkspaceFolder[]): number {
  let depth = 0;
  let parentId = folder.parentId;
  const seen = new Set<string>();
  while (parentId && depth < 8) {
    if (seen.has(parentId)) break;
    seen.add(parentId);
    const parent = all.find((item) => item.folderId === parentId);
    if (!parent) break;
    depth += 1;
    parentId = parent.parentId;
  }
  return depth;
}

export function WorkspaceManager({
  caseId,
  title,
  canWrite,
  refreshToken = 0
}: {
  caseId: string;
  title: string;
  canWrite: boolean;
  refreshToken?: number;
}) {
  const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [documentSearch, setDocumentSearch] =
    useState("");
  const [
    documentScope,
    setDocumentScope
  ] =
    useState<DocumentScopeFilter>(
      "ALL_CASE"
    );
  const [
    documentType,
    setDocumentType
  ] =
    useState<DocumentTypeFilter>(
      "ALL"
    );
  const [knowledgeHits, setKnowledgeHits] =
    useState<CaseKnowledgeHit[]>([]);
  const [
    knowledgeSearchBusy,
    setKnowledgeSearchBusy
  ] = useState(false);
  const [
    knowledgeSearchError,
    setKnowledgeSearchError
  ] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [artifacts, setArtifacts] = useState<CaseArtifact[]>([]);
  const [deanonymizing, setDeanonymizing] = useState<string | null>(null);
  const [fileDeanonymize, setFileDeanonymize] = useState<{ itemId: string; documentId: string } | null>(null);
  const [caseFiles, setCaseFiles] =
    useState<StoredUploadResponse[]>([]);
  const [progressByItem, setProgressByItem] =
    useState<Record<string, Pick<ProcessingProgress, "stage" | "done" | "total">>>({});
  const [anonymized, setAnonymized] = useState<{
    item: WorkspaceItem;
    documentId: string;
    tab: "marked" | "text" | "key";
  } | null>(null);
    const [preview, setPreview] = useState<{
    item: WorkspaceItem;
    url?: string;
    pdf?: Blob;
    text?: string;
    encoding?: string;
    page?: number;
    document?: EditableDocument;
    sheet?: EditableSheets;
    supported: boolean;
  } | null>(null);

  async function refresh(): Promise<void> {
    if (!caseId) {
      setWorkspace(null);
      setCaseFiles([]);
      setArtifacts([]);
      return;
    }
    const [next, files] =
      await Promise.all([
        getWorkspace(caseId),
        listCaseFiles(caseId)
      ]);
    setWorkspace(next);
    setCaseFiles(files.uploads);
    setArtifacts(await listCaseArtifacts(caseId).catch(() => []));
    if (
      selectedFolder &&
      !next.folders.some(
        (item) =>
          item.folderId ===
          selectedFolder
      )
    ) {
      setSelectedFolder(null);
    }
  }

  const processedEntries = (workspace?.items ?? [])
    .filter((entry) => entry.kind === "UPLOAD")
    .map((entry) => ({
      filename: entry.filename,
      processing: caseFiles.find((file) => file.uploadId === entry.itemId)?.processing
    }))
    .filter((entry) => entry.processing && entry.processing.anonymized !== false);
  // Keys to deanonymize with: the case's shared key once, then documents that
  // still have their own key.
  const sharedKeyDocument = processedEntries.find((entry) => entry.processing!.sharedKey);
  const processedDocuments = [
    ...(sharedKeyDocument
      ? [{ filename: "Klucz sprawy (wspólny dla dokumentów)", documentId: sharedKeyDocument.processing!.documentId }]
      : []),
    ...processedEntries
      .filter((entry) => !entry.processing!.sharedKey)
      .map((entry) => ({ filename: `${entry.filename} (klucz osobny)`, documentId: entry.processing!.documentId }))
  ];
  const ownKeyDocuments = processedEntries.filter((entry) => !entry.processing!.sharedKey);

  async function joinAllKeys(): Promise<void> {
    await run(async () => {
      let remapped = 0;
      for (const entry of ownKeyDocuments) {
        remapped += (await joinSharedKey(caseId, entry.processing!.documentId)).remapped;
      }
      setNotice(
        `Połączono klucze ${ownKeyDocuments.length} dokumentów w klucz sprawy (przenumerowane symbole: ${remapped}). ` +
          "Ta sama osoba ma teraz jeden symbol we wszystkich dokumentach sprawy."
      );
    });
  }

  function processingFor(
    item: WorkspaceItem
  ): StoredUploadResponse["processing"] | undefined {
    return caseFiles.find(
      (file) =>
        file.uploadId ===
        item.itemId
    )?.processing;
  }

  async function addFiles(
    files: FileList | null
  ): Promise<void> {
    if (
      !files ||
      files.length === 0
    ) {
      return;
    }
    await run(async () => {
      for (
        const file of
        Array.from(files)
      ) {
        const stored =
          await uploadCaseFile(
            caseId,
            file
          );
        if (selectedFolder) {
          await moveWorkspaceItem(
            caseId,
            stored.uploadId,
            selectedFolder
          );
        }
      }
      setNotice(
        `Dodano ${files.length} plik(ów) do akt sprawy.`
      );
    });
  }

  async function runAutomaticPrivacy(
    item: WorkspaceItem,
    keepClear = false
  ): Promise<void> {
    const progressId = newProgressId();
    setProgressByItem((current) => ({ ...current, [item.itemId]: { stage: "READING" } }));
    // Stage and page counts while the request runs; text never leaves the runtime.
    const timer = window.setInterval(() => {
      void getProcessingProgress(caseId, progressId)
        .then((progress) => {
          if (progress) {
            setProgressByItem((current) =>
              current[item.itemId] ? { ...current, [item.itemId]: progress } : current
            );
          }
        })
        .catch(() => undefined);
    }, 500);
    try {
      await runAutomaticPrivacySteps(item, progressId, keepClear);
    } finally {
      window.clearInterval(timer);
      setProgressByItem((current) => {
        const { [item.itemId]: _done, ...rest } = current;
        return rest;
      });
    }
  }

  function showAnonymized(item: WorkspaceItem, tab: "marked" | "text" | "key"): void {
    const documentId = processingFor(item)?.documentId;
    if (!documentId) return;
    setPreview(null);
    setAnonymized({ item, documentId, tab });
  }

  async function runAutomaticPrivacySteps(
    item: WorkspaceItem,
    progressId: string,
    keepClear: boolean
  ): Promise<void> {
    await run(async () => {
      const review =
        await processStoredCaseFile(
          caseId,
          item.itemId,
          undefined,
          progressId
        );
      // OCR only: every page kept as written, no anonymization key.
      const result =
        await finalizeDocument(
          caseId,
          review.documentId,
          keepClear ? keepAllDirectives(review) : [],
          progressId
        );
      setNotice(
        `„${item.filename}”: OCR/pseudonimizacja zakończona · ${result.ocrPages} stron OCR · ${result.privacy.findings} anonimizacji · osobny vault/deanonimizator zapisany dla ${result.documentId}.`
      );
    });
  }

  useEffect(() => {
    let cancelled = false;
    if (!caseId) {
      setWorkspace(null);
      return;
    }
    setError("");
    void Promise.all([
      getWorkspace(caseId),
      listCaseFiles(caseId)
    ])
      .then(([next, files]) => {
        if (!cancelled) {
          setWorkspace(next);
          setCaseFiles(files.uploads);
        }
      })
      .then(() => listCaseArtifacts(caseId))
      .then((list) => {
        if (!cancelled && list) setArtifacts(list);
      })
      .catch((failure) => {
        if (!cancelled) {
          setError(documentProcessingFailureMessage(failure));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [caseId, refreshToken]);

  useEffect(() => () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
  }, [preview?.url]);

  useEffect(() => {
    const query =
      documentSearch.trim();
    if (
      !caseId ||
      query.length < 2
    ) {
      setKnowledgeHits([]);
      setKnowledgeSearchError("");
      setKnowledgeSearchBusy(false);
      return;
    }

    let cancelled = false;
    setKnowledgeSearchBusy(true);
    setKnowledgeSearchError("");
    const timer =
      window.setTimeout(
        () => {
          void searchCaseKnowledge(
            caseId,
            query,
            24
          )
            .then((result) => {
              if (!cancelled) {
                setKnowledgeHits(
                  result.hits
                );
              }
            })
            .catch((failure) => {
              if (!cancelled) {
                setKnowledgeHits([]);
                setKnowledgeSearchError(
                  failure instanceof Error
                    ? failure.message
                    : String(
                        failure
                      )
                );
              }
            })
            .finally(() => {
              if (!cancelled) {
                setKnowledgeSearchBusy(
                  false
                );
              }
            });
        },
        250
      );

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    caseId,
    documentSearch
  ]);

  const folders = useMemo(
    () => [...(workspace?.folders ?? [])].sort((a, b) =>
      folderPath(a, workspace?.folders ?? []).localeCompare(
        folderPath(b, workspace?.folders ?? []),
        "pl"
      )
    ),
    [workspace]
  );

  const rootFolderName =
    workspace?.caseDisplayName
      ?.trim() ||
    "Sprawa bez nazwy";

  const visibleItems =
    useMemo(() => {
      if (!workspace) {
        return [];
      }
      return filterWorkspaceItems(
        workspace,
        {
          query:
            documentSearch,
          selectedFolder,
          scope:
            documentScope,
          type:
            documentType,
          caseFiles,
          knowledgeHits
        }
      ).map(
        (entry) =>
          entry.item
      );
    }, [
      workspace,
      selectedFolder,
      documentSearch,
      documentScope,
      documentType,
      caseFiles,
      knowledgeHits
    ]);

  function knowledgeHitFor(
    item: WorkspaceItem
  ): CaseKnowledgeHit | undefined {
    const documentId =
      caseFiles.find(
        (file) =>
          file.uploadId ===
          item.itemId
      )?.processing
        ?.documentId;
    if (!documentId) {
      return undefined;
    }
    return knowledgeHits.find(
      (hit) =>
        hit.documentId ===
        documentId
    );
  }

  function itemFolderLabel(
    item: WorkspaceItem
  ): string {
    if (!workspace) {
      return rootFolderName;
    }
    const folderId =
      workspace.itemLocations[
        item.itemId
      ] ?? null;
    if (!folderId) {
      return rootFolderName;
    }
    const folder =
      folders.find(
        (entry) =>
          entry.folderId ===
          folderId
      );
    return folder
      ? `${rootFolderName} / ${folderPath(
          folder,
          folders
        )}`
      : rootFolderName;
  }

  async function run(action: () => Promise<void>): Promise<void> {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      await refresh();
    } catch (failure) {
      setError(documentProcessingFailureMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  async function saveRendered(
    filename: string,
    format: EditableFormat,
    model: EditableDocument | EditableSheets,
    delimiter?: string
  ): Promise<void> {
    const blob = await renderEditable(caseId, { format, model, ...(delimiter ? { delimiter } : {}) });
    const stored = await uploadCaseFile(caseId, new File([blob], filename, { type: blob.type }));
    if (selectedFolder) {
      await moveWorkspaceItem(caseId, stored.uploadId, selectedFolder);
    }
    await refresh();
  }

  async function saveEditedDocument(
    filename: string,
    format: "docx" | "odt",
    blocks: EditableBlock[]
  ): Promise<void> {
    await saveRendered(filename, format, { kind: "document", blocks });
  }

  async function saveEditedSheet(
    filename: string,
    format: "xlsx" | "csv" | "tsv",
    model: EditableSheets
  ): Promise<void> {
    await saveRendered(filename, format, model, format === "csv" ? model.delimiter : undefined);
  }

  async function saveEditedText(
    filename: string,
    text: string
  ): Promise<void> {
    const markdown = /\.(md|markdown)$/i.test(filename);
    const stored = await uploadCaseFile(
      caseId,
      new File([text], filename, {
        type: markdown ? "text/markdown" : "text/plain"
      })
    );
    if (selectedFolder) {
      await moveWorkspaceItem(caseId, stored.uploadId, selectedFolder);
    }
    await refresh();
  }

  async function showPreview(
    item: WorkspaceItem,
    page?: number
  ): Promise<void> {
    setBusy(true);
    setError("");
    setAnonymized(null);
    try {
      if (preview?.url) URL.revokeObjectURL(preview.url);
      const pageProps = page ? { page } : {};
      const officeKind = previewKind(item.mediaType, item.filename);
      if (officeKind === "document" || officeKind === "sheet") {
        const editable = await getEditableItem(caseId, item.itemId);
        setPreview(
          editable.model.kind === "document"
            ? { item, document: editable.model, ...pageProps, supported: true }
            : { item, sheet: editable.model, ...pageProps, supported: true }
        );
        return;
      }
      const result = await previewWorkspaceItem(caseId, item.itemId);
      const kind = previewKind(result.mediaType, item.filename);
      if (kind === "text") {
        const decoded = decodeTextFile(new Uint8Array(await result.blob.arrayBuffer()));
        setPreview({
          item,
          text: decoded.text,
          encoding: decoded.encoding,
          ...pageProps,
          supported: true
        });
        return;
      }
      if (kind === "pdf") {
        setPreview({ item, pdf: result.blob, ...pageProps, supported: true });
        return;
      }
      if (kind === "image") {
        setPreview({
          item,
          url: URL.createObjectURL(result.blob),
          ...pageProps,
          supported: true
        });
        return;
      }
      setPreview({ item, supported: false });
    } catch (failure) {
      setError(documentProcessingFailureMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  async function openInSystem(item: WorkspaceItem): Promise<void> {
    setBusy(true);
    setError("");
    try {
      await openWorkspaceItemInSystem(caseId, item.itemId);
    } catch (failure) {
      setError(documentProcessingFailureMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  if (!caseId) {
    return (
      <article className="chat-card workspace-manager">
        <h3>{title}</h3>
        <p>Najpierw wybierz sprawę.</p>
      </article>
    );
  }

  return (
    <article className="chat-card workspace-manager">
      <div className="chat-card-heading">
        <div>
          <p className="eyebrow">Struktura katalogów</p>
          <h2>{title}</h2>
          <p>
            Foldery są logiczną, szyfrowaną strukturą workspace. Dotychczasowy
            „Główny katalog” jest wyświetlany pod nazwą sprawy:
            {" "}<strong>{rootFolderName}</strong>. Techniczny identyfikator caseId
            pozostaje używany wyłącznie wewnętrznie do kluczy i integralności magazynu.
          </p>
        </div>
        <div className="workspace-header-actions">
          <label className="workspace-search">
            <span>Szukaj dokumentów</span>
            <input
              type="search"
              value={documentSearch}
              placeholder="Nazwa, treść, typ lub ID dokumentu"
              aria-label="Szukaj dokumentów w sprawie"
              onChange={(event) =>
                setDocumentSearch(
                  event.target.value
                )
              }
            />
          </label>
          <label className="workspace-filter">
            <span>Zakres</span>
            <select
              value={documentScope}
              disabled={
                !documentSearch.trim()
              }
              aria-label="Zakres wyszukiwania dokumentów"
              onChange={(event) =>
                setDocumentScope(
                  event.target
                    .value as DocumentScopeFilter
                )
              }
            >
              <option value="ALL_CASE">
                Cała sprawa
              </option>
              <option value="CURRENT_FOLDER">
                Bieżący folder
              </option>
            </select>
          </label>
          <label className="workspace-filter">
            <span>Typ</span>
            <select
              value={documentType}
              aria-label="Typ dokumentu"
              onChange={(event) =>
                setDocumentType(
                  event.target
                    .value as DocumentTypeFilter
                )
              }
            >
              <option value="ALL">
                Wszystkie
              </option>
              <option value="PDF">
                PDF
              </option>
              <option value="OFFICE">
                Office / ODT
              </option>
              <option value="IMAGE">
                Obrazy
              </option>
              <option value="TEXT">
                Tekst
              </option>
              <option value="ARCHIVE">
                Archiwa
              </option>
              <option value="TEMPLATE">
                Wzory
              </option>
            </select>
          </label>
          {documentSearch.trim() ||
          documentType !== "ALL" ||
          documentScope !== "ALL_CASE" ? (
            <button
              type="button"
              className="chat-secondary-action"
              onClick={() => {
                setDocumentSearch("");
                setDocumentScope(
                  "ALL_CASE"
                );
                setDocumentType(
                  "ALL"
                );
              }}
            >
              Wyczyść filtry
            </button>
          ) : null}
          {canWrite ? (
            <label className="chat-secondary-action workspace-file-upload">
              + Dodaj pliki
              <input
                type="file"
                multiple
                hidden
                disabled={busy}
                onChange={(event) => {
                  void addFiles(
                    event.currentTarget.files
                  );
                  event.currentTarget.value = "";
                }}
              />
            </label>
          ) : null}
          <button
            type="button"
            className="chat-secondary-action"
            disabled={busy}
            onClick={() => void refresh()}
          >
            Odśwież
          </button>
        </div>
      </div>

      <div className="workspace-manager-grid">
        <aside className="workspace-tree" aria-label="Foldery workspace">
          <button
            type="button"
            className={selectedFolder === null ? "workspace-folder active" : "workspace-folder"}
            onClick={() => setSelectedFolder(null)}
          >
            📁 {rootFolderName}
          </button>
          {folders.map((folder) => (
            <div key={folder.folderId} className="workspace-folder-row">
              <button
                type="button"
                className={selectedFolder === folder.folderId ? "workspace-folder active" : "workspace-folder"}
                style={{ paddingLeft: `${12 + folderDepth(folder, folders) * 14}px` }}
                title={folderPath(folder, folders)}
                onClick={() => setSelectedFolder(folder.folderId)}
              >
                📁 {folder.name}
              </button>
              {canWrite ? (
                <button
                  type="button"
                  className="workspace-icon-button"
                  title="Usuń pusty folder"
                  disabled={busy}
                  onClick={() => void run(async () => {
                    await deleteWorkspaceFolder(caseId, folder.folderId);
                    if (selectedFolder === folder.folderId) setSelectedFolder(null);
                  })}
                >
                  ×
                </button>
              ) : null}
            </div>
          ))}

          {canWrite ? (
            <div className="workspace-new-folder">
              <input
                value={newFolderName}
                maxLength={120}
                placeholder="Nazwa folderu"
                onChange={(event) => setNewFolderName(event.target.value)}
              />
              <button
                type="button"
                disabled={busy || !newFolderName.trim()}
                onClick={() => void run(async () => {
                  await createWorkspaceFolder(caseId, newFolderName.trim(), selectedFolder);
                  setNewFolderName("");
                })}
              >
                + Folder
              </button>
            </div>
          ) : null}
        </aside>

        <section className="workspace-items" aria-label="Pliki workspace">
          <div className="workspace-location-line">
            <strong>
              {documentSearch.trim()
                ? documentScope ===
                    "ALL_CASE"
                  ? "Wyniki w całej sprawie"
                  : "Wyniki w bieżącym folderze"
                : selectedFolder
                  ? folderPath(folders.find((item) => item.folderId === selectedFolder)!, folders)
                  : rootFolderName}
            </strong>
            <span>
              {visibleItems.length}
              {documentSearch.trim()
                ? " wyników"
                : " plików"}
              {knowledgeSearchBusy
                ? " · szukam w treści…"
                : ""}
            </span>
          </div>

          {visibleItems.length === 0 ? (
            <p className="workspace-empty">
              {documentSearch.trim()
                ? "Nie znaleziono dokumentów pasujących do wyszukiwania."
                : "Ten folder jest pusty."}
            </p>
          ) : (
            <ul className="workspace-file-list workspace-file-actions-list">
              {visibleItems.map((item) => (
                <li key={item.itemId}>
                  <div>
                    <strong>{item.filename}</strong>
                    <span>
                      {item.kind === "TEMPLATE" ? "WZÓR" : "DOKUMENT"} · {bytesLabel(item.bytes)} · {item.mediaType}
                    </span>
                    {documentSearch.trim() ? (
                      <>
                        <small className="workspace-search-path">
                          {itemFolderLabel(
                            item
                          )}
                        </small>
                        {knowledgeHitFor(
                          item
                        ) ? (
                          <small className="workspace-search-snippet">
                            s. {knowledgeHitFor(item)!.pageStart}
                            {knowledgeHitFor(item)!.pageEnd !==
                            knowledgeHitFor(item)!.pageStart
                              ? `–${knowledgeHitFor(item)!.pageEnd}`
                              : ""}
                            {" · "}
                            {knowledgeHitFor(item)!.text}
                          </small>
                        ) : null}
                      </>
                    ) : null}
                    {item.kind === "UPLOAD" ? (
                      <small className="workspace-processing-status">
                        {processingFor(item) ? (
                          processingFor(item)!.anonymized === false ? (
                            <span className="anonymized-badge clear-text-badge" title="Przetworzony bez anonimizacji: tekst trafia do modeli w jawnej postaci">
                              Tekst jawny (bez anonimizacji)
                            </span>
                          ) : (
                            <span className="anonymized-badge" title="Dokument ma wersję zanonimizowaną i klucz anonimizacji">
                              {processingFor(item)!.sharedKey ? "Zanonimizowany · klucz sprawy" : "Zanonimizowany · klucz osobny"}
                            </span>
                          )
                        ) : null}
                        {processingFor(item)
                          ? processingFor(item)!.ocrPages > 0
                            ? `OCR ✓ · anonimizacja ✓ · ${processingFor(item)!.ocrPages}/${processingFor(item)!.totalPages} stron OCR · vault per dokument`
                            : `Tekst cyfrowy ✓ · anonimizacja ✓ · OCR niewymagany · vault per dokument`
                          : "Nieprzetworzony · OCR/anonimizacja oczekuje"}
                      </small>
                    ) : null}
                    {progressByItem[item.itemId] ? (
                      <div className="workspace-progress" role="status" aria-live="polite">
                        <progress max={100} value={progressPercent(progressByItem[item.itemId]!)} />
                        <small>{progressLabel(progressByItem[item.itemId]!)}</small>
                      </div>
                    ) : null}
                  </div>
                  <div className="workspace-item-actions">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void showPreview(
                          item,
                          knowledgeHitFor(
                            item
                          )?.pageStart
                        )
                      }
                    >
                      {knowledgeHitFor(item)
                        ? `Podgląd s. ${knowledgeHitFor(item)!.pageStart}`
                        : "Podgląd"}
                    </button>
                    {processingFor(item) ? (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          title="Tekst z symbolami zastępczymi - ta wersja trafia do modeli"
                          onClick={() => showAnonymized(item, "marked")}
                        >
                          Wersja zanonimizowana
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          title="Symbole zastępcze i dane, które zastępują (tylko na tym komputerze)"
                          onClick={() => showAnonymized(item, "key")}
                        >
                          Klucz anonimizacji
                        </button>
                      </>
                    ) : null}
                    {canWrite &&
                    item.kind === "UPLOAD" &&
                    !processingFor(item) &&
                    processedDocuments.length > 0 &&
                    /\.(txt|md|markdown|csv|tsv|docx|odt|xlsx|xlsm)$/i.test(item.filename) ? (
                      <button
                        type="button"
                        disabled={busy}
                        title="Plik z symbolami (np. odpowiedź zewnętrznego modelu): podstawia dane z klucza wybranego dokumentu"
                        onClick={() =>
                          setFileDeanonymize({ itemId: item.itemId, documentId: processedDocuments[0]!.documentId })
                        }
                      >
                        Deanonimizuj plik
                      </button>
                    ) : null}
                    {isDesktopShell() ? (
                      <button type="button" disabled={busy} onClick={() => void openInSystem(item)}>
                        Otwórz w systemie
                      </button>
                    ) : null}
                    {canWrite ? (
                      <select
                        value={workspace?.itemLocations[item.itemId] ?? ""}
                        disabled={busy}
                        title="Przenieś do folderu"
                        onChange={(event) => void run(async () => {
                          await moveWorkspaceItem(caseId, item.itemId, event.target.value || null);
                        })}
                      >
                        <option value="">{rootFolderName}</option>
                        {folders.map((folder) => (
                          <option key={folder.folderId} value={folder.folderId}>
                            {folderPath(folder, folders)}
                          </option>
                        ))}
                      </select>
                    ) : null}
                    {canWrite && canRunPrivacyPipeline(item) ? (
                      <button
                        type="button"
                        disabled={busy}
                        title="Uruchom lokalne wydobycie tekstu/OCR i pseudonimizację; powstanie osobny zaszyfrowany vault oraz odwracalny deanonimizator tego dokumentu"
                        onClick={() =>
                          void runAutomaticPrivacy(
                            item
                          )
                        }
                      >
                        OCR + anonimizuj automatycznie
                      </button>
                    ) : null}
                    {canWrite && canRunPrivacyPipeline(item) ? (
                      <button
                        type="button"
                        disabled={busy}
                        title="Tylko wydobycie tekstu/OCR, bez anonimizacji: plik będzie wysyłany do modeli jako tekst jawny"
                        onClick={() => {
                          if (
                            window.confirm(
                              `„${item.filename}” zostanie przetworzony bez anonimizacji. Wybrany do czatu trafi do modelu z danymi osobowymi w jawnej postaci. Kontynuować?`
                            )
                          ) {
                            void runAutomaticPrivacy(item, true);
                          }
                        }}
                      >
                        Tylko OCR (bez anonimizacji)
                      </button>
                    ) : null}
                    {canWrite ? (
                      <button
                        type="button"
                        className="workspace-delete"
                        disabled={busy}
                        onClick={() => void run(async () => {
                          if (!window.confirm(`Usunąć plik „${item.filename}”?`)) return;
                          await deleteWorkspaceItem(caseId, item.itemId);
                          if (preview?.item.itemId === item.itemId) setPreview(null);
                        })}
                      >
                        Usuń
                      </button>
                    ) : null}
                  </div>
                  {fileDeanonymize?.itemId === item.itemId ? (
                    <div className="artifact-deanonymize">
                      <label>
                        Klucz dokumentu źródłowego{" "}
                        <select
                          value={fileDeanonymize.documentId}
                          onChange={(event) =>
                            setFileDeanonymize({ itemId: item.itemId, documentId: event.target.value })
                          }
                        >
                          {processedDocuments.map((entry) => (
                            <option key={entry.documentId} value={entry.documentId}>{entry.filename}</option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        className="chat-primary-action"
                        disabled={busy}
                        onClick={() =>
                          void run(async () => {
                            const result = await deanonymizeUpload(caseId, item.itemId, fileDeanonymize.documentId);
                            setFileDeanonymize(null);
                            setNotice(
                              `Utworzono „${result.upload.filename}”: przywrócono ${result.restored} wartości.` +
                                (result.unresolved.length
                                  ? ` Symbole spoza klucza zostały bez zmian: ${result.unresolved.join(", ")}.`
                                  : "")
                            );
                          })
                        }
                      >
                        Deanonimizuj
                      </button>
                      <button type="button" onClick={() => setFileDeanonymize(null)}>Anuluj</button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {canWrite && ownKeyDocuments.length > 0 && processedEntries.length > 1 ? (
        <p className="workspace-shared-key-note">
          {ownKeyDocuments.length} dokument(y) mają osobny klucz sprzed wprowadzenia klucza sprawy, więc ta sama
          osoba może mieć w nich różne symbole.{" "}
          <button type="button" disabled={busy} onClick={() => void joinAllKeys()}>
            Połącz klucze sprawy
          </button>
          <small>
            {" "}Dokumenty z symbolami utworzone wcześniej z tych plików deanonimizuj przed połączeniem.
          </small>
        </p>
      ) : null}

      {artifacts.length > 0 ? (
        <section className="workspace-artifacts" aria-label="Dokumenty utworzone przez model">
          <h4>Dokumenty utworzone przez model</h4>
          <ul>
            {artifacts.map((artifact) => {
              const source = artifact.sourceArtifactId
                ? artifacts.find((entry) => entry.artifactId === artifact.sourceArtifactId)
                : undefined;
              const derived = artifacts.filter((entry) => entry.sourceArtifactId === artifact.artifactId);
              const item: WorkspaceItem = {
                kind: "ARTIFACT",
                itemId: artifact.artifactId,
                filename: artifact.filename,
                mediaType: artifact.mediaType,
                bytes: artifact.bytes,
                createdAt: artifact.createdAt,
                archive: false
              };
              return (
                <li key={artifact.artifactId}>
                  <div>
                    <strong>{artifact.filename}</strong>
                    <small>
                      {new Date(artifact.createdAt).toLocaleString("pl-PL")} · {bytesLabel(artifact.bytes)}
                    </small>
                    <small className="workspace-processing-status">
                      {artifact.sensitivity === "PROTECTED" ? (
                        <span className="anonymized-badge">Z symbolami</span>
                      ) : (
                        <span className="anonymized-badge deanonymized-badge">Deanonimizowany</span>
                      )}
                      {source ? ` powstał z: ${source.filename}` : ""}
                      {derived.length ? ` · wersja z danymi: ${derived.map((entry) => entry.filename).join(", ")}` : ""}
                    </small>
                  </div>
                  <div className="workspace-item-actions">
                    <button type="button" disabled={busy} onClick={() => void showPreview(item)}>Podgląd</button>
                    {isDesktopShell() ? (
                      <button type="button" disabled={busy} onClick={() => void openInSystem(item)}>
                        Otwórz w systemie
                      </button>
                    ) : null}
                    {canWrite && artifact.sensitivity === "PROTECTED" ? (
                      <button type="button" disabled={busy} onClick={() => setDeanonymizing(artifact.artifactId)}>
                        Deanonimizuj
                      </button>
                    ) : null}
                  </div>
                  {deanonymizing === artifact.artifactId ? (
                    <ArtifactDeanonymize
                      caseId={caseId}
                      artifact={artifact}
                      onDone={(message) => {
                        setNotice(message);
                        void refresh();
                      }}
                      onCancel={() => setDeanonymizing(null)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {anonymized ? (
        <AnonymizedDocumentView
          key={`${anonymized.documentId}-${anonymized.tab}`}
          caseId={caseId}
          documentId={anonymized.documentId}
          filename={anonymized.item.filename}
          readOnly={!canWrite}
          initialTab={anonymized.tab}
          onClose={() => setAnonymized(null)}
        />
      ) : null}

      {preview ? (
        <section className="workspace-preview" aria-label="Podgląd pliku">
          <div className="workspace-preview-head">
            <div>
              <strong>{preview.item.filename}</strong>
              <small>
                {preview.item.mediaType}
                {preview.page
                  ? ` · trafienie na s. ${preview.page}`
                  : ""}
              </small>
            </div>
            <button type="button" onClick={() => setPreview(null)}>Zamknij</button>
          </div>
          {preview.text !== undefined ? (
            <TextFileEditor
              key={preview.item.itemId}
              filename={preview.item.filename}
              mediaType={preview.item.mediaType}
              initialText={preview.text}
              encoding={preview.encoding ?? "utf-8"}
              readOnly={!canWrite}
              onSave={saveEditedText}
            />
          ) : preview.document ? (
            <DocumentEditor
              key={preview.item.itemId}
              filename={preview.item.filename}
              format={documentFormatFor(preview.item.mediaType, preview.item.filename)}
              blocks={preview.document.blocks}
              readOnly={!canWrite}
              onSave={saveEditedDocument}
            />
          ) : preview.sheet ? (
            <SheetEditor
              key={preview.item.itemId}
              filename={preview.item.filename}
              format={sheetFormatFor(preview.item.mediaType, preview.item.filename)}
              model={preview.sheet}
              macros={/\.xlsm$/i.test(preview.item.filename) || preview.item.mediaType.includes("macroenabled")}
              readOnly={!canWrite}
              onSave={saveEditedSheet}
            />
          ) : preview.pdf ? (
            <PdfPreview
              blob={preview.pdf}
              filename={preview.item.filename}
              {...(preview.page ? { initialPage: preview.page } : {})}
            />
          ) : preview.url ? (
            <img src={preview.url} alt={`Podgląd ${preview.item.filename}`} />
          ) : (
            <p>
              Ten format nie ma bezpiecznego podglądu w webview. Użyj „Otwórz w systemie”,
              aby uruchomić go w domyślnej aplikacji Windows.
            </p>
          )}
        </section>
      ) : null}

      {knowledgeSearchError &&
      documentSearch.trim().length >= 2 ? (
        <p className="workspace-search-note">
          Wyszukiwanie po nazwie działa. Indeks treści dokumentów jest chwilowo niedostępny: {knowledgeSearchError}
        </p>
      ) : null}
      {notice ? <p className="workspace-notice">{notice}</p> : null}
      {error ? <p className="chat-inline-error">{error}</p> : null}
    </article>
  );
}
