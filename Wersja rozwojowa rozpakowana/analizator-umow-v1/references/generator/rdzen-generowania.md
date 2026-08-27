# RDZEŃ GENEROWANIA — R1–R7 dla trybu tworzenia dokumentów
## Analizator Umów v1 · Moduł generator/ (wczytaj RAZ na starcie każdego workflow generatora)

> Ten plik jest odpowiednikiem `rdzen-ktzr.md` (wzorzec: pakiet `commercial-legal-pl`),
> dostosowanym do architektury systemu użytkownika. Nie duplikuje wiedzy merytorycznej
> zawartej w modułach J0–MA — **odsyła** do niej. Wczytaj ten plik na starcie KAŻDEGO
> workflow z folderu `workflows/generator-*.md`, zanim zaczniesz zadawać pytania
> merytoryczne.

---

## R1 — CYTOWANIE: zero przepisów z pamięci

Każdy artykuł, próg kwotowy, termin ustawowy lub wymóg formy przywołany podczas
generowania dokumentu podlega globalnemu HARD GATE tego skilla
(`view shared/PRAWO-HARDGATE.md`) — **bez wyjątku dla trybu
generowania**. Tworzenie dokumentu od zera jest tu równie ryzykowne jak analiza:
błędny artykuł w wygenerowanej umowie/regulaminie trafia bezpośrednio do obrotu.

- Pierwsze użycie przepisu w sesji → `web_search`/`web_fetch` → ✅ [VER] lub ⚠️ [NIEWERYFIKOWANE].
- Ponowne przywołanie tego samego przepisu w dalszej części tej samej sesji generowania
  (np. przy edycji §, przy generowaniu załącznika) → **weryfikacja ważna w ramach jednej
  sesji**, nie wymaga powtórnego wyszukania, o ile nic się nie zmieniło od pierwszej
  weryfikacji i nie minęła przerwa dłuższa niż jedna rozmowa.

## R2 — BRAMKI: routing → essentialia → styl → format → HYBRID-VALIDATION

Każdy generator w `workflows/generator-*.md` przechodzi przez pięć bramek w tej
kolejności, niezależnie od typu dokumentu:

```
BRAMKA 0  ZŁOTE REGUŁY       wczytaj RAZ na starcie sesji generowania/edycji —
                             `view references/mod-shared-zlote-reguly.md`
                             (nadrzędne wobec stylu i boilerplate, podrzędne
                             wobec R1 i essentialia)
BRAMKA 1  ROUTING           który J-moduł/moduł dostarcza essentialia negotii
                             (patrz tabela w SKILL.md → „GENEROWANIE DOKUMENTÓW”)
BRAMKA 2  WYWIAD/INTAKE      zbierz dane wg INTAKE-GAP; pola nieznane → ⬛
BRAMKA 3  SZKIELET           struktura wg essentialia z modułu źródłowego +
                             boilerplate strukturalny, patrz
                             `view references/generator/boilerplate-strukturalne.md`
BRAMKA 4  STYL, FORMAT       `view references/generator/style-format-generowania.md`
          I KATEGORYZACJA    + diagnoza kategorii klauzul przy klauzulach
                             niejednoznacznych/spornych:
                             `view references/generator/kategorie-klauzul-taksonomia.md`
BRAMKA 4B SPÓJNOŚĆ ODESŁAŃ   dla dokumentów > 15 stron/§/odesłań —
                             `view workflows/weryfikacja-spojnosci-odeslan.md`
                             (dwuetapowa: inwentaryzacja → weryfikacja)
BRAMKA 5  HYBRID-VALIDATION  `view shared/HYBRID-VALIDATION.md`
                             — OBOWIĄZKOWA przed zwróceniem finalnej wersji
                             i przed każdym eksportem .docx
```

Naruszenie kolejności (np. wygenerowanie finalnej treści przed BRAMKĄ 2) = pominięcie
etapu; workflow musi się cofnąć.

## R3 — ROLE: PRAWNIK / LAIK

Rola użytkownika (PRAWNIK domyślnie, LAIK na wyraźny sygnał) obowiązuje **identycznie**
jak w trybie analizy — patrz zasady roli już ustalone w rdzeniu systemu
(`SKILL.md` → sekcja wykrywania roli, jeśli istnieje w danej sesji) lub, przy braku
takiej sekcji, przyjmij PRAWNIK i nie pytaj wprost.

