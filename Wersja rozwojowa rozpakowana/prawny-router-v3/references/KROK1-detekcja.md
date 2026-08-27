# KROK 1 — Detekcja Trybu i Hard Gate Weryfikacji

> Plik wydzielony z prawny-router-v3/SKILL.md (R1).
> Wczytaj po KROK 0A, przed KROK 2 (klasyfikacja [1]–[10]).
> Wywołanie: `view prawny-router-v3/references/KROK1-detekcja.md`

---

## KROK 1 — DETEKCJA TRYBU

| Sygnał | Tryb |
|---|---|
| "co mam zrobić" / "co to znaczy" / "nie rozumiem" / "dostałem pismo" / "boję się" | AUTO → LAIK |
| "art. X §Y" / "sygn." / "KPC" / "KK" / "SN" / "SA" / "pełnomocnik" / "podstawa prawna" | AUTO → PRAWNIK |
| Dokument bez komentarza prawniczego | → PYTANIE BEZPOŚREDNIE |
| Sytuacja życiowa bez terminologii | AUTO → LAIK |
| "pismo" / "pozew" / "apelacja" bez kontekstu technicznego | → PYTANIE BEZPOŚREDNIE |

**Niejednoznaczność → PYTANIE BEZPOŚREDNIE (obowiązkowe, zanim cokolwiek przeanalizujesz):**

```
"Zanim zacznę — jedno krótkie pytanie:
Czy jesteś prawnikiem lub masz doświadczenie prawne?
a) Tak, jestem prawnikiem / pracuję w prawie
b) Nie, potrzebuję wyjaśnień krok po kroku
Możesz też wpisać 'kreator' żeby uruchomić asystenta krok po kroku."
```

Zasady: tylko to jedno pytanie · czekaj przed analizą · "a"→PRAWNIK · "b"/brak→LAIK
· "kreator"→natychmiast kreator

---

## TRYBY PRACY

### TRYB LAIK

```
✓ Jedno pytanie na raz
✓ Każdy termin → natychmiastowe tłumaczenie
✓ Raport → przefiltruj przez przewodnik-prawny-v2 (KROK H)
✓ ZAWSZE termin zawity PRZED analizą (KROK G w przewodnik-prawny-v2)
✓ Opcje z konsekwencjami — nie pytania otwarte
✓ Ostrzegaj przed działaniami nieodwracalnymi
✓ Wynik: widget lub .docx z instrukcją złożenia

SEKWENCJA:
1. przewodnik-prawny-v2 (FAZA 0)
   Tryby: PROWADZENIE / Q&A / MENU — auto-wykrycie z sygnału
2. PRIMARY skill
3. Tłumaczenie raportu (KROK H)
4. Opcje z konsekwencjami
5. Pismo → KREATOR auto
6. Dokument → "Oto do pobrania"
```

### TRYB PRAWNIK / TEKST

```
✓ Pełna terminologia bez upraszczania
✓ Raporty techniczne (filtry, hierarchie, kody)
✓ Orzecznictwo z sygnaturami i linkami (po weryfikacji SYGNATURY.md)
✓ Od razu analiza z dostępnych danych
✓ Braki → ⬛ [UZUPEŁNIJ: opis]
✓ Wynik: surowy raport → "Czy wygenerować dokument? (.docx / .pdf)"

SEKWENCJA: PRIMARY → raport techniczny → oferta .docx
```

### TRYB PRAWNIK / KREATOR

```
WYWOŁANIE: "kreator" w dowolnym momencie / wybór / router proponuje przy złożonej sprawie

✓ Widget interaktywny (MOD-SZABLONY + INTAKE-GAP)
✓ Pytania techniczne, podgląd pisma na żywo
✓ Walidacja po każdym etapie (MOD-WALIDACJA)
✓ Wynik: .docx bez dodatkowych pytań

KROK K1 — Intake:
"Podaj: typ pisma, sygnaturę (jeśli sprawa w toku), strony,
istotę sporu i cel pisma. Resztę uzupełnię znakiem ⬛."
KROK K2 — Weryfikacja przepisów online
KROK K3 — Orzecznictwo (orzeczenia-sadowe-v2)
KROK K4 — Generowanie treści
KROK K5 — HYBRID-VALIDATION (raport techniczny)
KROK K6 — docx-skill / pdf-skill → present_files
```

### KREATOR — TRYB LAIK

```
OBOWIĄZKOWE (auto): LAIK + pismo procesowe | LAIK + brak danych
NA ŻĄDANIE: "kreator" w dowolnym momencie
ROUTER PROPONUJE: >5 brakujących pól / po analizie

KROK K1:
"Poprowadzę Cię przez [typ pisma] krok po kroku.
Jedno pytanie naraz. 'stop' → powrót do rozmowy.
[Pierwsze pytanie]"

KROK K2 — Pytania sekwencyjne: jedno pytanie = jedna wiadomość
KROK K3 — Po 3-5 pytaniach podgląd fragmentu pisma
KROK K4 → pisma-procesowe-v3 lub pisma-proste-v2
         → HYBRID-VALIDATION → docx-skill → present_files
         → "Oto Twoje pismo. Pamiętaj żeby [instrukcja złożenia]."
```

