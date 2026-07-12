# MODUŁ SHARED-ORZECZNICTWO-UMOW — PRECEDENSY KONTRAKTOWE
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** analiza klauzuli zakończona (Moduł B/C), użytkownik pyta
> o orzecznictwo konkretnej klauzuli, pismo wymagające powołania orzecznictwa,
> przygotowanie do negocjacji z powołaniem na linię orzeczniczą,
> ocena klauzuli przez pryzmat sądowej praktyki.
>
> Moduł działa jako silnik AUTOMATYCZNY po wykryciu klauzuli z katalogu ORP.1.

> ⛔ HARD GATE — ZERO SYGNATUR Z PAMIĘCI.
> Każda sygnatura musi być zweryfikowana ONLINE przed powołaniem.
> ```
> SN:          sn.pl → zakładka Orzecznictwo → wyszukaj sygnaturę lub tezy
> NSA:         orzeczenia.nsa.gov.pl → wyszukaj
> TSUE:        curia.europa.eu → wyszukaj numer sprawy C-XXX/XX
> SA (sądy apelacyjne): orzeczenia.ms.gov.pl → saos.org.pl
> SOKiK:       orzeczenia.ms.gov.pl → XVII AmC lub XVII AmA
> SAOS (open): https://www.saos.org.pl → pełnotekstowe bazy sądów
> ```
> Zakaz cytowania sygnatury jeśli nie znaleziono jej w oficjalnej bazie.
> Jeśli URL nie odpowiada → oznacz ⚠️ [NIEWERYFIKOWANE — sprawdź sn.pl/orzeczenia.ms].

---

## ORP.1 KATALOG KLAUZUL Z AUTOMATYCZNYM ORZECZNICTWEM

> Trigger: wykrycie klauzuli z poniższej listy → AUTOMATYCZNIE uruchom
> sekcję ORZECZNICTWO z tabelą SN/NSA/TSUE/SA.

```
Katalog triggerów (wykryj słowo kluczowe w klauzuli):
  "kara umowna" / "kara" / "penalty"        → ORP.2
  "odpowiedzialność" / "liability"           → ORP.3
  "wypowiedzenie" / "rozwiązanie umowy"      → ORP.4
  "zakaz konkurencji" / "non-compete"        → ORP.5
  "force majeure" / "siła wyższa"            → ORP.6
  "SLA" / "dostępność" / "uptime"            → ORP.7
  "wynagrodzenie" / "cena" / "faktura"       → ORP.8
  "prawa autorskie" / "IP" / "utwór"         → ORP.9
  "RODO" / "dane osobowe" / "DPA"            → ORP.10
  "gwarancja" / "rękojmia" / "reklamacja"    → ORP.11
  "zabezpieczenie" / "weksel" / "kaucja"     → ORP.12
  "klauzula abuzywna" / "385¹" / "UOKiK"    → ORP.13
```

---

## ORP.2 KARA UMOWNA

> Weryfikuj przed powołaniem: isap.sejm.gov.pl → KC → art. 484 + art. 483

### Linia dominująca SN
```
TEZA DOMINUJĄCA:
  Kara umowna może być miarkowana przez sąd gdy rażąco wygórowana (art. 484 §2 KC).
  Kryteria miarkowania: stosunek kary do wartości umowy, wina dłużnika,
  interes wierzyciela, zakres wykonania zobowiązania.

KLUCZOWE ORZECZENIA — weryfikuj w sn.pl przed powołaniem:
  → Uchwała SN III CZP (szukaj tezy: "miarkowalne rażące wygórowanie kary")
  → Wyrok SN V CSK (szukaj tezy: "kara umowna miarkowanie kryteria")
  Weryfikacja: web_search "SN kara umowna miarkowanie art 484 KC uchwała wyrok 2023 2024 2025"

TSUE — brak bezpośredniego zastosowania w B2B; w B2C → dyrektywa 93/13 + art. 385³ pkt 16

RYZYKA KONTRAKTOWE:
  ⚠️ Kara jednostronna (tylko dla jednej strony) → abuzywna w B2C (pkt 16)
  ⚠️ Kara powyżej wartości umowy → ryzyko miarkowania przez sąd
  ⚠️ Kara za niewykonanie + odszkodowanie za szkodę ponad karę → dopuszczalne jeśli zastrzeżono
  ⚠️ Kara za opóźnienie vs. kara za zwłokę — rozróżnienie krytyczne (art. 476 KC)

AUTOMATYCZNY KALKULATOR EKONOMICZNY:
  → Po wykryciu kary umownej → uruchom OEK.2 z mod-shared-economic.md
```

