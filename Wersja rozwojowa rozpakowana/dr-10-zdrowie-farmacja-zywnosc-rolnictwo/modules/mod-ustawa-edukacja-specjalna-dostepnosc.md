# mod-BS-edukacja-specjalna-dostepnosc-ppp — EDUKACJA SPECJALNA, PPP I DOSTĘPNOŚĆ

Status: moduł prawa polskiego klasy wzorcowej, uzupełniony do standardu prawa pracy i prawa karnego.
Data wdrożenia: 2026-05-28.
Zakres: orzeczenia PPP, kształcenie specjalne, uczelnie, dostosowania, dyskryminacja.

## Wspólne moduły obowiązkowe

Zawsze stosuj razem z:

- `shared/MODULE-STANDARD-POLISH-LAW.md`,
- `shared/ISAP-AUDIT-PROTOCOL.md`,
- `shared/TEMPORAL-LAW-CHECK.md`,
- `shared/LEGAL-LIFECYCLE-MANAGEMENT.md`,
- `shared/LEGAL-QUALITY-GATE.md`,
- `shared/RISK-ASSESSMENT.md`,
- `shared/QUALITY-CHECK.md`.

## 1. Zakaz pracy z pamięci

Dziennik Ustaw, status aktu, data wejścia w życie, brzmienie przepisu i przepisy przejściowe muszą być sprawdzone w ISAP na dzień użycia. Jeżeli ISAP nie daje bezpośredniego dostępu do tekstu aktu albo aktu wykonawczego, wolno użyć LEX/Legalis wyłącznie pomocniczo i oznaczyć źródło w raporcie. Nie wolno rekonstruować brzmienia przepisu z pamięci.

## 2. Intake obowiązkowy

Ustal:

1. typ sprawy i tryb;
2. organ/sąd/właściwy samorząd;
3. daty zdarzeń, decyzji, doręczeń i terminów;
4. stan prawny na dzień zdarzenia, decyzji i wniesienia środka;
5. interes prawny i legitymację;
6. rozstrzygnięcie zaskarżane lub czynność kwestionowaną;
7. dowody podstawowe i brakujące;
8. możliwe równoległe tryby: cywilny, karny, administracyjny, dyscyplinarny, pracowniczy.

## 3. Warstwa normatywna CORE

Dla każdego używanego przepisu wygeneruj tabelę:

| Akt | Dz.U./tekst jednolity | Przepis | Brzmienie z ISAP/LEX/Legalis | Znaczenie | Skutek procesowy |
|---|---|---|---|---|---|
| Prawo oświatowe | Dz.U. 2026 poz. 820 t.j. (obwieszczenie 12.06.2026) | art. 127 | orzeczenie o potrzebie kształcenia specjalnego wydaje zespół orzekający w publicznej poradni psychologiczno-pedagogicznej | przesłanka dostępu do kształcenia specjalnego | podstawa organizacji nauki/wsparcia w placówce |
| Rozp. MEN ws. orzeczeń PPP | Dz.U. 2026 poz. 428 (rozporządzenie z 2.03.2026 — ⚡ ZASTĘPUJE dawne rozp. z 7.09.2017, Dz.U. 2017 poz. 1743, JUŻ NIEOBOWIĄZUJĄCE) | całość | tryb wniosku, skład zespołu orzekającego, katalog przesłanek (niepełnosprawności, niedostosowanie społeczne, zagrożenie niedostosowaniem) | tryb i forma orzeczenia | podstawa odwołania/skargi na orzeczenie |
| Ustawa o zapewnianiu dostępności osobom ze szczególnymi potrzebami | Dz.U. 2024 poz. 1411 t.j. (pierwotnie: Dz.U. 2019 poz. 1696) | art. 4-7 | obowiązek podmiotu publicznego: uniwersalne projektowanie lub racjonalne usprawnienia | przesłanka obowiązku dostępności | podstawa wniosku o zapewnienie dostępności |
| tamże | tamże | art. 29-30 | wniosek o zapewnienie dostępności — dla osoby ze szczególnymi potrzebami po wykazaniu interesu faktycznego; termin 14 dni na realizację (przedłużalny do 2 mies.) | tryb wnioskowy | punkt startowy przed skargą |
| tamże | tamże | art. 32-33 | skarga na brak dostępności do Prezesa Zarządu PFRON, termin 30 dni od upływu terminu na wniosek/odmowy; postępowanie JEDNOINSTANCYJNE, decyzja nakazowa z terminem realizacji (min. 30 dni, w sprawach skomplikowanych 60 dni) | tryb skargowy | egzekucja przez grzywnę w celu przymuszenia (UPEA) |

