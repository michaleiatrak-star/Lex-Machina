# BLUEPRINT SCHEMA — analiza-sadowa-v6

## Schemat przepływu analizy

```
WEJŚCIE
  │
  ├─ Dokumenty prawne (pisma, akta, wyroki, decyzje)
  ├─ Opis słowny sprawy
  └─ Pytanie procesowe

  ▼
KOMUNIKAT STARTOWY (SKILL.md)
  │
  ├─ Tryb A: analiza tekstowa
  ├─ Tryb B: widget (tylko na jawne żądanie)
  └─ Tryb C: hybrydowy

  ▼
════════════════════════════════════════
MODEL CZTEROPRZEBIEGOWY Z DWUKROTNĄ WERYFIKACJĄ
════════════════════════════════════════

  PRZEJŚCIE I — MAPOWANIE FAKTYCZNE
  ├─ Chronologia bezwzględna
  ├─ Rejestr podmiotów
  ├─ Rejestr kwot i dat
  ├─ Rejestr dokumentów (treść dosłowna)
  └─ PUNKT STOP: zero oceny prawnej

  ▼
  PRZEJŚCIE II — KWALIFIKACJA PRAWNA
  ├─ Fakty wyłącznie z Przejścia I
  ├─ Normy z ISAP (eli.gov.pl)
  ├─ Macierz fakt–norma
  ├─ Znamiona SPEŁNIONE/NIESPEŁNIONE/WĄTPLIWE/BRAK DANYCH
  ├─ MOD-B (art. 87 KC) | MOD-D (podwójna kwalifikacja) | MOD-E (e-mail)
  └─ PUNKT STOP: każda norma oficjalnie zweryfikowana

  ▼
  PRZEJŚCIE III — ANALIZA ADVERSARIALNA + WERYFIKACJA PIERWSZA
  ├─ 3A. Trzy perspektywy: sędzia / przeciwnik / własny pełnomocnik
  ├─ 3B. V10 (1–6): sprzeczności, przyznania, konflikty chron., teoria, wiarygodność
  ├─ MOD-A (błędy pełnomocnika) | MOD-C (nagrania)
  └─ 3C. WERYFIKACJA PIERWSZA (W1–W4)
         W1: fakty kluczowe — drugie przeczytanie dokumentów
         W2: sprzeczności V10 — weryfikacja w pełnym kontekście
         W3: przyznania V10-2 — weryfikacja w pełnym akapicie
         W4: rejestr korekt
         STATUS: UKOŃCZONA / WYMAGA UZUPEŁNIENIA

  ▼
  PRZEJŚCIE IV — AUTOKOREKTA + WERYFIKACJA OSTATECZNA
  ├─ P1: zakorzenienie wniosków w faktach
  ├─ P2: izolacja przejść
  ├─ P3: symetria (obie strony)
  ├─ P4: spójność narracyjna
  ├─ P5: poziomy pewności
  ├─ MOD-F (audyt własnych pism)
  └─ WERYFIKACJA OSTATECZNA (O1–O5)
         O1: dowody kluczowe — drugie przeczytanie
         O2: pisma procesowe — drugie przeczytanie
         O3: spójność raportu
         O4: rejestr luk i braków
         O5: rejestr korekt końcowych
         STATUS: UKOŃCZONA / WYMAGA UZUPEŁNIENIA
         GATE: ZATWIERDZONE TAK / NIE

════════════════════════════════════════

  GATE: ZATWIERDZONE TAK
  │
  ├─ FILTRY #2 #4 #8 #9 (references/filtry-analityczne.md)
  │   ├─ Filtr #2: orzecznictwo z oficjalnych źródeł
  │   ├─ Filtr #4: kontekst sporu vs. czyn zabroniony
  │   ├─ Filtr #8: test in dubio (sprawy karne/wykroczeniowe)
  │   └─ Filtr #9: sygnały proceduralne — dwie interpretacje
  │
  └─ RAPORT KOŃCOWY §1–§11
      §1  Kwalifikacja prawna i znamiona
      §2  Orzecznictwo (max 3, zweryfikowane oficjalnie)
      §3  Strona podmiotowa
      §4  Ocena materiału dowodowego (A/B/C/D)
      §5  Słabości stron (symetrycznie)
      §6  Test in dubio
      §7  Sygnały proceduralne
      §8  Moduły specjalistyczne (tylko aktywne)
      §9  Predykcja rozstrzygnięcia (z poziomami pewności)
      §10 Rekomendacje procesowe
      §11 Autokorekta (P1–P5 + W1 + WO)

  ▼
SEKWENCJA END-TO-END
  ├─ Raport Sytuacyjny v2 (obowiązkowy po pełnej analizie)
  └─ Oferta pisma procesowego → prawny-router-v3
```

