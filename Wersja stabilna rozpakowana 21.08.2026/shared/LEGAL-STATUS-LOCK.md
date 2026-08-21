# LEGAL-STATUS-LOCK (LSL) — Weryfikacja Statusu Prawnego Aktów

**Plik kanoniczny:** `/mnt/skills/user/shared/LEGAL-STATUS-LOCK.md`
Wywołuj przez: `view /mnt/skills/user/shared/LEGAL-STATUS-LOCK.md`
**Wersja:** 1.0 | Data wprowadzenia: 2026-06-01

---

## GENEZA I CEL

Moduł powstał w odpowiedzi na błąd systemowy: przyjęcie twierdzenia strony
(prokuratury) o nieprawomocności wyroku jako faktu procesowego, bez weryfikacji
z dokumentów źródłowych i bez obliczenia terminów zaskarżenia.

**Błąd wzorcowy (sprawa VIII W 633/25):**
- Prokurator napisała: "wyrok ten jest nieprawomocny"
- Wyrok ogłoszono: 13.02.2026 | Uzasadnienie: 27.02.2026 | Termin: 7 dni KPW
- Postanowienie prokuratury: 20.05.2026 → 82 dni po ogłoszeniu
- Brak dowodu apelacji w aktach
- **Wniosek z dokumentów: wyrok PRAWOMOCNY** — sprzeczność z twierdzeniem strony
- **Skutek błędu:** pismo użyło sformułowania osłabiającego argument o prawomocności

**Cel modułu:** automatyczna weryfikacja statusu prawnego każdego aktu
(orzeczenia, decyzji, oświadczenia, porozumienia, postanowienia)
przed dopuszczeniem twierdzenia o jego statusie do treści pisma.

---

## ⛔ HARD GATE — WYZWALACZE OBOWIĄZKOWE

Moduł LSL uruchamia się AUTOMATYCZNIE przy wykryciu w materiale lub piśmie
KTÓREGOKOLWIEK z poniższych sygnałów:

```
SŁOWA KLUCZOWE STATUSU:
  prawomocny / nieprawomocny / ostateczny / nieostateczny
  uprawomocnił się / uprawomocnienie / uprawomocniony
  zaskarżony / niezaskarżony / zaskarżalny
  skuteczny / bezskuteczny / wiążący / niewiążący
  nieważny / unieważniony / kwestionowany
  wykonalny / niewykonalny / tymczasowo wykonalny
  wygasł / wygaśnięcie / rozwiązał się / rozwiązanie

RODZAJE AKTÓW (automatyczne wywołanie przy każdym):
  wyrok / postanowienie / nakaz zapłaty / nakaz / wyrok zaoczny
  decyzja / pozwolenie / zezwolenie / koncesja / zaświadczenie
  wypowiedzenie / odstąpienie / oświadczenie o rozwiązaniu
  porozumienie / ugoda / umowa / aneks / zmiana umowy
  cofnięcie / uznanie / zrzeczenie się
  postanowienie prokuratury / umorzenie / odmowa wszczęcia
```

**ZAKAZ BEZWZGLĘDNY:**
⛔ Żadne twierdzenie o statusie prawnym aktu NIE może trafić do pisma
bez przejścia przez protokół LSL dla właściwej kategorii.

---

## TAKSONOMIA — 6 KATEGORII AKTÓW

```
LSL-1  Orzeczenia sądowe
LSL-2  Decyzje i akty administracyjne
LSL-3  Oświadczenia woli jednostronne
LSL-4  Czynności procesowe stron
LSL-5  Umowy, porozumienia, ugody pozasądowe
LSL-6  Postanowienia prokuratorskie i policyjne
```

---

## SKALA PEWNOŚCI — 4 TAGI WYNIKOWE

```
✅ LSL-CONFIRMED
   Status ustalony wprost z dokumentów + obliczenia terminów.
   Użycie w piśmie: bez zastrzeżeń, podaj źródło w nawiasie.

⚠️ LSL-ASSERTED
   Status pochodzi wyłącznie z twierdzenia strony / organu.
   Brak potwierdzenia w dokumentach źródłowych.
   Użycie w piśmie: OBOWIĄZKOWO z oznaczeniem:
   "według twierdzeń [strona/organ]" lub "jak wskazuje [strona]"
   NIGDY jako fakt przyjęty bez zastrzeżeń.

❓ LSL-UNKNOWN
   Brak danych wystarczających do ustalenia statusu.
   Użycie w piśmie: znacznik ⬛ [WYMAGA WERYFIKACJI — status aktu]
   + pytanie do użytkownika o brakujący dokument.

🔴 LSL-CONFLICT
   Dokumenty źródłowe wskazują inaczej niż twierdzenie strony.
   Użycie w piśmie:
   a) użyj wersji z dokumentów (✅ LSL-CONFIRMED),
   b) odnotuj sprzeczność jako argument procesowy,
   c) BLOKADA użycia wersji strony jako faktu.
```

