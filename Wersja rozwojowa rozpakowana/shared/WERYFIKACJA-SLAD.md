# WERYFIKACJA-ŚLAD — Moduł Audytu Śladu Weryfikacji

> **Plik:** `/mnt/skills/user/shared/WERYFIKACJA-SLAD.md`
> **Wersja:** 1.4 (2026-07-15b) — dodano obowiązkową kategoryzację RZĄD
>              (odesłanie do `shared/HIERARCHIA-ZRODEL.md`) przy każdej
>              kotwicy tekstowej i w tabeli śladu — zgłoszone przez
>              użytkownika po incydencie: link 🔗 podany bez kategoryzacji
>              źródła (patrz CHANGELOG)
> **Wersja poprzednia:** 1.3 (2026-07-15) — dodano KOTWICA-TEKSTOWA (Text Fragment):
>              link bezpośredni do konkretnego zdania w źródle, na wniosek
>              użytkownika po teście mechanizmu cytowania w rozmowie
>              (patrz sekcja niżej + CHANGELOG na końcu pliku)
> **Wersja 1.2** (2026-07-05b) — naprawa luki "cytat na poparcie tezy bez
>              parafrazy" (NSA I FZ 104/26) + GUARD INSTYTUCJA/PRZEDMIOT dla
>              orzeczeń anonimizowanych (adm./karne)
> **Wersja 1.1** (2026-07-05a) — GRADIENT ISTNIENIE/TREŚĆ/FRAGMENT
>              + guard STRON; wzorzec citation-grounding-pl v2.1
> **Status:** AKTYWNY — naprawa BLOKER-3, rozszerzenie po AUDYT-2026-07-05b,
>              rozszerzenie 1.3 po teście KOTWICA-TEKSTOWA (2026-07-15),
>              rozszerzenie 1.4 po dodaniu kategoryzacji RZĄD (2026-07-15b)

---

## PROBLEM

Model może pominąć web_search i nadal "zaliczyć" self-check przez błędne zaznaczenie
checkboxa. Brak widocznego artefaktu URL w odpowiedzi uniemożliwia użytkownikowi
weryfikację. System musi generować **widzialny ślad weryfikacji** dla każdego
artykułu, liczby i orzeczenia.

---

## ZASADA ŚLADU

**Każdy przepis / liczba / termin / orzeczenie musi mieć JEDEN Z DWÓCH znaczników:**

```
✅ [VER: isap.sejm.gov.pl, 2026-05-25] — zweryfikowano online (URL + data)
⚠️ [NIEWERYFIKOWANE] — weryfikacja niemożliwa (brak dostępu, timeout)
```

> ⛔ **ZAKAZ** oznaczania `✅ [VER]` bez faktycznego wykonania web_search lub web_fetch.
> Zasada jest programowa — model NIE może oznaczyć VER jeśli nie wywołał narzędzia.

---

## FORMAT ŚLADU WERYFIKACJI

### Poziom minimalny (śródtekstowy)

```
art. 190 §1 KK ✅ [VER: isap.gov.pl]
art. 190a §4 KK — tryb na wniosek ✅ [VER: orka.sejm.gov.pl, 25.05.2026]
Termin: 2 tygodnie na sprzeciw od nakazu zapłaty (art. 502 §1 KPC) ✅ [VER: isap.gov.pl]
```

### Poziom pełny (sekcja na końcu analizy / pisma)

```
---
## 🔍 Ślad weryfikacji

| Element | Źródło | Data weryfikacji | Status |
|---|---|---|---|
| art. 190 §1 KK — kara do 3 lat PW | isap.sejm.gov.pl (Dz.U.2025.383) | 2026-05-25 | ✅ |
| art. 190a §4 KK — tryb na wniosek | orka.sejm.gov.pl | 2026-05-25 | ✅ |
| art. 12 §4 KPK — wyjątek wnioskowy | isap.sejm.gov.pl (Dz.U.2026.490) | 2026-05-25 | ✅ |
| Wyrok SN V KK 123/22 | sn.pl (nie znaleziono) | 2026-05-25 | ⚠️ NIEWERYFIKOWANE |
```

---

