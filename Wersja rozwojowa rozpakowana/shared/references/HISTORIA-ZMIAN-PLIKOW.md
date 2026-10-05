# Historia zmian plików — shared

> Plik historyczny: historia zmian SKILL.md i modułów, przeniesiona z plików roboczych
> (AUDYT-2026-10-04n). Model nie czyta go podczas pracy; bieżący stan jest w plikach roboczych,
> historia wersji skilla — w `references/CHANGELOG.md`.


## CLAIM-VALIDATION.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.1.0 (2026-06-26)
Przyczyna: analiza błędów sprawa VII P 94/25 (sesja 2026-06-26):
  Problem: pismo procesowe (rozszerzenie pozwu) pomijało co najmniej 6 wątków
  prawnych zawartych w pismach procesowych powoda dostępnych w materiale:
  - art. 94³ §3 KP (odszkodowanie za mobbing) — pismo Riposta, pismo 12.05.2026
  - art. 101¹ §1 KP (abuzywny zakaz konkurencji) — Riposta pkt IV
  - zarzut wobec zeznań świadka [ŚWIADEK-K] w odrębnej sprawie — pismo 12.05.2026 pkt IV
  - art. 6 KEA (konflikt interesów pełnomocnika) — Riposta pkt VI
  - roszczenie z tytułu opłat za pozwolenia na pracę / przywłaszczenie — Riposta pkt III/V
  - propozycja ugodowa (zakres wycofania roszczeń) — pismo 12.05.2026 pkt V
  Przyczyna systemowa: brak kroku wykrywającego wątki z pism procesowych
  strony w materiale dowodowym i pytającego użytkownika czy uwzględnić.
Naprawa:
  + KROK C0 — SKAN PISM PROCESOWYCH STRONY: obowiązkowy skan wątków
    z każdego D[id] = "pismo procesowe strony", konfrontacja z T1..Tn,
    raport T_BRAK i zapytanie użytkownika + STOP.
  + Skan C0 musi być wykonany PRZED C1 — lista tez aktualizowana po C0.

1.0.0 (pierwotna)
  MOD-CLAIM-VALIDATION — pierwotna wersja (data nieznana).
  Weryfikacja twierdzeń strony vs materiał i przepisy.
  Krok CV-ALT (roszczenie alternatywne) dodany w wersji 1.0.
```


## CP-GATE.md (przeniesione 2026-10-04n)

## HISTORIA WERSJI

```
v1.1.0  2026-06-27  Naprawy z audytu VII P 94/25:
                    1. Dodano [CP-FSL-D] do CP-REJESTRU (aktywny gdy SD-VER=KOMPLET i ≥1 teza)
                    2. Dodano §3A REGUŁA ZAKAZU FAŁSZYWEGO N/A (CRIT-NA):
                       N/A wyłącznie gdy techniczny warunek aktywacji = NIE;
                       zakaz N/A z powodu "typ pisma" / "prosta sprawa" / "brak prośby"
                    3. Dodano kontrolę CP-FSL-D w bramce CP-CHECK (§4)
                    Root cause: w sprawie VII P 94/25 CP-1c-macierz i CP-1c-lancuch
                    oznaczono N/A "pismo rozszerzające" — mimo 35 plików i 3 tez.
                    FSL-D nie istniał w rejestrze → nie blokował .docx.

v1.0.0  2026-06-24  Pierwsza wersja — lekcja z sesji VII P 94/25.
                    Przyczyna: model wygenerował .docx (15 stron) bez
                    żadnego z 14 wymaganych checkpointów, co grozi
                    złożeniem niezweryfikowanego pisma do sądu.
```


## DEPENDENCY-GRAPH.md (przeniesione 2026-10-04n)

## CHANGELOG — zmiany strukturalne systemu

### 2026-06-09 — Deduplication & Dependency Cleanup (sesja 2)

#### Scalenia modułów (usunięte → wchłonięte przez)
| Usunięty plik | Wchłonięty przez | Powód |
|---|---|---|
| `dr-03/modules/mod-KK-przemoc-domowa-framework.md` | `mod-KK-art207-przemoc-domowa` | identyczne (diff pusty) |
| `dr-03/modules/mod-KK-stalking-framework.md` | `mod-KK-art190a-stalking` | nowszy Dz.U. w art190a |
| `dr-10/modules/mod-PrFarm-framework.md` | `mod-PrFarm-prawo-farmaceutyczne` | podzbiór (109 ⊂ 915 linii) |
| `dr-10/modules/mod-PrFarm-GIF-WIF-framework.md` | `mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny` | scalono sekcje |
| `dr-10/modules/mod-ustawa-RPP-prawa-pacjenta.md` | `mod-ustawa-prawa-pacjenta-framework` | podzbiór + Dz.U. 2024.581 |
| `dr-11/modules/mod-PrAut-framework-IP.md` | `mod-PrAut-wlasnosc-intelektualna-IP` | identyczne (diff pusty) |
| `dr-11/modules/mod-RODO-framework.md` | `mod-RODO-GDPR-2016-679` | scalono sekcję UODO |

#### MOD-WALIDACJA stuby → czyste view
| Plik | Zmiana |
|---|---|
| `shared/MOD-WALIDACJA.md` | stub opisowy → czyste `view shared/MOD-WALIDACJA_v2.md` |
| `pisma-procesowe-v3/modules/MOD-WALIDACJA.md` | adapter → czyste `view shared/MOD-WALIDACJA_v2.md` |

#### Usunięte orphan files (shared/)
- `MATRIX-COMPLETENESS-AUDIT-GATE.md`, `MATRIX-ROUTING-PRIORITY-RULES.md`, `HIERARCHICAL-COVERAGE-GATE.md`, `OWN-LAW-UNITS-MATRIX-FIRST-GATE.md`, `SECTORAL-MATRIX-FIRST-GATE.md`, `LEGAL-MATRIX-FIRST-GATE.md`, `POLISH-LAW-MAIN-MATRIX-INDEX.md`, `TERYT-INGEST-WORKFLOW.md`
- `references/modules/LOCAL-LAW-AUDIT-GATE.md`, `LOCAL-LAW-SOURCE-PROTOCOL.md`, `MULTI-LEVEL-POLISH-LAW-ROUTER.md`

#### Naprawione MAPA-AKTOW (phantom entries z planowanego rebuild v3.0)
- DR-02 (28→0 phantom), DR-04 (20→0), DR-06 (12→0), DR-07 (9→0), DR-09 (13→0), DR-11 (+1 brakujący)

#### Dodano DISCLAIMER do DR-skillach
- Wszystkie 16 plików `dr-*/SKILL.md` otrzymały sekcję `## ⚖️ DISCLAIMER (obowiązkowy)` z wywołaniem `view shared/DISCLAIMER.md`

#### Wyłączono prompt-master z routingu prawnego
- `prompt-master/SKILL.md`: dodano `routing-exclude: prawny-router-v3`

*Aktualizacja DEPENDENCY-GRAPH: 2026-06-09*


## DOSTEP-MASZYNOWY-API.md (przeniesione 2026-10-04n)

> **Wersja poprzednia:** 1.10 (2026-09-26, F-201) — §2: struktura HTML ELI (obwieszczenie: część 1 = przepisy ustaw zmieniających, część 2 = tekst jednolity; jednostki `data-id`) i narzędzie `tools/eli_art_extract.py`; najnowszy t.j. bez HTML → odczyt PDF przed ✅.

> **Wersja poprzednia:** 1.9 (2026-09-23c) — §0 przepisana: ZASADA INNEJ DROGI — robots.txt i blokada jednego narzędzia nie przesądzają; granice: logowanie, licencja, CAPTCHA, zabezpieczenia, masowe pobieranie.

> **Wersja poprzednia:** 1.8 (2026-09-23)

> **Wersja poprzednia:** 1.7 (2026-09-22) — §2: pole `entryIntoForce` w metadanych ELI podaje tylko termin GŁÓWNY; terminy etapowe wyłącznie z przepisu o wejściu w życie (F-193).

> **Wersja poprzednia:** 1.6 (2026-09-14) — CBOSA retrieval/snapshot: `site:` tylko discovery; obowiązkowy POST-CHECK HOSTA, exact-match i content_scope bez promocji snapshotu do DIRECT_LIVE.

> **Wersja poprzednia:** 1.5 (2026-09-14) — CBOSA: historyczny pomiar 503 oddzielony

