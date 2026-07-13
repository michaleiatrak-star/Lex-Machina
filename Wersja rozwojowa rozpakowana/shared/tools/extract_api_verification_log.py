#!/usr/bin/env python3
"""
extract_api_verification_log.py — buduje `sesja.json` (SCHEMA_LOGU wymagany
przez walidator_cytowan.py) z surowej odpowiedzi/konwersacji Claude API.

Adresuje krok 1 z shared/tools/README.md, sekcja "Integracja po stronie
portalu — co realnie trzeba dobudować": README opisywał CO trzeba zrobić
("zapisz bloki server_tool_use/*_tool_result do logu sesji"), ale nie
dostarczał KODU, który to faktycznie robi. Ten skrypt to domyka.

## Format wejściowy oczekiwany przez ten skrypt

JSON reprezentujący całą konwersację (nie pojedynczy request), postaci:

{
  "session_id": "...",
  "messages": [
    {"role": "assistant", "content": [
        {"type": "text", "text": "Sprawdzam art. 211 KC w ISAP..."},
        {"type": "server_tool_use", "id": "toolu_1", "name": "web_fetch",
         "input": {"url": "https://isap.sejm.gov.pl/..."}},
        {"type": "web_fetch_tool_result", "tool_use_id": "toolu_1",
         "content": {"type": "web_fetch_result", "url": "https://isap.sejm.gov.pl/..."}},

        {"type": "text", "text": "Weryfikuję wyrok SN I CSK 123/24..."},
        {"type": "server_tool_use", "id": "toolu_2", "name": "web_search",
         "input": {"query": "wyrok SN I CSK 123/24"}},
        {"type": "web_search_tool_result", "tool_use_id": "toolu_2",
         "content": [{"type": "web_search_result", "url": "https://sn.pl/...", "title": "..."}]}
    ]}
  ]
}

⚠️ WAŻNE ZASTRZEŻENIE: kształt bloków `server_tool_use` / `web_search_tool_result`
/ `web_fetch_tool_result` odzwierciedla udokumentowaną strukturę odpowiedzi
Anthropic API w chwili pisania tego skryptu. Programista portalu MUSI
zweryfikować to względem RZECZYWISTEJ odpowiedzi API, którą faktycznie
otrzymuje (nazwy pól bywają rozszerzane; jeśli portal korzysta z SDK, kształt
bloków może różnić się w drobnych szczegółach od surowego JSON-a). Ten skrypt
był testowany wyłącznie na syntetycznych danych zbudowanych wg powyższego
schematu — patrz `--self-test` i sekcja "Status testów" w dokumentacji.

## Logika ekstrakcji

Dla każdego bloku `server_tool_use` w kolejności występowania:
  - zapamiętaj ostatni napotkany blok `text` w tej samej wiadomości jako
    `query_context` (to zwykle zawiera numer artykułu/Dz.U./sygnatury, którego
    dotyczy weryfikacja — najbardziej wiarygodne źródło dopasowania fuzzy
    w walidator_cytowan.py, silniejsze niż sam URL czy query)
  - dopasuj odpowiadający blok `*_tool_result` po `tool_use_id`
  - zbuduj zdarzenie zgodne ze SCHEMA_LOGU walidator_cytowan.py

Bloki bez dopasowanego wyniku (np. narzędzie w trakcie wykonywania, ucięta
odpowiedź) są pomijane z ostrzeżeniem — nie generują fałszywego zdarzenia
weryfikacji.

Użycie:
    python3 extract_api_verification_log.py --input konwersacja_api.json --out sesja.json
"""

import sys
import json
import argparse


