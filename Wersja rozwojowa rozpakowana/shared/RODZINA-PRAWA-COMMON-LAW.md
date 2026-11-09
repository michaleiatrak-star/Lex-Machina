# RODZINA-PRAWA-COMMON-LAW — metoda dla common law i systemów mieszanych (CL-1…CL-7)

> **Plik kanoniczny:** `shared/RODZINA-PRAWA-COMMON-LAW.md`
> **Wersja:** 1.1 | Utworzony: 2026-11-08 · 1.1: 2026-11-09 — każda reguła oparta na źródle odczytanym
> w sesji (orzeczenia, reguły procedury, publikacje urzędowe i uczelni); spis w §Ź na końcu.
> **Wywołuje:** `prawny-router-v3` (UP-5), gdy system prawny sprawy należy do rodziny common law
> (Anglia i Walia, Irlandia Północna, Szkocja w części dziedzin, Irlandia, USA) albo jest systemem
> mieszanym (Cypr, Malta) w dziedzinie opartej na common law. W aplikacji rodzinę podaje rejestr
> krajów (`family`, `familyNote`, `caseLaw`).
> **Charakter:** ⛔ BLOKUJĄCE w ścieżce common law. Uzupełnia bramki metody, nie wyłącza ich.

---

## 0. DLACZEGO OSOBNA METODA

W common law prawo „w niektórych dziedzinach jest tworzone, a w niemal wszystkich rozwijane przez
sędziów”, dlatego doktryna precedensu (stare decisis) jest podstawowa: rozstrzygnięcia sądów wyższych
w kwestiach prawnych muszą być przyjmowane przez sądy niższe [Ź-1, pkt 56, za Willers v Joyce (No 2)
[2016] UKSC 44, pkt 4]. Źródłami są więc **ustawa i precedens**; przepis bez orzeczeń, które go odczytały,
to połowa odpowiedzi.

**Relacja do bramek:** CN-GATE i REM-GATE działają bez zmian — dla ustawy i dla zasady rozstrzygnięcia
(ratio) orzeczenia. OŚ-GATE obejmuje datę orzeczenia i jego późniejsze losy (CL-4). WYJ-GATE stosuje
reguły wykładni ustaw danej jurysdykcji, odczytane ze źródła (CL-5).

**Zasada źródeł:** moduł podaje metodę i przykłady z odczytanych źródeł. Hierarchię sądów, reguły
związania i reguły procedury konkretnej jurysdykcji ustala się ze źródła tej jurysdykcji w tej turze —
także wtedy, gdy moduł je wymienia (mogły się zmienić). Literatura podstawowa wskazana przez sąd:
R. Cross, J.W. Harris, *Precedent in English Law*, 4th ed. (1991) [Ź-1, pkt 56] — powołanie książki
wymaga jej odczytu; w module nie przytacza się jej treści.

---

## CL-1 — JURYSDYKCJA I ŹRÓDŁA

```
CL-1  JURYSDYKCJA: [państwo] / [system: Anglia i Walia / Szkocja / Irlandia Płn. / stan USA]
      DZIEDZINA: [ustawowa / orzecznicza / mieszana]
      ŹRÓDŁA: ustawa → [akt, jednostka, źródło RZĘDU 1]; orzecznictwo → [baza RZĘDU 1]
```

- **Wielka Brytania — trzy systemy.** Szkocja i Irlandia Północna mają systemy prawne odrębne od
  Anglii i Walii, z odrębnymi hierarchiami sądów; wspólny jest tylko Sąd Najwyższy jako ostatnia instancja,
  tam gdzie odwołanie do niego przysługuje, oraz niektóre trybunały [Ź-1, pkt 58]. Każdy system ma własne
  reguły precedensu [Ź-1, pkt 58].
- **Zakres terytorialny ustawy (extent).** „Extent” oznacza jurysdykcję, w której ustawa jest prawem:
  całe Zjednoczone Królestwo albo jedna lub więcej z trzech jurysdykcji (Anglia i Walia; Szkocja;
  Irlandia Północna) [Ź-8]. Zakres czytaj przy jednostce w legislation.gov.uk.
- **USA — najpierw stan.** Poza sprawami regulowanymi Konstytucją federalną lub ustawami Kongresu
  stosuje się prawo stanu, ustanowione ustawą stanową albo orzeczeniem najwyższego sądu stanu;
  federalne powszechne common law nie istnieje [Ź-5, część „Third” uzasadnienia]. Bez ustalonego stanu nie
  powołuj prawa stanowego ani orzeczeń sądów stanowych — ⬛ [UZUPEŁNIJ: stan].
