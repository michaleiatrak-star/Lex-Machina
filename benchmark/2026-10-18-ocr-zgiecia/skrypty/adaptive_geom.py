import numpy as np, cv2
from shapely.geometry import Polygon, LineString
from shapely.validation import make_valid

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

