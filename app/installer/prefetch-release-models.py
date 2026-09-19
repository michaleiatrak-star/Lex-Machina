from __future__ import annotations

import json
import os
from pathlib import Path
import sys


def paddle_native_path(path: Path) -> str:
    """Return an ASCII filesystem alias for Paddle's native Windows predictor.

    Paddle's C++ inference layer still opens model artifacts through narrow
    filesystem APIs on Windows. Python itself handles Unicode paths correctly,
    but the native predictor can fail on a profile/install path containing
    characters such as ł. Preserve the real files in place and give Paddle the
    NTFS 8.3 alias only when the resolved path is non-ASCII.
    """
    resolved = str(path.resolve())
    if os.name != "nt" or resolved.isascii():
        return resolved

    import ctypes

    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    get_short = kernel32.GetShortPathNameW
    get_short.argtypes = [
        ctypes.c_wchar_p,
        ctypes.c_wchar_p,
        ctypes.c_uint32,
    ]
    get_short.restype = ctypes.c_uint32

    needed = get_short(resolved, None, 0)
    if needed == 0:
        raise RuntimeError(
            "PADDLE_ASCII_PATH_UNAVAILABLE:"
            f"{resolved}:winerr={ctypes.get_last_error()}"
        )

    buffer = ctypes.create_unicode_buffer(needed + 1)
    written = get_short(resolved, buffer, len(buffer))
    short = buffer.value
    if written == 0 or not short or not short.isascii():
        raise RuntimeError(
            "PADDLE_ASCII_PATH_UNAVAILABLE:"
            f"{resolved}:short={short!r}:winerr={ctypes.get_last_error()}"
        )
    return short


root = Path(sys.argv[1]).resolve()
paddle_root = root / "paddle"
stanza_root = root / "stanza"
paddle_root.mkdir(parents=True, exist_ok=True)
stanza_root.mkdir(parents=True, exist_ok=True)

paddle_native_root = paddle_native_path(paddle_root)
os.environ["PADDLE_PDX_CACHE_HOME"] = paddle_native_root
os.environ["PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK"] = "True"
model_source = os.environ.get("PADDLE_PDX_MODEL_SOURCE", "bos").strip().lower() or "bos"
if model_source not in {"bos", "huggingface", "modelscope", "aistudio"}:
    print(f"MODEL_PREFETCH_SOURCE_INVALID:{model_source}", file=sys.stderr)
    raise SystemExit(2)
os.environ["PADDLE_PDX_MODEL_SOURCE"] = model_source
os.environ.setdefault("HF_HUB_DISABLE_PROGRESS_BARS", "1")
os.environ.setdefault("TQDM_DISABLE", "1")

# The installed-copy bootstrap runs under Windows PowerShell 5.1 and NSIS
# nsExec::ExecToStack. Paddle/PaddleX/Stanza can emit a large amount of normal
# progress and informational output on both native stdout and stderr. Passing
# that stream through ExecToStack is neither release evidence nor a reliable
# error channel. Capture both native file descriptors to a local log and expose
# only a bounded summary after Python has completed. The Python exit code remains
# the authoritative success/failure signal.
log_path = root / "model-prefetch.log"
original_stdout = os.dup(sys.stdout.fileno())
original_stderr = os.dup(sys.stderr.fileno())
prefetch_error: BaseException | None = None

try:
    with log_path.open("w", encoding="utf-8", errors="replace") as log:
        sys.stdout.flush()
        sys.stderr.flush()
        os.dup2(log.fileno(), sys.stdout.fileno())
        os.dup2(log.fileno(), sys.stderr.fileno())
        try:
            from paddleocr import PaddleOCR
            import stanza

            ocr = PaddleOCR(
                lang="pl",
                ocr_version="PP-OCRv6",
                use_doc_orientation_classify=True,
                use_doc_unwarping=True,
                use_textline_orientation=True,
                enable_mkldnn=False,
                device="cpu",
            )
            del ocr

            stanza.download(
                "pl",
                model_dir=str(stanza_root),
                processors="tokenize,ner",
                verbose=False,
            )
        except BaseException as exc:
            prefetch_error = exc
        finally:
            sys.stdout.flush()
            sys.stderr.flush()
finally:
    os.dup2(original_stdout, sys.stdout.fileno())
    os.dup2(original_stderr, sys.stderr.fileno())
    os.close(original_stdout)
    os.close(original_stderr)

if prefetch_error is not None:
    print(
        f"MODEL_PREFETCH_FAILED:source={model_source}:{type(prefetch_error).__name__}:{prefetch_error}",
        file=sys.stderr,
    )
    try:
        tail_lines = log_path.read_text(encoding="utf-8", errors="replace").splitlines()[-12:]
        if tail_lines:
            tail = " | ".join(tail_lines)
            print("MODEL_PREFETCH_LOG_TAIL:" + tail[:6000], file=sys.stderr)
    except OSError as log_error:
        print(f"MODEL_PREFETCH_LOG_READ_FAILED:{log_error}", file=sys.stderr)
    raise SystemExit(1)

official = paddle_root / "official_models"
required = [
    "PP-LCNet_x1_0_doc_ori",
    "UVDoc",
    "PP-LCNet_x1_0_textline_ori",
    "PP-OCRv6_medium_det",
    "PP-OCRv6_medium_rec",
]
missing = [name for name in required if not (official / name).is_dir()]
if missing:
    print("MODEL_PREFETCH_INCOMPLETE:" + ",".join(missing), file=sys.stderr)
    raise SystemExit(1)
if not (stanza_root / "resources.json").is_file():
    print("MODEL_PREFETCH_STANZA_RESOURCES_MISSING", file=sys.stderr)
    raise SystemExit(1)
if not (stanza_root / "pl").is_dir():
    print("MODEL_PREFETCH_STANZA_PL_MISSING", file=sys.stderr)
    raise SystemExit(1)

print(
    json.dumps(
        {
            "paddleModels": required,
            "stanza": "pl:tokenize,ner",
            "status": "PASS",
            "source": model_source,
            "paddleNativePath": paddle_native_root,
        },
        ensure_ascii=False,
    )
)