### Format sekcji ORZECZNICTWO w raporcie
```
━━━ ORZECZNICTWO: KARA UMOWNA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ SN   │ Teza: kara może być miarkowana gdy rażąco wygórowana    │
│      │ Kryteria: proporcja, wina, interes wierzyciela           │
│      │ Weryfikuj: sn.pl → szukaj "kara umowna miarkowanie"     │
│ TSUE │ C-415/11 (Mohamed Aziz) — kontrola abuzywności sądowa   │
│      │ weryfikuj: curia.europa.eu                               │
│ SA   │ Sądy apelacyjne: weryfikuj saos.org.pl                   │
│ LINIA│ DOMINUJĄCA: miarkowanie przy rażącym wygórowaniu ✅     │
│      │ ROZBIEŻNOŚCI: czy korekta dopuszczalna z urzędu — tak   │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ORP.3 ODPOWIEDZIALNOŚĆ UMOWNA

> Weryfikuj: isap.sejm.gov.pl → KC → art. 471, 473, 474, 484, 361

```
LINIA SN:
  Ograniczenie odpowiedzialności do kwoty wynagrodzenia — dopuszczalne w B2B
  Wyłączenie odpowiedzialności za utracone korzyści — dopuszczalne między przedsiębiorcami
  Wyłączenie za szkody wyrządzone umyślnie — NIEDOPUSZCZALNE (art. 473 §2 KC)
  → weryfikuj: web_search "SN ograniczenie odpowiedzialności umowna art 473 KC 2023 2024 2025"

TSUE (B2C):
  Wyłączenie odpowiedzialności za wady produktu cyfrowego → naruszenie dir. 2019/770
  → curia.europa.eu — weryfikuj tezy dot. dir. 2019/770

RYZYKA:
  ⚠️ "Odpowiedzialność wyłączona w całości" → nieważna (art. 473 §2 KC przy winie umyślnej)
  ⚠️ "Odpowiedzialność ograniczona do kwoty ubezpieczenia" → ryzyko gdy brak polisy
  ⚠️ Brak górnego limitu → nieograniczona ekspozycja (→ OEK.3 kalkulator)
```

---

## ORP.4 WYPOWIEDZENIE I ROZWIĄZANIE UMOWY

```
LINIA SN — umowy na czas nieokreślony:
  Każda umowa na czas nieokreślony jest co do zasady wypowiadalna
  Brak klauzuli wypowiedzenia nie pozbawia strony tego prawa
  → weryfikuj: sn.pl → "wypowiedzenie umowy czas nieokreślony"

LINIA SN — umowy na czas określony:
  Klauzule wyłączające prawo wypowiedzenia mogą być sprzeczne z art. 353¹ KC
  gdy naruszają naturę stosunku prawnego

RYZYKA:
  ⚠️ "Umowa obowiązuje do X roku bez możliwości wcześniejszego rozwiązania" → ryzyko
  ⚠️ Wypowiedzenie tylko przez jedną stronę (asymetryczne) → abuzywność B2C
  ⚠️ Brak określenia skutków natychmiastowego rozwiązania → luka kontraktowa
  ⚠️ Klauzula "bez wypowiedzenia z ważnych przyczyn" bez definicji ważnych przyczyn → ryzyko