- **System mieszany:** dla każdej osi sporu ustal, czy dziedzina opiera się na kodeksie, czy na common
  law (`familyNote` w rejestrze; potwierdź w źródle). Ścieżkę CL-2…CL-6 stosuj tylko do dziedzin
  opartych na common law.

## CL-2 — MOC WIĄŻĄCA (STARE DECISIS)

```
CL-2  [sygnatura neutralna / oficjalny zbiór] — sąd: [ ] — data: [ ] — system: [ ]
      MOC: WIĄŻĄCE (sąd wyższy w tej samej hierarchii) / WIĄŻĄCE POZIOMO (gdy ta jurysdykcja tak
           przyjmuje) / PERSWAZYJNE (inna hierarchia, inna jurysdykcja, obiter)
      PODSTAWA: [źródło, z którego ustalono hierarchię i regułę związania]
```

Przykład z odczytanego źródła — Anglia i Walia [Ź-1, pkt 57]:
- sędziowie okręgowi (circuit judges) są związani orzeczeniami High Court, Court of Appeal i Supreme Court;
- sędziowie High Court — orzeczeniami Court of Appeal i Supreme Court;
- Court of Appeal — orzeczeniami Supreme Court;
- Supreme Court może odstąpić od własnych wcześniejszych orzeczeń na podstawie Practice Statement
  (Judicial Precedent) [1966] 1 WLR 1234, ale powinien to robić bardzo ostrożnie [Ź-1, pkt 57;
  Ź-2, pkt 22–23: nie wystarcza, że sąd rozstrzygnąłby inaczej];
- Court of Appeal jest związany własnymi wcześniejszymi orzeczeniami z ograniczonymi wyjątkami
  (Young v Bristol Aeroplane Co Ltd [1944] KB 718, 729–730) [Ź-1, pkt 57].
- Szkocja: reguły Young v Bristol Aeroplane nie stosuje się do Inner House of the Court of Session ani
  High Court of Justiciary, które mogą rewidować własne orzeczenia [Ź-1, pkt 58].

Przykład z odczytanego źródła — USA: sąd niższy stosuje orzeczenie Sądu Najwyższego, które bezpośrednio
rozstrzyga sprawę, nawet gdy wydaje się ono oparte na racjach odrzuconych w innej linii orzeczniczej;
uchylenie należy do Sądu Najwyższego [Ź-4, opinia większości, cytująca Rodriguez de Quijas v. Shearson/American
Express, Inc., 490 U.S. 477, 484 (1989)].

**Inne jurysdykcje:** reguły precedensu dotyczą tylko orzeczeń sądów w hierarchii tego samego systemu;
sąd angielski nie jest związany orzeczeniem szkockim i odwrotnie [Ź-1, pkt 59]. Orzeczenia innych
jurysdykcji mogą przekonywać (jakość uzasadnienia, kurtuazja, jednolita wykładnia konwencji
międzynarodowych, względy praktyczne), ale nie wiążą [Ź-1, pkt 60–61].

## CL-3 — RATIO DECIDENDI I OBITER DICTA

```
CL-3  FAKTY ISTOTNE: [które fakty sąd uznał za rozstrzygające — akapity]
      RATIO: [zasada, na której opiera się rozstrzygnięcie — akapity]
      OBITER: [wypowiedzi poza tym, co rozstrzygnięte — akapity]
      ZDANIA ODRĘBNE / PUNKTY PRZYZNANE PRZEZ STRONY: [nie są ratio]
```

- Wiąże rozstrzygnięcie w kwestii prawnej, nie każda wypowiedź sądu: związanie dotyczy „decyzji
  w kwestii prawnej” (Young v Bristol Aeroplane, s. 729), a rozstrzygnięcie kwestii praktyki stosowania
  prawa leży poza tymi regułami [Ź-3, pkt 37 i 39]. Wypowiedź o kwestii, której sąd nie rozstrzygał,
  jest obiter [Ź-1, pkt 81].
- Ustalenie ratio jest procesem wykładni orzeczenia [Ź-6, pkt 51]. Ratio formułuj z cytowanych akapitów
  odczytanego tekstu, nie ze streszczenia bazy ani z pamięci; przy kilku uzasadnieniach ustal, czy jest
  zasada wspólna większości — jej brak oznacz jawnie.

