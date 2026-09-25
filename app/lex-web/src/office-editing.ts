import type {
  EditableBlock,
  EditableFormat,
  EditableRun
} from "./workspace-client.js";

/**
 * Conversion between the contentEditable DOM of the document editor and the
 * block model the runtime writes to DOCX/ODT. Works on a minimal node shape
 * so it runs without a browser in tests.
 */
export type NodeLike = {
  nodeType: number;
  nodeName: string;
  textContent: string | null;
  childNodes: ArrayLike<NodeLike>;
  style?: { fontWeight?: string; fontStyle?: string; textDecoration?: string; textDecorationLine?: string };
};

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;
const BLOCK_TAGS = new Set([
  "P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL", "TABLE", "BLOCKQUOTE", "PRE", "SECTION", "ARTICLE"
]);

type Marks = { b: boolean; i: boolean; u: boolean };

function childList(node: NodeLike): NodeLike[] {
  return Array.from(node.childNodes);
}

function marksFor(node: NodeLike, inherited: Marks): Marks {
  const tag = node.nodeName.toUpperCase();
  const weight = node.style?.fontWeight ?? "";
  const decoration = `${node.style?.textDecoration ?? ""} ${node.style?.textDecorationLine ?? ""}`;
  return {
    b: inherited.b || tag === "B" || tag === "STRONG" || weight === "bold" || Number(weight) >= 600,
    i: inherited.i || tag === "I" || tag === "EM" || node.style?.fontStyle === "italic",
    u: inherited.u || tag === "U" || decoration.includes("underline")
  };
}

/** Inline runs of a node; a <br> starts a new line, returned as a separate run list. */
function inlineLines(node: NodeLike): EditableRun[][] {
  const lines: EditableRun[][] = [[]];
  const walk = (current: NodeLike, marks: Marks): void => {
    if (current.nodeType === TEXT_NODE) {
      const text = (current.textContent ?? "").replace(/[\r\n\t]+/g, " ").replace(/ /g, " ");
      if (!text) return;
      const line = lines[lines.length - 1]!;
      const last = line[line.length - 1];
      if (last && last.b === marks.b && last.i === marks.i && last.u === marks.u) last.text += text;
      else line.push({ text, ...marks });
      return;
    }
    if (current.nodeType !== ELEMENT_NODE) return;
    if (current.nodeName.toUpperCase() === "BR") {
      lines.push([]);
      return;
    }
    const next = marksFor(current, marks);
    for (const child of childList(current)) walk(child, next);
  };
  walk(node, { b: false, i: false, u: false });
  // A trailing <br> is how browsers keep an empty line open, not content.
  if (lines.length > 1 && lines[lines.length - 1]!.length === 0) lines.pop();
  return lines;
}

function hasBlockChild(node: NodeLike): boolean {
  return childList(node).some(
    (child) => child.nodeType === ELEMENT_NODE && BLOCK_TAGS.has(child.nodeName.toUpperCase())
  );
}

function cellText(node: NodeLike): string {
  return inlineLines(node)
    .map((line) => line.map((run) => run.text).join(""))
    .join("\n")
    .trim();
}

