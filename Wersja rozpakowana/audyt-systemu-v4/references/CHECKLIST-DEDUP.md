# CHECKLIST-DEDUP.md
## audyt-systemu-v4 · Mapa pojęć → lokalizacje (proaktywne wykrywanie duplikatów)

> **Cel:** przed dodaniem NOWEJ definicji/pojęcia do systemu — sprawdź tę
> checklistę. Jeśli pojęcie już istnieje w innym miejscu, SCAL (nie duplikuj).
> Po dodaniu nowego pojęcia — DOPISZ je do tabeli niżej.
>
> **Geneza:** podczas sesji 2026-06-12 wykryto i scalono 4 nieplanowane
> duplikaty (mobbing, szkoda, terminy procesowe, wyłączenie sędziego —
> każdy istniał w 2 miejscach z RÓŻNĄ treścią, co groziło niezgodnością).
> Ta checklista ma zapobiec powtórce tego problemu.
>
> ⛔ ZASADA: jeśli pojęcie dotyczy KONKRETNEGO aktu prawnego/artykułu i jest
> używane przez ≥2 DR-skille → kandydat do `shared/definicje/` lub
> `shared/ORKA-BAS-*.md`, NIE do lokalnego modułu DR.

---

## TABELA: POJĘCIE → LOKALIZACJA KANONICZNA → KONSUMENCI

