# M12 — Terminy procesowe, terminy zawite i kalendarz sprawy

## Cel

Zidentyfikować wszystkie terminy mające wpływ na sprawę, ocenić ich status,
wygenerować alerty krytyczne i kalendarz operacyjny.

**Reguła bezwzględna:** terminy zawite i przedawnienia są weryfikowane
przez `shared/HYBRID-VALIDATION` oraz moduł `shared/terminy` przed podaniem
użytkownikowi. Przy każdym terminie wskaż podstawę prawną i zweryfikuj
ją w ISAP. Nie podawaj terminów z pamięci jako pewnych — zawsze wskaż
potrzebę weryfikacji gdy zachodzi ryzyko nowelizacji.

---

## 12.1 Klasyfikacja terminów

### Terminologia operacyjna

| Typ | Definicja | Skutek przekroczenia |
|-----|-----------|---------------------|
| **Zawity** | Termin prawa materialnego lub procesowego, po upływie którego uprawnienie wygasa | Wygaśnięcie roszczenia / uprawnienia |
| **Przedawnienie** | Termin po upływie którego zobowiązany może uchylić się od zaspokojenia roszczenia | Możliwość podniesienia zarzutu |
| **Procesowy instrukcyjny** | Termin wyznaczony przez sąd lub przepis; przekroczenie powoduje skutki przewidziane przepisem | Prekluzja / spóźnienie / oddalenie |
| **Urzędowy** | Termin wyznaczony przez organ administracji | Decyzja / bezskuteczność / milczące załatwienie |
| **Umowny** | Termin wynikający z umowy lub ugody | Skutki kontraktowe |

---

## 12.2 Rejestr terminów sprawy

```text
[TERM-001]
Nazwa terminu:
Typ: zawity / przedawnienie / procesowy / urzędowy / umowny
Podstawa prawna (weryfikacja ISAP):
Data zdarzenia rozpoczynającego bieg:
Długość terminu:
Data upływu:
Status: aktywny / upłynął / zawieszony / przerwany / nieustalony
Przeszkody (zawieszenie / przerwanie):
  Podstawa zawieszenia / przerwania:
  Skutek:
Odpowiedzialny za dotrzymanie: strona / pełnomocnik
Alert: KRYTYCZNY (< 14 dni) / PILNY (< 30 dni) / MONITOROWANY / UPŁYNĄŁ
Skutek przekroczenia:
Czy można przywrócić: tak / nie / zależy od okoliczności
  Podstawa przywrócenia:
  Termin na wniosek o przywrócenie:
```

---

## 12.3 Terminy według dziedziny — przewodnik

### Postępowanie cywilne (KPC)

```text
TERMINY PROCESOWE — do weryfikacji w aktualnym KPC (ISAP):

Sprzeciw od nakazu zapłaty (postępowanie upominawcze):
  art. 503 KPC — 2 tygodnie od doręczenia nakazu
  [ALERT: brak sprzeciwu = prawomocność nakazu]

Zarzuty od nakazu zapłaty (postępowanie nakazowe):
  art. 493 KPC — 2 tygodnie od doręczenia nakazu
  [ALERT: po upływie nie można kwestionować nakazu co do meritum]

Odpowiedź na pozew:
  art. 207 § 2 KPC — termin wyznaczony przez sąd (min. 2 tygodnie)
  [ALERT: przekroczenie = prekluzja twierdzeń i dowodów]

Apelacja:
  art. 369 KPC — 2 tygodnie od doręczenia wyroku z uzasadnieniem
  [ALERT: termin zawity — nie podlega przywróceniu bez wykazania winy sądu]

Wniosek o uzasadnienie wyroku:
  art. 328¹ KPC — 1 tydzień od ogłoszenia / doręczenia wyroku
  [ALERT: warunek konieczny do wniesienia apelacji]

Zażalenie:
  art. 394 § 2 KPC — 1 tydzień od doręczenia postanowienia
  Uwaga: weryfikuj art. 394 i 394¹ — zakres zażalenia był wielokrotnie nowelizowany

Skarga kasacyjna:
  art. 398⁵ § 1 KPC — 2 miesiące od doręczenia wyroku z uzasadnieniem
  Uwaga: przez adwokata / radcę prawnego / rzecznika patentowego / PG / RPO

Skarga o wznowienie postępowania:
  art. 407–408 KPC — 3 miesiące od dowiedzenia się o podstawie; 5 lat od uprawomocnienia

Skarga na czynności komornika:
  art. 767 § 4 KPC — 1 tydzień od dokonania czynności lub dowiedzenia się o niej

Wniosek o zabezpieczenie roszczenia:
  art. 730–7301 KPC — przed lub w toku postępowania

Wniosek o przywrócenie terminu:
  art. 168–172 KPC — 1 tydzień od ustania przyczyny uchybienia
```

### Prawo pracy (KP + KPC)

```text
TERMINY PRACOWNICZE — do weryfikacji w aktualnym KP i KPC (ISAP):

Odwołanie od wypowiedzenia umowy o pracę:
  art. 264 § 1 KP — 21 dni od doręczenia pisma o wypowiedzeniu
  [ALERT: termin zawity]

Odwołanie od rozwiązania umowy bez wypowiedzenia:
  art. 264 § 2 KP — 21 dni od doręczenia pisma o rozwiązaniu
  [ALERT: termin zawity]

Żądanie nawiązania stosunku pracy (przy odmowie zatrudnienia):
  art. 264 § 3 KP — 21 dni od doręczenia zawiadomienia o odmowie

Przedawnienie roszczeń ze stosunku pracy:
  art. 291 KP — 3 lata od daty wymagalności
  Wyjątki: odszkodowanie z art. 183d KP — 3 lata; roszczenia o wynagrodzenie

Przywrócenie terminu (sprawy pracownicze):
  art. 265 KP — wniosek w ciągu 7 dni od ustania przyczyny uchybienia
```

