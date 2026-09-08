> ⚡ **ZMIANA STRUKTURALNA 2026-08-20 (F-78, priorytet 3):** ten plik był
> 1901 linii. Treść mechanizmów VAT (sekcje 3-7, ~35 podtematów)
> PODZIELONA na 6 plików w podkatalogu
> `vat-podatek-od-towarow-i-uslug/`. TEN plik pozostaje pod
> NIEZMIENIONĄ nazwą jako INDEKSATOR z zachowanymi alertami
> legislacyjnymi (PKWiU 2025, KSeF, weryfikacja faktury w KSeF — treść
> stosowana niezależnie od szukanego tematu, więc POZOSTAJE tutaj, nie
> w podkatalogu) — dziesiątki zewnętrznych odsyłaczy w systemie (w tym
> `mod-VAT-*` — pozostałe moduły rodziny VAT, `ROUTING-MAP.md`,
> `MAPA-AKTOW.md` dr-06) NIE WYMAGAŁY EDYCJI.
> ✅ **ODESŁANIA WEWNĘTRZNE ROZSTRZYGNIĘTE (2026-08-20, na żądanie
> użytkownika):** oryginalny plik zawierał nieformalne etykiety
> podsekcji ("sekcja 4a", "sekcja 4c", "sekcja 4h", "sekcja 4p")
> UŻYWANE W TEKŚCIE, które NIE odpowiadały żadnemu nagłówkowi w TYM
> pliku. Zweryfikowano: wszystkie 4 okazały się odesłaniami do
> MODUŁÓW SIOSTRZANYCH z rodziny VAT (podział 2026-08-12), które
> ZACHOWAŁY numerację "4a/4b/4c/4d" itd. jako WŁASNE, wewnętrzne
> nagłówki — 3 z 4 w pełni rozstrzygnięte i naprawione (`part-01-core-
> intake-stawki.md`, sekcja 3.2): "sekcja 4a" → `mod-VAT-obowiazek-
> podstawa-zwolnienia-nieruchomosci.md` sekcja 4a (obowiązek
> podatkowy); "sekcja 4c" → ten sam plik, sekcja 4c (zwolnienia
> przedmiotowe); "sekcja 4h" → `mod-VAT-sankcje-bony-odliczenia.md`
> sekcja 4h (wyłączenia prawa do odliczenia); "sekcja 4p" (ryczałt
> rolnika) → `mod-VAT-transakcje-fakturowanie.md` sekcja 4o
> (fakturowanie — systematyka, podsekcja VAT RR). ⛔ Jedna CZĘŚĆ
> jednego odesłania pozostała NIEROZWIĄZANA i jawnie oznaczona jako
> MARTWA: "matryca dowodowa w sekcji 6" — żaden plik w całej rodzinie
> VAT nie zawiera takiej sekcji; nie zmyślono wskazania.

---

# mod-VAT-podatek-od-towarow-i-uslug

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** VAT — Dz.U. 2025 poz. 775 t.j. z 21.05.2025 (poprzedni t.j.: Dz.U. 2024 poz. 361)
**Data weryfikacji online:** 2026-08-12 (poprzednia: 2026-06-05)
**⚠️ NOWELIZACJE PO TEKŚCIE JEDNOLITYM — nałóż przed każdym powołaniem:**
Dz.U. 2025 poz. 894, 896 (art. 113 ust. 1: 200 000 → 240 000 zł), 1203,
1811; Dz.U. 2026 poz. 507, 846. Źródło listy: podatki.gov.pl/podatki-
firmowe/vat/podstawa-prawna [Rząd 1], sprawdzone 2026-08-12.
**⛔ OSTRZEŻENIE PO AUDYCIE 2026-08-12:** w module wykryto i usunięto
BŁĄD MERYTORYCZNY — podstawowy termin zwrotu różnicy podatku podawany
był jako 60 dni, podczas gdy art. 87 ust. 2 zd. 1 przewiduje 40 DNI.
Pisma i wyliczenia odsetkowe oparte na wcześniejszej wersji modułu
wymagają przeliczenia.
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