---

## PROTOKOŁY WERYFIKACJI — 6 KATEGORII

---

### LSL-1: ORZECZENIA SĄDOWE
*(wyroki, postanowienia, nakazy zapłaty, wyroki zaoczne)*

```
Q1  Data ogłoszenia lub doręczenia orzeczenia?
    Źródło wymagane: protokół ogłoszenia / zwrotka doręczenia
    Jeśli brak → ❓ LSL-UNKNOWN

Q2  Tryb postępowania i właściwy kodeks?
    KPC / KPK / KPW / KPA / PPSA → wyznacza termin zaskarżenia
    Terminy referencyjne (weryfikuj online — nie z pamięci):
      KPC apelacja: 14 dni od doręczenia z uzasadnieniem
                    (lub od ogłoszenia gdy strona była obecna i nie złożyła
                    wniosku o uzasadnienie — wtedy 14 dni od ogłoszenia)
      KPK apelacja: 14 dni od doręczenia z uzasadnieniem
      KPW apelacja: 7 dni od ogłoszenia (gdy strona obecna)
                    lub 7 dni od doręczenia (gdy nieobecna)
      KPA odwołanie: 14 dni od doręczenia decyzji

Q3  Czy strona była obecna przy ogłoszeniu?
    Źródło wymagane: protokół ogłoszenia / rozprawy
    Jeśli brak → oblicz termin konserwatywnie (od doręczenia)

Q4  Czy złożono wniosek o uzasadnienie?
    Źródło wymagane: pismo w aktach / wzmianka w protokole
    Wpływ: w KPC wyznacza punkt startowy terminu apelacji

Q5  Czy w dostarczonych dokumentach jest dowód złożenia środka
    zaskarżenia (apelacja / zażalenie / sprzeciw / zarzuty)?
    Źródło wymagane: pismo w aktach, prezentata sądu
    Jeśli TAK → orzeczenie NIE jest prawomocne → ⚠️ LSL-ASSERTED lub ❓
    Jeśli NIE → przejdź do Q6

Q6  Obliczenie upływu terminu:
    Data z Q1 + termin z Q2 = ostatni dzień zaskarżenia
    Porównaj z datą dokumentu, w którym pada twierdzenie o statusie.
    Jeśli termin upłynął i brak dowodu zaskarżenia:
    → ✅ LSL-CONFIRMED: PRAWOMOCNY
    Jeśli termin nie upłynął:
    → ⚠️ LSL-ASSERTED lub ❓ LSL-UNKNOWN

REGUŁA SPRZECZNOŚCI:
  Jeśli obliczenie Q6 → PRAWOMOCNY,
  a strona/organ twierdzi NIEPRAWOMOCNY:
  → 🔴 LSL-CONFLICT
  → W piśmie: użyj PRAWOMOCNY, wytknij sprzeczność jako argument
```

---

### LSL-2: DECYZJE I AKTY ADMINISTRACYJNE
*(decyzje KPA, ZUS, podatkowe, pozwolenia budowlane, zezwolenia)*

```
Q1  Data doręczenia decyzji stronie?
    Źródło wymagane: zwrotka / potwierdzenie odbioru / adnotacja w aktach

Q2  Organ wydający i właściwy tryb zaskarżenia?
    KPA: odwołanie do organu II instancji (14 dni)
    Ordynacja podatkowa: odwołanie (14 dni)
    Prawo budowlane / ustawa szczególna: weryfikuj tryb online

Q3  Rozróżnienie: ostateczność vs. prawomocność (art. 16 KPA):
    OSTATECZNA = brak możliwości odwołania w trybie administracyjnym
                 (upływ terminu bez odwołania LUB rozstrzygnięcie II inst.)
    PRAWOMOCNA = dodatkowo upłynął termin skargi do WSA (30 dni)
    ⛔ Nie stosuj zamiennie — to dwa różne stany prawne

Q4  Czy złożono odwołanie w terminie?
    Źródło wymagane: pismo odwoławcze, potwierdzenie wpłynięcia

Q5  Czy jest rozstrzygnięcie organu II instancji?
    Źródło wymagane: decyzja/postanowienie II instancji

Q6  Czy złożono skargę do WSA (30 dni od doręczenia decyzji II inst.)?
    Źródło wymagane: pismo do WSA, potwierdzenie

WYNIK:
  Brak odwołania + upływ 14 dni → OSTATECZNA (✅ LSL-CONFIRMED)
  Brak skargi WSA + upływ 30 dni od II inst. → PRAWOMOCNA (✅ LSL-CONFIRMED)
  Odwołanie złożone → w toku (⚠️ LSL-ASSERTED jeśli tylko z pisma strony)
  Brak danych o doręczeniu → ❓ LSL-UNKNOWN
```

