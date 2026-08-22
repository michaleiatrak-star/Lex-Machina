# DR-05 — Mapa Pokrycia Treściowego

**Utworzona:** 2026-08-22 (F-83, zasilenie z `audyt-systemu-v4/references/
raporty-pokrycia-2026-08-13/`) | **Format ustalony przez F-83.**

## Cel i różnica względem MAPA-AKTOW.md

`MAPA-AKTOW.md` (ten sam katalog) odpowiada na pytanie "**który moduł
odpowiada za który akt prawny**" — rejestr akt→moduł.

Ten plik odpowiada na inne pytanie: "**które konkretne działy/rozdziały/
zakresy artykułów danego aktu są rzeczywiście opracowane treściowo, a
które są lukami**". Szczególnie istotny mechanizm dla **utrzymania po
nowelizacji**: gdy przepis się zmienia, ten rejestr pokazuje od razu, czy
dotknięty fragment w ogóle ma treść do zaktualizowania, czy to obszar
dotąd nieopracowany (i nowelizacja jest okazją, by go uzupełnić od razu
z aktualnym stanem prawnym, zamiast osobno "dogonić" starą treść i osobno
nowelizację).

## Legenda statusu

| Symbol | Znaczenie |
|---|---|
| 🟢 | Pełne/dobrze pokryte — rzeczywista, praktycznie użyteczna treść |
| 🟡 | Częściowe pokrycie — część artykułów opracowana, część brakuje |
| 🔴 | Brak — zero treści merytorycznej |
| ⚪ | Nie dotyczy (przepis techniczny/końcowy, niski priorytet) |

⚠️ Ten rejestr opisuje ILOŚĆ i ZAKRES treści, nie jej AKTUALNOŚĆ prawną.
Każdy przepis nadal wymaga weryfikacji ISAP przed użyciem (HARD GATE).

---

## Prawo o postępowaniu przed sądami administracyjnymi (PPSA)

**Stan prawny bazowy:** Dz.U. 2026 poz. 143 t.j.
**Data ostatniej weryfikacji treści:** 2026-08-22 (⛔ NAPRAWIONE — czwarta
naprawa tego typu w tej sesji; PPSA otrzymała WŁASNY dedykowany moduł
19.08, trzy dni przed budową tej mapy 21.08 na starym raporcie z 13.08)

⭐ **PPSA PRZESTAŁA być "aktem cień"** — 19.08.2026 powstał dedykowany
moduł `mod-PPSA-terminy-kasacja-prawo-pomocy.md` (538 linii), pokrywający
dokładnie priorytet zerowy strukturalny z poprzedniej wersji tej mapy
("utworzenie dedykowanego modułu") ORAZ cztery kolejne rekomendowane
luki naraz. Pozostała treść (właściwość rzeczowa, skarga — art. 50-62)
nadal jest rozproszona w modułach KPA, ale rdzeń instytucji proceduralnych
(terminy, kasacja, prawo pomocy) ma teraz własne miejsce.

