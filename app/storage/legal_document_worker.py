#!/usr/bin/env python3
import base64
import io
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape

FIXED_DATE = (1980, 1, 1, 0, 0, 0)
MAX_PACKAGE_BYTES = 64 * 1024 * 1024
ALIAS_RE = re.compile(r"(?:\[LMPII:D\d{2}:[A-Z_]+:\d{4}(?:\|(?:nom|gen|dat|acc|inst|loc|voc))?\]|\[PII:[A-Z_]+:\d{4}(?:\|(?:nom|gen|dat|acc|inst|loc|voc))?\])")

DOCX_CT = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
<Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>
<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>"""

DOCX_ROOT_RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>"""

DOCX_DOC_RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>"""

DOCX_CORE = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Lex Machina document</dc:title><dc:creator>Lex Machina</dc:creator></cp:coreProperties>"""

DOCX_APP = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Lex Machina</Application></Properties>"""

DOCX_STYLES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="23"/></w:rPr><w:pPr><w:spacing w:after="120" w:line="300" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:rPr><w:b/><w:sz w:val="32"/></w:rPr><w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:rPr><w:b/><w:sz w:val="28"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:rPr><w:b/><w:sz w:val="25"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:rPr><w:b/><w:sz w:val="23"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Quote"><w:name w:val="Quote"/><w:pPr><w:ind w:left="720" w:right="720"/><w:spacing w:after="120"/></w:pPr><w:rPr><w:i/></w:rPr></w:style>
</w:styles>"""

DOCX_SETTINGS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:zoom w:percent="100"/></w:settings>"""
DOCX_FONT = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:fonts xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:font w:name="Arial"/></w:fonts>"""
DOCX_NUMBERING = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>"""

ODT_MIMETYPE = b"application/vnd.oasis.opendocument.text"
ODT_MANIFEST = """<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.3">
<manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.text"/>
<manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
<manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>
<manifest:file-entry manifest:full-path="meta.xml" manifest:media-type="text/xml"/>
<manifest:file-entry manifest:full-path="settings.xml" manifest:media-type="text/xml"/>
</manifest:manifest>"""

ODT_STYLES = """<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.3">
<office:styles><style:default-style style:family="paragraph"><style:text-properties style:font-name="Arial" fo:font-size="11.5pt"/></style:default-style></office:styles>
</office:document-styles>"""
ODT_META = """<?xml version="1.0" encoding="UTF-8"?><office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" office:version="1.3"><office:meta/></office:document-meta>"""
ODT_SETTINGS = """<?xml version="1.0" encoding="UTF-8"?><office:document-settings xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" office:version="1.3"><office:settings/></office:document-settings>"""

DOCX_ALLOWED = {
    "[Content_Types].xml",
    "_rels/.rels",
    "docProps/core.xml",
    "docProps/app.xml",
    "word/document.xml",
    "word/styles.xml",
    "word/settings.xml",
    "word/fontTable.xml",
    "word/numbering.xml",
    "word/_rels/document.xml.rels",
}
ODT_ALLOWED = {
    "mimetype",
    "content.xml",
    "styles.xml",
    "meta.xml",
    "settings.xml",
    "META-INF/manifest.xml",
}

def zip_bytes(entries, stored_first=None):
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        for name, data in entries:
            info = zipfile.ZipInfo(name, FIXED_DATE)
            info.external_attr = 0o600 << 16
            compress = zipfile.ZIP_STORED if name == stored_first else zipfile.ZIP_DEFLATED
            zf.writestr(info, data, compress_type=compress, compresslevel=9 if compress == zipfile.ZIP_DEFLATED else None)
    result = buf.getvalue()
    if len(result) > MAX_PACKAGE_BYTES:
        raise ValueError("DOCUMENT_PACKAGE_TOO_LARGE")
    return result

def inline_text(nodes):
    parts = []
    for node in nodes or []:
        t = node.get("type")
        if t == "text":
            parts.append(node.get("text", ""))
        elif t == "pii_ref":
            parts.append(node.get("alias", ""))
        elif t == "xref":
            parts.append(node.get("label", ""))
        else:
            raise ValueError("AST_INLINE_TYPE_UNSUPPORTED")
    return "".join(parts)

def docx_runs(nodes):
    runs = []
    for node in nodes or []:
        t = node.get("type")
        text = node.get("text", "") if t == "text" else node.get("alias", "") if t == "pii_ref" else node.get("label", "")
        xml_space = ' xml:space="preserve"' if text[:1].isspace() or text[-1:].isspace() else ""
        runs.append("<w:r><w:t%s>%s</w:t></w:r>" % (xml_space, escape(text)))
    return "".join(runs)

