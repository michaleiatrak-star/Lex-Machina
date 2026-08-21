# ORKA-BAS — część 6: brakujące priorytety P1 (audyt archiwum v1.8)

> Część leksykonu `shared/ORKA-BAS-LEKSYKON.md` (podział 2026-08-20,
> naprawa F-78 — plik źródłowy przekroczył 1900 linii). Metareguły
> wykładni i Quality Gate — zobacz plik nadrzędny (indeks). Ten plik
> ładowany WYŁĄCZNIE na żądanie konkretnej definicji przez indeks
> nadrzędny.

---

## CZĘŚĆ XIX — BRAKUJĄCE PRIORYTETY P1 (z audytu archiwum v1.8)

### BAS-005 — Świadczenie zdrowotne (DR-10)
```
Weryfikacja: ustawa o świadczeniach opieki zdrowotnej (Dz.U. 2025 poz. 1461 t.j.)
  + ustawa o działalności leczniczej (Dz.U. 2026 poz. 156 t.j.)

DEFINICJA (art. 5 pkt 40 u.ś.o.z.):
  "Działanie służące profilaktyce, zachowaniu, ratowaniu, przywracaniu lub
  poprawie zdrowia oraz inne działanie medyczne wynikające z procesu leczenia
  lub przepisów odrębnych regulujących zasady ich udzielania."

DEFINICJA z u.dz.l. (art. 2 pkt 10):
  "Działania służące zachowaniu, ratowaniu, przywracaniu lub poprawie zdrowia
  oraz inne działania medyczne wynikające z procesu leczenia lub przepisów
  odrębnych regulujących zasady ich wykonywania."

⚠️ RÓŻNICA: u.ś.o.z. obejmuje PROFILAKTYKĘ + "wynikające z przepisów odrębnych"
  u.dz.l. jest węższa — brak profilaktyki w podstawowej formule

ŚWIADCZENIE TOWARZYSZĄCE (art. 5 pkt 38 u.ś.o.z. — BAS-006):
  "Zakwaterowanie i adekwatne do stanu zdrowia wyżywienie w szpitalu lub
  innym zakładzie leczniczym wykonującym działalność stacjonarną i całodobową,
  usługi transportu oraz transportu sanitarnego, a także zakwaterowanie
  poza zakładem leczniczym, jeżeli konieczność wynika z warunków świadczenia."
  → NIE jest świadczeniem zdrowotnym — inna kategoria

REGUŁA: Ustalenie czy dana czynność = świadczenie zdrowotne ma znaczenie dla:
  → Odpowiedzialności cywilnej za błąd medyczny
  → Zakresu ubezpieczenia OC podmiotu leczniczego
  → Opodatkowania VAT (świadczenia zdrowotne = zwolnienie z VAT, art. 43 ust. 1 pkt 18)
  → Obowiązku zawarcia umowy z NFZ
```

### BAS-007 — Gospodarstwo rolne (DR-09/10)
```
Weryfikacja: ustawa o podatku rolnym art. 1 (Dz.U. 2020 poz. 333 t.j. — weryfikuj)
  + KC art. 553 + ustawa o kształtowaniu ustroju rolnego art. 2

DEFINICJA PODATKOWA (art. 1 ustawy o podatku rolnym):
  "Grunty sklasyfikowane w ewidencji gruntów i budynków jako użytki rolne,
  z wyjątkiem gruntów zajętych na prowadzenie działalności gospodarczej innej
  niż działalność rolnicza."
  → Obejmuje: grunty orne, sady, łąki, pastwiska, grunty rolne zabudowane,
    grunty pod wodami, nieużytki, grunty pod rowami

DEFINICJA CYWILNA (KC art. 553):
  "Nieruchomości rolne (grunty rolne), nieruchomości leśne, urządzenia służące
  do produkcji rolniczej wchodzące w skład gospodarstwa, inwentarz żywy oraz
  prawa związane z prowadzeniem gospodarstwa rolnego, jeżeli stanowią lub mogą
  stanowić zorganizowaną całość gospodarczą."
  → Szersze: obejmuje budynki, urządzenia, inwentarz, prawa

DEFINICJA USTROJU ROLNEGO (art. 2 u.k.u.r.):
  Nieruchomość rolna = nieruchomość przeznaczona do prowadzenia działalności
  wytwórczej w rolnictwie w zakresie produkcji roślinnej lub zwierzęcej
  → Minimalna powierzchnia gospodarstwa rodzinnego: nie więcej niż 300 ha UR

⚠️ REGUŁA ORKA-REG-01: Definicja sektorowa — każda z trzech ustaw definiuje
  "gospodarstwo rolne" inaczej! Zawsze wskaż która ustawa ma zastosowanie.
  Podatek rolny ≠ KC ≠ u.k.u.r.

  DOCHÓD Z GOSPODARSTWA ROLNEGO dla pomocy społecznej (NSA I OSK 1103/11):
  "Każdy właściciel nieruchomości rolnej uzyskuje dochód miesięczny w wysokości
  [kwota za 1 ha przel.] niezależnie od tego, czy rzeczywiście ją uprawia."
  → Kwota: corocznie rozporządzenie RM — weryfikuj aktualne przez web_search
```

