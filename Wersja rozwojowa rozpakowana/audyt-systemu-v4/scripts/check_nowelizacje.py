#!/usr/bin/env python3
"""Nowelizacje po t.j. i zmiany z datą przyszłą dla modułów DR (metodyka W-2, W-4, W-5).

Dla modułu: akty z t.j. w nagłówku (30 wierszy, jak check_uchylone.py). Dla każdego t.j.
z ELI: akt bazowy, jego „Akty zmieniające” ogłoszone po stanie prawnym t.j.
(legalStatusDate) i data, od której każda zmiana działa wobec tego aktu.
Zgłasza:
  BRAK_NOWELIZACJI   nowelizacja po t.j. nieodnotowana w nagłówku modułu („RRRR/poz”)
  PRZEGLAD_STARY     nowelizacja ogłoszona po dacie „sprawdzone … RRRR-MM-DD” w nagłówku
  NOWY_TJ            jest nowszy t.j. niż w nagłówku (numer aktualizuje aktualizuj_tj.py)
  ZMIANA_WESZLA      znacznik „[OD RRRR-MM-DD: RRRR/poz]” z datą ≤ dziś: wdrożyć jako brzmienie
                     obowiązujące („w brzmieniu od RRRR-MM-DD”), dawne — jako „do RRRR-MM-DD”
  WESZLA_PO_PRZEGLADZIE  nowelizacja weszła w życie po dacie „sprawdzone …” modułu
  BRAK_NAGLOWKA_TJ   moduł bez rozpoznawalnego „t.j. Dz.U. RRRR poz. N” w nagłówku — nie da się go monitorować
  BEZ_ZNACZNIKA      nowelizacja z datą przyszłą odnotowana w nagłówku bez „[OD RRRR-MM-DD: RRRR/poz]”
Raport monitoringu (--raport) wypisuje też wszystkie zmiany wchodzące po dniu dzisiejszym.
Ani przepisów przejściowych, ani treści zmian skrypt nie ocenia: to krok W-4 (człowiek/model
z brzmieniem nowelizacji z ELI).

--rejestr PLIK: utrzymuje `prawo-polskie-v2/krajowe/shared/REJESTR-ZMIAN-W-CZASIE.md` —
tabela A (zmiany nadchodzące) generowana od nowa, tabela B (przepisy czasowe) bez wierszy
z datą „Do” wcześniejszą niż dziś (USUNIETY_PRZEPIS_CZASOWY) i z kontrolą, że nowelizacja
istnieje w ELI (PRZEPIS_CZASOWY_BEZ_AKTU); tabela C (odczyt W-4) — każda nowelizacja z tabeli A
ma wiersz (BRAK_W4), wiersze nowelizacji spoza A i bez wierszy w B są usuwane.

Kod wyjścia: 0 brak znalezisk, 1 znaleziska, 2 błąd ELI.
Użycie: check_nowelizacje.py --root "Wersja rozwojowa rozpakowana" [--skill dr-02-…]
        [--tylko-wskazania] [--raport plik.md] [pliki…]
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
import tempfile
import urllib.request
from pathlib import Path

# Bez zapisu .pyc: __pycache__ jest śledzony w repozytorium (fałszywe „zmiany” skilli).
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_uchylone import header_acts  # noqa: E402

API = "https://api.sejm.gov.pl/eli/acts"
CHECKED_RE = re.compile(r"sprawdzon\w*[^\n]{0,40}?(\d{4}-\d{2}-\d{2})", re.I)
CONVERTED = "Moduł wskazuje przepis"
MARK_RE = re.compile(r"\[OD (\d{4}-\d{2}-\d{2}): (\d{4})/(\d+)\]")  # format „wskazanie + kwalifikator”


def eli_json(act_id: str, cache: Path) -> dict:
    out = cache / (act_id.replace("/", "-") + ".json")
    if out.is_file() and (dt.datetime.now().timestamp() - out.stat().st_mtime) < 12 * 3600:
        return json.loads(out.read_text(encoding="utf-8"))
    with urllib.request.urlopen(f"{API}/{act_id}", timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    out.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    return data


def _gate():
    """Liczenie nowelizacji po t.j. z check_wyjatek_gate_eli.py (F-153/F-155: unia metody
    datowej i sekcji API) — jedno źródło reguły, jak w T24 check_nowelizacje_po_tj.py."""
    import importlib.util
    path = Path(__file__).resolve().parent / "check_wyjatek_gate_eli.py"
    spec = importlib.util.spec_from_file_location("wyjgate", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


GATE = None


def changes_after(tj_id: str, cache: Path) -> dict:
    """{'base','legal','newer_tj':[ids], 'changes':[(id, date_for_act, promulgation, title)]}"""
    global GATE
    GATE = GATE or _gate()
    tj = eli_json(tj_id, cache)
    refs = tj.get("references", {})
    base = next((r["id"] for r in refs.get("Tekst jednolity dla aktu", [])), None)
    # Próg: wcześniejsza z dat — stan prawny t.j. albo ogłoszenie (zmiana ogłoszona między nimi
    # nie jest w t.j.).
    legal = min(d for d in (tj.get("legalStatusDate"), tj.get("promulgation"), tj.get("announcementDate")) if d)
    out = {"base": base, "legal": legal, "newer_tj": [], "changes": []}
    if not base:
        return out
    b = eli_json(base, cache)
    brefs = b.get("references", {})
    for r in brefs.get("Inf. o tekście jednolitym", []):
        other = eli_json(r["id"], cache)
        if (other.get("legalStatusDate") or "") > (tj.get("legalStatusDate") or legal):
            out["newer_tj"].append(r["id"])
    # Unia (F-155) na danych /references obwieszczenia i aktu bazowego.
    tj_refs = eli_json(tj_id + "/references", cache)
    base_refs = eli_json(base + "/references", cache)
    merged = GATE.merge_amendments(GATE.amendments_after(base_refs, legal), GATE.amendments_from_api(tj_refs), base_refs)
    effective = {r["id"]: r.get("date") or "" for r in brefs.get("Akty zmieniające", [])}
    addr_to_eli = {}
    for it in (base_refs or {}).get("Akty zmieniające") or []:
        act = it.get("act") if isinstance(it, dict) and isinstance(it.get("act"), dict) else it
        if isinstance(act, dict) and act.get("ELI"):
            addr_to_eli[act.get("displayAddress") or act["ELI"]] = act["ELI"]
    for prom, addr, title, _src in merged:
        eli = addr_to_eli.get(addr, addr if str(addr).startswith("DU/") else None)
        if not eli:
            m = re.search(r"(\d{4}) poz\. (\d+)", str(addr))
            eli = f"DU/{m.group(1)}/{m.group(2)}" if m else str(addr)
        date = effective.get(eli) or eli_json(eli, cache).get("entryIntoForce") or ""
        out["changes"].append((eli, date, prom, title))
    out["changes"].sort(key=lambda c: c[1])
    return out


def update_registry(path: Path, upcoming: dict, scopes: dict, today: str, cache: Path, report) -> tuple[int, int]:
    """Tabela A od nowa; z tabeli B usuwa wiersze po terminie i sprawdza nowelizacje w ELI."""
    text = path.read_text(encoding="utf-8")
    start, end = "<!-- GENEROWANE:check_nowelizacje.py START -->", "<!-- GENEROWANE:check_nowelizacje.py KONIEC -->"
    rows = ["| Wchodzi | Nowelizacja | Akt (t.j.) | Zakres | Moduły |", "|---|---|---|---|---|"]
    for (date, cid, title, tj_id), mods in sorted(upcoming.items()):
        mods_s = ", ".join(sorted(m.split("/")[0].split("-prawo")[0] + "/" + Path(m).stem for m in mods))
        rows.append(f"| {date} | {short(cid)} — {title[:80]} | {short(tj_id)} | {'; '.join(sorted(scopes.get(cid, []))) or '—'} | {mods_s} |")
    if len(rows) == 2:
        rows.append("| — | brak zmian z datą przyszłą | | | |")
    i, j = text.index(start) + len(start), text.index(end)
    text = text[:i] + "\n" + "\n".join(rows) + "\n" + text[j:]
    found = errors = 0
    kept = []
    for line in text.splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")] if line.startswith("| 20") else None
        if cells and len(cells) == 6 and re.match(r"\d{4}/\d+ art", cells[0]):
            do = cells[4]
            if re.fullmatch(r"\d{4}-\d{2}-\d{2}", do) and do < today:
                report(f"USUNIETY_PRZEPIS_CZASOWY\t{cells[0]}\tdo {do}\t{cells[2][:100]}")
                continue
            year, pos = re.match(r"(\d{4})/(\d+)", cells[0]).groups()
            try:
                if not eli_json(f"DU/{year}/{pos}", cache).get("title"):
                    found += 1
                    report(f"PRZEPIS_CZASOWY_BEZ_AKTU\t{cells[0]}")
            except Exception as exc:
                errors += 1
                report(f"ELI_ERROR\tREJESTR\t{cells[0]}\t{exc}")
        kept.append(line)
    # Tabela C: odczyt W-4 dla każdej nowelizacji z tabeli A.
    pending = {short(cid) for (_, cid, _, _) in upcoming}
    in_b = {re.match(r"\| (\d{4}/\d+) art", l).group(1) for l in kept if re.match(r"\| \d{4}/\d+ art", l)}
    final, read = [], set()
    in_c = False
    for line in kept:
        if line.startswith("## C."):
            in_c = True
        elif line.startswith("## "):
            in_c = False
        m = re.match(r"\| (\d{4}/\d+) \| (\d{4}-\d{2}-\d{2}) \|", line) if in_c else None
        if m:
            if m.group(1) not in pending and m.group(1) not in in_b:
                report(f"USUNIETY_ODCZYT_W4\t{m.group(1)}")
                continue
            read.add(m.group(1))
        final.append(line)
    for tag in sorted(pending - read):
        found += 1
        report(f"BRAK_W4\t{tag}\tprzepisy przejściowe i daty wejścia nieodczytane (METODYKA W-4)")
    path.write_text("\n".join(final) + "\n", encoding="utf-8")
    return found, errors


def short(act_id: str) -> str:
    _, year, pos = act_id.split("/")
    return f"{year}/{pos}"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", type=Path, required=True)
    ap.add_argument("--skill", action="append", default=[])
    ap.add_argument("--tylko-wskazania", action="store_true", help="tylko moduły w formacie wskazanie + kwalifikator")
    ap.add_argument("--raport", type=Path)
    ap.add_argument("--rejestr", type=Path, help="REJESTR-ZMIAN-W-CZASIE.md do aktualizacji")
    ap.add_argument("--dzis", default=dt.date.today().isoformat())
    ap.add_argument("--cache", type=Path, default=Path(tempfile.gettempdir()) / "eli-json-cache")
    ap.add_argument("pliki", nargs="*", type=Path)
    args = ap.parse_args()
    args.cache.mkdir(parents=True, exist_ok=True)
    files = list(args.pliki)
    for skill in args.skill or ([] if files else [d.name for d in sorted(args.root.glob("dr-*"))]):
        files += sorted((args.root / skill / "modules").rglob("*.md"))

    found = errors = 0
    lines_out: list[str] = []

    def report(line: str) -> None:
        lines_out.append(line)
        print(line, flush=True)
    per_act: dict[str, dict] = {}
    upcoming: dict[tuple, set] = {}
    scopes: dict[str, set] = {}
    for path in files:
        text = path.read_text(encoding="utf-8")
        if args.tylko_wskazania and CONVERTED.lower() not in text[:3000].lower():
            continue
        head = "\n".join(text.splitlines()[:30])
        main_, abbr = header_acts(text.splitlines())
        acts = {main_} if main_ else set()
        acts |= set(abbr.values())
        # Także „Tekst jednolity: Dz.U. RRRR poz. N” (moduły sprzed formatu wskazań).
        for m in re.finditer(r"[Tt]ekst(?:u|em)? jednolit\w*\W{0,6}(?:Dz\.\s*U\.?\s*(?:z\s*)?)(\d{4})(?:\s*r\.)?\s*poz\.\s*(\d+)", head):
            acts.add((m.group(1), m.group(2)))
        if not acts:
            found += 1
            report(f"BRAK_NAGLOWKA_TJ\t{path.relative_to(args.root) if args.root in path.parents else path}")
            continue
        checked = CHECKED_RE.search(head)
        rel = path.relative_to(args.root) if args.root in path.parents else path
        for lineno, line in enumerate(text.splitlines(), 1):
            for m in MARK_RE.finditer(line):
                if m.group(1) <= args.dzis:
                    found += 1
                    report(f"ZMIANA_WESZLA\t{rel}:{lineno}\t{m.group(2)}/{m.group(3)} od {m.group(1)}\t{line.strip()[:140]}")
        for year, pos in sorted(a for a in acts if a):
            tj_id = f"DU/{year}/{pos}"
            try:
                if tj_id not in per_act:
                    per_act[tj_id] = changes_after(tj_id, args.cache)
            except Exception as exc:  # fail-closed
                report(f"ELI_ERROR\t{rel}\t{tj_id}\t{exc}")
                errors += 1
                continue
            info = per_act[tj_id]
            for newer in info["newer_tj"]:
                found += 1
                report(f"NOWY_TJ\t{rel}\t{tj_id} -> {newer}")
            for cid, date, prom, title in info["changes"]:
                tag = short(cid)
                year_c, pos_c = tag.split("/")
                mentioned = tag in head or re.search(rf"{year_c}\s*poz\.\s*{pos_c}\b", head)
                if not mentioned:
                    found += 1
                    report(f"BRAK_NOWELIZACJI\t{rel}\t{tj_id}\t{tag} od {date}\t{title[:110]}")
                elif checked and prom > checked.group(1):
                    found += 1
                    report(f"PRZEGLAD_STARY\t{rel}\t{tag} ogłoszona {prom} > sprawdzono {checked.group(1)}")
                elif checked and checked.group(1) < date <= args.dzis:
                    found += 1
                    report(f"WESZLA_PO_PRZEGLADZIE\t{rel}\t{tag} od {date} > sprawdzono {checked.group(1)}")
                elif date > args.dzis and not re.search(rf"\[OD {re.escape(date)}: {year_c}/{pos_c}\]", text):
                    found += 1
                    report(f"BEZ_ZNACZNIKA\t{rel}\t{tag} od {date}: brak [OD {date}: {tag}]")
                if date > args.dzis:
                    upcoming.setdefault((date, cid, title, tj_id), set()).add(str(rel))
                    for zm in re.finditer(rf"\[OD {re.escape(date)}: {year_c}/{pos_c}\]\**\s*—\s*([^;)\n|]+)", head):
                        scopes.setdefault(cid, set()).add(zm.group(1).replace("*", "").strip().rstrip("."))
    if args.rejestr:
        found_r, errors_r = update_registry(args.rejestr, upcoming, scopes, args.dzis, args.cache, report)
        found += found_r
        errors += errors_r
        print(f"REJESTR={args.rejestr} ZMIANY_NADCHODZACE={len(upcoming)}")
    print(f"PLIKI={len(files)} ZNALEZISKA={found} BLEDY_ELI={errors}")

    if args.raport:
        lines = [f"## Nadchodzące zmiany w aktach modułów DR (stan ELI {args.dzis})", ""]
        if upcoming:
            lines += ["| Wchodzi | Nowelizacja | Akt (t.j.) | Moduły |", "|---|---|---|---|"]
            for (date, cid, title, tj_id), mods in sorted(upcoming.items()):
                lines.append(f"| {date} | {short(cid)} — {title[:90]} | {short(tj_id)} | {', '.join(sorted(mods))} |")
        else:
            lines.append("Brak zmian z datą przyszłą.")
        if lines_out:
            lines += ["", "### Znaleziska", "", "```", *lines_out, "```"]
        lines += ["", f"Znaleziska kontroli: {found}, błędy ELI: {errors}. Procedura: "
                  "`audyt-systemu-v4/references/METODYKA-MODULY-DR.md` (W-1…W-7)."]
        args.raport.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return 2 if errors else (1 if found else 0)


if __name__ == "__main__":
    sys.exit(main())
