#!/usr/bin/env python3
"""
test_cross_map_dzu.py — Test regresyjny T3 (częściowo automatyczny):
spójność numerów Dz.U. między lokalną MAPA-AKTOW.md danego DR-skilla
a główną prawo-polskie-v2/ROUTING-MAP.md.

ŹRÓDŁO BŁĘDU (regresja, którą ten test chroni przed powrotem):
  Ustawa o systemie ubezpieczeń społecznych: lokalna MAPA-AKTOW.md
  (DR-04) i główna ROUTING-MAP.md wskazywały RÓŻNE numery Dz.U. dla
  TEGO SAMEGO aktu prawnego przez wiele sesji, zanim rozbieżność
  została zauważona i naprawiona (audyt 2026-07-21m). Analogiczny
  przypadek: ustawa o Straży Granicznej (DR-13, audyt 2026-07-21m).

ZASADA TESTU (HEURYSTYKA — wymaga potwierdzenia LLM/człowieka, NIE
rozstrzyga automatycznie, KTÓRY numer jest poprawny): dla KAŻDEJ
frazy "Dz.U. RRRR poz. NNNN" znalezionej w OBU plikach (lokalna mapa +
główna mapa) w POBLIŻU (tej samej linii lub akapitu) WSPÓLNEGO
fragmentu nazwy aktu (dopasowanie po pierwszych N słowach nazwy
ustawy) — sprawdź czy numer Dz.U. jest IDENTYCZNY. Jeśli NIE — FLAGA
do weryfikacji (nie wiadomo automatycznie, KTÓRY numer jest aktualny —
wymaga sprawdzenia na ISAP).

⚠️ OGRANICZENIE: to jest UPROSZCZONA heurystyka tekstowa (dopasowanie
przez wspólne słowa kluczowe nazwy aktu), NIE parser struktury tabel
Markdown — może dawać fałszywe negatywy/pozytywy przy NIETYPOWYM
formatowaniu wiersza. Traktuj wynik jako PUNKT STARTOWY do weryfikacji,
nie ostateczny werdykt.

Użycie:
    python3 test_cross_map_dzu.py [--repo-root /mnt/skills/user] [--quiet]

⛔ OSTRZEŻENIE METODOLOGICZNE (dodane 2026-08-15y, flaga F-82, pkt 2):
ZGODNOŚĆ REJESTRÓW MIĘDZY SOBĄ **NIE JEST** WERYFIKACJĄ MERYTORYCZNĄ.
Ten test wykrywa wyłącznie sytuację, w której dwa rejestry podają RÓŻNE
numery. Jest z definicji ŚLEPY na błąd, w którym WSZYSTKIE rejestry
podają ZGODNIE ten SAM, ale BŁĘDNY numer — a to jest błąd groźniejszy,
bo wewnętrzna spójność systemu wtedy POTWIERDZA błąd zamiast go ujawniać.

Przypadek referencyjny (F-82, 2026-08-15n): Kodeks morski figurował
w TRZECH rejestrach jednocześnie pod numerem Dz.U. 2023 poz. 1523, gdy
poprawny t.j. to Dz.U. 2023 poz. 1309. Poz. 1523/2023 to ustawa
o delegowaniu kierowców w transporcie drogowym — akt z tej samej
dziedziny transportowej, co maskowało pomyłkę. Błąd przetrwał wszystkie
dotychczasowe przebiegi TRYB DZU i tego testu.

⭐ TECHNIKA WYKRYWANIA TEJ KLASY BŁĘDU (potwierdzona dwukrotnie: F-82
i odkrycie Dz.U. 2026 poz. 825 w sesji 2026-08-15x): czytając tekst
DOWOLNEJ nowelizacji, porównaj metryki aktów zmienianych, cytowane
w nagłówkach ("W ustawie z dnia ... (Dz. U. z ... poz. ...)"), z mapą
Dz.U. To jest ŹRÓDŁO ZEWNĘTRZNE wobec rejestrów systemu, więc wykrywa
błędy, na które kroswalidacja jest ślepa. WYNIK "OK" TEGO TESTU NIE
ZWALNIA z takiej kontroli.

Kod wyjścia:
    0 — brak wykrytych rozbieżności
    1 — znaleziono co najmniej jedną PODEJRZANĄ rozbieżność (WYMAGA
        weryfikacji manualnej na ISAP, patrz REGRESSION-TEST-PLAN.md)
"""

import argparse
import re
import sys
from pathlib import Path

