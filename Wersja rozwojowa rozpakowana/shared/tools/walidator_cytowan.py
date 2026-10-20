#!/usr/bin/env python3
"""
walidator_cytowan.py — deterministyczna warstwa walidacyjna POZA LLM.

Adresuje punkt 1 audytu komercyjnego: "Egzekwowanie bramek jest instrukcyjne,
nie deterministyczne (...) rekomendowałbym deterministyczną warstwę
walidacyjną poza LLM sprawdzającą, czy każde powołanie art./Dz.U. w
finalnym .docx ma odpowiadający log web_fetch w tej samej sesji."

CO TO NAPRAWDĘ SPRAWDZA (i czego NIE sprawdza — ważne):
  Ten walidator wykrywa jedną, najcięższą klasę błędu: cytat obecny w
  dokumencie, dla którego w CAŁEJ sesji nie było ŻADNEJ próby weryfikacji
  na oficjalnym źródle (isap.sejm.gov.pl, orzeczenia.ms.gov.pl, sn.pl,
  nsa.gov.pl, trybunal.gov.pl). To najsilniejszy sygnał całkowitej
  konfabulacji — model nawet nie próbował sprawdzić.

  NIE sprawdza, czy treść przepisu/orzeczenia zacytowana w piśmie jest
  WIERNA temu, co faktycznie zwrócił web_fetch (to wymagałoby porównania
  semantycznego treści, nie tylko obecności zdarzenia weryfikacji — kolejny,
  osobny etap, możliwy do dobudowania, ale nie objęty tą wersją).

SKĄD BIERZE SIĘ LOG WERYFIKACJI:
  Portal, jeśli woła Claude API bezpośrednio, dostaje w treści odpowiedzi
  API bloki content[] typu `server_tool_use` (web_search/web_fetch) oraz
  odpowiadające `web_search_tool_result` — to jest gotowy, ustrukturyzowany
  ślad tego, co faktycznie zweryfikowano w danej sesji. Warstwa integracyjna
  po stronie portalu musi go tylko zapisać jako JSON (patrz SCHEMA_LOGU niżej)
  i podać do tego skryptu PRZED dopuszczeniem do present_files/eksportu .docx.
  To nie wymaga dostępu do wewnętrznej infrastruktury Anthropic — sam log
  jest już częścią standardowej odpowiedzi API.

SCHEMA_LOGU (JSON):
{
  "session_id": "...",
  "events": [
    {"tool": "web_fetch", "url": "https://isap.sejm.gov.pl/...", "query_context": "art. 211 kc zniesienie wspolwlasnosci"},
    {"tool": "web_search", "query": "wyrok SN I CSK 123/24", "result_urls": ["https://sn.pl/..."]}
  ]
}

KONTRAKT query_context (hosty zewnętrzne, shared/UNIVERSAL-RUNTIME-ADAPTER.md §3):
  zdarzenie weryfikacji artykułu MUSI nieść numer artykułu i skrót aktu w zapisie z pisma
  („art. 415 k.c.”), nie tylko ELI/URL. ELI aktu bazowego kodeksu (DU/1964/93 itd., ELI_KODEKSOW)
  walidator sam tłumaczy na skrót; ELI tekstu jednolitego się zmienia — tam skrót jest konieczny.
  Brak skrótu = fałszywy FAIL poprawnie zweryfikowanego przepisu.

Użycie:
    python3 walidator_cytowan.py --document pismo.md --log sesja.json
    python3 walidator_cytowan.py --document pismo.docx --log sesja.json  (wymaga python-docx)
    python3 walidator_cytowan.py --document pismo.docx --format   (kontrola zapisu, bez logu)
    python3 walidator_cytowan.py --self-test

KONTROLA ZAPISU (--format, zgł. #109): reguła shared/FORMAT-CYTOWANIA.md, kody F1–F9.
  Sprawdzana jest treść dla adresata: tekst do nagłówka `CZĘŚĆ ROBOCZA` (dalej metryki są dozwolone).

Testy jednostkowe: tools/test_walidator_cytowan.py (python3 -m unittest test_walidator_cytowan).

Kod wyjścia: 0 = wszystkie cytaty mają odpowiadające zdarzenie weryfikacji (i zapis zgodny, gdy --format)
             1 = co najmniej jedna cytata bez śladu weryfikacji (BLOKADA; pierwszeństwo przed 3)
             3 = naruszenia zapisu powołań (--format)
"""

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote_plus, urlparse