---

### LSL-3: OŚWIADCZENIA WOLI JEDNOSTRONNE
*(wypowiedzenie umowy, odstąpienie, rozwiązanie stosunku pracy,
oświadczenie o potrąceniu, wezwanie do zapłaty)*

```
Q1  Data wystawienia dokumentu?
    Źródło wymagane: dokument

Q2  Data i sposób doręczenia adresatowi?
    Źródło wymagane: zwrotka / potwierdzenie odbioru / e-mail z potwierdzeniem
    Jeśli brak → Q3

Q3  Czy istnieje podstawa do przyjęcia domniemania doręczenia
    z art. 61 KC (możliwość zapoznania się)?
    Przesłanki: adresat aktywny na komunikatorach, adres znany,
    brak zwrotu przesyłki, wzmianka w innym piśmie
    Jeśli TAK → ⚠️ LSL-ASSERTED (skuteczne z zastrzeżeniem)
    Jeśli NIE → ❓ LSL-UNKNOWN

Q4  Forma wymagana przepisem i zachowana?
    Wypowiedzenie umowy o pracę: pisemna (art. 30 §3 KP)
    Odstąpienie od umowy: forma umowy lub pisemna gdy ustawa wymaga
    Weryfikuj dla danego rodzaju oświadczenia online

Q5  Czy podniesiono wadę oświadczenia woli?
    (błąd, podstęp, groźba bezprawna — art. 82–88 KC)
    Jeśli TAK → skuteczność kwestionowana → ⚠️ LSL-ASSERTED
    + nota: "kwestionowane w postępowaniu [sygnatura]"

WYNIK:
  Doręczone + właściwa forma + brak wady → SKUTECZNE (✅ LSL-CONFIRMED)
  Doręczenie niepotwierdzone → ⚠️ LSL-ASSERTED lub ❓ LSL-UNKNOWN
  Wada oświadczenia podniesiona → ⚠️ LSL-ASSERTED
  Forma niezachowana → BEZSKUTECZNE (✅ LSL-CONFIRMED jeśli pewne)
```

---

### LSL-4: CZYNNOŚCI PROCESOWE STRON
*(cofnięcie pozwu, zrzeczenie się roszczenia, uznanie powództwa,
cofnięcie apelacji, ugoda sądowa)*

```
Q1  Rodzaj czynności i jej odwołalność?
    Cofnięcie pozwu przed doręczeniem odpisu: bez zgody pozwanego
    Cofnięcie po doręczeniu: wymaga zgody pozwanego (art. 203 §1 KPC)
    Zrzeczenie się roszczenia: nieodwołalne po zatwierdzeniu

Q2  Etap postępowania przy dokonaniu czynności?
    Źródło wymagane: protokół / zarządzenie sądu

Q3  Czy wymagana zgoda strony przeciwnej i czy udzielona?
    Źródło wymagane: protokół / pismo

Q4  Czy sąd zatwierdził / umorzył / wydał postanowienie?
    Źródło wymagane: postanowienie sądu
    Bez zatwierdzenia sądu → czynność nieskuteczna procesowo

Q5  Ugoda sądowa: czy zatwierdzona postanowieniem?
    Źródło wymagane: protokół z adnotacją o zatwierdzeniu

WYNIK:
  Czynność + zgoda (jeśli wymagana) + orzeczenie sądu
  → SKUTECZNA (✅ LSL-CONFIRMED)
  Brak któregokolwiek elementu → ⚠️ LSL-ASSERTED lub ❓ LSL-UNKNOWN
```

---

### LSL-5: UMOWY, POROZUMIENIA, UGODY POZASĄDOWE
*(umowy o pracę, porozumienia rozwiązujące, ugody,
aneksy, zmiany umowne)*

