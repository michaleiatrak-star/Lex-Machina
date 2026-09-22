from __future__ import annotations

import argparse
import base64
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

SERVER_NAME = "lex-llama-private-docs"
SERVER_VERSION = "1.0.0"
MCP_PROTOCOL_VERSION = "2024-11-05"

MAX_TEXT_CHARS = 1_500_000
MAX_FILE_BYTES = 64 * 1024 * 1024
SUPPORTED_OCR_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".tif", ".tiff", ".bmp", ".webp"}
SUPPORTED_DOCUMENT_EXTENSIONS = {".docx", ".odt"}
CASE_ALIASES = {
    "nom": "nom",
    "nominative": "nom",
    "mian": "nom",
    "mianownik": "nom",
    "gen": "gen",
    "genitive": "gen",
    "dop": "gen",
    "dopelniacz": "gen",
    "dopełniacz": "gen",
    "dat": "dat",
    "dative": "dat",
    "cel": "dat",
    "celownik": "dat",
    "acc": "acc",
    "accusative": "acc",
    "bier": "acc",
    "biernik": "acc",
    "inst": "inst",
    "instrumental": "inst",
    "narz": "inst",
    "narzednik": "inst",
    "narzędnik": "inst",
    "loc": "loc",
    "locative": "loc",
    "miej": "loc",
    "miejscownik": "loc",
    "voc": "voc",
    "vocative": "voc",
    "wol": "voc",
    "wolacz": "voc",
    "wołacz": "voc",
}
TOKEN_RE = re.compile(r"\[PII:([A-Z_]+):(\d{4})(?:\|([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+))?\]")
BASE_TOKEN_RE = re.compile(r"^\[PII:([A-Z_]+):(\d{4})\]$")
LM_TOKEN_RE = re.compile(r"\[LMPII:D\d{2}:[A-Z_]+:\d{4}(?:\|(?:nom|gen|dat|acc|inst|loc|voc))?\]")
WORD_RE = re.compile(r"[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]+(?:[-'][A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]+)*")

PII_PRIORITY = {
    "PESEL": 100,
    "NIP": 95,
    "REGON": 90,
    "IBAN": 85,
    "EMAIL": 80,
    "PHONE": 75,
    "PERSON": 70,
    "ADDRESS": 60,
}

PESEL_RE = re.compile(r"\b\d{11}\b")
NIP_RE = re.compile(r"\b\d{10}\b")
REGON_RE = re.compile(r"\b(?:\d{9}|\d{14})\b")
IBAN_RE = re.compile(r"\bPL(?:[\s-]?\d){26}\b", re.I)
EMAIL_RE = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I)
PHONE_RE = re.compile(r"(?<!\d)(?:\+48[\s-]?)?(?:\d{3}[\s-]?\d{3}[\s-]?\d{3})(?!\d)")
ADDRESS_RE = re.compile(
    r"\b(?:ul\.?|al\.?|aleja|pl\.?|plac|os\.?|osiedle)\s+"
    r"[A-ZĄĆĘŁŃÓŚŹŻ][A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż' -]{1,80}"
    r"(?:\s+\d+[A-Za-z]?(?:/\d+[A-Za-z]?)?)?",
    re.I,
)

VAULTS: dict[str, dict[str, dict[str, str]]] = {}
REVERSE: dict[str, dict[tuple[str, str], str]] = {}
COUNTERS: dict[str, dict[str, int]] = {}
_MORFEUSZ: Any | None = None


def _env_path(name: str) -> Path:
    raw = os.environ.get(name, "").strip()
    if not raw:
        raise RuntimeError(f"{name}_MISSING")
    path = Path(raw).expanduser().resolve()
    if not path.is_file():
        raise RuntimeError(f"{name}_NOT_FOUND:{path}")
    return path


def _session(value: str | None) -> str:
    session = (value or "default").strip() or "default"
    if not re.fullmatch(r"[A-Za-z0-9_.-]{1,64}", session):
        raise ValueError("PRIVATE_SESSION_INVALID")
    return session