def docx_paragraph(nodes, style=None, extra_ppr=""):
    style_xml = '<w:pStyle w:val="%s"/>' % style if style else ""
    ppr = "<w:pPr>%s%s</w:pPr>" % (style_xml, extra_ppr) if style_xml or extra_ppr else ""
    return "<w:p>%s%s</w:p>" % (ppr, docx_runs(nodes))

def docx_block(block):
    t = block.get("type")
    if t == "heading":
        return docx_paragraph(block.get("content"), "Heading%d" % int(block.get("level", 1)))
    if t == "paragraph":
        return docx_paragraph(block.get("content"))
    if t == "quote":
        return docx_paragraph(block.get("content"), "Quote")
    if t == "signature":
        return docx_paragraph(block.get("content"), None, '<w:jc w:val="right"/>')
    if t == "page_break":
        return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'
    if t == "list":
        out = []
        ordered = bool(block.get("ordered"))
        for index, item in enumerate(block.get("items") or [], start=1):
            prefix = ("%d. " % index) if ordered else "• "
            nodes = [{"type": "text", "text": prefix}] + list(item)
            out.append(docx_paragraph(nodes, None, '<w:ind w:left="720" w:hanging="360"/>'))
        return "".join(out)
    if t == "table":
        rows = []
        for row in block.get("rows") or []:
            cells = []
            for cell in row:
                body = "".join(docx_block(child) for child in cell.get("blocks") or [])
                cells.append('<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>%s</w:tc>' % body)
            rows.append("<w:tr>%s</w:tr>" % "".join(cells))
        return '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>%s</w:tbl>' % "".join(rows)
    raise ValueError("AST_BLOCK_TYPE_UNSUPPORTED")

def docx_styles_for(profile):
    if profile == "lex-classic-tnr-v1":
        return DOCX_STYLES.replace("Arial", "Times New Roman").replace('w:sz w:val="23"', 'w:sz w:val="24"')
    if profile == "lex-light-legal-design-v1":
        return DOCX_STYLES.replace(
            '<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:rPr><w:b/><w:sz w:val="28"/></w:rPr></w:style>',
            '<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:pPr><w:spacing w:before="240" w:after="120"/><w:pBdr><w:bottom w:val="single" w:sz="4"/></w:pBdr></w:pPr></w:style>'
        )
    return DOCX_STYLES

def odt_styles_for(profile):
    if profile == "lex-classic-tnr-v1":
        return ODT_STYLES.replace("Arial", "Times New Roman").replace('fo:font-size="11.5pt"', 'fo:font-size="12pt"')
    return ODT_STYLES

def render_docx(ast):
    body = []
    if ast.get("title"):
        body.append(docx_paragraph(ast.get("title"), "Title"))
    body.extend(docx_block(block) for block in ast.get("blocks") or [])
    sect = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>'
    document = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>%s%s</w:body></w:document>') % ("".join(body), sect)
    entries = [
        ("[Content_Types].xml", DOCX_CT),
        ("_rels/.rels", DOCX_ROOT_RELS),
        ("docProps/core.xml", DOCX_CORE),
        ("docProps/app.xml", DOCX_APP),
        ("word/document.xml", document),
        ("word/styles.xml", docx_styles_for(ast.get("styleProfile"))),
        ("word/settings.xml", DOCX_SETTINGS),
        ("word/fontTable.xml", DOCX_FONT),
        ("word/numbering.xml", DOCX_NUMBERING),
        ("word/_rels/document.xml.rels", DOCX_DOC_RELS),
    ]
    return zip_bytes([(n, d.encode("utf-8") if isinstance(d, str) else d) for n, d in entries])

def odt_inline(nodes):
    return escape(inline_text(nodes))

def odt_block(block):
    t = block.get("type")
    if t == "heading":
        return '<text:h text:outline-level="%d">%s</text:h>' % (int(block.get("level", 1)), odt_inline(block.get("content")))
    if t == "paragraph":
        return "<text:p>%s</text:p>" % odt_inline(block.get("content"))
    if t == "quote":
        return '<text:p text:style-name="Quote">%s</text:p>' % odt_inline(block.get("content"))
    if t == "signature":
        return '<text:p text:style-name="Signature">%s</text:p>' % odt_inline(block.get("content"))
    if t == "page_break":
        return '<text:p text:style-name="PageBreak"/>'
    if t == "list":
        items = "".join("<text:list-item><text:p>%s</text:p></text:list-item>" % odt_inline(item) for item in block.get("items") or [])
        return "<text:list>%s</text:list>" % items
    if t == "table":
        rows = []
        for row in block.get("rows") or []:
            cells = []
            for cell in row:
                cells.append("<table:table-cell>%s</table:table-cell>" % "".join(odt_block(child) for child in cell.get("blocks") or []))
            rows.append("<table:table-row>%s</table:table-row>" % "".join(cells))
        return '<table:table table:name="Tabela">%s</table:table>' % "".join(rows)
    raise ValueError("AST_BLOCK_TYPE_UNSUPPORTED")