---

## KROK 1B — ⛔ HARD GATE: WERYFIKACJA ONLINE

**STOP.** Przed podaniem jakiegokolwiek artykułu / liczby / terminu / kwoty / kary — wykonaj V1–V5.

> ⛔ BEZWZGLĘDNY ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI
> Żaden artykuł, numer Dz.U., stawka, termin ustawowy, kara ani sygnatura orzeczenia
> nie może być podany bez weryfikacji online w tym samym kroku. Dotyczy wszystkich dziedzin.
> Procedura szczegółowa: `view shared/PRAWO-HARDGATE.md`
>
> ⛔ HARD GATE TRWAŁY — OBOWIĄZUJE PRZEZ CAŁĄ ROZMOWĘ
> Zakaz nie wygasa po żadnej liczbie wiadomości. Nie ma znaczenia, czy przepis był
> weryfikowany wcześniej w tej samej rozmowie — każde nowe powołanie artykułu,
> sygnatury lub liczby wymaga osobnego wywołania web_search/web_fetch.
> Oficjalne źródła: isap.sejm.gov.pl · orzeczenia.ms.gov.pl · sn.pl · trybunal.gov.pl · nsa.gov.pl
> Brak dostępu → ⚠️ [NIEWERYFIKOWANE] + komunikat użytkownikowi. Nigdy nie pomijaj oznaczenia.
> ⛔ ZAKAZ CYTOWANIA Z PAMIĘCI NAWET JEŚLI MODEL "JEST PEWNY" TREŚCI PRZEPISU.

```
V1 — Zidentyfikuj ustawy (KK, KPC, KW, KC, KP, KPA, ustawa szczególna)

V2 — Klasyfikacja dziedzinowa i wczytanie skilla (obowiązkowe)
  KROK PODSTAWOWY (zawsze):
  view prawo-polskie-v2/SKILL.md
  → ROUTING-MAP wskaże właściwy DR-skill (DR-01…DR-16) i moduł aktu (lazy loading).

  SKRÓTY ZWERYFIKOWANE — dla 16 dziedzin istnieją oznaczone moduły "wejściowe"
  (tag [XX] w nagłówku). Jeśli sprawa jednoznacznie dotyczy jednej z nich, można
  wczytać bezpośrednio (równolegle z krokiem podstawowym, nie zamiast niego):

  Karne / kwalifikacja:        view dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-KPK-framework-karne.md
                               → `mod-KK-KPK-framework-karne.md` decyduje (sekcja DECYZJA O KWALIFIKATORZE)
                                 czy potrzebny `mod-KK-kwalifikator-karnomaterialny.md`
  Wykroczenie:                 view dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KW-kodeks-wykroczen.md
  Stalking / nękanie:          view dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-art190a-stalking.md
  Przemoc domowa:              view dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-art207-przemoc-domowa.md
  Cyberprzestępczość:          view dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-art267-269c-cyberprzestepstwa.md
  Najem / lokatorzy prywatni:    view dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-ustawa-ochrona-praw-lokatorow-najem-eksmisja.md
  Zakup / księga wieczysta:     view dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-KW-ksiega-wieczysta-zakup-nieruchomosci.md
  UGN / mienie publiczne:       view dr-09-budownictwo-srodowisko-energia-transport/modules/mod-UGN-gospodarka-nieruchomosciami.md
  IP / autorskie / wizerunek:  view dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-PrAut-wlasnosc-intelektualna-IP.md
  RODO:                        view dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-RODO-GDPR-2016-679.md
  AI Act / prawo AI:           view dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-AI-Act-framework.md
  UOKiK/URE/UKE/KNF (regulacyjne): view dr-12-sadownictwo-prokuratura-zawody-prawnicze/modules/mod-ustawa-regulatorzy-UOKiK-URE-UKE-KNF.md
  UODO (postępowanie):         view dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-UODO-postepowanie-ochrona-danych.md
  Prawo farmaceutyczne:        view dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-PrFarm-prawo-farmaceutyczne.md
  Błąd medyczny / pacjent:     view dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-prawa-pacjenta-framework.md
  Budowlane / samowola:        view dr-09-budownictwo-srodowisko-energia-transport/modules/mod-PrBud-prawo-budowlane.md
  Środowisko / OOŚ:            view dr-09-budownictwo-srodowisko-energia-transport/modules/mod-POS-prawo-ochrony-srodowiska.md
  Działalność regulowana:      view dr-08-samorzad-terytorialny-prawo-lokalne/modules/mod-kontrola-administracji-inspekcje.md

  POZOSTAŁE DZIEDZINY (brak jeszcze oznaczonego modułu wejściowego — wyłącznie
  przez krok podstawowy prawo-polskie-v2 → ROUTING-MAP → DR-skill):
  Pracownicze, Mobbing, Rodzinne / alimenty, Spadkowe, Cywilne / odszkodowanie,
  Administracyjne / KPA, ZUS / emerytury, Gospodarcze / spółki, Konsumenckie,
  Podatkowe / PIT/VAT/KAS, Akcyza / cło / CN / UCC, Ubezpieczenia / OC/AC,
  Cudzoziemcy / pobyt, Zamówienia / KIO / PZP (+ compliance SWZ),
  Chemikalia / REACH / CLP, Windykacja / egzekucja.

V3 — Weryfikacja online każdego przepisu:
  web_search: "art. X [nazwa ustawy] isap.sejm.gov.pl tekst jednolity"
  lub web_fetch: bezpośredni URL ISAP
  Brak dostępu → oznacz ⚠️ [NIEWERYFIKOWANE]

V4 — Każda liczba/artykuł/termin/kwota MUSI pochodzić z V2 lub V3.
  Niezgodność skill ↔ ISAP → podaj ISAP jako aktualniejszy + zaznacz rozbieżność.
  Oznacz znacznikiem: ✅ [VER: źródło, data] lub ⚠️ [NIEWERYFIKOWANE]

V5 — Dopiero po V1+V2+V3+V4 → KROK 2
```

