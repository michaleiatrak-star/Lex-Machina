#!/usr/bin/env python3
"""Monitoring projektów ustaw w toku (Sejm) i lista zmian od ostatniej aktualizacji systemu.

Baza zmian dla modułów i map:
  prawo-polskie-v2/krajowe/shared/PROJEKTY-W-TOKU.md        projekty ustaw w toku i uchwalone, nieogłoszone
  prawo-polskie-v2/krajowe/shared/ZMIANY-OD-AKTUALIZACJI.md  zdarzenia od daty ostatniej aktualizacji systemu
                                                             (projekty: nowy, nowy etap, uchwalony, ogłoszony;
                                                             Dz.U.: nowelizacje ogłoszone po tej dacie) — z aktami,
                                                             dziedzinami i modułami do zmiany
  prawo-polskie-v2/krajowe/shared/STAN-AKTUALIZACJI.json     data ostatniej aktualizacji + stan procesów z tej chwili

Projekt nie jest źródłem brzmienia: w odpowiedzi tylko „projekt w toku (druk N, etap)”. Po ogłoszeniu
(pole ELI procesu) zmianę przejmuje monitoring ogłoszonych nowelizacji (check_nowelizacje.py, W-4).

Akty zmieniane: z tytułu projektu dopasowane do KATALOG-TJ (nazwy aktów z ELI). Projekt „o zmianie niektórych
ustaw” albo nowa ustawa bez dopasowania → „do przeglądu” (wykaz zmienianych ustaw jest w treści druku).

Użycie:
  python3 check_procedowane.py --root "Wersja rozwojowa rozpakowana" [--zapisz]
  python3 check_procedowane.py --root ... --zatwierdz [RRRR-MM-DD]   # zmiany wprowadzone: nowa data i stan
"""
import argparse
import datetime as dt
import json
import os
import re
import sys
import time
import urllib.request

API = "https://api.sejm.gov.pl/sejm"
ELI = "https://api.sejm.gov.pl/eli/acts"
SHARED = ("prawo-polskie-v2", "krajowe", "shared")
START, KONIEC = "<!-- procedowane:start -->", "<!-- procedowane:koniec -->"


def get(url, cache_dir=None, ttl=12 * 3600):
    path = None
    if cache_dir:
        os.makedirs(cache_dir, exist_ok=True)
        path = os.path.join(cache_dir, re.sub(r"[^A-Za-z0-9]+", "-", url.split("//", 1)[1]) + ".json")
        if os.path.exists(path) and time.time() - os.path.getmtime(path) < ttl:
            with open(path, encoding="utf-8") as fh:
                return json.load(fh)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(url, timeout=120) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            break
        except Exception:
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))
    if path:
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(data, fh, ensure_ascii=False)
    return data