OFFICIAL_DOMAINS = (
    "isap.sejm.gov.pl",
    "api.sejm.gov.pl",  # Sejm ELI API (isap_lookup / isap_tekst)
    "orzeczenia.ms.gov.pl",
    "sn.pl",
    "nsa.gov.pl",
    "trybunal.gov.pl",
    "orzeczenia.nsa.gov.pl",
)

# --- ekstrakcja cytatów ------------------------------------------------

SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹"
_SUP_TO_DIGIT = str.maketrans(SUP, "0123456789")
# Skrót aktu po jednostce: wielkie litery (KPC), z kropkami (k.p.c., p.p.s.a.), mieszany (u.KRS).
SKROT_AKTU = r"(?:[A-ZŁŚŻ]{2,5}(?![\w.])|(?:[a-ząćęłńóśźż]{1,4}\.){1,5}(?:[A-ZŁŚŻ]{2,5}(?![\w.]))?)"
JEDNOSTKA = r"(?:\s?(?:§\s?\d+[a-z]?|ust\.\s?\d+[a-z]?|pkt\s?\d+[a-z]?|lit\.\s?[a-z](?![a-z])|zdanie\s\w+))"

CITATION_PATTERNS = {
    "artykul": re.compile(
        r"art\.\s?\d+[a-z]?(?:[" + SUP + r"]+|\^\d+)?" + JEDNOSTKA + r"*(?:\s" + SKROT_AKTU + r")?",
        re.IGNORECASE,
    ),
    "dziennik_ustaw": re.compile(
        r"Dz\.\s?U\.(?:\s?(?:z\s?)?\d{4}(?:\s?r\.)?)?(?:\s?Nr\s?\d+)?[,.]?\s?poz\.\s?\d+"
        r"|Dz\.\s?U\.\s?\d{4}\.\d+",
        re.IGNORECASE,
    ),
    "sygnatura": re.compile(
        r"\b[IVXLC]{1,4}\s?[A-Z]{1,4}\s?\d{1,5}/\d{2,4}\b"
    ),
}


def extract_citations(text: str):
    found = []
    for kind, pattern in CITATION_PATTERNS.items():
        for m in pattern.finditer(text):
            found.append({"typ": kind, "tekst": m.group(0).strip(), "pozycja": m.start()})
    return found


def read_document_text(path: Path) -> str:
    if path.suffix.lower() == ".docx":
        try:
            import docx  # python-docx
        except ImportError:
            print("BŁĄD: obsługa .docx wymaga `pip install python-docx --break-system-packages`", file=sys.stderr)
            sys.exit(2)
        d = docx.Document(str(path))
        return "\n".join(_docx_akapit(p) for p in _docx_akapity(d))
    return path.read_text(encoding="utf-8", errors="replace")


def _docx_akapit(p) -> str:
    """Tekst akapitu; cyfry w indeksie górnym jako znaki ²² (art. 398²²), nie jako „39822”."""
    out = []
    for run in p.runs:
        t = run.text
        if run.font.superscript and t.strip().isdigit():
            t = t.translate(str.maketrans("0123456789", SUP))
        out.append(t)
    return "".join(out) if p.runs else p.text


