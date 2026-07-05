# MOD-DOKUMENT-ANOMALIE — Wykrywanie Anomalii w Dokumentach Pracodawcy/Strony Przeciwnej

> **Plik:** `/mnt/skills/user/shared/MOD-DOKUMENT-ANOMALIE.md`
> **Wersja:** 1.1.0 (2026-06-23)
> **Status:** PRODUKCJA
> **Pozycja w pipeline:** W1.2d-EXTEND — po SD-VER, równolegle z MOD-POSZLAKI-KONTEKST
> **Trigger:** ZAWSZE gdy ≥2 dokumenty tworzone przez stronę przeciwną (umowy, regulaminy,
>   pisma) lub gdy materiał dowodowy pochodzi od pracodawcy/kontrahenta

---

## DLACZEGO TEN MODUŁ ISTNIEJE

Konkurencyjny system analizujący tę samą sprawę VII P 94/25 wychwycił trzy anomalie
dokumentacyjne, które umknęły pierwszemu skanowi:

1. **REGON 14-cyfrowy** w umowach HPG (52473117500000) zamiast 9-cyfrowego (524731175)
2. **KRS/NIP cross-contamination**: umowy 3–5 zawierają KRS od HP sp. z o.o. (0000796445)
   ale NIP od HPG sp. z o.o. (6343021499) — sprzeczność wewnętrzna w jednym dokumencie
3. **Rozbieżność adresowa powoda**: "Azot 21/31" w umowach vs "Azot 2A/31" w pismach

Każda z tych anomalii ma wartość procesową:
- Anomalia 1 → dowód na posługiwanie się niedokładnym wzorcem umownym
- Anomalia 2 → dowód na błąd leżący po stronie pracodawcy; nie może szkodzić pracownikowi
- Anomalia 3 → dowód na zmianę adresu lub błąd w dokumentacji kadrowej

Ten moduł formalizuje procedurę wykrywania takich anomalii jako obligatoryjny krok
przed generowaniem pisma procesowego.

---

## SEKWENCJA DA (Document Anomaly)

```
DA-0: INWENTARYZACJA PÓL IDENTYFIKACYJNYCH
  Dla każdego dokumentu strony przeciwnej wypisz:
    □ KRS (jeśli podmiot)
    □ NIP
    □ REGON
    □ Adres siedziby
    □ Adres drugiej strony (powoda/pozwanego)
    □ PESEL (jeśli osoba fizyczna)
    □ Numer dokumentu tożsamości
    □ Data zawarcia vs data skuteczności (spójność)
    □ Podpisujący vs umocowanie do reprezentacji

DA-1: CROSS-CHECK WEWNĘTRZNY (dokument z dokumentem)
  Porównaj te same pola MIĘDZY dokumentami:
    □ Czy KRS jest taki sam we wszystkich umowach?
    □ Czy NIP jest spójny z KRS w każdym dokumencie?
    □ Czy REGON ma prawidłowy format (9 cyfr dla firm, 14 dla jednostek)?
    □ Czy adres powoda/pozwanego jest spójny we wszystkich pismach?
    □ Czy PESEL ma prawidłowy format (11 cyfr) i jest spójny?
    □ Czy podpisujący ma umocowanie (prezes, prokurent, pełnomocnik)?

DA-2: CROSS-CHECK Z REJESTREM
  Dla każdego KRS/NIP: web_search "[numer]" → ustal podmiot
    □ KRS X → podmiot A? Czy to podmiot wymieniony w dokumencie?
    □ NIP Y → podmiot B? Czy B = A?
    □ REGON Z → czy skrócony (9 cyfr) pasuje do rejestru?
    ⛔ HARD GATE: nie formułuj argumentu o tożsamości podmiotów bez DA-2

DA-3: KLASYFIKACJA ANOMALII
  KLASA I (błąd pracodawcy/strony przeciwnej):
    → KRS od podmiotu A + NIP od podmiotu B w jednej umowie
    → REGON w nieprawidłowym formacie
    → Podpisujący bez widocznego umocowania
    → Data wsteczna lub niespójna
    EFEKT: argument "błąd pracodawcy nie szkodzi pracownikowi"

  KLASA II (różnica adresowa — wymaga wyjaśnienia):
    → Adres powoda inny w umowach niż w pismach
    → Dwa formaty tego samego adresu (21/31 vs 2A/31)
    EFEKT: uwaga dla klienta; żadne pismo nie ma błędnego adresu

  KLASA III (potencjalny fałszerstwo/manipulacja):
    → PESEL inny w różnych dokumentach tego samego podmiotu
    → Dwie wersje podpisu/pieczęci
    → Daty niezgodne z chronologią zdarzeń
    EFEKT: wniosek o zbadanie autentyczności dokumentu (art. 253 k.p.c.)

⛔ TRIGGER ISU — PO DA-3, GDY KLASA I LUB II (rozbieżność identyfikatorów podmiotu):
  → view /mnt/skills/user/shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md
  → Wykonaj ISU-1 → ISU-2 → ISU-3 → ISU-4 (jeśli wynik niejednoznaczny) → ISU-5
  → Formuła ISU-5 [A] = gotowy akapit "Identyfikacja strony" do DA-5
  → Wynik ISU wchodzi do DA-REJ jako kolumna "Podmiot wskazany / element błędny"
  ⛔ Nie przechodź do DA-4 bez wykonanego ISU gdy Klasa I dotyczy KRS/NIP/nazwy

⛔ TRIGGER ISU-PESEL — GDY KLASA I/III DOTYCZY PESEL:
  → Wykonaj ISU-PESEL (P1→P6) z MOD-IDENTYFIKACJA-STRONY-UMOWY.md §ISU-PESEL
  → Wynik RAPORTU PESEL wchodzi do DA-REJ

DA-4: REJESTR ANOMALII (DA-REJ)
  Format:
  ┌──────────────────────────────────────────────────────────────────┐
  │ REJESTR ANOMALII DOKUMENTACYJNYCH — DA-REJ                       │
  │ Sprawa: [sygn.] | Data: [data]                                   │
  ├──────┬────────────────┬─────────────┬──────────┬────────────────┤
  │ DA#  │ Dokument       │ Pole        │ Wartość  │ Klasa/Efekt    │
  ├──────┼────────────────┼─────────────┼──────────┼────────────────┤
  │ DA01 │ Umowa 29.09.23 │ KRS         │ 0000796445 vs │ I → błąd  │
  │      │                │             │ NIP 6343021499│ pracodawcy │
  │ DA02 │ Umowy 3-5      │ REGON       │ 14 cyfr  │ I → wzorzec    │
  │ DA03 │ Umowy vs pisma │ Adres pow.  │ 21/31 vs │ II → wyjaśnić  │
  │      │                │             │ 2A/31    │                │
  └──────┴────────────────┴─────────────┴──────────┴────────────────┘

DA-5: ZASILENIE W1.3 I PISMA
  Per każda anomalia Klasy I:
    → Wbuduj jako osobny akapit w uzasadnieniu: "Anomalia dokumentacyjna pracodawcy"
    → Formułuj jako dowód błędu po stronie pracodawcy, nie jako zarzut fałszerstwa
      (chyba że to Klasa III)
    → Wskaż: konkretny dokument + konkretne pole + konkretna wartość + wniosek prawny

  Per każda anomalia Klasy III:
    → Dodaj wniosek dowodowy: "wnoszę o przeprowadzenie dowodu z opinii biegłego
      z zakresu badania dokumentów na okoliczność autentyczności [dokumentu]"

  Per każda anomalia Klasy II:
    → Nie eksponuj w piśmie, chyba że adres powoda w piśmie jest wyraźnie błędny
    → Zgłoś uwagę klientowi poza tekstem pisma
```

