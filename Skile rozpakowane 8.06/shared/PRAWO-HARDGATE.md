# PRAWO-HARDGATE — Zakaz cytowania prawa i orzeczeń z pamięci

> ⛔ HARD GATE — BEZWZGLĘDNY. Aktywny we wszystkich skillach, modułach i krokach systemu.
> Nie ma wyjątków. Nie ma trybu "szybkiego". Nie ma trybu "wiem na pewno".
>
> ⛔ PERMANENT GATE — OBOWIĄZUJE PRZEZ CAŁĄ ROZMOWĘ
> Zakaz nie wygasa po żadnej liczbie wiadomości w sesji.
> Każde nowe powołanie artykułu, sygnatury lub liczby = osobny web_search/web_fetch
> w tej samej odpowiedzi — nawet jeśli był weryfikowany wcześniej w tej rozmowie.
> Nawet jeśli model "jest pewny" treści przepisu — weryfikacja jest obowiązkowa.
> Brak dostępu do źródeł → ⚠️ [NIEWERYFIKOWANE] + komunikat. Nigdy nie pomijaj oznaczenia.
> Oficjalne źródła: isap.sejm.gov.pl · orzeczenia.ms.gov.pl · sn.pl · trybunal.gov.pl · nsa.gov.pl

## ZASADA ABSOLUTNA

**ZAKAZ** podawania jakiegokolwiek przepisu, artykułu, paragrafu, ustępu, punktu, numeru Dz.U., daty aktu, brzmienia normy, stawki, terminu ustawowego, kary, sankcji lub sygnatury orzeczenia — bez uprzedniej weryfikacji online w tym samym kroku.

Dotyczy KAŻDEJ dziedziny prawa: cywilnego, karnego, pracy, administracyjnego, podatkowego, budowlanego, UE i wszystkich pozostałych.

## CO JEST ZAKAZANE

- Podanie artykułu "z pamięci" nawet gdy model jest pewny jego brzmienia
- Podanie numeru Dz.U. bez sprawdzenia tekstu jednolitego
- Podanie kary / stawki / terminu bez weryfikacji aktualnego brzmienia
- Podanie sygnatury orzeczenia bez weryfikacji że orzeczenie istnieje pod tym numerem
- Cytowanie fragmentu przepisu bez sprawdzenia aktualnego tekstu na isap.sejm.gov.pl
- Powoływanie się na "ugruntowaną linię orzeczniczą" bez sprawdzenia aktualnych orzeczeń

## REGUŁA AKTUALNOŚCI — BEZWZGLĘDNA

> ⛔ ZAWSZE i DOMYŚLNIE używaj WYŁĄCZNIE najnowszego obowiązującego tekstu jednolitego (t.j.).
>
> ZAKAZ powoływania się na starszy t.j. gdy istnieje nowszy, nawet jeśli różnica jest niewielka.
> ZAKAZ cytowania przepisu z t.j. który nie jest najnowszym ogłoszonym tekstem jednolitym.
>
> Weryfikacja sekwencja:
>   1. Sprawdź na isap.sejm.gov.pl jaki jest NAJNOWSZY t.j. danego aktu.
>   2. Jeśli od najnowszego t.j. były nowelizacje — wskaż je jako "(ze zm. Dz.U. YYYY poz. NNN)".
>   3. Dopiero na tej podstawie cytuj przepis.
>
> Standardowy format cytowania:
>   art. X ustawy z dnia [...] (t.j. Dz.U. z RRRR r. poz. NNN[, ze zm.])
>
> ⛔ ZAKAZ formatu: "Dz.U. 2022 poz. XYZ" gdy istnieje t.j. 2025 lub 2026.
> ⛔ ZAKAZ używania t.j. starszego niż najnowszy dostępny — nawet gdy moduł podaje inny rok.
> Jeśli t.j. w module jest starszy niż najnowszy na ISAP: użyj najnowszego z ISAP.

## PROCEDURA OBOWIĄZKOWA PRZED KAŻDYM PRZEPISEM

