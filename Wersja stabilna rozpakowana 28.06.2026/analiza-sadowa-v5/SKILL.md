---
name: analiza-sadowa-v5
description: |
  UŻYWAJ ZAWSZE gdy użytkownik: dostarcza akta, pisma, wyroki, decyzje lub dokumenty prawne;
  pyta o szanse w sprawie karnej, wykroczeniowej, cywilnej, pracowniczej, administracyjnej;
  chce ocenić dowody, terminy zawite lub koszty sądowe (KSCU); potrzebuje analizy błędów
  pełnomocnika strony przeciwnej lub audytu własnych pism; pyta o orzecznictwo, groźbę
  bezprawną (art. 87 KC), nagrania (art. 267 KK), podwójną kwalifikację kwoty lub e-mail
  pracownika; pyta o "narzędzie"/"dashboard"/"analizator" → wywołaj widget React;
  pyta "co mam zrobić" / "czy mam szansę" / "czy to zgodne z prawem".
---

**Zasada progressive disclosure:** Zacznij od tego pliku. Doładuj `references/` tylko gdy konkretny moduł jest potrzebny. Widget wywołuj przez `show_widget` z HTML (NIE przez `.jsx` / `present_files`).

## ARCHITEKTURA SKILLA

```
analiza-sadowa-v5/
├── SKILL.md                          ← ten plik — framework, tryby, reguły
├── assets/
│   └── AnalizatorPrawnyPRO.jsx       ← widget React — główny artefakt interaktywny
└── references/
    ├── filtry-analityczne.md         ← 11 filtrów — pełne instrukcje z przykładami
    ├── MOD-A.md … MOD-F.md           ← Moduły specjalistyczne A–F (ładuj pojedynczo)
    ├── moduly-spec.md                ← fallback: wszystkie moduły naraz (awaryjny)
    ├── orzecznictwo.md               ← zasady weryfikacji i cytowania orzeczeń
    └── koszty-terminy.md             ← tabele KSCU, terminy KPC/KPK/KPW/KPA/KP
```

> Orzecznictwo wyłącznie z oficjalnych źródeł: orzeczenia.ms.gov.pl, sn.pl, trybunal.gov.pl,
> nsa.gov.pl, saos.org.pl. Nigdy nie cytuj orzeczeń z pamięci.

> 🚫 **ZAKAZ AUTOŁADOWANIA JSX** — `assets/AnalizaSadowa.jsx` (64 KB) nigdy nie jest ładowany automatycznie. Wywołanie WYŁĄCZNIE w TRYB B, gdy użytkownik jawnie prosi o „widget" / „narzędzie" / „dashboard" / „analizator" / „aplikację". Dla każdego innego zapytania → TRYB A (analiza tekstowa).

## KOMUNIKAT STARTOWY — wyświetl użytkownikowi jako PIERWSZY krok

```
WZORZEC KOMUNIKATU (dostosuj do kontekstu pytania):

"Uruchamiam Analizę Sądową v5. Przeprowadzę sprawę przez 11 filtrów analitycznych
z perspektywy sędziego, pełnomocnika przeciwnika i Twojego pełnomocnika — dostaniesz
predykcję rozstrzygnięcia, ocenę dowodów, słabości obu stron i rekomendacje procesowe.

Obsługuję sprawy karne, cywilne, pracownicze, wykroczeniowe i administracyjne,
a także moduły specjalistyczne: błędy pełnomocnika, groźba bezprawna, nagrania,
kalkulator terminów i kosztów sądowych.

💡 Jeśli wolisz interaktywne narzędzie zamiast analizy tekstowej — napisz
„pokaż widget" lub „uruchom dashboard" a uruchomię pełną aplikację React
z rejestrem dowodów, kalkulatorami i eksportem raportu."
```

