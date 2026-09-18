# MODUŁ SHARED-ECONOMIC — KALKULATOR EKONOMICZNY KLAUZUL
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** klauzula zawiera stawkę %, PLN, termin, limit — i trzeba
> wyliczyć realną ekspozycję finansową. Działa jako silnik AUTOMATYCZNY
> po wykryciu klauzul z katalogu OEK.0.
>
> Uzupełnia mod-shared-ryzyko-kwant.md (ten moduł = kalkulacje klauzulowe;
> ryzyko-kwant = scoring agregowany i raport ryzyka dla zarządu).

---

## OEK.0 TRIGGERY AUTOMATYCZNE

```
Wywołaj ten moduł AUTOMATYCZNIE gdy wykryto:
  "% dziennie / miesięcznie" → OEK.2 (kara procentowa)
  "kara umowna [X PLN]"       → OEK.3 (kara kwotowa)
  "odsetki [%]"               → OEK.4 (odsetki)
  "odpowiedzialność do [X]"   → OEK.5 (limit odpowiedzialności)
  "wynagrodzenie [X PLN]"     → OEK.1 (wartość bazowa)
  "ubezpieczenie do [X]"      → OEK.5
  "opłata za wcześniejsze rozwiązanie [X%/PLN]" → OEK.6
```

---

## OEK.1 USTALENIE WARTOŚCI BAZOWEJ

```
PRZED KALKULACJĄ ustal wartość bazową (V):
  □ V = wynagrodzenie umowne (netto PLN) → podane przez użytkownika lub z umowy
  □ V = brak danych → zapytaj: "Podaj wartość umowy lub szacunek w PLN"
  □ V = szacunkowe → oznacz: [SZACUNEK — wynik orientacyjny]

Jeśli brak wartości i użytkownik nie może podać:
  → Kalkuluj dla V = 100.000 PLN jako ilustracja (zaznacz wyraźnie)
```

---

## OEK.2 KARA UMOWNA PROCENTOWA (STAWKA DZIENNA / MIESIĘCZNA)

```
FORMAT KALKULACJI:

Dla kary = X% za każdy dzień:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ KARA UMOWNA: [X]% DZIENNIE · WARTOŚĆ UMOWY: [V] PLN     │
├──────────┬────────────────┬────────────────┬─────────────┤
│ Dni opóź │ Kara (PLN)     │ % wartości um. │ WPŁYW       │
├──────────┼────────────────┼────────────────┼─────────────┤
│    7 dni │ [V × X% × 7]  │ [7X]%          │ NISKI       │
│   14 dni │ [V × X% × 14] │ [14X]%         │ NISKI       │
│   30 dni │ [V × X% × 30] │ [30X]%         │ ŚREDNI      │
│   60 dni │ [V × X% × 60] │ [60X]%         │ WYSOKI      │
│   90 dni │ [V × X% × 90] │ [90X]%         │ KRYTYCZNY   │
│  180 dni │ [V×X%×180]    │ [180X]%        │ KRYTYCZNY   │
│ CAP (gdy │ [cap PLN]      │ [cap/V]%       │ —           │
│  jest)   │                │                │             │
├──────────┴────────────────┴────────────────┴─────────────┤
│ PUNKT POKRYCIA KOSZTÓW: dzień [100/(X)]                  │
│ (przy ilu dniach kara = wartość całej umowy)              │
└──────────────────────────────────────────────────────────┘

SKALA WPŁYWU:
  NISKI:     kara < 10% wartości umowy
  ŚREDNI:    kara 10–25% wartości umowy
  WYSOKI:    kara 25–50% wartości umowy
  KRYTYCZNY: kara > 50% wartości umowy

PRZYKŁAD (0,5% dziennie, V = 200.000 PLN):
  30 dni  = 200.000 × 0,005 × 30  = 30.000 PLN   (15%)  ŚREDNI
  60 dni  = 200.000 × 0,005 × 60  = 60.000 PLN   (30%)  WYSOKI
  90 dni  = 200.000 × 0,005 × 90  = 90.000 PLN   (45%)  KRYTYCZNY
  Punkt pokrycia = 1/0,005 = 200 dni
```

