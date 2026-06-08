---
name: orzeczenia-sadowe-v2
version: 2.1
type: executive-analiza
status: production
compatibility: "web_search, web_fetch, show_widget"
description: >
  Wyszukuje, weryfikuje i cytuje realne orzeczenia sądowe z oficjalnych polskich
  portali prawnych (orzeczenia.ms.gov.pl, sn.pl, nsa.gov.pl, trybunal.gov.pl,
  saos.org.pl). Stosuj ZAWSZE gdy użytkownik pyta o orzecznictwo, wyroki,
  judykaturę, linię orzeczniczą, precedensy lub podobne sprawy sądowe — nawet
  jeśli nie używa tych słów wprost. Stosuj też gdy użytkownik chce wzmocnić
  pismo procesowe orzecznictwem lub potrzebuje podstawy orzeczniczej do
  argumentacji prawnej. Nigdy nie cytuj orzeczeń z pamięci — ten skill zawsze
  weryfikuje orzeczenia online przed podaniem sygnatury i nazwy sądu.
  NIE stosuj gdy użytkownik pyta tylko o przepisy prawa bez orzeczeń.
  v2.1: uchwały 7 SN jako Kat. 6A z priorytetem; obsługa jurysdykcji
  zagranicznych (Tier 4); fallback przy niedostępności narzędzi sieciowych;
  dziedzinowe progi alertu STARE; szablon zakładki Alerty; integracja SYGNATURY.
---

# Wyszukiwanie Orzeczeń Sądowych v2.1

Narzędzie procesowe dla pełnomocników, sędziów i stron działających pro se.
Łączy interaktywny widget HTML (tryb laik / prawnik) z weryfikowanym
wyszukiwaniem orzeczeń, wskaźnikiem pokrycia przesłanek i systemem alertów.

## Sekwencja działania (zawsze w tej kolejności)

1. **Wyświetl widget interaktywny** — patrz: sekcja Widget poniżej
2. **Emituj profil ryzyka** — alerty wstępne przed wyszukiwaniem (Faza 0-A)
3. **Ustal przesłanki i zakres** — przepis, znamiona, ciężar dowodu (Faza 0-B)
4. **Wyszukaj orzeczenia** — portale priorytetowe, 4 kroki (Faza 1)
5. **Skategoryzuj z alertami** — taksonomia 8 kategorii (Faza 2)
6. **Zweryfikuj aktualność linii** — jednolitość, zmiany prawa (Faza 3)
7. **Wygeneruj raport końcowy** — wskaźnik pokrycia, rekomendacje (Faza 4)
8. **Wyświetl widget ponownie** — z kompletnymi danymi z Faz 1–4

---

## Widget interaktywny

Uruchom widget opisany w `references/widget.md`.

Widget zawiera 5 zakładek:
- **Profil ryzyka** — alerty wstępne dla sprawy w trybie laik lub prawnik
- **Przesłanki** — pasek pokrycia per przesłanka i rozkład ciężaru dowodu
- **Orzeczenia** — pełna sygnatura, sąd z izbą, data, link do oryginału w nowym oknie
- **Alerty** — katalog aktywnych ostrzeżeń per orzeczenie z wyjaśnieniami (patrz: szablon Alerty w widget.md)
- **Raport** — wskaźnik pokrycia, ocena linii orzeczniczej, kolejność powołania

Przełącznik **LAIK / PRAWNIK** w nagłówku zmienia język alertów, tez i rekomendacji jednocześnie we wszystkich zakładkach.

Kod widgetu: patrz `references/widget.md` — wklej jako argument `widget_code` narzędzia
`show_widget`, podstawiając dane konkretnej sprawy w miejsca oznaczone `<!-- DANE: ... -->`.

Widget wywołujesz **dwukrotnie:**
- przed wyszukiwaniem — z danymi Fazy 0-A i 0-B, komunikat „Trwa wyszukiwanie…" w zakładkach Orzeczenia i Raport
- po wyszukiwaniu — z kompletnymi danymi wszystkich faz

---

## Zasady fundamentalne

**Zasada 1 — ⛔ PERMANENT GATE: zakaz cytowania z pamięci (przez CAŁĄ rozmowę):**
Każde powołanie sygnatury, daty lub sądu = osobny web_search/web_fetch w tej odpowiedzi.
Zakaz nie wygasa po żadnej liczbie wiadomości. Nawet gdy model "jest pewny" — weryfikacja obowiązkowa.
Jeśli nie możesz zweryfikować: „Nie odnalazłem tego źródła online. Nie powołuję."
Przed cytowaniem wykonaj procedurę V-SYG z modułu SYGNATURY:
```
view /mnt/skills/user/shared/SYGNATURY.md
→ Wykonaj V-SYG-1 przez V-SYG-4
→ Dopiero po wyniku OK: cytuj z linkiem źródłowym
```

