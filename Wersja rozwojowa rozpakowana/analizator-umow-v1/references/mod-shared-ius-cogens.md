# MODUŁ SHARED — NORMY BEZWZGLĘDNIE OBOWIĄZUJĄCE (IUS COGENS) I EFEKT KUMULATYWNY
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** MODUŁ C (ocena zgodności z prawem) w `mod-core-checklist.md`,
> `workflows/ocena-drugiej-strony.md`, lub gdy podejrzewasz, że klauzula nie
> jest tylko niekorzystna, ale **nieważna z mocy prawa**.
>
> **Geneza (2026-08-02):** `mod-shared-abusive-clauses.md` pokrywa wyłącznie
> abuzywność B2C (art. 385¹–385³ KC) i dyrektywy unijne konsumenckie. Nie było
> w systemie skonsolidowanego katalogu **granic swobody umów w B2B** — norm,
> których nie da się wynegocjować, bo prawo tego nie dopuszcza, niezależnie od
> statusu stron. `mod-core-checklist.md` C.2 ma już generyczną hierarchię
> 4 poziomów naruszeń — ten moduł dostarcza do niej konkretny katalog
> (poziom 1) i procedurę dla przypadków granicznych.

---

## IC.1 GRANICE SWOBODY UMÓW (art. 353¹ KC)

Swoboda umów ma trzy granice: **ustawę, właściwość (naturę) stosunku prawnego
i zasady współżycia społecznego.** Klauzula, która przekracza te granice, jest
**nieważna** (art. 58 § 1 lub § 3 KC — weryfikuj brzmienie przez R1) —
niezależnie od tego, co strony podpisały i czy klauzula była negocjowana.
To inna kategoria wady niż "ryzyko biznesowe" z Modułu D: nie da się jej
wynegocjować ani zaakceptować świadomie, bo prawo na to nie pozwala.

## IC.2 KATALOG TYPOWYCH PRÓB OBEJŚCIA — bramka wstępna

Przeskanuj umowę pod kątem klauzul próbujących wyłączyć lub obejść poniższe
normy. Trafienie = 🔴 automatycznie (naruszenie normy bezwzględnej to
nieważność, nie "ryzyko do rozważenia"). **Każdy artykuł zweryfikuj przez R1
przed umieszczeniem w raporcie — poniższa tabela to mapa robocza, nie źródło
do cytowania z pamięci.**

| Czego nie można (norma bezwzględna) | Typowa próba obejścia w tekście umowy |
|---|---|
| wyłączyć odpowiedzialności za szkodę wyrządzoną **umyślnie** (art. 473 § 2 KC) | „nie ponosi odpowiedzialności za jakiekolwiek szkody" / limit obejmujący wprost winę umyślną |
| zastrzec karę umowną za zobowiązanie **pieniężne** (art. 483 § 1 KC) | „kara umowna za opóźnienie w zapłacie" (należą się odsetki, nie kara) |
| pozbawić dłużnika prawa żądania **miarkowania** rażąco wygórowanej kary (art. 484 § 2 KC) | „Strony wyłączają możliwość miarkowania kary umownej" |
| umownie skrócić/wydłużyć **terminy przedawnienia** (art. 119 KC) | „roszczenia przedawniają się po 6 miesiącach", gdy ustawa daje dłużej |
| zbyć/zrzec się **autorskich praw osobistych** — niezbywalne (art. 16 PrAut) | „przenosi wszelkie prawa autorskie, w tym osobiste" (można zobowiązać do niewykonywania, nie przenieść) |
| przenieść praw majątkowych **bez wskazania pól eksploatacji** (art. 41 ust. 2 PrAut) | „przenosi wszelkie prawa bez ograniczeń" — brak katalogu pól = brak skutku rozporządzającego |
| dowolnie wydłużać **terminy zapłaty** B2B ponad granice ustawy o przeciwdziałaniu nadmiernym opóźnieniom | „termin płatności 120 dni" bez uzasadnienia niebudzącego rażącej nieuczciwości wobec wierzyciela |
| powierzyć przetwarzanie danych osobowych **bez umowy powierzenia** (art. 28 RODO) | „Wykonawca może przetwarzać dane w dowolnym celu" / trenowanie modelu AI na danych klienta bez podstawy |
| ukształtować stosunek sprzecznie z **zasadami współżycia społecznego** (art. 353¹ + 58 § 2 KC) | rażąca, jednostronna asymetria bez uzasadnienia gospodarczego |

