# MOD-PRACODAWCA-RZECZYWISTY — Identyfikacja pracodawcy rzeczywistego w sprawach wielopodmiotowych

> **Plik:** `/mnt/skills/user/pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md`
> **Wersja:** 2.2.0 (2026-06-27)
> **Status:** PRODUKCJA
> **Pozycja w pipeline:** (A) W1.2 po CLAIM-VALIDATION gdy warunek poniżej; (B) PRE-W2.C gdy wykryto rozbieżność podmiotową
> **Wywołanie:** pisma-procesowe-v3 (W1.2) ORAZ PRE-W2-VERIFICATION-GATE (PRE-W2.C/D)

---

## ⛔ TRIGGER PRE-W2 — WYWOŁAJ NATYCHMIAST GDY PRE-W2.C/D WYKRYJE:

```
T1: ≥2 różne NIP przy tym samym pracodawcy w aktach
T2: ≥2 różne KRS przy tym samym pracodawcy w aktach
T3: weryfikacja online pokazuje że KRS z umów ≠ KRS podmiotu wskazanego jako pracodawca
T4: zmiana nazwy pracodawcy w kolejnych umowach bez trybu art. 23¹ KP

→ NATYCHMIAST view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md
→ Wykonaj R1 → R2 → R3 → R4 → R5 (protokół poniżej)
→ Dopiero po RAPORCIE R5 z wynikiem OK → kontynuuj PRE-W2.D → W2.1
⛔ ZAKAZ przejścia do W2.1 bez zamkniętego RAPORTU R5 gdy T1/T2/T3/T4 aktywne
```

---

## WARUNEK AKTYWACJI z W1.2

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

- "Ten sam podmiot bo ten sam KRS" → ⛔ ZAKAZ-R1 (patrz niżej): gdy KRS w umowach
  jest błędny (niezgodny z rejestrem), ten argument jest obalany przez "literówkę"
- "Inny podmiot" (formalna odrębność) → pomija 4-warstwowy argument właściwy

**Prawidłowa sekwencja:** R1 (fakty rejestrowe online) → R2 (klasyfikacja rozbieżności)
→ R3 (4-warstwowy argument) → R4 (hedge procesowy) → R5 (raport).

---

## PROTOKÓŁ R1–R5 (wywołany z PRE-W2 lub W1.2)

### R1 — USTAL FAKTY REJESTROWE (web_search OBOWIĄZKOWO)

```
Dla każdego NIP i KRS z akt → web_search i zapisz:

PODMIOT_A: [nazwa handlowa z akt]
  KRS rejestrowy: [numer po weryfikacji]
  NIP rejestrowy: [numer po weryfikacji]
  Prezes zarządu: [imię nazwisko]
  Adres siedziby: [ulica, miejscowość]
  Data rejestracji: [data]
  Przedmiot działalności: [PKD]
  Status: aktywna / w likwidacji / wykreślona
  Źródło: [URL + data] ✅

PODMIOT_B: [jak wyżej]

RELACJA między podmiotami:
  □ Ten sam prezes/zarząd     → ⚠️ POWIĄZANIE OSOBOWE
  □ Ten sam adres siedziby    → ⚠️ POWIĄZANIE ADRESOWE
  □ Ta sama branża/PKD        → ⚠️ POWIĄZANIE OPERACYJNE
  □ Jeden kontroluje drugi    → ⚠️ POWIĄZANIE KAPITAŁOWE
```

### R2 — KLASYFIKUJ ROZBIEŻNOŚĆ

```
KAT-I: BŁĄD FORMALNY PRACODAWCY
  Definicja: nazwa i NIP wskazują podmiot_B, ale KRS wskazuje podmiot_A.
  Pracodawca wpisał cudzy/błędny KRS przy prawidłowym NIP.
  Konsekwencja procesowa:
    → ZASTOSUJ WARSTWA 0 (dane większościowe) — to najsilniejszy argument dla KAT-I
    → ⛔ ZAKAZ-R1: NIE buduj argumentu "jeden podmiot bo ten sam KRS" — obalany przez
      "literówkę". Gdy pozwana sama podnosi "literówka" → PRZYZNAJE że stroną była HPG.
    → Warstwy 1–4 opcjonalne dla KAT-I (stosuj gdy potrzebne do zliczenia umów)

KAT-II: CELOWA ZMIANA PODMIOTU (reset limitów)
  Definicja: pracownik zatrudniony kolejno u podmiot_A → podmiot_B,
  oba powiązane, zmiana bez art. 23¹ KP, skutek = reset liczby umów terminowych.
  Konsekwencja procesowa → R3 (pełny 4-warstwowy argument)

KAT-III: POZORNA ZMIANA (ten sam podmiot, inna nazwa)
  Definicja: KRS i NIP identyczne — tylko zmiana firmy handlowej.
  Konsekwencja: brak rozbieżności, koniec modułu, jeden pracodawca.
```

