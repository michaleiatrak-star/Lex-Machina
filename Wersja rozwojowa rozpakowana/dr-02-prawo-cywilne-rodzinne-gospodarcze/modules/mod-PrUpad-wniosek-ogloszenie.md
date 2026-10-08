# Upadłość — przesłanki, wniosek, zabezpieczenie, ogłoszenie i pre-pack (PrUp art. 1–56h)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo upadłościowe — t.j. [Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf) (ELI DU/2026/913; akt bazowy DU/2003/535)
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prup/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2003/535 → DU/2026/913, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** brak (DU/2026/1206 zmienia art. 452 i 456 — inny moduł)
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prup.py article NUMER --verify-online`; wersję dla dat sprawy ustal w `references/insolvency/wersje-i-przepisy-przejsciowe.md`. Moduł streszcza — nie zastępuje brzmienia.

---

## FAZA 0 — INTAKE

```
□ Kim jest dłużnik? przedsiębiorca KC / sp. z o.o., PSA, SA bez działalności / wspólnik
  osobowej spółki odpowiadający całym majątkiem / wspólnik spółki partnerskiej (art. 5)
□ Czy podmiot jest wyłączony z upadłości (art. 6)? → STOP, wskaż inną ścieżkę
□ Konsument (nieprzedsiębiorca)? → mod-PrUpad-konsument-workflow (tytuł V cz. III)
□ Zmarły przedsiębiorca / zarząd sukcesyjny / wykreślony / faktyczny przedsiębiorca? (art. 7–9, 11a)
□ Czy toczy się restrukturyzacja albo złożono wniosek restrukturyzacyjny? (art. 9a–9b)
□ Daty: najstarsze niezapłacone wymagalne zobowiązanie; od kiedy opóźnienie > 3 mies.;
  od kiedy (osoba prawna) zobowiązania > majątek i czy trwa > 24 mies.
□ Majątek: czy wystarcza na koszty postępowania? obciążenia rzeczowe? czynności do
  zaskarżenia (art. 13 ust. 3)?
□ Kto składa: dłużnik / wierzyciel osobisty / inny uprawniony (art. 20)?
□ Wierzyciel: czy wierzytelność jest w całości sporna i spór sprzed wniosku? (art. 12a)
□ Czy jest nabywca przedsiębiorstwa → przygotowana likwidacja (art. 56a–56h)?
□ Zaliczka (art. 22a) — kwota z obwieszczenia Prezesa GUS za III kw. roku poprzedniego
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 1–4a | cel, zakres, wszczęcie tylko na wniosek, odpowiednie stosowanie części pierwszej, „Rejestr” = KRZ | A |
| 5–9b | zdolność upadłościowa, wyłączenia, zmarły / wykreślony / faktyczny przedsiębiorca, zbieg z restrukturyzacją | B |
| 10–13 | niewypłacalność (płynnościowa i bilansowa), zarząd sukcesyjny, spór, brak majątku | C |
| 18–19 | sąd upadłościowy, COMI, przekazanie | D |
| 20–25a | legitymacja, obowiązek dłużnika i odpowiedzialność, treść wniosku, zaliczka, załączniki, oświadczenie | E |
| 26–35 | uczestnicy, kurator, tryb, terminy sądu, zwrot, cofnięcie, wysłuchanie, biegły, koszty, zażalenie, zła wiara, KPC | F |
| 36–43 | zabezpieczenie: tymczasowy nadzorca, egzekucje i rachunek, zarząd przymusowy, upadek | G |
| 51–54b | postanowienie o ogłoszeniu, data upadłości, doręczenia, II instancja, zażalenie co do jurysdykcji | H |
| 56a–56h | przygotowana likwidacja (pre-pack) | I |
| uchylone | 12, 14–17, 24a, 28, 31, 41, 42, 55, 56 — nie są podstawą działania | — |

---

## A. Zakres i zasady (art. 1–4a)

- Art. 1: ustawa reguluje wspólne dochodzenie roszczeń od niewypłacalnych przedsiębiorców i osób fizycznych nieprowadzących działalności, skutki ogłoszenia upadłości i umarzanie zobowiązań osób fizycznych (ust. 1 pkt 5 uchylony); ust. 2 obejmuje inne podmioty wskazane w ustawie.
- Art. 2: cel nadrzędny — zaspokojenie wierzycieli w jak najwyższym stopniu, a jeśli racjonalne względy pozwolą — zachowanie przedsiębiorstwa (ust. 1); wobec osób fizycznych także umożliwienie umorzenia zobowiązań (ust. 2). Argument interpretacyjny przy wyborze pre-packu, sprzedaży w całości, kontynuacji.
- Art. 3: postępowanie wyłącznie na wniosek uprawnionego — sąd nie wszczyna z urzędu.
- Art. 4: część pierwsza stosowana odpowiednio do innych postępowań z ustawy oraz do postępowań z art. 36 i rozdziału V rozporządzenia 2015/848 (ust. 2).
- Art. 4a: „Rejestr” = Krajowy Rejestr Zadłużonych — tam następują obwieszczenia (art. 27 ust. 4).

