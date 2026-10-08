# Prawo upadłościowe i restrukturyzacyjne — wspólna nawigacja i status pokrycia

**Źródła:** PrUp t.j. [Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf), PrRestr t.j. [Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf); oba „obowiązuje” ✅ [VER: isap_lookup, 2026-10-08].
**Status pokrycia (08.10.2026):** wszystkie moduły tematyczne obu ustaw w klasie **A / COV-ART** — każdy aktywny artykuł omówiony z tekstu t.j.; plan i metryki: `references/insolvency/plan-pokrycia.md`.
**ZASADA:** przed powołaniem przepisu odczyt `scripts/prup.py` / `scripts/prrestr.py article N --verify-online`; reżim czasowy sprawy — `references/insolvency/wersje-i-przepisy-przejsciowe.md` (tabela nowelizacji ze zmienionymi jednostkami i przepisami przejściowymi).

## Kolejność pracy

1. Zdolność dłużnika: PrRestr art. 4 (wyłączenia: SP, JST, banki, SKOK, ubezpieczyciele, fundusze, instytucje finansowe) i PrUp art. 5–6 → banki, SKOK, ubezpieczyciele, emitenci — tytuły szczególne PrUp.
2. Stan: niewypłacalność (PrUp art. 11) czy zagrożenie (PrRestr art. 6).
3. Zbieg wniosków: PrUp art. 9a–9b i PrRestr art. 11–13 (pierwszeństwo restrukturyzacji; zakaz ogłoszenia upadłości od otwarcia PPU/PU/sanacji).
4. Tryb restrukturyzacji: próg 15% spornych (PrRestr art. 3) → PZU / PPU / PU; sanacja bez progu.
5. Daty zdarzeń → reżim nowelizacji (zwłaszcza DU/2025/1085 art. 4).

## Moduły PrUp (klasa A)

| Zakres | Moduł |
|---|---|
| art. 1–56h — zakres, niewypłacalność, wniosek, zabezpieczenie, pre-pack, ogłoszenie | `mod-PrUpad-wniosek-ogloszenie` |
| art. 57–147a — masa, umowy, małżeństwo, bezskuteczność, procesy | `mod-PrUpad-skutki-masa-bezskutecznosc` |
| art. 149–155, 179, 185–234 — sąd, sędzia-komisarz, rada, KRZ, koszty | `mod-PrUpad-organy-procedura` |
| art. 156–178, 306–334 — syndyk, likwidacja | `mod-PrUpad-syndyk-likwidacja` |
| art. 235–266 — zgłoszenia, lista, sprzeciw | `mod-PrUpad-wierzytelnosci-235-266` |
| art. 266a–266f — układ w upadłości | `mod-PrUpad-uklad-likwidacja-zakonczenie` |
| art. 335–360 — fundusze, kategorie, plan podziału | `mod-PrUpad-podzial-335-360` |
| art. 361–377, 522–523, 536–546 — zakończenie, zakaz działalności, karne, przejściowe | `mod-PrUpad-zakonczenie-zakaz-karne` |
| art. 378–425s — międzynarodowe, po śmierci dłużnika, deweloper | `mod-PrUpad-likwidacja-miedzynarodowe-szczegolne` |
| art. 426–491, 491²⁵–491³⁸ — banki, SKOK, banki hipoteczne, EOG, ubezpieczyciele, obligacje, układ konsumencki | `mod-PrUpad-postepowania-odrebne-426-491-38` |
| art. 491¹–491²⁴ — upadłość konsumencka | `mod-PrUpad-konsument-workflow` |

## Moduły PrRestr (klasa A)

| Zakres | Moduł |
|---|---|
| art. 1–22 — zakres, tryby, przesłanki, plan, test zaspokojenia, zbieg, sąd | `mod-PrRestr-wejscie-plan-test` |
| art. 23–64 — nadzorca, zarządca, wynagrodzenia | `mod-PrRestr-dzial-III-nadzorca-zarzadca` |
| art. 65–139 — uczestnicy, spis, sprzeciw, zgromadzenie, większości, rada | `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele` |
| art. 140–149 — pomoc publiczna | `mod-PrRestr-dzial-V-pomoc-publiczna` |
| art. 150–179 — układ, zatwierdzenie, wykonanie | `mod-PrRestr-dzial-VI-uklad` |
| art. 180–188 — układ częściowy | `mod-PrRestr-dzial-VII-uklad-czesciowy` |
| art. 189–209, 324–337 — procedura wspólna, umorzenie, uproszczone wnioski | `mod-PrRestr-procedura-zakonczenie` |
| art. 210–226i — PZU | `mod-PrRestr-pzu` |
| art. 227–282 — PPU i PU | `mod-PrRestr-ppu-pu` |
| art. 283–323 — sanacja | `mod-PrRestr-sanacja` |
| art. 338–367, 399–400, 448–456 — międzynarodowe, deweloperzy, obligacje, karne, przejściowe | `mod-PrRestr-odrebne-miedzynarodowe` |

## Źródła, wersje, katalog

- Korpus i czytniki: `mod-PrUpad-zrodla-i-wersje`, `mod-PrRestr-zrodla-i-wersje`; katalog nagłówków: `references/insolvency/katalog.md`; routing jednostki: `scripts/insolvency.py route`.
- Kwalifikacja ogólna sprawy: `mod-PrUpad-upadlosc-restrukturyzacja`.
- Przymusowa restrukturyzacja BFG — osobny reżim (ustawa o BFG), nie sanacja.
- Klasa A oznacza pełne omówienie tekstu ustawy, nie bazę orzecznictwa — orzeczenia przez `orzeczenia-sadowe-v2` z weryfikacją sygnatur.
