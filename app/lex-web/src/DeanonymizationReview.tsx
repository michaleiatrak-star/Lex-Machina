import { useMemo } from "react";
import type { DeanonymizationPreview, DocumentRestoration } from "./api.js";
import { RestorationReview, type ReviewMark } from "./RestorationReview.js";
import { restorationTone } from "./restoration-review.js";

/** One correction per alias: every occurrence in the document changes. */
export function applyAliasCorrection(
  preview: DeanonymizationPreview,
  alias: string,
  text: string
): DeanonymizationPreview {
  const value = text.trim();
  if (!value) return preview;
  let content = "";
  let cursor = 0;
  const marks: DeanonymizationPreview["marks"] = [];
  for (const mark of [...preview.marks].sort((a, b) => a.start - b.start)) {
    content += preview.text.slice(cursor, mark.start);
    const replacement = mark.alias === alias ? value : preview.text.slice(mark.start, mark.end);
    marks.push({ start: content.length, end: content.length + replacement.length, alias: mark.alias });
    content += replacement;
    cursor = mark.end;
  }
  content += preview.text.slice(cursor);
  return {
    text: content,
    marks,
    restorations: preview.restorations.map((item) =>
      item.alias === alias
        ? { ...item, text: value, source: "manual", confidence: 1, status: "ok" }
        : item
    )
  };
}

export function DeanonymizationReview(props: {
  preview: DeanonymizationPreview;
  busy: boolean;
  onCorrect: (restoration: DocumentRestoration, text: string, remember: boolean) => Promise<void>;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const byAlias = useMemo(
    () => new Map(props.preview.restorations.map((item) => [item.alias, item])),
    [props.preview.restorations]
  );
  const marks: ReviewMark[] = props.preview.marks.map((mark) => {
    const item = byAlias.get(mark.alias)!;
    return {
      start: mark.start,
      end: mark.end,
      kind: item.kind,
      ...(item.case ? { case: item.case } : {}),
      source: item.source,
      confidence: item.confidence,
      status: item.status,
      ...(item.canonical ? { canonical: item.canonical } : {}),
      ...(item.gender ? { gender: item.gender } : {})
    };
  });
  const toReview = props.preview.restorations.filter((item) => restorationTone(item) === "review");
  const unresolved = props.preview.restorations
    .filter((item) => item.status === "unresolved")
    .map((item) => item.alias);

  return (
    <div className="deanonymization-review">
      <p>
        Sprawdź przywrócone dane przed utworzeniem pliku. Poprawka formy zmienia wszystkie wystąpienia
        tego samego symbolu w dokumencie. {toReview.length > 0
          ? `Do sprawdzenia: ${toReview.length}.`
          : "Wszystkie formy pochodzą ze słownika, reguł lub dokumentu."}
      </p>
      <RestorationReview
        content={props.preview.text}
        marks={marks}
        unresolved={unresolved}
        defaultOpen
        onCorrect={async (index, text, remember) => {
          const alias = props.preview.marks[index]!.alias;
          await props.onCorrect(byAlias.get(alias)!, text, remember);
        }}
      />
      <div className="chat-form-row compact">
        <button
          type="button"
          className="chat-primary-action"
          disabled={props.busy || unresolved.length > 0}
          onClick={props.onConfirm}
        >
          {props.busy ? "Tworzę dokument…" : "Utwórz finalny dokument"}
        </button>
        <button type="button" className="chat-secondary-action" disabled={props.busy} onClick={props.onCancel}>
          Anuluj
        </button>
      </div>
    </div>
  );
}