## B. Kogo dotyczy (art. 5–9b)

**Zdolność (art. 5):** przedsiębiorcy w rozumieniu KC; ponadto sp. z o.o., PSA i SA nieprowadzące działalności, wspólnicy osobowych spółek handlowych odpowiadający bez ograniczenia całym majątkiem oraz wspólnicy spółki partnerskiej.

**Wyłączeni (art. 6) — nie można ogłosić upadłości:**
```
1) Skarb Państwa            5) rolnik bez innej działalności gospodarczej/zawodowej
2) JST                      6) uczelnie
3) SP ZOZ                   7) fundusze inwestycyjne
4) instytucje i osoby prawne utworzone ustawą (chyba że ustawa stanowi inaczej)
   lub w wykonaniu obowiązku nałożonego ustawą
```

**Szczególne sytuacje osoby fizycznej:**

| Sytuacja | Warunek | Kto składa |
|---|---|---|
| Śmierć przedsiębiorcy (art. 7) | wniosek w ciągu **roku od śmierci**; przy zarządzie sukcesyjnym także później, ale przed jego wygaśnięciem | wierzyciel, zarządca sukcesyjny, spadkobierca, małżonek, dzieci, rodzice (nawet niedziedziczący) |
| Wykreślony przedsiębiorca (art. 8 ust. 1) | **rok od wykreślenia** z rejestru; tryb tytułu V cz. III | tylko wierzyciel |
| Były wspólnik osobowej spółki (art. 8 ust. 2) | odpowiednio jak wyżej | wierzyciel |
| Faktyczna działalność bez wpisu (art. 9) | **rok od zaprzestania**; tryb tytułu V cz. III | tylko wierzyciel |
| Zarząd sukcesyjny (art. 11a) | niewypłacalność w zakresie czynności zarządcy sukcesyjnego; domniemanie 3 mies. stosuje się odpowiednio | — |

**Zbieg z restrukturyzacją (art. 9a–9b) — kolejność:**
```
Otwarte PPU / PU / sanacja → nie można ogłosić upadłości do zakończenia albo prawomocnego
  umorzenia; rozpoznanie wniosku upadłościowego wstrzymane (9a ust. 1)
PZU: od obwieszczenia o dniu układowym do prawomocnego umorzenia albo złożenia wniosku
  o zatwierdzenie układu → wstrzymanie (9a ust. 2)
Oba wnioski złożone → najpierw restrukturyzacyjny (9b ust. 1); wstrzymanie upadłościowego
  do prawomocnego orzeczenia, ale zabezpieczenie majątku dopuszczalne (9b ust. 2)
Wyjątki: interes ogółu wierzycieli → wspólne rozpoznanie jednym postanowieniem
  w składzie upadłościowym (9b ust. 3); znaczne opóźnienie ze szkodą dla wierzycieli
  i znane podstawy restrukturyzacji → sąd rozpoznaje wniosek upadłościowy i zawiadamia
  sąd restrukturyzacyjny (9b ust. 4)
```

## C. Podstawy ogłoszenia upadłości (art. 10–13)

**Art. 10:** upadłość ogłasza się wobec dłużnika, który stał się niewypłacalny.

**Test płynnościowy (art. 11 ust. 1–1a):** utrata zdolności wykonywania **wymagalnych zobowiązań pieniężnych**; **domniemanie** — opóźnienie przekracza **trzy miesiące**. Domniemanie jest wzruszalne; brak 3 miesięcy nie wyklucza niewypłacalności z ust. 1.

**Test bilansowy (art. 11 ust. 2–5) — tylko osoby prawne i jednostki bez osobowości prawnej, którym odrębna ustawa przyznaje zdolność prawną:**
```
zobowiązania pieniężne > wartość majątku  I  stan trwa > 24 miesiące
Nie wlicza się:
  - do majątku: składników spoza masy upadłości (ust. 3)
  - do zobowiązań: przyszłych, pod warunkiem zawieszającym, wobec wspólnika/akcjonariusza
    z pożyczki lub czynności o podobnych skutkach z art. 342 ust. 1 pkt 4 (ust. 4);
    instrumentów Tier I/Tier II i pożyczek podporządkowanych banków (ust. 4a);
    obligacji kapitałowych i pożyczek podporządkowanych zakładów ubezpieczeń (ust. 4b)
Domniemanie (ust. 5): wg bilansu zobowiązania — bez rezerw i bez zobowiązań wobec
  jednostek powiązanych — przekraczają aktywa przez > 24 miesiące
Ust. 6: sąd MOŻE oddalić wniosek, gdy nie ma zagrożenia utraty płynności w niedługim czasie
Ust. 7: testu bilansowego (ust. 2–6) nie stosuje się do spółki osobowej, w której
  co najmniej jeden wspólnik odpowiadający bez ograniczenia jest osobą fizyczną
```

