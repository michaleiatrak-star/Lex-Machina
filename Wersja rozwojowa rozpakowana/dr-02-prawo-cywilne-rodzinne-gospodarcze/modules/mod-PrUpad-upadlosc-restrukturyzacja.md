# Upadłość i restrukturyzacja — kwalifikacja i nawigacja

**Hasła spraw:** upadłość konsumencka, ogłoszenie upadłości, niewypłacalność, plan spłaty wierzycieli, oddłużenie, syndyk, restrukturyzacja firmy

**Status:** moduł klasy kancelaryjnej — poziom DR-03

Źródło: [urzędowy tekst jednolity, Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf).
Opracowanie na podstawie korpusu pobranego 04.10.2026. Przed zastosowaniem odczytaj
przepis przez `python3 scripts/prup.py article NUMER --verify-online` oraz
`references/insolvency/wersje-i-przepisy-przejsciowe.md`. Dobór prawa do sprawy
wymaga dat zdarzeń; data pobrania PDF nie rozstrzyga przepisów przejściowych.
Każdy artykuł i wyjątek pozostaje dostępny w indeksie `references/prup/index.json`.

## Dane wejściowe

Dłużnik, status prawny/działalność, reprezentacja, główna działalność i majątek,
wymagalne długi i ich sporność, zabezpieczenia, egzekucje, płynność,
wcześniejsze postępowania, wnioski i dzień układowy. Najpierw zdolność
upadłościowa/restrukturyzacyjna, potem przesłanki i wybór trybu.

Prawo upadłościowe wymaga niewypłacalności (10–11), restrukturyzacja dopuszcza
również zagrożenie niewypłacalnością (6 PrRestr). Domniemanie opóźnienia
przekraczającego trzy miesiące nie jest terminem do złożenia wniosku.
Termin obowiązku z art. 21 PrUp licz od powstania podstawy, z uwzględnieniem
podmiotu zobowiązanego i właściwych wyjątków. Sprawdź zbieg postępowań
(9a–9b PrUp i 11–13 PrRestr) oraz przepisy przejściowe.

## Pełny tekst obu ustaw

- Upadłość: `mod-PrUpad-zrodla-i-wersje.md`, czytnik `scripts/prup.py`.
- Restrukturyzacja: `mod-PrRestr-zrodla-i-wersje.md`, czytnik `scripts/prrestr.py`.
- Artykuł → procedura → źródło: `scripts/insolvency.py route USTAWA ARTYKUL`.
- Metryki i przepisy przejściowe: `references/insolvency/wersje-i-przepisy-przejsciowe.md`.

## Upadłość według etapu

| Etap | Moduł |
|---|---|
| Przesłanki, wniosek, zabezpieczenie, ogłoszenie, pre-pack | `mod-PrUpad-wniosek-ogloszenie.md` |
| Skład masy, wyłączenia, umowy, małżeństwo, bezskuteczność, procesy | `mod-PrUpad-skutki-masa-bezskutecznosc.md` |
| Kompetencje, rada, zgromadzenie, KRZ, doręczenia i środki | `mod-PrUpad-organy-procedura.md` |
| Syndyk, sprawozdania, wynagrodzenie, likwidacja | `mod-PrUpad-syndyk-likwidacja.md` |
| Zgłoszenie, braki, weryfikacja, lista, sprzeciw | `mod-PrUpad-wierzytelnosci-235-266.md` |
| Fundusze, zabezpieczenia i podział | `mod-PrUpad-podzial-335-360.md` |
| Układ w upadłości | `mod-PrUpad-uklad-likwidacja-zakonczenie.md` |
| Transgraniczne, śmierć, deweloper | `mod-PrUpad-likwidacja-miedzynarodowe-szczegolne.md` |
| Banki/SKOK, hipoteczne, ubezpieczenia, obligacje, układ konsumencki | `mod-PrUpad-postepowania-odrebne-426-491-38.md` |
| Upadłość konsumencka i oddłużenie | `mod-PrUpad-konsument-workflow.md` |
| Zakończenie, zakaz działalności, karne i końcowe | `mod-PrUpad-zakonczenie-zakaz-karne.md` |

## Restrukturyzacja

Wybór trybu i finansowanie → `mod-PrRestr-wejscie-plan-test.md`.
PZU → `mod-PrRestr-pzu.md`; PPU/PU → `mod-PrRestr-ppu-pu.md`;
sanacja → `mod-PrRestr-sanacja.md`. Układ wymaga również modułów spisu,
głosowania, pomocy publicznej i wykonania. Nie stosuj dawnego automatycznego
wyłączenia wierzytelności zabezpieczonych po reformie 2025/1085 ani starych
większości bez wyboru właściwego reżimu.

## Wynik dla sprawy

Stan faktyczny i braki, daty decydujące o prawie, tryb, organ, jednostki
źródłowe, działania i dokumenty, terminy ze zdarzeniami początkowymi,
środki kontroli oraz warianty dalszego przebiegu. Wierzyciel potrzebuje
w szczególności kwalifikacji wierzytelności i zabezpieczenia; dłużnik
— przesłanek, obowiązków, możliwości finansowania i skutków wybranego trybu.
Nie deklaruj wygranej, oddłużenia ani określonego odzysku bez ustaleń sprawy.