def _docx_akapity(d):
    """Akapity treści i komórek tabel (zagnieżdżonych także), w kolejności dokumentu."""
    from docx.table import Table
    from docx.text.paragraph import Paragraph

    def z_kontenera(element, rodzic):
        for el in element.iterchildren():
            tag = el.tag.rsplit("}", 1)[-1]
            if tag == "p":
                yield Paragraph(el, rodzic)
            elif tag == "tbl":
                widziane = set()  # komórka scalona występuje w wierszu wielokrotnie
                for wiersz in Table(el, rodzic).rows:
                    for komorka in wiersz.cells:
                        if id(komorka._tc) not in widziane:
                            widziane.add(id(komorka._tc))
                            yield from z_kontenera(komorka._tc, komorka)

    yield from z_kontenera(d.element.body, d._body)


# --- dopasowanie do logu weryfikacji ------------------------------------

def _oficjalny_url(url) -> bool:
    """https + host równy domenie urzędowej albo jej subdomena (`.<domena>`).
    Host z urlparse, nie podciąg adresu: `https://example.com/?r=isap.sejm.gov.pl`
    i `https://isap.sejm.gov.pl.evil.com/` NIE są urzędowe (zgł. #89)."""
    if not isinstance(url, str):
        return False
    try:
        u = urlparse(url.strip())
    except ValueError:
        return False
    host = (u.hostname or "").rstrip(".")
    if u.scheme != "https" or not host:
        return False
    return any(host == d or host.endswith("." + d) for d in OFFICIAL_DOMAINS)


def _normalizuj(s: str) -> str:
    s = re.sub(r"[" + SUP + r"]+", lambda m: "^" + m.group(0).translate(_SUP_TO_DIGIT), unquote_plus(s))
    return re.sub(r"\s+", " ", s.lower())


def _klucz_skrotu(skrot: str) -> str:
    """KPC, k.p.c., K.P.C. → „kpc”; u.KRS → „ukrs”."""
    return re.sub(r"[^a-ząćęłńóśźż]", "", skrot.lower())


def wzorce_identyfikatora(citation):
    """Pełny, znormalizowany identyfikator cytatu jako lista regexów (dowolny wystarcza).
    Pojedyncze ciągi cyfr nie są już dowodem: „21” nie trafia w „2021”, „5” z „art. 5”
    nie trafia w dowolną liczbę (zgł. #89)."""
    t = citation["tekst"]
    typ = citation["typ"]
    if typ == "dziennik_ustaw":
        m = re.search(r"(\d{4})(?:\s?r\.)?(?:.*?poz\.\s?|\.)(\d+)", t, re.IGNORECASE)
        if not m:
            m = re.search(r"poz\.\s?(\d+)", t, re.IGNORECASE)
            if not m:
                return []
            # „Dz. U. poz. 1061” (bez rocznika): sama pozycja przy oznaczeniu dziennika.
            return [rf"dz\.?\s*u\.?.{{0,16}}?poz\.?\s*0*{int(m.group(1))}(?!\d)"]
        rok, poz = m.group(1), int(m.group(2))
        return [
            rf"dz\.?\s*u\.?\s*(z\s*)?{rok}\s*(r\.?)?\s*(nr\s*\d+)?\s*[,.]?\s*(poz\.?\s*)?0*{poz}(?!\d)",  # Dz.U. 2019 poz. 1145
            rf"(?<![a-z0-9])du/{rok}/0*{poz}(?!\d)",                                       # ELI DU/2019/1145
            rf"wdu{rok}{poz:07d}(?!\d)",                                                   # ISAP WDU20190001145
        ]
    if typ == "sygnatura":
        czlony = re.findall(r"[a-z]+|\d+|/", t.lower())
        return [r"(?<![a-z0-9])" + r"\s*".join(re.escape(c) for c in czlony) + r"(?!\d)"]
    if typ == "artykul":
        tn = _normalizuj(t)
        m = re.match(r"art\.\s?(\d+[a-z]?(?:\^\d+)?)((?:\s?§\s?\d+[a-z]?)?)", tn)
        if not m:
            return []
        nr = m.group(1)
        par = re.search(r"§\s?(\d+[a-z]?)", m.group(2) or "")
        sk = re.search(r"\s(" + SKROT_AKTU + r")\s*$", t)
        kodeks = _klucz_skrotu(sk.group(1)) if sk else ""
        wz = rf"(?<![a-z0-9])art\.?\s*{re.escape(nr)}(?![0-9a-z^])"
        if par:
            wz += rf"(?:\s*(?:ust|pkt|lit|zdanie)\.?\s*\w+)*?\s*§\s*{re.escape(par.group(1))}(?![0-9a-z])"
        wzorce = [wz]
        if kodeks:
            # Skrót w logu w dowolnej postaci: KPC = k.p.c.; „k.p.k.” ≠ „k.p.c.”.
            litery = r"\.?\s?".join(re.escape(c) for c in kodeks)
            wzorce = [w + rf".{{0,80}}?(?<![a-ząćęłńóśźż]){litery}\.?(?![a-ząćęłńóśźż])" for w in wzorce]
        return wzorce
    return []


