# HIERARCHIA-ZRODEL.md — Kanoniczna Kategoryzacja Źródeł (RZĄD 1/2/3)

> **Plik:** `/mnt/skills/user/shared/HIERARCHIA-ZRODEL.md`
> **Wersja:** 1.0 (2026-07-15) — wydzielone z `analizator-przepisow-v2/SKILL.md`
>              (Moduł 1, sekcja "Hierarchia źródeł") na kanoniczną lokalizację
>              współdzieloną, na wyraźne polecenie użytkownika po tym, jak
>              w rozmowie ujawniono, że kategoryzacja obowiązywała TYLKO
>              lokalnie w jednym skillu i nie była wymuszana przy linkach/
>              kotwicach generowanych poza tym skillem (np. w WERYFIKACJA-SLAD,
>              PRAWO-HARDGATE, dowolnym web_search poza kontekstem analizy
>              przepisu).
> **Status:** KANONICZNY — konsumenci: `analizator-przepisow-v2` (Moduł 1),
>              `shared/PRAWO-HARDGATE.md` (KROK 5/5A/5B, BRAMKA WTÓRNE-
>              ŹRÓDŁO-STOP), `shared/WERYFIKACJA-SLAD.md` (KOTWICA-TEKSTOWA,
>              tabela statusów śladu) — oraz KAŻDY inny skill/moduł, który
>              podaje użytkownikowi link/URL/kotwicę do źródła internetowego.
> **Zasada dedup:** to jest JEDYNA kanoniczna treść tej kategoryzacji.
>              Żaden inny plik nie powiela tej listy — odwołuje się tutaj.

---

## ZASADA NACZELNA

> ⛔ **OBOWIĄZEK KATEGORYZACJI** — każdy link/URL/kotwica podana użytkownikowi
> jako źródło (przepis, orzeczenie, komentarz, artykuł, blog, portal) MUSI
> mieć przypisaną kategorię RZĄD 1 / RZĄD 2A / RZĄD 2B / RZĄD 3 — niezależnie
> od tego, w którym skillu/module powstaje odpowiedź. Brak kategoryzacji przy
> podaniu linku jest błędem tego samego rzędu co brak znacznika ✅ [VER] /
> ⚠️ [NIEWERYFIKOWANE] z `shared/WERYFIKACJA-SLAD.md` — te dwa mechanizmy
> działają RAZEM (jeden mówi CZY zweryfikowano, drugi mówi JAK WIARYGODNE
> jest źródło samo w sobie).

---

## RZĄD 1 — PIERWSZORZĘDNE (wiążące, wyłączne dla BRZMIENIA przepisu)

1. ISAP — https://isap.sejm.gov.pl — PRIORYTET (tekst jednolity)
2. Sejm RP — https://www.sejm.gov.pl/prawo/prawo.htm
3. EUR-Lex — https://eur-lex.europa.eu — prawo UE implementowane w Polsce
4. UODO — https://uodo.gov.pl — przepisy o ochronie danych
5. BIP właściwego organu — dla rozporządzeń branżowych

Ten rząd dotyczy WYŁĄCZNIE brzmienia przepisu — obowiązuje tu
`shared/PRAWO-HARDGATE.md` bez wyjątków.

## RZĄD 2 — DRUGORZĘDNE

Oficjalne orzecznictwo, LEX/Legalis jako tekst przy licencji, ORAZ duże,
uznane portale prawnicze/branżowe (komentarz i interpretacja o niskim
ryzyku dezaktualizacji, redakcja profesjonalna).

**2A — oficjalne, wykonawcze/orzecznicze (znacznik ✅ [VER: ...]):**
- Orzecznictwo z oficjalnych baz sądowych: sn.pl, orzeczenia.ms.gov.pl,
  orzeczenia.nsa.gov.pl, trybunal.gov.pl, saos.org.pl (pomocniczo) —
  procedura wyłącznie wg `shared/PRAWO-HARDGATE.md`.
