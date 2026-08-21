---
name: baza-aktow-okolopodatkowych
version: 1.0.0
utworzono: 2026-08-11 (na żądanie użytkownika, analogicznie do
  BAZA-AKTOW-OKOLOAKCYZOWYCH.md — kontynuacja tej samej naprawy)
status: production
przeznaczenie: |
  Ustrukturyzowana mapa głównych aktów podatkowych i okołopodatkowych,
  z metrykami Dz.U. zweryfikowanymi bezpośrednio na ISAP/obwieszczeniach
  Marszałka Sejmu w dniu utworzenia. Cel: ta sama naprawa co przy akcyzie
  — wykryto, że MAPA-AKTOW.md (DR-06) i ROUTING-MAP.md (prawo-polskie-v2)
  są dwoma niezależnie utrzymywanymi rejestrami tych samych faktów i
  mogą się rozjechać bez wzajemnej synchronizacji. Ten plik NIE zastępuje
  KROK 2C (shared/PRAWO-HARDGATE.md) — wskazuje kierunek, weryfikacja
  treści konkretnego artykułu i tak jest obowiązkowa przy każdym użyciu.
powiązane:
  - dr-06-podatki-finanse-publiczne-aml/MAPA-AKTOW.md
  - prawo-polskie-v2/ROUTING-MAP.md
  - dr-06-podatki-finanse-publiczne-aml/references/BAZA-AKTOW-OKOLOAKCYZOWYCH.md
  - shared/PRAWO-HARDGATE.md (KROK 2C)
  - shared/AKTY-PRAWNE-MASTER.md (DEPRECATED — nie używać, patrz plik)
---

# Baza aktów okołopodatkowych

## 0a. ⛔ DRUGA TURA — spadki, darowizny i dalsza seria (data kontroli: 2026-08-11, ta sama sesja)

> Na żądanie użytkownika: "teraz darowizny, spadki i dalsza seria różnych
> podatkowych aktów". Zweryfikowano: podatek od spadków i darowizn, PCC,
> podatki i opłaty lokalne, ryczałt, ustawa o grach hazardowych.

| Akt | Oznaczenie w MAPA-AKTOW / ROUTING-MAP | ✅ Wynik weryfikacji (2026-08-11) | Status |
|---|---|---|---|
| Ustawa o podatku od spadków i darowizn | Dz.U. 2024 poz. 1837 t.j. | ⛔ NIEAKTUALNE — najnowszy t.j. to **Dz.U. 2026 poz. 478** (obwieszczenie 27.03.2026, publ. 07.04.2026). Uwaga merytoryczna: między starym a nowym t.j. weszły w życie istotne nowelizacje treściowe — ustawa z 25.07.2025 (Dz.U. poz. 1064, w życie 20.08.2025) i ustawa z 21.11.2025 (Dz.U. poz. 1854, w życie 7.01.2026, dodająca m.in. nowy art. 4c) — to nie tylko zmiana numeru technicznego, tylko realna zmiana treści w okresie, kiedy system wskazywał stary t.j. | ⛔ POPRAWIONO (ten sam wzorzec co akcyza) |
| Ustawa o podatku od czynności cywilnoprawnych (PCC) | Dz.U. 2026 poz. 191 t.j. | ✅ ZGODNE (obwieszczenie 17.02.2026, w życie 19.02.2026) | ✅ bez zmian |
| Ustawa o podatkach i opłatach lokalnych | Dz.U. 2025 poz. 707 t.j. | ✅ ZGODNE (obwieszczenie 21.05.2025) | ✅ bez zmian |
| Ustawa o zryczałtowanym podatku dochodowym (ryczałt) | Dz.U. 2025 poz. 843 t.j. | ✅ ZGODNE (obwieszczenie 13.06.2025) — nowelizacja poz. 779/2026 już wcześniej odnotowana (AUDYT-2026-08-11e) | ✅ bez zmian |
| Ustawa o grach hazardowych (część "podatki sektorowe") | Wcześniej BEZ przypisanego numeru — MAPA-AKTOW miała tylko "⚠️ zweryfikuj t.j. pozostałych 4 ustaw" | ✅ USTALONE: Dz.U. 2025 poz. 595 t.j. (obwieszczenie 10.04.2025) + nowelizacja Dz.U. 2026 poz. 176 | ✅ uzupełniono (wcześniej całkowity brak) |

