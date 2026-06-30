# MOD-PRACODAWCA-RZECZYWISTY — Identyfikacja pracodawcy rzeczywistego w sprawach wielopodmiotowych

> **Plik:** `/mnt/skills/user/pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md`
> **Wersja:** 1.0.0 (2026-06-21)
> **Status:** PRODUKCJA
> **Pozycja w pipeline:** W1.2 (po CLAIM-VALIDATION, przed W1.3)
> **Wywołanie:** pisma-procesowe-v3, gdy warunek aktywacji poniżej spełniony

---

## WARUNEK AKTYWACJI

```
AKTYWUJ gdy w materiale dowodowym lub opisie sprawy widoczne jest CHOĆBY JEDNO:

  □ Stosunek pracy formalnie przypisany do dwóch lub więcej różnych podmiotów
    (różne KRS, różne NIP, różne nazwy na kolejnych umowach o pracę)
  □ Zmiana nazwy pracodawcy bez wyjaśnienia (nowa spółka vs zmiana firmy)
  □ Sprzeczność między KRS/NIP w nagłówku umowy a KRS/NIP z rejestru
  □ Argument o "grupie kapitałowej" / "podmiocie siostrzanym" jako pracodawcy
  □ Pracodawca twierdzi, że stosunek pracy zakończył się przez "przejście
    do innej spółki" lub "zakończenie współpracy między podmiotami"

NIE aktywuj gdy:
  □ Jeden jasno zidentyfikowany pracodawca przez cały okres
  □ Sprawa nie dotyczy tożsamości pracodawcy
```

---

## DLACZEGO TEN MODUŁ JEST KONIECZNY

Domyślną reakcją modelu na rozbieżność KRS/podmiotową jest przyjęcie JEDNEJ z dwóch
hipotez: "to ten sam podmiot" lub "to inny podmiot". Obie są błędem procesowym:

- "Ten sam podmiot" (KRS identyczny) → atak 🔴 gdy KRS faktycznie należy do innej spółki
- "Inny podmiot" (formalna odrębność) → pomija koncepcję pracodawcy rzeczywistego
  i art. 23¹ KP, które są kluczem do wygranej

**Prawidłowa sekwencja:** (1) przyznaj formalną odrębność, (2) zidentyfikuj pracodawcę
rzeczywistego przez kryteria faktyczne, (3) powołaj orzecznictwo SN.

---

## SEKWENCJA GŁÓWNA: PR1 → PR2 → PR3 → PR4

### PR1 — PRZYZNANIE FORMALNEJ ODRĘBNOŚCI

```
Pierwszym krokiem jest ZAWSZE wyraźne przyznanie, że:
  - podmiot A i podmiot B to dwie odrębne osoby prawne
  - powód tego nie kwestionuje
  - argument NIE polega na utożsamieniu podmiotów jako takich

Wzór zdania otwierającego:
"[Podmiot A] i [Podmiot B] to dwa formalnie odrębne podmioty prawne.
Powód jest tego świadomy i nie kwestionuje ich odrębności rejestrowej.
Niniejszy argument oparty jest na utrwalonej koncepcji pracodawcy rzeczywistego
i zmierza do wykazania, który z tych podmiotów był faktycznym pracodawcą powoda."

⛔ ZAKAZ: NIE twierdzić jednocześnie "to ten sam podmiot" I "to odrębne podmioty"
   bez wyraźnego oznaczenia alternatywności → sprzeczność wewnętrzna.
```

### PR2 — KRYTERIA FAKTYCZNE PRACODAWCY RZECZYWISTEGO