def _valid_pesel(value: str) -> bool:
    raw = re.sub(r"\D", "", value)
    if len(raw) != 11:
        return False
    weights = (1, 3, 7, 9, 1, 3, 7, 9, 1, 3)
    total = sum(weights[i] * int(raw[i]) for i in range(10))
    return (10 - (total % 10)) % 10 == int(raw[10])


def _valid_nip(value: str) -> bool:
    raw = re.sub(r"\D", "", value)
    if len(raw) != 10:
        return False
    weights = (6, 5, 7, 2, 3, 4, 5, 6, 7)
    total = sum(weights[i] * int(raw[i]) for i in range(9))
    return total % 11 == int(raw[9])


def _collect_regex(text: str, regex: re.Pattern[str], kind: str, validator: Any | None = None) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for match in regex.finditer(text):
        value = match.group(0)
        if validator is not None and not validator(value):
            continue
        out.append({"start": match.start(), "end": match.end(), "kind": kind, "value": value})
    return out


def _run_json_worker(command: list[str], *, env: dict[str, str] | None = None, input_bytes: bytes | None = None, timeout: int = 120) -> Any:
    completed = subprocess.run(
        command,
        input=input_bytes,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=env,
        timeout=timeout,
        check=False,
    )
    if completed.returncode != 0:
        stderr = completed.stderr.decode("utf-8", errors="replace").strip()
        raise RuntimeError(stderr.splitlines()[-1] if stderr else f"WORKER_FAILED:{completed.returncode}")
    stdout = completed.stdout.decode("utf-8", errors="replace")
    return json.loads(stdout) if stdout.strip() else None


