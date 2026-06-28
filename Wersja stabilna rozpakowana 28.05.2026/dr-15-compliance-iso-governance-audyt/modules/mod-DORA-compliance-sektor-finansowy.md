# mod-DORA-compliance-sektor-finansowy.md — DORA: Cyfrowa Odporność Operacyjna Sektora Finansowego

Status: moduł regulacji UE klasy wzorcowej. Stan metodyczny: 2026-06-07.
Rozporządzenia UE i standardy techniczne (RTS/ITS) muszą być każdorazowo weryfikowane
w eur-lex.europa.eu oraz na stronach ESAs (EBA, ESMA, EIOPA) przed każdym cytowaniem.
Powiązane akty krajowe weryfikuj w isap.sejm.gov.pl.

## 1. Akty i źródła do weryfikacji

- Rozporządzenie DORA — Rozp. (UE) 2022/2554 z 14.12.2022
  [VER: eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32022R2554]
  Stosowane od: 17.01.2025 — brak okresu przejściowego
- Rozporządzenia delegowane KE (RTS) — Dz.Urz. UE L 2024 i 2025
  [VER: eba.europa.eu, esma.europa.eu, eiopa.europa.eu — aktualne RTS/ITS]
- Ustawa o krajowym systemie cyberbezpieczeństwa (KSC) — Dz.U. 2024 poz. 1226 ze zm.
  [WYMAGA WERYFIKACJI ISAP: isap.sejm.gov.pl — nakładanie DORA/NIS2/KSC]
- Ustawa o nadzorze nad rynkiem finansowym — Dz.U. 2024 poz. 724 ze zm.
  [WYMAGA WERYFIKACJI ISAP]
- Dyrektywa NIS2 — Dyrektywa (UE) 2022/2555 — powiązana, ale nie tożsama z DORA
  [VER: eur-lex.europa.eu]

Nie cytuj literalnego brzmienia przepisu bez aktualnego sprawdzenia źródła. Przed użyciem
artykułu DORA ustal: numer artykułu i ustępu, właściwe RTS (standardy techniczne mogą
precyzować lub modyfikować wymagania z głównego rozp.), datę wejścia w życie danego wymogu,
czy podmiot należy do kategorii objętej obowiązkiem.

## 2. Zakres spraw

- Ocena zgodności z DORA (gap analysis) — banki, ubezpieczyciele, firmy inwestycyjne,
  giełdy, instytucje płatnicze, dostawcy kryptoaktywów (MiCA), dostawcy usług finansowych
- Zarządzanie ryzykiem ICT (filar 1) — polityki, procedury, systemy
- Zarządzanie incydentami ICT (filar 2) — klasyfikacja, raportowanie do KNF
- Testy odporności cyfrowej (filar 3) — TLPT dla znaczących podmiotów
- Ryzyko dostawców ICT zewnętrznych (filar 4) — umowy, rejestr, due diligence
- Wymiana informacji (filar 5) — uczestnictwo w platformach wymiany
- Raportowanie do organu nadzorczego (KNF) — terminy 4h / 24h / 1 miesiąc
- Spory z dostawcami ICT — klauzule umowne wymagane przez DORA
- Postępowania nadzorcze KNF za naruszenie DORA
- Nakładanie DORA i NIS2/KSC — właściwa ścieżka compliance

## 3. Intake — ustal obowiązkowo

1. Jakiego rodzaju podmiot finansowy — bank, ubezpieczyciel, firma inwestycyjna, instytucja
   płatnicza, CASP (kryptoaktywa), inny? Czy podmiot jest objęty DORA (art. 2 DORA)?
2. Czy podmiot jest klasyfikowany jako „znaczący" (significant) — podlegający TLPT?
3. Jaki filar DORA dotyczy sprawy: zarządzanie ryzykiem ICT / incydent / testy / dostawcy / wymiana?
4. Czy doszło do incydentu ICT — kiedy, jaki charakter, czy zgłoszono do KNF i w jakim terminie?
5. Czy toczą się lub grożą działania nadzorcze ze strony KNF lub ESAs?
6. Jakie umowy z dostawcami ICT są zawarte — czy zawierają klauzule wymagane przez DORA art. 30?
7. Czy podmiot prowadzi rejestr wszystkich dostawców ICT (art. 28 ust. 3 DORA)?
8. Czy nakłada się NIS2/KSC — jakie obowiązki z którego reżimu i czy są spójne?
9. Jaki jest cel: compliance gap analysis, obrona w postępowaniu nadzorczym, spór z dostawcą ICT?

## 4. Pięć filarów DORA — mapa wymagań

