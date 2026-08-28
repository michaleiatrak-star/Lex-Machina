---
name: dr-08-samorzad-terytorialny-prawo-lokalne
version: "3.7"
description: "Samorząd terytorialny i prawo lokalne: gmina, powiat, województwo, uchwały, akty prawa miejscowego, nadzór, kompetencje JST i lokalne planowanie."
---

> **Universal runtime:** przed wykonaniem zastosuj kanoniczny `shared/UNIVERSAL-RUNTIME-ADAPTER.md` z osobnego skilla `shared`. Lokalna sekcja adaptera poniżej jedynie go doprecyzowuje.


## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)

Ta sekcja zmienia wyłącznie wykonanie operacji technicznych. Merytoryka dziedzinowa, mapy aktów, hard gate’y, kolejność modułów i kryteria jakości tego DR-skilla pozostają bez zmian.

1. `view dr-08-samorzad-terytorialny-prawo-lokalne/<plik>` oraz `view modules/...` / `view references/...` oznaczają świeży odczyt odpowiedniego lokalnego pliku tego skilla. Literalna ścieżka `/mnt/skills/user` nie jest wymagana.
2. `view shared/<plik>` oznacza świeży odczyt z osobnego, kanonicznego skilla `shared`. NIE kopiuj `shared` do tej paczki. Brak obowiązkowego zasobu shared = fail-closed, nie substytucja pamięcią modelu.
3. `view <inny-skill>/<plik>` oznacza aktywację/odczyt wskazanego osobnego skilla. Nie vendoryzuj innych skilli do tego ZIP-a.
4. `web_search` / `web_fetch` i podobne nazwy oznaczają świeże wyszukanie/odczyt online przez równoważną funkcję hosta. Zachowaj wymagane źródła oficjalne, statusy weryfikacji i zakaz cytowania prawa z pamięci.
5. `show_widget`, `visualize:read_me`, `present_files`, `create_file`, shell/Python i podobne operacje są nazwami semantycznymi. Jeśli host nie ma literalnego narzędzia, użyj równoważnej funkcji natywnej bez omijania bramek jakości.
6. `/mnt/user-data/...` oznacza rzeczywiste załączniki użytkownika dostępne w bieżącym hoście; wymagany ponowny odczyt ma być faktycznym odczytem źródła.

**Zasada nadrzędna:** instrukcje, które są już zrozumiałe i wykonalne w bieżącym hoście, wykonuj bez konwersji. Adapter działa wyłącznie na granicy runtime.


# DR-08 — Samorząd Terytorialny i Prawo Lokalne

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, artykułu, terminu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, terminu, kary ani sygnatury wyłącznie z pamięci modelu.


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
- **Zakaz cytowania przepisów z pamięci — każde brzmienie weryfikuj w ISAP**
- Prawo miejscowe i uchwały JST: pobieraj z dzienników wojewódzkich i BIP, nie z pamięci

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-BUDOWLANE-DROGOWE.md` — opłata SPP (charakter prawny,
  zaskarżenie wyłącznie w egzekucji), obiekt liniowy, samowola budowlana
- `definicje/DEF-PROCEDURA.md` — termin zawity (art. 33 UPEA — 7 dni,
  bezwzględny dla SPP)

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-008 Mienie komunalne (art. 43 ustawy o samorządzie gminnym)
- BAS-012 Pas drogowy (UDP art. 4 pkt 1)
- BAS-101 Strefa zamieszkania (skutki: pierwszeństwo pieszego, 20 km/h)
- BAS-107 Droga wewnętrzna (definicja negatywna — mandat zasadniczo niedopuszczalny)

## Moduły (20 łącznie — ✓ 20 OK, ☐ 0 STUB)

  [✓] OK    mod-wojewoda-administracja-rzadowa-current-state-COV

```
MODUŁY USTROJOWE I PROCEDURALNE:
  [✓] OK    mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa
  [✓] NOWY  mod-ustawa-samorzad-powiatowy
              (F-108/27 P3: wydzielony moduł B+, Dz.U. 2025 poz. 1684)
  [✓] NOWY  mod-ustawa-samorzad-wojewodztwa
              (F-108/28 P3: wydzielony moduł B+, Dz.U. 2026 poz. 720)
              (USG + USP + USW — ustrój, kompetencje, organy, nadzór)
  [✓] OK    mod-nadzor-wojewody-RIO-legalnosc-uchwal
  [✓] OK    mod-skargi-na-prawo-miejscowe-WSA-NSA
  [✓] OK    mod-procedury-JST-statuty-regulaminy
  [✓] OK    mod-dzienniki-urzedowe-BIP-publikacja
              (2026-07-21: dodano pełną tabelę BIP marszałkowskich dla
               WSZYSTKICH 16 województw [Łódzkie potwierdzone przez
               użytkownika po wstępnym błędnym trafieniu na stronę
               wojewody] + rozróżnienie dziennik urzędowy [miarodajny]
               vs BIP [pomocniczy] + obserwacja o oznaczeniu "akt
               prawa miejscowego" w rejestrach BIP. Odpowiedź na
               pytanie użytkownika czy wskazane są wszystkie 16
               województw)
  [✓] OK    mod-kontrola-administracji-inspekcje
  [✓] OK    mod-akty-porzadkowe-bezpieczenstwo-lokalne
              (akty porządkowe, rozporządzenia porządkowe, zaskarżanie, bezpieczeństwo lokalne)
  [✓] OK    mod-lokalne-dane-publiczne-RODO-BIP
              (RODO w JST, DIP, dostęp do informacji publicznej, BIP)

MODUŁY DZIEDZINOWE (prawo materialne):
  [✓] OK    mod-MPZP-WZ-planowanie-przestrzenne
  [✓] OK    mod-lokalne-podatki-oplaty-taryfy
  [✓] OK    mod-ustawa-dochody-JST
  [✓] OK    mod-ustawa-zarzadzanie-kryzysowe
  [✓] OK    mod-ustawa-referendum-lokalne
  [✓] OK    mod-ustawa-pracownicy-samorzadowi
  [✓] OK    mod-ustawa-komunalne-wod-kan-transport-czystosc
              (scalony: wod-kan + transport zbiorowy + czystość i porządek)
  [✓] OK    mod-ustawa-zabytki-rewitalizacja
  [✓] OK    mod-UDP-strefy-platnego-parkowania
              (SPP/ŚSPP: opłaty art.13/13b/13f UDP Dz.U. 2025 poz. 889; opłata dodatkowa;
               brak zaskarżalności wezwania do WSA — tylko zarzuty UPEA art.33;
               stawki % płacy min.; karta parkingowa; parking prywatny; zaskarżenie uchwały)
              (scalony: zabytki + rewitalizacja + cmentarze)
```

## Jak wywołać

```
view dr-08-samorzad-terytorialny-prawo-lokalne/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view dr-08-samorzad-terytorialny-prawo-lokalne/MAPA-AKTOW.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- KPA / PPSA: `dr-05` → `mod-KPA-postepowanie-administracyjne`
- Podatki lokalne (podatek od nieruchomości — stawki i reforma 2025): `dr-06` → `mod-ustawa-podatek-nieruchomosci-i-lokalne`
- Finanse publiczne / dyscyplina: `dr-06` → `mod-UFP-finanse-publiczne-NIK-RIO`
- Zamówienia publiczne JST: `dr-07`
- Budownictwo / środowisko: `dr-09`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Orzecznictwo: orzeczenia.nsa.gov.pl, cbosa.nsa.gov.pl
- Prawo miejscowe: dzienniki.gov.pl, BIP właściwego urzędu

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
