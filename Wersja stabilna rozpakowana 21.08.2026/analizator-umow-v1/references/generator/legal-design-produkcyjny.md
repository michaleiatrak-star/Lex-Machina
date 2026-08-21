# LEGAL DESIGN — STANDARD PRODUKCYJNY (typografia, layout, wzorce wizualne)
## Analizator Umów v1 · references/generator/ (BRAMKA 4/5 — stosuj przy KAŻDYM eksporcie .docx)

> **Relacja do `mod-shared-legal-design.md`:** tamten moduł to narzędzie
> **oceny** czytelności (scoring D1–D5, dla analizy dokumentu cudzego). Ten
> plik to **standard produkcji** — jak ma wyglądać dokument, który sam
> generujesz. Oceniasz istniejące dokumenty modułem D1–D5; **produkujesz**
> nowe dokumenty wg tego pliku. Uzupełniają się, nie duplikują.
>
> **Źródła doktrynalne i operacyjne:**
> - Hagan, M. (2020), „Legal Design as a Thing: A Theory of Change and a Set
>   of Methods to Craft a Human-Centered Legal System", *Design Issues* 36(3).
> - Hagan, M., *Law by Design* — https://www.lawbydesign.co
> - Haapio, H. & Passera, S. (2021), „Contracts as interfaces: Exploring
>   visual representation patterns in contract design", w: *Legal
>   Informatics*, Cambridge University Press, s. 213–238.
> - Haapio, H. & Hagan, M. (2016), „Design Patterns for Contracts",
>   *Proceedings of the 19th International Legal Informatics Symposium IRIS
>   2016*, SSRN 2747280.
> - Corrales Compagnucci, M. i in. (red.) (2021), *Legal Design*, Edward
>   Elgar Publishing.
> - WorldCC Contract Design Pattern Library —
>   https://contract-design.worldcc.foundation (Passera, Haapio) — 10 rodzin
>   wzorców, open-source, przykłady od Shell, Airbus, Juro i in.
> - Stanford Legal Design Lab — https://www.legaltechdesign.com

**Zasada nadrzędna:** legal design ≠ ozdabianie. To projektowanie dokumentu
pod kątem rzeczywistego odbiorcy (klient biznesowy, pracownik, konsument), nie
drugiego prawnika. Standard tego pliku to **„classic-clean z selektywnym
light legal design"** — nie „full legal design" (kolory, ikony, infografiki
zamiast tekstu normatywnego — tego nie robimy nigdy, patrz Antywzorce).

---

## LD-P.1 Domyślna typografia (stosuj w KAŻDYM dokumencie eksportowanym do .docx)

| Element | Czcionka | Rozmiar | Waga |
|---|---|---|---|
| Treść główna | Arial (lub Calibri, jeśli klient wskaże) | 11,5 pt | Regular |
| Tytuł dokumentu (UMOWA / REGULAMIN / STATUT itd.) | Arial | 16–18 pt | Bold |
| Podtytuł (kwalifikacja prawna) | Arial | 12 pt | Bold |
| Tytuły paragrafów (§ X. Nazwa) | Arial | 12 pt | Bold, border-bottom |

**Wyjątek:** klient prosi wprost o „klasyczny" wygląd → Times New Roman 12 pt,
ta sama struktura i obramowania.

**Obramowania:**
| Element | Border | Kolor | Rozmiar |
|---|---|---|---|
| Pod tytułem paragrafu | dolne | `808080` (mid gray) | 0,75–1 pt |
| Pod tytułem dokumentu | dolne | `808080` | 1 pt |
| Tabele pomocnicze | wszystkie | `CCCCCC` (light gray) | 0,5 pt |

Zasada: subtelne, monochromatyczne. Kolory poza skalą szarości — nigdy w
korpusie dokumentu prawnego, wyłącznie w tabelach pomocniczych i tylko na
wyraźne życzenie klienta.

**Układ:** marginesy 2,5 cm (1 cal akceptowalny), justyfikacja treści dla
akapitów (wyśrodkowanie tylko dla tytułów), spacing 6 pt po akapicie,
interlinia 1,25, hangujące wcięcie dla wyliczeń `a) b) c)` / `1) 2) 3)`.

**Implementacja (skill `docx`, biblioteka docx-js / python-docx):**
```javascript
new Paragraph({
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "808080", space: 4 } },
  children: [new TextRun({ text: "§ X. Tytuł", bold: true })]
})
```