> **Wersja poprzednia:** 1.4 (2026-09-13d) — §1: trzeci reżim UA (SAOS i cała rodzina

> **Wersja poprzednia:** 1.3 (2026-09-13c) — ponowny pomiar listy dozwolonych domen

> **Wersja poprzednia:** 1.2 (2026-09-13b) — §3: kanał zdegradowany CBOSA przez indeks

> **Wersja poprzednia:** 1.1 (2026-09-13) — §1: wyjątek `sn.pl` od reguły neutralnego UA

> **Wersja poprzednia:** 1.0 (2026-09-04c) — utworzony po wykryciu, że instrukcje dostępu


## HIERARCHIA-ZRODEL.md (przeniesione 2026-10-04n)

## METRYCZKA PLIKU (wersje, status, konsumenci)

> **Plik:** `shared/HIERARCHIA-ZRODEL.md`
> **Wersja:** 1.11 (2026-09-23c) — E-3 uruchamia BRAK-AKTU (akt niepobieralny z RZĘDU 1: awaria serwera, timeout, blokada) — wtedy obowiązkowo; przy awarii ELI próba odczytu z ISAP.
> **Wersja poprzednia:** 1.10 (2026-09-23) — ⭐ KANON KOLEJNOŚCI E-1…E-5 dla aktów polskich: ELI pierwszy, ISAP wyłącznie adres dla człowieka, LEX/Legalis → ArsLege dopiero po porażce ELI w obu kanałach; reguła interpretacyjna „ISAP” w pozostałych plikach; RZĄD 1 przeuporządkowany.
> **Wersja poprzednia:** 1.9 (2026-09-14) — CBOSA: oddzielono provenance kanału (DIRECT_LIVE / CRAWLED_OR_INDEXED) od kanonicznego statusu weryfikacji; snapshot może nieść sentencję/uzasadnienie, ale nie tworzy piątego statusu i nie awansuje sam do ✅ [VER].
> **Wersja poprzednia:** 1.8 (2026-09-14) — RZĄD 2A orzecznictwa powiązany z kanonicznym
>              routingiem wykonawczym: SN / Portal Orzeczeń / CBOSA / SAOS.
>              Dla NSA/WSA direct CBOSA (formularz HTML + /doc/{ID}) jest
>              preferowany po fresh-probe; fallback indeksowy dopiero przy
>              niedostępności. Exact-match i fail-closed są obowiązkowe.
> **Wersja poprzednia:** 1.7 (2026-09-04) — REALIA DOSTĘPNOŚCI uzupełnione o wymogi
>              kształtu żądania w kanale kodu (F-157); potwierdzone API UODO
>              jako pierwszy maszynowy kanał orzeczniczy po stronie organu (F-158).
>              ⛔ Numer skorygowany z 1.6 na 1.7 — 1.6 była już zajęta przez
>              wpis z 2026-09-01f; kolizja wykryta 2026-09-04c.
> **Wersja:** 1.6 (2026-09-01f) — uzupełnienie LUK PUBLIKATORÓW. RZĄD 1:
>              dodano Monitor Polski, Dziennik Ustaw RCL, dzienniki urzędowe
>              ministrów i urzędów centralnych oraz wojewódzkie dzienniki
>              urzędowe — jedyny publikator aktów prawa miejscowego, bez
>              którego DR-08 i DR-09 nie miały skąd wziąć brzmienia uchwały
>              czy planu miejscowego. RZĄD 2A: interpretacje organów
>              (EUREKA, BIP GIP — art. 14b ustawy o PIP), rejestry urzędowe
>              i publikatory ogłoszeń (KRS, KRZ, EKW, CEIDG, REGON, SUDOP,
>              BZP) oraz materiały legislacyjne (RCL, druki sejmowe) —
>              te ostatnie z zakazem cytowania brzmienia.
> **Wersja:** 1.5 (2026-09-01c) — korekta sekcji REALIA DOSTĘPNOŚCI RZĘDU 1
>              (F-151): rozdzielono blokadę narzędzia od zakazu serwera,
>              dodano kolumnę kanału kodu, dopisano odesłanie do pułapki
>              `/text.html` (F-150) oraz nowy RZĄD 2A dla orzecznictwa
>              organów (UODO, KIO, UKE) z jawnym statusem dostępu.
> **Wersja:** 1.4 (2026-08-23) — dodano `eli.gov.pl` do RZĘDU 1 (nie było go
>              tam mimo urzędowego charakteru), sekcję REALIA DOSTĘPNOŚCI
>              RZĘDU 1 (moc źródła ≠ osiągalność źródła), zamknięcie
>              hierarchii statusów na czterech pozycjach oraz ostrzeżenie
>              o wersjach archiwalnych na portalach 2B. Wdrożone po analizie
>              przyczyn testu 3 pilotażu LEX MACHINA.
> **Wersja:** 1.3 (2026-07-24e) — dodano ZASADĘ OTWARTEJ LISTY w sekcji
>              Rzędu 3: brak wpisu domeny w tym pliku lub w
>              `PORTALE-BRANZOWE-RZAD-2B.md` nie blokuje cytowania —
>              rejestry są przykładowe/pomocnicze, nie zamkniętą listą
>              dopuszczonych źródeł. Na wyraźne polecenie użytkownika.
> **Wersja:** 1.2 (2026-07-24) — rozdzielono sekcję 3B na 3B-i
>              (nieustalone/inne wydawnictwo → Rząd 3) i 3B-ii
>              (jednoznacznie C.H.Beck/Wolters Kluwer w próbce →
>              Rząd 2B-równoważne, dziedziczony po marce wydawniczej już
>              uznanej w 2B przez legalis.pl/lex.pl), na uwagę
>              użytkownika. Dodano wymóg sprawdzenia aktualności wydania
>              względem nowelizacji (książka nie jest aktualizowana jak
>              portal).
> **Wersja:** 1.1 (2026-07-24) — dodano sekcję 3B: próbki/fragmenty
>              książek z księgarni cyfrowych (nexto.pl i analogiczne), na
>              wyraźne polecenie użytkownika. Odróżnia legalne, wydawniczo
>              udostępnione PRÓBKI (spis treści + fragment stron) od
>              flagi F-12 (pełne, nieautoryzowane pliki PDF) w
>              `audyt-systemu-v4/references/WARN-OTWARTE.md`.
> **Wersja:** 1.0 (2026-07-15) — wydzielone z `analizator-przepisow-v2/SKILL.md`
>              (Moduł 1, sekcja "Hierarchia źródeł") na kanoniczną lokalizację
>              współdzieloną, na wyraźne polecenie użytkownika po tym, jak
>              w rozmowie ujawniono, że kategoryzacja obowiązywała TYLKO
>              lokalnie w jednym skillu i nie była wymuszana przy linkach/
>              kotwicach generowanych poza tym skillem (np. w WERYFIKACJA-SLAD,
>              PRAWO-HARDGATE, dowolnym web_search poza kontekstem analizy
>              przepisu).
> **Status:** KANONICZNY — konsumenci: `analizator-przepisow-v2` (Moduł 1),
>              `shared/PRAWO-HARDGATE.md` (KROK 5/5A/5B, BRAMKA WTÓRNE-
>              ŹRÓDŁO-STOP), `shared/WERYFIKACJA-SLAD.md` (KOTWICA-TEKSTOWA,
>              tabela statusów śladu) — oraz KAŻDY inny skill/moduł, który
>              podaje użytkownikowi link/URL/kotwicę do źródła internetowego.
> **Zasada dedup:** to jest JEDYNA kanoniczna treść tej kategoryzacji.
>              Żaden inny plik nie powiela tej listy — odwołuje się tutaj.


## MOD-ATAK-NA-DOWOD.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.0.0 (2026-06-24) — Pierwsza wersja.
Przyczyna: system miał fragmentaryczne pokrycie ataku na dowody
  (MD3b §LEG-CONTRA-N dla zakazów, PREKLUZJA-DOWODOWA dla prekluzji,
  MP5 §5.2 dla ogólnej typologii). Brakowało: kompleksowej taksonomii
  12 wektorów, procedury ADIS (sekwencja ofensywna), SHIELD (szczepienie),
  specyfiki dowodów elektronicznych i integracji z pipeline pisma.
Źródła: KPC art. 227, 232-233, 235¹-², 243-257, 278-291 (Dz.U.2026.468);
  KPK art. 168a, 170, 174 (Dz.U.2026.490); SN III CSK 253/13;
  FindLaw Documentary Evidence 2024; Garner/Scalia Making Your Case;
  inwestum.pl art.170 KPK 2025; adwokat-sechman.pl 2023;
  FRE 401-403, 801-807, 901-903 (US porównawcze);
  USCOURTS FRE 901(c) deepfake proposal 2025.
12 wektorów: AD-1 autentyczność, AD-2 custody, AD-3 relewantność,
  AD-4 forma/oryginał, AD-5 zakaz ustawowy, AD-6 wiarygodność treści,
  AD-7 zakres wniosku, AD-8 prekluzja, AD-9 kontrdowód aktywny,
  AD-10 cyfrowe, AD-11 jednostronne, AD-12 systemowy.
Procedury: ADIS (ofensywna, 5 kroków), SHIELD (obronna, 6 kroków).
Specyfika: DR-02/03/04/05.
```


## MOD-ATAK-NA-DRAFT.md (przeniesione 2026-10-04n)

## 8. Historia zmian

```
1.1.0 (2026-06-21) — Dodano krok D5: analiza własnych słabości i ryzyk
                      prawnych (RP), dowodowych (RD) i procesowych (RPC).
                      D5 wypełnia lukę między D2 (atak przeciwnika) a D4
                      (luki dowodowe): patrzy oczami WŁASNEJ STRONY i SĄDU,
                      nie pełnomocnika pozwanej. Zaktualizowano RAPORT D
                      o sekcję D5. Zaktualizowano sekwencję w integracji
                      (D1→D2→D3→D5→D4). Zaktualizowano SKILL.md
                      pisma-procesowe-v3 W2.4 o krok D5.
                      Naprawa ZASADY 7: dostarczono pełne ZIPy obu skilli
                      (pisma-procesowe-v3 + shared) zamiast luźnych plików.

1.0.0 (2026-06-21) — Pierwsza wersja. Utworzony po wykryciu błędu: krok W2.4
                      był opisany w pisma-procesowe-v3/SKILL.md (linia 569-589)
                      ale plik kanoniczny nie istniał w shared/ — co powodowało
                      pominięcie kroku przez model bez sygnalizacji błędu.
                      Root cause: odesłanie do nieistniejącego pliku nie powoduje
                      błędu wykonania, tylko ciche pominięcie view().
                      Naprawa: (1) utworzenie tego pliku, (2) wzmocnienie ZAKAZU
                      w SKILL.md W2.4 z explicit linią blokującą przejście do W3.
```


## MOD-ATAK-NA-SWIADKA.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.1.0 (2026-07-02) — NAPRAWA WARN-22 (rozbieżność struktury vs CHECKLIST-DEDUP)
Przyczyna: CHECKLIST-DEDUP (wpisy z sesji 2026-06-24) odwoływał się do sekcji
  "§CZĘŚĆ I-IV" i techniki "TA-1..TA-9", które NIE istniały w treści pliku
  (struktura faktyczna: FAZA 0-5 / SW-A1..SW-A8) — wykryte podczas targeted
  audytu dr-02 (sesja 2026-07-02, wzmocnienie mod-KRO-rodzinne o świadków
  rozwodowych).
Naprawa: dodano FAZA 6 — SPECYFIKA DZIEDZINOWA PER DR (poglądowa), zgodnie
  z pierwotnym zamysłem wpisu CHECKLIST-DEDUP ("specyfika ataku na świadka/
  biegłego per dziedzina DR-02/03/04/05"). DR-02 ma pełne rozwinięcie
  (pointer do mod-KRO-rodzinne.md S1-S4, dodane 2026-07-02); DR-03/04/05
  mają wyłącznie treść poglądową (2-3 sygnały) + jawne oznaczenie
  "DO OPRACOWANIA" — pełne moduły dziedzinowe są zadaniem na przyszłe sesje,
  gdy dana dziedzina będzie aktywna (zgodnie z wnioskiem z AUDYT-2026-06-24d).
  Dodano też SELF-CHECK: pozycja FAZA 6.
CHECKLIST-DEDUP zaktualizowany równolegle (4 wiersze — patrz audyt-systemu-v4).
Nie zmieniono FAZ 0-5 — treść merytoryczna SW-A1..SW-A8/AC1-AC4 bez zmian.

1.0.1 (2026-06-24) — NAPRAWA CRIT (art. 258 KPC UCHYLONY) + korekta art. 266/271
  (1) SW-W2: art. 258 KPC uchylony 23.04.2026 → zastąpiony art. 235² §1 KPC
      (VER: lexlege.pl, Dz.U.2026.0.468, 24.06.2026)
  (2) SW-A4: błędne powołanie art. 266 §1 KPC jako "zeznawanie o faktach" →
      poprawiono na art. 271 §1 KPC (swobodna relacja spostrzeżeń świadka)
  (3) Nagłówek: dodano weryfikację per artykuł ✅/❌
  (4) SW-TARCZKA: wzmocniono opis art. 233 §1 KK + pointer do art. 266 §1 KPC
Weryfikacja online (24.06.2026): art. 248 ✅ · 261 ✅ · 266 ✅ · 271 ✅ · 272 ✅
  art. 258 ❌ UCHYLONY · art. 233 KK ✅ · art. 235² §1 KPC ✅

1.0.0 (2026-06-24)
Przyczyna: Sprawa VII P 94/25 — pismo procesowe rozszerzające pozew
zawierało zeznania świadka Nawrota jako ogniwo BASE dla premii PFRON
(1.000 zł/m-c), ale pismo nie zawierało:
  (1) antycypacji ataków na wiarygodność świadka
  (2) sekcji wzmacniającej wartość dowodową zeznań (SW-TARCZKA)
  (3) wektora SW-A2 (zaprzeczenie przez SUDOP — który był dowodem)
  (4) wniosku SW-W2 (o wezwanie Yurii Kast na potwierdzenie)
Luka: brak procedury analizy ogniw zeznaniowych w łańcuchu dowodowym.
Integracje:
  pisma-procesowe-v3 W1.2c-LANCUCH (ŁD-3 EQG) — SW-DETECT
  pisma-procesowe-v3 W2.4 — W2.4c (nowe rozszerzenie)
  pisma-procesowe-v3 ZAKAZ-13 (nowy)
  MOD-LANCUCH-DOWODOWY §ŁB-1 — ogniwo BASE kl.D zeznanie
  przesluchanie-swiadkow-v2-min90 — SW-W3 output
```


## MOD-DOKUMENT-ANOMALIE_v1.1.0.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.0.0 (2026-06-23)
Przyczyna: analiza porównawcza z konkurencyjnym systemem AI (sprawa VII P 94/25).
Konkurencja wykryła: (1) REGON 14-cyfrowy w umowach HPG, (2) KRS/NIP cross-contamination
w umowach 3-5, (3) rozbieżność adresu powoda Azot 21/31 vs 2A/31.
Żadna z tych anomalii nie była wykryta przez system przed tym modułem.
Efekt procesowy: każda anomalia Klasy I to gotowy argument "błąd pracodawcy nie szkodzi
pracownikowi" — wbudowany w uzasadnienie pisma.
```


## MOD-FSL-DOKUMENTY.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.0.0 (2026-06-27)
Przyczyna: analiza błędów sprawa VII P 94/25 (sesja 2026-06-27):
  Root cause zidentyfikowany przez dewelopera:
  (1) SD-VER = KOMPLET (wszystkie pliki odczytane) — ale macierz D×T
      budowana z pamięci, nie z per-teza przeszukania SD-FAKTY.
      Skutek: teza gotowości do pracy → 1 dowód zamiast 4.
      Teza pracodawcy faktycznego → argumenty ogólne zamiast konkretnych
      wierszy z XLSX i zrzutów ekranu.
  (2) Nazwy plików mylące (Szef.odt, Zatrudnienie.odt) — model
      pomijał je w skanowaniu per-teza bo „intuicyjnie" nie pasowały
      do treści tezy.
  (3) Brak FSL-D jako gate między SD-VER a macierzą D×T — luźna
      reguła „sprawdź SD-FAKTY" nieskuteczna bez hard gate.

  Rozwiązanie:
  - Nowy hard gate FSL-D-SCAN wymusza per-teza przejście przez
    WSZYSTKIE D[id] niezależnie od nazwy
  - ZAKAZ CYTOWANIA Z PAMIĘCI dla faktów (analogia do FACT-SOURCE-LOCK
    dla przepisów) — każde twierdzenie faktyczne musi mieć D[id]+lok.
  - REGUŁA-NAZWA-PLIKU-MYLĄCA: zakaz wnioskowania z nazwy
  - REGUŁA-ORPHAN-D: pliki nieużyte = kandydaci na nowe tezy
  - Blokada .docx gdy ⬛ FSL-D-LUKA 🔴/🟠 bez decyzji użytkownika

  Wzorzec projektowy: FSL-D jest dla FAKTÓW tym, czym FACT-SOURCE-LOCK
  jest dla PRZEPISÓW i czym MOD-SKAN-DOWODOW-KOMPLETNY jest dla STRON.
  Trzy poziomy gwarancji kompletności:
    L1 (strony):    SD-KOMPLETNY   — czy 100% stron odczytano?
    L2 (tezy):      FSL-D (TEN)    — czy 100% tez ma źródło w plikach?
    L3 (przepisy):  FACT-SRC-LOCK  — czy 100% przepisów zweryfikowano?
```


## MOD-IDENTYFIKACJA-STRONY-UMOWY.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.1.0 (2026-06-27) — Dodano algorytm ISU-PESEL (P1-P6): weryfikacja PESEL przez format, dekodowanie daty urodzenia z uwzględnieniem wszystkich stuleci, dekodowanie płci (P10), suma kontrolna wagowa [1,3,7,9,1,3,7,9,1,3], raport ERR-F/ERR-D/ERR-PL/ERR-CK z klasyfikacją anomalii Klasa I/III. Przykład obliczeniowy dla PESEL YYMMDDSSSSC.

1.0.0 (2026-06-27) — Pierwsza wersja. Wydzielono z WARSTWA 0 modułu
  MOD-PRACODAWCA-RZECZYWISTY v2.1.0 (WARN-19) w odpowiedzi na propozycję
  dewelopera: mechanika danych większościowych jest bardziej universalna niż
  pracodawca rzeczywisty i powinna działać na wszystkich typach dokumentów
  i postępowań, nie tylko pracowniczych.
  Zakres: umowy o pracę, B2B, faktury VAT, polisy, zamówienia, pisma procesowe.
  Nowe: katalog EL-PODMIOT/EL-OSOBA/EL-FAKTURA (10+7+8 elementów z wagami),
  procedura ISU-1–ISU-5, 3 sytuacje szczególne, mapa zastosowań.
  Integracja: pisma-procesowe-v3, analizator-umow-v1, analizator-dowodow-v3,
  PRE-W2-VERIFICATION-GATE, MOD-DOKUMENT-ANOMALIE, MOD-PRACODAWCA-RZECZYWISTY.
  WARN-19 zamknięty przez ten plik.
```


## MOD-LANCUCH-DOWODOWY.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.0.0 (2026-06-24) — Pierwsza wersja.
Przyczyna: system miał fragmentaryczne pokrycie łańcucha:
  MOD-DOWODY D2 (prosty schemat A→B→wniosek), MOD-POSZLAKI-KONTEKST
  (poszlaki L-X bez architektury budowy i ataku), MOD-ATAK-NA-DOWOD
  §AD-12 SY (atak systemowy bez procedury łańcucha).
Luki wypełnione: 5 typów łańcuchów (ŁB-3), 4 typy ogniw (ŁB-1),
  schemat ŁD-n (ŁB-2), BRAMKA EQG (ŁB-5), 4 strategie ataku ŁA-1..ŁA-4,
  schemat sekcji w piśmie (CZĘŚĆ III), pipeline ŁD-1..ŁD-7.
Źródła: KPC art. 231, 233; MOD-POSZLAKI-KONTEKST (istniejący);
  MacCarthy §12 (atak na najsłabsze ogniwo); Garner/Scalia §27 (łańcuch
  argumentacji); MOD-NEGACJA §N2 (odporność ogniwa); MOD-ATAK-NA-DOWOD
  SHIELD (szczepienie); MOD-PROWENIENCJA §PR2 (triangulacja P+).
```


## MOD-MACIERZ-DOWOD-TEZA.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.1.0 (2026-06-26)
Przyczyna: analiza błędów sprawa VII P 94/25 (sesja 2026-06-26):
  (1) Macierz D×T budowana poprawnie — ale jej wyniki NIE trafiały do treści pisma.
      Wynik: pismo powołuje 5 z 18+ dowodów, uzasadnienie ma 4 sekcje dla 8+ tez.
  (2) N_pismo << N_macierz bez żadnego alertu systemowego.
  (3) Brak triggera proporcjonalności uzasadnienia.
Naprawy:
  + MT5-MANDATE-ALL-EVIDENCE: cross-check dowodów macierzy vs powołanych w piśmie
    (próg: 70% — przy niższym → alert + zapytanie użytkownika + blokada .docx)
  + MT5-PROPORCJONALNOSC: sekcje uzasadnienia ≥ liczba tez; uzupełnij przed W3
  + Self-check uzupełniony o oba nowe kroki

1.0.0 (2026-06-21) — Pierwsza wersja.
Przyczyna: identyfikacja luki systemowej — żaden istniejący moduł nie wykonywał
skanu KAŻDY DOWÓD → WSZYSTKIE TEZY równocześnie. MOD-SELEKCJA-DOWODOW działa
w kierunku Teza→Dowód i jest późniejszy w pipeline (po ustaleniu tez).
Ten moduł jest wcześniejszy i komplementarny: skanuje dowody bi-directionally,
buduje trwałą macierz D×T z klasami K/R/W/RK, identyfikuje dowody wielofunkcyjne
i luki, zanim W1.3 zostanie wypełnione.
Przykład z VII P 94/25: wiadomość RCS Prezesa Parka z 21.03.2026 obsługuje 3 tezy
jednocześnie (T1, T2, T5) i była w dowodach od początku — bez macierzy model
przypisał ją tylko do T2 (gotowość do pracy), pomijając wartość dla T1 i T5.
```

## CHANGELOG

**1.2.0 (2026-06-26) — NAPRAWA: MT6 format sądowy + zakaz symboli w piśmie**

Root cause (sprawa VII P 94/25, sesja 2026-06-26):
Moduł definiował jeden format wyjściowy (symbole ●/★/[K]) bez rozróżnienia
między formatem roboczym (pipeline) a formatem sądowym (pismo procesowe).
Model kopiował symbole wewnętrzne do tabeli w piśmie, co tworzyło dokument
nieczytelny dla sędziego — bez wartości procesowej.

Naprawy:
1. Nowa sekcja MT6 — FORMAT SĄDOWY TABELI W PIŚMIE PROCESOWYM:
   - ZASADA DWÓCH WARSTW: warstwa wewnętrzna (MT1–MT5, symbole) vs
     warstwa sądowa (MT6, tabela czytelna dla prawnika i sędziego)
   - Obowiązkowe kolumny: Lp. | Dowód | Lokalizacja w aktach |
     Roszczenie | Na okoliczność
   - Obowiązkowe: str./zał./godz. w kolumnie "Lokalizacja w aktach"
   - Decyzje o ograniczeniu dowodu (dawne RK): prozą pod tabelą, bez kodów
   - Katalog zakazu: ●/★/[K]/[W]/[RK]/PKR%/RF/RS i inne — nigdy w piśmie

2. Szablon szybki oznaczony explicite jako FORMAT ROBOCZY (nie sądowy).

3. SELF-CHECK: 4 nowe pytania MT6.

**1.1.0 (2026-06-21) — MT5-MANDATE-ALL-EVIDENCE, MT5-PROPORCJONALNOSC**


## MOD-NEGACJA-DOWODOW.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.0.0 (2026-06-24) — Pierwsza wersja.
Źródła: art. 6 KC, art. 229-234 KPC, art. 233 §2 KPC (Dz.U. 2026 poz. 468).
Linia orzecznicza: SN IV CSK 669/15; I BP 6/14; II CSK 621/13; SA Katowice
I ACa 677/14; SAOS IX GC 292/20; SA Lublin I ACa 206/20.
Porównawcze: probatio diabolica (CC fr. art. 1353); FRCP 37(e) spoliation.
12 technik negacji (N1-N12): gołosłowne zaprzeczenie, twierdzenie o nieistnieniu
faktu pozytywnego, twierdzenie o nieistnieniu elementu prawnego, ogólnikowe
zaprzeczenie, atak na autentyczność, odmowa przedłożenia dokumentu, zarzut
braku formy, atak na świadka, zarzut prekluzji, cherry-picking, antycypacja
zarzutu przez immunizację, spoliation.
Integracja: BLOK-NEGACJA w analizator-dowodow-v3 (auto-trigger); MP4 §4.3
(typ N1-N12 per atak); RAPORT D §D2 (riposta minimalna); MOD-MACIERZ-DOWOD-TEZA
(luki → podatność na N-techniki); BLOK-PROWENIENCJA P! → N5 autowyzwalacz.
```


## MOD-PORCJOWANIE-DOWODOW.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.0.0 (2026-06-21) — Pierwsza wersja.
Przyczyna: brak jakiegokolwiek mechanizmu zarządzania oknem kontekstowym
wewnątrz sesji przy dużych zbiorach dowodów. Model mógł rozpocząć analizę
dużego materiału (np. ZIP z 35 plikami) i urwać bez ostrzeżenia gdy kontekst
się wypełnił — tracąc wszystkie wyniki częściowej analizy.
Istniejący MOD-KONTEKST-SESJI działa między sesjami (export/import stanu),
nie wewnątrz sesji. Ten moduł wypełnia tę lukę przez profilaktyczne
szacowanie rozmiaru materiału przed analizą i podział na partie z protokołem
checkpointów i wznawiania.
Przykład triggera: ZIP z 35 plikami (9.5 MB) — sesja VII P 94/25 —
model przeanalizował go bez podziału, ryzykując utratę wyników.
Przy STATUS KRYTYCZNE (≥30 plików) moduł wymusiłby podział na ~9 partii
po 4 pliki, z 8 checkpointami między partiami.
```


## MOD-POSZLAKI-KONTEKST.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.0.0 (2026-06-23) — Pierwsza wersja. Moduł uniwersalny.
Przyczyna: analiza porównawcza pisma generowanego (AI) vs pisma poprawionego
przez użytkownika w sprawie VII P 94/25 — wersja poprawiona zawierała:
(1) tabele graniczne HP→HPG z konkretnymi datami i kandydatami,
(2) walory procesowe 1/2/3 dla osobistego aktu Prezesa,
(3) antycypację zarzutów w 4 miejscach uzasadnienia,
(4) ścieżkę alternatywną art. 23¹ KP + art. 25¹ §3 KP,
(5) walor "przyznania" z dokumentów złożonych przez pozwaną.
System wydobywał tylko Warstwę 1. Ten moduł wymusza Warstwy 2 i 3.
Charakter: UNIWERSALNY — nie ograniczony do spraw pracowniczych.
```


## MOD-PROWENIENCJA-DOWODOW.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.0.0 (2026-06-24) — Pierwsza wersja.
Przyczyna: system nie miał mechanizmu wykrywania wspólnego źródła i proweniencji
dowodów. MET-NET (MOD-METODY-BADAWCZE) mapuje relacje podmiotów, nie
łańcuchy źródłowe dokumentów. MP6-sledczy (analizator-dowodow-v3) zawiera
OSINT i HUMINT, ale bez systematycznej taksonomii typów proweniencji i procedury
skanowania par D-NNN. Moduł implementuje DTA Warstwę 4 (Pochodzenie faktu) jako
standard systemowy dostępny dla analizatora, pism procesowych i MP6.
Taksonomia: 7 typów (SYS/KOM/ZAW/AUT/URZ/LIN/CHAIN), 4 klasy konsekwencji
(P+/P-/P0/P!), procedura PR1-PR5 z integracją DTA-ID-MODE i BLOK-KONSEKWENCJE.
```


## MOD-REJESTR-POKRYCIA-JEDNOSTEK.md (przeniesione 2026-10-04n)

## CHANGELOG

**1.0.0 (2026-08-18):** Utworzenie modułu w odpowiedzi na incydent
pominięcia kazusów 100, 140, 148 (i potencjalnie innych, niezidentyfikowanych)
w sesji 160-kazusowej. Zarejestrowany w `shared/SKILL.md`.


## MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.0.0 (2026-07-12, aktualizacja integracji 2026-07-14)
Przyczyna: sprawa XI P 27/26, świadek [ŚWIADEK-K] — moduł istniał od
  utworzenia (poniżej), ale w przesluchanie-swiadkow-v2-min90 nie był
  deklarowaną zależnością required, więc uruchamiał się wyłącznie
  reaktywnie (na wprost zadane pytanie użytkownika), a nie proaktywnie
  w pierwszej odpowiedzi po wgraniu dowodów. Model przedstawił
  tezy/pytania oparte na 7 z 23 plików bez zasygnalizowania braków.
Naprawa (2026-07-14): przesluchanie-swiadkow-v2-min90 — dodano ten
  moduł do dependencies.required, dodano RZ-SHOW-GATE do
  validation.required_gates, dodano jawny etap pipeline
  PRE-W1a.4-RZ-SHOW wykonywany BEZPOŚREDNIO po SD-VER i PRZED profilem
  świadka, w KAŻDEJ turze z dowodami — nie tylko na żądanie
  użytkownika. Wersja modułu pozostawiona bez zmian (1.0.0) — zmianie
  uległo wyłącznie wpięcie zależności w skillu nadrzędnym, nie treść
  merytoryczna samego modułu. Zob. changelog przesluchanie-swiadkow-v2-min90.

1.0.0 (2026-07-12)
Przyczyna: sprawa XI P 27/26 — model sprawdził materiał wybiórczo
  i nie zasygnalizował tego użytkownikowi; braki (w tym 2 kluczowe
  zrzuty WhatsApp) wyszły na jaw dopiero po pytaniu kontrolnym
  użytkownika. Utworzono na wyraźne polecenie użytkownika.
Zakres: nowy moduł, komplementarny do MOD-SKAN-DOWODOW-KOMPLETNY —
  ten moduł odpowiada za WIDOCZNOŚĆ i ZGODĘ UŻYTKOWNIKA na etapowanie,
  SD-KOMPLETNY za samą metodologię odczytu.
```


## MOD-SKAN-DOWODOW-KOMPLETNY.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.6.0 (2026-07-15)
Przyczyna: flaga F-12 (otwarta w AUDYT-2026-07-14b pkt 3) — plik .odt
  (68 415 znaków) odczytany fragmentarycznie (~17,5% treści) metodą
  ręcznego wycinania zakresu znaków w kodzie, BEZ żadnej adnotacji
  narzędzia o obcięciu. SD-GATE-TRUNC (v1.5.0) nie adresował tego
  przypadku, bo działa wyłącznie na aktywnym sygnale narzędzia `view`
  (`< truncated lines X-Y >`) — tu takiego sygnału nie było, model po
  prostu przestał czytać i uznał próbkę za reprezentatywną.
Naprawa: (1) dodano KROK SD-READ.1b — nową uniwersalną bramkę SD-GATE-PORCJA
  (FAZA 2), obowiązującą dla KAŻDEGO pliku o wyodrębnionej treści >3000
  znaków, niezależnie od metody ekstrakcji; wymaga jawnego licznika
  "przeczytano X/Y znaków" i zakazuje ekstrakcji faktów dopóki X<Y bez
  jawnego uzasadnienia w SD-REJ; (2) rozszerzono blok [ODT] o wymóg pełnej
  analizy tekstu z content.xml, gdy jest on istotny (nie tylko fallback na
  obrazy); (3) rozszerzono SD-VER.1 (FAZA 3) o warunek SD-GATE-PORCJA;
  (4) dodano REGUŁA-PORCJOWANIA-DLUGICH-PLIKOW w sekcji REGUŁY SZCZEGÓLNE,
  z jawnym rozróżnieniem od REGUŁA-TRUNCATION-VIEW (sygnał aktywny narzędzia
  vs. brak jakiegokolwiek sygnału); (5) dodano pozycję SD-GATE-PORCJA do
  SELF-CHECK MODUŁU. Flaga F-12 zamknięta — patrz AUDIT-JOURNAL.md.

1.5.0 (2026-07-14)
Przyczyna: sprawa świadka Marii Korolevej, protokół rozprawy z 08.07.2026
  (XI P 27/26). Model odczytał plik tekstowy protokołu narzędziem `view` bez
  `view_range` — narzędzie zwróciło adnotację `< truncated lines 174-230 >`,
  obcinając środek pliku mimo jego niewielkiego rozmiaru (394-403 linii,
  ~14 KB). Model kontynuował analizę i budował tezy/pytania na podstawie
  pozostałej treści, NIGDY nie wracając do obciętego zakresu. Skutek: przez
  trzy kolejne tury pominięto niekwestionowane przez stronę pozwaną zeznanie
  o wiadomości WhatsApp wysłanej do kilkuset pracowników 28.09.2024 — fakt,
  który użytkownik samodzielnie zidentyfikował w porównywanym dokumencie
  zewnętrznym (Pytania_dla_Marii.docx, Blok 4) i o którym model dowiedział
  się dopiero po wyraźnym poleceniu ponownego zbadania protokołów.
  Osobny, analogiczny incydent w tej samej sesji: plik .odt (68 415 znaków)
  odczytany fragmentarycznie (~17,5%) bez żadnej adnotacji narzędzia — to
  inny mechanizm (przerwana lektura długiego pliku, nie obcięcie przez
  narzędzie) i NIE jest przedmiotem tej poprawki; wymaga osobnej reguły
  (patrz ZASADA-PORCJOWANIA-DLUGICH-PLIKOW, do rozważenia w kolejnej sesji).
Naprawa: (1) dodano do FAZA 2 (SD-READ) nowy typ pliku "[PLIK TEKSTOWY
  odczytywany narzędziem `view`]" z bramką SD-GATE-TRUNC — obowiązkowe
  dodatkowe wywołanie `view` z jawnym `view_range` na każdy zgłoszony zakres
  obcięcia, PRZED ekstrakcją faktów; (2) rozszerzono SD-VER.1 (FAZA 3) o
  warunek braku nierozwiązanych znaczników obcięcia; (3) dodano
  REGUŁA-TRUNCATION-VIEW w sekcji REGUŁY SZCZEGÓLNE; (4) dodano pozycję
  SD-GATE-TRUNC do SELF-CHECK MODUŁU.