DZU_PATTERN = re.compile(r"Dz\.?\s*U\.?\s*(\d{4})\s*poz\.?\s*(\d+)", re.IGNORECASE)

# ⭐ NOTACJA LEX "Dz.U.RRRR.NN.PPPP" (np. Dz.U.2026.0.468) — DZU_PATTERN jej
# NIE łapie w ogóle (wymaga literalnego "poz."), więc akty zapisane w tej
# notacji były dla T3 niewidoczne: rozbieżność numeru między mapami nie mogła
# zostać wykryta. 95 wystąpień w systemie, pomiar 2026-08-23g. Flaga F-125.
RE_LEX = re.compile(r"Dz\.\s?U\.\s*(\d{4})\.(\d{1,3})\.(\d{1,5})", re.IGNORECASE)


def normalizuj(txt):
    """'Dz.U.RRRR.NN.PPPP' -> 'Dz.U. RRRR poz. PPPP'. Uruchamiaj przed DZU_PATTERN."""
    return RE_LEX.sub(lambda m: "Dz.U. %s poz. %s" % (m.group(1), m.group(3)), txt)


def extract_act_dzu_pairs(text: str):
    """Zwraca listę (zbiór_slow_kluczowych, nazwa_aktu_przyblizona, rok, poz)
    dla każdej linii zawierającej WZORZEC nazwy ustawy + numer Dz.U.

    ⚠️ PRÓBA NAPRAWY 2026-07-26 I COFNIĘCIE TEGO SAMEGO DNIA: próbowano
    zbierać WSZYSTKIE cytaty Dz.U. w linii (nie tylko pierwszy), żeby
    usunąć 2 fałszywe alarmy dla wierszy wieloaktowych (np. "KK+KPK").
    Efekt uboczny: liczba alarmów wzrosła z 2 do 14 — wielokrotne wpisy
    per linia zaczęły kolidować kombinatorycznie z innymi wielokrotnymi
    wpisami w głównej mapie, generując WIĘCEJ szumu niż usuwały.
    Zmianę COFNIĘTO w całości. Test pozostaje z ZNANYM, udokumentowanym
    ograniczeniem: wiersze z wieloma aktami/numerami Dz.U. w jednej
    komórce tabeli mogą dawać fałszywe alarmy, bo porównywany jest tylko
    PIERWSZY numer w linii. Weryfikuj ręcznie takie przypadki zamiast
    ufać automatycznemu werdyktowi — dokładnie do tego służy status WARN
    (nie FAIL) tego testu.
    """
    results = []
    for line in text.splitlines():
        # ⭐ F-125 (2026-08-23g): normalizacja PRZED dopasowaniem — inaczej
        # wiersze zapisane notacją LEX ("Dz.U.2026.0.468") są dla tego testu
        # niewidoczne (DZU_PATTERN wymaga literalnego "poz."), a rozbieżność
        # numeru w takim wierszu nie może zostać wykryta.
        # ⚠️ Normalizujemy KOPIĘ linii do dopasowania, ale prefiks tniemy z
        # linii ORYGINALNEJ byłoby błędem — offsety m.start() odnoszą się do
        # tekstu znormalizowanego, więc prefiks liczymy z tego samego ciągu.
        line = normalizuj(line)
        m = DZU_PATTERN.search(line)
        if not m:
            continue
        prefix = line[: m.start()].strip()
        prefix = re.sub(r"^\|+\s*", "", prefix)
        prefix = re.sub(r"\s+", " ", prefix).strip()
        if len(prefix) < 8:
            continue
        # ⚠️ POPRAWKA 2026-07-21 (znaleziona przy PIERWSZYM uruchomieniu):
        # pierwotna wersja brała TYLKO pierwsze 6 słów >3 znaków jako
        # "klucz" — dla KRÓTKICH prefiksów (np. "KKS + Ustawa AML |")
        # dawało to JEDNOSŁOWNY klucz ("ustawa"), który KOLIDOWAŁ z
        # dziesiątkami niepowiązanych wpisów. POPRAWIONA wersja: bierz
        # WSZYSTKIE słowa >3 znaki jako ZBIÓR (nie krotkę w kolejności),
        # WYKLUCZ nadmiernie ogólne słowa ("ustawa", "kodeks", "prawo",
        # "przepisy" same w sobie nie wystarczają do dopasowania).
        STOPWORDS = {"ustawa", "ustawy", "kodeks", "prawo", "przepisy",
                     "rozporzadzenie", "dnia", "roku"}
        words = {w.lower() for w in re.findall(r"\w+", prefix) if len(w) > 3}
        distinctive = words - STOPWORDS
        if len(distinctive) < 1:
            continue
        results.append((distinctive, prefix, m.group(1), m.group(2)))
    return results


