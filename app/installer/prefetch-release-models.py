import json
import os
import sys
from pathlib import Path

root = Path(sys.argv[1]).resolve()
paddle_root = root / "paddle"
stanza_root = root / "stanza"
paddle_root.mkdir(parents=True, exist_ok=True)
stanza_root.mkdir(parents=True, exist_ok=True)

os.environ["PADDLE_PDX_CACHE_HOME"] = str(paddle_root)
os.environ["PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK"] = "True"

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