⚠️ **Nadal poza zakresem tej i poprzedniej tury** (jawnie odnotowane,
NIE zweryfikowane w tej sesji): podatek tonażowy (2006), opłata cukrowa
(ustawa o zdrowiu publicznym), podatek od sprzedaży detalicznej (2016),
ustawa o obligacjach, ustawa o usługach płatniczych, ustawa o biegłych
rewidentach, ustawa o doradztwie podatkowym, ustawa o finansach
publicznych (UFP). Priorytet do kolejnej tury: UFP i podatek od
instytucji finansowych — oznaczone 🔴 (najwyższe ryzyko dezaktualizacji)
w tabeli ryzyka `shared/AKTY-PRAWNE-MASTER.md` (plik DEPRECATED, tabela
ryzyka nadal orientacyjnie użyteczna).

---

## 0. ⛔ STATUS AKTUALNOŚCI — wynik weryfikacji online (data kontroli: 2026-08-11)

> Zweryfikowano na ISAP/obwieszczeniach Marszałka Sejmu tekst jednolity
> pięciu głównych aktów (VAT, PIT, CIT, Ordynacja podatkowa, KAS).
> **Wynik: w przeciwieństwie do akcyzy, te pięć pozycji w
> `MAPA-AKTOW.md` i `ROUTING-MAP.md` było AKTUALNYCH** (Dz.U. zgodne
> z najnowszym ogłoszonym t.j.) — ale w kilku miejscach brakowało
> odnotowania nowelizacji ogłoszonych PO tekście jednolitym, a w jednym
> przypadku (KAS) numer jednej z nowelizacji był rozbieżny ze
> zweryfikowanym źródłem.

| Akt | Oznaczenie w MAPA-AKTOW / ROUTING-MAP | ✅ Wynik weryfikacji (2026-08-11) | Status |
|---|---|---|---|
| Ustawa o VAT | Dz.U. 2025 poz. 775 t.j. | ✅ ZGODNE (obwieszczenie 21.05.2025) — ⚠️ brakowało odnotowania nowelizacji po t.j.: Dz.U. 2025 poz. 1811 (7.11.2025), Dz.U. 2026 poz. 507, **Dz.U. 2026 poz. 846** (29.05.2026, zmiana Ordynacji podatkowej i "niektórych innych ustaw" — obejmuje też VAT) | ✅ t.j. aktualny / dodano nowelizacje |
| Ustawa o PIT | Dz.U. 2026 poz. 592 t.j. | ✅ ZGODNE (obwieszczenie 17.04.2026) — ⚠️ brakowało: Dz.U. 2026 poz. 779 (15.06.2026, ustawa zmieniająca jednocześnie PIT/CIT/ryczałt), **Dz.U. 2026 poz. 846** | ✅ t.j. aktualny / dodano nowelizacje |
| Ustawa o CIT | Dz.U. 2026 poz. 554 t.j. | ✅ ZGODNE (obwieszczenie 27.03.2026) — ⚠️ brakowało: Dz.U. 2026 poz. 779, **Dz.U. 2026 poz. 846** | ✅ t.j. aktualny / dodano nowelizacje |
| Ordynacja podatkowa | Dz.U. 2026 poz. 622 t.j. | ✅ ZGODNE (obwieszczenie 22.04.2026, publ. 11.05.2026) — ⚠️ brakowało: **Dz.U. 2026 poz. 846** (29.05.2026 — ustawa MACIERZYSTA tej nowelizacji, zmienia OP i "niektóre inne ustawy" — stąd pojawia się we wszystkich powyższych wierszach) | ✅ t.j. aktualny / dodano nowelizację |
| Ustawa o KAS | Dz.U. 2025 poz. 1131 t.j. | ✅ ZGODNE (obwieszczenie 05.08.2025) — ⛔ ROZBIEŻNOŚĆ: MAPA-AKTOW/ROUTING-MAP podawały nowelizacje "Dz.U. 2026 poz. 395, 483"; dwa niezależne źródła (gofin.pl, inforlex.pl) wskazują **poz. 415**, nie 395, jako numer tej nowelizacji — poprawiono na poz. 415. Dodano też **Dz.U. 2026 poz. 846** | ⛔ POPRAWIONO numer (395→415) + dodano poz. 846 |

