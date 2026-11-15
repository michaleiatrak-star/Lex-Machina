#!/usr/bin/env python3
"""Mapy aktów w jednej konwencji t.j. — źródłem są nagłówki **Akt:** modułów DR.

Konwencja (moduł, MAPA-AKTOW, LEGAL-REGISTRY):
  Dz.U. RRRR poz. N t.j.                      najnowszy tekst jednolity z ELI
  Dz.U. RRRR poz. N (akt pierwotny, bez t.j.) akt bez tekstu jednolitego
  ; zm. po t.j.: RRRR/N od RRRR-MM-DD, RRRR/N [OD RRRR-MM-DD: RRRR/N]

Co robi:
  1. dr-XX/MAPA-AKTOW.md — sekcja „Akty z nagłówków modułów (RAG)”: każdy akt z nagłówków
     modułów skilla, którego nie ma w tabelach routingu mapy. Tabela bez kolumny „Moduł”:
     indeks core-law ją czyta (akt + dziedzina), routing modułów (act-map-resolver,
     domain-module-map) nie — wiersze routingu zostają bez zmian.
  2. Kolumna Dz.U. w tabelach routingu: dopisuje „ t.j.” po numerze, który jest najnowszym t.j.
  3. prawo-polskie-v2/krajowe/shared/LEGAL-REGISTRY.md — sekcja „Teksty jednolite systemu”:
     wszystkie akty z nagłówków DR-01…DR-15 z dziedzinami.

Użycie:
  python3 scripts/mapy_tj.py --sprawdz   # kod 1, gdy mapa nie jest zgodna z nagłówkami
  python3 scripts/mapy_tj.py --zapisz
"""
import argparse
import glob
import json
import os
import re
import sys
import urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "Wersja rozwojowa rozpakowana")
CACHE = os.environ.get("MAPY_TJ_CACHE", "/tmp/nowel-cache")
PAUZA = "DR-16"  # wstrzymany — poza zakresem
START = "<!-- mapy_tj:start -->"
KONIEC = "<!-- mapy_tj:koniec -->"
REF = re.compile(r"Dz\.\s?U\.\s?(?:z\s)?((?:19|20)\d\d)\s?(?:r\.\s?,?\s?)?(?:[Nn]r\s?\d+\s?,?\s)?poz\.\s?(\d+)")
ZM = re.compile(r"(\d{4}/\d+)\s+(?:od\s+(\d{4}-\d{2}-\d{2})|\[OD\s+(\d{4}-\d{2}-\d{2}):\s*\d{4}/\d+\])")


def eli(act_id):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, act_id.replace("/", "-") + ".json")
    if os.path.exists(path):
        try:
            with open(path, encoding="utf-8") as fh:
                return json.load(fh)
        except Exception:
            pass
    with urllib.request.urlopen(f"https://api.sejm.gov.pl/eli/acts/{act_id}", timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False)
    return data


def key(act_id):
    _, y, p = act_id.split("/")
    return (int(y), int(p))


def base_of(y, p):
    """(akt bazowy, najnowszy t.j. albo None, tytuł) dla Dz.U. y/p."""
    d = eli(f"DU/{y}/{p}")
    refs = d.get("references", {})
    base_ids = [x["id"] for x in refs.get("Tekst jednolity dla aktu", [])]
    base = eli(base_ids[0]) if base_ids else d
    tjs = sorted((x["id"] for x in base.get("references", {}).get("Inf. o tekście jednolitym", [])), key=key, reverse=True)
    return base["ELI"], (tjs[0] if tjs else None), base.get("title", ""), base.get("status", "")


def skill_label(skill_dir):
    m = re.match(r"dr-(\d\d)", os.path.basename(skill_dir))
    return f"DR-{m.group(1)}" if m else os.path.basename(skill_dir)


