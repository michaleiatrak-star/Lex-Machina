---
name: orzeczenia-sadowe-v2
version: 2.5
type: executive-analiza
status: production
compatibility: "web_search, web_fetch, show_widget"
description: >
  Wyszukuje, weryfikuje i cytuje realne orzeczenia sądowe z oficjalnych portali
  (orzeczenia.ms.gov.pl, sn.pl, orzeczenia.nsa.gov.pl, trybunal.gov.pl,
  orzeczenia.uzp.gov.pl, saos.org.pl) oraz sieci lokalnej SA/SO/SR i WSA (CBOSA).
  Stosuj ZAWSZE gdy pyta o orzecznictwo, wyroki, linię orzeczniczą, precedensy
  — nawet bez tych słów wprost. Dobiera orzeczenia najbliższe oczekiwanemu
  rozstrzygnięciu; przy licznej linii przeciwnej — obowiązkowy BILANS. Nigdy
  nie cytuj z pamięci — zawsze weryfikacja online przed sygnaturą. NIE stosuj
  gdy pytanie dotyczy tylko przepisów bez orzeczeń.
  v2.5: Faza 1-K — KIO/zamówienia publiczne przez orzeczenia.uzp.gov.pl
  (zweryfikowane fetchem; koryguje nieaktualny adres kio.gov.pl w DR-07).
  v2.4: scalenie Fazy 1-T (SAOS/CBOSA) i Zasady 2A (gradient TREŚĆ, NSA
  I FZ 104/26).
---

# Wyszukiwanie Orzeczeń Sądowych v2.5

Narzędzie procesowe dla pełnomocników, sędziów i stron działających pro se.
Łączy interaktywny widget HTML (tryb laik / prawnik) z weryfikowanym
wyszukiwaniem orzeczeń, wskaźnikiem pokrycia przesłanek i systemem alertów.

## Sekwencja działania (zawsze w tej kolejności)

1. **Wyświetl widget interaktywny** — patrz: sekcja Widget poniżej
2. **Emituj profil ryzyka** — alerty wstępne przed wyszukiwaniem (Faza 0-A)
3. **Ustal przesłanki i zakres** — przepis, znamiona, ciężar dowodu (Faza 0-B)
4. **Ustal oczekiwany kierunek rozstrzygnięcia** — dla dopasowania tezy (Faza 0-C)
5. **Wyszukaj orzeczenia** — portale priorytetowe i sieć lokalna, 5 kroków (Faza 1, 1-L);
   gdy cel to dopasowanie DOSŁOWNEJ tezy/uzasadnienia — najpierw pełnotekstowo (Faza 1-T)
6. **Wyszukaj kierunek przeciwny** — test równoważny pod kątem linii przeciwnej (Faza 1-D)
7. **Skategoryzuj z alertami** — taksonomia 8 kategorii + BILANS (Faza 2)
8. **Zweryfikuj aktualność linii** — jednolitość, zmiany prawa (Faza 3)
9. **Wygeneruj raport końcowy** — wskaźnik pokrycia, BILANS, rekomendacje (Faza 4)
10. **Wyświetl widget ponownie** — z kompletnymi danymi z Faz 1–4

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

⛔ MOD-WIDGET-IO (OBOWIĄZKOWE — wykonaj PRZED każdym show_widget):
```
view /mnt/skills/user/shared/MOD-WIDGET-IO.md
→ wbuduj pasek IO w nagłówek widgetu (powyżej zakładek)
→ IO_SKILL_ID='orzeczenia-sadowe-v2', IO_CASE_ID=sygnatura_sprawy
→ matryca: Export JSON ✅ MD ✅ | Import JSON —
→ w obu wywołaniach (przed i po wyszukiwaniu): pasek IO obecny
```

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

**Zasada 2A — Cztery elementy potwierdzają ISTNIENIE, nie TREŚĆ (dodano 2026-07-05b,
po NSA I FZ 104/26).** Kompletne 4 elementy (Zasada 2) wystarczają, gdy orzeczenie
jest tylko wzmiankowane. Gdy orzeczenie ma POPRZEĆ tezę użytkownika/pisma (włącznie
z "gołym" powołaniem bez cudzysłowu, np. "por. też…") — wymagany dodatkowo poziom
TREŚĆ z `shared/WERYFIKACJA-SLAD.md` (GRAD-1..4): sprawdź, czy orzeczenie FAKTYCZNIE
dotyczy powoływanej instytucji/kwestii, nie tylko tej samej gałęzi prawa. Cztery
elementy + niedopasowany przedmiot = wynik nadal niecytowalny na poparcie tezy.
Ten sam mechanizm łapie również cytaty z KROK 1-T.1/1-T.2 (SAOS/CBOSA
pełnotekstowe) — one dają KANDYDATÓW, gradient TREŚĆ jest krokiem PO nich,
nie zamiast (patrz 1-T.3).