**Oddalenie wniosku — przesłanki (obligatoryjne / fakultatywne):**

| Podstawa | Charakter | Uwagi |
|---|---|---|
| Wierzytelność wnioskodawcy w całości sporna, spór sprzed wniosku (art. 12a) | obligatoryjne | ciężar wykazania na dłużniku; spór częściowy nie wystarcza |
| Majątek nie wystarcza na koszty albo wystarcza tylko na koszty (art. 13 ust. 1) | obligatoryjne | |
| Majątek obciążony hipoteką/zastawem tak, że reszta nie pokrywa kosztów (art. 13 ust. 2) | fakultatywne | |
| Brak zagrożenia płynności przy teście bilansowym (art. 11 ust. 6) | fakultatywne | |

- Art. 13 ust. 3 — **wyjątek od oddalenia:** uprawdopodobnienie, że obciążenia lub inne czynności są bezskuteczne albo dokonane z pokrzywdzeniem wierzycieli, a ich zaskarżenie da majątek przewyższający koszty → ust. 1–2 nie stosuje się. Dowody: daty czynności, kontrahenci powiązani, wartości (zob. `mod-PrUpad-skutki-masa-bezskutecznosc`).
- Art. 13 ust. 2a: przy oddaleniu sąd ustala, czy materiał daje podstawę do rozwiązania podmiotu z KRS bez likwidacji.
- Art. 13 ust. 4–7: prawomocne oddalenie z ust. 1 lub 2 obwieszcza się; postanowienie zawiera dane identyfikujące dłużnika (a przy spółce osobowej — wspólników odpowiadających bez ograniczenia); dostęp do akt przez system teleinformatyczny dla osoby, która dostatecznie usprawiedliwi potrzebę.

## D. Sąd (art. 18–19)

- Art. 18: sąd rejonowy — sąd gospodarczy, skład **trzech sędziów zawodowych**.
- Art. 19 — COMI: miejsce regularnego zarządzania działalnością rozpoznawalne dla osób trzecich (ust. 1a). Domniemania: osoba prawna/jednostka — siedziba (1b); przedsiębiorca osoba fizyczna — główne miejsce wykonywania działalności; inna osoba fizyczna — miejsce zwykłego pobytu (1c). Brak COMI w RP → zwykły pobyt/siedziba, potem miejsce majątku (ust. 3). Przekazanie w toku sprawy bez zażalenia, wiąże sąd, czynności zachowują moc (ust. 4); **po ogłoszeniu upadłości przekazanie niedopuszczalne** (ust. 5).
- Postępowanie transgraniczne: w postanowieniu o ogłoszeniu wskazuje się podstawę jurysdykcji i charakter (główne/uboczne) — art. 51 ust. 2a.

## E. Wniosek (art. 20–25a)

**Legitymacja (art. 20):** dłużnik lub każdy **wierzyciel osobisty** (ust. 1). Ponadto (ust. 2): wspólnik odpowiadający bez ograniczenia (spółki osobowe); każdy uprawniony do prowadzenia spraw i reprezentacji (samodzielnie lub łącznie); organ założycielski przedsiębiorstwa państwowego; uprawniony z akcji/udziałów Skarbu Państwa w jednoosobowej spółce SP; likwidator; kurator z art. 42 § 1 KC; organ udzielający pomocy publicznej > 100 000 euro; zarządca w egzekucji z zarządu przymusowego albo sprzedaży przedsiębiorstwa; spółka dominująca w grupie spółek.

**Obowiązek dłużnika i odpowiedzialność (art. 21):**
```
Termin: nie później niż 30 dni od dnia, w którym wystąpiła podstawa ogłoszenia upadłości (ust. 1)
Osoba prawna / jednostka: obowiązek na KAŻDYM uprawnionym do prowadzenia spraw i reprezentacji (ust. 2)
Zarząd sukcesyjny: obowiązek na zarządcy sukcesyjnym; gdy podstawa sprzed ustanowienia
  zarządu — termin biegnie od jego ustanowienia; zgoda sukcesorów niepotrzebna (ust. 2a)
Odpowiedzialność za szkodę z niezłożenia w terminie, chyba że brak winy; zwolnienie
  w szczególności, gdy w terminie otwarto restrukturyzację albo zatwierdzono układ w PZU (ust. 3)
Domniemanie: szkoda wierzyciela = wysokość jego niezaspokojonej wierzytelności (ust. 3a)
Brak odpowiedzialności, gdy obowiązek powstał w czasie egzekucji przez zarząd przymusowy
  albo sprzedaż przedsiębiorstwa (KPC) (ust. 5)
```
⚠️ Termin liczy się od dnia wystąpienia **podstawy** (art. 10–11), nie od pierwszego opóźnienia. W kalendarzu wskaż zdarzenie początkowe.

