---
name: prawo-polskie-v2
version: "6.2"
type: domain-router
status: production
compatibility: "web_search, web_fetch"
description: |
  Fasada routera — 16 dziedzin prawa polskiego (DR-01 do DR-16).
  Wchodzi z: prawny-router-v3 → KROK 1B lub prawny-router-v3 → [10].
  Wychodzi do: właściwy DR-skill → moduł aktu prawnego.
  Zasada: ten plik zawiera TYLKO routing. Treść prawna → w DR-skills.
changelog: |
  Wersja bieżąca: 6.2. Historia — references/CHANGELOG.md (plik założony
  2026-08-23g; wersje sprzed 6.2 nieodtworzone — LUKA JAWNA, ślad wyłącznie
  w audyt-systemu-v4/references/AUDIT-JOURNAL.md).
  Skrót: 6.2 — zapisana decyzja o zakresie shared/PRAWO-HARDGATE.md w tym
  skillu, rozdzielna dla SKILL.md (nie obowiązuje) i ROUTING-MAP.md
  (reżim mapy: FAZA 3 + ZASADA 8 + REGUŁA 3) — flaga F-123.
---

# prawo-polskie-v2 — Fasada Routera DR-01 do DR-16

## ⛔ STAŁE ZASADY WORKFLOW (odsyłacz — NIE duplikować)

> Sprawdzono 2026-07-06: wszystkie 4 zasady zgłoszone przez użytkownika
> ("router→v3 pierwszy, ISAP każdy przepis, HYBRID-VAL przed .docx,
> Karne: +kwalifikator") JUŻ są kanonicznie skodyfikowane w
> `prawny-router-v3/SKILL.md`, sekcja "PREFERENCJE UŻYTKOWNIKA (aktywne
> globalnie)" jako UP-1 do UP-5 — nie duplikuj ich treści tutaj.

Ten plik (`prawo-polskie-v2`) jest wywoływany DOPIERO z poziomu
`prawny-router-v3` (KROK 1B) — a więc UP-1..UP-5 są już aktywne, zanim
routing w tym pliku w ogóle się zacznie. Jedyne dodane tu wzmocnienie:
jeśli ten plik zostanie kiedykolwiek wywołany bezpośrednio, z pominięciem
routera (np. błąd w innym skillu) — potraktuj to jako naruszenie UP-1 i
najpierw wczytaj `prawny-router-v3/SKILL.md` zanim przejdziesz dalej.

## ⛔ DECYZJA ZAPISANA — ZAKRES `shared/PRAWO-HARDGATE.md` W TYM SKILLU

*(zapisana 2026-08-23g, flaga F-123 w `audyt-systemu-v4`. Powód zapisania, nie
tylko podjęcia: pomiar `grep -rl PRAWO-HARDGATE` wykazał tu ZERO odesłań i
zgłosił to jako lukę. Bez utrwalonej decyzji ten sam wynik wracałby jako nowe
zgłoszenie przy każdym kolejnym audycie — a każdy fałszywy alarm kosztuje tyle
co błąd przeoczony, patrz ZASADA 14 w `audyt-systemu-v4/SKILL.md`.)*

**Rozstrzygnięcie jest rozdzielne dla dwóch plików tego skilla:**

| Plik | Czy podlega PRAWO-HARDGATE | Uzasadnienie |
|---|---|---|
| `SKILL.md` (ten plik) | **NIE** | Czysta fasada routingu: kieruje do DR-skilla, nie twierdzi niczego o treści prawa — nie podaje przesłanek, terminów ani skutków. Bramka przed cytowaniem przepisu odpala się w DR-skillu, czyli w miejscu, w którym przepis faktycznie pada. Wpisanie jej także tutaj byłoby duplikacją bez zysku (CHECKLIST-DEDUP). |
| `ROUTING-MAP.md` | **TAK, w zakresie ograniczonym** | ⚠️ Ten plik **nie jest** czystą fasadą: nosi numery Dz.U., roczniki, pozycje i statusy tekstów jednolitych. To są weryfikowalne twierdzenia o stanie prawnym, a błędny numer propaguje się dalej w każdą sprawę, która przez ten routing przejdzie (klasa błędu F-82: numer należący do innego aktu o pokrewnym tytule). |

