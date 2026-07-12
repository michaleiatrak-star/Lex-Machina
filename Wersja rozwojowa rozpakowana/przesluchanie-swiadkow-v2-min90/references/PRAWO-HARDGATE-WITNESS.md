# PRAWO-HARDGATE-WITNESS — Obszary prawne w przesłuchaniu świadków wymagające weryfikacji

> ⛔ Plik pomocniczy do PRAWO-HARDGATE dla skilla przesłuchanie-swiadkow-v2.
> Nie zastępuje: `view /mnt/skills/user/shared/PRAWO-HARDGATE.md` — wczytaj
> główny moduł HARDGATE przed każdym przepisem.

**Przeznaczenie:** Katalog obszarów, w których skill przesłuchania może powołać
przepisy lub orzeczenia. Każdy obszar wymaga weryfikacji ISAP przed podaniem artykułu.

---

## OBSZAR 1 — Dopuszczalność pytań i zeznań

### 1A. KPC — postępowanie cywilne

| Zagadnienie | Przepis (orientacyjny — weryfikuj) | Ryzyko dezaktualizacji |
|---|---|---|
| Pytania sugestywne w przesłuchaniu bezpośrednim | art. 271 KPC | niska |
| Świadkowie wyłączeni od zeznań (prawo odmowy) | art. 261 KPC | niska |
| Przedmiot zeznań — fakty istotne dla rozstrzygnięcia | art. 227 KPC | niska |
| Zakaz zastępowania zeznań dokumentem | art. 258 KPC | niska |
| Mediator jako świadek | art. 259¹ KPC | średnia (dodany nowelizacją) |
| Konfrontacja świadków | art. 272 KPC | niska |
| Odczytanie zeznań z poprzedniego postępowania | art. 271¹ KPC | średnia |

### 1B. KPK — postępowanie karne

| Zagadnienie | Przepis (orientacyjny — weryfikuj) | Ryzyko dezaktualizacji |
|---|---|---|
| Prawo do odmowy zeznań (osoba najbliższa) | art. 182 KPK | niska |
| Prawo do odmowy odpowiedzi na pytanie | art. 183 KPK | niska |
| Zakaz zastępowania zeznań notatkami | art. 174 KPK | niska |
| Dowody uzyskane z naruszeniem przepisów | art. 168a KPK | wysoka (nowelizacje) |
| Tajemnica zawodowa i służbowa | art. 180 KPK | średnia |
| Zakaz zeznań duchownego ze spowiedzi | art. 178 pkt 2 KPK | niska |
| Zakaz zeznań obrońcy | art. 178 pkt 1 KPK | niska |
| Zakaz zeznań mediatora | art. 178a KPK | średnia |
| Odczytanie zeznań z postępowania przygotowawczego | art. 391 KPK | wysoka |
| Konfrontacja świadków | art. 172 KPK | niska |
| Przesłuchanie świadka incognito | art. 184 KPK | średnia |

### 1C. KPW — postępowanie w sprawach o wykroczenia

Odesłanie do KPK (art. 39, 41 KPW) — weryfikuj zakres odesłania aktualnym brzmieniem.

### 1D. KPA — postępowanie administracyjne

| Zagadnienie | Przepis (orientacyjny — weryfikuj) |
|---|---|
| Zeznania świadka | art. 83 KPA |
| Osoby wyłączone od zeznań | art. 83 §2 KPA |
| Protokół przesłuchania | art. 67–68 KPA |

---

## OBSZAR 2 — Ocena wartości dowodowej zeznań

| Zagadnienie | Uwagi |
|---|---|
| Swobodna ocena dowodów (KPC) | art. 233 KPC — weryfikuj |
| Zasada swobodnej oceny dowodów (KPK) | art. 7 KPK — weryfikuj |
| Ciężar dowodu (KPC) | art. 6 KC + art. 232 KPC — weryfikuj |
| Orzeczenia SN o ocenie wiarygodności świadków | nigdy z pamięci — HARDGATE |

---

## OBSZAR 3 — Terminy i czynności procesowe

| Zagadnienie | Przykładowe przepisy (orientacyjne — weryfikuj) |
|---|---|
| Termin na złożenie wniosku dowodowego | KPC art. 205¹², KPK art. 167 — weryfikuj |
| Prekluzja dowodowa | KPC art. 205¹², 458¹¹ — weryfikuj |
| Pismo procesowe zawierające wniosek dowodowy | KPC art. 127, 128 — weryfikuj |

---

## OBSZAR 4 — Orzecznictwo dotyczące zeznań

Nigdy nie cytuj orzeczeń z pamięci. Przed powołaniem sygnatury:

```
KROK 1: Zidentyfikuj kwestię (np. "ocena wiarygodności świadka zainteresowanego")
KROK 2: web_search "SN ocena wiarygodności świadka zainteresowanego wyrok site:sn.pl"
KROK 3: web_fetch konkretnego wyroku → odczytaj tezę
KROK 4: Oznacz ✅ [VER: SN/saos.org.pl, data]
```

Kluczowe bazy orzecznicze dla zeznań świadków:
- https://www.sn.pl/orzecznictwo (SN)
- https://orzeczenia.ms.gov.pl (sądy powszechne SA/SO)
- https://saos.org.pl (agregator)

---

## PROCEDURA WERYFIKACJI przy generowaniu pytań

```
Gdy w pytaniu lub jego uzasadnieniu pojawia się:
  - artykuł KPC / KPK / KPW / KPA,
  - sygnatura orzeczenia,
  - termin procesowy wynikający z przepisu,
  - stawka opłaty, kara, sankcja:

→ ZATRZYMAJ generowanie pytania
→ view /mnt/skills/user/shared/PRAWO-HARDGATE.md
→ Wykonaj weryfikację ISAP dla danego przepisu
→ Oznacz ✅ [VER: ISAP, data] w polu DOPUSZCZ. bramki pytania
→ Kontynuuj generowanie
```

---

## INTEGRACJA Z QUESTION-ADMISSIBILITY-GATE

Pole `DOPUSZCZ.` w bramce QUESTION-ADMISSIBILITY-GATE powinno zawierać:

```
# Wzorzec poprawny:
DOPUSZCZ.: niedopuszczalne — pytanie sugestywne przy przesłuchaniu bezpośrednim
           ✅ [VER: art. 271 KPC, ISAP 2026-06-03]

# Wzorzec z ostrzeżeniem:
DOPUSZCZ.: warunkowo dopuszczalne — tylko po impeachmencie przez odczytanie protokołu
           ⚠️ [NIEWERYFIKOWANE — art. 391 KPK, brak dostępu ISAP]

# Wzorzec bez podstawy prawnej (nie wymaga weryfikacji):
DOPUSZCZ.: dopuszczalne — pytanie otwarte, narracyjne, brak zakazów
```