| Pojęcie | Lokalizacja kanoniczna | Konsumenci (DR) | Status |
|---|---|---|---|
| Mobbing — definicja + linia SN + projekt UD183 | `shared/definicje/DEF-PRACA.md` | DR-04 (rdzeń), DR-16 | ✅ scalone 06-12 |
| Mobbing — kwalifikacja różnicująca + strategia | `dr-04/.../mod-KP-mobbing-dyskryminacja.md` | DR-04 | ✅ wydzielone 06-12 |
| Szkoda/damnum emergens/lucrum cessans | `shared/definicje/DEF-ODPOWIEDZIALNOSC-SZKODA.md` | DR-02, DR-16 | ✅ scalone 06-12 |
| Mienie znacznej/wielkiej wartości (art.115§5-8 KK) | `shared/ORKA-BAS-LEKSYKON.md` BAS-W23 + crossref w DEF-ODPOWIEDZIALNOSC-SZKODA | DR-02, DR-03, DR-16 | ✅ |
| Siła wyższa / rebus sic stantibus (art.357¹ KC) | `shared/definicje/DEF-ODPOWIEDZIALNOSC-SZKODA.md` | DR-02, DR-16 | ✅ 06-12 |
| Termin zawity/przedawnienie/instrukcyjny | `shared/definicje/DEF-PROCEDURA.md` | DR-02/03/05/16 | ✅ scalone 06-12 |
| Przedawnienie cywilne (reforma 2018) | `shared/ORKA-BAS-LEKSYKON.md` BAS-W32 | DR-02 | ⚠️ częściowy overlap z DEF-PROCEDURA — patrz NOTA-1 |
| Przedawnienie podatkowe (OP, reżim odrębny od KC) | `shared/ORKA-BAS-LEKSYKON.md` BAS-W32 (alert) | DR-06 | ✅ |
| Wyłączenie sędziego/biegłego (art.48-49/281 KPC + TK P10/19) | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | DR-01, DR-02, DR-16 | ✅ scalone 06-12 |
| Interes prawny vs faktyczny (art.28 KPA) | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | DR-05 (główny), DR-02 | ✅ 06-12 |
| Świadek i interes własny (art.233/261 KPC) | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | DR-02, DR-03, DR-16 | ✅ 06-12 |
| Pełnomocnik — konflikt interesów | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | DR-12, DR-16 | ✅ 06-12 |
| Czynność prawna ukryta/pozorna (art.83 KC) | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | DR-02, DR-16 | ✅ 06-12 |
| Rzeczywisty beneficjent/UBO (AML/CIT/KSH — 3 definicje) | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | DR-06, DR-15 | ✅ 06-12 |
| Wypadek przy pracy — definicja 4-elementowa | `shared/definicje/DEF-PRACA.md` (H.1.4) | DR-04 | ✅ scalone 06-12 |
| Wypadek przy pracy — procedura/świadczenia/terminy | `dr-04/.../mod-wypadek-przy-pracy-choroba-zawodowa.md` | DR-04 | ✅ wydzielone 06-12 |
| Praca zdalna — definicja (art.67⁵ KP) + wykładnia MRiPS | `shared/ORKA-BAS-VIII-X-KADENCJA.md` BAS-W03 | DR-04 | ✅ |
| Praca zdalna — obowiązki/BHP/procedura | `dr-04/.../mod-KP-praca-zdalna.md` | DR-04 | ✅ wydzielone 06-12 |
| Nadużycie prawa (art.5 KC / art.8 KP) | `shared/ORKA-BAS-LEKSYKON.md` BAS-W28 | DR-02, DR-04, DR-16 | ✅ |
| Kara umowna — miarkowanie (art.484§2 KC) | `shared/ORKA-BAS-LEKSYKON.md` BAS-W33 | DR-02, DR-16 | ✅ |
| Odsetki: kapitałowe/za opóźnienie/handlowe | `shared/ORKA-BAS-LEKSYKON.md` BAS-W34 | DR-02, DR-16 | ✅ |
| Nakaz zapłaty: sprzeciw vs zarzuty vs EPU | `shared/ORKA-BAS-LEKSYKON.md` BAS-W35 | DR-02, DR-16 | ✅ |
| Moc dowodowa dok. urzędowy vs prywatny (art.243-245 KPC) | `shared/ORKA-BAS-LEKSYKON.md` BAS-W30 | DR-02, DR-16 | ✅ |
| AI Act — system wysokiego ryzyka (termin 02.08.2026) | `shared/ORKA-BAS-VIII-X-KADENCJA.md` BAS-W36 | DR-04, DR-11 | ✅ |
| Pracownik/pracodawca (definicje podmiotowe, A.4) | `shared/definicje/DEF-PRACA.md` | DR-04 | ✅ |
| Przedsiębiorca/konsument (A.2-A.3) | `shared/definicje/DEF-PODMIOTY-WLASNOSC.md` | DR-02 | ✅ |
| Nieruchomość/posiadanie/własność (B.1-B.3) | `shared/definicje/DEF-PODMIOTY-WLASNOSC.md` | DR-02 | ✅ |
| Decyzja administracyjna — definicja + wykonalność | `shared/definicje/DEF-ADMINISTRACYJNE.md` | DR-05 | ✅ scalone (E.3+H.5.1) |
| Obiekt liniowy / samowola budowlana / SPP | `shared/definicje/DEF-BUDOWLANE-DROGOWE.md` | DR-08, DR-09 | ✅ |
| Rękojmia vs gwarancja (reforma 2023) | `shared/definicje/DEF-CYWILNE-WYKLADNIA.md` | DR-02 | ✅ |
| Dochód/przychód/koszty — wykładnia MF | `shared/definicje/DEF-PODATKOWE.md` | DR-06 | ✅ |
| Niealimentacja (art.209 KK) | `shared/definicje/DEF-PRACA.md` (sekcja dolna) | DR-04, DR-03 | ⚠️ patrz NOTA-2 |
| Opłata parkingowa SPP — charakter prawny, zarzuty UPEA art.33 | `dr-08/.../mod-UDP-strefy-platnego-parkowania.md` (293 linii, kanon) | DR-08, DR-03 (przedawnienie), DR-16 | ✅ scalone 06-13 (usunięto duplikat z DEF-BUDOWLANE-DROGOWE) |
| Taryfikator mandatów drogowych — kwoty | `dr-03/.../mod-grzywny-mandaty-szczegolowe.md` (PRM 30.12.2021, NIE Dz.U.2026/724!) | DR-03 | ✅ naprawione 06-13 — patrz NOTA-5 |
| Poszlaki / łańcuch poszlak / Warstwa 2/3 / tabela graniczna | `shared/MOD-POSZLAKI-KONTEKST.md` | pisma-procesowe-v3 (W1.2d), analizator-dowodow-v3 (integracja przyszła) | ✅ 2026-06-23 |
| Roszczenie alternatywne S2 / CV-ALT | `shared/CLAIM-VALIDATION.md` → sekcja KROK CV-ALT | pisma-procesowe-v3 (PK6) | ✅ 2026-06-23 |
| Walor PRZYZNANIA / walor ORGANU | `shared/MOD-POSZLAKI-KONTEKST.md` PK4 (kanoniczne); MOD-DOWODY D6 tylko pointer | pisma-procesowe-v3 | ✅ 2026-06-23 |
| Antycypacja zarzutów universalna U1–U9 | `shared/MOD-POSZLAKI-KONTEKST.md` PK5 + `pisma-procesowe-v3/modules/MOD-DOWODY.md` D7 (triggery) — NIE scalać (różne poziomy szczegółowości) | pisma-procesowe-v3 | ✅ 2026-06-23 |
| FSL-D: per-teza weryfikacja dowodów z zakazem cytowania z pamięci | `shared/MOD-FSL-DOKUMENTY.md` v1.0.0 — WYŁĄCZNA lokalizacja; NIE duplikować w CLAIM-VALIDATION ani MACIERZ | pisma-procesowe-v3 (W1.2c-FSL-D), analizator-dowodow-v3 (BLOK-C-FSL) | ✅ 2026-06-27 |
| REGUŁA-NAZWA-PLIKU-MYLĄCA | `shared/MOD-FSL-DOKUMENTY.md` § REGUŁY SZCZEGÓLNE — NIE duplikować w MOD-SKAN-DOWODOW-KOMPLETNY | pisma-procesowe-v3, analizator-dowodow-v3 | ✅ 2026-06-27 |
| Klasy źródeł dowodowych A–G | `shared/DOWODY-METODOLOGIA.md §5` (kanoniczne) | analizator-dowodow-v3, pisma-procesowe-v3, MOD-MACIERZ-DOWOD-TEZA (mapowanie ★) | ✅ 2026-06-24 |
| Klasy pewności faktu (BEZSPORNE/PEWNE/WYDEDUKOWANE/SPORNE) | `shared/DOWODY-METODOLOGIA.md §6` (standard systemowy) | analizator-dowodow-v3 (BLOK-KONSEKWENCJE), chronologia-sprawy-v1 (source), pisma-procesowe-v3 W1.3 | ✅ 2026-06-24 — przeniesione z chronologia-sprawy-v1 |
| Filtr przydatności procesowej tez (USE/SKIP/UWAGA) | `shared/MOD-MACIERZ-DOWOD-TEZA.md §MT4a` | pisma-procesowe-v3 (W1.3), analizator-dowodow-v3 | ✅ 2026-06-24 |
| Warstwa konsekwencji tezy C-X.1/C-X.2/C-X.3 (DTA W6) | `analizator-dowodow-v3/SKILL.md §BLOK-KONSEKWENCJE` | pisma-procesowe-v3 (petitum, uzasadnienie, W2.1) | ✅ 2026-06-24 |
| Numeracja krzyżowa D-NNN/F-NNN/T-NN (DTA-ID-MODE) | `analizator-dowodow-v3/SKILL.md §DTA-ID-MODE` | Trigger ≥5 plików lub ≥5 tez; optional dla małych spraw | ✅ 2026-06-24 |
| Metryka siły ataku per teza (N/10 + po kontrze) | `shared/MOD-ATAK-NA-DRAFT.md §5 D2` | pisma-procesowe-v3 (W2.4 RAPORT D) | ✅ 2026-06-24 |
| LA-WNIOSEK-W-FAKCIE (fakt = wniosek prawny) | `analizator-dowodow-v3/modules/MOD-LAPSUS-AUDYT.md §KAT-II` typ #23 | analizator-dowodow-v3 (BLOK-LAPSUS), pisma-procesowe-v3 (W2.4) | ✅ 2026-06-24 |
| Proweniencja dowodów — taksonomia typów SYS/KOM/ZAW/AUT/URZ/LIN/CHAIN | `shared/MOD-PROWENIENCJA-DOWODOW.md` (plik kanoniczny) | analizator-dowodow-v3 (BLOK-PROWENIENCJA), MP6-sledczy §6.12, pisma-procesowe-v3 W1.2c | ✅ 2026-06-24 |
| Klasy konsekwencji proweniencji P+/P-/P0/P! | `shared/MOD-PROWENIENCJA-DOWODOW.md §PR3` | analizator-dowodow-v3 (integracja z macierzą D×T i BLOK-KONSEKWENCJE) | ✅ 2026-06-24 |
| Podobieństwo tekstu / fingerprint lingwistyczny (LIN) | `shared/MOD-PROWENIENCJA-DOWODOW.md §TYP 6` (kanoniczne) — NIE scalać z MET-CA (MET-CA = narracja, LIN = proweniencja) | analizator-dowodow-v3 MP6 §6.12, MP6-sledczy §6.2 VSA (komplementarne) | ✅ 2026-06-24 |
| 12 technik negacji N1-N12 (gołosłowne zaprzeczenie..spoliation) | `shared/MOD-NEGACJA-DOWODOW.md §BLOK N3` (kanoniczne) | analizator-dowodow-v3 (BLOK-NEGACJA NG3), MP4 §4.3/4.6, RAPORT D §D2, pisma-procesowe-v3 W2.4 | ✅ 2026-06-24 |
| Ciężar dowodu per teza (KR1-KR5) + 6 dziedzin OD-1..OD-6 | `shared/MOD-NEGACJA-DOWODOW.md §BLOK N1` (kanoniczne) | analizator-dowodow-v3 (BLOK-NEGACJA NG1), pisma-procesowe-v3 W1.3 | ✅ 2026-06-24 |
| Odporność dowodów per klasa A-G na negację | `shared/MOD-NEGACJA-DOWODOW.md §BLOK N2` (kanoniczne) — NIE scalać z §5 DOWODY-METODOLOGIA (N2 = dynamika obalania, §5 = bazowe wagi statyczne) | analizator-dowodow-v3 (NG2), MP4 §4.6 | ✅ 2026-06-24 |
| Milczenie jako przyznanie [PRZYZ-MIL-H/M/L] (art. 229-230 KPC) | `shared/MOD-NEGACJA-DOWODOW.md §BLOK N4` (kanoniczne) | analizator-dowodow-v3 (BLOK-NEGACJA NG4), pisma-procesowe-v3 (sekcja "Fakty bezsporne") | ✅ 2026-06-24 |
| Spoliation / odmowa przedłożenia dowodu (art. 233 §2 KPC) | `shared/MOD-NEGACJA-DOWODOW.md §N12 + §N6` (kanoniczne) — NIE scalać z MP6-sledczy §6.4 BEH (N12 = technika negacji, BEH-C = wzorzec behawioralny) | analizator-dowodow-v3 (BLOK-NEGACJA NG3), pisma-procesowe-v3 W1.2d | ✅ 2026-06-24 |
| REJESTR KROKÓW pipeline / śledzenie pominięć / ZAKAZ CICHEGO POMIJANIA | `shared/MOD-STEP-TRACKER.md` (kanoniczne, v1.0.0) — inicjowany w pisma-procesowe-v3 KROK 0-TRACKER; ST-INIT/ST-TRACK/ST-REPORT/ST-FINAL | pisma-procesowe-v3 (KROK 0-TRACKER, REGUŁA NAPRAWY, ZAKAZ-12), shared/MOD-SKAN-DOWODOW-KOMPLETNY (SD-VER) | ✅ 2026-06-24d |
| Wektory ataku na świadka SW-A1..SW-A8 (konflikt interesu, zaprzeczenie, relacja wtórna...) | `shared/MOD-ATAK-NA-SWIADKA.md §FAZA 2` (kanoniczne, v1.0.0) — NIE scalać z MOD-NEGACJA-DOWODOW §N8 (N8 = ogólny "atak na świadka" bez procedury; ten moduł = pełna procedura SW-P1..SW-P5 + priorytetyzacja + integracja W2.4c) | pisma-procesowe-v3 (W1.2c ŁD-3b, W2.4c, ZAKAZ-13) | ✅ 2026-06-24d |
| SW-TARCZKA — antycypacja ataku na NASZEGO świadka | `shared/MOD-ATAK-NA-SWIADKA.md §FAZA 4 SW-TARCZKA` (kanoniczne) — NIE scalać z ŁD-6 antycypacja (ŁD-6 = ogólna antycypacja na łańcuch; SW-TARCZKA = specyficznie dla ogniwa zeznaniowego) | pisma-procesowe-v3 (W2.4c, ZAKAZ-13) | ✅ 2026-06-24d |
| SW-DETECT — detekcja ogniw zeznaniowych w łańcuchu dowodowym | `shared/MOD-ATAK-NA-SWIADKA.md §FAZA 0` (kanoniczne) — wbudowany w pisma-procesowe-v3 W1.2c ŁD-3b jako automatyczny krok per ogniwo | pisma-procesowe-v3 (ŁD-3b, W2.4c) | ✅ 2026-06-24d |

