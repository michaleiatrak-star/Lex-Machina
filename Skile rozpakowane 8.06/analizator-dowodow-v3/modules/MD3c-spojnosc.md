# MD3c — WALIDACJA SPÓJNOŚCI I SPRZECZNOŚCI MIĘDZY DOKUMENTAMI
> **Moduł kanoniczny v5.3** — format `cites[]` · typy `legal | inter | intra | doubt`
> Wczytywany gdy: B2=TAK (≥2 dokumenty) lub B3=TAK (sprzeczność z prawem)

---

## ► CHECKLIST SKANOWANIA (§P2 — obowiązkowy przed renderowaniem zakładki Sprzeczności)

```
[ ] Czy ta sama strona zmienia opis faktyczny między pismami? (→ INTRA)
[ ] Czy daty tego samego zdarzenia są spójne między dokumentami? (→ CROSS)
[ ] Czy kwoty są identyczne we wszystkich dokumentach? (→ CROSS)
[ ] Czy nazwy własne (adresy e-mail, nazwy firm, imiona) są identyczne wszędzie? (→ INTRA/CROSS)
[ ] Czy kwalifikacja prawna faktu jest spójna (np. zaliczka vs nienależne środki)? (→ INTRA)
[ ] Czy domena/serwer konta mailowego jest spójna z kwalifikacją służbowe/prywatne? (→ INTRA)
[ ] Czy chronologia zdarzeń jest możliwa (daty → terminy → działania)? (→ CROSS)
[ ] Czy twierdzenia o świadkach są spójne (rola, zależność, adres doręczeń)? (→ CROSS)
[ ] Czy treść dokumentu narusza przepis prawa? (→ LEG)
```

---

## ► TYPY SPRZECZNOŚCI — schemat kanoniczny

| Typ w `cites[]` | Prefiks tytułu | Znaczenie |
|---|---|---|
| `'intra'` | `[INTRA]` | Zmiana narracji **tej samej strony** między pismami |
| `'inter'` | `[CROSS]` | Sprzeczność między twierdzeniami **różnych stron** lub dokumentów |
| `'legal'` | `[LEG]` | Sprzeczność **treści dokumentu z przepisem prawa** |
| `'doubt'` | `[DOUBT]` | Niejednoznaczność / wątpliwość nierozstrzygnięta |

---

## ► FORMAT INLINE — SPRZECZNOŚĆ INTRA (zmiana narracji tej samej strony)

```
[⚡ INTRA-CONTRA-N] STATUS: KRYTYCZNE / DO SPRAWDZENIA / OSTRZEŻENIE
STRONA:   [nazwa strony, która zmienia narrację]
RODZAJ:   [kwalifikacja / opis zdarzenia / data / kwota / tożsamość]

CYTAT 1 (wcześniejszy dokument):
  Źródło: [nazwa pisma] · Lok.: [str. X / §Y / data pisma]
  „[dosłowny fragment max 100 zn.]"

CYTAT 2 (późniejszy dokument):
  Źródło: [nazwa pisma] · Lok.: [str. X / §Y / data pisma]
  „[dosłowny fragment max 100 zn.]"

ROZBIEŻNOŚĆ: [co dokładnie się zmienia: słowo, liczba, kwalifikacja, kto jest właścicielem]
ZNACZENIE:   [dlaczego ta zmiana narracji osłabia wiarygodność strony]
REKOMENDACJA: [jak atakować tę sprzeczność na rozprawie / w piśmie]
```

---

## ► FORMAT INLINE — SPRZECZNOŚĆ CROSS (między dokumentami / stronami)

```
[⚡ SPOJ-CONTRA-N] STATUS: KRYTYCZNE / DO SPRAWDZENIA / OSTRZEŻENIE
KONFLIKT: [Dokument A] ↔ [Dokument B]
RODZAJ:   [daty / fakty / kwoty / opis zdarzenia / tożsamość osoby / intencja]

CYTAT A:
  Źródło: [nazwa dokumentu A] · Lok.: [str. X / §Y / data dokumentu]
  „[dosłowny fragment max 100 zn.]"

CYTAT B:
  Źródło: [nazwa dokumentu B] · Lok.: [str. X / §Y / data dokumentu]
  „[dosłowny fragment max 100 zn.]"

KTÓRY DOMINUJE: [A/B] — [uzasadnienie: poziom hierarchii, data, urzędowość]
SKUTEK:   [co oznacza dla sprawy jeśli sąd przyjmie wersję A lub B]
REKOMENDACJA: [jak wyjaśnić w piśmie / jakiego dowodu pozyskać]
```

---

## ► FORMAT INLINE — WĄTPLIWOŚĆ (status: DO SPRAWDZENIA)