**Tabela: sprawy karne**

| Sytuacja | Wczytaj |
|---|---|
| Nieznana kwalifikacja czynu | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-KPK-framework-karne.md` → decyzja o `mod-KK-kwalifikator-karnomaterialny.md` |
| Kradzież / rozbój / zniszczenie | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-KPK-framework-karne.md` → `mod-KK-kwalifikator-karnomaterialny.md`, jeśli framework wskaże TAK |
| Przestępstwo przeciwko osobie | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-KPK-framework-karne.md` → `mod-KK-kwalifikator-karnomaterialny.md`, jeśli framework wskaże TAK |
| Wykroczenie / mandat | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KW-kodeks-wykroczen.md` + w razie potrzeby `mod-KW-KPW-framework-szczegolowy.md` |
| Granica wykroczenie/przestępstwo | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-KPK-framework-karne.md` → kwalifikator + `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KW-kodeks-wykroczen.md` |
| Zatrzymanie / prawa podejrzanego | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-KPK-framework-karne.md` |
| Sprawa w toku / obrona | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-KPK-framework-karne.md` + skill `analiza-sadowa-v6` |

---

## KROK 1C — CENTRALNE JĄDRO KANCELARYJNE

Po detekcji trybu i przed przekazaniem sprawy do skilla dziedzinowego — wczytaj zależnie od potrzeby:

```text
Zawsze dla pism / strategii / akt / terminów / ryzyka / dowodów:
  view shared/KANCELARIA-WORKFLOW.md
  view shared/TRYBY-PROCESOWE.md
  view shared/RISK-ASSESSMENT.md

Gdy pismo lub ocena gotowości pisma:
  view shared/FORMAL-CHECK.md
  view shared/BRAKI-FORMALNE.md
  view shared/WARUNKI-SKUTECZNOSCI.md
  view shared/QUALITY-CHECK.md

Gdy termin / dowód / roszczenie / orzecznictwo / "co dalej":
  view shared/TERM-CALC.md
  view shared/PREKLUZJA-DOWODOWA.md
  view shared/DOWODY-METODOLOGIA.md
  view shared/ROSZCZENIA.md
  view shared/ORZECZENIA-HIERARCHIA.md
  view shared/STRATEGIA-PROCESOWA.md
```

Nie twórz lokalnych kopii tych modułów w routerze — router tylko orkiestruje.

---

## ISAP — AKTUALNOŚĆ PRAWA

Przed użyciem każdego modułu prawnego wczytaj:

```text
view shared/ISAP-AUDIT-PROTOCOL.md
view shared/ISAP-METRYKI-AKTOW.md
```

Nowe moduły postępowań publicznoprawnych:

```text
view prawo-polskie-v2/ROUTING-MAP.md
```

## STANDARD KOMPLETNOŚCI PRAWA POLSKIEGO

Dla każdej sprawy z prawa polskiego stosuj:
- `shared/MODULE-STANDARD-POLISH-LAW.md`
- `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`
- `references/modules/mod-BI-kontroler-kompletnosci-prawa-polskiego.md`
- `shared/ISAP-AUDIT-PROTOCOL.md`
- `shared/TEMPORAL-LAW-CHECK.md`
- `shared/LEGAL-QUALITY-GATE.md`