## CL-4 — PÓŹNIEJSZE LOSY PRECEDENSU

Przed oparciem tezy na orzeczeniu sprawdź, czy nie zostało ono uchylone, zmienione przez sąd mogący
odstąpić od precedensu (CL-2) albo zastąpione ustawą (CL-5).

```
CL-4  [sygnatura] — PÓŹNIEJSZE ORZECZENIA: [lista / BRAK TRAFIEŃ w źródle X]
      STATUS: AKTUALNE / ODSTĄPIONO / ZASTĄPIONE USTAWĄ / ⚠️ NIEUSTALONE
```

Brak trafień w bazie to „nieustalone w tym źródle”, nie „aktualne”. Zbiór historyczny (np. kończący się
na określonym roku) wymaga sprawdzenia późniejszego orzecznictwa w innym źródle; inaczej ⚠️ NIEUSTALONE.

## CL-5 — USTAWA A PRECEDENS

- Zwierzchnictwo parlamentu jest podstawową zasadą konstytucji Zjednoczonego Królestwa: parlament może
  ustanowić lub uchylić każde prawo i nikt nie może pominąć ani uchylić jego ustaw [Ź-7, pkt 43, za
  A.V. Dicey]. Rząd nie może zmienić ani ustawy, ani common law [Ź-7, pkt 44–45]. Orzeczenie, którego
  regułę zmieniła późniejsza ustawa, nie jest podstawą (CL-4: ZASTĄPIONE USTAWĄ).
- USA: prawo stanowe tworzy ustawa stanowa albo orzeczenie najwyższego sądu stanu [Ź-5, część „Third”];
  ustal, które z nich reguluje kwestię i czy ustawa nie zmieniła reguły orzeczniczej.
- Brzmienie ustawy czytaj w wersji z chwili miarodajnej (OŚ-GATE); legislation.gov.uk podaje brzmienie
  na dzień. Orzeczenia, które wyłożyły tę jednostkę, powołuj według CL-2…CL-4.
- Język tekstu wiążącego: Irlandia — przy rozbieżności tekstów ustawy rozstrzyga tekst w języku
  narodowym [Ź-11, art. 25 ust. 4 pkt 6°]; Malta — tekst maltański (Konstytucja Malty, art. 74,
  legislation.mt). Czytając tłumaczenie lub wersję drugą, zaznacz to.

## CL-6 — ODRÓŻNIENIE STANU FAKTYCZNEGO (DISTINGUISHING)

Reguły precedensu obejmują „udoskonalenia, które uczą, gdzie leży krawędź precedensu, tak że często
wcześniejsze orzeczenie można odróżnić” [Ź-1, pkt 59, za Marshalls Clay Products Ltd v Caulfield [2004]
EWCA Civ 422, pkt 32]. Dla każdego wiążącego orzeczenia porównaj fakty istotne (CL-3) ze stanem sprawy:

```
CL-6  [sygnatura] — FAKTY ISTOTNE ZGODNE: [ ] — RÓŻNICE: [ ]
      WNIOSEK: STOSUJE SIĘ / DA SIĘ ODRÓŻNIĆ (dlaczego) / NIEPEWNE
```

Precedens powołany przez stronę przeciwną zawsze przechodzi przez CL-6.

## CL-7 — PISMO W COMMON LAW

Formy pism ustalaj z reguł procedury danej jurysdykcji i sądu, odczytanych w tej turze — zakaz wzorowania
na polskim pozwie i zakaz form z pamięci. Przykłady wymogów z odczytanych reguł:

- **Anglia i Walia (Civil Procedure Rules):** formularz pozwu zawiera zwięzłe określenie charakteru
  roszczenia i żądane środki [Ź-9, CPR 16.2(1)]; szczegóły roszczenia (particulars of claim) — zwięzłe
  przedstawienie faktów, na których powód się opiera [Ź-9, CPR 16.4(1)(a)]; pisma procesowe (statement of
  case) potwierdza się oświadczeniem o prawdziwości (statement of truth) [Ź-10, CPR 22.1(1)(a)].
