from __future__ import annotations

import argparse
import base64
import ctypes
from ctypes import wintypes
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import uuid
import zipfile
from xml.etree import ElementTree as ET
from typing import Any

SERVER_NAME = "lex-llama-local-documents"
SERVER_VERSION = "1.0.0"
MCP_PROTOCOL_VERSION = "2024-11-05"

TOKEN_RE = re.compile(r"\[PII:([A-Z_]+):(\d{4})\]")
GRAMMAR_TOKEN_RE = re.compile(
    r"(?:\{\{)?\[PII:([A-Z_]+):(\d{4})\](?:\|case=(nom|gen|dat|acc|inst|loc|voc))?(?:\|number=(sg|pl))?(?:\}\})?"
)
MAX_TEXT_CHARS = 2_000_000
MAX_FILE_BYTES = 512 * 1024 * 1024
CASES = {"nom", "gen", "dat", "acc", "inst", "loc", "voc"}
NUMBERS = {"sg", "pl"}

PESEL_RE = re.compile(r"\b\d{11}\b")
NIP_RE = re.compile(r"\b\d{10}\b")
REGON_RE = re.compile(r"\b(?:\d{9}|\d{14})\b")
IBAN_RE = re.compile(r"\bPL(?:[\s-]?\d){26}\b", re.I)
EMAIL_RE = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I)
PHONE_RE = re.compile(r"(?<!\d)(?:\+48[\s-]?)?\d{3}[\s-]\d{3}[\s-]\d{3}(?!\d)")
ADDRESS_RE = re.compile(
    r"\b(?:ul\.?|al\.?|aleja|pl\.?|plac|os\.?|osiedle)\s+[A-ZĄĆĘŁŃÓŚŹŻ][\wĄĆĘŁŃÓŚŹŻąćęłńóśźż.-]*(?:\s+[A-ZĄĆĘŁŃÓŚŹŻ][\wĄĆĘŁŃÓŚŹŻąćęłńóśźż.-]*){0,4}\s+\d+[A-Za-z]?(?:/\d+[A-Za-z]?)?",
    re.I,
)

PII_PRIORITY = {
    "PESEL": 100,
    "NIP": 95,
    "REGON": 90,
    "IBAN": 85,
    "EMAIL": 80,
    "PHONE": 75,
    "PERSON": 70,
    "ADDRESS": 65,
    "CUSTOM": 50,
}