---

## REGUŁY SZCZEGÓLNE

```
REGUŁA-KRS-NIP-CROSS:
  Gdy w jednym dokumencie KRS należy do podmiotu A, a NIP do podmiotu B:
  → To nie "ten sam podmiot zmienił nazwę" — to DWIE RÓŻNE SPÓŁKI
  → Argument: "umowy były podpisywane z podmiotem, który faktycznie
    wykonywał obowiązki pracodawcy — niezależnie od błędów identyfikacyjnych"
  → NIE argumentuj: "ten sam KRS = ten sam podmiot"

REGUŁA-REGON-FORMAT:
  REGON firm: 9 cyfr (np. 524731175)
  REGON jednostek budżetowych/ich wydziałów: 14 cyfr
  Jeśli firma ma REGON 14-cyfrowy w umowie → błąd wzorca → Klasa I

REGUŁA-PESEL-ROZBIEZ:
  Różne PESEL tego samego pracownika w różnych dokumentach:
  → Jeśli w aktach, zeznaniach i bazie XLSX jest spójny PESEL → błąd edycji umowy
  → Wskaż jako dowód niedbałej dokumentacji kadrowej → wzmacnia zarzut słabości
    dyscyplinowania procesu przez pracodawcę
  → NIE używaj do kwestionowania tożsamości pracownika

REGUŁA-ADRES-DWUWERSJA:
  "Azot 21/31" (w umowach) vs "Azot 2A/31" (w pismach procesowych):
  → Prawdopodobnie ten sam adres zapisany dwoma sposobami lub zmiana adresu
  → Podaj w piśmie adres z najnowszego dokumentu procesowego
  → Zaznacz dla klienta: sprawdź aktualny adres przed złożeniem
```

---

## INTEGRACJA Z PIPELINE

```
WYWOŁANIE w pisma-procesowe-v3:
  Po SD-VER KOMPLET, równolegle z MOD-POSZLAKI-KONTEKST, przed W1.3:
  view /mnt/skills/user/shared/MOD-DOKUMENT-ANOMALIE.md
  → DA-0 → DA-1 → DA-2 → DA-3 → DA-4 (DA-REJ) → DA-5
  ⛔ STOP [CP-DA] po DA-4 → wyświetl DA-REJ → czekaj na zatwierdzenie
  Po zatwierdzeniu → DA-5 → zasilenie W1.3

WYWOŁANIE w analizator-dowodow-v3:
  Po BLOK-B, przed MD1:
  Jeśli w materiale są dokumenty strony przeciwnej → DA-0 → DA-4
  → wbuduj DA-REJ do raportu jako zakładka "Anomalie dokumentacyjne"

TRIGGER AUTOMATYCZNY:
  □ Umowy o pracę (≥2)
  □ Umowy B2B (≥2 wersje lub strony)
  □ Pisma procesowe strony przeciwnej
  □ Dokumenty rejestrowe z numerami identyfikacyjnymi
  □ Dokumenty tworzone przez pracodawcę/kontrahneta
```

---

## HISTORIA ZMIAN

```
1.0.0 (2026-06-23)
Przyczyna: analiza porównawcza z konkurencyjnym systemem AI (sprawa VII P 94/25).
Konkurencja wykryła: (1) REGON 14-cyfrowy w umowach HPG, (2) KRS/NIP cross-contamination
w umowach 3-5, (3) rozbieżność adresu powoda Azot 21/31 vs 2A/31.
Żadna z tych anomalii nie była wykryta przez system przed tym modułem.
Efekt procesowy: każda anomalia Klasy I to gotowy argument "błąd pracodawcy nie szkodzi
pracownikowi" — wbudowany w uzasadnienie pisma.
```