- LEX (sip.lex.pl) i Legalis (sip.legalis.pl) jako ŹRÓDŁO-2 dla BRZMIENIA
  przepisu, gdy ISAP niedostępny i kancelaria posiada aktywną licencję —
  równoważne ISAP wyłącznie w tej roli, zgodnie z `shared/PRAWO-HARDGATE.md`.

**2B — duże, uznane portale prawnicze/branżowe (komentarz/interpretacja,
znacznik 📚 [ŹRÓDŁO POMOCNICZE — RZĄD 2: ...], NIGDY brzmienie przepisu ani
dowód istnienia orzeczenia):** lista przykładowa, nie zamknięta:

- prawo.pl (Wolters Kluwer — portal informacyjny)
- lex.pl / sip.lex.pl (Wolters Kluwer LEX — w roli komentarza/glosy, nie tekstu)
- legalis.pl / sip.legalis.pl (C.H.Beck — w roli komentarza/monografii, nie tekstu)
- rp.pl (Rzeczpospolita, dział Prawo)
- infor.pl, lexlege.pl, arslege.pl — portale informacyjno-branżowe z
  systematyczną redakcją
- gazetaprawna.pl (Dziennik Gazeta Prawna)
- kadry.infor.pl (prawo pracy — komentarze praktyczne)
- poradnikprzedsiebiorcy.pl (prawo gospodarcze/podatkowe dla przedsiębiorców)
- money.pl (dział Prawo/Podatki)
- gofin.pl (Wydawnictwo Podatkowe GOFIN — podatki, rachunkowość, prawo pracy)
- standardyprawa.pl — agregator orzeczeń/komentarzy przy przepisach (redakcja
  tematyczna, aktualizowana)
- biznes.gov.pl — wyłącznie treści poradnikowe/informacyjne (odróżnij od
  aktów prawnych i oficjalnych interpretacji organów — te, gdy dostępne
  bezpośrednio na stronach urzędowych, np. podatki.gov.pl/eureka, należą
  do Rzędu 1/2A, nie do tej listy)
- inne duże portale o podobnym profilu: redakcja zawodowa/wydawnicza,
  systematyczna aktualizacja po nowelizacjach, rozpoznawalna marka —
  kryterium przynależności do 2B, nie do Rzędu 3.

Kryterium 2B vs Rząd 3: redakcja zawodowa + rozpoznawalna marka wydawnicza/
medialna + praktyka regularnej aktualizacji treści po zmianach przepisów →
niższe ryzyko dezaktualizacji niż Rząd 3, ale nadal NIE jest to wykładnia
wiążąca — zawsze 📚, nigdy ✅ [VER].

Ten rząd dotyczy WYŁĄCZNIE brzmienia przepisu — obowiązuje tu
`shared/PRAWO-HARDGATE.md` bez wyjątków.

## RZĄD 3 — TRZECIORZĘDNE (WYSOKIE RYZYKO DEZAKTUALIZACJI)

Strony indywidualnych prawników/kancelarii, blogi eksperckie, organizacje
NGO, fora, poradniki bez redakcji wydawniczej.

Obejmuje: strony własne adwokatów/radców/kancelarii (np. indywidualne
kancelarie adwokackie identyfikowalne po nazwisku prawnika w domenie lub
podtytule), blogi prawnicze, publikacje NGO, fora internetowe, poradniki
bez wskazanej redakcji lub daty aktualizacji. Cecha wspólna uzasadniająca
niższy rząd niż 2B: brak systematycznej redakcji wydawniczej i brak
gwarancji aktualizacji treści po nowelizacji — wpis mógł powstać przed
zmianą przepisu i nigdy nie zostać poprawiony.

**Przykłady typowego wzorca domeny RZĄD 3** (rozpoznawalne po nazwisku
prawnika, nazwie kancelarii lub ogólnym profilu "porady prawne"): strony
zawierające w adresie/nazwie nazwisko konkretnego adwokata/radcy, domeny
w stylu "adwokat-[miasto/nazwisko].pl", "kancelaria-[nazwisko].pl", ogólne
serwisy typu "sprawy-karne.biz.pl", "prawoity.pl" i podobne bez wskazanej
redakcji wydawniczej — lista nie jest zamknięta, kryterium decyduje ZAWSZE
brak redakcji + brak gwarancji aktualizacji, nie sama nazwa domeny.