def _json_dumps(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def _validate_text(text: str) -> str:
    if not isinstance(text, str):
        raise ValueError("PRIVACY_TEXT_REQUIRED")
    if len(text) > MAX_TEXT_CHARS:
        raise ValueError("PRIVACY_TEXT_TOO_LARGE")
    return text


def _digits(value: str) -> str:
    return re.sub(r"\D", "", value)


def _valid_pesel(value: str) -> bool:
    raw = _digits(value)
    if not re.fullmatch(r"\d{11}", raw):
        return False
    weights = (1, 3, 7, 9, 1, 3, 7, 9, 1, 3)
    total = sum(weight * int(raw[index]) for index, weight in enumerate(weights))
    return (10 - total % 10) % 10 == int(raw[10])


def _valid_nip(value: str) -> bool:
    raw = _digits(value)
    if not re.fullmatch(r"\d{10}", raw):
        return False
    weights = (6, 5, 7, 2, 3, 4, 5, 6, 7)
    total = sum(weight * int(raw[index]) for index, weight in enumerate(weights))
    return total % 11 == int(raw[9])


def _collect_regex(text: str, regex: re.Pattern[str], kind: str, validator=None) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for match in regex.finditer(text):
        value = match.group(0)
        if validator and not validator(value):
            continue
        out.append({"start": match.start(), "end": match.end(), "kind": kind, "value": value, "source": "REGEX"})
    return out


def _dedupe_spans(spans: list[dict[str, Any]]) -> list[dict[str, Any]]:
    valid = [
        span for span in spans
        if isinstance(span.get("start"), int)
        and isinstance(span.get("end"), int)
        and 0 <= span["start"] < span["end"]
        and isinstance(span.get("value"), str)
        and isinstance(span.get("kind"), str)
    ]
    valid.sort(
        key=lambda span: (
            span["start"],
            -PII_PRIORITY.get(span["kind"], 0),
            -(span["end"] - span["start"]),
        )
    )
    accepted: list[dict[str, Any]] = []
    for candidate in valid:
        if any(candidate["start"] < current["end"] and candidate["end"] > current["start"] for current in accepted):
            continue
        accepted.append(candidate)
    return sorted(accepted, key=lambda span: span["start"])


class DATA_BLOB(ctypes.Structure):
    _fields_ = [
        ("cbData", wintypes.DWORD),
        ("pbData", ctypes.POINTER(ctypes.c_byte)),
    ]


def _blob(data: bytes) -> tuple[DATA_BLOB, Any]:
    buffer = ctypes.create_string_buffer(data)
    return DATA_BLOB(len(data), ctypes.cast(buffer, ctypes.POINTER(ctypes.c_byte))), buffer


def _dpapi_protect(data: bytes) -> bytes:
    if os.name != "nt":
        raise RuntimeError("PRIVACY_DPAPI_WINDOWS_REQUIRED")
    crypt32 = ctypes.windll.crypt32
    kernel32 = ctypes.windll.kernel32
    in_blob, backing = _blob(data)
    out_blob = DATA_BLOB()
    description = "LexMachina llama native privacy vault"
    if not crypt32.CryptProtectData(
        ctypes.byref(in_blob),
        description,
        None,
        None,
        None,
        0,
        ctypes.byref(out_blob),
    ):
        raise ctypes.WinError()
    try:
        return ctypes.string_at(out_blob.pbData, out_blob.cbData)
    finally:
        kernel32.LocalFree(out_blob.pbData)
        del backing


def _dpapi_unprotect(data: bytes) -> bytes:
    if os.name != "nt":
        raise RuntimeError("PRIVACY_DPAPI_WINDOWS_REQUIRED")
    crypt32 = ctypes.windll.crypt32
    kernel32 = ctypes.windll.kernel32
    in_blob, backing = _blob(data)
    out_blob = DATA_BLOB()
    description = ctypes.c_wchar_p()
    if not crypt32.CryptUnprotectData(
        ctypes.byref(in_blob),
        ctypes.byref(description),
        None,
        None,
        None,
        0,
        ctypes.byref(out_blob),
    ):
        raise ctypes.WinError()
    try:
        return ctypes.string_at(out_blob.pbData, out_blob.cbData)
    finally:
        kernel32.LocalFree(out_blob.pbData)
        if description:
            kernel32.LocalFree(description)
        del backing


class Morphology:
    def __init__(self) -> None:
        import morfeusz2
        self.engine = morfeusz2.Morfeusz()

    @staticmethod
    def _payload(item: Any) -> tuple[str, str, str]:
        # analyse(): (start, end, (orth, lemma, tag, common, qualifiers))
        # generate(): (orth, lemma, tag, common, qualifiers)
        if isinstance(item, (list, tuple)) and len(item) >= 3 and isinstance(item[2], (list, tuple)):
            payload = item[2]
        else:
            payload = item
        if not isinstance(payload, (list, tuple)) or len(payload) < 3:
            return "", "", ""
        return str(payload[0]), str(payload[1]), str(payload[2])

    @staticmethod
    def _tag_features(tag: str) -> set[str]:
        features: set[str] = set()
        for part in tag.split(":"):
            features.update(part.split("."))
        return features

    def canonical_parts(self, value: str) -> list[dict[str, str]]:
        parts: list[dict[str, str]] = []
        for raw in re.findall(r"[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż'-]+|[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż'-]+", value):
            if not re.search(r"[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]", raw):
                parts.append({"surface": raw, "lemma": raw, "tag": "interp"})
                continue
            candidates = []
            try:
                candidates = list(self.engine.analyse(raw))
            except Exception:
                candidates = []
            parsed = [self._payload(item) for item in candidates]
            parsed = [item for item in parsed if item[1]]
            preferred = None
            for item in parsed:
                features = self._tag_features(item[2])
                if item[2].startswith(("subst:", "adj:")) and ("sg" in features or "pl" in features):
                    preferred = item
                    break
            if preferred is None and parsed:
                preferred = parsed[0]
            if preferred is None:
                parts.append({"surface": raw, "lemma": raw, "tag": ""})
            else:
                parts.append({"surface": raw, "lemma": preferred[1], "tag": preferred[2]})
        return parts

    def canonical_person_key(self, value: str) -> str:
        pieces = self.canonical_parts(value)
        normalized = "".join(piece["lemma"] for piece in pieces)
        return re.sub(r"\s+", " ", normalized).strip().casefold()

    def inflect_person(self, parts: list[dict[str, str]], case: str, number: str = "sg") -> tuple[str, list[str]]:
        if case not in CASES:
            raise ValueError("PRIVACY_GRAMMATICAL_CASE_INVALID")
        if number not in NUMBERS:
            raise ValueError("PRIVACY_GRAMMATICAL_NUMBER_INVALID")
        if case == "nom":
            return "".join(piece["surface"] for piece in parts), []

        warnings: list[str] = []
        output: list[str] = []
        for piece in parts:
            surface = piece["surface"]
            lemma = piece["lemma"]
            source_tag = piece["tag"]
            if not re.search(r"[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]", surface):
                output.append(surface)
                continue
            if not lemma or source_tag == "interp":
                output.append(surface)
                warnings.append(f"NO_LEMMA:{surface}")
                continue

            source_features = self._tag_features(source_tag)
            generated: list[tuple[str, str, str]] = []
            try:
                generated = [self._payload(item) for item in self.engine.generate(lemma)]
            except Exception:
                generated = []
            generated = [item for item in generated if item[0] and case in self._tag_features(item[2])]

            same_number = [item for item in generated if number in self._tag_features(item[2])]
            if same_number:
                generated = same_number

            genders = [feature for feature in source_features if feature in {"m1", "m2", "m3", "f", "n"}]
            if genders:
                same_gender = [
                    item for item in generated
                    if any(gender in self._tag_features(item[2]) for gender in genders)
                ]
                if same_gender:
                    generated = same_gender

            same_class = [
                item for item in generated
                if item[2].split(":", 1)[0] == source_tag.split(":", 1)[0]
            ]
            if same_class:
                generated = same_class

            if generated:
                chosen = generated[0][0]
                if surface[:1].isupper():
                    chosen = chosen[:1].upper() + chosen[1:]
                output.append(chosen)
            else:
                output.append(surface)
                warnings.append(f"NO_FORM:{surface}:{case}:{number}")

        return "".join(output), warnings


class VaultStore:
    def __init__(self, root: Path, morphology: Morphology) -> None:
        self.root = root.resolve()
        self.root.mkdir(parents=True, exist_ok=True)
        self.morphology = morphology

    def _path(self, vault_id: str) -> Path:
        if not re.fullmatch(r"vault_[a-f0-9]{32}", vault_id):
            raise ValueError("PRIVACY_VAULT_ID_INVALID")
        return self.root / f"{vault_id}.dpapi"

    def create(self) -> dict[str, Any]:
        vault = {
            "schemaVersion": 1,
            "vaultId": "vault_" + uuid.uuid4().hex,
            "counters": {},
            "tokens": {},
            "keys": {},
        }
        self.save(vault)
        return vault

    def load(self, vault_id: str) -> dict[str, Any]:
        path = self._path(vault_id)
        if not path.is_file():
            raise ValueError("PRIVACY_VAULT_NOT_FOUND")
        raw = _dpapi_unprotect(path.read_bytes())
        payload = json.loads(raw.decode("utf-8"))
        if payload.get("schemaVersion") != 1 or payload.get("vaultId") != vault_id:
            raise ValueError("PRIVACY_VAULT_INVALID")
        return payload

    def save(self, vault: dict[str, Any]) -> None:
        path = self._path(str(vault["vaultId"]))
        plaintext = _json_dumps(vault).encode("utf-8")
        protected = _dpapi_protect(plaintext)
        temp = path.with_suffix(".partial")
        temp.write_bytes(protected)
        os.replace(temp, path)

    def token_for(self, vault: dict[str, Any], kind: str, value: str) -> str:
        if kind == "PERSON":
            parts = self.morphology.canonical_parts(value)
            key_value = self.morphology.canonical_person_key(value)
        else:
            parts = []
            key_value = value.strip().casefold()
        key = kind + "\0" + key_value
        existing = vault["keys"].get(key)
        if existing:
            return existing
        count = int(vault["counters"].get(kind, 0)) + 1
        vault["counters"][kind] = count
        token = f"[PII:{kind}:{count:04d}]"
        vault["keys"][key] = token
        vault["tokens"][token] = {
            "kind": kind,
            "value": value,
            "morphology": parts,
        }
        return token


class LocalDocumentMcp:
    def __init__(self, runtime_root: Path, vault_root: Path) -> None:
        self.runtime_root = runtime_root.resolve()
        self.python = self.runtime_root / "python" / "python.exe"
        self.ocr_worker = self.runtime_root / "ocr" / "paddle_worker.py"
        self.ner_worker = self.runtime_root / "privacy" / "stanza_ner_worker.py"
        self.paddle_models = self.runtime_root / "models" / "paddle" / "official_models"
        self.stanza_models = self.runtime_root / "models" / "stanza"
        for path, error in (
            (self.python, "LOCAL_DOCS_PYTHON_MISSING"),
            (self.ocr_worker, "LOCAL_DOCS_OCR_WORKER_MISSING"),
            (self.ner_worker, "LOCAL_DOCS_NER_WORKER_MISSING"),
        ):
            if not path.is_file():
                raise ValueError(f"{error}:{path}")
        if not self.paddle_models.is_dir():
            raise ValueError("LOCAL_DOCS_PADDLE_MODELS_MISSING")
        if not self.stanza_models.is_dir():
            raise ValueError("LOCAL_DOCS_STANZA_MODELS_MISSING")
        self.morphology = Morphology()
        self.vaults = VaultStore(vault_root, self.morphology)

    def _env(self) -> dict[str, str]:
        env = dict(os.environ)
        env["PYTHONUTF8"] = "1"
        env["LEX_PADDLE_MODEL_DIR"] = str(self.paddle_models)
        env["PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK"] = "True"
        env["STANZA_RESOURCES_DIR"] = str(self.stanza_models)
        return env

    def _run(self, args: list[str], timeout: int = 180) -> subprocess.CompletedProcess[str]:
        result = subprocess.run(
            [str(self.python), "-X", "utf8", *args],
            env=self._env(),
            cwd=str(self.runtime_root),
            stdin=subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout,
            check=False,
        )
        if result.returncode != 0:
            raise RuntimeError(
                f"LOCAL_DOCS_WORKER_FAILED:{result.returncode}:"
                + result.stderr[-2000:].replace("\r", " ").replace("\n", " ")
            )
        return result

    def _assert_file(self, value: str, extensions: set[str]) -> Path:
        path = Path(value).expanduser().resolve()
        if not path.is_file():
            raise ValueError(f"LOCAL_DOCS_FILE_MISSING:{path}")
        if path.stat().st_size > MAX_FILE_BYTES:
            raise ValueError("LOCAL_DOCS_FILE_TOO_LARGE")
        if path.suffix.lower() not in extensions:
            raise ValueError(f"LOCAL_DOCS_FILE_TYPE_UNSUPPORTED:{path.suffix}")
        return path

    def ocr_file(self, path_value: str, pages: str, dpi: int) -> str:
        path = self._assert_file(path_value, {".pdf", ".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"})
        dpi = max(72, min(int(dpi), 400))
        mode = "pdf" if path.suffix.lower() == ".pdf" else "image"

        if mode == "image":
            pages_arg = "1"
        else:
            if not pages or pages.strip().lower() == "all":
                import fitz
                with fitz.open(path) as doc:
                    pages_arg = ",".join(str(index + 1) for index in range(doc.page_count))
            else:
                raw = [part.strip() for part in pages.split(",") if part.strip()]
                numbers = sorted({int(item) for item in raw})
                if not numbers or any(number < 1 for number in numbers) or len(numbers) > 10_000:
                    raise ValueError("LOCAL_DOCS_OCR_PAGES_INVALID")
                pages_arg = ",".join(str(number) for number in numbers)

        with tempfile.TemporaryDirectory(prefix="llama-ocr-") as temp_dir:
            output = Path(temp_dir) / "ocr.json"
            self._run([
                str(self.ocr_worker),
                "--input", str(path),
                "--output", str(output),
                "--pages", pages_arg,
                "--dpi", str(dpi),
                "--mode", mode,
                "--device", "cpu",
            ], timeout=900)
            payload = json.loads(output.read_text(encoding="utf-8"))
        combined = "\n\n".join(
            f"--- PAGE {item.get('page')} ---\n{item.get('text', '')}"
            for item in payload
        )
        return _json_dumps({
            "status": "OK",
            "engine": "PaddleOCR PP-OCRv6_medium LOCAL",
            "sourcePath": str(path),
            "pages": payload,
            "text": combined,
        })

    def _ner_person_spans(self, text: str) -> list[dict[str, Any]]:
        if not text.strip():
            return []
        with tempfile.TemporaryDirectory(prefix="llama-ner-") as temp_dir:
            input_path = Path(temp_dir) / "input.txt"
            output_path = Path(temp_dir) / "ner.json"
            input_path.write_text(text, encoding="utf-8")
            self._run([
                str(self.ner_worker),
                "--input", str(input_path),
                "--output", str(output_path),
            ], timeout=300)
            raw = json.loads(output_path.read_text(encoding="utf-8"))
        spans: list[dict[str, Any]] = []
        for item in raw:
            start = item.get("start")
            end = item.get("end")
            value = item.get("value")
            if (
                isinstance(start, int)
                and isinstance(end, int)
                and isinstance(value, str)
                and text[start:end] == value
            ):
                spans.append({
                    "start": start,
                    "end": end,
                    "kind": "PERSON",
                    "value": value,
                    "source": "STANZA_LOCAL_NER",
                })
        return spans

    def anonymize(self, text: str, vault_id: str | None = None) -> str:
        text = _validate_text(text)
        vault = self.vaults.load(vault_id) if vault_id else self.vaults.create()

        spans = [
            *_collect_regex(text, PESEL_RE, "PESEL", _valid_pesel),
            *_collect_regex(text, NIP_RE, "NIP", _valid_nip),
            *_collect_regex(text, REGON_RE, "REGON"),
            *_collect_regex(text, IBAN_RE, "IBAN"),
            *_collect_regex(text, EMAIL_RE, "EMAIL"),
            *_collect_regex(text, PHONE_RE, "PHONE"),
            *_collect_regex(text, ADDRESS_RE, "ADDRESS"),
            *self._ner_person_spans(text),
        ]
        spans = _dedupe_spans(spans)

        output = text
        findings: list[dict[str, Any]] = []
        for span in reversed(spans):
            token = self.vaults.token_for(vault, span["kind"], span["value"])
            output = output[: span["start"]] + token + output[span["end"] :]
            findings.append({
                "token": token,
                "kind": span["kind"],
                "start": span["start"],
                "end": span["end"],
                "source": span["source"],
            })
        findings.reverse()
        self.vaults.save(vault)

        return _json_dumps({
            "status": "OK",
            "vaultId": vault["vaultId"],
            "text": output,
            "findingCount": len(findings),
            "findings": findings,
            "privacy": "RAW_VALUES_STORED_ONLY_IN_LOCAL_DPAPI_VAULT",
        })

    def _resolve_token(
        self,
        vault: dict[str, Any],
        token: str,
        case: str | None,
        number: str | None,
    ) -> tuple[str, list[str]]:
        item = vault["tokens"].get(token)
        if not isinstance(item, dict):
            raise ValueError(f"PRIVACY_TOKEN_UNKNOWN:{token}")
        value = str(item.get("value", ""))
        kind = str(item.get("kind", ""))
        if not case or case == "nom" or kind != "PERSON":
            return value, []
        parts = item.get("morphology")
        if not isinstance(parts, list):
            return value, [f"MORPHOLOGY_MISSING:{token}"]
        return self.morphology.inflect_person(parts, case, number or "sg")

    def deanonymize(self, text: str, vault_id: str, strict: bool) -> str:
        text = _validate_text(text)
        vault = self.vaults.load(vault_id)
        warnings: list[str] = []
        replaced = 0

        def replace(match: re.Match[str]) -> str:
            nonlocal replaced
            kind = match.group(1)
            sequence = match.group(2)
            case = match.group(3)
            number = match.group(4)
            token = f"[PII:{kind}:{sequence}]"
            resolved, local_warnings = self._resolve_token(vault, token, case, number)
            warnings.extend(local_warnings)
            replaced += 1
            return resolved

        result = GRAMMAR_TOKEN_RE.sub(replace, text)
        remaining = TOKEN_RE.findall(result)
        if remaining:
            if strict:
                raise ValueError(f"PRIVACY_UNRESOLVED_TOKENS:{len(remaining)}")
            warnings.append(f"UNRESOLVED_TOKENS:{len(remaining)}")
        if strict and warnings:
            raise ValueError("PRIVACY_MORPHOLOGY_UNRESOLVED:" + ";".join(warnings[:20]))

        return _json_dumps({
            "status": "OK" if not warnings else "OK_WITH_WARNINGS",
            "text": result,
            "replaced": replaced,
            "warnings": warnings,
            "grammarSyntax": "[PII:PERSON:0001]|case=gen is represented as {{[PII:PERSON:0001]|case=gen}} or [PII:PERSON:0001]|case=gen",
        })

    def inflect(self, vault_id: str, token: str, case: str, number: str) -> str:
        vault = self.vaults.load(vault_id)
        if not TOKEN_RE.fullmatch(token):
            raise ValueError("PRIVACY_TOKEN_INVALID")
        resolved, warnings = self._resolve_token(vault, token, case, number)
        return _json_dumps({
            "status": "OK" if not warnings else "OK_WITH_WARNINGS",
            "token": token,
            "case": case,
            "number": number,
            "surface": resolved,
            "warnings": warnings,
        })

    @staticmethod
    def _replace_xml_text_nodes(xml_bytes: bytes, vault: dict[str, Any], resolver) -> tuple[bytes, int, list[str]]:
        root = ET.fromstring(xml_bytes)
        replaced = 0
        warnings: list[str] = []
        for node in root.iter():
            if not node.text or "[PII:" not in node.text:
                continue

            def repl(match: re.Match[str]) -> str:
                nonlocal replaced
                token = f"[PII:{match.group(1)}:{match.group(2)}]"
                surface, local = resolver(vault, token, match.group(3), match.group(4))
                warnings.extend(local)
                replaced += 1
                return surface

            node.text = GRAMMAR_TOKEN_RE.sub(repl, node.text)
        return ET.tostring(root, encoding="utf-8", xml_declaration=True), replaced, warnings

    def finalize_file(self, input_path_value: str, output_path_value: str, vault_id: str, strict: bool) -> str:
        input_path = self._assert_file(input_path_value, {".txt", ".md", ".docx", ".odt"})
        output_path = Path(output_path_value).expanduser().resolve()
        if input_path == output_path:
            raise ValueError("PRIVACY_FINAL_OUTPUT_MUST_DIFFER_FROM_INPUT")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        vault = self.vaults.load(vault_id)

        if input_path.suffix.lower() in {".txt", ".md"}:
            result = json.loads(self.deanonymize(input_path.read_text(encoding="utf-8"), vault_id, strict))
            output_path.write_text(result["text"], encoding="utf-8")
            return _json_dumps({
                "status": result["status"],
                "outputPath": str(output_path),
                "replaced": result["replaced"],
                "warnings": result["warnings"],
                "sha256": hashlib.sha256(output_path.read_bytes()).hexdigest(),
            })

        temp_output = output_path.with_suffix(output_path.suffix + ".partial")
        warnings: list[str] = []
        replaced = 0
        with zipfile.ZipFile(input_path, "r") as src, zipfile.ZipFile(temp_output, "w") as dst:
            for info in src.infolist():
                data = src.read(info.filename)
                target_xml = (
                    input_path.suffix.lower() == ".docx" and info.filename == "word/document.xml"
                ) or (
                    input_path.suffix.lower() == ".odt" and info.filename == "content.xml"
                )
                if target_xml:
                    data, count, local_warnings = self._replace_xml_text_nodes(data, vault, self._resolve_token)
                    replaced += count
                    warnings.extend(local_warnings)
                dst.writestr(info, data)

        os.replace(temp_output, output_path)
        with zipfile.ZipFile(output_path, "r") as verify:
            target = "word/document.xml" if output_path.suffix.lower() == ".docx" else "content.xml"
            xml_text = verify.read(target).decode("utf-8", errors="replace")
            remaining = TOKEN_RE.findall(xml_text)
        if remaining and strict:
            output_path.unlink(missing_ok=True)
            raise ValueError(
                "PRIVACY_FINAL_DOCUMENT_UNRESOLVED_OR_SPLIT_PLACEHOLDERS:"
                + str(len(remaining))
            )
        if remaining:
            warnings.append(f"UNRESOLVED_OR_SPLIT_PLACEHOLDERS:{len(remaining)}")
        if strict and warnings:
            output_path.unlink(missing_ok=True)
            raise ValueError("PRIVACY_FINAL_DOCUMENT_MORPHOLOGY_UNRESOLVED:" + ";".join(warnings[:20]))

        return _json_dumps({
            "status": "OK" if not warnings else "OK_WITH_WARNINGS",
            "outputPath": str(output_path),
            "replaced": replaced,
            "warnings": warnings,
            "sha256": hashlib.sha256(output_path.read_bytes()).hexdigest(),
        })

    def ocr_anonymize(self, path: str, pages: str, dpi: int) -> str:
        ocr = json.loads(self.ocr_file(path, pages, dpi))
        anon = json.loads(self.anonymize(str(ocr["text"])))
        anon["ocr"] = {
            "engine": ocr["engine"],
            "sourcePath": ocr["sourcePath"],
            "pageCount": len(ocr["pages"]),
        }
        return _json_dumps(anon)


TOOLS = [
    {
        "name": "ocr_local_file",
        "description": (
            "Run local PaddleOCR PP-OCRv6_medium on a PDF/image without Lex Runtime. "
            "Use for scanned user documents. The file stays local; OCR models are local."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"},
                "pages": {"type": "string", "default": "all"},
                "dpi": {"type": "integer", "minimum": 72, "maximum": 400, "default": 220},
            },
            "required": ["path"],
            "additionalProperties": False,
        },
    },
    {
        "name": "privacy_anonymize_text",
        "description": (
            "Locally pseudonymize Polish text using deterministic identifiers plus local Stanza PERSON NER. "
            "Raw values are stored only in a Windows-DPAPI encrypted local vault. Returns tokens safe for model drafting."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "text": {"type": "string"},
                "vault_id": {"type": "string", "description": "Optional existing vault id for a continuing document/case."},
            },
            "required": ["text"],
            "additionalProperties": False,
        },
    },
    {
        "name": "privacy_ocr_anonymize_file",
        "description": (
            "Preferred first-line tool for a scanned sensitive document: local OCR followed immediately by local pseudonymization. "
            "Returns only anonymized text plus a local DPAPI vault id."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"},
                "pages": {"type": "string", "default": "all"},
                "dpi": {"type": "integer", "minimum": 72, "maximum": 400, "default": 220},
            },
            "required": ["path"],
            "additionalProperties": False,
        },
    },
    {
        "name": "privacy_inflect_token",
        "description": (
            "Resolve one private PERSON token locally into the requested Polish grammatical case using Morfeusz2. "
            "The model never receives the raw identity; only this tool sees the DPAPI vault."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "vault_id": {"type": "string"},
                "token": {"type": "string"},
                "case": {"type": "string", "enum": sorted(CASES)},
                "number": {"type": "string", "enum": sorted(NUMBERS), "default": "sg"},
            },
            "required": ["vault_id", "token", "case"],
            "additionalProperties": False,
        },
    },
    {
        "name": "privacy_deanonymize_text",
        "description": (
            "Locally restore a finished anonymized draft. For PERSON tokens use placeholders such as "
            "{{[PII:PERSON:0001]|case=gen}} so the private resolver inserts a grammatically inflected form. "
            "No raw identity is sent back to the model before this finalization step."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "text": {"type": "string"},
                "vault_id": {"type": "string"},
                "strict": {"type": "boolean", "default": True},
            },
            "required": ["text", "vault_id"],
            "additionalProperties": False,
        },
    },
    {
        "name": "privacy_finalize_document_file",
        "description": (
            "Finalize a local TXT/MD/DOCX/ODT file by replacing private PII placeholders from a DPAPI vault, "
            "including Polish grammatical inflection for PERSON placeholders. Writes a separate output file."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "input_path": {"type": "string"},
                "output_path": {"type": "string"},
                "vault_id": {"type": "string"},
                "strict": {"type": "boolean", "default": True},
            },
            "required": ["input_path", "output_path", "vault_id"],
            "additionalProperties": False,
        },
    },
]


