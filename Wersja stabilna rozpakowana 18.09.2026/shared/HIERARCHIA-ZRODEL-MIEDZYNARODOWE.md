# HIERARCHIA-ZRODEL-MIEDZYNARODOWE — Źródła i kanały dostępu (UP-5)

> **Plik kanoniczny:** `shared/HIERARCHIA-ZRODEL-MIEDZYNARODOWE.md`
> **Wersja:** 1.0 | Utworzony: 2026-09-05 (F-162)
> **Wywołują:** `prawny-router-v3` (UP-5), `dr-14`, `MIEDZYNARODOWE-GATES.md`
> **Odpowiednik krajowy:** `shared/HIERARCHIA-ZRODEL.md` (ELI/ISAP/EUR-Lex)

---

## 1. HIERARCHIA RZĘDÓW

```
RZĄD 1  Publikator albo depozytariusz — pełny tekst odczytany, nie snippet
        · EUR-Lex (CELEX) — prawo UE, umowy międzynarodowe UE, orzeczenia TSUE
        · legal.un.org — Statut Rzymski, teksty KPM (ARSIWA), KWPT
        · treaties.un.org — UNTS, status ratyfikacji, zastrzeżenia
        · strona depozytariusza traktatu (np. ICSID → Bank Światowy)
        · HUDOC — orzeczenia ETPC
        · oficjalne PDF organizacji traktatowej (np. UNOOSA ST/SPACE/11)

RZĄD 2A Baza akademicka odtwarzająca tekst autentyczny, z podaniem źródła
        · cisg-online.org, Pace CISG Database
        · oficjalna strona sekretariatu konwencji, gdy tekst dostępny tylko
          przez snippet wyszukiwania (np. cites.org przy blokadzie bota)

RZĄD 2B Dokument organu traktatowego cytowany pośrednio
        · rezolucja ZP / decyzja COP powołana w opracowaniu, bez odczytu
          pełnego tekstu

RZĄD 3  Komentarz kancelaryjny, blog prawniczy, opracowanie wtórne
        · dopuszczalne WYŁĄCZNIE dla reguł proceduralnych instytucji
          arbitrażowych i dla sygnalizowania stanu dyskusji
        · NIGDY jako jedyna podstawa rozstrzygnięcia materialnego
```

⛔ Znacznik rzędu jest obowiązkowy przy każdym powołaniu. Format:
`✅ [VER: domena, dokument, jednostka, RZĄD n, data]`
albo `⚠️ [ZALECANA WERYFIKACJA / NIEWERYFIKOWANE — powód]`.

⛔ Rząd źródła **nie zmienia siły argumentu** — zob. `shared/MOD-REM-GATE.md`
§REM-3. Zmienia wyłącznie status powołania.

---

## 2. KANAŁ DOSTĘPU — STAN ZMIERZONY (2026-09-05)

> ⛔ **KOREKTA WOBEC WCZEŚNIEJSZEGO BRZMIENIA UP-5.** Reguła głosiła, że
> `bash_tool`/`curl` „NIE sięga domen międzynarodowych". Zmierzone: to jest
> nieprawda dla części domen. Twierdzenie było analogiczne do luki F-151
> (fałszywa diagnoza niedostępności kanału).

```
DZIAŁA przez curl (HTTP 200, pełny tekst):
  eur-lex.europa.eu       ← preferowany kanał dla prawa UE ORAZ dla umów
                            międzynarodowych zawartych przez UE: teksty
                            konwencji bywają załączone do decyzji Rady
                            (KRB → CELEX 21993A1213(01);
                             Nagoja → CELEX 22014A0520(01);
                             Aarhus → CELEX 22005A0517(01))
  legal.un.org            ← Statut Rzymski (/icc/statute/…), teksty KPM,
                            KWPT (PDF → pdftotext)

BLOKADA MASZYNOWA — użyj web_search → web_fetch:
  unoosa.org              ← domena na liście, ale przekierowuje na
                            www.unoosa.org, którego na liście NIE MA (403)
  uncitral.un.org         ← przerwy serwisowe (stan 2026-09)
  cites.org               ← detekcja bota; tekst konwencji tylko przez snippet
  icsid.worldbank.org     ← 403 na curl, działa przez web_fetch
  rm.coe.int              ← 403 na wybranych ścieżkach
  ohchr.org               ← poza listą dozwoloną
```