---

## NOTY OTWARTE — DO ROZSTRZYGNIĘCIA W KOLEJNYCH AUDYTACH

### NOTA-1: BAS-W32 (przedawnienie cywilne) vs DEF-PROCEDURA.md (terminy) — ✅ ROZWIĄZANE 2026-06-12
Dodano wzajemne odesłania "PATRZ TEŻ" w obu plikach (BAS-W32 → DEF-PROCEDURA,
DEF-PROCEDURA → BAS-W32), wyjaśniające podział: DEF-PROCEDURA = KATEGORIE
terminów, BAS-W32 = KONKRETNE WARTOŚCI terminów przedawnienia. Nie wymagało
re-scalania treści — to NIE był duplikat, tylko nieoznaczona komplementarność.

### NOTA-2: Niealimentacja (art.209 KK) — umiejscowienie
Umieszczona w DEF-PRACA.md (kontekst: alimenty/rodzina), ale art.209 KK
to PRZESTĘPSTWO — materialnie należy do DR-03. Zostawione w DEF-PRACA
z adnotacją "relewantne także dla DR-03", bo:
  (a) to tylko 5 linii — nie uzasadnia osobnego pliku,
  (b) sprawy alimentacyjne najczęściej zaczynają się w DR-04 (rodzina/
      świadczenia) i PRZECHODZĄ do DR-03 dopiero przy niealimentacji.
