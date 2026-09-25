#!/usr/bin/env python3
"""Editable model of DOCX/ODT documents and XLSX/CSV sheets.

read:  file bytes (stdin) + --media-type  ->  JSON model (stdout)
write: JSON request (stdin) with format docx|odt|xlsx|csv  ->  file bytes (stdout)

Document model: {"kind": "document", "blocks": [
  {"type": "heading", "level": 1-3, "runs": [...]},
  {"type": "paragraph", "runs": [...]},
  {"type": "list", "ordered": bool, "items": [[runs], ...]},
  {"type": "table", "rows": [["cell text", ...], ...]}
]}, run = {"text": str, "b": bool, "i": bool, "u": bool}.

Sheet model: {"kind": "sheet", "sheets": [{"name": str, "rows": [[str, ...]]}],
"truncated": bool}. A cell starting with "=" is a formula.

The writer produces a simplified, clean file: text, headings, bold/italic/
underline, lists and tables survive; page headers/footers, company styles,
comments and tracked changes do not. Originals are never modified - the
caller stores the result as a new file.
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import re
import sys
import zipfile
from xml.sax.saxutils import escape

sys.path.insert(0, __import__("os").path.dirname(__file__))

from legal_document_worker import (  # noqa: E402
    DOCX_APP,
    DOCX_CORE,
    DOCX_CT,
    DOCX_DOC_RELS,
    DOCX_FONT,
    DOCX_NUMBERING,
    DOCX_ROOT_RELS,
    DOCX_SETTINGS,
    DOCX_STYLES,
    ODT_MANIFEST,
    ODT_META,
    ODT_MIMETYPE,
    ODT_SETTINGS,
    ODT_STYLES,
    zip_bytes,
)
from spreadsheet_extract_worker import (  # noqa: E402
    NS_MAIN,
    decode_delimited,
    parse_xml,
    read_member,
    shared_strings,
    sniff_delimiter,
    validate_archive,
    workbook_sheets,
)

DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
ODT = "application/vnd.oasis.opendocument.text"
XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
XLSM = "application/vnd.ms-excel.sheet.macroenabled.12"
CSV = "text/csv"
TSV = "text/tab-separated-values"

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
TEXT = "{urn:oasis:names:tc:opendocument:xmlns:text:1.0}"
TABLE = "{urn:oasis:names:tc:opendocument:xmlns:table:1.0}"
STYLE = "{urn:oasis:names:tc:opendocument:xmlns:style:1.0}"
FO = "{urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0}"
OFFICE = "{urn:oasis:names:tc:opendocument:xmlns:office:1.0}"

MAX_INPUT_BYTES = 64 * 1024 * 1024
# Editing a sheet larger than this in the app would silently drop data on
# save, so the model is marked truncated and the UI refuses to save it.
MAX_EDIT_ROWS = 2000
MAX_EDIT_COLS = 60
MAX_BLOCKS = 20000


def fail(code: str) -> None:
    sys.stderr.write(code + "\n")
    raise SystemExit(2)


# --- runs ------------------------------------------------------------------

def add_run(runs: list[dict], text: str, b: bool, i: bool, u: bool) -> None:
    if not text:
        return
    if runs and (runs[-1]["b"], runs[-1]["i"], runs[-1]["u"]) == (b, i, u):
        runs[-1]["text"] += text
    else:
        runs.append({"text": text, "b": b, "i": i, "u": u})


def on(node) -> bool:
    """w:b / w:i present and not switched off (w:val="0"/"false")."""
    if node is None:
        return False
    return node.attrib.get(W + "val", "true").lower() not in ("0", "false", "none")


def runs_text(runs: list[dict]) -> str:
    return "".join(run["text"] for run in runs)


# --- DOCX read ---------------------------------------------------------------

def docx_numbering_formats(zf: zipfile.ZipFile) -> dict[str, bool]:
    """numId -> ordered (decimal-like) for level 0."""
    if "word/numbering.xml" not in zf.namelist():
        return {}
    root = parse_xml(read_member(zf, "word/numbering.xml"))
    abstract: dict[str, bool] = {}
    for node in root.iter(W + "abstractNum"):
        ordered = False
        for lvl in node.iter(W + "lvl"):
            if lvl.attrib.get(W + "ilvl", "0") == "0":
                fmt = lvl.find(W + "numFmt")
                ordered = fmt is not None and fmt.attrib.get(W + "val", "bullet") not in ("bullet", "none")
                break
        abstract[node.attrib.get(W + "abstractNumId", "")] = ordered
    result = {}
    for num in root.iter(W + "num"):
        ref = num.find(W + "abstractNumId")
        if ref is not None:
            result[num.attrib.get(W + "numId", "")] = abstract.get(ref.attrib.get(W + "val", ""), False)
    return result


def docx_paragraph_runs(paragraph) -> list[dict]:
    runs: list[dict] = []
    for run in paragraph.iter(W + "r"):
        props = run.find(W + "rPr")
        b = i = u = False
        if props is not None:
            b = on(props.find(W + "b"))
            i = on(props.find(W + "i"))
            underline = props.find(W + "u")
            u = underline is not None and underline.attrib.get(W + "val", "single") != "none"
        for node in run:
            if node.tag == W + "t" and node.text:
                add_run(runs, node.text, b, i, u)
            elif node.tag == W + "tab":
                add_run(runs, "\t", b, i, u)
            elif node.tag in (W + "br", W + "cr"):
                add_run(runs, "\n", b, i, u)
    return runs


def docx_heading_level(paragraph) -> int:
    props = paragraph.find(W + "pPr")
    if props is None:
        return 0
    style = props.find(W + "pStyle")
    name = style.attrib.get(W + "val", "") if style is not None else ""
    match = re.match(r"^(?:Heading|Nagwek|Naglowek|berschrift|Titre)(\d)$", name, re.IGNORECASE)
    if match:
        return min(int(match.group(1)), 3)
    if name.lower() == "title":
        return 1
    outline = props.find(W + "outlineLvl")
    if outline is not None:
        try:
            return min(int(outline.attrib.get(W + "val", "9")) + 1, 3)
        except ValueError:
            return 0
    return 0


def docx_list_styles(zf: zipfile.ZipFile, numbering: dict[str, bool]) -> dict[str, bool]:
    """Paragraph styles that carry list numbering ("List Number", "Akapit z listą")."""
    result: dict[str, bool] = {}
    if "word/styles.xml" in zf.namelist():
        root = parse_xml(read_member(zf, "word/styles.xml"))
        for style in root.iter(W + "style"):
            style_id = style.attrib.get(W + "styleId", "")
            num = style.find(W + "pPr/" + W + "numPr/" + W + "numId")
            if num is not None:
                result[style_id] = numbering.get(num.attrib.get(W + "val", ""), False)
    return result


def docx_read(data: bytes) -> dict:
    with zipfile.ZipFile(io.BytesIO(data), "r") as zf:
        validate_archive(zf)
        root = parse_xml(read_member(zf, "word/document.xml"))
        numbering = docx_numbering_formats(zf)
        list_styles = docx_list_styles(zf, numbering)
    body = root.find(W + "body")
    blocks: list[dict] = []
    if body is None:
        return {"kind": "document", "blocks": blocks}
    for child in body:
        if len(blocks) > MAX_BLOCKS:
            fail("OFFICE_EDIT_DOCUMENT_TOO_LARGE")
        if child.tag == W + "p":
            runs = docx_paragraph_runs(child)
            props = child.find(W + "pPr")
            num = props.find(W + "numPr") if props is not None else None
            style_node = props.find(W + "pStyle") if props is not None else None
            style_id = style_node.attrib.get(W + "val", "") if style_node is not None else ""
            if num is None and style_id in list_styles:
                num = style_id
            if num is not None:
                if isinstance(num, str):
                    ordered = list_styles[num]
                else:
                    num_id = num.find(W + "numId")
                    ordered = numbering.get(num_id.attrib.get(W + "val", "") if num_id is not None else "", False)
                last = blocks[-1] if blocks else None
                if last and last["type"] == "list" and last["ordered"] == ordered:
                    last["items"].append(runs)
                else:
                    blocks.append({"type": "list", "ordered": ordered, "items": [runs]})
                continue
            level = docx_heading_level(child)
            if level:
                blocks.append({"type": "heading", "level": level, "runs": runs})
            else:
                blocks.append({"type": "paragraph", "runs": runs})
        elif child.tag == W + "tbl":
            rows = []
            for row in child.iter(W + "tr"):
                cells = []
                for cell in row.findall(W + "tc"):
                    cells.append("\n".join(runs_text(docx_paragraph_runs(p)) for p in cell.iter(W + "p")).strip())
                rows.append(cells)
            blocks.append({"type": "table", "rows": rows})
    return {"kind": "document", "blocks": blocks}


# --- ODT read ----------------------------------------------------------------

def odt_text_styles(root) -> dict[str, tuple[bool, bool, bool]]:
    styles: dict[str, tuple[bool, bool, bool]] = {}
    for style in root.iter(STYLE + "style"):
        props = style.find(STYLE + "text-properties")
        if props is None:
            continue
        b = props.attrib.get(FO + "font-weight", "") in ("bold", "700", "800", "900")
        i = props.attrib.get(FO + "font-style", "") == "italic"
        u = props.attrib.get(STYLE + "text-underline-style", "none") not in ("none", "")
        styles[style.attrib.get(STYLE + "name", "")] = (b, i, u)
    return styles


def odt_runs(node, styles, inherited=(False, False, False), paragraph_style=True) -> list[dict]:
    runs: list[dict] = []

    def walk(element, flags):
        if element.text:
            add_run(runs, element.text, *flags)
        for child in element:
            if child.tag == TEXT + "span":
                own = styles.get(child.attrib.get(TEXT + "style-name", ""), (False, False, False))
                walk(child, tuple(a or b for a, b in zip(flags, own)))
            elif child.tag == TEXT + "tab":
                add_run(runs, "\t", *flags)
            elif child.tag == TEXT + "line-break":
                add_run(runs, "\n", *flags)
            elif child.tag == TEXT + "s":
                add_run(runs, " " * int(child.attrib.get(TEXT + "c", "1") or 1), *flags)
            else:
                walk(child, flags)
            if child.tail:
                add_run(runs, child.tail, *flags)

    # A heading's own style makes it bold; that is the heading, not a run format.
    own = styles.get(node.attrib.get(TEXT + "style-name", ""), (False, False, False)) if paragraph_style else (False, False, False)
    walk(node, tuple(a or b for a, b in zip(inherited, own)))
    return runs


def odt_read(data: bytes) -> dict:
    with zipfile.ZipFile(io.BytesIO(data), "r") as zf:
        validate_archive(zf)
        root = parse_xml(read_member(zf, "content.xml"))
    styles = odt_text_styles(root)
    text_body = root.find(OFFICE + "body/" + OFFICE + "text")
    blocks: list[dict] = []
    if text_body is None:
        return {"kind": "document", "blocks": blocks}

    def visit(container):
        for child in container:
            if len(blocks) > MAX_BLOCKS:
                fail("OFFICE_EDIT_DOCUMENT_TOO_LARGE")
            if child.tag == TEXT + "h":
                try:
                    level = min(int(child.attrib.get(TEXT + "outline-level", "1")), 3)
                except ValueError:
                    level = 1
                blocks.append({"type": "heading", "level": level, "runs": odt_runs(child, styles, paragraph_style=False)})
            elif child.tag == TEXT + "p":
                blocks.append({"type": "paragraph", "runs": odt_runs(child, styles)})
            elif child.tag == TEXT + "list":
                style = child.attrib.get(TEXT + "style-name", "")
                items = []
                for item in child.iter(TEXT + "list-item"):
                    runs: list[dict] = []
                    for paragraph in item.findall(TEXT + "p") + item.findall(TEXT + "h"):
                        runs.extend(odt_runs(paragraph, styles))
                    items.append(runs)
                blocks.append({"type": "list", "ordered": "num" in style.lower(), "items": items})
            elif child.tag == TABLE + "table":
                rows = []
                for row in child.iter(TABLE + "table-row"):
                    rows.append([
                        "\n".join("".join(p.itertext()) for p in cell.iter(TEXT + "p")).strip()
                        for cell in row.findall(TABLE + "table-cell")
                    ])
                blocks.append({"type": "table", "rows": rows})
            elif child.tag == TEXT + "section":
                visit(child)

    visit(text_body)
    return {"kind": "document", "blocks": blocks}


# --- sheets read -------------------------------------------------------------

def column_index(ref: str) -> int:
    letters = re.match(r"^([A-Z]+)", ref)
    if not letters:
        return -1
    value = 0
    for char in letters.group(1):
        value = value * 26 + (ord(char) - 64)
    return value - 1


def xlsx_read(data: bytes) -> dict:
    try:
        zf = zipfile.ZipFile(io.BytesIO(data), "r")
    except zipfile.BadZipFile:
        fail("SPREADSHEET_ARCHIVE_INVALID")
    truncated = False
    sheets = []
    with zf:
        validate_archive(zf)
        shared = shared_strings(zf)
        for name, member in workbook_sheets(zf):
            root = parse_xml(read_member(zf, member))
            rows: list[list[str]] = []
            for row in root.iter("{" + NS_MAIN + "}row"):
                try:
                    index = int(row.attrib.get("r", len(rows) + 1)) - 1
                except ValueError:
                    index = len(rows)
                if index >= MAX_EDIT_ROWS:
                    truncated = True
                    break
                while len(rows) <= index:
                    rows.append([])
                values = rows[index]
                for cell in row.iter("{" + NS_MAIN + "}c"):
                    col = column_index(cell.attrib.get("r", ""))
                    if col < 0:
                        col = len(values)
                    if col >= MAX_EDIT_COLS:
                        truncated = True
                        continue
                    while len(values) <= col:
                        values.append("")
                    formula = cell.find("{" + NS_MAIN + "}f")
                    if formula is not None and formula.text:
                        values[col] = "=" + formula.text
                        continue
                    kind = cell.attrib.get("t", "")
                    node = cell.find("{" + NS_MAIN + "}v")
                    if kind == "s" and node is not None and node.text:
                        try:
                            values[col] = shared[int(node.text)]
                        except (ValueError, IndexError):
                            values[col] = ""
                    elif kind == "inlineStr":
                        values[col] = "".join(t.text or "" for t in cell.iter("{" + NS_MAIN + "}t"))
                    elif kind == "b" and node is not None:
                        values[col] = "TRUE" if node.text == "1" else "FALSE"
                    elif node is not None and node.text is not None:
                        values[col] = node.text
            sheets.append({"name": name, "rows": rows})
    return {"kind": "sheet", "sheets": sheets, "truncated": truncated}


def delimited_read(data: bytes, delimiter: str) -> dict:
    text = decode_delimited(data)
    delimiter = sniff_delimiter(text, delimiter)
    rows = []
    truncated = False
    for index, row in enumerate(csv.reader(io.StringIO(text), delimiter=delimiter)):
        if index >= MAX_EDIT_ROWS:
            truncated = True
            break
        if len(row) > MAX_EDIT_COLS:
            truncated = True
            row = row[:MAX_EDIT_COLS]
        rows.append(row)
    return {"kind": "sheet", "sheets": [{"name": "Arkusz1", "rows": rows}], "truncated": truncated, "delimiter": delimiter}


# --- DOCX / ODT write --------------------------------------------------------

def docx_runs_xml(runs: list[dict]) -> str:
    out = []
    for run in runs:
        props = ("<w:b/>" if run.get("b") else "") + ("<w:i/>" if run.get("i") else "") + ('<w:u w:val="single"/>' if run.get("u") else "")
        rpr = "<w:rPr>%s</w:rPr>" % props if props else ""
        parts = re.split(r"(\n|\t)", str(run.get("text", "")))
        for part in parts:
            if part == "\n":
                out.append("<w:r>%s<w:br/></w:r>" % rpr)
            elif part == "\t":
                out.append("<w:r>%s<w:tab/></w:r>" % rpr)
            elif part:
                space = ' xml:space="preserve"' if part[:1].isspace() or part[-1:].isspace() else ""
                out.append("<w:r>%s<w:t%s>%s</w:t></w:r>" % (rpr, space, escape(part)))
    return "".join(out)


DOCX_LIST_NUMBERING = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>
<w:abstractNum w:abstractNumId="1"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>
<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
<w:num w:numId="2"><w:abstractNumId w:val="1"/></w:num>
</w:numbering>"""