**Zasada 3 — Limit cytatu: maksymalnie 30 słów.**
Dziedzinowy override globalnego limitu 15 słów z PRAWO-HARDGATE — uzasadniony koniecznością
dokładnego oddania tezy prawnej. Dotyczy WYŁĄCZNIE cytatów z treści orzeczeń sądowych.
Dla przepisów ustawowych obowiązuje globalny limit 15 słów z PRAWO-HARDGATE.

**Zasada 4 — Link wyłącznie do oryginału.**
Zakaz linkowania do LexLege, Prawo.pl, SIP itp. jako głównego źródła.

**Zasada 5 — Jedno wiarygodne oficjalne źródło wystarczy.**
Orzeczenie jest uznane za zweryfikowane gdy potwierdzone w co najmniej JEDNYM
z portali: sn.pl, orzeczenia.ms.gov.pl (wraz z całą siecią lokalną SA/SO/SR —
patrz Zasada 5A), orzeczenia.nsa.gov.pl (CBOSA — obejmuje NSA oraz wszystkie
16 WSA), trybunal.gov.pl, curia.europa.eu (TSUE), hudoc.echr.coe.int (ETPC),
orzeczenia.uzp.gov.pl (KIO i skargi SO/SA/SN — zamówienia publiczne, Faza 1-K).
saos.org.pl pełni rolę wsparcia — nie jest samodzielnym źródłem weryfikacji.
Nie wymagaj potwierdzenia w wielu portalach jednocześnie.

**Zasada 5A — Sieć lokalna portali sądów powszechnych (SA/SO/SR).**
`orzeczenia.ms.gov.pl` jest punktem centralnym sieci złożonej z osobnych
portali każdego sądu apelacyjnego, okręgowego i rejonowego (np.
`orzeczenia.warszawa.so.gov.pl`, `orzeczenia.krakow-sr.sr.gov.pl`). Wszystkie
mają status Tier 1 — potwierdzenie w portalu lokalnym danego sądu jest
równoważne potwierdzeniu w portalu centralnym. Szczegółowy wzorzec URL,
lista portali głównych sądów apelacyjnych/okręgowych i procedura użycia:
patrz `references/PORTALE-LOKALNE.md` oraz Faza 1-L.
⚠️ Publikacja w sieci SA/SO/SR NIE jest wyczerpująca — sądy publikują tylko
orzeczenia z uzasadnieniem wybrane przez zespół sędziów; brak orzeczenia
w portalu ≠ jego nieistnienie. Nie formułuj wniosku o braku linii orzeczniczej
wyłącznie na tej podstawie — patrz FALLBACK F-4 i Faza 3.

**Zasada 6 — Status „Źródło niepotwierdzone w portalu sądowym".**
Gdy orzeczenie pojawia się w wynikach wyszukiwania, ale nie można uzyskać
bezpośredniego URL z oficjalnego portalu sądowego:
  → Oznacz statusem: „Źródło niepotwierdzone w portalu sądowym"
  → NIE używaj określenia „niezweryfikowane"
  → NIE powołuj w piśmie procesowym bez potwierdzenia URL
  → Poinformuj użytkownika że weryfikacja bezpośrednia nie była możliwa

**Zasada 7 — Hierarchia portali (TSUE i ETPC jako pełnoprawne źródła):**
```
Tier 1 (krajowe PL): sn.pl · orzeczenia.ms.gov.pl + sieć lokalna SA/SO/SR (Zasada 5A)
                      · orzeczenia.nsa.gov.pl = CBOSA (NSA + wszystkie 16 WSA)
                      · trybunal.gov.pl
                      · orzeczenia.uzp.gov.pl = KIO + SO/SA/SN ws. PZP (Faza 1-K) —
                        referencyjne, nie źródło prawa (art. 87 Konstytucji), ale
                        Tier 1 dla praktyki DR-07
Tier 2 (UE/EU):      curia.europa.eu · hudoc.echr.coe.int
Tier 3 (backup):     saos.org.pl (wyłącznie pomocniczo)
Tier 4 (zagraniczne): patrz sekcja „Jurysdykcje zagraniczne"
```
Orzeczenia TSUE i ETPC mają status równoważny z Tier 1 dla materii objętej prawem UE
lub Konwencją. Kategoria 5 (UE/TSUE) obejmuje teraz również orzeczenia ETPC.
CBOSA jest bazą jednolitą — nie ma odrębnych portali per WSA; wystarczy jedno
zapytanie w orzeczenia.nsa.gov.pl obejmujące całość orzecznictwa administracyjnego.

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

**Zasada 9 — Dopasowanie tezy do oczekiwanego rozstrzygnięcia.**
Wyszukiwanie ma na celu znalezienie orzeczeń, których teza i sentencja są
maksymalnie zbieżne z oczekiwanym rozstrzygnięciem sprawy (patrz Faza 0-C
i Faza 1-D). Bliskość dopasowania oceniaj wg trzech kryteriów łącznie:
(1) zgodność stanu faktycznego z instytucją/przesłankami sprawy,
(2) zgodność kierunku rozstrzygnięcia (nie tylko tematu, ale wyniku sprawy),
(3) aktualność linii (Faza 3). Orzeczenie zgodne tematycznie, ale o odwrotnym
kierunku rozstrzygnięcia, NIE jest „dopasowane" — trafia do Kat. 3B lub 4
wg reguł Fazy 2, nigdy nie jest prezentowane jako wspierające tezę.

