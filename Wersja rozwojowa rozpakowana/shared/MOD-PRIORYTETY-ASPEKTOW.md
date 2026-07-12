# MOD-PRIORYTETY-ASPEKTOW — checklist klasyfikacji i priorytetyzacji aspektów sprawy

> Status: shared canonical. Wywoływany przez `analizator-dowodow-v3` (po MD6/MP7,
> przed przekazaniem wyniku do `pisma-procesowe-v3`), opcjonalnie przez
> `analiza-sadowa-v6` (po §10 Rekomendacje).
>
> Zależności: `MOD-METODY-BADAWCZE.md` (rejestr metod), `MOD-MAPA-PRZEPISOW.md`
> (mapowanie wyników aspektów na przepisy — wykonywane PO tej checkliście,
> w KROK 3B.2), `MOD-WARIANTY-POZWU.md` (konsument wyboru roszczeń głównych),
> `MOD-HISTORIA-STRATEGII.md` (trwałość wyboru między regeneracjami).

---

## 1. Cel modułu

Po zakończeniu analizy dowodowej system ma listę zidentyfikowanych aspektów
sprawy (roszczeń, kwestii proceduralnych, argumentów pomocniczych). Moduł:

1. Klasyfikuje każdy aspekt automatycznie jako **ROSZCZENIE GŁÓWNE** lub
   **KWESTIA POBOCZNA** (§2).
2. Sugeruje metody badawcze per aspekt (z `MOD-METODY-BADAWCZE.md`).
3. Prezentuje checklistę interaktywną — użytkownik zatwierdza/zmienia
   klasyfikację i wybór metod (§3).
4. Zapisuje wynik do historii strategii (§4) i przekazuje go dalej jako filtr
   do `MOD-WARIANTY-POZWU.md` (§5).

---

## 2. Kryteria klasyfikacji — GŁÓWNE vs POBOCZNE

```
ROSZCZENIE GŁÓWNE — aspekt jest GŁÓWNY, gdy:
  ✓ Stanowi samodzielną podstawę żądania w petitum pisma (kwota, czynność,
    ustalenie prawa), LUB
  ✓ Jego nieuwzględnienie skutkuje przegraniem sprawy co do istoty (nie tylko
    co do formy/kosztów), LUB
  ✓ Jest wymieniony w W1.2 (teza centralna) lub W1.3 (mapa cel→przesłanka→dowód)
    pisma-procesowe-v3 jako "ŻĄDANIE [nr]".

KWESTIA POBOCZNA — aspekt jest POBOCZNY, gdy:
  ✓ Dotyczy kwestii proceduralnych (właściwość, opłaty, terminy formalne) bez
    wpływu na istotę roszczenia, LUB
  ✓ Jest argumentem WSPIERAJĄCYM (wzmacnia wiarygodność/siłę dowodową roszczenia
    głównego, ale samodzielnie nie tworzy żądania), LUB
  ✓ Dotyczy zachowania strony przeciwnej (np. sprzeczności w jej pismach —
    INTRA-CONTRA), które służy obalaniu, nie samodzielnemu żądaniu.

GRANICZNE PRZYPADKI:
  - Żądanie ewentualne → GŁÓWNE (osobna pozycja w petitum), ale oznaczone jako
    "główne-ewentualne" — zależne od losu roszczenia głównego pierwszego rzędu.
  - Roszczenie o odsetki/koszty → POBOCZNE, jeśli nie jest samodzielnym
    przedmiotem sporu (typowo akcesoryjne wobec roszczenia głównego).
```

Klasyfikacja jest WYKONYWANA AUTOMATYCZNIE na podstawie powyższych kryteriów,
a następnie PREZENTOWANA użytkownikowi do zatwierdzenia/zmiany — nigdy
narzucana bez możliwości edycji.

---

## 3. Checklist interaktywna — struktura

### 3.1 Dane wejściowe (z analizator-dowodow-v3 / analiza-sadowa-v6)

