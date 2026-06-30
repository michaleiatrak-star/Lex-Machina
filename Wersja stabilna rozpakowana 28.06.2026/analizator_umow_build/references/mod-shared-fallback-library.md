# MODUŁ SHARED-FALLBACK-LIBRARY — PLAYBOOK KLAUZUL KONTRAKTOWYCH
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** negocjacje umowy, redakcja wariantów klauzul, zapytanie
> o "alternatywne wersje", "poziomy akceptowalności", "co zaproponować",
> przygotowanie do sesji negocjacyjnej lub position paper dla zarządu.
>
> Moduł zastępuje / rozszerza mod-shared-alt-drafts.md o poziomy A–D.
> Oba działają: alt-drafts = technika redakcji wariantów; fallback-library = playbook
> z poziomami biznesowymi + eskalacją.

---

## FL.1 FILOZOFIA — POZIOMY AKCEPTOWALNOŚCI

```
Standard najlepszych zespołów Legal Ops / Legal Design:

POZIOM A — IDEALNY (pozycja otwarcia):
  → Optymalna ochrona interesów strony chronionej
  → Maksymalne uprawnienia, minimalna ekspozycja
  → Pierwsza propozycja w negocjacjach gdy pozycja silna
  → Markuj: [A — IDEALNY]

POZIOM B — AKCEPTOWALNY KOMPROMIS:
  → Fair balance — coś dla każdej strony
  → Realny do zaakceptowania przez obie strony
  → Punkt docelowy gdy negocjacje po 1–2 rundach
  → Markuj: [B — KOMPROMIS]

POZIOM C — MINIMUM AKCEPTOWALNE:
  → Poniżej tego poziomu = realne ryzyko prawne lub finansowe
  → Wymaga zaznaczenia ryzyk dla decydenta
  → "Take it or leave it" z jasnym opisem konsekwencji
  → Markuj: [C — MINIMUM] + [RYZYKO: opis]

POZIOM D — ESKALACJA DO ZARZĄDU:
  → Poniżej interesu firmy / niezgodne z polityką prawną / wymaga decyzji zarządu
  → Prawnik nie może zaakceptować samodzielnie
  → Generuj: [D — ESKALACJA] + argumenty dla zarządu + alternatywy zewnętrzne
  → Markuj: [D — WYMAGA ZGODY ZARZĄDU]
```

---

## FL.2 PLAYBOOK — ODPOWIEDZIALNOŚĆ

```
KLAUZULA: Ograniczenie odpowiedzialności

KONTEKST: B2B, umowy IT/SaaS/serwis

[A — IDEALNY]
  Brak ograniczenia odpowiedzialności (pełna odpowiedzialność na zasadach KC).
  Treść: "Strony odpowiadają za szkody na zasadach ogólnych Kodeksu cywilnego,
  bez ograniczeń kwotowych."

[B — KOMPROMIS]
  Odpowiedzialność ograniczona do 3-krotności wynagrodzenia umownego.
  Treść: "Łączna odpowiedzialność Dostawcy nie przekroczy trzykrotności
  wynagrodzenia netto wypłaconego w ciągu 12 miesięcy poprzedzających zdarzenie
  powodujące szkodę."

[C — MINIMUM]
  Odpowiedzialność ograniczona do 1-krotności wynagrodzenia.
  Treść: "Łączna odpowiedzialność Dostawcy ograniczona jest do kwoty równej
  wynagrodzeniu netto za ostatnie 12 miesięcy."
  [RYZYKO: poniżej wartości umowy — szkoda może przewyższyć limit]

[D — ESKALACJA]
  Próba ograniczenia do opłat miesięcznych (np. 1 miesiąc) lub wyłączenie całkowite.
  [D — WYMAGA ZGODY ZARZĄDU]
  Argumenty dla zarządu:
  → Koszt ubezpieczenia OC IT wynosi X PLN/rok i pokryłby szkodę przy braku limitu
  → Alternatywa: ubezpieczenie cyber-risk + limit do rocznego wynagrodzenia
  → Jeśli dostawca odmawia B/C — rozważ zmianę dostawcy lub własne ubezpieczenie

  [ZAWSZE WYŁĄCZ Z OGRANICZENIA (niezależnie od poziomu)]:
  Naruszenie danych osobowych (RODO) · szkody wyrządzone umyślnie (art. 473 §2 KC)
  · naruszenie praw własności intelektualnej · śmierć lub uszkodzenie ciała
```