def wydobadz_zdarzenia(konwersacja: dict) -> list[dict]:
    zdarzenia = []
    ostrzezenia = []

    for msg_idx, message in enumerate(konwersacja.get("messages", [])):
        if message.get("role") != "assistant":
            continue

        content = message.get("content", [])
        ostatni_tekst = None
        oczekujace = {}  # tool_use_id -> {"tool": ..., "input": ..., "query_context": ...}

        for blok in content:
            typ = blok.get("type")

            if typ == "text":
                ostatni_tekst = blok.get("text", "")

            elif typ == "server_tool_use":
                nazwa = blok.get("name")
                if nazwa in ("web_search", "web_fetch"):
                    oczekujace[blok.get("id")] = {
                        "tool": nazwa,
                        "input": blok.get("input", {}),
                        "query_context": ostatni_tekst,
                    }

            elif typ in ("web_search_tool_result", "web_fetch_tool_result"):
                tool_use_id = blok.get("tool_use_id")
                oczekujacy = oczekujace.pop(tool_use_id, None)
                if oczekujacy is None:
                    ostrzezenia.append(
                        f"wiadomość #{msg_idx}: wynik narzędzia bez pasującego "
                        f"server_tool_use (tool_use_id={tool_use_id}), pomijam"
                    )
                    continue

                if oczekujacy["tool"] == "web_search":
                    wyniki = blok.get("content", []) or []
                    result_urls = [w.get("url") for w in wyniki if isinstance(w, dict) and w.get("url")]
                    zdarzenia.append({
                        "tool": "web_search",
                        "query": oczekujacy["input"].get("query"),
                        "result_urls": result_urls,
                        "query_context": oczekujacy["query_context"],
                    })
                else:  # web_fetch
                    tresc_wyniku = blok.get("content", {})
                    url = oczekujacy["input"].get("url") or (
                        tresc_wyniku.get("url") if isinstance(tresc_wyniku, dict) else None
                    )
                    zdarzenia.append({
                        "tool": "web_fetch",
                        "url": url,
                        "query_context": oczekujacy["query_context"],
                    })

        # narzędzia wywołane, ale bez wyniku w tej wiadomości (ucięta odpowiedź itp.)
        for tool_use_id, oczekujacy in oczekujace.items():
            ostrzezenia.append(
                f"wiadomość #{msg_idx}: {oczekujacy['tool']} (id={tool_use_id}) "
                f"bez wyniku — pomijam, NIE traktuję jako zweryfikowane"
            )

    for o in ostrzezenia:
        print(f"OSTRZEŻENIE: {o}", file=sys.stderr)

    return zdarzenia


def main():
    parser = argparse.ArgumentParser(
        description="Buduje sesja.json (log weryfikacji) z surowej konwersacji Claude API")
    parser.add_argument("--input", help="Plik JSON z konwersacją (format opisany w nagłówku pliku)")
    parser.add_argument("--out", help="Ścieżka wyjściowa sesja.json")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        uruchom_self_test()
        return

    if not (args.input and args.out):
        print("Wymagane: --input i --out (lub --self-test)", file=sys.stderr)
        sys.exit(2)

    with open(args.input, "r", encoding="utf-8") as f:
        konwersacja = json.load(f)

    zdarzenia = wydobadz_zdarzenia(konwersacja)

    wynik = {
        "session_id": konwersacja.get("session_id", "nieznana-sesja"),
        "events": zdarzenia,
    }

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(wynik, f, ensure_ascii=False, indent=2)

    print(f"Zapisano {len(zdarzenia)} zdarzeń weryfikacji do {args.out}")


def uruchom_self_test():
    przykladowa_konwersacja = {
        "session_id": "test-sesja-1",
        "messages": [
            {"role": "user", "content": [{"type": "text", "text": "Czy mam podstawy do zniesienia współwłasności?"}]},
            {"role": "assistant", "content": [
                {"type": "text", "text": "Sprawdzam art. 211 KC w ISAP, żeby potwierdzić aktualne brzmienie."},
                {"type": "server_tool_use", "id": "toolu_1", "name": "web_fetch",
                 "input": {"url": "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19640160093"}},
                {"type": "web_fetch_tool_result", "tool_use_id": "toolu_1",
                 "content": {"type": "web_fetch_result",
                             "url": "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19640160093"}},
                {"type": "text", "text": "Weryfikuję też wyrok SN I CSK 123/24 dotyczący podobnej sprawy."},
                {"type": "server_tool_use", "id": "toolu_2", "name": "web_search",
                 "input": {"query": "wyrok SN I CSK 123/24 zniesienie współwłasności"}},
                {"type": "web_search_tool_result", "tool_use_id": "toolu_2",
                 "content": [{"type": "web_search_result", "url": "https://sn.pl/orzeczenia/i-csk-123-24",
                              "title": "Wyrok SN I CSK 123/24"}]},
                # narzędzie wywołane bez wyniku — symuluje ucięcie/timeout, NIE powinno trafić do logu
                {"type": "server_tool_use", "id": "toolu_3", "name": "web_fetch",
                 "input": {"url": "https://isap.sejm.gov.pl/nieistniejacy-timeout"}},
            ]},
        ],
    }

    zdarzenia = wydobadz_zdarzenia(przykladowa_konwersacja)

    ok = (
        len(zdarzenia) == 2
        and zdarzenia[0]["tool"] == "web_fetch"
        and "211" in (zdarzenia[0]["query_context"] or "")
        and zdarzenia[1]["tool"] == "web_search"
        and zdarzenia[1]["result_urls"] == ["https://sn.pl/orzeczenia/i-csk-123-24"]
    )

    print(json.dumps(zdarzenia, ensure_ascii=False, indent=2))
    print()
    if ok:
        print("SELF-TEST OK: 2 zdarzenia poprawnie wydobyte (web_fetch + web_search), "
              "query_context poprawnie przypisany, narzędzie bez wyniku poprawnie pominięte "
              "(patrz OSTRZEŻENIE powyżej).")
        sys.exit(0)
    else:
        print("SELF-TEST NIEUDANY.")
        sys.exit(1)


if __name__ == "__main__":
    main()