⛔ **Zanim orzekniesz o niedostępności — sprawdź kształt żądania** wg
`shared/DOSTEP-MASZYNOWY-API.md §1` (neutralny User-Agent, nagłówek Accept,
ścieżka robocza, ponowienie). Sprawdź też wariant bez `www.` i z `www.`:
przekierowanie między nimi bywa jedyną przyczyną 403.

⛔ **PRÓBA DWUKANAŁOWA JEST OBOWIĄZKOWA** (`shared/MOD-REM-GATE.md` §REM-0,
F-164). Kanał kodu i kanał pobierania mają **różne listy dozwolonych domen**;
odmowa w jednym nie dowodzi niczego o drugim. Zmierzone 2026-09-05:

| Domena | curl | web_fetch | Wniosek |
| --- | --- | --- | --- |
| `eur-lex.europa.eu` | 200 | 200 | RZĄD 1 oboma kanałami |
| `legal.un.org` | 200 | 200 | RZĄD 1 oboma kanałami |
| `treaties.un.org` | 200 | — | RZĄD 1 przez curl |
| `ohchr.org` | **403** | **✅ RZĄD 1** | ⚠️ curl myli — użyj web_fetch |
| `un.org` (DESA, PDF) | — | ✅ RZĄD 1 | web_fetch |
| `icsid.worldbank.org` | 403 | ✅ RZĄD 1 | web_fetch |
| `unoosa.org` | 403 (przekier. na `www.`) | ✅ | web_fetch |
| `cites.org` | 403 | 403 detekcja bota | porażka realna → RZĄD 2A |
| `asp.icc-cpi.int` | 403 | 403 detekcja bota | porażka realna → RZĄD 2B |
| `uncitral.un.org` | prace serwisowe | prace serwisowe | porażka czasowa |

Wiersz `ohchr.org` jest tu najważniejszy: pod curl wygląda jak domena
zablokowana, a przez `web_fetch` wydaje pełne teksty MPPOiP, Konwencji MOP
nr 169 i UNDRIP. Trzy powołania oznaczone w partii P4 jako niezweryfikowane
były pobieralne przez cały czas.

⛔ **Nie kopiuj tej listy jako prawdy trwałej.** Listy dozwolonych domen
i stan serwisów się zmieniają. Lista jest punktem startu, nie substytutem
pomiaru — a wynik pomiaru odbiegający od tej tabeli zgłoś jako flagę.

---

## 3. ŚCIEŻKI SZYBKIEGO DOSTĘPU

```
Prawo UE i orzeczenia TSUE
  curl "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:{celex}"
  TFUE skonsolidowany → 12016E/TXT · KPP → 12016P/TXT
  orzeczenie → 6{RRRR}CJ{NNNN} (Achmea → 62016CJ0284)

Statut Rzymski
  curl "https://legal.un.org/icc/statute/99_corr/cstatute.htm"

ARSIWA / KWPT
  curl "https://legal.un.org/ilc/texts/instruments/english/draft_articles/9_6_2001.pdf"
  curl "https://legal.un.org/ilc/texts/instruments/english/conventions/1_1_1969.pdf"
  → pdftotext -layout

Traktaty kosmiczne
  web_search → web_fetch UNOOSA ST/SPACE/11 (zbiór wszystkich pięciu)

Status ratyfikacji i zastrzeżenia
  treaties.un.org (MTDSG) — obowiązkowe dla MG-1.1 i MG-1.4
```

---

## 4. CZEGO NIE WOLNO

```
⛔ powoływać reguły materialnej wyłącznie na źródle RZĘDU 3
⛔ traktować konsolidacji na stronie prywatnej jako tekstu autentycznego
⛔ przyjmować, że tekst obecny w aktualnej wersji traktatu wiąże wszystkie
   strony — zob. MIEDZYNARODOWE-GATES.md §MG-1.2
⛔ orzekać o niedostępności kanału bez pomiaru (F-151, F-162)
⛔ redukować objętość argumentu z powodu niższego rzędu źródła (REM-3)
```