---

## FL.3 PLAYBOOK — KARA UMOWNA

```
KLAUZULA: Kara umowna za opóźnienie

KONTEKST: Umowy IT / budowlane / dostawy

[A — IDEALNY dla zamawiającego]
  0,5% wynagrodzenia za każdy dzień opóźnienia, bez górnego limitu
  + prawo do odszkodowania uzupełniającego powyżej kary.
  [→ Ekonomicznie: 30 dni = 15%, 60 dni = 30%, 90 dni = 45%]

[B — KOMPROMIS]
  0,3% dziennie, górny limit 30% wynagrodzenia.
  [→ Ekonomicznie: 30 dni = 9%, 60 dni = 18%, cap 30% = ~100 dni]

[C — MINIMUM dla zamawiającego]
  0,1% dziennie, górny limit 20%, prawo do wypowiedzenia po 60 dniach.
  [→ Ekonomicznie: 60 dni = 6%; limit 20% = ~200 dni]
  [RYZYKO: niski bodziec dla wykonawcy — pokrycie szkody realne dopiero powyżej]

[D — ESKALACJA]
  Stawka <0,05% / brak kary umownej / limit <5%.
  [D — WYMAGA ZGODY ZARZĄDU]
  Argumenty: koszt alternatywny opóźnienia = X PLN/dzień (wylicz dla kontraktu)
  Alternatywa: escrow · płatność po etapach · prawo do nieograniczonego odszkodowania

SYMETRIA:
  → Kara tylko dla jednej strony (asymetryczna) → w B2C abuzywna
  → W B2B: strona chroniona powinna żądać symetrii (kara za opóźnienie płatności)
  Teza asymetrii: [A] symetria obustronna | [B] kara dla wykonawcy + odsetki dla zam.
                  [C] kara tylko dla wykonawcy | [D] brak kar = eskalacja
```

---

## FL.4 PLAYBOOK — WYPOWIEDZENIE

```
KLAUZULA: Prawo do wypowiedzenia

[A — IDEALNY]
  Wypowiedzenie w każdym czasie z 30-dniowym wyprzedzeniem, bez podania przyczyny.
  Rozliczenie proporcjonalne (pro rata) + zwrot zaliczek.

[B — KOMPROMIS]
  Wypowiedzenie z 3-miesięcznym wyprzedzeniem lub "z ważnych przyczyn" natychmiastowo.
  Definicja ważnych przyczyn: rażące naruszenie + 14-dniowe bezskuteczne wezwanie.

[C — MINIMUM]
  Wypowiedzenie z 6-miesięcznym wyprzedzeniem + kara umowna za wcześniejsze rozwiązanie.
  [RYZYKO: związanie na min. 6 miesięcy w razie niewykonania]

[D — ESKALACJA]
  Brak prawa wypowiedzenia / wypowiedzenie tylko w ostatnim roku / kara = 100% wartości.
  [D — WYMAGA ZGODY ZARZĄDU]
  Argumenty: ryzyko trwałego związania z dostawcą; wycena "lock-in premium"
```

---

## FL.5 PLAYBOOK — ZMIANA WARUNKÓW (REGULAMINY / SAAS)

```
KLAUZULA: Prawo do jednostronnej zmiany regulaminu / cennika

[A — IDEALNY]
  Zmiany wyłącznie za obustronną pisemną zgodą.

[B — KOMPROMIS]
  Zmiany z 30-dniowym wyprzedzeniem + prawo do rozwiązania bez kary
  jeśli klient nie akceptuje zmian.

[C — MINIMUM]
  Zmiany z 14-dniowym wyprzedzeniem + prawo do rozwiązania.
  [RYZYKO: 14 dni to minimum — w B2C może być abuzywne bez prawa rozwiązania]

[D — ESKALACJA]
  Prawo do zmiany "bez powiadomienia" lub "ze skutkiem natychmiastowym".
  [D — WYMAGA ZGODY ZARZĄDU + ocena abuzywności (art. 385³ pkt 10 KC)]
```