```json
{
  "aspekty": [
    {
      "id": "ASP-1",
      "opis": "Roszczenie o wynagrodzenie za nadgodziny — okres 03-09/2025",
      "kategoria_auto": "glowne",
      "powiazane_zadanie": "ŻĄDANIE 1",
      "metody_sugerowane": [
        {"id": "MET-FTL", "auto": true, "powod": "zgłoszenie roszczenia nastąpiło 8 miesięcy po ostatnim okresie objętym żądaniem — sprawdzenie, czy sekwencja dat jest logiczna"}
      ]
    },
    {
      "id": "ASP-2",
      "opis": "Sprzeczność w kwalifikacji konta e-mail (INTRA-CONTRA)",
      "kategoria_auto": "poboczne",
      "powiazane_zadanie": null,
      "metody_sugerowane": [
        {"id": "MET-CA", "auto": true, "powod": "strona przeciwna zmieniła kwalifikację konta między odpowiedzią na pozew i pismem procesowym z czerwca 2025"},
        {"id": "MET-NET", "auto": false, "powod": null}
      ]
    }
  ]
}
```

> UWAGA: `metody_sugerowane` to lista OBIEKTÓW (id/auto/powod), nie samych ID
> — zgodnie z formatem §6 MOD-METODY-BADAWCZE. `powod` wypełniany jest przez
> moduł analityczny (analizator-dowodow-v3 E2a-i), który aktywował metodę —
> opisuje KONKRETNY sygnał z TEJ sprawy, nie ogólne kryterium. Dla metod
> `auto: false` (opcjonalnych) `powod` może być `null`.

### 3.2 Widget — checklist z trzema kolumnami

```
view /mnt/skills/user/shared/MOD-METODY-BADAWCZE.md  (przed renderem — pobierz opisy metod)

show_widget(
  title="priorytety_aspektow_sprawy",
  loading_messages=["Sortuję aspekty sprawy...", "Przygotowuję checklistę..."],
  widget_code=<HTML vanilla JS — patrz §3.3>
)
```

Widget renderuje dwie sekcje (ROSZCZENIA GŁÓWNE / KWESTIE POBOCZNE), każdy
aspekt jako wiersz z:
- checkboxem "uwzględnij" (domyślnie zaznaczone wszystkie ROSZCZENIA GŁÓWNE,
  KWESTIE POBOCZNE — zaznaczone, ale wizualnie odróżnione kolorem/ramką),
- selectorem kategorii (główne/poboczne) — edytowalnym,
- trzecią kolumną "Metoda badawcza" — TYLKO gdy `metody_sugerowane` niepuste
  dla danego aspektu — lista metod z rejestru §3/§3a/§3b MOD-METODY-BADAWCZE
  (sugestie wg §4 tego modułu), każda renderowana wg formatu §3.2a.

Przycisk "Zatwierdź i przejdź dalej" → zapis do historii strategii (§4) →
przekazanie wyniku do MOD-WARIANTY-POZWU.

### 3.2a — Format wiersza metody (obowiązkowy)

Każda metoda w kolumnie "Metoda badawcza" renderowana jest wg modelu
wykonania (`shared/MOD-METODY-BADAWCZE.md` §1a) — JEDNOETAPOWY lub
DWUETAPOWY. Struktura wiersza różni się między modelami:

**MODEL JEDNOETAPOWY** (MET-FTL, MET-CA, MET-CASE, MET-PT, MET-TRI, MET-DQ)
— metoda już wykonana w KROK 3, wynik gotowy:

```
☑ [nazwa/opis metody — wg §5 MOD-METODY-BADAWCZE: PRAWNIK = "ID — nazwa
   ekspercka"; LAIK = opis funkcjonalny bez ID]
  [1 zdanie: co metoda robi — z §5]
  [jeśli auto=true]: ⭐ Rekomendowana — [powod, §6 MOD-METODY-BADAWCZE]
  [jeśli auto=false]: (opcjonalna — dostępna do wyboru)
```

