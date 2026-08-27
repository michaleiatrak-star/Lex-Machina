# DR-04 — Mapa Pokrycia Treściowego

**Utworzona:** 2026-08-22 (F-83, zasilenie z `audyt-systemu-v4/references/
raporty-pokrycia-2026-08-13/`) | **Format ustalony przez F-83.**

## Cel i różnica względem MAPA-AKTOW.md

`MAPA-AKTOW.md` (ten sam katalog) odpowiada na pytanie "**który moduł
odpowiada za który akt prawny**" — rejestr akt→moduł.

Ten plik odpowiada na inne pytanie: "**które konkretne rozdziały/działy/
zakresy artykułów danego aktu są rzeczywiście opracowane treściowo, a
które są lukami**". Kluczowy mechanizm przy nowelizacji: pokazuje od razu,
czy dotknięty fragment ma już treść do zaktualizowania, czy to obszar
dotąd nieopracowany.

## Legenda statusu

| Symbol | Znaczenie |
|---|---|
| 🟢 | Pełne/dobrze pokryte — rzeczywista, praktycznie użyteczna treść |
| 🟡 | Częściowe pokrycie — temat opisany, ale bez precyzyjnej podstawy prawnej / część artykułów brakuje |
| 🔴 | Brak — zero treści merytorycznej, brak dedykowanego pliku dla tego zakresu |
| 🟣 | MODUŁ-WIDMO — plik istnieje, ale jest generyczny/szablonowy, bez rzeczywistej treści danego aktu; wymaga przepisania od podstaw, nie punktowej rozbudowy |

⚠️ Ten rejestr opisuje ILOŚĆ i ZAKRES treści, nie jej AKTUALNOŚĆ prawną.
Każdy przepis nadal wymaga weryfikacji ISAP przed użyciem (HARD GATE).

---

## Ustawa o systemie ubezpieczeń społecznych (SUS) i Ustawa o emeryturach i rentach z FUS

**Stan prawny bazowy:** SUS — Dz.U. 2026 poz. 199 t.j.; FUS — Dz.U. 2025
poz. 1749 t.j.
**Data ostatniej weryfikacji treści:** 2026-08-22 (⛔ NAPRAWIONE — szósta
naprawa tego typu w tej sesji; dawny priorytet #1 rekomendowanej
kolejności otrzymał własny moduł, nieznany poprzedniej wersji mapy)
**Moduły:** `mod-SUS-ZUS-ubezpieczenia-spoleczne.md` (347 linii, moduł
główny), `mod-dodatek-pielegnacyjny-swiadczenie-rehabilitacyjne-
wyrownawcze.md`, `mod-SUS-dzial-2-podleganie-ubezpieczeniom.md` (257 l.,
NOWY)

⚠️ **Nadal model "dobra procedura, słaba materia" dla większości aktu —
ale JEDNA z najważniejszych luk materialnych już naprawiona.**
Moduł koncentruje się bardzo mocno na ścieżce odwoławczej od orzeczenia
lekarskiego i decyzji ZUS (sprzeciw → decyzja → sąd → apelacja → kasacja)
i robi to bardzo dobrze, z aktualną reformą orzecznictwa 2026. Reszta
materialnej treści (składki, warunki nabycia większości świadczeń) nadal
szczątkowa. **Brak modułu-
widma** — treść jest realna tam, gdzie istnieje.

### Ustawa o systemie ubezpieczeń społecznych (SUS) — 13 rozdziałów, art. 1–106+