def docx_write(model: dict) -> bytes:
    body = []
    ordered_lists = 0
    for block in model.get("blocks") or []:
        kind = block.get("type")
        if kind == "heading":
            level = min(max(int(block.get("level", 1)), 1), 3)
            body.append('<w:p><w:pPr><w:pStyle w:val="Heading%d"/></w:pPr>%s</w:p>' % (level, docx_runs_xml(block.get("runs") or [])))
        elif kind == "paragraph":
            body.append("<w:p>%s</w:p>" % docx_runs_xml(block.get("runs") or []))
        elif kind == "list":
            ordered = bool(block.get("ordered"))
            if ordered:
                ordered_lists += 1
            for item in block.get("items") or []:
                num = 2 if ordered else 1
                body.append('<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="%d"/></w:numPr></w:pPr>%s</w:p>' % (num, docx_runs_xml(item)))
        elif kind == "table":
            rows = []
            for row in block.get("rows") or []:
                cells = "".join(
                    '<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>%s</w:tc>'
                    % "".join("<w:p>%s</w:p>" % docx_runs_xml([{"text": line}]) for line in (str(cell).split("\n") or [""]))
                    for cell in row
                )
                rows.append("<w:tr>%s</w:tr>" % cells)
            body.append(
                '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>%s</w:tbl>'
                % "".join(rows)
            )
    sect = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>'
    document = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>%s%s</w:body></w:document>'
    ) % ("".join(body), sect)
    entries = [
        ("[Content_Types].xml", DOCX_CT),
        ("_rels/.rels", DOCX_ROOT_RELS),
        ("docProps/core.xml", DOCX_CORE),
        ("docProps/app.xml", DOCX_APP),
        ("word/document.xml", document),
        ("word/styles.xml", DOCX_STYLES),
        ("word/settings.xml", DOCX_SETTINGS),
        ("word/fontTable.xml", DOCX_FONT),
        ("word/numbering.xml", DOCX_LIST_NUMBERING if "numPr" in document else DOCX_NUMBERING),
        ("word/_rels/document.xml.rels", DOCX_DOC_RELS),
    ]
    return zip_bytes([(n, d.encode("utf-8") if isinstance(d, str) else d) for n, d in entries])


