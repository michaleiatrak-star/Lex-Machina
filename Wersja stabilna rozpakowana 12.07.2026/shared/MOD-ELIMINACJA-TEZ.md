# MOD-ELIMINACJA-TEZ — Eliminacja Tez, Żądań i Przepisów bez Pokrycia Prawnego

> **Plik:** `/mnt/skills/user/shared/MOD-ELIMINACJA-TEZ.md`
> **Status:** PRODUKCJA — plik kanoniczny shared
> **Pozycja w pipeline:**
>   - pisma-procesowe-v3: W1.2a-POST — PO CLAIM-VALIDATION, PRZED W1.3
>   - analizator-dowodow-v3: BLOK-C (po analizie faktów, przed tezami)
> **Wywołanie:** `view /mnt/skills/user/shared/MOD-ELIMINACJA-TEZ.md`
> **Trigger:** OBOWIĄZKOWY per każde żądanie i każdą tezę główną

---

## DLACZEGO TEN MODUŁ ISTNIEJE

CLAIM-VALIDATION (istniejący) sprawdza: czy twierdzenie ma pokrycie
w materiale dowodowym.

PRAWO-HARDGATE (istniejący) sprawdza: czy przepis istnieje i jest aktualny.

**Luka systemowa:** żaden moduł nie sprawdzał czy:
1. Powołany przepis faktycznie DOTYCZY tej sytuacji (subsumpcja),
2. Żądanie procesowe ma PRZEPIS który je przewiduje,
3. Przepis wczytany z DOKUMENTU STRONY jest prawidłowy i aktualny,
4. Wszystkie PRZESŁANKI przepisu są spełnione przez fakty sprawy.

Materiał dowodowy może zawierać błędne przepisy (strona cytuje nieaktualny
art., kancelaria przeciwnika powołuje się na uchylony przepis, pismo
zawiera literówkę w numerze artykułu). System dotychczas mógł je
reprodukować bez weryfikacji.

**Zasada nadrzędna tego modułu:**
> Wytyczną jest PRAWO — nie materiał dowodowy, nie pismo strony.
> Jeśli dokument strony cytuje przepis → weryfikuj czy przepis istnieje
> i czy ma zastosowanie. Jeśli nie → eliminuj żądanie lub koryguj podstawę.

---

## ET-1 — CROSS-CHECK PER ŻĄDANIE (3 pytania)

```
Per każde żądanie z petitum — przed W1.3 — zadaj 3 pytania:

ET-Q1: CZY ŻĄDANIE MA PRZEPIS KTÓRY JE PRZEWIDUJE?
  → Zidentyfikuj typ żądania: ustalenie / zasądzenie / zobowiązanie
  → Zidentyfikuj przepis materialnoprawny (KP/KC/KPC) który daje
    powodowi prawo do tego konkretnego żądania
  → Zweryfikuj przepis online (PRAWO-HARDGATE: ISAP)
  → TAK → przejdź do ET-Q2
  → NIE → ⛔ ELIMINACJA ŻĄDANIA lub KOREKTA PODSTAWY PRAWNEJ

ET-Q2: CZY PRZESŁANKI PRZEPISU SĄ SPEŁNIONE PRZEZ FAKTY SPRAWY?
  → Wypisz przesłanki przepisu (z treści art., nie z pamięci)
  → Per każda przesłanka: czy wynika z materiału dowodowego (F-nn)?
  → WSZYSTKIE → ✅ żądanie zasadne
  → CZĘŚĆ → ⚠️ żądanie częściowe lub ewentualne
  → ŻADNA → ⛔ ELIMINACJA — żądanie bez podstawy faktycznej

ET-Q3: CZY PRZEPIS Z MATERIAŁU DOWODOWEGO JEST PRAWIDŁOWY?
  → Jeśli pismo / dokument strony zawiera powołanie przepisu:
    czy ten przepis został samodzielnie zweryfikowany (nie przepisany)?
  → TAK (zweryfikowany) → OK
  → NIE (przepisany z dokumentu) → ⛔ WERYFIKACJA OBOWIĄZKOWA
    → web_search: "[art. X] [ustawa] isap.sejm.gov.pl tekst jednolity"
    → Jeśli przepis nieaktualny / uchylony / błędny → KORYGUJ
    → Jeśli przepis z innego aktu → KORYGUJ na właściwy
```

---

## ET-2 — SUBSUMPCJA: PRZEPIS ↔ FAKT (krok obowiązkowy)

Subsumpcja = sprawdzenie czy konkretny fakt F-nn spełnia konkretną
przesłankę przepisu art. X §Y. To jest najgłębszy poziom weryfikacji.