**Zasada 2 — Cztery obowiązkowe elementy każdego orzeczenia:**
```
[1] SYGNATURA — pełna, np. II PK 123/22
[2] DATA      — dzień-miesiąc-rok, np. 15 marca 2023
[3] SĄD       — pełna nazwa + izba/wydział
[4] URL       — link do oryginału w oficjalnym portalu, nowe okno
```
Brak któregokolwiek = błąd krytyczny, orzeczenie nie może być powołane.

**Zasada 3 — Limit cytatu: maksymalnie 30 słów.**
Dziedzinowy override globalnego limitu 15 słów z PRAWO-HARDGATE — uzasadniony koniecznością
dokładnego oddania tezy prawnej. Dotyczy WYŁĄCZNIE cytatów z treści orzeczeń sądowych.
Dla przepisów ustawowych obowiązuje globalny limit 15 słów z PRAWO-HARDGATE.

**Zasada 4 — Link wyłącznie do oryginału.**
Zakaz linkowania do LexLege, Prawo.pl, SIP itp. jako głównego źródła.

**Zasada 5 — Jedno wiarygodne oficjalne źródło wystarczy.**
Orzeczenie jest uznane za zweryfikowane gdy potwierdzone w co najmniej JEDNYM
z portali: sn.pl, orzeczenia.ms.gov.pl, orzeczenia.nsa.gov.pl, trybunal.gov.pl,
curia.europa.eu (TSUE), hudoc.echr.coe.int (ETPC).
saos.org.pl pełni rolę wsparcia — nie jest samodzielnym źródłem weryfikacji.
Nie wymagaj potwierdzenia w wielu portalach jednocześnie.

**Zasada 6 — Status „Źródło niepotwierdzone w portalu sądowym".**
Gdy orzeczenie pojawia się w wynikach wyszukiwania, ale nie można uzyskać
bezpośredniego URL z oficjalnego portalu sądowego:
  → Oznacz statusem: „Źródło niepotwierdzone w portalu sądowym"
  → NIE używaj określenia „niezweryfikowane"
  → NIE powołuj w piśmie procesowym bez potwierdzenia URL
  → Poinformuj użytkownika że weryfikacja bezpośrednia nie była możliwa

**Zasada 7 — Hierarchia portali (TSUE i ETPC jako pełnoprawne źródła):**
```
Tier 1 (krajowe PL): sn.pl · orzeczenia.ms.gov.pl · orzeczenia.nsa.gov.pl · trybunal.gov.pl
Tier 2 (UE/EU):      curia.europa.eu · hudoc.echr.coe.int
Tier 3 (backup):     saos.org.pl (wyłącznie pomocniczo)
Tier 4 (zagraniczne): patrz sekcja „Jurysdykcje zagraniczne"
```
Orzeczenia TSUE i ETPC mają status równoważny z Tier 1 dla materii objętej prawem UE
lub Konwencją. Kategoria 5 (UE/TSUE) obejmuje teraz również orzeczenia ETPC.

**Zasada 8 — Uchwały SN z mocą zasady prawnej (Kat. 6A — priorytet):**
Uchwały pełnego składu SN, połączonych izb lub całej izby oraz uchwały
składu 7 sędziów SN, którym nadano moc zasady prawnej (art. 87 § 1 ustawy
z 8 grudnia 2017 r. o Sądzie Najwyższym, Dz.U.2023.1093), tworzą kategorię
6A — wyższą rangą niż zwykłe orzeczenia SN.
Wiążą wszystkie składy orzekające SN (odstąpienie wymaga uchwały całej Izby).
Sędziowie sądów powszechnych nie są nimi formalnie związani, lecz mają
fundamentalne znaczenie praktyczne dla całego systemu.
Gdy takie uchwały są dostępne → ZAWSZE powołuj jako pierwsze w piśmie.
Weryfikacja: sn.pl/orzecznictwo/SitePages/Najnowsze_orzeczenia.aspx?Izba=Uchwaly

---

## Faza 0-A — Profil ryzyka

Przed wyszukiwaniem emituj alerty wstępne — każdy w dwóch wariantach:

```
ALERT WSTĘPNY [WYSOKI / ŚREDNI / NISKI]
Dla laika:    [prosty język — co oznacza i co zrobić]
Dla prawnika: [procesowy — przepis, termin, ryzyko]
```

---

## Faza 0-B — Przesłanki i ciężar dowodu

```
RODZAJ POSTĘPOWANIA: [...]
KLUCZOWY PRZEPIS:    [np. art. 52 § 1 pkt 1 KP]
INSTYTUCJA PRAWNA:   [...]
JURYSDYKCJA:         [PL / UE / zagraniczne: ...]

PRZESŁANKI:
P1: [treść] — ciężar: [strona]
P2: [treść] — ciężar: [strona]

FRAZY DO WYSZUKIWANIA: [3–7 fraz]
```

---

## Faza 1 — Wyszukiwanie

### Portale krajowe i UE (Tier 1–3)

Kolejność priorytetu dla spraw polskich:
1. sn.pl/orzecznictwo — SN, uchwały (w tym Kat. 6A)
2. orzeczenia.ms.gov.pl — SA, SO, SR
3. orzeczenia.nsa.gov.pl — Administracyjne
4. trybunal.gov.pl/orzeczenia — TK
5. curia.europa.eu — TSUE (dla materii objętej prawem UE)
6. hudoc.echr.coe.int — ETPC (dla materii objętej Konwencją)
7. saos.org.pl — Agregator (backup — tylko gdy brak wyniku w 1–6)

Jedno trafienie w portalach 1–6 = orzeczenie zweryfikowane.
Brak trafienia w 1–6 + trafienie tylko w innych źródłach → status „Źródło niepotwierdzone w portalu sądowym".

Strategia: fraza + przepis → instytucja prawna → zagadnienie ogólne → SAOS.

### Portale zagraniczne (Tier 4)

Stosuj gdy sprawa zawiera element obcy lub użytkownik pyta o orzecznictwo
sądu innego niż polski. Tier 4 nie zastępuje Tier 1–2 dla spraw krajowych.

| Jurysdykcja | Portal oficjalny | Uwagi |
|---|---|---|
| Niemcy (DE) | bundesgerichtshof.de (BGH, od 2000); bundesverfassungsgericht.de (BVerfG) | Treść wyłącznie w języku niemieckim |
| Francja (FR) | legifrance.gouv.fr (bazy CASS, INCA, CAPP); courdecassation.fr | Dostęp bezpłatny; treść po francusku |
| Wielka Brytania (UK) | bailii.org; uksc.gov.uk (Supreme Court) | Neutral citation system; brak ECLI |
| Inne państwa UE | e-justice.europa.eu → National justice systems | Portal odsyła do portali krajowych |
| Wyszukiwarka ECLI (UE) | e-justice.europa.eu/ecli-search | Integruje bazy państw uczestniczących (bez PL — PL nie wdrożyła ECLI) |

Dla Tier 4:
- Weryfikacja możliwa wyłącznie przez web_fetch na oficjalnym portalu danego państwa.
- Brak możliwości fetch → status „Brak weryfikacji bezpośredniej (Tier 4)" — nie powołuj w piśmie polskim.
- Orzeczenia Tier 4 nie mogą być powoływane w polskim piśmie procesowym jako samodzielna podstawa; stosować wyłącznie pomocniczo (prawo porównawcze, argumentacja).

---

## Faza 1-F — Fallback (niedostępność narzędzi)

Wykonaj gdy web_search lub web_fetch zwrócą błąd, timeout lub są niedostępne:

```
FALLBACK F-1: web_search niedostępny
→ Poinformuj użytkownika: „Wyszukiwanie online chwilowo niedostępne.
  Nie mogę zweryfikować orzeczeń online. Nie podam sygnatur bez weryfikacji."
→ Zaoferuj: opis instytucji prawnej i przesłanek bez powołania konkretnych sygnatur
→ Zalecenie: sprawdź orzeczenia samodzielnie na sn.pl, orzeczenia.ms.gov.pl, saos.org.pl

FALLBACK F-2: web_fetch na portalu sądowym zwraca błąd (portal niedostępny)
→ Przejdź do następnego portalu w hierarchii
→ Po wyczerpaniu wszystkich portali Tier 1–3: status „Brak potwierdzenia URL"
→ NIE powołuj bez potwierdzonego URL

FALLBACK F-3: wyniki wyszukiwania istnieją, ale URL prowadzi do płatnej bazy (LEX, Legalis)
→ Zapisz: „Dostęp płatny — nie cytuję."
→ Szukaj tego samego orzeczenia w saos.org.pl

FALLBACK F-4: luka pokrycia przesłanek < 40% po wyczerpaniu wyszukiwania
→ Alert luki: „Brak orzeczeń potwierdzających [przesłanka X]"
→ Rozszerz frazę lub zmień kategorię wyszukiwania
→ Jeśli nadal brak: poinformuj o luce w Raporcie
```