### R3 — ARGUMENT PODMIOTOWY (stosuj kumulatywnie: W0 + W1-W4 per KAT)

```
WARSTWA 0 — Dane większościowe (identyfikacja strony umowy) [KAT-I i KAT-II]
  ─────────────────────────────────────────────────────────────────────────────
  ⛔ WYWOŁAJ NAJPIERW — przed warstwami 1–4:
  view /mnt/skills/user/shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md
  → Wykonaj ISU-1 → ISU-2 → ISU-3 → ISU-4 (jeśli konieczne) → ISU-5
  → Formuła ISU-5 [A] = gotowy akapit "Identyfikacja strony umowy" do pisma

  ZASADA: podmiot wskazany przez większość ważonych elementów identyfikacyjnych
  (NIP ★★★★, nazwa ★★★★, KRS ★★★, REGON ★★★, adres ★★★, podpisujący ★★)
  = strona umowy. Element mniejszościowy = błąd pisarski autora dokumentu
  (art. 65 §1 KC — wykładnia uwzględnia całość okoliczności, nie jeden błędny numer).

  ⚠️ OGRANICZENIE: ISU ustala stronę każdej umowy osobno — nie scala pracodawców
  dla celów art. 25¹ KP. Do scalenia → warstwy W1–W4 poniżej.
  ─────────────────────────────────────────────────────────────────────────────

WARSTWA 1 — Pracodawca rzeczywisty (art. 3 k.p.) [KAT-II]
  Teza: o tożsamości pracodawcy decyduje substancja stosunku pracy, nie forma
  rejestrowa. Kto wydawał polecenia, organizował czas pracy, wypłacał wynagrodzenie
  i był beneficjentem pracy — ten jest pracodawcą rzeczywistym.

  Kryteria faktyczne PR1–PR8 (wypełnij per sprawa):
  PR1: Kierownictwo — kto faktycznie wydawał polecenia? (★★★)
  PR2: To samo miejsce pracy (★★)
  PR3: Ten sam sprzęt bez protokołu przejęcia (★★)
  PR4: Ten sam zakres obowiązków (★★★)
  PR5: Jeden system kadrowy dla obu podmiotów (★★★)
  PR6: Ten sam przełożony przed i po formalnej zmianie (★★)
  PR7: Brak procedury przejęcia (protokołu, nowych badań BHP) (★★★)
  PR8: Nierozdzielona ewidencja czasu pracy między podmiotami (★★★)

  Orzecznictwo SN — WERYFIKUJ PRZED POWOŁANIEM na sn.pl:
  PR-O1: SN II PK 50/13 — piercing corporate veil w prawie pracy (szukaj: web_search "II PK 50/13 SN")
  PR-O2: SN I PK 179/14 — kierownictwo jednej osoby = tożsamość pracodawcy (web_search "I PK 179/14 SN")
  PR-O3: SN II PK 170/11 — identyfikacja jednego z podmiotów powiązanych (web_search "II PK 170/11 SN")
  ⛔ ZAKAZ cytowania sygnatur z pamięci — każda musi być potwierdzona web_search/web_fetch na sn.pl

WARSTWA 2 — Obejście prawa (art. 58 §1 k.c. w zw. z art. 300 k.p.)
  Teza: przeniesienie pracownika do powiązanej spółki bez art. 23¹ KP i bez przerwy,
  ze skutkiem resetowania limitu z art. 25¹ §1 KP, jest czynnością nieważną jako
  zmierzającą do obejścia normy ochronnej.
  Podstawa: art. 58 §1 KC (Dz.U. z 2025 r. poz. 1071 t.j.) — "czynność mająca
  na celu obejście ustawy jest nieważna".
  Orzeczenie: SN z 01.04.2014 r., I PK 241/13 — "umową mającą na celu obejście
  prawa jest umowa, której treść formalnie nie sprzeciwia się ustawie, ale
  w rzeczywistości zmierza do zrealizowania celu zakazanego" — WERYFIKUJ: web_search "I PK 241/13 SN"

WARSTWA 3 — Venire contra factum proprium (art. 8 k.p.)
  Teza: jeśli pracodawca wpisał błędny KRS na kolejnych umowach (systematycznie,
  przez wiele miesięcy) — sam traktował obie spółki jako jeden organizm kadrowy.
  Podnoszenie teraz odrębności podmiotowej jest nadużyciem prawa (art. 8 KP).
  Reguła: błąd jednorazowy = literówka; ten sam błąd na 3+ umowach = praktyka.

WARSTWA 4 — Dowody tożsamości operacyjnej (wnioski dowodowe)
  Żądaj od pozwanej / wnioskuj do sądu o zobowiązanie do przedłożenia:
  □ Historia zgłoszeń ZUS (PUE ZUS) per NIP per miesiąc — który NIP płacił składki?
  □ PIT-11 za lata sporne — który NIP wystawił?
  □ Dane nadawcy przelewów wynagrodzenia — z konta którego NIP?
  □ Wnioski WnD/INF-D-P do PFRON — który NIP wnioskował za pracownika?
  □ Listy płac / systemy HR — jeden system dla obu podmiotów?
  □ Polecenia służbowe, e-maile — z której domeny/podmiotu?
  Jeśli powyższe rozjeżdżają się z podmiotem z umowy → obrona "dwie odrębne spółki" pada.
```