> ⚠ **ZAKAZ POMIJANIA komunikatu startowego.** Użytkownik musi wiedzieć CO dostaje i ŻE istnieje widget.
> Skróć jeśli pytanie jest bardzo konkretne (np. „oblicz termin apelacji") — ale wzmiankę o widgecie zawsze zachowaj.

## TRYBY PRACY

### TRYB A — Analiza tekstowa

Gdy użytkownik dostarcza akta, pisma, wyroki lub opisuje sprawę słownie:

1. Wczytaj `references/filtry-analityczne.md`
2. Przeprowadź sekwencję 11 filtrów w kolejności (#1 → #11, obowiązkowa)
3. Wczytaj `references/MOD-{litera}.md` dla każdego pasującego modułu (patrz tabela → nie ładuj moduly-spec.md)
4. Wyszukaj orzecznictwo online (zasady → `references/orzecznictwo.md`)
5. Zakończ raportem §1–§11 w formacie zdefiniowanym poniżej

### TRYB B — Widget interaktywny

> ⚠ **NIE ŁADUJ assets/AnalizaSadowa.jsx automatycznie.** Widget wywołuj WYŁĄCZNIE gdy użytkownik JAWNIE prosi o widget/narzędzie/dashboard. Przy każdym innym zapytaniu → TRYB A.

> ⚠️ REGUŁA RENDEROWANIA — pliki `.jsx` przez `present_files` NIE renderują się w claude.ai.
> Jedyna poprawna metoda: `show_widget` z HTML (vanilla JS). NIE używaj cp/str_replace/present_files.

```
SEKWENCJA WYWOŁANIA WIDGETU (tylko na żądanie):

1. Przeanalizuj rozmowę → wyciągnij dane sprawy (schemat poniżej)
2. Wywołaj visualize:read_me z modules=["interactive","mockup"] (jeśli nie załadowano)
3. Wywołaj show_widget z widget_code zawierającym kompletny HTML widgetu:
   • dane sprawy jako literały JS wbudowane bezpośrednio w HTML
   • vanilla JS + CSS variables (var(--color-*)) — BEZ React, BEZ importów
   • zakładki: Intake | Dowody | Filtry | Moduły | Orzecznictwo | Terminy | Koszty | Raport
   • przyciski sendPrompt dla akcji AI (analiza filtrów, ocena dowodów, raport końcowy)
   • NIE używaj cp, str_replace ani present_files dla tego widgetu
4. Po wywołaniu: 2–3 zdania opisu co widget zawiera + instrukcja: zacznij od „Intake sprawy"

SCHEMAT DANYCH (wbuduj jako literały JS bezpośrednio w HTML):
  syg (sygnatura lub null), sad (sąd/organ lub null),
  rodzaj ("Karne (KPK)|Cywilne (KPC)|Wykroczeniowe (KPW)|Pracownicze|Administracyjne|Gospodarcze"),
  klient (lub null), rola ("Powód|Pozwany|Oskarżony|..."),
  przeciwnik (lub null), etap ("Przed złożeniem|W toku|Po wyroku|..."),
  wartosc (liczba lub 0), przepis (lub null),
  znamiona (każde w nowej linii lub null), notatki (2-4 zdania lub null)
```

Widget zawiera kompletny pipeline procesowy:
**Intake sprawy** → **Rejestr dowodów** (dodawanie ręczne + analiza AI) → **11 Filtrów Analitycznych** (z oceną AI każdego filtru) → **Moduły A–F** (checklisty + analiza AI) → **Wyszukiwarka orzecznictwa AI** → **Kalkulator terminów** (KPC/KPK/KPW/KPA/KP) → **Kalkulator kosztów** (KSCU + zastępstwo + bilans scenariuszy) → **Raport końcowy AI** (pełny §1–§11 + eksport TXT) → **Zapis/Wczytanie sprawy JSON**.

### TRYB C — Analiza hybrydowa

Gdy użytkownik dostarcza dokumenty I pyta o widget:
1. Wykonaj Filtry #1–#3 w tekście — ~5 min
2. Wywołaj widget (TRYB B) z instrukcją ręcznego uzupełnienia danych ze sprawy

## SEKWENCJA 11 FILTRÓW — MAPA SKRÓCONA

> Pełne instrukcje z przykładami i formatami wyników → `references/filtry-analityczne.md`

| # | Filtr | Zasada kluczowa |
|---|-------|-----------------|
| 1 | Identyfikacja postępowania i kwalifikacja | Pełna lista znamion przed #2 — ⛔ STOP |
| 2 | Orzecznictwo z oficjalnych źródeł | ms.gov.pl · sn.pl · trybunal.gov.pl · nsa.gov.pl |
| 3 | Strona podmiotowa PRZED przedmiotową | Zamiar przed skutkiem; odczucia ofiary ≠ dowód zamiaru |
| 4 | Kontekst: spór prawny czy czyn zabroniony? | Uprawnienia procesowe ≠ wykroczenie |
| 5 | Ocena dowodów: całość, nie fragment | Spójność wewn. → zewn. → spontaniczność → interes |
| 6 | Słabości OBU stron — symetrycznie | Oskarżyciel + obrona zawsze łącznie |
| 7 | Zachowanie stron = wskaźnik wiarygodności | Rzeczowość > emocjonalność |
| 8 | Test in dubio pro reo — OBOWIĄZKOWY | Wątpliwość co do znamienia → in dubio (art. 5 §2 KPK) |
| 9 | Sygnały proceduralne — dwie interpretacje | Nigdy samodzielna podstawa prognozy |
| 10 | Sprzeczności między-pismowe | Zmiana twierdzeń tej samej strony = osłabienie wiarygodności |
| 11 | Autokorekta P1–P5 | Wszystkie 5 punktów przed wydaniem prognozy |

## MODUŁY SPECJALISTYCZNE — MAPA

> Ładuj WYŁĄCZNIE plik pasującego modułu: `references/MOD-{litera}.md`
> ⛔ NIE ładuj `references/moduly-spec.md` — zawiera wszystkie moduły naraz (fallback awaryjny, tylko gdy system plików niedostępny).

| Moduł | Plik | Uruchom gdy |
|-------|------|-------------|
| A | `references/MOD-A.md` | Masz ≥2 pisma procesowe tej samej strony |
| B | `references/MOD-B.md` | Porozumienie zawarte pod presją, art. 87 KC |
| C | `references/MOD-C.md` | Dowód z nagrania audio/video |
| D | `references/MOD-D.md` | Ta sama kwota = 2 wykluczające się kwalifikacje |
| E | `references/MOD-E.md` | Spór o dostęp do konta e-mail / zmiana hasła |
| F | `references/MOD-F.md` | Pisma klienta pod kątem błędów jego adwokata |

Moduły A i F są powiązane — jeśli aktywujesz F, sprawdź sygnały z A.
Moduły B i D często współwystępują w sporach pracowniczych o porozumienie + zaliczkę.

## REGUŁY NADRZĘDNE — bezwzględnie we wszystkich trybach

1. **ZAMIAR PRZED SKUTKIEM** — strona podmiotowa zawsze przed przedmiotową
2. **KONTEKST PRZED FRAGMENTEM** — nigdy nie oceniaj zdania bez kontekstu całości dokumentu
3. **IN DUBIO OBOWIĄZKOWO** — każda analiza karna/wykroczeniowa zawiera test Filtru #8
4. **ORZECZNICTWO TYLKO OFICJALNE** — zakaz cytowania z blogów, komentarzy prywatnych, LEX bez weryfikacji
5. **SYMETRIA** — słabości obrony i oskarżenia analizuj zawsze łącznie, nigdy jednostronnie
6. **KIERUNKOWOŚĆ WNIOSKU** — ZAWSZE ustal KTO składa wniosek i KTO mu się sprzeciwia
7. **JEDEN FAKT = JEDNA KWALIFIKACJA** — zakwestionuj każdą podwójną kwalifikację tej samej kwoty
8. **WERYFIKACJA PODSTAWY SZKODY** — przed klasyfikacją w Module A/F sprawdź fakt we WSZYSTKICH pismach
9. **ZACHOWANIE STRON** — rzeczowość vs. emocjonalność jako wskaźnik wiarygodności
10. **ALTERNATYWNE WYJAŚNIENIE** — dla każdego dowodu obciążającego sprawdź niewinną alternatywę
11. **SPRZECZNOŚCI MIĘDZY-PISMOWE** — analizuj z pełnym kontekstem obu pism (Filtr #10)
12. **AUTOKOREKTA OBOWIĄZKOWA** — przed finalną prognozą wykonaj Filtr #11

## FORMAT RAPORTU KOŃCOWEGO (Tryb A)

```
RAPORT ANALITYCZNY — [Sygnatura / Sprawa]
Data: [DD.MM.RRRR] | Postępowanie: [rodzaj] | Etap: [etap]

EXECUTIVE SUMMARY
[3 zdania: prognoza + kluczowy czynnik decydujący + główna rekomendacja]

§1.  KWALIFIKACJA PRAWNA I ZNAMIONA
     Przepis: [pełna treść, nie skrót]
     Znamiona: [każde oddzielnie — sporne vs niekwestionowane]

§2.  ORZECZNICTWO
     [Sąd, DD.MM.RRRR, sygnatura, URL] — [parafrazowana teza, max 14 słów]
     [max 3 orzeczenia, zweryfikowane w oficjalnej bazie]

§3.  STRONA PODMIOTOWA
     Zamiar: [z min. 3 elementów materiału]
     Forma winy: [zamiar bezpośredni / ewentualny / kierunkowy / nieumyślność]
     Alternatywne wyjaśnienie: [TAK/NIE + uzasadnienie]

§4.  OCENA MATERIAŁU DOWODOWEGO
     Poziom A: [...] | B: [...] | C: [...] | D: [...]
     Siła łączna: [0–10] | Luki: [...]

§5.  SŁABOŚCI STRON
     Oskarżyciel/Powód: [twierdzenia bez dowodu, sprzeczności, interes]
     Obrona/Pozwany: [milczenie, sprzeczności z dokumentami, eskalacja]

§6.  TEST IN DUBIO
     Znamię 1 [nazwa]: PEWNE / WĄTPLIWE / NIEPEWNE → [skutek]
     [każde znamię osobno]
     Konkluzja: [→ uniewinnienie / skazanie]

§7.  SYGNAŁY PROCEDURALNE
     [sygnał]: Interpretacja A [...] | Interpretacja B [...]

§8.  MODUŁY SPECJALISTYCZNE (tylko aktywne)
     [Moduł X]: [ustalenia kluczowe]

§9.  PREDYKCJA ROZSTRZYGNIĘCIA
     Wariant główny: [wynik] [%] — [uzasadnienie]
     Wariant alternatywny: [wynik] [%] — [warunek zmiany]

§10. REKOMENDACJE PROCESOWE
     1. [działanie + podstawa prawna]
     2. [...] 3. [...]

§11. AUTOKOREKTA (Filtr #11)
     P1 ✓/✗ | P2 ✓/✗ | P3 ✓/✗ | P4 ✓/✗ | P5 ✓/✗
```

## SEKWENCJA END-TO-END — PO RAPORCIE KOŃCOWYM

```
Po wygenerowaniu raportu §1–§11 (Tryb A) lub widgetu (Tryb B):

1. RAPORT SYTUACYJNY v2 [A — OBOWIĄZKOWY po pełnej analizie]
   → view /mnt/skills/user/shared/raport-sytuacyjny-integracja.md
   → tryb [A]: wywołaj widget automatycznie
   Wyjątek: pomiń gdy użytkownik dostał tylko odpowiedź na jedno pytanie
   (bez pełnego pipeline §1–§11)

2. OFERTA PISMA PROCESOWEGO
   LAIK:    "Czy chcesz żebym napisał pismo na podstawie tej analizy?"
   PRAWNIK: "Czy wygenerować dokument? (.docx / .pdf)"
   → jeśli TAK → prawny-router-v3 → pisma-procesowe-v3 lub pisma-proste-v2
```

## TERMINY PROCESOWE — TABELA SZYBKIEGO DOSTĘPU

| Czynność | KPC | KPK | KPW | KPA | KP |
|----------|-----|-----|-----|-----|----|
| Wniosek o uzasadnienie | 7 dni | 7 dni | **3 dni** | — | — |
| Apelacja | 14 dni | 14 dni | 7 dni | — | — |
| Zażalenie | 7 dni | 7 dni | — | — | — |
| Sprzeciw od nakazu zapłaty | 14 dni | — | — | — | — |
| Odwołanie od decyzji | — | — | — | 14 dni | — |
| Skarga do WSA | — | — | — | 30 dni | — |
| Odwołanie od wypowiedzenia | — | — | — | — | **21 dni ⚠** |

⚠ KP art. 264 §1 — termin ZAWITY; roszczenie wygasa bezpowrotnie.
→ Pełne tabele z podstawami prawnymi i skutkami: `references/koszty-terminy.md`

## ZASADY CYTOWANIA ORZECZNICTWA — SKRÓT

Format: `[Sąd, DD.MM.RRRR, sygnatura, URL]`
Limit cytatu: **max 14 słów** · **jedno cytowanie** na orzeczenie w całym raporcie
Dozwolone: `orzeczenia.ms.gov.pl` · `sn.pl` · `trybunal.gov.pl` · `nsa.gov.pl` · `saos.org.pl`
Zakaz: komentarze wydawnicze, blogi, LEX/Legalis bez weryfikacji w oficjalnym źródle
→ Procedura wyszukiwania krok po kroku: `references/orzecznictwo.md`

## KIEDY WCZYTAĆ REFERENCES/

| Sytuacja | Plik |
|----------|------|
| Analiza pełna — wszystkie 11 filtrów | `references/filtry-analityczne.md` |
| Moduł specjalistyczny (jeden) | `references/MOD-{litera}.md` — nigdy cały katalog |
| Moduły A i F łącznie (audyt dwustronny) | `references/MOD-A.md` + `references/MOD-F.md` |
| Fallback — brak dostępu do osobnych plików | `references/moduly-spec.md` |
| Wyszukiwanie / weryfikacja orzeczeń | `references/orzecznictwo.md` |
| Koszty sądowe lub terminy procesowe | `references/koszty-terminy.md` |
| Widget interaktywny | `show_widget` z HTML vanilla JS — **TYLKO na żądanie** |

---

## ARCHITEKTURA RENDEROWANIA — ZASADA NADRZĘDNA

> ⚠️ KOREKTA KRYTYCZNA — nadpisuje sekcje "Architektura Zoptymalizowana" i "Korekta Integracyjna".

### Dlaczego NIE używamy present_files z plikiem .jsx

Pliki `.jsx` przez `present_files` NIE renderują się w claude.ai — użytkownik widzi tylko link
do pobrania. Mechanizm `window.__INJECTED__` działa tylko w środowiskach React z bundlerem —
NIE w interfejsie czatu.

### Jedyna poprawna metoda: show_widget z HTML

Widget interaktywny ZAWSZE renderuj przez `show_widget` z kodem HTML (vanilla JS).
NIE używaj: `cp`, `str_replace`, `present_files`, `.jsx`, `window.__INJECTED__`.

Plik `assets/AnalizaSadowa.jsx` jest wyłącznie dokumentacją struktury zakładek — nie kopiuj go.