def render_odt(ast):
    body = []
    if ast.get("title"):
        body.append('<text:h text:outline-level="1">%s</text:h>' % odt_inline(ast.get("title")))
    body.extend(odt_block(block) for block in ast.get("blocks") or [])
    content = """<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" office:version="1.3"><office:body><office:text>%s</office:text></office:body></office:document-content>""" % "".join(body)
    entries = [
        ("mimetype", ODT_MIMETYPE),
        ("content.xml", content.encode("utf-8")),
        ("styles.xml", odt_styles_for(ast.get("styleProfile")).encode("utf-8")),
        ("meta.xml", ODT_META.encode("utf-8")),
        ("settings.xml", ODT_SETTINGS.encode("utf-8")),
        ("META-INF/manifest.xml", ODT_MANIFEST.encode("utf-8")),
    ]
    return zip_bytes(entries, stored_first="mimetype")

def read_zip(data, allowed, required):
    if len(data) > MAX_PACKAGE_BYTES:
        raise ValueError("DOCUMENT_PACKAGE_TOO_LARGE")
    try:
        zf = zipfile.ZipFile(io.BytesIO(data), "r")
    except zipfile.BadZipFile:
        raise ValueError("DOCUMENT_PACKAGE_INVALID")
    with zf:
        names = zf.namelist()
        if len(names) != len(set(names)):
            raise ValueError("DOCUMENT_PACKAGE_DUPLICATE_ENTRY")
        if set(names) - allowed:
            raise ValueError("DOCUMENT_PACKAGE_FORBIDDEN_PART")
        if not required.issubset(set(names)):
            raise ValueError("DOCUMENT_PACKAGE_REQUIRED_PART_MISSING")
        total = 0
        entries = {}
        for info in zf.infolist():
            total += info.file_size
            if total > MAX_PACKAGE_BYTES * 4:
                raise ValueError("DOCUMENT_PACKAGE_EXPANSION_LIMIT")
            entries[info.filename] = zf.read(info.filename)
        return names, entries

def assert_no_external_relationships(entries):
    rel_ns = "{http://schemas.openxmlformats.org/package/2006/relationships}Relationship"
    for name, data in entries.items():
        if not name.endswith(".rels"):
            continue
        root = ET.fromstring(data)
        for rel in root.iter(rel_ns):
            if rel.attrib.get("TargetMode") == "External":
                raise ValueError("DOCUMENT_PACKAGE_EXTERNAL_RELATIONSHIP")

def extract_docx_text(entries):
    root = ET.fromstring(entries["word/document.xml"])
    ttag = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t"
    return "\n".join((node.text or "") for node in root.iter(ttag))

def extract_odt_text(entries):
    root = ET.fromstring(entries["content.xml"])
    text_ns = "urn:oasis:names:tc:opendocument:xmlns:text:1.0"
    tags = {"{%s}p" % text_ns, "{%s}h" % text_ns}
    return "\n".join("".join(node.itertext()) for node in root.iter() if node.tag in tags)

def validate_docx(data):
    names, entries = read_zip(data, DOCX_ALLOWED, DOCX_ALLOWED)
    assert_no_external_relationships(entries)
    for name, raw in entries.items():
        if name.endswith(".xml") or name.endswith(".rels"):
            ET.fromstring(raw)
    text = extract_docx_text(entries)
    return names, entries, text

def validate_odt(data):
    names, entries = read_zip(data, ODT_ALLOWED, ODT_ALLOWED)
    if names[0] != "mimetype" or entries["mimetype"] != ODT_MIMETYPE:
        raise ValueError("ODT_MIMETYPE_INVALID")
    for name, raw in entries.items():
        if name.endswith(".xml"):
            ET.fromstring(raw)
    text = extract_odt_text(entries)
    return names, entries, text

def replace_text_nodes(root, tags, replacements):
    replaced = 0
    for node in root.iter():
        if node.tag not in tags or not node.text:
            continue
        original = node.text
        def repl(match):
            nonlocal replaced
            alias = match.group(0)
            if alias not in replacements:
                raise ValueError("DOCUMENT_ALIAS_UNKNOWN")
            replaced += 1
            return replacements[alias]
        node.text = ALIAS_RE.sub(repl, original)
    return replaced

