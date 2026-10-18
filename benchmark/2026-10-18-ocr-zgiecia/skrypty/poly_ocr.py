"""Warianty ramek PP-OCRv6 na tych samych modelach co paddle_worker.py (CPU, bez oneDNN).
box=quad|poly (prostokąt obrócony vs wielokąt wzdłuż linii), score=fast|slow (pewność liczona w prostokącie
vs w konturze), unwarp=0|1 (UVDoc). Wycinek: quad -> minAreaRect, poly -> prostowanie po wielokącie.
Użycie: PAGES=1,2 python poly_ocr.py <nazwa> <unwarp> <box> <score> [box_thresh]"""
import os, sys, json, time
import numpy as np, fitz
from paddleocr import TextDetection, TextRecognition, TextImageUnwarping
from paddlex.inference.pipelines.components import CropByPolys, SortQuadBoxes, SortPolyBoxes
name, unwarp, box, score = sys.argv[1], sys.argv[2] == "1", sys.argv[3], sys.argv[4]
bthr = float(sys.argv[5]) if len(sys.argv) > 5 else 0.6
M = "/root/.paddlex/official_models/"
kw = dict(enable_mkldnn=False)
det = TextDetection(model_name="PP-OCRv6_medium_det", model_dir=M + "PP-OCRv6_medium_det", limit_side_len=64, limit_type="min",
                    thresh=0.3, box_thresh=bthr, unclip_ratio=1.5, **kw)
post = det.paddlex_predictor.post_op
post.box_type, post.score_mode = box, score
rec = TextRecognition(model_name="PP-OCRv6_medium_rec", model_dir=M + "PP-OCRv6_medium_rec", **kw)
uv = TextImageUnwarping(model_name="UVDoc", model_dir=M + "UVDoc", **kw) if unwarp else None
crop = CropByPolys(det_box_type=box)
sort = SortPolyBoxes() if box == "poly" else SortQuadBoxes()
doc = fitz.open(os.environ.get("PDF", "doc/in.pdf")); t = time.time(); out = []
pages = [int(x) for x in os.environ.get("PAGES", ",".join(str(k + 1) for k in range(doc.page_count))).split(",")]
for n in pages:
    pix = doc[n - 1].get_pixmap(dpi=220, alpha=False)
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)[:, :, :3].copy()  # RGB jak w paddle_worker.py
    if uv is not None:
        u = np.asarray(list(uv.predict(img))[0]["doctr_img"])
        img = np.ascontiguousarray(u if u.dtype == np.uint8 else np.clip(u, 0, 255).astype(np.uint8))
    polys = list(det.predict(img))[0]["dt_polys"]
    polys = sort(polys) if len(polys) else polys
    crops = crop(img, polys)
    lines = []
    for p, c in zip(polys, crops):
        r = list(rec.predict(c))[0]
        lines.append({"text": r["rec_text"].strip(), "score": float(r["rec_score"]), "poly": np.asarray(p).reshape(-1, 2).tolist()})
    lines = [l for l in lines if l["text"]]
    open(f"out/{name}_p{n}.txt", "w").write("\n".join(l["text"] for l in lines))
    out.append({"page": n, "w": img.shape[1], "h": img.shape[0], "lines": lines})
    print(name, "page", n, len(polys), len(lines), round(time.time() - t), flush=True)
json.dump(out, open(f"out/{name}.json", "w"), ensure_ascii=False)
print(name, "done", round(time.time() - t, 1))