⚠️ Weryfikuj każdorazowo, czy nie ukazał się nowszy t.j. ustawy o dostępności
(2024.1411 może już nie być najnowszym — sprawdź isap.sejm.gov.pl na dzień
użycia, ustawa nowelizowana relatywnie często w związku z wdrażaniem
European Accessibility Act/dyrektywy UE 2019/882).

Nie wpisuj literalnego brzmienia, jeżeli nie zostało pobrane z aktualnego źródła urzędowego albo wskazanego systemu prawniczego.

---

## MATERIAŁ MERYTORYCZNY — ORZECZENIE PPP I DOSTĘPNOŚĆ

```
✅ TREŚĆ DODANA 2026-08-21 (F-45) — moduł był CAŁKOWICIE pustym
szkieletem (tylko struktura 10-sekcyjna, zero przepisów). Zweryfikowane
10+ zgodnymi źródłami (pedagogika-specjalna.edu.pl, mojebambino.pl,
poradnia.piotrkow.pl, glospedagogiczny.pl, pppwyszkow.pl, ppp-pyskowice.pl,
PFRON ×5 [dostepnosc.pfron.org.pl, pfron.org.pl], sip.lex.pl [OpenLEX],
gazetaprawna.pl 06.2026).

⭐ PODZIAŁ ZAKRESU z `dr-05-prawo-administracyjne-sadowoadministracyjne/modules/mod-ustawa-dostepnosc-niepelnosprawni.md`
(ten sam akt — ustawa o zapewnianiu dostępności — omawiany z dwóch stron;
przy okazji synchronizacji map 2026-08-21 naprawiono TAM błędny numer
2022.2240 i błędne terminy 30/60 dni, które NIE były zgodne z treścią
poniżej): TEN moduł (dr-10) — pełny tryb trójstopniowy + styk z edukacją
specjalną; dr-05 — kąt administracyjno-proceduralny, eskalacja do WSA.
```