def _recognize_people(text: str) -> list[dict[str, Any]]:
    worker = _env_path("LEX_PRIVATE_NER_WORKER")
    python = Path(sys.executable).resolve()
    with tempfile.TemporaryDirectory(prefix="lex-private-ner-") as tmp:
        root = Path(tmp)
        input_path = root / "input.txt"
        output_path = root / "output.json"
        input_path.write_text(text, encoding="utf-8")
        env = os.environ.copy()
        stanza_root = os.environ.get("STANZA_RESOURCES_DIR", "").strip()
        if not stanza_root:
            raise RuntimeError("STANZA_RESOURCES_DIR_MISSING")
        completed = subprocess.run(
            [str(python), "-X", "utf8", str(worker), "--input", str(input_path), "--output", str(output_path)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=env,
            timeout=120,
            check=False,
        )
        if completed.returncode != 0:
            stderr = completed.stderr.decode("utf-8", errors="replace").strip()
            raise RuntimeError(stderr.splitlines()[-1] if stderr else "STANZA_NER_WORKER_FAILED")
        payload = json.loads(output_path.read_text(encoding="utf-8"))
    out: list[dict[str, Any]] = []
    for item in payload:
        start = int(item["start"])
        end = int(item["end"])
        value = str(item["value"])
        if start >= 0 and end > start and text[start:end] == value:
            out.append({"start": start, "end": end, "kind": "PERSON", "value": value})
    return out


def _non_overlapping(spans: list[dict[str, Any]]) -> list[dict[str, Any]]:
    ordered = sorted(
        spans,
        key=lambda x: (
            int(x["start"]),
            -PII_PRIORITY.get(str(x["kind"]), 0),
            -(int(x["end"]) - int(x["start"])),
        ),
    )
    accepted: list[dict[str, Any]] = []
    for candidate in ordered:
        start = int(candidate["start"])
        end = int(candidate["end"])
        if start < 0 or end <= start:
            continue
        if any(start < int(other["end"]) and end > int(other["start"]) for other in accepted):
            continue
        accepted.append(candidate)
    return sorted(accepted, key=lambda x: int(x["start"]))


def _vault(session: str) -> dict[str, dict[str, str]]:
    return VAULTS.setdefault(session, {})


def _token_for(session: str, kind: str, value: str) -> str:
    reverse = REVERSE.setdefault(session, {})
    key = (kind, value)
    if key in reverse:
        return reverse[key]
    counters = COUNTERS.setdefault(session, {})
    sequence = counters.get(kind, 0) + 1
    counters[kind] = sequence
    token = f"[PII:{kind}:{sequence:04d}]"
    reverse[key] = token
    _vault(session)[token] = {"kind": kind, "value": value}
    return token


def anonymize_text(text: str, session: str) -> dict[str, Any]:
    if not isinstance(text, str) or not text.strip():
        raise ValueError("PRIVATE_ANONYMIZE_TEXT_EMPTY")
    if len(text) > MAX_TEXT_CHARS:
        raise ValueError("PRIVATE_ANONYMIZE_TEXT_TOO_LARGE")

    spans: list[dict[str, Any]] = []
    spans.extend(_collect_regex(text, PESEL_RE, "PESEL", _valid_pesel))
    spans.extend(_collect_regex(text, NIP_RE, "NIP", _valid_nip))
    spans.extend(_collect_regex(text, REGON_RE, "REGON"))
    spans.extend(_collect_regex(text, IBAN_RE, "IBAN"))
    spans.extend(_collect_regex(text, EMAIL_RE, "EMAIL"))
    spans.extend(_collect_regex(text, PHONE_RE, "PHONE"))
    spans.extend(_collect_regex(text, ADDRESS_RE, "ADDRESS"))
    spans.extend(_recognize_people(text))
    spans = _non_overlapping(spans)

    output = text
    counts: dict[str, int] = {}
    public_findings: list[dict[str, Any]] = []
    for item in reversed(spans):
        kind = str(item["kind"])
        value = str(item["value"])
        token = _token_for(session, kind, value)
        start = int(item["start"])
        end = int(item["end"])
        output = output[:start] + token + output[end:]
        counts[kind] = counts.get(kind, 0) + 1
        public_findings.append({"token": token, "kind": kind, "start": start, "end": end})
    public_findings.reverse()

    return {
        "session": session,
        "text": output,
        "counts": counts,
        "findings": public_findings,
        "vault_entries": len(_vault(session)),
        "privacy": "VALUES_STAY_IN_LOCAL_MCP_MEMORY_AND_ARE_NOT_RETURNED",
        "inflection_contract": "Use PERSON tokens as [PII:PERSON:0001|gen] / |dat / |acc / |inst / |loc / |voc when Polish grammar requires that case. Base token or |nom means nominative.",
    }


def _interp_payload(item: Any) -> tuple[str, str, str]:
    if isinstance(item, (list, tuple)) and len(item) == 3 and isinstance(item[2], (list, tuple)):
        payload = item[2]
    else:
        payload = item
    if not isinstance(payload, (list, tuple)) or len(payload) < 3:
        return "", "", ""
    return str(payload[0]), str(payload[1]), str(payload[2])


def _morf() -> Any:
    global _MORFEUSZ
    if _MORFEUSZ is None:
        try:
            import morfeusz2
        except Exception as exc:
            raise RuntimeError(f"MORFEUSZ2_UNAVAILABLE:{exc}") from exc
        _MORFEUSZ = morfeusz2.Morfeusz()
    return _MORFEUSZ


def _case_in_tag(tag: str, target: str) -> bool:
    parts = tag.split(":")
    return target in parts or any(target in piece.split(".") for piece in parts)


def _feature(tag: str, values: set[str]) -> str:
    for part in tag.split(":"):
        for value in part.split("."):
            if value in values:
                return value
    return ""


def _preserve_case(source: str, generated: str) -> str:
    if source.isupper():
        return generated.upper()
    if source[:1].isupper():
        return generated[:1].upper() + generated[1:]
    return generated


def _inflect_word(word: str, target: str) -> str:
    if target == "nom" or not any(ch.isalpha() for ch in word):
        return word
    morf = _morf()
    analyses = []
    for item in morf.analyse(word):
        form, lemma, tag = _interp_payload(item)
        if not lemma or not tag:
            continue
        pos = tag.split(":", 1)[0]
        if pos not in {"subst", "depr", "adj"}:
            continue
        if form.lower() != word.lower():
            continue
        score = 0
        if ":nom" in tag or _case_in_tag(tag, "nom"):
            score += 5
        if pos in {"subst", "adj"}:
            score += 3
        analyses.append((score, lemma, tag, pos))
    if not analyses:
        raise ValueError(f"INFLECTION_ANALYSIS_UNAVAILABLE:{word}")
    analyses.sort(key=lambda row: -row[0])

    candidates: list[tuple[int, str]] = []
    for _, lemma, source_tag, source_pos in analyses[:8]:
        source_number = _feature(source_tag, {"sg", "pl"})
        source_gender = _feature(source_tag, {"m1", "m2", "m3", "f", "n", "p1", "p2", "p3"})
        try:
            generated = morf.generate(lemma)
        except Exception:
            continue
        for item in generated:
            form, _gen_lemma, tag = _interp_payload(item)
            if not form or not tag or not _case_in_tag(tag, target):
                continue
            pos = tag.split(":", 1)[0]
            score = 0
            if pos == source_pos:
                score += 6
            gen_number = _feature(tag, {"sg", "pl"})
            gen_gender = _feature(tag, {"m1", "m2", "m3", "f", "n", "p1", "p2", "p3"})
            if source_number and gen_number == source_number:
                score += 4
            if source_gender and gen_gender == source_gender:
                score += 3
            if form.lower() != word.lower():
                score += 1
            candidates.append((score, _preserve_case(word, form)))
    if not candidates:
        raise ValueError(f"INFLECTION_GENERATION_UNAVAILABLE:{word}:{target}")
    candidates.sort(key=lambda row: (-row[0], len(row[1]), row[1]))
    return candidates[0][1]


def inflect_person(value: str, target: str) -> str:
    target = CASE_ALIASES.get(target.lower(), "")
    if not target:
        raise ValueError("INFLECTION_CASE_INVALID")
    if target == "nom":
        return value

    out: list[str] = []
    cursor = 0
    matched = False
    for match in WORD_RE.finditer(value):
        matched = True
        out.append(value[cursor:match.start()])
        token = match.group(0)
        if "-" in token:
            parts = token.split("-")
            inflected = "-".join(_inflect_word(part, target) for part in parts)
        else:
            inflected = _inflect_word(token, target)
        out.append(inflected)
        cursor = match.end()
    out.append(value[cursor:])
    if not matched:
        raise ValueError("INFLECTION_PERSON_EMPTY")
    return "".join(out)


def _replacement_for(session: str, base_token: str, case_name: str | None) -> str:
    item = _vault(session).get(base_token)
    if item is None:
        raise ValueError(f"PRIVATE_TOKEN_UNKNOWN:{base_token}")
    value = item["value"]
    kind = item["kind"]
    target = CASE_ALIASES.get((case_name or "nom").lower(), "")
    if not target:
        raise ValueError(f"PRIVATE_TOKEN_CASE_INVALID:{case_name}")
    if target == "nom":
        return value
    if kind != "PERSON":
        raise ValueError(f"INFLECTION_NOT_SUPPORTED_FOR_KIND:{kind}:{target}")
    return inflect_person(value, target)


def deanonymize_to_string(text: str, session: str) -> tuple[str, int]:
    count = 0

    def repl(match: re.Match[str]) -> str:
        nonlocal count
        base = f"[PII:{match.group(1)}:{match.group(2)}]"
        value = _replacement_for(session, base, match.group(3))
        count += 1
        return value

    output = TOKEN_RE.sub(repl, text)
    if TOKEN_RE.search(output):
        raise ValueError("PRIVATE_TOKEN_RESIDUE")
    return output, count


def _safe_output_path(requested: str | None, source: Path | None, suffix: str) -> Path:
    export_root_raw = os.environ.get("LEX_PRIVATE_EXPORT_DIR", "").strip()
    export_root = Path(export_root_raw).expanduser().resolve() if export_root_raw else (Path.home() / "LexMachina-private-exports").resolve()
    export_root.mkdir(parents=True, exist_ok=True)

    if requested:
        path = Path(requested).expanduser().resolve()
    elif source is not None:
        stem = source.stem + "-final"
        path = export_root / f"{stem}{suffix}"
    else:
        path = export_root / f"document-final{suffix}"

    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def finalize_text(text: str, session: str, output_path: str | None) -> str:
    if len(text) > MAX_TEXT_CHARS:
        raise ValueError("PRIVATE_FINALIZE_TEXT_TOO_LARGE")
    clear, replaced = deanonymize_to_string(text, session)
    target = _safe_output_path(output_path, None, ".txt")
    data = clear.encode("utf-8")
    target.write_bytes(data)
    digest = hashlib.sha256(data).hexdigest()
    return json.dumps(
        {
            "status": "READY",
            "path": str(target),
            "sha256": digest,
            "bytes": len(data),
            "replaced": replaced,
            "clear_pii_returned_to_model": False,
        },
        ensure_ascii=False,
    )


def _document_replacements(session: str) -> dict[str, str]:
    replacements: dict[str, str] = {}
    for token, item in _vault(session).items():
        replacements[token] = item["value"]
        replacements[token[:-1] + "|nom]"] = item["value"]
        if item["kind"] == "PERSON":
            for case_name in ("gen", "dat", "acc", "inst", "loc", "voc"):
                try:
                    replacements[token[:-1] + f"|{case_name}]"] = inflect_person(item["value"], case_name)
                except Exception:
                    pass
    return replacements


def finalize_document(input_path: str, session: str, output_path: str | None) -> str:
    source = Path(input_path).expanduser().resolve()
    if not source.is_file():
        raise ValueError(f"PRIVATE_DOCUMENT_NOT_FOUND:{source}")
    ext = source.suffix.lower()
    if ext not in SUPPORTED_DOCUMENT_EXTENSIONS:
        raise ValueError("PRIVATE_DOCUMENT_FORMAT_UNSUPPORTED")
    data = source.read_bytes()
    if len(data) > MAX_FILE_BYTES:
        raise ValueError("PRIVATE_DOCUMENT_TOO_LARGE")

    worker = _env_path("LEX_PRIVATE_DOC_WORKER")
    request = {
        "operation": "deanonymize",
        "format": ext.lstrip("."),
        "packageBase64": base64.b64encode(data).decode("ascii"),
        "replacements": _document_replacements(session),
    }
    result = _run_json_worker(
        [str(Path(sys.executable).resolve()), "-X", "utf8", str(worker)],
        input_bytes=json.dumps(request, ensure_ascii=False).encode("utf-8"),
        timeout=120,
    )
    package = base64.b64decode(str(result["packageBase64"]), validate=True)
    target = _safe_output_path(output_path, source, ext)
    target.write_bytes(package)
    digest = hashlib.sha256(package).hexdigest()
    return json.dumps(
        {
            "status": "READY",
            "path": str(target),
            "sha256": digest,
            "bytes": len(package),
            "replaced": int(result.get("replaced", 0)),
            "clear_pii_returned_to_model": False,
        },
        ensure_ascii=False,
    )


def ocr_extract(path_value: str, pages: str = "1", mode: str = "auto", dpi: int = 220) -> dict[str, Any]:
    source = Path(path_value).expanduser().resolve()
    if not source.is_file():
        raise ValueError(f"PRIVATE_OCR_FILE_NOT_FOUND:{source}")
    ext = source.suffix.lower()
    if ext not in SUPPORTED_OCR_EXTENSIONS:
        raise ValueError("PRIVATE_OCR_FORMAT_UNSUPPORTED")
    if source.stat().st_size > MAX_FILE_BYTES:
        raise ValueError("PRIVATE_OCR_FILE_TOO_LARGE")

    actual_mode = "pdf" if ext == ".pdf" else "image"
    if mode not in {"auto", "pdf", "image"}:
        raise ValueError("PRIVATE_OCR_MODE_INVALID")
    if mode != "auto" and mode != actual_mode:
        raise ValueError("PRIVATE_OCR_MODE_MISMATCH")

    worker = _env_path("LEX_PRIVATE_OCR_WORKER")
    with tempfile.TemporaryDirectory(prefix="lex-private-ocr-") as tmp:
        output = Path(tmp) / "ocr.json"
        command = [
            str(Path(sys.executable).resolve()),
            "-X",
            "utf8",
            str(worker),
            "--input",
            str(source),
            "--output",
            str(output),
            "--pages",
            str(pages),
            "--mode",
            actual_mode,
            "--lang",
            "pl",
            "--dpi",
            str(max(120, min(int(dpi), 400))),
        ]
        completed = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=os.environ.copy(),
            timeout=300,
            check=False,
        )
        if completed.returncode != 0:
            stderr = completed.stderr.decode("utf-8", errors="replace").strip()
            raise RuntimeError(stderr.splitlines()[-1] if stderr else "PADDLE_OCR_WORKER_FAILED")
        payload = json.loads(output.read_text(encoding="utf-8"))

    joined = "\n\n".join(str(page.get("text", "")) for page in payload if str(page.get("text", "")).strip())
    if len(joined) > MAX_TEXT_CHARS:
        joined = joined[:MAX_TEXT_CHARS]
    return {
        "path": str(source),
        "mode": actual_mode,
        "pages": payload,
        "text": joined,
        "engine": "PaddleOCR PP-OCRv6_medium local",
    }