W trybie LAIK dokument generowany jest zawsze ze znacznikiem
`[DRAFT — WYMAGA WERYFIKACJI PRAWNIKA]` na początku i na końcu, niezależnie od
etapu BRAMKI 5.

## R4 — PROFIL: brak `practice-profile.md` w tym systemie

W przeciwieństwie do wzorca `commercial-legal-pl`, ten system nie zakłada jednej
kancelarii z jednym plikiem profilu. Domyślne pozycje negocjacyjne i progi ryzyka
pochodzą z `mod-shared-fallback-library.md` (warianty A/B/C/D) — stosuj je jako
domyślne, chyba że użytkownik poda własne (np. cap odpowiedzialności, forum sporów).

## R5 — FORMAT: patrz style-format-generowania.md

Pełne reguły typograficzne i redakcyjne — `view references/generator/style-format-generowania.md`.
Otwórz ten plik przy KAŻDYM generowaniu lub edycji treści, nie tylko na starcie.

## R6 — AGENTOWOŚĆ: STOP po każdym etapie

Zatrzymuj się po BRAMCE 2 (wywiad) i po BRAMCE 3 (szkielet), czekając na potwierdzenie,
zanim przejdziesz do pełnej treści. Wyjątek: użytkownik powiedział „tryb express” /
„zrób całość bez pytania” — wtedy wykonaj wszystko za jednym razem, ale oznacz w
finalnym dokumencie miejsca, w których normalnie zatrzymałbyś się na decyzję
(`[DO POTWIERDZENIA: ...]`).

## R7 — PROGRESSIVE DISCLOSURE + OUTPUT-COMPLETENESS

Nie ładuj wszystkich modułów generatora naraz — każdy workflow wskazuje, co otworzyć
w danym kroku. Jednocześnie: zgodnie z ZASADĄ 7 `audyt-systemu-v4`
(OUTPUT-COMPLETENESS), każda poprawka lub rozbudowa tego modułu generowania musi
być dostarczona użytkownikowi jako **kompletny skill** (cały folder
`analizator-umow-v1/`, nie pojedynczy zmieniony plik) — dotyczy to Ciebie, gdy
w przyszłości modyfikujesz ten moduł, nie dokumentów generowanych dla klienta.

---

## Mapa: typ dokumentu → moduł essentialia → moduł stylu

| Kategoria | Essentialia / wymogi ustawowe | Workflow generatora |
|---|---|---|
| Umowy (B2B, B2C, najem, IT, IP, itd.) | moduły J0–MA (routing wg tabeli głównej) | `workflows/generator-umowy.md` |
| Regulaminy (usługi elektroniczne, sklep, SaaS) | `references/generator/essentialia-regulaminy-i-korporacyjne.md` §1 + `mod-shared-abusive-clauses.md` (jeśli B2C) | `workflows/generator-regulaminu.md` |
| Statut / umowa spółki / akt założycielski | `mod-FA-founders-dokumenty-zalozycielskie.md` (J20.5) | `workflows/generator-dokumentow-korporacyjnych.md` |
| Uchwały (zarząd/zgromadzenie/wspólnicy) + protokoły | `references/generator/essentialia-regulaminy-i-korporacyjne.md` §2 | `workflows/generator-dokumentow-korporacyjnych.md` |
| Pełnomocnictwa (ogólne/rodzajowe/szczególne, prokura) | `references/generator/essentialia-regulaminy-i-korporacyjne.md` §3 | `workflows/generator-dokumentow-korporacyjnych.md` |
| Regulamin pracy / wynagradzania / ZFŚS | `mod-J21-rodo-archiwizacja-regulaminy.md` (J21.4–J21.5) | `workflows/generator-dokumentow-hr-rodo.md` |
| Polityka prywatności / klauzula informacyjna RODO | `mod-J21-rodo-archiwizacja-regulaminy.md` (J21.2) | `workflows/generator-dokumentow-hr-rodo.md` |
| Polityka AI (dokument wewnętrzny, art. 4/50 AI Act) | `references/generator/doktryna-uzupelnienie.md § D.4` | `workflows/generator-dokumentow-hr-rodo.md` (Ścieżka C) |

**Doktryna uzupełniająca (wczytuj przy trigerach — nie domyślnie):**
open source/copyleft w umowach IT, wizerunek a prawa autorskie, notice&action
DSA w regulaminach UGC → `view references/generator/doktryna-uzupelnienie.md`.