```
Q1  Data zawarcia i podpisania przez obie strony?
    Źródło wymagane: dokument z podpisami

Q2  Forma wymagana i zachowana?
    Umowa o pracę: pisemna (art. 29 §2 KP)
    Porozumienie rozwiązujące: pisemna (art. 30 §3 KP)
    Umowa o przeniesienie własności nieruchomości: akt notarialny
    Weryfikuj dla danego typu online

Q3  Czy podniesiono wadę oświadczenia woli?
    Groźba bezprawna (art. 87 KC): wymaga udowodnienia
      → przymusowe okoliczności + bezprawność + adekwatny związek
    Błąd (art. 84 KC): co do treści czynności prawnej
    Podstęp (art. 86 KC): celowe wprowadzenie w błąd
    Jeśli TAK i toczy się postępowanie → ⚠️ LSL-ASSERTED
    + nota: "kwestionowane w postępowaniu [sygnatura]"

Q4  Czy toczy się postępowanie o unieważnienie / ustalenie nieważności?
    Źródło wymagane: informacja o sygnaturze postępowania

Q5  Czy jest prawomocne orzeczenie stwierdzające nieważność?
    Źródło wymagane: wyrok / postanowienie
    Jeśli TAK → NIEWAŻNE (✅ LSL-CONFIRMED)
    Jeśli NIE i brak postępowania → WIĄŻĄCE (✅ LSL-CONFIRMED)
    Jeśli postępowanie w toku → ⚠️ LSL-ASSERTED

REGUŁA DOMNIEMANIA WAŻNOŚCI:
  Umowa podpisana przez obie strony + właściwa forma + brak orzeczenia
  o nieważności = WIĄŻĄCA (✅ LSL-CONFIRMED)
  Nawet jeśli strona kwestionuje ważność — dopóki brak orzeczenia:
  oznacz jako ⚠️ LSL-ASSERTED z notą o toczącym się sporze.

UWAGA NA TEN BŁĄD:
  Twierdzenie strony "porozumienie jest nieważne" ≠ fakt procesowy.
  Dopóki brak prawomocnego orzeczenia — porozumienie pozostaje formalnie
  wiążące, choć kwestionowane. W piśmie: rozróżniaj te dwa stany.
```

---

### LSL-6: POSTANOWIENIA PROKURATORSKIE I POLICYJNE
*(umorzenie śledztwa, odmowa wszczęcia, zawieszenie,
postanowienie o przedstawieniu zarzutów)*

```
Q1  Data doręczenia odpisu postanowienia pokrzywdzonemu?
    Źródło wymagane: pismo przewodnie / zwrotka
    Jeśli brak daty doręczenia → ❓ LSL-UNKNOWN

Q2  Termin na zażalenie: 7 dni od doręczenia (art. 460 KPK) — zawity
    Oblicz: data Q1 + 7 dni = ostatni dzień

Q3  Czy złożono zażalenie w terminie?
    Źródło wymagane: pismo zażaleniowe + data wniesienia
    Jeśli NIE i termin upłynął → postanowienie PRAWOMOCNE (✅ LSL-CONFIRMED)
    Jeśli TAK → w toku

Q4  Czy sąd rozstrzygnął zażalenie?
    Źródło wymagane: postanowienie sądu
    Jeśli uchylił → postępowanie wznowione
    Jeśli utrzymał → drugi środek lub akt oskarżenia subsydiarny

Q5  Czy wykorzystano środki dwukrotnie (art. 330 §2 KPK)?
    Ścieżka do subsydiarnego aktu oskarżenia (art. 55 §1 KPK)
    Źródło wymagane: dwa postanowienia + zażalenia na oba

WYNIK:
  Brak zażalenia + upływ 7 dni → PRAWOMOCNE (✅ LSL-CONFIRMED)
  Zażalenie złożone → w toku (⚠️ lub ❓)
  Brak daty doręczenia → ❓ LSL-UNKNOWN
```

---

## PROCEDURA WYKONAWCZA — KROK PO KROKU