- **USA, sądy federalne (Federal Rules of Civil Procedure):** pismo z roszczeniem zawiera krótkie
  wskazanie podstawy jurysdykcji sądu, krótkie przedstawienie roszczenia i żądanie [Ź-12, FRCP 8(a)];
  twierdzenia w numerowanych akapitach, każdy w miarę możliwości o jednym zespole okoliczności
  [Ź-12, FRCP 10(b)]; podpisując pismo, pełnomocnik zapewnia m.in., że twierdzenia prawne mają oparcie
  w obowiązującym prawie albo w niebłahym argumencie za jego rozszerzeniem, zmianą lub odwróceniem
  [Ź-12, FRCP 11(b)(2)].
  Sądy stanowe mają własne reguły — czytaj je osobno.
- **Cytowanie:** w Wielkiej Brytanii powszechnie stosowany jest standard OSCOLA (Wydział Prawa
  Uniwersytetu Oksfordzkiego) [Ź-13]; w USA — styl przyjęty przez dany sąd (sprawdź jego reguły).

```
CL-7  REGUŁY PROCEDURY: [akt / regulamin sądu — źródło, data odczytu]
      UKŁAD: [nagłówek sprawy, strony, numerowane akapity, żądanie]
      WYMAGANE OŚWIADCZENIA: [np. statement of truth — jeśli reguły wymagają]
      CYTOWANIE: [standard tej jurysdykcji]
      ARGUMENT: ustawa → precedens wiążący (ratio, akapit) → odróżnienie precedensów strony
                przeciwnej → precedens perswazyjny
```

HYBRID-VALIDATION i ST-FINAL działają bez zmian. Pismo w obcej jurysdykcji ma zastrzeżenie, że przed
złożeniem sprawdza je prawnik uprawniony w tej jurysdykcji.

---

## WYJŚCIE — BLOK CL (przed konkluzją, zwięźle)

```
CL-1 jurysdykcja/źródła · CL-2 moc wiążąca · CL-3 ratio · CL-4 losy precedensu ·
CL-5 ustawa a precedens · CL-6 odróżnienie · CL-7 forma pisma (gdy pismo)
NIEUSTALONE: [lista pozycji ⚠️ — każda obniża pewność konkluzji]
```

---

## §Ź — ŹRÓDŁA (odczytane 2026-11-08/09)

| Nr | Źródło | Adres |
|---|---|---|
| Ź-1 | R (Jwanczuk) v Secretary of State for Work and Pensions [2025] UKSC 42, pkt 56–61, 80–81 | caselaw.nationalarchives.gov.uk/uksc/2025/42 |
| Ź-2 | Knauer v Ministry of Justice [2016] UKSC 9, pkt 22–23 | caselaw.nationalarchives.gov.uk/uksc/2016/9 |
| Ź-3 | R v Parole Board [2020] UKSC 50, pkt 37, 39 | caselaw.nationalarchives.gov.uk/uksc/2020/50 |
| Ź-4 | Agostini v. Felton, 521 U.S. 203 (1997) | static.case.law/us/521/cases/0203-01.json |
| Ź-5 | Erie Railroad Co. v. Tompkins, 304 U.S. 64 (1938) | static.case.law/us/304/cases/0064-01.json |
| Ź-6 | Skatteforvaltningen v MCML Ltd [2026] UKSC 19, pkt 51 | caselaw.nationalarchives.gov.uk/uksc/2026/19 |
| Ź-7 | R (Miller) v Secretary of State for Exiting the European Union [2017] UKSC 5, pkt 43–45 | caselaw.nationalarchives.gov.uk/uksc/2017/5 |
| Ź-8 | The National Archives, „Understanding legislation” (Geographical Extent) | legislation.gov.uk/understanding-legislation |
| Ź-9 | Civil Procedure Rules, Part 16 | justice.gov.uk/courts/procedure-rules/civil/rules/part16 |
| Ź-10 | Civil Procedure Rules, Part 22 | justice.gov.uk/courts/procedure-rules/civil/rules/part22 |
| Ź-11 | Bunreacht na hÉireann (Konstytucja Irlandii), art. 25 | irishstatutebook.ie/eli/cons/en/html |
| Ź-12 | Federal Rules of Civil Procedure, Rules 8, 10, 11 (Legal Information Institute, Cornell Law School) | law.cornell.edu/rules/frcp |
| Ź-13 | OSCOLA, Oxford Law Faculty | law.ox.ac.uk/oscola |

Niezweryfikowane w sesji: BAILII (zabezpieczenie antybotowe — nie obchodzono), treść *Precedent in
English Law* (książka). Powołania z tej tabeli to adresy dla człowieka; przed użyciem w piśmie odczytaj
je ponownie (PRAWO-HARDGATE).
