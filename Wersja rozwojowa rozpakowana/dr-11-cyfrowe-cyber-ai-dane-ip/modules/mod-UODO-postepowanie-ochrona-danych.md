# Moduł [BA] — Postępowanie przed UODO i ochrona danych osobowych

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
---
WSPÓLNE ZASADY DLA MODUŁU:
- przed cytowaniem przepisu zastosuj `shared/ISAP-AUDIT-PROTOCOL.md`;
- metryki aktów sprawdzaj w `shared/ISAP-METRYKI-AKTOW.md`;
- jeżeli sprawa jest procesowa, uruchom `shared/FORMAL-CHECK.md`, `shared/WARUNKI-SKUTECZNOSCI.md`, `shared/TERM-CALC.md`, `shared/RISK-ASSESSMENT.md`;
- nie mieszaj trybów: KPA, Ordynacja podatkowa, KAS, PPSA i egzekucja administracyjna mają odrębne rygory.
---

**Zakres:** skarga do Prezesa UODO, naruszenie ochrony danych, prawa osoby, administrator, procesor, monitoring, dostęp do danych, usunięcie danych, odszkodowanie z art. 82 RODO, kontrola i kara administracyjna.

## ZASADY ABSOLUTNE

1. Oddziel roszczenie administracyjne przed UODO od roszczenia cywilnego o odszkodowanie.
2. RODO jest bezpośrednio stosowane, ale postępowanie krajowe wymaga ustawy o ochronie danych osobowych i KPA w zakresie nieuregulowanym.
3. W skardze do UODO kluczowe są: administrator, dane, czynność przetwarzania, naruszone prawo, dowód żądania do administratora.
4. Kara dla administratora nie jest automatycznie odszkodowaniem dla osoby fizycznej.

## KLUCZOWE AKTY PRAWNE — ISAP / UE

| Akt | Metryka robocza |
|---|---|
| RODO | rozporządzenie UE 2016/679 — sprawdzić EUR-Lex przy cytowaniu |
| Ustawa o ochronie danych osobowych | tekst ujednolicony ISAP `D20181000Lj.pdf`; sprawdzić Dz.U. przed cytowaniem |
| KPA | Dz.U. 2025 poz. 1691 według rejestru ISAP |
| PPSA | Dz.U. 2026 poz. 143 według rejestru ISAP |

## WALIDACJA

```text
□ administrator danych
□ kategorie danych i osób
□ podstawa przetwarzania
□ żądanie do administratora i odpowiedź/brak odpowiedzi
□ naruszone prawo z RODO
□ szkoda i związek przyczynowy — jeśli roszczenie cywilne
□ termin i właściwy tryb skargi
```

---

# STANDARDOWE UZUPEŁNIENIE MODUŁU — poziom prawa pracy / prawa karnego

> Ten blok jest częścią obowiązkową modułu. Ma pierwszeństwo przed opisowym użyciem modułu. Nie zastępuje kontroli ISAP; wymusza praktyczny workflow kancelaryjny.

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- administrator/podmiot przetwarzający;
- naruszone prawa;
- żądanie do administratora;
- skarga do UODO;
- terminy i dowody;
- równoległe roszczenia cywilne;

## 2. Mapa proceduralna

```text
Identyfikacja trybu i organu/sądu
  ↓
Kontrola terminu, doręczenia, właściwości i legitymacji
  ↓
Ustalenie faktów materialnych i proceduralnych
  ↓
Matryca dowodowa: fakt → dowód → ciężar dowodu → luka
  ↓
Dobór pisma/środka: wniosek / odwołanie / zażalenie / skarga / pozew / zawiadomienie
  ↓
Walidacja formalna: shared/FORMAL-CHECK.md + shared/WARUNKI-SKUTECZNOSCI.md
  ↓
Ocena ryzyka: shared/RISK-ASSESSMENT.md + shared/QUALITY-CHECK.md
  ↓
Strategia: minimum, optimum, wariant eskalacyjny
```

## 3. Warunki skuteczności

```text
□ prawidłowy tryb
□ właściwy organ albo sąd
□ termin liczony od prawidłowego zdarzenia
□ legitymacja strony
□ żądanie możliwe prawnie
□ fakty powiązane z podstawą prawną
□ dowody przypisane do każdej tezy
□ kontrola opłat, odpisów, pełnomocnictw i podpisu
□ kontrola ISAP na dzień sporządzenia pisma
□ kontrola stanu prawnego na dzień zdarzenia oraz na dzień orzekania
```