### Zasady dodatkowe dla Rzędu 3 (ponad ogólny zakaz mieszania ról niżej)

```
1. Sprawdź datę publikacji/ostatniej aktualizacji treści.
   Brak daty lub data > 24 miesiące wstecz → dodaj ostrzeżenie
   "⚠️ możliwa dezaktualizacja — brak/dawna data publikacji".
2. NIGDY nie cytuj twierdzenia z Rzędu 3 jako samodzielnej podstawy —
   zawsze skrzyżuj z Rzędem 1 (tekst) lub 2A (orzecznictwo) przed użyciem.
   Jeśli nie da się skrzyżować (np. brak czasu/dostępu) → oznacz
   "⚠️ NIEPOTWIERDZONE W ŹRÓDLE WYŻSZEGO RZĘDU" i nie buduj na tym wniosku.
3. Dozwolone wyłącznie jako inspiracja do dalszego wyszukiwania (podobnie do
   BRAMKI WTÓRNE-ŹRÓDŁO-STOP dla orzeczeń w `shared/PRAWO-HARDGATE.md`) —
   nigdy jako ostateczne potwierdzenie stanu prawnego.
```

Uzupełniająco do Rzędu 1 (tekst) i Rzędu 2 (orzecznictwo/LEX-Legalis-tekst/
duże portale) — analiza MOŻE sięgać po Rząd 3, gdy wzbogaca kontekst
praktyczny lub wskazuje trop do dalszej weryfikacji, ale ZAWSZE z
zastrzeżeniami powyżej.

---

## ⛔ ZAKAZ MIESZANIA RZĘDÓW

```
- Dla BRZMIENIA przepisu → wyłącznie Rząd 1 lub Rząd 2A (LEX/Legalis-tekst,
  przy licencji) — Rząd 2B i Rząd 3 nigdy nie pełnią tej roli.
- Dla ISTNIENIA sygnatury orzeczenia → wyłącznie Rząd 2A (oficjalna baza
  sądowa, BRAMKA WTÓRNE-ŹRÓDŁO-STOP z `shared/PRAWO-HARDGATE.md`) — Rząd 2B
  i Rząd 3 nigdy nie potwierdzają istnienia orzeczenia, tylko wskazują trop.
- Dla INTERPRETACJI DOKTRYNALNEJ (np. rozszerzenie zakresu przepisu na
  podstawie poglądu prawniczego, nie samego brzmienia ustawy) → Rząd 2B/3
  wolno cytować WYŁĄCZNIE jako pogląd/informację pomocniczą, z jawnym
  znacznikiem, NIGDY jako ostateczne potwierdzenie wykładni.
```

## ZNACZNIK OBOWIĄZKOWY

Każdy fragment/link pochodzący z Rzędu 2B lub Rzędu 3 oznacz:

```
📚 [ŹRÓDŁO POMOCNICZE — RZĄD 2: nazwa portalu, autor jeśli podany, data]
— pogląd doktrynalny/informacyjny, nie wykładnia wiążąca

⚠️📚 [ŹRÓDŁO POMOCNICZE — RZĄD 3: nazwa strony/autor, data jeśli znana]
— WYSOKIE RYZYKO DEZAKTUALIZACJI, wymaga potwierdzenia w Rzędzie 1/2
```

Nie myl ze znacznikami HARDGATE / WERYFIKACJA-ŚLAD:

```
✅ [VER: ISAP / api.sejm.gov.pl, data]              → Rząd 1, tekst przepisu, wiążący
✅ [VER: sn.pl / orzeczenia.ms.gov.pl / ..., data]   → Rząd 2A, orzeczenie zweryfikowane oficjalnie
✅ [VER: LEX/Legalis, data]                          → Rząd 2A, tekst przepisu (tylko przy licencji)
📚 [ŹRÓDŁO POMOCNICZE — RZĄD 2: portal, data]        → Rząd 2B, duży portal, komentarz/informacja
⚠️📚 [ŹRÓDŁO POMOCNICZE — RZĄD 3: strona/autor, data] → Rząd 3, wysokie ryzyko dezaktualizacji
```

**Integracja z `WERYFIKACJA-ŚLAD.md`:** znacznik RZĄD i znacznik VER/GRADIENT
podaje się RAZEM — RZĄD mówi, jak wiarygodne jest źródło samo w sobie;
VER/GRADIENT mówi, czy i na jakim poziomie faktycznie zweryfikowano treść
wobec tego źródła. Przykład łączony:

```
art. 281 KK — kradzież rozbójnicza wobec osoby trzeciej
  📚 [ŹRÓDŁO POMOCNICZE — RZĄD 3: kdkadwokat.pl, 2020-12-13]
  🟢 [VER-TREŚĆ: kdkadwokat.pl, 2026-07-15] — teza skrzyżowana z brzmieniem
     art. 281 KK (Rząd 1, ISAP) — zgodna co do istoty
  🔗 [KOTWICA-TEKSTOWA: kdkadwokat.pl/.../#:~:text=Jako%20kradzie%C5%BC...]
```

## KOLIZJA Z ORZECZNICTWEM

Jeśli pogląd z Rzędu 2B/3 jest sprzeczny ze zweryfikowaną linią orzeczniczą
(Rząd 2A) → wyraźnie zaznacz rozbieżność w raporcie; priorytet
interpretacyjny ma zawsze Rząd 1/2A.

## GDZIE STOSOWAĆ RZĄD 2B / RZĄD 3

- Przy wykładni pojęć nieostrych — jako dodatkowy kontekst, obok (nie
  zamiast) wykładni orzeczniczej; Rząd 3 wyłącznie po skrzyżowaniu z
  Rzędem 1/2A.
- Przy wyjaśnieniach dla laika — komentarze (zwłaszcza 2B) ułatwiają
  przystępne, praktyczne wyjaśnienie.
- W raporcie końcowym — osobna podsekcja "Źródła pomocnicze (Rząd 2B/Rząd 3)",
  oddzielona od "Źródła normatywne i orzecznicze (Rząd 1/2A, zweryfikowane)".

---

## PROCEDURA — GDZIE I KIEDY STOSOWAĆ TEN PLIK

```
STOSUJ przy KAŻDYM linku/URL/kotwicy podanym użytkownikowi, niezależnie
od tego, który skill/moduł generuje odpowiedź:

  KROK H-1: Po otrzymaniu wyniku z web_search/web_fetch → zidentyfikuj
            domenę źródła.
  KROK H-2: Sklasyfikuj wg tabeli wyżej: Rząd 1 / 2A / 2B / 3.
            W razie wątpliwości między 2B a 3 → zastosuj kryterium
            (redakcja zawodowa + rozpoznawalna marka + systematyczna
            aktualizacja = 2B; brak któregokolwiek = 3).
  KROK H-3: Dołącz odpowiedni znacznik (✅/📚/⚠️📚) OBOK znacznika
            VER/GRADIENT z `shared/WERYFIKACJA-SLAD.md` i OBOK ewentualnej
            kotwicy tekstowej z sekcji KOTWICA-TEKSTOWA tamże.
  KROK H-4: Rząd 3 → dodatkowo sprawdź datę (zasada 1 wyżej) i skrzyżuj
            z Rzędem 1/2A (zasada 2 wyżej) przed użyciem jako poparcia tezy.

⛔ ZAKAZ pomijania KROK H-1→H-3 z powodu "to nie jest analiza przepisu,
   tylko cytowanie w innym kontekście" — kategoryzacja dotyczy KAŻDEGO
   linku źródłowego w systemie, nie tylko modułu analizy przepisów.
```