→ AKCJA: jeśli DR-03 w przyszłości otrzyma własny plik definicje/
  DEF-KARNE-WYBRANE.md (obecnie nie istnieje), PRZENIEŚĆ tam i dodać
  stub w DEF-PRACA.

### NOTA-5: TYP BŁĘDU "PRAWDZIWY CYTAT W ZŁYM KONTEKŚCIE" — ✅ NAPRAWIONE 06-13
mod-grzywny-mandaty-szczegolowe.md cytował "Dz.U. 2026 poz. 724 (MSWiA
29.05.2026)" jako podstawę TARYFIKATORA KWOT mandatów. Ten Dz.U. ISTNIEJE
i data/minister są PRAWDZIWE — ALE dotyczy ewidencji punktów karnych
(weszło w życie 03.06.2026), NIE kwot mandatów. Kwoty wciąż oparte na
PRM 30.12.2021 (Dz.U. 2021 poz. 2484) — "te same kwoty co 2022" (potw.
marzec 2026). To NAJGORSZY typ błędu HARDGATE: cytat "wygląda zweryfikowany"
(realny Dz.U.) ale jest UŻYTY W ZŁYM KONTEKŚCIE.
→ AKCJA NA PRZYSZŁOŚĆ: przy weryfikacji online NIE WYSTARCZY potwierdzić,
  że dany Dz.U./data/numer ISTNIEJE — trzeba potwierdzić, że PRZEDMIOT
  tego aktu odpowiada TEMU, do czego jest przywoływany. ✅ ZROBIONE 06-14:
  dodano KROK 2B do PRAWO-HARDGATE.md (weryfikacja przedmiotu/tytułu aktu,
  nie tylko numeru Dz.U.).

Dodatkowo: "art. 86c KW — drift/celowy poślizg" w tym samym module —
BRAK potwierdzenia online (2026-06-13, wyszukiwanie zwróciło wyłącznie
wyniki o zawodach Drift Masters). Oznaczono w tabeli jako ⚠️ NIEZWERYFIKOWANE
z instrukcją web_search przed użyciem — możliwe że to błędny numer art.
lub konfuzja z nowymi ustawami BRD I/BRD II (06.2026, patrz mod-PRD).