**Przepisy powiązane (zweryfikowane w ELI 08.10.2026):**
- KSH art. 299 (t.j. DU/2024/18): członkowie zarządu sp. z o.o. odpowiadają solidarnie przy bezskutecznej egzekucji; egzoneracja m.in. przez wniosek o upadłość „we właściwym czasie”, otwarcie restrukturyzacji albo zatwierdzenie układu, brak winy albo brak szkody; § 4 — brak odpowiedzialności w czasie egzekucji przez zarząd przymusowy/sprzedaż przedsiębiorstwa. ⚠️ Po t.j. ogłoszono zmiany KSH (m.in. DU/2026/644, DU/2026/176 od 18.02.2027) — przed powołaniem odczytaj brzmienie na dzień sprawy.
- KSH art. 586: członek zarządu albo likwidator, który nie zgłasza wniosku mimo warunków upadłości — grzywna, ograniczenie wolności albo pozbawienie wolności do roku → przy sprawach karnych: dr-03 + kwalifikator.
- KK art. 302 (t.j. DU/2025/383): faworyzowanie wierzycieli w razie grożącej niewypłacalności (§ 1) oraz przekupstwo wierzyciela w związku z postępowaniem upadłościowym (§ 2–3). Po t.j. KK ogłoszono zmiany (DU/2026/988, 902 i in.) — sprawdź na dzień czynu. Art. 300–301 KK — odczytaj w ELI przed powołaniem.

**Treść wniosku (art. 22) — checklista:**
```
□ dłużnik: imię i nazwisko / nazwa, PESEL / KRS (brak → inne dane z ust. 4: paszport,
  karta pobytu, zagraniczny rejestr, zagraniczny NIP), firma, miejsce zamieszkania /
  siedziba, adres; reprezentanci i likwidatorzy z PESEL / KRS; przy spółce osobowej —
  wspólnicy odpowiadający bez ograniczenia z danymi
□ NIP (1a)
□ miejsce COMI (pkt 2)
□ okoliczności uzasadniające wniosek + ich uprawdopodobnienie (pkt 3)
□ udział w systemie płatności / rozrachunku papierów wartościowych albo system
  interoperacyjny (pkt 4) — NIE dotyczy wniosku wierzyciela (ust. 3)
□ czy dłużnik jest spółką publiczną (pkt 5)
```

**Zaliczka (art. 22a):** jednokrotność przeciętnego miesięcznego wynagrodzenia w sektorze przedsiębiorstw bez nagród z zysku w **III kwartale roku poprzedniego** (obwieszczenie Prezesa GUS); dowód wpłaty dołącza się do wniosku. Brak → wezwanie do uiszczenia w **tygodniu** pod rygorem zwrotu wniosku. Dodatkowa zaliczka (art. 32 ust. 5) — pod rygorem odrzucenia.

**Załączniki wniosku dłużnika (art. 23 ust. 1):**
```
1) aktualny wykaz majątku z szacunkową wyceną
2) bilans dla celów postępowania na dzień w okresie 30 dni przed złożeniem wniosku
3) spis wierzycieli: adresy, kwoty, terminy zapłaty + lista zabezpieczeń z datami
4) oświadczenie o spłatach w ciągu 6 miesięcy przed wnioskiem
5) spis dłużników dłużnika: adresy, wierzytelności, daty powstania, terminy
6) wykaz tytułów egzekucyjnych i wykonawczych przeciwko dłużnikowi
7) informacja o postępowaniach o hipoteki/zastawy/inne obciążenia wpisowe oraz o innych
   postępowaniach sądowych, administracyjnych, sądowoadministracyjnych i polubownych
8) miejsce zamieszkania reprezentantów i likwidatorów
9) informacja, czy w jednym z 2 ostatnich lat obrotowych: ≥ 250 pracowników średniorocznie
   LUB obrót netto > równowartość 50 mln euro LUB suma aktywów > równowartość 43 mln euro
```
- Ust. 3: niemożność dołączenia → podaj przyczyny **i je uprawdopodobnij** (brak bez wyjaśnienia ≠ uzasadniona niemożność).
- Art. 24: wierzyciel uprawdopodabnia swoją wierzytelność.
- Art. 25: dłużnik składa **oświadczenie o prawdziwości danych**; nieprawdziwe → odpowiedzialność za szkodę; **brak oświadczenia → zwrot wniosku bez wezwania** do uzupełnienia.
- Art. 25a: obwieszcza się wpisanie wniosku dłużnika do repertorium oraz prawomocny zwrot, odrzucenie, oddalenie lub umorzenie.

