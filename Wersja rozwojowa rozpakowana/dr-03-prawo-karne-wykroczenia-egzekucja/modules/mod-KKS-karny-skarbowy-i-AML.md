# mod-AN-karne-gospodarcze-aml

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
description: |
  Moduł prawa karnego gospodarczego, KKS i AML. Stosuj przy oszustwie gospodarczym,
  działaniu na szkodę spółki, przywłaszczeniu, fałszywych fakturach, praniu pieniędzy,
  odpowiedzialności zarządu, czynach karnoskarbowych, zawiadomieniu do prokuratury.
compatibility:
  tools: [web_search, web_fetch]
---

# mod-AN — Karne Gospodarcze / KKS / AML

## AKTY PRAWNE

| Akt | Zakres |
|---|---|
| Kodeks karny | oszustwo, przywłaszczenie, szkoda spółki, dokumenty, fałszywe faktury (rozdz. XXXIVa) |
| Kodeks karny skarbowy (KKS) — Dz.U. 2025 poz. 633 t.j. (obwieszczenie 10.04.2025) ✅ VER 2026-07-15 | podatki, faktury, deklaracje, uszczuplenia — patrz sekcja niżej |
| Ustawa AML — instytucje obowiązane, GIIF, procedury | dr-06/mod-ustawa-AML-instytucje-obowiazkowe |
| KSH | obowiązki organów spółek |

## ⚠️ KOREKTA 2026-07-15 — NAPRAWA BRAKU TREŚCI KKS

> Ten moduł do 2026-07-15 zawierał WYŁĄCZNIE ogólny szkielet proceduralny,
> bez ŻADNYCH konkretnych artykułów KKS (potwierdzone: brak art. 54/56/62/76,
> brak numeru Dz.U. samego kodeksu). Sekcja niżej naprawia ten brak.

## KLUCZOWE PRZESTĘPSTWA/WYKROCZENIA SKARBOWE (⛔ weryfikuj ISAP przed cytowaniem)