## 🔗 KOTWICA-TEKSTOWA (Text Fragment) — SCALONE do PRAWO-HARDGATE.md (2026-07-15c)

> ⛔ **Ten mechanizm nie jest już opisany tutaj osobno.** Powstał 2026-07-15
> niezależnie od KROK 5A w `shared/PRAWO-HARDGATE.md` (dodanego tego samego
> dnia) — dwie osobne implementacje tego samego problemu w dwóch plikach
> shared/, wykryte przez użytkownika jako duplikacja po incydencie, w którym
> odpowiedź z modułu karnego (dr-03) nie zastosowała żadnej z nich.
>
> Pełna, kanoniczna procedura (Text Fragment `#:~:text=`, KT-1→KT-4,
> kategoryzacja RZĄD, zastrzeżenie o wsparciu przeglądarek, FALLBACK) jest
> teraz WYŁĄCZNIE w:
> `view /mnt/skills/user/shared/PRAWO-HARDGATE.md` → sekcja KROK 5A
>
> Ten plik (WERYFIKACJA-SLAD.md) pozostaje właściwym miejscem dla znaczników
> ✅/⚠️ [VER/NIEWERYFIKOWANE] i GRADIENTU (ISTNIENIE/TREŚĆ/FRAGMENT) — patrz
> sekcje niżej. KOTWICA-TEKSTOWA jest odrębnym, dodatkowym mechanizmem
> nawigacyjnym opisanym w PRAWO-HARDGATE.md, nie zastępuje GRADIENTU.
>
> Pełny opis scalenia: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`,
> wpis AUDYT-2026-07-15c.

---

## 🎚️ GRADIENT WERYFIKACJI CYTATU — ISTNIENIE / TREŚĆ / FRAGMENT

> Dodano: 2026-07-05 (AUDYT-2026-07-05a). Wzorzec: citation-grounding-pl v2.1
> (adaptacja gradientu Existence/Content/Paragraph). Zamyka lukę
> "prawdziwy cytat, fałszywa teza" (problem Stanford "false-under-true"):
> dotychczasowy ślad ✅ [VER] potwierdzał ISTNIENIE przepisu/sygnatury,
> ale nie sprawdzał, czy PARAFRAZA oddaje faktyczną treść źródła.

> ⚠️ **Case study zamknięty przez v1.2 (2026-07-05b):** postanowienie NSA z
> 23.06.2026, sygn. **I FZ 104/26** — pełnomocnik powołał w zażaleniu
> postanowienia NSA jako rzekome poparcie tezy o przesłankach wstrzymania
> wykonania decyzji (art. 61 § 3 p.p.s.a.). NSA ustalił, że: (1) powołane
> postanowienia zapadły w innych datach niż podane, (2) żadne z nich w
> ogóle nie dotyczyło instytucji wstrzymania wykonania, (3) teza pisma
> była sprzeczna z ugruntowaną linią orzeczniczą co do ciężaru dowodu.
> NSA nazwał to wprost "bezrefleksyjnym korzystaniem z AI" i brakiem
> profesjonalizmu pełnomocnika. Luka w v1.1: GRAD-1 klasyfikował "gołe"
> powołanie (bez cudzysłowu, bez wprost sformułowanej parafrazy) jako
> wymagające tylko ISTNIENIA — a to za mało, gdy powołanie ma poprzeć
> konkretną tezę. v1.2 zamyka to w GRAD-1 (poniżej) i dodaje GUARD
> INSTYTUCJA dla spraw, gdzie strony są anonimizowane (adm./karne) i
> GUARD STRON nie ma czego porównać.

**Zasada:** samo `✅ [VER]` (istnienie) NIE wystarcza, gdy odpowiedź twierdzi coś
o TREŚCI źródła. Poziom weryfikacji musi odpowiadać sile twierdzenia.

### Trzy poziomy weryfikacji

| Poziom | Co potwierdza | Wymagany dla |
|---|---|---|
| **ISTNIENIE** | Kotwica (sygnatura / nr Dz.U. / CELEX, data, organ) jest realna i zgodna z deklaracją | wyłącznie neutralne wzmianki bez funkcji dowodowej: "sprawa toczyła się pod sygn. X", spis/wykaz orzeczeń bez tezy |
| **TREŚĆ** | Źródło CO DO ISTOTY zawiera to, co twierdzi odpowiedź | parafraza ("SN przyjął, że…"), ORAZ **każde powołanie użyte jako poparcie tezy/argumentu — nawet bez cudzysłowu i bez wprost sformułowanej parafrazy** (np. "zgodnie z ugruntowaną linią orzeczniczą (por. sygn. X, Y, Z)…", "analogicznie orzekł NSA w sprawach…") |
| **FRAGMENT** | Cytowany fragment istnieje DOSŁOWNIE w źródle | każdy cytat w cudzysłowie, każdy pinpoint (§, ustęp, akapit uzasadnienia) |

> ⛔ **Reguła I FZ 104/26 (v1.2):** "powołanie na poparcie" ≠ "sama kotwica".
> Jeśli sygnatura/Dz.U. pojawia się w zdaniu, które ma PRZEKONAĆ o czymś
> (poprzeć tezę, argument, linię orzeczniczą) — to zawsze **minimum TREŚĆ**,
> niezależnie od tego, czy jest cudzysłów. Do ISTNIENIA wolno zejść WYŁĄCZNIE
> gdy powołanie nie pełni żadnej funkcji dowodowej (czysty spis/inwentarz).
> W razie wątpliwości, czy dane powołanie "popiera tezę" — traktuj jako TREŚĆ
> (zasada ostrożności, nie odwrotnie).

### Procedura GRAD

```
GRAD-1: Sklasyfikuj każde powołanie w planowanej odpowiedzi:
          cytat dosłowny / teza z pinpointem     → wymagany poziom FRAGMENT
          stanowisko sądu / parafraza przepisu    → wymagany poziom TREŚĆ
          powołanie użyte jako poparcie tezy/argumentu (nawet gołe,
            bez cudzysłowu i bez wprost sformułowanej parafrazy)
            → wymagany poziom TREŚĆ (reguła I FZ 104/26, patrz wyżej)
          samo powołanie bez funkcji dowodowej (spis/inwentarz)
            → wymagany poziom ISTNIENIE

