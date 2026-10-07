#!/usr/bin/env python3
"""T24 — pozycje MAPA-AKTOW z nowelizacjami ogłoszonymi PO dacie t.j.

PO CO TEN TEST ISTNIEJE (F-156, rozstrzygnięcie 2026-09-01j)
  Przegląd 16 map w żywym ELI (2026-09-01i) pokazał 139 pozycji, których tekst
  jednolity NIE zawiera już ogłoszonych nowelizacji. Mapa oznaczała je jako 🟢.
  Do wyboru były dwa rozwiązania:

    (a) oznaczyć ręcznie w 15 mapach — odrzucone. Liczba nowelizacji po t.j.
        rośnie z każdą publikacją Dz.U., więc wpisana liczba zestarzeje się
        w tygodniach. Wtedy mapa kłamie Z WIĘKSZĄ PEWNOŚCIĄ SIEBIE niż dziś,
        gdy po prostu nic nie twierdzi. To ta sama klasa błędu co F-82:
        rejestr zgodny sam ze sobą i rozjechany z rzeczywistością.
    (b) test liczący to przy każdym przebiegu — WYBRANE. Wynik powstaje
        w momencie uruchomienia, więc nie ma czego zestarzeć.

  ⛔ Test NIE ocenia, czy nowelizacja dotyka akurat tej jednostki, którą
  będziesz cytować. Mówi wyłącznie: „dla tego aktu sam t.j. nie wystarczy".
  Ocena wpływu pozostaje RĘCZNA, jak w WYJ-GATE.

ŹRÓDŁO LICZBY — UNIA, NIE WYBÓR
  Nowelizacje po t.j. liczone są jako unia dwóch źródeł (F-155):
    • sekcja ELI „Nowelizacje po tekście jednolitym" w /references obwieszczenia,
    • akty zmieniające aktu bazowego z datą promulgacji > data t.j.
  Pomiar F-155 na 19 aktach: sekcja API bywa WŁAŚCIWYM PODZBIOREM metody
  datowej (3/19, cztery brakujące ustawy, wszystkie obowiązujące). Oparcie
  testu na samej sekcji dałoby fałszywy negatyw.
  Logika jest importowana z `check_wyjatek_gate_eli.py`, nie kopiowana —
  rozjazd dwóch implementacji tej samej reguły byłby gorszy niż brak testu.

UŻYCIE
  python3 check_nowelizacje_po_tj.py --selftest          # offline, bez sieci
  python3 check_nowelizacje_po_tj.py /mnt/skills/user    # pełny przebieg
  python3 check_nowelizacje_po_tj.py /mnt/skills/user --skill dr-08-samorzad-terytorialny-prawo-lokalne

WYMAGA SIECI (api.sejm.gov.pl). Dlatego test stoi POZA orkiestratorem —
tak samo jak T15, T20 i T21 w wariancie sieciowym.

KODY WYJŚCIA
  0 — brak pozycji do przeglądu
  1 — są pozycje z nowelizacjami po t.j. (WARN, nie FAIL — to stan świata,
      nie usterka repozytorium)
  2 — błąd wykonania (brak sieci, brak modułu źródłowego)
"""

import argparse
import importlib.util
import json
import os
import re
import sys
import urllib.request

ELI_BASE = "https://api.sejm.gov.pl/eli/acts"
DZU_RE = re.compile(r"Dz\.\s?U\.\s*(?:z\s*)?(\d{4})\s*(?:r\.\s*)?poz\.\s*(\d+)")


