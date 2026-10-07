# Moduł [AY] — Pomoc społeczna, świadczenia i sprawy lokalowe publiczne

**Status:** moduł klasy kancelaryjnej — poziom DR-03

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
---
WSPÓLNE ZASADY DLA MODUŁU:
- przed cytowaniem przepisu zastosuj `shared/ISAP-AUDIT-PROTOCOL.md`;
- metryki aktów sprawdzaj w `shared/ISAP-METRYKI-AKTOW.md`;
- jeżeli sprawa jest procesowa, uruchom `shared/FORMAL-CHECK.md`, `shared/WARUNKI-SKUTECZNOSCI.md`, `shared/TERM-CALC.md`, `shared/RISK-ASSESSMENT.md`;
- nie mieszaj trybów: KPA, Ordynacja podatkowa, KAS, PPSA i egzekucja administracyjna mają odrębne rygory.
---

**Zakres:** zasiłki, DPS, usługi opiekuńcze, świadczenia rodzinne i lokalne, dodatki, orzeczenia organów pomocy społecznej, odwołania do SKO, skargi do WSA, świadczenia związane z niepełnosprawnością.

## ZASADY ABSOLUTNE

1. Ustal, czy sprawa jest świadczeniem z pomocy społecznej, świadczeniem rodzinnym, świadczeniem z ZUS czy sprawą lokalową — tryby różnią się zasadniczo.
2. Decyzje OPS/MOPS/GOPS zwykle zaskarża się do SKO, następnie do WSA.
3. Kluczowe są kryteria dochodowe, skład rodziny, niepełnosprawność, wywiad środowiskowy i uzasadnienie odmowy.
4. Nie cytuj progów i kwot bez sprawdzenia aktualnego rozporządzenia/ustawy.

## KLUCZOWE AKTY PRAWNE — ISAP

| Akt | Metryka robocza |
|---|---|
| Ustawa o pomocy społecznej | Dz.U. 2026 poz. 639 t.j. (obwieszczenie Marszałka Sejmu z 13.05.2026, stan na 28.04.2026; zastępuje t.j. 2025.1214) — ✅ ROZSTRZYGNIĘTE 2026-08-15 (F-28 pkt 2) |
| KPA | Dz.U. 2025 poz. 1691 według rejestru ISAP |
| PPSA | Dz.U. 2026 poz. 143 według rejestru ISAP |
| Ustawy świadczeniowe szczególne | każdorazowo sprawdzić ISAP |

## ⭐ KRYTERIA DOCHODOWE I KLUCZOWE ŚWIADCZENIA (dodano 2026-08-15, naprawa F-28 pkt 2)

⚠️ Moduł dotąd nie zawierał ŻADNEJ konkretnej kwoty ani przesłanki
merytorycznej ustawy — wyłącznie generyczny szkielet proceduralny. Poniższe
dane potwierdzone w 6+ zgodnych źródłach, w tym OFICJALNYM (gov.pl,
Ministerstwo Rodziny, Pracy i Polityki Społecznej).