> ⚠️ TEN moduł jest CZĘŚCIĄ RODZINY plików VAT, PODZIELONEJ
> 2026-08-12 (NOTA-4, audyt-systemu-v4/references/CHECKLIST-DEDUP.md — moduł
> źródłowy miał 3652 linie, ~9x próg 400 linii). RODZINA sześciu
> plików: mod-VAT-podatek-od-towarow-i-uslug.md (rdzeń: alerty,
> KSeF, stawki, podstawowe mechanizmy), mod-VAT-miejsce-swiadczenia-
> zwolnienia.md, mod-VAT-obowiazek-podstawa-zwolnienia-nieruchomosci.md,
> mod-VAT-sankcje-bony-odliczenia.md, mod-VAT-transakcje-
> fakturowanie.md, mod-VAT-ewidencja-deklaracje.md.
>
> **⛔ KRYTYCZNE, GLOBALNE ostrzeżenie (dotyczy CAŁEJ rodziny
> plików):** audyt z 2026-08-12 wykrył i naprawił błąd merytoryczny
> — podstawowy termin zwrotu różnicy podatku BYŁ błędnie podawany
> jako 60 dni, PRAWIDŁOWO to **40 DNI** (art. 87 ust. 2 zd. 1) —
> pisma/wyliczenia odsetkowe oparte na wcześniejszej wersji WYMAGAJĄ
> przeliczenia.

## ⚡ ALERT — PKWiU 2025 — ZMIANA KLASYFIKACJI (ważne dla stawek VAT!)

```
PKWiU 2025 weszła w życie 01.01.2026 r. (statystyka, ewidencja, rachunkowość).
DLA CELÓW VAT: PKWiU 2015 stosuje się NADAL do 31.12.2027 r.
→ Stawki VAT obniżone (zał. 3 i 10 ustawy VAT) oparte na PKWiU 2015 do końca 2027.
→ WIS wydane pod PKWiU 2015 zachowują ważność do 31.12.2027.
→ Od 01.01.2028: obowiązkowe kody PKWiU 2025 dla celów VAT.
⚠️ Weryfikuj kody PKWiU w każdej sprawie WIS/stawki VAT:
   web_search: "PKWiU 2015 do 2027 VAT stawki kod [usługa/towar]"
```

## ⚡ ALERT — KSeF OBOWIĄZKOWY OD 2026

```
KSeF (Krajowy System e-Faktur) — HARMONOGRAM WDROŻENIA:
  01.02.2026: obowiązkowy dla firm z obrotem > 200 mln zł w 2025 r.
  01.04.2026: obowiązkowy dla pozostałych podatników VAT (JDG, MŚP)
  01.01.2027: dla najmniejszych firm — ⚠️ UZUPEŁNIONO 2026-07-27
    (FAZA 3E/ZASADA 14): DWA warunki łącznie, nie jeden — sprzedaż
    fakturami ≤ 10 tys. zł/mies. ORAZ pojedyncza faktura ≤ 450 zł
    (poprzednia wersja pomijała drugi warunek). Potwierdzone w 3+
    źródłach 2026 r. (infakt.pl, delkom.pl)

  UWAGA: Odbiór faktur przez KSeF obowiązkowy dla wszystkich od 01.02.2026 r.
  (nawet jeśli dana firma jeszcze nie wystawia w KSeF)

  Certyfikat wystawcy faktury: dostępny od 01.11.2025 (ważny 2 lata)
  Tryb offline (awaryjny): umożliwia wystawienie poza systemem + przesłanie do następnego dnia roboczego

  Podstawa: Ustawa z 5.08.2025 r. o KSeF — weryfikuj w ISAP
  web_search: "KSeF obowiązkowy termin 2026 ustawa Dz.U. 2025 MF aktualna"
```

## ⭐⭐ WERYFIKACJA FAKTURY W KSeF (dodane 2026-08-09, na żądanie
użytkownika)