```
KROK LSL-1: DETEKCJA
  Skanuj każdy dokument i każde twierdzenie.
  Przy wykryciu wyzwalacza (patrz: HARD GATE) → STOP → uruchom LSL.

KROK LSL-2: KLASYFIKACJA
  Przypisz akt do kategorii LSL-1 do LSL-6.
  Jeden akt = jedna kategoria.
  Wiele aktów w sprawie = oddzielna weryfikacja dla każdego.

KROK LSL-3: ŹRÓDŁO TWIERDZENIA
  Skąd pochodzi twierdzenie o statusie?
  a) Z dokumentu urzędowego (protokół, zwrotka, orzeczenie) → FSL-A
  b) Z pisma strony / organu → FSL-B → obowiązkowa weryfikacja Q1–Q6
  c) Z obliczenia na danych ze źródeł → FSL-C → pokaż składniki

KROK LSL-4: PROTOKÓŁ DLA KATEGORII
  Wykonaj pytania Q1–Q6 dla właściwej kategorii (patrz wyżej).
  Dla każdego Q: wskaż dokument źródłowy lub oznacz jako brak.

KROK LSL-5: TAGOWANIE
  Przypisz tag: ✅ / ⚠️ / ❓ / 🔴
  Jeden tag per akt — najbardziej restrykcyjny z wynikających z Q1–Q6.

KROK LSL-6: DZIAŁANIE W PIŚMIE
  ✅ → użyj wprost, dodaj źródło w nawiasie
  ⚠️ → użyj z oznaczeniem "według twierdzeń [strona]"
  ❓ → znacznik ⬛ [WYMAGA WERYFIKACJI] + pytanie do użytkownika
  🔴 → użyj wersji z dokumentów + wytknij sprzeczność jako argument
```

---

## FORMAT RAPORTU LSL (dołącz do raportu MOD-WALIDACJA, blok J)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RAPORT LSL — WERYFIKACJA STATUSU PRAWNEGO AKTÓW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AKT [nr]: [nazwa/typ aktu, data, strona]
  Kategoria: LSL-[1-6]
  Twierdzenie w materiale: "[cytat twierdzenia]"
  Źródło twierdzenia: FSL-[A/B/C]
  Weryfikacja Q1–Q6:
    Q1: [wynik] (źródło: [dokument])
    Q2: [wynik] (źródło: [przepis/dokument])
    ...
  TAG: [✅/⚠️/❓/🔴]
  Użycie w piśmie: [jak sformułowano po weryfikacji]
  [jeśli 🔴:] SPRZECZNOŚĆ: dokument mówi [X], strona twierdzi [Y]
              ARGUMENT PROCESOWY: [jak wykorzystać w piśmie]

PODSUMOWANIE:
  ✅ LSL-CONFIRMED:  [n] aktów
  ⚠️ LSL-ASSERTED:  [n] aktów → oznaczone w piśmie
  ❓ LSL-UNKNOWN:   [n] aktów → znaczniki ⬛ w piśmie
  🔴 LSL-CONFLICT:  [n] aktów → sprzeczności wykorzystane argumentacyjnie

[jeśli 🔴 lub ❓:]
⛔ BLOKADA UŻYCIA TWIERDZENIA STRONY jako faktu przyjętego.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## INTEGRACJA Z INNYMI MODUŁAMI

```
MOD-FAKTY        → LSL jest rozszerzeniem F2 dla kategorii statusu prawnego.
                   LSL-ASSERTED odpowiada FSL-B (twierdzenie strony).
                   LSL-CONFIRMED odpowiada FSL-A (fakt urzędowy).

MOD-WALIDACJA    → LSL dodaje blok J do raportu walidacyjnego.
                   Blok J: obligatoryjny gdy w sprawie są akty wymagające
                   weryfikacji statusu (wyzwalacze LSL).

TERM-CALC        → LSL-Q6 (obliczenie upływu terminu) wywołuje TERM-CALC
                   jako moduł pomocniczy do weryfikacji dni wolnych.

HYBRID-VALIDATION → LSL-CONFLICT powoduje oznaczenie 🔴 w raporcie
                    HYBRID-VALIDATION i wymaga potwierdzenia przez użytkownika
                    przed finalizacją pisma.

pisma-procesowe-v3 → LSL uruchamiany obowiązkowo w W1.2 (analiza materiału)
                     i w W3.3 (MOD-FAKTY) — jako podmoduł F2 dla statusów.
```

---

## ZASADA NADRZĘDNA

```
⛔ ZAKAZ ABSOLUTNY:
Twierdzenie strony / organu o statusie prawnym aktu
NIE jest faktem procesowym.
Jest TWIERDZENIEM wymagającym weryfikacji przez LSL.

Dopóki LSL nie przypisze tagu ✅ LSL-CONFIRMED —
twierdzenie o statusie aktu NIE może być użyte
w piśmie jako fakt przyjęty bez zastrzeżeń.

Naruszenie = błąd krytyczny klasy ⛔ BRAK ŹRÓDŁA
w rozumieniu MOD-FAKTY.
```