```

---

## ORP.5 ZAKAZ KONKURENCJI

> Weryfikuj: isap.sejm.gov.pl → KP art. 101¹–101⁴ (pracowniczy) + KC art. 353¹ (B2B)

```
LINIA SN — zakaz konkurencji B2B:
  Zakaz konkurencji w umowie B2B → art. 353¹ KC (wolność umów)
  Ograniczenia: zbyt długi czas, zbyt szeroki zakres → nieważność (art. 58 KC)
  Brak wynagrodzenia: w B2B nie jest wymagane (inaczej niż KP) — ale może wpłynąć na ważność
  → weryfikuj: web_search "SN zakaz konkurencji B2B bez wynagrodzenia 2023 2024 2025"

LINIA SN — pracowniczy (art. 101¹–101⁴ KP):
  Brak określenia wynagrodzenia (co najmniej 25% wynagrodzenia) → nieważność
  Czas: po ustaniu stosunku pracy max wynagrodzenie × czas → weryfikuj KP

TSUE:
  C-279/21 (zakaz konkurencji prac. → ochrona) — weryfikuj curia.europa.eu

RYZYKA:
  ⚠️ Zakaz 5 lat dla całej branży → nieważny (zbyt szeroki, naruszenie wolności pracy)
  ⚠️ Brak wynagrodzenia w zakazie po-zatrudnieniowym B2B → ryzyko nieważności
  ⚠️ Brak definicji "działalności konkurencyjnej" → nieskuteczny
```

---

## ORP.6 SIŁA WYŻSZA I HARDSHIP

> Weryfikuj: isap.sejm.gov.pl → KC → art. 471 + art. 357¹

```
LINIA SN — siła wyższa:
  Siła wyższa wyłącza odpowiedzialność za niewykonanie (art. 471 KC)
  Definicja: zdarzenie zewnętrzne, niemożliwe do przewidzenia, niemożliwe do zapobieżenia
  COVID-19: orzecznictwo podzielone → nie zawsze = siła wyższa
  → weryfikuj: sn.pl → "siła wyższa COVID niemożliwość świadczenia"

LINIA SN — klauzula rebus sic stantibus (art. 357¹ KC):
  Nadzwyczajna zmiana stosunków → sąd może zmienić/rozwiązać umowę
  Wysoki próg: "niemożność" lub "rażąca strata" → weryfikuj orzecznictwo

RYZYKI:
  ⚠️ Zbyt wąska definicja FM (tylko "klęski żywiołowe") → wyklucza pandemię/wojnę
  ⚠️ Brak klauzuli renegocjacji hardship → luka (→ mod-shared-fm-hardship.md)
  ⚠️ Zbyt szerokie zwolnienie FM → naruszenie interesów wierzyciela
```

---

## ORP.7 SLA I DOSTĘPNOŚĆ USŁUG

```
LINIA SN (brak orzecznictwa wprost — analogia z odpowiedzialnością umowną):
  Naruszenie SLA = nienależyte wykonanie zobowiązania (art. 471 KC)
  Miarkowalne kary SLA: tak, na zasadach art. 484 §2 KC

TSUE (usługi cyfrowe):
  Dir. 2019/770: sprzedawca odpowiada za niezgodność usługi z umową przez cały czas
  → curia.europa.eu — weryfikuj orzeczenia dot. usług cyfrowych

RYZYKA:
  ⚠️ SLA 99,9% uptime bez definicji "planowanej przerwy" → lukę wykorzysta dostawca
  ⚠️ Ograniczenie odszkodowania za naruszenie SLA do "credits" (bonusy) → blokuje realne roszczenia
  ⚠️ Brak DRP/backup w SaaS → luka (→ MCD moduł brakujących klauzul)
  ⚠️ SLA tylko na "dostępność serwerów" bez SLA aplikacji → ukryta luka
```

---

## ORP.8–ORP.13 (SYNTETYCZNE — ROZWIŃ NA ŻĄDANIE)

```
ORP.8 WYNAGRODZENIE/CENA:
  Ryzyka: zmiana ceny bez prawa odstąpienia (abuzywna B2C), waloryzacja jedno/obustronna,
  klauzule walutowe — linia frankowa (→ aneks F KC-cywilne)
  Weryfikuj: sn.pl → "zmiana wynagrodzenia umowna waloryzacja" + franki