GRAD-2: Zweryfikuj na WYMAGANYM poziomie — wobec treści pobranej ze źródła
        (PRAWO-HARDGATE KROK 3: odczyt ze źródła, nie z pamięci):
          FRAGMENT → porównaj cytat ze źródłem znak-po-znaku (po normalizacji:
                     wielkość liter, białe znaki, cudzysłowy „"», myślniki —–,
                     [...] jako dozwolona luka). Słowo nośne inne = brak trafienia.
          TREŚĆ    → sprawdź czy terminy nośne twierdzenia (≥4 znaki, bez słów
                     funkcyjnych) występują w źródle I czy sens nie jest odwrócony
                     (zwłaszcza: kto wygrał, co oddalono, zakres wyjątku).
                     Dla powołania-na-poparcie: dodatkowo ustal, czy źródło W OGÓLE
                     dotyczy tej samej INSTYTUCJI/PROCEDURY co teza (nie tylko tego
                     samego działu prawa) — patrz GRAD-3b.
          ISTNIENIE→ kontrakt FOUND/NOT_FOUND/AMBIGUOUS (shared/SYGNATURY.md)
                     lub KROK 2B PRAWO-HARDGATE (tytuł aktu vs teza).

GRAD-3: GUARD STRON (dla orzeczeń, gdy znane są strony postępowania):
        porównaj strony deklarowane w odpowiedzi ze stronami ze źródła.
        Sygnatura zgodna + strony RAŻĄCO rozbieżne = 🔴 blokada
        ("prawdziwa sygnatura doczepiona do INNEJ sprawy").
        Formy prawne pomijaj w porównaniu (S.A. ≡ Spółka Akcyjna, sp. z o.o.).