## F. Postępowanie w przedmiocie ogłoszenia (art. 26–35)

| Art. | Reguła |
|---|---|
| 26 | uczestnicy: wnioskodawca(y) i dłużnik; przy przedsiębiorstwie państwowym / jednoosobowej spółce SP zawiadomienie organu, który w **2 tygodnie** może złożyć opinię |
| 26¹ | brak zdolności procesowej lub braki w organach osoby prawnej → sąd ustanawia **kuratora** (kurator z art. 42 § 1 KC zostaje nim powołany); wynagrodzenie ustala sędzia-komisarz, + VAT, zażalenie przysługuje także kuratorowi; odpowiednio przy śmierci dłużnika po wniosku bez zarządcy sukcesyjnego |
| 27 | posiedzenie niejawne; dowody także na niejawnym; **postanowienie w ciągu 2 miesięcy od wniosku**; zażalenie rozpoznawane w **miesiąc** od przedstawienia akt; obwieszczenia w KRZ wraz z informacją o sposobie i terminie zaskarżenia |
| 29 | brak/nieprawidłowy adres dłużnika lub niewykonanie zarządzeń uniemożliwiające bieg → **zwrot** wniosku |
| 29a | sąd może uznać **cofnięcie za niedopuszczalne**, gdy pokrzywdzałoby wierzycieli; spłata wnioskodawcy po złożeniu wniosku nie wpływa na bieg sprawy |
| 30 | wysłuchanie dłużnika i wnioskodawcy w razie potrzeby; dłużnik — jak przesłuchanie strony po przyrzeczeniu; alternatywnie wyjaśnienia pisemne z podpisem notarialnie poświadczonym pod rygorem odpowiedzialności karnej (są dowodem); inne osoby — art. 217 |
| 30a | **zakaz dowodu z opinii biegłego**, z wyjątkiem art. 56b ust. 1 (pre-pack dla podmiotów z art. 128) |
| 32 | cofnięcie przez wierzyciela po spłacie przez dłużnika → koszty na dłużnika; oddalenie z art. 13 → koszty na dłużnika + zwrot kosztów wierzyciela; dodatkowa zaliczka pod rygorem odrzucenia, bez zażalenia, nie wstrzymuje rozpoznania; wydatki najpierw z zaliczki wnioskodawcy |
| 33 | zażalenie: na postanowienie kończące postępowanie i w przypadkach ustawowych; skład inny tego sądu — **wyjątek**: kończące, warunki sprzedaży, zabezpieczenie, wynagrodzenie tymczasowego nadzorcy i zarządcy przymusowego → sąd II instancji w składzie 3 sędziów; **brak skargi kasacyjnej** i **skargi o stwierdzenie niezgodności z prawem** |
| 34 | wniosek wierzyciela w **złej wierze**: przy oddaleniu koszty na wierzyciela, możliwe publiczne oświadczenie; roszczenie odszkodowawcze dłużnika i osoby trzeciej |
| 35 | odpowiednio art. 216a–216ab, 219–221, 224, 228 ust. 1–3, 229 ust. 2 i księga I część I KPC — **bez** art. 130², 139¹, 205¹, 205², 205⁴–205¹², przepisów o zawieszeniu, wznowieniu i postępowaniu gospodarczym (art. 35 ze zmianą DU/2025/1172 — przypis 5 t.j.; sprawdź datę wejścia dla sprawy) |

## G. Zabezpieczenie majątku (art. 36–43)

- Art. 36–37: po złożeniu wniosku sąd na wniosek lub z urzędu może zabezpieczyć majątek; orzeka **niezwłocznie**; odpowiednio KPC o zabezpieczeniu, ale **bez art. 396 KPC**.
- **Tymczasowy nadzorca sądowy (art. 38):** odpowiednie stosowanie wskazanych przepisów o syndyku; obwieszczenie ustanowienia, odwołania, zmiany i uchylenia. Wynagrodzenie: od **¼ do 2-krotności** przeciętnego wynagrodzenia (III kw. roku poprzedniego); wyjątkowo do **4-krotności** tej kwoty. Wniosek o wynagrodzenie i zwrot wydatków — **tydzień** od powiadomienia o odwołaniu albo wygaśnięcia funkcji; zaliczka z zaliczki wnioskodawcy. Sąd może zażądać sprawozdania o stanie finansowym, majątku i kosztach.
- **Art. 38a:** dłużnik dokonuje czynności zwykłego zarządu; czynność przekraczająca zwykły zarząd bez zgody nadzorcy — **nieważna**; zgoda następcza możliwa w **30 dni** od czynności.
- **Art. 39:** na wniosek wnioskodawcy, dłużnika lub nadzorcy — **zawieszenie egzekucji** i **uchylenie zajęcia rachunku**, gdy niezbędne dla celów postępowania; przy uchyleniu zajęcia obowiązkowo nadzorca; dyspozycje środkami wymagają jego zgody; doręczenie wierzycielowi i organowi egzekucyjnemu; zażalenie dłużnikowi i wierzycielowi egzekwującemu.
- **Art. 40:** inne sposoby, w tym **zarząd przymusowy** — gdy obawa ukrywania majątku, działania na szkodę wierzycieli albo niewykonywania poleceń nadzorcy; sąd określa zakres i sposób zarządu; czynności dłużnika — odpowiednio art. 77–79; do zarządcy art. 38 ust. 1a–3 i ustawa o syndyku.
- **Art. 43:** zabezpieczenia **upadają** z dniem ogłoszenia upadłości albo uprawomocnienia się odrzucenia, oddalenia lub umorzenia; o upadku nadzorcy / zarządu przymusowego obwieszcza się.
- ⛔ Tymczasowy nadzorca ≠ syndyk; zarządca przymusowy ≠ syndyk. Przypisz każdemu jego uprawnienie z postanowienia.

