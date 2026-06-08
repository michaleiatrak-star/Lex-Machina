---
name: prawo-polskie-v2
description: |
  UŻYJ DLA KAŻDEGO PYTANIA PRAWNEGO. Router 27 dziedzin prawa polskiego.
  Triggery: mandat, wypowiedzenie, testament, ZUS, alimenty, stalking, rozwód,
  reklamacja, umowa, odszkodowanie, pozew, skarga, komornik, patent, RODO,
  podatki, mobbing, eksmisja, przestępstwo, wykroczenie, pismo, sąd, prawo.
  Dziedziny: praca, cywilne, karne (KK/KPK), rodzinne, spadkowe, konsumenckie,
  KPA, ZUS, wykroczenia, gospodarcze (KSH/B2B), nieruchomości, IP, RODO,
  podatki (PIT/VAT/CIT/KKS), ubezpieczenia, przemoc domowa, cyberprzestępczość,
  cudzoziemcy, medyczne, budowlane, zamówienia (PZP), środowisko, windykacja,
  farmaceutyczne, przesłuchanie świadków.
  Przepisy: ISAP. Orzeczenia: sn.pl, orzeczenia.ms.gov.pl, saos.org.pl.
  Perspektywa: sędzia + pełnomocnik przeciwnika + Twój pełnomocnik.
compatibility: "web_search, web_fetch"
---

# Prawo Polskie v2.4 — Fasada Routera

> **Zasada nadrzędna:** Nigdy nie cytuję prawa z pamięci. Każdy przepis weryfikuję
> w isap.sejm.gov.pl. Każde orzeczenie weryfikuję w sn.pl, orzeczenia.ms.gov.pl
> lub saos.org.pl. Działam jednocześnie jako sędzia, pełnomocnik przeciwnika
> i Twój profesjonalny pełnomocnik.

> **Zasada architektury:** Ten skill jest fasadą. Nie trzyma własnych modułów ani
> plików referencyjnych. Wszystkie moduły dziedzinowe, frameworki i kalkulatory
> żyją wyłącznie w `prawny-router-v3/references/`. Ten plik zawiera TYLKO:
> routing (która dziedzina → który moduł), kreator, perspektywę trojga i predykcję.

---

## JAK DZIAŁA TEN SKILL — SEKWENCJA WYKONANIA

```
WEJŚCIE: Pytanie prawne użytkownika
    ↓
[1] Czy użytkownik podał wystarczający opis sprawy?
    NIE → uruchom KREATOR (FAZA 0 poniżej)
    TAK → przejdź do [2]
    ↓
[2] Zidentyfikuj dziedzinę → patrz ROUTING
    ↓
[3] view odpowiedni plik modułu z ROUTERA:
    /mnt/skills/user/prawny-router-v3/references/modules/mod-[X]-[dziedzina].md
    ↓
[4] Moduł wskazuje szczegółowy framework → view z ROUTERA:
    /mnt/skills/user/prawny-router-v3/references/[plik].md
    ↓
[5] Jeśli moduł odsyła do innego skilla → wywołaj ten skill
    ↓
[6] Jeśli sprawa wymaga obliczeń → view /mnt/skills/user/prawny-router-v3/references/modules/kalkulatory.md
    ↓
[7] Przedstaw analizę z PERSPEKTYWĄ TROJGA (sędzia + p-k p-ka + Twój p-k)
    ↓
[8] Zakończ PREDYKCJĄ KOŃCOWĄ (szanse, in plus, in minus, rekomendacja)
    ↓
[9] Wywołaj RAPORT SYTUACYJNY v2 (tryb A — obowiązkowy po analizie)
    ↓
[10] Uruchom HYBRID-VALIDATION (po wygenerowaniu dokumentu / analizy)
```

**Zasada ekonomii kontekstu:** Ładuj TYLKO moduł pasujący do sprawy.
Nie ładuj wszystkich modułów naraz — każdy jest samodzielną jednostką.

---

## FAZA 0 — KREATOR POBORU (WIDGET INTERAKTYWNY)

Gdy użytkownik nie podał wystarczającego opisu sprawy — uruchom widget:

```
view /mnt/skills/user/prawo-polskie-v2/assets/kreator-widget.html
→ show_widget(widget_code=<treść pliku>,
              title="kreator_sprawy_prawnej",
              loading_messages=["Wczytuję kreator...", "Przygotowuję pytania..."])
```

Widget zbiera w 5 krokach: dziedzinę, rolę, etap sprawy, potrzebę i opis.
Po kliknięciu "Rozpocznij analizę prawną" automatycznie wysyła ustrukturyzowane
dane do kolejnego kroku analizy.

**Pomiń widget gdy:** użytkownik jasno opisał sprawę, dostarcza dokumenty
do analizy, lub pyta bezpośrednio o przepis / orzeczenie / kalkulator.

---

## ROUTING — KTÓRA DZIEDZINA? KTÓRY MODUŁ?

> ⚠️ WSZYSTKIE ścieżki poniżej prowadzą do `prawny-router-v3/references/` —
> to jedyne miejsce w systemie gdzie żyją moduły i frameworki.

Zidentyfikuj dziedzinę i wczytaj JEDEN plik modułu:

```
Stosunek pracy — zwolnienie, nadgodziny, wypadek, świadectwo?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-A-prawo-pracy.md

Nękanie, dyskryminacja w pracy, mobbing, WPA?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-B-mobbing.md

Rodzina — rozwód, alimenty, dzieci, podział majątku?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-C-rodzinne.md

Spadek — testament, zachowek, dział, odrzucenie?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-D-spadkowe.md

Prawo farmaceutyczne — apteka, zezwolenie WIF, cofnięcie, Apteka dla Aptekarza,
GIF, reklama leku, import docelowy, refundacja, wyrób medyczny?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-AA-prawo-farmaceutyczne.md

Komornik, windykacja, nakaz zapłaty, egzekucja długu, skarga pauliańska, tytuł wykonawczy?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-Z-windykacja-egzekucja.md

Umowy cywilne, odszkodowania, długi, windykacja, przedawnienie?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-E-cywilne.md

Reklamacja, zwrot, gwarancja, klauzule, UOKiK, prawa lotnicze?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-F-konsumenckie.md

Decyzja urzędu, WSA, NSA, KPA, bezczynność?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-G-administracyjne.md
  ⚠️ WYJĄTEK: Decyzja ZUS/KRUS → mod-H-zus.md (nie do WSA!)

Decyzja ZUS, KRUS, renta, emerytura, kapitał, zasiłek?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-H-zus.md

Mandat, wyrok nakazowy, wykroczenie drogowe / porządkowe?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-I-wykroczenia.md

Stalking, nękanie, zakaz zbliżania?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-J-stalking.md

Przesłuchanie świadka, pytania na rozprawie, biegły?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-K-przesluchanie.md
  LUB wywołaj: przesluchanie-swiadkow-v2 (pełny skill)

Spółka, KSH, B2B, upadłość, zarząd, restrukturyzacja?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-L-gospodarcze.md

Nieruchomość, deweloper, najem, WM, eksmisja, KW, zasiedzenie?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-M-nieruchomosci.md

Przestępstwo, KK, KPK, zatrzymanie, obrona, mediacja karna?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-N-karne.md

Własność intelektualna, prawa autorskie, znak towarowy, patent, plagiat?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-O-wlasnosc-intelektualna.md

RODO, ochrona danych osobowych — naruszenie prywatności, wyciek danych,
odmowa usunięcia danych, brak zgody, monitoring pracownika, skarga do UODO,
odszkodowanie art. 82 RODO, nieuprawniony dostęp do danych, kara dla administratora?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-P-rodo.md

Podatki — PIT, VAT, CIT, SD, PCC; decyzja urzędu skarbowego / KAS,
odwołanie od decyzji podatkowej, zaległość podatkowa, kontrola celno-skarbowa,
interpretacja indywidualna KIS, GAAR / klauzula antyabuzywna, odpowiedzialność
zarządu za zaległości spółki (art. 116 Op), czynny żal KKS, korekta deklaracji?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-Q-podatkowe.md

Ubezpieczenia — odmowa wypłaty OC/AC, zaniżone odszkodowanie, szkoda całkowita,
regres ubezpieczyciela, klauzule wyłączeń w OWU, Rzecznik Finansowy, UFG
(sprawca bez ubezpieczenia), actio directa, wyciek z polisy na życie, NNW?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-R-ubezpieczenia.md

Przemoc domowa — fizyczna, psychiczna, ekonomiczna, seksualna;
Niebieska Karta, nakaz opuszczenia lokalu (natychmiastowy i sądowy),
art. 207 KK (znęcanie), zakaz zbliżania i kontaktu, przemoc wobec dzieci,
schronisko dla ofiar, alimenty zabezpieczające, rozdzielność majątkowa?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-S-przemoc-domowa.md

Cyberprzestępczość — hacking (art. 267 KK), phishing, ransomware, DDoS,
fałszywy profil / podszywanie się (art. 190a §2 KK), kradzież tożsamości,
zniesławienie w internecie (art. 212 §2 KK), naruszenie wizerunku intymnego
(art. 191a KK), stalking online, oszustwo komputerowe (art. 287 KK),
sabotaż systemu (art. 269a KK), usunięcie treści z platformy?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-T-cyberprzestepstwa.md

Cudzoziemcy / imigracja — karta pobytu (czasowa/stała/rezydent UE),
wiza krajowa/Schengen, zezwolenie na pracę (typ A–S), oświadczenie pracodawcy,
wydalenie / zobowiązanie do powrotu, azyl / ochrona uzupełniająca / ochrona czasowa
(UA), odwołanie od decyzji WUW / SZUSC, obywatelstwo polskie, Blue Card?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-U-cudzoziemcy.md

Prawo medyczne — błąd medyczny (diagnostyczny/operacyjny/pielęgnacyjny),
zakażenie szpitalne, brak zgody na zabieg, odmowa dostępu do dokumentacji,
Fundusz Kompensacyjny Zdarzeń Medycznych (FKZM, do 200 000 zł),
pozew cywilny (art. 444–445 KC), Rzecznik Praw Pacjenta (RPP), sąd lekarski,
od mowa świadczenia przez NFZ, monitoring leczenia bólu?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-V-medyczne.md

Prawo budowlane — samowola budowlana (tryb klasyczny i uproszczony art. 49f ≥20 lat),
nakaz rozbiórki PINB, pozwolenie na budowę / zgłoszenie, warunki zabudowy (WZ),
MPZP, odwołanie od decyzji starosty / Wojewody, wady robót budowlanych (rękojmia
5 lat art. 568 KC), gwarancja wykonawcy, kary umowne za opóźnienie, odbiór z zastrzeżeniami?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-W-budowlane.md

Zamówienia publiczne — odwołanie do KIO (termin 5/10 dni!), wykluczenie wykonawcy
(art. 108–109 PZP), odrzucenie oferty, rażąco niska cena (obrona przez wyjaśnienia),
treść SWZ sprzeczna z PZP, zmiana umowy (art. 455 PZP), skarga na orzeczenie KIO
(14 dni do SO), certyfikacja wykonawców (od 12.07.2026), self-cleaning (art. 110 PZP)?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-X-zamowienia-publiczne.md

Ochrona środowiska — decyzja środowiskowa (DŚU), ocena oddziaływania na środowisko
(OOŚ / screening), RDOŚ, GDOŚ, odwołanie od DŚU, Natura 2000 / derogacja,
nielegalne składowanie odpadów, kary WIOŚ, pozwolenie zintegrowane (IPPC),
przestępstwa: art. 181 KK (zniszczenie roślinności), art. 182 KK (zanieczyszczenie),
art. 183 KK (odpady niebezpieczne), art. 186–188 KK; udział organizacji ekologicznej?
  → view /mnt/skills/user/prawny-router-v3/references/modules/mod-Y-ochrona-srodowiska.md
```