Checkbox = "uwzględnij wynik w raporcie/dalszej analizie" (wynik już
istnieje, checkbox steruje TYLKO czy trafia do dashboardu/raport-sytuacyjny).

**MODEL DWUETAPOWY** (SLE-01/02/03 — MP6, MET-ACH, MET-NET, MET-FA) — w
KROK 3 wykonano TYLKO procedurę szkicu (§1a):

```
[nazwa/opis metody — jak wyżej]
  [1 zdanie: co metoda robi — z §5]
  ⭐ Szkic: [wstepna_obserwacja — 1-2 zdania z procedury szkicu, §1a]
  Nakład analizy głębokiej: [niski|średni|wysoki]
  ( Pomiń )  ( Analiza głęboka )
```

Brak checkboxa — dwa przyciski wzajemnie wykluczające się, domyślnie
ŻADEN nie jest wybrany (użytkownik musi zdecydować — metoda dwuetapowa
NIE jest pre-wykonywana w pełni bez decyzji, w odróżnieniu od modelu
jednoetapowego).

REGUŁY (oba modele):
- Checkbox (jednoetapowy) pre-zaznaczony WYŁĄCZNIE gdy `auto: true`.
  Metody `auto: false` widoczne, odznaczone — użytkownik może dodać.
- `powod`/`wstepna_obserwacja` musi pochodzić z konkretnego wyniku analizy
  (np. "wykryto rozbieżności kwot w 3 dokumentach finansowych"), NIE z
  ogólnego opisu kryterium auto-doboru (§4 MOD-METODY-BADAWCZE) — kryterium
  ogólne tłumaczy KIEDY metoda się aktywuje, `powod`/`wstepna_obserwacja`
  tłumaczy DLACZEGO aktywowała się W TEJ SPRAWIE.
- Jeśli `powod` (jednoetapowy) nie został wygenerowany — checkbox NIE jest
  pre-zaznaczany automatycznie, nawet jeśli `auto: true`; adnotacja
  "(rekomendacja niepewna — sprawdź ręcznie)".
- Jeśli `wstepna_obserwacja` (dwuetapowy) nie została wygenerowana — metoda
  NIE jest pokazywana jako kandydat (sygnał auto-doboru był zbyt słaby do
  konkretnej obserwacji) — pomiń wiersz całkowicie, nie pokazuj z pustym
  szkicem.
- Maksymalnie 3 metody widoczne per aspekt bez rozwijania (zgodnie z §4
  MOD-METODY-BADAWCZE — maks. 2 sugerowane + 1 alternatywna). Jeśli rejestr
  zawiera więcej, pozostałe pod "Pokaż więcej metod".

### 3.3 Szablon HTML widgetu (struktura minimalna)

```html
<div id="priorytety-root"></div>
<script>
const aspekty = /* literał JSON z §3.1 */;
const metody = /* literał JSON — dla każdej metody w metody_sugerowane:
                   {id, model: "jednoetapowy"|"dwuetapowy",
                    opis_krotki (z §5 MOD-METODY-BADAWCZE, wg persony
                    LAIK/PRAWNIK), rekomendowana: auto, powod,
                    wstepna_obserwacja, naklad_szacowany, checked: auto} */;

function render() {
  const glowne = aspekty.filter(a => a.kategoria === 'glowne');
  const poboczne = aspekty.filter(a => a.kategoria === 'poboczne');
  // render dwóch sekcji, każda jako lista wierszy z checkboxami
  // + sekcja metod badawczych per aspekt (jeśli metody_sugerowane.length > 0)
  //   każda metoda renderowana wg formatu §3.2a:
  //   - model jednoetapowy: checkbox + opis_krotki + (gdy rekomendowana)
  //     "⭐ Rekomendowana — [powod]"
  //   - model dwuetapowy: opis_krotki + "⭐ Szkic: [wstepna_obserwacja]" +
  //     "Nakład: [naklad_szacowany]" + przyciski "Pomiń"/"Analiza głęboka"
  // + sekcja "Dodaj własny aspekt" (§3.5) na końcu widgetu
}

function wybierzGleboka(aspektId, metodaId) {
  // oznacz metodaId dla aspektId jako tryb: "gleboka"
  // → po zatwierdz() KROK 3B wykona PROCEDURĘ GŁĘBOKĄ (§1a MOD-METODY-BADAWCZE)
  //   TYLKO dla metod oznaczonych "gleboka"
}

function zatwierdz() {
  const wybor = aspekty.map(a => ({
    id: a.id,
    kategoria: a.kategoria, // po edycji usera
    uwzgledniony: a.uwzgledniony,
    metody_wybrane: a.metody_wybrane || [],
    metody_gleboka: a.metody_gleboka || [] // tylko dla modelu dwuetapowego,
                                            // wypełniane przez wybierzGleboka()
  }));
  // zapis do storage (window.storage) — patrz MOD-HISTORIA-STRATEGII §2
  // sendPrompt('Priorytety zatwierdzone — kontynuuj') lub zwrócenie danych
}
render();
</script>
```