### R4 — HEDGE PROCESOWY (pozwanie ostrożnościowe)

```
Gdy KAT-II i obie spółki aktywne → rekomenduj użytkownikowi:

OPCJA A: Pozwanie obu podmiotów jako współpozwanych (art. 72 §1 pkt 1 KPC)
  → eliminuje ryzyko zarzutu "niewłaściwy pozwany"; w sprawach pracowniczych
    powód zwolniony z kosztów → koszt zerowy
  REKOMENDACJA DOMYŚLNA gdy obie spółki aktywne.

OPCJA B: Wezwanie drugiego podmiotu (art. 194 KPC)
  → pasywne; sąd może wezwać z urzędu

OPCJA C: Jeden pozwany (faktyczny pracodawca)
  → ryzyko zarzutu niewłaściwego pozwanego
  Stosuj tylko gdy drugi podmiot jest wykreślony / w likwidacji.
```

### R5 — RAPORT PODMIOTOWY

```
═══════════════════════════════════════════════════════════
RAPORT MOD-PRACODAWCA-RZECZYWISTY v2.0.0
Sprawa: [sygn.] | Data: [data]
═══════════════════════════════════════════════════════════
PODMIOT_A: [firma] | KRS: [n] | NIP: [n] | Prezes: [n] | Status: [n] ✅ [URL]
PODMIOT_B: [firma] | KRS: [n] | NIP: [n] | Prezes: [n] | Status: [n] ✅ [URL]
POWIĄZANIA: Ten sam prezes: [T/N] | Ten sam adres: [T/N] | Ta sama branża: [T/N]
KATEGORIA: [KAT-I / KAT-II / KAT-III]
WARSTWY AKTYWNE: [W1/W2/W3/W4 — lista aktywnych]
PR1–PR8 spełnione: [X/8] | Kryteria ★★★: [lista]
HEDGE: [OPCJA A / B / C + uzasadnienie]
LUKI D4: [lista braków — kluczowych dla warstw]
WYNIK: ✅ RAPORT-OK → przejdź do W2.1 / W1.3
       🔴 RAPORT-STOP → STOP, pytania do użytkownika
═══════════════════════════════════════════════════════════
```

---

## ⛔ LISTA ZAKAZÓW

