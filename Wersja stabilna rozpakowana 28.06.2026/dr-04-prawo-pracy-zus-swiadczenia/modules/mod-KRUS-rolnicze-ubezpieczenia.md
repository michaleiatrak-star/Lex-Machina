# mod-KRUS-rolnicze-ubezpieczenia

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** KRUS — Dz.U. 2024 poz. 90 t.j. ze zm.
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## 1. CORE

### Zakres
Ubezpieczenie społeczne rolników (emerytalno-rentowe, wypadkowe, chorobowe i macierzyńskie), podleganie KRUS, wyłączenia, wypadki przy pracy rolniczej, choroby zawodowe rolników, odwołania od decyzji KRUS.

### Akty

| Akt | Dz.U. |
|---|---|
| Ustawa o ubezpieczeniu społecznym rolników (KRUS) | Dz.U. 2024 poz. 90 t.j. ze zm. |
| KPC art. 477⁸–477¹⁴ | Dz.U. 2026 poz. 468 |

---

## 2. INTAKE

```
□ Czy rolnik podlega KRUS czy ZUS? → ustal warunki podlegania
□ Jaki rodzaj świadczenia: emerytura rolnicza / renta inwalidowa / zasiłek chorobowy / jednorazowe odszkodowanie za wypadek?
□ Data doręczenia decyzji KRUS → OBLICZ TERMIN 1 MIESIĄCA na odwołanie
□ Czy złożono sprzeciw od orzeczenia? (analogicznie jak ZUS — obowiązkowy)
□ Czy rolnik prowadzi jednocześnie działalność gospodarczą? → może podlegać ZUS
```

---

## 3. PROCEDURA

### Warunki podlegania KRUS (art. 7 ustawy KRUS — weryfikuj w ISAP)

```
Podlega KRUS:
  □ Rolnik prowadzący gospodarstwo rolne pow. 1 ha przeliczeniowego
  □ Domownik rolnika stale pracujący w jego gospodarstwie
  □ Brak obowiązkowego ubezpieczenia w ZUS lub służbach mundurowych

NIE podlega KRUS (lub podlega warunkowo):
  □ Rolnik z działalnością gosp. (ubezpieczenie zdrowotne ZUS + możliwe podwójne ubezp.)
  → Weryfikuj aktualne przepisy ustawy KRUS w ISAP
```

### Odwołanie od decyzji KRUS

```
Decyzja KRUS
  ↓ [1 miesiąc] ODWOŁANIE DO SĄDU — za pośrednictwem KRUS
Właściwy sąd: SO (wydziały pracy i ubezpieczeń) lub SR
Tryb: KPC art. 477⁸–477¹⁴ — NIE tryb WSA
```

---

## 4. WYPADEK PRZY PRACY ROLNICZEJ

```
Definicja (weryfikuj art. 11 ustawy KRUS w ISAP):
  → Nagłe zdarzenie wywołane przyczyną zewnętrzną
  → W związku z pracą w gospodarstwie rolnym
  → Skutkujące uszczerbkiem na zdrowiu lub śmiercią

Świadczenia:
  → Jednorazowe odszkodowanie (procent uszczerbku × stawka)
  → Renta rolnicza z tytułu niezdolności do pracy
  → Renta rodzinna dla rodziny po śmierci rolnika

⚠️ Stawki jednorazowego odszkodowania: weryfikuj obwieszczenie Prezesa KRUS w ISAP/krus.gov.pl
```

---

## 5. DOWODY, STRATEGIA, QUALITY GATE, OUTPUT

**Dowody:** dokumenty potwierdzające prowadzenie gospodarstwa rolnego (ewidencja gruntów), historia leczenia po wypadku, dokumenty ZUS o nieubezpieczeniu, zeznania świadków zdarzenia.

**Strategia:** Zbierz dokumentację wypadku natychmiast. Jeśli KRUS odmawia uznania wypadku za związany z pracą rolniczą — zeznania świadków są kluczowym dowodem.

**Quality gate:** Termin 1 miesiąca na odwołanie? Właściwy sąd (SO/SR)? Warunki podlegania KRUS zweryfikowane? Aktualne stawki odszkodowania z ISAP/krus.gov.pl?

**Output:** stan faktyczny → kwalifikacja → terminy → dowody → ryzyka → strategia → rekomendacja → ISAP/temporalność.

**Źródła:** https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000090 | https://www.krus.gov.pl