**Zasada 10 — ⛔ Zakaz ukrywania liczebnej przewagi linii przeciwnej.**
Gdy w wynikach wyszukiwania (Faza 1 + Faza 1-D) liczba orzeczeń o kierunku
przeciwnym do oczekiwanego jest równa lub większa niż liczba orzeczeń zgodnych,
LUB orzeczenia przeciwne stanowią ≥ 50% wszystkich trafień w Kat. 1–2 —
wygeneruj alert krytyczny 🔴 BILANS NIEKORZYSTNY (patrz Faza 2 i Faza 4) i
umieść go jako PIERWSZY alert w zakładce Profil ryzyka, niezależnie od trybu
LAIK/PRAWNIK. Zakaz przedstawiania sprawy jako „mocnej" bez tego ujawnienia.

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

## Faza 0-C — Profil oczekiwanego rozstrzygnięcia

Ustal przed wyszukiwaniem — warunek konieczny dla Zasady 9 i Fazy 1-D:

```
STRONA / INTERES: [czyje stanowisko wspieramy — powód/pozwany/oskarżony/organ/strona]
OCZEKIWANY KIERUNEK ROZSTRZYGNIĘCIA: [np. „oddalenie powództwa", „uchylenie decyzji",
                                       „uniewinnienie", „stwierdzenie nieważności klauzuli"]
KIERUNEK PRZECIWNY (dla testu równoważnego): [odwrotność powyższego —
                                       używany do wykrycia linii przeciwnej, nie do pomijania jej]
```

Jeśli użytkownik nie wskazał interesu strony (pytanie neutralne, analityczne) →
pomiń profil, wyszukiwanie prowadź bez preferowanego kierunku i pomiń Fazę 1-D.

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
Gdy celem jest odnalezienie KONKRETNEJ tezy (dosłownego sformułowania z uzasadnienia),
a nie tylko orzeczeń „w temacie" — nie zaczynaj od web_search (przeszukuje zaindeksowane
strony, nie treść uzasadnień) — zacznij od Fazy 1-T (SAOS API + CBOSA pełnotekstowo).

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

## Faza 1-T — Wyszukiwanie pełnotekstowe po treści tezy (SAOS API + CBOSA)

Uzupełnienie Fazy 1 — stosuj PRZED klasycznym wyszukiwaniem frazowym, gdy celem jest
„znajdź tezę" (dosłowne sformułowanie prawne w uzasadnieniu/sentencji), nie tylko
„znajdź orzeczenie w danym temacie". `web_search` nie przeszukuje treści uzasadnień —
trafia wyłącznie tam, gdzie fraza już została zacytowana na zaindeksowanej stronie
(np. w artykule prawniczym). SAOS i CBOSA indeksują pełny tekst orzeczeń bezpośrednio
i pozwalają przeszukać go wprost.

### 1-T.1 — SAOS REST API (zapytanie bezpośrednie do API, nie przez wyszukiwarkę web)

Punkt wejścia: `https://www.saos.org.pl/api/search/judgments`

Kluczowe parametry (dowolna kombinacja, doklejane jako query string):
```
all=FRAZA                → pełnotekstowe przeszukanie treści/tezy/uzasadnienia.
                            Obsługuje język zapytań: "fraza w cudzysłowie" (dokładna
                            kolejność słów), -słowo (wyklucza), A OR B.
judgmentDateFrom / judgmentDateTo   → filtr dat, format yyyy-MM-dd
courtType                → COMMON | SUPREME | ADMINISTRATIVE
ccCourtType               → APPEAL | REGIONAL | DISTRICT (tylko sądy powszechne)
ccCourtName                → nazwa konkretnego sądu
judgmentTypes              → SENTENCE | RESOLUTION | DECISION | REGULATION | REASONS
keywords                  → lista haseł tematycznych SAOS
sortingField / sortingDirection, pageSize / pageNumber → paginacja/sortowanie
```

Procedura:
```
1. web_fetch: https://www.saos.org.pl/api/search/judgments?all=FRAZA+TEZY&courtType=...
   &judgmentDateFrom=...&judgmentDateTo=...&pageSize=10
2. Z odpowiedzi JSON odczytaj per trafienie: caseNumber, judgmentDate,
   division.court.name (lub chambers dla SN), fragment textContent zawierający frazę, href.
3. To jest ETAP WYSZUKANIA KANDYDATÓW, nie weryfikacji — saos.org.pl nadal pełni
   wyłącznie rolę wsparcia (Zasada 5) → przejdź do 1-T.3 przed powołaniem sygnatury.
```
⚠️ SAOS to projekt akademicki (ICM UW) — pokrycie nie jest wyczerpujące, a baza bywa
opóźniona względem najnowszych orzeczeń. Traktuj trafienie jako trop, nie jako
potwierdzenie.

### 1-T.2 — CBOSA (NSA/WSA) — wyszukiwanie pełnotekstowe „Treść wyroku"

