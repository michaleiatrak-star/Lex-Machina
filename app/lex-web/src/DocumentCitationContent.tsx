import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import type { WorkspaceDocumentCitation } from "./workspace-client.js";
import { SourceLinkedText } from "./SourceLinkedText.js";

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
      <mark id={`highlight-${citation.citationId}`}>
        {citation.contextText.slice(start, end)}
      </mark>
      {citation.contextText.slice(end)}
    </pre>
  );
}

export function DocumentCitationContent({
  content,
  citations = [],
  onOpenUrl
}: {
  content: string;
  citations?: WorkspaceDocumentCitation[];
  onOpenUrl?: (url: string) => Promise<void> | void;
}) {
  const [selected, setSelected] = useState<WorkspaceDocumentCitation | null>(null);
  const viewerRef = useRef<HTMLElement>(null);
  const byMarker = useMemo(
    () => new Map(citations.map((item) => [item.marker, item])),
    [citations]
  );
  const parts = content.split(/(\[\[LEXDOCREF:docref_\d+\]\])/g);

  useEffect(() => {
    if (!selected) return;
    viewerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
    viewerRef.current?.focus({ preventScroll: true });
  }, [selected]);

  return (
    <>
      <div className="chat-message-content">
        {parts.map((part, index) => {
          const citation = byMarker.get(part);
          if (!citation) {
            return (
              <span key={index}>
                <SourceLinkedText
                  content={part}
                  onOpenUrl={onOpenUrl}
                />
              </span>
            );
          }
          return (
            <button
              key={`${citation.citationId}-${index}`}
              type="button"
              className="document-citation-link"
              title={`Przejdź do cytowanego fragmentu: ${citation.label}`}
              aria-controls={`citation-${citation.citationId}`}
              onClick={() => setSelected(citation)}
            >
              [{citation.label}]
            </button>
          );
        })}
      </div>

      {selected ? (
        <aside
          ref={viewerRef}
          id={`citation-${selected.citationId}`}
          className="document-citation-viewer"
          aria-label="Cytowany fragment dokumentu"
          aria-live="polite"
          tabIndex={-1}
        >
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
            {selected.highlightStart !== undefined && selected.highlightEnd !== undefined ? (
              <strong>Dokładny cytat zaznaczony w źródle</strong>
            ) : (
              <span>
                Odnośnik prowadzi do źródłowego chunka; brak dokładnego zaznaczenia oznacza,
                że odpowiedź opiera się na fragmencie, ale nie deklaruje cytatu dosłownego.
              </span>
            )}
          </div>
        </aside>
      ) : null}
    </>
  );
}