### BAS-011 — Cel mieszkaniowy (DR-06)
```
Weryfikacja: PIT art. 21 ust. 1 pkt 131 i ust. 25 (Dz.U. 2026 poz. 592 t.j. — POPRAWIONE 2026-08-08, było przestarzałe "2024 poz. 226")
  + interpretacja ogólna MF nr DD2.8202.4.2020 z 13.10.2021
  + NSA II FSK 1324/20 (12.05.2023) + interpretacje KIS 2024–2025

STATUS: BRAK JEDNEJ DEFINICJI LEGALNEJ — pojęcie ocenne + katalog zamknięty

ZWOLNIENIE (art. 21 ust. 1 pkt 131 PIT):
  Wolny od podatku dochód ze sprzedaży nieruchomości (art. 30e PIT)
  gdy przychód wydatkowany w 3 LATA od końca roku sprzedaży na
  "WŁASNE CELE MIESZKANIOWE" z zamkniętego katalogu art. 21 ust. 25

ZAMKNIĘTY KATALOG (art. 21 ust. 25 PIT) — wydatki uprawniające:
  → Nabycie lokalu/budynku mieszkalnego lub udziału
  → Nabycie gruntu pod budowę budynku mieszkalnego
  → Budowa, rozbudowa, nadbudowa, przebudowa, REMONT własnego lokalu/budynku
  → Spłata kredytu + odsetki (zaciągniętego przed sprzedażą, w banku/SKOK)
  NIE OBEJMUJE: zakup sprzętu AGD/RTV, meble, wyposażenie nieruchomości

"WŁASNE" — sporna wykładnia:
  MF + KIS (tradycyjnie): cel musi dotyczyć osobistego zamieszkania podatnika
  → Zakup lokalu dla teściowej → NIE kwalifikuje (brak "własnego" celu)
  → Zakup kolejnego mieszkania na wynajem: SPORNE (rozbieżne interpretacje KIS)

  Interpretacja ogólna MF DD2.8202.4.2020 (13.10.2021):
  Uściśliła m.in. kiedy spłata kredytu jest kosztem kwalifikowanym

  NSA II FSK 1324/20 (12.05.2023):
  Ulga mieszkaniowa = prawo majątkowe → podlega dziedziczeniu

REGUŁA: Zawsze sprawdź aktualną linię KIS przez:
  web_search "własne cele mieszkaniowe interpretacja KIS 2025 2026 wynajem"
  interpretacje.podatki.gov.pl → symbol 0114 lub 0112
```

### BAS-109 — Względy techniczne — podatek od nieruchomości
```
Weryfikacja: upol art. 1a ust. 1 pkt 3 (Dz.U. 2024 poz. 1757 ze zm. — reforma 2025!)
  + NSA orzecznictwo + interpretacje ministra finansów

STATUS: BRAK DEFINICJI LEGALNEJ — pojęcie ocenne, rozbieżne orzecznictwo

KONTEKST: Art. 1a ust. 1 pkt 3 upol (stare brzmienie — przed reformą 2025):
  Grunty, budynki i budowle "zajęte na prowadzenie działalności gospodarczej"
  podlegają wyższej stawce podatku.
  WYJĄTEK: obiekty, które ze "względów technicznych" nie mogą być zajęte na DG.

"WZGLĘDY TECHNICZNE" — rozbieżne stanowiska:
  NSA (linia 2015–2020): stan fizyczny obiektu musi uniemożliwiać prowadzenie DG
  → Sam brak decyzji administracyjnej, brak pracowników, sezonowość ≠ "względy techniczne"
  → Wymagany: zły stan techniczny lub przeznaczenie uniemożliwiające DG obiektywnie

  NSA (linia alternatywna): "względy techniczne" = szeroko: wszelkie powody
  faktyczne (nie prawne) uniemożliwiające prowadzenie działalności
  → W tym: brak możliwości technicznych dostosowania do DG

⚠️ UWAGA KLUCZOWA — REFORMA UPOL OD 01.01.2025:
  Ustawa Dz.U. 2024 poz. 1757 wprowadza NOWE DEFINICJE budynku i budowli
  BEZPOŚREDNIO w upol — nie przez odesłanie do PrBud (wyrok TK SK 14/21)
  → "Względy techniczne" NADAL w nowym art. upol — ale zakres może się zmienić!
  → ZAWSZE weryfikuj przez: isap.sejm.gov.pl → upol aktualne brzmienie 2025/2026
  web_search: "względy techniczne podatek od nieruchomości upol 2025 NSA definicja"
```