1.4.0 (2026-07-11)
Przyczyna: sprawa świadka Marii Korolevej — model zbudował trzy tezy
  i pytania przesłuchania wyłącznie na plikach tekstowych + 1 zrasteryzowanym
  dokumencie, pomijając 130 stron trzech dużych zeskanowanych plików akt
  osobowych (dependencies.required tego modułu w przesluchanie-swiadkow-v2-min90
  było tylko POŚREDNIE, przez analizator-dowodow — pomijalne). Dodatkowo
  model pomylił odręczny, przekreślony dopisek pracownika na upomnieniu
  z odrębną "notatką służbową", której istnienia nie zweryfikował w materiale.
Naprawa:
  + Dodano przesluchanie-swiadkow-v2-min90 jako integrację BEZPOŚREDNIĄ
    (PRE-W1a-SD-VER), nie tylko przez analizator-dowodow.
  + REGUŁA-DOKUMENT-WZMIANKOWANY-NIEODNALEZIONY: generalizacja obowiązku
    oznaczania dokumentów wzmiankowanych, ale fizycznie nieobecnych
    w materiale, jako "⬛ DO WERYFIKACJI" — z zakazem utożsamiania ich
    z innymi, fizycznie obecnymi dokumentami o zbliżonej funkcji.

1.3.0 (2026-06-27)
Przyczyna: analiza błędów sprawa VII P 94/25 (sesja 2026-06-27):
  SD-VER = KOMPLET ale macierz D×T budowana z pamięci — nie z per-teza
  przeszukania SD-FAKTY. Pliki o mylących nazwach (Szef.odt, Zatrudnienie.odt)
  pomijane w skanowaniu tez bo „intuicyjnie nie pasowały".
