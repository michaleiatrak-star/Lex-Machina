"""
append_event.py — referencyjna implementacja DOPISYWANIA nowego zdarzenia do
logu audit-trail z zachowaniem łańcucha hashy (strona zapisu, uzupełnienie
hash_chain_verify.py, który tylko weryfikuje istniejący log).

⚠️ Status: przetestowany lokalnie (round-trip append → verify, patrz sekcja
testowa na końcu pliku, `python append_event.py --self-test`). Programista
portalu musi podłączyć wywołanie `dopisz_zdarzenie()` do rzeczywistego miejsca
w swojej aplikacji, w którym powstają zdarzenia z tabeli w
shared/AUDIT-TRAIL-SPEC.md (SESSION_START, ROUTING_DECISION,
HARDGATE_VERIFICATION, ENTITY_CHECK, DOCUMENT_GENERATED, STOP_ESCALATION,
DISCLAIMER_SHOWN, SESSION_END).

Użycie jako CLI:
    python append_event.py --log audit_log.jsonl --event HARDGATE_VERIFICATION \
        --session-id abc-123 \
        --payload '{"typ":"akt","identyfikator":"Dz.U. 2025 poz. 1071","zrodlo":"MCP","wynik":"VERIFIED"}'

Użycie jako biblioteka:
    from append_event import dopisz_zdarzenie
    dopisz_zdarzenie("audit_log.jsonl", "SESSION_START", "abc-123", {})
"""

import os
import sys
import json
import argparse
import hashlib
from datetime import datetime, timezone

GENESIS = "GENESIS"


def canonical_json(obj: dict) -> str:
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def event_core(seq: int, event: str, session_id: str, payload: dict, timestamp: str) -> dict:
    return {"seq": seq, "event": event, "session_id": session_id,
            "payload": payload, "timestamp": timestamp}


def wczytaj_ostatni_wpis(sciezka_logu: str) -> dict | None:
    if not os.path.exists(sciezka_logu):
        return None
    ostatni = None
    with open(sciezka_logu, "r", encoding="utf-8") as f:
        for linia in f:
            linia = linia.strip()
            if linia:
                ostatni = json.loads(linia)
    return ostatni


def dopisz_zdarzenie(sciezka_logu: str, event: str, session_id: str, payload: dict,
                      timestamp: str | None = None) -> dict:
    """Dopisuje jedno zdarzenie do logu JSON Lines, licząc poprawny hash-chain
    względem ostatniego istniejącego wpisu (albo GENESIS, jeśli log pusty/nowy).
    Zwraca dopisany wpis (przydatne do logowania/debugowania po stronie portalu)."""

    ostatni = wczytaj_ostatni_wpis(sciezka_logu)
    prev_hash = ostatni["hash"] if ostatni else GENESIS
    seq = (ostatni["seq"] + 1) if ostatni else 1
    ts = timestamp or datetime.now(timezone.utc).isoformat()

    rdzen = event_core(seq, event, session_id, payload, ts)
    hash_wpisu = hashlib.sha256((canonical_json(rdzen) + prev_hash).encode("utf-8")).hexdigest()

    wpis = {**rdzen, "prev_hash": prev_hash, "hash": hash_wpisu}

    with open(sciezka_logu, "a", encoding="utf-8") as f:
        f.write(json.dumps(wpis, ensure_ascii=False) + "\n")

    return wpis


TYPY_ZDARZEN = {
    "SESSION_START", "ROUTING_DECISION", "HARDGATE_VERIFICATION", "ENTITY_CHECK",
    "DOCUMENT_GENERATED", "STOP_ESCALATION", "DISCLAIMER_SHOWN", "SESSION_END",
}


def main():
    parser = argparse.ArgumentParser(description="Dopisz zdarzenie do audit-trail hash-chain")
    parser.add_argument("--log", help="Ścieżka do pliku logu .jsonl")
    parser.add_argument("--event", choices=sorted(TYPY_ZDARZEN), help="Typ zdarzenia")
    parser.add_argument("--session-id", help="Identyfikator sesji/sprawy")
    parser.add_argument("--payload", default="{}", help="JSON z danymi zdarzenia")
    parser.add_argument("--self-test", action="store_true",
                         help="Uruchamia test round-trip (append + verify) na pliku tymczasowym")
    args = parser.parse_args()

    if args.self_test:
        uruchom_self_test()
        return

    if not (args.log and args.event and args.session_id):
        print("Wymagane: --log, --event, --session-id (lub --self-test)", file=sys.stderr)
        sys.exit(2)

    payload = json.loads(args.payload)
    wpis = dopisz_zdarzenie(args.log, args.event, args.session_id, payload)
    print(f"Dopisano seq={wpis['seq']} event={wpis['event']} hash={wpis['hash'][:12]}...")


def uruchom_self_test():
    """Test round-trip: dopisz 3 zdarzenia, następnie zweryfikuj integralność
    logu tą samą logiką co hash_chain_verify.py (zaimportowaną lokalnie, żeby
    self-test nie zależał od uruchamiania dwóch osobnych plików)."""
    import tempfile

    with tempfile.TemporaryDirectory() as tmp:
        sciezka = os.path.join(tmp, "test_audit_log.jsonl")

        dopisz_zdarzenie(sciezka, "SESSION_START", "sesja-test-1", {"tryb": "LAIK"})
        dopisz_zdarzenie(sciezka, "HARDGATE_VERIFICATION", "sesja-test-1",
                          {"typ": "akt", "identyfikator": "Dz.U. 2025 poz. 1071",
                           "zrodlo": "MCP", "wynik": "VERIFIED"})
        dopisz_zdarzenie(sciezka, "SESSION_END", "sesja-test-1", {})

        # weryfikacja identyczną logiką co hash_chain_verify.py
        with open(sciezka, "r", encoding="utf-8") as f:
            wpisy = [json.loads(l) for l in f if l.strip()]

        prev = GENESIS
        ok = True
        for w in wpisy:
            oczekiwany_rdzen = event_core(w["seq"], w["event"], w["session_id"], w["payload"], w["timestamp"])
            oczekiwany_hash = hashlib.sha256((canonical_json(oczekiwany_rdzen) + prev).encode()).hexdigest()
            if w["prev_hash"] != prev or w["hash"] != oczekiwany_hash:
                ok = False
                break
            prev = w["hash"]

        print(f"Zapisano i zweryfikowano {len(wpisy)} zdarzeń w {sciezka}")
        if ok:
            print("SELF-TEST OK: append_event.py produkuje log zgodny z logiką hash-chain.")
            sys.exit(0)
        else:
            print("SELF-TEST NIEUDANY: niezgodność łańcucha hashy.")
            sys.exit(1)


if __name__ == "__main__":
    main()