---

## OEK.3 KARA UMOWNA KWOTOWA

```
Dla kary = X PLN (jedna kwota lub wielokrotność):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ KARA UMOWNA: [X] PLN JEDNORAZOWO                       │
├─────────────────────────────┬──────────────────────────┤
│ Kara jako % wartości umowy  │ [X/V × 100]%             │
│ Kara vs. marża umowy (est.) │ [X/marża × 100]%         │
│ POKRYCIE SZKODY             │ czy X pokrywa typową szkodę? │
│ MIARKOWANIE (art. 484 §2)   │ czy rażąco wygórowana?   │
│ WPŁYW                       │ NISKI / ŚREDNI / WYSOKI  │
└─────────────────────────────┴──────────────────────────┘

OCENA MIARKOWANIA:
  Kara > 3× wartości umowy → prawdopodobnie miarkowana przez sąd
  Kara > wartości umowy → ryzyko miarkowania
  Kara ~10–30% wartości umowy → zazwyczaj akceptowalna przez sądy
```

### OEK.3a Zastrzeżenia bezwzględnie obowiązujące (dodane 2026-07-30)

> Uzupełnienie w toku zewnętrznej analizy porównawczej klauzul kontraktowych —
> ten moduł kalkuluje SKUTEK FINANSOWY kary, ale nie zawierał dotąd wprost
> dwóch zastrzeżeń o charakterze bezwzględnie obowiązującym, które powinny
> towarzyszyć każdej kalkulacji z OEK.2/OEK.3 przy redakcji lub audycie klauzuli.

**1. Prawo do miarkowania (art. 484 §2 KC) jest NIEZRZEKALNE.** Żadna kalkulacja
z tego modułu nie zastępuje tego zastrzeżenia — nawet przy karze mieszczącej się
w widełkach "akceptowalnych" (10-30% wartości umowy), strona zobowiązana zachowuje
prawo żądania miarkowania, jeśli wykaże którąkolwiek z dwóch niezależnych,
rozłącznych przesłanek: (a) zobowiązanie wykonane w znacznej części, (b) kara
rażąco wygórowana. Próba zapisania w umowie zrzeczenia się tego prawa jest
bezskuteczna z mocy prawa — nie sugerować takiego zapisu jako realnego
zabezpieczenia przy redakcji klauzuli.

**2. Kara za zobowiązanie PIENIĘŻNE jest nieważna z mocy art. 483 §1 KC.**
Przed jakąkolwiek kalkulacją z OEK.2/OEK.3 zweryfikuj, czy zabezpieczane
zobowiązanie jest niepieniężne (np. termin realizacji, zachowanie poufności,
zakaz konkurencji) — jeśli kara dotyczy opóźnienia w ZAPŁACIE, cała klauzula
jest nieważna niezależnie od jej wysokości; właściwym zabezpieczeniem są
wyłącznie odsetki (patrz OEK.4). To częsty błąd redakcyjny w praktyce rynkowej —
flagować jako CRITICAL przy audycie, nie jako kwestię wysokości/miarkowania.

**3. Brak zastrzeżenia prawa do odszkodowania uzupełniającego** (art. 484 §1 zd. 2
KC) oznacza, że kara stanowi CAŁOŚĆ odszkodowania niezależnie od faktycznej
wysokości szkody. Przy kalkulacji z OEK.2/OEK.3 zawsze sprawdzić, czy klauzula
zawiera zdanie typu "Zastrzeżenie kary umownej nie wyłącza prawa do dochodzenia
odszkodowania przewyższającego jej wysokość na zasadach ogólnych" — brak tego
zastrzeżenia jest samodzielną, odrębną luką od samej wysokości kary.


---

## OEK.4 ODSETKI