```
Format per przesłanka przepisu:

PRZEPIS: art. X §Y [ustawa]
PRZESŁANKA P[n]: [treść przesłanki wynikająca z przepisu]
FAKT F-nn: [fakt ze sprawy który ma spełniać tę przesłankę]
─────────────────────────────────────────────────────────
SUBSUMPCJA:
  Czy F-nn spełnia P[n]?
  TAK, bo [wyjaśnienie jak fakt realizuje przesłankę]     → ✅ SPEŁNIONA
  CZĘŚCIOWO, bo [co jest spełnione, a co nie]             → ⚠️ CZĘŚCIOWA
  NIE, bo [dlaczego fakt nie spełnia przesłanki]          → ⛔ NIESPEŁNIONA

DECYZJA:
  Wszystkie przesłanki ✅    → ŻĄDANIE ZASADNE — zostaw w petitum
  ≥1 przesłanka ⚠️           → ŻĄDANIE EWENTUALNE lub WNIOSKUJ o dowód
  ≥1 przesłanka ⛔ krytyczna → ELIMINUJ ŻĄDANIE lub ZMIEŃ PODSTAWĘ
```

**Przykład (sprawa VII P 94/25):**

```
PRZEPIS: art. 25¹ §3 KP (Dz.U. z 2025 r. poz. 277 t.j.)
PRZESŁANKA P1: zawarto co najmniej cztery umowy terminowe
FAKT F-001: umowy nr 1-4 w aktach sprawy (D01)
SUBSUMPCJA: F-001 ✅ spełnia P1 — 4 umowy wykazane dokumentarnie

PRZESŁANKA P2: umowy zawarto między tymi samymi stronami
FAKT F-002: wszystkie umowy pod KRS 0000796445 (nie 0001025052)
SUBSUMPCJA: F-002 ⚠️ CZĘŚCIOWA — tożsamość stron sporna
  → RATUNEK: art. 23¹ §1 KP jako ścieżka alternatywna S2 (CV-ALT)

PRZESŁANKA P3: brak wyłączenia z art. 25¹ §4 KP
  (umowy na zastępstwo / na czas określonej pracy / w kadencjach)
FAKT: brak dokumentu wskazującego na wyłączenie
SUBSUMPCJA: F-xx ✅ — milczenie = brak wyłączenia (ciężar na pozwanym)

DECYZJA: ŻĄDANIE ZASADNE z ⚠️ na P2 → S2 (art. 23¹ §1 KP) jako ewentualne
```

---

## ET-3 — WERYFIKACJA PRZEPISÓW Z MATERIAŁU DOWODOWEGO

```
⛔ REGUŁA TWARDA: Przepis wczytany z dokumentu strony =
  NIEZWERYFIKOWANY HYPOTHESIS — nie POTWIERDZONY FAKT.
  PRAWO-HARDGATE dotyczy przepisów z pamięci modelu.
  TEN MODUŁ dotyczy przepisów PRZECZYTANYCH z dokumentów.

PROCEDURA per każdy przepis napotkany w materiale dowodowym:

ET-3.1: IDENTYFIKACJA
  Czy dokument (pismo, umowa, porozumienie, pismo kancelarii) zawiera
  powołanie się na przepis prawa?
  TAK → kontynuuj ET-3.2
  NIE → pomiń ten krok

ET-3.2: WERYFIKACJA (OBOWIĄZKOWA — nawet gdy "oczywisty")
  web_search: "[art. X] [pełna nazwa ustawy] isap.sejm.gov.pl"
  → Sprawdź: czy artykuł istnieje w aktualnym t.j.?
  → Sprawdź: czy brzmienie w dokumencie odpowiada aktualnemu brzmieniu?
  → Sprawdź: czy przepis nie został uchylony / zmieniony?

ET-3.3: KLASYFIKACJA
  PRZEPIS PRAWIDŁOWY I AKTUALNY:
    → ✅ Możesz użyć w piśmie z numerem Dz.U. z ISAP
  PRZEPIS PRAWIDŁOWY ALE NIEAKTUALNY TEKST (stary Dz.U.):
    → ⚠️ Zaktualizuj do aktualnego t.j.; treść normy może być ta sama
    → Informacja w UWAGACH REDAKCYJNYCH pisma
  PRZEPIS BŁĘDNY (zły nr artykułu / zła ustawa):
    → ⛔ KOREKTA OBOWIĄZKOWA — podaj prawidłowy art. z ISAP
    → Informacja dla użytkownika: "Dokument strony zawiera błędną
      podstawę prawną: [błędna] → prawidłowa: [skorygowana]"
  PRZEPIS UCHYLONY:
    → ⛔ ELIMINACJA tej podstawy prawnej
    → Szukaj przepisu następczego lub ścieżki alternatywnej
    → Informacja dla użytkownika: "Przepis [X] był uchylony z dniem [Y].
      Brak podstawy prawnej dla żądania opartego wyłącznie na tym przepisie."
  PRZEPIS NIEISTNIEJĄCY (błąd numeru):
    → ⛔ ELIMINACJA — zakaz powoływania nieistniejącego przepisu
    → Informacja dla użytkownika
```