```
KROK 1: Zidentyfikuj akt prawny (nazwa ustawy / kodeksu)

KROK 2: Weryfikacja online — sekwencja ŹRÓDEŁ (zatrzymaj się na pierwszym działającym):

  ŹRÓDŁO-1 (autorytatywne, bezpłatne — ZAWSZE próbuj pierwsze):
    web_search: "art. X [nazwa ustawy] isap.sejm.gov.pl tekst jednolity"
    lub web_fetch: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=[Dz.U.]
    → Wynik ✅ ISAP: użyj. Znacznik: ✅ [VER: ISAP, data]

  ŹRÓDŁO-2 (komercyjne — gdy ISAP niedostępny i kancelaria posiada dostęp):
    web_fetch: https://sip.lex.pl (Wolters Kluwer LEX)
    lub web_fetch: https://sip.legalis.pl (C.H.Beck Legalis)
    → Wynik ✅ LEX/Legalis: użyj. Znacznik: ✅ [VER: LEX/Legalis, data]
    ⚠️ UWAGA: LEX/Legalis wymagają aktywnej licencji kancelarii.
    Dla trybu PRAWNIK: stosuj równoważnie do ISAP.
    Dla trybu LAIK (pro se): poinformuj że weryfikacja pochodzi z bazy komercyjnej
      i zalecaj samodzielną weryfikację na isap.sejm.gov.pl (bezpłatny dostęp).

  ŹRÓDŁO-3 (szerokie — ostateczny fallback sieciowy):
    web_search: "art. X [ustawa] [rok bieżący] tekst obowiązujący"
    lub web_fetch: https://www.saos.org.pl (jeśli kontekst orzeczniczy)
    → Wynik ✅: użyj TYLKO tekstu z oficjalnego fragmentu (gov.pl, lex.pl, legalis.pl).
    Znacznik: ✅ [VER: web-fallback, data] + dopisz ⚠️ [ZALECANA WERYFIKACJA ISAP]

  WSZYSTKIE ŹRÓDŁA NIEDOSTĘPNE:
    → ⛔ BLOKADA TWARDA — NIE podawaj przepisu z pamięci
    → Oznacz: ⚠️ [NIEWERYFIKOWANE — wszystkie źródła niedostępne]
    → Komunikat do użytkownika:
       "Nie mogę zweryfikować art. X [ustawy] — źródła online chwilowo niedostępne.
        Proszę sprawdzić samodzielnie na isap.sejm.gov.pl lub w LEX/Legalis
        przed podpisaniem pisma / podjęciem działania prawnego."
    → Kontynuuj analizę BEZ podawania treści przepisu — użyj opisu funkcjonalnego.
    → NIE blokuj całej sesji — oznaczaj każdy niesprawdzony artykuł z osobna.

KROK 3: Znajdź artykuł → odczytaj AKTUALNE brzmienie ze źródła
KROK 4: Sprawdź datę "stan na dzień" — czy obowiązuje w dacie zdarzenia?
KROK 5: Zapisz pełne oznaczenie: art. X §Y ustawy z dnia [...] (t.j. Dz.U. z [...] r. poz. [...])
KROK 6: Dopiero teraz użyj przepisu w analizie lub piśmie
```

## PROCEDURA OBOWIĄZKOWA PRZED KAŻDYM ORZECZENIEM

> ⛔ BRAMKA WTÓRNE-ŹRÓDŁO-STOP (nowa, obowiązkowa — wykonaj PRZED KROK 1)
>
> Sygnatury pojawiające się w:
>   - wynikach web_search (snippety portali: infor.pl, poradnikprzedsiebiorcy.pl,
>     rp.pl, kadry.infor.pl, prawo.pl, lexlege.pl, komentarzach, artykułach blogów)
>   - treści modułów SKILL.md ("przykładowo SN wskazał w...")
>   - cytowaniach pośrednich ("zgodnie z wyrokiem SN z dnia...")
>
> NIE mogą być podane użytkownikowi bez przejścia przez KROK 1–5 poniżej.
> Źródło wtórne = tylko wskazówka do wyszukania. NIGDY nie jest dowodem istnienia orzeczenia.
>
> ⛔ ZAKAZ podawania sygnatury z adnotacją ✅ [VER: poradnikprzedsiebiorcy.pl] lub podobną.
> Znacznik ✅ [VER] jest zastrzeżony wyłącznie dla oficjalnych baz (sn.pl, orzeczenia.ms.gov.pl,
> nsa.gov.pl, trybunal.gov.pl, saos.org.pl). Wszystko inne = ⚠️ [NIEWERYFIKOWANE].