**Uwaga B2B vs konsument:** rękojmię **można** w B2B umownie ograniczyć lub
wyłączyć (art. 558 § 1 KC) — to nie jest naruszenie ius cogens w tej relacji.
Wobec konsumenta — nie można. Nie myl obu reżimów.

## IC.3 TRIGGER MIKROPRZEDSIĘBIORCY (art. 385⁵ KC)

Od 2021 r. część ochrony konsumenckiej (klauzule niedozwolone, art. 385¹–385³
KC) rozciąga się na **osobę fizyczną prowadzącą jednoosobową działalność
gospodarczą**, gdy umowa jest bezpośrednio związana z tą działalnością, ale
**nie ma dla niej charakteru zawodowego** (art. 385⁵ KC — zweryfikuj numer
i treść przed cytowaniem).

**Kiedy podnieść:** jedna ze stron B2B to jednoosobowa firma, a przedmiot
umowy leży poza jej zwykłą specjalizacją (np. software house sprzedający
usługę IT jednoosobowej kancelarii adwokackiej — dla kancelarii to nie jest
umowa "zawodowa"). Wtedy uruchom **dodatkowo** skan pod kątem klauzul
abuzywnych z `mod-shared-abusive-clauses.md`, mimo że formalnie to umowa B2B.

## IC.4 TEST KLAUZULI GRANICZNEJ — efekt kumulatywny

Dla klauzul **granicznych** (nieoczywiste naruszenie, ale podejrzenie
abuzywności / nadużycia prawa / sprzeczności z zasadami współżycia)
przeprowadź test pięciopunktowy. Podstawy do weryfikacji: art. 385¹ KC
(abuzywność), art. 5 KC (nadużycie prawa), art. 58 § 2 KC (sprzeczność
z zasadami współżycia).

1. **Treść obiektywna** — co klauzula realnie znaczy i jaki daje efekt,
   niezależnie od nazwy nadanej jej w umowie?
2. **Sposób wprowadzenia** — wzorzec narzucony (adhezyjny) czy indywidualnie
   negocjowany? Klauzule nienegocjowane oceniaj surowiej.
3. **Asymetria stron** — czy klauzula rażąco faworyzuje jedną stronę bez
   uzasadnienia gospodarczego? Uwzględnij trigger mikroprzedsiębiorcy (IC.3).
4. **Praktyka rynkowa** — czy odbiega od standardu rynkowego dla tego typu
   umowy w tej branży?
5. **Efekt kumulatywny** — krok, którego nie daje ocena pojedynczej klauzuli:
   nawet jeśli każda klauzula z osobna jest dopuszczalna, czy ich **suma**
   tworzy niedopuszczalną całość (systemowa asymetria, wydrążenie
   zobowiązania z treści, obejście ochrony przez rozproszenie po kilku
   paragrafach)?

**Jak raportować efekt kumulatywny:** wskaż *zestaw* klauzul, nie pojedynczą,
i opisz, jak razem przechylają umowę — np. „§ 5 (cap) + § 7 (wyłączenie
lucrum cessans) + § 11 (jednostronne prawo do zmiany zakresu) łącznie
pozbawiają Zamawiającego realnego środka ochrony, mimo że każda z osobna
mieści się w granicach dopuszczalności".

## IC.5 Jak używać w audycie (Moduł C i D)

```
1. PRZED oceną per-kategoria (Moduł B) — przebiegnij katalog IC.2.
   Trafienie → 🔴 od razu, bo to nieważność, nie "ryzyko do rozważenia"
   (POZIOM 1 hierarchii z mod-core-checklist.md C.2).
2. Sprawdź trigger mikroprzedsiębiorcy (IC.3) — jeśli aktywny, dołącz skan
   abuzywności z mod-shared-abusive-clauses.md, mimo formalnie B2B.
3. Klauzule graniczne → test pięciopunktowy IC.4, z naciskiem na krok 5.
4. Werdykt: klauzula nieważna z mocy prawa ZAWSZE przesuwa ocenę triage do
   🔴 (`workflows/triage-szybki.md`) — nieważność nie podlega miarkowaniu
   przez "kontekst" ani "praktykę rynkową".
```

## Powiązania

- Abuzywność B2C i dyrektywy unijne konsumenckie — `mod-shared-abusive-clauses.md`
  (ten plik jej NIE zastępuje, uzupełnia o B2B i efekt kumulatywny).
- Hierarchia poziomów naruszenia — `mod-core-checklist.md` Moduł C.2 (ten
  plik dostarcza konkretny katalog do POZIOMU 1 tej hierarchii).
- Miarkowanie kar umownych — `mod-shared-fallback-library.md` FL.3.