## LD-P.2 Dziesięć rodzin wzorców (WorldCC) — filtr operacyjny dla tego systemu

| Rodzina | Decyzja | Zastosowanie w tym systemie |
|---|---|---|
| **Emphasis** | ✅ zawsze | Bold dla kwot, dat, terminów, numerów rachunków. Kursywa dla definicji w cudzysłowach „…". Border-bottom pod tytułami §. |
| **Layout** | ✅ zawsze | Białe światło, krótkie akapity, hangujące wcięcia — patrz LD-P.1. |
| **Navigation** | ✅ zawsze | Spis treści (auto-generowany, Heading 2) dla dokumentów >5 stron. Aktywne cross-referencje (hiperłącza) zamiast wpisywanego ręcznie „§ 5 ust. 2". |
| **Organizing** | ✅ zawsze | Kolejność klauzul wg chronologii stosunku prawnego, nie alfabetycznie. Definicje na początku, postanowienia końcowe na końcu (patrz `boilerplate-strukturalne.md`). |
| **Tone of voice** | ✅ zawsze | Plain Polish, strona czynna, krótkie zdania — patrz `style-format-generowania.md` S.1. |
| **Summarizing** | ⚖️ selektywnie | Tabela „Kluczowe warunki" (LD-P.3.A) — dokumenty >3 stron LUB gdy odbiorcą jest osoba biznesowa/konsument, nie prawnik drugiej strony. |
| **Layering** | ⚖️ selektywnie | Klauzule techniczne/operacyjne → załączniki, korpus zostaje czytelny. |
| **Visuals** | ⚖️ selektywnie | Timeline (LD-P.3.C) dla projektów wieloetapowych; swimlane (LD-P.3.D) dla procesów z >2 podmiotami. Tylko gdy realnie tłumaczą strukturę — nigdy jako ozdoba. |
| **Explainers** | ⚠️ z ostrożnością | Box wyjaśniający (LD-P.3.E) tylko dla klauzul wyjątkowo nieintuicyjnych (cap odpowiedzialności, wina umyślna, indemnifikacja), gdy klient sygnalizuje niezrozumienie. |
| **Reviewing** | 🏠 wewnętrznie | Checklisty tego skilla (`mod-core-checklist.md`, `style-format-generowania.md`) — nie wprowadzamy do dokumentu wychodzącego do klienta/kontrahenta. |

## LD-P.3 Techniki krok po kroku

### A. Tabela „Kluczowe warunki" (Summarizing)

**Kiedy:** dokument >3 stron, każda ugoda, umowa wdrożeniowa, umowa ramowa,
regulamin dla konsumentów. **Lokalizacja:** pod tytułem dokumentu, przed lub
zaraz po komparycji.

```
| Strony                | [Strona A] / [Strona B]                    |
| Przedmiot             | [1 zdanie]                                  |
| Wynagrodzenie         | [Kwota / mechanizm rozliczenia]             |
| Czas trwania          | [Daty lub okres]                            |
| Najważniejsze terminy | [Terminy płatności, wygaśnięcia itd.]       |
| Sąd/organ właściwy    | [Miejscowość / organ]                       |
```

Charakter: informacyjny, nie normatywny — wiąże treść paragrafów, nie tabela.
Jeśli klient pyta — można dopisać w postanowieniach końcowych „Tabela ma
charakter wyłącznie informacyjny", ale domyślnie nie wpisuj (zbędne).

### B. Spis treści (Navigation)

**Kiedy:** dokument >5 stron. **Jak:** tytuły § oznaczone jako *Heading 2* w
docx, następnie auto-generowany spis treści, font dopasowany do reszty (Arial
11,5).

### C. Timeline (Visuals)

**Kiedy:** dokument opisujący projekt wieloetapowy (wdrożenie IT, projekt
budowlany, migracja, harmonogram uchwał korporacyjnych). Dla prostych
przypadków (np. ugoda z 3 ratami) — *nie warto*, wystarczy tabela.
**Jak:** SmartArt/diagram procesu poziomy, 3–7 etapów, każdy = krótka nazwa +
data/milestone, monochromatycznie lub jeden kolor akcentowy.

### D. Swimlane (Visuals)