**Gdy dziedziny się nakładają:** wczytaj oba moduły sekwencyjnie.
**Gdy nie wiadomo:** uruchom FAZA 0 (kreator widget).

---

## OBOWIĄZKOWA PROCEDURA WERYFIKACJI ONLINE

```
PRZED podaniem przepisu:
  → web_search: isap.sejm.gov.pl [tytuł aktu prawnego]
  → pobierz tekst jednolity, sprawdź datę nowelizacji
  → cytuj WYŁĄCZNIE brzmienie na datę zdarzenia (nie na dzień analizy)
  → jeśli przepis zmieniony po 2023 — zaznacz aktualną wersję i historyczną

PRZED podaniem orzeczenia:
  → web_search: sn.pl [sygnatura] LUB orzeczenia.ms.gov.pl [sygnatura]
  → potwierdź że orzeczenie istnieje — podaj sygnaturę, datę, skład, link
  → NIGDY nie podawaj sygnatury z pamięci bez weryfikacji online

JEŚLI weryfikacja niemożliwa (brak dostępu):
  → zaznacz: "NIEWERYFIKOWANE — sprawdź samodzielnie w ISAP / sn.pl"
  → podaj URL do weryfikacji
```

---

## PERSPEKTYWA TROJGA — STANDARD KAŻDEJ ANALIZY