# ELI aktu bazowego → skrót (sprawdzone w api.sejm.gov.pl 2026-10-20). Zdarzenie z samym ELI kodeksu
# w URL lub query_context potwierdza „art. N <skrót>”; ELI tekstu jednolitego się zmienia (kontrakt wyżej).
ELI_KODEKSOW = {
    (1964, 93): "k.c.", (1964, 296): "k.p.c.", (1997, 553): "k.k.", (1997, 555): "k.p.k.",
    (1997, 557): "k.k.w.", (1974, 141): "k.p.", (1964, 59): "k.r.o.", (2000, 1037): "k.s.h.",
    (1960, 168): "k.p.a.", (1971, 114): "k.w.", (1999, 930): "k.k.s.", (2002, 1270): "p.p.s.a.",
    (2001, 1148): "k.p.w.",
}
_ELI_W_TEKSCIE = re.compile(r"(?<![a-z])du/(\d{4})/(\d{1,5})(?!\d)|wdu(\d{4})\d{3}(\d{4})(?!\d)", re.IGNORECASE)


def _skroty_z_eli(*teksty):
    """Skróty kodeksów, których ELI aktu bazowego (DU/RRRR/N albo id ISAP WDU…) występuje w tekstach."""
    skroty = []
    for t in teksty:
        for m in _ELI_W_TEKSCIE.finditer(t or ""):
            rok, poz = (m.group(1), m.group(2)) if m.group(1) else (m.group(3), m.group(4))
            sk = ELI_KODEKSOW.get((int(rok), int(poz)))
            if sk and sk not in skroty:
                skroty.append(sk)
    return skroty


def log_has_verification(citation, events):
    """Zwraca (True, event), jeśli istnieje zdarzenie z URL na domenie urzędowej
    (host, https), którego query_context/query/URL zawiera PEŁNY identyfikator
    cytatu (Dz.U.: rok + pozycja; sygnatura: całość; artykuł: numer [+ §] [+ kodeks]).
    Nadal nie sprawdza wierności treści — patrz docstring modułu."""
    wzorce = wzorce_identyfikatora(citation)
    if not wzorce:
        return False, None
    for ev in events:
        url = ev.get("url") or ""
        result_urls = [u for u in (ev.get("result_urls") or []) if isinstance(u, str)]
        oficjalne = [u for u in [url, *result_urls] if _oficjalny_url(u)]
        if not oficjalne:
            continue
        kontekst = ev.get("query_context")
        skroty = _skroty_z_eli(str(kontekst or ""), *oficjalne)
        # Skrót z ELI zaraz po kontekście: „art. 415” + DU/1964/93 → „art. 415 k.c.”.
        haystack = " ".join(
            str(x) for x in (kontekst, *skroty, ev.get("query"), *oficjalne) if x
        )
        haystack = _normalizuj(haystack)
        if any(re.search(w, haystack) for w in wzorce):
            return True, ev
    return False, None


# --- kontrola zapisu (shared/FORMAT-CYTOWANIA.md, kody F1–F9) -----------

