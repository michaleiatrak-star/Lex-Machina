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

Użycie:
    python3 walidator_cytowan.py --document pismo.md --log sesja.json
    python3 walidator_cytowan.py --document pismo.docx --log sesja.json  (wymaga python-docx)
    python3 walidator_cytowan.py --self-test

Testy jednostkowe: tools/test_walidator_cytowan.py (python3 -m unittest test_walidator_cytowan).

Kod wyjścia: 0 = wszystkie cytaty mają odpowiadające zdarzenie weryfikacji
             1 = co najmniej jedna cytata bez śladu weryfikacji (BLOKADA)
"""

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote_plus, urlparse

OFFICIAL_DOMAINS = (
    "isap.sejm.gov.pl",
    "orzeczenia.ms.gov.pl",
    "sn.pl",
    "nsa.gov.pl",
    "trybunal.gov.pl",
    "orzeczenia.nsa.gov.pl",
)

# --- ekstrakcja cytatów ------------------------------------------------

CITATION_PATTERNS = {
    "artykul": re.compile(
        r"art\.\s?\d+[a-z]?(?:\s?§\s?\d+[a-z]?)?(?:\s?(?:KC|KPC|KK|KPK|KP|KRO|KSH|KPA|KSCU|KPSW|KW))?",
        re.IGNORECASE,
    ),
    "dziennik_ustaw": re.compile(
        r"Dz\.\s?U\.\s?(?:z\s?)?\d{4}(?:\s?r\.)?[,.]?\s?poz\.\s?\d+", re.IGNORECASE
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
        return "\n".join(p.text for p in d.paragraphs)
    return path.read_text(encoding="utf-8", errors="replace")


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
    return re.sub(r"\s+", " ", unquote_plus(s).lower())


def wzorce_identyfikatora(citation):
    """Pełny, znormalizowany identyfikator cytatu jako lista regexów (dowolny wystarcza).
    Pojedyncze ciągi cyfr nie są już dowodem: „21” nie trafia w „2021”, „5” z „art. 5”
    nie trafia w dowolną liczbę (zgł. #89)."""
    t = citation["tekst"]
    typ = citation["typ"]
    if typ == "dziennik_ustaw":
        m = re.search(r"(\d{4}).*?poz\.\s?(\d+)", t, re.IGNORECASE)
        if not m:
            return []
        rok, poz = m.group(1), int(m.group(2))
        return [
            rf"dz\.?\s*u\.?\s*(z\s*)?{rok}\s*(r\.?)?\s*[,.]?\s*poz\.?\s*0*{poz}(?!\d)",  # Dz.U. 2019 poz. 1145
            rf"(?<![a-z0-9])du/{rok}/0*{poz}(?!\d)",                                       # ELI DU/2019/1145
            rf"wdu{rok}{poz:07d}(?!\d)",                                                   # ISAP WDU20190001145
        ]
    if typ == "sygnatura":
        czlony = re.findall(r"[a-z]+|\d+|/", t.lower())
        return [r"(?<![a-z0-9])" + r"\s*".join(re.escape(c) for c in czlony) + r"(?!\d)"]
    if typ == "artykul":
        m = re.match(
            r"art\.\s?(\d+[a-z]?)(?:\s?§\s?(\d+[a-z]?))?(?:\s?([a-z]+))?\s*$", t, re.IGNORECASE
        )
        if not m:
            return []
        nr, par, kodeks = m.group(1).lower(), m.group(2), m.group(3)
        wz = rf"(?<![a-z0-9])art\.?\s*{re.escape(nr)}(?![0-9a-z])"
        if par:
            wz += rf"\s*§\s*{re.escape(par.lower())}(?![0-9a-z])"
        if kodeks:
            wz += rf".{{0,80}}?(?<![a-z]){re.escape(kodeks.lower())}(?![a-z])"
        return [wz]
    return []


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
        haystack = " ".join(
            str(x) for x in (ev.get("query_context"), ev.get("query"), *oficjalne) if x
        )
        haystack = _normalizuj(haystack)
        if any(re.search(w, haystack) for w in wzorce):
            return True, ev
    return False, None


def self_test() -> int:
    """Przypadki ze zgł. #89 (negatywne) + pozytywne kontrolne."""
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
    ]
    bledy = 0
    for opis, oczekiwane, tekst, typ, ev in przypadki:
        wynik = ok(tekst, typ, ev)
        if wynik != oczekiwane:
            bledy += 1
            print(f"FAIL: {opis}: oczekiwano {oczekiwane}, jest {wynik}")
    print(f"SELF-TEST: {len(przypadki) - bledy}/{len(przypadki)} OK")
    return 1 if bledy else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--document", type=Path)
    ap.add_argument("--log", type=Path)
    ap.add_argument("--quiet", action="store_true")
    ap.add_argument("--self-test", action="store_true")
    args = ap.parse_args()
    if args.self_test:
        sys.exit(self_test())
    if not (args.document and args.log):
        ap.error("wymagane --document i --log (albo --self-test)")

    text = read_document_text(args.document)
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

    sys.exit(1 if unverified else 0)


if __name__ == "__main__":
    main()
