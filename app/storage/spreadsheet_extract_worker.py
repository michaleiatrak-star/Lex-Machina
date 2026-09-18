#!/usr/bin/env python3
import argparse
import csv
import io
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

MAX_INPUT_BYTES = 128 * 1024 * 1024
MAX_ENTRIES = 20000
MAX_TOTAL_UNCOMPRESSED = 512 * 1024 * 1024
MAX_XML_BYTES = 128 * 1024 * 1024
MAX_TEXT_CHARS = 100_000_000
MAX_SHEETS = 500
MAX_ROWS_PER_SHEET = 1_000_000
MAX_CELLS = 5_000_000

XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
XLSM = "application/vnd.ms-excel.sheet.macroenabled.12"
CSV = "text/csv"
TSV = "text/tab-separated-values"

NS_MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
NS_REL_DOC = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS_REL_PKG = "http://schemas.openxmlformats.org/package/2006/relationships"

CELL_REF = re.compile(r"^[A-Z]{1,4}[1-9][0-9]{0,6}$")

def fail(code: str) -> None:
    sys.stderr.write(code + "\n")
    raise SystemExit(2)

def safe_text(value: str) -> str:
    value = value.replace("\x00", "")
    return value.replace("\r\n", "\n").replace("\r", "\n")

def read_member(zf: zipfile.ZipFile, name: str) -> bytes:
    try:
        info = zf.getinfo(name)
    except KeyError:
        fail("SPREADSHEET_MEMBER_MISSING")
    if info.file_size < 0 or info.file_size > MAX_XML_BYTES:
        fail("SPREADSHEET_MEMBER_TOO_LARGE")
    with zf.open(info, "r") as handle:
        data = handle.read(MAX_XML_BYTES + 1)
    if len(data) > MAX_XML_BYTES:
        fail("SPREADSHEET_MEMBER_TOO_LARGE")
    return data

def validate_archive(zf: zipfile.ZipFile) -> None:
    infos = zf.infolist()
    if len(infos) > MAX_ENTRIES:
        fail("SPREADSHEET_ARCHIVE_TOO_MANY_ENTRIES")
    total = 0
    for info in infos:
        if info.file_size < 0:
            fail("SPREADSHEET_ARCHIVE_INVALID")
        total += info.file_size
        if total > MAX_TOTAL_UNCOMPRESSED:
            fail("SPREADSHEET_ARCHIVE_TOO_LARGE")

def parse_xml(data: bytes):
    upper = data[:4096].upper()
    if b"<!DOCTYPE" in upper or b"<!ENTITY" in upper:
        fail("SPREADSHEET_XML_DTD_FORBIDDEN")
    try:
        return ET.fromstring(data)
    except ET.ParseError:
        fail("SPREADSHEET_XML_INVALID")

def shared_strings(zf: zipfile.ZipFile):
    if "xl/sharedStrings.xml" not in zf.namelist():
        return []
    data = read_member(zf, "xl/sharedStrings.xml")
    root = parse_xml(data)
    values = []
    si_tag = "{" + NS_MAIN + "}si"
    t_tag = "{" + NS_MAIN + "}t"
    for si in root.iter(si_tag):
        parts = []
        for node in si.iter(t_tag):
            if node.text:
                parts.append(node.text)
        values.append(safe_text("".join(parts)))
    return values

def workbook_sheets(zf: zipfile.ZipFile):
    root = parse_xml(read_member(zf, "xl/workbook.xml"))
    rel_root = parse_xml(read_member(zf, "xl/_rels/workbook.xml.rels"))
    rels = {}
    rel_tag = "{" + NS_REL_PKG + "}Relationship"
    for rel in rel_root.iter(rel_tag):
        rid = rel.attrib.get("Id", "")
        target = rel.attrib.get("Target", "")
        if not rid or not target:
            continue
        normalized = target.replace("\\", "/").lstrip("/")
        if normalized.startswith("../") or "/../" in normalized:
            fail("SPREADSHEET_RELATION_PATH_INVALID")
        if normalized.startswith("xl/"):
            path = normalized
        else:
            path = "xl/" + normalized
        rels[rid] = path

    sheet_tag = "{" + NS_MAIN + "}sheet"
    rid_key = "{" + NS_REL_DOC + "}id"
    sheets = []
    for node in root.iter(sheet_tag):
        name = safe_text(node.attrib.get("name", "")).strip() or "Arkusz"
        rid = node.attrib.get(rid_key, "")
        target = rels.get(rid)
        if target and target.startswith("xl/worksheets/"):
            sheets.append((name[:200], target))
    if len(sheets) > MAX_SHEETS:
        fail("SPREADSHEET_SHEET_LIMIT_EXCEEDED")
    return sheets