### Filar 1 — Zarządzanie ryzykiem ICT (art. 5–16)
```
Organy zarządzające: odpowiedzialność i szkolenia → art. 5
Ramy zarządzania ryzykiem ICT: polityki, procedury → art. 6
Identyfikacja i klasyfikacja aktywów ICT → art. 8
Ochrona i zapobieganie → art. 9
Wykrywanie anomalii → art. 10
Reagowanie i odtwarzanie → art. 11–12
Uczenie się i ewolucja → art. 13
```

### Filar 2 — Zarządzanie incydentami ICT (art. 17–23)
```
Klasyfikacja incydentów: [WYMAGA WERYFIKACJI RTS — kryteria klasyfikacji]
Raportowanie:
  Wstępne zgłoszenie:  4 godziny od sklasyfikowania jako "poważny"
  Raport pośredni:     24 godziny
  Raport końcowy:      1 miesiąc
Organ: KNF (Komisja Nadzoru Finansowego)
Powiadamianie klientów: jeśli incydent dotyczy interesów finansowych
```

### Filar 3 — Testy odporności cyfrowej (art. 24–27)
```
Podstawowe testy: WSZYSTKIE podmioty → testy roczne (pentesty, skanowanie podatności)
TLPT (Threat-Led Penetration Testing): TYLKO znaczące podmioty → co 3 lata
Metodologia TLPT: TIBER-EU — weryfikuj aktualne wytyczne EBA/ECB
```

### Filar 4 — Ryzyko dostawców ICT (art. 28–44)
```
Rejestr dostawców ICT: obowiązkowy dla wszystkich podmiotów
Due diligence przed zawarciem umowy
Klauzule obowiązkowe w umowach (art. 30):
  - opis usług, SLA, lokalizacja przetwarzania danych
  - prawa kontroli i audytu
  - warunki rozwiązania, plan wyjścia
  - plany ciągłości działania
Nadzór nad krytycznymi dostawcami ICT (CTPP): przez ESAs bezpośrednio
```

### Filar 5 — Wymiana informacji (art. 45)
```
Dobrowolne uczestnictwo w platformach wymiany informacji o cyber-zagrożeniach
Warunek: poufność, ochrona danych, bez uszczerbku dla postępowań
```

## 5. Mapa proceduralna

### Ścieżka — incydent ICT
```
Zdarzenie ICT → Wykrycie i klasyfikacja (czy to "poważny incydent"?) →
→ [jeśli poważny] Zgłoszenie wstępne do KNF (4h) →
→ Raport pośredni (24h) → Raport końcowy (1 miesiąc) →
→ Powiadomienie klientów (jeśli wymagane) →
→ Analiza przyczyn źródłowych → Działania naprawcze →
→ Aktualizacja ram zarządzania ryzykiem ICT
```

### Ścieżka — postępowanie nadzorcze KNF za naruszenie DORA
```
Wszczęcie postępowania przez KNF → Żądanie wyjaśnień →
→ Prawo do bycia wysłuchanym → Decyzja KNF →
→ Odwołanie do organu wyższego stopnia / WSA →
→ NSA (jeśli zaskarżenie wyroku WSA)
```

### Ścieżka — spór z dostawcą ICT
```
Naruszenie SLA / klauzul DORA → Wezwanie do naprawy →
→ Rozwiązanie umowy (plan wyjścia!) →
→ Powiadomienie KNF (jeśli dostawca krytyczny) →
→ Postępowanie cywilne / arbitraż
```

## 6. Warunki skuteczności środków

Sprawdź:
- czy podmiot jest w zakresie podmiotowym DORA (art. 2),
- aktualną klasyfikację (znaczący / nieznaczący) — wpływa na zakres TLPT,
- termin raportowania incydentu (4h od klasyfikacji — nie od wykrycia),
- kompletność rejestru dostawców ICT,
- czy umowy z dostawcami zawierają wszystkie klauzule z art. 30,
- nakładanie z NIS2/KSC — który reżim jest surowszy w danym aspekcie,
- właściwość organu: KNF dla podmiotów krajowych / ESAs dla CTPP.

## 7. Matryca dowodowa

| Fakt | Dowód | Źródło | Siła | Luka | Ryzyko |
|---|---|---|---|---|---|
| Incydent sklasyfikowany jako poważny | Wewnętrzna dokumentacja klasyfikacji | Logi, raporty SOC | Wysoka | Brak pisemnej decyzji o klasyfikacji | Opóźnienie zgłoszenia |
| Termin zgłoszenia zachowany | Potwierdzenie KNF / timestamp | System raportowania | Wysoka | Brak dowodu godziny wysłania | Naruszenie 4h |
| Rejestr dostawców ICT prowadzony | Aktualny rejestr z datą aktualizacji | Wewnętrzny system | Średnia | Luki w umowach starszych | Naruszenie art. 28 |
| Klauzule DORA w umowach | Tekst umów z dostawcami | Umowy | Wysoka | Brak klauzuli audytu | Naruszenie art. 30 |
| TLPT przeprowadzony | Raport z testu + certyfikacja | Firma testująca | Wysoka | Brak dokumentacji metodologii | Kwestionowanie przez KNF |

