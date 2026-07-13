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

Kod wyjścia: 0 = wszystkie cytaty mają odpowiadające zdarzenie weryfikacji
             1 = co najmniej jedna cytata bez śladu weryfikacji (BLOKADA)
"""

import argparse
import json
import re
import sys
from pathlib import Path

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

def tokenize_citation(citation_text: str):
    """Wyciąga tokeny identyfikujące cytat (numery, lata) do dopasowania
    fuzzy wobec query_context/url w logu — np. z 'Dz.U. 2023 poz. 1691'
    wyciąga {'2023', '1691'}; z 'art. 211 KC' wyciąga {'211'}."""
    return set(re.findall(r"\d+", citation_text))


def log_has_verification(citation, events):
    """Zwraca (True, event) jeśli istnieje zdarzenie na oficjalnej domenie
    zawierające co najmniej jeden token liczbowy z cytatu w query_context
    lub w URL. Fuzzy z definicji — patrz docstring modułu, sekcja 'czego
    NIE sprawdza'."""
    tokens = tokenize_citation(citation["tekst"])
    if not tokens:
        return False, None
    for ev in events:
        haystack_parts = [
            ev.get("query_context", ""),
            ev.get("query", ""),
            ev.get("url", ""),
            " ".join(ev.get("result_urls", []) or []),
        ]
        haystack = " ".join(haystack_parts).lower()
        is_official = ev.get("url", "").startswith("https://") and any(
            d in ev.get("url", "") for d in OFFICIAL_DOMAINS
        )
        is_official = is_official or any(
            d in u for u in (ev.get("result_urls", []) or []) for d in OFFICIAL_DOMAINS
        )
        if not is_official:
            continue
        if any(tok in haystack for tok in tokens):
            return True, ev
    return False, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--document", required=True, type=Path)
    ap.add_argument("--log", required=True, type=Path)
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

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