### NOTA-3: mod-KK-kwalifikator-karnomaterialny.md (589 linii, DR-03) —
ŚWIADOMIE NIE dzielony.
To przekrojowe drzewo decyzyjne (BLOK A-G = różne kategorie przestępstw
KK, porównywane wzajemnie w sekcji "BŁĘDY KWALIFIKACYJNE"). Podział
zniszczyłby logikę porównawczą (np. BŁĄD 1 wymaga widzenia jednocześnie
BLOK A.1 rozbój i kradzież rozbójniczą). WYJĄTEK od "jeden moduł = jeden
akt" — udokumentowany, nie traktować jako zaniedbanie w przyszłych audytach.

### NOTA-4: Moduły >400 linii — STATUS PO SESJI 2026-06-12
| Moduł | Linie PRZED | Status |
|---|---|---|
| mod-PrFarm-prawo-farmaceutyczne (DR-10) | 915 | → 901 (wydzielono mod-wyroby-medyczne, 73 linii) |
| mod-KK-kwalifikator-karnomaterialny (DR-03) | 589 | NIE DZIELIĆ — patrz NOTA-3 |
| mod-KP-prawo-pracy (DR-04) | 524 | → 337 (wydzielono 3 moduły: mobbing 109, wypadek 112, praca zdalna 75) |
| mod-PZP-zamowienia-publiczne-KIO (DR-07) | 493 | ✅ ZROBIONE 06-14: 394 linii. Wydzielono sekcje 10 (compliance SWZ/OPZ art. 99), 11 (certyfikacja wykonawców), ANEKS A-B (podwykonawstwo, zabezpieczenie) → mod-PZP-wykonanie-umowy-compliance.md (NOWY, 180 l.) |
| mod-PRD-prawo-jazdy-punkty-karne (DR-03) | 492 | ✅ ZROBIONE 06-14: 367 linii. Wydzielono sekcje 5-7 (sądowy zakaz, nowe przestępstwa drogowe BRD II, prawo jazdy od 17 lat BRD I) + alert B → mod-PRD-nowe-przestepstwa-drogowe-BRD.md (NOWY, 222 l.) |
| mod-PrFarm-szczegolowy (DR-10) | 468 | ✅ ZROBIONE 06-14: 330 linii. Usunięto zduplikowaną CZĘŚĆ IX (już w mod-wyroby-medyczne z 06-12). Wydzielono CZĘŚĆ VI-VIII (refundacja, nadzór GIF/WIF, sankcje) → mod-PrFarm-refundacja-nadzor-sankcje.md (NOWY, 196 l.) |
| mod-ustawa-cudzoziemcy (DR-05) | 455 | ✅ ZROBIONE 06-14: 350 linii. Wydzielono sekcję 4 (zezwolenia na pracę A/B/C/D/S + matryca dokument→praca, ustawa Dz.U. 2025 poz. 621) → mod-ustawa-cudzoziemcy-zatrudnianie.md (NOWY, 177 l.) |
| mod-KC-cywilne-zobowiazania-odpowiedzialnosc (DR-02) | 436 | ✅ ZROBIONE 06-14: 370 linii. Usunięto ANEKS E (37 l., duplikat mod-KC-spadki — pointer dodany). Wydzielono ANEKS F (50 l.) → mod-KC-kredyty-frankowe.md (NOWY). Dodano pointer do DEF-ODPOWIEDZIALNOSC-SZKODA C.2-C.3 przy tabeli "Dwa reżimy" (overlap zachowany świadomie — różne poziomy: definicyjny vs porównawczy) |
| mod-interpretacje-definicje-podatkowe (DR-06) | 432 | ✅ ZROBIONE 06-14: 403 linii. Wydzielono sekcję 4 (PKWiU/CN/PKOB/KŚT, 39 l.) → mod-PKWiU-klasyfikacje-statystyczne.md (NOWY, referencjonowany przez mod-VAT/PIT/CIT). Sekcja 5: usunięto duplikat "DZIAŁALNOŚĆ GOSPODARCZA" (już w DEF-PODATKOWE BLOK G), dodano pointer. Pozostałe 4 definicje sekcji 5 (mały podatnik, podmiot powiązany, stały zakład, B2B vs umowa o pracę) — unikalne, zachowane |
| mod-ustawa-akcyzowa-i-clo-UCC (DR-06) | 372 | ✅ ZROBIONE 06-14: 281 linii. Wydzielono cło/UCC (Nomenklatura Scalona CN/TARIC, WIT, procedury celne, wartość celna, FTA/GSP) → mod-UCC-clo-taryfa-celna.md (NOWY, 180 l.). Podział wg dwóch reżimów prawnych: akcyza (krajowa) vs. UCC (UE) |

**Reguła progowa:** moduł >400 linii = kandydat do audytu PRZY NAJBLIŻSZEJ
zmianie tego modułu (nie wymaga dedykowanej sesji — "przy okazji").
Moduł >600 linii = PRIORYTET nawet bez innej zmiany w toku.