def header_acts(skill_dir):
    """{akt bazowy: {abbr, tj, zm, moduly, tytul}} z nagłówków **Akt:** modułów (bez części)."""
    acts = {}
    for path in sorted(glob.glob(os.path.join(skill_dir, "modules", "*.md"))):
        name = os.path.basename(path)[:-3]
        with open(path, encoding="utf-8") as fh:
            head = fh.read().split("\n")[:40]
        for line in head:
            if not line.startswith("**Akt:**"):
                continue
            main = line.split("(zm.")[0]
            refs = REF.findall(main)
            if not refs:
                continue
            y, p = refs[-1]
            try:
                base, tj, title, status = base_of(y, p)
            except Exception as exc:  # brak ELI — pomiń, raport niżej
                print(f"ELI_ERROR\t{path}\t{y}/{p}\t{exc}", file=sys.stderr)
                continue
            abbr = re.match(r"\*\*Akt:\*\*\s*([^\s(—]+)", line)
            if abbr and not re.search(r"[A-ZŁŚŻ]", abbr.group(1)):
                abbr = None
            zm_part = line[line.find("(zm."):] if "(zm." in line else ""
            zm = []
            for tag, od, od_przysz in ZM.findall(zm_part):
                zm.append((tag, od or od_przysz, bool(od_przysz)))
            entry = acts.setdefault(base, {"abbr": abbr.group(1) if abbr else "", "tj": tj, "zm": [], "moduly": [], "tytul": title, "status": status})
            if name not in entry["moduly"]:
                entry["moduly"].append(name)
            for z in zm:
                if z not in entry["zm"]:
                    entry["zm"].append(z)
    return acts


def tekst(entry, base):
    if entry["tj"]:
        _, y, p = entry["tj"].split("/")
        cell = f"Dz.U. {y} poz. {p} t.j."
    else:
        _, y, p = base.split("/")
        cell = f"Dz.U. {y} poz. {p} (akt pierwotny, bez t.j.)"
    if entry["zm"]:
        zm = sorted(entry["zm"], key=lambda z: (z[1], key("DU/" + z[0])))
        cell += "; zm. po t.j.: " + ", ".join(f"{t} [OD {d}: {t}]" if f else f"{t} od {d}" for t, d, f in zm)
    return cell


def etykieta(e):
    # A title broken over lines in ELI would break the Markdown table row.
    title = " ".join((e["tytul"] or "").split())
    issuer = re.match(r"^((?:Rozporządzenie|Obwieszczenie|Dekret|Zarządzenie|Uchwała)\b.*?) z dnia ", title)
    name = title_short(title)
    if not e["abbr"] and issuer:
        return f"{issuer.group(1)} — {name}"
    return f"{e['abbr']} — {name}" if e["abbr"] else name[:1].upper() + name[1:]


def title_short(title):
    m = re.search(r"r\.\s*[-–]?\s*(.*)$", title)
    return (m.group(1) if m else title).strip().rstrip(". ")


def routing_bases(text):
    """Akty bazowe w tabelach routingu mapy (z kolumną „Moduł”)."""
    found = set()
    module_col = -1
    for line in text.split("\n"):
        if START in line:
            break
        if not line.strip().startswith("|"):
            module_col = -1
            continue
        cells = [c.strip() for c in line.split("|")[1:-1]]
        if any(re.match(r"^Moduł", c) for c in cells):
            module_col = 1
            continue
        if module_col < 0:
            continue
        for y, p in REF.findall(line):
            try:
                found.add(base_of(y, p)[0])
            except Exception:
                pass
    return found


def add_tj_suffix(text):
    """W tabelach routingu: „Dz.U. RRRR poz. N” będący najnowszym t.j. → „… t.j.”."""
    out = []
    for line in text.split("\n"):
        if line.strip().startswith("|") and START not in line:
            def fix(m):
                y, p = m.group(1), m.group(2)
                after = line[m.end():m.end() + 6]
                if re.match(r"\s*t\.\s?j\.", after):
                    return m.group(0)
                try:
                    _, tj, _, _ = base_of(y, p)
                except Exception:
                    return m.group(0)
                return m.group(0) + " t.j." if tj == f"DU/{y}/{p}" else m.group(0)
            line = re.sub(r"Dz\.U\. (\d{4}) poz\. (\d+)(?![\d])", fix, line)
        out.append(line)
    return "\n".join(out)