def _response(request_id: Any, result: dict[str, Any] | None = None, error: dict[str, Any] | None = None) -> dict[str, Any]:
    payload: dict[str, Any] = {"jsonrpc": "2.0", "id": request_id}
    if error is not None:
        payload["error"] = error
    else:
        payload["result"] = result or {}
    return payload


def call_tool(runtime: LocalDocumentMcp, name: str, args: dict[str, Any]) -> str:
    if name == "ocr_local_file":
        return runtime.ocr_file(str(args.get("path", "")), str(args.get("pages", "all")), int(args.get("dpi", 220)))
    if name == "privacy_anonymize_text":
        vault_id = args.get("vault_id")
        return runtime.anonymize(str(args.get("text", "")), str(vault_id) if vault_id else None)
    if name == "privacy_ocr_anonymize_file":
        return runtime.ocr_anonymize(str(args.get("path", "")), str(args.get("pages", "all")), int(args.get("dpi", 220)))
    if name == "privacy_inflect_token":
        return runtime.inflect(
            str(args.get("vault_id", "")),
            str(args.get("token", "")),
            str(args.get("case", "")),
            str(args.get("number", "sg")),
        )
    if name == "privacy_deanonymize_text":
        return runtime.deanonymize(
            str(args.get("text", "")),
            str(args.get("vault_id", "")),
            bool(args.get("strict", True)),
        )
    if name == "privacy_finalize_document_file":
        return runtime.finalize_file(
            str(args.get("input_path", "")),
            str(args.get("output_path", "")),
            str(args.get("vault_id", "")),
            bool(args.get("strict", True)),
        )
    raise ValueError(f"LOCAL_DOCS_TOOL_UNKNOWN:{name}")


