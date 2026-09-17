import json
import os
import sys
from pathlib import Path

# The NSIS bootstrap runs under Windows PowerShell 5.1 with
# $ErrorActionPreference="Stop". Paddle/PaddleX and download helpers emit normal
# progress and informational messages on native stderr; PowerShell 5.1 can wrap
# those records as terminating NativeCommandError values even when Python is
# otherwise healthy. Route fd 2 to stdout so the Python process exit code stays
# the single source of truth for success/failure and NSIS still captures the
# diagnostic stream.
try:
    sys.stderr.flush()
    os.dup2(sys.stdout.fileno(), sys.stderr.fileno())
except (AttributeError, OSError):
    sys.stderr = sys.stdout

# Keep installer diagnostics bounded; model-host progress is not release
# evidence and can otherwise consume the fixed-size NSIS ExecToStack buffer.
os.environ.setdefault("HF_HUB_DISABLE_PROGRESS_BARS", "1")
os.environ.setdefault("TQDM_DISABLE", "1")

root = Path(sys.argv[1]).resolve()
paddle_root = root / "paddle"
stanza_root = root / "stanza"
paddle_root.mkdir(parents=True, exist_ok=True)
stanza_root.mkdir(parents=True, exist_ok=True)

os.environ["PADDLE_PDX_CACHE_HOME"] = str(paddle_root)
os.environ["PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK"] = "True"

from paddleocr import PaddleOCR
import stanza

try:
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
except Exception as exc:
    print(f"MODEL_PREFETCH_FAILED:{type(exc).__name__}:{exc}")
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
    raise SystemExit("Missing prefetched Paddle models: " + ", ".join(missing))
if not (stanza_root / "resources.json").is_file():
    raise SystemExit("Missing Stanza resources.json")
if not (stanza_root / "pl").is_dir():
    raise SystemExit("Missing Stanza Polish models")

print(json.dumps({
    "paddleModels": required,
    "stanza": "pl:tokenize,ner",
    "status": "PASS"
}, ensure_ascii=False))
