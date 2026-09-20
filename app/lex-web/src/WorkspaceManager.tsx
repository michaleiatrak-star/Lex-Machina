import { useEffect, useMemo, useState } from "react";
import { isDesktopShell } from "./api.js";
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

const PRIVACY_PROCESSABLE_MEDIA_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/tiff",
  "text/plain",
  "text/markdown",
  "text/csv",
  "text/tab-separated-values",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel.sheet.macroenabled.12"
]);

function bytesLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function canProcessPrivacy(item: WorkspaceItem): boolean {
  return (
    item.kind === "UPLOAD" &&
    !item.archive &&
    PRIVACY_PROCESSABLE_MEDIA_TYPES.has(item.mediaType)
  );
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
  refreshToken = 0,
  onProcessStoredFile
}: {
  caseId: string;
  title: string;
  canWrite: boolean;
  refreshToken?: number;
  onProcessStoredFile?: (request: {
    uploadId: string;
    fileName: string;
  }) => void;
}) {
  const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{
    item: WorkspaceItem;
    url?: string;
    text?: string;
    supported: boolean;
  } | null>(null);

  async function refresh(): Promise<void> {
    if (!caseId) {
      setWorkspace(null);
      return;
    }
    const next = await getWorkspace(caseId);
    setWorkspace(next);
    if (
      selectedFolder &&
      !next.folders.some((item) => item.folderId === selectedFolder)
    ) {
      setSelectedFolder(null);
    }
  }

  useEffect(() => {
    let cancelled = false;
    if (!caseId) {
      setWorkspace(null);
      return;
    }
    setError("");
    void getWorkspace(caseId)
      .then((next) => {
        if (!cancelled) setWorkspace(next);
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

  const folders = useMemo(
    () => [...(workspace?.folders ?? [])].sort((a, b) =>
      folderPath(a, workspace?.folders ?? []).localeCompare(
        folderPath(b, workspace?.folders ?? []),
        "pl"
      )
    ),
    [workspace]
  );

  const visibleItems = useMemo(() => {
    if (!workspace) return [];
    return workspace.items
      .filter((item) => (workspace.itemLocations[item.itemId] ?? null) === selectedFolder)
      .sort((a, b) => a.filename.localeCompare(b.filename, "pl"));
  }, [workspace, selectedFolder]);

  async function run(action: () => Promise<void>): Promise<void> {
    setBusy(true);
    setError("");
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
        <button
          type="button"
          className="chat-secondary-action"
          disabled={busy}
          onClick={() => void refresh()}
        >
          Odśwież
        </button>
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
              {selectedFolder
                ? folderPath(folders.find((item) => item.folderId === selectedFolder)!, folders)
                : "Główny katalog"}
            </strong>
            <span>{visibleItems.length} plików</span>
          </div>

          {visibleItems.length === 0 ? (
            <p className="workspace-empty">Ten folder jest pusty.</p>
          ) : (
            <ul className="workspace-file-list workspace-file-actions-list">
              {visibleItems.map((item) => (
                <li key={item.itemId}>
                  <div>
                    <strong>{item.filename}</strong>
                    <span>
                      {item.kind === "TEMPLATE" ? "WZÓR" : "DOKUMENT"} · {bytesLabel(item.bytes)} · {item.mediaType}
                    </span>
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
                    {canWrite &&
                    onProcessStoredFile &&
                    canProcessPrivacy(item) ? (
                      <button
                        type="button"
                        disabled={busy}
                        title="Ponownie uruchom OCR i decyzję prywatności dla pliku już zapisanego w aktach"
                        onClick={() =>
                          onProcessStoredFile({
                            uploadId: item.itemId,
                            fileName: item.filename
                          })
                        }
                      >
                        OCR / prywatność na żądanie
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

      {error ? <p className="chat-inline-error">{error}</p> : null}
    </article>
  );
}