def odt_style_name(run: dict) -> str:
    flags = ("b" if run.get("b") else "") + ("i" if run.get("i") else "") + ("u" if run.get("u") else "")
    return "T" + flags if flags else ""


def odt_runs_xml(runs: list[dict]) -> str:
    out = []
    for run in runs:
        text = escape(str(run.get("text", ""))).replace("\n", "<text:line-break/>").replace("\t", "<text:tab/>")
        style = odt_style_name(run)
        out.append('<text:span text:style-name="%s">%s</text:span>' % (style, text) if style else text)
    return "".join(out)


def odt_automatic_styles() -> str:
    styles = []
    for flags in ("b", "i", "u", "bi", "bu", "iu", "biu"):
        props = []
        if "b" in flags:
            props.append('fo:font-weight="bold"')
        if "i" in flags:
            props.append('fo:font-style="italic"')
        if "u" in flags:
            props.append('style:text-underline-style="solid" style:text-underline-width="auto" style:text-underline-color="font-color"')
        styles.append('<style:style style:name="T%s" style:family="text"><style:text-properties %s/></style:style>' % (flags, " ".join(props)))
    styles.append('<style:style style:name="Heading" style:family="paragraph"><style:text-properties fo:font-weight="bold" fo:font-size="14pt"/></style:style>')
    styles.append('<text:list-style style:name="LBullet"><text:list-level-style-bullet text:level="1" text:bullet-char="•"/></text:list-style>')
    styles.append('<text:list-style style:name="LNumber"><text:list-level-style-number text:level="1" style:num-format="1" style:num-suffix="."/></text:list-style>')
    return "<office:automatic-styles>%s</office:automatic-styles>" % "".join(styles)


