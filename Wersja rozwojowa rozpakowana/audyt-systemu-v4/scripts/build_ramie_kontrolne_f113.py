#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_ramie_kontrolne_f113.py — deterministyczny generator RAMIENIA A (kontrolnego)
dla protokołu F-113.

PO CO ISTNIEJE (flaga F-174, 2026-09-10)
  `references/PLAN-TESTU-BRAMEK-F113.md` jest kompletny po stronie projektowej:
  ma grupę kontrolną, ocenę ślepą, kartę kryteriów, progi orzekania i warunki
  zamknięcia. Powstał 2026-08-24 i przez 17 dni NIE zostal wykonany ani razu.

  Przyczyna nie leży w projekcie testu. Leży w tym, że plan zakłada istnienie
  „ramienia A — systemu bez bramek", a NIE PODAJE, jak je zbudować. Zbudowanie
  go ręcznie oznacza wycięcie pięciu bramek z kilkunastu plików tak, żeby:
    (a) wyciąć DOKŁADNIE bramkę, nie sąsiadujące reguły,
    (b) NIE zostawić zerwanych odwołań — bo skill z zerwanym odwołaniem wchodzi
        w `⛔ TRYB ZDEGRADOWANY`, a wtedy mierzy się reakcję na awarię zasobu,
        nie brak bramki. To unieważniłoby cały przebieg,
    (c) dało się to powtórzyć identycznie przy kolejnym przebiegu.
  Ręcznie jest to zadanie na godziny i nie jest odtwarzalne. Stąd ten skrypt.

⛔ CZEGO TEN SKRYPT NIE ROBI
  Nie uruchamia przebiegów, nie ocenia i nie liczy Δ. Przebiegi prowadzi
  człowiek, ocenę wykonuje człowiek (patrz docstring `ocena_transkryptow_f113.py`,
  sekcja o świadomej rezygnacji z automatycznego scoringu).

⛔ ZAKAZ URUCHAMIANIA NA DRZEWIE PRODUKCYJNYM
  Skrypt odmawia pracy, gdy katalog wyjściowy pokrywa się z repo źródłowym.
  Ramię A jest artefaktem testowym i nigdy nie wraca do wydania.

KODY WYJŚCIA
  0 — ramię A zbudowane, brak zerwanych odwołań
  1 — nie wykonano któregoś wycięcia (zmieniła się treść pliku źródłowego)
  2 — błąd użycia