def section(rows, title, columns, opis):
    body = [START, "", f"## {title}", "", opis, "",
            "| " + " | ".join(columns) + " |", "|" + "---|" * len(columns)]
    body += rows + ["", KONIEC]
    return "\n".join(body)


def replace_section(text, new):
    if START in text and KONIEC in text:
        a = text.index(START)
        b = text.index(KONIEC) + len(KONIEC)
        return text[:a].rstrip("\n") + ("\n\n" + new if new else "") + text[b:]
    return text.rstrip("\n") + ("\n\n" + new + "\n" if new else "\n")


def entry_date(act_id):
    try:
        return eli(act_id).get("entryIntoForce") or ""
    except Exception:
        return ""


def load_catalog(path):
    """Katalog obowiązujących t.j. z ELI (eli-catalog.json aplikacji: refreshEliCatalog)."""
    if not path:
        return {}
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)
    if not data.get("complete"):
        raise SystemExit(f"katalog ELI niekompletny: {path}")
    out = {}
    for base, act in data["acts"].items():
        if not act.get("inForce") or not act.get("tj"):
            continue
        out[base] = act
    return out


DR_NAME = re.compile(r"^dr-(\d\d)-")
TODAY = os.environ.get("MAPY_TJ_DZIS", "")


_NOWEL = None


def changes_after_tj(tj_id):
    """Zmiany po t.j. tą samą regułą co monitoring (check_nowelizacje.changes_after: unia
    dat stanu prawnego/ogłoszenia i sekcji API, F-153/F-155) — [(ELI zmiany, data wejścia)]."""
    global _NOWEL
    if _NOWEL is None:
        import importlib.util
        from pathlib import Path
        path = os.path.join(ROOT, "audyt-systemu-v4", "scripts", "check_nowelizacje.py")
        sys.path.insert(0, os.path.dirname(path))
        spec = importlib.util.spec_from_file_location("check_nowelizacje", path)
        _NOWEL = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(_NOWEL)
        _NOWEL._cache = Path(CACHE)
    try:
        info = _NOWEL.changes_after(tj_id, _NOWEL._cache)
    except Exception as exc:
        print(f"ELI_ERROR\t{tj_id}\t{exc}", file=sys.stderr)
        return []
    return [(eli_id, date) for eli_id, date, _prom, _title in info["changes"] if date]


