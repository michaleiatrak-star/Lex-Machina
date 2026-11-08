# RODZINA-PRAWA-COMMON-LAW — metoda dla common law i systemów mieszanych (CL-1…CL-7)

> **Plik kanoniczny:** `shared/RODZINA-PRAWA-COMMON-LAW.md`
> **Wersja:** 1.0 | Utworzony: 2026-11-08 (rodzina prawa jako kategoria jurysdykcji)
> **Wywołuje:** `prawny-router-v3` (UP-5), gdy system prawny sprawy należy do rodziny
> common law (Anglia i Walia, Szkocja w części, Irlandia Północna, Irlandia, USA) albo jest
> systemem mieszanym (Cypr, Malta) w dziedzinie opartej na common law. W aplikacji rodzinę
> podaje rejestr krajów (`family`, `familyNote`, `caseLaw`).
> **Charakter:** ⛔ BLOKUJĄCE w ścieżce common law. Uzupełnia bramki metody, nie wyłącza ich.

---

## 0. DLACZEGO OSOBNA METODA

Metoda systemu jest zbudowana wokół ustawy: jednostka redakcyjna, jej brzmienie, zakres
(CN-GATE), wersja w czasie (OŚ-GATE), wykładnia (WYJ-GATE). W common law źródłami są
**ustawa i precedens**. Przepis bez orzeczeń, które go odczytały, to połowa odpowiedzi;
w dziedzinach nieskodyfikowanych (np. umowy, delikty w wielu jurysdykcjach) podstawą jest
samo orzecznictwo.

**Relacja do bramek:** CN-GATE i REM-GATE działają bez zmian — dla ustawy i dla zasady
rozstrzygnięcia (ratio) orzeczenia. OŚ-GATE obejmuje datę orzeczenia i jego późniejsze
losy (CL-4). WYJ-GATE stosuje reguły wykładni ustaw danej jurysdykcji, odczytane ze źródła
(CL-5). Treści merytorycznej (który sąd wiąże który, jakie są reguły procedury) NIE podaje
się z pamięci: ustala się ją ze źródła tej jurysdykcji w tej turze.

---

## CL-1 — JURYSDYKCJA I ŹRÓDŁA

Przed pierwszym powołaniem ustal i wypisz:

```
CL-1  JURYSDYKCJA: [państwo] / [jednostka: stan, Szkocja, Irlandia Płn. — jeśli prawo różni się]
      DZIEDZINA: [ustawowa / orzecznicza (common law) / mieszana]
      ŹRÓDŁA: ustawa → [akt, sekcja, źródło RZĘDU 1]; orzecznictwo → [baza RZĘDU 1]
```

- **USA:** prawo federalne i stanowe są odrębne. Bez ustalonego stanu nie powołuj prawa
  stanowego ani orzeczeń sądów stanowych — zapytaj albo oznacz ⬛ [UZUPEŁNIJ: stan].
- **Wielka Brytania:** sprawdź zakres terytorialny przepisu (legislation.gov.uk podaje go
  przy jednostce); Szkocja ma w części dziedzin odrębne prawo.
- **System mieszany:** dla każdej osi sporu ustal, czy dziedzina opiera się na kodeksie,
  czy na common law (`familyNote` w rejestrze; potwierdź w źródle). Ścieżkę CL-2…CL-6
  stosuj tylko do dziedzin opartych na common law.

## CL-2 — MOC WIĄŻĄCA (STARE DECISIS)

Dla każdego powołanego orzeczenia ustal i wypisz:

```
CL-2  [sygnatura neutralna / oficjalny zbiór] — sąd: [ ] — data: [ ]
      MOC: WIĄŻĄCE (pionowo: sąd wyższy w tej samej hierarchii) /
           WIĄŻĄCE POZIOMO (ten sam sąd, jeśli ta jurysdykcja tak przyjmuje) /
           PERSWAZYJNE (inna hierarchia, inna jurysdykcja, sąd niższy, obiter)
      PODSTAWA OCENY MOCY: [źródło, z którego ustalono hierarchię sądów]
```

- Hierarchię sądów i regułę związania własnymi orzeczeniami ustal ze źródła tej
  jurysdykcji (strona sądownictwa, ustawa ustrojowa). Zakaz przypisywania mocy z pamięci.
- Orzeczenie innej jurysdykcji common law jest najwyżej perswazyjne.

## CL-3 — RATIO DECIDENDI I OBITER DICTA

Z odczytanego tekstu orzeczenia (akapity [N]) wydziel:

```
CL-3  FAKTY ISTOTNE: [które fakty sąd uznał za rozstrzygające — akapity]
      RATIO: [zasada konieczna do rozstrzygnięcia, jednym zdaniem — akapity]
      OBITER: [uwagi poza tym, co konieczne — akapity]
      ZDANIA ODRĘBNE: [czy są; nie są ratio]
```

- Ratio formułuj na podstawie cytowanych akapitów, nie streszczenia z bazy ani z pamięci.
- Przy kilku uzasadnieniach (kilku sędziów) ustal, czy jest ratio większości; brak
  wspólnej zasady oznacz jawnie.

## CL-4 — PÓŹNIEJSZE LOSY PRECEDENSU

Przed oparciem tezy na orzeczeniu sprawdź, czy nie zostało ono:
uchylone (reversed), odrzucone jako precedens (overruled), ograniczone lub zakwestionowane
przez sąd wiążący, albo zastąpione ustawą.

```
CL-4  [sygnatura] — PÓŹNIEJSZE ORZECZENIA: [lista / BRAK TRAFIEŃ w źródle X]
      STATUS: AKTUALNE / OGRANICZONE / UCHYLONE / ZASTĄPIONE USTAWĄ / ⚠️ NIEUSTALONE
```

Brak trafień w bazie to „nieustalone w tym źródle”, nie „aktualne”. Zbiory historyczne
(np. kończące się na określonym roku) wymagają sprawdzenia późniejszego orzecznictwa
w innym źródle; inaczej ⚠️ NIEUSTALONE.

## CL-5 — USTAWA A PRECEDENS

- Ustawa ma pierwszeństwo przed common law; orzeczenie sprzed ustawy, która zmieniła
  regułę, nie jest podstawą (CL-4: ZASTĄPIONE USTAWĄ).
- Brzmienie ustawy czytaj w wersji z chwili miarodajnej (OŚ-GATE); legislation.gov.uk
  podaje brzmienie na dzień.
- Wykładnia ustawy: reguły tej jurysdykcji (ustawa o wykładni, orzecznictwo o wykładni) —
  odczytane ze źródła; orzeczenia, które wyłożyły tę jednostkę, powołuj według CL-2…CL-4.

## CL-6 — DISTINGUISHING (ODRÓŻNIENIE STANU FAKTYCZNEGO)

Dla każdego wiążącego orzeczenia porównaj fakty istotne (CL-3) ze stanem sprawy:

```
CL-6  [sygnatura] — FAKTY ISTOTNE ZGODNE: [ ] — RÓŻNICE: [ ]
      WNIOSEK: STOSUJE SIĘ / DA SIĘ ODRÓŻNIĆ (dlaczego) / NIEPEWNE
```

Argument strony przeciwnej oparty na precedensie zawsze przechodzi przez CL-6 —
to typowa linia obrony w tej rodzinie prawa.

## CL-7 — PISMO W COMMON LAW

Formy i wymogi pism (nazwa pisma, układ, oświadczenia wymagane procedurą, terminy,
sposób cytowania) ustalaj z reguł procedury danej jurysdykcji i sądu, odczytanych w tej
turze — zakaz wzorowania na polskim pozwie i zakaz form z pamięci. Wspólne cechy, które
należy sprawdzić w regułach, a nie zakładać:

```
CL-7  REGUŁY PROCEDURY: [akt / regulamin sądu — źródło, data odczytu]
      UKŁAD: [nagłówek sprawy, strony, numerowane akapity, żądanie (relief/remedy)]
      WYMAGANE OŚWIADCZENIA: [np. potwierdzenie prawdziwości — jeśli reguły wymagają]
      CYTOWANIE: [styl przyjęty w tej jurysdykcji — sygnatura neutralna, oficjalny zbiór]
      ARGUMENT: ustawa → precedens wiążący (ratio, akapit) → odróżnienie precedensów
                strony przeciwnej → precedens perswazyjny
```

HYBRID-VALIDATION i ST-FINAL działają bez zmian. Pismo w obcej jurysdykcji wymaga
zastrzeżenia, że przed złożeniem sprawdza je prawnik uprawniony w tej jurysdykcji.

---

## WYJŚCIE — BLOK CL (przed konkluzją, zwięźle)

```
CL-1 jurysdykcja/źródła · CL-2 moc wiążąca · CL-3 ratio · CL-4 losy precedensu ·
CL-5 ustawa a precedens · CL-6 odróżnienie · CL-7 forma pisma (gdy pismo)
NIEUSTALONE: [lista pozycji ⚠️ — każda obniża pewność konkluzji]
```