```
⛔ ZAKAZ-R1: Nie buduj argumentu "ten sam KRS = jeden pracodawca" gdy KRS
   w umowie jest błędny (niezgodny z rejestrem). Argument pada na "literówkę".
   ZAMIAST TEGO: warstwa 3 (venire) + warstwa 2 (obejście prawa).

⛔ ZAKAZ-R2: Nie stosuj art. 23¹ KP jako głównego argumentu gdy oba podmioty
   działają równolegle. Art. 23¹ = przejście zakładu, nie równoległe istnienie.
   ZAMIAST TEGO: warstwy 1–3.

⛔ ZAKAZ-R3: Nie cytuj sygnatur SN z pamięci. Każda sygnatura → web_search na sn.pl.

⛔ ZAKAZ-R4: Nie pomijaj warstwa-4 wniosków dowodowych. Bez ZUS/PIT-11/przelewów
   argument opiera się wyłącznie na doktrynie — sąd może ją odrzucić.
```

---

## TABELA KRYTERIÓW (wypełnij w W1.3)

```
TABELA PRACODAWCY RZECZYWISTEGO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Kryterium                | Spełnione | Dowód               | Siła
─────────────────────────┼───────────┼─────────────────────┼──────
PR1. Kierownictwo        | TAK/NIE   | [dokument]          | ★★★
PR2. To samo miejsce     | TAK/NIE   | [§2 umów]           | ★★
PR3. Ten sam sprzęt      | TAK/NIE   | [brak protokołu]    | ★★
PR4. Ten sam zakres obow.| TAK/NIE   | [zakres obowiązków] | ★★★
PR5. Jeden system kadrowy| TAK/NIE   | [XLS/systemy]       | ★★★
PR6. Ten sam przełożony  | TAK/NIE   | [protokół zeznań]   | ★★
PR7. Brak proc. przejęcia| TAK/NIE   | [brak protokołów]   | ★★★
PR8. Nierozdzielony czas | TAK/NIE   | [brak ewidencji]    | ★★★
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Łączna ocena: [X/8] kryteriów | ★★★ spełnione: [lista]
Konkluzja: podmiot X = pracodawca rzeczywisty / niejednoznaczne / brak podstaw
```

---

## PRZYKŁAD — VII P 94/25 (case study po naprawie v2.0.0)

```
PODMIOT_A: Human Park sp. z o.o.
  KRS: 0000796445 | NIP: 8971869561 | Prezes: Juneyoung Park | Adres: Pukowca 15, Katowice ✅
PODMIOT_B: Human Park Global sp. z o.o.
  KRS: 0001025052 | NIP: 6343021499 | Prezes: Juneyoung Park | Adres: Pukowca 15, Katowice ✅
POWIĄZANIA: Ten sam prezes ✅ | Ten sam adres ✅ | Ta sama branża PKD 78.x ✅
KATEGORIA: KAT-II (celowa zmiana — HPG zarejestrowana 14.03.2023, powód przeniesiony od 01.07.2023)
WARSTWY: W1 (PR1✅ PR2✅ PR6✅ PR7✅) + W2 (obejście art.25¹) + W3 (KRS błędny na 3 umowach) + W4
HEDGE: OPCJA A (obie spółki aktywne — pozwanie współpozwanych)
```

**Błąd poprzedniej wersji pisma (v3):** argument "ten sam KRS we wszystkich umowach"
— obalony przez pozwaną jako "literówka". Root cause: brak tego modułu w PRE-W2.

---

## POWIĄZANIA

```
Wywołaj PRZED tym modułem (z PRE-W2):
  view /mnt/skills/user/shared/PRE-W2-VERIFICATION-GATE.md (PRE-W2.C/D — wykrycie T1-T4)

Wywołaj PRZED tym modułem (z W1.2):
  view /mnt/skills/user/shared/MOD-STRATEGIA-WYBOR.md   (S1 identyfikuje ścieżki)
  view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-DOWODY.md (D6 eksploracja)

Zasilaj PO tym module:
  W1.3 (mapa cel→przesłanka→dowód) — tabela PR z R3 + RAPORT R5
  W2.2 (uzasadnienie) — 4-warstwowy argument z R3
  W3.2 (orzeczenia) — weryfikuj PR-O1, PR-O2, PR-O3 na sn.pl
  Wnioski dowodowe — lista warstwa-4 z R3
```

---

## HISTORIA ZMIAN

