import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  addToAnonymization,
  getAnonymizedVersion,
  removeFromAnonymization,
  updateAnonymizationForms,
  updateAnonymizationGrammar,
  type AnonymizedVersion,
  type KeyGrammar,
  type PiiKind,
  type PrivacyKeyEntry
} from "./api.js";
import { KIND_LABEL, PrivacyKeyTable } from "./PrivacyKeyTable.js";

const TOKEN = /(\[PII:[A-Z_]+:\d{4}(?:\|[A-Z]{2,4})?\])/;
const PAGE_HEADER = /\[STRONA (\d+)(?: · CZĘŚĆ (\d+)\/(\d+))? · [A-Z]+\]\n?/g;

/** Stored page headers as visible page boundaries ("Strona 3 z 12"). */
function withPages(text: string, totalPages: number, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(PAGE_HEADER)) {
    if (match.index! > cursor) out.push(<span key={`${key}-${cursor}`}>{text.slice(cursor, match.index)}</span>);
    const part = match[2] && match[2] !== "1" ? " (ciąg dalszy)" : "";
    out.push(
      <span key={`${key}-p${match.index}`} className="anonymized-page">
        Strona {match[1]} z {totalPages}{part}
      </span>
    );
    cursor = match.index! + match[0].length;
  }
  if (cursor < text.length) out.push(<span key={`${key}-${cursor}`}>{text.slice(cursor)}</span>);
  return out;
}

function renderProtected(text: string, totalPages: number, onToken: (token: string) => void): ReactNode[] {
  return text.split(TOKEN).map((part, index) =>
    index % 2 === 1 ? (
      <button
        key={index}
        type="button"
        className="anonymized-token"
        title="Pokaż w kluczu"
        onClick={() => onToken(part.replace(/\|[A-Z]{2,4}\]$/, "]"))}
      >
        {part}
      </button>
    ) : (
      <span key={index}>{withPages(part, totalPages, `s${index}`)}</span>
    )
  );
}

function renderMarked(
  text: string,
  marks: Array<{ start: number; end: number; token: string; kind: string }>,
  totalPages: number,
  onToken: (token: string) => void
): ReactNode[] {
  const out: ReactNode[] = [];
  let cursor = 0;
  marks.forEach((mark, index) => {
    if (mark.start > cursor) {
      out.push(<span key={`t${index}`}>{withPages(text.slice(cursor, mark.start), totalPages, `t${index}`)}</span>);
    }
    out.push(
      <mark
        key={`m${index}`}
        className={`anonymized-mark anonymized-${mark.kind.toLowerCase()}`}
        title={`${KIND_LABEL[mark.kind] ?? mark.kind} → ${mark.token}`}
        role="button"
        tabIndex={0}
        onClick={() => onToken(mark.token)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onToken(mark.token);
        }}
      >
        {text.slice(mark.start, mark.end)}
      </mark>
    );
    cursor = mark.end;
  });
  out.push(<span key="tail">{withPages(text.slice(cursor), totalPages, "tail")}</span>);
  return out;
}

/**
 * The anonymized version of a case document next to its key. Selecting text
 * adds it to the anonymization; the key lets the user correct case forms or
 * take a value out. Every change saves the version and the key together.
 */