# Dziedzina ustawy spoza nagłówków modułów po tytule (heurystyka, jawnie oznaczona w „Źródło dziedziny”).
# Kolejność ma znaczenie: pierwsze trafienia (do dwóch). Akty wykonawcze dziedziczą dziedzinę ustawy,
# na podstawie której je wydano (ELI „Podstawa prawna”), nie reguły tytułu.
TITLE_RULES = [
    (r"podat|akcyz|\bcło\b|celn|ordynacj\w* podatk|finans\w* publiczn|budżet|rachunkow|praniu pieniędzy|bankow|kredyt|ubezpiecze\w* gospodarcz|kapitałow|giełd|obrocie instrumentami|walut|płatnicz|kas\w* rejestrując|loteri|gier hazard|skarbow", "06"),
    (r"zamówie\w* publiczn|koncesj\w* na roboty|partnerstwie publiczno|funduszy europejsk|polityki spójności|pomocy publicznej|polityki rozwoju", "07"),
    (r"samorząd|gminn|powiat|województw|wojewod|metropolitaln|referendum lokaln|dochodach jednostek", "08"),
    (r"budowl|planowani\w* przestrzenn|środowisk|odpad|energ|klimat|\bwod|transport|drog|kolej|lotnic|morsk|żegl|geodez|górnicz|geologiczn|gazow|paliw|nieruchomości|mieszkan|lasach|leśn|łowiec|przyrod|zabytk|portach|ruchu drogowym|pojazd|kierowc|atomow|jądrow|promieniow|emisj", "09"),
    (r"zdrow|lecznicz|farmac|lekar|pielęgniar|pacjent|szpital|żywnoś|weteryn|rolni|rolny|nasien|zwierząt|roślin|sanitar|epidem|narkoman|alkohol|tyto|medyczn|aptek|ratownictw\w* medyczn|krwi|transplant|uzdrowisk|niepłodn|pasz|nawoz|ryb", "10"),
    (r"danych osobowych|cyberbezpiecz|telekomunik|komunikacji elektronicznej|elektroniczn|informatyz|cyfryzac|sztucznej inteligencji|prawie autorskim|własności przemysłowej|zaufania|podpis\w* elektron|pocztow|radiofonii|prasow", "11"),
    (r"sądów|sąd\w* powszechn|sądzie najwyższym|prokurat|adwokat|radc|notari|komornik|kurator|krajowej radzie sądownictwa|kosztach sądowych|biegł|mediator|tłumacz\w* przysięgł|rzecznik\w* patentow|doradztw\w* podatkow", "12"),
    (r"policj|wojsk|obron|żołnierz|służb\w* (?:specjaln|celno|więzien|ochrony)|straż\w* (?:granicznej|pożarnej|marszałk)|informacji niejawnych|bezpieczeństw\w* (?:państwa|wewnętrzn)|agencji bezpieczeństwa|agencji wywiadu|broni|amunicj|ochronie ludności|zarządzani\w* kryzysow|granic\w* państwow|antyterror|cudzoziem|kontrwywiad|żandarm", "13"),
    (r"umow\w* międzynarodow|ratyfik|unii europejskiej|konwencj|stosunk\w* zagraniczn|służbie zagranicznej", "14"),
    (r"sygnalist|biegłych rewidentach|audyt|nadzorze publicznym|normalizac|akredytac|ograniczeniu prowadzenia działalności", "15"),
    (r"pracy|zatrudnieni|emerytur|\brent|ubezpieczeń społecznych|zasiłk|świadcze\w* (?:rodzin|socjaln|pieniężn)|pomocy społecznej|niepełnosprawn|związk\w* zawodow|pracodawc|bezrobot|kombatant|weteran|wynagrodze", "04"),
    (r"karn|wykrocze|przestęp|więziennictw|probacj|egzekucyjn\w* w administracji|nieletnich", "03"),
    (r"cywiln|rodzinn\w* i opiekuńcz|spół|upadłości|restrukturyzac|ksiąg\w* wieczyst|własności lokali|spółdziel|fundacj|stowarzysz|gospodarcz|przedsiębiorc|konsument|spadk|postępowaniu grupowym|zastaw|hipote|weksl|czek", "02"),
    (r"postępowani\w* administracyjn|sądów administracyjnych|ewidencji ludności|dowod\w* osobist|stanu cywilnego|oświat|szkoln|szkół|nauk|szkolnictw|kultur|sport|mediów|petycj|informacji publicznej|paszport|obywatelstw|wyznani|kościo", "05"),
    (r"konstytucj|trybunale konstytucyjnym|trybunale stanu|wykonywaniu mandatu|kodeks wyborczy|wyborach|rzecznik\w* praw obywatelskich|najwyższej izbie kontroli|ogłaszaniu aktów|orderach|godle|hymnie|referendum ogólnokrajow|rzecznik\w* praw dziecka", "01"),
]


def title_domains(title):
    t = (title or "").lower()
    hits = []
    for pattern, dr in TITLE_RULES:
        if re.search(pattern, t) and f"DR-{dr}" not in hits:
            hits.append(f"DR-{dr}")
    return hits[:2]


def basis_domains(base, system):
    """Akt wykonawczy: dziedziny ustaw z „Podstawa prawna” (z nagłówków modułów albo z tytułu ustawy)."""
    try:
        refs = eli(base).get("references", {})
    except Exception:
        return [], ""
    doms, names = [], []
    for item in refs.get("Podstawa prawna", [])[:3]:
        bid = item.get("id", "")
        if not bid.startswith("DU/"):
            continue
        try:
            b_base, _tj, title, _st = base_of(*bid.split("/")[1:])
        except Exception:
            continue
        found = system[b_base]["domeny"] if b_base in system else title_domains(title)
        names.append(system[b_base]["abbr"] if b_base in system and system[b_base]["abbr"] else title_short(title)[:60])
        for d in found:
            if d not in doms and d != PAUZA:
                doms.append(d)
    return doms[:2], ", ".join(names)