def norm(text):
    text = (text or "").lower().replace(" ", " ")
    text = re.sub(r"[–—-]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def table_rows(path):
    if not os.path.exists(path):
        return []
    rows = []
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            if line.startswith("| ") and not line.startswith("| Akt |") and "---" not in line[:6]:
                rows.append([c.strip() for c in line.strip().strip("|").split("|")])
    return rows


def acts_index(root):
    """Akty z KATALOG-TJ: nazwa do dopasowania, t.j., dziedziny, moduły."""
    acts = {}
    shared = os.path.join(root, *SHARED, "KATALOG-TJ.md")
    for cells in table_rows(shared):
        if len(cells) < 3:
            continue
        label, text, domains = cells[0], cells[1], cells[2]
        if re.match(r"^(Rozporządzenie|Obwieszczenie|Dekret|Zarządzenie|Uchwała)\b", label):
            continue  # projekty ustaw zmieniają ustawy
        m = re.search(r"Dz\.U\. (\d{4}) poz\. (\d+)", text)
        if not m:
            continue
        name = label.split(" — ", 1)[1] if " — " in label else label
        abbr = label.split(" — ", 1)[0] if " — " in label else ""
        key = f"{m.group(1)}/{m.group(2)}"
        acts[key] = {"name": name, "abbr": abbr, "norm": norm(name), "tj": key, "domains": [d.strip() for d in domains.split(",") if d.strip()], "modules": []}
    for dr in sorted(os.listdir(root)):
        for cells in table_rows(os.path.join(root, dr, "KATALOG-TJ.md")):
            if len(cells) < 3:
                continue
            m = re.search(r"Dz\.U\. (\d{4}) poz\. (\d+)", cells[1])
            if m and f"{m.group(1)}/{m.group(2)}" in acts and cells[2] not in ("—", ""):
                act = acts[f"{m.group(1)}/{m.group(2)}"]
                act["modules"] += [x.strip() for x in cells[2].split(",") if x.strip() not in act["modules"]]
    return acts


def amended_acts(title, acts):
    """Akty, których nazwa występuje w tytule projektu; dłuższa nazwa wygrywa z zawartą w niej krótszą."""
    t = norm(title)
    hits = [a for a in acts.values() if len(a["norm"]) >= 10 and re.search(r"(?<![a-ząćęłńóśźż])" + re.escape(a["norm"]) + r"(?![a-ząćęłńóśźż])", t)]
    hits.sort(key=lambda a: -len(a["norm"]))
    chosen = []
    for a in hits:
        if not any(a["norm"] in b["norm"] for b in chosen):
            chosen.append(a)
    return chosen


def last_stage(process):
    """Najpóźniejszy etap; etap podrzędny z nazwą etapu nadrzędnego („Stanowisko Senatu › Skierowanie”)."""
    best = ("", "")
    def walk(stages, parent=""):
        nonlocal best
        for s in stages or []:
            date = s.get("date") or ""
            name = s.get("stageName") or ""
            label = f"{parent} › {name}" if parent else name
            if date >= best[0]:
                best = (date, label)
            walk(s.get("children"), name)
    walk(process.get("stages"))
    return best


def bill_type(title):
    m = re.match(r"^(\w+)\s+projekt ustawy", title or "")
    return m.group(1) if m else ""


def short_title(title):
    return re.sub(r"^\w+\s+projekt ustawy\s+", "", title or "").strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", required=True)
    ap.add_argument("--cache", default=os.environ.get("PROCEDOWANE_CACHE", "/tmp/sejm-cache"))
    ap.add_argument("--zapisz", action="store_true")
    ap.add_argument("--zatwierdz", nargs="?", const=dt.date.today().isoformat())
    args = ap.parse_args()
    root = os.path.abspath(args.root)
    shared = os.path.join(root, *SHARED)
    state_file = os.path.join(shared, "STAN-AKTUALIZACJI.json")
    state = {"ostatnia_aktualizacja": "2026-11-14", "kadencja": None, "procesy": {}}
    if os.path.exists(state_file):
        with open(state_file, encoding="utf-8") as fh:
            state.update(json.load(fh))

    terms = get(f"{API}/term", args.cache)
    term = next((t["num"] for t in terms if t.get("current")), max(t["num"] for t in terms))
    processes = []
    offset = 0
    while True:
        page = get(f"{API}/term{term}/processes?limit=500&offset={offset}", args.cache, ttl=3 * 3600)
        processes += page
        if len(page) < 500:
            break
        offset += 500
    bills = [p for p in processes if "projekt ustawy" in (p.get("documentType") or "")]
    acts = acts_index(root)

    current = {}
    rows = []
    for p in bills:
        num = str(p.get("number"))
        detail = get(f"{API}/term{term}/processes/{num}", args.cache, ttl=(3 * 3600 if not p.get("ELI") else 30 * 86400))
        date, stage = last_stage(detail)
        eli = detail.get("ELI") or p.get("ELI")
        status = "OGŁOSZONA" if eli else ("UCHWALONA" if detail.get("passed") or p.get("passed") else "W TOKU")
        found = amended_acts(p.get("title", ""), acts)
        current[num] = {"etap": stage, "data": date, "status": status, "eli": eli}
        rows.append({"num": num, "title": p.get("title", ""), "found": found, "date": date, "stage": stage, "status": status, "eli": eli,
                     "url": f"https://www.sejm.gov.pl/Sejm{term}.nsf/PrzebiegProc.xsp?nr={num}"})

    def acts_cell(r):
        if r["found"]:
            return "; ".join(f"{(a['abbr'] + ' — ') if a['abbr'] else ''}{a['name']} (t.j. Dz.U. {a['tj'].replace('/', ' poz. ')})" for a in r["found"])
        return "do przeglądu: wykaz zmienianych ustaw w treści druku" if "zmianie" in norm(r["title"]) else "nowa ustawa — przypisz dziedzinę"

    def where_cell(r):
        doms = sorted({d for a in r["found"] for d in a["domains"]})
        mods = sorted({m for a in r["found"] for m in a["modules"]})
        return (", ".join(doms) or "—") + (": " + ", ".join(mods[:8]) + (" …" if len(mods) > 8 else "") if mods else "")

    def line(r):
        typ = bill_type(r["title"])
        return (f"| [druk {r['num']}]({r['url']}) | {typ + ' — ' if typ else ''}{short_title(r['title'])[:200]} | {acts_cell(r)} | "
                f"{r['stage']} ({r['date'] or '—'}) | {where_cell(r)} | {r['status']}{' ' + r['eli'] if r['eli'] else ''} |")

    head = "| Proces | Projekt | Zmienia (akt, t.j.) | Ostatni etap (data) | Dziedziny: moduły | Status |\n|---|---|---|---|---|---|"
    open_rows = sorted([r for r in rows if r["status"] != "OGŁOSZONA"], key=lambda r: r["date"], reverse=True)
    projekty = "\n".join([
        "# PROJEKTY-W-TOKU — projekty ustaw w Sejmie (monitoring)", "",
        START, "",
        f"Generowane przez `audyt-systemu-v4/scripts/check_procedowane.py` z API Sejmu (kadencja {term}). "
        "Projekt to informacja o kierunku zmian, nie brzmienie przepisu: w odpowiedzi tylko „projekt w toku (druk N, etap)”. "
        "Po ogłoszeniu zmianę przejmuje monitoring nowelizacji (REJESTR-ZMIAN-W-CZASIE.md, W-4).", "",
        f"## Projekty w toku i uchwalone, nieogłoszone ({len(open_rows)})", "", head,
        *[line(r) for r in open_rows], "", KONIEC, ""])

    # Zdarzenia od ostatniej aktualizacji: różnica stanu procesów względem zapisanego (bez stanu: etap od tej daty).
    since = state["ostatnia_aktualizacja"]
    before = state.get("procesy") or {}
    events = []
    for r in rows:
        old = before.get(r["num"])
        if old is None and before:
            what = "nowy projekt" if r["status"] == "W TOKU" else r["status"].lower()
        elif old is None:
            what = "zmiana etapu" if r["date"] >= since else None
        elif old.get("status") != r["status"]:
            what = {"UCHWALONA": "uchwalona przez Sejm", "OGŁOSZONA": "ogłoszona (ELI) — do monitoringu nowelizacji"}.get(r["status"], r["status"].lower())
        elif (old.get("etap"), old.get("data")) != (r["stage"], r["date"]):
            what = "nowy etap"
        else:
            what = None
        if what:
            events.append((r["date"], f"| {r['date'] or '—'} | {what} | [druk {r['num']}]({r['url']}) {short_title(r['title'])[:150]} | {acts_cell(r)} | {where_cell(r)} | {r['stage']} |"))
    # Dz.U.: nowelizacje z rejestru zmian ogłoszone po dacie ostatniej aktualizacji.
    rejestr = os.path.join(shared, "REJESTR-ZMIAN-W-CZASIE.md")
    dzu = []
    if os.path.exists(rejestr):
        seen = set()
        with open(rejestr, encoding="utf-8") as fh:
            for row in fh:
                m = re.match(r"^\| (\d{4}-\d{2}-\d{2}) \| (\d{4}/\d+) — ([^|]+)\| (\d{4}/\d+) \| ([^|]*)\| ([^|]*)\|", row)
                if not m or m.group(2) in seen:
                    continue
                seen.add(m.group(2))
                try:
                    act = get(f"{ELI}/DU/{m.group(2)}", args.cache, ttl=30 * 86400)
                except Exception:
                    continue
                prom = act.get("promulgation") or act.get("announcementDate") or ""
                if prom and prom > since:
                    mods = ", ".join(sorted({x.strip().split("/")[-1] for x in m.group(6).split(",") if x.strip()})[:8])
                    dzu.append((prom, f"| {prom} | ogłoszona nowelizacja (wchodzi {m.group(1)}) | Dz.U. {m.group(2).replace('/', ' poz. ')} — {m.group(3).strip()[:120]} | t.j. {m.group(4)} | {mods or '—'} | W-4: REJESTR-ZMIAN-W-CZASIE C |"))
    zmiany = "\n".join([
        "# ZMIANY-OD-AKTUALIZACJI — lista robocza zmian w modułach i mapach", "",
        START, "",
        f"Ostatnia aktualizacja systemu: **{since}**. Zdarzenia po tej dacie: projekty ustaw (Sejm) i nowelizacje ogłoszone w Dz.U. "
        "Każde zdarzenie wskazuje akt, dziedziny i moduły do przejrzenia. Po wprowadzeniu zmian: "
        "`check_procedowane.py --zatwierdz` (nowa data i stan procesów).", "",
        f"## Nowelizacje ogłoszone w Dz.U. ({len(dzu)})", "",
        "| Ogłoszono | Zdarzenie | Akt zmieniający | Zmienia (t.j.) | Moduły | Odczyt |", "|---|---|---|---|---|---|",
        *[x for _, x in sorted(dzu, reverse=True)], "",
        f"## Projekty ustaw ({len(events)})", "",
        "| Data | Zdarzenie | Projekt | Zmienia (akt, t.j.) | Dziedziny: moduły | Etap |", "|---|---|---|---|---|---|",
        *[x for _, x in sorted(events, reverse=True)], "", KONIEC, ""])

    print(f"KADENCJA={term} PROJEKTY={len(bills)} W_TOKU={sum(1 for r in rows if r['status'] == 'W TOKU')} "
          f"UCHWALONE={sum(1 for r in rows if r['status'] == 'UCHWALONA')} BEZ_AKTU={sum(1 for r in open_rows if not r['found'])} "
          f"ZDARZENIA_PROJEKTY={len(events)} ZDARZENIA_DZU={len(dzu)} OD={since}")
    if args.zapisz and not args.zatwierdz:
        for name, body in (("PROJEKTY-W-TOKU.md", projekty), ("ZMIANY-OD-AKTUALIZACJI.md", zmiany)):
            with open(os.path.join(shared, name), "w", encoding="utf-8") as fh:
                fh.write(body)
    if args.zatwierdz:
        state = {"ostatnia_aktualizacja": args.zatwierdz, "kadencja": term, "procesy": current}
        with open(state_file, "w", encoding="utf-8") as fh:
            json.dump(state, fh, ensure_ascii=False, indent=1, sort_keys=True)
        print(f"ZATWIERDZONO {args.zatwierdz}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