ORP.9 PRAWA AUTORSKIE/IP:
  Ryzyka: przeniesienie praw na nieznane pola eksploatacji → nieważne (art. 41 §4 PrAut)
  Wynagrodzenie oddzielne dla każdego pola → art. 45 PrAut
  Weryfikuj: isap.sejm.gov.pl → PrAut → art. 41–45

ORP.10 RODO/DPA:
  Ryzyka: brak DPA mimo powierzenia przetwarzania (art. 28 RODO) → naruszenie
  Klauzula "dane można przekazywać podwykonawcom bez ograniczeń" → abuzywna
  Weryfikuj: eur-lex.europa.eu → GDPR art. 28 + decyzje UODO: uodo.gov.pl

ORP.11 GWARANCJA/RĘKOJMIA:
  Wyłączenie rękojmi B2C → nieważne (art. 558 §2 KC — weryfikuj)
  Skrócenie terminów rękojmi B2C → nieważne
  Weryfikuj: isap.sejm.gov.pl → KC → art. 556–576

ORP.12 ZABEZPIECZENIA:
  Weksel In blanco: wymogi formalne, zakaz weksla w obrocie konsumenckim
  Poręczenie: art. 876 KC — akcesoryjność
  Weryfikuj: isap.sejm.gov.pl → KC + Prawo wekslowe

ORP.13 KLAUZULE ABUZYWNE:
  → Rozwinięcie pełne w mod-shared-abusive-clauses.md
  Weryfikuj: rejestr.uokik.gov.pl + orzeczenia XVII AmC SOKiK
```

---

## ORP.14 FORMAT SEKCJI ORZECZNICTWA W RAPORCIE

```
Po wykryciu klauzuli z ORP.1 → ZAWSZE generuj sekcję:

━━━ ORZECZNICTWO: [NAZWA KLAUZULI] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ OCENIANA?    │ TAK / NIE / POŚREDNIO                           │
│ SN           │ [teza dominująca] → weryfikuj: sn.pl           │
│              │ Kierunek: [korzystny/niekorzystny/rozbieżny]    │
│ TSUE         │ [sprawa + teza] → weryfikuj: curia.europa.eu   │
│ SA/SOKiK     │ [kierunek] → weryfikuj: orzeczenia.ms.gov.pl   │
│ LINIA        │ DOMINUJĄCA / ROZBIEŻNA / BRAK ORZECZNICTWA     │
│ WPŁYW NA RYZYKO │ ↑ ryzyko / ↓ ryzyko / neutralny           │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Po wygenerowaniu sekcji → WYWOŁAJ orzeczenia-sadowe-v2:
  view /mnt/skills/user/orzeczenia-sadowe-v2/SKILL.md
  → wyszukaj aktualne orzeczenia dla wskazanej klauzuli/przepisu
```

---

## ORP.15 ŹRÓDŁA ONLINE

```
sn.pl                             → wyroki, uchwały SN (w tym zasady prawne)
orzeczenia.ms.gov.pl              → XVII AmC (SOKiK), sądy apelacyjne
saos.org.pl                       → open data baza orzeczeń
curia.europa.eu                   → TSUE (wyszukaj: C-XXX/YY lub teza)
orzeczenia.nsa.gov.pl             → sprawy administracyjne/podatkowe
uokik.gov.pl/decyzje              → decyzje UOKiK dot. klauzul

web_search (generuj przed raportem):
  "SN wyrok [klauzula] [rok] sygn." → weryfikuj istnienie
  "TSUE wyrok [klauzula] [rok] C-"  → weryfikuj istnienie
  "SOKiK XVII AmC [rok] klauzula abuzywna [typ]"
```

---

*mod-shared-orzecznictwo-umow.md · Analizator Umów v1 · Silnik orzeczniczy*
*Triggerowany automatycznie przy klauzulach z katalogu ORP.1*
*Weryfikacja obowiązkowa: sn.pl · orzeczenia.ms.gov.pl · curia.europa.eu*