```
⭐ DWUETAPOWY MECHANIZM WERYFIKACJI (przez kod QR LUB numer KSeF):
  ETAP 1 — PODSTAWOWE dane (bez logowania): po zeskanowaniu kodu QR
    LUB wejściu na stronę weryfikacyjną KSeF z numerem faktury —
    WYŚWIETLANE są dane IDENTYFIKACYJNE (NIP sprzedawcy, data,
    wyróżnik) ORAZ informacja, CZY dokument w ogóle ISTNIEJE w
    systemie
  ETAP 2 — PEŁNA weryfikacja (wymaga dodatkowych danych, zgodnie z
    rozporządzeniem): standardowo — NUMER faktury, NIP nabywcy,
    KWOTA należności — DOPIERO po podaniu TYCH danych i pozytywnej
    weryfikacji MOŻLIWE jest pobranie PEŁNEJ faktury z załącznikami

⭐⭐ DWA TYPY KODÓW QR — NIE MYLIĆ:
  → KOD I ("weryfikacja/OFFLINE"): umieszczany na KAŻDEJ fakturze
    przekazywanej POZA KSeF w trybie ONLINE — zawiera link
    umożliwiający sprawdzenie, CZY dokument istnieje + podstawowe
    dane — TO jest "zwykły", podstawowy kod weryfikacyjny
  → KOD II ("CERTYFIKAT"): potwierdza AUTENTYCZNOŚĆ POCHODZENIA i
    INTEGRALNOŚĆ TREŚCI faktury ORAZ uprawnienia wystawcy —
    WYMAGA aktywnego certyfikatu KSeF (typu 2) po stronie
    sprzedawcy — stosowany PRZY fakturach wystawionych w trybach
    OFFLINE24 (od 1.02.2026), OFFLINE (niedostępność KSeF) i
    AWARYJNYM — TAKIE faktury MAJĄ OBA kody jednocześnie (Kod I +
    Kod II), NIE tylko jeden

⭐⭐⭐ KLUCZOWE ZASTRZEŻENIE ZAKRESU — CAŁY POWYŻSZY MECHANIZM
WERYFIKACJI DOTYCZY GŁÓWNIE FAKTUR B2B (dodane 2026-08-09, na
żądanie użytkownika — "czy faktury imienne też są weryfikowane w
KSeF, czy tylko na firmy"):

⭐⭐ FAKTURY IMIENNE/B2C (wystawiane na rzecz OSÓB FIZYCZNYCH
  NIEPROWADZĄCYCH działalności gospodarczej — czyli KONSUMENTÓW) —
  NIE SĄ OBJĘTE OBOWIĄZKIEM KSeF — ani PRZED 1.02.2026, ani PO tej
  dacie — TO JEDNOZNACZNIE POTWIERDZONE w 10+ zgodnych, bardzo
  aktualnych źródłach (luty-lipiec 2026), w tym BEZPOŚREDNIO
  podatki.gov.pl (Rząd 1 — oficjalna strona KSeF)
  → PODSTAWA PRAWNA zwolnienia: art. 106ga ust. 2 ustawy o VAT
  → SPRZEDAWCA MOŻE wystawić fakturę B2C W KSeF DOBROWOLNIE, ALE NIE
    MA takiego obowiązku — pozostaje PEŁNA SWOBODA formy: papierowa,
    PDF/e-mail, LUB (opcjonalnie) w KSeF
  → ⭐ KONSUMENT NIE MA ŻADNYCH obowiązków związanych z KSeF — NIE
    musi zakładać konta, logować się DO systemu ani ODBIERAĆ faktur
    przez KSeF — NAWET jeśli sprzedawca DOBROWOLNIE wystawi fakturę
    w systemie, MUSI i TAK udostępnić ją konsumentowi w CZYTELNEJ
    formie (np. PDF) — zgoda konsumenta NIE JEST wymagana do
    WYSTAWIENIA w KSeF, ALE konsument MOŻE odmówić otrzymywania
    faktur AKURAT tą drogą (prawo to NALEŻY respektować)

⭐ PRAKTYCZNY TEST ROZRÓŻNIAJĄCY B2B OD B2C: DECYDUJE PODANIE NUMERU
  NIP przez nabywcę PRZY zakupie:
  → NIP PODANY → transakcja TRAFIA do KSeF (traktowana jako B2B),
    NAWET jeśli nabywcą formalnie jest osoba fizyczna prowadząca
    działalność gospodarczą
  → NIP NIE PODANY → transakcja B2C, POZA KSeF — DOTYCZY to RÓWNIEŻ
    sytuacji, gdy osoba fizyczna PROWADZĄCA JDG kupuje coś
    PRYWATNIE, na WŁASNY użytek (NIE w imieniu swojej firmy) —
    ŚWIADOMIE NIE PODAJĄC NIP w takiej sytuacji, TRANSAKCJA
    POZOSTAJE B2C

⭐ DODATKOWY WYJĄTEK (do 31.12.2026): paragony fiskalne Z NIP DO
  450 ZŁ — mogą być traktowane jako uproszczona faktura BEZ
  konieczności wystawiania w KSeF — NIE WLICZANE do limitu
  miesięcznego 10 000 zł dla faktur B2B wystawianych POZA KSeF w
  okresie przejściowym

⚠️ ODRĘBNA KATEGORIA — B2G (biznes-administracja publiczna): TE
  faktury SĄ objęte PEŁNYM obowiązkiem KSeF, W PRZECIWIEŃSTWIE do
  B2C — NIE MYLIĆ tych dwóch kategorii

⭐ WNIOSEK PRAKTYCZNY dla POWYŻSZEGO mechanizmu weryfikacji (sekcja
  wyżej): CAŁY opisany system dwuetapowej weryfikacji przez kod QR/
  numer KSeF ma PEŁNE, OBOWIĄZKOWE zastosowanie DO faktur B2B (oraz
  B2G) — DLA faktury IMIENNEJ/konsumenckiej TEN mechanizm MOŻE (ale
  NIE MUSI) w ogóle ISTNIEĆ — JEŚLI sprzedawca NIE skorzystał z
  opcji dobrowolnego wystawienia w KSeF, faktura dla konsumenta NIE
  BĘDZIE miała NUMERU KSeF ani kodu QR w OGÓLE — sama JEJ
  autentyczność WERYFIKUJE SIĘ WTEDY na zasadach OGÓLNYCH (nie przez
  system KSeF), analogicznie jak przed reformą

Potwierdzone w 10+ zgodnych, bardzo aktualnych źródeł (luty-lipiec
2026): podatki.gov.pl [Rząd 1 — oficjalna strona KSeF, sekcja
"Konsumenci i osoby fizyczne"], infakt.pl [3.03.2026], oneclick-
workflow.pl [18.04.2026, TYTUŁ artykułu wprost dotyczy "faktur
imiennych"], eztax.pl [19.02.2026], ifirma.pl [13.04.2026],
ksefgpt.pl [26.03.2026], ingksiegowosc.pl [20.03.2026], edk-
consulting.pl [9.03.2026], pioniew.eu [8.07.2026 — NAJŚWIEŻSZE
potwierdzenie].

⚠️⚠️ REALNE, AKTYWNE ZAGROŻENIE — FAŁSZYWE FAKTURY Z KODEM QR:
  oszuści ROZSYŁAJĄ fałszywe faktury PDF z kodami QR IMITUJĄCYMI
  dokumenty KSeF — kody MOGĄ prowadzić DO: (a) NIEISTNIEJĄCYCH
  dokumentów, (b) SFAŁSZOWANYCH stron podszywających się pod KSeF,
  (c) ⚠️ CO GROŹNIEJSZE — PRAWDZIWYCH wpisów w KSeF, KTÓRE JEDNAK
  NIE PRZECHODZĄ pełnej weryfikacji SZCZEGÓŁÓW (np. numer istnieje,
  ale kwota/NIP na wydruku NIE ZGADZA SIĘ z systemem)
  ⭐ REKOMENDOWANA PROCEDURA WERYFIKACJI (dla odbiorcy faktury):
    (1) zalogować się DO Portalu Podatnika KSeF, (2) wyszukać
    dokument NIE TYLKO po numerze KSeF, ALE RÓWNIEŻ po szczegółowych
    danych: KWOCIE należności, DACIE wystawienia, NIP NABYWCY —
    (3) zweryfikować SAMEGO kontrahenta niezależnie: czy firma
    faktycznie współpracuje, czy dane (numer konta, adres, NIP)
    zgadzają się z bazą kontrahentów

⭐ WAŻNE OGRANICZENIE kodu QR jako narzędzia: kod QR to narzędzie
  POMOCNICZE — POZWALA na UPROSZCZONE potwierdzenie obecności i
  podstawowych danych faktury, ALE NIE ZASTĘPUJE jej pełnego
  doręczenia ANI dostępu do CAŁEJ treści dokumentu — NAJPEWNIEJSZY
  sposób weryfikacji to PORÓWNANIE tego, co jest NA WYDRUKU, z tym,
  co JEST w systemie (nie samo zeskanowanie kodu)

⭐⭐ KLUCZOWE OGRANICZENIE PRAKTYCZNE — BRAK MOŻLIWOŚCI ANULOWANIA:
  faktura, KTÓREJ NADANO numer KSeF, NIE MOŻE być anulowana —
  JEDYNYM sposobem naprawienia pomyłki jest faktura KORYGUJĄCA "DO
  ZERA" — DLATEGO zgodność danych (NIP, daty, kwoty: suma netto +
  VAT = brutto) WARTO sprawdzić PRZED wysyłką dokumentu do systemu,
  NIE dopiero po

STAN ZAWIESZENIA KAR: kary za błędy/brak faktury w KSeF SĄ
  ZAWIESZONE do **31 GRUDNIA 2026 R.** — TO NIE OZNACZA braku
  konsekwencji w OGÓLE, TYLKO odroczenie sankcji PIENIĘŻNYCH na
  okres wdrożeniowy

⭐ WYMÓG SCHEMATU: od 1.02.2026 r. WSZYSTKIE faktury w KSeF, W TYM
  KOREKTY do STARSZYCH dokumentów (wystawionych w schemacie FA(1)
  lub FA(2)), MUSZĄ spełniać wymogi NOWEGO schematu **FA(3)**

⚠️ QR NIE JEST FORMALNIE OBOWIĄZKOWY dla faktur POZOSTAJĄCYCH
  WYŁĄCZNIE wewnątrz systemu KSeF (nieopuszczających go) — staje się
  OBOWIĄZKOWY DOPIERO przy PRZEKAZANIU faktury POZA KSeF (np. PDF
  e-mailem do kontrahenta) — Ministerstwo Finansów REKOMENDUJE jego
  stosowanie jako element ułatwiający weryfikację, NAWET gdy nie ma
  formalnego wymogu

Potwierdzone w 9+ zgodnych, EKSTREMALNIE aktualnych źródeł (luty-
czerwiec 2026): assecobs.pl [19.03.2026, z konkretnym opisem
mechanizmu oszustwa], podatki.gov.pl [Rząd 1 — oficjalna strona
KSeF], ksef-dla.pl [15.06.2026], altoadvisory.pl, eztax.pl
[19.02.2026], fakturowo.pl, i-malaksiegowosc.pl [10.02.2026],
oneclick-workflow.pl [maj 2026], rafsoft.net [9.03.2026].
```