### 3.4 Pomijanie checklisty

```
Checklist jest POMIJANA automatycznie (brak interaktywnego widgetu), gdy:
  - aspekty.length <= 1 (jedno roszczenie, brak alternatyw — nie ma decyzji),
  - LUB wszystkie aspekty mają kategoria_auto = "glowne" i metody_sugerowane = []
    (sprawa prosta, jednowątkowa — analogicznie do pisma-proste-v2 Test B).

W tych przypadkach system kontynuuje z klasyfikacją automatyczną bez pytania,
ale informuje użytkownika jednym zdaniem: "Sprawa ma jeden wątek główny —
pomijam checklistę priorytetów."
```

### 3.5 Dodaj własny aspekt

Niezależnie od `aspekty` wygenerowanych automatycznie, widget zawiera na
końcu formularz "Dodaj własny aspekt" — pozwala użytkownikowi (zwłaszcza
PRAWNIK z wiedzą kontekstową, której auto-detekcja E2a-i nie wyłapie)
wskazać aspekt nieujęty przez system.

```
FORMULARZ:
  Opis aspektu:        [pole tekstowe — np. "świadek X ma konflikt
                        interesów ze stroną przeciwną"]
  Kategoria:           [główne / poboczne — wybór]
  Materiał/dokument:   [opcjonalne — wskazanie konkretnego dokumentu/
                        fragmentu, na którym ma być przeprowadzona analiza]
  Metoda badawcza:     [lista rozwijana z PEŁNEGO rejestru §3/§3a/§3b
                        MOD-METODY-BADAWCZE — niezależnie od auto-detekcji;
                        PRAWNIK widzi ID+nazwę, LAIK widzi tylko opis
                        funkcjonalny z §5]
  [ Dodaj ]
```

PO DODANIU:

```
- aspekt trafia do odpowiedniej sekcji (GŁÓWNE/POBOCZNE) z oznaczeniem
  "DODANY RĘCZNIE" (wizualnie odróżniony — np. inna ikona niż auto-wykryte),
- jeśli wybrana metoda jest modelu DWUETAPOWEGO (§1a) i użytkownik NIE
  wskazał materiału/dokumentu w formularzu:
    → przy zatwierdzeniu checklisty system zadaje JEDNO pytanie zbiorcze
      (zgodnie z INTAKE-GAP): "Który dokument/fragment ma być przedmiotem
      analizy [nazwa metody] dla aspektu [opis]?"
    → dopiero po odpowiedzi wykonywana jest PROCEDURA SZKICU (§1a) dla tego
      aspektu — ręcznie dodany aspekt przechodzi przez TEN SAM dwuetapowy
      proces (szkic → Pomiń/Analiza głęboka), nie jest automatycznie
      "głęboki",
  - jeśli wybrana metoda jest modelu JEDNOETAPOWEGO — wykonywana od razu
    po wskazaniu materiału (lub od razu, jeśli materiał wskazany).
```

---

## 4. Zapis wyniku — historia strategii