### NOTA-6: ORPHAN shared/ — ✅ ZAMKNIĘTE 2026-06-14 (sesja 3)
`LOCAL-PUBLICATION-VALIDITY-CHECK.md`, `LOCAL-SOURCE-EQUIVALENCE-PROTOCOL.md`,
`OFFICIAL-SOURCE-TIERING-PROTOCOL.md`, `PROFESSIONAL-SELF-GOVERNMENT-DEEP-STANDARD.md`,
`SOURCE-HIERARCHY-EQUIVALENCE-PROTOCOL.md` — USUNIĘTE (decyzja dewelopera: usunąć).
Zero konsumentów potwierdzone (`grep -rl` przed usunięciem). Jedyny dangling
pointer (`shared/INTERPRETACJE-URZEDOWE.md` → `OFFICIAL-SOURCE-TIERING-PROTOCOL.md`)
naprawiony — treść warstwy lokalnej (DUW/BIP/rejestry) wciągnięta inline jako
2-zdaniowe streszczenie, bez utraty informacji istotnej dla DR-08/DR-12.
`DEPENDENCY-GRAPH.md` zaktualizowany (wpis ORPHAN usunięty).

---

### NOTA-7: DUPLIKAT — mod-wyroby-medyczne vs mod-ustawa-wyroby-medyczne (DR-10) — ✅ ZAMKNIĘTE 2026-06-14 (sesja 4)
Podczas wydzielania mod-PrFarm-refundacja-nadzor-sankcje z mod-PrFarm-szczegolowy
wykryto, że CZĘŚĆ IX (wyroby medyczne) w mod-PrFarm-szczegolowy była zduplikowaną
kopią treści już wydzielonej 2026-06-12 do `mod-wyroby-medyczne.md` — USUNIĘTO.

Dodatkowo wykryto NIEZALEŻNY drugi plik `mod-ustawa-wyroby-medyczne.md` (32 linie,
stub: akt prawny + MDR/IVDR bez treści proceduralnej), zarejestrowany osobno w
SKILL.md i MAPA-AKTOW (Dz.U. 2022 poz. 974 → mod-ustawa-wyroby-medyczne).

**Rozwiązanie:** Scalono unikalną treść stubu (obowiązki wytwórcy/importera/
dystrybutora wg MDR, UDI, CE-marking, PRRC, status modułów EUDAMED po rozp.
(UE) 2024/1860) do `mod-wyroby-medyczne.md` (kanoniczny). `mod-ustawa-wyroby-medyczne.md`
USUNIĘTY. SKILL.md (sekcja WYROBY MEDYCZNE I CHEMIA, liczba modułów 23→22) i
MAPA-AKTOW zaktualizowane — jeden wpis → mod-wyroby-medyczne.

**Przy okazji:** zweryfikowano online (2026-06-14) aktualną nazwę organu —
**URPL** (Urząd Rejestracji Produktów Leczniczych, Wyrobów Medycznych i Produktów
Biobójczych), gov.pl/web/urpl. Poprawiono błędny wariant "UPLWMiPB (dawny URPL)"
— było odwrotnie: URPL jest aktualną nazwą, "UPLWMiPB" nie jest potwierdzoną
nazwą urzędu. Naprawiono w mod-wyroby-medyczne.md, mod-PrFarm-prawo-farmaceutyczne.md
(2 miejsca) i mod-PrFarm-szczegolowy.md (2 miejsca). Usunięto też niezweryfikowany
"15-30 dni" termin zgłoszenia incydentu MDR — zastąpiono odesłaniem do MDR art. 87 + MDCG.

---

### NOTA-8: DUPLIKAT — mod-ustawa-komornicy-sadowi (DR-03) vs mod-ustawa-komornicy-sadowi-zawod (DR-12) — ✅ ZAMKNIĘTE 2026-06-14 (sesja 5)
Wykryte podczas przeglądu pokrycia "zawodów zaufania publicznego" (grupa a —
zawody prawnicze: adwokat, radca prawny, notariusz, komornik, kurator sądowy).

Dwa moduły dla jednej ustawy o komornikach sądowych (Dz.U. 2024 poz. 1458 t.j.):
- `dr-03/.../mod-ustawa-komornicy-sadowi.md` (39 linii, stub bez HARDGATE-equiv,
  MAPA-AKTOW cytował STARY t.j. Dz.U. 2023 poz. 1691)
- `dr-12/.../mod-ustawa-komornicy-sadowi-zawod.md` (202 linie, pełny: intake,
  mapa proceduralna, matryca dowodowa, strategia, quality gate)

Oba moduły miały zadeklarowany podział "zawód (DR-12) vs tryb egzekucji (DR-03)",
ale faktyczna treść DR-03 stubu (status komornika, OC, skarga 767 KPC, wybór
komornika, opłaty) była tym samym zakresem co DR-12, nie odrębnym "trybem
egzekucji" (to żyje w DR-02/mod-KPC-egzekucja-windykacja).

**Rozwiązanie:** `mod-ustawa-komornicy-sadowi.md` (DR-03) USUNIĘTY — nic
unikalnego do scalenia. Zaktualizowano:
- DR-03/MAPA-AKTOW.md: wiersz → odesłanie do dr-12/mod-ustawa-komornicy-sadowi-zawod,
  poprawiono Dz.U. 2023/1691 → 2024/1458 t.j.
- DR-12/SKILL.md: usunięto martwy cross-ref do DR-03
- DR-12/mod-ustawa-notariat.md: cross-ref "tytuł egzekucyjny" → DR-02/mod-KPC-egzekucja-windykacja
  + status zawodu komornika → ten sam DR
