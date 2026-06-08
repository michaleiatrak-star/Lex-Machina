# MODUŁ J2 — UMOWA DEWELOPERSKA I PRZEDWSTĘPNA
## Analizator Umów v2 · Moduł J2

> Wczytaj dla: umowa deweloperska, umowa przedwstępna sprzedaży nieruchomości,
> umowa rezerwacyjna, umowa sprzedaży lokalu/domu.

---
## J.4 UMOWA DEWELOPERSKA I PRZEDWSTĘPNA

**Podstawa do weryfikacji:**
```
isap.sejm.gov.pl → ustawa z 20.05.2021 o ochronie praw nabywcy (nowa ustawa deweloperska)
isap.sejm.gov.pl → KC → art. 389–396 (umowa przedwstępna)
```

### Pułapki:

**DW-1 — Brak rachunku powierniczego lub zły typ (CRITICAL)**
```
PRAWO (ustawa deweloperska 2021):
  OBOWIĄZKOWY otwarty lub zamknięty rachunek powierniczy dla każdej inwestycji
  → Otwarte konto: deweloper może wypłacać środki etapami (ryzyko dla nabywcy)
  → Zamknięte konto: środki do momentu przeniesienia własności (bezpieczniejsze)

PUŁAPKA: "Środki wpłacone na konto Dewelopera stanowią zaliczkę"
  → Brak rachunku powierniczego = NARUSZENIE ustawy deweloperskiej
  → Nabywca może odstąpić od umowy + żądać zwrotu + odszkodowania

SPRAWDŹ:
  → Czy umowa wskazuje nr rachunku powierniczego i bank?
  → Czy bank ma pełnomocnictwo do prowadzenia rachunku?
  → Typ rachunku: otwarty czy zamknięty?
```

**DW-2 — Kara za odstąpienie asymetryczna (HIGH RISK)**
```
PUŁAPKA: "Nabywca odstępujący traci zadatek (10%) / Deweloper zwraca zadatek bez kary"
  → W umowie deweloperskiej: prawo odstąpienia nabywcy JEST ograniczone ustawą
  → Ustawa 2021: otwarty katalog podstaw odstąpienia dla nabywcy (art. 43)
  → Poza ustawowymi podstawami: deweloper może żądać kary

WERYFIKUJ: isap.sejm.gov.pl → ustawa deweloperska 2021 → art. 43 (podstawy odstąpienia)

REKOMENDACJA:
  → Upewnij się, że kara za odstąpienie jest symetryczna
  → Jeśli deweloper opóźnia się ponad X miesięcy → nabywca odstępuje BEZ kary
  → Sprawdź: czy zadatek czy zaliczka? Zadatek = kara dla obu stron (art. 394 KC)
```

**DW-3 — Termin odbioru i kara za opóźnienie dewelopera (MEDIUM RISK)**
```
PUŁAPKA: Umowa nie zawiera kary dla dewelopera za opóźnienie oddania lokalu
  → Deweloper opóźnia się 2 lata → nabywca bez ochrony finansowej

PRAWO: Ustawa deweloperska 2021 → odsetki ustawowe za opóźnienie (domyślnie)
  Ale: strony mogą ustalić wyższą karę umowną

REKOMENDACJA:
  „§X. Za każdy dzień opóźnienia w oddaniu lokalu ponad termin wskazany w §[Y]
  Deweloper zapłaci Nabywcy karę umowną w wysokości [0,05–0,1]% ceny lokalu,
  jednak łącznie nie więcej niż [10]% ceny. Nabywca zachowuje prawo
  do odszkodowania przewyższającego karę umowną."
```

**DW-4 — Umowa przedwstępna bez rygoru przyrzeczenia (MEDIUM RISK)**
```
PRAWO: KC art. 389–390:
  Słabszy skutek: odszkodowanie za szkodę z powodu niezawarcia umowy przyrzeczonej
  Silniejszy skutek: prawo dochodzenia zawarcia umowy sądownie
  → Silniejszy skutek TYLKO gdy umowa przedwstępna spełnia wymagania co do treści umowy przyrzeczonej

PUŁAPKA: Umowa przedwstępna bez: ceny, terminu, opisu nieruchomości → tylko słaby skutek
  → Jeśli sprzedający odmówi zawarcia → tylko odszkodowanie (ograniczone)

REKOMENDACJA:
  → Umowa przedwstępna powinna zawierać WSZYSTKIE istotne elementy umowy przyrzeczonej
  → Wskazać termin zawarcia umowy notarialnej
  → Zawarcie w formie aktu notarialnego → silniejszy skutek automatycznie
```

---

---
*← Powrót do routingu: `view references/mod-J0-routing.md`*