Po zatwierdzeniu checklisty zapisz wynik wg schematu z
`MOD-HISTORIA-STRATEGII.md` §2, pole `priorytety`:

```json
{
  "priorytety": {
    "aspekty_glowne": ["ASP-1"],
    "aspekty_poboczne": ["ASP-2", "ASP-3"],
    "aspekty_dodane_recznie": ["ASP-3"],
    "metody_wybrane": {"ASP-2": ["MET-CA"]},
    "metody_gleboka": {"ASP-1": ["MET-FA"]},
    "mapa_przepisow": {
      "ASP-1": [
        {"przepis": "⚠️ art. 151¹ KP (NIEWERYFIKOWANE)", "glebokosc": "BEZPOSREDNIE", "zgodnosc": "ZGODNA"}
      ]
    },
    "timestamp": "..."
  }
}
```

`mapa_przepisow` wypełniane jest w KROK 3B.2 (analizator-dowodow-v3),
PO zatwierdzeniu tej checklisty — szczegóły: `MOD-MAPA-PRZEPISOW.md` §6-7.
```

`metody_gleboka` zawiera metody modelu DWUETAPOWEGO, dla których wybrano
"Analiza głęboka" — tylko te są wykonywane w pełnej procedurze (KROK B,
§1a MOD-METODY-BADAWCZE). Metody pominięte ("Pomiń") nie są zapisywane w
żadnym polu — ich szkic pozostaje widoczny w historii strategii jako
"rozważone, niewykonane".

---

## 5. Przekazanie do MOD-WARIANTY-POZWU

`MOD-WARIANTY-POZWU` (W1, pisma-procesowe-v3) odczytuje `aspekty_glowne` jako
filtr — warianty pozwu budowane są WOKÓŁ tych roszczeń. `aspekty_poboczne`
przekazywane są jako argumenty wspierające, dodawane do KAŻDEGO wariantu
(nie generują własnych wariantów).

Jeśli `aspekty_glowne.length > 1` i roszczenia są ALTERNATYWNE (nie
kumulatywne — patrz `shared/ROSZCZENIA.md` §3 "czy roszczenia można
kumulować") → każde roszczenie główne może odpowiadać osobnemu wariantowi
pozwu (np. wariant A = roszczenie z czynu niedozwolonego, wariant B =
roszczenie z bezpodstawnego wzbogacenia, jeśli oba dotyczą tego samego stanu
faktycznego jako podstawy alternatywne).

---

## 6. Self-check przed wywołaniem checklisty

```
□ Czy aspekty.length > 1 LUB metody_sugerowane niepuste dla ≥1 aspektu?
  NIE → pomiń checklist (§3.4), kontynuuj automatycznie.
□ Czy każdy aspekt ma kategoria_auto ustaloną wg kryteriów §2 (nie pusta)?
□ Czy dla aspektów z metody_sugerowane != [] wczytano MOD-METODY-BADAWCZE?
□ Dla metod modelu DWUETAPOWEGO (SLE-01/02/03, MET-ACH, MET-NET, MET-FA) —
  czy wykonano WYŁĄCZNIE procedurę szkicu (§1a MOD-METODY-BADAWCZE) PRZED
  renderem checklisty, NIE pełną procedurę?
□ Czy każdy wiersz metody dwuetapowej ma `wstepna_obserwacja` — jeśli nie,
  wiersz pominięty (§3.2a)?
□ Czy formularz "Dodaj własny aspekt" (§3.5) jest obecny w widgecie?
□ Czy wynik checklisty (w tym `metody_gleboka`) zostanie zapisany do
  historii strategii PRZED przejściem do MOD-WARIANTY-POZWU?
□ Czy dla `metody_gleboka` niepustych — KROK 3B (analizator-dowodow-v3)
  wykona PROCEDURĘ GŁĘBOKĄ (§1a) PO zatwierdzeniu checklisty, nie wcześniej?
Którykolwiek = NIE → uzupełnij przed renderem widgetu.
```
