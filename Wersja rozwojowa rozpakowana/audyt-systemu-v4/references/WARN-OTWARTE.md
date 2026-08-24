# WARN-OTWARTE — rejestr żywy otwartych flag audytowych

**Plik:** `WARN-OTWARTE.md`
**Zawiera:** WYŁĄCZNIE to, co jeszcze DO ZROBIENIA — bez narracji, bez opisów
napraw już wykonanych, bez sekcji „zamknięte".
**Plik siostrzany:** `AUDIT-JOURNAL.md` — pełna historia (odkrycia, naprawy,
zamknięcia, wnioski). Nic z niego nie jest usuwane.
**Ostatnia sesja:** 2026-08-24f (**F-113 ZAWĘŻONA** — część projektowa wykonana: protokół testu skuteczności bramek z grupą kontrolną + narzędzie scoringowe. Zostało WYŁĄCZNIE wykonanie przebiegów. Licznik bez zmian: 17.) Poprzednia: 2026-08-24e (**F-130 otwarta i zamknięta** — `audyt-systemu-v4` był JEDYNYM skillem w systemie bez pola `description:` we frontmatterze; poprawkę wskazał użytkownik. Naprawiona też PRZYCZYNA: FAZA 2C mierzyła tylko DŁUGOŚĆ i dla pliku bez pola wypisywała `0`, klasyfikując go jako ✅ OK. Nowy test **T14** `check_description.py` — walidowany na obu stanach (sprzed poprawki: ⛔ 1; po: czysto). Licznik bez zmian: 17.) Poprzednia: 2026-08-24 (TRYB WARN-CLOSE. **F-115 ZAMKNIĘTA** — P3 wykonane, 16 skilli DR-01…DR-16 podłączonych do `shared/SELF-CHECK-ANTY-FASADA.md`; pokrycie `grep -rl` = 30 plików, kryterium zamknięcia spełnione. **F-126 ZAMKNIĘTA i ROZSZERZONA o 4. skill** — poza `analizator-przepisow-v2`, `pisma-procesowe-v3`, `prawny-router-v3` T12 ujawnił ten sam wzorzec w `dr-01`; dodatkowo wyniesiono 63-linijkowe pole `changelog:` z YAML routera. T12: 18 zgłoszeń (5 ⛔) → **0**. **F-127 otwarta i zamknięta w tej samej sesji** — 5 wstawek F-115 z sesji 08-23i było wstawionych wadliwie (4× wewnątrz bloku ```, 1× w środek zdania), klasa REGUŁY 5. **F-128 NOWA** — fałszywe alarmy MODUŁ-WIDMO w `check_rejestracja_modulow.py`. Licznik 19 → 18.) Poprzednia: 2026-08-23i (F-115 ZAWĘŻONA do P3 — self-check ANTY-FASADA przerobiony z 7 KOPII na wywołanie modułu kanonicznego `shared/SELF-CHECK-ANTY-FASADA.md`; P1 i P2 podłączone (6 skilli); fałszywa deklaracja „propagowana do wszystkich skilli" sprostowana; pokrycie 7 → 14 plików. F-126 NOWA — sekcja `## CHANGELOG` w korpusie SKILL.md trzech skilli wbrew ZASADZIE 15. Licznik 18 → 19). Poprzednia: 2026-08-23h (F-111 ZAMKNIĘTA — decyzja użytkownika: wariant B. `PRAWO-HARDGATE.md` 967 → 501 l. rdzenia + nowy `shared/PRAWO-HARDGATE-ORZECZENIA.md` 464 l., wyzwalacz binarny „sygnatura w tekście"; 88 linii historii wersji stało POWYŻEJ pierwszej normy — wyniesione do `shared/references/CHANGELOG.md`. Ścieżki zewnętrzne bez zmian: 114 plików, 212 odesłań, nazwa pliku nadrzędnego zachowana. F-115 ODBLOKOWANA. Licznik 19 → 18). Poprzednia: 2026-08-23g (TRYB WARN-CLOSE: F-121 ZAMKNIĘTA — ZASADA 14 AUDIT-CLAIM-GATE w SKILL.md + § 4 w FORMAT-RAPORTU-ROZNIC.md; F-122 ZAMKNIĘTA — FUNDAMENT-A w BLOKU A przez odesłanie do shared/MOD-ATAK-NA-SWIADKA.md, bez drugiej kopii treści; F-123 ZAMKNIĘTA — HARD GATE w raport-sytuacyjny-v2 + zapisana rozdzielna decyzja w prawo-polskie-v2 (SKILL.md nie podlega, ROUTING-MAP.md podlega reżimowi mapy); F-124 otwarta i zamknięta w tej samej sesji — pliki-sieroty w YAML audyt-systemu-v4 i martwe odesłanie do assets/ w raport-sytuacyjny-v2; F-125 NOWA, częściowo zamknięta — ślepota parserów T11/T3 na notację LEX „Dz.U.RRRR.0.PPPP", 95 wystąpień w korpusie, T11 143→140 po naprawie. Licznik 21 → 19). Poprzednia: 2026-08-23f (F-110 częściowo zamknięta; F-116 ANULOWANA; F-118 ZAMKNIĘTA; F-112 ZAMKNIĘTA; F-117 ZAMKNIĘTA; F-114 ZAMKNIĘTA; F-119 ZAMKNIĘTA (+ dwie korekty jakości po pytaniach użytkownika: ograniczenie samo-raportu nazwane wprost, kontrola na wyjściu dodana wzorem DOMAIN-LOCK); F-120 ZAMKNIĘTA — TEMPORAL-LAW-CHECK.md podniesiony z listy pytań do wymuszonej sekwencji KROK T-1…T-5, wpięty jako KROK 2C w PRAWO-HARDGATE.md i krok 4A w analizator-przepisow-v2. Licznik 28 → 21). Poprzednia: 2026-08-23e (META-ANALIZA TESTÓW ZEWNĘTRZNYCH TEST1–TEST3 — otwarte F-115…F-123, rozszerzony zakres F-113, priorytet F-111 podniesiony do wysokiego, licznik 19 → 28). Wcześniejsza: 2026-08-22l (F-13 ZAMKNIĘTA W CAŁOŚCI — kontrolny przegląd 5 plików z różnych dziedzin dr-01/dr-09/dr-11/dr-12, ZERO nowych luk, potwierdzony wzorzec ustalony w sesjach 2026-08-20/21: pliki albo poprawnie odsyłają do bramki `shared/ZAZALENIE-ADRESAT-GATE.md`, albo są czysto nawigacyjnymi listami nazw środków bez próby wskazania adresata, więc nie stanowią ryzyka merytorycznego — bramka pokrywa je dynamicznie przy redagowaniu konkretnego pisma). ⛔ Kronika sesji NIE mieszka w tym pliku — pełna historia: `AUDIT-JOURNAL.md`, wpisy `AUDYT-YYYY-MM-DD[litera]`.

> **Zasada podziału (ZASADA 10 w SKILL.md):**
> - Otwarcie flagi → wiersz TUTAJ + wpis w `AUDIT-JOURNAL.md`.
> - Zamknięcie flagi → USUŃ wiersz STĄD + pełny opis naprawy WYŁĄCZNIE w dzienniku.
> - Naprawa CZĘŚCIOWA → NIE opisuj jej tutaj; skróć wiersz do tego, co ZOSTAŁO,
>   a opis wykonanej części zapisz w dzienniku. Ten plik nie jest kroniką postępu.
> - Pytanie „co jest otwarte" → czytaj TEN plik, nie grepuj dziennika.

---

## ⚡ TABLICA STERUJĄCA — CO JEST DO ZROBIENIA (czytaj to najpierw)

**Stan na 2026-08-23f (po częściowym zamknięciu F-110, anulowaniu F-116, zamknięciu F-118, F-112, F-117, F-114, F-119 i F-120):**

| Kategoria | Liczba | Pozycje |
|---|---|---|
| WARN numerowane otwarte | **0** | WARN-1…WARN-29 zamknięte |
| Flagi F- wykonalne sesją audytową | **12** | F-110 (częściowo), **F-108**, **F-113**, **F-125** (zawężona), F-88, F-106, F-83, F-104, F-86, F-102, F-48, F-5 |
| Flagi F- zależne od dewelopera/środowiska | **5** | F-8, F-10, F-11, F-9, F-94 |
| **Razem flag F- otwartych** | **17** | 12 wykonalnych + 5 zależnych od dewelopera. Zmiana 2026-08-24 (tura 2): −F-128 (ZAMKNIĘTA — rejestr aliasów w parserze) |
| MON (permanentne, nigdy nie zamykane) | 3 | MON-1, MON-2, MON-3 |
| OBS (projekty w toku) | 7 | OBS-1…OBS-7 |
| REACT-1 (uruchamiane sprawą) | 8 | patrz sekcja 4 |
| O (obserwacje informacyjne) | 6 | O-1 … O-6 |

> ⛔ **Ten licznik rozjechał się ze stanem faktycznym o 4 pozycje** (deklarował 17 flag przy 13 wierszach
> w tablicy) i utrzymywał wiersze flag zamkniętych w sekcji 1 wbrew ZASADZIE 10. Naprawione 2026-08-21;
> usunięta treść i pełna lista zweryfikowanych zamknięć — `AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-21zc.
> **Przy KAŻDEJ zmianie liczby flag aktualizuj tę tabelę — jest jedynym miejscem licznika.**

⛔ **PRZED jakąkolwiek edycją skilla przeczytaj blok HARDGATE-AUDYT niżej.**

### A. WYKONALNE SESJĄ AUDYTOWĄ — kolejność wg priorytetu

| Flaga | Prio | Dziedzina | Następny krok (jedno zdanie) |
|---|---|---|---|
| F-108 | **wysoki** | cross: 16 DR | **Otwarta 2026-08-23.** Benchmark zewnętrzny: wykaz 52 aktów MS na egzamin wstępny na aplikację 2026. ETAP 1 (pomiar obecności) ZAKOŃCZONY: 39 A / 9 B / 1 C / 3 D. **ETAP 2** — pokrycie po rozdziałach dla 48 pozycji A+B, transzami po 3–5, wg `shared/MOD-GENERATOR-AKTU.md` krok G-3; 9 DR nie ma jeszcze pliku `MAPA-POKRYCIA.md`. **ETAP 3** — budowa brakujących, kolejność P1: **poz. 46 transakcje handlowe** (bezpośrednia przyczyna usterki testu 5 — `RATE-COMPLETENESS` opisuje procedurę, ale nie ma modułu z treścią stawek), 41 UFG, 8 opłaty w sprawach karnych, 52 fundacja rodzinna. Lista robocza i warunki zamknięcia: `F-108-lista-MS-egzamin-2026.md`. ⚠️ Sam wykaz MS wymaga potwierdzenia w RZĘDZIE 1 (MS/BIP) — dziś ⚠️ [NIEWERYFIKOWANE] |
| F-113 | **wysoki** | audyt-systemu-v4 + cross | **ZAWĘŻONA 2026-08-24f — część PROJEKTOWA WYKONANA.** Wiersz flagi mówił „WYKONAĆ NA KOŃCU, ale ZAPROJEKTOWAĆ NA POCZĄTKU" — projekt gotowy: `references/PLAN-TESTU-BRAMEK-F113.md` (11 sekcji) + `scripts/ocena_transkryptow_f113.py`. Obejmuje wszystkie cztery wady TEST1-3 z zakresu rozszerzonego (a)-(d) oraz rozróżnienie e1/e2 dla bramek samo-raportujących. **DO ZROBIENIA — WYŁĄCZNIE WYKONANIE:** ≥5 przebiegów na ramię w komórkach T1 i T2, ocena ślepa, zapis Δ albo jawnego `NIEMIERZALNE` dla każdej z 5 bramek, wynik do dziennika, decyzja dla bramek bez efektu. ⚠️ Wykonanie wymaga ŚrODOWISKA Z LOGIEM WYWOŁAŃ NARZĘDZI — bez niego B5-e2 pozostaje NIEMIERZALNE i to jest właściwy wynik, nie brak wyniku. ⛔ Dopóki niewykonane — żadna bramka z sesji 2026-08-23 NIE ma potwierdzenia skuteczności, wyłącznie potwierdzenie obecności w plikach |
| F-125 | niski (był średni) | audyt-systemu-v4 + korpus | **Zawężona 2026-08-24d — pkt (1), (2) i (4) WYKONANE.** Notacja **UJEDNOLICONA na polecenie użytkownika**: 370 wystąpień w 126 plikach sprowadzonych do formy kanonicznej `Dz.U. RRRR poz. N` (62 trzyczłonowe LEX + 308 zwartych dwuczłonowych, o których wiersz flagi nie wiedział). Konwersja zweryfikowana jako BEZSTRATNA. Wyłączone świadomie: rejestry historyczne (AUDIT-JOURNAL, archiwalne mapy) i **10 dosłownych cytatów zapisu źródła** (oznaczone `CELOWO nieujednolicony`). **POZOSTAJE (3): DECYZJA użytkownika** — czy `normalizuj()` w `check_sync_aktow.py` ma ścinać zera wiodące (`poz. 0000244`) i obsługiwać formę dwuczłonową. ⚠️ Po ujednoliceniu ryzyko jest **mniejsze, ale nie zerowe**: korpus jest czysty, lecz KAŻDE nowe wklejenie z LEX/OpenLEX wprowadzi starą formę z powrotem. Trwałym rozwiązaniem jest test, nie sprzątanie |
| F-110 | częściowo zamknięta 2026-08-23f | shared (11 plików) + WERYFIKACJA-SLAD | **NAPRAWIONE:** kolizja symbolu `🟡` między `PRAWO-HARDGATE.md` (status źródła, KOTWICA URZĘDOWA) i `WERYFIKACJA-SLAD.md`/inne skale lokalne — KOTWICA przeniesiona na `🟨` w 11 plikach kodu skilli (pełna lista i weryfikacja kompletności: AUDIT-JOURNAL 2026-08-23f); `WERYFIKACJA-SLAD.md` dostał jawny odsyłacz do `🟨 [KOTWICA-URZĘDOWA]` w `PRAWO-HARDGATE.md` zamiast go ignorować. **CELOWO NIETKNIĘTE — decyzja użytkownika 2026-08-23f:** `HYBRID-VALIDATION.md` § 1.2 (`🟡 ISTOTNY` — waga braku formalnego) NIE zmieniony; to inny wymiar oceny (kompletność pisma, nie źródło przepisu), scalenie odrzucone jako zwiększające ryzyko pomyłki, nie zmniejszające. **POZOSTAJE OTWARTE:** nic bezpośrednio powiązanego — F-118 zamknięta 2026-08-23f (patrz AUDIT-JOURNAL). Pełne scalenie w jedną kartę kanoniczną było rozważane pod F-116 — ANULOWANE 2026-08-23f, kanoniczny rejestr statusów pozostaje świadomie rozproszony w `PRAWO-HARDGATE.md` i `WERYFIKACJA-SLAD.md` |
| F-102 | niski | cross: 10 skilli | **Zawężona 2026-08-20z3 — zostało tylko ryzyko PRZYSZŁE.** Historia 18 wersji odtworzona z dziennika, pułapka float naprawiona w 16 skillach, duplikaty numeru poza YAML zlikwidowane. Pozostaje cudzysłów profilaktyczny — przy najbliższej edycji każdego skilla, NIE hurtem. **Zakres pomniejszony 2026-08-24:** 6 skilli DR (01, 07, 08, 13, 14, 16) domknięte przy okazji sesji F-115, bo warunek „najbliższa edycja" się ziścił. Kontrola: `version` jest STRINGIEM w 26/26 sprawdzonych SKILL.md |
| F-88 | średni-wysoki | cross (7 DR) | ✅ MDR, VAT, opłata skarbowa, PIT/CIT, KKS zamknięte (patrz AUDIT-JOURNAL dla historii). Adwokatura/radcowie, Prawo bankowe (odrzucona hipoteza automatycznego zwolnienia), SKOK/ubezpieczenia (RZĄD 1 potwierdzone jako zmieniane) — patrz `mod-OP-ordynacja-podatkowa.md` sekcja 6b. **Sesja 2026-08-22: hipoteza WZMOCNIONA dla wszystkich 4 obszarów (SKOK, ubezpieczenia, fundusze inwestycyjne, instrumenty finansowe)** — wielokrotnie potwierdzony (6+ źródeł RZĄD 1+2B) mechanizm systemowy nowelizacji: ograniczenie MDR do schematów TRANSGRANICZNYCH + wyłączenie VAT/akcyzy z zakresu, analogiczny do potwierdzonego PRECEDENSU z 2016 r. (nowelizacja funduszy inwestycyjnych zmieniająca art. 275 §3 OP — dokładnie ten sam krąg 4 typów podmiotów: SKOK/zakłady ubezpieczeń/fundusze inwestycyjne/domy maklerskie). Hipoteza: zmiana KONSEKWENCYJNA (odesłania do definicji OP), NIE osobny mechanizm MDR jak dla zawodów prawniczych (sekcja 6a, inny krąg podmiotów). **NADAL NIEUSTALONE:** dokładny numer artykułu w którejkolwiek z 4 ustaw — 3 dodatkowe zapytania web_search w sesji 2026-08-22 bez trafienia, malejący zwrot potwierdzony. Dalszy postęp wymaga F-8/F-10 (connector deweloperski) lub komentarza branżowego dedykowanego (KNF/PIU/Krajowa Rada Spółdzielcza), nie ogólnych omówień MDR (które koncentrują się na zawodach prawniczych). |
| F-106 | średni | cross: 16 DR + prawo-polskie-v2 | **Kwalifikacja 2026-08-22: 19/19 pozycji przejrzanych.** Wynik: 2 błędy RZECZYWISTE naprawione (spółdzielnie mieszkaniowe/Prawo spółdzielcze/własność lokali w dr-02 — trzy generacje t.j. + błędna atrybucja numeru między dwoma aktami; rozp. MF ws. zwolnień VAT w dr-06 — numer w ogóle nie odpowiadał żadnej generacji t.j. tego aktu). Pozostałe 17 pozycji: kwalifikacja (a) POTWIERDZONA — nowelizacje/akty wykonawcze świadomie opisane w wierszu aktu bazowego, ROUTING-MAP nie musi ich nosić osobno. Priorytetowe pozycje z poprzedniej sesji (2026.889 ✅naprawione, 2026.736 ✅potwierdzone (a), 2026.644 ✅potwierdzone (a)/F-5, 2026.100 ✅potwierdzone (a)/F-89, 2025.1440 ✅potwierdzone (a)) wszystkie sklasyfikowane. **F-106 PRAKTYCZNIE ZAMKNIĘTA** dla obecnej listy 19 — nowe trafienia mogą pojawić się przy przyszłych sesjach T11 wraz z nowymi nowelizacjami ➕ **Kwalifikacja dopisana 2026-08-24c:** `Dz.U. 2019 poz. 1862` (t.j. ustawy o zapobieganiu szkodom w środowisku) pojawiło się w T11 jako NOWA pozycja — to skutek uboczny naprawy F-125: wpisanie łańcucha t.j. do ROUTING-MAP i modułu dr-09 wprowadziło do porównania numer ogniwa pośredniego. **Kwalifikacja (a) — akt świadomie opisany w wierszu aktu bazowego** (mapa centralna wymienia go w prozie wiersza 2020/2187), NIE wymaga własnego wiersza. Nie zgłaszać ponownie |
| F-83 | niski | audyt-systemu-v4 + 9 DR | **Zasilanie ZAKOŃCZONE 2026-08-22 — 9/9 raportów przeniesionych** (KPC jako ostatni). Zostaje WYŁĄCZNIE: (1) **DECYZJA użytkownika** — czy odblokować blok § 3 `SCHEDULED-TASK-COWORK.md` i zamknąć flagę; (2) ustalić rytm okresowej REWALIDACJI map (dwóch niezależnych pomiarów: 6/7 map przestarzałych po 9 dniach, raport KPC nieaktualny w 4 z 15 pozycji po 9 dniach — sugeruje rytm ok. **2 tygodni**). ⛔ Dopóki otwarta, sesja cykliczna POMIJA § 3 |
| F-104 | średni | audyt-systemu-v4 + cross-DR | **Rocznik 2026 ZAMKNIĘTY.** Roczniki starsze (2013-2025) w toku: T11 wygenerowało 70 pozycji. **TRANSZA 1 ZAKOŃCZONA: 6 potwierdzonych i wpisane** (2025.1891, 1882, 1872, 1814, 1783, 1760), **1 świadomie NIE wpisana** (2025.1863, niejednoznaczna). 1 pozostaje (2025.1696) — próba w kolejnej transzy. Odpowiedź na pytanie zakresu zmian (2026-08-22): wszystkie zmiany tej sesji F-104 dotyczą WYŁĄCZNIE audyt-systemu-v4/references/mapa_dzu_*.md — sprawdzono przez T11, że dr-XX i prawo-polskie-v2/ROUTING-MAP.md NIE wymagają korekty, bo wpisywane pozycje już miały tam poprawne, wcześniej zweryfikowane wiersze (REGUŁA 3 była już spełniona) — mapa centralna była jedynym brakującym rogiem trójkąta synchronizacji |
| F-86 | bardzo niski | dr-02 (PrUp) | Bariera długości usunięta podziałem 2026-08-21. Pozostaje treść: likwidacja masy Dział II-IV (316-334), postępowanie międzynarodowe (378-417), postępowania szczególne (418-425+) — dopisywać do `mod-PrUpad-uklad-likwidacja-zakonczenie.md` |
| F-48 | niski | dr-11 | Rozbudować STUB certyfikacji cyberbezpieczeństwa, gdy przepisy wejdą w życie |
| F-5 | niski | dr-06 | Moduł ESAP — dopiero gdy pojawi się sprawa z rynku kapitałowego |

### B. ZALEŻNE OD DEWELOPERA / ŚRODOWISKA — sesja audytowa ICH NIE ZAMKNIE

| Flaga | Prio | Zakres | Kto musi wykonać |
|---|---|---|---|
| F-8 | średni | Podłączenie realnego connectora MCP do api.sejm.gov.pl. **Dowód aktualności bariery (2026-08-23e):** próba `web_fetch` na `https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.html` zwróciła `ROBOTS_DISALLOWED`. Bariera jest BIEŻĄCA, nie historyczna — ta sama klasa co F-88/F-91/F-92 | Deweloper w środowisku z dostępem do domen .gov.pl |
| F-10 | średni | Uruchomienie `sync_dzu_eli.py` wobec żywego ELI API | j.w. |
| F-11 | średni | Uruchomienie `extract_api_verification_log.py` na prawdziwej odpowiedzi API | Deweloper |
| F-9 | niski | Wdrożenie konwencji znacznika `AUDIT_EVENT` w prompcie portalu | Zespół portalu (poza silnikiem) |
| F-94 | niski | shared + audyt-systemu-v4 | **Nowe odkrycie 2026-08-18:** `KONEKTORY-REKOMENDOWANE.md` nigdzie niewskazany z żadnego SKILL.md w systemie (sam odsyła do `tools/mcp-servers/`); całe `shared/tools/mcp-servers/` (7 folderów, ~42 pliki) osierocone transitywnie. Dodatkowo `shared/checklists/contradiction-intelligence-checklist-v10.md` — możliwy dryf nazwy względem realnie wołanego `pisma-procesowe-v3/references/engines/contradiction-intelligence-engine-v10.md` (inny plik, inna lokalizacja). Do zrobienia: (1) zdecydować, czy KONEKTORY-REKOMENDOWANE.md ma być wpisany do shared/SKILL.md czy do MCP-INTEGRACJA.md; (2) sprawdzić czy checklist v10 to zamierzony duplikat czy pozostawiony po refaktoryzacji; (3) rozstrzygnąć, czy 42 pliki mcp-servers to żywy kod (F-8/F-10 dot. tego samego obszaru) czy do usunięcia. |

### C. POZOSTAŁE REJESTRY W TYM PLIKU

| Rejestr | Czym jest | Czy liczy się do „flag do zamknięcia" |
|---|---|---|
| MON-1, MON-2, MON-3 | Mechanizmy monitorowania — permanentne | ⛔ NIE — nigdy nie zamykane |
| OBS-1…OBS-7 | Projekty ustaw w toku, śledzone proaktywnie | ⛔ NIE — dopóki nieuchwalone |
| REACT-1 (7 pozycji) | Punkty uruchamiane wyłącznie sprawą klienta | ⛔ NIE — brak sesji, która je zamknie |
| O-1, O-2 | Obserwacje informacyjne | ⛔ NIE |

---

## ⛔ HARDGATE-AUDYT — ZASADY OPERACYJNE, AUTOMATYCZNIE WCZYTYWANE PRZED KAŻDĄ SESJĄ NAPRAWCZĄ

*(dodano 2026-08-14, na żądanie użytkownika — konsolidacja zasad wypracowanych
metodą prób i błędów w toku sesji naprawczej cyklu WARN. Ten blok MUSI być
przeczytany PRZED rozpoczęciem jakiejkolwiek pracy nad WARN/flagami F-,
analogicznie do sposobu, w jaki `shared/PRAWO-HARDGATE.md` jest wczytywany
przed cytowaniem przepisów/orzeczeń. Naruszenie = ryzyko utraty pracy z
poprzednich tur lub niespójności rejestrów.)*

```
REGUŁA 1 — ŹRÓDŁO KOPII ROBOCZEJ (odkryta po nadpisaniu naprawy F-58):
  Przed EDYCJĄ jakiegokolwiek skilla w ramach WIELOTUROWEJ sesji:
  KROK A: sprawdź `ls /mnt/user-data/outputs/` — czy istnieje ZIP dla
    tego skilla z WCZEŚNIEJSZEJ tury TEJ SAMEJ rozmowy?
  KROK B: JEŻELI TAK → przywróć kopię roboczą Z TEGO ZIP-a
    (rm -rf + unzip), NIGDY z /mnt/skills/user (źródło pierwotne,
    statyczne, nieaktualizowane w trakcie rozmowy).
  KROK C: JEŻELI NIE (skill nigdy dotąd nietknięty w tej rozmowie) →
    kopiuj bezpiecznie z /mnt/skills/user.
  ⚠️ Kopiowanie z /mnt/skills/user dla skilla JUŻ edytowanego w tej
  rozmowie = CICHA UTRATA całej poprzedniej naprawy, bez błędu/
  ostrzeżenia systemowego. Zawsze weryfikuj grep-em kluczowego markera
  PRZED kontynuacją (np. "czy F-XX fix nadal obecny?").

REGUŁA 2 — WERYFIKACJA PER-MODUŁOWA REJESTRACJI (lekcja z F-33, DR-06):
  Po dodaniu NOWEGO modułu, PRZED przejściem dalej:
  grep -c "\[✓\].*NAZWA-MODUŁU" SKILL.md   (oczekiwane: dokładnie 1)
  grep -c "NAZWA-MODUŁU" MAPA-AKTOW.md      (oczekiwane: co najmniej 1)
  ⚠️ Sama wzmianka modułu w PROZIE nagłówka SKILL.md ("Aktualizacja
  2026-...: dodano...") NIE JEST wystarczająca — wymagany jest
  FORMALNY wpis w bloku checklisty `[✓]` ORAZ osobny wiersz w
  MAPA-AKTOW.md. Zbiorczy `comm`/przegląd całej sekcji NIE wykrywa
  tej różnicy — wymagana weryfikacja PER MODUŁ, z osobna.

REGUŁA 3 — SYNCHRONIZACJA Z CENTRALNĄ MAPĄ prawo-polskie-v2 (dodano
  2026-08-14, na żądanie użytkownika — luka wykryta: 12 nowych modułów
  z tej sesji nie trafiło do `prawo-polskie-v2/ROUTING-MAP.md` mimo
  poprawnej rejestracji lokalnej):
  Po synchronizacji z lokalnym MAPA-AKTOW.md (Reguła 2), DODATKOWO:
  KROK A: sprawdź `ls /mnt/user-data/outputs/ | grep prawo-polskie-v2`
    — zastosuj Regułę 1 (ZIP z poprzedniej tury vs pristine).
  KROK B: znajdź właściwą sekcję `## DR-XX — <nazwa>` w ROUTING-MAP.md.
  KROK C: dodaj wiersz WEWNĄTRZ tej sekcji (między jej nagłówkiem `##`
    a NASTĘPNYM nagłówkiem `## DR-`) — NIE przed pierwszym trafionym
    stringiem przez `str_replace`, bo ten sam tekst wiersza-kotwicy
    może występować w WIĘCEJ niż jednym miejscu pliku (odkryte:
    orphan-rows z DR-12 sklejone tuż przed nagłówkiem DR-13 zamiast
    wewnątrz właściwej sekcji DR-07) — zawsze WERYFIKUJ Python/grep
    że nowy wiersz wylądował between poprawnych nagłówków `## DR-`.
  KROK D: PO wstawieniu wszystkich wierszy — jednym skryptem (python
    re.split po `^## DR-\\d+`) potwierdź, że KAŻDY nowy moduł occurs
    w SEKCJI odpowiadającej jego prawdziwemu DR, nie w sąsiedniej.
  ⚠️ ROUTING-MAP.md to PLIK ~780 linii z WIELOMA sekcjami o podobnych
  wzorcach tekstowych — ręczne "wstaw po tym wierszu" jest ZAWODNE bez
  automatycznej weryfikacji końcowej.

REGUŁA 4 — WERYFIKACJA BAJTOWA PRZED DOSTAWĄ (już ugruntowana, ZASADA 7
  w audyt-systemu-v4/SKILL.md, tu przypomniana jako część tego samego
  łańcucha): KROK 1 licz pliki PRZED, KROK 4 licz PO, KROK 5 zip, KROK
  4b rozpakuj i `diff -rq` zip vs drzewo robocze (MUSI być exit=0),
  ORAZ `diff -rq` zip vs poprzednia dostarczona wersja (potwierdź że
  RÓŻNICE to DOKŁADNIE zamierzone zmiany, nic więcej/mniej).

REGUŁA 5 — NATYCHMIASTOWA WERYFIKACJA PO KAŻDYM str_replace PRZY
  WSTAWIANIU TUŻ PRZED STAŁYM MARKEREM (3 incydenty w tej sesji: F-75
  skasowało marker "Obserwacje informacyjne"; sekcja SKD skasowała
  nagłówek "SPÓR O WYKONANIE UMOWY"; nagłówek "Moduły (X łącznie)"
  zduplikowany przy FUS): jeśli `new_str` wstawia treść TUŻ PRZED
  stałym elementem strukturalnym (nagłówek, marker sekcji), element
  ten MUSI być jawnie zawarty w `new_str` — NIE polegać na tym, że
  "zostanie" w pliku. PO każdej takiej edycji: `grep -n "^## "` (lub
  analogiczny wzorzec) na cały plik, porównaj spis treści przed/po.

REGUŁA 6 — DOSTAWA WYŁĄCZNIE ZGODNIE Z REGUŁĄ 7 (dodano 2026-08-14, na
  żądanie użytkownika — konsoliduje istniejącą procedurę Reguły 7
  [audyt-systemu-v4/SKILL.md] jako WARUNEK KOŃCOWY każdej sesji
  naprawczej, nie tylko dobrą praktykę): ŻADNA naprawa NIE JEST
  ukończona bez przejścia PEŁNEGO łańcucha: KROK 1 (policz pliki
  PRZED) → KROK 2 (kopia robocza wg Reguły 1) → edycja → KROK 4
  (policz PO, porównaj z KROK 1 — różnica MUSI być DOKŁADNIE
  zamierzona, np. "+1 nowy moduł" lub "0, tylko treść") → KROK 5
  (zip) → KROK 4b (rozpakuj, `diff -rq` zip vs drzewo robocze — MUSI
  być exit=0; `diff -rq` zip vs poprzednia wersja — potwierdź że
  różnice to WYŁĄCZNIE zamierzone zmiany) → `present_files`. ⛔ ZAKAZ
  kończenia tury bez dostawy — jeśli sesja się urwie PRZED KROK 5,
  NASTĘPNA tura MUSI dokończyć dostawę PRZED podjęciem nowej pracy
  (incydent z tej sesji: tura z F-24/F-38/F-62 zakończyła się bez
  present_files, naprawiona dopiero w NASTĘPNEJ turze na wyraźne
  zwrócenie uwagi przez użytkownika — NIE powtarzać).
```

*Powyższe reguły stosuje się ŁĄCZNIE z istniejącymi ZASADAMI 1-13 w
`audyt-systemu-v4/SKILL.md` (ten plik je uzupełnia specyficznie dla
kontekstu wieloturowej pracy nad WARN w ramach jednej rozmowy — ZASADY
w SKILL.md są bardziej ogólne/międzysesyjne).*

---

## 1. FLAGI F- OTWARTE — SZCZEGÓŁY

> Kolumna „Pozostały zakres" zawiera WYŁĄCZNIE to, czego jeszcze NIE zrobiono.
> Historia napraw częściowych — w `AUDIT-JOURNAL.md` pod wskazanym wpisem.

### 1A. Luki treściowe w aktach prawnych (raporty pokrycia 2026-08-13)

| # | Pozostały zakres — DO ZROBIENIA | Skill | Prio | Otwarta od | Historia / źródło |
|---|---|---|---|---|---|
| F-86 | PrUp — pozostałe zakresy: likwidacja masy Dział II-IV (art. 316-334); postępowanie międzynarodowe (art. 378-417); postępowania szczególne wobec banków/ubezpieczycieli/deweloperów (art. 418-425+). ⭐ **Bariera długości USUNIĘTA 2026-08-21** — moduł podzielony (659 + 307 l.), nową treść dopisywać do `mod-PrUpad-uklad-likwidacja-zakonczenie.md`, NIE do pliku macierzystego. Dodatkowo: odświeżyć raport pokrycia | dr-02 | bardzo niski | 2026-08-21 | raport PrUp-PrRestr sekcja 1 (⚠️ nieaktualny); naprawy: AUDYT-2026-08-15v(3)–(6), 08-21r, 08-21y, 08-21z, 08-21zd |


### 1B. Luki strukturalne i treściowe poza raportami pokrycia

| # | Pozostały zakres — DO ZROBIENIA | Skill | Prio | Otwarta od | Historia / źródło |
|---|---|---|---|---|---|
| F-5 | Moduł dedykowany ustawie ESAP (Dz.U. 2026 poz. 644) — omnibus ~17 ustaw sektora finansowego. Przy tej okazji ustalić, na czym polega dotknięcie KSH (dwie próby bez rozstrzygnięcia: 2026-07-15, 2026-08-05). ⚠️ Uruchamiać wyłącznie, gdy pojawi się sprawa z rynku kapitałowego/nadzoru finansowego | dr-06 | niski | 2026-07-07 | AUDIT-JOURNAL 2026-07-15, 2026-08-05 |
| F-108 | **ETAP 2** — pokrycie po rozdziałach dla 48 pozycji A+B wykazu MS (transze po 3–5 aktów, krok G-3 z `shared/MOD-GENERATOR-AKTU.md`); 9 DR nie ma jeszcze pliku `MAPA-POKRYCIA.md`. **ETAP 3** — moduły dla braków, kolejność P1: poz. 46 transakcje handlowe → 41 UFG → 8 opłaty w sprawach karnych → 52 fundacja rodzinna; P2: 51 Prawo przedsiębiorców, 50 o SN, 30 zasiłkowa, 40 zwolnienia grupowe; P3: decyzja wydzielać/nie dla 13, 34, 27, 28, 45. ⚠️ Sam wykaz MS do potwierdzenia w RZĘDZIE 1 (MS/BIP). Pełna lista i warunki zamknięcia: `references/F-108-lista-MS-egzamin-2026.md` | cross: 16 DR | wysoki | 2026-08-23 | AUDIT-JOURNAL 2026-08-23; pomiar bazowy 39 A / 9 B / 1 C / 3 D |
| F-48 | Rozbudować `mod-ustawa-certyfikacja-cyberbezpieczenstwa.md` (uczciwie oznaczony STUB) — dopiero gdy przepisy wejdą w życie. Akt bazowy Dz.U. 2025 poz. 1017 potwierdzony | dr-11 | niski | 2026-06-05 | naprawa mapy RODO: 2026-08-14b |



| F-102 | **POZOSTAŁA 1 POZYCJA — cudzysłów profilaktyczny w 10 skillach nieedytowanych w sesji 08-20z3.** ✅ ZAMKNIĘTE 2026-08-20z3 (T12 na `/mnt/skills/user` przed: **7 ⛔ + 20 ⚠️**; na naprawionym drzewie: **0 ⛔ + 0 ⚠️**): **(A) siedem czynnych rozjazdów** — historia odtworzona z `AUDIT-JOURNAL.md` (sekcje „Rejestracja") i dopisana do właściwych changelogów: `prawny-router-v3` 3.14-3.21 (osiem wersji, największa luka w systemie — z zastrzeżeniem, że dziennik nie rozdziela, co przypadło na 3.14/3.15/3.16, bo powstały w jednej sesji), `analizator-umow-v1` 1.26-1.30 (pięć), `pisma-procesowe-v3` 5.16-5.17, `dr-01` 3.4; `orzeczenia-sadowe-v2` — rozjazd ODWROTNY naprawiony przez podbicie `version: 2.9 → "2.9.1"` (changelog miał wpis, którego pole nie odnotowało); `przesluchanie-swiadkow-v2-min90` i `analizator-dowodow-v3` — zamknięte wcześniej, w sesji 08-20z. Wszystkie wpisy oznaczone jako WTÓRNE wobec dziennika i odsyłają do konkretnego wpisu-źródła; **nic nie zostało zmyślone** — `dr-01` 3.5 i 3.6 nie mają śladu w żadnym pliku systemu i są odnotowane jako „LUKA JAWNA". **(B) pułapka float** — `version` ujęty w cudzysłów w 16 skillach (13 z realną pułapką: `analizator-umow-v1` 1.30, `dr-02` 3.35, `dr-03` 3.28, `dr-04` 3.23, `dr-05` 3.19, `dr-06` 3.72, `dr-09` 3.21, `dr-10` 3.35, `dr-11` 3.10, `dr-12` 4.10, `dr-15` 3.10, `pisma-proste-v2` 2.10, `prawny-router-v3` 3.21; + 3 profilaktycznie, bo i tak były edytowane). **(C) DECYZJA GENERALNA o duplikatach numeru poza YAML: usuwać, nie synchronizować.** Nagłówki H1 noszą teraz sam MAJOR (`prawny-router-v3` v3, `raport-sytuacyjny-v2` v2, `orzeczenia-sadowe-v2` v2, `analizator-dowodow-v3` v5), a stopka `prawo-polskie-v2` odsyła do pola `version:` i nosi wyłącznie datę zmiany treści. Uzasadnienie: dwa źródła prawdy o wersji ZAWSZE się rozjeżdżają — pięć niezależnych wystąpień w trzech sesjach; major w tytule nie dryfuje, bo zmienia się raz na kilkanaście wersji. ⛔ **POZOSTAJE:** 10 skilli z niecytowanym jednocyfrowym minor (`analiza-sadowa-v6`, `analizator-przepisow-v2`, `chronologia-sprawy-v1`, `dr-07`, `dr-08`, `dr-13`, `dr-14`, `dr-16`, `przewodnik-prawny-v2`, `raport-klienta-v1`) — ryzyko wyłącznie PRZYSZŁE (uaktywni się przy przejściu na X.10). Świadomie NIE naprawiane hurtem: edycja dziesięciu skilli wyłącznie po to, by dodać cudzysłów, generuje dziesięć dostaw i dziesięć okazji do pomyłki przy zerowym zysku dzisiaj. **Do zrobienia:** przy NAJBLIŻSZEJ edycji każdego z tych skilli — z dowolnego powodu — ująć `version` w cudzysłów przy okazji; listę na bieżąco pokazuje `python3 scripts/check_wersje_changelog.py --profilaktyka` | cross: 10 skilli | niski (ryzyko wyłącznie przyszłe) | 2026-08-20z | zawężona 2026-08-20z3 — (A), (B) i (C) wykonane w całości |


| F-88 | **Propagacja ustawy z 29.05.2026 o zmianie ustawy — Ordynacja podatkowa oraz niektórych innych ustaw (Dz.U. 2026 poz. 846, w życie 1.10.2026).** ZAMKNIĘTE: OP rdzeń, MDR (sekcja 6a), katalog wyłączeń MDR, VAT (art. 109 ust. 3e/3h → OP, w życie 1.01.2027), opłata skarbowa (nowy moduł), PIT/CIT (odesłania konsekwencyjne), KKS (sekcja w mod-KKS). **Sesja 19w (adwokatura/radcowie prawni):** RZĄD 1 [fragment PDF ISAP, isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20260000846] potwierdza że ustawa 2026.846 zmienia WŁASNĄ TREŚCIĄ (nie tylko odesłaniem) Prawo o adwokaturze i ustawę o radcach prawnych — hipoteza robocza z sesji 19k ("prawdopodobnie tylko odesłanie, analogicznie do PIT/CIT") ODRZUCONA. RZĄD 2/3 [5+ źródeł: Deloitte, Gekko Taxens x2, PARP, studio.pwc.pl] wskazuje prawdopodobny mechanizm: zwolnienie z obowiązku raportowania MDR dla podmiotów objętych tajemnicą zawodową (doradcy podatkowi, adwokaci, radcowie prawni, rzecznicy patentowi, notariusze, biegli rewidenci), o ile raportowanie naruszałoby tajemnicę zawodową. ⚠️ [NIEWERYFIKOWANE] dokładny numer artykułu/paragrafu w Prawie o adwokaturze i ustawie o radcach prawnych — ISAP i api.sejm.gov.pl zwracają ROBOTS_DISALLOWED dla web_fetch w tym środowisku (potwierdzone ponownie, ta sama bariera co F-91/F-92). Ta sama lista RZĄD 1 wskazuje, że Prawo bankowe, doradztwo podatkowe i rzecznicy patentowi RÓWNIEŻ mają własną treść nowelizacyjną (nie tylko odesłanie) — DO ZWERYFIKOWANIA per ustawa w kolejnej sesji, nie zakładać automatycznie że to ten sam mechanizm MDR. Zapisane `mod-OP-ordynacja-podatkowa.md` (dr-06) nowa sekcja 6b. **Pozostaje W CAŁOŚCI nieopracowane:** SKOK, fundusze inwestycyjne, instrumenty finansowe, ubezpieczenia, sądy administracyjne (PPSA) — 5 obszarów bez żadnego ustalenia. Ścieżka dalsza: MOD-PROPAGACJA-NOWELIZACJI, jeden obszar na sesję, LUB eskalacja do F-8/F-10 (connector deweloperski z dostępem do .gov.pl) jeśli bariera web_fetch nadal blokuje postęp | cross: dr-06, dr-02, dr-05, dr-12, dr-16, dr-03 (KKS), dr-08 (podatki lokalne) | średni-wysoki (data wejścia w życie 1.10.2026 — coraz bliżej) | 2026-08-15x | ISAP/dziennikustaw.gov.pl/api.sejm.gov.pl blokują web_fetch (robots disallowed) — mapowanie przez web_search wieloźródłowy; ⚠️ ta sama klasa co F-79 (omnibus, system odnotował tylko część skutków) |


### 1C. Flagi narzędziowe i metodologiczne (audyt-systemu-v4)

| # | Pozostały zakres — DO ZROBIENIA | Skill | Prio | Otwarta od | Historia / źródło |
|---|---|---|---|---|---|
| F-82 | ⚠️ Sam błąd (Kodeks morski pod numerem Dz.U. 2023 poz. 1523 zamiast 1309) NAPRAWIONY 2026-08-15n. ✅ Pkt 2 i 3 ZAMKNIĘTE 2026-08-15y: do `test_cross_map_dzu.py` dopisano ostrzeżenie (docstring + komunikat w wyniku), że zgodność rejestrów NIE jest weryfikacją merytoryczną, wraz z opisem techniki wykrywania tej klasy błędu; ustawa o delegowaniu kierowców (Dz.U. 2023 poz. 1523) dostała własny wiersz w mapie centralnej — decyzja: skatalogowana BEZ modułu, temat reaktywny. ⛔ POZOSTAJE 1 PUNKT: przeskanować mapę Dz.U. pod kątem aktów, których numer nigdy nie był weryfikowany PRZECIW ŹRÓDŁU ZEWNĘTRZNEMU — priorytet dla aktów o statusie „ze zm. — brak nowszego t.j.", bo ten opis sugeruje, że nikt nie sprawdzał od dawna | cross: audyt-systemu-v4, prawo-polskie-v2, dr-09 | informacyjny | 2026-08-15n | ⭐ LEKCJA: błąd przetrwał wszystkie audyty TRYB DZU, bo trzy rejestry były ze sobą ZGODNE — kroswalidacja tej klasy błędu nie wykryje. Technika kontrolna: porównywać metryki aktów zmienianych, cytowane w tekstach nowelizacji, z mapą |
| F-113 | Zbudować test regresyjny z GRUPĄ KONTROLNĄ dla pięciu bramek weryfikacyjnych (ANTY-FASADA, KOTWICA URZĘDOWA, DOMAIN-LOCK, RATE-COMPLETENESS, ŚLAD ROUTINGU). Warunek konieczny: prompt testowy NIE wymienia kryteriów oceny — inaczej mierzy posłuszeństwo wobec promptu, nie zachowanie skilla (wada zewnętrznego testu R2/LM-K2-01). **ZAKRES ROZSZERZONY 2026-08-23e:** (a) komórki `T0`/`T1`/`T2` z zakazem punktowania braku routingu w `T0`; (b) ślepa ocena surowych transkryptów, etykiety wersji losowane; (c) pozycje-pułapki (przepis nieistniejący, uchylony, zmyślona sygnatura); (d) rejestracja wersji modelu, hasha manifestu i listy narzędzi. **ZAKRES ROZSZERZONY 2026-08-23f:** (e) bramki SAMO-RAPORTUJĄCE (KROK 3A/F-119) wymagają osobnego rozróżnienia: (e1) `ROUTER-WCZYTANY: NIE` wynikające z TWARDEGO faktu (błąd narzędzia) — wiarygodne; (e2) `TAK` zadeklarowane bez faktycznego wywołania — fasada tej samej klasy co `VER` bez weryfikacji w TEST2; test musi wykrywać (e2) osobno, nie tylko potwierdzać obecność pola w odpowiedzi | audyt-systemu-v4 + cross | wysoki | 2026-08-23 | AUDIT-JOURNAL 2026-08-23d; rozszerzenie 2026-08-23e, 2026-08-23f |
| F-110 | **CZĘŚCIOWO ZAMKNIĘTA 2026-08-23f.** Kolizja symbolu `🟡` NAPRAWIONA (KOTWICA URZĘDOWA → `🟨` w 11 plikach) i `WERYFIKACJA-SLAD.md` dostał odsyłacz do niej. `HYBRID-VALIDATION.md` § 1.2 celowo NIETKNIĘTY (decyzja użytkownika — inny wymiar oceny). F-118 zamknięta 2026-08-23f — nic bezpośrednio zależnego nie pozostaje otwarte. Szczegóły: AUDIT-JOURNAL 2026-08-23f | shared | częściowo zamknięta | 2026-08-23 | AUDIT-JOURNAL 2026-08-23, 2026-08-23f |
| F-104 | **Pozostało 13 aktów GŁÓWNYCH rocznika 2026 bez wiersza w mapie centralnej** (poz. 1046 antymobbingowa, 1005 łańcuchowa, 985 frankowa, 909 rachunkowość budżetowa, 724 ewidencja kierujących, 662 USG, 619 opakowania, 412 akcyza, 300 specustawy, 188 JPK, 157 SKW/SWW, 125 lekarz weterynarii, 110 przestępczość seksualna). Pełna lista z modułem, DR i protokołem transzy: `references/F-104-lista-robocza-mapa-dzu.md`. ⛔ Każdą pozycję weryfikować Rząd 1 → 2 per akt (ZASADA 8 — znacznik VER w mapie lokalnej NIE wystarcza; transza 1 udowodniła to, wykrywając przy okazji błąd klasy F-82 w wierszu 2025 poz. 468). Po wyczerpaniu rocznika 2026 — powtórzyć kwalifikację POPRAWIONYM parserem dla starszych roczników | audyt-systemu-v4 + cross-DR | średni | 2026-08-21 | transza 1: AUDYT-2026-08-21zg |
| F-83 | ⛔ BRAMKA: dopóki otwarta, sesja zadania cyklicznego POMIJA blok § 3 (`SCHEDULED-TASK-COWORK.md`) i odnotowuje to jednym zdaniem. **Pozostały zakres — już tylko dwa punkty, oba nietechniczne:** (1) DECYZJA, czy flagę zamknąć i odblokować § 3 — format sprawdzony na 9 z 9 raportów, w tym na najtrudniejszym przypadku (KPC, wymagającym uzgodnienia artykuł po artykule); (2) rytm okresowej rewalidacji map — dwa niezależne pomiary wskazują na dezaktualizację w ciągu ok. 9 dni, więc rytm dwutygodniowy jest górną granicą sensownego okna | cross-DR + audyt-systemu-v4 | niski | 2026-08-22 | historia: AUDIT-JOURNAL, wpisy 08-22, 08-22k, 08-22m |
| F-106 | Kwalifikacja merytoryczna **19 pozycji** T11 (wszystkie roczniki; 10 pierwotnych trafień odpadło po poprawce czułości testu). Dla każdej jedna z trzech kwalifikacji: (a) AKT ŚWIADOMIE BEZ WIERSZA — nowelizacja/rozporządzenie wykonawcze opisane w wierszu aktu bazowego, ROUTING-MAP nie musi ich nosić; (b) BRAK WIERSZA — akt ma moduł, wiersz dopisać (REGUŁA 3); (c) NIEAKTUALNY NUMER — wiersz jest, ale z poprzednim t.j. ⭐ Kwalifikacja (c) trafiła DWA razy na 29 w tej sesji (Prawo oświatowe, ZTP) — to najgroźniejszy wariant, bo rejestr wygląda na wypełniony | cross: 16 DR + prawo-polskie-v2 | średni | 2026-08-22 | T11 po poprawce F-106; wzorzec ten sam co F-89 |

### 1D. Flagi zależne od dewelopera / środowiska

> ⛔ Tych czterech flag NIE DA SIĘ zamknąć sesją audytową — wymagają dostępu
> do domen `.gov.pl`, prawdziwej odpowiedzi API albo wdrożenia po stronie
> portalu. Logika i testy po stronie systemu przechodzą w całości.

| # | Pozostały zakres — DO WYKONANIA PRZEZ CZŁOWIEKA | Skill | Prio | Otwarta od |
|---|---|---|---|---|
| F-8 | (a) Wdrożyć connector w środowisku z dostępem do api.sejm.gov.pl; (b) zweryfikować realny kształt odpowiedzi JSON; (c) podłączyć w kliencie MCP. Start: `npm install && node test_protokol_mcp.mjs` w `shared/tools/mcp-servers/isap-eli-example/` | shared/MCP-INTEGRACJA.md | średni | 2026-07-13 |
| F-9 | (a) Wdrożyć konwencję znacznika `AUDIT_EVENT` w system prompcie portalu; (b) podłączyć parser do realnego przepływu odpowiedzi routera; (c) ustalić politykę retencji logu. Wg `DOKUMENTACJA-WDROZENIOWA-2026-07-13.md`, sekcja 3 | audit-trail-portal-v1 | niski | 2026-07-13 |
| F-10 | Uruchomić `sync_dzu_eli.py` wobec żywego api.sejm.gov.pl i skorygować `pobierz_nowe_pozycje_eli()`, jeśli kształt odpowiedzi różni się od założonego | sync-dzu-automatyczny-v1 | średni | 2026-07-13 |
| F-11 | Zapisać jedną prawdziwą odpowiedź Claude API z wywołaniami web_search/web_fetch i uruchomić na niej `extract_api_verification_log.py` jako pierwszy test integracyjny | shared/tools | średni | 2026-07-13d |

---

## 2. ♾️ MONITORING — FLAGI PERMANENTNE, NIGDY NIE ZAMYKANE

> ⚠️ Te trzy pozycje NIE SĄ przeznaczone do zamknięcia — monitorowanie zmian
> legislacyjnych jest zadaniem CIĄGŁYM. NIE usuwać przy porządkowaniu rejestru,
> NIE liczyć do „aktywnych flag do zamknięcia". F- to konkretne zadanie na
> liście TODO; MON- to nawyk sprawdzania — nigdy nie jest „zrobiony".

| # | Co monitorujemy | Zakres | Rytm | Ostatnie wykonanie | Metoda |
|---|---|---|---|---|---|
| MON-1 | Nowelizacje i nowe t.j. aktów JUŻ pokrytych przez moduły | ~200+ aktów w 16 lokalnych `MAPA-AKTOW.md` | co 4 tyg., rotacyjnie 5–8 aktów na sesję | 2026-08-14 | web_search per akt; priorytet dla aktów z flagą „⚠️ WYMAGA AKTUALIZACJI MODUŁU" oraz aktów żywych (KKW, KPK, ustawa o cudzoziemcach, PIT/VAT) |
| MON-2 | Nowe projekty ustaw / proces legislacyjny, horyzont 6–12 mies. | pozycje z sekcji OBSERWOWANE (OBS-1…OBS-7) | co 4 tyg.; OBS o priorytecie WYSOKIM — co 2 tyg. | 2026-08-14 | web_search, sejm.gov.pl (druki), RCL |
| MON-3 | KWOTOWE stawki opłat i podatków — zmieniane aktem podustawowym lub obwieszczeniem waloryzacyjnym, więc MON-1 ich NIE WYKRYJE (numer Dz.U. ustawy się nie zmienia, a moduł cicho się dezaktualizuje) | (1) opłaty sądowe KSCU (dr-16, dr-02); (2) opłata skarbowa i administracyjne (dr-05); (3) opłaty egzekucyjne, w tym kwota wolna od egzekucji (dr-02, dr-03, dr-05); (4) podatki i opłaty lokalne — obwieszczenie MF, w tym ⭐ opłata miejscowa, uzdrowiskowa i projektowana turystyczna (dr-06, dr-08; sprzężenie z OBS-2); (5) progi i kwoty PIT/CIT/ryczałt, limit zwolnienia VAT (dr-06); (6) opłaty sektorowe — produktowa, kaucja, koncesyjne (dr-09); (7) grzywny i mandaty KW/KPSW (dr-03) | ROCZNY: okno X–XII (obwieszczenia na kolejny rok) + I (kontrola); poza oknem — wyłącznie reaktywnie | — (pierwszy przegląd: X–XII.2026) | web_search + podatki.gov.pl, mf.gov.pl; ISAP dla rozporządzeń. ⚠️ podatki lokalne — obwieszczenie MF w **Monitorze Polskim**, NIE w Dz.U. |

**Protokół MON-3 (odrębny od MON-1/MON-2):** zmiana samej KWOTY zwykle NIE
uzasadnia nowej flagi F- — wystarczy punktowa korekta liczby w module + wpis
w dzienniku. Nową flagę F- otwierać TYLKO gdy: (a) zmienia się KONSTRUKCJA
opłaty (nowa przesłanka, nowy podmiot zobowiązany, nowy tryb zwolnienia), albo
(b) kwota jest cytowana w >3 modułach. ⛔ Kwoty NIGDY z pamięci — każda liczba
wymaga odczytu ze źródła w tej samej sesji, w której trafia do modułu.

**Harmonogram:** JEDEN zunifikowany przegląd dla MON-1 i MON-2 razem (ta sama
metoda, ta sama sesja web_search), cykl bazowy 4 tygodnie, dodatkowa runda co
2 tygodnie wyłącznie dla pozycji o priorytecie WYSOKIM. Zakres jednej sesji:
(1) MON-2 — przejrzeć OBS-1…OBS-7 pod kątem zmiany statusu; (2) MON-1 — 5–8
aktów najwyższego ryzyka, rotacyjnie; (3) każde trafienie → protokół niżej.
Częściej niż co 4 tygodnie = zużywanie budżetu web_search na wyniki „brak zmian".

### 📋 PROTOKÓŁ PRZY TRAFIENIU (dodano 2026-08-14, na żądanie użytkownika — obowiązkowy dla MON-1 i MON-2 jednakowo)

Gdy MON-1 lub MON-2 wykryje realną zmianę (uchwaloną nowelizację, nowy
akt, LUB projekt na tyle zaawansowany, że wymaga przejścia z sekcji
"OBSERWOWANE" do aktywnej naprawy) — **UTWÓRZ NOWĄ FLAGĘ F-** (kolejny
wolny numer) o następującej, WYMAGANEJ strukturze:

```
1. NAZWA AKTU + DOKŁADNY zakres zmiany — co konkretnie się zmieniło
   (nowy przepis / zmiana istniejącego / uchylenie), z numerem Dz.U.
   nowelizacji i datą wejścia w życie.

2. LOKALIZACJA DOTKNIĘTYCH MODUŁÓW — ustal, KTÓRE moduły/DR wymagają
   aktualizacji, W TEJ KOLEJNOŚCI źródeł (od najbardziej wiarygodnego):
   a) MAPA-MODULOW-GLOBALNA.md (zbiorcza mapa moduł→akty z oznaczeniem
      GENERYCZNY/MERYTORYCZNY/MIESZANY) — patrz sekcja "🗺️ ZADANIE
      ODŁOŻONE" niżej — JEŻELI już powstała w chwili trafienia. To
      NAJSZYBSZE źródło: jedno wyszukiwanie zamiast przeglądania 16
      plików.
   b) JEŻELI mapa zbiorcza JESZCZE nie istnieje (zadanie odłożone do
      czasu zamknięcia wszystkich F- — patrz niżej) → PRZESZUKAJ
      RÓWNOLEGLE: (i) wszystkie 16 lokalnych `dr-XX/MAPA-AKTOW.md`
      (grep po nazwie aktu/numerze Dz.U.), ORAZ (ii) centralną
      `prawo-polskie-v2/ROUTING-MAP.md` (jeden plik, 16 sekcji,
      grep po nazwie aktu obejmuje WSZYSTKIE DR naraz — z zastrzeżeniem
      REGUŁY 3 wyżej: ROUTING-MAP.md bywał NIESYNCHRONIZOWANY względem
      lokalnych map, więc traktuj go jako PIERWSZY, szybki punkt
      orientacyjny, NIE jako jedyne, rozstrzygające źródło — zawsze
      potwierdź w lokalnej MAPA-AKTOW.md danego DR).

3. DLA KAŻDEGO zidentyfikowanego modułu: określ, czy zmiana dotyka
   (a) wyłącznie numeru Dz.U./metryki, czy (b) rzeczywistej TREŚCI
   opisanej w module (patrz wzorzec z naprawy SKD — wyrok SN II CSKP
   89/26 — i systemu MOS — oba wymagały zmiany TREŚCI, nie tylko
   numeru). Rozróżnienie decyduje o zakresie naprawy.

4. Priorytet nowej flagi F- ustal wg praktycznej częstości użycia
   dotkniętego tematu — NIE automatycznie "wysoki" tylko dlatego, że
   zmiana jest świeża.
```

⚠️ MON-1/MON-2 same NIGDY nie przechowują treści konkretnego odkrycia
— są punktem WEJŚCIA (uruchamiają protokół), nowo utworzona F-
przechowuje ustalenia. Dzięki temu obie flagi permanentne pozostają
czytelne i "puste" (jako mechanizm), niezależnie od tego, ile razy
zostały już uruchomione.

---

## 3. 👁️ OBSERWOWANE — projekty ustaw w toku (nie są flagami błędów)

> Śledzone proaktywnie przez MON-2, żeby nie przeoczyć wejścia w życie.
> Po UCHWALENIU → nowa flaga F- wg PROTOKOŁU PRZY TRAFIENIU. Pełny opis
> stanu prac i źródeł — w `AUDIT-JOURNAL.md` (wpisy 2026-08-14, 08-15c, 08-15w).

| ID | Projekt | Dotyka | Prio | Istota — co się zmieni | Kiedy sprawdzać |
|---|---|---|---|---|---|
| OBS-1 | Nowelizacja PIT/CIT/ryczałt na 2027 (UD116, RCL/MF) | dr-06 (`mod-PIT-*`, CIT; NIE dotyczy VAT) | średni-wysoki | Zakres zmniejszony z 30+ do ~15 zmian (podwyżki ryczałtu 8,5%→17% i najmu 12%→15% WYCOFANE). Zostają: ulga mieszkaniowa raz na 3 lata; zbycie majątku wycofanego z działalności — 6 mies. → 3 lata; cyfryzacja PIT-11/PIT-8C; korekty ksiąg/JPK od 1.01.2027; CIT — ukryta dywidenda, datio in solutum. ODRĘBNIE: reforma skali PIT (pośrednie progi zamiast kwoty wolnej 60 tys.) — projekt zapowiadany na jesień 2026 | co 4–6 tyg. |
| OBS-2 | Opłaty od pobytu/noclegu — DWA równoległe projekty: (A) rządowy z 28.05.2026 (RCL), (B) poselski (Lewica) | dr-06, dr-08 (ustawa o podatkach i opłatach lokalnych); pośrednio dr-02 (najem krótkoterminowy) | **WYSOKI** | (A) opłaty miejscowa i uzdrowiskowa powiązane ze świadczeniem usług zakwaterowania, a prowadzący obiekt staje się **PŁATNIKIEM zamiast inkasenta** — przesunięcie odpowiedzialności publicznoprawnej, nie kosmetyka; wejście planowane 1.01.2027. (B) opłata turystyczna zamiast miejscowej, bez kryteriów klimatycznych, uzdrowiskowa bez zmian. ⚠️ Projekty mogą się wykluczać — śledzić, KTÓRY wejdzie. ⚠️ Numery druku/pozycji RCL NIEUSTALONE | co 4 tyg., częściej po 1.10.2026 |
| OBS-3 | Regulacja UTO/hulajnóg i e-rowerów (dawna F-14) | dr-03 (`mod-przerobki-modyfikacje-pojazdow.md`) | niski | ⚠️ To NIE „delegalizacja UTO", lecz zaostrzenie regulacyjne: zmiana dwóch ustaw (homologacja, kierujący) + rozporządzenie techniczne; TDT decyduje o dopuszczeniu urządzeń; Straż Miejska z uprawnieniem kontroli parametrów; ⭐ e-rowery >25 km/h — rejestracja jak motorowery. Wejście 1.01.2027 wg JEDNEGO źródła, NIEPOTWIERDZONE. ⛔ Dane „18 lat, konfiskata 30 dni" dotyczą Macedonii Północnej, NIE Polski | bliżej 1.01.2027 |
| OBS-4 | Pakiet praworządnościowy: status neosędziów, KRS, reforma USP (dawna F-15) | dr-01 (`mod-ustawa-KRS-i-ustroj-wladzy.md`, `mod-USP-ustroj-sadow-powszechnych.md`) | **WYSOKI** ⚠️ jedyna pozycja o bezpośrednim wpływie na WAŻNOŚĆ ORZECZEŃ | ROZSTRZYGNIĘTE: nowelizacja KRS zawetowana 19.02.2026; nowa KRS wybrana przez Sejm 15.05.2026; węższa nowelizacja USP (asesorzy) — Dz.U. 2026 poz. 370. W TOKU: (a) ustawa o STATUSIE neosędziów — utknęła w komisji, główne źródło ryzyka; (b) duża reforma USP (UD322/UD323) w opiniowaniu, RPO z zastrzeżeniami konstytucyjnymi; (c) deadline ETPC (Wałęsa p. Polsce) — listopad 2026 | **co 2–3 tyg.** — przy uchwaleniu ustawy o statusie neosędziów natychmiast flaga F- o priorytecie NAJWYŻSZYM |
| OBS-5 | Implementacja dyrektywy UE 2023/970 (jawność wynagrodzeń), Etap 2-3 — projekt UC127 (MRPiPS, RCL) | dr-04 (`mod-KP-dzial-III-wynagrodzenie-swiadczenia-jawnosc.md`) | średni-wysoki | Wpisana do monitorowania 2026-08-15 (naprawa F-28 pkt 5). Etap 1 (jawność rekrutacyjna) JUŻ OBOWIĄZUJE od 24.12.2025 (Dz.U. 2025 poz. 807), poza zakresem OBS. Etap 2-3: termin transpozycji dyrektywy 7.06.2026 MINĄŁ bez ustawy; projekt UC127 (status "otwarty" na RCL, wersja z 29.04.2026/publ. 4.05.2026) WYRAŹNIE odracza wejście w życie na "6 miesięcy od ogłoszenia" zamiast sztywnej daty — faktycznie NIE WCZEŚNIEJ niż I kw. 2027. Kluczowe elementy projektu do śledzenia: zniesienie tajemnicy wynagrodzeń, obowiązkowe wartościowanie stanowisk (odwołanie do art. 183c §3 KP), odwrócony ciężar dowodu w sporach o dyskryminację płacową, raportowanie luki płacowej (≥100 prac. wg jednej wersji), sankcje (widełki grzywien niespójne między źródłami: 2000-60000 zł vs 3000-50000 zł — do potwierdzenia przy uchwaleniu). ⚠️ Opóźnienie NIE zwalnia Polski z obowiązku transpozycji — ryzyko postępowania KE trwa | co 4–6 tyg. — częściej przy zbliżaniu się do zapowiadanego I kw. 2027 |

| OBS-6 | Areszt elektroniczny (AE) jako nowy środek zapobiegawczy w KPK | dr-03 (`mod-KPK-*` środki zapobiegawcze/tymczasowe aresztowanie — punkt startowy do połączenia po uchwaleniu) | **wysoki** | Nowy, SAMODZIELNY środek zapobiegawczy między dozorem policyjnym a tymczasowym aresztowaniem: zamiast aresztu śledczego — pobyt we WŁASNYM miejscu zamieszkania pod kontrolą Systemu Dozoru Elektronicznego (elektroniczna bransoletka). WYMAGA zgody zarówno oskarżonego/podejrzanego, JAK I jego pełnoletnich domowników. Dwuetapowe zastosowanie: (1) wczesna faza postępowania przygotowawczego — na wniosek prokuratora o tymczasowe aresztowanie LUB jego zamianę na AE; (2) faza późniejsza — gdy dalsze tymczasowe aresztowanie nie jest konieczne. Nadzór: sąd albo prokurator (zależnie od etapu), z możliwością zmiany miejsca/przedziałów czasowych oddalania się w uzasadnionych przypadkach. Projekt Komisji Kodyfikacyjnej Prawa Karnego, nowelizuje KPK + KKW + ustawę o SDE. ⚠️ ROZBIEŻNOŚĆ ŹRÓDEŁ co do statusu: (a) gazetaprawna.pl [archiwalna data cache ok. marca 2026] wskazuje, że Rada Ministrów JUŻ PRZYJĘŁA projekt nowelizacji KK/KPK/ustawy o SDE; (b) rp.pl [publikacja dzisiejsza, 20.08.2026] wskazuje, że projekt NIE ZOSTAŁ opublikowany, BEZ konsultacji/opiniowania, przyjęcie przez rząd zapowiadane na jesień 2026 jest "niemal pewne, że się NIE stanie" — wiceminister Maria Ejchart (MS) deklaruje gotowy projekt "do końca roku" [2026]. ⚠️ NIE rozstrzygnięto tej rozbieżności w tej sesji — możliwe, że gazetaprawna dotyczy INNEGO, wcześniejszego/węższego projektu (rozszerzenie progu SDE z 1 roku do 1,5 roku dla already-skazanych, śledzone jako odrębny wątek techniczny, MNIEJ istotny niż sam AE jako nowy środek zapobiegawczy). ⭐ Kontekst: ~90% wniosków o tymczasowe aresztowanie jest uwzględnianych (raport Fundacji Court Watch) — AE ma to ograniczyć | co 4-6 tyg., częściej pod koniec 2026 przy zbliżaniu się do zapowiadanego terminu |
| OBS-7 | "Lex szarlatan" — nowelizacja ustawy o prawach pacjenta i RPP (dawna F-97) | dr-10 (zdrowie/prawa pacjenta) — brak modułu, ZASADNIE, dopóki TK się nie wypowie | średni | **ROZSTRZYGNIĘTE 2026-08-21 (dzień terminu, 21 dni od 31.07.2026):** Prezydent Nawrocki OGŁOSIŁ 20.08.2026, że NIE PODPISUJE ustawy i kieruje ją do Trybunału Konstytucyjnego w trybie KONTROLI PREWENCYJNEJ (art. 122 ust. 3 Konstytucji RP) — zapowiedział też własną inicjatywę ustawodawczą w tym temacie. To NIE jest klasyczne weto (zwrot do Sejmu) ani podpis — ustawa NIE WCHODZI W ŻYCIE i nie otrzyma numeru Dz.U., dopóki TK nie orzeknie o zgodności z Konstytucją (termin orzeczenia TK nieznany, potencjalnie miesiące/lata). Zweryfikowane 4+ zgodnymi źródłami z 20-21.08.2026 (polsatnews.pl, portalsamorzadowy.pl, rynekzdrowia.pl, zwrotnikraka.pl). Brak modułu w systemie pozostaje zasadny do czasu orzeczenia TK | co 2-3 mies. — sprawdzać status w TK, nie co sesję (niski tempo zmian oczekiwane) |

---

## 4. 🔁 REAKTYWNE (REACT-1) — uruchamiane WYŁĄCZNIE sprawą, nie sesją audytową

> 7 pozycji przeniesionych 2026-08-15n z rejestru flag F- (reklasyfikacja, NIE
> naprawa — żaden punkt nie został zbadany). Powód: wszystkie miały w kolumnie
> „Wymaga" tę samą treść — *„web_search per punkt, wyłącznie na żądanie konkretnej
> sprawy"* — więc z definicji nie dają się zamknąć sesją audytową, a zawyżały
> licznik flag i konkurowały o uwagę z zadaniami realnie wykonalnymi.
>
> **Protokół użycia:** przy sprawie dotykającej punktu — web_search wg
> PRAWO-HARDGATE (nigdy z pamięci) W TEJ SAMEJ sesji → wpis do modułu → wpis
> w `AUDIT-JOURNAL.md` → skreślenie punktu z tabeli. NIE liczyć do „aktywnych
> flag do zamknięcia" (ZASADA 9).
>
> ⚠️ Dawne **F-35** i **F-42** trafiły tu przez analogię (miały „web_search per
> punkt" bez dopisku „wyłącznie na żądanie"). Jeśli któryś ich punkt zasłuży na
> sesję dedykowaną — przywrócić jako flagę F- z nowym numerem.

| Dawna flaga | Skill | Priorytet | Otwarta od | Punkty (treść przeniesiona 1:1 z rejestru flag) |
|---|---|---|---|---|
| **F-22** (zmigrowana) | dr-02-prawo-cywilne-rodzinne-gospodarcze | niski | 2026-08-13c | (1) `mod-KC-spadki.md` EPS: szczegółowe zasady jurysdykcji rozp. 650/2012 (art. 4-19) przy rzeczywistym zbiegu elementów z kilku państw UE (np. professio iuris + zwykły pobyt za granicą) — główna procedura EPS już opisana; (2) `mod-KC-spadki.md` Tytuł X KC: praktyczne znaczenie pojedynczych przepisów, które PRZETRWAŁY wyrok TK P.4/99 (art. 1058, 1063, 1067, 1070, 1070¹, 1079, 1081, 1082, 1086) — sama cezura 14.02.2001 już ustalona i jest wystarczająca dla zdecydowanej większości spraw; (3) `mod-KC-spadki.md` spis inwentarza: dokładne stawki kosztów KOMORNICZYCH (opłata sądowa 300 zł już nie dotyczy tej ścieżki — to inna taksa); (4) `mod-piecza-zastepcza-rodzina-zastepcza.md`: limit 14/30 dzieci w placówkach opiekuńczo-wychowawczych oparty WYŁĄCZNIE na 1 źródle Rządu 3 (domydziecka.org) — wymaga potwierdzenia w art. 95/105 ustawy przed powołaniem w piśmie (ZASADA 12 — poniżej progu 2-3 źródeł); (5) `mod-piecza-zastepcza-rodzina-zastepcza.md`: regionalne placówki opiekuńczo-terapeutyczne i interwencyjne ośrodki preadopcyjne nadal całkowicie nieopracowane (rzadkie formy) |
| **F-47** (zmigrowana) | dr-10-zdrowie-farmacja-zywnosc-rolnictwo | bardzo niski | 2026-08-13, **pkt 1 zamknięty 2026-08-19** | ✅(1) `mod-rzadkie-choroby-genetyczne-plan-leki-sieroce.md` — Plan dla Chorób Rzadkich W PEŁNI ZWERYFIKOWANY: aktualna edycja to Plan na 2026 r. (uchwała RM 179/2025), przedłużony do końca 2026, ALE System dla Chorób Rzadkich (rejestr+karta pacjenta) NIE jest jeszcze operacyjny — czeka na ustawę SIOZ ("martwy punkt" wg mzdrowie.pl czerwiec 2026); rozróżnienie prawo-na-papierze vs praktyka istotne dla realnej oceny praw pacjenta. (2) `mod-ustawa-hodowla-zdrowie-zwierzat.md` — dokładny status propozycji ograniczenia eksportu żywych zwierząt NIE potwierdzony w tej sesji (sprawdzono, brak jednoznacznego źródła) — pozostaje uczciwie otwarte, wymaga dedykowanej weryfikacji ISAP przy konkretnej sprawie |
| **F-91** (zmigrowana, 2026-08-17d) | dr-09-budownictwo-srodowisko-energia-transport | niski | 2026-08-16, pokrycie rozdziałów zamknięte 2026-08-17d | Punktowy ogon po zamknięciu pokrycia 12/12 — każdy punkt = osobny web_search przy trafieniu sprawą. **Sesja 2026-08-18: pkt 3, 4, 5 ZAMKNIĘTE, pkt 1, 2, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16 CZĘŚCIOWO/W WIĘKSZOŚCI, pkt 7 SPRAWDZONY-NIE-ZAMKNIĘTY.** Wszystkie 16 punktów ogona dotknięte w tej sesji — pełny bilans w AUDIT-JOURNAL.md, wpisy AUDYT-2026-08-18 do AUDYT-2026-08-18k. **Pkt 7 ZAMKNIĘTY 2026-08-18 (korekta własnego błędu z wcześniejszej tury tej samej sesji):** sygnatura II CSK 170/12 jest PRAWDZIWA — pierwsze sprawdzenie w SAOS/sn.pl (generyczne zapytania) dało fałszywy negatyw; potwierdzenie znalezione w rp.pl, art. z 25.01.2013 "Sąd cywilny skontroluje łowieckie dyscyplinarki", cytujący sygnaturę wprost wraz z tezą zgodną z opisem w module. Wcześniejsza sugestia zastąpienia sygnaturą IV CSK 473/16 była błędna i wycofana. Pozostają: (1) rozporządzenia z delegacji art. 49 ust. 1 oraz art. 41 ust. 1-3 (3 akty, metryki nieustalone); (2) metryka rozporządzenia z art. 15 ust. 4 (ekwiwalent) oraz z art. 18 ust. 4-5 (2 akty) i art. 22 ust. 2 (wzór ewidencji skupu); (6) treść statutu PZŁ i regulaminu sądów łowieckich (akty wewnątrzkorporacyjne, poza Dz.U.); (7) patrz wyżej — korekta/potwierdzenie sygnatury, NIE zamknięte; (8) orzecznictwo do art. 33 ust. 2a-2d, art. 39, art. 8a (odmowa zatwierdzenia RPŁ) i art. 59 ust. 3 (uprawnienia nabyte przed 17.02.1996); (9) czy zatarcie z art. 35r usuwa przeszkodę z art. 33c ust. 1 pkt 2; (10) tryb zaskarżenia decyzji z art. 35a ust. 9; (11) moduł Rozdz. 5 — katalog wyłączeń art. 26, art. 28 ust. 2 i n., art. 29a, art. 30, art. 31, obwody <3000 ha; (12) moduł Rozdz. 8 — art. 43, 42c, 42e, katalog tematów egzaminu, bioasekuracja, stawka opłaty skarbowej art. 45 ust. 3, aktualność opisu art. 42b; (13) moduł Rozdz. 3 — droga do WSA po wyłączeniu KPA z art. 8d (styk dr-05), aktualność oznaczenia Dz.U. KPA w art. 8d, katalog zwierząt gospodarskich z art. 16 ust. 1; (14) moduł Rozdz. 1-2 — metryka nowelizacji zmieniającej art. 7, rozporządzenie z art. 5, aktualność krajowej listy IGO; (15) moduł Rozdz. 4 — metryka nowelizacji uchylającej art. 17/19/20, standard długości terminu w wezwaniu z art. 22a ust. 1; (16) moduł Rozdz. 11 — treść zmian pominiętych w art. 55-57 (odtworzenie z pierwotnego Dz.U. 1995 poz. 713), dokładne dni upływu terminów z art. 58 ust. 1, art. 60 ust. 2 i art. 62 (w module podane jako miesiąc, wyliczenie własne z cezury 17.02.1996). ⛔ **Ograniczenie narzędziowe odkryte 2026-08-18:** `web_fetch` na `isap.sejm.gov.pl` i `api.sejm.gov.pl` zwraca ROBOTS_DISALLOWED w tym środowisku — punkty wymagające odczytu pełnego tekstu jednolitego wprost z RZĄD 1 (zwł. pkt 16 — odtworzenie art. 55-57 z Dz.U. 1995 poz. 713) będą wymagały źródeł pochodnych (lexlege/arslege/prawo.pl) z krzyżową weryfikacją, nie bezpośredniego fetch ISAP. |

**Bilans migracji:** 8 wierszy usuniętych z rejestru flag F- (7 w migracji
pierwotnej + F-91 w dniu 2026-08-17d), 0 punktów merytorycznych utraconych
(kolumna „Punkty" zawiera pełną, niezmienioną treść kolumny „Opis"
z pierwotnych wierszy). Przy F-91 dodatkowo: część merytoryczna o wyższej
wadze NIE została zmigrowana, lecz przeniesiona do nowej flagi **F-93**
(sekcja 1) — migracja objęła wyłącznie punkty typu „web_search per punkt".
---

## 5. Obserwacje informacyjne (nie są flagami, nie blokują)

| # | Obserwacja | Skill | Co ewentualnie zrobić |
|---|---|---|---|
| O-1 | Nowelizacja ABW/AW ws. treści terrorystycznych (Dz.U. 2024 poz. 1684) — uprawnienia Szefa ABW do nakazów usunięcia treści (implementacja rozp. UE 2021/784) nieopisane w `mod-ustawa-ABW-AW-CBA-sluzby-specjalne.md` | dr-13 | Wąska kompetencja, rzadko aktywna — opracować przy sprawie |
| O-2 | `check_rejestracja_modulow.py` wykrywa sieroctwo plików dla modułów DR (4 rejestry), ale NIE ma odpowiednika dla `references/` i `scripts/` samego audyt-systemu-v4 — stąd 15 plików mogło pozostać niezarejestrowanych (F-80, zamknięta 2026-08-15h) | audyt-systemu-v4 | Rozszerzyć skrypt albo dodać krok FAZA 0/2: `find references/ scripts/ -type f` vs YAML frontmatter |
| O-3 | ✅ **ZREALIZOWANA 2026-08-21** — test **T13** (`scripts/check_dlugosc_modulow.py`) powstał i jest zarejestrowany w YAML `scripts:`, drzewie STRUKTURA KATALOGU i `REGRESSION-TEST-PLAN.md` sekcja 13. Pierwszy przebieg: 1 ⛔ + 6 ⚠️ przed naprawami, **0 ⛔ + 5 ⚠️** po. Pozostaje wyłącznie jako pozycja informacyjna — strefę 800-1000 (5 plików) obserwuje odtąd test, nie pamięć audytora | audyt-systemu-v4 | Nic — mechanizm działa; przy najbliższej edycji któregoś z 5 plików strefy rozważyć podział przy okazji |
| O-4 | ⛔ **O-2 MA JUŻ TRZECI NAWRÓT — brak automatu jest realnym kosztem, nie hipotezą.** F-124 (2026-08-23g) wykryła ręcznie dwa kolejne pliki-sieroty w `references/` (`CHANGELOG.md` — mimo że ZASADA 15 czyni go JEDYNĄ lokalizacją kanoniczną historii, oraz `F-104-lista-robocza-roczniki-starsze.md`) plus rozjazd drzewa STRUKTURA KATALOGU o 2 pliki i 2 skrypty. Znaleziono je wyłącznie dlatego, że sesja liczyła pliki na potrzeby ZASADY 7 — gdyby dostawa szła bez KROKU 1/4, luka przeszłaby niezauważona po raz trzeci. Wykryto też wariant ODWROTNY, na który żaden istniejący test nie patrzy: `raport-sytuacyjny-v2` obiecywał w drzewie `assets/RaportSytuacyjnyWidget.html`, którego na dysku nie ma (rejestr wyprzedza dysk, nie odwrotnie) | audyt-systemu-v4 + cross | Zrealizować O-2 w wersji DWUKIERUNKOWEJ: `find` vs YAML **oraz** YAML vs `find` — i objąć nią KAŻDY skill, nie tylko audyt-systemu-v4. Naturalne miejsce: rozszerzenie `check_rejestracja_modulow.py` albo nowy test T14 |
| O-5 | **15 z 16 skilli DR nie ma w ogóle katalogu `references/` ani pliku `CHANGELOG.md`**, mimo numerów wersji rzędu 3.x–4.x (dr-06 jest na 3.73). Historia tych skilli istnieje wyłącznie w `AUDIT-JOURNAL.md`. `dr-01` dostał plik 2026-08-24 (F-126), bo miał sekcję w korpusie do przeniesienia — pozostałe 15 nie mają czego przenosić, więc założenie im plików byłoby TWORZENIEM historii, nie jej przenoszeniem | 15 DR | **Decyzja użytkownika.** Wariant A: nie zakładać (ZASADA 15 dopuszcza brak pliku „dopóki nie ma historii"). Wariant B: założyć pliki-zaczątki z wpisem tylko bieżącej wersji + jawną adnotacją o luce historycznej, wzorem `dr-01/references/CHANGELOG.md`. ⛔ W ŻADNYM wariancie nie odtwarzać wpisów 3.1…3.x z pamięci (precedens F-102) |
| O-6 | Testy T11 i T3 dały **identyczny wynik przed i po zmianach tej sesji** (T11: 140 = 140, T3: 8 = 8), co potwierdza, że zmiany F-115/F-126/F-127 nie dotknęły żadnego aktu prawnego i **nie wymagały synchronizacji `MAPA-AKTOW.md` ↔ `ROUTING-MAP.md` ↔ mapa Dz.U.** Odnotowane, bo brak zmiany jest tu WYNIKIEM POMIARU, nie założeniem — kontrola wykonana wprost na polecenie użytkownika | cross | Nic. Wpis służy temu, żeby przyszła sesja nie musiała powtarzać pomiaru dla tego samego zakresu zmian |

---

## 6. 🗺️ ZADANIE ODŁOŻONE — MAPA-MODULOW-GLOBALNA (po zamknięciu flag F-)

**Cel:** jeden zbiorczy plik (roboczo `references/MAPA-MODULOW-GLOBALNA.md`)
odwzorowujący moduł → akty i przepisy faktycznie opracowane + data ostatniej
weryfikacji TREŚCI (odrębna od daty poprawki numeru), żeby przy nowelizacji
znaleźć wszystkie moduły do aktualizacji JEDNYM wyszukiwaniem zamiast
przeglądania 16 plików.

**Powiązanie:** po powstaniu staje się pierwszym krokiem PROTOKOŁU PRZY
TRAFIENIU (sekcja 2). Dopóki nie istnieje — protokół używa ścieżki zapasowej
(16× lokalna `MAPA-AKTOW.md` + centralna `ROUTING-MAP.md` równolegle).

**Dlaczego nie teraz:** treść modułów wciąż się zmienia (nowe moduły z F-64…F-87),
mapa musiałaby powstać dwa razy. Rozważyć generowanie skryptem zamiast pliku
statycznego — inaczej sama się zdezaktualizuje.

**Status:** ODŁOŻONE — nie rozpoczynać przed zamknięciem aktywnych flag F-.

---

## 7. Raporty pokrycia 2026-08-13 — zasady usuwania

`references/raporty-pokrycia-2026-08-13/` to **11 plików (10 raportów + indeks)**
— stan na 2026-08-20y po usunięciu KPK (F-81) i KRO (F-73); pierwotnie 13 —
materiału ROBOCZEGO dostarczonego przez użytkownika — migawka z jednego dnia,
nie kanoniczna dokumentacja (⚠️ część raportów jest już nieaktualna wobec
napraw z 14–15.08 — patrz kolumna „Historia" w sekcji 1A).

- Plik raportu usuwać **dopiero po PEŁNYM zamknięciu** odpowiadającej flagi.
- Przy naprawie CZĘŚCIOWEJ — NIE usuwać: raport nadal mapuje niedomknięte fragmenty.
- `00-indeks-raportow-pokrycia.md` — usunąć dopiero, gdy wszystkie flagi zamknięte.
- Każde usunięcie → jedno zdanie w `AUDIT-JOURNAL.md` (ślad audytowy, ZASADA 7).

| Plik | Flaga |
|---|---|
| `raport-pokrycia-PPSA.md` | F-64 |
| `raport-pokrycia-KPC.md` | F-65 |
| `raport-pokrycia-KPK.md` | F-81 — USUNIĘTY 2026-08-15 (flaga zamknięta w całości) |
| `raport-pokrycia-KW.md` | F-67 — brak w rejestrze otwartych; przed usunięciem potwierdzić zamknięcie w dzienniku |
| `raport-pokrycia-KSH.md` | F-68 |
| `raport-pokrycia-PrUp-PrRestr.md` | F-86 (sekcja 1), F-87 (sekcja 2) |
| `raport-pokrycia-OP.md` | F-70 |
| `raport-pokrycia-PZP.md` | F-71 |
| `raport-pokrycia-SUS-FUS.md` | F-72 — zamknięta (AUDYT-2026-08-14h); plik do usunięcia po kontroli |
| `raport-pokrycia-KRO.md` | F-73 — USUNIĘTY 2026-08-15 (flaga zamknięta w całości) |
| `raport-pokrycia-PrBud.md` | F-74 |
| `raport-pokrycia-KKW.md` | F-75 |

---

## 8. Jak korzystać z tego pliku

- **„Co jest jeszcze otwarte?"** → sekcja ⚡ TABLICA STERUJĄCA. Nie grepuj dziennika.
- **Zaczynasz naprawę?** → najpierw HARDGATE-AUDYT (Reguły 1–6), potem wiersz flagi
  w sekcji 1, dopiero potem wskazany wpis dziennika po historię.
- **Zamykasz flagę?** → usuń jej wiersz z TABLICY i z sekcji 1, dopisz pełny opis
  naprawy do `AUDIT-JOURNAL.md` **na końcu pliku** (z numerem flagi w tytule wpisu).
- **Naprawiłeś część?** → skróć wiersz do tego, co ZOSTAŁO. Nie dopisuj tu opisu
  tego, co zrobione — to jest jedyne źródło rozrostu tego pliku.
- **Otwierasz flagę?** → wiersz w TABLICY + wiersz w sekcji 1 + wpis w dzienniku.
- **Numeracja:** WARN-N — flagi z klasycznego trybu audytowego (TRYB DZU,
  TRYB WARN-CLOSE); F-N — flagi strukturalne z sesji tematycznych. Kolejny wolny
  numer: **F-131**.
  *(Pole podawało „F-124" jeszcze po nadaniu numerów F-124, F-125 i F-126 — czyli
  wskazywało numer JUŻ ZUŻYTY. Skorygowane 2026-08-24 przy nadaniu F-127 i F-128;
  aktualizuj to pole RAZEM z licznikiem w TABLICY, nie osobno.)*
- **Aktualizuj licznik** w TABLICY STERUJĄCEJ przy każdej zmianie liczby flag.