"""

import argparse
import os
import shutil
import subprocess
import sys

# ---------------------------------------------------------------------------
# MAPA WYCIĘĆ — jedna pozycja = jedna bramka z § 1 planu.
#   plik            : ścieżka względem korzenia drzewa skilli
#   kotwice         : lista fragmentów do usunięcia; każdy MUSI wystąpić
#                     dokładnie raz, inaczej skrypt przerywa (kod 1)
#   usun_pliki      : pliki kanoniczne bramki do skasowania w ramieniu A
# Kotwice są krótkie i celowo trzymane w JEDNYM miejscu — przy zmianie treści
# bramki poprawia się tabelę tutaj, nie szuka po drzewie.
# ---------------------------------------------------------------------------
BRAMKI = {
    "B1": {
        "opis": "ANTY-FASADA (AF-1…AF-6)",
        "usun_pliki": ["shared/SELF-CHECK-ANTY-FASADA.md"],
        "kotwice": [
            ("prawny-router-v3/references/SELF-CHECK.md",
             "□ [ANTY-FASADA + AF-6] Wykonaj self-check antyfasadowy z modułu kanonicznego:\n"
             "    view shared/SELF-CHECK-ANTY-FASADA.md\n"),
        ],
    },
    "B2": {
        "opis": "KOTWICA URZĘDOWA 🟨",
        "usun_pliki": [],
        "kotwice": [
            ("prawny-router-v3/references/SELF-CHECK.md",
             "□ RZĄD 1 niedostępny (robots)? → sekwencja B-1 web_search → B-2 web_fetch\n"
             "  wykonana, a przy blokadzie warunki K-1…K-4 kotwicy urzędowej spełnione?\n"),
        ],
    },
    "B3": {
        "opis": "DOMAIN-LOCK",
        "usun_pliki": ["shared/DOMAIN-LOCK.md"],
        "kotwice": [],  # blok w SELF-CHECK wycinany zakresowo — patrz ZAKRESY
    },
    "B4": {
        "opis": "RATE-COMPLETENESS",
        "usun_pliki": ["shared/RATE-COMPLETENESS.md"],
        "kotwice": [],
    },
    "B5": {
        "opis": "ŚLAD ROUTINGU (KROK 3A / ROUTER-WCZYTANY)",
        "usun_pliki": [],
        "kotwice": [],
    },
}

# Wycięcia zakresowe: (plik, pierwsza_linia_bloku, pierwsza_linia_PO_bloku)
# Używane tam, gdzie bramka zajmuje wielolinijkowy blok o stabilnych krawędziach.
ZAKRESY = {
    "B3": [("prawny-router-v3/references/SELF-CHECK.md",
            "□ [DOMAIN-LOCK] ⛔ KONTROLA NA WYJŚCIU",
            "□ [CV-ALT / RELACJA PODSTAW]")],
    "B4": [("prawny-router-v3/references/SELF-CHECK.md",
            "□ [RATE-COMPLETENESS] Odpowiedź zawiera odsetki",
            "□ Sygnatury orzeczeń przeszły V-SYG")],
    "B5": [("prawny-router-v3/SKILL.md",
            "KROK 3A → [ŚLAD ROUTINGU — OBOWIĄZKOWY]",
            "KROK 4  → Wykonaj analizę"),
           ("prawny-router-v3/references/SELF-CHECK.md",
            "□ [KROK 3A ŚLAD ROUTINGU]",
            "□ ⛔ VER-GRAIN — KONTROLA NA WYJŚCIU")],
}


def wytnij_zakres(tekst, od, do, gdzie):
    i = tekst.find(od)
    if i == -1:
        raise LookupError(f"{gdzie}: nie znaleziono początku bloku {od!r}")
    j = tekst.find(do, i)
    if j == -1:
        raise LookupError(f"{gdzie}: nie znaleziono końca bloku {do!r}")
    return tekst[:i] + tekst[j:]


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--repo-root", required=True, help="drzewo skilli (ramię B, nietykalne)")
    ap.add_argument("--out", required=True, help="katalog docelowy ramienia A")
    ap.add_argument("--bramki", default="B1,B2,B3,B4,B5",
                    help="które bramki wyciąć (domyślnie wszystkie pięć)")
    ap.add_argument("--force", action="store_true", help="nadpisz istniejący katalog wyjściowy")
    a = ap.parse_args()

    src = os.path.abspath(a.repo_root)
    out = os.path.abspath(a.out)
    if not os.path.isdir(src):
        print(f"BŁĄD: {src} nie istnieje", file=sys.stderr)
        return 2
    if out == src or out.startswith(src + os.sep):
        print("⛔ ODMOWA: katalog wyjściowy leży wewnątrz repo źródłowego.\n"
              "   Ramię A jest artefaktem testowym i nie może powstać w drzewie wydania.",
              file=sys.stderr)
        return 2
    if os.path.exists(out):
        if not a.force:
            print(f"BŁĄD: {out} istnieje (użyj --force)", file=sys.stderr)
            return 2
        shutil.rmtree(out)

    shutil.copytree(src, out)
    wybrane = [b.strip() for b in a.bramki.split(",") if b.strip()]
    print("=" * 72)
    print("RAMIĘ A (kontrolne) — F-113")
    print(f"źródło: {src}")
    print(f"cel:    {out}")
    print(f"bramki wycinane: {', '.join(wybrane)}")
    print("=" * 72)

    bledy = []
    for b in wybrane:
        if b not in BRAMKI:
            bledy.append(f"{b}: nieznana bramka")
            continue
        spec = BRAMKI[b]
        print(f"\n── {b} — {spec['opis']} ──")

        for rel in spec["usun_pliki"]:
            p = os.path.join(out, rel)
            if os.path.exists(p):
                os.remove(p)
                print(f"   usunięto plik: {rel}")
            else:
                bledy.append(f"{b}: brak pliku {rel}")

        for rel, kotwica in spec["kotwice"]:
            p = os.path.join(out, rel)
            t = open(p, encoding="utf-8").read()
            n = t.count(kotwica)
            if n != 1:
                bledy.append(f"{b}: kotwica w {rel} wystąpiła {n}× (oczekiwano 1)")
                continue
            open(p, "w", encoding="utf-8").write(t.replace(kotwica, ""))
            print(f"   wycięto kotwicę w: {rel}")

        for rel, od, do in ZAKRESY.get(b, []):
            p = os.path.join(out, rel)
            t = open(p, encoding="utf-8").read()
            try:
                open(p, "w", encoding="utf-8").write(wytnij_zakres(t, od, do, rel))
                print(f"   wycięto blok w:   {rel}")
            except LookupError as e:
                bledy.append(f"{b}: {e}")

    # ------------------------------------------------------------------
    # SPRZĄTANIE ODWOŁAŃ — bez tego kroku ramię A jest bezużyteczne.
    #
    # Skasowanie pliku kanonicznego bramki zostawia po nim odwołania w kilkudziesięciu
    # SKILL.md i modułach. Skill z zerwanym odwołaniem wchodzi w ⛔ TRYB ZDEGRADOWANY
    # (fail-closed), więc przebieg mierzyłby reakcję na AWARIĘ ZASOBU, a nie brak
    # bramki — dokładnie ta wada unieważniła TEST1–TEST3. Pomiar 2026-09-10:
    # 3 skasowane pliki → 43 zerwane odwołania w 57 plikach.
    #
    # Historii (references/CHANGELOG.md, AUDIT-JOURNAL.md) NIE ruszamy: to proza
    # narracyjna, nie rejestr wykonawczy, a jej okrojenie zmieniłoby ślad audytowy.
    # ------------------------------------------------------------------
    usuniete = [os.path.basename(r) for b in wybrane if b in BRAMKI
                for r in BRAMKI[b]["usun_pliki"]]
    if usuniete:
        print("\n── sprzątanie odwołań po skasowanych plikach ──")
        POMIN = ("CHANGELOG.md", "AUDIT-JOURNAL.md")
        zmienione = wyciete_linie = 0
        for korzen, _, pliki in os.walk(out):
            for nazwa in pliki:
                if not nazwa.endswith(".md") or nazwa in POMIN:
                    continue
                sciezka = os.path.join(korzen, nazwa)
                tresc = open(sciezka, encoding="utf-8").read()
                if not any(u in tresc for u in usuniete):
                    continue
                linie = tresc.split("\n")
                zostaw = [l for l in linie if not any(u in l for u in usuniete)]
                if len(zostaw) != len(linie):
                    open(sciezka, "w", encoding="utf-8").write("\n".join(zostaw))
                    zmienione += 1
                    wyciete_linie += len(linie) - len(zostaw)
        print(f"   plików poprawionych: {zmienione}, linii usuniętych: {wyciete_linie}")

    # ------------------------------------------------------------------
    # Kontrola krytyczna: zerwane odwołania w ramieniu A unieważniają przebieg
    # ------------------------------------------------------------------
    print("\n" + "=" * 72)
    print("KONTROLA INTEGRALNOŚCI RAMIENIA A")
    ci = os.path.join(out, "audyt-systemu-v4", "scripts", "ci_check_shared.py")
    if os.path.exists(ci):
        r = subprocess.run([sys.executable, ci, "--repo-root", out],
                           capture_output=True, text=True)
        ogon = [l for l in r.stdout.strip().split("\n") if l.startswith("WYNIK")]
        print("   ci_check_shared:", ogon[0] if ogon else f"kod {r.returncode}")
        if r.returncode != 0:
            bledy.append("ci_check_shared: zerwane odwołania w ramieniu A — "
                         "przebieg zmierzyłby reakcję na awarię zasobu, nie brak bramki")
    else:
        print("   ⚠️ ci_check_shared.py niedostępny — kontrola pominięta")

    print("=" * 72)
    if bledy:
        print("\n⛔ NIEPOWODZENIE — ramię A NIE nadaje się do przebiegu:")
        for e in bledy:
            print(f"   • {e}")
        print("\nNajczęstsza przyczyna: treść bramki zmieniła się od ostatniej edycji\n"
              "tabeli BRAMKI/ZAKRESY w tym skrypcie. Popraw kotwice, nie drzewo.")
        return 1

    print("\n✅ RAMIĘ A GOTOWE.")
    print("   Dalej: references/PROTOKOL-WYKONAWCZY-F113.md, sekcja „Karta przebiegu”.")
    print("   ⛔ Nie wgrywaj tego drzewa jako wydania — to artefakt testowy.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