Naprawa:
  + FAZA 4 SD-GATE-4: zamiast „Przekaż SD-FAKTY do W1.3" → obowiązkowe
    wywołanie MOD-FSL-DOKUMENTY.md (FSL-D) które wykonuje per-teza
    przeszukanie WSZYSTKICH D[id] z zakazem cytowania z pamięci.
  + Dopiero FSL-D-MACIERZ (nie SD-FAKTY) trafia do macierzy D×T.
  + Nowy plik: shared/MOD-FSL-DOKUMENTY.md (v1.0.0)
  + Zmieniono pointer: SD-FAKTY → MOD-FSL-DOKUMENTY → FSL-D-MACIERZ → W1.3

1.2.0 (2026-06-26)
Przyczyna: analiza błędów sprawa VII P 94/25 (sesja 2026-06-26):
  (1) Pismo procesowe zawierało tylko 5 z 18+ kategorii dowodowych.
  (2) Pisma procesowe powoda (riposta, pismo 12.05.2026) zawierają
      co najmniej 6 wątków prawnych (mobbing, zakaz konkurencji,
      fałszywe zeznania, sprawa VIII W 633/25, roszczenie z EuroRwa)
      — całkowicie pominiętych w generowanym piśmie.
  (3) Tabele XLSX (arkusz "Yurii Nepal") zawierały kwoty opłat
      (500 zł work permit + 2000 zł wiza) — kluczowe dla roszczenia
      o zwrot kosztów — nieodczytane.
  (4) SD-ORPHAN: fakty z SD-FAKTY nie były przypisywane do tez.