## 8. Typowe zarzuty w postępowaniu nadzorczym i kontrargumenty

| Zarzut KNF | Kontrargument |
|---|---|
| Opóźnione zgłoszenie incydentu | Wykazać moment klasyfikacji jako "poważny" — termin biegnie od klasyfikacji, nie wykrycia |
| Brak klauzul DORA w umowach | Umowy zawarte przed 17.01.2025 — sprawdź przepisy przejściowe DORA (art. 64) |
| Brak rejestru dostawców ICT | Rejestr istnieje — wykazać datę wdrożenia i zakres |
| TLPT nie przeprowadzony | Czy podmiot jest "znaczący"? Klasyfikacja może być kwestionowana |
| CMS papierowy bez wdrożenia | Wykazać dowody rzeczywistego wdrożenia: szkolenia, incydenty obsłużone, audyty |

## 9. Strategia

Priorytety:

1. Ustal kategorię podmiotu i zakres obowiązków (DORA nie dotyczy wszystkich jednakowo),
2. Zidentyfikuj, który z 5 filarów jest przedmiotem sprawy,
3. Przy incydencie — odtwórz dokładną chronologię: wykrycie → klasyfikacja → zgłoszenie,
4. Przy postępowaniu nadzorczym — zgromadź dowody rzeczywistego (nie tylko formalnego) wdrożenia,
5. Przy umowach z dostawcami — sprawdź przepisy przejściowe (stare umowy) i plan renegocjacji,
6. Oceń nakładanie z NIS2/KSC — zastosuj reżim surowszy lub skonsultuj z KNF,
7. Przygotuj plan wyjścia od dostawcy ICT jako element due diligence.

## 10. Orzecznictwo i praktyka nadzorcza

Rozporządzenie stosowane od 17.01.2025 — orzecznictwo sądowe w toku kształtowania się.
Szukaj w:
- Komunikatach KNF (knf.gov.pl) — decyzje i wytyczne nadzorcze,
- Wytycznych ESAs (EBA/ESMA/EIOPA) — Q&A, opinie, raporty,
- Decyzjach organów nadzoru innych państw UE — jako praktyka porównawcza,
- TSUE — przy sporach dotyczących stosowania rozporządzenia UE.

**NIGDY nie cytuj sygnatur bez uprzedniej weryfikacji w oficjalnej bazie.**

## 11. Ryzyka

| Ryzyko | Opis | Mitygacja |
|---|---|---|
| Opóźnione raportowanie incydentu | Sankcja KNF; potencjalnie ESAs | Automatyczny trigger w SOC: klasyfikacja → zgłoszenie |
| Luki w umowach z dostawcami | Naruszenie art. 30; odpowiedzialność przy incydencie | Audyt umów + plan renegocjacji |
| Brak planu wyjścia od dostawcy ICT | Krytyczna zależność; naruszenie art. 28 | Opracować plan wyjścia jako element umowy |
| Nakładanie NIS2/DORA — luki | Niespójne wdrożenie obu reżimów | Zintegrowany program compliance |
| Kwalifikacja jako "znaczący" — TLPT | Brak testu = naruszenie art. 26 | Monitorować progi klasyfikacji |
| Stare umowy ICT bez klauzul DORA | Naruszenie po upływie przepisów przejściowych | Harmonogram renegocjacji |

## 12. Quality gate

Przed odpowiedzią lub dokumentem compliance stosuj:
- `shared/HYBRID-VALIDATION.md`
- `shared/TEMPORAL-LAW-CHECK.md` — DORA stosowane od 17.01.2025; RTS wchodzą etapami
- `shared/RISK-ASSESSMENT.md`
- `shared/FORMAL-CHECK.md` jeśli sporządzane pismo procesowe / raport compliance

## Weryfikacja online

```
web_search: "DORA Rozp. UE 2022/2554 wymagania sektor finansowy KNF 2025"
web_search: "DORA RTS standardy techniczne EBA ESMA EIOPA 2024 2025 obowiązujące"
web_search: "DORA incydent ICT raportowanie KNF terminy klasyfikacja 2025"
web_search: "DORA art. 30 klauzule umowy dostawcy ICT wymagania"
web_search: "DORA NIS2 nakładanie Polska implementacja KSC 2025"
web_search: "ustawa KSC cyberbezpieczeństwo Dz.U. 2024 poz. 1226 isap aktualny"
```