GRAD-3b: GUARD INSTYTUCJA/PRZEDMIOT (NOWE v1.2 — gdy GUARD STRON niemożliwy,
        np. sprawy administracyjne/karne z anonimizacją do inicjałów,
        LUB jako dodatkowa kontrola obok GUARD STRON):
        Ustal PRZEDMIOT sprawy cytowanego orzeczenia wprost ze źródła
        (sentencja / pierwszy akapit uzasadnienia — nie z pamięci ani
        z tego, jak przedstawia go pełnomocnik/model). Porównaj z INSTYTUCJĄ
        PRAWNĄ, którą powołanie ma poprzeć (np. "wstrzymanie wykonania decyzji
        art. 61 § 3 p.p.s.a." vs orzeczenie faktycznie dotyczące np. kosztów
        postępowania albo przywrócenia terminu — RÓŻNE instytucje mimo tej
        samej gałęzi prawa/tego samego typu sprawy administracyjnej).
        Przedmiot NIE zgadza się z powoływaną instytucją = 🔴 blokada
        ("prawdziwe orzeczenie, niewłaściwy temat") — usuń powołanie,
        NIE "napraw" go dobieraniem innej tezy pod tę samą sygnaturę.

        ⚠️ DEDUPLIKACJA: `pisma-procesowe-v3` ma już lokalną, bardziej
        rozbudowaną implementację tej samej kontroli — KROK 3a
        ZAKRES-STOSOWANIA w `references/W3-WERYFIKACJA.md` (pytania o typ
        podmiotu, ten sam przepis/kontekst, ograniczony zakres, utrwalenie
        doktryny). GRAD-3b NIE zastępuje ZAKRES-STOSOWANIA tam, gdzie już
        działa — jest wersją OGÓLNĄ dla skilli, które własnej kontroli
        tematu jeszcze nie mają (np. `orzeczenia-sadowe-v2` poza kontekstem
        pisma, `analiza-sadowa-v6`). Mapowanie statusów (żeby audit-bundle
        i tabela śladu używały spójnego słownika):
          ZAKRES-OK      ≈ 🟢 (GRAD-3b: przedmiot zgodny)
          WARN-ZAKRES    ≈ 🟠 (GRAD-3b: przedmiot częściowo/pomocniczo zgodny)
          ZAKAZ-ZAKRES   ≈ 🔴 (GRAD-3b: przedmiot niezgodny — blokada)

GRAD-4: REGUŁA KALIBRACJI — porównaj poziom OSIĄGNIĘTY z WYMAGANYM:
          osiągnięty ≥ wymagany → 🟢 ZWERYFIKOWANY
          twierdzisz FRAGMENT, osiągnąłeś tylko TREŚĆ → 🟠 KALIBRACJA:
             złagodź cytat dosłowny do parafrazy ALBO oznacz pinpoint
             jako prowizoryczny — NIGDY nie zostawiaj cudzysłowu bez FRAGMENT
          TREŚĆ niepotwierdzona co do istoty → 🟡 WYMAGA_OSĄDU (decyzja
             człowieka przed użyciem w piśmie) lub usuń twierdzenie
          kotwica nierozwiązana / rozbieżna / guard STRON / guard INSTYTUCJA
             → 🔴 NIEZWERYFIKOWANY = potencjalna halucynacja, BLOKADA
             (usuń z odpowiedzi/pisma)