def merged(system, catalog):
    """Akty systemu: nagłówki modułów (dziedzina z modułu) + katalog ELI (dziedzina z mapy albo tytułu)."""
    today = TODAY or __import__("datetime").date.today().isoformat()
    acts = {}
    for base, e in system.items():
        acts[base] = {**e, "zrodlo": "nagłówek modułu"}
    for base, act in catalog.items():
        doms = [f"DR-{DR_NAME.match(d).group(1)}" for d in act.get("domains", []) if DR_NAME.match(d)]
        doms = [d for d in doms if d != PAUZA]
        if base in acts:
            e = acts[base]
            if not e["tj"]:
                e["tj"] = act["tj"]
            continue
        zm = []
        for amend, d in changes_after_tj(act["tj"]):
            zm.append((amend.replace("DU/", ""), d, d > today))
        title = act.get("title", "")
        if doms and act.get("domainSource") == "MAP":
            src = "katalog ELI (mapa DR)"
        elif act.get("type") != "Ustawa":
            doms, via = basis_domains(base, system)
            src = f"podstawa prawna: {via}".rstrip() if doms else ""
        else:
            doms = []
            src = ""
        if not doms:
            doms = title_domains(title)
            src = "tytuł (heurystyka)" if doms else "brak trafienia — domyślnie DR-05, do przypisania"
            doms = doms or ["DR-05"]
        acts[base] = {"abbr": "", "tj": act["tj"], "zm": zm, "moduly": [], "tytul": title, "status": "",
                      "domeny": doms, "zrodlo": src}
    return acts


OPIS_DR = ("Generowane przez `scripts/mapy_tj.py`: wszystkie obowiązujące teksty jednolite z ELI przypisane do tej dziedziny "
           "(nagłówki **Akt:** modułów oraz katalog ELI), w konwencji modułów. Indeks core-law (RAG) czyta ten plik; "
           "routing modułów — tylko MAPA-AKTOW. Brzmienie przepisu zawsze z ELI.")
OPIS_PL = ("Generowane przez `scripts/mapy_tj.py`: wszystkie obowiązujące teksty jednolite z ELI w systemie, w konwencji modułów, "
           "z dziedzinami DR. Źródło dziedziny: nagłówek modułu (pewne), podstawa prawna aktu wykonawczego (dziedzina ustawy), "
           "tytuł (heurystyka) albo „brak trafienia — do przypisania”.")


def kept_catalog_rows(path):
    """Rows of an existing KATALOG-TJ.md: [akt, tekst, dziedziny/używają, źródło]."""
    if not os.path.exists(path):
        return []
    lines = []
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.rstrip("\n")
            if lines and lines[-1].startswith("| ") and not lines[-1].endswith("|") and line and not line.startswith("|"):
                lines[-1] += line  # a row broken by a title with a newline (older files)
            else:
                lines.append(line)
    out = []
    for line in lines:
        if line.startswith("| ") and "Dz.U." in line:
            cells = [" ".join(c.split()) for c in line.strip().strip("|").split("|")]
            if len(cells) >= 4:
                out.append(cells[:4])
    return out


def write(path, text, args, label, problems):
    old = open(path, encoding="utf-8").read() if os.path.exists(path) else None
    if old == text:
        return problems
    print(f"{'ZAPIS' if args.zapisz else 'NIEZGODNA'}\t{label}")
    if args.zapisz:
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(text)
    return problems + 1


