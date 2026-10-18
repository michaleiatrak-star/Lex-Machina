"""Ramki: prostokąt osiowy (jak paddle_worker._box / PageScanView) vs wielokąt detekcji.
Dla każdej linii: ile pola prostokąta to pusty margines/inne linie, ile cudzych linii przykrywa.
Użycie: python frames.py out/<wariant>.json"""
import sys, json
import numpy as np
from shapely.geometry import Polygon, box
from shapely.validation import make_valid
d = json.load(open(sys.argv[1]))
tot = dict(lines=0, bad=0, waste=[], tilt=[])
for p in d:
    polys = []
    for l in p["lines"]:
        g = make_valid(Polygon(l["poly"])) if len(l["poly"]) >= 3 else None
        polys.append(g)
    rows = []
    for i, g in enumerate(polys):
        if g is None or g.area <= 0: continue
        b = box(*g.bounds)
        others = sum(1 for j, h in enumerate(polys) if j != i and h is not None and h.area > 0 and b.intersection(h).area / h.area > 0.25)
        waste = 1 - g.area / b.area
        pts = np.asarray(p["lines"][i]["poly"], float)
        h = (g.bounds[3] - g.bounds[1]); w = (g.bounds[2] - g.bounds[0])
        rows.append((others, waste))
        tot["lines"] += 1; tot["bad"] += others > 0; tot["waste"].append(waste)
    o = [r[0] for r in rows]
    print(f"s{p['page']}: linii {len(rows)}, prostokąt przykrywa >25% innej linii: {sum(x>0 for x in o)}, max {max(o) if o else 0} linii; pusty obszar prostokąta śr. {np.mean([r[1] for r in rows])*100:.0f}%")
print(f"RAZEM: {tot['bad']}/{tot['lines']} linii ({tot['bad']/tot['lines']*100:.0f}%) z ramką nachodzącą na inną linię; pusty obszar śr. {np.mean(tot['waste'])*100:.0f}%, p90 {np.percentile(tot['waste'],90)*100:.0f}%")
