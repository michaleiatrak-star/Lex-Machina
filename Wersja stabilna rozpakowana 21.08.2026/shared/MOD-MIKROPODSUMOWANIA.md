# MOD-MIKROPODSUMOWANIA — Obowiązkowe Podsumowanie Każdego Rozdziału

> **Plik:** `/mnt/skills/user/shared/MOD-MIKROPODSUMOWANIA.md`
> **Status:** PRODUKCJA — plik kanoniczny shared
> **Pozycja w pipeline:** W2.2 — koniec każdego rozdziału/sekcji numerowanej
> **Wywołanie:** `view /mnt/skills/user/shared/MOD-MIKROPODSUMOWANIA.md`
> **Trigger:** OBOWIĄZKOWY po każdym numerowanym rozdziale uzasadnienia

---

## DLACZEGO TEN MODUŁ ISTNIEJE

Sędzia czyta pismo selektywnie — pierwszy i ostatni akapit każdego rozdziału
z największą uwagą. Mikropodsumowanie to ostatni akapit, który sędzia czyta
zanim przejdzie do następnego rozdziału. Jeśli jest dobre — zapamiętuje
właściwy wniosek. Jeśli go nie ma — zapamiętuje własny.

**Zasada:** 3–4 zdania. Bez wyjątków. Zawsze na końcu rozdziału.

---

## MK-1 — SZABLON MIKROPODSUMOWANIA

```
Po każdym numerowanym rozdziale uzasadnienia (Teza 1, Teza 2, Teza 3...):

─────────────────────────────────────────────────────────
Podsumowanie [nr]:

[Zdanie 1: Co zostało wykazane — konkretny fakt lub przepis.]
[Zdanie 2: Jaki to ma skutek dla roszczenia — link do petitum.]
[Zdanie 3: Dlaczego nie można tego podważyć — najsilniejszy argument
           lub wskazanie, że ciężar dowodu przeszedł na pozwanego.]
[Zdanie 4 (opcjonalne): Link do kolejnej tezy lub synergii między tezami.]
─────────────────────────────────────────────────────────
```

**Wzorzec dla sprawy pracowniczej:**

```
Podsumowanie 1 (stosunek pracy):

Fakt zawarcia czwartej umowy terminowej jest bezsporny i wynika wprost
z akt sprawy. Na jego podstawie art. 25¹ §3 k.p. — z mocy samego prawa,
bez konieczności jakichkolwiek oświadczeń — przekształcił umowę w bezterminową
z dniem 1 stycznia 2024 r. Pozwany nie może skutecznie twierdzić, że umowa
wygasła, nie wykazując jednocześnie, że zawarcie czwartej umowy nie nastąpiło
lub że zachodziło wyłączenie z art. 25¹ §4 k.p. — ciężar tego wykazania
spoczywa wyłącznie na pozwanym. Ustalenie stosunku pracy otwiera drogę
do zasądzenia wynagrodzenia wskazanego w punkcie 2 petitum.
```

```
Podsumowanie 2 (wynagrodzenie):

Powód wykazał gotowość do pracy poprzez pisemne dochodzenie roszczeń
pracowniczych — jest to wystarczające na gruncie art. 81 §1 k.p.
Kwota zaległego wynagrodzenia (111 044,46 zł brutto) wynika wprost
z tabeli na str. 2 wezwania do zapłaty z dnia 2 maja 2026 r., obliczonej
według oficjalnych danych GUS. Pozwany, kwestionując tę kwotę, zobowiązany
jest przedłożyć własne listy płac — odmowa podlega ocenie na jego niekorzyść.
```

```
Podsumowanie 3 (wynagrodzenie uzupełniające PFRON):

Pozwany pobrał łącznie 123 445 zł dofinansowania do wynagrodzeń pracowników
niepełnosprawnych (lista PFRON, str. 1-4, lp. 1-30) — kwota ta jest faktem
dokumentarnym, niepodważalnym przez samo zaprzeczenie. Świadek Nawrot
potwierdził praktykę wypłat gotówkowych (protokół str. 4, godz. 00:47:48).
Powód — z wyższym stopniem niepełnosprawności niż Nawrot — miał prawo
do proporcjonalnie wyższej kwoty. Żądane 1 000 zł/mc stanowi zaledwie
17–35% pobieranego przez pozwanego dofinansowania — jest więc minimum,
nie maksimum możliwego roszczenia.
```

---

## MK-2 — ZASADY REDAKCJI

```
ZASADA DŁUGOŚCI:
  3–4 zdania. Minimum 3, maksimum 4.
  Brak wyjątków — nawet dla "oczywistych" rozdziałów.

ZASADA TREŚCI:
  Zdanie 1: fakt wykazany (co udowodniono)
  Zdanie 2: skutek procesowy (link do petitum)
  Zdanie 3: przerzucenie ciężaru (co musi teraz zrobić pozwany)
  Zdanie 4: synergia (jak to wzmacnia lub otwiera kolejny argument)

ZASADA STYLU:
  Aktywny podmiot: "Powód wykazał", "Pozwany zobowiązany jest", "Sąd winien"
  Unikaj: "Jak wynika z powyższego...", "Reasumując...", "W świetle powyższego..."
  Te frazy sygnalizują pusty akapit — sędzia je pomija.

ZASADA CIĘŻARU:
  Każde mikropodsumowanie MUSI zawierać informację kto teraz ponosi
  ciężar dowodu / co musi zrobić pozwany.
  Mikropodsumowanie bez przerzucenia ciężaru = słabe.
```

---

## MK-3 — GDZIE UMIESZCZAMY

```
Struktura sekcji UZASADNIENIE z mikropodsumowaniami:

1. TEZA 1
   [blok 7-elementowy + skutek procesowy]

   ═══ Podsumowanie 1: [3-4 zdania] ═══

2. TEZA 2
   [blok 7-elementowy + skutek procesowy]

   ═══ Podsumowanie 2: [3-4 zdania] ═══

3. TEZA 3
   [blok 7-elementowy + skutek procesowy]

   ═══ Podsumowanie 3: [3-4 zdania] ═══

[opcjonalnie: PODSUMOWANIE ŁĄCZNE — 2-3 zdania scalające wszystkie tezy]
```

---

## MK-4 — INTEGRACJA Z PIPELINE

```
W2.2 (redakcja):
  → Po elemencie [7] WNIOSEK CZĄSTKOWY każdego bloku:
    obowiązkowo dodaj blok mikropodsumowania wg MK-1

W2.4 (ATAK-NA-DRAFT):
  → Brak mikropodsumowania po rozdziale = ⬛ LUKA-MK

W3 (AUDYT-KOŃCOWY):
  → Kryterium MK: czy każdy numerowany rozdział uzasadnienia ma podsumowanie?
  → Weryfikuj: czy podsumowanie zawiera przerzucenie ciężaru dowodu?

⛔ ZAKAZ: Rozdział uzasadnienia bez mikropodsumowania = niezamknięty
  = ⬛ LUKA-MK — nie generuj .docx.
⛔ ZAKAZ: Mikropodsumowanie jednozdaniowe = ⬛ LUKA-MK (minimum 3 zdania).
⛔ ZAKAZ: Mikropodsumowanie zaczynające się od "Reasumując" / "Podsumowując"
  / "W świetle powyższego" — użyj aktywnego podmiotu.
```
