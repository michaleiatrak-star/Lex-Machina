#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
T28 — kontrola WARTOŚCI i CYTATÓW, nie aktów.

Powstał 2026-09-12f z obserwacji O-12: kontrola aktualności AKTU nie jest
kontrolą aktualności WARTOŚCI. T3/T11/T15/T24/T27 pytają o numery Dz.U. —
żaden z nich nie widzi trzech zmierzonych mechanizmów dezaktualizacji:

  1. nowe rozporządzenie UCHYLA poprzednie (300 -> 1000 zł, Dz.U. 2025 poz. 770)
  2. przepis UCHYLONY, materia przeniesiona gdzie indziej (art. 503 KPC)
  3. decyzja RPP zmienia wynik wzoru (wszystkie odsetki ustawowe)

Trzy bramki:

  W1  REJESTR ZNANYCH BŁĘDNYCH CYTATÓW              -> FAIL
      Wyłącznie pozycje ZWERYFIKOWANE odczytem treści aktu, z datą sesji.
      Nie jest to heurystyka "wykryj wszystkie błędy" — to zapora przed
      NAWROTEM konkretnych usterek. Powód: "art. 328[1] KPC" naprawiano
      trzykrotnie i sześciokrotnie przetrwał, bo naprawiano PLIK, w którym
      błąd zauważono, a nie WZORZEC w korpusie.

  W2  PROCENT PRZY POJĘCIU "ODSETKI USTAWOWE"       -> FAIL
      Wartość zakotwiczona w stopie NBP nie da się utrwalić poprawnie:
      RPP zmienia stopę bez nowelizacji. Dozwolony jest WZÓR
      (punkty procentowe, dwukrotność, stopa referencyjna/lombardowa),
      zakazany jest WYNIK.

  W3  WIERSZ KWOTOWY BEZ PODSTAWY PRAWNEJ           -> WARN
      Wiersz tabeli z kwotą w zł, w którym żadna komórka nie wskazuje
      jednostki redakcyjnej ani aktu. Świadomie WARN, nie FAIL — bywają
      wiersze przykładowe i kalkulacyjne.

