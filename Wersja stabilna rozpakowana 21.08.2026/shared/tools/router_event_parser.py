"""
router_event_parser.py — wydobywa znaczniki zdarzeń audytowych z tekstu
odpowiedzi Claude/routera i dopisuje je do logu przez append_event.py.

## Konwencja znacznika (do wdrożenia przez programistę w promptach/narzędziach
## portalu — NIE jest to coś, co router robi dziś "z automatu")

Żeby połączyć router (`prawny-router-v3`) z audit-trail bez trwałej pamięci po
stronie modelu, portal może poprosić model (przez instrukcję systemową na
poziomie portalu, poza tym repozytorium skilli) o embedowanie w odpowiedzi
niewidocznego dla użytkownika końcowego znacznika HTML-comment w miejscach
odpowiadających tabeli z shared/AUDIT-TRAIL-SPEC.md, np.:

    <!--AUDIT_EVENT:{"event":"HARDGATE_VERIFICATION","session_id":"abc-123",
    "payload":{"typ":"akt","identyfikator":"Dz.U. 2025 poz. 1071","zrodlo":"MCP",
    "wynik":"VERIFIED"}}-->

Ten skrypt: (1) skanuje surowy tekst odpowiedzi pod kątem takich znaczników,
(2) waliduje że `event` jest jednym z 8 dozwolonych typów, (3) dopisuje każdy
poprawny znacznik do logu hash-chain przez `append_event.dopisz_zdarzenie()`.

⚠️ Status: parser przetestowany lokalnie na przykładowym tekście (patrz
`--self-test`). Wprowadzenie samej konwencji znacznika w odpowiedziach modelu
to decyzja i implementacja po stronie portalu (system prompt/narzędzie portalu),
poza zakresem tego repozytorium skilli — ten skrypt zakłada, że znaczniki już
się pojawiają w tekście i trzeba je wyłuskać + zapisać.
"""

import re
import sys
import json
import argparse

sys.path.insert(0, __file__.rsplit("/", 1)[0])
try:
    from append_event import dopisz_zdarzenie, TYPY_ZDARZEN
except ImportError:
    # umożliwia uruchomienie tego pliku z innego katalogu roboczego
    import importlib.util
    import os
    _p = os.path.join(os.path.dirname(os.path.abspath(__file__)), "append_event.py")
    _spec = importlib.util.spec_from_file_location("append_event", _p)
    _mod = importlib.util.module_from_spec(_spec)
    _spec.loader.exec_module(_mod)
    dopisz_zdarzenie = _mod.dopisz_zdarzenie
    TYPY_ZDARZEN = _mod.TYPY_ZDARZEN


ZNACZNIK_WZORZEC = re.compile(r"<!--AUDIT_EVENT:(\{.*?\})-->", re.DOTALL)


def wydobadz_zdarzenia(tekst: str) -> list[dict]:
    """Zwraca listę poprawnie sparsowanych zdarzeń ze znaczników w tekście.
    Znaczniki z niepoprawnym JSON-em lub nieznanym typem zdarzenia są pomijane
    i zgłaszane na stderr (nie przerywają przetwarzania reszty tekstu)."""
    znalezione = []
    for i, dopasowanie in enumerate(ZNACZNIK_WZORZEC.finditer(tekst)):
        surowy_json = dopasowanie.group(1)
        try:
            zdarzenie = json.loads(surowy_json)
        except json.JSONDecodeError as exc:
            print(f"OSTRZEŻENIE: znacznik #{i} ma niepoprawny JSON, pomijam: {exc}", file=sys.stderr)
            continue

        if zdarzenie.get("event") not in TYPY_ZDARZEN:
            print(f"OSTRZEŻENIE: znacznik #{i} ma nieznany typ zdarzenia "
                  f"'{zdarzenie.get('event')}', pomijam", file=sys.stderr)
            continue

        if "session_id" not in zdarzenie:
            print(f"OSTRZEŻENIE: znacznik #{i} bez session_id, pomijam", file=sys.stderr)
            continue

        znalezione.append(zdarzenie)
    return znalezione


def przetworz_i_zapisz(tekst: str, sciezka_logu: str) -> int:
    zdarzenia = wydobadz_zdarzenia(tekst)
    for z in zdarzenia:
        dopisz_zdarzenie(sciezka_logu, z["event"], z["session_id"], z.get("payload", {}))
    return len(zdarzenia)


def main():
    parser = argparse.ArgumentParser(
        description="Wydobądź znaczniki AUDIT_EVENT z odpowiedzi routera i zapisz do logu")
    parser.add_argument("--input", help="Plik z tekstem odpowiedzi (lub '-' dla stdin)")
    parser.add_argument("--log", help="Plik logu .jsonl, do którego dopisać zdarzenia")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        uruchom_self_test()
        return

    if not (args.input and args.log):
        print("Wymagane: --input i --log (lub --self-test)", file=sys.stderr)
        sys.exit(2)

    tekst = sys.stdin.read() if args.input == "-" else open(args.input, encoding="utf-8").read()
    liczba = przetworz_i_zapisz(tekst, args.log)
    print(f"Zapisano {liczba} zdarzeń do {args.log}")


def uruchom_self_test():
    import tempfile
    import os

    przyklad_tekstu = """
    Oto analiza sprawy...

    <!--AUDIT_EVENT:{"event":"SESSION_START","session_id":"sesja-42","payload":{"tryb":"LAIK"}}-->

    Zweryfikowałem powołanie w oficjalnym źródle.

    <!--AUDIT_EVENT:{"event":"HARDGATE_VERIFICATION","session_id":"sesja-42","payload":{"identyfikator":"Dz.U. 2025 poz. 1071","wynik":"VERIFIED"}}-->

    <!--AUDIT_EVENT:{"event":"TYP_KTOREGO_NIE_MA","session_id":"sesja-42","payload":{}}-->

    <!--AUDIT_EVENT:{niepoprawny json}-->

    Koniec odpowiedzi.
    """

    with tempfile.TemporaryDirectory() as tmp:
        log_path = os.path.join(tmp, "log.jsonl")
        liczba = przetworz_i_zapisz(przyklad_tekstu, log_path)

        with open(log_path, encoding="utf-8") as f:
            wpisy = [json.loads(l) for l in f if l.strip()]

        oczekiwane_liczba = 2  # tylko 2 z 4 znaczników są poprawne
        if liczba == oczekiwane_liczba == len(wpisy):
            print(f"SELF-TEST OK: wydobyto i zapisano {liczba}/2 poprawnych zdarzeń, "
                  f"2 niepoprawne znaczniki poprawnie odrzucone (patrz OSTRZEŻENIA powyżej).")
            sys.exit(0)
        else:
            print(f"SELF-TEST NIEUDANY: oczekiwano {oczekiwane_liczba} zdarzeń, otrzymano {liczba}.")
            sys.exit(1)


if __name__ == "__main__":
    main()