---

## FL.6 PLAYBOOK — DANE / WŁASNOŚĆ DANYCH (DATA ACT)

```
KLAUZULA: Własność i dostęp do danych (klauzule chmurowe / IoT / SaaS)

[A — IDEALNY dla klienta/użytkownika]
  Wszystkie dane generowane przez klienta są wyłącznie własnością klienta.
  Dostawca może przetwarzać dane wyłącznie na potrzeby realizacji usługi.
  Pełne prawo eksportu w formacie otwartym bez opłat (Data Act art. 25).

[B — KOMPROMIS]
  Dane klienta: własność klienta. Dostawca: licencja na czas umowy + dane anonimowe.
  Export: w ciągu 30 dni od zakończenia umowy, bez opłat za transfer.

[C — MINIMUM]
  Prawo do eksportu danych w terminie 90 dni + opłata za transfer max [X] PLN.
  [RYZYKO: opłata zaporowa może blokować realne switching — sprawdź vs. Data Act art. 25-26]

[D — ESKALACJA]
  Brak prawa do eksportu / "dane są własnością dostawcy" / brak formatu otwartego.
  [D — WYMAGA ZGODY ZARZĄDU]
  Argumenty: naruszenie Data Act od 12.09.2025 (nowe umowy)
  Ryzyko: vendor lock-in + potencjalna kara Prezesa UKE
```

---

## FL.7 PLAYBOOK — POUFNOŚĆ / NDA

```
[A — IDEALNY]
  Obowiązek poufności wzajemny i symetryczny, czas: 5 lat od zakończenia umowy.
  Definicja informacji poufnych: szeroka (wszelkie informacje niepubliczne).
  Kara za naruszenie: umowna (→ FL.3 [A]).

[B — KOMPROMIS]
  Wzajemny, czas: 3 lata, katalog wyłączeń standardowy
  (informacje publiczne, uzyskane od osób trzecich legalnie, wymagane prawem).

[C — MINIMUM]
  Czas: 2 lata, tylko jedna strona (chroniona), wyłączenia standardowe.
  [RYZYKO: brak ochrony po 2 latach; brak symetrii osłabia pozycję w sporze]

[D — ESKALACJA]
  Brak obowiązku poufności / brak kary / czas < 1 roku.
  [D — WYMAGA ZGODY ZARZĄDU + ocena wartości informacji poufnych firmy]
```

---

## FL.8 ZASTOSOWANIE W RAPORCIE

```
Po wykryciu klauzuli → AUTOMATYCZNIE rozwiń sekcję PLAYBOOK:

━━━ PLAYBOOK: [NAZWA KLAUZULI] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ A — IDEALNY       │ [treść + ocena ekonomiczna]                │
│ B — KOMPROMIS     │ [treść + akceptowalny zakres]              │
│ C — MINIMUM       │ [treść + opis ryzyka przy C]               │
│ D — ESKALACJA     │ [opis + argumenty dla zarządu]             │
│ POZYCJA UMOWY     │ [poziom A / B / C / D] + opis delta        │
│ REKOMENDACJA      │ Zaproponuj [B]: [gotowa treść]             │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRIORYTET wywołania:
  1. Klauzule z FL.2 (odpowiedzialność) → ZAWSZE
  2. Klauzule z FL.3 (kara umowna) → ZAWSZE
  3. Inne klauzule z FL.4–FL.7 → gdy zidentyfikowane w tekście umowy
  4. Klauzule B2B dot. danych → FL.6 (Data Act) → gdy SaaS/cloud/IoT
```

---

*mod-shared-fallback-library.md · Analizator Umów v1 · Playbook klauzul*
*Uzupełnia: mod-shared-alt-drafts.md (technika wariantów) + mod-shared-ryzyko-kwant.md (ekonomia)*
