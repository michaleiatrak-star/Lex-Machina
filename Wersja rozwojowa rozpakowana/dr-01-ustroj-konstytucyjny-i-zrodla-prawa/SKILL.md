---
name: dr-01-ustroj-konstytucyjny-i-zrodla-prawa
version: 3.2
description: |
  DR-01: Ustrój Konstytucyjny i Źródła Prawa
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | trybunal.gov.pl | sn.pl | nsa.gov.pl | orzeczenia.ms.gov.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-01 — Ustrój Konstytucyjny i Źródła Prawa

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
- Źródło podstawowe: ISAP; LEX/Legalis dopuszczalne wyłącznie pomocniczo przy braku dostępu

## DEFINICJE — shared/definicje/

- `definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` — ⚠️ NOWE 2026-06-12: wyłączenie
  sędziego (iudex inhabilis/suspectus, art. 48-49 KPC + odpowiedniki KPK/PPSA),
  z KRYTYCZNYM alertem TK P 10/19+P 7/23 (neoKRS, ZAKTUALIZOWANO 06-13: art.48+49 KPC, + kryzys publikacji wyroków TK) — SCALONE z mod-USP-ustroj-sadow-
  powszechnych.md, który wcześniej miał własny, krótszy opis bez tego alertu

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Brak dedykowanych rekordów ORKA dla tej dziedziny (pojęcia konstytucyjne mają
ugruntowane definicje doktrynalne, kazuistyka TK). Pomocniczo:
- BAS-W31 Właściwość sądu — zasady ogólne (gdy sprawa dotyczy podziału władz/sądów)

## Moduły (7 łącznie — ✓ 7 OK, ☐ 0 STUB)

```
  [✓] OK    mod-Konstytucja-TK-skarga-konstytucyjna
  [✓] OK    mod-USP-ustroj-sadow-powszechnych
  [✓] OK    mod-ustawa-KRS-i-ustroj-wladzy
  [✓] OK    mod-ustawa-partie-polityczne-referendum
  [✓] OK    mod-ZTP-przepisy-przejsciowe-doktryna  — dodany 2026-07-17: podstawa
            prawna Zasad Techniki Prawodawczej + mechanizm/algorytm kwalifikacji
            technik intertemporalnych + literatura ekspercka. Wywołuj gdy pytanie
            dot. wpływu nowelizacji na sprawy w toku wykracza poza samą mechanikę
            dat (dla tej ostatniej: analizator-przepisow-v2/references/
            MOD-VACATIO-LEGIS.md — NIE duplikować).
  [✓] OK    mod-specustawy-lex-specialis-graf-zaleznosci  — dodany 2026-07-17:
            specustawy (pojęcie doktrynalne), przepisy epizodyczne (ZTP Rozdz.
            4a — inny dział tego samego aktu co mod-ZTP powyżej), algorytm
            lex specialis derogat legi generali, mechanizm grafu zależności
            specustawa↔akt ogólny. Komplementarny z mod-ZTP, nie duplikuje.
  [✓] OK    mod-stany-nadzwyczajne-sytuacje-kryzysowe  — dodany 2026-07-17:
            Rozdział XI Konstytucji (art. 228-234), 3 stany nadzwyczajne,
            reżimy ustawowe poniżej progu konstytucyjnego (zarządzanie
            kryzysowe, ochrona ludności, stan epidemii), doktrynalna
            kontrowersja COVID-19, graf zależności między reżimami. Wywołuj
            dla klęsk żywiołowych/katastrof/epidemii — komplementarny z
            mod-specustawy (katalog specustaw doraźnych pozostaje tam).
```

## Jak wywołać

```
view /mnt/skills/user/dr-01-ustroj-konstytucyjny-i-zrodla-prawa/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-01-ustroj-konstytucyjny-i-zrodla-prawa/MAPA-AKTOW.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja prawa: isap.sejm.gov.pl
- Orzecznictwo: trybunal.gov.pl, sn.pl, nsa.gov.pl, orzeczenia.ms.gov.pl

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

## Audyt pokrycia (2026-06-13)

DR-01 ma 4 moduły pokrywające 11 aktów prawnych. Dziedzina jest **celowo węższa** niż inne DR:
prawo konstytucyjne / ustrojowe jest rzadko samodzielnym przedmiotem sprawy kancelaryjnej — zwykle pojawia się jako **kontekst lub zarzut** w sprawie należącej do innego DR (np. neoKRS w DR-12, skargi na przewlekłość w DR-05/DR-02).

**Ocena kompletności:**
- ✅ Konstytucja + TK + skarga konstytucyjna (art. 79 Konstytucji)
- ✅ Ustrój sądów (PUSP, SN, sądy adm.)
- ✅ KRS + władza wykonawcza
- ✅ Partie polityczne + referendum
- ✅ Zasady Techniki Prawodawczej — przepisy przejściowe, doktryna i mechanizm
  kwalifikacji technik intertemporalnych (dodano 2026-07-17, na wniosek
  użytkownika; literatura ekspercka + algorytm decyzyjny)
- ✅ Specustawy, lex specialis, przepisy epizodyczne, graf zależności (dodano
  2026-07-17, na wniosek użytkownika; komplementarne z modułem ZTP powyżej)
- ✅ Stany nadzwyczajne i sytuacje kryzysowe — klęski żywiołowe, katastrofy,
  epidemie (dodano 2026-07-17, na wniosek użytkownika; rozdział XI
  Konstytucji + doktrynalna kontrowersja COVID-19 + graf reżimów)

**Brakujące akty — kandydaci do rozbudowy przy zwiększonym zapotrzebowaniu:**
- Ustawa o dostępie do informacji publicznej (UDIP) — jest w DR-05 (mod-UDIP-...), tu niepotrzebna
- Ordynacja wyborcza / Kodeks wyborczy — rozważyć mod-ustawa-kodeks-wyborczy.md jeśli pojawią się sprawy
- Ustawa o finansowaniu kampanii wyborczych (PKW, PKW-odwołania) — niszowa, brak modułu, dodać przy zapotrzebowaniu
- Ustawa o ochronie danych osobowych w sprawach wyborczych — marginalnie

**Konkluzja:** DR-01 nie wymaga pilnej rozbudowy poza dziedziną wyborczą.
Moduł ZTP (2026-07-17) domyka lukę doktrynalną: system miał już mechanikę dat
(MOD-VACATIO-LEGIS) ale brakowało podstawy prawnej samej techniki legislacyjnej
i literatury eksperckiej — teraz obie warstwy są rozdzielone i połączone
odesłaniami, bez duplikacji.