## Mapa plików references/

| Plik | Etap użycia | Tryb ładowania |
|------|-------------|----------------|
| SKILL.md | Zawsze — wbudowany | auto |
| filtry-analityczne.md | Po Przejściu IV — Filtry #2 #4 #8 #9 | na żądanie |
| WERYFIKACJA-DOWODOW.md | Przejście III W1–W4 i Przejście IV O1–O5 | na żądanie (rozszerzony protokół) |
| MOD-A.md | Przejście III — błędy pełnomocnika | gdy ≥2 pisma jednej strony |
| MOD-B.md | Przejście II — groźba/presja | gdy porozumienie pod presją |
| MOD-C.md | Przejście III — nagranie | gdy dowód z nagrania |
| MOD-D.md | Przejście II — podwójna kwalifikacja | gdy ta sama kwota = 2 kwalifikacje |
| MOD-E.md | Przejście II — e-mail | gdy spór o konto pocztowe |
| MOD-F.md | Przejście IV — audyt własnych pism | gdy audyt pełnomocnika własnego |
| moduly-spec.md | FALLBACK AWARYJNY | gdy brak dostępu do osobnych MOD-X |
| orzecznictwo.md | Filtr #2 (po Przejściu IV) | gdy weryfikacja orzecznictwa |
| koszty-terminy.md | Pytania o terminy/koszty | na żądanie |
| engines/adversarial-v9.md | Przejście III 3A | gdy obszerny materiał |
| engines/contradiction-v10.md | Przejście III 3B | gdy obszerny materiał |
| engines/staged-engine.md | Cały model — obszerny materiał | gdy ≥5 dokumentów |

## Wersjonowanie

| Wersja | Kluczowa zmiana |
|--------|----------------|
| v1–v3 | Podstawowe filtry analityczne |
| v4 | Widget React + moduły specjalistyczne |
| v5 | V10 Contradiction Intelligence + MOD-A–F |
| **v6** | **Model czteroprzebiegowy + dwukrotna weryfikacja + hard gate** |

## Moduł kontynentalny (opcjonalny)

Pliki PRZEBIEG-1/2/3 implementują alternatywną, głębszą warstwę analizy
opartą na modelu kontynentalnym (odpowiednik uzasadnienia wyroku sądowego).

| Plik | Odpowiednik sądowy | Wejście | Wyjście |
|------|--------------------|---------|---------|
| PRZEBIEG-1-ekstrakcja.md | Uzasadnienie faktyczne (art. 327¹ §1 pkt 1 KPC) | Dokumenty surowe | Baza Faktograficzna (BF) |
| PRZEBIEG-2-strukturalna.md | Ocena dowodów (art. 233 KPC / art. 7 KPK) | BF | Obraz Analityczny (OA) |
| PRZEBIEG-3-predykcja.md | Uzasadnienie prawne (art. 327¹ §1 pkt 2 KPC) | BF + OA | Raport §1–§11 |

Uruchom gdy: sprawa bardzo złożona (≥10 dokumentów), wymagana dokumentacja
dla sądu lub klienta na poziomie uzasadnienia wyroku.
Moduł kontynentalny zastępuje Przejścia I–IV i jest z nimi kompatybilny —
BF = Mapa Faktyczna (I), OA = Macierz Fakt–Norma + Raport Adversarialny (II+III).