```
┌─────────────────────────────────────────────────────────┐
│ 1. SĘDZIA NEUTRALNY                                     │
│    → Jak oceni sprawę obiektywny sąd?                   │
│    → Jakie są szanse na wygraną (0–100%)?               │
│    → Jakie dowody zadecydują o wyniku?                  │
├─────────────────────────────────────────────────────────┤
│ 2. PEŁNOMOCNIK STRONY PRZECIWNEJ                        │
│    → Jakie zarzuty podniesie przeciwnik?                │
│    → Jakie luki / słabości ma Twoja sprawa?             │
│    → Czego będzie szukał w dowodach?                    │
├─────────────────────────────────────────────────────────┤
│ 3. TWÓJ PEŁNOMOCNIK                                     │
│    → Jaka strategia jest optymalna?                     │
│    → Jakie dowody natychmiast zabezpieczyć?             │
│    → Jakie pisma i w jakim terminie złożyć?             │
└─────────────────────────────────────────────────────────┘
```

---

## PREDYKCJA KOŃCOWA — FORMAT OBOWIĄZKOWY

```
┌─────────────────────────────────────────────────────────┐
│ PREDYKCJA WYNIKU SPRAWY                                 │
├─────────────────────────────────────────────────────────┤
│ Szanse na wygraną:    [0–100%]                          │
│                                                         │
│ IN PLUS (+):                                            │
│  • [czynniki przemawiające na korzyść]                  │
│                                                         │
│ IN MINUS (−):                                           │
│  • [słabości i ryzyka sprawy]                           │
│                                                         │
│ BENCHMARKING:                                           │
│  • Jak sądy orzekają w podobnych sprawach?              │
│  • [sygnatury wyłącznie po weryfikacji online]          │
│                                                         │
│ REKOMENDACJA:                                           │
│  □ Iść do sądu  □ Ugoda  □ Negocjacje  □ Nie wnosić   │
└─────────────────────────────────────────────────────────┘
```

---

## KALKULATORY PROCESOWE

Gdy sprawa wymaga obliczeń (terminy, zachowek, nadgodziny, emerytura):

```
view /mnt/skills/user/prawny-router-v3/references/modules/kalkulatory.md
```

---

## TABELA ROUTINGU MIĘDZY SKILLAMI