## 4. Matryca dowodowa

Dowody typowe dla tego modułu:
- wnioski RODO;
- odpowiedzi administratora;
- logi/korespondencja;
- polityki prywatności;
- decyzja UODO;
- dowody szkody;

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:

1. argumentację strony inicjującej sprawę,
2. argumentację organu/przeciwnika procesowego.

Typowe ryzyka i kontrargumenty:
- brak wcześniejszego żądania;
- mieszanie skargi UODO z odszkodowaniem;
- niewykazanie naruszenia;
- brak związku przyczynowego;

## 6. Strategia procesowa

Zastosuj trzy warianty:

### Wariant ostrożny
Minimalizuje ryzyko formalne. Priorytet: termin, kompletność, zabezpieczenie dowodów.

### Wariant ofensywny
Eksponuje naruszenia proceduralne, wadliwość ustaleń, niewłaściwą wykładnię, naruszenie zasady proporcjonalności albo praw strony.

### Wariant eskalacyjny
Zakłada przejście do organu II instancji, WSA/NSA, sądu powszechnego, SN, TSUE, ETPC albo organu sektorowego — tylko gdy wynika to z trybu.

## 7. Quality gate

Przed końcową odpowiedzią sprawdź:

```text
□ Czy moduł działa praktycznie, a nie opisowo?
□ Czy wskazano decydujący element prawny?
□ Czy oddzielono fakty od interpretacji?
□ Czy podano ryzyka przeciwnika/organu?
□ Czy wskazano słabe punkty klienta?
□ Czy każdy przepis i Dz.U. ma kontrolę ISAP albo oznaczenie braku weryfikacji?
□ Czy użyto shared/MODULE-STANDARD-POLISH-LAW.md?
```

## 8. Łącz obowiązkowo z

| Potrzeba | Moduł współdzielony / skill |
|---|---|
| aktualność prawa | `shared/ISAP-AUDIT-PROTOCOL.md` + `shared/ISAP-METRYKI-AKTOW.md` |
| stan prawny w czasie | `shared/TEMPORAL-LAW-CHECK.md` |
| braki formalne | `shared/BRAKI-FORMALNE.md` |
| warunki skuteczności | `shared/WARUNKI-SKUTECZNOSCI.md` |
| dowody | `shared/DOWODY-METODOLOGIA.md` + `analizator-dowodow-v3` |
| ryzyka | `shared/RISK-ASSESSMENT.md` |
| pisma | `pisma-procesowe-v3` albo `pisma-proste-v2` |
| analiza sądowa | `analiza-sadowa-v6` |

---

## 9. ⭐⭐ SKARGA DO PREZESA UODO — TREŚĆ MERYTORYCZNA (dodane 2026-07-21)

> Odpowiedź na pytanie użytkownika o kompletność tematu UODO — sekcje
> 1-8 wyżej to OGÓLNY szkielet proceduralny (wspólny dla wielu typów
> pism); TU konkretna, merytoryczna treść WŁAŚCIWA wyłącznie dla
> skargi do Prezesa UODO.

### 9.0 ⭐ KOREKTA TERMINOLOGICZNA — GIODO nie istnieje od 2018 r.

```
□ GIODO (Generalny Inspektor Ochrony Danych Osobowych) — organ
  ISTNIEJĄCY do 24.05.2018 r., na podstawie NIEOBOWIĄZUJĄCEJ już
  ustawy z 29.08.1997 r. o ochronie danych osobowych
□ Z DNIEM 25.05.2018 r. (wejście w życie RODO + nowej krajowej ustawy
  o ochronie danych osobowych z 10.05.2018 r.) — GIODO ZASTĄPIONY przez
  PREZESA URZĘDU OCHRONY DANYCH OSOBOWYCH (Prezes UODO) — to NIE jest
  tylko zmiana nazwy tego samego stanowiska, lecz NOWY organ o innych
  kompetencjach (dostosowanych do RODO)
⭐ Jeśli klient/dokument PRZYWOŁUJE "GIODO" — w 99% przypadków chodzi o
  UODO (potoczne przyzwyczajenie terminologiczne, szczególnie u osób
  starszych lub przy starszych dokumentach/umowach sprzed 2018 r.) —
  SKORYGUJ to WPROST przy pierwszym kontakcie z klientem, nie milcz na
  ten temat
□ WYJĄTEK: jeśli sprawa dotyczy zdarzenia/decyzji SPRZED 25.05.2018 r.
  — właściwe mogą być PRZEPISY PRZEJŚCIOWE dot. postępowań wszczętych
  przez GIODO i niezakończonych do tej daty (⚠️ dokładny zakres
  przepisów przejściowych niepotwierdzony w pełni w tej sesji —
  RZADKI, praktycznie wygasający przypadek po tylu latach)
```

