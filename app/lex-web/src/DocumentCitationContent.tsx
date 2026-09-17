import { useMemo, useState } from "react";
import type { WorkspaceDocumentCitation } from "./workspace-client.js";

function HighlightedContext({
  citation
}: {
  citation: WorkspaceDocumentCitation;
}) {
  const start = citation.highlightStart;
  const end = citation.highlightEnd;
  if (
    start === undefined ||
    end === undefined ||
    start < 0 ||
    end < start ||
    end > citation.contextText.length
  ) {
    return <pre className="document-citation-context">{citation.contextText}</pre>;
  }
  return (
    <pre className="document-citation-context">
      {citation.contextText.slice(0, start)}
      <mark>{citation.contextText.slice(start, end)}</mark>
      {citation.contextText.slice(end)}
    </pre>
  );
}

export function DocumentCitationContent({
  content,
  citations = []
}: {
  content: string;
  citations?: WorkspaceDocumentCitation[];
}) {
  const [selected, setSelected] = useState<WorkspaceDocumentCitation | null>(null);
  const byMarker = useMemo(
    () => new Map(citations.map((item) => [item.marker, item])),
    [citations]
  );
  const parts = content.split(/(\[\[LEXDOCREF:docref_\d+\]\])/g);

  return (
    <>
      <div className="chat-message-content">
        {parts.map((part, index) => {
          const citation = byMarker.get(part);
          if (!citation) return <span key={index}>{part}</span>;
          return (
            <button
              key={`${citation.citationId}-${index}`}
              type="button"
              className="document-citation-link"
              title={`Pokaż źródło: ${citation.label}`}
              onClick={() => setSelected(citation)}
            >
              [{citation.label}]
            </button>
          );
        })}
      </div>

      {selected ? (
        <aside className="document-citation-viewer" aria-label="Cytowany fragment dokumentu">
          <div className="document-citation-head">
            <div>
              <strong>{selected.label}</strong>
              <small>
                dokument {selected.documentId} · chunk {selected.chunkIndex}
                {selected.caseId ? ` · sprawa ${selected.caseId.slice(0, 14)}…` : ""}
              </small>
            </div>
            <button type="button" onClick={() => setSelected(null)}>
              Zamknij
            </button>
          </div>
          <HighlightedContext citation={selected} />
          <div className="document-citation-foot">
            <span>
              Strona {selected.pageStart}
              {selected.pageEnd !== selected.pageStart ? `–${selected.pageEnd}` : ""}
            </span>
            {selected.highlightStart !== undefined ? (
              <strong>Dokładny cytat zaznaczony w źródle</strong>
            ) : (
              <span>Odnośnik do źródłowego fragmentu bez deklarowania cytatu dosłownego</span>
            )}
          </div>
        </aside>
      ) : null}
    </>
  );
}