```
KRYTERIUM DOCHODOWE (art. 8 ustawy, podstawa: rozporządzenie RM z
  12.07.2024, Dz.U. 2024 poz. 1044) — OBOWIĄZUJE OD 1.01.2025, BEZ ZMIAN
  W 2026 (weryfikacja co 3 lata, kolejna spodziewana 2028):
  □ Osoba samotnie gospodarująca: 1010 zł
  □ Osoba w rodzinie: 823 zł (na osobę)
  ⚠️ Rada gminy MOŻE, w drodze uchwały, PODWYŻSZYĆ kwoty uprawniające
  do zasiłków okresowego i celowego (art. 8 ust. 2) — sprawdzić lokalną
  uchwałę przed odmową z powodu przekroczenia kryterium ustawowego

PRZESŁANKA MATERIALNA (art. 7): dochód poniżej kryterium ORAZ
  wystąpienie co najmniej JEDNEGO z powodów wymienionych w art. 7 pkt
  2-15 (⚠️ katalog powodów NIE wypisany w tej sesji — sprawdź ISAP przy
  konkretnej sprawie) LUB innych okoliczności uzasadniających pomoc

ZASIŁEK STAŁY (dla osób trwale niezdolnych do pracy z powodu wieku lub
  całkowicie niezdolnych do pracy):
  □ Osoba samotnie gospodarująca: różnica między 130% kryterium (1313 zł)
    a dochodem tej osoby, MAX 1000 zł... ⚠️ ROZBIEŻNA maksymalna kwota
    między źródłami: infor.pl (2 artykuły) podaje starą wartość max
    1000 zł w jednym miejscu, ale w innym artykule (marzec 2026) oraz
    gazetaprawna.pl (marzec 2026) i rynekzdrowia.pl (grudzień 2025)
    ZGODNIE podają NOWY max: **1229,05 zł** (wzrost z 1000 zł) — NOWA
    wartość jest nowsza czasowo i szerzej potwierdzona, przyjąć 1229,05
    zł jako aktualną, ale ZWERYFIKOWAĆ w ISAP przed cytowaniem w piśmie
  □ Osoba w rodzinie: różnica między 130% kryterium na osobę w rodzinie
    (1069,90 zł) a dochodem na osobę w rodzinie

INNE KWOTY (podwyższone od 2025, potwierdzone stabilne w 2026):
  □ Pomoc na usamodzielnienie: wzrost do 2066 zł (z 1837 zł)
  □ Świadczenie na naukę języka polskiego dla cudzoziemców ze statusem
    uchodźcy/ochroną uzupełniającą/pobytem czasowym: wzrost do 950 zł
    (z 721 zł) — minimalna kwota

DOCHÓD — SPOSÓB LICZENIA (art. 8 ust. 3 i n.): suma miesięcznych
  przychodów z miesiąca poprzedzającego wniosek (lub miesiąca złożenia
  wniosku przy utracie dochodu), pomniejszona o podatek PIT, koszty
  uzyskania przychodu, składki na ubezpieczenie zdrowotne i społeczne

FORMY POMOCY (art. 15-16): świadczenia PIENIĘŻNE (zasiłki stały,
  okresowy, celowy — m.in. na żywność, leki, ogrzewanie, pogrzeb) oraz
  NIEPIENIĘŻNE (praca socjalna, usługi opiekuńcze, interwencja
  kryzysowa, schronienie, posiłki, poradnictwo specjalistyczne,
  mieszkania treningowe/wspomagane). Obowiązek realizacji zadań pomocy
  społecznej spoczywa na JST oraz organach administracji rządowej
  w zakresie ustalonym ustawą.

⚠️ KONTEKST DODATKOWY: t.j. 2026.639 uwzględnia m.in. ustawę z
  23.01.2026 r. o WYGASZENIU rozwiązań pomocy obywatelom Ukrainy
  w związku z konfliktem zbrojnym (Dz.U. 2026 poz. 203) — WPŁYW na
  krąg cudzoziemców uprawnionych do świadczeń NIE zbadany w tej sesji,
  wymaga odrębnej weryfikacji przy sprawie dotyczącej obywatela Ukrainy.
```

## WALIDACJA

```text
□ rodzaj świadczenia
□ organ I instancji i SKO
□ data decyzji i doręczenia
□ kryterium dochodowe i dokumenty dochodowe
□ wywiad środowiskowy
□ niepełnosprawność / orzeczenie / potrzeba opieki
□ możliwość zabezpieczenia lub świadczenia tymczasowego
```

---

# STANDARDOWE UZUPEŁNIENIE MODUŁU — poziom prawa pracy / prawa karnego

> Ten blok jest częścią obowiązkową modułu. Ma pierwszeństwo przed opisowym użyciem modułu. Nie zastępuje kontroli ISAP; wymusza praktyczny workflow kancelaryjny.

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- rodzaj świadczenia;
- organ;
- kryterium dochodowe;
- skład rodziny;
- decyzja/bezczynność;
- termin odwołania;

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
- wniosek;
- decyzja;
- zaświadczenia dochodowe;
- orzeczenia niepełnosprawności;
- wywiad środowiskowy;
- dokumentacja medyczna;

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:

1. argumentację strony inicjującej sprawę,
2. argumentację organu/przeciwnika procesowego.

Typowe ryzyka i kontrargumenty:
- brak dowodów dochodu;
- niewykazanie przesłanek szczególnych;
- przekroczenie terminu;
- niewłaściwy tryb skargi;

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

## QUALITY GATE

- [ ] Aktualny tekst t.j. aktu zweryfikowany w ISAP?
- [ ] Stan prawny właściwy temporalnie (na dzień zdarzenia i na dzień orzekania)?
- [ ] Każda przesłanka ma przypisany dowód?
- [ ] Termin nie upłynął?
- [ ] Właściwy organ / sąd wskazany?
- [ ] Ryzyka formalne i dowodowe ocenione?
- [ ] Brzmienie przepisów ze źródeł, nie z pamięci modelu?

## OUTPUT

1. Stan faktyczny; 2. Stan prawny i źródła; 3. Kwalifikacja trybu i właściwość;
4. Terminy (obliczone, daty graniczne); 5. Przesłanki (spełnione / wątpliwe / niespełnione);
6. Matryca dowodowa (teza → dowód → siła → luka); 7. Zarzuty i kontrargumenty;
8. Analiza ryzyk; 9. Strategia (podstawowy + ewentualny); 10. Rekomendacja;
11. Kontrola ISAP/temporalności.