### 9.1 Zasada subsydiarności — kiedy skarga jest właściwa

```
□ Skargę do Prezesa UODO składa się CO DO ZASADY DOPIERO, gdy
  administrator danych NIE ODPOWIEDZIAŁ na żądanie osoby (np. dostęp/
  sprostowanie/usunięcie danych — patrz `mod-RODO-DSAR-zadania-osob.md`),
  ODMÓWIŁ jego spełnienia, LUB udzielona odpowiedź jest
  NIEZADOWALAJĄCA
□ Administrator ma NA ODPOWIEDŹ zwykle 1 MIESIĄC, z możliwością
  PRZEDŁUŻENIA o KOLEJNE 2 MIESIĄCE (z obowiązkiem POINFORMOWANIA
  osoby o przyczynach opóźnienia) — DOPIERO po wyczerpaniu tej ścieżki
  skarga do UODO jest właściwym środkiem
```

### 9.2 Elementy skargi

```
□ Imię i nazwisko oraz adres wnoszącego (lub nazwa/siedziba, jeśli
  podmiot)
□ Dane ADMINISTRATORA, na którego wnoszona jest skarga (nazwa/adres
  siedziby lub adres zamieszkania osoby fizycznej)
□ OPIS naruszenia — KONKRETNY, z powołaniem PRZEPISU RODO, który
  zdaniem skarżącego został naruszony (np. art. 13 — obowiązek
  informacyjny)
⭐ UODO ZWIĄZANY jest ZAKRESEM skargi — jeśli skarżący NIE WSKAZAŁ
  konkretnego naruszenia (np. nie wspomniał o art. 13), organ NIE
  BĘDZIE badał tego wątku z URZĘDU — SFORMUŁUJ skargę możliwie
  WYCZERPUJĄCO
⭐ UODO bada WYŁĄCZNIE, czy naruszenie miało miejsce WOBEC KONKRETNEJ
  osoby składającej skargę — NIE prowadzi ogólnego postępowania co do
  tego, czy administrator w ogóle narusza RODO
□ ŻĄDANIE wobec Prezesa UODO (np. nakazanie usunięcia danych,
  sprostowania, ograniczenia przetwarzania, niepodlegania decyzji
  opartej wyłącznie na zautomatyzowanym przetwarzaniu)
⭐⭐ ZAKAZ: skarżący NIE MOŻE żądać NAŁOŻENIA kary administracyjnej na
  administratora — decyzja o karze leży WYŁĄCZNIE w gestii Prezesa
  UODO, jako ostateczne działanie PO przeprowadzeniu postępowania, NIE
  na wniosek strony
□ DOWODY — warto załączyć korespondencję z administratorem i inne
  dokumenty potwierdzające naruszenie
```

### 9.3 Forma, opłata, właściwość

```
□ FORMA: pisemna (własnoręczny podpis), ELEKTRONICZNA (przez
  Elektroniczną Skrzynkę Podawczą UODO — podpis kwalifikowany lub
  profil zaufany/ePUAP), lub USTNIE do PROTOKOŁU w siedzibie UODO
  (Warszawa, ul. Stawki 2 — WYMAGA wcześniejszego umówienia terminu)
□ OPŁATA: BRAK — złożenie skargi jest BEZPŁATNE dla samego
  zainteresowanego (⚠️ PRZED wejściem RODO w 2018 r. obowiązywała
  opłata — dziś JUŻ NIE)
□ ⭐ WYJĄTEK: jeśli skargę składa PEŁNOMOCNIK — WYMAGANA opłata
  SKARBOWA za pełnomocnictwo, obecnie 17 zł, PLUS dołączenie KOPII
  pełnomocnictwa do skargi
□ WŁAŚCIWOŚĆ MIĘDZYNARODOWA (sprawy transgraniczne w UE): skargę można
  złożyć do organu nadzorczego PAŃSTWA zamieszkania, miejsca pracy, LUB
  miejsca POPEŁNIENIA domniemanego naruszenia — WYBÓR należy do osoby
  składającej skargę, brak sztywnego kryterium pierwszeństwa
```

### 9.4 Postępowanie i terminy

