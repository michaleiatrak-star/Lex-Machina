---
module: ustawa-zasilkowa-current-state-COV
version: "1.0"
verified_on: "2026-08-28"
coverage: "B+/COV — kompletna mapa 13 rozdziałów ustawy zasiłkowej"
source_policy: "RZĄD 1 ELI"
---

# Ustawa zasiłkowa — current-state COV

## 1. Baza

Ustawa z 25 czerwca 1999 r. o świadczeniach pieniężnych z ubezpieczenia
społecznego w razie choroby i macierzyństwa.

**Aktualny t.j.: Dz.U. 2026 poz. 854**, obwieszczenie z 19.06.2026,
stan prawny tekstu jednolitego na 17.06.2026.

- https://eli.gov.pl/eli/DU/2026/854/ogl

## 2. Mapa całej struktury

| Rozdział | Zakres | Routing |
|---|---|---|
| 1 — Przepisy ogólne | art. 1–3 | `mod-ustawa-zasilkowa-choroba-macierzynstwo.md` |
| 2 — Zasiłek chorobowy | od art. 4 | jw. |
| 3 — Świadczenie rehabilitacyjne | od art. 18 | jw. + moduły świadczeń pokrewnych |
| 4 — Zasiłek wyrównawczy | od art. 23 | jw. |
| 5 — uchylony | brak aktywnej treści materialnej | jawnie oznaczony w tym indeksie |
| 6 — Zasiłek macierzyński | od art. 29 | moduł główny + aktualny Kodeks pracy |
| 7 — Zasiłek opiekuńczy | od art. 32 | moduł główny |
| 8 — Podstawa wymiaru zasiłków pracowników | od art. 36 | moduł główny |
| 9 — Podstawa wymiaru zasiłków niepracowników | od art. 48 | moduł główny + SUS |
| 10 — Dokumentowanie prawa i kontrola orzekania | od art. 53 | moduł główny + aktualne reguły kontroli |
| 11 — Ustalanie prawa i wypłata | od art. 61 | moduł główny + routing ZUS/KPC |
| 12 — Zmiany w przepisach obowiązujących | art. 71–80 pominięte | zakres historyczno-techniczny |
| 13 — Przepisy przejściowe i końcowe | od art. 81 | ten indeks + temporal gate |

## 3. Szczególna temporalność 2026

Tekst jednolity integruje zmiany wcześniejsze, ale samo istnienie t.j. nie
usuwa potrzeby badania przepisów przejściowych. Obwieszczenie przywołuje
m.in. różne daty wejścia zmian wynikających z ustaw 2025/1083, 2026/26
i 2026/441. Dla świadczenia ustal:
- datę powstania niezdolności / zdarzenia;
- okres ubezpieczenia;
- datę urodzenia/przyjęcia dziecka, gdy dotyczy;
- moment wszczęcia postępowania i przepisy przejściowe.

## 4. COV vs FULL

`B+/COV` = pełna aktualna struktura 13 rozdziałów jest jawnie zmapowana
do realnej treści i fresh gate. Nie oznacza to kompletnego komentarza do
każdego ustępu, wyjątku, wzoru dokumentu ani stanu historycznego.

## 5. F-108

F-108/30: **B+/COV**. `FULL`: nieprzyznany.
