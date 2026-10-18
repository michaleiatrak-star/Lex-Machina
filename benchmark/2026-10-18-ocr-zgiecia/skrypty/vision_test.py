"""Model wizyjny aplikacji (Qwen2.5-VL 7B Q4_K_M, llama-server, prompt z ocr-vision.ts) na liniach złamanych przez zgięcie.
Dla każdej linii dwa wycinki: jak aplikacja (paddle_worker._line_crop: 4 punkty prostokąta, perspektywa)
i pasek prostowany po linii środkowej (adaptive_ocr.strip). Porównanie z linią wzorcową (najbliższy fragment gt).
Użycie: python vision_test.py out/adapt.json <port> <limit>"""
import sys, json, base64, io, time, urllib.request, importlib.util
import numpy as np, pymupdf as fitz, cv2
from PIL import Image
from rapidfuzz import fuzz, process
spec = importlib.util.spec_from_file_location("w", "/home/user/michaleiatrak-star/lex-machina-aplikacja/app/ocr/paddle_worker.py")
sys.modules["paddleocr"] = type(sys)("paddleocr"); sys.modules["paddleocr"].PaddleOCR = None
w = importlib.util.module_from_spec(spec); spec.loader.exec_module(w)
sys.argv_ = sys.argv
spec2 = importlib.util.spec_from_file_location("a", __file__.replace("vision_test.py", "adaptive_geom.py"))
g = importlib.util.module_from_spec(spec2); spec2.loader.exec_module(g)
PROMPT = ("Obrazek to jedna linia polskiego dokumentu prawnego (skan lub zdjęcie). Program OCR odczytał ją tak: «{ocr}». "
          "Odczyt może mieć błędne litery, brak polskich znaków lub zbędne słowa. Przepisz tę linię dokładnie tak, jak jest napisana "
          "na obrazku, z polskimi znakami, liczbami i interpunkcją. Nie poprawiaj autora, nie dodawaj komentarzy. Gdy linii nie da się "
          "odczytać, zwróć odczyt OCR bez zmian. Zwróć wyłącznie tekst linii.")
d = json.load(open(sys.argv[1])); port = sys.argv[2]; limit = int(sys.argv[3]); HINT = sys.argv[4] if len(sys.argv) > 4 else "ocr"  # ocr | empty
doc = fitz.open("doc/in.pdf")
gt = {p: [l for l in open(f"gt/p{p}.txt").read().splitlines() if len(l) > 20] for p in range(1, 6)}
def jpeg(a):
    b = io.BytesIO(); im = Image.fromarray(a).convert("L")
    if im.height > 64: im = im.resize((max(1, round(im.width * 64 / im.height)), 64), Image.LANCZOS)
    im.save(b, format="JPEG", quality=85); return base64.b64encode(b.getvalue()).decode()
def ask(img64, ocr):
    body = json.dumps({"messages": [{"role": "user", "content": [{"type": "image_url", "image_url": {"url": "data:image/jpeg;base64," + img64}},
            {"type": "text", "text": PROMPT.replace("{ocr}", ocr)}]}], "temperature": 0, "max_tokens": 200}).encode()
    r = urllib.request.urlopen(urllib.request.Request(f"http://127.0.0.1:{port}/v1/chat/completions", body, {"Content-Type": "application/json"}), timeout=1800)
    return json.loads(r.read())["choices"][0]["message"]["content"].strip().strip("«»\"„”")
rows = []; t = time.time()
cands = [(p, l) for p in d for l in p["lines"] if l["bent"] and len(l["text"]) > 30]
step = max(1, len(cands) // limit)
for p, l in cands[1::step][:limit] if HINT == "empty" else cands[::step][:limit]:
    pix = doc[p["page"] - 1].get_pixmap(dpi=220, alpha=False)
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, 3).copy()
    poly = np.asarray(l["poly"], np.float32)
    app_crop = base64.b64decode(w._line_crop(img, cv2.boxPoints(cv2.minAreaRect(poly))))
    app_arr = np.array(Image.open(io.BytesIO(app_crop)).convert("RGB"))
    pts = g.geometry(poly); thick = float(np.median(pts[:, 2] - pts[:, 1]))
    strip = g.strip(img, pts, thick)
    ref = process.extractOne(l["text"], gt[p["page"]], scorer=fuzz.ratio)[0]
    hint = l["text"] if HINT == "ocr" else ""
    va = ask(jpeg(app_arr), hint); vs = ask(jpeg(strip), hint)
    row = dict(page=p["page"], gt=ref, ocr=l["text"], vision_app_crop=va, vision_strip=vs,
               r_ocr=round(fuzz.ratio(l["text"], ref)), r_app=round(fuzz.ratio(va, ref)), r_strip=round(fuzz.ratio(vs, ref)))
    rows.append(row); print(json.dumps(row, ensure_ascii=False), round(time.time() - t), flush=True)
json.dump(rows, open(f"out/vision_test_{HINT}.json", "w"), ensure_ascii=False, indent=1)
print("śr. zgodność z wzorcem: OCR adaptacyjny", np.mean([r["r_ocr"] for r in rows]), "| VLM na wycinku aplikacji", np.mean([r["r_app"] for r in rows]),
      "| VLM na pasku prostowanym", np.mean([r["r_strip"] for r in rows]))