⚠️ **Wspólny mianownik:** ustawa z 29 maja 2026 r. o zmianie ustawy —
Ordynacja podatkowa oraz niektórych innych ustaw (Dz.U. 2026 poz. 846)
jest nowelizacją PRZEKROJOWĄ, dotykającą co najmniej VAT, PIT, CIT,
Ordynacji podatkowej i KAS jednocześnie — nie została jeszcze
uwzględniona w żadnym z pięciu t.j. powyżej (bo weszła w życie już po
nich). **Przy każdej sprawie dotykającej tych pięciu aktów sprawdź, czy
art., którego używasz, nie został zmieniony przez Dz.U. 2026 poz. 846**
— zakres tej nowelizacji nie został szczegółowo zbadany w tej sesji
(poza zakresem żądania), tylko odnotowany jako punkt do sprawdzenia
przy najbliższej sprawie, której dotyczy.

⚠️ **Poza zakresem tej weryfikacji** (nie sprawdzono w tej sesji —
pozostają z oznaczeniami z MAPA-AKTOW.md bez ponownej kontroli ISAP):
PCC, podatek od spadków i darowizn, podatki i opłaty lokalne, ryczałt
od przychodów ewidencjonowanych, podatki sektorowe (bankowy/gry/
tonażowy/cukrowy/detaliczny), ustawa o obligacjach, usługi płatnicze,
biegli rewidenci, doradztwo podatkowe, UFP. Do zrobienia w kolejnej
turze, jeśli sprawa tego wymaga — priorytet wg ryzyka dezaktualizacji
w `shared/AKTY-PRAWNE-MASTER.md` (plik DEPRECATED, ale tabela ryzyka
w nim nadal orientacyjnie użyteczna: 🔴 KAS/podatki = najwyższy priorytet
kontroli, co odpowiada temu, że to właśnie tu znaleziono rozbieżność).

---

## 1. Rdzeń systemu podatkowego (zweryfikowane 2026-08-11)

| Akt | Metryka Dz.U. (t.j.) | Uwaga |
|---|---|---|
| Ustawa z dnia 11 marca 2004 r. o podatku od towarów i usług (VAT) | ✅ Dz.U. 2025 poz. 775 t.j. | + nowelizacje poz. 1811/2025, 507/2026, 846/2026 |
| Ustawa z dnia 26 lipca 1991 r. o podatku dochodowym od osób fizycznych (PIT) | ✅ Dz.U. 2026 poz. 592 t.j. | + nowelizacje poz. 779/2026, 846/2026 |
| Ustawa z dnia 15 lutego 1992 r. o podatku dochodowym od osób prawnych (CIT) | ✅ Dz.U. 2026 poz. 554 t.j. | + nowelizacje poz. 779/2026, 846/2026 |
| Ustawa z dnia 29 sierpnia 1997 r. — Ordynacja podatkowa | ✅ Dz.U. 2026 poz. 622 t.j. | + nowelizacja poz. 846/2026 (macierzysta) |
| Ustawa z dnia 16 listopada 2016 r. o Krajowej Administracji Skarbowej (KAS) | ✅ Dz.U. 2025 poz. 1131 t.j. | + nowelizacje poz. 415/2026 (NIE 395), 483/2026, 846/2026 |
| Ustawa z dnia 20 listopada 1998 r. o zryczałtowanym podatku dochodowym (ryczałt) | Dz.U. 2025 poz. 843 t.j. (zgodne z MAPA-AKTOW, niezweryfikowane ponownie w tej sesji poza potwierdzeniem z podatki.gov.pl przy okazji sprawdzania PIT) | + nowelizacja poz. 779/2026 |

