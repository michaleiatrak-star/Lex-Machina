---
name: dr-05-prawo-administracyjne-sadowoadministracyjne
version: 3.19
description: |
  DR-05: Prawo Administracyjne i Sądownictwo Administracyjne
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.nsa.gov.pl | nsa.gov.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-05 — Prawo Administracyjne i Sądownictwo Administracyjne

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, artykułu, terminu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, terminu, kary ani sygnatury wyłącznie z pamięci modelu.

> Procedura szczegółowa (warstwa strukturalna SAOS/MCP, kontrakt sygnatur,
> gradient weryfikacji cytatu): `view shared/PRAWO-HARDGATE.md` — wczytaj
> PRZED pierwszym przepisem w każdej odpowiedzi. Integruje się z
> `shared/ISAP-AUDIT-PROTOCOL.md`.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Wyjątek: wydzielone rozdziały jednej ustawy mogą mieć osobny moduł (z adnotacją)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów z pamięci modelu podczas sesji — każde brzmienie weryfikuj w ISAP**
- Źródło podstawowe: ISAP; LEX/Legalis dopuszczalne wyłącznie pomocniczo

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-ADMINISTRACYJNE.md` — decyzja administracyjna: definicja
  + wykonalność (scalone E.3+H.5.1)
- `definicje/DEF-PROCEDURA.md` — termin zawity vs przedawnienie vs instrukcyjny
  (KPA art. 35 instrukcyjny, art. 128 zawity)

- `definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` — ⚠️ NOWE, PLIK GŁÓWNY:
  interes prawny vs interes faktyczny (art. 28 KPA — definicja strony
  postępowania, NSA II GSK 163/06, granica sporna przy immisjach/COVID)

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-009 Cel publiczny (UGN art. 6 — katalog ZAMKNIĘTY)
- BAS-103 Uprawdopodobnienie (≠ udowodnienie — ORKA-REG-02)
- BAS-111 Strona postępowania w sprawach WZ (sąsiad jako strona — NSA)
- BAS-W11 Dwuinstancyjność postępowania (art. 15 KPA — obowiązek pełnej oceny)
- BAS-W12 Wynagrodzenie dla egzekucji administracyjnej (zmiana 25.03.2024 UPEA)
- BAS-W21 Informacja przetworzona (UDIP art. 3 — "szczególna istotność")
- BAS-W29 Pełnomocnik z urzędu — prawo do sądu (art. 117 KPC)

## Moduły (18 łącznie — ✓ 18 OK, ☐ 0 STUB)

**NAPRAWA 2026-08-13:** dodano `mod-PPSA-terminy-kasacja-prawo-
pomocy.md` — PIERWSZY dedykowany moduł PPSA w całym systemie, zamyka
F-64 (priorytet strukturalny zerowy). Pełny opis: `audyt-systemu-v4/
references/AUDIT-JOURNAL.md`.

**Aktualizacja 2026-08-12 (PODZIAŁ modułu KPA, NOTA-4):** moduł KPA
osiągnął 1115 linii (~2,8× próg 400 linii) po serii uzupełnień luk
(zasady ogólne, strona, wyłączenie, doręczenia, dowody, zawieszenie,
decyzja, odwołanie, postanowienia/zażalenia, rozprawa). PODZIELONO
na CZTERY pliki wg naturalnych klastrów:
- `mod-KPA-postepowanie-administracyjne.md` (rdzeń, 406 l.) —
  zasady ogólne, strona, wyłączenie, doręczenia, terminy, mapa
  postępowania
- `mod-KPA-mechanizmy-w-toku-sprawy.md` (NOWY, 257 l.) —
  zawieszenie, dowody, rozprawa
- `mod-KPA-decyzja-i-odwolanie.md` (NOWY, 247 l.) — elementy
  decyzji, procedura odwołania, postanowienia/zażalenia
- `mod-KPA-tryby-nadzwyczajne-i-strategia.md` (NOWY, 297 l.) —
  wznowienie, nieważność, 4 dodatkowe instytucje, bezczynność,
  kary, skarga do WSA, strategia, orzecznictwo

**⚠️ PRZY PODZIALE naprawiono kolejność:** sekcja o postępowaniu
dowodowym (art. 75-88a) BYŁA omyłkowo wstawiona w nieprawidłowym
miejscu oryginalnego pliku (między skargą do WSA a checklistem
dowodowym, zamiast obok zawieszenia/rozprawy) — TERAZ we WŁAŚCIWYM
miejscu w mod-KPA-mechanizmy-w-toku-sprawy.md. Zweryfikowano
KOMPLETNOŚĆ — wszystkie tematy potwierdzone obecne po podziale.

```
  [✓] NOWY  mod-ustawa-RPD
              (dodany 2026-07-27, na żądanie użytkownika, analogiczny
               do mod-ustawa-RPO — Rzecznik Praw Dziecka: kompetencje
               interwencyjne art. 10/10a [termin 30 dni], procesowe
               art. 7 [udział w TK, kasacja, wniosek do SN, na prawach
               prokuratora w post. cywilnym/administracyjnym/
               nieletnich], immunitet, rozgraniczenie od RPO/RPP)
  [✓] OK    mod-KPA-decyzja-i-odwolanie
              (RODZINA KPA, podział NOTA-4 — decyzja administracyjna i odwołanie: elementy decyzji, procedura, postanowienia, zażalenia; ZAREJESTROWANY 2026-08-14e (F-77 rozszerzona))
  [✓] OK    mod-KPA-mechanizmy-w-toku-sprawy
              (RODZINA KPA — zawieszenie postępowania, postępowanie dowodowe, rozprawa administracyjna; ZAREJESTROWANY 2026-08-14e (F-77 rozszerzona))
  [✓] OK    mod-KPA-tryby-nadzwyczajne-i-strategia
              (RODZINA KPA — tryby nadzwyczajne, bezczynność i przewlekłość, kary, skarga do WSA, warstwa strategiczna; ZAREJESTROWANY 2026-08-14e (F-77 rozszerzona)
               ✅ PODZIELONY 2026-08-20 — naprawa F-78, priorytet 7 [1303 linie, sam produkt wcześniejszego podziału NOTA-4 2026-08-12, mimo to ponownie urósł powyżej progu]: plik pod NIEZMIENIONĄ nazwą stał się indeksatorem [99 linii, zachowuje pełną historię podziałów/napraw + tabelę nawigacyjną], treść 18 sekcji przeniesiona do 8 plików w podkatalogu `kpa-tryby-nadzwyczajne/` [max 407 linii/plik: prokurator+kary administracyjne razem, bo Dział IVa w całości wymaga spójnego kontekstu]. Zweryfikowano 100% integralność [18 nagłówków = 18]. Naprawiono 1 odesłanie cross-file [skargi i wnioski Dział VIII → skarga do WSA, teraz w innym pliku])
  [✓] OK    mod-KPA-postepowanie-administracyjne
              (PRZENIESIONY 2026-07-19 z DR-04, gdzie był błędnie
               umiejscowiony — KPA/PPSA to najbardziej fundamentalne
               akty prawa administracyjnego, teraz kanonicznie tutaj.
               ROZBUDOWANY 2026-07-19 o sekcję 4a: ugoda administracyjna,
               milczące załatwienie sprawy, wydawanie zaświadczeń,
               skargi i wnioski Działu VIII [odróżnione od skargi do WSA])
  [✓] OK    mod-UDIP-dostep-informacji-publicznej
  [✓] OK    mod-UPEA-egzekucja-administracyjna
  [✓] OK    mod-ustawa-cudzoziemcy
              (moduł kanoniczny: tytuły pobytowe, procedura UW→SZUSC→WSA→NSA,
               wydalenie, ochrona międzynarodowa, ochrona tymczasowa UA)
  [✓] NOWY  mod-ustawa-cudzoziemcy-zatrudnianie
              (wydzielony 2026-06-14 z mod-ustawa-cudzoziemcy >400 linii:
               zezwolenia na pracę typy A/B/C/D/S, ustawa Dz.U. 2025 poz. 621,
               matryca dokument pobytowy → uprawnienie do pracy)
  [✓] OK    mod-ustawa-skargi-przewleklosc-dostep-sadu
  [✓] OK    mod-ustawa-RPO
  [✓] OK    mod-ustawa-SKO
  [✓] OK    mod-ustawa-kontrola-administracji
  [✓] OK    mod-ustawa-petycje
  [✓] OK    mod-ustawa-zaskarzanie-decyzji-wlasnosci
  [✓] OK    mod-ustawa-dostepnosc-niepelnosprawni
  [✓] OK    mod-ustawa-sygnalisci
  [✓] NOWY  mod-PPSA-terminy-kasacja-prawo-pomocy
              (dodany 2026-08-13 — PIERWSZY dedykowany moduł PPSA w
               systemie, naprawa F-64. Uchybienie/przywrócenie terminu
               [art. 85-89, checklist formalny, termin roczny],
               skarga kasacyjna do NSA [173-193, przymus adwokacko-
               radcowski, 2 podstawy kasacyjne, wyrok TK SK 22/11],
               prawo pomocy [245-259, zakres całkowity/częściowy,
               referendarz jako organ I instancji, sprzeciw 7 dni].
               Komplementarny do mod-KPA-tryby-nadzwyczajne-i-
               strategia, NIE duplikuje kwalifikacji skargi do WSA.
               ✅ ROZSZERZONY 2026-08-20 — naprawa F-88, punkt PPSA:
               nowa sekcja 7, doprecyzowanie ustawą Dz.U. 2026.846
               [w życie 1.10.2026] terminu skargi do WSA na opinię
               transgraniczną i odmowę jej wydania. ⚠️ [NIEWERYFIKOWANE
               RZĄD 1] — dokładny artykuł i treść NIE potwierdzone,
               ISAP zablokowany; pozostała treść nowelizacji PPSA z tej
               ustawy NIEOPRACOWANA)