## H. Ogłoszenie upadłości (art. 51–54b)

**Postanowienie (art. 51 ust. 1) zawiera:** dane upadłego (pkt 1); wezwanie wierzycieli do zgłoszenia wierzytelności syndykowi przez system teleinformatyczny w **30 dni od obwieszczenia w KRZ** (pkt 4; dla wierzycieli z art. 216aa ust. 1 — adres do zgłoszeń); wezwanie do zgłoszenia praw i roszczeń na nieruchomości nieujawnionych w KW — w **30 dni**, pod rygorem utraty prawa powoływania się na nie w postępowaniu (pkt 5); wskazanie, czy sędzią-komisarzem jest sędzia czy referendarz, i wyznaczenie syndyka (pkt 6); godzinę wydania przy uczestniku systemu płatności (pkt 7). Pkt 2–3 uchylone.

```
Skuteczność i wykonalność: z dniem WYDANIA, chyba że przepis szczególny stanowi inaczej (51 ust. 2)
Jurysdykcja: podstawa + (rozp. 2015/848) główne / uboczne (51 ust. 2a)
Data upadłości = data wydania postanowienia; po uchyleniu i ponownym ogłoszeniu —
  data PIERWSZEGO postanowienia (52)
Obwieszczenie (53 ust. 1); doręczenie: syndyk (po powiadomieniu telefon/faks/e-mail
  w dniu ogłoszenia), upadły / spadkobierca, wierzyciel-wnioskodawca, organ właścicielski;
  Prezes NBP (system płatności), Przewodniczący KNF (spółka publiczna); powiadomienie:
  izba administracji skarbowej, oddział ZUS, organy egzekucyjne (w dniu ogłoszenia),
  Prezes UKE (operator telekomunikacyjny)
II instancja nie może sama ogłosić upadłości (54 ust. 2); po uchyleniu do ponownego
  rozpoznania syndyk i sędzia-komisarz zachowują uprawnienia, czynności w mocy (54 ust. 3);
  zatwierdzenie układu albo otwarcie restrukturyzacji → umorzenie (54 ust. 4)
Zażalenie wierzyciela WYŁĄCZNIE co do jurysdykcji sądów polskich: tydzień od obwieszczenia
  w KRZ; wierzyciel z siedzibą/zwykłym pobytem za granicą — 30 dni (54a); obwieszczenie
  o wniesieniu
Prawomocność — obwieszcza się (54b)
```
⚠️ Wydanie, obwieszczenie i prawomocność to trzy różne daty — każdą wpisz osobno; skutki ustawowe co do zasady działają od wydania.

## I. Przygotowana likwidacja — pre-pack (art. 56a–56h)

**Wniosek (art. 56a):** w postępowaniu o ogłoszenie upadłości składa go **uczestnik postępowania**; przedmiot: przedsiębiorstwo, jego zorganizowana część albo składniki stanowiące znaczną część przedsiębiorstwa; może dotyczyć kilku nabywców (ust. 6).

```
□ warunki: co najmniej CENA i NABYWCA (może projekt umowy syndyka); adres i e-mail nabywcy (ust. 4)
□ wadium nabywcy = 1/10 oferowanej ceny; dowód wniesienia — inaczej wniosek
  pozostawia się bez rozpoznania (ust. 2a)
  formy: pieniądz (przelew na rachunek depozytowy sądu), poręczenie banku/SKOK,
  gwarancja bankowa, gwarancja ubezpieczeniowa (ust. 2aa–2ab)
□ lista znanych zabezpieczeń wierzycieli na majątku objętym wnioskiem z adresami (ust. 2b)
□ opis i oszacowanie sporządzone przez osobę z listy biegłych sądowych (ust. 3)
□ zastaw rejestrowy z umownym przejęciem / sprzedażą (art. 24 ustawy o zastawie rejestrowym)
  → wniosek niedopuszczalny bez pisemnej zgody zastawnika; art. 330 odpowiednio (ust. 2)
□ wydanie z dniem ogłoszenia upadłości → dowód wpłaty PEŁNEJ ceny na rachunek
  depozytowy sądu (ust. 5)
□ oświadczenie wnioskodawcy i nabywcy o (braku) stosunków z art. 128 (art. 56b ust. 2)
```

