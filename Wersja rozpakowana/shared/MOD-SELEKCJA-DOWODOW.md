# MOD-SELEKCJA-DOWODOW — automatyczna selekcja dowodów do tez z oceną ryzyka

> Status: shared canonical. Wywoływany w KROK 4a.5 (`analizator-dowodow-v3`),
> PO `MOD-MAPA-PRZEPISOW.md` (KROK 4a.3), PRZED przekazaniem do
> `pisma-procesowe-v3` W1.3.
>
> ⛔ HARDGATE-SD-01: Żaden dowód z RYZYKIEM KRZYŻOWYM WYSOKIM lub KRYTYCZNYM
> nie jest pre-zaznaczany automatycznie — wymaga jawnej decyzji użytkownika.
> System nigdy nie podejmuje tej decyzji za użytkownika.
>
> ⛔ HARDGATE-SD-02: Każde ostrzeżenie KRZYŻOWE musi wskazywać KONKRETNY
> fragment dowodu i KONKRETNY aspekt/tezę, któremu szkodzi. Ogólnikowe
> ostrzeżenia ("ten dowód może być ryzykowny") są ZAKAZANE.
>
> Zależności wejściowe:
>   MD1/MD2-ekstrakcja (korpus dowodów A-D)
>   MD4-pokrycie (mapa przesłanek)
>   MOD-PRIORYTETY-ASPEKTOW.md (aspekty_glowne/aspekty_poboczne)
>   MOD-MAPA-PRZEPISOW.md (mapa_przepisow — przesłanki kandydujących przepisów)
>   shared/DOWODY-METODOLOGIA.md (klasyfikacja Bezpośredni/Pośredni/Wspierający)
>   shared/STRATEGIA-PROCESOWA.md (ryzyko ujawnienia)
>   shared/RISK-ASSESSMENT.md (skala ryzyka)
>
> Zależności wyjściowe:
>   pisma-procesowe-v3 W1.3 (mapa cel→przesłanka→dowód — wypełniana wstępnie)
>   MOD-HISTORIA-STRATEGII.md (pole selekcja_dowodow)

---

## 1. Cel modułu

Dla każdej tezy/żądania (aspekty_glowne z MOD-PRIORYTETY-ASPEKTOW) moduł:

1. Automatycznie WYBIERA dowody z korpusu (MD1/MD2) pasujące do przesłanek
   tezy — z rankingiem wg kategorii i triangulacji (§2),
2. Ocenia każdy dowód w 3 wymiarach ryzyka (§3):
   a) RYZYKO WŁASNE — słabości formalne/dowodowe,
   b) RYZYKO KRZYŻOWE — czy dowód szkodzi innej tezie TEJ SAMEJ SPRAWY,
   c) RYZYKO UJAWNIENIA — strategiczny koszt pokazania dowodu stronie przeciwnej,
3. Prezentuje checklistę tekstową do zatwierdzenia (§4),
4. Automatycznie WYPEŁNIA W1.3 pisma-procesowe-v3 na podstawie zatwierdzonego
   wyboru (§5).

---

## 2. KROK 1 — Automatyczny wybór dowodów per teza

### 2.1 Źródło: korpus dowodów

```
Korpus = wszystkie dowody z MD1/MD2-ekstrakcja:
  DOC-ID, typ, kategoria (A/B/C/D), opis, fakty pokrywane (evidence_map MD4),
  status (bezsporne/sporne/wymaga weryfikacji)
```

### 2.2 Algorytm wyboru

```
DLA KAŻDEGO aspektu_glowne ASP-X:

  POBIERZ przesłanki z mapa_przepisow[ASP-X] — przepisy o głębokość=
  BEZPOŚREDNIE (MOD-MAPA-PRZEPISOW §3.1). Jeśli brak → fallback do
  MD4-pokrycie (mapa przesłanek z opisu aspektu).

  DLA KAŻDEJ przesłanki P:
    1. Z korpusu wybierz dowody pokrywające fakty istotne dla P
       (evidence_map MD4, pole F[NN] powiązany z P).
    2. Jeśli brak bezpośrednich → sprawdź POŚREDNIE i WSPIERAJĄCE
       (DOWODY-METODOLOGIA §2).
    3. Ranking: A > B > C > D; przy równej kategorii — triangulowany
       (MET-TRI jeśli wykonano) > pojedynczy kanał.
    4. TOP-3 kandydatów per przesłanka (nie per aspekt). Ten sam dowód
       dla wielu przesłanek → pojawia się raz z listą przesłanek.

  NIE WYBIERAJ automatycznie:
    - dowodów kategorii D → oznacz jako LUKA,
    - dowodów z wada formalna [⛔] MD3a bez możliwości sanowania.
```