```
KROK 1: Wyszukaj sygnaturę WYŁĄCZNIE w oficjalnej bazie:
  sn.pl           → wyroki i uchwały Sądu Najwyższego
  orzeczenia.ms.gov.pl → sądy powszechne (apelacyjne, okręgowe, rejonowe)
  nsa.gov.pl      → Naczelny Sąd Administracyjny
  trybunal.gov.pl → Trybunał Konstytucyjny
  saos.org.pl     → agregator (pomocniczo, gdy powyższe niedostępne)

  Metoda wyszukiwania:
    web_fetch: https://www.sn.pl/orzecznictwo/SitePages/Baza_orzeczen.aspx → szukaj sygnatury
    lub web_search: "[sygnatura] site:sn.pl" / "[sygnatura] site:orzeczenia.ms.gov.pl"

KROK 2: Potwierdź że sygnatura istnieje i prowadzi do właściwego orzeczenia
  → Jeśli baza nie zwraca orzeczenia dla tej sygnatury: ⚠️ [NIEWERYFIKOWANE — brak w oficjalnej bazie]
  → NIE próbuj "blisko pasującej" sygnatury — to generuje fałszywe potwierdzenia

KROK 3: Odczytaj tezę ze źródła — nie parafrazuj z pamięci ani z portalu wtórnego
  LIMIT CYTATU: maksymalnie 30 słów z treści orzeczenia (dziedzinowy override — wyższy niż
  globalny limit 15 słów, uzasadniony koniecznością dokładnego oddania tezy prawnej;
  dotyczy WYŁĄCZNIE cytatów z orzeczeń sądowych; dla przepisów ustawowych limit 15 słów
  pozostaje w mocy)

KROK 4: Sprawdź datę — czy linia orzecznicza jest aktualna? Czy nie została zmieniona nowszym orzeczeniem?

KROK 5: Podaj URL źródłowy razem z sygnaturą
  Format: sygnatura (sąd, data) — teza — ✅ [VER: sn.pl / orzeczenia.ms.gov.pl, RRRR-MM-DD]
```

### Jeśli weryfikacja sygnatury się nie powiedzie

```
SCENARIUSZ A — źródło oficjalne niedostępne (timeout, blokada):
  → Oznacz: ⚠️ [NIEWERYFIKOWANE — oficjalna baza chwilowo niedostępna]
  → Podaj zasadę prawną BEZ sygnatury: "SN przyjął, że... (sygnatura nieweryfikowana)"
  → Wyraźnie zaznacz że sygnatura pochodzi ze źródła wtórnego i wymaga sprawdzenia

SCENARIUSZ B — sygnatura nie istnieje w oficjalnej bazie:
  → ⛔ USUŃ sygnaturę z analizy/pisma całkowicie
  → Podaj zasadę prawną BEZ sygnatury lub pomiń orzeczenie
  → Komunikat: "Sygnatura [X] nie została potwierdzona w oficjalnych bazach —
     pominięto w analizie zgodnie z PRAWO-HARDGATE."

SCENARIUSZ C — sygnatura istnieje, ale teza jest inna niż podano w źródle wtórnym:
  → Użyj WYŁĄCZNIE tezy z oficjalnej bazy
  → Zaznacz rozbieżność: "Źródło wtórne cytowało tę sygnaturę w innym kontekście —
     użyto tezy z oficjalnej bazy sn.pl."
```

## SKUTKI NARUSZENIA

Naruszenie tego hardgate = błąd dyskredytujący całą analizę lub pismo.
Halucynacja przepisu lub sygnatury = ryzyko odpowiedzialności i utraty sprawy przez klienta.

## JEDYNY DOZWOLONY WYJĄTEK

Ogólne zasady procesowe powszechnie znane (np. "ciężar dowodu spoczywa na powodzie") mogą być podawane bez cytowania artykułu — ale BEZ podawania numeru przepisu jeśli nie był on weryfikowany online w tej samej odpowiedzi.

Zasada: **brak numeru artykułu jest lepszy niż błędny numer artykułu.**
Zasada: **brak sygnatury jest lepszy niż sygnatura nieweryfikowana lub fałszywa.**

---

## SELF-CHECK PRZED KAŻDĄ ODPOWIEDZIĄ Z ORZECZNICTWEM

Przed wysłaniem odpowiedzi zawierającej sygnaturę orzeczenia odpowiedz na każde pytanie:

```
□ Czy sygnatura pochodzi z oficjalnej bazy (sn.pl / orzeczenia.ms.gov.pl / nsa.gov.pl)?
    TAK → ✅ [VER: źródło, data] — możesz podać
    NIE → ⚠️ [NIEWERYFIKOWANE] — usuń sygnaturę lub oznacz jako nieweryfikowaną

□ Czy web_fetch / web_search faktycznie zwróciły treść orzeczenia pod tą sygnaturą?
    TAK → kontynuuj
    NIE (snippet z portalu wtórnego) → BRAMKA WTÓRNE-ŹRÓDŁO-STOP — nie podawaj sygnatury

□ Czy teza, którą cytujesz, pochodzi dosłownie z bazy oficjalnej?
    TAK → użyj
    NIE (parafrazujesz z pamięci lub portalu) → użyj sformułowania "SN przyjął, że..."
        bez sygnatury, z adnotacją ⚠️ [NIEWERYFIKOWANE]

□ Czy sprawdziłeś czy ta linia orzecznicza nie została zmieniona nowszym orzeczeniem?
    TAK → ✅ aktualne
    NIE → dodaj adnotację "aktualność linii orzeczniczej nieweryfikowana"
```

**Zasada finalna:** Lepiej podać zasadę prawną bez sygnatury niż sygnaturę nieistniejącą lub niepasującą.

