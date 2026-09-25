import { useEffect, useMemo, useRef, useState } from "react";
import { listCaseFiles } from "./api.js";
import { getWorkspace } from "./workspace-client.js";
import {
  buildPickTree,
  filesIn,
  filterPickTree,
  folderState,
  pickKey,
  pickableIn,
  type FilePick,
  type PickFile,
  type PickFolder
} from "./file-pick-tree.js";

function filesWord(count: number): string {
  if (count === 1) return "plik";
  const tens = count % 100;
  return count % 10 >= 2 && count % 10 <= 4 && (tens < 12 || tens > 14) ? "pliki" : "plików";
}

function FolderCheckbox(props: {
  state: "all" | "some" | "none";
  disabled: boolean;
  label: string;
  onChange: (select: boolean) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = props.state === "some";
  }, [props.state]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={props.label}
      checked={props.state === "all"}
      disabled={props.disabled}
      onChange={() => props.onChange(props.state !== "all")}
    />
  );
}

/**
 * Firm templates and know-how, kept apart from case files: a folder tree
 * with search, where a file or a whole folder is ticked to go with the
 * message. Templates go as text; processed files as their model version.
 */
export function FirmFilePicker(props: {
  firmCaseId: string;
  selected: ReadonlySet<string>;
  reloadToken: number;
  onChange: (picks: FilePick[], select: boolean) => void;
  // Names of sendable files by document or template id (for status messages).
  onNames?: (names: Record<string, string>) => void;
}) {
  const [tree, setTree] = useState<PickFolder | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set(["root"]));

  useEffect(() => {
    let cancelled = false;
    setError("");
    Promise.all([getWorkspace(props.firmCaseId), listCaseFiles(props.firmCaseId)])
      .then(([workspace, files]) => {
        if (cancelled) return;
        const items: PickFile[] = workspace.items
          .filter((item) => item.kind === "UPLOAD" || item.kind === "TEMPLATE")
          .map((item) => {
            const folderId = workspace.itemLocations[item.itemId] ?? null;
            if (item.kind === "TEMPLATE") {
              return {
                itemId: item.itemId,
                name: item.filename,
                folderId,
                pick: { kind: "template", templateId: item.itemId },
                note: "Wzór · tekst jawny, bez anonimizacji - usuń z wzoru dane klientów"
              };
            }
            const processing = files.uploads.find((file) => file.uploadId === item.itemId)?.processing;
            return processing && processing.chunkIndices.length > 0
              ? {
                  itemId: item.itemId,
                  name: item.filename,
                  folderId,
                  pick: { kind: "document", documentId: processing.documentId, chunkIndices: processing.chunkIndices },
                  note:
                    (processing.anonymized === false ? "Tekst jawny" : "Wersja zanonimizowana") +
                    ` · ${processing.totalPages} ${processing.totalPages === 1 ? "strona" : "stron"}`
                }
              : {
                  itemId: item.itemId,
                  name: item.filename,
                  folderId,
                  pick: null,
                  note: "Nieprzetworzony - przetwórz go w zakładce Kancelaria"
                };
          });
        props.onNames?.(
          Object.fromEntries(items.flatMap((item) => (item.pick ? [[pickKey(item.pick), item.name]] : [])))
        );
        setTree(buildPickTree(workspace.caseDisplayName || "Wiedza kancelarii", workspace.folders, items));
      })
      .catch((failure) => {
        if (!cancelled) setError(failure instanceof Error ? failure.message : String(failure));
      });
    return () => {
      cancelled = true;
    };
  }, [props.firmCaseId, props.reloadToken]);

  const visible = useMemo(() => (tree ? filterPickTree(tree, query) : null), [tree, query]);
  const searching = query.trim().length > 0;

  const toggleOpen = (key: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const renderFolder = (folder: PickFolder, depth: number) => {
    const key = folder.folderId ?? "root";
    const expanded = searching || open.has(key);
    const picks = pickableIn(folder);
    const count = filesIn(folder).length;
    return (
      <li key={key} className="firm-pick-folder">
        <div className="firm-pick-row" style={{ paddingLeft: `${depth * 16}px` }}>
          <button
            type="button"
            className="firm-pick-toggle"
            aria-expanded={expanded}
            aria-label={expanded ? `Zwiń ${folder.name}` : `Rozwiń ${folder.name}`}
            onClick={() => toggleOpen(key)}
          >
            {expanded ? "▾" : "▸"}
          </button>
          <FolderCheckbox
            state={folderState(folder, props.selected)}
            disabled={picks.length === 0}
            label={`Zaznacz cały folder ${folder.name}`}
            onChange={(select) => props.onChange(picks, select)}
          />
          <strong onClick={() => toggleOpen(key)}>{folder.name}</strong>
          <small>{count} {filesWord(count)}</small>
        </div>
        {expanded ? (
          <ul>
            {folder.folders.map((child) => renderFolder(child, depth + 1))}
            {folder.files.map((file) => (
              <li key={file.itemId}>
                <label className="firm-pick-row firm-pick-file" style={{ paddingLeft: `${depth * 16 + 22}px` }}>
                  <input
                    type="checkbox"
                    disabled={!file.pick}
                    checked={file.pick ? props.selected.has(pickKey(file.pick)) : false}
                    onChange={(event) => {
                      if (file.pick) props.onChange([file.pick], event.target.checked);
                    }}
                  />
                  <span>
                    <strong>{file.name}</strong>
                    <small>{file.note}</small>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : null}
      </li>
    );
  };

  return (
    <div className="firm-pick" aria-label="Wzory i know-how kancelarii">
      <input
        type="search"
        className="firm-pick-search"
        placeholder="Szukaj wzoru lub dokumentu kancelarii"
        aria-label="Szukaj w plikach kancelarii"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {error ? <p className="chat-inline-error">Nie udało się odczytać plików kancelarii: {error}</p> : null}
      {!tree && !error ? <small>Wczytywanie…</small> : null}
      {tree && filesIn(tree).length === 0 ? (
        <small>Biblioteka kancelarii jest pusta. Dodaj wzory i dokumenty w zakładce Kancelaria.</small>
      ) : visible === null && tree ? (
        <small>Brak plików pasujących do „{query}”.</small>
      ) : visible ? (
        <ul className="firm-pick-tree">{renderFolder(visible, 0)}</ul>
      ) : null}
    </div>
  );
}