```
□ Skarga INICJUJE postępowanie ADMINISTRACYJNE, prowadzone wg KPA
□ TERMIN rozpatrzenia: NIEZWŁOCZNIE, NIE PÓŹNIEJ niż w CIĄGU MIESIĄCA
  od otrzymania (art. 237 §2 KPA) — w SPRAWACH SKOMPLIKOWANYCH może to
  wynieść do 60 DNI
□ PIERWSZA odpowiedź informuje o PODJĘTYCH krokach (np. wszczęcie
  postępowania, wezwanie administratora do wyjaśnień) — NIE jest to
  jeszcze rozstrzygnięcie merytoryczne
□ CZAS TRWANIA całości: BARDZO ZMIENNY — zależny od tempa odpowiedzi
  administratora — od KILKU TYGODNI do KILKU LAT w spornych sprawach
□ KTO MOŻE ZŁOŻYĆ: osoba fizyczna, której dotyczy naruszenie, LUB jej
  pełnomocnik (z PEŁNĄ zdolnością do czynności prawnych, wg KPA)
```

### 9.5 Checklist praktyczny

```
□ Czy klient WYCZERPAŁ ścieżkę bezpośrednią z administratorem (żądanie
  + upływ terminu 1/3 miesięcy) — jeśli NIE, doradź NAJPIERW ten krok
□ Czy opis naruszenia w SKARDZE jest KONKRETNY i powołuje WŁAŚCIWY
  przepis RODO — niekompletny opis = organ NIE zbada pominiętych wątków
□ Czy klient OCZEKUJE nałożenia kary na administratora — WYJAŚNIJ, że
  NIE JEST to możliwe żądanie w treści skargi (ale samo złożenie może
  przyczynić się do kontroli/kar z URZĘDU)
□ Czy skargę składa PEŁNOMOCNIK — pamiętaj o opłacie 17 zł i kopii
  pełnomocnictwa
□ Czy klient MYLI GIODO z UODO — WYJAŚNIJ różnicę WPROST (patrz 9.0)
□ Czy dołączono DOWODY (korespondencja z administratorem, zrzuty
  ekranu, inne dokumenty)

GOTOWY WZÓR SKARGI: `pisma-proste-v2/references/SPK-skarga-do-UODO.md`

⭐⭐ NIE MYLIĆ z INNYM mechanizmem "do UODO" (dodane 2026-07-21): SKARGA
opisana w TEJ sekcji 9 to pismo OSOBY, KTÓREJ DANE DOTYCZĄ, przeciwko
ADMINISTRATOROWI (dopiero PO wyczerpaniu ścieżki bezpośredniej) —
CAŁKOWICIE ODRĘBNYM mechanizmem jest ZGŁOSZENIE NARUSZENIA OCHRONY
DANYCH (art. 33-34 RODO), SKŁADANE PRZEZ SAMEGO ADMINISTRATORA w
CIĄGU 72 GODZIN od WYKRYCIA własnego naruszenia (np. wycieku danych) —
TEN drugi mechanizm jest W PEŁNI opracowany w `mod-RODO-szczegolowy.md`
sekcja "NARUSZENIE OCHRONY DANYCH — PROCEDURA" (deterministyczny zegar
72h, ocena ryzyka, treść zgłoszenia, zawiadomienie osób przy WYSOKIM
ryzyku, rejestr naruszeń) — SPRAWDŹ, KTÓRY z dwóch mechanizmów
faktycznie dotyczy sprawy klienta, ZANIM zaczniesz redagować pismo:
KTO jest stroną (poszkodowana osoba vs administrator) i CO jest
przedmiotem (zarzut naruszenia PRAW osoby vs własne, wykryte naruszenie
BEZPIECZEŃSTWA danych).
(dodany 2026-07-21)
```

### 9.6 Literatura i źródła (zweryfikowane online 2026-07-21)

- sylwiaczub.pl — elementy skargi, brak opłaty, wyjątek dla
  pełnomocnika (17 zł), żądania możliwe/niemożliwe (zakaz żądania kary).
- politykabezpieczenstwa.pl — podstawa proceduralna KPA (art. 237 §2),
  forma elektroniczna przez ESP UODO, wymogi formalne.
- porady.pl — właściwość międzynarodowa, elementy z wytycznych UODO.
- kancelariawyrzykowscy.pl — zasada subsydiarności, terminy
  administratora (1+2 miesiące), forma ustna do protokołu, adres UODO.
- rkrodo.pl — zasada związania zakresem skargi, zakaz żądania kary,
  ograniczenie badania do sytuacji KONKRETNEJ osoby skarżącej.