```
Dla każdego z poniższych kryteriów — sprawdź w materiale dowodowym i zanotuj:

KRYTERIUM 1: Kierownictwo (art. 22 §1 KP)
  → Kto faktycznie wydawał polecenia pracownikowi?
  → Czy ta sama osoba fizyczna pełniła funkcję kierowniczą w obu podmiotach?
  → Dowód: umowy, protokoły zeznań, korespondencja służbowa
  Siła: ★★★ (element definicji stosunku pracy)

KRYTERIUM 2: Tożsamość miejsca wykonywania pracy
  → Czy adres miejsca pracy był identyczny dla obu podmiotów?
  → Dowód: §2 wszystkich umów o pracę
  Siła: ★★

KRYTERIUM 3: Tożsamość sprzętu i infrastruktury
  → Czy pracownik używał tego samego sprzętu bez przerwy?
  → Czy przełączono konta, systemy, dostępy po formalnej zmianie?
  Dowód: brak protokołu przejęcia sprzętu, brak resetu systemu
  Siła: ★★

KRYTERIUM 4: Tożsamość zakresu obowiązków
  → Czy zakres obowiązków zmienił się po formalnej zmianie podmiotu?
  → Dowód: zakres obowiązków w aktach osobowych, tabele rekrutacyjne
  Siła: ★★★

KRYTERIUM 5: Tożsamość systemu kadrowego (jeden system = jeden pracodawca)
  → Czy oba podmioty używały JEDNEGO systemu informatycznego / jednej bazy danych?
  → Czy baza danych była prowadzona przez powoda dla obu podmiotów JEDNOCZEŚNIE?
  → Czy numeracja wewnętrzna była ciągła między podmiotami?
  Dowód: arkusze XLS, zrzuty ekranu systemu, protokoły zeznań
  Siła: ★★★ (por. sekcja IV pisma VII P 94/25 — arkusz z ciągłą numeracją)

KRYTERIUM 6: Tożsamość personelu kierowniczego
  → Czy ta sama osoba była przełożoną przed i po formalnej zmianie?
  → Dowód: protokoły zeznań, arkusze pracownicze (stanowisko)
  Siła: ★★

KRYTERIUM 7: Brak procedury przejęcia
  → Czy przeprowadzono jakąkolwiek formalną procedurę przejęcia pracownika
    (protokół przekazania, nowe badania, nowe szkolenia BHP, zmiana kart dostępu)?
  → NIE → Dowód, że nie było faktycznej zmiany pracodawcy
  Dowód: brak protokołów w aktach
  Siła: ★★★

KRYTERIUM 8: Nierozdzielony czas pracy dla obu podmiotów
  → Czy istniała ewidencja czasu pracy rozdzielająca godziny między podmioty?
  → NIE → Dowód zatarcia granicy między podmiotami
  Siła: ★★★ (blokuje argument "wykonywał pracę dla podmiotu A w godzinach X")
```

### PR3 — ORZECZNICTWO SN DO POWOŁANIA

```
⚠️ HARD GATE: NIE cytuj sygnatur z pamięci. Po W2 weryfikuj każdą na sn.pl.
   W W1/W2 używaj opisowych placeholderów.

ORZECZENIE PR-O1: SN II PK 50/13 z 5 listopada 2013 r.
  Teza (opis): SN dopuścił pominięcie odrębności prawnej powiązanych spółek gdy
  "właściciel" przekształca struktury organizacyjne w celu ominięcia prawa pracy;
  koncepcja pracodawcy rzeczywistego; "piercing the corporate veil" w prawie pracy.
  Kiedy powołać: ZAWSZE przy tezie o pracodawcy rzeczywistym.

ORZECZENIE PR-O2: SN I PK 179/14 z 18 lutego 2015 r.
  Teza (opis): SN nakazał subsumpcję art. 22 §1 KP w zw. z art. 3 KP z uwzględnieniem
  zależności ekonomicznej między spółkami; kto sprawuje faktyczne kierownictwo
  decyduje o tożsamości pracodawcy.
  Kiedy powołać: gdy argument oparty na kierownictwie jednej osoby fizycznej.

ORZECZENIE PR-O3: SN II PK 170/11 z 13 marca 2012 r.
  Teza (opis): pracodawcą może być tylko jeden podmiot z art. 3 KP; identyfikacja
  jednego z powiązanych podmiotów jako rzeczywistego pracodawcy jest dopuszczalna.
  Kiedy powołać: przy antycypacji zarzutu "grupa nie może być pracodawcą".

[ORZECZENIE PR-O1 w W2] → [ORZECZENIE PR-O1 — WERYFIKACJA W3 na sn.pl]
[ORZECZENIE PR-O2 w W2] → [ORZECZENIE PR-O2 — WERYFIKACJA W3 na sn.pl]
[ORZECZENIE PR-O3 w W2] → [ORZECZENIE PR-O3 — WERYFIKACJA W3 na sn.pl]
```

