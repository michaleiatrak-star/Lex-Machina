---
name: dr-05-prawo-administracyjne-sadowoadministracyjne
version: "3.21"
description: "Prawo administracyjne i sądowoadministracyjne: KPA, PPSA, decyzje, bezczynność, WSA/NSA, egzekucja administracyjna, cudzoziemcy i postępowania urzędowe."
---

> **Universal runtime:** przed wykonaniem zastosuj kanoniczny `shared/UNIVERSAL-RUNTIME-ADAPTER.md` z osobnego skilla `shared`. Lokalna sekcja adaptera poniżej jedynie go doprecyzowuje.


## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)

Ta sekcja zmienia wyłącznie wykonanie operacji technicznych. Merytoryka dziedzinowa, mapy aktów, hard gate’y, kolejność modułów i kryteria jakości tego DR-skilla pozostają bez zmian.

1. `view dr-05-prawo-administracyjne-sadowoadministracyjne/<plik>` oraz `view modules/...` / `view references/...` oznaczają świeży odczyt odpowiedniego lokalnego pliku tego skilla. Literalna ścieżka `/mnt/skills/user` nie jest wymagana.
2. `view shared/<plik>` oznacza świeży odczyt z osobnego, kanonicznego skilla `shared`. NIE kopiuj `shared` do tej paczki. Brak obowiązkowego zasobu shared = fail-closed, nie substytucja pamięcią modelu.
3. `view <inny-skill>/<plik>` oznacza aktywację/odczyt wskazanego osobnego skilla. Nie vendoryzuj innych skilli do tego ZIP-a.
4. `web_search` / `web_fetch` i podobne nazwy oznaczają świeże wyszukanie/odczyt online przez równoważną funkcję hosta. Zachowaj wymagane źródła oficjalne, statusy weryfikacji i zakaz cytowania prawa z pamięci.
5. `show_widget`, `visualize:read_me`, `present_files`, `create_file`, shell/Python i podobne operacje są nazwami semantycznymi. Jeśli host nie ma literalnego narzędzia, użyj równoważnej funkcji natywnej bez omijania bramek jakości.
6. `/mnt/user-data/...` oznacza rzeczywiste załączniki użytkownika dostępne w bieżącym hoście; wymagany ponowny odczyt ma być faktycznym odczytem źródła.

**Zasada nadrzędna:** instrukcje, które są już zrozumiałe i wykonalne w bieżącym hoście, wykonuj bez konwersji. Adapter działa wyłącznie na granicy runtime.


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


> ⛔ **SELF-CHECK ANTY-FASADA — obowiązkowy przed wysłaniem odpowiedzi/pisma**
> (podłączone 2026-08-24, flaga F-115 P3 — zamknięcie zakresu 16 skilli DR):
>
> ```
> view shared/SELF-CHECK-ANTY-FASADA.md
> ```
>
> Sprawdza dwie rzeczy: (1) czy w tekście stoi „zweryfikowano", data weryfikacji
> albo URL przy przepisie, dla którego NIE wywołano narzędzia W TEJ ODPOWIEDZI;
> (2) czy znacznik statusu nie został nadany treści WYGENEROWANEJ w tej odpowiedzi
> (AF-6). Treść listy jest w module, nie tutaj — celowo, żeby nie powstało kolejne
> miejsce dryfu (7 wcześniejszych kopii rozjechało się ze źródłem przy pierwszej
> zmianie brzmienia).
>
> ⛔ Wyzwalaczem jest BRAK WYWOŁANIA NARZĘDZIA dla danego twierdzenia w danej
> odpowiedzi — nie brak narzędzi w sesji. Niedostępność ISAP nie zwalnia z
> oznaczenia, tylko je wymusza.

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

## Moduły (20 łącznie — ✓ 20 OK, ☐ 0 STUB)