export function blocksFromDom(root: NodeLike): EditableBlock[] {
  const blocks: EditableBlock[] = [];
  let loose: NodeLike[] = [];

  const flushLoose = (): void => {
    if (!loose.length) return;
    const holder: NodeLike = { nodeType: ELEMENT_NODE, nodeName: "SPAN", textContent: null, childNodes: loose };
    for (const runs of inlineLines(holder)) {
      if (runs.some((run) => run.text.trim())) blocks.push({ type: "paragraph", runs });
    }
    loose = [];
  };

  const visit = (node: NodeLike): void => {
    const tag = node.nodeName.toUpperCase();
    if (node.nodeType !== ELEMENT_NODE || !BLOCK_TAGS.has(tag)) {
      loose.push(node);
      return;
    }
    flushLoose();
    if (/^H[1-6]$/.test(tag)) {
      const level = Math.min(Number(tag.slice(1)), 3);
      for (const runs of inlineLines(node)) blocks.push({ type: "heading", level, runs });
      return;
    }
    if (tag === "UL" || tag === "OL") {
      const items: EditableRun[][] = [];
      const collect = (list: NodeLike): void => {
        for (const child of childList(list)) {
          const childTag = child.nodeName.toUpperCase();
          if (childTag === "UL" || childTag === "OL") {
            collect(child);
            continue;
          }
          if (childTag !== "LI") continue;
          // Nested lists are flattened into the parent list.
          // Built field by field: DOM node properties are getters, not own fields.
          const own: NodeLike = {
            nodeType: ELEMENT_NODE,
            nodeName: "LI",
            textContent: null,
            childNodes: childList(child).filter((grand) => !["UL", "OL"].includes(grand.nodeName.toUpperCase())),
            ...(child.style ? { style: child.style } : {})
          };
          items.push(inlineLines(own).flat());
          for (const grand of childList(child)) {
            if (["UL", "OL"].includes(grand.nodeName.toUpperCase())) collect(grand);
          }
        }
      };
      collect(node);
      if (items.length) blocks.push({ type: "list", ordered: tag === "OL", items });
      return;
    }
    if (tag === "TABLE") {
      const rows: string[][] = [];
      const collectRows = (current: NodeLike): void => {
        for (const child of childList(current)) {
          const childTag = child.nodeName.toUpperCase();
          if (childTag === "TR") {
            rows.push(
              childList(child)
                .filter((cell) => ["TD", "TH"].includes(cell.nodeName.toUpperCase()))
                .map(cellText)
            );
          } else if (["THEAD", "TBODY", "TFOOT"].includes(childTag)) {
            collectRows(child);
          }
        }
      };
      collectRows(node);
      if (rows.length) blocks.push({ type: "table", rows });
      return;
    }
    if (hasBlockChild(node)) {
      for (const child of childList(node)) visit(child);
      flushLoose();
      return;
    }
    for (const runs of inlineLines(node)) blocks.push({ type: "paragraph", runs });
  };

  for (const child of childList(root)) visit(child);
  flushLoose();
  return blocks;
}

/** Column label as in spreadsheets: 0 -> A, 25 -> Z, 26 -> AA. */
export function columnLabel(index: number): string {
  let label = "";
  let value = index + 1;
  while (value > 0) {
    const rest = (value - 1) % 26;
    label = String.fromCharCode(65 + rest) + label;
    value = Math.floor((value - 1) / 26);
  }
  return label;
}

/** A rectangular copy of rows: every row padded to the widest one. */
export function normalizeRows(rows: string[][], minColumns = 1): string[][] {
  const width = Math.max(minColumns, ...rows.map((row) => row.length));
  return rows.map((row) => [...row, ...Array<string>(width - row.length).fill("")]);
}

/** Drops trailing empty rows and columns so saved files carry no padding. */
export function trimRows(rows: string[][]): string[][] {
  const trimmed = rows.map((row) => {
    let end = row.length;
    while (end > 0 && !row[end - 1]) end -= 1;
    return row.slice(0, end);
  });
  let last = trimmed.length;
  while (last > 0 && trimmed[last - 1]!.length === 0) last -= 1;
  return trimmed.slice(0, last);
}

export function withExtension(filename: string, format: EditableFormat): string {
  const dot = filename.lastIndexOf(".");
  const stem = dot > 0 ? filename.slice(0, dot) : filename;
  return `${stem}.${format}`;
}

export function documentFormatFor(mediaType: string, filename: string): "docx" | "odt" {
  return mediaType.includes("opendocument") || /\.odt$/i.test(filename) ? "odt" : "docx";
}

export function sheetFormatFor(mediaType: string, filename: string): "xlsx" | "csv" | "tsv" {
  if (mediaType.startsWith("text/tab-separated-values") || /\.tsv$/i.test(filename)) return "tsv";
  if (mediaType.startsWith("text/csv") || /\.csv$/i.test(filename)) return "csv";
  return "xlsx";
}