### PR4 — WYNIK: ZASILENIE W1.3

```
Po wykonaniu PR1–PR3 zasilaj W1.3 (mapa cel→przesłanka→dowód):

ŻĄDANIE: Ustalenie stosunku pracy z podmiotem X (pracodawcą rzeczywistym)

Przesłanka PRAWA: art. 22 §1 KP — kto faktycznie sprawował kierownictwo?
Dowód: [lista z PR2 — kryteria spełnione + konkretne dokumenty]

Przesłanka FAKTYCZNA: podmiot X był pracodawcą rzeczywistym przez cały okres
Dowód A: [kryteria 1-8 z PR2 — które są spełnione i jak]
Dowód B: [tabela z MOD-DOWODY D6.3.D — ciągłość korespondencji HP→HPG]

Podstawa: art. 22 §1 KP w zw. z art. 3 KP + orzecznictwo SN (PR-O1, PR-O2)

Antycypacja zarzutu (obowiązkowa — por. MOD-DOWODY D7):
  Zarzut-P1 (MOD-DOWODY D7): "dwa odrębne podmioty"
  → wpisz antycypację bezpośrednio do uzasadnienia pisma
```

---

## TABELA KRYTERIÓW DO WYPEŁNIENIA

Wygeneruj tę tabelę w W1.3 dla każdej sprawy z aktywnym PR:

```
TABELA PRACODAWCY RZECZYWISTEGO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Kryterium                | Spełnione? | Dowód                    | Siła
─────────────────────────┼────────────┼──────────────────────────┼──────
1. Kierownictwo (art.22) | TAK/NIE    | [dokument]               | ★★★
2. To samo miejsce pracy  | TAK/NIE    | [§2 umów]                | ★★
3. Ten sam sprzęt         | TAK/NIE    | [brak protokołu przejęcia]| ★★
4. Ten sam zakres obow.   | TAK/NIE    | [zakres obowiązków]      | ★★★
5. Jeden system kadrowy   | TAK/NIE    | [arkusz XLS]             | ★★★
6. Ten sam przełożony     | TAK/NIE    | [protokół zeznań]        | ★★
7. Brak procedury przejęcia| TAK/NIE   | [brak protokołów]        | ★★★
8. Nierozdzielony czas    | TAK/NIE    | [brak ewidencji]         | ★★★
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Łączna ocena: [X/8 kryteriów spełnionych — ile ★★★]
Konkluzja: [podmiot X = pracodawca rzeczywisty / niejednoznaczne / brak podstaw]
```

---

## POWIĄZANIA

```
Wczytaj PRZED tym modułem:
  view /mnt/skills/user/shared/MOD-STRATEGIA-WYBOR.md   (S1 identyfikuje ścieżki)
  view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-DOWODY.md (D6 eksploracja dowodów)

Zasilaj PO tym module:
  W1.3 (mapa cel→przesłanka→dowód) — używaj tabeli z PR4
  W2.2 (sekcja B uzasadnienia) — wstaw antycypację z D7
  W3.2 (orzeczenia) — weryfikuj PR-O1, PR-O2, PR-O3 na sn.pl
```

---

## HISTORIA ZMIAN

```
1.0.0 (2026-06-21) — Pierwsza wersja.
Przyczyna: brak dedykowanego modułu do obsługi spraw wielopodmiotowych.
System posiadał MOD-STRATEGIA-WYBOR (identyfikacja ścieżek, z przykładem VII P 94/25),
ale brakowało szczegółowej sekwencji PR1–PR4 z tabelą kryteriów i orzecznictwem.
Zidentyfikowano po analizie porównawczej pisma generowanego i pisma poprawionego
przez użytkownika w sprawie VII P 94/25: różnica w jakości opracowania tematu
pracodawcy rzeczywistego była krytyczna dla oceny (6,8 vs 9,1/10).
```