def ocr_anonymize(path_value: str, session: str, pages: str = "1", mode: str = "auto", dpi: int = 220) -> dict[str, Any]:
    ocr = ocr_extract(path_value, pages=pages, mode=mode, dpi=dpi)
    result = anonymize_text(str(ocr["text"]), session)
    result["ocr"] = {
        "path": ocr["path"],
        "mode": ocr["mode"],
        "page_count": len(ocr["pages"]),
        "engine": ocr["engine"],
    }
    return result


def vault_status(session: str) -> str:
    entries = _vault(session)
    counts: dict[str, int] = {}
    for item in entries.values():
        kind = item["kind"]
        counts[kind] = counts.get(kind, 0) + 1
    return json.dumps(
        {
            "session": session,
            "entries": len(entries),
            "counts": counts,
            "storage": "PROCESS_MEMORY_ONLY",
            "clear_values_returned": False,
        },
        ensure_ascii=False,
    )


def clear_session(session: str) -> str:
    size = len(VAULTS.get(session, {}))
    VAULTS.pop(session, None)
    REVERSE.pop(session, None)
    COUNTERS.pop(session, None)
    return json.dumps({"session": session, "cleared_entries": size}, ensure_ascii=False)


TOOLS = [
    {
        "name": "ocr",
        "description": (
            "Run local PaddleOCR directly on a PDF/image path. This returns clear OCR text to the local model. "
            "For sensitive files prefer ocr_anonymize so clear OCR text never enters model context."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"},
                "pages": {"type": "string", "default": "1", "description": "Comma-separated 1-based page numbers."},
                "mode": {"type": "string", "enum": ["auto", "pdf", "image"], "default": "auto"},
                "dpi": {"type": "integer", "minimum": 120, "maximum": 400, "default": 220},
            },
            "required": ["path"],
            "additionalProperties": False,
        },
    },
    {
        "name": "ocr_anonymize",
        "description": (
            "Preferred tool for sensitive scanned documents. Runs local PaddleOCR then local Stanza/regex anonymization in one call, "
            "returning only tokenized text. Clear OCR content stays inside the local MCP process."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"},
                "session": {"type": "string", "default": "default"},
                "pages": {"type": "string", "default": "1"},
                "mode": {"type": "string", "enum": ["auto", "pdf", "image"], "default": "auto"},
                "dpi": {"type": "integer", "minimum": 120, "maximum": 400, "default": 220},
            },
            "required": ["path"],
            "additionalProperties": False,
        },
    },
    {
        "name": "anonymize",
        "description": (
            "Anonymize Polish text locally with deterministic identifier regexes and local Stanza PERSON NER. "
            "Returns PII tokens, not the clear values. Keep the returned session id for finalization."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "text": {"type": "string"},
                "session": {"type": "string", "default": "default"},
            },
            "required": ["text"],
            "additionalProperties": False,
        },
    },
    {
        "name": "inflection_contract",
        "description": (
            "Return the deterministic Polish grammatical-case token syntax used before deanonymization. "
            "PERSON tokens may use |gen, |dat, |acc, |inst, |loc, |voc. If inflection is unavailable, rewrite the sentence to nominative instead of guessing."
        ),
        "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False},
    },
    {
        "name": "finalize_text",
        "description": (
            "Replace local PII tokens in a completed tokenized text, applying Polish PERSON inflection through local Morfeusz/SGJP, "
            "and write the clear final text to a local file. The clear text is never returned to the model."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "text": {"type": "string"},
                "session": {"type": "string", "default": "default"},
                "output_path": {"type": "string"},
            },
            "required": ["text"],
            "additionalProperties": False,
        },
    },
    {
        "name": "finalize_document",
        "description": (
            "Deanonymize a completed DOCX/ODT locally. Supports grammatical PERSON token variants such as [PII:PERSON:0001|gen]. "
            "Writes a clear local document and returns only path/hash/metadata, never the clear PII text."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "input_path": {"type": "string"},
                "session": {"type": "string", "default": "default"},
                "output_path": {"type": "string"},
            },
            "required": ["input_path"],
            "additionalProperties": False,
        },
    },
    {
        "name": "vault_status",
        "description": "Return counts for an in-memory local PII vault without revealing any stored clear values.",
        "inputSchema": {
            "type": "object",
            "properties": {"session": {"type": "string", "default": "default"}},
            "additionalProperties": False,
        },
    },
    {
        "name": "clear_session",
        "description": "Erase one local in-memory PII vault session after finalization.",
        "inputSchema": {
            "type": "object",
            "properties": {"session": {"type": "string", "default": "default"}},
            "additionalProperties": False,
        },
    },
]