def load_gate_module():
    """Importuje logikę z check_wyjatek_gate_eli.py (jedno źródło reguły)."""
    here = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(here, "check_wyjatek_gate_eli.py")
    if not os.path.exists(path):
        print("⛔ Brak check_wyjatek_gate_eli.py obok tego skryptu — T24 nie "
              "duplikuje jego logiki i bez niego nie działa.", file=sys.stderr)
        sys.exit(2)
    spec = importlib.util.spec_from_file_location("wyjgate", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def fetch_json(url):
    try:
        with urllib.request.urlopen(url, timeout=60) as r:
            return json.loads(r.read().decode("utf-8", errors="replace"))
    except Exception:                                  # noqa: BLE001
        return None


# Adnotacja „(akt pierwotny: Dz.U. RRRR poz. N)" wprowadzona 2026-09-01i przy
# podmianie aktu bazowego na t.j. Numer w niej to ŚWIADOMY ślad historyczny, nie
# podstawa cytowania — bez tego wycięcia T24 zgłaszał trzy fałszywe alarmy
# „STATUS:akt posiada tekst jednolity" na własnej naprawie systemu.
PIERWOTNY_RE = re.compile(
    r"akt\s+pierwotny:?\s*Dz\.\s?U\.\s*(?:z\s*)?\d{4}\s*(?:r\.\s*)?poz\.\s*\d+",
    re.IGNORECASE)


def extract_numbers(text):
    """Numery Dz.U. z treści mapy, w kolejności wystąpienia, bez powtórzeń.

    ⛔ Pomija numery w adnotacji „akt pierwotny: …" — patrz PIERWOTNY_RE.
    """
    text = PIERWOTNY_RE.sub(" ", text)
    out = []
    for year, pos in DZU_RE.findall(text):
        eli = "DU/{}/{}".format(year, pos)
        if eli not in out:
            out.append(eli)
    return out


def acts_from(refs, key):
    out = []
    for it in (refs or {}).get(key) or []:
        a = it.get("act") if isinstance(it, dict) and isinstance(
            it.get("act"), dict) else it
        if isinstance(a, dict) and a.get("ELI"):
            out.append(a)
    return out


def check_act(eli, gate, cache):
    """Zwraca (status, liczba_nowelizacji_po_tj, szczegoly)."""
    if eli in cache:
        return cache[eli]
    meta = fetch_json("{}/{}".format(ELI_BASE, eli))
    if not meta or not meta.get("title"):
        res = ("BRAK-W-ELI", 0, [])
        cache[eli] = res
        return res
    status = meta.get("status") or ""
    if "obowiązując" not in status:
        res = ("STATUS:" + status, 0, [])
        cache[eli] = res
        return res
    if meta.get("type") != "Obwieszczenie":
        res = ("OK-NIE-TJ", 0, [])
        cache[eli] = res
        return res
    tj_refs = fetch_json("{}/{}/references".format(ELI_BASE, eli))
    base = acts_from(tj_refs, "Tekst jednolity dla aktu")
    if not base:
        res = ("BRAK-AKTU-BAZOWEGO", 0, [])
        cache[eli] = res
        return res
    base_refs = fetch_json("{}/{}/references".format(
        ELI_BASE, base[0]["ELI"]))
    date_list = gate.amendments_after(base_refs, meta.get("promulgation") or "")
    api_map = gate.amendments_from_api(tj_refs)
    merged = gate.merge_amendments(date_list, api_map, base_refs)
    res = ("OK", len(merged), merged)
    cache[eli] = res
    return res


def run(root, only_skill=None, verbose=False):
    gate = load_gate_module()
    cache = {}
    skills = sorted(d for d in os.listdir(root)
                    if os.path.isfile(os.path.join(root, d, "MAPA-AKTOW.md")))
    if only_skill:
        skills = [s for s in skills if s == only_skill]
        if not skills:
            print("⛔ Brak MAPA-AKTOW.md dla: {}".format(only_skill),
                  file=sys.stderr)
            return 2
    total_num = total_flag = total_bad = 0
    print("=" * 72)
    print("TEST T24 — nowelizacje ogłoszone PO dacie tekstu jednolitego")
    print("Katalog: {}   |   map: {}".format(root, len(skills)))
    print("=" * 72)
    for sk in skills:
        with open(os.path.join(root, sk, "MAPA-AKTOW.md"),
                  encoding="utf-8") as fh:
            nums = extract_numbers(fh.read())
        flagged, bad = [], []
        for eli in nums:
            st, n, det = check_act(eli, gate, cache)
            if st in ("BRAK-W-ELI", "BRAK-AKTU-BAZOWEGO") or \
                    st.startswith("STATUS:"):
                bad.append((eli, st))
            elif n:
                flagged.append((eli, n, det))
        total_num += len(nums)
        total_flag += len(flagged)
        total_bad += len(bad)
        mark = "⚠️" if flagged or bad else "✅"
        print("\n{} {:<48} numerów: {:>3}".format(mark, sk, len(nums)))
        for eli, st in bad:
            print("   ⛔ {:<14} {}".format(eli, st))
        for eli, n, det in flagged:
            print("   ⚠️ {:<14} nowelizacji po t.j.: {}".format(eli, n))
            if verbose:
                for prom, addr, title, src in det:
                    print("        [{}] {}  {}  {}".format(
                        src, prom, addr, title))
    print("\n" + "-" * 72)
    print("Numerów zbadanych: {}   pozycji z nowelizacjami po t.j.: {}   "
          "problemów statusu: {}".format(total_num, total_flag, total_bad))
    print("⛔ Liczba jest stanem NA MOMENT URUCHOMIENIA. Nie przepisuj jej do "
          "mapy — po to ten test powstał (F-156).")
    print("⛔ Test nie ocenia, czy nowelizacja dotyka Twojej jednostki. "
          "Mówi tylko: sam t.j. nie wystarczy.")
    if total_bad:
        print("WYNIK T24: ⛔ FAIL — pozycje bez pokrycia w ELI albo "
              "nieobowiązujące.")
        return 1
    if total_flag:
        print("WYNIK T24: ⚠️ WARN — {} pozycji wymaga fresh gate poza t.j."
              .format(total_flag))
        return 1
    print("WYNIK T24: ✅ PASS")
    return 0


FIXTURE_TJ_REFS = {
    "Tekst jednolity dla aktu": [
        {"act": {"ELI": "DU/1990/95", "title": "Ustawa bazowa"}}],
    "Nowelizacje po tekście jednolitym": [
        {"act": {"ELI": "DU/2026/100", "displayAddress": "Dz.U. 2026 poz. 100",
                 "promulgation": "2026-02-01", "title": "Zmieniajaca B"}}],
}
FIXTURE_BASE_REFS = {
    "Akty zmieniające": [
        {"act": {"ELI": "DU/2026/100", "displayAddress": "Dz.U. 2026 poz. 100",
                 "promulgation": "2026-02-01", "title": "Zmieniajaca B"}},
        {"act": {"ELI": "DU/2026/900", "displayAddress": "Dz.U. 2026 poz. 900",
                 "promulgation": "2026-07-22", "title": "Zmieniajaca A"}},
        {"act": {"ELI": "DU/2020/1", "displayAddress": "Dz.U. 2020 poz. 1",
                 "promulgation": "2020-01-02", "title": "Stara zmiana"}},
    ]
}


def selftest():
    gate = load_gate_module()
    checks = []

    txt = ("| ustawa A | Dz.U. 2026 poz. 662 t.j. | mod-a | 🟢 |\n"
           "| ustawa B | Dz.U. z 2019 r. poz. 1461 t.j. | mod-b | 🟢 |\n"
           "| powtorka | Dz.U. 2026 poz. 662 | mod-c | 🟢 |\n"
           "| bez numeru | USG/USP | mod-d | 🟢 |\n")
    nums = extract_numbers(txt)
    checks.append(("regex czyta obie formy zapisu Dz.U.",
                   nums == ["DU/2026/662", "DU/2019/1461"]))
    # F-156/2026-09-01j: adnotacja historyczna nie może wracać jako alarm
    prim = extract_numbers(
        "| Ustawa X | Dz.U. 2026 poz. 873 t.j. (akt pierwotny: Dz.U. 2023 poz. 1429) |")
    checks.append(("adnotacja akt pierwotny nie tworzy pozycji",
                   prim == ["DU/2026/873"]))
    prim2 = extract_numbers("Dz.U. 2024 poz. 1620 t.j. (akt pierwotny Dz.U. 2022 poz. 974)")
    checks.append(("wariant bez dwukropka też wycięty",
                   prim2 == ["DU/2024/1620"]))
    checks.append(("regex nie powiela tego samego numeru", len(nums) == 2))

    date_list = gate.amendments_after(FIXTURE_BASE_REFS, "2026-01-01")
    api_map = gate.amendments_from_api(FIXTURE_TJ_REFS)
    merged = gate.merge_amendments(date_list, api_map, FIXTURE_BASE_REFS)
    checks.append(("unia liczy 2 nowelizacje po t.j. (nie 1 z sekcji API)",
                   len(merged) == 2))
    checks.append(("nowelizacja sprzed t.j. nie wchodzi do wyniku",
                   all("2020" not in x[1] for x in merged)))
    # ⛔ Mutacja negatywna: gdyby T24 przeszedł na samą sekcję API, wynik
    # spadłby do 1 i powyższy przypadek zgłosiłby FAIL.
    checks.append(("sekcja API sama dawalaby wynik mniejszy",
                   len(api_map) < len(merged)))
    checks.append(("kazda pozycja ma proweniencje",
                   all(x[3] in ("DATA", "API", "DATA+API") for x in merged)))

    with open(__file__, encoding="utf-8") as fh:
        src = fh.read()
    # ⛔ Wzorzec sklejany celowo: literał wpisany wprost trafiłby do własnego
    # źródła i przypadek zawsze zgłaszałby FAIL (zmierzone 2026-09-01j).
    own_def = "def " + "amendments_after"
    checks.append(("T24 importuje logike, nie kopiuje jej",
                   "load_gate_module" in src and own_def not in src))

    ok = 0
    for name, res in checks:
        print("{} {}".format("PASS" if res else "FAIL", name))
        ok += bool(res)
    print("---\n{}/{} PASS".format(ok, len(checks)))
    return 0 if ok == len(checks) else 1


def main():
    ap = argparse.ArgumentParser(description="T24 — nowelizacje po t.j.")
    ap.add_argument("repo_root", nargs="?", default="/mnt/skills/user")
    ap.add_argument("--skill", help="ogranicz do jednego skilla")
    ap.add_argument("--verbose", action="store_true",
                    help="wypisz pojedyncze nowelizacje z proweniencją")
    ap.add_argument("--selftest", action="store_true",
                    help="przebieg offline, bez sieci")
    args = ap.parse_args()
    if args.selftest:
        return selftest()
    if not os.path.isdir(args.repo_root):
        print("⛔ Nie ma katalogu: {}".format(args.repo_root), file=sys.stderr)
        return 2
    return run(args.repo_root, args.skill, args.verbose)


if __name__ == "__main__":
    sys.exit(main())
