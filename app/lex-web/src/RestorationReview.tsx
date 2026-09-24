import { useState, type ReactNode } from "react";
import {
  TONE_LABEL,
  caseLabel,
  restorationTone,
  substitutionKey,
  type RestorationTone
} from "./restoration-review.js";

export type ReviewMark = {
  start: number;
  end: number;
  kind: string;
  case?: string;
  source: string;
  confidence: number;
  status: string;
  canonical?: string;
  gender?: "m1" | "f";
  token?: string;
  caseMissing?: boolean;
};

const TONES: RestorationTone[] = ["certain", "rule", "review", "manual", "stored"];

/**
 * Restored text with every value put back from the local key marked by how
 * sure the program is. Clicking a mark lets the user correct it here only, or
 * also remember the form for this name.
 */
export function RestorationReview(props: {
  content: string;
  marks: ReviewMark[];
  unresolved?: string[];
  readOnly?: boolean;
  defaultOpen?: boolean;
  onCorrect: (index: number, text: string, remember: boolean) => Promise<void>;
}) {
  const [open, setOpen] = useState(
    props.defaultOpen ?? props.marks.some((mark) => restorationTone(mark) === "review")
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const counts = props.marks.reduce<Record<RestorationTone, number>>(
    (total, mark) => ({ ...total, [restorationTone(mark)]: total[restorationTone(mark)] + 1 }),
    { certain: 0, rule: 0, review: 0, manual: 0, stored: 0 }
  );
  const unresolved = props.unresolved ?? [];
  const current = selected === null ? null : props.marks[selected] ?? null;
  const keyRows = substitutionKey(props.content, props.marks);

  function select(index: number): void {
    const mark = props.marks[index]!;
    setSelected(index);
    setDraft(props.content.slice(mark.start, mark.end));
    setStatus("");
  }

  async function correct(remember: boolean): Promise<void> {
    if (selected === null || !draft.trim()) return;
    setBusy(true);
    setStatus("");
    try {
      await props.onCorrect(selected, draft, remember);
      setStatus(remember ? "Poprawiono i zapamiętano formę dla tego nazwiska." : "Poprawiono w tym miejscu.");
      setSelected(null);
    } catch (failure) {
      setStatus(`Nie udało się zapisać: ${failure instanceof Error ? failure.message : String(failure)}`);
    } finally {
      setBusy(false);
    }
  }

  const parts: ReactNode[] = [];
  let cursor = 0;
  props.marks.forEach((mark, index) => {
    if (mark.start > cursor) parts.push(<span key={`t${index}`}>{props.content.slice(cursor, mark.start)}</span>);
    const tone = restorationTone(mark);
    parts.push(
      <mark
        key={`m${index}`}
        className={`restored restored-${tone}${selected === index ? " restored-selected" : ""}`}
        title={`${mark.kind}${mark.case ? ` · ${caseLabel(mark.case)}` : ""} · ${TONE_LABEL[tone]} · pewność ${Math.round(mark.confidence * 100)}%`}
        role="button"
        tabIndex={0}
        onClick={() => select(index)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            select(index);
          }
        }}
      >
        {props.content.slice(mark.start, mark.end)}
      </mark>
    );
    cursor = mark.end;
  });
  parts.push(<span key="tail">{props.content.slice(cursor)}</span>);

  return (
    <section className="restoration-review" aria-label="Przywrócone dane">
      <div className="restoration-review-head">
        <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
          {open ? "Ukryj" : "Pokaż"} przywrócone dane ({props.marks.length})
        </button>
        <small>
          {counts.review > 0 ? `do sprawdzenia: ${counts.review}` : "wszystkie formy pewne lub regułowe"}
          {counts.manual > 0 ? ` · poprawione: ${counts.manual}` : ""}
          {unresolved.length > 0 ? ` · nieodtworzone symbole: ${unresolved.length}` : ""}
        </small>
      </div>
      {open ? (
        <>
          <div className="restoration-legend">
            {TONES.filter((tone) => counts[tone] > 0).map((tone) => (
              <span key={tone} className={`restored restored-${tone}`}>
                {TONE_LABEL[tone]} ({counts[tone]})
              </span>
            ))}
          </div>
          <div className="restoration-text">{parts}</div>
          <details className="substitution-key">
            <summary>Klucz podstawień: symbol z przypadkiem → odtworzone słowa ({keyRows.length})</summary>
            <table>
              <thead>
                <tr>
                  <th scope="col">Symbol od modelu</th>
                  <th scope="col">Przypadek</th>
                  <th scope="col">Odtworzono jako</th>
                  <th scope="col">Wystąpienia</th>
                  <th scope="col">Źródło formy</th>
                </tr>
              </thead>
              <tbody>
                {keyRows.map((row) => (
                  <tr key={`${row.placeholder}-${row.text}`} className={`substitution-${row.tone}`}>
                    <td><code>{row.placeholder}</code></td>
                    <td>
                      {row.caseMissing
                        ? "brak - model nie podał przypadku, przyjęto mianownik"
                        : caseLabel(row.case) || "-"}
                    </td>
                    <td>{row.text}</td>
                    <td>{row.occurrences}</td>
                    <td>{TONE_LABEL[row.tone]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
          {current ? (
            <div className="restoration-editor">
              <div>
                <strong>{current.kind}</strong>
                {current.case ? ` · ${caseLabel(current.case)}` : ""}
                {current.canonical ? ` · osoba: ${current.canonical}` : ""}
                {` · ${TONE_LABEL[restorationTone(current)]}`}
                {current.status === "gender_ambiguous" ? " · niepewna płeć" : ""}
                {current.caseMissing ? " · model nie podał przypadku" : ""}
              </div>
              <input
                aria-label="Poprawiona forma"
                value={draft}
                readOnly={props.readOnly}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void correct(false);
                  if (event.key === "Escape") setSelected(null);
                }}
              />
              {props.readOnly ? null : (
                <>
                  <button type="button" disabled={busy || !draft.trim()} onClick={() => void correct(false)}>
                    Popraw tylko tutaj
                  </button>
                  {current.kind === "PERSON" && current.canonical && current.case && current.gender ? (
                    <button
                      type="button"
                      disabled={busy || !draft.trim()}
                      title="Zapamiętuje formę każdego słowa (np. Müller → Müllerowi) na tym komputerze"
                      onClick={() => void correct(true)}
                    >
                      Popraw i zapamiętaj formę
                    </button>
                  ) : null}
                </>
              )}
              <button type="button" onClick={() => setSelected(null)}>Anuluj</button>
            </div>
          ) : (
            <small className="restoration-hint">Kliknij oznaczone słowo, aby je poprawić.</small>
          )}
          {unresolved.length > 0 ? (
            <div className="restoration-unresolved" role="alert">
              Nieodtworzone symbole (brak w kluczu tej sprawy): {unresolved.join(", ")}
            </div>
          ) : null}
          {status ? <p className="restoration-status" role="status">{status}</p> : null}
        </>
      ) : null}
    </section>
  );
}