---

## Faza 2 — Kategoryzacja i alerty

Czytaj `references/widget.md` — tabele mapowania alertów i kategorii na klasy CSS.

### Alerty per orzeczenie

| Alert | Wyzwalacz | Priorytet |
|---|---|---|
| ⚠️ STARE | Orzeczenie starsze niż próg dziedzinowy (patrz: tabela progów) | Informacyjny |
| 🔴 SPRZECZNE | Linia niejednolita — orzeczenie trafia do Kat. 3B | Wysoki |
| 🔴 ZMIANA PRAWA | Nowelizacja przepisu po dacie wyroku | Wysoki |
| ℹ️ WYMIAR UE | Materia objęta dyrektywą UE lub orzecznictwem TSUE/ETPC | Informacyjny |
| ⛔ ŹRÓDŁO NIEPOTWIERDZONE | Sygnatura nieznaleziona w portalach Tier 1–2; zakaz powołania | Krytyczny |
| 🏛️ ZASADA PRAWNA | Uchwała SN z mocą zasady prawnej (art. 87 § 1 uSN) — Kat. 6A | Priorytetowy |

### Dziedzinowe progi alertu STARE

Sztywny próg 5 lat nie jest miarodajny dla wszystkich dziedzin. Stosuj progi dziedzinowe:

| Dziedzina | Próg alertu STARE | Uzasadnienie |
|---|---|---|
| Prawo pracy (KP) | 3 lata | Dynamiczne orzecznictwo, częste nowelizacje KP |
| Prawo podatkowe, AML | 2 lata | Bardzo szybkie zmiany przepisów |
| Prawo cywilne (KC, KPC) ogólne | 7 lat | Stabilna linia, wolniejsze zmiany |
| Prawo rodzinne | 7 lat | Stabilna linia |
| Prawo karne (KK, KPK) | 5 lat | Umiarkowane tempo zmian |
| Prawo administracyjne (KPA, PPSA) | 4 lata | Aktywne orzecznictwo NSA |
| Prawo konstytucyjne | 10 lat | Zasady fundamentalne rzadko się zmieniają |
| Prawo gospodarcze, spółki | 4 lata | Zmiany KSH, upadłościowe |
| Prawo UE, TSUE | 5 lat | Zależy od materii dyrektywy |
| Prawo budowlane, środowiskowe | 4 lata | Aktywne zmiany przepisów |

Jeśli dziedzina nie pasuje do tabeli → stosuj domyślny próg 5 lat.
Alert ⚠️ STARE nie wyklucza orzeczenia — informuje o potrzebie sprawdzenia aktualności.

### Kategorie orzeczeń

| Kat. | Etykieta | Opis |
|---|---|---|
| 1 | Najnowsze | Orzeczenia w granicach progu dziedzinowego |
| 2 | Starsze | Orzeczenia przekraczające próg, ale poniżej 2× progu |
| 3A | Linia dominująca | Jednolita linia większościowa |
| 3B | Linia mniejszościowa | ZAWSZE prezentuj — zakaz ukrywania |
| 4 | Wspierające | Potwierdzają linię główną |
| 5 | UE / TSUE / ETPC | Materia objęta dyrektywą lub wyrokiem TSUE/ETPC |
| 6 | Interpretacje | Zwykłe uchwały SN, wytyczne, interpretacje |
| **6A** | **Zasada prawna SN** | **Uchwały z mocą zasady prawnej (art. 87 § 1 uSN) — NAJWYŻSZY PRIORYTET powołania** |
| 7 | Literatura | Komentarze, glosy (pomocniczo) |

ZAKAZ ukrywania Kat. 3B — jeśli istnieje linia mniejszościowa, zawsze prezentuj.
Kat. 6A zawsze powołuj jako pierwsze w piśmie — przed Kat. 1, 3A, 5.

---

## Faza 3 — Weryfikacja aktualności

1. Czy linia jest jednolita?
2. Czy doszło do nowelizacji po datach orzeczeń?
3. Czy SN nie zajął odmiennego stanowiska w uchwale składu 7 / całej Izby / pełnego składu?
4. Czy dostępna jest uchwała Kat. 6A dotycząca tej materii? (sprawdź na sn.pl → Izba=Uchwaly)

