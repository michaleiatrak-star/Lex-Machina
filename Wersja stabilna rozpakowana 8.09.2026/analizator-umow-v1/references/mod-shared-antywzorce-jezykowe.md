# MODUŁ SHARED — ANTYWZORCE JĘZYKOWE (PUŁAPKI PO BRZMIENIU)
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** MODUŁ B (analiza klauzul) w `mod-core-checklist.md`,
> `workflows/ocena-drugiej-strony.md`, audyt ryzyk cudzej umowy.
>
> **Geneza (2026-08-02):** system ma analizę **po kategorii** klauzuli
> (odpowiedzialność, kary, IP…) w Module B i `kategorie-klauzul-taksonomia.md`.
> Nie miał systematycznego skanu **po konkretnym sformułowaniu**, niezależnie
> od tego, w którym paragrafie się pojawia — a to właśnie ambiguity/vagueness
> (K. Adams, *A Manual of Style for Contract Drafting*, rozdz. „Sources of
> Uncertain Meaning", „Reasonable Efforts and Its Variants") jest częstym
> źródłem sporu, którego nie złapie ocena wyłącznie po kategorii merytorycznej.
> Ten moduł działa **prostopadle** do Modułu B: łapie ryzyko po brzmieniu.

---

## AJ.1 Zasada użycia

Wykrycie frazy z tabel poniżej to **sygnał do sprawdzenia kontekstu, nie
automatyczny werdykt**. Ta sama fraza bywa neutralna w jednym paragrafie
i groźna w innym — kolumna „co sprawdzić" mówi, jak to rozstrzygnąć. Lista
jest **otwarta**: brak frazy na liście nie znaczy, że zapis jest bezpieczny.

## AJ.2 Zobowiązania rozmyte (obietnica bez mierzalnej treści)

| Fraza | Pułapka | Co sprawdzić |
|---|---|---|
| „dołoży starań", „dołoży należytych starań" | staranne działanie zamiast rezultatu | Jeśli obowiązek miał być rezultatem (wdrożenie, dostawa w terminie) — fraza go degraduje do starannego działania; trudniej dochodzić niewykonania. Sprawdź, czy strona chce rezultatu — jeśli tak, żądaj „zobowiązuje się do [rezultat]". |
| „w miarę możliwości", „o ile to możliwe", „w rozsądnym terminie" | brak twardego progu | Kto ocenia „możliwości"/„rozsądek"? Zamień na konkretny termin lub warunek weryfikowalny obiektywnie. |
| „niezwłocznie" bez liczby dni | termin nieoznaczony | Źródło sporu — każda strona rozumie inaczej. Żądaj liczby dni. Wyjątek: ustawa literalnie posługuje się tym pojęciem i termin nie może być inny (zob. `style-format-generowania.md` S.1). |
| „na bieżąco", „okresowo", „regularnie" | częstotliwość nieoznaczona | Brak egzekwowalnego harmonogramu — doprecyzuj interwał (np. „raz w miesiącu, do 5. dnia roboczego"). |

## AJ.3 Jednostronna władza (uznaniowość bez kryteriów)

| Fraza | Pułapka | Co sprawdzić |
|---|---|---|
| „według wyłącznego uznania", „w każdym czasie i bez podania przyczyny" | uznaniowość bez standardu | Jedna strona decyduje bez kryteriów. Przy blokadzie usługi, zmianie warunków, akceptacji odbioru — rażąca asymetria; żądaj obiektywnych przesłanek. |
| „może, ale nie jest zobowiązany" | pozorne zobowiązanie | Uprawnienie udające obowiązek — druga strona nie może na nim polegać. Sprawdź, czy miało być prawdziwym obowiązkiem. |
| „zastrzega sobie prawo do…" (bez trybu i granic) | jednostronna zmiana | Często ukrywa prawo do jednostronnej zmiany istotnych warunków. Sprawdź granice i tryb notyfikacji (przy wzorcach umownych — art. 384¹ KC, zweryfikuj przez R1). |
| „z przyczyn leżących po stronie…" bez katalogu | przerzucenie ryzyka | Otwarta formuła obciążająca jedną stronę nieokreślonym zbiorem zdarzeń. Żądaj zamkniętego katalogu przyczyn. |

## AJ.4 Rozdmuchanie / zawężenie zakresu

| Fraza | Pułapka | Co sprawdzić |
|---|---|---|
| „w tym w szczególności", „między innymi" przy obowiązkach klienta | zakres otwarty w górę | Lista przykładowa obowiązków = obowiązki praktycznie nieograniczone. Przy obowiązkach strony chronionej domagaj się katalogu zamkniętego. |
| „wszelkie", „jakiekolwiek", „nieograniczone" przy odpowiedzialności/licencji/danych | zakres maksymalny | Sprawdź, czy to nie próba obejścia capu odpowiedzialności, pól eksploatacji (art. 41 ust. 2 PrAut — zob. `mod-shared-ius-cogens.md` IC.2) lub zasady minimalizacji danych RODO. |
| „niezależnie od pozostałych postanowień", „bez względu na inne zapisy" | cicha nadpisanie | Klauzula wyłączająca inne postanowienia może po cichu ubezskutecznić cap, karę lub wyłączenia gdzie indziej w dokumencie. Cross-check z resztą umowy (`mod-shared-model-umowy.md` MU.2 — graf zależności). |
| „trwałe", „nieodwołalne", „bezterminowe" przy licencji/zgodzie | brak wyjścia | Zobowiązanie bez końca i bez możliwości cofnięcia — sprawdź adekwatność do ekwiwalentu i dopuszczalność w danym reżimie prawnym. |