**Reżim dla `ROUTING-MAP.md`** — nie pełna bramka cytowania, lecz reżim mapy:
`audyt-systemu-v4` FAZA 3 (A–D) + ZASADA 8 (weryfikuj NUMER niezależnie od
zgodności NAZWY) + REGUŁA 3 HARDGATE-AUDYT (synchronizacja z lokalnymi
`MAPA-AKTOW.md` i mapą centralną Dz.U.). Numer wpisany do tego pliku bez
weryfikacji w Rzędzie 1/2 jest naruszeniem tego reżimu.

⛔ **Wyzwalacz zmiany decyzji.** Jeżeli do któregokolwiek pliku tego skilla
trafi kiedykolwiek twierdzenie o TREŚCI prawa — przesłanka, termin, właściwość
sądu, skutek procesowy, cokolwiek poza nazwą aktu, jego numerem i wskazaniem
modułu — decyzja wygasa z automatu i `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`
staje się obowiązkowe. Zakres „tylko routing" jest warunkiem tej decyzji, nie
jej trwałą cechą.

---

## Zasada

```
prawny-router-v3
    ↓ KROK 1B (identyfikacja dziedziny)
prawo-polskie-v2 (ten plik — routing)
    ↓
DR-skill właściwy (np. dr-04-Prawo-Pracy-ZUS-Swiadczenia)
    ↓
moduł aktu prawnego (np. modules/mod-KP-kodeks-pracy.md)
```

Nie ładuj wszystkich DR-skills naraz. Wczytaj JEDEN pasujący.

## Centralna mapa routingu

```
view /mnt/skills/user/prawo-polskie-v2/ROUTING-MAP.md
```

## Routing błyskawiczny

| Fraza / temat sprawy | DR-skill |
|---|---|
| Konstytucja, TK, ustrój, skarga konstytucyjna | `dr-01-Ustroj-Konstytucyjny-i-Zrodla-Prawa` |
| Umowa, odszkodowanie, KC, spadek, spółka, upadłość, windykacja | `dr-02-Prawo-Cywilne-Rodzinne-Gospodarcze` |
| Przestępstwo, KK, KPK, wykroczenie, mandat, stalking, przemoc, cyberprzestępstwo | `dr-03-Prawo-Karne-Wykroczenia-Egzekucja` |
| Wypowiedzenie, KP, ZUS, emerytura, renta, KRUS, PFRON, pomoc społeczna | `dr-04-Prawo-Pracy-ZUS-Swiadczenia` |
| KPA, decyzja urzędu, WSA, NSA, bezczynność, cudzoziemcy, egzekucja admin. | `dr-05-Prawo-Administracyjne-Sadowoadministracyjne` |
| PIT, VAT, CIT, podatki, KAS, akcyza, cło, finanse publiczne | `dr-06-Podatki-Finanse-Publiczne-AML` |
| Przetarg, KIO, PZP, zamówienie, fundusze UE, notariat | `dr-07-Zamowienia-Publiczne-Fundusze-UE` |
| Gmina, powiat, JST, MPZP, uchwała, prawo lokalne, samorząd | `dr-08-Samorzad-Terytorialny-Prawo-Lokalne` |
| Budowa, samowola, PINB, środowisko, odpady, energia, transport | `dr-09-Budownictwo-Srodowisko-Energia-Transport` |
| Lekarz, apteka, farmacja, żywność, rolnictwo, szkoła, sport | `dr-10-Zdrowie-Farmacja-Zywnosc-Rolnictwo` |
| RODO, dane osobowe, KSC, AI Act, cyberbezpieczeństwo, IP, prawo autorskie | `dr-11-Cyfrowe-Cyber-AI-Dane-IP` |
| Sąd, prokuratura, adwokat, radca, notariusz, koszty sądowe | `dr-12-Sadownictwo-Prokuratura-Zawody-Prawnicze` |
| Policja, ABW, służby specjalne, informacje niejawne, wojsko, obrona | `dr-13-Sluzby-Bezpieczenstwo-Informacje-Niejawne` |
| Prawo UE, TSUE, EKPC, ETPC, prawo międzynarodowe | `dr-14-Prawo-UE-Miedzynarodowe-Prawa-Czlowieka` |
| Compliance, ISO, AML instytucjonalny, zamówienia obronne, sygnaliści | `dr-15-Compliance-ISO-Governance-Audyt` |
| Pismo procesowe, strategia, narzędzia, kalkulatory, orzecznictwo | `dr-16-Pisma-Strategia-Dowody-Orzecznictwo` |