def serve(runtime: LocalDocumentMcp) -> int:
    for raw in sys.stdin:
        raw = raw.strip()
        if not raw:
            continue
        try:
            message = json.loads(raw)
        except json.JSONDecodeError:
            continue
        method = message.get("method")
        request_id = message.get("id")
        if method == "notifications/initialized":
            continue
        try:
            if method == "initialize":
                requested = str(message.get("params", {}).get("protocolVersion") or MCP_PROTOCOL_VERSION)
                reply = _response(
                    request_id,
                    result={
                        "protocolVersion": requested,
                        "capabilities": {"tools": {}},
                        "serverInfo": {"name": SERVER_NAME, "version": SERVER_VERSION},
                    },
                )
            elif method == "tools/list":
                reply = _response(request_id, result={"tools": TOOLS})
            elif method == "tools/call":
                params = message.get("params") or {}
                args = params.get("arguments") or {}
                if not isinstance(args, dict):
                    raise ValueError("LOCAL_DOCS_TOOL_ARGUMENTS_INVALID")
                output = call_tool(runtime, str(params.get("name", "")), args)
                reply = _response(
                    request_id,
                    result={"content": [{"type": "text", "text": output}], "isError": False},
                )
            else:
                reply = _response(request_id, error={"code": -32601, "message": f"Method not found: {method}"})
        except Exception as exc:
            if method == "tools/call":
                reply = _response(
                    request_id,
                    result={
                        "content": [{"type": "text", "text": f"LOCAL_DOCS_TOOL_ERROR:{type(exc).__name__}:{exc}"}],
                        "isError": True,
                    },
                )
            else:
                reply = _response(request_id, error={"code": -32603, "message": f"{type(exc).__name__}:{exc}"})
        sys.stdout.write(_json_dumps(reply) + "\n")
        sys.stdout.flush()
    return 0