export function AnonymizedDocumentView(props: {
  caseId: string;
  documentId: string;
  filename: string;
  readOnly: boolean;
  initialTab?: "marked" | "text" | "key";
  onClose: () => void;
  onChanged?: () => void;
}) {
  const [version, setVersion] = useState<AnonymizedVersion | null>(null);
  const [tab, setTab] = useState<"marked" | "text" | "key">(props.initialTab ?? "marked");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [selection, setSelection] = useState("");
  const [kind, setKind] = useState<PiiKind>("PERSON");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setVersion(null);
    getAnonymizedVersion(props.caseId, props.documentId)
      .then((next) => {
        if (!cancelled) setVersion(next);
      })
      .catch((failure) => {
        if (!cancelled) setStatus(`Nie udało się wczytać: ${failure instanceof Error ? failure.message : String(failure)}`);
      });
    return () => {
      cancelled = true;
    };
  }, [props.caseId, props.documentId]);

  async function apply(action: () => Promise<AnonymizedVersion>, done: (next: AnonymizedVersion) => string): Promise<void> {
    setBusy(true);
    setStatus("");
    try {
      const next = await action();
      setVersion(next);
      setStatus(done(next));
      props.onChanged?.();
    } catch (failure) {
      const code = failure instanceof Error ? failure.message : String(failure);
      setStatus(
        code === "PRIVACY_EDIT_TEXT_NOT_FOUND"
          ? "Tego tekstu nie ma w wersji zanonimizowanej (może już jest zastąpiony symbolem)."
          : `Nie udało się zapisać: ${code}`
      );
    } finally {
      setBusy(false);
    }
  }

  function captureSelection(): void {
    const selected = window.getSelection();
    const container = textRef.current;
    if (!selected || !container || selected.rangeCount === 0) return;
    if (!container.contains(selected.anchorNode) || !container.contains(selected.focusNode)) return;
    const text = selected.toString().replace(/\s+/g, " ").trim();
    if (text && !/[[\]]/.test(text)) setSelection(text.slice(0, 300));
  }

  function protect(): void {
    const text = selection.trim();
    if (!text) return;
    void apply(
      () => addToAnonymization(props.caseId, props.documentId, text, kind),
      (next) => {
        const added = next as AnonymizedVersion & { token: string; replaced: number };
        setSelection("");
        setHighlight(added.token);
        return `Zanonimizowano jako ${added.token} (wystąpienia: ${added.replaced}). Klucz zaktualizowano.`;
      }
    );
  }

  function remove(entry: PrivacyKeyEntry): void {
    if (!window.confirm(`Przywrócić jawną wartość w miejsce ${entry.token} i usunąć symbol z klucza?`)) return;
    void apply(
      () => removeFromAnonymization(props.caseId, props.documentId, entry.token),
      (next) =>
        `Przywrócono jawną wartość (wystąpienia: ${(next as AnonymizedVersion & { restored: number }).restored})` +
        (entry.forms ? " w mianowniku - sprawdź odmianę w tekście." : ".")
    );
  }

  function saveForms(entry: PrivacyKeyEntry, forms: Record<string, string>): void {
    if (!Object.keys(forms).length) return;
    void apply(
      () => updateAnonymizationForms(props.caseId, props.documentId, entry.token, forms),
      () => `Zapisano formy dla ${entry.token}; będą użyte przy przywracaniu danych.`
    );
  }

  function saveGrammar(entry: PrivacyKeyEntry, grammar: KeyGrammar): void {
    void apply(
      () => updateAnonymizationGrammar(props.caseId, props.documentId, entry.token, grammar),
      () => `Zapisano, kim jest ${entry.token}; model dostanie to w kluczu, a odmiana przy przywracaniu się zmieniła.`
    );
  }

  return (
    <section className="workspace-preview anonymized-view" aria-label="Wersja zanonimizowana">
      <div className="workspace-preview-head">
        <div>
          <strong>Wersja zanonimizowana: {props.filename}</strong>
          <small>
            Powiązana z oryginałem i kluczem anonimizacji · tę wersję widzą modele · {props.documentId}
          </small>
        </div>
        <div>
          <div className="text-editor-modes" role="group" aria-label="Widok">
            <button type="button" aria-pressed={tab === "marked"} onClick={() => setTab("marked")}>Zaznaczenia w tekście</button>
            <button type="button" aria-pressed={tab === "text"} onClick={() => setTab("text")}>Wersja dla modelu</button>
            <button type="button" aria-pressed={tab === "key"} onClick={() => setTab("key")}>
              Klucz ({version?.entries.length ?? 0})
            </button>
          </div>
          <button type="button" onClick={props.onClose}>Zamknij</button>
        </div>
      </div>

      {!version ? (
        <p className="privacy-key-empty">{status || "Wczytywanie…"}</p>
      ) : tab !== "key" ? (
        <>
          {props.readOnly ? null : (
            <div className="text-editor-toolbar anonymized-toolbar">
              <input
                aria-label="Tekst do anonimizacji"
                placeholder="Zaznacz tekst poniżej albo wpisz go tutaj"
                value={selection}
                onChange={(event) => setSelection(event.target.value)}
              />
              <select aria-label="Rodzaj danych" value={kind} onChange={(event) => setKind(event.target.value as PiiKind)}>
                {Object.entries(KIND_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button type="button" disabled={busy || !selection.trim()} onClick={protect}>
                Anonimizuj wszystkie wystąpienia
              </button>
            </div>
          )}
          <div className="anonymized-text" ref={textRef} onMouseUp={captureSelection} onKeyUp={captureSelection}>
            {tab === "marked" ? (
              <>
                <p className="anonymized-legend">
                  Zaznaczone słowa są w wersji dla modelu zastąpione symbolami. Najedź, aby zobaczyć symbol;
                  kliknij, aby przejść do klucza. Zaznacz inny fragment, aby go dodać do anonimizacji.
                </p>
                {version.highlighted.map((chunk) => (
                  <article key={chunk.index}>
                    <small>
                      s. {chunk.pageStart}
                      {chunk.pageEnd !== chunk.pageStart ? `–${chunk.pageEnd}` : ""}
                    </small>
                    <p>{renderMarked(chunk.text, chunk.marks, version.totalPages, (token) => {
                      setHighlight(token);
                      setTab("key");
                    })}</p>
                  </article>
                ))}
              </>
            ) : version.chunks.map((chunk) => (
              <article key={chunk.index}>
                <small>
                  s. {chunk.pageStart}
                  {chunk.pageEnd !== chunk.pageStart ? `–${chunk.pageEnd}` : ""}
                </small>
                <p>
                  {renderProtected(chunk.text, version.totalPages, (token) => {
                    setHighlight(token);
                    setTab("key");
                  })}
                </p>
              </article>
            ))}
          </div>
        </>
      ) : (
        <PrivacyKeyTable
          entries={version.entries}
          highlight={highlight}
          busy={busy}
          {...(props.readOnly ? {} : { onRemove: remove, onSaveForms: saveForms, onSaveGrammar: saveGrammar })}
        />
      )}
      {status && version ? <p className="text-editor-status" role="status">{status}</p> : null}
    </section>
  );
}
