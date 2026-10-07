# WORKFLOW: Generator Dokumentów Korporacyjnych
## Analizator Umów v1 · workflows/generator-dokumentow-korporacyjnych.md

**Wywołanie:** *„wygeneruj statut/umowę spółki"*, *„przygotuj uchwałę zarządu/
zgromadzenia wspólników"*, *„napisz protokół zgromadzenia"*, *„przygotuj
pełnomocnictwo"*.

Przed startem: `view references/generator/rdzen-generowania.md`.

---

### KROK 0 — ROZPOZNANIE DOKUMENTU

| Sygnał | Moduł essentialia | Uwaga |
|---|---|---|
| Statut / umowa spółki / akt założycielski / founders' agreement | `mod-FA-founders-dokumenty-zalozycielskie.md` (J20) | Moduł już istnieje w systemie — użyj go, nie duplikuj essentialia tutaj |
| Uchwała zarządu / zgromadzenia / wspólników + protokół | `references/generator/essentialia-regulaminy-i-korporacyjne.md § 2` | Nowy moduł |
| Regulamin organu (zarząd/RN/rada dyrektorów/walne) | `mod-FA-founders-dokumenty-zalozycielskie.md § J20.6` | Moduł już istnieje |
| Pełnomocnictwo (ogólne/rodzajowe/szczególne) lub prokura | `references/generator/essentialia-regulaminy-i-korporacyjne.md § 3` | Nowy moduł |

---

## ŚCIEŻKA A — STATUT / UMOWA SPÓŁKI

`view references/mod-FA-founders-dokumenty-zalozycielskie.md § J20.5` i prowadź
generowanie wg essentialia tam wskazanych. Ten workflow dodaje wyłącznie warstwę
procesową (wywiad → szkielet → styl → bramka), analogicznie do KROKÓW 2–5
w `generator-umowy.md` — nie powtarzaj ich tutaj osobno, zastosuj wprost.

## ŚCIEŻKA B — UCHWAŁA + PROTOKÓŁ

### KROK 1 — WYWIAD

- organ (zarząd / zgromadzenie wspólników / walne zgromadzenie) i forma spółki,
- tryb (formalne zwołanie vs. art. 240 KSH vs. uchwała pisemna/obiegowa) —
  **rozstrzygnij to na starcie**, bo determinuje essentialia protokołu (§2 w
  pliku essentialia),
- przedmiot uchwały (jedna czy kilka uchwał w ramach jednego posiedzenia),
- czy materia jest zastrzeżona do zgromadzenia wspólników (patrz §2 — katalog
  spraw wymagających uchwały wspólników) — jeśli tak, a użytkownik prosił o
  uchwałę zarządu, **zasygnalizuj to** zamiast generować niewłaściwy dokument,
- obecni/reprezentowani, ewentualni pełnomocnicy (sprawdź zakaz z art. 243 § 3 KSH
  dla zgromadzenia wspólników — członek zarządu/pracownik nie może być
  pełnomocnikiem),
- numeracja uchwały (kontynuacja serii z poprzednich uchwał tego organu —
  dopytaj o ostatni użyty numer, nie zaczynaj od 1 bez potwierdzenia).

### KROK 2 — SZKIELET PROTOKOŁU

```
1. Nagłówek (data, miejsce, organ, numer protokołu)
2. Stwierdzenie zwołania (tryb formalny) LUB przesłanek art. 240 KSH (tryb odformalizowany)
3. Stwierdzenie zdolności do powzięcia uchwał (kworum/reprezentowany kapitał)
4. Lista obecności (odesłanie do załącznika)
5. Porządek obrad
6. Treść uchwał (pełny tekst każdej, numer, wynik głosowania, sprzeciwy)
7. Podpisy (obecni lub przewodniczący + protokolant)
```

### KROK 3 — TREŚĆ, STYL, BRAMKA

Stosuj `style-format-generowania.md`. Bramka finalizacji jak w
`generator-umowy.md` KROK 5, z dodatkowym punktem: „numeracja uchwały spójna z
poprzednią serią, potwierdzona przez klienta?”.

## ŚCIEŻKA C — PEŁNOMOCNICTWO / PROKURA

### KROK 1 — WYWIAD (kluczowy krok — determinuje formę dokumentu)

1. **Jaka dokładnie czynność** ma wykonać pełnomocnik? (nie poprzestawaj na
   „sprawy firmowe” — ustal konkretną czynność lub kategorię czynności).
2. Czy ta czynność wymaga formy szczególnej (akt notarialny, forma pisemna z
   podpisem poświadczonym itd.)? Jeśli tak → pełnomocnictwo **musi** mieć tę
   samą formę (art. 99 § 1 KC) — nie generuj zwykłego dokumentu pisemnego, jeśli
   czynność wymaga aktu notarialnego; poinformuj klienta o konieczności wizyty
   u notariusza zamiast tworzyć nieskuteczny dokument.
3. Zakres: ogólne / rodzajowe / szczególne (tabela w §3 pliku essentialia).
4. Czas trwania, możliwość substytucji, nieodwołalność (jeśli klient tego chce —
   wymaga uzasadnienia treścią stosunku bazowego).
5. Czy to prokura? → jeśli tak, zatrzymaj się i dopytaj o rodzaj (samoistna/
   łączna/oddziałowa) oraz o wpis do KRS — nie stosuj tabeli pełnomocnictw wprost.
6. Czy to pełnomocnictwo procesowe (KPC)? → przekieruj do modułów proceduralnych
   systemu (`pisma-procesowe-v3` / `pisma-proste-v2`), ten workflow dotyczy
   wyłącznie pełnomocnictw materialnoprawnych (KC).

### KROK 2 — SZKIELET

```
1. Oznaczenie mocodawcy (pełne dane + sposób reprezentacji przy udzieleniu)
2. Oznaczenie pełnomocnika (pełne dane)
3. Rodzaj pełnomocnictwa i dokładny zakres umocowania
4. Ewentualna substytucja
5. Czas trwania / warunki wygaśnięcia (jeśli inne niż ustawowe)
6. Data i miejsce
7. Podpis mocodawcy (+ forma szczególna, jeśli wymagana)
```

### KROK 3 — BRAMKA

Dodatkowy punkt bramki wobec KROKU 5 w `generator-umowy.md`:
„Forma dokumentu odpowiada formie wymaganej dla czynności, do której upoważnia
(art. 99 § 1 KC) — potwierdzone?”. Brak potwierdzenia = STOP, nie generuj.

### Disclaimer (wszystkie ścieżki tego workflow)

> *Dokument ma charakter roboczy. W szczególności forma pełnomocnictw oraz
> tryb podejmowania uchwał wymagają weryfikacji przez prawnika prowadzącego
> sprawę przed użyciem dokumentu w obrocie.*
