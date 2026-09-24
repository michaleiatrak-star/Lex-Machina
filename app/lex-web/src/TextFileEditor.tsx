import { Fragment, useMemo, useRef, useState, type ReactNode } from "react";
import {
  applyFormat,
  countOccurrences,
  editedFilename,
  findNext,
  parseMarkdown,
  replaceAll,
  textStats,
  type FormatAction,
  type MarkdownInline
} from "./text-editing.js";

const TOOLBAR: Array<{ action: FormatAction; label: string; title: string }> = [
  { action: "bold", label: "B", title: "Pogrubienie (Ctrl+B)" },
  { action: "italic", label: "I", title: "Kursywa (Ctrl+I)" },
  { action: "underline", label: "U", title: "Podkreślenie (Ctrl+U)" },
  { action: "strike", label: "S", title: "Przekreślenie" },
  { action: "h1", label: "H1", title: "Nagłówek 1" },
  { action: "h2", label: "H2", title: "Nagłówek 2" },
  { action: "h3", label: "H3", title: "Nagłówek 3" },
  { action: "bullet", label: "• Lista", title: "Lista punktowana" },
  { action: "numbered", label: "1. Lista", title: "Lista numerowana" },
  { action: "quote", label: "Cytat", title: "Cytat" },
  { action: "code", label: "</>", title: "Kod / sygnatura" },
  { action: "link", label: "Link", title: "Odnośnik" },
  { action: "rule", label: "―", title: "Linia pozioma" }
];

const SHORTCUTS: Record<string, FormatAction> = { b: "bold", i: "italic", u: "underline" };

function renderInline(nodes: MarkdownInline[]): ReactNode {
  return nodes.map((node, index) => {
    switch (node.kind) {
      case "text":
        return <Fragment key={index}>{node.text}</Fragment>;
      case "bold":
        return <strong key={index}>{renderInline(node.children)}</strong>;
      case "italic":
        return <em key={index}>{renderInline(node.children)}</em>;
      case "underline":
        return <u key={index}>{renderInline(node.children)}</u>;
      case "strike":
        return <s key={index}>{renderInline(node.children)}</s>;
      case "code":
        return <code key={index}>{node.text}</code>;
      case "link":
        // Shown, never followed: the preview must not navigate the webview.
        return (
          <span key={index} className="text-editor-link" title={node.href}>
            {node.text}
          </span>
        );
    }
  });
}

export function MarkdownView(props: { source: string }) {
  const blocks = useMemo(() => parseMarkdown(props.source), [props.source]);
  return (
    <div className="text-editor-rendered">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "heading": {
            const Tag = `h${Math.min(block.level + 1, 6)}` as "h2";
            return <Tag key={index}>{renderInline(block.content)}</Tag>;
          }
          case "paragraph":
            return <p key={index}>{renderInline(block.content)}</p>;
          case "quote":
            return <blockquote key={index}>{renderInline(block.content)}</blockquote>;
          case "code":
            return <pre key={index}>{block.text}</pre>;
          case "rule":
            return <hr key={index} />;
          case "list": {
            const items = block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInline(item)}</li>
            ));
            return block.ordered ? <ol key={index}>{items}</ol> : <ul key={index}>{items}</ul>;
          }
        }
      })}
    </div>
  );
}