```
ODSETKI UMOWNE vs. USTAWOWE:
  Ustawowe za opóźnienie 2024/2025: weryfikuj NBP → stopa referencyjna + 5,5 p.p.
  Maksymalne odsetki umowne: 2× ustawowe za opóźnienie (art. 481 §2¹ KC)
  → Weryfikuj: isap.sejm.gov.pl + web_search "odsetki ustawowe NBP [rok]"

Dla odsetek X% rocznie (P.A.) lub Y% miesięcznie:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ ODSETKI: [X]% P.A. · KAPITAŁ: [V] PLN              │
├────────────┬────────────────┬──────────────────────│
│ Okres      │ Odsetki (PLN)  │ vs. max ustawowe     │
├────────────┼────────────────┼──────────────────────│
│ 30 dni     │ [V×X/365×30]  │ [porównanie]          │
│ 90 dni     │ [V×X/365×90]  │ [porównanie]          │
│ 12 miesięcy│ [V×X%]        │ [porównanie]          │
└────────────┴────────────────┴──────────────────────┘

Jeśli odsetki > max ustawowe → KLAUZULA NIEWAŻNA w tej części (art. 481 §2¹ KC)
  → Skutek: zastosowanie odsetek maksymalnych (nie zero!)
```

---

## OEK.5 LIMIT ODPOWIEDZIALNOŚCI

```
KALKULATOR LUKI OCHRONY:

Dla limitu odpowiedzialności = L PLN przy wartości umowy V PLN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ LIMIT ODPOW.: [L] PLN · WARTOŚĆ UMOWY: [V] PLN         │
├──────────────────────────────┬─────────────────────────┤
│ Limit jako % wartości umowy  │ [L/V × 100]%            │
│ Scenariusz szkody małej      │ L vs. 10% V             │
│ Scenariusz szkody średniej   │ L vs. 50% V             │
│ Scenariusz szkody dużej      │ L vs. 100% V            │
│ Scenariusz szkody katastro.  │ L vs. 200% V            │
├──────────────────────────────┴─────────────────────────┤
│ LUKA przy szkodzie 100% V:   [V - L] PLN               │
│ UBEZPIECZENIE OC IT:         czy L ≤ suma OC dostawcy? │
└──────────────────────────────────────────────────────────┘

Scenariusze:
  Limit = 1× V (standard): pokrywa typowe szkody ✅
  Limit = 1 miesiąc opłaty: pokrywa ~1/12 V ⚠️
  Brak limitu: nieograniczona ekspozycja 🔴
```

### OEK.5a Rozróżnienie damnum emergens / lucrum cessans i wyjątek winy umyślnej
(dodane 2026-07-30, w toku zewnętrznej analizy porównawczej klauzul kontraktowych)

Kalkulacja liczbowa L vs. V (powyżej) NIE zastępuje weryfikacji, CO limit faktycznie
obejmuje. Dwa elementy o większym znaczeniu praktycznym niż sama wysokość limitu:

**1. Czy klauzula wyłącza lucrum cessans (utracone korzyści)?** Bez wyraźnego
wyłączenia, odpowiedzialność obejmuje zarówno rzeczywistą stratę (damnum emergens —
łatwą do oszacowania, np. koszt naprawy błędu) jak i utracone korzyści kontrahenta
(lucrum cessans — mogące wielokrotnie przewyższać wartość samej umowy, np. utracony
zysk z przestoju systemu). Praktyka rynkowa wskazuje wyłączenie lucrum cessans jako
pojedynczy, najważniejszy element ochronny tej klauzuli — ważniejszy niż sama
wysokość kwotowa limitu L. Przy audycie: brak tego wyłączenia = ryzyko, nawet gdy L
wygląda na "bezpieczny" w kalkulacji powyżej.