def odt_write(model: dict) -> bytes:
    body = []
    for block in model.get("blocks") or []:
        kind = block.get("type")
        if kind == "heading":
            level = min(max(int(block.get("level", 1)), 1), 3)
            body.append('<text:h text:style-name="Heading" text:outline-level="%d">%s</text:h>' % (level, odt_runs_xml(block.get("runs") or [])))
        elif kind == "paragraph":
            body.append("<text:p>%s</text:p>" % odt_runs_xml(block.get("runs") or []))
        elif kind == "list":
            style = "LNumber" if block.get("ordered") else "LBullet"
            items = "".join("<text:list-item><text:p>%s</text:p></text:list-item>" % odt_runs_xml(item) for item in block.get("items") or [])
            body.append('<text:list text:style-name="%s">%s</text:list>' % (style, items))
        elif kind == "table":
            rows = block.get("rows") or []
            width = max((len(row) for row in rows), default=1)
            cells_xml = "".join(
                "<table:table-row>%s</table:table-row>" % "".join(
                    "<table:table-cell>%s</table:table-cell>" % "".join(
                        "<text:p>%s</text:p>" % escape(line) for line in str(cell).split("\n")
                    )
                    for cell in (list(row) + [""] * (width - len(row)))
                )
                for row in rows
            )
            body.append('<table:table table:name="Tabela%d"><table:table-column table:number-columns-repeated="%d"/>%s</table:table>' % (len(body) + 1, width, cells_xml))
    content = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" '
        'xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" '
        'xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" '
        'xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" '
        'xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.3">'
        "%s<office:body><office:text>%s</office:text></office:body></office:document-content>"
    ) % (odt_automatic_styles(), "".join(body))
    entries = [
        ("mimetype", ODT_MIMETYPE),
        ("content.xml", content.encode("utf-8")),
        ("styles.xml", ODT_STYLES.encode("utf-8")),
        ("meta.xml", ODT_META.encode("utf-8")),
        ("settings.xml", ODT_SETTINGS.encode("utf-8")),
        ("META-INF/manifest.xml", ODT_MANIFEST.encode("utf-8")),
    ]
    return zip_bytes(entries, stored_first="mimetype")