CBOSA (orzeczenia.nsa.gov.pl) NIE ma publicznego REST API — dostęp wyłącznie przez
formularz wyszukiwania na stronie. Formularz ma odrębne pole „Treść wyroku"/
„Treść uzasadnienia", które przeszukuje pełny tekst — w odróżnieniu od pola
„Powołane przepisy", które przeszukuje wyłącznie słownik kontrolowany, nie treść.

Procedura:
```
1. web_fetch formularza wyszukiwania orzeczenia.nsa.gov.pl z polem „Treść wyroku"
   wypełnionym FRAZĄ TEZY, najlepiej w cudzysłowie (CBOSA dopasowuje dosłownie,
   nie semantycznie).
2. Opcjonalnie zawęź: konkretny sąd (NSA / dany WSA), zakres dat, hasło tematyczne.
3. Brak wyniku ≠ brak orzecznictwa — CBOSA szuka dopasowań dosłownych. Przed uznaniem
   braku wyniku przeformułuj frazę na prawniczy synonim (np. „odmowa wydania
   pozwolenia" → „organ nie wydał zgody na realizację inwestycji").
4. ⚠️ CBOSA ogranicza automatyzację (captcha po serii zapytań) — ogranicz liczbę
   zapytań do niezbędnego minimum, nie iteruj bez potrzeby.
5. Każde trafienie → 1-T.3 przed powołaniem.
```

### 1-T.3 — Krok weryfikacji (wspólny dla 1-T.1 i 1-T.2)

Wyszukiwanie pełnotekstowe wskazuje KANDYDATÓW — nie zwalnia z Zasady 1 (zakaz
cytowania bez weryfikacji) ani z procedury V-SYG.
```
Dla każdego kandydata:
→ Wykonaj V-SYG (shared/SYGNATURY.md) na sygnaturze uzyskanej z SAOS/CBOSA.
→ CBOSA-owe trafienia są już z Tier 1 (orzeczenia.nsa.gov.pl) — potwierdź bezpośredni
  URL wyroku i przejdź do cytowania.
→ SAOS-owe trafienia dla sądów powszechnych/SN → potwierdź w orzeczenia.ms.gov.pl
  (lub portalu lokalnym, Zasada 5A) / sn.pl, chyba że rekord SAOS linkuje wprost
  do oryginalnego portalu (pole href / source.judgmentUrl) — wtedy wystarczy ten link.
→ Dopiero po potwierdzeniu → cytuj z linkiem do ORYGINAŁU (Zasada 4), nigdy do
  samego saos.org.pl jako źródła głównego.
```

### 1-T.4 — Rozszerzenie na inne bazy z wyszukiwaniem pełnotekstowym

Logikę „najpierw pełnotekstowe zapytanie po treści tezy → dopiero potem weryfikacja
sygnatury" stosuj analogicznie wszędzie tam, gdzie portal na to pozwala:
- `sn.pl` — wyszukiwarka SN ma pole treści orzeczenia/uzasadnienia,
- portale lokalne SA/SO/SR (`references/PORTALE-LOKALNE.md`) — część ma wyszukiwanie
  pełnotekstowe, część wyłącznie po sygnaturze/dacie — sprawdź formularz danego
  portalu przed założeniem, że pole istnieje,
- `trybunal.gov.pl` — wyszukiwarka TK obejmuje treść uzasadnień.
Brak pola pełnotekstowego w danym portalu → wróć do strategii Fazy 1 (fraza → przepis
→ instytucja → SAOS jako uzupełnienie).

---

## Faza 1-K — Orzecznictwo KIO / zamówienia publiczne (PZP)

Stosuj gdy sprawa dotyczy zamówień publicznych: odwołanie do KIO, skarga na
orzeczenie KIO do sądu, rażąco niska cena, wykluczenie/odrzucenie oferty,
warunki udziału, SWZ — zwłaszcza gdy współpracujesz z `dr-07-zamowienia-
publiczne-fundusze-ue`.