def inflection_contract() -> str:
    return "\n".join(
        [
            "PRIVATE_PII_INFLECTION_V1",
            "Base/nominative: [PII:PERSON:0001] or [PII:PERSON:0001|nom]",
            "Genitive/dopełniacz: [PII:PERSON:0001|gen]",
            "Dative/celownik: [PII:PERSON:0001|dat]",
            "Accusative/biernik: [PII:PERSON:0001|acc]",
            "Instrumental/narzędnik: [PII:PERSON:0001|inst]",
            "Locative/miejscownik: [PII:PERSON:0001|loc]",
            "Vocative/wołacz: [PII:PERSON:0001|voc]",
            "Only PERSON is inflected. PESEL/NIP/REGON/IBAN/EMAIL/PHONE/ADDRESS stay uninflected.",
            "If the requested PERSON form is not available in local Morfeusz/SGJP, finalization fails closed. Rewrite that sentence so the token can remain nominative; never guess a name form.",
        ]
    )


def call_tool(name: str, arguments: dict[str, Any]) -> str:
    if name == "ocr":
        return json.dumps(
            ocr_extract(
                str(arguments.get("path", "")),
                str(arguments.get("pages", "1")),
                str(arguments.get("mode", "auto")),
                int(arguments.get("dpi", 220)),
            ),
            ensure_ascii=False,
        )
    if name == "ocr_anonymize":
        return json.dumps(
            ocr_anonymize(
                str(arguments.get("path", "")),
                _session(str(arguments.get("session", "default"))),
                str(arguments.get("pages", "1")),
                str(arguments.get("mode", "auto")),
                int(arguments.get("dpi", 220)),
            ),
            ensure_ascii=False,
        )
    if name == "anonymize":
        return json.dumps(
            anonymize_text(
                str(arguments.get("text", "")),
                _session(str(arguments.get("session", "default"))),
            ),
            ensure_ascii=False,
        )
    if name == "inflection_contract":
        return inflection_contract()
    if name == "finalize_text":
        return finalize_text(
            str(arguments.get("text", "")),
            _session(str(arguments.get("session", "default"))),
            str(arguments.get("output_path", "")).strip() or None,
        )
    if name == "finalize_document":
        return finalize_document(
            str(arguments.get("input_path", "")),
            _session(str(arguments.get("session", "default"))),
            str(arguments.get("output_path", "")).strip() or None,
        )
    if name == "vault_status":
        return vault_status(_session(str(arguments.get("session", "default"))))
    if name == "clear_session":
        return clear_session(_session(str(arguments.get("session", "default"))))
    raise ValueError(f"PRIVATE_MCP_TOOL_UNKNOWN:{name}")