**NAPRAWA 2026-08-22 (kontynuacja):** dodano `mod-PPSA-orzeczenia-
sadowe-rozdzial-10.md` — naprawa poz. #8 mapy pokrycia PPSA (ostatnia
z oryginalnej ósemki): Dział III, Rozdział 10, art. 132-167a
(orzeczenia sądowe), dokończenie tematu dotąd opisanego wyłącznie
fragmentarycznie (wąski wycinek skarg na akty JST/nadzoru w
`czesc-06-skarga-wsa-dowody.md`). Domyka: granice orzekania (art.
133-136), uwzględnienie skargi na decyzję/postanowienie — trzy
rodzaje rozstrzygnięć (art. 145), uwzględnienie skargi na akty z
art. 3 §2 pkt 4-4b — interpretacje podatkowe (art. 146), oddalenie
skargi (art. 151), uwzględnienie skargi na bezczynność/przewlekłość
z sankcjami grzywny (art. 149), związanie oceną prawną sądu (art.
153 — przepis o dużej praktycznej doniosłości), umorzenie
postępowania (art. 161). Uwzględnia zmianę linii orzeczniczej po
wyroku TK z 26.02.2025 dot. art. 149 §1 pkt 3. Rząd 1: arslege.pl,
lexlege.pl (metryka Dz.U. 2026 poz. 143 t.j.), sip.lex.pl. Pełny opis:
`audyt-systemu-v4/references/AUDIT-JOURNAL.md`.

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
               nowa sekcja 7, doprecyzowanie ustawą Dz.U. 2026 poz. 846
               [w życie 1.10.2026] terminu skargi do WSA na opinię
               transgraniczną i odmowę jej wydania. ⚠️ [NIEWERYFIKOWANE
               RZĄD 1] — dokładny artykuł i treść NIE potwierdzone,
               ISAP zablokowany; pozostała treść nowelizacji PPSA z tej
               ustawy NIEOPRACOWANA.
               ✅ ROZSZERZONY 2026-08-22 — naprawa pozycji #9 mapy
               pokrycia PPSA: nowa sekcja 4, Dział V Rozdz. 1-2 (koszty,
               wpis, opłata kancelaryjna, art. 199-242) — dopełnienie
               Rozdz. 3 [prawo pomocy, sekcja 3] tego samego Działu V.
               ⭐⭐⭐ Zasada odwrócona wobec KPC: w I instancji WSA NIE
               obowiązuje odpowiedzialność za wynik (art. 199), zwrot
               kosztów tylko na rzecz skarżącego przy uwzględnieniu
               skargi (art. 200); przed NSA zasada odwraca się na
               odpowiedzialność za wynik (art. 203-204). Pułapka
               prekluzyjna art. 210 (brak zgłoszenia żądania zwrotu
               kosztów przed zamknięciem rozprawy = trwała utrata) —
               ten sam wzorzec co art. 105 PPSA/art. 162 KPC.
               Rząd 1: bip.warszawa.wsa.gov.pl, gliwice.wsa.gov.pl,
               bip.wroclaw.wsa.gov.pl. Rząd 2B: arslege.pl, lexlege.pl.)
  [✓] NOWY  mod-PPSA-posiedzenia-sadowe-rozdzial-7
              (dodany 2026-08-22, F-83 priorytet #6 mapy pokrycia:
               PPSA Dział III Rozdz. 7, art. 90-114. DRUGI dedykowany
               moduł PPSA — pokrywa etap MIĘDZY wejściem a wyjściem z
               postępowania, który moduł F-64 pomijał. ⭐⭐⭐ Trzy rdzenie:
               [1] art. 90 §2 — sąd MOŻE skierować na rozprawę sprawę
               podlegającą rozpoznaniu na posiedzeniu niejawnym; tryb
               niejawny NIE jest jednokierunkowy [narzędzie pomijane];
               [2] art. 106 §3 — JEDYNE okno dowodowe, WYŁĄCZNIE
               dokumenty, a "istotne wątpliwości" dotyczą zgodności
               AKTU Z PRAWEM, nie ustaleń faktycznych [najczęstszy powód
               oddalenia wniosku]; [3] art. 105 — ⛔ brak zastrzeżenia do
               protokołu = UTRATA zarzutu procesowego w NSA, odpowiednik
               art. 162 KPC. Ponadto: terminy zawiadomienia 7 dni / 3 dni
               w sprawach pilnych [91 §2], odroczenie OBLIGATORYJNE [109]
               z ⛔ pułapką rutynowej formuły "wnoszę o rozpoznanie pod moją
               nieobecność", sprostowanie protokołu 30 dni [103], załącznik
               do protokołu [104], grzywna dla organu [112 → 154 §6],
               zamknięcie rozprawy [113] z orzecznictwem: art. 113 NIE
               stanowi samodzielnej podstawy kasacyjnej)
  [✓] NOWY  mod-PPSA-orzeczenia-sadowe-rozdzial-10
              (dodany 2026-08-22, naprawa poz. #8 mapy pokrycia — ostatnia
               pozycja oryginalnej ósemki. PPSA Dział III Rozdz. 10,
               art. 132-167a. TRZECI dedykowany moduł PPSA — dokończenie
               tematu opisanego dotąd tylko fragmentarycznie [wąski
               wycinek JST/nadzoru w czesc-06-skarga-wsa-dowody.md].
               ⭐⭐⭐ Trzy rdzenie: [1] art. 145 — trzy rodzaje rozstrzygnięć
               przy uwzględnieniu skargi na decyzję/postanowienie
               [uchylenie / stwierdzenie nieważności / stwierdzenie
               wydania z naruszeniem prawa], dotąd CAŁKOWICIE nieobecne
               mimo najczęstszej kategorii spraw; [2] art. 153 — związanie
               oceną prawną sądu, przepis o dużej praktycznej doniosłości,
               samodzielna podstawa zarzutu przy niezastosowaniu się
               organu; [3] art. 149 — uwzględnienie skargi na bezczynność/
               przewlekłość z sankcjami [grzywna do 89 035,60 zł w 2026,
               suma pieniężna do 44 517,80 zł], uwzględniająca zmianę
               linii orzeczniczej po wyroku TK z 26.02.2025. Ponadto:
               granice orzekania [134-136, zakaz reformationis in peius],
               oddalenie skargi [151, uzasadnienie tylko na wniosek],
               akty z art. 3 §2 pkt 4-4b — interpretacje podatkowe [146],
               umorzenie postępowania [161])
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
view dr-05-prawo-administracyjne-sadowoadministracyjne/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view dr-05-prawo-administracyjne-sadowoadministracyjne/MAPA-AKTOW.md
```

## Mapa pokrycia treściowego (planowanie rozwoju skilla)

Rejestr informacyjny — NIE krok obowiązkowy przy obsłudze konkretnej sprawy.
Przydatny przy planowaniu, które luki uzupełnić w pierwszej kolejności, oraz
przy nowelizacjach — pokazuje od razu czy dotknięty fragment ma treść do
zaktualizowania. (F-83, zasilony 2026-08-22; obejmuje na razie wyłącznie
PPSA — akt bez własnego dedykowanego modułu):

```
view dr-05-prawo-administracyjne-sadowoadministracyjne/MAPA-POKRYCIA.md
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
view shared/DISCLAIMER.md
```

Wybierz wariant odpowiedni do trybu:
- **PRAWNIK / kancelaria** → wariant techniczny (art. 4 Prawa o adwokaturze / art. 6 u.r.p.)
- **LAIK / pro se** → wariant uproszczony (informacja ≠ porada prawna)

Disclaimer musi być **ostatnim elementem** każdej odpowiedzi zawierającej analizę prawną,
ocenę szans, kwalifikację prawną lub interpretację przepisu.