**Kiedy:** procesy wieloetapowe z udziałem >2 podmiotów (np. body leasing IT
— Zamawiający / Usługodawca / Specjalista; uchwały z udziałem zarządu, RN i
zgromadzenia). **Jak:** diagram z wierszami = strony, kolumnami = fazy,
strzałki przepływu między wierszami.

### E. Explainer box (Explainers)

**Kiedy:** rzadko — klauzula technicznie złożona, klient wprost sygnalizuje
niezrozumienie.

```
┌─────────────────────────────────────────────┐
│ Wyjaśnienie (charakter informacyjny):        │
│ [2–3 zdania plain Polish, co klauzula        │
│ oznacza w praktyce]                          │
└─────────────────────────────────────────────┘
```

Wizualnie oddzielony od klauzuli (tabela 1×1, lekki border, font 10,5 pt
italic). Charakter informacyjny — nigdy nie zastępuje treści normatywnej.

## LD-P.4 Pięć pytań przed zwróceniem/wysłaniem dokumentu

1. Czy dokument ma >3 strony? → dodaj tabelę „Kluczowe warunki".
2. Czy odbiorca (biznesowy/konsument/pracownik) skorzysta z natychmiastowego
   podglądu parametrów? → jw.
3. Czy dokument >5 stron? → dodaj spis treści.
4. Czy opisuje proces wieloetapowy/wielopodmiotowy? → rozważ timeline/swimlane.
5. Czy cross-referencje są aktywne (hiperłącza w Wordzie)? Jeśli nie → popraw,
   bo statyczny „§ 5 ust. 2" przy późniejszej renumeracji staje się błędem
   (routing: `workflows/weryfikacja-spojnosci-odeslan.md`).

Jeśli odpowiedź na 1–4 to „nie" — dokument zostaje w stylu **classic-clean**
(LD-P.1, bez elementów dodatkowych).

## LD-P.5 Antywzorce — nigdy

- Comic contracts (ilustracje zamiast treści normatywnej).
- Kolorowe schematy w treści normatywnej — wygląda jak prezentacja, nie
  dokument prawny.
- Ikony zastępujące tekst w klauzulach (dopuszczalne jako akcent w tabeli
  „Kluczowe warunki", nigdy zamiast treści).
- Emoji w dokumencie wychodzącym do klienta/kontrahenta (emoji statusu ✅/⚠️/❌
  są OK w raportach analitycznych wewnętrznych — Moduł F w
  `mod-core-checklist.md` — nigdy w generowanym dokumencie do podpisu).
- Nadużywanie pogrubienia — rezerwuj dla kwot, dat, kluczowych zobowiązań.
- Dwa różne fonty w jednym dokumencie (poza Courier dla kodu w załączniku
  technicznym).
- Ciemniejsze obramowanie komórek tabeli niż treść — zawsze jasny szary.

## LD-P.6 Kiedy uruchamiać „light legal design" zamiast „classic-clean"

Domyślnie: **classic-clean** (LD-P.1 bez elementów dodatkowych).
**Light legal design** (tabela + ew. ToC/timeline) uruchom, gdy spełniony co
najmniej jeden warunek:
- dokument >5 stron i odbiorcą jest osoba biznesowa/konsument/pracownik
  (nie prawnik drugiej strony),
- dokument opisuje proces wieloetapowy z milestone'ami,
- klient wprost prosi o „user-friendly"/czytelny dokument,
- dokument będzie używany operacyjnie przez zespoły, nie tylko podpisany i
  zarchiwizowany.

**„Full legal design"** (kolory, ikony, infografiki) — poza zakresem tego
skilla; jeśli klient tego potrzebuje, zasygnalizuj to wprost jako osobną
usługę projektową, nie generuj.

## Powiązania

- `mod-shared-legal-design.md` — scoring D1–D5 (ocena dokumentów cudzych).
- `references/generator/style-format-generowania.md` — S.1–S.4 (styl i
  format tekstu, ten plik dotyczy layoutu/typografii/wizualizacji).
- `references/generator/boilerplate-strukturalne.md` — kolejność sekcji,
  z którą LD-P.2 „Organizing" musi być spójne.
- `workflows/weryfikacja-spojnosci-odeslan.md` — aktywne cross-referencje
  (LD-P.4 pkt 5) muszą przejść tę weryfikację przed finalizacją.
