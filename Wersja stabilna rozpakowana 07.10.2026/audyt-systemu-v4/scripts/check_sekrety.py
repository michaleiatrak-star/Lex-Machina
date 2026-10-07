#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T40 — check_sekrety.py: sekrety i PESEL w drzewie repozytorium (F-216).

DLACZEGO (AUDYT-2026-09-29): token API CEIDG to JWT, którego ładunek (base64, NIE szyfrowanie)
zawiera PESEL, imię i nazwisko właściciela. Zwykły skan „PESEL: 11 cyfr” go nie widzi — PESEL
jest zakodowany. Repozytorium Lex Machina jest publiczne; jeden commit z tokenem = publikacja
PESEL-u. Inspiracja: pre-commit sanitizer z `commercial-legal-pl` (Apache 2.0) — tam wyłącznie
regex na jawny tekst; tu własna implementacja z dekodowaniem JWT i sumą kontrolną PESEL.

Wykrywa (BLOKER): JWT (i ujawnia, czy ładunek niesie PESEL — bez wypisania go), klucze prywatne
PEM, tokeny o znanych prefiksach (sk-ant-, ghp_, github_pat_, AKIA…, xox…), PESEL z POPRAWNĄ
sumą kontrolną w sąsiedztwie słowa „PESEL”. Wartości NIGDY nie są wypisywane w całości.
Wyjątek linii: znacznik `sekrety:ignoruj` w tej samej linii (np. syntetyczne dane testowe).
Kod: 0 PASS, 1 FAIL (znaleziska), 2 błąd.
"""
import argparse, base64, json, re, sys
from pathlib import Path

POMIN_KAT = {".git", "node_modules", "__pycache__", "dist"}
MAX_B = 3_000_000
JWT = re.compile(r"eyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{10,}")
PREF = re.compile(r"(sk-ant-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}"
                  r"|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{20,})")
PEM = re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----")
PESEL_KONT = re.compile(r"PESEL[^0-9\n]{0,15}(\d{11})(?!\d)", re.I)


def pesel_ok(p: str) -> bool:
    if not re.fullmatch(r"\d{11}", p):
        return False
    w = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]
    return (10 - sum(int(p[i]) * w[i] for i in range(10)) % 10) % 10 == int(p[10])


def ladunek(tok: str):
    try:
        b = tok.split(".")[1]; b += "=" * (-len(b) % 4)
        return json.loads(base64.urlsafe_b64decode(b))
    except Exception:
        return None


def skanuj_tekst(tekst: str):
    for nr, l in enumerate(tekst.splitlines(), 1):
        if "sekrety:ignoruj" in l:
            continue
        for m in JWT.finditer(l):
            d = ladunek(m.group(0))
            pes = isinstance(d, dict) and (any("pesel" in str(k).lower() for k in d)
                                           or any(pesel_ok(x) for x in re.findall(r"\d{11}", json.dumps(d))))
            yield nr, "JWT" + (" Z PESEL W ŁADUNKU" if pes else ""), m.group(0)[:10] + "…"
        for m in PREF.finditer(l):
            yield nr, "token API", m.group(0)[:8] + "…"
        if PEM.search(l):
            yield nr, "klucz prywatny PEM", "-----BEGIN…"
        for m in PESEL_KONT.finditer(l):
            if pesel_ok(m.group(1)):
                yield nr, "PESEL (poprawna suma kontrolna)", m.group(1)[:2] + "*********"


def skanuj(root: Path):
    for p in sorted(root.rglob("*")):
        if not p.is_file() or any(c in POMIN_KAT for c in p.relative_to(root).parts):
            continue
        if p.stat().st_size > MAX_B or p.suffix.lower() in {".png", ".jpg", ".zip", ".pdf", ".mcpb", ".ico", ".woff", ".woff2"}:
            continue
        try:
            t = p.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        for nr, typ, podglad in skanuj_tekst(t):
            yield p.relative_to(root), nr, typ, podglad


def selftest() -> int:
    enc = lambda o: base64.urlsafe_b64encode(json.dumps(o).encode()).decode().rstrip("=")
    fake_pesel = next(f"440514013{a}{b}" for a in "0123456789" for b in "0123456789" if pesel_ok(f"440514013{a}{b}"))
    jwt_p = f"{enc({'alg': 'HS512'})}.{enc({'pesel': fake_pesel, 'given_name': 'Test'})}.{'x' * 20}"
    jwt_b = f"{enc({'alg': 'HS256'})}.{enc({'sub': 'abc'})}.{'y' * 20}"
    przyp = [
        ("JWT z PESEL", f"KEY={jwt_p}", "JWT Z PESEL W ŁADUNKU"),
        ("JWT bez PESEL", f"t: {jwt_b}", "JWT"),
        ("PESEL jawny", f"PESEL: {fake_pesel}", "PESEL (poprawna suma kontrolna)"),
        ("PESEL z błędną sumą", "PESEL: 12345678901", None),
        ("wyjątek linii", f"PESEL {fake_pesel}  # sekrety:ignoruj", None),
        ("token Anthropic", "sk-ant-" + "a" * 30, "token API"),
    ]
    ok = True
    for opis, tekst, ocz in przyp:
        typy = [t for _, t, _ in skanuj_tekst(tekst)]
        w = (ocz in typy) if ocz else not typy
        print(f"{'PASS' if w else 'FAIL'} {opis}"); ok &= w
    print(f"SELFTEST: {'OK' if ok else 'FAIL'}")
    return 0 if ok else 1


def main() -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("--repo-root"); ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.selftest:
        return selftest()
    root = Path(a.repo_root or Path(__file__).resolve().parents[2])
    zn = list(skanuj(root))
    for p, nr, typ, pod in zn:
        print(f"⛔ {p}:{nr} — {typ} [{pod}]")
    print(f"T40: {len(zn)} znalezisk → WYNIK: {'FAIL' if zn else 'PASS'}")
    return 1 if zn else 0


if __name__ == "__main__":
    sys.exit(main())