**Przebieg i kryteria:**
- Art. 56aa: sąd **obowiązkowo** ustanawia tymczasowego nadzorcę albo zarządcę przymusowego; sprawozdanie obejmuje m.in. koszty postępowania i inne zobowiązania masy przy likwidacji na zasadach ogólnych.
- Art. 56ab: o złożeniu wniosku obwieszcza się.
- Art. 56b: nabywca z kręgu art. 128 → cena **nie niższa niż cena oszacowania**, którą ustala sąd na podstawie **opinii biegłego** (wyjątek od art. 30a).
- **Art. 56c — test ceny:** sąd **uwzględnia** wniosek, gdy cena > kwota możliwa do uzyskania przy likwidacji na zasadach ogólnych pomniejszona o koszty i inne zobowiązania masy; **może** uwzględnić, gdy cena **zbliżona**, jeżeli przemawia za tym ważny interes publiczny lub zachowanie przedsiębiorstwa. Rozpoznanie najwcześniej **30 dni od obwieszczenia** i **14 dni od doręczenia** odpisów wierzycielom zabezpieczonym.
- Art. 56ca: **≥ 2 wnioski → aukcja** (odpowiednio KC): warunki zatwierdza sąd jednoosobowo; zawiadomienie co najmniej **2 tygodnie** przed posiedzeniem; posiedzenie jawne; prowadzi i wybiera tymczasowy nadzorca / zarządca przymusowy pod nadzorem sądu; kolejny wniosek po wyborze co do tych składników — bez rozpoznania; do kolejnego wniosku nie stosuje się obwieszczenia z art. 56ab.
- Art. 56d: zatwierdzenie w postanowieniu o ogłoszeniu upadłości (co najmniej cena i nabywca, możliwe odesłanie do projektu umowy). Zażalenie na oddalenie — dłużnik i wnioskodawca; na uwzględnienie — dłużnik i **każdy wierzyciel**; **2 tygodnie od obwieszczenia w KRZ**. Wadium nieuwzględnionego nabywcy zwrot w 2 tygodnie od prawomocności (wcześniejszy wniosek o zwrot = wniosek bez rozpoznania); wadium uwzględnionego zalicza się na cenę i trafia do masy; zwrot także przy prawomocnym oddaleniu, zwrocie, odrzuceniu, umorzeniu; wadium niepieniężne — oświadczenie o zwolnieniu.
- Art. 56e: syndyk zawiera umowę w **30 dni od stwierdzenia prawomocności** (chyba że warunki przewidują inny termin), wyłącznie po zapłacie całej ceny do masy albo wydaniu ceny z depozytu; niezawarcie z winy nabywcy → syndyk **zatrzymuje wadium** (składnik masy); skutki sprzedaży — art. 313, 314, 317.
- Art. 56f: przy pełnej cenie w depozycie — wydanie niezwłocznie po ogłoszeniu (także gdy cenę wpłacono w toku lub po ogłoszeniu), do rąk nabywcy przy udziale syndyka (art. 174 odpowiednio); do prawomocności i umowy nabywca zarządza w granicach **zwykłego zarządu na własne ryzyko**; uchylenie → obowiązek zwrotu, postanowienie jest tytułem egzekucyjnym.
- Art. 56g: wydanie ceny z depozytu syndykowi po prawomocności (z urzędu lub na wniosek syndyka); w innych przypadkach na wniosek nabywcy w **30 dni** od wydania przedsiębiorstwa syndykowi/dłużnikowi; syndyk lub dłużnik może żądać zatrzymania ceny na **2 tygodnie** dla wniosku o zabezpieczenie powództwa odszkodowawczego; sąd jednoosobowy.
- Art. 56h: w terminie na zawarcie umowy syndyk lub nabywca może żądać uchylenia lub zmiany zatwierdzenia przy istotnej zmianie albo ujawnieniu okoliczności wpływających na wartość; zażalenie także syndykowi i nabywcy; art. 56a–56g odpowiednio.

---

## TERMINY — ZESTAWIENIE