Naprawy:
  + REGUŁA-PISMA-PROCESOWE-STRONY: obowiązkowy skan wątków prawnych
    z każdego pisma procesowego strony — wykrywanie nowych roszczeń
  + REGUŁA-ORPHAN-TEZA: loop po wszystkich SD-FAKTY szukający
    faktów nieprzypisanych do żadnej tezy → propozycja T_new

1.1.0 (2026-06-22)
...

1.0.0 (2026-06-22)
Przyczyna: analiza błędów krytycznych w sprawie VII P 94/25:
  (1) Pominięto odczyt obrazów z plików ODT (3 pliki × ~2-3 obrazy)
  (2) Nie wyekstrahowano zeznań Nawrota o premii PFRON z protokołu rozprawy
      → pismo wygenerowano z błędną kwotą roszczenia
  (3) Zakładki XLSX przeanalizowano wybiórczo (1/6 zakładek)
  (4) Brakujący mechanizm blokady gdy użytkownik mówi o załącznikach, ale
      ich nie wgrywa — model zaczął analizować na podstawie kontekstu z pamięci
Relacja z MOD-PORCJOWANIE-DOWODOW:
  PORCJOWANIE = zarządza rozmiarem (ile plików naraz w kontekście)
  TEN MODUŁ = zarządza kompletnością (czy odczytano 100% stron każdego pliku)
  Kolejność: SD-KOMPLETNY przed PORCJOWANIE.