### BAS-111 — Strona postępowania w sprawach WZ (DR-05/09)
```
Weryfikacja: UPZP art. 64 + KPA art. 28 + NSA linia orzecznicza 2019–2025

STATUS: BRAK JEDNEJ DEFINICJI LEGALNEJ — wyłącznie orzecznicza

OGÓLNA DEFINICJA STRONY (KPA art. 28):
  "Stroną jest każdy, czyjego interesu prawnego lub obowiązku dotyczy
  postępowanie albo kto żąda czynności organu ze względu na swój interes
  prawny lub obowiązek."
  → "Interes prawny" ≠ interes faktyczny/ekonomiczny — musi wynikać z prawa

STRONA W POSTĘPOWANIU WZ (sporna wykładnia NSA):
  Wnioskodawca = zawsze strona

  Właściciel nieruchomości sąsiedniej:
  → NSA linia dominująca: właściciel działki SĄSIEDNIEJ = strona TYLKO gdy
    decyzja WZ może realnie naruszać jego interes prawny (nie sam fakt sąsiedztwa)
  → NSA alternatywna: właściciel w obszarze analizowanym = automatycznie strona

  Właściciel działki w OBSZARZE ANALIZOWANYM:
  → NSA II OSK 1163/07: zakres obszaru analizowanego = wyznacznik kręgu stron
  → Organ musi powiadomić właścicieli w obszarze analizowanym

  NSA II OSK 2857/21 (2023): zmiana orzecznictwa w kierunku SZEROKIEGO kręgu stron;
  organ ma obowiązek czynnie ustalać strony i informować

SKUTEK PROCESOWY BŁĘDU:
  Pominięcie strony = nieważność decyzji WZ (KPA art. 156 §1 pkt 2 — brak strony
  w postępowaniu + art. 145 §1 pkt 4 — wznowienie)
  Właściciel pominięty = prawo do wznowienia postępowania (termin: 1 miesiąc
  od dnia dowiedzenia się o decyzji)

REGUŁA: W każdej sprawie WZ ustal OBSZAR ANALIZOWANY przez organ —
  wszyscy właściciele działek w tym obszarze = potencjalne strony
```

### BAS-119 — Przedsiębiorca (DR-02)
```
Weryfikacja: Prawo przedsiębiorców art. 4 (Dz.U. 2025 poz. 1480 t.j.)

DEFINICJA USTAWOWA (art. 4 PrPrzedsięb):
  "Przedsiębiorcą jest osoba fizyczna, osoba prawna lub jednostka organizacyjna
  niebędąca osobą prawną, której odrębna ustawa przyznaje zdolność prawną,
  wykonująca działalność gospodarczą."
  → Sp. cywilna: NIE jest przedsiębiorcą — każdy ze wspólników osobno!

DZIAŁALNOŚĆ GOSPODARCZA (art. 3 PrPrzedsięb):
  "Zorganizowana działalność zarobkowa, wykonywana we własnym imieniu i w sposób
  ciągły."
  3 CECHY ŁĄCZNIE: zorganizowanie + zarobkowość + ciągłość

MAŁE PROGI (art. 5 PrPrzedsięb — działalność nierejestrowana):
  Osoba fizyczna nieprowadząca DG rejestrowanej, gdy przychód ≤ 75% minimalnego
  wynagrodzenia w miesiącu → NIE jest przedsiębiorcą w rozumieniu ustawy
  (ulga na start od 2022 r. — weryfikuj aktualne progi)

REGUŁA ORKA-REG-01: Definicja "przedsiębiorcy" różni się w:
  → Prawo przedsiębiorców: jak wyżej
  → KC art. 431: "osoba fizyczna lub prawna prowadząca przedsiębiorstwo"
  → RODO: brak definicji — "administrator" ≠ "przedsiębiorca"
  → KPC: "przedsiębiorca" szerzej niż PrPrzedsięb (obejmuje też rolników)
  ZAWSZE stosuj definicję z właściwego aktu!
```

### BAS-120 — Powierzenie cudzoziemcowi nielegalnego wykonywania pracy
```
⚠️ Pełna treść tego rekordu: → patrz CZĘŚĆ XVII, BAS-120, w pliku
  `czesc-07-priorytety-P2-bas-v18.md`
  (ustawa z 15.06.2012 r. — Dz.U. 2024 poz. 1543 t.j.; wersja zweryfikowana,
  bez błędnego odesłania do uchylonej ustawy o promocji zatrudnienia)
```

---