export function TextFileEditor(props: {
  filename: string;
  mediaType: string;
  initialText: string;
  encoding: string;
  readOnly: boolean;
  onSave: (filename: string, text: string) => Promise<void>;
}) {
  const area = useRef<HTMLTextAreaElement>(null);
  const markdown = props.mediaType === "text/markdown" || /\.(md|markdown)$/i.test(props.filename);
  const [text, setText] = useState(props.initialText);
  const [mode, setMode] = useState<"view" | "edit" | "split">(markdown ? "view" : "edit");
  const [history, setHistory] = useState<{ past: string[]; future: string[] }>({ past: [], future: [] });
  const [findOpen, setFindOpen] = useState(false);
  const [needle, setNeedle] = useState("");
  const [replacement, setReplacement] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [saveAs, setSaveAs] = useState(editedFilename(props.filename));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [savedText, setSavedText] = useState(props.initialText);
  const dirty = text !== savedText;
  const stats = textStats(text);

  function commit(next: string, selection?: { start: number; end: number }): void {
    if (next === text) return;
    setHistory((current) => ({ past: [...current.past.slice(-199), text], future: [] }));
    setText(next);
    if (selection) {
      requestAnimationFrame(() => {
        area.current?.focus();
        area.current?.setSelectionRange(selection.start, selection.end);
      });
    }
  }

  function format(action: FormatAction): void {
    const target = area.current;
    if (!target || props.readOnly) return;
    const result = applyFormat(
      { text, start: target.selectionStart, end: target.selectionEnd },
      action
    );
    commit(result.text, { start: result.start, end: result.end });
  }

  function undo(): void {
    const previous = history.past[history.past.length - 1];
    if (previous === undefined) return;
    setHistory({ past: history.past.slice(0, -1), future: [text, ...history.future] });
    setText(previous);
  }

  function redo(): void {
    const [next, ...rest] = history.future;
    if (next === undefined) return;
    setHistory({ past: [...history.past, text], future: rest });
    setText(next);
  }

  function find(): void {
    const target = area.current;
    const match = findNext(text, needle, target ? target.selectionEnd : 0, matchCase);
    if (!match || !target) {
      setStatus(needle ? "Brak wyników." : "");
      return;
    }
    target.focus();
    target.setSelectionRange(match.start, match.end);
    setStatus("");
  }

  function replaceOne(): void {
    const target = area.current;
    if (!target || props.readOnly) return;
    const selected = text.slice(target.selectionStart, target.selectionEnd);
    const same = matchCase
      ? selected === needle
      : selected.toLocaleLowerCase("pl") === needle.toLocaleLowerCase("pl");
    if (!needle || !same) {
      find();
      return;
    }
    const start = target.selectionStart;
    commit(text.slice(0, start) + replacement + text.slice(target.selectionEnd), {
      start,
      end: start + replacement.length
    });
  }

  function replaceEvery(): void {
    if (props.readOnly) return;
    const result = replaceAll(text, needle, replacement, matchCase);
    commit(result.text);
    setStatus(`Zamieniono: ${result.count}.`);
  }

  async function save(): Promise<void> {
    const name = saveAs.trim();
    if (!name) return;
    setSaving(true);
    setStatus("");
    try {
      await props.onSave(name, text);
      setSavedText(text);
      setStatus(`Zapisano jako „${name}”. Oryginał pozostaje bez zmian.`);
      setSaveAs(editedFilename(name));
    } catch (failure) {
      setStatus(`Nie udało się zapisać: ${failure instanceof Error ? failure.message : String(failure)}`);
    } finally {
      setSaving(false);
    }
  }

  const editor = (
    <textarea
      ref={area}
      className="text-editor-area"
      value={text}
      readOnly={props.readOnly}
      spellCheck
      lang="pl"
      aria-label={`Edycja ${props.filename}`}
      onChange={(event) => commit(event.target.value)}
      onKeyDown={(event) => {
        if (!(event.ctrlKey || event.metaKey)) return;
        const key = event.key.toLowerCase();
        if (SHORTCUTS[key]) {
          event.preventDefault();
          format(SHORTCUTS[key]!);
        } else if (key === "z" && !event.shiftKey) {
          event.preventDefault();
          undo();
        } else if (key === "y" || (key === "z" && event.shiftKey)) {
          event.preventDefault();
          redo();
        } else if (key === "f" || key === "h") {
          event.preventDefault();
          setFindOpen(true);
        } else if (key === "s") {
          event.preventDefault();
          void save();
        }
      }}
    />
  );

  return (
    <div className="text-editor">
      <div className="text-editor-toolbar" role="toolbar" aria-label="Formatowanie tekstu">
        {mode !== "view" && !props.readOnly
          ? TOOLBAR.map((button) => (
              <button
                key={button.action}
                type="button"
                title={button.title}
                className={`text-editor-${button.action}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => format(button.action)}
              >
                {button.label}
              </button>
            ))
          : null}
        {mode !== "view" ? (
          <>
            <button type="button" title="Cofnij (Ctrl+Z)" disabled={!history.past.length} onClick={undo}>Cofnij</button>
            <button type="button" title="Ponów (Ctrl+Y)" disabled={!history.future.length} onClick={redo}>Ponów</button>
            <button type="button" title="Znajdź i zamień (Ctrl+F)" onClick={() => setFindOpen((open) => !open)}>
              Znajdź
            </button>
          </>
        ) : null}
        <span className="text-editor-spacer" />
        <div className="text-editor-modes" role="group" aria-label="Widok">
          <button type="button" aria-pressed={mode === "view"} onClick={() => setMode("view")}>Podgląd</button>
          <button type="button" aria-pressed={mode === "edit"} onClick={() => setMode("edit")}>Edycja</button>
          {markdown ? (
            <button type="button" aria-pressed={mode === "split"} onClick={() => setMode("split")}>Obok siebie</button>
          ) : null}
        </div>
      </div>

      {findOpen && mode !== "view" ? (
        <div className="text-editor-find">
          <input
            placeholder="Szukaj"
            value={needle}
            onChange={(event) => setNeedle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") find();
            }}
          />
          <input
            placeholder="Zamień na"
            value={replacement}
            readOnly={props.readOnly}
            onChange={(event) => setReplacement(event.target.value)}
          />
          <label>
            <input type="checkbox" checked={matchCase} onChange={(event) => setMatchCase(event.target.checked)} />
            Aa
          </label>
          <small>{needle ? `${countOccurrences(text, needle, matchCase)} wyst.` : ""}</small>
          <button type="button" onClick={find}>Następne</button>
          <button type="button" disabled={props.readOnly} onClick={replaceOne}>Zamień</button>
          <button type="button" disabled={props.readOnly} onClick={replaceEvery}>Zamień wszystkie</button>
        </div>
      ) : null}

      <div className={`text-editor-body text-editor-body-${mode}`}>
        {mode === "view" ? (
          markdown ? <MarkdownView source={text} /> : <pre>{text}</pre>
        ) : mode === "split" ? (
          <>
            {editor}
            <MarkdownView source={text} />
          </>
        ) : (
          editor
        )}
      </div>

      <div className="text-editor-footer">
        <small>
          {stats.words} słów · {stats.characters} znaków · {stats.lines} wierszy · {props.encoding.toUpperCase()}
          {dirty ? " · niezapisane zmiany" : ""}
        </small>
        {props.readOnly ? (
          <small>Sprawa tylko do odczytu.</small>
        ) : (
          <div className="text-editor-save">
            <input
              aria-label="Nazwa zapisywanego pliku"
              value={saveAs}
              onChange={(event) => setSaveAs(event.target.value)}
            />
            <button type="button" disabled={!dirty || saving || !saveAs.trim()} onClick={() => void save()}>
              {saving ? "Zapisywanie…" : "Zapisz jako nowy plik"}
            </button>
          </div>
        )}
      </div>
      {status ? <p className="text-editor-status" role="status">{status}</p> : null}
    </div>
  );
}