---


---

## TABELA NAWIGACYJNA — KTÓRY TEMAT, W KTÓRYM PLIKU

| Sekcja oryg. | Temat | Plik |
|---|---|---|
| 1-3 | CORE, INTAKE, stawki VAT (baza weryfikacyjna 4-poziomowa: ISAP, ISZTAR4, PKWiU, WIS) | `part-01-core-intake-stawki.md` |
| 4 (część 1) | Odliczenie VAT naliczonego (art. 86), split payment/MPP, zwrot różnicy podatku (art. 87, termin 40 dni!), kasy fiskalne | `part-02-odliczenie-splitpayment-zwrot-kasy.md` |
| 4 (część 2) | Biała lista podatników, WNT/import usług/odwrotne obciążenie, VAT OSS/IOSS, WIS, grupa VAT (art. 8c-8e, 15a) | `part-03-bialalista-wnt-oss-wis-grupaVAT.md` |
| 5.1-5.5 | Grupa szybka: słowniczek (art. 2), właściwość organu (art. 3), WSTO/TBE (art. 28p), zwolnienia WNT (art. 44), metody ustalania podatku (art. 84-85) | `part-04-grupa-szybka.md` |
| 6.1-6.6 | Grupa średnia: złoto inwestycyjne (art. 121-125), taksówki (art. 114), call-off stock (art. 13a-13l), VAT-REF (art. 89), szacowanie (art. 32), korekty VAT-UE (art. 101-102) | `part-05-grupa-srednia.md` |
| 7.1-7.5 | Grupa złożona: CESOP (art. 110a-110e), wyroby medyczne (art. 145c-145d), centralizacja VAT JST, rolnik ryczałtowy — rezygnacja (art. 43 ust. 3-5), pozostałe pozycje nawigacyjne | `part-06-grupa-zlozona.md` |

