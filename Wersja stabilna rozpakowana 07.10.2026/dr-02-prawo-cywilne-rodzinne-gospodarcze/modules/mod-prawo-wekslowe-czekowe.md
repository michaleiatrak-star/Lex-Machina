# mod-prawo-wekslowe-czekowe

**Stan operacyjny:** 2026-08-28  
**Źródła kanoniczne:** ELI — Prawo wekslowe, Dz.U. 2022 poz. 282 t.j.; Prawo czekowe, Dz.U. 2016 poz. 462 t.j. Oba akty mają status obowiązujący.

## 1. Rozdzielenie reżimów

Weksel i czek są odrębnymi papierami wartościowymi regulowanymi odrębnymi ustawami. Nie przenoś automatycznie reguł jednego instrumentu na drugi.

## 2. Prawo wekslowe — mapa aktualnego aktu

| Zakres | Status |
|---|---|
| Tytuł I — weksel trasowany | 🟢 B+ / COV |
| Dział I — wystawienie i forma | 🟢 |
| Dział II — indos | 🟢 |
| Dział III — przyjęcie | 🟢 |
| Dział IV — poręczenie wekslowe | 🟢 |
| Dział V — płatność | 🟢 |
| Dział VI — zapłata | 🟢 |
| Dział VII — zwrotne poszukiwanie z powodu nieprzyjęcia lub niezapłacenia | 🟢 |
| Dział VIII — wyręczenie | 🟡 B+ |
| Dział IX — wtóropisy i odpisy | 🟡 B+ |
| Dział X — zmiany | 🟡 B+ |
| Dział XI — przedawnienie | 🟢 |
| Dział XII — przepisy ogólne | 🟡 B+ |
| Dział XIII — niesłuszne zbogacenie | 🟢/🟡 B+ |
| Dział XIV — kolizja ustaw | 🟡 B+ |
| Dział XV — protest | 🟢 |
| Dział XVI — weksle zaginione | 🟢/🟡 B+ |
| Tytuł II — weksel własny | 🟢 |
| Tytuł III — przepisy końcowe i przejściowe | kontrola temporalna |

### Twarde bramki wekslowe

1. **Forma:** przed oceną dokumentu sprawdź odpowiednio art. 1–2 albo przepisy o wekslu własnym; brak wymaganej cechy może być sanowany tylko wtedy, gdy ustawa wyraźnie przewiduje skutek zastępczy.
2. **Weksel in blanco:** art. 10 chroni posiadacza przed zarzutem uzupełnienia niezgodnego z porozumieniem tylko w granicach określonych ustawą; zawsze ustal treść porozumienia i sposób nabycia dokumentu.
3. **Konsument:** aktualny tekst zawiera szczególną regulację weksla wręczanego przedsiębiorcy w związku z wierzytelnością konsumencką, w tym wymóg zastrzeżenia ograniczającego obieg; przed zastosowaniem pobierz aktualny art. 11a.
4. **Indos:** odróżnij przeniesienie wekslowe od zwykłego przelewu, w szczególności przy klauzuli „nie na zlecenie”.
5. **Protest i regres:** nie zakładaj obowiązku protestu dla każdego roszczenia wekslowego; ustal konkretnego dłużnika i rodzaj odpowiedzialności.
6. **Przedawnienie:** terminy są różne zależnie od konfiguracji podmiotowej. Pobierz aktualny Dział XI zamiast stosować jeden ogólny termin.
7. Przy wekslach wystawionych przed zmianami z 2021 r. sprawdź przepisy przejściowe.

## 3. Prawo czekowe — mapa operacyjna

Prawo czekowe jest odrębnym aktem. Kluczowe bloki obejmują wystawienie i formę, przenoszenie praw, poręczenie, przedstawienie i zapłatę, zwrotne poszukiwanie, protest/stwierdzenia równoważne, wtóropisy, przedawnienie, kolizję ustaw oraz utratę dokumentu.

### Twarde bramki czekowe

1. Dla czeku płatnego w Polsce trasatem może być podmiot wskazany w aktualnym art. 3 — przed kwalifikacją pobierz literalne brzmienie.
2. **Czek nie podlega przyjęciu** — aktualny art. 4 przewiduje, że wzmiankę o przyjęciu uważa się za nienapisaną.
3. **Art. 28:** czek jest płatny za okazaniem; zapis sprzeczny z tą zasadą nie tworzy zwykłego „czeku terminowego”.
4. Terminy przedstawienia do zapłaty zależą od miejsca wystawienia i płatności — przed obliczeniem terminu pobierz aktualny art. 29.
5. Przy regresie, przedawnieniu i utracie czeku używaj wyłącznie przepisów Prawa czekowego, nie analogii z Prawa wekslowego bez podstawy ustawowej.

## 4. Intake

```text
□ weksel czy czek?
□ dokument własny czy trasowany — jeżeli dotyczy weksla?
□ kto wystawił, kto jest zobowiązany, kto jest aktualnym posiadaczem?
□ czy dokument zawiera wymagane elementy?
□ czy był wystawiony in blanco i istnieje porozumienie?
□ jaki był ciąg indosów/przelewów?
□ kiedy nastąpiła płatność/przedstawienie/protest lub czynność równoważna?
□ czy wierzytelność ma źródło w umowie konsumenckiej?
□ czy roszczenie nie jest przedawnione?
□ czy dokument został utracony albo zniszczony?
```

## 5. Routing

- nakaz zapłaty / proces z dokumentu → DR-02 / aktualny KPC;
- fałszerstwo lub użycie podrobionego dokumentu → DR-03;
- zabezpieczenie wierzytelności konsumenckiej → DR-02 + prawo konsumenckie;
- kolizja ustaw / element zagraniczny → DR-14.

## 6. Fresh gate

Przed powołaniem wymaganej cechy dokumentu, terminu przedstawienia, protestu, regresu albo przedawnienia pobierz aktualny tekst ELI właściwej ustawy. Nie korzystaj z terminów ani katalogów z pamięci.