def cell_value(cell, shared):
    cell_type = cell.attrib.get("t", "")
    formula = cell.find("{" + NS_MAIN + "}f")
    value_node = cell.find("{" + NS_MAIN + "}v")
    inline = cell.find("{" + NS_MAIN + "}is")

    value = ""
    if cell_type == "s" and value_node is not None and value_node.text:
        try:
            idx = int(value_node.text)
            value = shared[idx] if 0 <= idx < len(shared) else ""
        except ValueError:
            value = ""
    elif cell_type == "inlineStr" and inline is not None:
        value = "".join(
            node.text or ""
            for node in inline.iter("{" + NS_MAIN + "}t")
        )
    elif cell_type == "b" and value_node is not None:
        value = "TRUE" if value_node.text == "1" else "FALSE"
    elif cell_type == "e" and value_node is not None:
        value = "#ERROR:" + (value_node.text or "")
    elif value_node is not None and value_node.text is not None:
        value = value_node.text

    value = safe_text(value).strip()
    if formula is not None and formula.text:
        formula_text = safe_text(formula.text).strip()
        if value:
            return "FORMULA =" + formula_text + " | CACHED " + value
        return "FORMULA =" + formula_text
    return value

def xlsx_text(data: bytes) -> str:
    try:
        zf = zipfile.ZipFile(io.BytesIO(data), "r")
    except zipfile.BadZipFile:
        fail("SPREADSHEET_ARCHIVE_INVALID")

    with zf:
        validate_archive(zf)
        shared = shared_strings(zf)
        sheets = workbook_sheets(zf)
        lines = []
        text_chars = 0
        cell_count = 0

        for sheet_name, member in sheets:
            header = "[ARKUSZ: " + sheet_name + "]"
            lines.append(header)
            text_chars += len(header) + 1
            root = parse_xml(read_member(zf, member))
            row_tag = "{" + NS_MAIN + "}row"
            cell_tag = "{" + NS_MAIN + "}c"
            rows = 0
            for row in root.iter(row_tag):
                rows += 1
                if rows > MAX_ROWS_PER_SHEET:
                    fail("SPREADSHEET_ROW_LIMIT_EXCEEDED")
                row_values = []
                for cell in row.iter(cell_tag):
                    cell_count += 1
                    if cell_count > MAX_CELLS:
                        fail("SPREADSHEET_CELL_LIMIT_EXCEEDED")
                    ref = cell.attrib.get("r", "")
                    if not CELL_REF.match(ref):
                        continue
                    value = cell_value(cell, shared)
                    if value:
                        row_values.append(ref + "=" + value.replace("\n", " ↵ "))
                if row_values:
                    line = " | ".join(row_values)
                    lines.append(line)
                    text_chars += len(line) + 1
                if text_chars > MAX_TEXT_CHARS:
                    fail("SPREADSHEET_TEXT_TOO_LARGE")
            lines.append("")
            text_chars += 1
        return "\n".join(lines).strip()

def delimited_text(data: bytes, delimiter: str) -> str:
    text = data.decode("utf-8-sig", errors="replace")
    reader = csv.reader(io.StringIO(text), delimiter=delimiter)
    lines = []
    text_chars = 0
    cells = 0
    for row_index, row in enumerate(reader, start=1):
        if row_index > MAX_ROWS_PER_SHEET:
            fail("SPREADSHEET_ROW_LIMIT_EXCEEDED")
        values = []
        for col_index, value in enumerate(row, start=1):
            cells += 1
            if cells > MAX_CELLS:
                fail("SPREADSHEET_CELL_LIMIT_EXCEEDED")
            cleaned = safe_text(value).strip()
            if cleaned:
                values.append("C" + str(col_index) + "=" + cleaned.replace("\n", " ↵ "))
        if values:
            line = "ROW " + str(row_index) + " | " + " | ".join(values)
            lines.append(line)
            text_chars += len(line) + 1
        if text_chars > MAX_TEXT_CHARS:
            fail("SPREADSHEET_TEXT_TOO_LARGE")
    return "\n".join(lines)

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--media-type", required=True)
    args = parser.parse_args()

    data = sys.stdin.buffer.read(MAX_INPUT_BYTES + 1)
    if not data or len(data) > MAX_INPUT_BYTES:
        fail("SPREADSHEET_SIZE_INVALID")

    if args.media_type in (XLSX, XLSM):
        text = xlsx_text(data)
    elif args.media_type == CSV:
        text = delimited_text(data, ",")
    elif args.media_type == TSV:
        text = delimited_text(data, "\t")
    else:
        fail("SPREADSHEET_MEDIA_TYPE_UNSUPPORTED")

    sys.stdout.write(json.dumps({
        "text": text,
        "chars": len(text)
    }, ensure_ascii=False))

if __name__ == "__main__":
    main()