Kody wyjścia: 0 = czysto (WARN dopuszczalne), 1 = FAIL, 2 = błąd wywołania.
"""

import argparse
import os
import re
import sys

# ---------------------------------------------------------------------------
# W1 — rejestr znanych błędnych cytatów
# ---------------------------------------------------------------------------
# Każda pozycja: (id, regex, poprawnie, sesja weryfikująca)
# ⛔ Do rejestru wolno dopisać WYŁĄCZNIE pozycję potwierdzoną odczytem treści
#    aktu (RZĄD 1). Heurystyki i domysły tu nie wchodzą — fałszywy alarm
#    w bramce FAIL kończy się jej wyłączeniem, a wtedy tracimy całą zaporę.

REJESTR = [
    ("W1-328",
     r"art\.?\s*328\s*[¹\u00b9]|art\.?\s*328\[1\]",
     "art. 328 § 1 KPC (jednostka 328-indeks-1 NIE ISTNIEJE)",
     "2026-08-04 / 2026-08-08 / 2026-09-12d"),
    ("W1-503",
     r"art\.?\s*503\s*(§\s*1)?\s*KPC",
     "art. 505 § 1 KPC (dopuszczalność) + art. 480(2) § 2 KPC (termin); "
     "art. 500-504 KPC są UCHYLONE",
     "2026-09-12d"),
    ("W1-27-KSCU",
     r"art\.?\s*27\s*pkt\s*1\s*[-–]\s*6\s*KSCU",
     "art. 13 ust. 1 pkt 1-7 KSCU (art. 27 to opłata stała 200 zł, "
     "bez progów WPS)",
     "2026-09-12"),
    ("W1-13-1a",
     r"art\.?\s*13\s*ust\.?\s*1a\s*KSCU",
     "jednostka NIE ISTNIEJE — sprawy gospodarcze podlegają art. 13 "
     "na zasadach ogólnych",
     "2026-09-12"),
    ("W1-19-2b",
     r"art\.?\s*19\s*§\s*2b",
     "art. 19 ust. 2 pkt 2 KSCU (jednostka § 2b NIE ISTNIEJE)",
     "2026-09-12"),
    ("W1-69-zabezp",
     r"art\.?\s*69\s*§\s*1\s*KSCU",
     "art. 68 pkt 1 KSCU dla wniosku o zabezpieczenie; art. 69 ust. 1 to "
     "osobna konstrukcja ułamkowa",
     "2026-09-12"),
    ("W1-KSCU-par",
     r"art\.?\s*(13|19|35|96)\s*§\s*\d+\s*(pkt\s*\d+\s*)?KSCU",
     "KSCU dzieli się na USTĘPY, nie paragrafy — pisać 'ust.'",
     "2026-09-12"),
    # ⚠️ Zawężone 2026-09-12f: pierwsza wersja łapała POPRAWNY wiersz
    #    "Apelacja wykroczeniowa ... od otrzymania wyroku z uzasadnieniem
    #    | art. 105 § 1 KPW", bo szukała samego rdzenia "uzasadnien".
    #    Sygnaturą błędu jest WNIOSEK o uzasadnienie albo termin "3 dni".
    ("W1-105-KPW",
     r"art\.?\s*105\s*§?\s*1?\s*KPW[^\n]{0,80}(wniosek|\u017c[ąa]dani)[^\n]{0,30}uzasadnien"
     r"|(wniosek|\u017c[ąa]dani)[^\n]{0,40}uzasadnien[^\n]{0,60}art\.?\s*105\s*§?\s*1?\s*KPW"
     r"|3\s*dni[^\n]{0,60}art\.?\s*105\s*§?\s*1?\s*KPW"
     r"|art\.?\s*105\s*§?\s*1?\s*KPW[^\n]{0,60}3\s*dni",
     "art. 35 § 1 KPW — 7 dni zawite; art. 105 KPW reguluje APELACJĘ",
     "2026-09-12d"),
    ("W1-94-KPSW",
     r"art\.?\s*94\s*KPSW",
     "art. 94 § 1 KPW w zw. z art. 506 § 1 KPK",
     "2026-09-12d"),
    # Dodane 2026-09-12i: art. 223 § 1 Op okresla wylacznie TRYB wnoszenia
    # odwolania (za posrednictwem organu). Termin 14 dni jest w § 2.
    ("W1-223-Op",
     r"(14\s*dni|czternastu\s*dni)[^\n]{0,60}art\.?\s*223\s*§\s*1\s*Op"
     r"|art\.?\s*223\s*§\s*1\s*Op[^\n]{0,60}(14\s*dni|czternastu\s*dni)",
     "art. 223 § 2 Op — § 1 okresla tylko tryb wnoszenia odwolania",
     "2026-09-12i"),
    ("W1-ryczalt-300",
     r"zrycza[łl]towan[^\n]{0,80}\b300\s*z[łl]|\b300\s*z[łl][^\n]{0,40}"
     r"oskar[żz]eni[a-z]*\s+prywatn",
     "1000 zł od 1.07.2025 — rozp. MS z 10.06.2025 (Dz.U. 2025 poz. 770) "
     "uchyliło akt z 2003 r.",
     "2026-09-12c"),
    # Dodane 2026-09-16b/c (T5): podmiany aktu w ROUTING-MAP.
    ("W1-kopaliny-2024-44",
     r"wydobyci[a-z]*\s+(niekt[óo]rych\s+)?kopalin[^\n]{0,80}2024\s*(poz\.\s*|/)\s*44(?!\d)",
     "t.j. Dz.U. 2026 poz. 454 — 2024 poz. 44 to t.j. ustawy o rehabilitacji",
     "2026-09-16b"),
    ("W1-KC-2024-1360",
     r"KC[^\n]{0,40}2024\s*poz\.\s*1360(?!\d)",
     "t.j. KC Dz.U. 2026 poz. 795 — 2024 poz. 1360 to rozporządzenie RM (akt objęty t.j.)",
     "2026-09-16e"),
    ("W1-117-KC-6lat",
     r"art\.?\s*117\s*(§\s*1\s*)?KC[^\n]{0,15}(6|sześć)\s*lat",
     "art. 118 KC — art. 117 § 1 nie podaje terminu",
     "2026-09-16f"),
    ("W1-1007-otwarcie-testamentu",
     r"otwarcia\s+testamentu[^\n]{0,40}1007|1007[^\n]{0,60}otwarcia\s+testamentu",
     "art. 1007 KC: ogłoszenie testamentu (§ 1) albo otwarcie SPADKU (§ 2–4)",
     "2026-09-16f"),
    ("W1-4421-par3-20lat",
     r"20\s*lat[^\n]{0,60}(na\s+osobie)[^\n]{0,30}442\s*(¹|1|\[1\])\s*§\s*3",
     "art. 442¹ § 3 KC — szkoda na osobie: nie wcześniej niż 3 lata od wiedzy (20 lat to § 2)",
     "2026-09-16f"),
    ("W1-86-KKS-akcyzowy",
     r"przemyt\s+akcyzow[^\n]{0,60}art\.?\s*86\s*KKS",
     "art. 86 KKS to przemyt CELNY; wyroby akcyzowe — art. 63–69a KKS",
     "2026-09-16g"),
    ("W1-87-KKS-360",
     r"art\.?\s*87\s*KKS[^\n]{0,40}360\s*stawek",
     "art. 87 § 1 KKS: grzywna do 720 stawek albo pozbawienie wolności, albo obie",
     "2026-09-16g"),
    ("W1-PZP-138-ponizej15",
     r"poniżej\s+15\s+dni[^\n]{0,60}(nadzwyczajn|wyjątkow)",
     "art. 138 ust. 2 PZP — skrócenie tylko do NIE MNIEJ niż 15 dni",
     "2026-09-16j"),
    ("W1-PZP-odwolanie-wstrzymuje",
     r"odwołani[a-z]*[^\n]{0,40}(musi|obowiązan\w*)\s+wstrzyma\w*\s+postępowani",
     "art. 577 PZP — zakaz ZAWARCIA UMOWY, nie wstrzymanie postępowania",
     "2026-09-16j"),
    ("W1-KSC-art16-terminy",
     r"[Tt]erminy\s+obowiązków[^\n]{0,40}art\.?\s*16\s*KSC",
     "art. 33 ustawy z 23.01.2026 (Dz.U. 2026 poz. 252) — przepis przejściowy, nie art. 16 KSC",
     "2026-09-16k"),
    ("W1-UODO-art50-ust4",
     r"art\.?\s*50\s*ust\.?\s*4\s*(ustawy\s+o\s+ochronie\s+danych|u\.?\s*o\.?\s*d\.?\s*o)",
     "art. 50 u.o.d.o. ma tylko ust. 1–2 (sprawozdanie roczne) — jednostka nie istnieje",
     "2026-09-16l"),
    ("W1-UODO-237-KPA",
     r"(?i)(UODO|skarg\w* do Prezesa|termin\w* rozpatrzenia)[^\n]{0,120}art\.?\s*237\s*§\s*[12]\s*KPA|art\.?\s*237\s*§\s*[12]\s*KPA[^\n]{0,80}(UODO|termin\w* rozpatrzenia)",
     "postępowanie przed Prezesem UODO: art. 35 § 3 KPA w zw. z art. 7 ust. 1 u.o.d.o. (art. 237 — skargi z działu VIII)",
     "2026-09-16l"),
    ("W1-PPSA-53par3-14dni",
     r"14\s*(DNI|dni)[^\n]{0,60}art\.?\s*53\s*§\s*3\s*PPSA|art\.?\s*53\s*§\s*3\s*PPSA[^\n]{0,60}14\s*(DNI|dni)",
     "skarga na interpretację: 30 dni (art. 53 § 1 PPSA); § 3 — 6 miesięcy dla prokuratora/RPO/RPD",
     "2026-09-16m"),
    ("W1-KPA-160",
     r"art\.?\s*160\s*KPA(?![^\n]{0,40}(uchylon|UCHYLON))",
     "art. 160 KPA jest uchylony — odszkodowanie: art. 417¹ § 2 KC",
     "2026-09-16m"),
    ("W1-KPA-128-odwolanie-14",
     r"art\.?\s*128\s*KPA[^\n]{0,20}odwołanie\s*\(14",
     "termin odwołania — art. 129 § 2 KPA (art. 128 — treść odwołania)",
     "2026-09-16m"),
    ("W1-KRO-69-6mies",
     r"matk\w*[^\n]{0,30}\|?\s*6\s*miesi\w*[^\n]{0,20}art\.?\s*69\s*(§\s*1\s*)?KRO",
     "art. 69 § 1 KRO — ROK od dowiedzenia się (nie 6 miesięcy)",
     "2026-09-17n"),
    ("W1-KRO-70-3lata",
     r"dzieck\w*[^\n]{0,40}3\s*lat\w*\s+od\s+pełnoletno[^\n]{0,30}art\.?\s*70",
     "art. 70 § 1 KRO — ROK od dowiedzenia się (po pełnoletności)",
     "2026-09-17n"),
    ("W1-KRO-59-3mies",
     r"(art\.?\s*59\s*KRO[^\n]{0,120}3\s*miesi|3\s*miesi\w*[^\n]{0,80}uprawomocnieni\w*\s+rozwodu)",
     "art. 59 KRO (od 8.10.2025) — ROK od uprawomocnienia rozwodu",
     "2026-09-17n"),
    ("W1-KPC-kasacja-30dni-SA",
     r"(?i)30\s*dni\s+od\s+wyroku\s+SA|kasacyjn\w*\s+do\s+SN[^\n]{0,20}\|\s*\*\*30\s*dni",
     "skarga kasacyjna w sprawie cywilnej: 2 miesiące od doręczenia z uzasadnieniem (art. 398⁵ § 1 KPC)",
     "2026-09-17o"),
    ("W1-Sygn-art12-terminy",
     r"(7\s*dni|3\s*miesiące)[^\n]{0,40}\|\s*Art\.\s*12\s+ustawy",
     "terminy procedury wewnętrznej — art. 25 ust. 1 pkt 5 i 7 ustawy o ochronie sygnalistów",
     "2026-09-17o"),
    ("W1-RODO-48h",
     r"48\s*h[^\n]{0,60}(RODO|art\.?\s*33)|(RODO|art\.?\s*33)[^\n]{0,60}48\s*h",
     "art. 33 ust. 1 RODO — 72 godziny po stwierdzeniu naruszenia (nie 48 h)",
     "2026-09-17q"),
    ("W1-UbezpObowLekarzy",
     r"ubezpieczeniach\s+obowi[ąa]zkowych\s+lekarzy",
     "ustawa o ubezpieczeniach obowiązkowych, UFG i PBUK (Dz.U. 2026 poz. 783) — "
     "tytuł „…lekarzy” nie istnieje",
     "2026-09-16b"),
]

# ---------------------------------------------------------------------------
# W2 — procent przy pojęciu "odsetki"
# ---------------------------------------------------------------------------
# ⚠️ Zawezone 2026-09-12i. Pierwsza wersja szukala samego rdzenia "odsetk"
#    i na pierwszym kontakcie z dr-06 dala TRZY falszywe alarmy: stawki
#    podatku u zrodla 19 %/20 % od odsetek jako KATEGORII PRZYCHODU
#    (art. 21-22 CIT, art. 30a PIT) nie maja nic wspolnego z odsetkami
#    ustawowymi. Bramka lapie teraz wylacznie NAZWANE rodzaje odsetek
#    zakotwiczonych w stopie NBP i tylko wtedy, gdy procent jest im
#    PRZYPISANY (wynosi / w wysokosci / rocznie).
ODSETKI = re.compile(
    r"odset(?:ki|ek|kom|kami)\s+(?:ustawow|maksymaln|za\s+zw[łl]ok|"
    r"za\s+op[óo][źz]nien|handlow)", re.IGNORECASE)
ATRYBUCJA = ("wynos", "w wysoko", "rocznie", "w skali roku", "=")
PROCENT = re.compile(r"\d+(?:[.,]\d+)?\s*%")
# Konstrukcje, w których procent jest LEGALNY, bo opisuje wzór, a nie wynik.
W2_NEUTRALIZATORY = (
    "punkt", "p.p.", "dwukrotno", "referencyjn", "lombardow",
    "stawki odsetek", "stawka odsetek", "stawkę odsetek",
    "obniżon", "podwyższon", "minimalnego wynagrodzenia",
)

# ---------------------------------------------------------------------------
# W3 — wiersz kwotowy bez podstawy
# ---------------------------------------------------------------------------
KWOTA = re.compile(r"\d[\d \u00a0]*(?:[.,]\d+)?\s*(?:z[łl]|PLN)\b")
# ⛔ Sama nazwa rodzaju aktu ("Rozporządzenie MS") NIE jest podstawą — właśnie
#    tak wyglądał wiersz "doręczenie przez komornika 60 zł", który przez wiele
#    wersji nie miał identyfikacji aktu. Wymagamy jednostki redakcyjnej albo
#    numeru publikacyjnego.
PODSTAWA = re.compile(
    r"art\.\s*\d|§\s*\d|\bDz\.\s*U\.|poz\.\s*\d|ust\.\s*\d|pkt\s*\d",
    re.IGNORECASE,
)

# ---------------------------------------------------------------------------
# Pliki wyłączone — dzienniki, plany i rejestry OPISUJĄ błędy, więc muszą
# móc je cytować. Wyłączenie jest po NAZWIE, nie po treści, żeby nie dało się
# ominąć bramki dopisaniem słowa "uchylony" do modułu merytorycznego.
# ---------------------------------------------------------------------------
POMIJANE_NAZWY = {
    "AUDIT-JOURNAL.md", "CHANGELOG.md", "WARN-OTWARTE.md",
    "REGRESSION-TEST-PLAN.md", "SKRYPTY-RECZNE.md",
    "CHECKLIST-DEDUP.md", "FORMAT-RAPORTU-ROZNIC.md",
}
POMIJANE_FRAGMENTY_SCIEZKI = (
    "/references/mapa_dzu_", "/references/raporty-pokrycia",
    "/scripts/", "/legacy-material-router/",
)

# Marker świadomego odstępstwa. Działa TYLKO w tej samej linii i musi podawać
# powód — to nie jest globalny wyłącznik bramki.
WYJATEK = re.compile(r"T28-OK:")

# ⚠️ ŚWIADOMY KOMPROMIS. Moduły muszą móc OPISAĆ błąd, żeby przed nim ostrzegać
#    ("art. 503 KPC jest UCHYLONY"). Bez tego wyłączenia bramka zgłaszałaby
#    własną dokumentację naprawy i zostałaby wyłączona po drugim przebiegu.
#    Cena: da się ominąć W1 dopisując do linii słowo "uchylony". Uznajemy to za
#    akceptowalne, bo taki zapis sam w sobie niesie ostrzeżenie dla czytelnika —
#    inaczej niż milczący błędny cytat, przed którym ten test broni.
OPIS_BLEDU = (
    "uchylon", "nie istnieje", "nieistniej", "było błędnie", "bylo blednie",
    "naprawion", "naprawa", "obalone", "nieaktualn", "błędn", "blednie",
    "zamiast", "-> art", "→ art", "znany błędny cytat", "t28",
)


def pliki(katalog):
    for root, dirs, names in os.walk(katalog):
        dirs[:] = [d for d in dirs if d not in (".git", "__pycache__")]
        for n in sorted(names):
            if not n.endswith(".md"):
                continue
            p = os.path.join(root, n)
            if n in POMIJANE_NAZWY:
                continue
            if any(f in p.replace(os.sep, "/") for f in POMIJANE_FRAGMENTY_SCIEZKI):
                continue
            yield p


def skanuj_tekst(tekst, sciezka="<bufor>"):
    """Zwraca (fails, warns) — listy krotek (sciezka, nr_linii, kod, opis)."""
    fails, warns = [], []
    for i, linia in enumerate(tekst.splitlines(), 1):
        if WYJATEK.search(linia):
            continue

        nisko_linii = linia.lower()
        opisuje_blad = any(m in nisko_linii for m in OPIS_BLEDU)

        for ident, wzor, poprawnie, sesja in REJESTR:
            if opisuje_blad:
                continue
            if re.search(wzor, linia, re.IGNORECASE):
                fails.append((sciezka, i, ident,
                              "znany błędny cytat -> %s [zweryfikowane %s]"
                              % (poprawnie, sesja)))

        if ODSETKI.search(linia) and PROCENT.search(linia):
            nisko = linia.lower()
            if (any(a in nisko for a in ATRYBUCJA)
                    and not any(n.lower() in nisko for n in W2_NEUTRALIZATORY)):
                fails.append((sciezka, i, "W2-ODSETKI",
                              "procent utrwalony przy pojęciu odsetek — "
                              "wartość zakotwiczona w stopie NBP; zapisz WZÓR "
                              "i przepis, liczbę bierz z obwieszczenia"))

        if linia.lstrip().startswith("|") and KWOTA.search(linia):
            if not PODSTAWA.search(linia):
                warns.append((sciezka, i, "W3-BEZ-PODSTAWY",
                              "wiersz kwotowy bez wskazania jednostki "
                              "redakcyjnej ani aktu"))
    return fails, warns


# ---------------------------------------------------------------------------
# SELFTEST — offline, bez dostępu do korpusu
# ---------------------------------------------------------------------------
PRZYPADKI = [
    # (opis, tekst, oczekiwane_fail, oczekiwane_warn)
    ("W1 łapie podatek od kopalin z numerem ustawy rehabilitacyjnej",
     "| Ustawa o podatku od wydobycia kopalin | Dz.U. 2024 poz. 44 ze zm. |", 1, 0),
    ("W1 nie rusza poprawnego t.j. podatku od kopalin",
     "Ustawa o podatku od wydobycia niektórych kopalin — t.j. Dz.U. 2026 poz. 454", 0, 0),
    ("W1 łapie KC z numerem rozporządzenia RM",
     "Weryfikacja: KC art. 118–125 (Dz.U. 2024 poz. 1360 t.j.)", 1, 0),
    ("W1 łapie 6 lat z art. 117 KC",
     "art. 117 §1 KC — 6 lat (ogólny termin roszczeń majątkowych)", 1, 0),
    ("W1 nie rusza poprawnego 6 lat z art. 118 KC",
     "art. 118 KC — 6 lat (ogólny termin)", 0, 0),
    ("W1 łapie zachowek od otwarcia testamentu",
     "PRZEDAWNIENIE: 5 lat od ogłoszenia / otwarcia testamentu (art. 1007 KC)", 1, 0),
    ("W1 łapie 20 lat dla szkody na osobie z § 3",
     "→ MAX 20 lat od zdarzenia (dla szkód na osobie — art. 4421 §3 KC)", 1, 0),
    ("W1 łapie przemyt akcyzowy z art. 86 KKS",
     "| Przemyt akcyzowy (uszczuplenie > małej wartości) | art. 86 KKS | do 720 stawek |", 1, 0),
    ("W1 łapie art. 87 KKS z 360 stawkami",
     "| Podanie fałszywych danych | art. 87 KKS | do 360 stawek |", 1, 0),
    ("W1 łapie skrócenie PZP poniżej 15 dni",
     "skrócenie poniżej 15 dni TYLKO w sytuacjach nadzwyczajnych", 1, 0),
    ("W1 łapie wstrzymanie postępowania po odwołaniu",
     "Złożenie odwołania → zamawiający musi wstrzymać postępowanie", 1, 0),
    ("W1 łapie terminy NIS2 przypisane art. 16 KSC",
     "Terminy obowiązków dla podmiotów (art. 16 KSC):", 1, 0),
    ("W1 łapie nieistniejący art. 50 ust. 4 u.o.d.o.",
     "art. 78 ust. 2 RODO w zw. z art. 50 ust. 4 ustawy o ochronie danych osobowych", 1, 0),
    ("W1 łapie art. 237 KPA jako termin rozpatrzenia skargi do UODO",
     "TERMIN rozpatrzenia: miesiąc od otrzymania (art. 237 §2 KPA)", 1, 0),
    ("W1 łapie 14 dni z art. 53 § 3 PPSA",
     "Zaskarżenie: skarga do WSA — TERMIN 14 DNI (art. 53 §3 PPSA — NIE 30 dni!)", 1, 0),
    ("W1 łapie odszkodowanie z art. 160 KPA",
     "→ Termin na odszkodowanie: 3 lata od stwierdzenia naruszenia prawa (art. 160 KPA", 1, 0),
    ("W1 nie rusza art. 160 KPA oznaczonego jako uchylony",
     "⛔ art. 160 KPA jest UCHYLONY — nie powołuj go", 0, 0),
    ("W1 łapie 6 miesięcy dla matki z art. 69 KRO",
     "| Zaprzeczenie ojcostwa (matka) | 6 miesięcy | art. 69 KRO |", 1, 0),
    ("W1 łapie 3 lata dla dziecka z art. 70 KRO",
     "| Zaprzeczenie ojcostwa (dziecko) | 3 lata od pełnoletności | art. 70 KRO |", 1, 0),
    ("W1 łapie 3 miesiące na powrót do nazwiska",
     "dostępna TYLKO w ciągu 3 miesięcy od uprawomocnienia rozwodu", 1, 0),
    ("W1 łapie kasację 30 dni od wyroku SA",
     "| Skarga kasacyjna do SN | **30 dni** od wyroku SA w II instancji |", 1, 0),
    ("W1 nie rusza kasacji do NSA z PPSA",
     "↓ skarga kasacyjna (30 dni od doręczenia wyroku WSA)", 0, 0),
    ("W1 łapie terminy sygnalisty z art. 12",
     "| Potwierdzenie przyjęcia zgłoszenia | 7 dni od wpływu | Art. 12 ustawy [WYMAGA WERYFIKACJI] |", 1, 0),
    ("W1 łapie 48h przypisane RODO",
     "| Termin 48h od wykrycia incydentu (jak RODO art. 33) |", 1, 0),
    ("W1 nie rusza poprawnych 72h z RODO",
     "72 h po stwierdzeniu naruszenia (art. 33 ust. 1 RODO)", 0, 0),
    ("W1 łapie nieistniejący tytuł ustawy o OC lekarzy",
     "| Ustawa o ubezpieczeniach obowiązkowych lekarzy | Dz.U. 2026 poz. 783 |", 1, 0),
    ("W1 łapie 328 z indeksem górnym",
     "Na podstawie art. 328\u00b9 \u00a71 KPC wnoszę o uzasadnienie.", 1, 0),
    ("W1 łapie zapis nawiasowy 328[1]",
     "termin z art. 328[1] KPC", 1, 0),
    ("W1 nie rusza poprawnego art. 328 § 1 KPC",
     "Wniosek o uzasadnienie — art. 328 \u00a7 1 KPC, tydzień.", 0, 0),
    ("W1 łapie uchylony art. 503 KPC",
     "| Sprzeciw | 14 dni | art. 503 \u00a71 KPC |", 1, 0),
    ("W1 nie rusza art. 505 § 1 KPC",
     "| Sprzeciw | 2 tygodnie | art. 505 \u00a7 1 KPC |", 0, 0),
    ("W1 łapie progi z art. 27 KSCU",
     "Progi WPS wg art. 27 pkt 1-6 KSCU.", 1, 0),
    ("W1 łapie nieistniejący art. 13 ust. 1a KSCU",
     "Sprawy gospodarcze: 5 % max 20 000 zł (art. 13 ust. 1a KSCU)", 1, 0),
    ("W1 łapie paragraf zamiast ustępu w KSCU",
     "zwolnienie z art. 96 \u00a71 pkt 4 KSCU", 1, 0),
    ("W1 nie rusza poprawnego art. 96 ust. 1 pkt 4 KSCU",
     "zwolnienie z art. 96 ust. 1 pkt 4 KSCU", 0, 0),
    ("W1-105 nie rusza poprawnego wiersza o apelacji wykroczeniowej",
     "| **7 dni** | Apelacja wykroczeniowa \u2014 od otrzymania wyroku "
     "z uzasadnieniem | **art. 105 \u00a7 1 KPW** |", 0, 0),
    ("W1-105 łapie wniosek o uzasadnienie z art. 105 KPW",
     "| KPW | Wniosek o uzasadnienie | 3 dni | art. 105 \u00a71 KPW |", 1, 0),
    ("W1 łapie art. 94 KPSW bez paragrafu",
     "Sprzeciw od wyroku nakazowego: 7 dni (art. 94 KPSW).", 1, 0),
    ("W1 łapie termin odwolania przypisany do art. 223 § 1 Op",
     "Odwolanie od decyzji: 14 dni od doreczenia (art. 223 \u00a7 1 Op)", 1, 0),
    ("W1 nie rusza poprawnego art. 223 § 2 Op",
     "Odwolanie: 14 dni od doreczenia (art. 223 \u00a7 2 Op)", 0, 0),
    ("W1 łapie nieaktualne 300 zł ryczałtu",
     "zryczałtowana równowartość wydatków wynosi 300 zł", 1, 0),
    ("W2 łapie utrwalony procent odsetek",
     "Odsetki ustawowe za opóźnienie wynoszą 9,25 % rocznie.", 1, 0),
    ("W2 nie rusza stawki podatku u zrodla OD odsetek jako przychodu",
     "STAWKI USTAWOWE (art. 21-22 CIT): 19% (dywidendy) lub 20% (odsetki,", 0, 0),
    ("W2 nie rusza stawki podatku obok wzmianki o odsetkach za zwloke",
     "Obowiazek zaplaty PODSTAWOWEJ stawki (19%/20%) + ODSETKI za zwloke", 0, 0),
    ("W2 nie rusza stawki 20% od odsetek z rachunkow bankowych",
     "stawka **20%** OD odsetek/zyskow Z rachunkow bankowych", 0, 0),
    ("W2 przepuszcza wzór w punktach procentowych",
     "odsetki ustawowe = stopa referencyjna NBP + 3,5 punktu procentowego", 0, 0),
    ("W2 przepuszcza stawki podatkowe oparte na stopie lombardowej",
     "Stawka odsetek za zwłokę: 200 % stopy lombardowej + 2 %, "
     "nie mniej niż 8 %.", 0, 0),
    ("W3: nazwa rodzaju aktu bez numeru NIE jest podstawą",
     "| Doręczenie przez komornika | 60 zł | Rozporządzenie MS |", 0, 1),
    ("W3 milczy, gdy wiersz ma jednostkę redakcyjną",
     "| Doręczenie przez komornika | 60 zł | art. 41 ust. 1 u.k.k. |", 0, 0),
    ("linia OPISUJĄCA błąd nie jest zgłaszana",
     "\u26d4 art. 503 \u00a71 KPC jest UCHYLONY \u2014 termin daje art. 480[2] \u00a7 2 KPC",
     0, 0),
    ("ale milczący błędny cytat obok opisu w innej linii — nadal FAIL",
     "\u26d4 art. 503 KPC jest uchylony\n| Sprzeciw | 14 dni | art. 503 \u00a71 KPC |",
     1, 0),
    ("marker T28-OK wyłącza kontrolę w tej jednej linii",
     "art. 503 \u00a71 KPC  <!-- T28-OK: cytat historyczny w opisie naprawy -->",
     0, 0),
]


def selftest():
    ok = 0
    for opis, tekst, exp_f, exp_w in PRZYPADKI:
        f, w = skanuj_tekst(tekst, "<selftest>")
        if len(f) == exp_f and len(w) == exp_w:
            ok += 1
            print("  OK   %s" % opis)
        else:
            print("  BŁĄD %s -> fail=%d (oczek. %d), warn=%d (oczek. %d)"
                  % (opis, len(f), exp_f, len(w), exp_w))
    print("\nSELFTEST: %d/%d" % (ok, len(PRZYPADKI)))
    return 0 if ok == len(PRZYPADKI) else 1


def main():
    ap = argparse.ArgumentParser(
        description="T28 — kontrola wartości i cytatów prawnych (offline)")
    ap.add_argument("--katalog", default=".",
                    help="katalog do przeskanowania (domyślnie bieżący)")
    ap.add_argument("--selftest", action="store_true",
                    help="uruchom testy własne bez dostępu do korpusu")
    ap.add_argument("--tylko-fail", action="store_true",
                    help="pomiń sekcję WARN w raporcie")
    args = ap.parse_args()

    if args.selftest:
        return selftest()

    if not os.path.isdir(args.katalog):
        print("BŁĄD: nie ma katalogu %s" % args.katalog, file=sys.stderr)
        return 2

    fails, warns, n = [], [], 0
    for p in pliki(args.katalog):
        n += 1
        try:
            with open(p, encoding="utf-8") as fh:
                tekst = fh.read()
        except (OSError, UnicodeDecodeError) as e:
            warns.append((p, 0, "W0-ODCZYT", "nie udało się odczytać: %s" % e))
            continue
        f, w = skanuj_tekst(tekst, p)
        fails.extend(f)
        warns.extend(w)

    print("T28 — przeskanowano %d plików .md w %s\n" % (n, args.katalog))

    if fails:
        print("FAIL (%d):" % len(fails))
        for p, i, kod, opis in fails:
            print("  %s:%d  [%s] %s" % (p, i, kod, opis))
    else:
        print("FAIL: brak")

    if warns and not args.tylko_fail:
        print("\nWARN (%d):" % len(warns))
        for p, i, kod, opis in warns:
            print("  %s:%d  [%s] %s" % (p, i, kod, opis))

    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
