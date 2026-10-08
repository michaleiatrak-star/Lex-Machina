# Plan pełnego pokrycia PrUp i PrRestr (moduły klasy A)

⚠️ Źródło jedyne: urzędowe t.j. z `references/{prup,prrestr}/sources/*.pdf` (SHA-256 w `metadata.json`) + online ELI przed zamknięciem modułu. Nic z pamięci; przepis spoza tych aktów — tylko po odczycie w ELI (`isap_tekst`).

## Poziom A / COV-ART — definicja ukończenia modułu

```
□ nagłówek: Status, Źródło (ELI t.j.), Weryfikacja (data + hash snapshotu + isap_lookup), zmiany po t.j., ZASADA
□ FAZA 0 — INTAKE (pytania rozstrzygające tryb i przesłanki)
□ MAPA ARTYKUŁÓW (zakres → treść → sekcja; uchylone wymienione)
□ każdy artykuł TEKST_W_TJ z zakresu modułu omówiony: reguła, przesłanki, skutek, liczby i terminy z tekstu
□ TERMINY (termin | zdarzenie początkowe | podstawa)
□ PUŁAPKI (typowe błędy, uchylone przepisy, mylone instytucje)
□ POWIĄZANIA (moduły dr-02, inne DR; przepisy innych aktów tylko po weryfikacji ELI)
□ WYNIK (co ma powstać: tabela przesłanek, pismo, kalendarz)
□ testy: scripts/test_prup.py, test_insolvency.py; audyt: check_rejestracja_modulow, check_coverage_coherence
Miara pomocnicza (orientacyjna): ok. 400 B treści na aktywny artykuł (stan wyjściowy modułów: 43–477 B).
```

## Stan i kolejność prac

Gęstość = bajty modułu / aktywne artykuły. Status: ✅ A ukończony · ⬜ do przebudowy.

### Fala 1 — PrUp rdzeń (najczęstsze sprawy)

| Moduł | Zakres | Akt. art. | Przed (kB, B/art) | Status |
|---|---|---|---|---|
| `mod-PrUpad-wniosek-ogloszenie` | 1–56h | 62 | 3.9 / 63 | ✅ A (30.0 kB, 495 B/art; 2026-10-08) |
| `mod-PrUpad-skutki-masa-bezskutecznosc` | 57–147a | 85 | 4.6 / 55 | ✅ A (33.6 kB, 395 B/art; 2026-10-08) |
| `mod-PrUpad-organy-procedura` | 149–234 | 69 | 3.1 / 46 | ✅ A (25.8 kB, 373 B/art; 2026-10-08) |
| `mod-PrUpad-zakonczenie-zakaz-karne` | 361–546 | 36 | 3.5 / 99 | ⬜ |
| `mod-PrUpad-uklad-likwidacja-zakonczenie` | 266a–266f | 6 | 2.8 / 477 | ⬜ (uzupełnić format) |

### Fala 2 — PrUp likwidacja, wierzytelności, tryby szczególne

| Moduł | Zakres | Akt. art. | Przed | Status |
|---|---|---|---|---|
| `mod-PrUpad-syndyk-likwidacja` | 156–334 | 55 | 8.3 / 154 | ⬜ |
| `mod-PrUpad-wierzytelnosci-235-266` | 235–266 | 35 | 10.8 / 315 | ⬜ |
| `mod-PrUpad-podzial-335-360` | 335–360 | 26 | 7.4 / 289 | ⬜ |
| `mod-PrUpad-likwidacja-miedzynarodowe-szczegolne` | 378–425s | 67 | 6.4 / 97 | ⬜ |
| `mod-PrUpad-postepowania-odrebne-426-491-38` | 426–491³⁸ | 89 | 14.3 / 165 | ⬜ (podział na 2 pliki) |
| `mod-PrUpad-konsument-workflow` | 491¹–491²⁴ | 26 | 10.0 / 393 | ⬜ (uzupełnić format) |

### Fala 3 — PrRestr

| Moduł | Zakres | Akt. art. | Przed | Status |
|---|---|---|---|---|
| `mod-PrRestr-ppu-pu` | 227–282 | 56 | 3.9 / 71 | ⬜ |
| `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele` | 65–139 | 75 | 3.2 / 43 | ⬜ |
| `mod-PrRestr-dzial-III-nadzorca-zarzadca` | 23–64 | 48 | 3.0 / 64 | ⬜ |
| `mod-PrRestr-sanacja` | 283–323 | 41 | 4.1 / 103 | ⬜ |
| `mod-PrRestr-pzu` | 210–226i | 29 | 4.7 / 167 | ⬜ |
| `mod-PrRestr-wejscie-plan-test` | 1–22 | 23 | 4.3 / 190 | ⬜ |
| `mod-PrRestr-procedura-zakonczenie` | 189–337 | 39 | 3.3 / 86 | ⬜ |
| `mod-PrRestr-odrebne-miedzynarodowe` | 338–456 | 41 | 3.8 / 94 | ⬜ |
| `mod-PrRestr-dzial-VI-uklad` | 150–179 | 31 | 5.3 / 175 | ⬜ |
| `mod-PrRestr-dzial-V-pomoc-publiczna` | 140–149 | 10 | 3.1 / 316 | ⬜ |
| `mod-PrRestr-dzial-VII-uklad-czesciowy` | 180–188 | 7 | 2.7 / 394 | ⬜ (uzupełnić format) |

### Fala 4 — wersje, nowelizacje, mapy

```
□ references/insolvency/sources/amendment-*.pdf → wersje-i-przepisy-przejsciowe.md:
  dla każdej nowelizacji (2025/1085, 1170, 1172; 2026/176, 331, 340, 1206): zmienione jednostki,
  data wejścia, przepis przejściowy; odesłanie z każdego modułu, którego dotyczy
□ mod-PrUpad-zrodla-i-wersje, mod-PrRestr-zrodla-i-wersje — aktualizacja po falach 1–3
□ mod-PrUp-PrRestr-uzupelnienie-pokrycia-2026 — węzeł nawigacji z listą modułów A
□ MAPA-AKTOW / MAPA-POKRYCIA: status modułu → „A / COV-ART” po ukończeniu
□ build_prup_coverage.py: commentary_status = KOMENTARZ_A dla artykułów modułów ✅
```

## Zasady pracy

- Jeden moduł = jeden commit; w commicie: moduł, ten plan (status), CHANGELOG, CHECKSUMS, MAPA.
- Liczby, terminy, progi — wyłącznie z tekstu; przy rozbieżności PDF ↔ ELI wygrywa ELI, a moduł dostaje ⚠️.
- Przepisy przejściowe nowelizacji nie wynikają z daty snapshotu — zawsze odesłanie do `wersje-i-przepisy-przejsciowe.md`.