### Postępowanie karne (KPK)

```text
TERMINY KARNE — do weryfikacji w aktualnym KPK (ISAP):

Zawiadomienie o przestępstwie ściganym z oskarżenia prywatnego:
  art. 101 § 2 KK — przedawnienie karalności: 1 rok od dowiedzenia się o sprawcy
  (dla czynów z art. 216, 217 KK i inne — weryfikacja szczegółowych przepisów)

Subsydiarny akt oskarżenia:
  art. 55 KPK — 1 miesiąc od doręczenia zawiadomienia o ponownym umorzeniu

Apelacja od wyroku:
  art. 445 KPK — 14 dni od doręczenia wyroku z uzasadnieniem

Wniosek o uzasadnienie wyroku:
  art. 422 KPK — 7 dni od ogłoszenia wyroku
  [ALERT: warunek do apelacji]

Zażalenie:
  art. 460 KPK — 7 dni od ogłoszenia / doręczenia postanowienia

Kasacja:
  art. 524 § 1 KPK — 30 dni od doręczenia orzeczenia z uzasadnieniem

Przedawnienie karalności — typy:
  art. 101 § 1 KK — zależy od zagrożenia ustawowego; weryfikacja w ISAP
```

### Prawo administracyjne (KPA / PPSA)

```text
TERMINY ADMINISTRACYJNE — do weryfikacji w aktualnym KPA (ISAP):

Odwołanie od decyzji administracyjnej:
  art. 129 KPA — 14 dni od doręczenia decyzji
  [ALERT: termin zawity]

Wniosek o ponowne rozpatrzenie sprawy (organy I inst. = II inst.):
  art. 127 § 3 KPA — 14 dni od doręczenia decyzji

Skarga do WSA:
  art. 53 PPSA — 30 dni od doręczenia rozstrzygnięcia wraz z uzasadnieniem
  Wyjątek: bezczynność organu — 30 dni od dnia doręczenia odpowiedzi organu
            lub 60 dni od dnia wniesienia ponaglenia

Skarga kasacyjna do NSA:
  art. 177 PPSA — 30 dni od doręczenia wyroku WSA z uzasadnieniem

Ponaglenie (bezczynność / przewlekłość):
  art. 37 KPA — brak ustawowego terminu; złóż niezwłocznie po przekroczeniu
```

---

## 12.4 Alerty krytyczne

Automatycznie generowane przy uzupełnieniu rejestru terminów:

```text
🔴 [ALERT-T1] TERMIN UPŁYNĄŁ
   Termin: [nazwa]
   Upłynął: [data]
   Skutek: [automatyczne]
   Możliwość przywrócenia: [ocena]
   Pilne działanie:

🔴 [ALERT-T2] TERMIN KRYTYCZNY — PONIŻEJ 14 DNI
   Termin: [nazwa]
   Upływa: [data]
   Pozostało: [X dni]
   Działanie wymagane:

🟡 [ALERT-T3] TERMIN PILNY — PONIŻEJ 30 DNI
   Termin: [nazwa]
   Upływa: [data]
   Pozostało: [X dni]
   Działanie:

🟢 [ALERT-T4] TERMIN MONITOROWANY
   Termin: [nazwa]
   Upływa: [data]
   Status:
```

---

## 12.5 Kalendarz operacyjny sprawy

```text
Data | Termin / czynność | Typ | Podstawa | Status | Odpowiedzialny
-----|-------------------|-----|----------|--------|---------------
     | [chronologicznie] |     |          |        |
```

**Reguła kalendarza:**
- czerwony = termin zawity lub prekluzja (nie można przywrócić)
- pomarańczowy = termin urzędowy z możliwością przywrócenia
- żółty = termin wyznaczony przez sąd / organ
- zielony = termin umowny lub informacyjny

---

## 12.6 Analiza opóźnień i uchybień

```text
[UCH-001]
Termin:
Kiedy upłynął:
Powód uchybienia (wersja strony):
Czy uchybienie niezawinione: tak / nie / wymaga analizy
Podstawa do przywrócenia (art. 168 KPC / art. 265 KP / art. 58 KPK):
  Warunki formalne wniosku:
  Termin na złożenie wniosku o przywrócenie:
  Szansa na uwzględnienie: wysoka / średnia / niska
Alternatywne ścieżki:
Skutek nieusuwalnego uchybienia:
```

---

## 12.7 Integracje M12

| Sytuacja | Działanie |
|----------|-----------|
| Termin < 14 dni | Oznaczenie `🔴 ALERT-T2` + priorytet PILNE w M7 |
| Termin upłynął | Oznaczenie `🔴 ALERT-T1` + analiza przywrócenia (sekcja 12.6) |
| Termin pracowniczy | Połącz z checklistą `checklists/sprawa-pracownicza.md` |
| Termin do doręczenia | Sprawdź efektywność doręczenia z M1 (Warstwa B) |
| Kolizja terminów | Utwórz kartę w M3 + priorytetyzacja w M7 |
| Weryfikacja przepisów | Zawsze ISAP przed podaniem daty granicznej |
