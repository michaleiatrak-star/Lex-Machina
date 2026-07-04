---
name: prawo-polskie-v2
version: 5.2
type: domain-router
status: production
compatibility: "web_search, web_fetch"
description: |
  Fasada routera — 16 dziedzin prawa polskiego (DR-01 do DR-16).
  Wchodzi z: prawny-router-v3 → KROK 1B lub prawny-router-v3 → [10].
  Wychodzi do: właściwy DR-skill → moduł aktu prawnego.
  Zasada: ten plik zawiera TYLKO routing. Treść prawna → w DR-skills.
---

# prawo-polskie-v2 — Fasada Routera DR-01 do DR-16

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

*Wersja: 5.2 | 2026-07-02 (WARN-28 zamknięty — ABW/AW to nowy t.j. tej samej ustawy z 2002 r., nie reforma; sync ROUTING-MAP)*