## AJ.5 Przerzucenie ryzyka i kosztów

| Fraza | Pułapka | Co sprawdzić |
|---|---|---|
| „na własny koszt i ryzyko" | cichy transfer kosztów | Sprawdź, czy koszt/ryzyko nie powinno leżeć po drugiej stronie lub być dzielone. |
| „zwolni z wszelkiej odpowiedzialności", „zabezpieczy przed wszelkimi roszczeniami" (indemnity bez limitu) | indemnifikacja bez limitu | Otwarte hold-harmless potrafi obejść cap odpowiedzialności ustalony gdzie indziej. Sprawdź limit, wyłączenia, wzajemność — `mod-shared-fallback-library.md` FL.2. Dwa dodatkowe testy dla klauzul indemnity wzorowanych na common law (częste w umowach IT/SaaS pisanych po angielsku lub tłumaczonych): (1) czy klauzula wyraźnie wyłącza obowiązek minimalizacji szkody (mitigation) — bez wyraźnego wyłączenia, strona poszkodowana i tak musi minimalizować szkodę; (2) czy indemnity obejmuje straty spowodowane zaniedbaniem (negligence) strony żądającej ochrony — bez wyraźnego zapisu zwykle nie obejmuje. Punkty niezależnie potwierdzone jako publikowana praktyka kancelaryjna (Trinity International LLP, „Golden rules for drafting indemnities") — potraktuj jako sygnał do sprawdzenia, nie jako regułę prawa polskiego: KC nie zna „indemnity" jako odrębnej instytucji, więc skutek takiej klauzuli w polskim reżimie wymaga kwalifikacji przez pryzmat art. 353¹ KC (swoboda umów) i ewentualnie art. 473 KC — zweryfikuj przez R1 zamiast zakładać import zasad common law wprost. |
| „odpowiada jak za własne działania" (bez ograniczeń, przy podwykonawcach) | odpowiedzialność za osoby trzecie bez granic | Sprawdź współmierność (art. 474 KC — zweryfikuj) i czy nie obejmuje operatorów spoza faktycznej kontroli strony (np. dostawców chmury). |
| „kara umowna nie wyłącza dochodzenia odszkodowania przewyższającego" (jednostronnie) | kumulacja sankcji | Sprawdź symetrię i ryzyko uznania za rażąco wygórowaną (art. 484 § 2 KC — miarkowanie, `mod-shared-ius-cogens.md` IC.2). |

## AJ.6 Pozorna wzajemność i definicje-wytrychy

| Fraza / wzorzec | Pułapka | Co sprawdzić |
|---|---|---|
| „Strony wzajemnie…" + sankcje/obowiązki realnie tylko na jedną stronę | fałszywa symetria | Cross-check: czy kary/obowiązki faktycznie obciążają obie strony, czy tylko jedną pod płaszczykiem wzajemności. |
| pojęcie pisane Wielką Literą bez definicji w słowniczku | definicja-widmo | Narusza Regułę 1 z `mod-shared-zlote-reguly.md` — termin traktowany jak zdefiniowany, którego nie zdefiniowano. |
| ta sama rola nazwana różnie w dokumencie („Specjalista"/„Konsultant"/„Wykonawca") | dryf terminologiczny | Narusza Regułę 2 z `mod-shared-zlote-reguly.md` — ujednolić nazewnictwo. |
| „zgodnie z obowiązującymi przepisami" jako całość opisu obowiązku | obowiązek pusty | Odesłanie do „przepisów" bez wskazania których = brak konkretnej, egzekwowalnej treści. Sprawdź, czy nie zastępuje realnego zobowiązania. |

## AJ.7 Jak używać w audycie

```
1. Po identyfikacji ryzyk po kategoriach (Moduł B, krok analizy klauzul) —
   przeskanuj tekst umowy pod kątem fraz z AJ.2–AJ.6.
2. Każde trafienie zważ w kontekście — sygnał, nie automatyczny wyrok.
3. Trafienie istotne → dołącz do raportu z flagą 🔴/🟠/🟡 (Moduł D), z
   rekomendacją i fallbackiem (minimalne akceptowalne brzmienie kierunkowo,
   `mod-shared-fallback-library.md` / `mod-shared-alt-drafts.md`).
4. AJ.6 wiersz 2–3 (definicja-widmo, dryf terminologiczny) — jeśli trafienie,
   zgłoś też jako naruszenie formalne wg `mod-shared-zlote-reguly.md`
   (Reguły 1–2), niezależnie od oceny merytorycznej ryzyka.
```

## Powiązania

- Analiza po kategorii merytorycznej klauzuli (nie po brzmieniu) —
  `mod-core-checklist.md` Moduł B, `generator/kategorie-klauzul-taksonomia.md`.
- Normy bezwzględne, których obejście często kryje się za tymi frazami —
  `mod-shared-ius-cogens.md`.
- Reguły formalne redakcji (definicje, terminologia) — `mod-shared-zlote-reguly.md`.