---

## Faza 4 — Raport końcowy

```
RAPORT ORZECZEŃ: [TEMAT]
Data: [data] | Tryb: [LAIK / PRAWNIK] | Jurysdykcja: [PL / UE / mieszana]
Znaleziono: [n] | URL zweryfikowanych: [n] | Zasady prawne SN (Kat. 6A): [n]
WSKAŹNIK POKRYCIA PRZESŁANEK:
P1: ██████░░  62%  ← Kat.1: 2 orz.
P2: █████████  90%  ← Kat.6A: 1 uchwała SN
P3: ██░░░░░░  20%  ⚠️ LUKA
```

---

## Dualny tryb narracji

Skill wykrywa poziom automatycznie. Użytkownik może wpisać „tryb prawnik" / „tryb laik" lub kliknąć przełącznik w widgecie.

| Element | Tryb LAIK | Tryb PRAWNIK |
|---------|-----------|--------------|
| Alerty | Prosty język, co zrobić | Precyzyjny, przepis + ryzyko |
| Teza | Jedno zdanie bez żargonu | Pełna kwalifikacja prawna |
| Rekomendacje | Kroki działania | Argumentacja procesowa, kolejność |

---

## Obsługa błędów i fallback

| Sytuacja | Działanie |
|----------|-----------|
| Portal Tier 1–3 niedostępny | Przejdź do następnego w kolejności |
| Wszystkie portale Tier 1–3 niedostępne | Wykonaj FALLBACK F-1 |
| Brak wyników | Rozszerz frazę lub użyj SAOS |
| Sprzeczne orzeczenia | Kat. 3A + Kat. 3B — nigdy nie ukrywaj |
| Sygnatura nieweryfikowalna w Tier 1–2 | „Źródło niepotwierdzone w portalu sądowym" — nie powołuj |
| Orzeczenie TSUE/ETPC | Weryfikuj w curia.europa.eu / hudoc — traktuj jako Tier 2 |
| Luka pokrycia < 40% | Wykonaj FALLBACK F-4 |
| Dostęp tylko przez LEX / Legalis | Wykonaj FALLBACK F-3 |
| Jurysdykcja zagraniczna | Sprawdź portal Tier 4; wyraźnie oznacz w raporcie |
| web_search / web_fetch niedostępne | Wykonaj FALLBACK F-1 |

## REGUŁA RENDEROWANIA WIDGETÓW

> Pliki `.jsx` przez `present_files` NIE renderują się w claude.ai — użytkownik widzi tylko link.
> Mechanizm `window.__INJECTED__` działa tylko z bundlerem React — NIE w czacie.
> Jedyna poprawna metoda renderowania widgetu inline: `show_widget` z HTML (vanilla JS).
> NIE używaj: `cp`, `str_replace`, `present_files`, `.jsx`, `window.__INJECTED__`.

---

## Output schema — dane przekazywane downstream

Gdy wynik tego skilla trafia do pisma-procesowe-v3, analizator-umow-v1 lub innych konsumentów:

```
view /mnt/skills/user/shared/ORZECZENIA-OUTPUT-SCHEMA.md
→ Format rekordu ORZ-REKORD (pola OBL + OPT)
→ Instrukcje per consumer (pisma-procesowe-v3 W3.2, analizator-umow-v1, analiza-sadowa-v6)
→ Reguły integralności (brak URL = ⛔, Kat. 6A priorytet, zakaz ukrywania Kat. 3B)
```

Każde orzeczenie przekazywane downstream MUSI mieć: sygnaturę, sąd, datę, URL, znacznik VER,
kategorię, tezę (≤30 słów), aktualność linii. Brak któregokolwiek = rekord przekazywany jako ⛔.

---

## Integracja z kancelaryjnym jądrem shared

Jeżeli wynik tego skilla ma służyć do pisma, strategii procesowej, oceny ryzyka albo decyzji terminowej, wczytaj właściwe moduły shared:

```text
view /mnt/skills/user/shared/SYGNATURY.md           ← ZAWSZE przed cytowaniem sygnatury
view /mnt/skills/user/shared/TRYBY-PROCESOWE.md
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
view /mnt/skills/user/shared/TERM-CALC.md
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md
view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md
view /mnt/skills/user/shared/QUALITY-CHECK.md
view /mnt/skills/user/shared/ORZECZENIA-HIERARCHIA.md
```

Nie dubluj logiki shared w lokalnych plikach. Lokalne moduły mogą tylko doprecyzować analizę dziedzinową.