```

## KPA i PPSA — teraz kanonicznie w DR-05

```
KPA (Dz.U. 2025 poz. 1691) i PPSA (Dz.U. 2026 poz. 143) są kanonicznie
opracowane W TYM SKILLU → mod-KPA-postepowanie-administracyjne
(PRZENIESIONE 2026-07-19 z DR-04, gdzie były historycznie umiejscowione
— logiczniejsze miejsce to DR-05, zgodnie z nazwą skilla).
DR-05 zawiera RÓWNIEŻ akty szczegółowe prawa administracyjnego
materialnego i procesowego (pozostałe moduły powyżej).
```

## Jak wywołać

```
view /mnt/skills/user/dr-05-prawo-administracyjne-sadowoadministracyjne/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-05-prawo-administracyjne-sadowoadministracyjne/MAPA-AKTOW.md
```

## Mapa pokrycia treściowego (planowanie rozwoju skilla)

Rejestr informacyjny — NIE krok obowiązkowy przy obsłudze konkretnej sprawy.
Przydatny przy planowaniu, które luki uzupełnić w pierwszej kolejności, oraz
przy nowelizacjach — pokazuje od razu czy dotknięty fragment ma treść do
zaktualizowania. (F-83, zasilony 2026-08-22; obejmuje na razie wyłącznie
PPSA — akt bez własnego dedykowanego modułu):

```
view /mnt/skills/user/dr-05-prawo-administracyjne-sadowoadministracyjne/MAPA-POKRYCIA.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- KPA / PPSA: teraz KANONICZNIE tutaj → `mod-KPA-postepowanie-administracyjne` (PRZENIESIONY 2026-07-19 z DR-04)
- Cudzoziemcy (prawo pracy): `dr-04` → `mod-ustawa-cudzoziemcy`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja prawa: isap.sejm.gov.pl
- Orzecznictwo: orzeczenia.nsa.gov.pl, cbosa.nsa.gov.pl

## ⚖️ DISCLAIMER (obowiązkowy)

Po zakończeniu analizy lub przed oddaniem odpowiedzi zawierającej ocenę prawną:

```text
view /mnt/skills/user/shared/DISCLAIMER.md
```

Wybierz wariant odpowiedni do trybu:
- **PRAWNIK / kancelaria** → wariant techniczny (art. 4 Prawa o adwokaturze / art. 6 u.r.p.)
- **LAIK / pro se** → wariant uproszczony (informacja ≠ porada prawna)

Disclaimer musi być **ostatnim elementem** każdej odpowiedzi zawierającej analizę prawną,
ocenę szans, kwalifikację prawną lub interpretację przepisu.