**2. Wyjątek winy umyślnej jest bezwzględnie obowiązujący.** Art. 473 §2 KC czyni
nieważnym z mocy prawa każde zastrzeżenie wyłączające odpowiedzialność za szkodę
wyrządzoną umyślnie — niezależnie od tego, czy strony to zapisały. Każda redakcja
limitu odpowiedzialności powinna zawierać ten wyjątek wprost (nie tylko milcząco go
zakładać) — jego brak w treści klauzuli nie unieważnia całej klauzuli, ale wprowadza
niejasność, którą przy sporze sąd i tak rozstrzygnie na korzyść wyjątku ustawowego.

**3. Asymetria limitu.** Jeśli L chroni tylko jedną stronę (np. wyłącznie Wykonawcę),
to nie jest samo w sobie wadą prawną, ale wymaga świadomej decyzji negocjacyjnej —
przy kalkulacji odnotuj wprost, czyją perspektywę L reprezentuje, zamiast przedstawiać
go jako neutralny wzorzec rynkowy.


---

## OEK.6 OPŁATA ZA WCZEŚNIEJSZE ROZWIĄZANIE

```
Dla opłaty = X% pozostałego wynagrodzenia:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ OPŁATA EXIT: [X]% · POZOSTAŁY CZAS: [M] miesięcy    │
│ WYNAGRODZENIE MIESIĘCZNE: [V/T] PLN                  │
├────────────────────┬────────────────────────────────│
│ Opłata za exit     │ [X/100 × V/T × M] PLN          │
│ po 6 miesiącach    │ [oblicz]                        │
│ po 12 miesiącach   │ [oblicz]                        │
│ PRÓG OPŁACALNOŚCI  │ po ilu m-cach exit = 0          │
│ WPŁYW              │ NISKI / ŚREDNI / WYSOKI         │
└────────────────────┴────────────────────────────────┘
```

---

## OEK.7 RAPORT ZBIORCZY RYZYK EKONOMICZNYCH

```
Generuj po przeskanowaniu całej umowy:

━━━ RAPORT EKONOMICZNY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ WARTOŚĆ UMOWY NETTO: [V] PLN                          │
├──────────────────────────┬───────────────────────────┤
│ Klauzula                 │ Max ekspozcja (PLN / %)   │
├──────────────────────────┼───────────────────────────┤
│ Kara za opóźnienie 30d   │ [PLN] ([%])               │
│ Kara za opóźnienie 90d   │ [PLN] ([%])               │
│ Limit odpowiedzialności  │ [PLN] ([%])               │
│ Opłata exit (12 m.)      │ [PLN] ([%])               │
│ Odsetki za zwłokę 90d    │ [PLN] ([%])               │
├──────────────────────────┼───────────────────────────┤
│ ŁĄCZNA EKSPOZYCJA MAX    │ [suma] ([%])    [WPŁYW]   │
├──────────────────────────┴───────────────────────────┤
│ REKOMENDACJA: [priorytet negocjacyjny klauzuli]      │
│ DZIAŁANIE: [co zmienić, poziom A/B/C/D z FL-library] │
└──────────────────────────────────────────────────────┘

WPŁYW ŁĄCZNY:
  <10% V:        NISKI        ✅ Ryzyko akceptowalne
  10–25% V:      ŚREDNI       ⚠️ Weryfikuj przed podpisaniem
  25–50% V:      WYSOKI       🔶 Wymagane renegocjacje
  >50% V:        KRYTYCZNY    🔴 Eskaluj do zarządu
```

---

## OEK.8 INTEGRACJA Z INNYMI MODUŁAMI

```
Automatyczne połączenia:
  → mod-shared-ryzyko-kwant.md: po OEK.7 → scoring agregowany
  → mod-shared-fallback-library.md: klauzule z wysokim wpływem → FL poziomy
  → mod-shared-orzecznictwo-umow.md: kara umowna → ORP.2
  → raport-klienta-v1: eksport danych do raportu biznesowego
```

---

*mod-shared-economic.md · Analizator Umów v1 · Kalkulator ekonomiczny*
*Triggerowany automatycznie przy klauzulach % / PLN / termin*
*Uzupełnia: mod-shared-ryzyko-kwant.md (scoring) + mod-shared-fallback-library.md (playbook)*