def self_test(runtime_root: Path) -> int:
    morphology = Morphology()
    parts = morphology.canonical_parts("Jan Kowalski")
    if not parts:
        raise AssertionError("MORPHOLOGY_PARTS_EMPTY")
    genitive, warnings = morphology.inflect_person(parts, "gen", "sg")
    if not genitive.strip():
        raise AssertionError("MORPHOLOGY_GENERATION_EMPTY")
    if not any(tool["name"] == "privacy_deanonymize_text" for tool in TOOLS):
        raise AssertionError("PRIVACY_TOOLSET_INCOMPLETE")
    if not (runtime_root / "ocr" / "paddle_worker.py").is_file():
        raise AssertionError("OCR_WORKER_MISSING")
    if not (runtime_root / "privacy" / "stanza_ner_worker.py").is_file():
        raise AssertionError("NER_WORKER_MISSING")
    print("LLAMA_LOCAL_DOCUMENTS_MCP_SELFTEST_PASS:" + genitive + ":" + ",".join(warnings))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--runtime-root", required=True)
    parser.add_argument("--vault-root")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    runtime_root = Path(args.runtime_root).resolve()
    if args.self_test:
        return self_test(runtime_root)
    vault_root = Path(args.vault_root).resolve() if args.vault_root else Path(os.environ["LOCALAPPDATA"]) / "LexMachina" / "local-ai" / "privacy-vaults"
    runtime = LocalDocumentMcp(runtime_root, vault_root)
    return serve(runtime)


if __name__ == "__main__":
    raise SystemExit(main())
