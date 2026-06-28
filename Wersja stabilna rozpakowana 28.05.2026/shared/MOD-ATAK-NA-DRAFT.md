# MOD-ATAK-NA-DRAFT — symulacja ataku przeciwnika na gotowy draft pisma

> Wersja: 1.1.0 | Typ: moduł jakości | shared/
> Wywoływany z: pisma-procesowe-v3 (W2, krok W2.4 — ZAWSZE po W2.3)
> Obligatoryjny: TAK — bez warunku aktywacji. Każdy draft przechodzi przez ten moduł.
> Podstawa ekspercka: Garner/Scalia "Making Your Case" §35 ("Before filing, read
> your brief as if you were opposing counsel — then fix what you find.");
> Suntum ALI-ABA 2007 ("The best test of a brief is whether you can rebut it.")

---

## 1. Cel

Moduł symuluje pełnomocnika strony przeciwnej czytającego gotowy draft z W2.
Zadaniem jest wykrycie słabości PRZED złożeniem pisma — nie po ripoście.
Atak jest prowadzony na gotowym tekście (akapit po akapicie), nie na ramie z W1.

**Różnica względem W1.6 MOD-RED-TEAM-WLASNY:**
- W1.6 atakuje RAMY i TEZY (przed redakcją)
- W2.4 atakuje GOTOWY TEKST (po redakcji, przed W3)

---

## 2. Warunek aktywacji

```
⛔ OBLIGATORYJNY — wykonaj ZAWSZE po W2.3, bez wyjątku.
NIE pomijaj nawet gdy:
  - sprawa wydaje się prosta
  - użytkownik nie prosił o atak
  - użytkownik chce "szybko" — to NIE jest wyjątek od W2.4
  - ZAKAZ-4 (nie łącz wiadomości) — W2.4 jest CZĘŚCIĄ W2, nie osobną wiadomością
```

---

## 3. Protokół ataku — 4 kroki

### D1 — Skan zdań kategorycznych

```
Przeczytaj draft. Zaznacz każde zdanie zawierające:
  - "zawsze" / "nigdy" / "bezspornie" / "oczywiste" / "jednoznacznie"
  - "pracodawca wiedział" / "pozwana miała świadomość" (twierdzenia o stanie
    wiedzy strony — wymagają dowodu bezpośredniego, nie poszlak)
  - "co zostało udowodnione" / "wykazano ponad wszelką wątpliwość"
    (przedwczesne konkluzje dowodowe)

Dla każdego zaznaczonego zdania:
  → Oceń czy twierdzenie ma bezpośredni dowód w W1.3
  → TAK: pozostaw
  → NIE: złagódź do: "co wskazują dowody", "co wynika z materiału"
  → Naprawa: redakcyjna, samodzielnie, bez pytania użytkownika
```

### D2 — Test pełnomocnika przeciwnika (akapit po akapicie)

```
Dla każdego akapitu uzasadnienia zadaj pytanie:
  "Jak pełnomocnik pozwanej zaatakuje ten akapit?"

Matryca ataku:
  [FAKT]    → czy twierdzenie jest sporne? Czy dowód wystarcza?
  [PRAWO]   → czy przepis stosuje się do tego stanu faktycznego?
              Czy pozwana może powołać wyjątek / inną interpretację?
  [LOGIKA]  → czy wniosek wynika z przesłanek? Czy nie ma luki?
  [PROCES]  → czy twierdzenie jest dopuszczalne na tym etapie?
              Czy nie zachodzi prekluzja dowodowa?

Klasyfikacja każdego ataku:
  🔴 KRYTYCZNY  — uderza w fundament roszczenia; jeśli sąd przychyli się
                   do ataku, roszczenie odpada w całości
  🟠 ISTOTNY    — osłabi szanse lub wymusi obniżenie żądania
  🟡 UMIARKOWANY — Lorica podniesie, ale sąd prawdopodobnie oddali
  🟢 KOSMETYCZNY — styl, terminologia, kolejność

Naprawa:
  🔴 KRYTYCZNY  → obowiązkowa korekta (patrz §4)
  🟠 ISTOTNY    → obowiązkowa korekta lub explicitna obrona w tekście
  🟡 UMIARKOWANY → zalecana korekta lub zdanie uprzedzające atak
  🟢 KOSMETYCZNY → naprawa redakcyjna samodzielnie
```

### D3 — Skan sprzeczności międzyakapitowych

```
Sprawdź czy:
  - twierdzenie w akapicie A nie jest sprzeczne z twierdzeniem w akapicie B
    (np. "powód był gotów do pracy" vs wcześniej "powód nie miał możliwości
    kontaktu z pracodawcą" — bez wyjaśnienia dlaczego oba są prawdziwe)
  - liczby, daty i kwoty są spójne w całym piśmie
  - podmiot "pozwana" / "pracodawca" jest używany konsekwentnie
    (szczególnie gdy w sprawie jest więcej niż jedna spółka)
  - kwalifikacja prawna jest spójna (np. pismo nie twierdzi jednocześnie
    że umowa wygasła i że stosunek pracy trwa — chyba że to żądanie ewentualne
    wyraźnie oznaczone)

Naprawa: redakcyjna, samodzielnie.
```

### D5 — Analiza własnych słabości i ryzyk prawnych

```
Odrębna od D2 (perspektywa przeciwnika) — tutaj patrzysz oczami
WŁASNEJ STRONY i SĄDU, nie pełnomocnika pozwanej.

Dla każdego roszczenia / głównego argumentu odpowiedz:

RYZYKO PRAWNE (RP):
  RP-1: Czy przepis na który się powołujemy stosuje się do tego stanu
        faktycznego bez wyjątku / bez warunku dodatkowego?
        → Jeśli NIE lub NIE WIADOMO: oznacz ⚠️ RYZYKO INTERPRETACYJNE
  RP-2: Czy istnieje rozbieżność w orzecznictwie co do tej kwestii?
        → Jeśli TAK: wstaw zdanie uprzedzające ("W doktrynie przyjmuje się...")
  RP-3: Czy roszczenie może być przedawnione lub sprekludowane?
        → Sprawdź termin z art. 291 KP (3 lata) / art. 117 KC / art. 193 §3 KPC
  RP-4: Czy żądanie jest na tyle precyzyjne, że sąd może wpisać je
        do sentencji wyroku bez redakcji? Jeśli NIE → przepisz petitum.

RYZYKO DOWODOWE (RD):
  RD-1: Które twierdzenie kluczowe opiera się WYŁĄCZNIE na zeznaniach
        jednego świadka? → oznacz ⚠️ RYZYKO POJEDYNCZEGO ŚWIADKA
  RD-2: Które dowody mogą zostać zakwestionowane jako spóźnione
        (prekluzja art. 205(3) KPC w zw. z art. 458(5) KPC)?
  RD-3: Czy jest dowód, który może szkodzić bardziej niż pomagać?
        → sprawdź zeznania świadka pod kątem wypowiedzi dwuznacznych

RYZYKO PROCESOWE (RPC):
  RPC-1: Czy rozszerzenie powództwa jest dopuszczalne na tym etapie?
         (art. 193 §1 KPC — do zamknięcia rozprawy; weryfikacja czy
         nie ma zakazu po doręczeniu odpowiedzi na pozew — §2¹)
  RPC-2: Czy WPS jest poprawnie oznaczone? Czy opłata jest należna?
  RPC-3: Czy pismo może wywołać skutek niekorzystny
         (przyznanie, prekluzja, zmiana właściwości)?

Klasyfikacja:
  🔴 WYSOKI   — realizacja ryzyka = oddalenie roszczenia w całości
  🟠 ISTOTNY  — realizacja ryzyka = obniżenie zasądzonej kwoty / oddalenie jednego żądania
  🟡 NISKI    — realizacja ryzyka = komplikacja procesowa bez utraty roszczenia

Naprawa:
  🔴/🟠 → obowiązkowe zdanie ubezpieczające w tekście LUB zmiana konstrukcji
           (żądanie ewentualne, alternatywna podstawa prawna)
  🟡    → notacja w RAPORCIE D, bez korekty pisma
```

### D4 — Weryfikacja luk dowodowych na gotowym tekście

```
Dla każdego twierdzenia kluczowego (D2 klasa 🔴/🟠):
  → Czy istnieje dowód w aktach / dostarczonych przez użytkownika?
  → TAK: wstaw odniesienie do dowodu w tekście
  → NIE: oznacz jako ⬛ LUKA D4 z opisem

Jeśli wykryto ≥1 ⬛ LUKA D4 klasy 🔴 lub 🟠:
  ⛔ STOP — nie przechodzij do W3
  → Wyświetl RAPORT D (§5) z sekcją PYTANIA DO UŻYTKOWNIKA
  → Czekaj na odpowiedź użytkownika (fakt lub świadoma decyzja o konstrukcji
    ewentualnej R6)
  → Dopiero po odpowiedzi: uzupełnij draft i przejdź do W3

Jeśli brak luk 🔴/🟠 → przejdź do W3 automatycznie (wyświetl RAPORT D).
```

---

## 4. Korekta obowiązkowa dla ataków KRYTYCZNYCH (🔴)

Dla każdego ataku 🔴:
```
Opcja A — KONTRATAK w tekście:
  Dodaj akapit / zdanie uprzedzające atak i go obalające.
  Format: "Pozwana może podnieść, że [zarzut]. Zarzut ten jest bezzasadny,
           ponieważ [odpowiedź z podstawą prawną/dowodową]."

Opcja B — ZMIANA KWALIFIKACJI:
  Jeśli atak trafia w słabość nienaprawialną — rozważ zmianę kwalifikacji
  prawnej (np. z roszczenia głównego na ewentualne, z art. X na art. Y).
  Wymaga zgłoszenia do użytkownika w RAPORCIE D.

Opcja C — USUNIĘCIE ARGUMENTU:
  Jeśli argument szkodzi bardziej niż pomaga — usuń go.
  Nie ma obowiązku powoływania każdego możliwego przepisu.
```

---

## 5. Raport D (format wyjściowy — obligatoryjny)

```
═══════════════════════════════════════════════════════════
RAPORT MOD-ATAK-NA-DRAFT (W2.4)
Pismo:      [typ] | Sprawa: [sygn.] | Data: [data]
═══════════════════════════════════════════════════════════

D1 — Zdania kategoryczne:
  [lista napraw lub "brak"]

D2 — Atak pełnomocnika:
  🔴 KRYTYCZNE:   [lista | lub "brak"]
  🟠 ISTOTNE:     [lista | lub "brak"]
  🟡 UMIARKOWANE: [lista | lub "brak"]
  🟢 KOSMETYCZNE: [lista | lub "brak — pominięto"]

D3 — Sprzeczności:
  [lista napraw lub "brak"]

D4 — Luki dowodowe:
  [lista ⬛ LUKA D4 lub "brak — wszystkie twierdzenia pokryte dowodem"]

D5 — Własne słabości i ryzyka:
  RP (prawne):  [lista ⚠️ RYZYKO lub "brak"]
  RD (dowodowe): [lista ⚠️ RYZYKO lub "brak"]
  RPC (procesowe): [lista ⚠️ RYZYKO lub "brak"]

═══════════════════════════════════════════════════════════
WYNIK:
  ✅ ATAK-OK   — brak ataków 🔴/🟠 bez pokrycia; przejdź do W3 automatycznie
  🟡 ATAK-UWAGI — ataki 🟡/🟢 naprawione redakcyjnie; przejdź do W3
  🔴 ATAK-STOP  — wykryto ⬛ LUKA D4 klasy 🔴 lub 🟠; STOP; pytania poniżej

PYTANIA DO UŻYTKOWNIKA (tylko gdy ATAK-STOP):
  [1] [konkretne pytanie per luka D4]
  [2] ...
═══════════════════════════════════════════════════════════
```

---

## 6. Integracja z pipeline pisma-procesowe-v3

```
W2.2 Redakcja pisma
  ↓
W2.3 Lista kontrolna placeholderów
  ↓
W2.4 MOD-ATAK-NA-DRAFT  ← TEN MODUŁ
  view /mnt/skills/user/shared/MOD-ATAK-NA-DRAFT.md
  → D1: skan kategorycznych
  → D2: test pełnomocnika akapit po akapicie
  → D3: skan sprzeczności
  → D5: analiza własnych słabości i ryzyk (RP / RD / RPC)
  → D4: weryfikacja luk dowodowych
  → Naprawa redakcyjna (D1/D2🟡🟢/D3) — samodzielnie
  → Wyświetl RAPORT D
  ↓
  ATAK-OK / ATAK-UWAGI → W3 automatycznie
  ATAK-STOP → STOP → pytania do użytkownika → po odpowiedzi → W3

⛔ ZAKAZ: nie wolno przejść do W3 bez wykonania W2.4 i wyświetlenia RAPORTU D.
⛔ ZAKAZ: nie wolno wygenerować .docx bez zamkniętego W2.4.
```

---

## 7. Typowe ataki według typu pisma

### Rozszerzenie powództwa / pozew pracowniczy

```
ATAK-TYP-01: "Zmiana podmiotowa pracodawcy przerywa ciągłość umów"
  → Kontratak: art. 23(1) KP / nadużycie prawa art. 8 KP / błąd KRS po stronie pracodawcy

ATAK-TYP-02: "Brak czynnego zgłoszenia gotowości do pracy"
  → Kontratak: korespondencja z organem reprezentacji + judykatura SN o formie zgłoszenia

ATAK-TYP-03: "Premia bez regulaminu = brak roszczenia"
  → Kontratak: art. 78 §1 KP (wynagrodzenie odpowiednie) + ustalone zwyczaje zakładowe +
     ewentualnie art. 405 KC (bezpodstawne wzbogacenie)

ATAK-TYP-04: "Porozumienie jest ważne i skuteczne — stosunek pracy wygasł"
  → Kontratak: wada oświadczenia woli (art. 82-88 KC/300 KP) + sprawa w toku

ATAK-TYP-05: "Twierdzenia oparte na tłumaczeniu z języka obcego — nieprecyzyjne"
  → Kontratak: treść własna pisma powoda w języku polskim jako pierwotna; tłumaczenie
     jako dowód pomocniczy; sąd ocenia całość korespondencji
```

### Zażalenie / apelacja

```
ATAK-TYP-06: "Zarzut nowy — prekluzja procesowa"
  → Kontratak: moment kiedy zarzut stał się możliwy do podniesienia (art. 381 KPC)

ATAK-TYP-07: "Brak interesu w zaskarżeniu"
  → Kontratak: gravamen — wyrok niekorzystny dla skarżącego w konkretnym zakresie
```

---

## 8. Historia zmian

```
1.1.0 (2026-06-21) — Dodano krok D5: analiza własnych słabości i ryzyk
                      prawnych (RP), dowodowych (RD) i procesowych (RPC).
                      D5 wypełnia lukę między D2 (atak przeciwnika) a D4
                      (luki dowodowe): patrzy oczami WŁASNEJ STRONY i SĄDU,
                      nie pełnomocnika pozwanej. Zaktualizowano RAPORT D
                      o sekcję D5. Zaktualizowano sekwencję w integracji
                      (D1→D2→D3→D5→D4). Zaktualizowano SKILL.md
                      pisma-procesowe-v3 W2.4 o krok D5.
                      Naprawa ZASADY 7: dostarczono pełne ZIPy obu skilli
                      (pisma-procesowe-v3 + shared) zamiast luźnych plików.

1.0.0 (2026-06-21) — Pierwsza wersja. Utworzony po wykryciu błędu: krok W2.4
                      był opisany w pisma-procesowe-v3/SKILL.md (linia 569-589)
                      ale plik kanoniczny nie istniał w shared/ — co powodowało
                      pominięcie kroku przez model bez sygnalizacji błędu.
                      Root cause: odesłanie do nieistniejącego pliku nie powoduje
                      błędu wykonania, tylko ciche pominięcie view().
                      Naprawa: (1) utworzenie tego pliku, (2) wzmocnienie ZAKAZU
                      w SKILL.md W2.4 z explicit linią blokującą przejście do W3.
```