### 2.3 Obsługa luk dowodowych

```
LUKA KRYTYCZNA — brak kandydata A/B/C dla przesłanki niezbędnej do roszczenia:
  ⬛ pismo nie powinno być złożone bez uzupełnienia.
  Propozycja: wniosek o zobowiązanie strony przeciwnej / powołanie biegłego /
  uzyskanie dokumentu od klienta [konkretny opis].

LUKA ISTOTNA — tylko kandydaci C/D dla przesłanki:
  ⬛ pismo wykonalne, słaba pozycja — rekomenduj wzmocnienie przed złożeniem.
```

---

## 3. KROK 2 — Ocena ryzyka per dowód (3 wymiary)

### 3.1 Wymiar A — RYZYKO WŁASNE

```
A1. Kategoria: A (dokument urzędowy) → D (brak dostępu/niekompletny)
A2. Wady formalne (MD3a):
    brak oryginału, brak podpisu, skan bez potwierdzenia → [FORMA-RYZYKO]
A3. Sporność treści:
    status "sporne" w MD1 lub MD3c wykazało sprzeczność → [SPORNY-RYZYKO]
A4. Kontrargument:
    łatwość zakwestionowania przez stronę przeciwną (z MP4/MP5 jeśli
    wykonano; inaczej: ogólna ocena z kategorii i statusu)

WYNIK A: niskie / średnie / wysokie / krytyczne (RISK-ASSESSMENT §1)
```

### 3.2 Wymiar B — RYZYKO KRZYŻOWE

```
Sprawdza, czy powołując dowód D dla tezy T_A, strona nie ujawnia treści
SZKODZĄCEJ tezie T_B w tej samej sprawie.

Rozszerzenie logiki self-destructive-admissions-engine-v10
(pisma-procesowe-v3 DODATEK V10) — zastosowane do WŁASNYCH DOWODÓW przed
ich powołaniem, nie tylko do pism przeciwnika po ich złożeniu.

KROK B1 — Lista aktywnych tez:
  Wszystkie aspekty_glowne + aspekty_poboczne z MOD-PRIORYTETY-ASPEKTOW.

KROK B2 — Test krzyżowy per dowód D kandydujący do T_A:
  DLA KAŻDEJ tezy T_B ≠ T_A:
    Pytanie: "Czy treść/fakty z D zawierają twierdzenia, które PRZECZĄ
    lub OSŁABIAJĄ przesłanki T_B?"

    SZCZEGÓLNA UWAGA na przyznania pośrednie:
      D może nie zaprzeczać T_B wprost, ale logicznie implikować fakt
      wykluczający przesłankę T_B.

    PRZYKŁAD KANONICZNY:
      D1 = e-mail potwierdzający godziny pracy (wspiera T_A: nadgodziny)
      Ale: "wykonałem to z domu w weekend" → implikuje pracę zdalną bez
        ewidencji → podważa T_B: zwrot kosztów dojazdu (zakłada stacjonarne).
      WYNIK: D1 ma RYZYKO KRZYŻOWE dla T_B.

KROK B3 — Waga ryzyka krzyżowego:
  KRYTYCZNE: fakt z D WYKLUCZA przesłankę T_B (T_B nie może zostać
    uwzględniona jeśli D jest w aktach)
  WYSOKIE: fakt z D OSŁABIA przesłankę T_B (strona może T_B atakować
    powołując się na D)
  ŚREDNIE: fakt tworzy WĄTPLIWOŚĆ co do T_B (wymaga wnioskowania)
  NISKIE: marginalnie niekompatybilny, nieistotny praktycznie

KROK B4 — Opcje reakcji:
  KRYTYCZNE/WYSOKIE → dowód NIE pre-zaznaczony (HARDGATE-SD-01):
    [ Użyj mimo ryzyka (porzuć lub ogranicz T_B) ]
    [ Nie używaj ]
    [ Wyciąg częściowy — wnioskuj o ujawnienie tylko fragmentu X ]
  ŚREDNIE → pre-zaznaczony z ostrzeżeniem widocznym; opcja "Potwierdź"
  NISKIE → pre-zaznaczony, ryzyko jako uwaga

KROK B5 — Format ostrzeżenia (HARDGATE-SD-02, obowiązkowy):
  "🔴 RYZYKO KRZYŻOWE [waga]:
   Dowód [DOC-ID], fragment: '[opis konkretnego fragmentu/twierdzenia]'
   → podważa/wyklucza/osłabia tezę [ASP-X]: [opis mechanizmu]
   → Implikacja procesowa: [co strona przeciwna może z tego zbudować]"
```

### 3.3 Wymiar C — RYZYKO UJAWNIENIA

