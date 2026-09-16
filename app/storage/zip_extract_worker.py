#!/usr/bin/env python3
import argparse
import hashlib
import json
import mimetypes
import os
import re
import stat
import zipfile
from pathlib import Path, PurePosixPath

MAX_ENTRIES = 10_000
MAX_ENTRY_BYTES = 512 * 1024 * 1024
MAX_TOTAL_BYTES = 2 * 1024 * 1024 * 1024
MAX_PATH_CHARS = 512
MAX_DEPTH = 32
MAX_RATIO = 1000.0

def fail(message: str) -> None:
    raise RuntimeError(message)

def normalized_member(name: str) -> str:
    if not name or "\x00" in name:
        fail("ZIP_INVALID_MEMBER_NAME")
    candidate = name.replace("\\", "/")
    if (
        candidate.startswith("/")
        or candidate.startswith("//")
        or re.match(r"^[A-Za-z]:", candidate)
    ):
        fail("ZIP_ABSOLUTE_PATH")
    parts = PurePosixPath(candidate).parts
    if not parts or len(parts) > MAX_DEPTH:
        fail("ZIP_PATH_DEPTH_EXCEEDED")
    if any(part in ("", ".", "..") for part in parts):
        fail("ZIP_PATH_TRAVERSAL")
    normalized = "/".join(parts)
    if len(normalized) > MAX_PATH_CHARS:
        fail("ZIP_PATH_TOO_LONG")
    return normalized

def entry_kind(info: zipfile.ZipInfo) -> str:
    mode = (info.external_attr >> 16) & 0xFFFF
    file_type = stat.S_IFMT(mode)
    if info.is_dir():
        return "directory"
    if file_type == stat.S_IFLNK:
        fail("ZIP_SYMLINK_FORBIDDEN")
    if file_type not in (0, stat.S_IFREG):
        fail("ZIP_SPECIAL_FILE_FORBIDDEN")
    return "file"

def extract_archive(input_path: Path, output_dir: Path) -> list[dict]:
    entries: list[dict] = []
    seen: set[str] = set()
    total = 0

    with zipfile.ZipFile(input_path, "r") as archive:
        infos = archive.infolist()
        if len(infos) > MAX_ENTRIES:
            fail("ZIP_TOO_MANY_ENTRIES")

        for info in infos:
            if info.flag_bits & 0x1:
                fail("ZIP_ENCRYPTED_ENTRY_FORBIDDEN")
            relative = normalized_member(info.filename)
            key = relative.casefold()
            if key in seen:
                fail("ZIP_DUPLICATE_PATH")
            seen.add(key)

            kind = entry_kind(info)
            if kind == "directory":
                (output_dir / relative).mkdir(
                    parents=True,
                    exist_ok=True
                )
                continue

            if info.file_size < 0 or info.file_size > MAX_ENTRY_BYTES:
                fail("ZIP_ENTRY_TOO_LARGE")
            total += info.file_size
            if total > MAX_TOTAL_BYTES:
                fail("ZIP_TOTAL_TOO_LARGE")

            if info.file_size > 0:
                if info.compress_size <= 0:
                    fail("ZIP_SUSPICIOUS_COMPRESSION")
                ratio = info.file_size / info.compress_size
                if ratio > MAX_RATIO:
                    fail("ZIP_SUSPICIOUS_COMPRESSION")

            target = output_dir / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            if target.exists():
                fail("ZIP_OUTPUT_COLLISION")

            digest = hashlib.sha256()
            written = 0
            with archive.open(info, "r") as source, open(target, "xb") as dest:
                while True:
                    chunk = source.read(1024 * 1024)
                    if not chunk:
                        break
                    written += len(chunk)
                    if written > MAX_ENTRY_BYTES:
                        fail("ZIP_ENTRY_STREAM_LIMIT")
                    digest.update(chunk)
                    dest.write(chunk)

            if written != info.file_size:
                fail("ZIP_ENTRY_SIZE_MISMATCH")

            media_type, _ = mimetypes.guess_type(relative)
            ext = Path(relative).suffix.lower()
            processable = ext in {
                ".pdf", ".jpg", ".jpeg", ".png",
                ".webp", ".tif", ".tiff"
            }
            entries.append({
                "relativePath": relative,
                "compressedBytes": info.compress_size,
                "uncompressedBytes": info.file_size,
                "sha256": digest.hexdigest(),
                "mediaType": media_type,
                "processable": processable,
            })

    return entries

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--manifest", required=True)
    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    output_dir = Path(args.output_dir).resolve()
    manifest_path = Path(args.manifest).resolve()

    output_dir.mkdir(parents=True, exist_ok=False)
    entries = extract_archive(input_path, output_dir)
    manifest_path.write_text(
        json.dumps(
            {"entries": entries},
            ensure_ascii=False,
            indent=2
        ),
        encoding="utf-8"
    )

if __name__ == "__main__":
    main()