```
ART. 54 KKS — UCHYLANIE SIĘ OD OPODATKOWANIA
  Czyn: nieujawnienie właściwemu organowi przedmiotu lub podstawy
  opodatkowania, lub niezłożenie deklaracji — przez ZANIECHANIE (podatnik
  "milczy", nie składa niczego), różni się tym od art. 56 (podatnik "mówi",
  ale kłamie).
  Skutek: narażenie podatku na uszczuplenie.
  Kara: zależna od kwoty — przestępstwo skarbowe (grzywna/PW) albo
  wykroczenie skarbowe (kwota poniżej progu ustawowego — weryfikuj aktualny
  próg w ISAP, indeksowany do minimalnego wynagrodzenia).

ART. 55 KKS — FIRMANCTWO
  Czyn: prowadzenie działalności gospodarczej na cudzą tożsamość/firmę w
  celu zatajenia przed fiskusem prowadzenia działalności przez faktycznego
  beneficjenta.
  Kara: grzywna lub PW do 3 lat (zależnie od kwoty uszczuplenia).

ART. 56 KKS — OSZUSTWO PODATKOWE (podanie nieprawdy/zatajenie w deklaracji)
  Czyn: złożenie deklaracji/oświadczenia organowi podatkowemu, płatnikowi
  lub innemu uprawnionemu organowi z podaniem nieprawdy LUB zatajeniem
  prawdy, LUB niedopełnienie obowiązku zawiadomienia o zmianie danych —
  skutkujące narażeniem podatku na uszczuplenie. Różni się od art. 54 tym,
  że tu podatnik AKTYWNIE składa dokument (ale kłamie), a nie milczy.
  §1 — typ podstawowy: grzywna do 720 stawek dziennych, PW, albo obie kary
  §2 — kwota "małej wartości": tylko grzywna do 720 stawek dziennych
  §3 — kwota poniżej progu ustawowego: WYKROCZENIE skarbowe (niższe zagrożenie)
  §4 — niezłożenie deklaracji w terminie/niewłaściwą formą (np. brak
       wymaganego podpisu elektronicznego) — zwykle wykroczenie, chyba że
       towarzyszy mu zamiar oszustwa
  ⚠️ Wymaga UMYŚLNOŚCI (zamiar bezpośredni lub ewentualny) — wyrok TK
  SK 13/05 (12.09.2005): "prawda" w art. 56 to pojęcie normatywne
  (obejmuje też właściwą kwalifikację prawną, nie tylko fakty), ale
  niedokładność podatkowa NIE JEST automatycznie oszustwem — prokuratura
  musi wykazać świadomość i wolę sprawcy.
  Przedawnienie: NIE biegnie od daty czynu, lecz od końca roku, w którym
  upłynął termin płatności podatku; dodatkowo — przedawnienie odpowiedzialności
  karnoskarbowej następuje też, gdy przedawni się sam obowiązek podatkowy
  (nawet jeśli termin karny jeszcze nie upłynął) — ⛔ zawsze licz oba terminy.

ART. 62 KKS — FAKTURY NIERZETELNE/WADLIWE
  §1 — WYKROCZENIE: niewystawienie faktury wbrew obowiązkowi, lub
       wystawienie jej wadliwie (błędy formalne/rachunkowe, ALE transakcja
       była rzeczywista)
  §2 — PRZESTĘPSTWO: wystawienie lub posłużenie się fakturą NIERZETELNĄ
       ("pustą" — nieodzwierciedlającą rzeczywistej transakcji, lub
       znacząco zniekształcającą jej parametry: wartość/przedmiot/strony)
       — grzywna do 720 stawek dziennych lub PW, albo obie
  ⚠️ Rozróżnienie kluczowe: faktura WADLIWA (§1, wykroczenie) ma pokrycie
  w rzeczywistej transakcji — faktura NIERZETELNA/PUSTA (§2, przestępstwo)
  nie ma. Jeśli faktura CAŁKOWICIE fikcyjna (fingowanie samego obowiązku
  podatkowego, nie tylko jego wysokości) → NIE art. 62 KKS, lecz art. 271
  lub 271a KK (postanowienie SN IV KK 426/13).
  Zbieg z KK: puste faktury dużej wartości → kumulatywnie z art. 270a KK
  (fałszowanie faktur) i/lub art. 271a KK (poświadczenie nieprawdy w
  fakturze) — patrz niżej.

ART. 76 KKS — WYŁUDZENIE ZWROTU PODATKU (NIENALEŻNY ZWROT)
  Czyn: podanie danych niezgodnych ze stanem rzeczywistym lub zatajenie
  stanu rzeczywistego, wprowadzające w błąd organ podatkowy, narażające
  na NIENALEŻNY ZWROT podatku (typowo: zwrot VAT) lub zaliczenie nadpłaty.
  ⚠️ To jest przestępstwo POWSZECHNE (może je popełnić KAŻDY, nie tylko
  podatnik) — różni się tym od art. 56 (przestępstwo INDYWIDUALNE, tylko
  podatnik). Odpowiedzialność powstaje przy STWORZENIU WYSOKIEGO
  PRAWDOPODOBIEŃSTWA nienależnego zwrotu — NIE wymaga faktycznego
  otrzymania zwrotu (przestępstwo z narażenia, nie ze skutku majątkowego).
  Może zbiegać się kumulatywnie z art. 56 KKS, jeśli tym samym czynem
  (czyn ciągły) sprawca i uszczuplił podatek, i naraził na nienależny zwrot.

CZYNNY ŻAL (art. 16 KKS) — ⛔ ISTOTNE narzędzie obrony/samoregulacji
  Zawiadomienie organu o popełnieniu czynu zabronionego PRZED wszczęciem
  postępowania (lub zanim organ miał wyraźnie udokumentowaną wiadomość o
  czynie) + uiszczenie należności publicznoprawnej w całości w wyznaczonym
  terminie = WYŁĄCZENIE karalności. ⚠️ Warunki formalne i wyjątki (np. gdy
  organ już wszczął czynności sprawdzające) — zawsze weryfikuj aktualne
  brzmienie w ISAP przed poradą, nie zakładaj automatycznej skuteczności.
```