Integrations:
  prawny-router-v3 KROK 0C-EXT
  pisma-procesowe-v3 W1.2c-PRE
  analizator-dowodow-v3 BLOK-B-EXT
```


## MOD-STEP-TRACKER.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.2.0 (2026-07-11)
Przyczyna: użytkownik zapytał wprost, czy analizator-dowodow-v3 nie powinien
  mieć tego samego mechanizmu nadzorczego co pisma-procesowe-v3 i
  przesluchanie-swiadkow-v2-min90. Analiza wykazała: skill miał już poprawnie
  wpiętą bramkę DOWODOWĄ (SD-VER, KROK 0b), ale ZERO integracji z tym
  modułem — żaden pominięty BLOK diagnostyczny (np. BLOK G/J przy A2=TAK
  w wieloetapowym routerze KROK 2/3) nie był raportowany użytkownikowi.
Naprawa:
  + Dodano 10 pozycji REJESTRU dla pipeline'u analizatora: AD-KROK0,
    AD-KROK0a, AD-KROK0b, AD-KROK1, AD-KROK2, AD-BLOKG, AD-BLOKJ, AD-BLOKH,
    AD-KROK3, AD-KROK4.
  + analizator-dowodow-v3/SKILL.md v5.13.0: nowy etap KROK 0c (ST-INIT) zaraz
    po SD-VER z KROK 0b, przed KROK 1; sekcja "Zakaz" (nieobecna wcześniej)
    z zakazem cichego pomijania obowiązkowych BLOK-ów; dodano formalne
    sekcje YAML dependencies/pipeline.stages/validation.required_gates
    (wcześniej całkowicie nieobecne w tym skillu).

1.1.0 (2026-07-11)
Przyczyna: przesluchanie-swiadkow-v2-min90 nie miało własnych pozycji w
  REJESTRZE KROKÓW ani twardej integracji z tym modułem — pipeline świadka
  (PRE-W1..W6) mógł być realizowany bez żadnego śledzenia pominięć, co
  ujawniło się przy pominięciu skanowania 130 stron akt osobowych świadka.
Naprawa:
  + Dodano 11 pozycji REJESTRU dla pipeline'u świadka: SW-PRE-W1a, SW-PRE-W1,
    SW-KROK0, SW-W1, SW-W1-SUPP, SW-W2, SW-CP-W2, SW-W3, SW-W4, SW-W5, SW-W6.
  + przesluchanie-swiadkow-v2-min90/SKILL.md: inicjalizacja REJESTRU w
    PRE-W1a.3, aktualizacja po każdym etapie zgodnie z FAZĄ 1 tego modułu.

1.0.1 (2026-06-25)
Przyczyna: Moduł był OSIEROCONY — istniał w shared/ i był wpięty tylko w
  pisma-procesowe-v3, ale prawny-router-v3 NIE wywoływał go w żadnym kroku
  (0 wzmianek STEP-TRACKER w routerze i jego SELF-CHECK). Skutek: gdy model
  wygenerował pismo bez wczytania PRIMARY-skilla pisma-procesowe-v3 (sprawa
  VII P 94/25, po poleceniu „kontynuuj"), nic nie wymusiło ST-INIT/ST-FINAL —
  pismo .docx dostarczono bez REJESTRU KROKÓW i bez raportu pominięć.
Naprawa (prawny-router-v3/SKILL.md):
  + KROK 0-ST (ST-INIT zaraz po HG-ACTIVE)
  + KROK 6-ST (ST-FINAL BLOKUJĄCY przed present_files, także bez pełnego pipeline)
  + reguła nadrzędna 11a (STEP-TRACKER + obowiązek wczytania PRIMARY-skilla)
  + BLOK-ST i pozycje w SELF-CHECK
Zasada: router (jedyny punkt wejścia) musi sam wymuszać STEP-TRACKER —
  poleganie wyłącznie na skillu downstream pozwala bugowi „pominiętego skilla"
  ominąć całą siatkę bezpieczeństwa.

1.0.0 (2026-06-24)
Przyczyna: Analiza błędów sprawa VII P 94/25 (2026-06-24):
  Model pominął 10+ obowiązkowych kroków bez informowania użytkownika.
  Pismo dostarczone bez CLAIM-VALIDATION, STRATEGIA-WYBOR, MACIERZ,
  PODMIOT-GATE, LEGAL-QUALITY-GATE, AUDYT-KOŃCOWY, PEER-REVIEW.
  Użytkownik otrzymał DRAFT bez wiedzy o brakach weryfikacji.
Zasada: każde pominięcie = obowiązek raportowania + czekanie na decyzję.
Integracje:
  prawny-router-v3 KROK 0 (ST-INIT)
  pisma-procesowe-v3 automat stanów (ST-TRACK)
  shared/MOD-SKAN-DOWODOW-KOMPLETNY.md (ST-REPORT w SD-VER)
```


## MOD-STRATEGIA-WYBOR.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.0.0 (2026-06-21) — Pierwsza wersja.
  Przyczyna: brak obligatoryjnego mechanizmu oceny i rankingu ścieżek przed
  wyborem jednej, zidentyfikowany w sesji VII P 94/25 (rozszerzenie powództwa).
  System posiadał: MOD-WARIANTY-POZWU (generowanie kart, warunkowo aktywowany),
  MOD-ATAK-NA-DRAFT (ocena po wyborze), MOD-RED-TEAM-WLASNY (ocena ram).
  Brakowało: spójnego pipeline'u który obligatoryjnie ocenia WSZYSTKIE ścieżki
  pod kątem ataku przeciwnika PRZED wyborem jednej, rankinguje je i rekomenduje
  najsilniejszą — z zasadą, że ścieżka z atakiem 🔴 bez kontrargumentu nie może
  być ścieżką główną.
  Powiązane naprawy w tej samej sesji: PRE-W2-VERIFICATION-GATE.md (weryfikacja
  podmiotów przed W2), aktualizacje SKILL.md pisma-procesowe-v3 i prawny-router-v3.
```


## MOD-WYJATEK-GATE.md (przeniesione 2026-10-04n)

## 10. HISTORIA NAZWY

Wersja 1.0 nosiła nazwę `MOD-UNIT-SWEEP.md` i miała jedno zamiatanie
(sąsiedztwo redakcyjne). Nazwa opisywała **czynność**, nie cel, przez co
mechanizm wyglądał na wąską sztuczkę zamiast na regułę ogólną — i faktycznie
pokrywał tylko jedno z czterech miejsc, w których mieszkają wyjątki. Zmiana
nazwy i zakresu nastąpiła na uwagę użytkownika w tej samej sesji, przed
pierwszym użyciem produkcyjnym. Plik `MOD-UNIT-SWEEP.md` NIE pozostaje
w bibliotece — dwie nazwy tego samego mechanizmu to klasa błędu opisana
w `shared/DEDUPLICATION-POLICY.md`.


## PRE-W2-VERIFICATION-GATE.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
1.4.0 (2026-06-27) — ISU-first: MOD-IDENTYFIKACJA-STRONY-UMOWY wywołany przed MOD-PRACODAWCA-RZECZYWISTY:
  Root cause nowej naprawy: PRE-W2.C/D wykrywały rozbieżność podmiotową i
  zatrzymywały pipeline (GATE-STOP), ale NIE wywoływały modułu budującego
  argument prawny. Skutek: pismo VII P 94/25 v3 opierało tezę 1 na argumencie
  "ten sam KRS we wszystkich umowach" — obalonym przez "literówkę".
  Naprawy:
  (1) PRE-W2.C §SZCZEGÓLNA REGUŁA: dodano ⛔ TRIGGER MOD-PRACODAWCA-RZECZYWISTY
      z ZAKAZEM-R1 (zakaz argumentu "ten sam KRS" gdy KRS błędny) i przykładem VII P 94/25.
  (2) PRE-W2.D §POV-D-TRIGGER: dodano [MOD-PRACODAWCA-TRIGGER] — po wykryciu
      rozbieżności NATYCHMIAST view MOD-PRACODAWCA-RZECZYWISTY + R1→R5.
  (3) Historia wersji zaktualizowana.

1.2.0 (2026-06-26) — Nowy krok PRE-W2.0: STATUS-LIFECYCLE podmiotów:
  Dodano mechanizm obowiązkowego oznaczania podmiotów statusem ⬛ [DO WERYFIKACJI]
  od chwili napotkania w materiałach dowodowych aż do faktycznej weryfikacji online.
  Nowe: STATUS-LIFECYCLE (⬛→✅/⚠️/⛔), WYJĄTKI (osoby prywatne), KONSEKWENCJE,
  PODMIOTY WYMAGAJĄCE OZNACZENIA, PRZEPŁYW W SESJI (1-5 kroków).
  Wyjątki: imię/nazwisko/adres/PESEL osoby fizycznej — NIE oznaczaj statusem ⬛.
  Wpływ na router: KROK 0D, SELF-CHECK blok STATUS PODMIOTÓW, R0D w STEP-TRACKER.
  Wpływ na pisma-procesowe: SELF-CHECK-PISMA — blok STATUS PODMIOTÓW.

1.1.0 (2026-06-26) — Naprawa root cause sesji VII P 94/25 (2026-06-26):
  Problem: model traktował dane KRS/NIP z akt sprawy (umów) jako zweryfikowane.
  Skutek: w piśmie wpisano KRS 0000796445 przy Human Park Global sp. z o.o.,
          podczas gdy HPG ma KRS 0001025052 — błąd z umów pracodawcy skopiowany
          do pisma procesowego powoda.
  Naprawy:
  (1) PRE-W2.C: dodano explicite zasadę "dane z akt ≠ zweryfikowane"
      z przykładem błędu i wyjaśnieniem mechanizmu pułapki
  (2) PRE-W2.D: dodano [POV-D-TRIGGER] — automatyczne uruchomienie przy ≥2
      różnych numerach KRS/NIP dla zbliżonej nazwy; nie wymaga jawnej sprzeczności
  Wpływ na router: SKILL.md prawny-router-v3 — SELF-CHECK blok POV-B/C/D
                   i reguła nadrzędna 18 zaktualizowane.

1.0.0 (2026-06-21) — Pierwsza wersja.
  Przyczyna: błędy krytyczne w piśmie procesowym VII P 94/25:
  (1) Adres sądu z pamięci modelu (ul. Lompy 14 / SR Katowice-Wschód zamiast
      ul. Warszawska 45 / SR Katowice-Zachód VII Wydział Pracy).
  (2) Argument prawny "ten sam KRS" zbudowany bez sprawdzenia rejestru;
      KRS 0000796445 należy do HP sp. z o.o., nie do HP Global sp. z o.o.
      (KRS 0001025052) — co było widoczne z NIP-ów w aktach.
  Naprawa: przeniesienie weryfikacji podmiotów PRZED generowanie W2,
  jako oddzielny moduł z twardą bramką blokującą.
  Wpływ na SKILL.md: dodano wywołanie PRE-W2-GATE po checkpoincie W1→W2.
```


