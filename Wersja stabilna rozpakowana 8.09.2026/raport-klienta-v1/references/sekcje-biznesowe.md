# sekcje-biznesowe — szczegóły sekcji profilu [BIZ]

> **Plik:** `raport-klienta-v1/references/sekcje-biznesowe.md`
> **Wersja:** 1.0 (2026-09-05) — utworzony w ramach F-163.
> **Wywołanie:** `wczytaj references/sekcje-biznesowe.md` — **wyłącznie dla
> profilu [BIZ]** (KROK 3 sekwencji wywołania). Dla [IND] nie wczytuj.

⛔ **Ten plik rozwija sekcje wymienione w SKILL.md, nie dodaje nowych.**
Lista sekcji BIZ jest zamknięta i zdefiniowana w SKILL.md, sekcja
„PROFIL [BIZ]". Tutaj stoi to, czego tam nie ma: format każdej sekcji, próg
pominięcia i typowe błędy.

⛔ **Filtr treści obowiązuje nadrzędnie.** Żadna sekcja BIZ nie jest furtką do
pokazania wewnętrznej oceny słabości pozycji, dowodów A/B/C/D ani wariantów
obrony — patrz „CZEGO NIGDY NIE POKAZYWAĆ KLIENTOWI" w SKILL.md.

⛔ **Nie wymyślaj danych.** Pole bez danych → `null` i pominięta sekcja.
Sekcja BIZ z wypełnieniem szacunkowym jest gorsza od jej braku, bo zarząd
podejmie na niej decyzję.

---

## 1. EKSPOZYCJA FINANSOWA

**Cel:** jedna liczba, którą zarząd może wpisać do rejestru ryzyk, plus jej
rozbicie.

**Format:**

| Pozycja | Kwota (PLN) | Prawdopodobieństwo | Wartość oczekiwana |
|---|---:|---:|---:|

Jeżeli w tej samej sesji wykonano analizę umów — dołącz wynik
z `mod-shared-economic.md` w jego formacie: klauzula | dni | PLN | % wartości
umowy. ⛔ Nie przepisuj tych liczb ręcznie; przenieś je z modułu.

**Zasady:**
- podaj **przedział**, nie punkt, gdy dane na to pozwalają;
- rozdziel kwotę roszczenia głównego od kosztów i odsetek — to trzy różne
  pozycje o różnej pewności;
- ⚠️ odsetek i kosztów nie licz z pamięci; jeśli nie były policzone na
  aktualnych stawkach, wpisz `do ustalenia`, nie szacunek.

**Próg pominięcia:** brak jakiejkolwiek policzonej pozycji → pomiń sekcję
i napisz w kontekście „ekspozycja finansowa nie została jeszcze oszacowana".

---

## 2. WPŁYW NA DZIAŁALNOŚĆ

**Cel:** przełożyć sprawę na cztery wymiary operacyjne, których zarząd i tak
sam poszuka.

| Wymiar | Co opisać |
|---|---|
| Reputacja | ryzyko publiczności sprawy, wrażliwość branżowa |
| Operacje | czy sprawa blokuje procesy, zasoby, ludzi |
| Kontrakty | wpływ na umowy z kontrahentami, klauzule zmiany kontroli, przetargi |
| Compliance | obowiązki informacyjne, sprawozdawcze, regulacyjne |

Jeżeli sprawa dotyka Data Act, NIS2 albo AI Act — dołącz sygnał
z `mod-shared-regulatory-horizon.md`.

**Zasady:** po jednym–dwóch zdaniach na wymiar. Wymiar bez treści pomiń
całkowicie zamiast wpisywać „brak wpływu" — cztery puste wiersze wyglądają
na niedokończoną pracę.

---

## 3. HARMONOGRAM ETAPÓW

**Format projektowy, daty konkretne:**

| Etap | Termin | Odpowiedzialny | Status |
|---|---|---|---|

**Zasady:**
- „Odpowiedzialny" ma być rozstrzygnięty: kancelaria / klient / sąd / organ.
  ⛔ Wiersz bez odpowiedzialnego generuje pytanie zwrotne i niweczy sens
  raportu.
- Terminy sądowe oznacz jako oczekiwane, gdy nie zostały jeszcze wyznaczone.
- Status: `zrobione` / `w toku` / `czeka na sąd` / `czeka na klienta`.
  Ostatni wyróżnij — to jedyny wiersz, na który odbiorca ma wpływ.

⚠️ **Nie podawaj długości terminu procesowego z pamięci.** Termin liczony
błędnie w raporcie dla klienta jest gorszy niż jego brak.

---

## 4. LUKI KONTRAKTOWE

Wyłącznie gdy w sesji wykonano analizę umów. TOP 3 z
`mod-shared-missing-clause.md`.

**Format:** Brakująca klauzula | Ryzyko | Priorytet 🔴/🟠/🟡

**Zasady:** dokładnie trzy pozycje albo mniej; lista dłuższa przestaje być
rekomendacją, a staje się raportem technicznym. Każda pozycja z jednozdaniowym
skutkiem biznesowym, nie z samą nazwą klauzuli.

---

## 5. DZIAŁANIA WYMAGANE PO STRONIE KLIENTA

⛔ **Zawsze osobna, wyróżniona sekcja** — nigdy wtopiona w harmonogram.
To jedyna część raportu, w której odbiorca ma coś zrobić.

**Format:** `[Działanie] — termin: [DATA] — dlaczego to potrzebne: [1 zdanie]`

**Zasady:**
- maksymalnie pięć pozycji; więcej oznacza, że część powinna być po stronie
  kancelarii;
- brak działań → napisz wprost „Nie są wymagane żadne działania po stronie
  Spółki". ⛔ Nie pomijaj sekcji w ciszy — brak sekcji czyta się jako
  przeoczenie, nie jako brak zadań.

---

## 6. REKOMENDACJE DLA ZARZĄDU / RADY NADZORCZEJ

**Cel:** decyzja, nie streszczenie.

**Format:** rekomendacja | uzasadnienie w jednym zdaniu | alternatywa odrzucona
i dlaczego.

**Zasady:**
- od jednej do trzech rekomendacji;
- każda rozstrzygalna: da się ją przyjąć albo odrzucić na posiedzeniu;
- ⛔ **rekomendacja nie może opierać się na treści z listy „czego nigdy nie
  pokazywać"** — jeśli jedyne uzasadnienie to wewnętrzna ocena słabości
  pozycji, przeformułuj ją na skutek zewnętrzny albo pomiń.

---

## 7. SEKCJA POUFNOŚCI

Zamyka raport. Klauzula NDA lub tajemnica zawodowa / attorney-client privilege
— w zakresie, który faktycznie wiąże w tej sprawie.

⛔ Nie wpisuj klauzuli, której nie ustalono. Deklaracja o nieistniejącym NDA
jest twierdzeniem nieprawdziwym w dokumencie przekazywanym klientowi.

---

## 8. SELF-CHECK SEKCJI BIZ

```
□ Czy każda sekcja BIZ ma dane, czy któraś jest wypełniona szacunkiem?
□ Ekspozycja: czy roszczenie, koszty i odsetki są rozdzielone?
□ Harmonogram: czy każdy wiersz ma odpowiedzialnego?
□ Czy „czeka na klienta" jest wyróżnione?
□ Czy sekcja działań klienta istnieje — także gdy działań brak?
□ Czy rekomendacje są rozstrzygalne, a nie opisowe?
□ Czy żadna sekcja nie ujawnia treści z listy „czego nigdy nie pokazywać"?
□ Czy nie policzyłem kwoty, odsetek ani terminu z pamięci?
```