## ZBIEG Z KODEKSEM KARNYM — KARUZELE VAT I POWAŻNE OSZUSTWA FAKTUROWE

```
Wyłudzenia VAT na dużą skalę (karuzele podatkowe, puste faktury o wysokiej
wartości) rzadko kwalifikują się z jednego przepisu — typowy zbieg:
  KKS: art. 54/56 (uszczuplenie) + art. 62 §2 (nierzetelna faktura) +
       art. 76 (wyłudzenie zwrotu, jeśli dotyczy)
  KK: art. 270a (fałszowanie faktur) + art. 271a (poświadczenie nieprawdy
      w fakturze) + art. 258 (jeśli działanie grupowe/zorganizowane —
      patrz dr-03/mod-KK-kwalifikator-karnomaterialny.md BLOK H)
  Zagrożenie skrajne: art. 277a §1 KK — przy fakturach o wartości powyżej
  10-krotności mienia wielkiej wartości: KARA OD 5 DO 25 LAT — jeden z
  najsurowszych przepisów w całym KK.
Weryfikacja kontrahenta / należyta staranność VAT — dokumentuj procedury
  weryfikacji (KRS, CEIDG, wykaz podatników VAT, koncesje) jako element
  linii obrony przy zarzutach nieświadomego udziału w karuzeli.
```

## KWALIFIKATOR CZYNU

```
1. Czynność: co dokładnie zrobiono albo zaniechano?
2. Sprawca: kto miał obowiązek działania? (przestępstwo indywidualne —
   podatnik — czy powszechne — art. 76, każdy)
3. Pokrzywdzony: spółka, kontrahent, Skarb Państwa, wierzyciel?
4. Szkoda: kwota, utracone korzyści, uszczuplenie publicznoprawne — sprawdź
   progi "małej wartości" i próg wykroczenia (indeksowane, weryfikuj ISAP).
5. Zamiar: dowody świadomości, korespondencja, ostrzeżenia, podpisy —
   art. 56/76 wymagają UMYŚLNOŚCI, nie wystarczy błąd rachunkowy.
6. Dokumenty: faktury, umowy, uchwały, księgi, przelewy.
7. Czynny żal: czy możliwe/już złożone zawiadomienie z art. 16 KKS?
```

## WYJŚCIE

Nie przesądzaj winy. Wskaż najbardziej prawdopodobną kwalifikację, braki dowodowe, ryzyka zniesławienia i bezpieczny język zawiadomienia.

---

# STANDARDOWE UZUPEŁNIENIE MODUŁU — poziom prawa pracy / prawa karnego

> Ten blok jest częścią obowiązkową modułu. Ma pierwszeństwo przed opisowym użyciem modułu. Nie zastępuje kontroli ISAP; wymusza praktyczny workflow kancelaryjny.

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- czyn zarzucany;
- rola osoby/podmiotu;
- obieg środków;
- compliance AML;
- zawiadomienia GIIF;
- ryzyko zabezpieczenia;

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
- dokumenty księgowe;
- korespondencja zarządu;
- procedury AML;
- analizy transakcji;
- zeznania;
- opinie biegłych;

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:

1. argumentację strony inicjującej sprawę,
2. argumentację organu/przeciwnika procesowego.

Typowe ryzyka i kontrargumenty:
- samoinkryminacja;
- zabezpieczenie majątkowe;
- brak kontroli nad dokumentami;
- równoległe postępowania podatkowe;

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