```
[❓ DOUBT-N] STATUS: DO SPRAWDZENIA
DOKUMENT: [nazwa] · Lok.: [str. X / §Y]
CYTAT:    „[fragment max 100 zn.]"
WĄTPLIWOŚĆ: [dlaczego ten fragment może być problematyczny]
RYZYKO:   [jak może go użyć strona przeciwna]
REKOMENDACJA: [wyjaśnić / doprecyzować / uzyskać uzupełniający dowód]
```

> **Sprzeczności z prawem (`[LEG]`)** — obsługuje MD3b (osobny moduł).
> MD3c przejmuje ich format `cites[]` do dashboardu — patrz sekcja poniżej.

---

## ► WYPEŁNIANIE TABLICY `contradictions[]` — FORMAT KANONICZNY

Po zakończeniu MD3b i MD3c wypełnij tablicę `contradictions[]` używając **wyłącznie** poniższych schematów.
Każdy obiekt **musi** zawierać pole `cites[]` z co najmniej jednym elementem.

```javascript
// ── INTRA: zmiana narracji tej samej strony ──────────────────────────────
contradictions.push({
  id: 'INTRA-1',
  type: 'intra',              // 'intra' — nowy dedykowany typ
  status: 'KRYTYCZNE',        // 'KRYTYCZNE' | 'DO SPRAWDZENIA' | 'OSTRZEŻENIE'
  title: '[INTRA] [krótki opis — co się zmienia i czyja narracja]',
  law: '',                    // puste dla INTRA (brak przepisu)
  cites: [
    {
      doc:   '[nazwa pisma wcześniejszego]',
      page:  'str. X / data pisma',
      text:  '„[cytat max 100 zn.]"',
      label: 'Wersja 1 — [data/pismo]'
    },
    {
      doc:   '[nazwa pisma późniejszego]',
      page:  'str. Y / data pisma',
      text:  '„[cytat max 100 zn.]"',
      label: 'Wersja 2 — [data/pismo]'
    }
  ],
  rec: '[jak atakować tę sprzeczność na rozprawie]'
});

// ── CROSS: sprzeczność między dokumentami / stronami ─────────────────────
contradictions.push({
  id: 'SPOJ-1',
  type: 'inter',              // 'inter' — sprzeczność CROSS między stronami/dokumentami
  status: 'DO SPRAWDZENIA',
  title: '[CROSS] [krótki opis konfliktu]',
  law: '',
  cites: [
    {doc: '[Dokument A]', page: 'str. X', text: '„[cytat A]"', label: 'Dokument A'},
    {doc: '[Dokument B]', page: 'str. Y', text: '„[cytat B]"', label: 'Dokument B'}
  ],
  rec: '[rekomendacja — który dokument powołać, czego żądać]'
});

// ── LEG: sprzeczność z przepisem prawa (format z MD3b) ───────────────────
contradictions.push({
  id: 'LEG-1',
  type: 'legal',
  status: 'KRYTYCZNE',
  title: '[LEG] [krótki opis naruszenia]',
  law: 'art. X ustawy Y',     // zweryfikowany w ISAP
  cites: [{
    doc:   '[nazwa dokumentu]',
    page:  'str. X / §Y',
    text:  '„[cytat max 100 zn.]"',
    label: 'Kwestionowany fragment'
  }],
  rec: '[co zrobić: zmień / usuń / zwróć uwagę sądu]'
});

// ── DOUBT: wątpliwość / niejednoznaczność ─────────────────────────────────
contradictions.push({
  id: 'DOUBT-1',
  type: 'doubt',
  status: 'DO SPRAWDZENIA',
  title: '[DOUBT] [opis wątpliwości]',
  law: '',
  cites: [{
    doc:   '[Dokument]',
    page:  'str. X',
    text:  '„[cytat]"',
    label: 'Fragment sporny'
  }],
  rec: '[wyjaśnić / doprecyzować / uzyskać uzupełniający dowód]'
});
```

---

## ► REGUŁY OCENY (waga sprzeczności)

- **KRYTYCZNE** — sprzeczność INTRA zmieniająca kwalifikację kluczowego faktu (właściciel konta, data zdarzenia, kwota roszczenia); sprzeczność LEG z normą ius cogens
- **OSTRZEŻENIE** — sprzeczność CROSS kwotowa lub datowa >7 dni; kolizja kwalifikacji prawnej między pismami
- **DO SPRAWDZENIA** — niejednoznaczność semantyczna; różnica opisu nierozstrzygnięta; DOUBT bez dominującego cytatu

Kolizja kwot jest zawsze co najmniej OSTRZEŻENIE.  
Zmiana wersji bez wyjaśnienia w kolejnym piśmie = INTRA-CONTRA co najmniej DO SPRAWDZENIA.  
Sprzeczność między pismem a dowodem pierwotnym ma pierwszeństwo analityczne przed sprzecznością retoryczną.

---