---

## ET-4 — LISTA ELIMINACJI I KOREKT (OUTPUT)

Po wykonaniu ET-1, ET-2, ET-3 wygeneruj raport:

```
══════════════════════════════════════════════════════════════════
RAPORT ELIMINACJI TEZ I WERYFIKACJI PRZEPISÓW
[sygnatura] — [data]
══════════════════════════════════════════════════════════════════

ŻĄDANIA ZATWIERDZONE:
  ✅ Żądanie nr [n]: [treść] — podstawa: art. X §Y [ustawa t.j.]
     Przesłanki: P1 ✅ P2 ✅ P3 ✅
     Subsumpcja: kompletna

ŻĄDANIA PRZENIESIONE DO EWENTUALNYCH:
  ⚠️ Żądanie nr [n]: [treść] — przesłanka P[n] częściowo spełniona
     Powód: [opis] → przenieś do petitum jako "ewentualnie"
     Ścieżka alternatywna S2: art. Y §Z [ustawa]

ŻĄDANIA WYELIMINOWANE:
  ⛔ Żądanie nr [n]: [treść]
     Powód eliminacji: [brak przepisu / przesłanki niespełnione / przepis uchylony]
     Rekomendacja: [jak zastąpić / czego szukać / co dostarczyć]

KOREKTY PRZEPISÓW Z MATERIAŁU:
  ⚠️ Dokument [D-nn, str. X] cytuje: art. [błędny]
     Prawidłowy przepis: art. [skorygowany] (Dz.U. XXXX poz. NNN t.j.)
     Korekta wbudowana w pismo: TAK

PRZEPISY UCHYLONE W MATERIALE:
  ⛔ Dokument [D-nn] cytuje art. [X] uchylony z dniem [Y].
     Przepis następczy: art. [Z] / BRAK
     Wpływ na żądanie: [opis]
══════════════════════════════════════════════════════════════════
```

---

## ET-5 — INTEGRACJA Z PIPELINE

```
POZYCJA: Po CLAIM-VALIDATION (W1.2a) i po KD (W1.2c-PRE),
          PRZED W1.3 (mapa przesłanka→dowód).

FLOW:
  CLAIM-VALIDATION (C1-C4): twierdzenia vs materiał dowodowy
    ↓
  MOD-ELIMINACJA-TEZ (ET-1 do ET-4): żądania vs prawo
    ↓ Raport ET-4: zatwierdzone / ewentualne / wyeliminowane
    ↓
  CV-ALT: ścieżki alternatywne dla żądań ⚠️
    ↓
  W1.3: mapa przesłanka→dowód (TYLKO dla żądań ✅ i ⚠️)
    ↓
  W2.2: redakcja pisma

ZASADA:
  Do W1.3 wchodzą TYLKO żądania zatwierdzone (✅) lub ewentualne (⚠️).
  Żądania wyeliminowane (⛔) NIE wchodzą do petitum ani uzasadnienia.
  Korekty przepisów (ET-3) są automatycznie wbudowane w pismo.

⛔ ZAKAZ: Żądanie bez zatwierdzonej podstawy prawnej (ET-Q1) w petitum.
⛔ ZAKAZ: Przepis z dokumentu strony bez weryfikacji ET-3.2 w piśmie.
⛔ ZAKAZ: Subsumpcja pominięta dla żądań klasy A (najważniejsze).
```

---

## ET-6 — SELF-CHECK

```
Per każde żądanie z petitum:
□ ET-Q1: Zidentyfikowano przepis przewidujący żądanie?
□ ET-Q1: Przepis zweryfikowany online (ISAP)?
□ ET-Q2: Przesłanki przepisu wypisane z treści art. (nie z pamięci)?
□ ET-Q2: Per każda przesłanka: subsumpcja F-nn ↔ P[n] wykonana?
□ ET-Q2: Wynik: ✅ / ⚠️ / ⛔ ustalony i raport ET-4 wygenerowany?
□ ET-Q3: Przepisy z dokumentów strony zweryfikowane (nie przepisane)?

Per każdy przepis w piśmie:
□ Pochodzi z ISAP (nie z pamięci, nie z dokumentu bez weryfikacji)?
□ Jest aktualny t.j. (nie stary Dz.U.)?
□ Obowiązywał w dacie zdarzenia (TEMPORAL-LAW-CHECK)?
□ Ma zastosowanie do tej przesłanki (subsumpcja ET-2)?

Którykolwiek = NIE → korekta przed generowaniem .docx.
```