```

### Rozszerzone statusy śladu

Dotychczasowe `✅ [VER]` / `⚠️ [NIEWERYFIKOWANE]` pozostają w mocy dla poziomu
ISTNIENIE. Dla TREŚĆ i FRAGMENT stosuj rozszerzenie:

```
🟢 [VER-FRAGMENT: źródło, data]  — cytat dosłowny potwierdzony w źródle
🟢 [VER-TREŚĆ: źródło, data]     — parafraza potwierdzona co do istoty
✅ [VER: źródło, data]           — potwierdzone ISTNIENIE kotwicy (jak dotąd)
🔗 [KOTWICA-TEKSTOWA: URL#:~:text=…] — link z Text Fragment do miejsca cytowania
                                   (TOWARZYSZY 🟢/✅, nie zastępuje — procedura
                                   kanoniczna: shared/PRAWO-HARDGATE.md KROK 5A)
🟠 [KALIBRACJA]                  — osiągnięto niższy poziom niż twierdzono → złagodź tezę
⚠️ [NIEWERYFIKOWANE]             — weryfikacja niemożliwa (jak dotąd)
🔴 [BLOKADA]                     — rozbieżność kotwicy / stron / treści → usuń przed wysłaniem
```

⛔ ZAKAZ: cytat w cudzysłowie lub pinpoint bez statusu 🟢 [VER-FRAGMENT].
⛔ ZAKAZ: "SN przyjął, że…" z samym ✅ [VER] (istnienie) — parafraza wymaga
   co najmniej poziomu TREŚĆ albo przeformułowania na "orzeczenie dotyczy [tematu]".
Statusy 🟠 i 🔴 podlegają STRIP-VER-GATE tak samo jak pozostałe znaczniki.

### Kolumna poziomu w tabeli śladu (poziom pełny)

Przy analizach z cytatami/parafrazami dodaj kolumnę "Poziom (wym.→osiąg.)":

```
| Element | Źródło | Data | Poziom (wym.→osiąg.) | Status |
|---|---|---|---|---|
| „sąd związany jest granicami zaskarżenia" (II CSK 123/19) | saos.org.pl API | 2026-07-05 | FRAGMENT→FRAGMENT | 🟢 |
| "SN dopuścił klauzulę waloryzacyjną" (I CSK 50/18) | sn.pl | 2026-07-05 | TREŚĆ→ISTNIENIE | 🟠 KALIBRACJA |
| art. 385¹ §1 KC — powołanie | api.sejm.gov.pl ELI | 2026-07-05 | ISTNIENIE→ISTNIENIE | ✅ |
```

---

## KIEDY STOSOWAĆ KTÓRY FORMAT

```
Analiza ≤ 3 przepisów            → poziom minimalny (znaczniki śródtekstowe)
Analiza ≥ 4 przepisów            → poziom pełny (tabela na końcu)
Pismo procesowe (.docx)          → tabela WYŁĄCZNIE w wiadomości (nie w .docx) — patrz STRIP-VER-GATE
Umowa / regulamin / wzorzec      → tabela WYŁĄCZNIE w wiadomości (nie w dokumencie) — patrz STRIP-VER-GATE
Orzeczenie                       → ZAWSZE URL bezpośredni do orzeczenia + data
```

---

## ⛔ STRIP-VER-GATE — BRAMKA OCZYSZCZANIA PRZED EKSPORTEM DOKUMENTU

> **Wersja:** 1.0 (2026-06-23) — patch STRIP-VER
> **Obowiązuje dla:** pism procesowych (.docx), umów, regulaminów, wzorców, OWU

```
TRIGGER: każdorazowo PRZED wywołaniem view /mnt/skills/public/docx/SKILL.md
         i przed finalnym zapisem umowy / regulaminu / wzorca.

⛔ ZAKAZ: znaczniki [VER: …] i [NIEWERYFIKOWANE] NIE mogą pojawić się
          w treści właściwej dokumentu kierowanego do sądu, kontrahenta
          lub klienta.

PROCEDURA:
  SVG-1: Zidentyfikuj WSZYSTKIE wystąpienia:
           ✅ [VER: …]
           ⚠️ [NIEWERYFIKOWANE]
         w treści właściwej pisma / umowy (nagłówek, uzasadnienie,
         żądania, petitum, klauzule, podpisy).

  SVG-2: USUŃ je z treści dokumentu — przepis pozostaje, znacznik znika.
         Przykład przed: „art. 25¹ §3 KP ✅ [VER: isap.sejm.gov.pl, 2026-06-23]"
         Przykład po:    „art. 25¹ §3 KP"

  SVG-3: Przenieś pełną tabelę śladu weryfikacji (format POZIOM PEŁNY)
         do wiadomości towarzyszącej — PRZED present_files:

         ## 🔍 Ślad weryfikacji (wewnętrzny — nie jest częścią dokumentu)
         | Element | Źródło | Data | Status |
         |---|---|---|---|
         | … | … | … | ✅ / ⚠️ |

  SVG-4: Dopiero po SVG-1–SVG-3 → generuj .docx / finalizuj dokument.

⛔ ZAKAZ pominięcia SVG-2: „sąd nie weryfikuje naszego procesu walidacji"
   nie jest uzasadnieniem — znaczniki VER są artefaktem wewnętrznym systemu
   i nigdy nie powinny trafiać do dokumentu urzędowego ani handlowego.

⛔ ZAKAZ „skrótu": przeniesienie tabeli do stopki .docx NIE jest
   równoważne usunięciu — stopka też trafia do adresata. Jedyne
   dopuszczalne miejsce: wiadomość w Claude (nie w pliku .docx).
```

---

## PROCEDURA WERYFIKACJI — SEKWENCJA OBOWIĄZKOWA

```
KROK W-1: Zidentyfikuj wszystkie artykuły / liczby / terminy / orzeczenia w planowanej odpowiedzi.

KROK W-2: Dla każdego elementu → wywołaj narzędzie:
  Przepis KK/KPC/KPA/KC/KP → web_search: "[art. X §Y ustawa]" + web_fetch: isap.sejm.gov.pl
  Orzeczenie SN/SA → web_search: "[sygnatura]" + web_fetch: sn.pl lub orzeczenia.ms.gov.pl
  Rejestr UOKiK → web_fetch: rejestr.uokik.gov.pl

KROK W-3: Przypisz znacznik do każdego elementu:
  Narzędzie zwróciło wynik → ✅ [VER: URL, data]
  Narzędzie nie zwróciło / brak dostępu → ⚠️ [NIEWERYFIKOWANE]
  ⛔ ZAKAZ: ✅ bez wywołania narzędzia

KROK W-3b: Dla elementów na poziomie FRAGMENT (cytat dosłowny/pinpoint) lub
  dla orzeczeń → wykonaj KT-1→KT-4 (procedura kanoniczna: shared/PRAWO-
  -HARDGATE.md KROK 5A) W TEJ SAMEJ odpowiedzi, korzystając z treści
  właśnie zwróconej przez narzędzie — NIE dobudowuj kotwicy tekstowej po
  fakcie, w kolejnej turze, bez ponownego web_fetch/web_search tego źródła.

KROK W-4: Przy ≥ 3 nieudanych weryfikacjach z rzędu:
  → Wyświetl użytkownikowi komunikat:
    "⚠️ Weryfikacja online niedostępna (ISAP / sn.pl nie odpowiada).
     Dane poniżej pochodzą z ostatniej weryfikacji systemu (data).
     Zalecam samodzielną weryfikację na isap.sejm.gov.pl przed użyciem
     w postępowaniu."
  → Kontynuuj z oznaczeniem ⚠️ [NIEWERYFIKOWANE] dla wszystkich elementów.
  → NIE blokuj całkowicie odpowiedzi — informuj i kontynuuj z zastrzeżeniami.
```

---

## OBSŁUGA BŁĘDÓW SIECIOWYCH (naprawa WAŻNE-3: SLA)

```
TIMEOUT (brak odpowiedzi w ~15s):
  → Spróbuj alternatywne źródło (np. lexlege.pl / prawo.pl zamiast isap.gov.pl)
  → Jeśli alternatywa też niedostępna → ⚠️ [NIEWERYFIKOWANE]

HTTP 5xx / serwis niedostępny:
  → 1 ponowna próba po 5s
  → Jeśli nadal błąd → ⚠️ [NIEWERYFIKOWANE]

≥ 3 nieudane weryfikacje z rzędu (dowolna kombinacja):
  → Komunikat użytkownikowi (patrz KROK W-4 powyżej)
  → Dalsze odpowiedzi w trybie ⚠️ [NIEWERYFIKOWANE] aż do powrotu dostępu

Tryb awaryjny NIE oznacza pominięcia disclaimera — DISCLAIMER.md stosuje się zawsze.
```

---

## INTEGRACJA Z ROUTEREM

### Dodaj do SELF-CHECK:

```
□ [WERYFIKACJA-ŚLAD] Każdy artykuł / termin / orzeczenie ma znacznik VER lub NIEWERYFIKOWANE?
□ [WERYFIKACJA-ŚLAD] Użyłem narzędzia (web_search/web_fetch) dla każdego VER?
□ [WERYFIKACJA-ŚLAD] ≥3 błędy sieci → komunikat użytkownikowi wyświetlony?
□ [WERYFIKACJA-ŚLAD] Analiza ≥4 przepisów → tabela śladu na końcu odpowiedzi?
□ [GRADIENT] Każdy cytat w cudzysłowie / pinpoint ma 🟢 [VER-FRAGMENT]?
□ [GRADIENT] Każda parafraza ("SN przyjął, że…") zweryfikowana na poziomie TREŚĆ,
             nie tylko ISTNIENIE?
□ [GRADIENT] Każde "gołe" powołanie użyte na poparcie tezy (bez cudzysłowu,
             bez parafrazy) TEŻ zweryfikowane na poziomie TREŚĆ (reguła
             I FZ 104/26) — nie potraktowane jako sama ISTNIENIE?
□ [GRADIENT] Dla orzeczeń bez możliwości porównania stron (anonimizacja
             adm./karna) — wykonany GUARD INSTYTUCJA/PRZEDMIOT (GRAD-3b)?
□ [GRADIENT] Twierdzenia z poziomem osiągniętym < wymaganym → skalibrowane (🟠)
             lub usunięte (🔴)?
□ [KOTWICA-TEKSTOWA] Każdy cytat na poziomie FRAGMENT / każde orzeczenie
             ma dołączony link z Text Fragment (🔗), skonstruowany w TEJ
             odpowiedzi z treści właśnie zwróconej przez narzędzie?
□ [KOTWICA-TEKSTOWA] Czy przy każdym 🔗 podano zastrzeżenie (a)/(b)/(c)
             z shared/PRAWO-HARDGATE.md KROK 5A, zamiast przedstawiać link jako
             gwarantowany?
□ [RZĄD] Czy KAŻDY link/URL w odpowiedzi (nie tylko 🔗) ma przypisaną
             kategorię RZĄD 1/2A/2B/3 wg `shared/HIERARCHIA-ZRODEL.md`?
□ [RZĄD] Czy źródła Rządu 3 mają sprawdzoną datę (>24 mies. → ostrzeżenie)
             i są skrzyżowane z Rzędem 1/2A przed użyciem jako poparcia tezy?
```

### Dodaj do REGUŁ NADRZĘDNYCH routera (punkt 14):

```
14. WERYFIKACJA-ŚLAD: Każdy artykuł / liczba / termin / orzeczenie musi mieć znacznik
    ✅ [VER: źródło, data] (po narzędziu) lub ⚠️ [NIEWERYFIKOWANE] (brak dostępu).
    ⛔ ZAKAZ oznaczania VER bez wywołania web_search / web_fetch.
    ⛔ Dla FRAGMENT/orzeczeń — dołącz też 🔗 [KOTWICA-TEKSTOWA], procedura
       kanoniczna w `shared/PRAWO-HARDGATE.md` KROK 5A (SCALONE 2026-07-15c —
       nie duplikuj tutaj), zbudowaną w tej samej odpowiedzi, z zastrzeżeniem
       o ograniczonym wsparciu przeglądarek i braku gwarancji trwałości
       dopasowania.
```

---

## CHANGELOG

**1.5 (2026-07-15c) — SCALENIE: KOTWICA-TEKSTOWA przeniesiona do shared/PRAWO-HARDGATE.md:**
- Wykryto: mechanizm KOTWICA-TEKSTOWA (Text Fragment `#:~:text=`) powstał
  tutaj 2026-07-15 niezależnie od KROK 5A w `shared/PRAWO-HARDGATE.md`,
  dodanego TEGO SAMEGO DNIA — dwie osobne implementacje tego samego
  problemu (link do konkretnego miejsca w źródle) w dwóch plikach shared/.
  Zgłoszone przez użytkownika po incydencie: odpowiedź z modułu karnego
  (dr-03) nie zastosowała żadnej z dwóch wersji.
- Naprawa: pełna treść (Text Fragment, KT-1→KT-4, RZĄD, zastrzeżenie
  o przeglądarkach, FALLBACK) przeniesiona do `PRAWO-HARDGATE.md` KROK 5A
  (2.2→2.3), scalona z istniejącą tam treścią o numerach strony/tezy/
  nagłówka. Ten plik zachowuje wyłącznie krótkie odesłanie w miejscu
  dawnej pełnej sekcji, plus poprawione odesłania w GRADIENCIE i KROK W-3b
  (dotąd wskazywały "patrz wyżej" na treść, która po scaleniu już tu nie
  jest pełna).
- Ten plik (WERYFIKACJA-SLAD.md) pozostaje kanoniczny dla: znaczników
  ✅/⚠️ [VER/NIEWERYFIKOWANE], GRADIENTU (ISTNIENIE/TREŚĆ/FRAGMENT),
  formatu tabeli śladu, SVG (usuwanie znaczników z dokumentów finalnych).
  `PRAWO-HARDGATE.md` jest kanoniczny dla: samego mechanizmu kotwicy
  (jak zbudować link), niezależnie od tego, który plik ustala WYMÓG
  jej zastosowania.
- Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis
  AUDYT-2026-07-15c.
- Wersja 1.4 → 1.5.

**1.4 (2026-07-15b):**
- **Naprawa: brak obowiązkowej kategoryzacji RZĄD przy linkach.** Zgłoszone
  przez użytkownika: w poprzedniej turze podano link 🔗 (kotwica tekstowa)
  bez kategoryzacji źródła wg hierarchii RZĄD 1/2A/2B/3 — mechanizm ten
  istniał już w systemie, ale wyłącznie lokalnie w `analizator-przepisow-v2`
  i nie był ładowany/wymuszany w kontekście tego pliku ani w odpowiedziach
  generowanych poza tym skillem.
- **Naprawa systemowa (nie punktowa):** hierarchia źródeł wydzielona do
  nowego kanonicznego pliku `shared/HIERARCHIA-ZRODEL.md`, współdzielonego
  przez ten plik, `shared/PRAWO-HARDGATE.md` i `analizator-przepisow-v2`
  (który teraz się do niego odsyła zamiast duplikować treść).
- Dodano wymóg RZĄD do sekcji KOTWICA-TEKSTOWA (kategoryzacja OBOK 🔗,
  nie zamiast), do formatu śladu weryfikacji i do SELF-CHECK.
- Wersja 1.3 → 1.4.

**1.3 (2026-07-15):**
- Dodano sekcję **🔗 KOTWICA-TEKSTOWA (Text Fragment)** — na wyraźne życzenie
  użytkownika, po tym jak w rozmowie przetestowano ręcznie skonstruowany link
  `#:~:text=...` i porównano go z natywnym mechanizmem cytowania Claude
  (tag `` z indeksem dokument-zdanie). Ustalono, że to dwa różne
  mechanizmy: natywne cytowanie jest weryfikowalne wewnątrz rozmowy, ale nie
  gwarantuje przewinięcia żywej strony po kliknięciu; Text Fragment adresuje
  właśnie ten drugi przypadek, kosztem braku gwarancji (przeglądarka, trwałość
  treści strony).
- Nowy znacznik `🔗 [KOTWICA-TEKSTOWA: URL#:~:text=…]` w tabeli statusów —
  TOWARZYSZY dotychczasowym ✅/🟢, nie zastępuje ich. Poziom weryfikacji
  (ISTNIENIE/TREŚĆ/FRAGMENT) nadal ustala WYŁĄCZNIE GRADIENT.
- Nowy krok **KT-1→KT-4** (procedura konstrukcji) oraz **KROK W-3b** w
  sekwencji obowiązkowej — kotwica tekstowa musi być budowana w tej samej
  odpowiedzi co web_fetch/web_search źródła, nie doklejana post factum bez
  ponownego odczytu.
- Rozszerzony SELF-CHECK o dwa punkty kontrolne dla KOTWICA-TEKSTOWA.
- Zastrzeżenie obowiązkowe wprowadzone jako twardy wymóg: ZAKAZ prezentowania
  linku jako gwarantowanego — zawsze z zastrzeżeniem o wsparciu przeglądarek
  (Chromium tak, Safari/Firefox nie gwarantowanie) i możliwej dezaktualizacji
  treści strony źródłowej.
- Dodano **FALLBACK** (na wyraźne życzenie użytkownika): gdy konstrukcja
  kotwicy tekstowej zawodzi (fragment za długi/nieregularny, treść z PDF-a,
  brak pewności unikalności dopasowania) → nie twórz jej "na siłę", podaj
  wyłącznie zwykły link do strony źródłowej, bez znacznika 🔗, z wyraźną
  adnotacją że to link do strony, nie do fragmentu.
- Wersja 1.2 → 1.3.
