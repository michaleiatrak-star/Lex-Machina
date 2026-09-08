#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
T20 — check_wyjatek_gate_eli.py
Wsparcie narzędziowe dla bramki WYJ-GATE (shared/MOD-WYJATEK-GATE.md, flaga F-144).

CO ROBI — trzy z czterech zamiatań bramki
  S1 (--article)    zakres sąsiedztwa: jednostka nadrzędna (tytuł/dział/
                    rozdział), artykuł poprzedzający i następujący oraz
                    WSZYSTKIE artykuły z indeksem górnym przy tym samym
                    i sąsiednim numerze (art. X, X¹, X², …). To jedyny krok,
                    który w kazusie 111 wystarczyłby do wykrycia art. 770¹ k.c.
  S2 (--edges)      krawędzie jednostki: PIERWSZY i OSTATNI artykuł jednostki
                    nadrzędnej — tam stoją klauzule zakresowe i wyłączenia
                    („przepisów niniejszego działu nie stosuje się do…").
  S3 (--references) akty powiązane z rejestru ELI: materiał do wykrycia lex
                    specialis leżącego POZA aktem głównym.
  S4                przepisy przejściowe — poza zakresem narzędzia, procedura
                    w MOD-OS-CZASU-PRZESLANEK OŚ-5.4.

CZEGO NIE ROBI — świadomie
  ⛔ NIE ocenia wpływu. Klasyfikacja „wyłącza / zawęża / odsyła" jest decyzją
     merytoryczną i pozostaje po stronie analizy. Skrypt, który by ją zgadywał,
     produkowałby fasadę.
  ⛔ NIE wybiera wersji czasowej za operatora. Podaj identyfikator aktu
     (tekst jednolity) obowiązującego na datę zdarzenia. Data służy wyłącznie
     do opisania wyniku i do ostrzeżenia, gdy metryka aktu jest późniejsza.
  ⛔ NIE jest źródłem prawa i nie zastępuje HARD GATE.

STATUS WERYFIKACJI (zaktualizowany 2026-09-01c, flaga F-150)
  Ścieżki offline: `--selftest` = 15/15 PASS.
  Ścieżka sieciowa URUCHOMIONA na żywym api.sejm.gov.pl/eli 2026-09-01.
  Pierwszy przebieg ujawnił trzy usterki, wszystkie fałszywie negatywne:
    (1) `/text.html` na akcie BAZOWYM serwuje tekst OGŁOSZONY — zero jednostek
        z indeksem górnym; S1 na art. 770 k.c. gubiło art. 770¹, czyli kazus
        źródłowy F-144;
    (2) t.j. (obwieszczenie) ma `textHTML: false` — skrypt raportował wtedy
        „nie znaleziono artykułu", komunikat nieodróżnialny od nieistnienia;
    (3) parser S3 zakładał płaski JSON, a żywe ELI zwraca `{"act": {...}}` —
        373/373 pozycji wychodziło jako `?/?/?`.
  Naprawione: rozwiązanie aktu do najnowszego OBOWIĄZUJĄCEGO t.j., odczyt
  jego treści z `text.pdf` przez `pdftotext -layout`, rozpakowanie
  zagnieżdżonego `act`, rozpoznanie indeksu górnego w formie `[N]`.
  ⛔ Nadal NIEZMIERZONA pozostaje SKUTECZNOŚĆ bramki (F-144, test z grupą
  kontrolną) — poprawność zakresów to nie to samo co zmiana zachowania.

WYMAGANIE ŚRODOWISKOWE
  `pdftotext` (poppler-utils) dla ścieżki tekstu jednolitego. Brak narzędzia
  → skrypt schodzi na tekst ogłoszony i mówi to WPROST w polu wersji.

UŻYCIE
  python3 check_wyjatek_gate_eli.py --act DU/1964/93 --article 770 --date 2011-02-20
  python3 check_wyjatek_gate_eli.py --act DU/1964/93 --article 770 --ogloszony
  python3 check_wyjatek_gate_eli.py --fixture tekst.html --article 770 --edges
  python3 check_wyjatek_gate_eli.py --act DU/1964/93 --references
  python3 check_wyjatek_gate_eli.py --selftest

KODY WYJŚCIA
  0 — zakres zbudowany
  2 — błąd API / brak dostępu do sieci (ta sama konwencja co audit_tj_inventory.py)
  3 — artykuł nieznaleziony w tekście
  4 — błąd użycia
"""

import argparse
import json
import re
import sys
import unicodedata

ELI_BASE = "https://api.sejm.gov.pl/eli/acts"

SUPERSCRIPT = {"¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5",
               "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁰": "0"}

# ⛔ Kotwica ^ jest częścią normy, nie optymalizacją (F-150). Bez niej wzorzec
# łapie zwykłą prozę: fraza „…w dziale lub…" daje fałszywy nagłówek
# „DZIAŁ Lu" (L jako cyfra rzymska + opcjonalna litera), który przejmuje
# wszystkie kolejne artykuły i psuje S2. Objaw zmierzony na t.j. KC: art. 771
# i 773 wypadały poza TYTUŁ XXIV, więc „ostatni artykuł jednostki" wskazywał
# art. 770 zamiast art. 773 — czyli dokładnie tam, gdzie klauzul wyłączających
# NIE ma. Nagłówek redakcyjny stoi zawsze na początku wiersza.
HEADING_RE = re.compile(
    r"^[ \t]*(TYTU[ŁL]|DZIA[ŁL]|ROZDZIA[ŁL]|KSI[ĘE]GA)"
    r"\s+([IVXLCDM]+[a-z]?|\d+[a-z]?)\b",
    re.IGNORECASE | re.MULTILINE)

ART_RE = re.compile(
    r"Art\.\s*(\d+)\s*(?:<sup>\s*(\d+)\s*</sup>|\(\s*(\d+)\s*\)"
    r"|\[\s*(\d+)\s*\]|([¹²³⁴⁵⁶⁷⁸⁹⁰]+))?",
    re.IGNORECASE)
# Forma `[N]` pochodzi z `pdftotext` — tak renderuje indeks górny w tekście
# jednolitym pobranym jako PDF. Bez niej art. 770[1] czyta się jako art. 770.


# --------------------------------------------------------------------------
# parser
# --------------------------------------------------------------------------

def strip_tags(html):
    """Usuwa znaczniki, zachowując <sup> jako marker indeksu górnego."""
    html = re.sub(r"(?is)<(script|style).*?</\1>", " ", html)
    html = re.sub(r"(?i)<sup[^>]*>", "<sup>", html)
    html = re.sub(r"(?i)</sup\s*>", "</sup>", html)
    html = re.sub(r"(?is)<(?!/?sup)[^>]+>", " ", html)
    html = html.replace("&nbsp;", " ").replace("&#160;", " ")
    return re.sub(r"[ \t]+", " ", html)


def norm_index(m):
    """Zwraca indeks górny artykułu jako tekst albo '' gdy go nie ma."""
    sup, paren, brack, uni = m.group(2), m.group(3), m.group(4), m.group(5)
    if sup:
        return sup.strip()
    if paren:
        return paren.strip()
    if brack:
        return brack.strip()
    if uni:
        return "".join(SUPERSCRIPT.get(c, "") for c in uni)
    return ""


def parse_units(text):
    """Lista jednostek: (numer:int, indeks:str, pozycja:int, nagłówek nadrzędny)."""
    headings = [(m.start(), " ".join(m.group(0).split()).upper())
                for m in HEADING_RE.finditer(text)]

    def heading_for(pos):
        current = None
        for start, label in headings:
            if start <= pos:
                current = label
            else:
                break
        return current

    units = []
    seen = set()
    for m in ART_RE.finditer(text):
        num = int(m.group(1))
        idx = norm_index(m)
        key = (num, idx)
        if key in seen:
            continue
        seen.add(key)
        units.append({"numer": num, "indeks": idx, "pozycja": m.start(),
                      "jednostka_nadrzedna": heading_for(m.start()),
                      "etykieta": f"art. {num}" + (f"^{idx}" if idx else "")})
    units.sort(key=lambda u: (u["numer"], int(u["indeks"] or 0)))
    return units


def build_scope(units, article, index=""):
    """Zakres minimalny US-2 wokół wskazanego artykułu."""
    target = [u for u in units if u["numer"] == article and u["indeks"] == index]
    if not target:
        return None
    t = target[0]
    numbers = sorted({u["numer"] for u in units})
    if article not in numbers:
        return None
    i = numbers.index(article)
    wanted = {article}
    if i > 0:
        wanted.add(numbers[i - 1])
    if i < len(numbers) - 1:
        wanted.add(numbers[i + 1])
    scope = [u for u in units if u["numer"] in wanted]
    return {"cel": t, "zakres": scope}


def build_edges(units, article):
    """S2 — pierwszy i ostatni artykuł jednostki nadrzędnej celu."""
    target = [u for u in units if u["numer"] == article]
    if not target:
        return None
    head = target[0]["jednostka_nadrzedna"]
    same = [u for u in units if u["jednostka_nadrzedna"] == head]
    if not same:
        return None
    return {"jednostka_nadrzedna": head, "pierwszy": same[0], "ostatni": same[-1]}


def parse_references(data):
    """S3 — spłaszcza odpowiedź ELI /references do listy aktów powiązanych."""
    out = []
    if isinstance(data, dict):
        for rel, items in data.items():
            if not isinstance(items, list):
                continue
            for it in items:
                if not isinstance(it, dict):
                    continue
                # Zywe API zwraca {"act": {...}}; starsze fixture — plaski dict.
                a = it.get("act") if isinstance(it.get("act"), dict) else it
                ident = (a.get("ELI") or a.get("id")
                         or a.get("displayAddress"))
                if not ident and (a.get("year") or a.get("pos")):
                    ident = "{}/{}/{}".format(a.get("publisher", "?"),
                                              a.get("year", "?"),
                                              a.get("pos", "?"))
                out.append({
                    "relacja": rel,
                    "id": ident or "?",
                    "tytul": (a.get("title") or "").strip(),
                    "data": (a.get("promulgation") or a.get("announcementDate")
                             or a.get("date") or ""),
                })
    out.sort(key=lambda r: (r["relacja"], r["id"]))
    return out


# --------------------------------------------------------------------------
# wejście
# --------------------------------------------------------------------------

def _split_act(act_id):
    parts = act_id.strip("/").split("/")
    if len(parts) != 3:
        raise SystemExit("Format --act: PUBLISHER/ROK/POZYCJA, np. DU/1964/93")
    return parts


def fetch_json(url):
    """Pobiera i parsuje JSON z ELI. Zwraca None przy błędzie sieci."""
    import urllib.request
    try:
        with urllib.request.urlopen(url, timeout=60) as r:
            return json.loads(r.read().decode("utf-8", errors="replace"))
    except Exception:                              # noqa: BLE001
        return None


def resolve_tj(act_id):
    """Zwraca ELI najnowszego OBOWIĄZUJĄCEGO tekstu jednolitego aktu.

    ⛔ Powód istnienia (F-150): `/text.html` na akcie BAZOWYM serwuje tekst
    OGŁOSZONY, nie ujednolicony — nie zawiera żadnej jednostki z indeksem
    górnym dodanej nowelizacją. Zamiatanie S1 na takim tekście daje fałszywy
    negatyw dokładnie tej klasy, dla której bramkę zbudowano (art. 770¹ k.c.).
    """
    parts = _split_act(act_id)
    data = fetch_json("{}/{}/{}/{}/references".format(ELI_BASE, *parts))
    return _pick_tj(data)


def amendments_after(data, tj_promulgation):
    """Akty zmieniające OGŁOSZONE PO dacie t.j. (F-153).

    ⛔ Powód istnienia. Naprawa F-150 przesunęła odczyt z tekstu ogłoszonego na
    tekst jednolity — i wprowadziła WŁASNY punkt ślepy: t.j. nie zawiera
    nowelizacji ogłoszonych po jego dacie. Przypadek zmierzony 2026-09-01d:
    obowiązujący t.j. ustawy o PIP (Dz.U. 2024 poz. 1712) NIE zawiera art. 14b,
    dodanego ustawą Dz.U. 2026 poz. 473 z mocą od 2026-07-08. Zamiatanie S1
    na samym t.j. nie zobaczyłoby tej jednostki — czyli ten sam tryb awarii,
    tylko o jedną wersję dalej.

    Funkcja NIE scala treści nowelizacji. Zwraca listę do ręcznego rozpoznania,
    zgodnie z KROK 2C `shared/PRAWO-HARDGATE.md`.
    """
    if not isinstance(data, dict) or not tj_promulgation:
        return []
    out = []
    for it in data.get("Akty zmieniające") or []:
        a = it.get("act") if isinstance(it, dict) and isinstance(
            it.get("act"), dict) else it
        if not isinstance(a, dict):
            continue
        prom = a.get("promulgation") or a.get("announcementDate") or ""
        if prom and prom > tj_promulgation:
            out.append((prom, a.get("displayAddress") or a.get("ELI") or "?",
                        (a.get("title") or "")[:70]))
    out.sort()
    return out


def amendments_from_api(tj_refs):
    """Sekcja „Nowelizacje po tekście jednolitym" z /references OBWIESZCZENIA.

    ⛔ POMIAR 2026-09-01i (F-155), 19 aktów: sekcja zgadza się z metodą datową
    w 16 przypadkach, a w 3 jest jej WŁAŚCIWYM PODZBIOREM — brakowało czterech
    ustaw zmieniających, wszystkie ze statusem `obowiązujący`, w tym
    DU/2024/1907 obowiązującej od 2025-01-01, czyli od ośmiu miesięcy.
    Odwrotnej rozbieżności (pozycja w sekcji, brak w metodzie datowej) NIE
    zaobserwowano ani razu.

    Dlatego sekcja NIE zastępuje metody datowej — uzupełnia ją. Oparcie bramki
    na samej sekcji przywróciłoby fałszywy negatyw tej samej klasy, dla której
    bramka powstała.
    """
    out = {}
    for it in (tj_refs or {}).get("Nowelizacje po tekście jednolitym") or []:
        a = it.get("act") if isinstance(it, dict) and isinstance(
            it.get("act"), dict) else it
        if not isinstance(a, dict) or not a.get("ELI"):
            continue
        out[a["ELI"]] = (a.get("promulgation") or a.get("announcementDate") or "",
                         a.get("displayAddress") or a["ELI"],
                         (a.get("title") or "")[:70])
    return out


def merge_amendments(date_list, api_map, base_refs):
    """Unia obu źródeł z jawną proweniencją każdej pozycji.

    Zwraca listę krotek (data, adres, tytuł, źródło), gdzie źródło ∈
    {"DATA+API", "DATA", "API"}. ⛔ Unia, nie wybór: pominięcie którejkolwiek
    strony to fałszywy negatyw, a bramka ma odmawiać wyniku, nie zgadywać.
    """
    by_eli = {}
    for it in (base_refs or {}).get("Akty zmieniające") or []:
        a = it.get("act") if isinstance(it, dict) and isinstance(
            it.get("act"), dict) else it
        if isinstance(a, dict) and a.get("ELI"):
            by_eli[(a.get("displayAddress") or a["ELI"])] = a["ELI"]
    date_elis = {by_eli.get(addr, addr) for _, addr, _ in date_list}
    out = []
    for prom, addr, title in date_list:
        eli = by_eli.get(addr, addr)
        out.append((prom, addr, title,
                    "DATA+API" if eli in api_map else "DATA"))
    for eli, (prom, addr, title) in sorted(api_map.items()):
        if eli not in date_elis:
            out.append((prom, addr, title, "API"))
    out.sort()
    return out


def _pick_tj(data):
    """Wybiera z rejestru odesłań najnowszy OBOWIĄZUJĄCY t.j. (testowalne).

    ⛔ Nie „najnowszy wpis na liście" — rejestr bywa nieposortowany, a starsze
    obwieszczenia mają status `wygaśnięcie aktu`. Wybór po statusie, nie
    po kolejności.
    """
    if not isinstance(data, dict):
        return None
    items = data.get("Inf. o tekście jednolitym") or []
    cands = []
    for it in items:
        a = it.get("act") if isinstance(it, dict) and isinstance(
            it.get("act"), dict) else it
        if not isinstance(a, dict) or not a.get("ELI"):
            continue
        cands.append((int(a.get("year") or 0), int(a.get("pos") or 0),
                      a.get("ELI"), a.get("status") or "",
                      a.get("displayAddress") or a.get("ELI")))
    if not cands:
        return None
    obow = [c for c in cands if "obowiązując" in c[3]]
    pool = sorted(obow or cands)
    return pool[-1]


def pdf_to_text(url):
    """Pobiera PDF i wyciąga tekst przez `pdftotext -layout`.

    Tekst jednolity (obwieszczenie) ma w ELI `textHTML: false` — PDF jest
    JEDYNĄ maszynową postacią jego treści.
    """
    import shutil
    import subprocess
    import tempfile
    import urllib.request
    if not shutil.which("pdftotext"):
        return None, "BRAK NARZĘDZIA pdftotext (poppler-utils)"
    try:
        with urllib.request.urlopen(url, timeout=90) as r:
            blob = r.read()
    except Exception as exc:                       # noqa: BLE001
        return None, "BŁĄD POBRANIA PDF: {}".format(exc)
    with tempfile.TemporaryDirectory() as d:
        src = d + "/akt.pdf"
        with open(src, "wb") as fh:
            fh.write(blob)
        try:
            out = subprocess.run(["pdftotext", "-layout", src, "-"],
                                 capture_output=True, timeout=300)
        except Exception as exc:                   # noqa: BLE001
            return None, "BŁĄD pdftotext: {}".format(exc)
    if out.returncode != 0:
        return None, "pdftotext kod {}".format(out.returncode)
    return out.stdout.decode("utf-8", errors="replace"), None


def fetch_act_text(act_id, force_ogloszony=False, allow_stale=False):
    """Zwraca (tekst, url, etykieta_wersji) dla właściwej wersji aktu.

    Kolejność: tekst jednolity (HTML jeśli jest, inaczej PDF) → tekst
    ogłoszony aktu bazowego z JAWNYM ostrzeżeniem. Etykieta wersji trafia
    do bloku wyjściowego, więc operator widzi, co faktycznie przeczytano.
    """
    if not force_ogloszony:
        parts0 = _split_act(act_id)
        refs = fetch_json("{}/{}/{}/{}/references".format(ELI_BASE, *parts0))
        tj = _pick_tj(refs)
        if tj:
            eli = tj[2]
            label = "TEKST JEDNOLITY {}".format(tj[4])
            meta = fetch_json("{}/{}".format(ELI_BASE, eli)) or {}
            tj_refs = fetch_json("{}/{}/references".format(ELI_BASE, eli))
            later = merge_amendments(
                amendments_after(refs, (meta.get("promulgation") or "")),
                amendments_from_api(tj_refs), refs)
            if later:
                label += "  ⚠️ + {} nowelizacj(e) PO t.j.".format(len(later))
                print("⚠️ KROK 2C — akty zmieniające OGŁOSZONE PO dacie t.j. "
                      "({}):".format(meta.get("promulgation") or "?"),
                      file=sys.stderr)
                for prom, addr, title, src in later:
                    print("   - {}  {}  [{}]  {}".format(prom, addr, src,
                                                         title),
                          file=sys.stderr)
                only_date = [x for x in later if x[3] == "DATA"]
                if only_date:
                    print("   ⚠️ {} pozycji widzi WYŁĄCZNIE metoda datowa — "
                          "sekcja ELI ich nie wymienia (F-155, zmierzone)."
                          .format(len(only_date)), file=sys.stderr)
                print("   ⛔ Tekst jednolity ICH NIE ZAWIERA. Jednostka dodana "
                      "nowelizacją nie pojawi się w zamiataniu S1/S2.",
                      file=sys.stderr)
                if not allow_stale:
                    print("   ⛔ STOP (F-153). Zamiatanie WSTRZYMANE — wynik "
                          "byłby niepełny w sposób NIEWIDOCZNY dla czytającego."
                          "\n   Scalanie treści nowelizacji do tekstu roboczego "
                          "zostało ODRZUCONE: wytworzyłoby brzmienie, którego "
                          "żaden publikator nie ogłasza w tej postaci."
                          "\n   Wybierz świadomie:"
                          "\n     --mimo-nowelizacji  → kontynuuj na t.j. z "
                          "etykietą ostrzegawczą (wynik NIEPEŁNY)"
                          "\n     --act <ELI nowelizacji>  → zamiataj wprost "
                          "tekst aktu zmieniającego", file=sys.stderr)
                    sys.exit(6)
            else:
                print("ℹ️ KROK 2C — aktów zmieniających po dacie t.j. ({}): brak"
                      .format(meta.get("promulgation") or "?"), file=sys.stderr)
            parts = _split_act(eli)
            if meta.get("textHTML"):
                url = "{}/{}/{}/{}/text.html".format(ELI_BASE, *parts)
                raw = fetch_raw(url)
                if raw:
                    return raw, url, label
            if meta.get("textPDF"):
                url = "{}/{}/{}/{}/text.pdf".format(ELI_BASE, *parts)
                txt, err = pdf_to_text(url)
                if txt:
                    return txt, url, label
                print("⚠️ {} — schodzę na tekst ogłoszony".format(err),
                      file=sys.stderr)
    parts = _split_act(act_id)
    url = "{}/{}/{}/{}/text.html".format(ELI_BASE, *parts)
    raw = fetch_raw(url)
    if raw is None:
        print("BŁĄD API ELI\nURL: {}".format(url), file=sys.stderr)
        sys.exit(2)
    return raw, url, ("⚠️ TEKST OGŁOSZONY (aktu bazowego) — NIE zawiera "
                      "jednostek dodanych nowelizacją")


def fetch_raw(url):
    """Surowe GET; None przy błędzie."""
    import urllib.request
    try:
        with urllib.request.urlopen(url, timeout=90) as r:
            body = r.read().decode("utf-8", errors="replace")
    except Exception:                              # noqa: BLE001
        return None
    return body or None


def fetch_eli_text(act_id):
    """Pobiera tekst OGŁOSZONY aktu z ELI (ścieżka historyczna)."""
    import urllib.error
    import urllib.request
    parts = act_id.strip("/").split("/")
    if len(parts) != 3:
        raise SystemExit("Format --act: PUBLISHER/ROK/POZYCJA, np. DU/1964/93")
    url = "{}/{}/{}/{}/text.html".format(ELI_BASE, *parts)
    try:
        with urllib.request.urlopen(url, timeout=60) as r:
            return r.read().decode("utf-8", errors="replace"), url
    except Exception as exc:                       # noqa: BLE001
        print("BŁĄD API ELI: {}\nURL: {}".format(exc, url), file=sys.stderr)
        print("Gałąź sieciowa nie została zweryfikowana na żywym API — "
              "wykonaj US-2 ręcznie i oznacz źródło wg PRAWO-HARDGATE.",
              file=sys.stderr)
        sys.exit(2)


def fetch_eli_references(act_id):
    """Pobiera rejestr odesłań ELI. Gałąź NIEZWERYFIKOWANA na żywym API."""
    import urllib.request
    parts = act_id.strip("/").split("/")
    if len(parts) != 3:
        raise SystemExit("Format --act: PUBLISHER/ROK/POZYCJA, np. DU/1964/93")
    url = "{}/{}/{}/{}/references".format(ELI_BASE, *parts)
    try:
        with urllib.request.urlopen(url, timeout=60) as r:
            return json.loads(r.read().decode("utf-8", errors="replace")), url
    except Exception as exc:                       # noqa: BLE001
        print("BŁĄD API ELI: {}\nURL: {}".format(exc, url), file=sys.stderr)
        print("Gałąź sieciowa nie została zweryfikowana na żywym API — "
              "wykonaj S3 ręcznie i oznacz źródło wg PRAWO-HARDGATE.",
              file=sys.stderr)
        sys.exit(2)


def render_edges(edges):
    print("  S2 krawędzie jednostki ({}):".format(
        edges["jednostka_nadrzedna"] or "⚠️ nieustalona"))
    print("    - pierwszy: {:<12} (zakres/definicje?)  →  DO OCENY".format(
        edges["pierwszy"]["etykieta"]))
    print("    - ostatni:  {:<12} (wyłączenia/odesłania?) →  DO OCENY".format(
        edges["ostatni"]["etykieta"]))
    print("    \u2691 Klauzule wylaczajace (\u201enie stosuje sie\u201d, "
          "\u201estosuje sie odpowiednio\u201d)\n"
          "       stoja zwykle na krawedziach jednostki, nie przy przepisie, "
          "ktory wylaczaja.")


def render_references(refs, act_label, source):
    print("WYJ-GATE / S3 — akty powiązane (materiał, NIE ocena)")
    print("  akt:     {}".format(act_label))
    print("  źródło:  {}".format(source))
    if not refs:
        print("  ⚠️ rejestr odesłań pusty — to NIE dowodzi braku lex specialis.")
        print("     Akt sektorowy, który nie odsyła wprost, tu się nie pojawi.")
        return
    print("  pozycji: {}".format(len(refs)))
    for r in refs:
        print("    - [{}] {} {} {}".format(
            r["relacja"], r["id"], r["data"], r["tytul"][:70]))
    print("  \u26d4 Kazda pozycje zamknij wpisem \u201ebrak wplywu\u201d "
          "albo nazwanym skutkiem.")


def render(result, act_label, date, source):
    cel = result["cel"]
    nadrz = cel["jednostka_nadrzedna"] or "⚠️ jednostka nadrzędna nieustalona"
    print("WYJ-GATE / S1 — zakres sąsiedztwa (wygenerowany maszynowo)")
    print("  akt:        {}".format(act_label))
    print("  jednostka:  {}".format(cel["etykieta"]))
    print("  stan na:    {}".format(date or "⬛ DATA NIEPODANA"))
    print("  nadrzędna:  {}".format(nadrz))
    print("  źródło:     {}".format(source))
    print("  sąsiedzi (status i wpływ = ocena merytoryczna, RĘCZNA):")
    for u in result["zakres"]:
        mark = "  ← CEL" if u is cel else ""
        flag = "  ⚑ INDEKS GÓRNY" if u["indeks"] and u is not cel else ""
        print("    - {:<12} status: ?   wpływ: ?{}{}".format(
            u["etykieta"], flag, mark))
    idx = [u for u in result["zakres"] if u["indeks"] and u is not cel]
    if idx:
        print("  ⚑ UWAGA: w zakresie są jednostki z indeksem górnym. To typowe "
              "miejsce\n     lex specialis dodanego nowelizacją — sprawdź je "
              "przed konkluzją.")
    print("  ⛔ Skrypt NIE ocenia wpływu. Milczenie o sąsiedzie nie jest "
          "odpowiedzią negatywną.")


# --------------------------------------------------------------------------
# selftest
# --------------------------------------------------------------------------

FIXTURE = """
<html><body>
<p>TYTUŁ XXIII. Umowa agencyjna</p>
<p>Art. 758. Przez umowę agencyjną ...</p>
<p>Art. 764<sup>1</sup>. W razie rozwiązania umowy ...</p>
<p>TYTUŁ XXIV. Umowa komisu</p>
<p>Art. 765. Przez umowę komisu ...</p>
<p>Art. 769. Jeżeli komisant zapłacił ...</p>
<p>Art. 770. Komisant nie ponosi odpowiedzialności za ukryte wady fizyczne
rzeczy, jak również za jej wady prawne, jeżeli przed zawarciem umowy podał
to do wiadomości kupującego ...</p>
<p>Art. 770<sup>1</sup>. Do umowy sprzedaży rzeczy ruchomej zawartej przez
komisanta z osobą fizyczną ... stosuje się przepisy o sprzedaży
konsumenckiej.</p>
<p>Art. 771. Komisant, który bez upoważnienia ...</p>
<p>TYTUŁ XXV. Umowa przewozu</p>
<p>Art. 774. Przez umowę przewozu ...</p>
</body></html>
"""


FIXTURE_REFS = {
    "Akty zmieniające": [
        {"id": "DU/2002/1176", "year": 2002, "pos": 1176, "publisher": "DU",
         "date": "2002-07-27",
         "title": "Ustawa o szczegolnych warunkach sprzedazy konsumenckiej "
                  "oraz o zmianie Kodeksu cywilnego"},
        {"id": "DU/2014/827", "year": 2014, "pos": 827, "publisher": "DU",
         "date": "2014-05-30", "title": "Ustawa o prawach konsumenta"},
    ],
    "Akty odsylajace": [
        {"id": "DU/2022/2337", "year": 2022, "pos": 2337, "publisher": "DU",
         "date": "2022-11-04", "title": "Ustawa zmieniajaca ustawe o prawach "
                                        "konsumenta"},
    ],
}


FIXTURE_REFS_LIVE = {
    "Inf. o tekście jednolitym": [
        {"act": {"ELI": "DU/2026/795", "publisher": "DU", "year": 2026,
                 "pos": 795, "type": "Obwieszczenie", "status": "obowiązujący",
                 "displayAddress": "Dz.U. 2026 poz. 795",
                 "promulgation": "2026-06-11",
                 "title": "Obwieszczenie w sprawie ogloszenia jednolitego "
                          "tekstu ustawy - Kodeks cywilny"}},
    ],
    "Akty zmieniające": [
        {"act": {"ELI": "DU/2022/2337", "publisher": "DU", "year": 2022,
                 "pos": 2337, "status": "obowiązujący",
                 "displayAddress": "Dz.U. 2022 poz. 2337",
                 "promulgation": "2022-11-04",
                 "title": "Ustawa zmieniajaca ustawe o prawach konsumenta"}},
    ],
}


FIXTURE_REFS_LATER = {
    "Akty zmieniające": [
        {"act": {"ELI": "DU/2026/473", "year": 2026, "pos": 473,
                 "displayAddress": "Dz.U. 2026 poz. 473",
                 "promulgation": "2026-04-07",
                 "title": "Ustawa o zmianie ustawy o Panstwowej Inspekcji "
                          "Pracy oraz niektorych innych ustaw"}},
        {"act": {"ELI": "DU/2021/1529", "year": 2021, "pos": 1529,
                 "displayAddress": "Dz.U. 2021 poz. 1529",
                 "promulgation": "2021-08-23",
                 "title": "Ustawa o zmianie ustawy o Panstwowej Inspekcji Pracy"}},
    ],
}


FIXTURE_TJ = {
    "Inf. o tekście jednolitym": [
        {"act": {"ELI": "DU/2025/1071", "year": 2025, "pos": 1071,
                 "status": "wygaśnięcie aktu",
                 "displayAddress": "Dz.U. 2025 poz. 1071"}},
        {"act": {"ELI": "DU/2026/795", "year": 2026, "pos": 795,
                 "status": "obowiązujący",
                 "displayAddress": "Dz.U. 2026 poz. 795"}},
        {"act": {"ELI": "DU/2024/1061", "year": 2024, "pos": 1061,
                 "status": "wygaśnięcie aktu",
                 "displayAddress": "Dz.U. 2024 poz. 1061"}},
    ],
}


def selftest():
    text = strip_tags(FIXTURE)
    units = parse_units(text)
    checks = []

    labels = [u["etykieta"] for u in units]
    checks.append(("parser widzi art. 770^1 jako osobną jednostkę",
                   "art. 770^1" in labels))

    res = build_scope(units, 770)
    checks.append(("zakres zbudowany dla art. 770", res is not None))

    scope_labels = [u["etykieta"] for u in res["zakres"]] if res else []
    checks.append(("art. 770^1 JEST w zakresie S1 art. 770",
                   "art. 770^1" in scope_labels))
    checks.append(("sąsiedzi 769 i 771 w zakresie",
                   "art. 769" in scope_labels and "art. 771" in scope_labels))
    checks.append(("jednostka nadrzędna rozpoznana jako TYTUŁ XXIV",
                   res is not None and (res["cel"]["jednostka_nadrzedna"] or "")
                   .startswith("TYTUŁ XXIV")))

    edges = build_edges(units, 770)
    checks.append(("S2 zwraca krawedzie jednostki",
                   edges is not None and edges["pierwszy"]["etykieta"] == "art. 765"
                   and edges["ostatni"]["etykieta"] == "art. 771"))

    refs = parse_references(FIXTURE_REFS)
    checks.append(("S3 splaszcza rejestr odeslan", len(refs) == 3))
    checks.append(("S3 widzi ustawe konsumencka z 2002 r.",
                   any(r["id"] == "DU/2002/1176" for r in refs)))

    # F-150: ksztalt ZYWEGO API — {"act": {...}}. Stary parser dawal "?/?/?"
    # dla wszystkich 373 pozycji i nie zglaszal bledu.
    refs_live = parse_references(FIXTURE_REFS_LIVE)
    checks.append(("S3 rozpakowuje zagniezdzony act (zywe API)",
                   len(refs_live) == 2))
    checks.append(("S3 czyta ELI z zagniezdzonego act",
                   any(r["id"] == "DU/2026/795" for r in refs_live)))
    checks.append(("S3 nie zostawia pustych identyfikatorow",
                   all(r["id"] != "?" for r in refs_live)))
    checks.append(("S3 czyta date promulgacji",
                   any(r["data"] == "2026-06-11" for r in refs_live)))

    # F-150: indeks gorny w postaci `[N]` z pdftotext
    pdf_units = parse_units("Art. 769. x Art. 770. y Art. 770[1]. "
                            "(uchylony) Art. 771. z")
    checks.append(("S1 czyta indeks gorny z pdftotext (770[1])",
                   any(u["numer"] == 770 and u["indeks"] == "1"
                       for u in pdf_units)))
    pdf_scope = build_scope(pdf_units, 770)
    checks.append(("S1 zwraca 770^1 w zakresie z PDF",
                   pdf_scope is not None and any(
                       u["etykieta"] == "art. 770^1"
                       for u in pdf_scope["zakres"])))

    # F-150: naglowek tylko na poczatku wiersza — proza nie tworzy jednostki
    prose = ("TYTUŁ XXIV\n"
             "Art. 769. x\n"
             "Art. 770. Komisant odpowiada w dziale lub w tytule wskazanym.\n"
             "Art. 771. y\n"
             "Art. 773. z\n")
    pu = parse_units(prose)
    heads = {u["numer"]: u["jednostka_nadrzedna"] for u in pu}
    checks.append(("naglowek: proza „w dziale lub” nie tworzy jednostki",
                   all(h == "TYTUŁ XXIV" for h in heads.values())))
    pe = build_edges(pu, 770)
    checks.append(("S2 wskazuje ostatni artykul jednostki (773)",
                   pe is not None and pe["ostatni"]["numer"] == 773))

    # F-153: nowelizacje ogloszone PO dacie t.j. (punkt slepy naprawy F-150)
    later = amendments_after(FIXTURE_REFS_LATER, "2024-11-15")
    checks.append(("2C: widzi nowelizacje pozniejsza niz t.j.",
                   len(later) == 1 and later[0][1] == "Dz.U. 2026 poz. 473"))
    checks.append(("2C: pomija nowelizacje wczesniejsza niz t.j.",
                   all(x[0] > "2024-11-15" for x in later)))
    checks.append(("2C: brak daty t.j. nie daje falszywej listy",
                   amendments_after(FIXTURE_REFS_LATER, "") == []))

    # F-155: unia metody datowej i sekcji API. Fixture odwzorowuje zmierzoną
    # rozbieżność: sekcja ELI POMIJA ustawę, którą metoda datowa widzi.
    base_refs_155 = {"Akty zmieniające": [
        {"act": {"ELI": "DU/2026/982", "displayAddress": "Dz.U. 2026 poz. 982",
                 "promulgation": "2026-07-22", "title": "Ustawa zmieniajaca A"}},
        {"act": {"ELI": "DU/2026/100", "displayAddress": "Dz.U. 2026 poz. 100",
                 "promulgation": "2026-02-01", "title": "Ustawa zmieniajaca B"}},
    ]}
    tj_refs_155 = {"Nowelizacje po tekście jednolitym": [
        {"act": {"ELI": "DU/2026/100", "displayAddress": "Dz.U. 2026 poz. 100",
                 "promulgation": "2026-02-01", "title": "Ustawa zmieniajaca B"}},
    ]}
    dat155 = amendments_after(base_refs_155, "2026-01-01")
    api155 = amendments_from_api(tj_refs_155)
    merged = merge_amendments(dat155, api155, base_refs_155)
    checks.append(("F-155: sekcja API sama gubi pozycje (fixture)",
                   len(api155) == 1 and len(dat155) == 2))
    # ⛔ Mutacja negatywna: gdyby implementacja przeszla na SAMA sekcje API,
    # ponizszy przypadek zawiodlby — unia musi miec 2 pozycje, nie 1.
    checks.append(("F-155: unia zachowuje pozycje spoza sekcji API",
                   len(merged) == 2 and any(x[3] == "DATA" for x in merged)))
    checks.append(("F-155: pozycja w obu zrodlach ma proweniencje DATA+API",
                   any(x[3] == "DATA+API" for x in merged)))
    checks.append(("F-155: brak pozycji bez proweniencji",
                   all(x[3] in ("DATA", "API", "DATA+API") for x in merged)))

    # F-153: decyzja STOP-vs-scalanie. Mutacja negatywna: gdyby warunek
    # `if not allow_stale` zniknal, ponizszy przypadek przestalby rozrozniac
    # oba tryby i zglosilby FAIL.
    with open(__file__, encoding="utf-8") as _fh:
        src = _fh.read()
    checks.append(("F-153: STOP jest warunkowany flaga --mimo-nowelizacji",
                   "if not allow_stale:" in src and "sys.exit(6)" in src))
    checks.append(("F-153: flaga --mimo-nowelizacji istnieje w CLI",
                   "--mimo-nowelizacji" in src))
    checks.append(("F-153: scalanie tresci NIE jest zaimplementowane",
                   "ODRZUCONE" in src))

    # F-150: wybor najnowszego OBOWIAZUJACEGO t.j. z rejestru
    tj = _pick_tj(FIXTURE_TJ)
    checks.append(("t.j.: wybiera obowiazujacy, nie najnowszy wpis",
                   tj is not None and tj[2] == "DU/2026/795"))

    ok = 0
    for name, passed in checks:
        print("{} {}".format("PASS" if passed else "FAIL", name))
        ok += bool(passed)
    print("---\n{}/{} PASS".format(ok, len(checks)))
    if ok == len(checks):
        print("\nPodgląd wyniku na fixture:")
        render(res, "DU/1964/93 (fixture)", "2011-02-20", "wbudowany FIXTURE")
    return 0 if ok == len(checks) else 1


# --------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(
        description="T20 — zakres US-2 (bramka sąsiedztwa redakcyjnego)")
    ap.add_argument("--act", help="identyfikator ELI, np. DU/1964/93")
    ap.add_argument("--fixture", help="lokalny plik HTML zamiast API")
    ap.add_argument("--article", type=int, help="numer artykułu")
    ap.add_argument("--index", default="", help="indeks górny celu, np. 1")
    ap.add_argument("--date", help="data zdarzenia (YYYY-MM-DD), opisowa")
    ap.add_argument("--edges", action="store_true",
                    help="dodaj zamiatanie S2 (krawedzie jednostki)")
    ap.add_argument("--references", action="store_true",
                    help="zamiatanie S3 (rejestr odeslan ELI); wymaga --act")
    ap.add_argument("--refs-fixture", help="lokalny JSON zamiast API (S3)")
    ap.add_argument("--mimo-nowelizacji", dest="allow_stale",
                    action="store_true",
                    help="kontynuuj mimo nowelizacji ogłoszonych PO dacie t.j. "
                         "(F-153) — wynik jest wtedy JAWNIE niepełny")
    ap.add_argument("--ogloszony", action="store_true",
                    help="wymuś tekst OGŁOSZONY aktu bazowego (świadomie, "
                         "np. dla stanu na datę sprzed pierwszego t.j.)")
    ap.add_argument("--json", action="store_true", help="wynik jako JSON")
    ap.add_argument("--selftest", action="store_true",
                    help="test parsera na wbudowanym fixture")
    args = ap.parse_args()

    if args.selftest:
        sys.exit(selftest())

    if args.references:
        if args.refs_fixture:
            with open(args.refs_fixture, encoding="utf-8") as fh:
                data, src = json.load(fh), args.refs_fixture
        elif args.act:
            data, src = fetch_eli_references(args.act)
        else:
            print("--references wymaga --act albo --refs-fixture",
                  file=sys.stderr)
            sys.exit(4)
        render_references(parse_references(data), args.act or src, src)
        if args.article is None:
            sys.exit(0)

    if args.article is None or not (args.act or args.fixture):
        ap.print_usage()
        print("Wymagane: --article oraz --act albo --fixture", file=sys.stderr)
        sys.exit(4)

    if args.fixture:
        with open(args.fixture, encoding="utf-8", errors="replace") as fh:
            html = fh.read()
        source, act_label = args.fixture, args.act or args.fixture
        wersja = "FIXTURE LOKALNY"
    else:
        html, source, wersja = fetch_act_text(args.act, args.ogloszony,
                                              args.allow_stale)
        source = "{}  [{}]".format(source, wersja)
        act_label = args.act

    units = parse_units(strip_tags(html))
    result = build_scope(units, args.article, args.index)
    if result is None:
        if not units:
            print("⛔ Odczytany dokument nie zawiera ŻADNEJ jednostki "
                  "redakcyjnej — to awaria pobrania, NIE dowód, że artykuł "
                  "nie istnieje.\n   Wersja: {}\n   Źródło: {}"
                  .format(wersja, source), file=sys.stderr)
            sys.exit(5)
        print("Nie znaleziono art. {} w odczytanym tekście ({} jednostek). "
              "Wersja: {}\n   Źródło: {}\n   ⛔ Brak trafienia NIE jest "
              "dowodem nieistnienia jednostki — sprawdź wersję czasową."
              .format(args.article, len(units), wersja, source),
              file=sys.stderr)
        sys.exit(3)

    edges = build_edges(units, args.article) if args.edges else None

    if args.json:
        payload = dict(result)
        if edges:
            payload["krawedzie"] = edges
        print(json.dumps(payload, ensure_ascii=False, indent=2, default=str))
    else:
        render(result, act_label, args.date, source)
        if edges:
            render_edges(edges)
    sys.exit(0)


if __name__ == "__main__":
    main()