# --- XLSX / CSV write --------------------------------------------------------

NUMBER = re.compile(r"^-?(?:\d+)(?:[.,]\d+)?(?:[eE][-+]?\d+)?$")
SHEET_NAME_BAD = re.compile(r"[\\/?*\[\]:]")


def is_numeric(value: str) -> bool:
    """Amounts and counts become numbers; identifiers stay text.

    PESEL, NIP, account and phone numbers (long digit strings) and numbers
    with a leading zero would be mangled by Excel (4,41E+10, lost zeros).
    """
    text = value.strip()
    if not NUMBER.match(text):
        return False
    digits = re.sub(r"\D", "", text.split(",")[0].split(".")[0])
    if len(digits) > 10:
        return False
    if len(digits) > 1 and digits.startswith("0"):
        return False
    return True


def column_name(index: int) -> str:
    name = ""
    index += 1
    while index:
        index, rem = divmod(index - 1, 26)
        name = chr(65 + rem) + name
    return name


def xlsx_write(model: dict) -> bytes:
    sheets = model.get("sheets") or [{"name": "Arkusz1", "rows": []}]
    names = []
    sheet_files = []
    for index, sheet in enumerate(sheets, start=1):
        name = SHEET_NAME_BAD.sub(" ", str(sheet.get("name") or f"Arkusz{index}"))[:31].strip() or f"Arkusz{index}"
        while name in names:
            name = (name[:28] + f" {index}")[:31]
        names.append(name)
        rows_xml = []
        for r, row in enumerate(sheet.get("rows") or [], start=1):
            cells = []
            for c, value in enumerate(row):
                value = "" if value is None else str(value)
                if value == "":
                    continue
                ref = f"{column_name(c)}{r}"
                if value.startswith("=") and len(value) > 1:
                    cells.append(f'<c r="{ref}"><f>{escape(value[1:])}</f></c>')
                elif is_numeric(value):
                    cells.append(f'<c r="{ref}"><v>{value.strip().replace(",", ".")}</v></c>')
                else:
                    space = ' xml:space="preserve"' if value[:1].isspace() or value[-1:].isspace() or "\n" in value else ""
                    cells.append(f'<c r="{ref}" t="inlineStr"><is><t{space}>{escape(value)}</t></is></c>')
            if cells:
                rows_xml.append(f'<row r="{r}">{"".join(cells)}</row>')
        sheet_files.append(
            (
                f"xl/worksheets/sheet{index}.xml",
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
                f'<sheetData>{"".join(rows_xml)}</sheetData></worksheet>',
            )
        )
    workbook = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'
        + "".join(f'<sheet name="{escape(name, {chr(34): "&quot;"})}" sheetId="{i}" r:id="rId{i}"/>' for i, name in enumerate(names, start=1))
        + '</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>'
    )
    workbook_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + "".join(
            f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{i}.xml"/>'
            for i in range(1, len(names) + 1)
        )
        + f'<Relationship Id="rId{len(names) + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
        + "</Relationships>"
    )
    content_types = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
        + "".join(
            f'<Override PartName="/xl/worksheets/sheet{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            for i in range(1, len(names) + 1)
        )
        + "</Types>"
    )
    root_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
        "</Relationships>"
    )
    styles = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        '<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>'
        '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>'
        '<borders count="1"><border/></borders>'
        '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
        '<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>'
        "</styleSheet>"
    )
    entries = [
        ("[Content_Types].xml", content_types),
        ("_rels/.rels", root_rels),
        ("xl/workbook.xml", workbook),
        ("xl/_rels/workbook.xml.rels", workbook_rels),
        ("xl/styles.xml", styles),
        *sheet_files,
    ]
    return zip_bytes([(n, d.encode("utf-8")) for n, d in entries])