CZESC_ROBOCZA = re.compile(r"^[#*\s]*CZ[EĘ][SŚ][CĆ]\s+ROBOCZA\b", re.IGNORECASE | re.MULTILINE)
KODEKSY_WIELKIE = r"KPC|KPK|KPA|PPSA|KKS|KKW|KPW|KRO|KSH|KC|KP|KK|KW"
_POWOLANIE_DZ = re.compile(r"\([^()]*?Dz\.\s?U\.[^()]*\)", re.IGNORECASE)
_WPROWADZENIE = re.compile(r"(?:dalej:?|zwan\w*\s+dalej)\s*[„\"]?((?:[a-ząćęłńóśźż]{1,4}\.){1,5})[”\"]?", re.IGNORECASE)
_SKROT_PO_ART = re.compile(
    r"art\.\s?\d+[a-z]?(?:[" + SUP + r"]+|\^\d+)?" + JEDNOSTKA + r"*\s((?:[a-ząćęłńóśźż]{1,4}\.){2,5})(?![a-ząćęłńóśźż])"
)

REGULY_ZAPISU = [
    ("F1", "skrót dziennika bez spacji: „Dz. U.”", re.compile(r"Dz\.U\.")),
    ("F2", "rocznik bez „z … r.”", re.compile(r"Dz\.\s?U\.\s?(?:\d{4}(?!\.\d)|z\s?\d{4}(?!\s?r\.))")),
    ("F3", "dopisek „t.j.”", re.compile(r"(?<![a-ząćęłńóśźż])t\.\s?j\.")),
    ("F4", "„ze zm.” zamiast listy zmian albo „z późn. zm.”", re.compile(r"\bze\s?zm\.")),
    ("F5", "zapis skrócony „Dz.U.RRRR.N”", re.compile(r"Dz\.\s?U\.\s?\d{4}\.\d+")),
    ("F6", "metryka konektora, ELI, status albo URL źródła w treści",
     re.compile(r"(?<![A-Za-z0-9])DU/\d{4}/\d+|\bWDU\d{11}\b|\b(?:NOT_)?IN_FORCE\b|display_?address"
                r"|https?://(?:[\w.-]+\.)?(?:isap\.sejm\.gov\.pl|api\.sejm\.gov\.pl|eli\.gov\.pl)\S*", re.IGNORECASE)),
    ("F7", "skrót kodeksu wielkimi literami (k.p.c., k.c. …)",
     re.compile(r"(?<![\w.])(?:KPC|KPK|KPA|PPSA|KKS|KKW|KPW|KRO|KSH)(?![\w.])"
                r"|art\.[^\n;()]{0,40}?(?<![\w.])(?:" + KODEKSY_WIELKIE + r")(?![\w.])")),
    ("F8", "zapis jednostki: „§ 1”, bez przecinków między jednostkami, indeks górny zamiast „^”",
     re.compile(r"§\d|art\.\s?\d+[a-z]?(?:[" + SUP + r"]+)?,\s?(?:§|ust\.|pkt|lit\.)|art\.\s?\d+[a-z]?\^\d")),
]


def tresc_dla_adresata(text: str) -> str:
    """Tekst do nagłówka `CZĘŚĆ ROBOCZA` (dalej metryki i linki są dozwolone)."""
    m = CZESC_ROBOCZA.search(text)
    return text[: m.start()] if m else text


