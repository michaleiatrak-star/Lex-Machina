import { useState } from "react";
import { columnLabel, normalizeRows, trimRows, withExtension } from "./office-editing.js";
import { editedFilename } from "./text-editing.js";
import type { EditableSheets } from "./workspace-client.js";

const PAGE_ROWS = 200;

type SheetFormat = "xlsx" | "csv" | "tsv";

export function SheetEditor(props: {
  filename: string;
  format: SheetFormat;
  model: EditableSheets;
  macros: boolean;
  readOnly: boolean;
  onSave: (filename: string, format: SheetFormat, model: EditableSheets) => Promise<void>;
}) {
  const [sheets, setSheets] = useState(() =>
    props.model.sheets.map((sheet) => ({ name: sheet.name, rows: normalizeRows(sheet.rows.length ? sheet.rows : [[""]]) }))
  );
  const [active, setActive] = useState(0);
  const [page, setPage] = useState(0);
  const [format, setFormat] = useState<SheetFormat>(props.format);
  const [saveAs, setSaveAs] = useState(editedFilename(props.filename));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const sheet = sheets[active] ?? { name: "Arkusz1", rows: [[""]] };
  const width = sheet.rows[0]?.length ?? 1;
  const pages = Math.max(1, Math.ceil(sheet.rows.length / PAGE_ROWS));
  const firstRow = Math.min(page, pages - 1) * PAGE_ROWS;
  const visible = sheet.rows.slice(firstRow, firstRow + PAGE_ROWS);
  const editable = !props.readOnly && !props.model.truncated;

  function update(change: (rows: string[][]) => string[][]): void {
    setSheets((current) =>
      current.map((entry, index) => (index === active ? { ...entry, rows: change(entry.rows) } : entry))
    );
    setDirty(true);
  }

  function setCell(row: number, column: number, value: string): void {
    update((rows) => rows.map((cells, index) =>
      index === row ? cells.map((cell, col) => (col === column ? value : cell)) : cells
    ));
  }

  async function save(): Promise<void> {
    if (!saveAs.trim()) return;
    const name = withExtension(saveAs.trim(), format);
    setSaving(true);
    setStatus("");
    try {
      // CSV/TSV hold one sheet: the active one is saved.
      const chosen = format === "xlsx" ? sheets : [sheet];
      await props.onSave(name, format, {
        kind: "sheet",
        truncated: false,
        ...(props.model.delimiter ? { delimiter: props.model.delimiter } : {}),
        sheets: chosen.map((entry) => ({ name: entry.name, rows: trimRows(entry.rows) }))
      });
      setDirty(false);
      setStatus(`Zapisano jako „${name}”. Oryginał pozostaje bez zmian.`);
      setSaveAs(editedFilename(name));
    } catch (failure) {
      setStatus(`Nie udało się zapisać: ${failure instanceof Error ? failure.message : String(failure)}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="text-editor office-editor">
      {sheets.length > 1 ? (
        <div className="sheet-tabs" role="tablist" aria-label="Arkusze">
          {sheets.map((entry, index) => (
            <button
              key={`${entry.name}-${index}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => {
                setActive(index);
                setPage(0);
              }}
            >
              {entry.name}
            </button>
          ))}
        </div>
      ) : null}
      {editable ? (
        <div className="text-editor-toolbar" role="toolbar" aria-label="Edycja arkusza">
          <button type="button" onClick={() => update((rows) => [...rows, Array<string>(width).fill("")])}>
            + Wiersz
          </button>
          <button type="button" onClick={() => update((rows) => rows.map((cells) => [...cells, ""]))}>
            + Kolumna
          </button>
          <button
            type="button"
            disabled={sheet.rows.length <= 1}
            onClick={() => update((rows) => rows.slice(0, -1))}
          >
            − Ostatni wiersz
          </button>
          <button
            type="button"
            disabled={width <= 1}
            onClick={() => update((rows) => rows.map((cells) => cells.slice(0, -1)))}
          >
            − Ostatnia kolumna
          </button>
        </div>
      ) : null}
      {props.model.truncated ? (
        <p className="office-editor-note">
          Arkusz jest większy niż limit edycji w aplikacji; pokazano jego początek tylko do odczytu.
          Użyj „Otwórz w systemie”, aby edytować całość.
        </p>
      ) : editable ? (
        <p className="office-editor-note">
          Zapis tworzy nowy plik z wartościami i formułami komórek (formuła zaczyna się od „=”).
          Formatowanie, scalenia, wykresy{props.macros ? " i makra" : ""} nie są przenoszone.
          {format !== "xlsx" && sheets.length > 1 ? " CSV/TSV zapisuje tylko bieżący arkusz." : ""}
          {" "}Oryginał pozostaje bez zmian.
        </p>
      ) : null}
      <div className="sheet-grid-wrap">
        <table className="sheet-grid">
          <thead>
            <tr>
              <th />
              {Array.from({ length: width }, (_, col) => <th key={col} scope="col">{columnLabel(col)}</th>)}
            </tr>
          </thead>
          <tbody>
            {visible.map((cells, offset) => {
              const row = firstRow + offset;
              return (
                <tr key={row}>
                  <th scope="row">{row + 1}</th>
                  {cells.map((cell, col) => (
                    <td key={col}>
                      {editable ? (
                        <input
                          aria-label={`${columnLabel(col)}${row + 1}`}
                          value={cell}
                          onChange={(event) => setCell(row, col, event.target.value)}
                        />
                      ) : (
                        <span>{cell}</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pages > 1 ? (
        <div className="sheet-pages">
          <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}>Poprzednie</button>
          <small>Wiersze {firstRow + 1}–{firstRow + visible.length} z {sheet.rows.length}</small>
          <button type="button" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Następne</button>
        </div>
      ) : null}
      <div className="text-editor-footer">
        <small>
          {sheet.rows.length} wierszy · {width} kolumn{dirty ? " · niezapisane zmiany" : ""}
        </small>
        {editable ? (
          <div className="text-editor-save">
            <input
              aria-label="Nazwa zapisywanego pliku"
              value={saveAs}
              onChange={(event) => setSaveAs(event.target.value)}
            />
            <select
              aria-label="Format zapisu"
              value={format}
              onChange={(event) => setFormat(event.target.value as SheetFormat)}
            >
              <option value="xlsx">XLSX</option>
              <option value="csv">CSV</option>
              <option value="tsv">TSV</option>
            </select>
            <button
              type="button"
              disabled={(!dirty && format === props.format && !props.macros) || saving || !saveAs.trim()}
              onClick={() => void save()}
            >
              {saving ? "Zapisywanie…" : "Zapisz jako nowy plik"}
            </button>
          </div>
        ) : props.readOnly ? (
          <small>Sprawa tylko do odczytu.</small>
        ) : null}
      </div>
      {status ? <p className="text-editor-status" role="status">{status}</p> : null}
    </div>
  );
}
