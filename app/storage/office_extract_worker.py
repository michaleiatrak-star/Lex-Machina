#!/usr/bin/env python3
import argparse
import io
import json
import sys
import zipfile
import xml.etree.ElementTree as ET

MAX_INPUT_BYTES = 64 * 1024 * 1024
MAX_XML_BYTES = 64 * 1024 * 1024
MAX_ENTRIES = 10000
MAX_TOTAL_UNCOMPRESSED = 256 * 1024 * 1024
MAX_TEXT_CHARS = 100_000_000

DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
ODT = "application/vnd.oasis.opendocument.text"

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
TEXT_NS = "urn:oasis:names:tc:opendocument:xmlns:text:1.0"

def fail(code: str) -> None:
    sys.stderr.write(code + "\n")
    raise SystemExit(2)

def read_member(zf: zipfile.ZipFile, name: str) -> bytes:
    try:
        info = zf.getinfo(name)
    except KeyError:
        fail("OFFICE_DOCUMENT_MEMBER_MISSING")
    if info.file_size < 0 or info.file_size > MAX_XML_BYTES:
        fail("OFFICE_DOCUMENT_MEMBER_TOO_LARGE")
    with zf.open(info, "r") as handle:
        data = handle.read(MAX_XML_BYTES + 1)
    if len(data) > MAX_XML_BYTES:
        fail("OFFICE_DOCUMENT_MEMBER_TOO_LARGE")
    return data

def validate_archive(zf: zipfile.ZipFile) -> None:
    infos = zf.infolist()
    if len(infos) > MAX_ENTRIES:
        fail("OFFICE_DOCUMENT_ARCHIVE_TOO_MANY_ENTRIES")
    total = 0
    for info in infos:
        if info.file_size < 0:
            fail("OFFICE_DOCUMENT_ARCHIVE_INVALID")
        total += info.file_size
        if total > MAX_TOTAL_UNCOMPRESSED:
            fail("OFFICE_DOCUMENT_ARCHIVE_TOO_LARGE")

def docx_text(data: bytes) -> str:
    with zipfile.ZipFile(io.BytesIO(data), "r") as zf:
        validate_archive(zf)
        xml = read_member(zf, "word/document.xml")
    try:
        root = ET.fromstring(xml)
    except ET.ParseError:
        fail("OFFICE_DOCUMENT_XML_INVALID")

    paragraphs = []
    p_tag = "{" + W_NS + "}p"
    t_tag = "{" + W_NS + "}t"
    tab_tag = "{" + W_NS + "}tab"
    br_tag = "{" + W_NS + "}br"
    cr_tag = "{" + W_NS + "}cr"

    for paragraph in root.iter(p_tag):
        parts = []
        for node in paragraph.iter():
            if node.tag == t_tag and node.text:
                parts.append(node.text)
            elif node.tag == tab_tag:
                parts.append("\t")
            elif node.tag in (br_tag, cr_tag):
                parts.append("\n")
        value = "".join(parts).strip()
        if value:
            paragraphs.append(value)
    return "\n\n".join(paragraphs)

def odt_text(data: bytes) -> str:
    with zipfile.ZipFile(io.BytesIO(data), "r") as zf:
        validate_archive(zf)
        xml = read_member(zf, "content.xml")
    try:
        root = ET.fromstring(xml)
    except ET.ParseError:
        fail("OFFICE_DOCUMENT_XML_INVALID")

    p_tag = "{" + TEXT_NS + "}p"
    h_tag = "{" + TEXT_NS + "}h"
    lines = []
    for node in root.iter():
        if node.tag not in (p_tag, h_tag):
            continue
        value = "".join(node.itertext()).strip()
        if value:
            lines.append(value)
    return "\n\n".join(lines)

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--media-type", required=True)
    args = parser.parse_args()

    data = sys.stdin.buffer.read(MAX_INPUT_BYTES + 1)
    if not data or len(data) > MAX_INPUT_BYTES:
        fail("OFFICE_DOCUMENT_SIZE_INVALID")

    try:
        if args.media_type == DOCX:
            text = docx_text(data)
        elif args.media_type == ODT:
            text = odt_text(data)
        else:
            fail("OFFICE_DOCUMENT_MEDIA_TYPE_UNSUPPORTED")
    except zipfile.BadZipFile:
        fail("OFFICE_DOCUMENT_ARCHIVE_INVALID")

    if len(text) > MAX_TEXT_CHARS:
        fail("OFFICE_DOCUMENT_TEXT_TOO_LARGE")

    sys.stdout.write(json.dumps({
        "text": text,
        "chars": len(text)
    }, ensure_ascii=False))

if __name__ == "__main__":
    main()