def csv_write(model: dict, delimiter: str) -> bytes:
    sheet = (model.get("sheets") or [{"rows": []}])[0]
    out = io.StringIO()
    writer = csv.writer(out, delimiter=delimiter, lineterminator="\r\n")
    for row in sheet.get("rows") or []:
        writer.writerow(["" if value is None else str(value) for value in row])
    # BOM so Excel opens Polish characters correctly.
    return ("﻿" + out.getvalue()).encode("utf-8")


# --- entry point -------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("operation", choices=["read", "write"])
    parser.add_argument("--media-type", default="")
    args = parser.parse_args()
    data = sys.stdin.buffer.read(MAX_INPUT_BYTES + 1)
    if not data or len(data) > MAX_INPUT_BYTES:
        fail("OFFICE_EDIT_SIZE_INVALID")
    try:
        if args.operation == "read":
            media = args.media_type
            if media == DOCX:
                model = docx_read(data)
            elif media == ODT:
                model = odt_read(data)
            elif media in (XLSX, XLSM):
                model = xlsx_read(data)
            elif media == CSV:
                model = delimited_read(data, ",")
            elif media == TSV:
                model = delimited_read(data, "\t")
            else:
                fail("OFFICE_EDIT_MEDIA_TYPE_UNSUPPORTED")
            sys.stdout.write(json.dumps(model, ensure_ascii=False))
            return
        request = json.loads(data.decode("utf-8"))
        fmt = request.get("format")
        model = request.get("model") or {}
        if fmt == "docx":
            output = docx_write(model)
        elif fmt == "odt":
            output = odt_write(model)
        elif fmt == "xlsx":
            output = xlsx_write(model)
        elif fmt == "csv":
            output = csv_write(model, request.get("delimiter") or ";")
        elif fmt == "tsv":
            output = csv_write(model, "\t")
        else:
            fail("OFFICE_EDIT_FORMAT_UNSUPPORTED")
        sys.stdout.buffer.write(output)
    except zipfile.BadZipFile:
        fail("OFFICE_EDIT_ARCHIVE_INVALID")
    except (ValueError, KeyError, TypeError) as error:
        fail("OFFICE_EDIT_INVALID:" + type(error).__name__)


if __name__ == "__main__":
    main()
