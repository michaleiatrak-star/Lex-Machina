# KROK 1 — Detekcja Trybu i Hard Gate Weryfikacji

> Plik wydzielony z prawny-router-v3/SKILL.md (R1).
> Wczytaj po KROK 0A, przed KROK 2 (klasyfikacja [1]–[10]).
> Wywołanie: `view /mnt/skills/user/prawny-router-v3/references/KROK1-detekcja.md`

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
> Procedura szczegółowa: `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`
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

V2 — Wczytaj skill dziedzinowy (view — obowiązkowe)
  ZASADA: ZAWSZE moduł slim (mod-X) najpierw → on wskaże czy potrzebny pełny framework.
  Karne / kwalifikacja:        view .../modules/mod-N-karne.md
                               → mod-N decyduje (sekcja DECYZJA O KWALIFIKATORZE)
                                 czy potrzebny kwalifikator-karnomaterialny.md
  Wykroczenie:                 view .../modules/mod-I-wykroczenia.md
  Pracownicze:                 view .../modules/mod-A-prawo-pracy.md
  Mobbing:                     view .../modules/mod-B-mobbing.md
  Cywilne / odszkodowanie:     view .../modules/mod-E-cywilne.md
  Rodzinne / alimenty:         view .../modules/mod-C-rodzinne.md
  Spadkowe:                    view .../modules/mod-D-spadkowe.md
  Administracyjne / KPA:       view .../modules/mod-G-administracyjne.md
  ZUS / emerytury:             view .../modules/mod-H-zus.md
  Stalking / nękanie:          view .../modules/mod-J-stalking.md
  Gospodarcze / spółki:        view .../modules/mod-L-gospodarcze.md
  Działalność regulowana:      view .../modules/mod-AE-dzialalnosc-regulowana.md
  Nieruchomości / najem:       view .../modules/mod-M-nieruchomosci.md
  Konsumenckie:                view .../modules/mod-F-konsumenckie.md
  IP / autorskie / wizerunek:  view .../modules/mod-O-wlasnosc-intelektualna.md
  RODO:                        view .../modules/mod-P-rodo.md
  Podatkowe / PIT/VAT/KAS:     view .../modules/mod-Q-podatkowe.md
  Akcyza / cło / CN / UCC:     view .../modules/mod-AD-akcyza-clo.md
  Ubezpieczenia / OC/AC:       view .../modules/mod-R-ubezpieczenia.md
  Przemoc domowa:              view .../modules/mod-S-przemoc-domowa.md
  Cyberprzestępczość:          view .../modules/mod-T-cyberprzestepstwa.md
  Cudzoziemcy / pobyt:         view .../modules/mod-U-cudzoziemcy.md
  Błąd medyczny / pacjent:     view .../modules/mod-V-medyczne.md
  Budowlane / samowola:        view .../modules/mod-W-budowlane.md
  Zamówienia / KIO / PZP:      view .../modules/mod-X-zamowienia-publiczne.md
                               → dla OPZ/SWZ/parametrów: view .../modules/mod-X-compliance-swz.md
  Środowisko / OOŚ:            view .../modules/mod-Y-ochrona-srodowiska.md
  Chemikalia / REACH / CLP:    view .../modules/mod-AC-chemikalia-reach.md
  AI Act / prawo AI:           view .../modules/mod-AB-prawo-ai.md
  Wielodziedzinowe:            view /mnt/skills/user/prawo-polskie-v2/SKILL.md

  Ścieżka bazowa modułów: /mnt/skills/user/prawo-polskie-v2/references/modules/

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
| Nieznana kwalifikacja czynu | mod-N-karne.md → decyzja o kwalifikatorze |
| Kradzież / rozbój / zniszczenie | mod-N-karne.md → kwalifikator jeśli mod-N wskaże TAK |
| Przestępstwo przeciwko osobie | mod-N-karne.md → kwalifikator jeśli mod-N wskaże TAK |
| Wykroczenie / mandat | wykroczenia.md |
| Granica wykroczenie/przestępstwo | mod-N-karne.md → kwalifikator TAK + wykroczenia.md |
| Zatrzymanie / prawa podejrzanego | prawo-karne.md |
| Sprawa w toku / obrona | prawo-karne.md + analiza-sadowa-v6 |

---

## KROK 1C — CENTRALNE JĄDRO KANCELARYJNE

Po detekcji trybu i przed przekazaniem sprawy do skilla dziedzinowego — wczytaj zależnie od potrzeby:

```text
Zawsze dla pism / strategii / akt / terminów / ryzyka / dowodów:
  view /mnt/skills/user/shared/KANCELARIA-WORKFLOW.md
  view /mnt/skills/user/shared/TRYBY-PROCESOWE.md
  view /mnt/skills/user/shared/RISK-ASSESSMENT.md

Gdy pismo lub ocena gotowości pisma:
  view /mnt/skills/user/shared/FORMAL-CHECK.md
  view /mnt/skills/user/shared/BRAKI-FORMALNE.md
  view /mnt/skills/user/shared/WARUNKI-SKUTECZNOSCI.md
  view /mnt/skills/user/shared/QUALITY-CHECK.md

Gdy termin / dowód / roszczenie / orzecznictwo / "co dalej":
  view /mnt/skills/user/shared/TERM-CALC.md
  view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md
  view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md
  view /mnt/skills/user/shared/ROSZCZENIA.md
  view /mnt/skills/user/shared/ORZECZENIA-HIERARCHIA.md
  view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md
```

Nie twórz lokalnych kopii tych modułów w routerze — router tylko orkiestruje.

---

## ISAP — AKTUALNOŚĆ PRAWA

Przed użyciem każdego modułu prawnego wczytaj:

```text
view /mnt/skills/user/shared/ISAP-AUDIT-PROTOCOL.md
view /mnt/skills/user/shared/ISAP-METRYKI-AKTOW.md
```

Nowe moduły postępowań publicznoprawnych:

```text
view /mnt/skills/user/prawo-polskie-v2/ROUTING-MAP.md
```

## STANDARD KOMPLETNOŚCI PRAWA POLSKIEGO

Dla każdej sprawy z prawa polskiego stosuj:
- `shared/MODULE-STANDARD-POLISH-LAW.md`
- `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`
- `references/modules/mod-BI-kontroler-kompletnosci-prawa-polskiego.md`
- `shared/ISAP-AUDIT-PROTOCOL.md`
- `shared/TEMPORAL-LAW-CHECK.md`
- `shared/LEGAL-QUALITY-GATE.md`