## CHANGELOG (skrócony — pełna historia w MAPA-AKTOW.md)


**ETAP 2a (2026-08-13):** dodano Sekcję 5 — domknięcie grupy "szybkiej"
luk peryferyjnych: art. 2 (słownik, wybrane kluczowe definicje z 52),
art. 3 (właściwość organów — wyłącznie przypadki szczególne, art. 3
ust. 1-2 SĄ uchylone), art. 28p (zawiadomienie o miejscu opodatkowania
WSTO/TBE), art. 44 (zwolnienia WNT — przepis-przełącznik odsyłający do
art. 43 i Rozdziału 3), art. 84-85 (szczególne metody ustalania VAT
należnego — struktura zakupów i metoda "w stu", odróżnione od
mechanizmu przeliczeniowego z art. 106e). W trakcie weryfikacji
wykryto i skorygowano własną wstępną hipotezę o nieaktualności
przeliczników art. 85 — po dodatkowym wyszukiwaniu potwierdzono,
że przeliczniki 18,70%/7,41%/4,76% (stawki 23%/8%/5%) SĄ aktualne.
Źródła: lexlege.pl (Rząd 2B, t.j. Dz.U. 2025 poz. 775, stan prawny
wprost oznaczony jako aktualny na 12.08.2026), przepisy.gofin.pl,
poltax.pl, ifirma.pl. ⚠️ [NIEWERYFIKOWANE BEZPOŚREDNIO W ISAP] —
ISAP niedostępny do web_fetch w tej sesji.

