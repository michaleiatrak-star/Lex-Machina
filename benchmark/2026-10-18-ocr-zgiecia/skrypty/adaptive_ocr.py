"""Wariant adaptacyjny: ramka dopasowana do linii.
1. Detekcja PP-OCRv6 z wielokątem (box_type=poly) i pewnością liczoną w konturze (score_mode=slow):
   złamana linia nie jest odrzucana za puste tło w prostokącie.
2. Dla każdej linii: linia środkowa i grubość z wielokąta. Złamanie/ugięcie wykrywane z geometrii:
   wysokość obróconego prostokąta > 1.35 x grubość linii albo odchylenie linii środkowej od prostej > 0.35 grubości.
3. Linia prosta: wycinek jak dotąd (minAreaRect). Linia złamana: prostowanie paskiem wzdłuż linii środkowej (cv2.remap),
   każda kolumna wycinka pobierana z wysokości linii w tym miejscu.
Użycie: PAGES=.. python adaptive_ocr.py <nazwa> <unwarp 0|1>"""
import os, sys, json, time
import numpy as np, pymupdf as fitz, cv2
from shapely.geometry import Polygon, LineString
from shapely.validation import make_valid
from paddleocr import TextDetection, TextRecognition, TextImageUnwarping
from paddlex.inference.pipelines.components import CropByPolys, SortPolyBoxes
name, unwarp = sys.argv[1], sys.argv[2] == "1"
M = "/root/.paddlex/official_models/"
det = TextDetection(model_name="PP-OCRv6_medium_det", model_dir=M + "PP-OCRv6_medium_det", enable_mkldnn=False,
                    limit_side_len=64, limit_type="min", thresh=0.3, box_thresh=0.6, unclip_ratio=1.5)
det.paddlex_predictor.post_op.box_type = "poly"; det.paddlex_predictor.post_op.score_mode = "slow"
rec = TextRecognition(model_name="PP-OCRv6_medium_rec", model_dir=M + "PP-OCRv6_medium_rec", enable_mkldnn=False)
uv = TextImageUnwarping(model_name="UVDoc", model_dir=M + "UVDoc", enable_mkldnn=False) if unwarp else None
quad = CropByPolys("quad")

def geometry(poly):
    g = make_valid(Polygon(poly)); x0, y0, x1, y1 = g.bounds; pts = []
    for x in np.arange(x0 + 1, x1 - 1, 4.0):
        s = g.intersection(LineString([(x, y0 - 5), (x, y1 + 5)]))
        if s.is_empty: continue
        pts.append((x, s.bounds[1], s.bounds[3]))
    return np.array(pts)

def strip(img, pts, thick):
    x = pts[:, 0]; yc = (pts[:, 1] + pts[:, 2]) / 2
    k = max(3, int(len(yc) / 25) | 1)  # wygładzenie linii środkowej
    yc = np.convolve(np.pad(yc, k // 2, mode="edge"), np.ones(k) / k, mode="valid")
    # długość łuku: kolumny wycinka rozłożone równomiernie wzdłuż linii
    seg = np.hypot(np.diff(x), np.diff(yc)); s = np.concatenate([[0], np.cumsum(seg)])
    W = int(s[-1]); H = int(round(thick * 1.25)); u = np.arange(W)
    cx = np.interp(u, s, x); cy = np.interp(u, s, yc)
    dy = np.gradient(cy); dx = np.gradient(cx); n = np.hypot(dx, dy); nx, ny = -dy / n, dx / n
    v = np.arange(H) - H / 2
    mapx = (cx[None, :] + v[:, None] * nx[None, :]).astype(np.float32)
    mapy = (cy[None, :] + v[:, None] * ny[None, :]).astype(np.float32)
    pad = int(H * 0.3)
    out = cv2.remap(img, mapx, mapy, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return cv2.copyMakeBorder(out, 0, 0, pad, pad, cv2.BORDER_REPLICATE)

doc = fitz.open(os.environ.get("PDF", "doc/in.pdf")); t = time.time(); out = []; stats = dict(lines=0, bent=0)
pages = [int(x) for x in os.environ.get("PAGES", ",".join(str(k + 1) for k in range(doc.page_count))).split(",")]
for n in pages:
    pix = doc[n - 1].get_pixmap(dpi=220, alpha=False)
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)[:, :, :3].copy()
    if uv is not None:
        u_ = np.asarray(list(uv.predict(img))[0]["doctr_img"]); img = np.ascontiguousarray(u_.astype(np.uint8))
    polys = list(det.predict(img))[0]["dt_polys"]
    polys = SortPolyBoxes()(polys) if len(polys) else polys
    lines = []
    for p in polys:
        p = np.asarray(p, np.float32).reshape(-1, 2)
        pts = geometry(p)
        if len(pts) < 4: continue
        thick = float(np.median(pts[:, 2] - pts[:, 1]))
        rect_h = min(cv2.minAreaRect(p)[1])
        yc = (pts[:, 1] + pts[:, 2]) / 2; lin = np.polyfit(pts[:, 0], yc, 1)
        bow = float(np.max(np.abs(np.polyval(lin, pts[:, 0]) - yc))) / max(thick, 1)
        bent = rect_h > 1.35 * thick or bow > 0.35
        crop = strip(img, pts, thick) if bent else quad(img, [cv2.boxPoints(cv2.minAreaRect(p))])[0]
        r = list(rec.predict(crop))[0]
        text = r["rec_text"].strip(); stats["lines"] += 1; stats["bent"] += bent
        if text:
            lines.append({"text": text, "score": float(r["rec_score"]), "bent": bool(bent), "bow": round(bow, 2),
                          "rect_over_thick": round(rect_h / max(thick, 1), 2), "poly": p.tolist()})
    open(f"out/{name}_p{n}.txt", "w").write("\n".join(l["text"] for l in lines))
    out.append({"page": n, "w": img.shape[1], "h": img.shape[0], "lines": lines})
    print(name, "page", n, len(polys), len(lines), "bent", sum(l["bent"] for l in lines), round(time.time() - t), flush=True)
json.dump(out, open(f"out/{name}.json", "w"), ensure_ascii=False)
print(name, "done", stats, round(time.time() - t, 1))