```
2.2.0 (2026-06-27) — WARSTWA 0 zamieniona na pointer do MOD-IDENTYFIKACJA-STRONY-UMOWY:
  Logikę W0 (dane większościowe) wydzielono do osobnego modułu shared
  `MOD-IDENTYFIKACJA-STRONY-UMOWY.md` (WARN-19 zamknięty). Moduł jest teraz
  wywoływany przez W0 jako view + ISU-1→ISU-5. Powód wydzielenia: mechanika
  danych większościowych jest użyteczna poza sprawami pracowniczymi — działa
  na umowach B2B, fakturach VAT, polisach, zamówieniach, pismach procesowych.
  Wpływ: MOD-DOKUMENT-ANOMALIE DA-3 → ISU → MOD-PRACODAWCA-RZECZYWISTY W1–W4
  (sekwencja: identyfikacja strony PRZED scaleniem pracodawców).

2.1.0 (2026-06-27) — Dodano WARSTWA 0 (dane większościowe):
  Propozycja dewelopera: zamiast budować argument na doktrynie prawnej,
  zaczynać od empirycznego odczytu — który podmiot jest wskazany przez większość
  elementów identyfikacyjnych dokumentu. KRS błędny = błąd pisarski, gdy NIP,
  nazwa, adres i podpis zgodnie wskazują na podmiot_B.
  Ocena: bardziej uniwersalna (działa na każdym typie umowy), trudniejsza do obalenia
  (pozwana nie może powiedzieć "literówka" bo tym samym przyznaje tożsamość kontrahenta),
  zgodna z art. 65 §1 KC (wykładnia oświadczeń woli).
  Ograniczenie: W0 identyfikuje stronę umowy, nie scala pracodawców dla art. 25¹ KP —
  do zliczania umów nadal konieczne warstwy 1–4.
  Architektura: W0 = "kto jest stroną każdej umowy" → W1-W4 = "czy liczyć razem".
  Naprawa KAT-I: zaktualizowano konsekwencję — ZASTOSUJ W0 (nie "zastosuj venire").
  Wbudowanie w system: brak nowego pliku — W0 jest warstwą w R3 istniejącego modułu.

2.0.0 (2026-06-27) — Upgrade po błędzie krytycznym VII P 94/25:
  Root cause: moduł nie miał triggera w PRE-W2; pipeline generował pismo bez
  wywołania modułu gdy rozbieżność wykryta dopiero po wygenerowaniu tekstu.
  Skutek: pismo v3 opierało argument na błędnym KRS z umów ("ten sam KRS"),
  co pozwana mogła obalić jednym zdaniem ("to literówka").
  Naprawy v2.0.0:
  (1) Dodano ⛔ TRIGGER PRE-W2 na początku pliku — moduł teraz wywołany explicite
      z PRE-W2-VERIFICATION-GATE gdy PRE-W2.C/D wykryje T1/T2/T3/T4.
  (2) Dodano protokół R1–R5 (wcześniej tylko PR1–PR4) — obejmuje klasyfikację
      KAT-I/II/III i hedge procesowy (OPCJA A/B/C).
  (3) Dodano 4-warstwowy argument R3: pracodawca rzeczywisty (art.3 KP) +
      obejście prawa (art.58§1 KC) + venire (art.8 KP) + dowody tożsamości.
  (4) Dodano ⛔ LISTA ZAKAZÓW (R1-R4) — w szczególności ZAKAZ-R1 zakazuje
      argumentu "ten sam KRS" gdy KRS w umowach jest błędny.
  (5) Dodano przykład VII P 94/25 jako case study.
  (6) Scalono z nowym plikiem /home/claude/MOD-PRACODAWCA-RZECZYWISTY.md
      (duplikat stworzony w tej samej sesji — eliminacja zgodnie z CHECKLIST-DEDUP).

1.0.0 (2026-06-21) — Pierwsza wersja.
  Przyczyna: brak dedykowanego modułu do obsługi spraw wielopodmiotowych.
  System posiadał MOD-STRATEGIA-WYBOR (identyfikacja ścieżek, z przykładem VII P 94/25),
  ale brakowało szczegółowej sekwencji z tabelą kryteriów i orzecznictwem.
```


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