def extract_style_profile(fmt, data):
    if fmt == "docx":
        _, entries, _ = validate_docx(data)
        styles = entries["word/styles.xml"].decode("utf-8", errors="ignore").lower()
    elif fmt == "odt":
        _, entries, _ = validate_odt(data)
        styles = entries["styles.xml"].decode("utf-8", errors="ignore").lower()
    else:
        raise ValueError("DOCUMENT_FORMAT_UNSUPPORTED")

    if "times new roman" in styles:
        profile = "lex-classic-tnr-v1"
    elif "arial" in styles:
        profile = "lex-classic-clean-v1"
    else:
        profile = "lex-classic-clean-v1"

    return {
        "styleProfile": profile,
        "sourceFormat": fmt,
        "safe": True
    }

def deanonymize_docx(data, replacements):
    names, entries, _ = validate_docx(data)
    doc_name = "word/document.xml"
    root = ET.fromstring(entries[doc_name])
    tags = {"{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t"}
    replaced = replace_text_nodes(root, tags, replacements)
    entries[doc_name] = ET.tostring(root, encoding="utf-8", xml_declaration=True)
    result = zip_bytes([(name, entries[name]) for name in names])
    _, _, text = validate_docx(result)
    if ALIAS_RE.search(text):
        raise ValueError("DOCUMENT_ALIAS_REMAINS")
    return result, text, replaced

def deanonymize_odt(data, replacements):
    names, entries, _ = validate_odt(data)
    root = ET.fromstring(entries["content.xml"])
    text_ns = "urn:oasis:names:tc:opendocument:xmlns:text:1.0"
    tags = {"{%s}p" % text_ns, "{%s}h" % text_ns, "{%s}span" % text_ns}
    replaced = replace_text_nodes(root, tags, replacements)
    entries["content.xml"] = ET.tostring(root, encoding="utf-8", xml_declaration=True)
    result = zip_bytes([(name, entries[name]) for name in names], stored_first="mimetype")
    _, _, text = validate_odt(result)
    if ALIAS_RE.search(text):
        raise ValueError("DOCUMENT_ALIAS_REMAINS")
    return result, text, replaced

def main():
    raw = sys.stdin.buffer.read(MAX_PACKAGE_BYTES * 2)
    request = json.loads(raw.decode("utf-8"))
    operation = request.get("operation")
    if operation == "render":
        fmt = request.get("format")
        ast = request.get("ast")
        if fmt == "docx":
            package = render_docx(ast)
            _, _, text = validate_docx(package)
        elif fmt == "odt":
            package = render_odt(ast)
            _, _, text = validate_odt(package)
        else:
            raise ValueError("DOCUMENT_FORMAT_UNSUPPORTED")
        response = {"packageBase64": base64.b64encode(package).decode("ascii"), "text": text, "bytes": len(package)}
    elif operation == "deanonymize":
        fmt = request.get("format")
        package = base64.b64decode(request.get("packageBase64", ""), validate=True)
        replacements = request.get("replacements") or {}
        if not isinstance(replacements, dict) or len(replacements) > 20000:
            raise ValueError("DOCUMENT_REPLACEMENTS_INVALID")
        for alias, value in replacements.items():
            if not ALIAS_RE.fullmatch(alias) or not isinstance(value, str) or len(value) > 100000:
                raise ValueError("DOCUMENT_REPLACEMENTS_INVALID")
        if fmt == "docx":
            result, text, replaced = deanonymize_docx(package, replacements)
        elif fmt == "odt":
            result, text, replaced = deanonymize_odt(package, replacements)
        else:
            raise ValueError("DOCUMENT_FORMAT_UNSUPPORTED")
        response = {"packageBase64": base64.b64encode(result).decode("ascii"), "text": text, "bytes": len(result), "replaced": replaced}
    elif operation == "validate":
        fmt = request.get("format")
        package = base64.b64decode(request.get("packageBase64", ""), validate=True)
        if fmt == "docx":
            _, _, text = validate_docx(package)
        elif fmt == "odt":
            _, _, text = validate_odt(package)
        else:
            raise ValueError("DOCUMENT_FORMAT_UNSUPPORTED")
        response = {"text": text, "bytes": len(package), "aliases": len(ALIAS_RE.findall(text))}
    elif operation == "profile":
        fmt = request.get("format")
        package = base64.b64decode(request.get("packageBase64", ""), validate=True)
        response = extract_style_profile(fmt, package)
    else:
        raise ValueError("DOCUMENT_RENDER_OPERATION_INVALID")
    sys.stdout.write(json.dumps(response, ensure_ascii=False))

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        sys.stderr.write((str(exc) or exc.__class__.__name__) + "\n")
        raise SystemExit(2)