**ETAP 2c (2026-08-13):** dodano Sekcję 7 — domknięcie priorytetowej
części grupy "złożonej": CESOP (art. 110a-110e — próg 25 płatności/
kwartał, obowiązki dostawców usług płatniczych, powiązanie z
wykrywalnością nieprawidłowości e-commerce), wyroby medyczne (art.
145c-145d — WAŻNE ODKRYCIE: przepis przejściowy wygasł 27.05.2025 r.,
dziś ma charakter w większości historyczny), centralizacja VAT JST
(WAŻNE ODKRYCIE STRUKTURALNE: to odrębna ustawa z 2016 r., nie luka
w samej ustawie o VAT — geneza z wyroku TSUE C-276/14 Gmina Wrocław
i uchwały NSA I FPS 4/15, zasada "wszystko albo nic"), art. 43 ust.
3-5 (rezygnacja rolnika ryczałtowego — uproszczenie od 2011 r., okres
związania 3 lata, wzorzec powtarzający się w kilku miejscach ustawy).
Pozostałe drobne pozycje (108c-108g, 92-95, 112-112aa, 134a-134c,
138i-138j, szczegółowe fakturowanie 106a/106d/106f/106l/106m-106q)
potraktowane nawigacyjnie zgodnie z zasadą lazy loading — niska
częstotliwość w typowej praktyce kancelaryjnej użytkownika, do
opracowania reaktywnie przy faktycznej sprawie. Źródła: lexlege.pl,
przepisy.gofin.pl, prawo.pl, deloitte.com, cowzdrowiu.pl,
isp-modzelewski.pl, enodo.pl, mf-arch2.mf.gov.pl, infor.pl, rp.pl,
nik.gov.pl, perspektywapodatkowa.com, adwokatpazdan.pl,
egospodarka.pl, vademecumpodatnika.pl, odpowiedziprawne.pl,
konskowola.pl, izbapodatkowa.pl, inforfk.pl, praworolne.info.

**ETAP 2b (2026-08-13):** dodano Sekcję 6 — domknięcie grupy
"średniej": złoto inwestycyjne (art. 121-125), taksówki (art. 114),
call-off stock (art. 13a-13l), VAT-REF (art. 89), szacowanie
podstawy przy powiązaniach (art. 32), korekty informacji
podsumowujących VAT-UE (art. 101-102). Źródła: lexlege.pl, gofin.pl,
ifirma.pl, poltax.pl, ksiegoboty.pl (art. 89 — z aktualnym
rozporządzeniem MF i G z 27.05.2026, Dz.U. 2026 poz. 736, weszło
w życie 6.06.2026), inforlex.pl, bwradwokaci.pl, e-druki.pl.