**A. ORZECZENIE O POTRZEBIE KSZTAŁCENIA SPECJALNEGO**
```
KTO WYDAJE (dwutorowo, zależnie od rodzaju niepełnosprawności):
  → publiczna poradnia psychologiczno-pedagogiczna WŁAŚCIWA dla siedziby
    przedszkola/szkoły — dla: niepełnosprawności ruchowej (w tym afazja),
    niepełnosprawności intelektualnej (lekka/umiarkowana/znaczna)
  → publiczna poradnia SPECJALISTYCZNA wskazana przez KURATORA OŚWIATY
    — dla: niesłyszący, słabosłyszący, niewidomi, słabowidzący, autyzm
    (w tym zespół Aspergera), niepełnosprawność sprzężona
  → RÓWNIEŻ dla: niedostosowania społecznego, zagrożenia niedostosowaniem
    społecznym

KTO SKŁADA WNIOSEK: rodzice, opiekun prawny, podmiot sprawujący pieczę
zastępczą, LUB pełnoletni uczeń. ⛔ SZKOŁA/PRZEDSZKOLE (dyrektor,
nauczyciele) NIE MOŻE samodzielnie wystąpić o orzeczenie — częsty błąd
w praktyce, wart odnotowania przy doradzaniu rodzicom.

PROCEDURA: wniosek pisemny do zespołu orzekającego + dokumentacja
(opinie/zaświadczenia specjalistów, wyniki badań psychologicznych/
pedagogicznych/lekarskich). Zespół może zwrócić się do placówki o opinię
o uczniu (termin 7 dni). Wnioskodawca ma PRAWO uczestniczyć w posiedzeniu
zespołu i przedstawić stanowisko. Przy nieuwzględnieniu wniosku — zespół
wydaje orzeczenie o BRAKU potrzeby kształcenia specjalnego (nie milczy —
wydaje formalny akt, który można zaskarżyć).

PODSTAWA PRAWNA PROCEDURY: rozporządzenie MEN z 2.03.2026 r. (Dz.U. 2026
poz. 428) — ⚡ ZASTĘPUJE dawne rozporządzenie z 7.09.2017 r. (Dz.U. 2017 poz. 1743),
które wciąż pojawia się w wielu materiałach online jako aktualna podstawa —
NIE JEST już aktualne, sprawdzaj datę źródła przed cytowaniem.

WIEK: dokument może być wydany od ok. 2,5-3 roku życia do ukończenia
nauki w placówce ponadpodstawowej.

⭐ Kształcenie specjalne może być realizowane w: przedszkolu/szkole
ogólnodostępnej, integracyjnej, specjalnej — wybór miejsca nauczania
należy OSTATECZNIE do wnioskodawcy (rodzica), nie do zespołu orzekającego
ani placówki — zespół tylko REKOMENDUJE formy w treści orzeczenia.
```

**B. USTAWA O ZAPEWNIANIU DOSTĘPNOŚCI OSOBOM ZE SZCZEGÓLNYMI POTRZEBAMI**
```
ZAKRES: dostępność ARCHITEKTONICZNA, CYFROWA, INFORMACYJNO-KOMUNIKACYJNA
zapewniana przez PODMIOTY PUBLICZNE (jednostki sektora finansów
publicznych i podmioty pod ich kontrolą) — uniwersalne projektowanie
LUB racjonalne usprawnienia.

TRYB TRÓJSTOPNIOWY (⭐⭐ kluczowy dla praktyki — kolejność ma znaczenie):
1) INFORMACJA o braku dostępności — może złożyć KAŻDY (bez interesu
   prawnego/faktycznego), nie uruchamia terminów proceduralnych wprost,
   ale jest punktem wyjścia
2) WNIOSEK o zapewnienie dostępności — TYLKO osoba ze szczególnymi
   potrzebami LUB jej przedstawiciel ustawowy, PO wykazaniu interesu
   FAKTYCZNEGO. Podmiot publiczny ma 14 DNI na realizację, może
   wydłużyć do 2 MIESIĘCY z powiadomieniem wnioskodawcy o nowym
   terminie i przyczynach
3) SKARGA do PREZESA ZARZĄDU PFRON — gdy podmiot NIE zapewnił
   dostępności w terminie/sposobie LUB odmówił. Termin: 30 DNI, liczony
   od: (a) upływu 14 dni od doręczenia wniosku [brak reakcji], (b) upływu
   terminu wskazanego w powiadomieniu o wydłużeniu, LUB (c) otrzymania
   zawiadomienia o braku możliwości zapewnienia dostępności.
   Postępowanie przed Prezesem PFRON jest JEDNOINSTANCYJNE — decyzja
   NAKAZOWA wskazuje sposób zapewnienia dostępności i termin realizacji
   (min. 30 dni, w sprawach skomplikowanych min. 60 dni)

⭐⭐⭐ DALSZA ESKALACJA (adresat czwartego poziomu): od decyzji Prezesa
PFRON — SKARGA DO WOJEWÓDZKIEGO SĄDU ADMINISTRACYJNEGO W WARSZAWIE
(właściwość wyłączna, nie WSA lokalny wg miejsca zamieszkania —
⚠️ częsty błąd, sprawdź przed wniesieniem skargi, do którego WSA).

EGZEKUCJA: jeśli podmiot publiczny NIE wykona nakazu mimo decyzji —
Prezes PFRON stosuje przepisy UPEA o grzywnie w celu przymuszenia;
środki z grzywien trafiają do Funduszu Dostępności.

⭐ Ustawa NIE obejmuje wyłącznie dostępności cyfrowej — w tym zakresie
subsydiarnie stosuje się ustawę o dostępności cyfrowej stron
internetowych i aplikacji mobilnych podmiotów publicznych (odrębny akt,
4.04.2019, poza szczegółowym zakresem tego modułu).
```