## Jak wywołać DR-skill

```
view /mnt/skills/user/dr-[XX]-[Nazwa]/SKILL.md
# następnie:
view /mnt/skills/user/dr-[XX]-[Nazwa]/modules/mod-[akt].md
```

## Weryfikacja
- Teksty aktów: isap.sejm.gov.pl
- Prawo UE: eur-lex.europa.eu
- Orzeczenia: orzeczenia.ms.gov.pl | sn.pl | nsa.gov.pl

---

## Protokół integracji DR → prawo-polskie → audyt

### Przepływ danych (pull)

```
DR-XX/MAPA-AKTOW.md         ← źródło prawdy dla danej dziedziny
        ↓  pull przy audycie DZU
ROUTING-MAP.md               ← centralna mapa wszystkich 16 DR
        ↓  porównanie (FAZA 3 audytu)
audyt-systemu-v4/references/mapa_dzu_*.md  ← rejestr Dz.U.
```

### Jak zaktualizować po zmianie w DR-skill

1. Wczytaj zmieniony `dr-XX/MAPA-AKTOW.md`
2. Porównaj z odpowiednią sekcją `ROUTING-MAP.md`
3. Uzupełnij rozbieżności — nowe akty, zmienione t.j., nowe statusy
4. Zaktualizuj liczniki w tabeli TABELA STATUSU
5. Wpis z vacatio legis → dodaj do sekcji MONITORING na końcu ROUTING-MAP.md
6. Wywołaj `audyt-systemu-v4` TRYB DZU — zweryfikuje `mapa_dzu_*.md`

### Akty oczekujące (MONITORING) — reguły

| Sytuacja | Akcja |
|---|---|
| Nowy Dz.U. z vacatio legis znaleziony podczas weryfikacji ISAP | Dodaj `⏳ OCZEKUJE` do tabeli DR i do sekcji MONITORING |
| Data wejścia w życie minęła | Zmień `⏳→✅ OK`, usuń z MONITORING, zaktualizuj mapa_dzu |
| Akt uchylony przed wejściem | Status `❌`, usuń z MONITORING, odnotuj w AUDIT-JOURNAL |
| Wejście w ciągu 90 dni od daty audytu | Zmień na `⚡ WCHODZI` — priorytetowa aktualizacja modułu |

*Numer wersji: wyłącznie pole `version:` we frontmatterze — decyzja generalna
F-102(C), dwa źródła prawdy o wersji zawsze się rozjeżdżają (ta stopka niosła
„5.2" przy `version: 6.1`, rozjazd o dziewięć wersji, usunięty 2026-08-23g).*

*Ostatnia zmiana treści: 2026-08-23g — zapisana decyzja o zakresie
`shared/PRAWO-HARDGATE.md` w tym skillu (F-123). Wcześniej: 2026-07-02,
WARN-28 zamknięty — ABW/AW to nowy t.j. tej samej ustawy z 2002 r., nie
reforma; sync ROUTING-MAP.*