| Rozdział | Materia | Art. | Status | Moduł |
|---|---|---|---|---|
| 1 | Przepisy ogólne (zakres ubezpieczeń, zasada równego traktowania) | 1–5 | 🟡 B — uzupełnione 2026-08-27 | `mod-SUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| 2 | **Zasady podlegania ubezpieczeniom społecznym** | 6–14 | 🟢 NAPRAWIONE 2026-08-22 (znaleziona przy weryfikacji), ⭐⭐⭐ | `mod-SUS-dzial-2-podleganie-ubezpieczeniom.md` — katalog tytułów obowiązkowego ubezpieczenia (art. 6), definicja "pracownika" dla celów ubezpieczeniowych (art. 8), **zbieg tytułów ubezpieczenia (art. 9, ⭐⭐⭐ najczęstsze praktyczne pytanie)**, ubezpieczenie chorobowe dobrowolne vs obowiązkowe (art. 11), ubezpieczenie wypadkowe (art. 12), okresy podlegania — początek/koniec (art. 13-14). Dawny "najczęściej potrzebny fragment w praktyce", teraz opracowany |
| 3 | Zasady ustalania składek | 15–32 | 🟡 B — uzupełnione 2026-08-27 | `mod-SUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| 4 | Zgłoszenia, konta, rejestry, rozliczanie składek i zasiłków | 33–50a | 🟡 B — uzupełnione 2026-08-27 | `mod-SUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| 5 | Fundusz Ubezpieczeń Społecznych (jako fundusz) | 51–57 | 🟡 B — uzupełnione 2026-08-27 | `mod-SUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| 6 | Fundusz Rezerwy Demograficznej | 58–65 | 🟡 B — uzupełnione 2026-08-27 | `mod-SUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| 7 | Zakład Ubezpieczeń Społecznych (organizacja, zadania) | 66–79b | 🟡 B — uzupełnione 2026-08-27 | `mod-SUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| 8 | Obowiązki ubezpieczonych oraz tryb odwoławczy | 80–83f | 🟡 | **Tryb odwoławczy opracowany bardzo dobrze** (schemat postępowania, właściwość SR/SO), ale bez numerów tego rozdziału; obowiązki ubezpieczonych nieopisane |
| 9 | Zwrot nienależnie pobranych świadczeń oraz odsetki | 84–85 | 🟡 B — uzupełnione 2026-08-27 | `mod-SUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| 9a | Orzekanie dla celów świadczeń | — | 🟢 | Sekcja "Reforma orzecznictwa ZUS" — 3 etapy reformy 2026 (nowe uprawnienia pielęgniarek/fizjoterapeutów, badania zdalne, terminy) |
| 10 | Kontrola wykonywania zadań ubezpieczeń społecznych | 86–97 | 🟡 B — uzupełnione 2026-08-27 | `mod-SUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| 11 | Odpowiedzialność za wykroczenia | 98 | 🟡 B — uzupełnione 2026-08-27 | `mod-SUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| 12–13 | Zmiany w przepisach, przepisy przejściowe i końcowe | 99+ | ⚪ | Techniczne, niski priorytet |

**Ocena SUS: bardzo wąskie pokrycie.** Z 13 rozdziałów tylko fragment
jednego (tryb odwoławczy) i temat orzekania mają realną treść. Rozdział 2
(zasady podlegania) — prawdopodobnie najczęściej potrzebny fragment w
praktyce — całkowicie nieobecny.

### Ustawa o emeryturach i rentach z FUS — 9 działów, art. 1–194j

| Dział | Materia | Art. | Status | Moduł |
|---|---|---|---|---|
| I, Rozdz. 1 | Zakres podmiotowy i przedmiotowy | 1–4 | 🟡 B — uzupełnione 2026-08-27 | `mod-FUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| I, Rozdz. 2 | **Okresy uwzględniane przy ustalaniu prawa do świadczeń** | 5–11 | 🟡 | Wymienione jako "typowe przyczyny zaniżonej emerytury" (pominięte okresy), bez numerów artykułów |
| I, Rozdz. 3 | **Niezdolność do pracy** (definicja, stopnie) | 12–14 | 🟡 | Przesłanka wymieniona w ANEKSIE A (renta), bez odniesienia do art. 12-14 |
| I, Rozdz. 4 | **Podstawa wymiaru emerytur i rent** | 15–23 | 🟡 | Ogólny wzór opisany, bez numerów artykułów |
| II, Rozdz. 1 | **Emerytura — nowy system** (urodzeni po 31.12.1948) | 24–26c | 🟡 | Wzór obliczenia opisany merytorycznie, bez cytowania art. 24-26c |
| II, Rozdz. 2 | Emerytura — stary system (urodzeni przed 1.01.1949) | 27–45 | 🟡 | **Art. 25 ust. 1b wprost cytowany** (wyrok TK SK 140/20) — jeden z niewielu precyzyjnych przepisów FUS; reszta rozdziału nieopisana |
| II, Rozdz. 3 | Przepisy szczególne dla roczników przejściowych | 46–50 | 🟡 B — uzupełnione 2026-08-27 | `mod-FUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| II, Rozdz. 3a | Emerytury górnicze | 50a–50f | 🟡 B — uzupełnione 2026-08-27 | `mod-FUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| II, Rozdz. 4 | Ustalanie wysokości emerytur | 51–56 | 🟡 B — uzupełnione 2026-08-27 | `mod-FUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| III, Rozdz. 1 | **Renta z tytułu niezdolności do pracy** | 57–64 | 🟢 | ANEKS A — **art. 57 wprost cytowany**, pełne 3 przesłanki (niezdolność, staż z tabelą progową wg wieku, okres powstania niezdolności z wyjątkiem 25-letniego stażu) |
| III, Rozdz. 2 | Renta rodzinna | 65–74 | 🟢 NAPRAWIONE | `mod-FUS-zasilek-pogrzebowy-renta-rodzinna-waloryzacja.md` — warunek po zmarłym, krąg uprawnionych, ustalanie wysokości i routing do zbiegu świadczeń |
| IV | **Dodatki do emerytur i rent** (dodatek pielęgnacyjny) | 75–76 | 🟢 | `mod-dodatek-pielegnacyjny-swiadczenie-rehabilitacyjne-wyrownawcze.md` — warunki nabycia, wysokość, wyłączenia, rozróżnienie od zasiłku pielęgnacyjnego (inna ustawa) |
| V | Zasiłek pogrzebowy | 77–81 | 🟢 NAPRAWIONE | `mod-FUS-zasilek-pogrzebowy-renta-rodzinna-waloryzacja.md` — uprawnieni, koszty, wysokość, wniosek; jawne punkty pogłębienia w module |
| VI | Świadczenia w szczególnym trybie (uznaniowe decyzje Prezesa RM) | 82–84 | 🟡 B — uzupełnione 2026-08-27 | `mod-FUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| VII, Rozdz. 1 | Dolna i górna granica wysokości świadczeń | 85–87 | 🟡 B — uzupełnione 2026-08-27 | `mod-FUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| VII, Rozdz. 2 | **Waloryzacja świadczeń** | 88–94 | 🟢 NAPRAWIONE | `mod-FUS-zasilek-pogrzebowy-renta-rodzinna-waloryzacja.md` — mechanizm coroczny, wskaźnik, ogłoszenia i relacja do zmian ustawowych |
| VII, Rozdz. 3 | Zbieg prawa do świadczeń | 95–99 | 🟡 B — uzupełnione 2026-08-27 | `mod-FUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| VIII, Rozdz. 1 | Powstanie i ustanie prawa do świadczeń | 100–102 | 🟡 B — uzupełnione 2026-08-27 | `mod-FUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| VIII, Rozdz. 2 | Zawieszanie lub zmniejszanie świadczeń | 103–106 | 🟡 B — uzupełnione 2026-08-27 | `mod-FUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| VIII, Rozdz. 3 | Zmiany w prawie do świadczeń i ich wysokości | 107–114 | 🟡 B — uzupełnione 2026-08-27 | `mod-FUS-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne |
| IX | Postępowanie w sprawach świadczeń i wypłata | 115–144 | 🟡 | Ogólna ścieżka odwoławcza opisana dobrze, ale numeracja odwołuje się do KPC, nie do samej ustawy FUS |

**Ocena FUS po 2026-08-27:** brak luk zerowych w zmapowanych działach; zakresy wcześniej czerwone mają co najmniej pokrycie operacyjne B, a moduły szczegółowe zachowują wyższy poziom. (renta z
niezdolności art. 57, dodatek pielęgnacyjny art. 75-76). Reszta — cały
mechanizm obliczania emerytury w starym systemie, renta rodzinna, zasiłek
pogrzebowy, waloryzacja — praktycznie nieobecna.

**Tematy przekrojowe (dobrze pokryte, spoza samych ustaw SUS/FUS):**
podstawa wymiaru składek (rozporządzenie wykonawcze, inny akt) 🟢;
emerytury czerwcowe 2009-2019 (odrębna ustawa, alert legislacyjny) 🟢;
wyrok TK SK 140/20 🟢; reforma orzecznictwa ZUS 2026 (Dz.U. 2026 poz. 26) 🟢;
interpretacja indywidualna ZUS (art. 34 Prawa przedsiębiorców) 🟢; zasiłek
pielęgnacyjny (ustawa o świadczeniach rodzinnych) 🟢; świadczenie
rehabilitacyjne (ustawa zasiłkowa) 🟢; KRUS — osobny moduł.

**Zaktualizowana rekomendowana kolejność uzupełniania:**
1. ~~SUS Rozdział 2 — zasady podlegania ubezpieczeniom (art. 6–14)~~ ✅ NAPRAWIONE 2026-08-22
2. ~~FUS Dział V — zasiłek pogrzebowy (77–81)~~ ✅ NAPRAWIONE
3. ~~FUS Rozdz. VII Rozdz. 2 — waloryzacja (88–94)~~ ✅ NAPRAWIONE
4. ~~FUS Dział III Rozdz. 2 — renta rodzinna (65–74)~~ ✅ NAPRAWIONE
5. FUS art. 103–106 — zawieszanie/zmniejszanie świadczeń przy pracy zarobkowej
6. SUS Rozdział 3 — zasady ustalania składek (art. 15–32)
7. FUS Dział II, Rozdz. 2 i 4 — emerytura w starym systemie (art. 27–45, 51–56)
8. SUS Rozdział 10 — kontrola ZUS wobec płatników składek (art. 86–97)

---

## Akty NIE objęte tym rejestrem (brak materiału źródłowego)

Ten skill (dr-04) obejmuje też prawo pracy i inne ustawy świadczeniowe
poza SUS/FUS — audyt źródłowy z 2026-08-13 objął w tym skillu wyłącznie
SUS i FUS. Pozostałe akty NIE mają dotąd odpowiadającego raportu pokrycia
w tym rejestrze.
