"""Złamanie linii na zgięciu: dla każdej linii z detekcji wielokątnej (poly, bez UVDoc) linia środkowa,
najlepsze dopasowanie dwóch odcinków prostych (punkt złamania) -> kąt złamania, ugięcie (px / wysokość linii),
pole prostokąta obróconego (quad) zajęte przez tekst. Linia 'utrzymana' przez wariant X, gdy jej tekst
jest w tekście strony X (partial_ratio >= 80).
Użycie: python folds.py out/poly.json app_default,app_unwarp,q_slow"""
import sys, json, math
import numpy as np, cv2
from shapely.geometry import Polygon, LineString
from shapely.validation import make_valid
from rapidfuzz import fuzz
d = json.load(open(sys.argv[1])); others = sys.argv[2].split(",")
def centerline(poly):
    g = make_valid(Polygon(poly)); x0, y0, x1, y1 = g.bounds; pts = []
    for x in np.linspace(x0 + 2, x1 - 2, 40):
        s = g.intersection(LineString([(x, y0 - 5), (x, y1 + 5)]))
        if s.is_empty: continue
        pts.append((x, (s.bounds[1] + s.bounds[3]) / 2, s.bounds[3] - s.bounds[1]))
    return np.array(pts), g
def angle(a): return math.degrees(math.atan(a))
rows = []
for p in d:
    texts = {o: open(f"out/{o}_p{p['page']}.txt").read() for o in others}
    for l in p["lines"]:
        if len(l["text"]) < 12: continue
        c, g = centerline(l["poly"])
        if len(c) < 8: continue
        x, y, h = c[:, 0], c[:, 1], np.median(c[:, 2])
        best = (1e9, None)
        for k in range(3, len(c) - 3):
            a1 = np.polyfit(x[:k], y[:k], 1); a2 = np.polyfit(x[k:], y[k:], 1)
            err = np.sum((np.polyval(a1, x[:k]) - y[:k]) ** 2) + np.sum((np.polyval(a2, x[k:]) - y[k:]) ** 2)
            if err < best[0]: best = (err, (k, a1, a2))
        k, a1, a2 = best[1]
        kink = abs(angle(a1[0]) - angle(a2[0]))
        lin = np.polyfit(x, y, 1); bow = np.max(np.abs(np.polyval(lin, x) - y)) / max(h, 1)
        rect = cv2.minAreaRect(np.asarray(l["poly"], np.float32)); fill = g.area / max(rect[1][0] * rect[1][1], 1)
        kept = {o: fuzz.partial_ratio(l["text"], texts[o]) >= 80 for o in others}
        rows.append(dict(page=p["page"], text=l["text"][:50], kink=round(kink, 1), bow=round(bow, 2), fill=round(fill, 2),
                         bx=round(float(x[k]) / p["w"], 2), **kept))
json.dump(rows, open("out/folds.json", "w"), ensure_ascii=False, indent=0)
def show(name, sel):
    s = [r for r in rows if sel(r)]
    if not s: return
    print(f"{name:34s} n={len(s):3d} " + " ".join(f"{o}:{sum(r[o] for r in s)/len(s)*100:3.0f}%" for o in others) +
          f"  fill śr.{np.mean([r['fill'] for r in s]):.2f}")
print("odsetek linii utrzymanych przez wariant:")
show("wszystkie", lambda r: True)
show("prosta (złamanie <1°, ugięcie <0.3h)", lambda r: r["kink"] < 1 and r["bow"] < 0.3)
show("złamanie 1-3°", lambda r: 1 <= r["kink"] < 3)
show("złamanie >=3°", lambda r: r["kink"] >= 3)
show("ugięcie >=0.5 wys. linii", lambda r: r["bow"] >= 0.5)
show("ugięcie >=1 wys. linii", lambda r: r["bow"] >= 1)
for pg in sorted({r["page"] for r in rows}):
    s = [r for r in rows if r["page"] == pg and r["kink"] >= 1]
    if s: print(f"s{pg}: złamań>=1°: {len(s)}, położenie złamania (x/szer.) mediana {np.median([r['bx'] for r in s]):.2f}, kąt mediana {np.median([r['kink'] for r in s]):.1f}°, max {max(r['kink'] for r in s)}°")