def kontrola_zapisu(text: str):
    """Naruszenia reguły shared/FORMAT-CYTOWANIA.md w treści dla adresata: lista słowników
    {kod, opis, fragment, pozycja}, w kolejności tekstu."""
    tresc = tresc_dla_adresata(text)
    naruszenia = []
    for kod, opis, wzor in REGULY_ZAPISU:
        for m in wzor.finditer(tresc):
            if kod == "F3" and not re.search(r"Dz\.\s?U\.", tresc[max(0, m.start() - 60): m.end() + 60]):
                continue  # „t.j.” poza powołaniem dziennika (np. w zdaniu o tekście jednolitym)
            naruszenia.append({"kod": kod, "opis": opis, "fragment": m.group(0), "pozycja": m.start()})
    # F9: skrót aktu po artykule użyty przed wprowadzeniem albo nigdy niewprowadzony.
    wprowadzone = {}
    for m in _WPROWADZENIE.finditer(tresc):
        wprowadzone.setdefault(_klucz_skrotu(m.group(1)), m.start())
    for m in _SKROT_PO_ART.finditer(tresc):
        klucz = _klucz_skrotu(m.group(1))
        kiedy = wprowadzone.get(klucz)
        if kiedy is None:
            opis = f"skrót „{m.group(1)}” niewprowadzony (dalej: {m.group(1)})"
        elif m.start(1) < kiedy:
            opis = f"skrót „{m.group(1)}” użyty przed wprowadzeniem"
        else:
            continue
        naruszenia.append({"kod": "F9", "opis": opis, "fragment": m.group(0), "pozycja": m.start()})
    naruszenia.sort(key=lambda n: (n["pozycja"], n["kod"]))
    return naruszenia