| Termin | Zdarzenie początkowe | Podstawa |
|---|---|---|
| 30 dni | wystąpienie podstawy ogłoszenia upadłości — obowiązek wniosku | art. 21 ust. 1 |
| 1 rok | śmierć przedsiębiorcy / wykreślenie / zaprzestanie działalności | art. 7, 8, 9 |
| > 3 mies. | opóźnienie w zapłacie — domniemanie niewypłacalności | art. 11 ust. 1a |
| > 24 mies. | nadwyżka zobowiązań nad majątkiem (osoby prawne) | art. 11 ust. 2, 5 |
| 30 dni przed wnioskiem | dzień bilansu dla celów postępowania | art. 23 ust. 1 pkt 2 |
| 6 mies. przed wnioskiem | okres oświadczenia o spłatach | art. 23 ust. 1 pkt 4 |
| tydzień | wezwanie do uiszczenia zaliczki | art. 22a |
| 2 tyg. | opinia organu właścicielskiego | art. 26 ust. 2 |
| 2 mies. | wydanie postanowienia o ogłoszeniu (od wniosku) | art. 27 ust. 3 |
| 1 mies. | rozpoznanie zażalenia (od przedstawienia akt) | art. 27 ust. 3 |
| tydzień | wniosek tymczasowego nadzorcy o wynagrodzenie | art. 38 ust. 2 |
| 30 dni | zgoda następcza nadzorcy na czynność | art. 38a |
| 30 dni | zgłoszenie wierzytelności / praw na nieruchomości (od obwieszczenia w KRZ) | art. 51 ust. 1 pkt 4–5 |
| tydzień / 30 dni | zażalenie co do jurysdykcji (krajowy / zagraniczny wierzyciel) | art. 54a |
| 30 dni + 14 dni | najwcześniejsze rozpoznanie pre-packu | art. 56c ust. 3 |
| 2 tyg. | zawiadomienie o aukcji pre-pack | art. 56ca ust. 1 pkt 2 |
| 2 tyg. | zażalenie na rozstrzygnięcie pre-packu (od obwieszczenia) | art. 56d ust. 2 |
| 30 dni | zawarcie umowy przez syndyka (od stwierdzenia prawomocności) | art. 56e ust. 1 |

## PUŁAPKI

- Domniemanie 3 miesięcy (art. 11 ust. 1a) ≠ definicja niewypłacalności — da się je obalić i da się wykazać niewypłacalność wcześniej.
- Test bilansowy nie dotyczy osób fizycznych ani spółek osobowych z wspólnikiem-osobą fizyczną odpowiadającym bez ograniczenia (art. 11 ust. 7).
- Do bilansu z art. 11 ust. 5 nie wliczaj rezerw ani zobowiązań wobec jednostek powiązanych.
- Wniosek wierzyciela nie służy windykacji: spór sprzed wniosku → oddalenie (12a); zła wiara → koszty i odszkodowanie (34); spłata wnioskodawcy nie kończy sprawy (29a ust. 2).
- Brak oświadczenia z art. 25 = zwrot **bez wezwania**.
- W postępowaniu o ogłoszenie nie ma biegłego (30a) — wycenę przedstaw dokumentami; wyjątek tylko art. 56b.
- Uchylone art. 12, 14–17, 24a, 28, 31, 41, 42, 55, 56 nie są podstawą prawną.
- Pre-pack przy zastawie rejestrowym z umownym zaspokojeniem wymaga pisemnej zgody zastawnika (56a ust. 2).
- Nie wydawaj przedsiębiorstwa nabywcy bez pełnej ceny w depozycie (56a ust. 5, 56f).

## POWIĄZANIA

- Skutki ogłoszenia, masa, bezskuteczność → `mod-PrUpad-skutki-masa-bezskutecznosc`
- Organy (sędzia-komisarz, syndyk, rada wierzycieli) → `mod-PrUpad-organy-procedura`
- Zgłoszenia wierzytelności (art. 236 i n.) → `mod-PrUpad-wierzytelnosci-235-266`
- Konsument → `mod-PrUpad-konsument-workflow`; wykreślony/faktyczny przedsiębiorca (tytuł V cz. III) → tamże
- Restrukturyzacja zamiast upadłości → `mod-PrRestr-wejscie-plan-test`, `mod-PrUpad-upadlosc-restrukturyzacja`
- Transgraniczne (rozp. 2015/848) → `mod-PrUpad-likwidacja-miedzynarodowe-szczegolne`
- Odpowiedzialność karna → dr-03 + kwalifikator; członkowie zarządu (KSH 299) → `mod-KSH-spolki-handlowe`

## WYNIK

Tabela przesłanek z dowodami i datami (art. 10–11), wynik testu wyłączeń (5–9, 12a, 13), właściwy sąd (18–19), kompletny wniosek z checklistą art. 22–25 i dowodem zaliczki, propozycja zabezpieczenia (36–40), kalendarz z tabeli TERMINY (każdy termin ze zdarzeniem początkowym) i — przy nabywcy — kompletny wniosek pre-pack z testem art. 56c.