def main():
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--sprawdz", action="store_true")
    g.add_argument("--zapisz", action="store_true")
    ap.add_argument("--katalog", help="eli-catalog.json (pełny katalog obowiązujących t.j.)")
    args = ap.parse_args()
    root = os.path.abspath(ROOT)
    problems = 0
    system = {}
    dirs = {}
    for skill_dir in sorted(glob.glob(os.path.join(root, "dr-*"))):
        label = skill_label(skill_dir)
        if label == PAUZA or not os.path.exists(os.path.join(skill_dir, "MAPA-AKTOW.md")):
            continue
        dirs[label] = skill_dir
        for base, entry in header_acts(skill_dir).items():
            sys_entry = system.setdefault(base, {**entry, "domeny": [], "moduly": []})
            if label not in sys_entry["domeny"]:
                sys_entry["domeny"].append(label)
            sys_entry["moduly"] += [m for m in entry["moduly"] if m not in sys_entry["moduly"]]
            for z in entry["zm"]:
                if z not in sys_entry["zm"]:
                    sys_entry["zm"].append(z)
        map_file = os.path.join(skill_dir, "MAPA-AKTOW.md")
        text = open(map_file, encoding="utf-8").read()
        problems = write(map_file, replace_section(add_tj_suffix(text), ""), args, os.path.relpath(map_file, root), problems)
    acts = merged(system, load_catalog(args.katalog))
    shared = os.path.join(root, "prawo-polskie-v2", "krajowe", "shared")
    entries = [{"label": etykieta(e), "text": tekst(e, b), "mods": ", ".join(e["moduly"]) or "—", "src": e["zrodlo"], "doms": e["domeny"]}
               for b, e in acts.items()]
    if not args.katalog:
        # Without the ELI catalogue (the daily workflow): the catalogue rows already in the file stay
        # as they are; only the acts of the modules' headers are rebuilt. A full rebuild: --katalog.
        held = {re.search(r"Dz\.U\. \d{4} poz\. \d+", e["text"]).group(0) for e in entries}
        for cells in kept_catalog_rows(os.path.join(shared, "KATALOG-TJ.md")):
            dz = re.search(r"Dz\.U\. \d{4} poz\. \d+", cells[1])
            if dz and dz.group(0) not in held and cells[3] != "nagłówek modułu":
                entries.append({"label": cells[0], "text": cells[1], "mods": "—", "src": cells[3],
                                "doms": [d.strip() for d in cells[2].split(",") if d.strip()]})
    entries.sort(key=lambda e: e["label"].lower())
    cols = ["Akt", "Tekst jednolity i zmiany po t.j.", "Używają", "Źródło dziedziny"]
    for label, skill_dir in dirs.items():
        rows = [f"| {e['label']} | {e['text']} | {e['mods']} | {e['src']} |" for e in entries if label in e["doms"]]
        body = f"# {label} — katalog tekstów jednolitych\n\n" + section(rows, f"Obowiązujące teksty jednolite — {label} ({len(rows)})", cols, OPIS_DR) + "\n"
        problems = write(os.path.join(skill_dir, "KATALOG-TJ.md"), body, args, f"{os.path.basename(skill_dir)}/KATALOG-TJ.md ({len(rows)})", problems)
    rows = [f"| {e['label']} | {e['text']} | {', '.join(sorted(e['doms']))} | {e['src']} |" for e in entries]
    body = "# KATALOG-TJ — obowiązujące teksty jednolite systemu\n\n" + section(rows, f"Teksty jednolite ({len(rows)})", ["Akt", "Tekst jednolity i zmiany po t.j.", "Dziedziny", "Źródło dziedziny"], OPIS_PL) + "\n"
    problems = write(os.path.join(shared, "KATALOG-TJ.md"), body, args, f"prawo-polskie-v2/krajowe/shared/KATALOG-TJ.md ({len(rows)})", problems)
    reg = os.path.join(shared, "LEGAL-REGISTRY.md")
    text = open(reg, encoding="utf-8").read()
    pointer = START + "\n\n## Katalog tekstów jednolitych\n\nPełna lista obowiązujących t.j. w konwencji modułów: `krajowe/shared/KATALOG-TJ.md` (całość) i `dr-XX/KATALOG-TJ.md` (dziedziny).\n\n" + KONIEC
    problems = write(reg, replace_section(text, pointer), args, "prawo-polskie-v2/krajowe/shared/LEGAL-REGISTRY.md", problems)
    print(f"AKTY={len(acts)} PLIKI_DO_ZMIANY={problems}")
    return 1 if (args.sprawdz and problems) else 0


if __name__ == "__main__":
    sys.exit(main())