```
Bazuje na STRATEGIA-PROCESOWA.md §3 (zasada nieujawniania przedwcześnie).

TEST:
  C1. Czy strona przeciwna ZUPEŁNIE NIE ZNA treści dowodu?
    TAK + dowód istotny strategicznie → złożenie w piśmie daje czas na
    kontratak. Rozważ: złożyć przy głosie (rozprawa) zamiast w piśmie?
  C2. Czy ujawnienie otwiera temat, który strona może rozwinąć na
    własną korzyść? (dowód kontekstowy — "puszka Pandory")

SKALA:
  BEZPIECZNE — strona zna lub ujawnienie nie daje jej przewagi
  RYZYKOWNE — może efektywnie wykorzystać ujawnienie; lepsze alternatywne
    źródło pokrywające tę samą przesłankę
  SZKODLIWE — ujawnienie teraz zdecydowanie szkodzi; poczekaj do rozprawy
    lub nie ujawniaj (jeśli nie jest jedynym dowodem przesłanki)

UWAGA: jeśli D jest JEDYNYM dowodem przesłanki P → ryzyko ujawnienia ma
mniejsze znaczenie praktyczne (pismo nie może obejść się bez D).
Zaznacz to w prezentacji ("jedyny dowód tej przesłanki").
```

---

## 4. KROK 3 — Format checklisty (tekstowy, per żądanie/aspekt)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELEKCJA DOWODÓW — [opis aspektu ASP-X]
Teza: [treść żądania]
Przepis kandydujący: ⚠️ [akt] art. [X] (NIEWERYFIKOWANE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRZESŁANKA [1]: [opis przesłanki]

  ☑ DOC-3 [kat. A] Wyciąg z listy obecności 03-09/2025
    Ryzyko własne:     NISKIE
    Ryzyko krzyżowe:   BRAK
    Ryzyko ujawnienia: BEZPIECZNE (strona przeciwna złożyła kopię)
    Rekomendacja: ✅ UŻYJ

  ☑ DOC-7 [kat. B] Zestawienie nadgodzin z systemu HR — ALTERNATYWNY
    Ryzyko własne:     ŚREDNIE [brak potwierdzenia autentyczności — FORMA-RYZYKO]
    Ryzyko krzyżowe:   BRAK
    Ryzyko ujawnienia: BEZPIECZNE
    Rekomendacja: ✅ UŻYJ (jako backup jeśli DOC-3 zakwestionowany)

PRZESŁANKA [2]: [opis przesłanki]

  ☐ DOC-1 [kat. A] E-mail z 14.09.2025 z potwierdzeniem pracy
    🔴 RYZYKO KRZYŻOWE KRYTYCZNE:
       Fragment: "wykonałem raport z domu w weekend, bez wpisania do ewidencji"
       → wyklucza przesłankę ASP-3 (roszczenie o koszty dojazdu — zakłada
         pracę stacjonarną w tym okresie)
       → Implikacja: pozwana może powołać ten e-mail jako dowód pracy zdalnej
         i żądać oddalenia ASP-3 w całości
    Ryzyko ujawnienia: RYZYKOWNE (pozwana nie ma kopii)
    Opcje: [ Użyj mimo ryzyka (rozważ porzucenie ASP-3) ]
            [ Nie używaj DOC-1 ] [ Wyciąg — tylko fragment bez akapitu 3 ]

  ⬛ LUKA ISTOTNA: brak innego dowodu kat. A/B/C dla tej przesłanki poza DOC-1
     Działanie: rozważ wniosek o zobowiązanie pozwanej do przedłożenia
     pełnej ewidencji czasu pracy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PODSUMOWANIE ASP-X:
✅ Rekomendowane: 2 | ⚠️ Z ostrzeżeniami: 0 | 🔴 Do decyzji: 1 | ⬛ Luki: 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ Zatwierdź wybór i przejdź do W1 ]
```

### Reguła pre-zaznaczenia

```
☑ (zaznaczony domyślnie) → TYLKO gdy:
  ryzyko własne ≤ ŚREDNIE ORAZ krzyżowe = BRAK/NISKIE ORAZ ujawnienie ≠
  SZKODLIWE lub D jest jedynym dowodem przesłanki.

☐ (odznaczony, wymaga jawnej decyzji) → gdy:
  krzyżowe = WYSOKIE/KRYTYCZNE (zawsze — HARDGATE-SD-01),
  LUB ujawnienie = SZKODLIWE + istnieje alternatywny dowód,
  LUB kategoria D.