- DR-12/mod-ustawa-komornicy-sadowi-zawod.md: usunięto wewnętrzne odesłania do
  usuniętego DR-03 stubu, zastąpiono DR-02/mod-KPC-egzekucja-windykacja (poprawiono
  też nazwę pliku — wcześniej cytowano nieistniejący "...-i-windykacja")
- ROUTING-MAP.md już wskazywał poprawnie na dr-12 — bez zmian

Wniosek ogólny: świadomy podział "moduł A = zawód, moduł B = procedura" jest
poprawnym wzorcem TYLKO gdy moduł B faktycznie zawiera odrębną treść proceduralną
(np. UPEA dla zajęć administracyjnych). Gdy moduł B jest tylko krótszą kopią
modułu A pod innym tytułem, to nie jest podział funkcjonalny — to duplikat.

## PROCEDURA UŻYCIA (dla audytu/dewelopera)

1. **Przed dodaniem nowego pojęcia/definicji**: Ctrl+F w tabeli wyżej —
   czy temat już istnieje? Jeśli TAK → edytuj istniejące miejsce, NIE
   twórz nowego wpisu w innym pliku.
2. **Po dodaniu nowego pojęcia**: dopisz wiersz do tabeli (Pojęcie |
   Lokalizacja | Konsumenci | Status=✅ z datą).
3. **Przy edycji modułu DR**: sprawdź czy edytowana treść ma odpowiednik
   w tej tabeli — jeśli edytujesz definicję BEZ sprawdzenia, ryzykujesz
   stworzenie wersji rozbieżnej (jak mobbing/szkoda/terminy/wyłączenie
   sędziego — 4 przypadki znalezione 2026-06-12).
4. **Audyt okresowy** (audyt-systemu-v4, sekcja "deduplikacja"): grep
   po kluczowych frazach z kolumny "Pojęcie" w całym `/mnt/skills/user/`
   — jeśli fraza pojawia się w >1 pliku POZA "Lokalizacja kanoniczna" +
   "Konsumenci" (które powinny mieć tylko odesłania/cross-ref, nie pełną
   treść) → potencjalny nowy duplikat.

---
*CHECKLIST-DEDUP.md · audyt-systemu-v4/references/ · utworzony 2026-06-12*
*32 pozycje skatalogowane w tabeli głównej, NOTA-1 do NOTA-8 — WSZYSTKIE
ROZSTRZYGNIĘTE (NOTA-1/2/3/5 wcześniej, NOTA-4 = tabela modułów >400 linii
— wszystkie 10 ZAMKNIĘTE, NOTA-6 ORPHAN zamknięta 06-14, NOTA-7 zamknięta 06-14
sesja 4 — wyroby medyczne + korekta URPL, NOTA-8 zamknięta 06-14 sesja 5 —
duplikat komornik, wykryty podczas przeglądu zawodów zaufania publicznego).*

---

## NOTA-9 — Nowe moduły shared z sesji 2026-06-16 (oczekują na wdrożenie)

**Status:** ⚠️ OCZEKUJE NA WDROŻENIE do /mnt/skills/user/shared/

Zarejestrowane pojęcia/moduły jako kanoniczne lokalizacje:

| Pojęcie/Moduł | Lokalizacja kanoniczna | Konsumenci | Status |
|---|---|---|---|
| Warianty strategiczne pisma (W1.2b) | `shared/MOD-WARIANTY-POZWU.md` | pisma-procesowe-v3, analizator-dowodow-v3 | ✅ wdrożone 06-17 |
| Checklist priorytetów aspektów (główne/poboczne) | `shared/MOD-PRIORYTETY-ASPEKTOW.md` | analizator-dowodow-v3, analiza-sadowa-v6 | ✅ wdrożone 06-17 |
| Rejestr metod badawczych (13 metod) | `shared/MOD-METODY-BADAWCZE.md` | analizator-dowodow-v3 BLOK E2a-j | ✅ wdrożone 06-17 |
| Historia strategii (TRYB A/B, schema JSON) | `shared/MOD-HISTORIA-STRATEGII.md` | MOD-WARIANTY-POZWU, MOD-PRIORYTETY-ASPEKTOW | ✅ wdrożone 06-17 |
| Mapowanie wyników na przepisy (głębokość/zgodność) | `shared/MOD-MAPA-PRZEPISOW.md` | analizator-dowodow-v3 KROK 4a.3, MOD-WARIANTY-POZWU | ✅ wdrożone 06-17 |
| Selekcja dowodów do tez + ryzyko krzyżowe | `shared/MOD-SELEKCJA-DOWODOW.md` | analizator-dowodow-v3 KROK 4a.5, pisma-procesowe-v3 W1.3 | ✅ wdrożone 06-17 |
| Kontekst sesji (bridge między sesjami, format .md) | `shared/MOD-KONTEKST-SESJI.md` | prawny-router-v3 KROK 0B/5B, przesluchanie-swiadkow-v2 KROK 0 | ✅ wdrożone 06-17 |

**Po wdrożeniu ZIP-ów**: zmień status wszystkich wierszy z ⚠️ na ✅ z datą wdrożenia.

**Uwaga deduplication**: 
- Ryzyko krzyżowe dowodów (HARDGATE-SD-01/02) jest kanoniczne w MOD-SELEKCJA-DOWODOW.
  Nie tworzyć kopii tej logiki w DR-skillach ani w pisma-procesowe-v3.