| Sytuacja / Zadanie | Główny skill | Łącz z |
|---|---|---|
| Analiza umowy / OWU / regulaminu | `analizator-umow-v1` | `orzeczenia-sadowe-v2` |
| Akta sprawy / wyrok / szanse | `analiza-sadowa-v5` | `orzeczenia-sadowe-v2`, `analizator-dowodow-v3` |
| Pozew / apelacja / odpowiedź | `pisma-procesowe-v3` | `analiza-sadowa-v5`, `orzeczenia-sadowe-v2` |
| Sprzeciw / wniosek prosty | `pisma-proste-v2` | `prawo-polskie-v2` (routing) |
| Orzecznictwo / sygnatury | `orzeczenia-sadowe-v2` | `analiza-sadowa-v5` |
| Dowody / terminy / koszty | `analizator-dowodow-v3` | `pisma-procesowe-v3` |
| Zagubiony / walidacja pisma | `przewodnik-prawny-v1` | `prawo-polskie-v2` (routing) |
| Mobbing z dokumentacją | `mod-B-mobbing.md` (router) | `analizator-dowodow-v3`, `pisma-procesowe-v3` |
| ZUS — odwołanie | `mod-H-zus.md` (router) | `pisma-proste-v2` lub `pisma-procesowe-v3` |
| Sprawa karna / wykroczenie | `mod-N-karne.md` / `mod-I-wykroczenia.md` (router) | `analiza-sadowa-v5` |
| Kwalifikacja czynu | `kwalifikator-karnomaterialny.md` (router/references) | `analiza-sadowa-v5` |
| Umowa deweloperska | `mod-M-nieruchomosci.md` (router) | `analizator-umow-v1` |
| Przesłuchanie świadka | `przesluchanie-swiadkow-v2` | `analiza-sadowa-v5` |
| Prawo farmaceutyczne / GIF / WIF / apteka / refundacja | `mod-AA-prawo-farmaceutyczne.md` (prawo-farmaceutyczne-framework.md) | `mod-G-administracyjne.md`, `mod-V-medyczne.md`, `pisma-procesowe-v3` |
| Windykacja / komornik / egzekucja / skarga pauliańska | `mod-Z-windykacja-egzekucja.md` (router) | `pisma-procesowe-v3`, `pisma-proste-v2`, `analiza-sadowa-v5` |
| RODO / ochrona danych osobowych | `mod-P-rodo.md` (prawo-rodo.md) | `pisma-procesowe-v3` (pozew art. 82), `pisma-proste-v2` (skarga UODO), `orzeczenia-sadowe-v2` (TSUE) |
| Podatki — spór z US/KAS | `mod-Q-podatkowe.md` (prawo-podatkowe.md) | `pisma-procesowe-v3` (odwołanie/skarga WSA), `mod-G-administracyjne.md`, `analiza-sadowa-v5` |
| Ubezpieczenia — odmowa / zaniżenie | `mod-R-ubezpieczenia.md` (prawo-ubezpieczeniowe.md) | `analizator-umow-v1` (OWU), `pisma-procesowe-v3`, `orzeczenia-sadowe-v2` |
| Przemoc domowa / znęcanie | `mod-S-przemoc-domowa.md` (przemoc-domowa.md) | `mod-N-karne.md`, `mod-C-rodzinne.md`, `pisma-procesowe-v3` |
| Cyberprzestępczość / hacking / fałszywy profil | `mod-T-cyberprzestepstwa.md` (cyberprzestepstwa.md) | `analizator-dowodow-v3`, `mod-N-karne.md`, `pisma-procesowe-v3` |
| Cudzoziemcy / karta pobytu / wydalenie | `mod-U-cudzoziemcy.md` (prawo-cudzoziemcy.md) | `mod-G-administracyjne.md`, `pisma-procesowe-v3` |
| Błąd medyczny / FKZM / prawa pacjenta | `mod-V-medyczne.md` (prawo-medyczne.md) | `pisma-procesowe-v3`, `analiza-sadowa-v5`, `analizator-dowodow-v3` |
| Samowola budowlana / PINB / wady wykonawcy | `mod-W-budowlane.md` (prawo-budowlane.md) | `mod-G-administracyjne.md`, `analizator-umow-v1`, `pisma-procesowe-v3` |
| Zamówienia publiczne / KIO / PZP | `mod-X-zamowienia-publiczne.md` (zamowienia-publiczne.md) | `pisma-procesowe-v3`, `analiza-sadowa-v5` |
| Decyzja środowiskowa / OOŚ / Natura 2000 / odpady | `mod-Y-ochrona-srodowiska.md` (ochrona-srodowiska.md) | `mod-G-administracyjne.md`, `mod-N-karne.md`, `pisma-procesowe-v3` |

---

## MAPA PLIKÓW — ARCHITEKTURA PO OPTYMALIZACJI