```

---

## 5. KROK 4 — Automatyczne wypełnienie W1.3

Po zatwierdzeniu checklisty wynik wypełnia W1.3 pisma-procesowe-v3:

```
W1.3 — MAPA: CEL → PRZESŁANKA → DOWÓD
[WYGENEROWANE PRZEZ MOD-SELEKCJA-DOWODOW — zatwierdź lub zmień poniżej]

┌─────────────────────────────────────────────────────────────────┐
│ ŻĄDANIE [nr]: [treść żądania — z aspektu ASP-X]                 │
├─────────────────────────────────────────────────────────────────┤
│ Przesłanka [1]: [opis — z mapa_przepisow lub MD4]               │
│   Dowód:  DOC-3 — [opis] — kat. A (Bezpośredni)                │
│   Siła:   A — dokument urzędowy/poświadczony                    │
│ Przesłanka [2]: [opis]                                           │
│   Dowód:  ⬛ LUKA — wniosek o zobowiązanie do przedłożenia      │
│   Siła:   — (brak w tej chwili)                                  │
├─────────────────────────────────────────────────────────────────┤
│ Słabe punkty: DOC-7 wymaga weryfikacji autentyczności w W3       │
│ Luki:         LUKA ISTOTNA przesłanka [2] — patrz działanie     │
└─────────────────────────────────────────────────────────────────┘

REGUŁY INTEGRACJI z pisma-procesowe-v3 W1.3:
  - Ten blok ZASTĘPUJE ręczne wypełnienie W1.3.
  - Checkpoint W1→W2: użytkownik widzi wstępnie wypełnioną mapę i może:
    a) zatwierdzić całość ("tak" / "dalej" / "redaguj"),
    b) zamienić konkretny dowód (podając inny DOC-ID),
    c) oznaczyć przesłankę jako "pomijam świadomie" (decyzja strategiczna).
  - Zmiany w checkpoint zapisywane do historii strategii (§6).
  - Przepisy pozostają jako ⚠️ [WERYFIKACJA W3] — W1.3 nie weryfikuje
    Dz.U. (to W3.1 jak dotychczas — PRAWO-HARDGATE nienaruszony).
```

### Integracja z W1.5 (braki krytyczne)

```
Każda LUKA KRYTYCZNA z §2.3 → automatycznie trafia do W1.5 jako:
  ⬛ BRAK KRYTYCZNY: [przesłanka] — brak dowodu kategorii A/B/C
    Działanie: [propozycja uzupełnienia z §2.3]

Każda LUKA ISTOTNA → jako:
  ⬛ BRAK ISTOTNY: [przesłanka] — tylko dowód kategorii C/D dostępny
```

---

## 6. Zapis do historii strategii

```json
{
  "selekcja_dowodow": {
    "ASP-1": {
      "preslanka_1": {
        "dowod": "DOC-3",
        "ryzyko_wlasne": "niskie",
        "ryzyko_krzyzowe": "brak",
        "ryzyko_ujawnienia": "bezpieczne",
        "status": "zatwierdzony"
      },
      "preslanka_2": {
        "dowod": null,
        "status": "luka_istotna",
        "dzialanie": "wniosek o zobowiazanie do przedlozenia"
      }
    },
    "ostrzezenia_krzyzowe": [
      {
        "dowod_id": "DOC-1",
        "tezy_wspieram": ["ASP-1"],
        "szkodzi_tezie": "ASP-3",
        "fragment": "wykonalem raport z domu w weekend",
        "waga": "krytyczne",
        "decyzja": "nie_uzywam"
      }
    ],
    "timestamp": "..."
  }
}
```

---

## 7. Self-check przed KROK 4a.5

```
□ Czy korpus dowodów MD1/MD2 wczytany PRZED uruchomieniem?
□ Czy MD4-pokrycie (mapa przesłanek) dostępna?
□ Czy lista aspektów (aspekty_glowne) z MOD-PRIORYTETY-ASPEKTOW gotowa?
□ Czy test krzyżowy (§3.2 B2) wykonany DLA KAŻDEGO kandydata, nie tylko tych
  z ryzykiem własnym > niskie?
□ Każde ostrzeżenie KRZYŻOWE zawiera: DOC-ID + konkretny fragment + konkretna
  teza, której szkodzi + waga (HARDGATE-SD-02)?
□ Żaden dowód KRZYŻOWE=WYSOKIE/KRYTYCZNE nie ma statusu pre-zaznaczony
  (HARDGATE-SD-01)?
□ Luki (KRYTYCZNA/ISTOTNA) mają konkretną propozycję uzupełnienia?
□ W1.3 wypełnione TYLKO zatwierdzonym wyborem — odrzucone przez użytkownika
  nie wchodzą do mapy?
□ Wynik zapisany do historii strategii (§6)?
Którykolwiek = NIE → zatrzymaj, uzupełnij przed prezentacją.
```
