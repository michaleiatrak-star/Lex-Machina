import { useEffect, useMemo, useState } from "react";
import {
  finalizeDocument,
  isDesktopShell,
  listCaseFiles,
  processStoredCaseFile,
  searchCaseKnowledge,
  uploadCaseFile,
  type CaseKnowledgeHit,
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
  previewWorkspaceItem,
  type WorkspaceFolder,
  type WorkspaceItem,
  type WorkspaceResponse
} from "./workspace-client.js";

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
  const [caseFiles, setCaseFiles] =
    useState<StoredUploadResponse[]>([]);
  const [preview, setPreview] = useState<{
    item: WorkspaceItem;
    url?: string;
    text?: string;
    supported: boolean;
  } | null>(null);

  async function refresh(): Promise<void> {
    if (!caseId) {
      setWorkspace(null);
      setCaseFiles([]);
      return;
    }
    const [next, files] =
      await Promise.all([
        getWorkspace(caseId),
        listCaseFiles(caseId)
      ]);
    setWorkspace(next);
    setCaseFiles(files.uploads);
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
    item: WorkspaceItem
  ): Promise<void> {
    await run(async () => {
      const review =
        await processStoredCaseFile(
          caseId,
          item.itemId
        );
      const result =
        await finalizeDocument(
          caseId,
          review.documentId,
          []
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
      .catch((failure) => {
        if (!cancelled) {
          setError(failure instanceof Error ? failure.message : String(failure));
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
      return "Główny katalog";
    }
    const folderId =
      workspace.itemLocations[
        item.itemId
      ] ?? null;
    if (!folderId) {
      return "Główny katalog";
    }
    const folder =
      folders.find(
        (entry) =>
          entry.folderId ===
          folderId
      );
    return folder
      ? folderPath(
          folder,
          folders
        )
      : "Główny katalog";
  }

  async function run(action: () => Promise<void>): Promise<void> {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      await refresh();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
    } finally {
      setBusy(false);
    }
  }

  async function showPreview(item: WorkspaceItem): Promise<void> {
    setBusy(true);
    setError("");
    try {
      const result = await previewWorkspaceItem(caseId, item.itemId);
      if (preview?.url) URL.revokeObjectURL(preview.url);
      if (
        result.mediaType.startsWith("text/") ||
        result.mediaType === "application/json"
      ) {
        setPreview({
          item,
          text: await result.blob.text(),
          supported: true
        });
        return;
      }
      if (
        result.mediaType === "application/pdf" ||
        result.mediaType.startsWith("image/")
      ) {
        setPreview({
          item,
          url: URL.createObjectURL(result.blob),
          supported: true
        });
        return;
      }
      setPreview({ item, supported: false });
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
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
      setError(failure instanceof Error ? failure.message : String(failure));
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
            Foldery są logiczną, szyfrowaną strukturą workspace. Pliki pozostają
            w chronionym magazynie sprawy i nie są przenoszone do jawnych ścieżek.
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
            📁 Główny katalog
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
                  : "Główny katalog"}
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
                        {processingFor(item)
                          ? processingFor(item)!.ocrPages > 0
                            ? `OCR ✓ · anonimizacja ✓ · ${processingFor(item)!.ocrPages}/${processingFor(item)!.totalPages} stron OCR · vault per dokument`
                            : `Tekst cyfrowy ✓ · anonimizacja ✓ · OCR niewymagany · vault per dokument`
                          : "Nieprzetworzony · OCR/anonimizacja oczekuje"}
                      </small>
                    ) : null}
                  </div>
                  <div className="workspace-item-actions">
                    <button type="button" disabled={busy} onClick={() => void showPreview(item)}>
                      Podgląd
                    </button>
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
                        <option value="">Główny katalog</option>
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
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {preview ? (
        <section className="workspace-preview" aria-label="Podgląd pliku">
          <div className="workspace-preview-head">
            <div>
              <strong>{preview.item.filename}</strong>
              <small>{preview.item.mediaType}</small>
            </div>
            <button type="button" onClick={() => setPreview(null)}>Zamknij</button>
          </div>
          {preview.text !== undefined ? (
            <pre>{preview.text}</pre>
          ) : preview.url ? (
            preview.item.mediaType.startsWith("image/") ? (
              <img src={preview.url} alt={`Podgląd ${preview.item.filename}`} />
            ) : (
              <iframe src={preview.url} title={`Podgląd ${preview.item.filename}`} />
            )
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