## 2. Powiązania krzyżowe z modułami DR-06

```
VAT              → mod-VAT-podatek-od-towarow-i-uslug.md
                   mod-VAT-klasyfikacja-produktow-baza-niejednoznacznosci.md
PIT              → mod-PIT-podatek-dochodowy-fizyczne.md
CIT              → mod-CIT-podatek-dochodowy-prawne.md
Ordynacja        → mod-OP-ordynacja-podatkowa.md
KAS              → mod-KAS-kontrola-celno-skarbowa.md
Ryczałt          → mod-ustawa-ryczalt-przychody.md
```

Żaden z powyższych modułów nie był w tej sesji otwierany do weryfikacji
TREŚCI (tylko metryki Dz.U. na poziomie aktu) — jeśli któryś cytuje
konkretny artykuł zmieniony przez Dz.U. 2026 poz. 846, wymaga to
osobnego przebiegu KROK 2C przy najbliższym użyciu.

## 3. Changelog

- **1.1.0 (2026-08-11):** Druga tura (sekcja 0a): spadki i darowizny,
  PCC, podatki lokalne, ryczałt, gry hazardowe. Znaleziono i naprawiono:
  (a) nieaktualny t.j. ustawy o spadkach i darowiznach (2024 poz. 1837 →
  2026 poz. 478) — ten sam wzorzec co akcyza, z dodatkową komplikacją,
  że w MAPA-AKTOW.md wiersz tej ustawy W OGÓLE NIE ISTNIAŁ (był tylko w
  ROUTING-MAP.md, i to z błędnym numerem) — dodano brakujący wiersz;
  (b) brak numeru Dz.U. dla ustawy o grach hazardowych w ramach wiersza
  "podatki sektorowe" — ustalono i dodano (Dz.U. 2025 poz. 595 t.j.).
  Pozostałe trzy podatki sektorowe (tonażowy, cukrowa, detaliczna) oraz
  UFP, obligacje, usługi płatnicze, biegli rewidenci, doradztwo
  podatkowe — nadal NIE zweryfikowane, jawnie odnotowane do kolejnej tury.
- **1.0.0 (2026-08-11):** Utworzenie bazy analogicznie do
  BAZA-AKTOW-OKOLOAKCYZOWYCH.md, na żądanie użytkownika. Zweryfikowano
  5 głównych aktów podatkowych (VAT, PIT, CIT, Ordynacja podatkowa, KAS)
  bezpośrednio na ISAP/obwieszczeniach. Wynik: t.j. wszystkich pięciu
  były aktualne (w przeciwieństwie do akcyzy), ale brakowało odnotowania
  nowelizacji post-t.j., w tym jednej wspólnej dla wszystkich pięciu
  (Dz.U. 2026 poz. 846). Znaleziono i poprawiono jedną rozbieżność
  liczbową w MAPA-AKTOW/ROUTING-MAP (KAS: poz. 395 → poprawnie poz. 415).
  Pozostałe akty okołopodatkowe (PCC, spadki/darowizny, lokalne, ryczałt
  szczegółowo, sektorowe, obligacje, usługi płatnicze, zawody: biegli
  rewidenci/doradcy podatkowi, UFP) NIE zostały ponownie zweryfikowane
  w tej sesji — do zrobienia w kolejnej turze.