def jaccard(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default="/mnt/skills/user")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    repo_root = Path(args.repo_root).resolve()
    main_map = repo_root / "prawo-polskie-v2" / "ROUTING-MAP.md"

    if not main_map.exists():
        print(f"BŁĄD: nie znaleziono głównej mapy {main_map}")
        sys.exit(2)

    main_text = main_map.read_text(encoding="utf-8", errors="strict")
    main_pairs = extract_act_dzu_pairs(main_text)

    # Próg podobieństwa Jaccarda dla uznania dwóch prefiksów za "TEN SAM akt"
    # — dobrany EMPIRYCZNIE (2026-07-21): 0.5 filtruje kolizje przypadkowe
    # (jak "ustawa aml" vs "ustawa pit"), zachowując dopasowania rzeczywiste
    # (np. "ustawa o straży granicznej" w obu mapach, różniące się szykiem).
    SIMILARITY_THRESHOLD = 0.5

    suspicious = 0
    checked_local_maps = 0
    report_lines = []
    seen_pairs = set()  # unikaj duplikatów tego samego raportu

    for skill_dir in sorted(repo_root.iterdir()):
        if not skill_dir.is_dir() or skill_dir.name in ("shared", "audyt-systemu-v4", "prawo-polskie-v2"):
            continue
        local_map = skill_dir / "MAPA-AKTOW.md"
        if not local_map.exists():
            continue
        checked_local_maps += 1
        local_text = local_map.read_text(encoding="utf-8", errors="strict")
        local_pairs = extract_act_dzu_pairs(local_text)

        for l_words, l_prefix, l_year, l_poz in local_pairs:
            best_match = None
            best_score = 0.0
            for m_words, m_prefix, m_year, m_poz in main_pairs:
                score = jaccard(l_words, m_words)
                if score > best_score:
                    best_score = score
                    best_match = (m_words, m_prefix, m_year, m_poz)
            if best_match is None or best_score < SIMILARITY_THRESHOLD:
                continue  # brak wystarczająco podobnego dopasowania — poza zakresem
            m_words, m_prefix, m_year, m_poz = best_match
            if (l_year, l_poz) != (m_year, m_poz):
                dedup_key = (skill_dir.name, l_prefix[:40], m_prefix[:40])
                if dedup_key in seen_pairs:
                    continue
                seen_pairs.add(dedup_key)
                suspicious += 1
                report_lines.append(
                    f"  ⚠️ PODEJRZANA ROZBIEŻNOŚĆ  {skill_dir.name} "
                    f"(podobieństwo {best_score:.0%}):\n"
                    f"        lokalna mapa:  \"{l_prefix[:70]}\" → Dz.U. {l_year} poz. {l_poz}\n"
                    f"        główna mapa:   \"{m_prefix[:70]}\" → Dz.U. {m_year} poz. {m_poz}\n"
                    f"        (WYMAGA weryfikacji na ISAP — który numer jest aktualny)"
                )

    if not args.quiet:
        print(f"test_cross_map_dzu.py — {checked_local_maps} lokalnych map "
              f"porównanych z główną mapą routingu\n")
        if report_lines:
            print("\n".join(report_lines))
        else:
            print("  Brak wykrytych rozbieżności Dz.U. między mapami.")
        print()
        if suspicious:
            print(f"WYNIK T3: WARN — {suspicious} podejrzanych rozbieżności "
                  f"WYMAGA weryfikacji manualnej na ISAP (heurystyka, nie "
                  f"automatyczny werdykt który numer jest poprawny).")
        else:
            print("WYNIK T3: OK — brak wykrytych rozbieżności "
                  "(w granicach czułości tej heurystyki tekstowej).")
        print()
        print("⛔ UWAGA (F-82): zgodność rejestrów między sobą NIE jest "
              "weryfikacją merytoryczną — ten test jest ślepy na numer "
              "błędny, ale wpisany ZGODNIE we wszystkich mapach. "
              "Kontrola uzupełniająca: porównuj metryki aktów zmienianych, "
              "cytowane w tekstach nowelizacji, z mapą Dz.U.")

    sys.exit(1 if suspicious else 0)


if __name__ == "__main__":
    main()
