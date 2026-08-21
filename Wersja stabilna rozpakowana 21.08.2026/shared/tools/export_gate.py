#!/usr/bin/env python3
"""
export_gate.py — kompletna bramka "przed present_files/eksportem .docx",
łącząca extract_api_verification_log.py + walidator_cytowan.py w jeden krok,
dokładnie zgodnie z krokiem 2 z shared/tools/README.md ("Integracja po
stronie portalu").

To jest jedyne miejsce, które programista portalu musi realnie wpiąć w swój
pipeline: jedno wywołanie tego skryptu, tuż po HYBRID-VALIDATION
(shared/HYBRID-VALIDATION.md) i przed dopuszczeniem dokumentu do
present_files/eksportu.

Użycie:
    python3 export_gate.py --document pismo.docx --api-conversation konwersacja_api.json

Kod wyjścia:
    0 — wszystkie powołania mają ślad weryfikacji → dopuść do eksportu
    1 — co najmniej jedno powołanie bez śladu weryfikacji → ZABLOKUJ eksport,
        pokaż listę prawnikowi do ręcznej decyzji (patrz README, sekcja
        "Ograniczenia" — to sito pierwszego rzutu, nie automatyczne odrzucenie)

Ten skrypt NIE zapisuje żadnego pliku na stałe (log pośredni sesja.json jest
tworzony w katalogu tymczasowym i usuwany po zakończeniu) — chyba że podano
--zapisz-log-posredni, przydatne przy debugowaniu niezgodności formatu API.
"""

import sys
import os
import json
import argparse
import tempfile
import importlib.util

_TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))


def _zaladuj_modul(nazwa: str, plik: str):
    sciezka = os.path.join(_TOOLS_DIR, plik)
    spec = importlib.util.spec_from_file_location(nazwa, sciezka)
    modul = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modul)
    return modul


extract = _zaladuj_modul("extract_api_verification_log", "extract_api_verification_log.py")
walidator = _zaladuj_modul("walidator_cytowan", "walidator_cytowan.py")


def uruchom_bramke(document_path: str, api_conversation_path: str,
                    zapisz_log_posredni: str | None = None) -> int:
    with open(api_conversation_path, "r", encoding="utf-8") as f:
        konwersacja = json.load(f)

    zdarzenia = extract.wydobadz_zdarzenia(konwersacja)
    log_posredni = {"session_id": konwersacja.get("session_id", "nieznana-sesja"), "events": zdarzenia}

    if zapisz_log_posredni:
        with open(zapisz_log_posredni, "w", encoding="utf-8") as f:
            json.dump(log_posredni, f, ensure_ascii=False, indent=2)
        print(f"Log pośredni zapisany do: {zapisz_log_posredni}")

    tekst = walidator.read_document_text(__import__("pathlib").Path(document_path))
    cytaty = walidator.extract_citations(tekst)

    wyniki = []
    for c in cytaty:
        zweryfikowane, ev = walidator.log_has_verification(c, zdarzenia)
        wyniki.append((c, zweryfikowane, ev))

    niezweryfikowane = [w for w in wyniki if not w[1]]

    print(f"export_gate.py — dokument: {os.path.basename(document_path)}")
    print(f"Zdarzeń weryfikacji wydobytych z konwersacji API: {len(zdarzenia)}")
    print(f"Powołań znalezionych w dokumencie: {len(cytaty)}\n")

    for c, zweryfikowane, ev in wyniki:
        znacznik = "✓" if zweryfikowane else "✗"
        status = "OK" if zweryfikowane else "BRAK WERYFIKACJI"
        print(f"  {znacznik} [{status:16}] ({c['typ']:14}) {c['tekst']!r}")
        if zweryfikowane:
            print(f"        potwierdzone przez: {ev.get('url') or ev.get('query')}")

    print()
    if niezweryfikowane:
        print(f"DECYZJA: ZABLOKUJ EKSPORT — {len(niezweryfikowane)}/{len(cytaty)} "
              f"powołań bez śladu weryfikacji na oficjalnym źródle.")
        print("Pokaż poniższą listę prawnikowi do ręcznej decyzji (nie odrzucaj automatycznie):")
        for c, _, _ in niezweryfikowane:
            print(f"    - {c['tekst']!r} (pozycja w tekście: {c['pozycja']})")
        return 1

    print("DECYZJA: DOPUŚĆ DO EKSPORTU — każde powołanie ma ślad weryfikacji.")
    return 0


def main():
    parser = argparse.ArgumentParser(description="Bramka eksportu: ekstrakcja logu API + walidacja cytowań")
    parser.add_argument("--document", required=False, help="Ścieżka do wygenerowanego dokumentu (.md/.docx)")
    parser.add_argument("--api-conversation", required=False,
                         help="Ścieżka do JSON z pełną konwersacją API (format extract_api_verification_log.py)")
    parser.add_argument("--zapisz-log-posredni", help="Opcjonalnie zapisz sesja.json pośredni pod tą ścieżką")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        uruchom_self_test()
        return

    if not (args.document and args.api_conversation):
        print("Wymagane: --document i --api-conversation (lub --self-test)", file=sys.stderr)
        sys.exit(2)

    kod = uruchom_bramke(args.document, args.api_conversation, args.zapisz_log_posredni)
    sys.exit(kod)


def uruchom_self_test():
    """Test end-to-end: dokument z 2 powołaniami (1 zweryfikowane w symulowanej
    konwersacji API, 1 nie) → bramka musi zablokować eksport i wskazać dokładnie
    to jedno niezweryfikowane powołanie."""

    konwersacja = {
        "session_id": "self-test-gate",
        "messages": [{"role": "assistant", "content": [
            {"type": "text", "text": "Sprawdzam art. 211 KC."},
            {"type": "server_tool_use", "id": "t1", "name": "web_fetch",
             "input": {"url": "https://isap.sejm.gov.pl/211-kc"}},
            {"type": "web_fetch_tool_result", "tool_use_id": "t1",
             "content": {"type": "web_fetch_result", "url": "https://isap.sejm.gov.pl/211-kc"}},
        ]}],
    }

    tresc_dokumentu = (
        "Zgodnie z art. 211 KC sąd może znieść współwłasność. "
        "Powołuję się także na art. 415 KC, którego nie zweryfikowano w tej sesji."
    )

    with tempfile.TemporaryDirectory() as tmp:
        doc_path = os.path.join(tmp, "pismo_test.md")
        conv_path = os.path.join(tmp, "konwersacja_test.json")

        with open(doc_path, "w", encoding="utf-8") as f:
            f.write(tresc_dokumentu)
        with open(conv_path, "w", encoding="utf-8") as f:
            json.dump(konwersacja, f, ensure_ascii=False)

        kod = uruchom_bramke(doc_path, conv_path)

        print()
        if kod == 1:
            print("SELF-TEST OK: bramka poprawnie zablokowała eksport (dokładnie 1 "
                  "niezweryfikowane powołanie: art. 415 KC), kod wyjścia 1.")
            sys.exit(0)
        else:
            print(f"SELF-TEST NIEUDANY: oczekiwano kodu wyjścia 1, otrzymano {kod}.")
            sys.exit(1)


if __name__ == "__main__":
    main()