⚠️ **Korekta adresu (zweryfikowane 2026-07-05c):** `kio.gov.pl` jako
"wyszukiwarka wyroków" jest NIEAKTUALNE — domena przekierowuje na strony
informacyjne `uzp.gov.pl/kio` (o KIO, skład, kontakt), NIE na wyszukiwarkę
orzeczeń. Właściwa, działająca wyszukiwarka orzecznictwa PZP jest pod
odrębną subdomeną: **`orzeczenia.uzp.gov.pl`**. Obejmuje nie tylko KIO, ale
też SO/SA/SN w zakresie skarg na orzeczenia KIO (zakładki „Wszystkie/KIO/
SO/SA/SN" w wyszukiwarce) — szerszy zakres niż sama Izba.

⚠️ **Status prawny:** orzeczenia KIO NIE są źródłem prawa (art. 87
Konstytucji RP) — są materiałem referencyjnym praktyki PZP. Traktuj jak
Tier 1 dla spraw DR-07 mimo braku mocy precedensowej formalnej — patrz
Zasada 7.

### 1-K.1 — Wyszukiwanie

Punkt wejścia: `https://orzeczenia.uzp.gov.pl/Home/Search`

Parametry zweryfikowane bezpośrednim fetchem (2026-07-05c) — używaj TYLKO tych,
inne pola widoczne w formularzu (Rodzaj dokumentu, Wynik postępowania, Izba,
Zamawiający, Miejscowość itd.) wymagają ustalenia dokładnej nazwy parametru
przez inspekcję formularza PRZED użyciem — nie zgaduj nazw po wzorze innych API:
```
Phrase=FRAZA     → hasło wyszukiwania (URL-encode spacji i polskich znaków)
Fle=0|1          → 0 = szukaj dokładnej formy, 1 = "odmiana słów" (fleksja)
SCnt=0|1         → 0 = szukaj w metadanych, 1 = "szukaj również w treści" (pełny tekst)
Pg=N             → numer strony wyników
```
Przykład zweryfikowany: `.../Home/Search?Phrase=art.%207%20ust.%201&Fle=0&SCnt=0`
(filtr po konkretnym artykule PZP — link ten sam wzorzec, który portal
generuje sam dla „Kluczowe przepisy ustawy Pzp" na stronie wyniku).

### 1-K.2 — Pobranie pojedynczego orzeczenia

Z listy wyników każdy wpis linkuje do strony szczegółów
(`/Home/Details/{internal_id}?Pg=...&Phrase=...&ind=...&total=...` lub
`/Home/Move?...` przy nawigacji strzałkami między wynikami tego zapytania).
Strona szczegółów zawiera KOMPLET metadanych bezpośrednio w HTML (nie trzeba
osobnego zapytania):
```
Organ wydający | Rodzaj dokumentu | Data wydania rozstrzygnięcia |
Przewodniczący | Zamawiający | Miejscowość | Sygnatura akt / Sposób
rozstrzygnięcia (np. "KIO 827/18 / oddalone") | Tryb postępowania |
Rodzaj zamówienia | Kluczowe przepisy ustawy Pzp (linkowane) |
Indeks tematyczny (linkowany)
```
Pełny tekst: link „Treść dokumentu" → `/Home/ContentHtml/{id}?Kind=KIO&phrase=...`
(fragment HTML) lub „Pobierz treść PDF" → `/Home/PdfContent/{id}?Kind=KIO`.

> ℹ️ Zewnętrzny konektor `kio-orzeczenia-mcp` (POC, oceniony osobno) opisuje
> nieco inny wzorzec URL (`/Home/HtmlContent/{id}`) — przy fetchu 2026-07-05c
> rzeczywisty portal zwrócił `/Home/Details/{id}` + `/Home/ContentHtml/{id}`.
> Rozbieżność potwierdza to, co ten konektor sam przyznał w CHANGELOG
> (4/4 nieudane testy live, selektory best-effort) — nie kopiuj jego
> endpointów bez własnej weryfikacji fetchem, tak jak wykonano tutaj.

### 1-K.3 — Cytowanie (Zasada 2 + rozszerzenie domenowe)

Cztery elementy Zasady 2 (sygnatura/data/sąd/URL) + dla KIO dodaj obowiązkowo
z metadanych strony szczegółów: **Sposób rozstrzygnięcia** (oddalone/
uwzględnione/odrzucone/umorzone) — pole to jest już otagowane przez portal,
więc stanowi mocniejszy, tańszy pierwszy test GUARD INSTYTUCJA (Zasada 2A/
GRAD-3b z `shared/WERYFIKACJA-SLAD.md`) niż czytanie całego uzasadnienia:
jeśli teza pisma twierdzi „KIO uwzględniło odwołanie w zakresie X", a pole
Sposób rozstrzygnięcia = „oddalone" — to sprzeczność wykrywalna od razu,
bez analizy treści.

Format:
```
Wyrok/postanowienie KIO z [data], sygn. [KIO NNN/RR] ([sposób rozstrzygnięcia])
— [URL Home/Details/{id}]
```

### 1-K.4 — Powiązanie z przepisem (ISAP)

Strona szczegółów linkuje "Kluczowe przepisy ustawy Pzp" — to potwierdza
TYLKO, że KIO powołało dany artykuł, NIE zwalnia z odrębnej weryfikacji
brzmienia przepisu w ISAP (ustawa z 11.09.2019 r. — Prawo zamówień
publicznych, t.j. — sprawdź aktualny numer Dz.U. przed cytowaniem, zmienia
się często). Dwa źródła, dwa kroki — nigdy nie wyprowadzaj brzmienia
przepisu z tego, jak cytuje go orzeczenie.

### 1-K.5 — Zastrzeżenia praktyczne

- Brak oficjalnego udokumentowanego API i publikowanego limitu zapytań —
  traktuj jak każdy portal publiczny: rozsądna liczba zapytań w ramach
  jednej sprawy, bez zbędnego powtarzania tego samego zapytania.
- Filtry poza Phrase/Fle/SCnt/Pg (Rodzaj dokumentu, Wynik postępowania,
  Izba, Zamawiający, Skarżony organ, Miejscowość, Publikator, Tryb
  postępowania) są dostępne w formularzu, ale ich dokładne nazwy parametrów
  URL NIE zostały zweryfikowane w tej sesji — jeśli potrzebne, sprawdź
  fetchem strony formularza przed założeniem nazwy.
- Zakładki „SO/SA/SN" na tym portalu to skargi NA orzeczenia KIO — osobna
  droga procesowa (art. 579–589 PZP), nie duplikat KIO.

---

## Faza 1-L — Sieć lokalna portali SA/SO/SR i CBOSA (rozszerzenie bazy)

Uzupełnienie Fazy 1 — stosuj gdy:
- wyszukiwanie centralne (orzeczenia.ms.gov.pl) nie zwróciło wyników lub zwróciło
  ich mało (< 3) mimo że sprawa dotyczy powszechnej instytucji prawnej,
- użytkownik lub przeciwnik procesowy powołał konkretną sygnaturę konkretnego SR/SO/SA
  i trzeba ją zweryfikować bezpośrednio u źródła,
- sprawa jest lokalnie osadzona (właściwość miejscowa znanego sądu) i celowe jest
  sprawdzenie linii orzeczniczej WŁAŚNIE tego sądu/okręgu (praktyka lokalna bywa
  odmienna od linii krajowej — istotne dla prognozy rozstrzygnięcia w danej sprawie).

Procedura:
```
1. Ustal właściwy sąd (nazwa + siedziba) z akt sprawy lub pytania użytkownika.
2. view /mnt/skills/user/orzeczenia-sadowe-v2/references/PORTALE-LOKALNE.md
   → odczytaj wzorzec URL i sprawdź, czy sąd jest na liście głównych portali.
3. Jeśli sąd nieznany z listy → web_search "orzeczenia [pełna nazwa sądu]"
   → zweryfikuj adres portalu przez web_fetch (musi być subdomena *.gov.pl).
4. web_fetch na wyszukiwarkę portalu lokalnego z frazami z Fazy 0-B.
5. Każde trafienie traktuj jak Tier 1 (Zasada 5A) — te same wymogi 4 elementów
   (Zasada 2) i ten sam limit cytatu (Zasada 3).
```

Dla spraw administracyjnych: orzeczenia.nsa.gov.pl (CBOSA) już obejmuje wszystkie
16 WSA jedną bazą — NIE szukaj osobno portali poszczególnych WSA (nie istnieją
jako odrębne bazy, wyłącznie jako oddziały w ramach CBOSA po symbolu sądu).

⚠️ Publikacja w sieci lokalnej nie jest wyczerpująca (patrz Zasada 5A) — brak
wyniku w portalu lokalnym nie jest dowodem braku orzecznictwa danego sądu;
odnotuj to zastrzeżenie w Raporcie, jeśli wyszukiwanie lokalne było kluczowe
dla wniosku.

---

## Faza 1-D — Dopasowanie tezy i test kierunku przeciwnego

Cel: znaleźć orzeczenia maksymalnie zbieżne z oczekiwanym rozstrzygnięciem
(Faza 0-C, Zasada 9) I jednocześnie rzetelnie sprawdzić, czy istnieje liczna
linia przeciwna (Zasada 10) — bez tego dwuetapowego podejścia wynik jest
stronniczy (confirmation bias) i niewiarygodny procesowo.

```
KROK 1 — Wyszukiwanie zgodne z oczekiwanym kierunkiem:
  Użyj fraz z Faza 0-B + słów kluczowych zgodnych z OCZEKIWANYM KIERUNKIEM
  (np. dla „oddalenie powództwa": „bezzasadność roszczenia", „brak przesłanek").

KROK 2 — Wyszukiwanie kierunku przeciwnego (OBOWIĄZKOWE, nie pomijaj):
  Te same frazy bazowe + słowa kluczowe zgodne z KIERUNKIEM PRZECIWNYM
  (np. „uwzględnienie powództwa", „zasadność roszczenia").
  Wykonaj minimum 2 zapytania w tym kroku, nawet jeśli Krok 1 dał dużo trafień.

KROK 3 — Ocena dopasowania (per orzeczenie, wg Zasady 9):
  Klasyfikuj każde trafienie jako: ZGODNE (kierunek = oczekiwany) /
  PRZECIWNE (kierunek = przeciwny) / NEUTRALNE (dotyczy instytucji,
  ale rozstrzygnięcie nie przesądza kierunku, np. z innych przyczyn procesowych).

KROK 4 — Policz i przekaż do Fazy 2/4:
  N_zgodne, N_przeciwne, N_neutralne → wylicz BILANS (patrz Faza 2, Faza 4).
```

Jeśli profil oczekiwanego rozstrzygnięcia nie został ustalony w Fazie 0-C
(pytanie neutralne) → pomiń tę fazę, prowadź wyszukiwanie bez podziału na
kierunki, kategoryzuj wyłącznie wg Fazy 2 (Kat. 3A/3B linia większościowa/mniejszościowa).

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
| 🔴 BILANS NIEKORZYSTNY | N_przeciwne ≥ N_zgodne LUB przeciwne ≥ 50% trafień Kat. 1–2 (Faza 1-D, Zasada 10) | Krytyczny |

### BILANS LINII ORZECZNICZEJ — obliczenie

Wykonuj zawsze gdy Faza 1-D była przeprowadzona (profil oczekiwanego rozstrzygnięcia ustalony):

```
N_zgodne     = liczba orzeczeń Kat. 1–2 o kierunku zgodnym z oczekiwanym
N_przeciwne  = liczba orzeczeń Kat. 1–2 o kierunku przeciwnym
N_neutralne  = liczba orzeczeń niekierunkowych (dotyczą instytucji, nie przesądzają)

PROPORCJA = N_przeciwne : N_zgodne
PROGI:
  N_przeciwne ≥ N_zgodne              → 🔴 BILANS NIEKORZYSTNY (krytyczny)
  N_przeciwne < N_zgodne, ale ≥ 30%   → 🟡 BILANS MIESZANY (informacyjny, odnotuj)
  N_przeciwne < 30% wszystkich        → ✅ BILANS KORZYSTNY (bez alertu)
```

Gdy 🔴 BILANS NIEKORZYSTNY → alert musi pojawić się w Profilu ryzyka (Faza 0-A,
jako pierwszy) ORAZ w Raporcie końcowym (Faza 4) z wymienieniem sygnatur linii
przeciwnej — zakaz pomijania nawet gdy linia zgodna zawiera Kat. 6A (uchwała
wiąże kierunek prawny, ale nie usuwa obowiązku ujawnienia rozbieżności w praktyce
sądów niższych instancji, jeśli taka istnieje).

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

BILANS LINII ORZECZNICZEJ (jeśli Faza 1-D wykonana):
Zgodne z oczekiwanym rozstrzygnięciem: [N_zgodne]
Przeciwne:                             [N_przeciwne]
Neutralne:                             [N_neutralne]
Status: [🔴 BILANS NIEKORZYSTNY / 🟡 BILANS MIESZANY / ✅ BILANS KORZYSTNY]
[Jeśli 🔴 lub 🟡: wypisz sygnatury linii przeciwnej z jednozdaniową tezą każdej —
 zakaz pomijania nawet jednej pozycji.]
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
| Brak wyników | Rozszerz frazę lub użyj SAOS, rozważ Fazę 1-L (sieć lokalna) |
| Portal lokalny (SA/SO/SR) sądu nieznany lub niedostępny | web_search nazwy sądu → zweryfikuj URL przez web_fetch; brak potwierdzenia → traktuj jak F-2 |
| Sprzeczne orzeczenia | Kat. 3A + Kat. 3B — nigdy nie ukrywaj |
| Liczna linia przeciwna do oczekiwanego rozstrzygnięcia | Wykonaj Fazę 1-D → oblicz BILANS (Faza 2) → alert 🔴/🟡 w Raporcie (Zasada 10) |
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

---

## CHANGELOG

**2.5 (2026-07-05d):**
- **Nowa Faza 1-K — orzecznictwo KIO / zamówienia publiczne.** Luka wykryta
  podczas oceny zewnętrznego repo `kio-orzeczenia-mcp`: portal `orzeczenia.
  uzp.gov.pl` (KIO + skargi SO/SA/SN) nie występował dotąd nigdzie w
  hierarchii portali tego skilla. Procedura wyszukiwania i cytowania
  zweryfikowana bezpośrednim fetchem (nie skopiowana z żadnego repo):
  `Home/Search?Phrase=...&Fle=...&SCnt=...`, strona szczegółów z pełnymi
  metadanymi (w tym otagowane pole "Sposób rozstrzygnięcia" — tańszy test
  GUARD INSTYTUCJA niż czytanie uzasadnienia), `Home/ContentHtml/{id}` /
  `Home/PdfContent/{id}` dla pełnej treści.
- **Korekta:** `kio.gov.pl` (używane w `dr-07/modules/mod-PZP-...-KIO.md`
  jako "wyszukiwarka wyroków") przekierowuje na strony informacyjne
  `uzp.gov.pl/kio`, NIE hostuje wyszukiwarki — poprawiono w obu miejscach.
- Zasada 5 i Zasada 7 (hierarchia Tier) rozszerzone o KIO/orzeczenia.uzp.gov.pl.
- Uczciwie odnotowano: rozbieżność endpointów względem `kio-orzeczenia-mcp`
  (ten POC deklaruje `/Home/HtmlContent/{id}`, żywy portal zwrócił
  `/Home/Details/{id}` + `/Home/ContentHtml/{id}`) — spójne z jego własnym
  zgłoszeniem 4/4 nieudanych testów live w CHANGELOG tamtego repo.

**2.4 (2026-07-05c) — SCALENIE dwóch rozgałęzionych dostaw 2.3:**
- Wykryto podczas przesłania pliku przez użytkownika: żywy system miał
  wersję 2.2 (bez Fazy 1-T i bez Zasady 2A) — obie poprzednie dostawy 2.3
  (ta niżej: Faza 1-T/SAOS-CBOSA; oraz równoległa: Zasada 2A/NSA I FZ 104/26)
  powstały NIEZALEŻNIE na tej samej bazie 2.2 i nigdy nie zostały scalone
  ani wdrożone — stąd kolizja numeru wersji 2.3 użytego dwukrotnie dla
  różnej treści.
- Ten plik = Faza 1-T (poniżej) + wstawiona Zasada 2A (w sekcji "Zasady
  fundamentalne", po Zasadzie 2) + zdanie łączące oba mechanizmy (gradient
  TREŚĆ stosuje się też do kandydatów z SAOS/CBOSA, nie tylko z web_search).
- Opis (`description`) przebudowany pod limit MOD-DESCRIPTION (864 znaki —
  status OK), skróceniu uległy szczegóły v2.1 (już nieaktualne priorytetowo).
- Od tej wersji: **każda przyszła zmiana wchodzi na TEN plik**, nie na
  równoległą kopię — zapobiega to powtórce tej kolizji.

**2.3 (2026-07-05):**
- **Naprawa CRIT (MOD-DESCRIPTION):** pierwsza wersja opisu v2.3 miała 1256 znaków
  (limit 1024) — skrócono do 888 znaków, zachowując triggery, wersję i kluczowe
  ograniczenia; szczegóły techniczne (parametry SAOS API, procedura CBOSA) przeniesione
  wyłącznie do treści skilla (Faza 1-T), zgodnie z procedurą naprawy MOD-DESCRIPTION.
- Dodano Fazę 1-T (wyszukiwanie pełnotekstowe po treści tezy) — na wyraźny wniosek
  użytkownika o zastąpienie pośredniego wyszukiwania (przez agregatory/web_search)
  bezpośrednim zapytaniem do źródeł indeksujących pełny tekst:
  - **SAOS REST API bezpośrednio** (`https://www.saos.org.pl/api/search/judgments`,
    parametr `all` do przeszukania treści/tezy/uzasadnienia + filtry
    `judgmentDateFrom/To`, `courtType`, `ccCourtType`, `ccCourtName`, `judgmentTypes`,
    `keywords`) — zweryfikowane wg oficjalnej dokumentacji API (CeON/saos,
    saos.org.pl/help).
  - **CBOSA (orzeczenia.nsa.gov.pl)** — udokumentowano, że NIE ma publicznego API
    (wniosek KIDP o jego udostępnienie pozostał bez odpowiedzi) i że dostęp do
    pola pełnotekstowego „Treść wyroku" jest wyłącznie przez formularz WWW
    (w odróżnieniu od pola „Powołane przepisy", które przeszukuje tylko słownik
    kontrolowany) — z zastrzeżeniem o blokadzie automatyzacji (captcha).
  - Procedura dwuetapowa dla obu źródeł: [1] zapytanie pełnotekstowe → kandydaci,
    [2] V-SYG + potwierdzenie w portalu Tier 1 dopiero przed cytowaniem (1-T.3) —
    SAOS/CBOSA jako etap wyszukania nie zwalnia z Zasady 1/5.
  - Zasada rozszerzona (1-T.4) na inne portale z polem pełnotekstowym (sn.pl,
    trybunal.gov.pl, część portali lokalnych SA/SO/SR).
  - Zaktualizowano „Strategię" w Fazie 1 i sekwencję działania (krok 5), by
    kierować do Fazy 1-T, gdy celem jest dopasowanie dosłownej tezy.

**2.2 (2026-07-01):**
- Rozszerzono bazę portali o sieć lokalną sądów apelacyjnych/okręgowych/rejonowych
  (Zasada 5A, Faza 1-L) — nowy plik `references/PORTALE-LOKALNE.md` ze wzorcem URL
  i listą portali głównych sądów.
- Doprecyzowano, że CBOSA (orzeczenia.nsa.gov.pl) obejmuje NSA oraz wszystkie 16 WSA
  jedną bazą (Zasada 7).
- Dodano Fazę 0-C (profil oczekiwanego rozstrzygnięcia) i Fazę 1-D (dopasowanie
  tezy + obowiązkowy test kierunku przeciwnego) — Zasada 9.
- Dodano ilościowy mechanizm BILANS LINII ORZECZNICZEJ z progami i alertem
  krytycznym 🔴 BILANS NIEKORZYSTNY przy przewadze lub równowadze linii
  przeciwnej — Zasada 10, Faza 2, Faza 4.
- Zaktualizowano tabelę obsługi błędów/fallback i sekwencję działania (10 kroków).
- `references/widget.md`: dodano mapowanie alertu BILANS oraz szablon bloku
  „Bilans linii orzeczniczej" w zakładce Raport.

**2.1:** uchwały 7 SN jako Kat. 6A z priorytetem; obsługa jurysdykcji zagranicznych
(Tier 4); fallback przy niedostępności narzędzi sieciowych; dziedzinowe progi
alertu STARE; szablon zakładki Alerty; integracja SYGNATURY.