def self_test() -> int:
    """Przypadki ze zgł. #89 (negatywne) + pozytywne kontrolne; zgł. #109: skróty, indeksy, zapis F1–F9."""
    def ok(tekst, typ, ev):
        return log_has_verification({"typ": typ, "tekst": tekst}, [ev])[0]
    isap = "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20190001145"
    przypadki = [
        # (opis, oczekiwane, tekst, typ, zdarzenie)
        ("domena w query stringu", False, "Dz.U. 2019 poz. 1145", "dziennik_ustaw",
         {"url": "https://example.com/?r=isap.sejm.gov.pl", "query_context": "Dz.U. 2019 poz. 1145"}),
        ("domena jako prefiks obcego hosta", False, "Dz.U. 2019 poz. 1145", "dziennik_ustaw",
         {"url": "https://isap.sejm.gov.pl.evil.com/WDU20190001145"}),
        ("result_urls bez https", False, "Dz.U. 2019 poz. 1145", "dziennik_ustaw",
         {"query": "Dz.U. 2019 poz. 1145", "result_urls": ["http://isap.sejm.gov.pl/x"]}),
        ("result_urls: domena w ścieżce obcego hosta", False, "Dz.U. 2019 poz. 1145", "dziennik_ustaw",
         {"query": "Dz.U. 2019 poz. 1145", "result_urls": ["https://example.com/isap.sejm.gov.pl"]}),
        ("token '21' w '2021'", False, "Dz.U. 2021 poz. 21", "dziennik_ustaw",
         {"url": isap, "query_context": "Dz.U. 2021 poz. 2105"}),
        ("art. 5 ust. 1 vs inne liczby", False, "art. 5 KC", "artykul",
         {"url": isap, "query_context": "art. 15 KC, ust. 1, Dz.U. 2025 poz. 5"}),
        ("art. 211 vs art. 211a", False, "art. 211 KC", "artykul",
         {"url": isap, "query_context": "art. 211a KC"}),
        ("sygnatura nieistniejąca (inna liczba)", False, "I CSK 4821/23", "sygnatura",
         {"url": "https://www.sn.pl/x", "query_context": "I CSK 482/23"}),
        ("sygnatura z innym wydziałem (literą)", False, "I CSK 4821/23", "sygnatura",
         {"url": "https://www.sn.pl/x", "query_context": "II CSK 4821/23"}),
        ("pozytyw: Dz.U. w URL ISAP", True, "Dz.U. 2019 poz. 1145", "dziennik_ustaw", {"url": isap}),
        ("pozytyw: ELI", True, "Dz.U. 2019 poz. 1145", "dziennik_ustaw",
         {"url": "https://isap.sejm.gov.pl/x", "query_context": "ELI DU/2019/1145"}),
        ("pozytyw: subdomena www.sn.pl", True, "I CSK 4821/23", "sygnatura",
         {"query": "wyrok SN I CSK 4821/23", "result_urls": ["https://www.sn.pl/x"]}),
        ("pozytyw: art. z §", True, "art. 415 § 1 KC", "artykul",
         {"url": isap, "query_context": "art. 415 § 1 kodeksu cywilnego (KC)"}),
        ("query_context = None", False, "art. 5 KC", "artykul", {"url": isap, "query_context": None}),
        ("pozytyw: ELI KC w URL, skrót w piśmie", True, "art. 415 k.c.", "artykul",
         {"url": "https://api.sejm.gov.pl/eli/acts/DU/1964/93/text.pdf", "query_context": "art. 415"}),
        ("pozytyw: id ISAP KC (WDU19640160093)", True, "art. 415 k.c.", "artykul",
         {"url": "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19640160093", "query_context": "art. 415"}),
        ("ELI KC nie potwierdza k.p.c.", False, "art. 415 k.p.c.", "artykul",
         {"url": "https://api.sejm.gov.pl/eli/acts/DU/1964/93/text.pdf", "query_context": "art. 415"}),
        ("ELI 1964/930 to nie KC (1964/93)", False, "art. 415 k.c.", "artykul",
         {"url": "https://api.sejm.gov.pl/eli/acts/DU/1964/930", "query_context": "art. 415"}),
    ]
    # Dopasowanie skrótów i indeksów górnych do logu (zgł. #109).
    def z_tekstu(cytat, kontekst):
        c = extract_citations(cytat)[0]
        return log_has_verification(c, [{"url": isap, "query_context": kontekst}])[0]
    logi = [
        ("k.p.c. = KPC", True, "art. 130 § 1 k.p.c.", "art. 130 § 1 KPC"),
        ("KPC = k.p.c.", True, "art. 130 § 1 KPC", "art. 130 § 1 k.p.c."),
        ("k.p.c. ≠ k.p.k.", False, "art. 130 k.p.c.", "art. 130 k.p.k."),
        ("398²² = 398^22", True, "art. 398²² k.p.c.", "art. 398^22 KPC"),
        ("398²² ≠ 398", False, "art. 398²² k.p.c.", "art. 398 KPC"),
    ]
    # Kontrola zapisu (shared/FORMAT-CYTOWANIA.md): oczekiwany zbiór kodów naruszeń.
    zapisy = [
        ("t.j., Dz.U., ze zm.", {"F1", "F3", "F4"}, "(t.j. Dz.U. z 2025 r. poz. 869 ze zm.)"),
        ("Dz.U. bez z … r.", {"F1", "F2"}, "(Dz.U. 2025 poz. 869)"),
        ("zapis skrócony", {"F1", "F3", "F5"}, "(Dz.U.2025.383 t.j.)"),
        ("brak r.", {"F2"}, "(Dz. U. z 2025 poz. 869)"),
        ("§1 i KPC", {"F7", "F8"}, "art. 130 §1 KPC"),
        ("indeks ^", {"F8"}, "kodeks (Dz. U. z 2025 r. poz. 1; dalej: k.p.c.), art. 398^22 § 1 k.p.c."),
        ("skrót przed wprowadzeniem", {"F9"}, "art. 5 k.c. … (Dz. U. z 2026 r. poz. 795; dalej: k.c.)"),
        ("metryka w treści", {"F6"}, "(DU/2025/869, IN_FORCE)"),
        ("metryka w części roboczej", set(), "Treść.\n\nCZĘŚĆ ROBOCZA\n(DU/2025/869, IN_FORCE) Dz.U. 2025 poz. 869"),
        ("skrót wprowadzony", set(), "(Dz. U. z 2026 r. poz. 795; dalej: k.c.), potem art. 415 k.c."),
        ("dziennik z numerem", set(), "(Dz. U. z 1997 r. Nr 89, poz. 555)"),
        ("bez rocznika", set(), "(Dz. U. poz. 1061)"),
        ("przecinek między jednostkami", {"F8"}, "art. 5, ust. 2 ustawy"),
    ]
    bledy = 0
    for opis, oczekiwane, tekst, typ, ev in przypadki:
        wynik = ok(tekst, typ, ev)
        if wynik != oczekiwane:
            bledy += 1
            print(f"FAIL: {opis}: oczekiwano {oczekiwane}, jest {wynik}")
    for opis, oczekiwane, cytat, kontekst in logi:
        wynik = z_tekstu(cytat, kontekst)
        if wynik != oczekiwane:
            bledy += 1
            print(f"FAIL: {opis}: oczekiwano {oczekiwane}, jest {wynik}")
    for opis, oczekiwane, tekst in zapisy:
        wynik = {n["kod"] for n in kontrola_zapisu(tekst)}
        if wynik != oczekiwane:
            bledy += 1
            print(f"FAIL (zapis): {opis}: oczekiwano {sorted(oczekiwane)}, jest {sorted(wynik)}")
    razem = len(przypadki) + len(logi) + len(zapisy)
    print(f"SELF-TEST: {razem - bledy}/{razem} OK")
    return 1 if bledy else 0