---

## 4. Procedura

Wybierz właściwy tor:

- wniosek pierwotny;
- odwołanie/zażalenie/sprzeciw;
- skarga do WSA;
- środek do sądu powszechnego;
- skarga kasacyjna/kasacja;
- skarga dyscyplinarna;
- wniosek dowodowy;
- skarga administracyjna;
- skarga na przewlekłość;
- zawiadomienie karne albo deliktowe, jeżeli zachowanie przekracza zwykłe naruszenie proceduralne.

## 5. Dowody

Każda teza musi mieć przypisany dowód. Obowiązkowa tabela:

| Teza | Dowód | Źródło | Siła | Luka | Działanie |
|---|---|---|---|---|---|
| przesłanka ustawowa | dokument/zeznanie/opinia | akta/organ/sąd | wysoka/średnia/niska | co nieudowodnione | uzupełnić/wnioskować/atakować |

## 6. Biegli i opinie

Jeżeli sprawa zawiera element specjalistyczny, zastosuj `shared/EXPERT-OPINION-AUDIT.md`.

W szczególności sprawdź:

- zakres tezy dowodowej;
- kwalifikacje biegłego;
- kompletność dokumentacji;
- metodologię;
- odpowiedź na pytania sądu/organu;
- funkcjonalne skutki ustaleń;
- możliwość opinii uzupełniającej albo innego biegłego.

## 7. Strategia

Zawsze wygeneruj:

1. najkorzystniejszą konstrukcję roszczenia/wniosku/środka;
2. argument podstawowy;
3. argument ewentualny;
4. najsilniejszy kontrargument organu/przeciwnika;
5. odpowiedź na kontrargument;
6. ryzyka formalne;
7. ryzyka dowodowe;
8. ryzyka kosztowe;
9. rekomendowane następne pismo.

## 8. Orzecznictwo

Nie twórz fikcyjnych sygnatur. Orzecznictwo pobieraj z oficjalnych baz sądów, SN, NSA/CBOSA albo wiarygodnych systemów prawniczych. Dla każdego orzeczenia wskaż:

- sąd;
- datę;
- sygnaturę;
- tezę użyteczną;
- relację do stanu faktycznego;
- aktualność linii orzeczniczej;
- czy jest to argument główny, pomocniczy, czy ryzykowny.

## 9. Quality gate

Nie kończ analizy bez odpowiedzi:

- czy sprawdzono aktualność aktu;
- czy stan prawny jest właściwy temporalnie;
- czy wskazano pełną podstawę prawną;
- czy znane jest brzmienie przepisu z aktualnego źródła;
- czy każda przesłanka ma dowód;
- czy istnieje termin i czy nie upłynął;
- czy dobrano właściwy tryb;
- czy wnioski są procesowo wykonalne.

## 10. Output

Standard odpowiedzi/pisma:

1. stan faktyczny;
2. stan prawny i źródła;
3. przesłanki;
4. dowody;
5. zarzuty;
6. analiza ryzyk;
7. strategia;
8. wnioski;
9. załączniki;
10. kontrola ISAP/temporalności.