- Rejestr metod badawczych: wszystkie 13 metod (SLE-01/02/03 + MET-ACH/FTL/NET/CA/
  CASE/PT/TRI/FA/DQ/COMP) są kanoniczne w MOD-METODY-BADAWCZE. Nie duplikować
  opisów metod w BLOK E analizatora (odwołanie przez view, nie inline).
- Format pliku kontekstu sesji (9 sekcji §2 MOD-KONTEKST-SESJI): jeden format
  dla TRYB A i TRYB B (portal vendora) — nie tworzyć alternatywnych schematów.

*NOTA-9 ZAMKNIĘTA: 2026-06-17 · wszystkie 7 modułów wdrożone i zweryfikowane*
| 9 technik ataku na świadka TA-1..TA-9 (sprzeczność zeznań, motyw, percepcja, sprzeczność wewnętrzna, skazanie, hearsay, konfrontacja, zeznania pisemne, biegły) | `shared/MOD-ATAK-NA-SWIADKA.md §CZĘŚĆ I` (kanoniczne) | analizator-dowodow-v3 (BLOK-NEGACJA N8), przesluchanie-swiadkow-v2, dr-16 mod-KPC-przesluchanie-swiadkow, pisma-procesowe-v3 W2.4 | ✅ 2026-06-24 |
| 9 metod ataku na biegłego B1-B9 (metodologia, ultra vires, sprzeczność, niekompletny materiał, wyłączenie, prywatna opinia, kwalifikacje, art.286, art.278¹) | `shared/MOD-ATAK-NA-SWIADKA.md §CZĘŚĆ II` (kanoniczne) — NIE scalać z DR-12 (procesowa rola biegłego ≠ techniki ataku) | analizator-dowodow-v3 (BLOK-NEGACJA N8), pisma-procesowe-v3 | ✅ 2026-06-24 |
| Procedura obrony ante-cross AC1-AC4 (inwentaryzacja podatności, neutralizacja w direct, przygotowanie świadka, scoring) | `shared/MOD-ATAK-NA-SWIADKA.md §CZĘŚĆ III` (kanoniczne) | przesluchanie-swiadkow-v2 W3-W4, pisma-procesowe-v3 | ✅ 2026-06-24 |
| Specyfika ataku na świadka/biegłego per dziedzina (DR-02/03/04/05) | `shared/MOD-ATAK-NA-SWIADKA.md §CZĘŚĆ IV` (kanoniczne, poglądowe) | DR-02, DR-03, DR-04, DR-05 (pointer — szczegóły w DR-skillu) | ✅ 2026-06-24 |
| WARN-13 zamknięty: §WERYFIKACJA sygnatur w MOD-NEGACJA-DOWODOW | `shared/MOD-NEGACJA-DOWODOW.md §WERYFIKACJA` | System: procedura weryfikacji przed powołaniem w piśmie | ✅ 2026-06-24 |
| 12 wektorów ataku na dowód AD-1..AD-12 | `shared/MOD-ATAK-NA-DOWOD.md §CZĘŚĆ I` (kanoniczne) | analizator-dowodow-v3 (BLOK-ATAK-NA-DOWOD, MP5-atak §5.2/5.3), pisma-procesowe-v3 (W2.4 + W1.2d) | ✅ 2026-06-24 |
| Procedura ADIS ofensywna (5 kroków ataku na dowody przeciwnika) | `shared/MOD-ATAK-NA-DOWOD.md §CZĘŚĆ II` | analizator-dowodow-v3 (BLOK-ATAK-NA-DOWOD), pisma-procesowe-v3 W1.2d | ✅ 2026-06-24 |
| Procedura SHIELD obronna (6 kroków szczepienia dowodu) | `shared/MOD-ATAK-NA-DOWOD.md §CZĘŚĆ III` | pisma-procesowe-v3 W2.4, analizator-dowodow-v3 MP5-atak §5.4 | ✅ 2026-06-24 |
| Ataki na dowody elektroniczne DE-1..DE-5 (metadane, hash, AI/deepfake) | `shared/MOD-ATAK-NA-DOWOD.md §AD-10` — NIE scalać z DR-11 (DR-11=prawo cyfrowe, AD-10=taktyki ataku) | analizator-dowodow-v3, pisma-procesowe-v3 | ✅ 2026-06-24 |
| Zakaz dowodowy katalog ZD-1..ZD-6 (nagrania, tajemnice, RODO, art.174 KPK) | `shared/MOD-ATAK-NA-DOWOD.md §AD-5` (rozszerzenie MD3b §LEG-CONTRA-N o katalog i mechanizmy ataku) | analizator-dowodow-v3 MD3b (istniejący wykrywa), MP5-atak §AD-5 (mechanizm ofensywny) | ✅ 2026-06-24 |
| Kontrdowód aktywny KD-1..KD-5 (sekwencja ofensywna) | `shared/MOD-ATAK-NA-DOWOD.md §AD-9` (kanoniczne) — NIE scalać z MP5 §5.4 (MP5=ogólny przeciwplan) | analizator-dowodow-v3 (BLOK-ATAK-NA-DOWOD ADIS-4) | ✅ 2026-06-24 |
