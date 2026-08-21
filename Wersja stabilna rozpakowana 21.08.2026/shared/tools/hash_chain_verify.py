"""
hash_chain_verify.py — referencyjna implementacja weryfikacji integralności
audit-trail (shared/AUDIT-TRAIL-SPEC.md).

⚠️ Status: przykład referencyjny do adaptacji przez developera portalu.
Nie było uruchamiane w tym środowisku wobec żadnego realnego logu produkcyjnego —
brak takiego logu w sandboxie audytowym (log powstaje dopiero po stronie portalu
w środowisku produkcyjnym). Logika hash-chain jest jednak samodzielna,
deterministyczna i nie wymaga żadnego zewnętrznego API, więc można ją
przetestować lokalnie na sztucznych danych przed wdrożeniem.

Użycie:
    python hash_chain_verify.py audit_log.jsonl
Zwraca:
    kod wyjścia 0 i "OK: łańcuch nienaruszony (N wpisów)" jeśli integralność
    zachowana; kod wyjścia 1 i wskazanie pierwszego naruszonego wpisu w
    przeciwnym razie.
"""

import sys
import json
import hashlib


GENESIS = "GENESIS"


def canonical_json(obj: dict) -> str:
    """Serializacja z posortowanymi kluczami, bez białych znaków —
    zapewnia powtarzalny hash niezależnie od implementacji zapisującej log."""
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def event_core(entry: dict) -> dict:
    """Zwraca tylko pola zdarzenia (bez hash/prev_hash), które wchodzą do hasha."""
    return {
        "seq": entry["seq"],
        "event": entry["event"],
        "session_id": entry["session_id"],
        "payload": entry.get("payload", {}),
        "timestamp": entry["timestamp"],
    }


def verify_chain(entries: list[dict]) -> tuple[bool, int | None]:
    prev_hash = GENESIS
    for i, entry in enumerate(entries):
        expected_prev = prev_hash
        if entry.get("prev_hash") != expected_prev:
            return False, i
        computed = hashlib.sha256(
            (canonical_json(event_core(entry)) + expected_prev).encode("utf-8")
        ).hexdigest()
        if computed != entry.get("hash"):
            return False, i
        prev_hash = entry["hash"]
    return True, None


def main():
    if len(sys.argv) != 2:
        print("Użycie: python hash_chain_verify.py <plik.jsonl>")
        sys.exit(2)

    path = sys.argv[1]
    entries = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            entries.append(json.loads(line))

    if not entries:
        print("Pusty log — nic do weryfikacji.")
        sys.exit(0)

    ok, bad_index = verify_chain(entries)
    if ok:
        print(f"OK: łańcuch nienaruszony ({len(entries)} wpisów)")
        sys.exit(0)
    else:
        print(f"NARUSZENIE INTEGRALNOŚCI: pierwszy niezgodny wpis to seq={entries[bad_index].get('seq')} "
              f"(indeks {bad_index} w pliku)")
        sys.exit(1)


if __name__ == "__main__":
    main()