| Dział | Materia | Art. | Status | Moduł |
|---|---|---|---|---|
| I, Rozdz. 1 | Przepisy ogólne (przedmiot regulacji, zasady) | 1–12b | 🔴 | — |
| I, Rozdz. 2 | Właściwość WSA | 13–14a | 🔴 | — |
| I, Rozdz. 3 | Właściwość NSA | 15 | 🟡 | `mod-KPA-tryby-nadzwyczajne-i-strategia` — art. 15 §1 pkt 4 (spory kompetencyjne, w zw. z art. 4 PPSA) |
| I, Rozdz. 4 | Skład sądu | 16–17 | 🔴 | — |
| I, Rozdz. 5 | Wyłączenie sędziego | 18–24 | 🔴 | — |
| II, Rozdz. 1 | Zdolność sądowa i procesowa | 25–31 | 🔴 | — |
| II, Rozdz. 2 | Strony i uczestnicy postępowania | 32–33 | 🔴 | — |
| II, Rozdz. 3 | Pełnomocnicy | 34–44 | 🔴 | — |
| III, Rozdz. 1 | Pisma w postępowaniu sądowym | 45–49b | 🔴 | — |
| III, Rozdz. 2 | **Skarga** (przedmiot, wymogi formalne, wniesienie, wpis) | 50–62 | 🟢 | `mod-KPA-tryby-nadzwyczajne-i-strategia` sekcja 7+7a — art. 3 §2 pkt 5-8, 52 §3-4, 53 §1/§2b, 54 §1 |
| III, Rozdz. 3 | Wniosek o wszczęcie postępowania | 63–64 | 🔴 | — |
| III, Rozdz. 3a | **Sprzeciw od decyzji i postanowienia** | 64a–64e | 🟢 NAPRAWIONE 2026-08-19 (F-64) | `mod-PPSA-terminy-kasacja-prawo-pomocy.md` sekcja 5 — instytucja milczącego załatwienia sprawy, pełna procedura |
| III, Rozdz. 4 | Doręczenia | 65–81 | 🔴 | — |
| III, Rozdz. 5 | Terminy (zasady ogólne liczenia) | 82–84 | 🔴 | Konkretne terminy skargi znane, ale nie ogólne zasady z tego rozdziału |
| III, Rozdz. 6 | **Uchybienie i przywrócenie terminu** | 85–89 | 🟢 NAPRAWIONE 2026-08-19 | `mod-PPSA-terminy-kasacja-prawo-pomocy.md` sekcja 1 |
| III, Rozdz. 7 | Posiedzenia sądowe | 90–114 | 🔴 | — |
| III, Rozdz. 8 | Postępowanie mediacyjne i uproszczone | 115–122 | 🔴 | — |
| III, Rozdz. 9 | Zawieszenie i podjęcie postępowania | 123–131 | 🔴 | — |
| III, Rozdz. 10 | **Orzeczenia sądowe** (skutki uwzględnienia skargi) | 132–167a | 🟡 | Art. 145, 147, 148, 152 — dobrze opracowane, ale wąski wycinek (skargi na akty JST/nadzór); brak treści o zwykłym oddaleniu/umorzeniu |
| III, Rozdz. 11 | Prawomocność orzeczeń | 168–172 | 🔴 | — |
| IV, Rozdz. 1 | **Skarga kasacyjna do NSA** | 173–193 | 🟢 NAPRAWIONE 2026-08-19, ⭐⭐⭐ | `mod-PPSA-terminy-kasacja-prawo-pomocy.md` sekcja 2 — najczęściej używany kolejny krok po niekorzystnym wyroku WSA |
| IV, Rozdz. 2 | Zażalenie | 194–198 | 🔴 | — |
| V, Rozdz. 1–3 | Koszty, wpis, opłata kancelaryjna, **prawo pomocy** | 199–263 | 🟡 NAPRAWIONE 2026-08-19 częściowo | `mod-PPSA-terminy-kasacja-prawo-pomocy.md` sekcja 3 (art. 243-263, prawo pomocy — zwolnienie od kosztów, pełnomocnik z urzędu) — moduł sam odnotowuje, że raport źródłowy dla tej sekcji wymagał uzupełnienia, patrz "POZOSTAJE DO POGŁĘBIENIA" w module. Koszty/wpis/opłata kancelaryjna (art. 199-242) nadal 🔴 |
| VI | Uchwały NSA | 264–269 | 🔴 | — |
| VII | **Wznowienie postępowania (sądowoadministracyjne)** | 270–285 | 🟢 NAPRAWIONE 2026-08-19 (F-64), ZAMKNIĘTE | `mod-PPSA-terminy-kasacja-prawo-pomocy.md` sekcja 6 — dawna asymetria względem dobrze opracowanego wznowienia w KPA teraz zniesiona |
| VIIa | Skarga o stwierdzenie niezgodności z prawem prawomocnego orzeczenia | 285a–285l | 🔴 | — |
| VIII | Wykonywanie orzeczeń sądowych | 286–287 | 🔴 | — |
| IX | Przepisy końcowe | 288–319 | ⚪ | Techniczne, niski priorytet |

**Dodatkowy temat pokryty przez nowy moduł:** zmiana terminu skargi na
opinię transgraniczną (F-88, sekcja 7 modułu) — powiązanie z propagacją
nowelizacji Op 2026.846 przez cross-DR.

**Zaktualizowana rekomendowana kolejność uzupełniania** (5 z 8
oryginalnych pozycji naprawionych jednym modułem):
1. ~~Utworzenie dedykowanego modułu PPSA~~ ✅ NAPRAWIONE 2026-08-19
2. ~~Dział III, Rozdz. 6 — uchybienie i przywrócenie terminu~~ ✅ NAPRAWIONE
3. ~~Dział IV, Rozdz. 1 — skarga kasacyjna do NSA~~ ✅ NAPRAWIONE
4. ~~Dział V, Rozdz. 3, Oddz. 2 — prawo pomocy~~ 🟡 NAPRAWIONE częściowo, patrz moduł dla otwartych punktów
5. ~~Dział III, Rozdz. 3a — sprzeciw od decyzji i postanowienia~~ ✅ NAPRAWIONE
6. **Dział III, Rozdz. 7 — posiedzenia sądowe (art. 90–114)** — następny w kolejności, wciąż 🔴
7. ~~Dział VII — wznowienie postępowania sądowoadministracyjnego~~ ✅ NAPRAWIONE, ZAMKNIĘTE
8. **Dział III, Rozdz. 10 dokończenie — orzeczenia sądowe w ogólności (art. 132–144)** — dokończenie już częściowo opracowanego tematu
9. **Dział V, Rozdz. 1-2 — koszty, wpis, opłata kancelaryjna (art. 199-242)** — dopełnienie sekcji Rozdz. 3 (prawo pomocy)

---

## Akty NIE objęte tym rejestrem (brak materiału źródłowego)

Ten skill (dr-05) obejmuje też KPA i inne akty administracyjne — audyt
źródłowy z 2026-08-13 objął w tym skillu wyłącznie PPSA. Pozostałe akty
(w tym sam KPA, mimo że intensywnie cytowany jako "gospodarz" większości
treści PPSA) NIE mają dotąd odpowiadającego raportu pokrycia w tym
rejestrze — do uzupełnienia nowym audytem, jeśli okaże się potrzebny.