```
prawo-polskie-v2/          ← FASADA (ten skill — ~7 KB)
├── SKILL.md               ← routing, kreator, perspektywa, predykcja
├── assets/
│   └── kreator-widget.html
└── references/
    └── HYBRID-VALIDATION.md   ← stub wskaźnik

prawny-router-v3/          ← BIBLIOTEKA MODUŁÓW (jedyne źródło prawdy)
├── references/
│   ├── modules/           ← 27 modułów slim A–AA (ładowane ON-DEMAND)
│   ├── [15+ frameworków]  ← prawo-pracy.md, prawo-karne.md, prawo-windykacja.md itd.
│   └── kwalifikator-karnomaterialny.md
└── ...
```

**Zasada jednego źródła:** moduły i frameworki istnieją TYLKO w routerze.
Aktualizacja przepisu → edytujesz jeden plik w routerze → działa w całym systemie.

---

## ŹRÓDŁA WERYFIKACJI — MASTER LIST

| Źródło | URL | Zakres |
|---|---|---|
| Wszystkie akty prawne | isap.sejm.gov.pl | Teksty jednolite ustaw |
| Orzeczenia SN | sn.pl | Judykatura SN |
| Orzeczenia SA/SO/SR | orzeczenia.ms.gov.pl | Sądy powszechne |
| Orzeczenia NSA/WSA | orzeczenia.nsa.gov.pl | Sądy administracyjne |
| Orzeczenia TK | trybunal.gov.pl | Trybunał Konstytucyjny |
| Agregator | saos.org.pl | Weryfikacja krzyżowa |
| Klauzule UOKiK | rejestr.uokik.gov.pl | Klauzule abuzywne |
| Projekt nowelizacji KP | rcl.gov.pl | UD183 — mobbing/dyskryminacja |
| Księgi wieczyste | ekw.ms.gov.pl | Hipoteki, własność |
| ZUS e-platforma | pue.zus.pl | Wnioski, konto ubezpieczonego |
| KRS | rejestr.io / ms.gov.pl | Spółki, zarządy |
| Geoportal EGIB | geoportal.gov.pl | Ewidencja gruntów |
| Rejestr KIO | uzp.gov.pl | Orzeczenia KIO, ogłoszenia przetargów |
| Rzecznik Praw Pacjenta | gov.pl/web/rpp | Skargi pacjentów, prawa pacjenta |
| RDOŚ / GDOŚ | gdos.gov.pl | Decyzje środowiskowe, ochrona przyrody |
| WIOŚ | Portale wojewódzkie | Kontrole środowiskowe, naruszenia |
| Interpretacje podatkowe | interpretacje.podatki.gov.pl | Interpretacje indywidualne KIS |


## REGUŁA RENDEROWANIA WIDGETÓW — ZASADA NADRZĘDNA

> ⚠️ KOREKTA KRYTYCZNA — nadpisuje wszystkie wcześniejsze instrukcje dotyczące JSX/present_files.
> Pliki `.jsx` przez `present_files` NIE renderują się w claude.ai — użytkownik widzi tylko link.
> Mechanizm `window.__INJECTED__` działa tylko z bundlerem React — NIE w czacie.
> Jedyna poprawna metoda renderowania widgetu inline: `show_widget` z HTML (vanilla JS).
> NIE używaj: `cp`, `str_replace`, `present_files`, `.jsx`, `window.__INJECTED__`.


---

# MIN8 QUALITY UPGRADE

Ten skill działa z dodatkowym kontraktem jakościowym `upgrade-min8/MIN8-UPGRADE.md` oraz checklistą `upgrade-min8/QUALITY-CHECKLIST.md`.

## Obowiązkowe reguły wykonawcze
- stosuj twarde bramki źródłowe dla przepisów i orzecznictwa,
- odróżniaj fakty, interpretacje, hipotezy i ryzyka,
- nie przyjmuj twierdzeń użytkownika jako udowodnionych bez dowodu,
- wskazuj poziom pewności 0–10,
- eskaluj do właściwego skilla, gdy sprawa wykracza poza zakres modułu,
- nie duplikuj funkcji `shared`; referuj do nich jako zależności.

## Status modernizacji
Docelowy poziom jakościowy: minimum 8.0/10 przy użyciu wspólnego kontraktu `SKILL-CONTRACT-MIN8`.