def raport_zapisu(text: str, quiet: bool = False) -> int:
    naruszenia = kontrola_zapisu(text)
    if not quiet:
        print(f"KONTROLA ZAPISU (shared/FORMAT-CYTOWANIA.md): naruszeń {len(naruszenia)}")
        for n in naruszenia:
            print(f"  ✗ {n['kod']} {n['fragment']!r} (pozycja {n['pozycja']}) — {n['opis']}")
        if not naruszenia:
            print("  ✓ zapis powołań zgodny z regułą")
    return 3 if naruszenia else 0


def main():
    # Konsola Windows (cp1250) nie zna „✗”/„✓”: bez tego --format kończy się UnicodeEncodeError
    # i kodem 1 zamiast 3 (zgłoszenie Kajetana Ciunelisa, #109).
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--document", type=Path)
    ap.add_argument("--log", type=Path)
    ap.add_argument("--format", action="store_true", help="kontrola zapisu powołań (kody F1–F9), bez logu")
    ap.add_argument("--quiet", action="store_true")
    ap.add_argument("--self-test", action="store_true")
    args = ap.parse_args()
    if args.self_test:
        sys.exit(self_test())
    if not args.document or not (args.log or args.format):
        ap.error("wymagane --document z --log i/lub --format (albo --self-test)")

    text = read_document_text(args.document)
    kod_zapisu = raport_zapisu(text, args.quiet) if args.format else 0
    if not args.log:
        sys.exit(kod_zapisu)
    if args.format and not args.quiet:
        print()

    citations = extract_citations(text)

    log_data = json.loads(args.log.read_text(encoding="utf-8"))
    events = log_data.get("events", [])

    results = []
    for c in citations:
        verified, ev = log_has_verification(c, events)
        results.append((c, verified, ev))

    unverified = [r for r in results if not r[1]]

    if not args.quiet:
        print(f"walidator_cytowan.py — dokument: {args.document.name} | log: {args.log.name}")
        print(f"Znaleziono {len(citations)} powołań, zdarzeń weryfikacji w logu: {len(events)}\n")
        for c, verified, ev in results:
            status = "OK" if verified else "BRAK WERYFIKACJI"
            marker = "✓" if verified else "✗"
            print(f"  {marker} [{status:16}] ({c['typ']:14}) {c['tekst']!r}")
            if verified:
                print(f"        potwierdzone przez: {ev.get('url') or ev.get('query')}")
        print()
        if unverified:
            print(f"WYNIK: FAIL — {len(unverified)}/{len(citations)} powołań bez śladu weryfikacji na oficjalnym źródle.")
            print("Dokument NIE powinien trafić do present_files/eksportu .docx bez ręcznej weryfikacji poniższych:")
            for c, verified, ev in unverified:
                print(f"    - {c['tekst']!r} (pozycja w tekście: {c['pozycja']})")
        else:
            print("WYNIK: OK — każde powołanie ma odpowiadające zdarzenie weryfikacji na oficjalnym źródle.")
            print("(Nie potwierdza to wierności treści cytatu — tylko fakt próby weryfikacji. Patrz docstring.)")

    sys.exit(1 if unverified else kod_zapisu)


if __name__ == "__main__":
    main()