def response(request_id: Any, result: dict[str, Any] | None = None, error: dict[str, Any] | None = None) -> dict[str, Any]:
    payload: dict[str, Any] = {"jsonrpc": "2.0", "id": request_id}
    if error is not None:
        payload["error"] = error
    else:
        payload["result"] = result or {}
    return payload


def serve() -> int:
    for raw_line in sys.stdin:
        line = raw_line.strip()
        if not line:
            continue
        try:
            message = json.loads(line)
        except json.JSONDecodeError:
            continue
        method = message.get("method")
        request_id = message.get("id")
        if method == "notifications/initialized":
            continue
        try:
            if method == "initialize":
                requested = str(message.get("params", {}).get("protocolVersion") or MCP_PROTOCOL_VERSION)
                reply = response(
                    request_id,
                    result={
                        "protocolVersion": requested,
                        "capabilities": {"tools": {}},
                        "serverInfo": {"name": SERVER_NAME, "version": SERVER_VERSION},
                    },
                )
            elif method == "tools/list":
                reply = response(request_id, result={"tools": TOOLS})
            elif method == "tools/call":
                params = message.get("params") or {}
                arguments = params.get("arguments") or {}
                if not isinstance(arguments, dict):
                    raise ValueError("PRIVATE_MCP_TOOL_ARGUMENTS_INVALID")
                output = call_tool(str(params.get("name", "")), arguments)
                reply = response(
                    request_id,
                    result={"content": [{"type": "text", "text": output}], "isError": False},
                )
            else:
                reply = response(request_id, error={"code": -32601, "message": f"Method not found: {method}"})
        except Exception as exc:
            if method == "tools/call":
                reply = response(
                    request_id,
                    result={
                        "content": [{"type": "text", "text": f"PRIVATE_TOOL_ERROR: {type(exc).__name__}: {exc}"}],
                        "isError": True,
                    },
                )
            else:
                reply = response(request_id, error={"code": -32603, "message": f"{type(exc).__name__}: {exc}"})
        sys.stdout.write(json.dumps(reply, ensure_ascii=False, separators=(",", ":")) + "\n")
        sys.stdout.flush()
    return 0


def self_test() -> int:
    session = "selftest"
    sample = "Kontakt: jan.kowalski@example.com, PESEL 44051401458."
    result = anonymize_text(sample, session)
    assert "[PII:EMAIL:0001]" in result["text"]
    assert "[PII:PESEL:0001]" in result["text"]
    clear, count = deanonymize_to_string(result["text"], session)
    assert clear == sample and count == 2
    status = json.loads(vault_status(session))
    assert status["entries"] == 2
    assert status["clear_values_returned"] is False
    clear_session(session)
    assert len(_vault(session)) == 0
    _morf()
    print("LLAMA_PRIVATE_DOCS_MCP_SELFTEST_PASS")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        return self_test()
    return serve()


if __name__ == "__main__":
    raise SystemExit(main())