## SAMORZADY-ZAWODOWE-DOKUMENTY.md (przeniesione 2026-10-04n)

## CHANGELOG

**1.3 (2026-07-17):** Na żądanie użytkownika ("ok, zrób to i zbadaj czy
dentyści nie mają swojej rady"):
1. **IARP (architekci) potwierdzone** bezpośrednim fetch (`izbaarchitektow.pl`
   — bardzo aktywny, nowy KEZA od 1.01.2026) — **komplet 16/16 pozycji w
   rejestrze ma teraz status ✅ VER**.
2. **Zbadano status lekarzy dentystów** — dodano sekcję 3.1: dentyści NIE
   mają odrębnego samorządu, dzielą NIL z lekarzami (ustawa z 2009 r.),
   z proporcjonalną reprezentacją gwarantowaną na wszystkich szczeblach.
   Ustalono kontekst historyczny (odrębna Naczelna Izba Lekarsko-Dentystyczna
   1938-1952, zniesiona przez władze komunistyczne, NIE reaktywowana w
   1989 r.) oraz nadal żywy, choć osłabły, wewnętrzny spór o autonomię
   (Komisja Stomatologiczna, ok. 2020 r.).

**1.2 (2026-07-17):** Kontynuacja na żądanie użytkownika ("kontynuuj") —
dokończono rzeczywiste przeszukanie pozostałych portali. Wynik: **15 z 16
pozycji potwierdzone bezpośrednim fetch/search w tej sesji** (KRK, PIRP,
NIL, weterynaria, NIA, NIPiP, KIDL, KIF, KIDP, PIBR, PIIB — dodane do
wcześniej potwierdzonych NRA/KRRP/KRN). Konkretne uchwały, daty i numery
zebrane dla każdej pozycji (nie tylko nazwa domeny). **Jedyna pozostała
niepotwierdzona pozycja: IARP (architekci)** — jawnie oznaczona.

**Kluczowe odkrycie:** status samorządu zawodowego PSYCHOLOGÓW jest
niejednoznaczny — mimo ustawy z 2001 r., projekt zupełnie NOWEJ ustawy
(wersja rządowa 27.06.2024) przewiduje dopiero dotację na "rozpoczęcie
wykonywania obowiązków" przez samorząd — silna poszlaka, że przez >20 lat
nie był on w pełni operacyjny. To częściowo wyjaśnia (ale nie w pełni)
rozbieżność liczbową w źródłach (sekcja 1).

**Dodatkowa uwaga jakościowa:** dla NIA wykryto rozbieżność domeny
(`nia.org.pl` vs `nia.gov.pl` — oba używane w różnych materiałach) —
oznaczono do doprecyzowania, zamiast zignorować niespójność.

**1.1 (2026-07-17):** Na wyraźne żądanie użytkownika ("pytałem o regulaminy
i dokumenty... jak nra.pl/szukaj-dokumenty") — wykonano RZECZYWISTE
przeszukanie portali, nie tylko rejestrację adresów:
- **NRA**: potwierdzony bezpośrednim fetch mechanizm wyszukiwania
  (nra.pl/szukaj-dokumenty) — 1083 dokumenty, filtry (okres/organ/typ),
  opisana procedura wyszukiwania (sekcja 2.1, analogicznie do Fazy 1-T w
  orzeczenia-sadowe-v2), z konkretnymi przykładami rzeczywistych uchwał
  (nr 156/2024, nr 93/2023 — zmiana KEA ws. reklamy, nr 86/2022 — dobre
  praktyki cyberbezpieczeństwa).
- **KRRP**: potwierdzony bezpośrednim fetch `kirp.pl` (konkretne strony:
  wykaz-aktow-prawnych, regulamin-i-program-aplikacji) oraz dodatkowe
  archiwum `bibliotekakirp.pl` (uchwały/opinie/stanowiska KRRP, Prezydium,
  Zjazdów, OBSiL).
- **KRN**: potwierdzony bezpośrednim fetch `krn.org.pl` (aktywna strona,
  aktualne dane 2025/2026), Kodeks Etyki Zawodowej Notariusza z dokładną
  datą uchwalenia (uchwała nr 19/97 KRN, 12.12.1997) i ostatniej zmiany
  (uchwała X/4/2019).
Status: 3/16 portali w tabelach potwierdzone bezpośrednim fetch (NRA,
KRRP, KRN) — pozostałe 13 nadal oznaczone "⚠️ WYMAGA weryfikacji" zgodnie
z ZASADA 13 (brak fabrykacji potwierdzenia bez faktycznego sprawdzenia).

**1.0 (2026-07-17):** Utworzenie pliku na wniosek użytkownika ("zbuduj bazę
dokumentów dla NRA i innych zawodów zaufania publicznego"). Zweryfikowano
online: art. 17 Konstytucji, definicję TK (SK 20/00 — sygnatura niepełna
weryfikacja, oznaczona), listę ustaw/samorządów (Wikipedia, z odnotowaną
rozbieżnością liczbową między nagłówkiem a szczegółową listą), portale NRA/
adwokatura.pl (JEDYNE w pełni potwierdzone bezpośrednim fetch w tej sesji —
pozostałe domeny to punkty startowe oznaczone "⚠️ WYMAGA weryfikacji",
zgodnie z ZASADA 13/PRAWO-HARDGATE — nie fabrykowano potwierdzenia,
którego nie wykonano).


## SKILL.md (przeniesione 2026-10-04n)

Pole changelog (YAML) — Poprzednia: 3.99.5 (2026-10-04c, AUDYT-2026-10-04c): Osiągalność z zewnętrznych skilli: powiązane MOD-GENERATOR-AKTU, AUDIT-TRAIL-SPEC i bramka eksportu (MOD-AUDIT-BUNDLE), przyklad-adapter (MCP-INTEGRACJA).


## SYGNATURY.md (przeniesione 2026-10-04n)

> **Wersja poprzednia:** 1.5 (2026-09-14) — dodano V-SYG-0.7 DIRECT-CBOSA: fresh-probe,
>              formularz HTML + pełna paginacja + /doc/{ID} + exact-match;
>              V-SYG-0.5 pozostaje fallbackiem wyłącznie po niedostępności
>              direct CBOSA. Fail-closed dla driftu HTML/transportu.

> **Wersja poprzednia:** 1.4 (2026-09-13d) — dodano V-SYG-0.6 (rozstrzyganie AMBIGUOUS na
>              portalu sądu); doprecyzowano V-SYG-0.4 (post-check FILTRUJE zbiór,
>              nie porównuje pierwszego rekordu — przypadek `II CSKP 100/21`);
>              odnotowano odrzucenie zamienników CBOSA na `robots.txt`.
>              Flagi F-188, F-191, F-192, AUDYT-2026-09-13d.

> **Wersja poprzednia:** 1.3 (2026-09-13b) — dodano V-SYG-0.5 (kanał zdegradowany dla
>              pionu sądowoadministracyjnego) oraz oś ZAKRES POTWIERDZENIA
>              (ISTNIENIE / ISTNIENIE+TREŚĆ). Flaga F-183a, AUDYT-2026-09-13b.

> **Wersja poprzednia:** 1.2 (2026-09-13) — dodano V-SYG-0 (binarna kontrola istnienia
>              sygnatury: normalizacja → routing bazy → okno pokrycia → post-check
>              tożsamości). Flagi F-182…F-186, AUDYT-2026-09-13.

> **Wersja poprzednia:** 1.1 (2026-07-05) — KONTRAKT WYNIKU WERYFIKACJI
>              (FOUND/NOT_FOUND/AMBIGUOUS/OUT_OF_SCOPE, wzorzec sententim; AUDYT-2026-07-05a)


## WERYFIKACJA-SLAD.md (przeniesione 2026-10-04n)

> **Wersja poprzednia:** 1.7 (2026-09-14) — dodano provenance kanału (`access_mode`) niezależne od statusu ✅/⚠️; snapshot/crawler nie tworzy piątego statusu i sam nie uprawnia do ✅ [VER].

> **Wersja wcześniejsza:** 1.6 (2026-08-27) — dodano REJESTR POKRYCIA WERYFIKACJI (RPW):
>              checkpoint obowiązkowy przy ≥8 powołaniach, zamykający lukę
>              "cichego pominięcia" pozycji bez błędu sieciowego — zgłoszone
>              przez użytkownika po sesji, w której odpowiedź z wieloma
>              przepisami (art. 249, 249a, 258, 257, 259, 156 §5a, 460, 463,
>              73, 178a KK — 10 powołań) nie wskazała, do którego momentu
>              sięgała weryfikacja ani co pozostało nieobjęte (patrz CHANGELOG)

> **Wersja poprzednia:** 1.3 (2026-07-15) — dodano KOTWICA-TEKSTOWA (Text Fragment):
>              link bezpośredni do konkretnego zdania w źródle, na wniosek
>              użytkownika po teście mechanizmu cytowania w rozmowie
>              (patrz sekcja niżej + CHANGELOG na końcu pliku)

## CHANGELOG

**1.6 (2026-08-27) — DODANO: REJESTR POKRYCIA WERYFIKACJI (RPW):**
- Zgłoszenie użytkownika: w odpowiedzi z 10 powołaniami KPK/KK (analiza
  kazusów o tymczasowym aresztowaniu) nie było widoczne, do którego
  momentu sięgała faktyczna weryfikacja i co ewentualnie zostało pominięte
  — mimo że każdy przepis osobno miał swój ślad, brakowało ZBIORCZEGO
  podsumowania zasięgu. Zapytanie: "aparat znakowania jest kluczowy, gdyż
  wskazuje czy nie jest to halucynacja, skąd inaczej użytkownika ma to
  wiedzieć?" — trafna uwaga o potrzebie widocznego checkpointu, nie tylko
  znaczników per-element.
- Rozpoznana luka: KROK W-4 chroni przed serią błędów sieciowych (≥3
  nieudane z rzędu), nie przed cichym pominięciem pozycji bez błędu —
  inny mechanizm, inna przyczyna, wymaga osobnej bramki.
- Naprawa: nowa sekcja RPW (próg ≥8 powołań, RPW-INIT/COMMIT/CHECKPOINT/
  RESUME, analogiczna do `MOD-REJESTR-POKRYCIA-JEDNOSTEK.md`), kolumna
  `Nr` w tabeli śladu, 3 punkty w SELF-CHECK, rozszerzenie reguły 14
  routera.
- ⚠️ **Ograniczenie znane i jawne (ten sam typ, co przy `KROK 3A` routera
  i `AUDIT-CLAIM-GATE` w audyt-systemu-v4):** RPW-CHECKPOINT jest
  deklaracją modelu, nie dowodem niezależnie sprawdzalnym przez drugą
  osobę. Wiarygodność checkpointu rośnie tylko o tyle, o ile pozycje w
  nim wymienione dają się zweryfikować (mają URL/źródło przy sobie) —
  sam fakt istnienia wiersza "RPW-CHECKPOINT: X/Y" nie jest silniejszym
  dowodem niż dowolna inna samo-deklaracja. Skuteczność tej bramki (czy
  faktycznie zmienia zachowanie, a nie tylko dodaje tekst) wymaga testu
  analogicznego do F-113, nie jest tu domyślnie zakładana.
- Wersja 1.5 → 1.6.

**1.5 (2026-07-15c) — SCALENIE: KOTWICA-TEKSTOWA przeniesiona do shared/PRAWO-HARDGATE.md:**
- Wykryto: mechanizm KOTWICA-TEKSTOWA (Text Fragment `#:~:text=`) powstał
  tutaj 2026-07-15 niezależnie od KROK 5A w `shared/PRAWO-HARDGATE.md`,
  dodanego TEGO SAMEGO DNIA — dwie osobne implementacje tego samego
  problemu (link do konkretnego miejsca w źródle) w dwóch plikach shared/.
  Zgłoszone przez użytkownika po incydencie: odpowiedź z modułu karnego
  (dr-03) nie zastosowała żadnej z dwóch wersji.
- Naprawa: pełna treść (Text Fragment, KT-1→KT-4, RZĄD, zastrzeżenie
  o przeglądarkach, FALLBACK) przeniesiona do `PRAWO-HARDGATE.md` KROK 5A
  (2.2→2.3), scalona z istniejącą tam treścią o numerach strony/tezy/
  nagłówka. Ten plik zachowuje wyłącznie krótkie odesłanie w miejscu
  dawnej pełnej sekcji, plus poprawione odesłania w GRADIENCIE i KROK W-3b
  (dotąd wskazywały "patrz wyżej" na treść, która po scaleniu już tu nie
  jest pełna).
- Ten plik (WERYFIKACJA-SLAD.md) pozostaje kanoniczny dla: znaczników
  ✅/⚠️ [VER/NIEWERYFIKOWANE], GRADIENTU (ISTNIENIE/TREŚĆ/FRAGMENT),
  formatu tabeli śladu, SVG (usuwanie znaczników z dokumentów finalnych).
  `PRAWO-HARDGATE.md` jest kanoniczny dla: samego mechanizmu kotwicy
  (jak zbudować link), niezależnie od tego, który plik ustala WYMÓG
  jej zastosowania.
- Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis
  AUDYT-2026-07-15c.
- Wersja 1.4 → 1.5.

**1.4 (2026-07-15b):**
- **Naprawa: brak obowiązkowej kategoryzacji RZĄD przy linkach.** Zgłoszone
  przez użytkownika: w poprzedniej turze podano link 🔗 (kotwica tekstowa)
  bez kategoryzacji źródła wg hierarchii RZĄD 1/2A/2B/3 — mechanizm ten
  istniał już w systemie, ale wyłącznie lokalnie w `analizator-przepisow-v2`
  i nie był ładowany/wymuszany w kontekście tego pliku ani w odpowiedziach
  generowanych poza tym skillem.
- **Naprawa systemowa (nie punktowa):** hierarchia źródeł wydzielona do
  nowego kanonicznego pliku `shared/HIERARCHIA-ZRODEL.md`, współdzielonego
  przez ten plik, `shared/PRAWO-HARDGATE.md` i `analizator-przepisow-v2`
  (który teraz się do niego odsyła zamiast duplikować treść).
- Dodano wymóg RZĄD do sekcji KOTWICA-TEKSTOWA (kategoryzacja OBOK 🔗,
  nie zamiast), do formatu śladu weryfikacji i do SELF-CHECK.
- Wersja 1.3 → 1.4.

**1.3 (2026-07-15):**
- Dodano sekcję **🔗 KOTWICA-TEKSTOWA (Text Fragment)** — na wyraźne życzenie
  użytkownika, po tym jak w rozmowie przetestowano ręcznie skonstruowany link
  `#:~:text=...` i porównano go z natywnym mechanizmem cytowania Claude
  (tag `` z indeksem dokument-zdanie). Ustalono, że to dwa różne
  mechanizmy: natywne cytowanie jest weryfikowalne wewnątrz rozmowy, ale nie
  gwarantuje przewinięcia żywej strony po kliknięciu; Text Fragment adresuje
  właśnie ten drugi przypadek, kosztem braku gwarancji (przeglądarka, trwałość
  treści strony).
- Nowy znacznik `🔗 [KOTWICA-TEKSTOWA: URL#:~:text=…]` w tabeli statusów —
  TOWARZYSZY dotychczasowym ✅/🟢, nie zastępuje ich. Poziom weryfikacji
  (ISTNIENIE/TREŚĆ/FRAGMENT) nadal ustala WYŁĄCZNIE GRADIENT.
- Nowy krok **KT-1→KT-4** (procedura konstrukcji) oraz **KROK W-3b** w
  sekwencji obowiązkowej — kotwica tekstowa musi być budowana w tej samej
  odpowiedzi co web_fetch/web_search źródła, nie doklejana post factum bez
  ponownego odczytu.
- Rozszerzony SELF-CHECK o dwa punkty kontrolne dla KOTWICA-TEKSTOWA.
- Zastrzeżenie obowiązkowe wprowadzone jako twardy wymóg: ZAKAZ prezentowania
  linku jako gwarantowanego — zawsze z zastrzeżeniem o wsparciu przeglądarek
  (Chromium tak, Safari/Firefox nie gwarantowanie) i możliwej dezaktualizacji
  treści strony źródłowej.
- Dodano **FALLBACK** (na wyraźne życzenie użytkownika): gdy konstrukcja
  kotwicy tekstowej zawodzi (fragment za długi/nieregularny, treść z PDF-a,
  brak pewności unikalności dopasowania) → nie twórz jej "na siłę", podaj
  wyłącznie zwykły link do strony źródłowej, bez znacznika 🔗, z wyraźną
  adnotacją że to link do strony, nie do fragmentu.
- Wersja 1.2 → 1.3.
