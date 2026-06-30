# WERYFIKACJA-ŚLAD — Moduł Audytu Śladu Weryfikacji

> **Plik:** `/mnt/skills/user/shared/WERYFIKACJA-SLAD.md`
> **Wersja:** 1.0 (2026-05-25)
> **Status:** NOWY — naprawa BLOKER-3

---

## PROBLEM

Model może pominąć web_search i nadal "zaliczyć" self-check przez błędne zaznaczenie
checkboxa. Brak widocznego artefaktu URL w odpowiedzi uniemożliwia użytkownikowi
weryfikację. System musi generować **widzialny ślad weryfikacji** dla każdego
artykułu, liczby i orzeczenia.

---

## ZASADA ŚLADU

**Każdy przepis / liczba / termin / orzeczenie musi mieć JEDEN Z DWÓCH znaczników:**

```
✅ [VER: isap.sejm.gov.pl, 2026-05-25] — zweryfikowano online (URL + data)
⚠️ [NIEWERYFIKOWANE] — weryfikacja niemożliwa (brak dostępu, timeout)
```

> ⛔ **ZAKAZ** oznaczania `✅ [VER]` bez faktycznego wykonania web_search lub web_fetch.
> Zasada jest programowa — model NIE może oznaczyć VER jeśli nie wywołał narzędzia.

---

## FORMAT ŚLADU WERYFIKACJI

### Poziom minimalny (śródtekstowy)

```
art. 190 §1 KK ✅ [VER: isap.gov.pl]
art. 190a §4 KK — tryb na wniosek ✅ [VER: orka.sejm.gov.pl, 25.05.2026]
Termin: 2 tygodnie na sprzeciw od nakazu zapłaty (art. 502 §1 KPC) ✅ [VER: isap.gov.pl]
```

### Poziom pełny (sekcja na końcu analizy / pisma)

```
---
## 🔍 Ślad weryfikacji

| Element | Źródło | Data weryfikacji | Status |
|---|---|---|---|
| art. 190 §1 KK — kara do 3 lat PW | isap.sejm.gov.pl (Dz.U.2025.383) | 2026-05-25 | ✅ |
| art. 190a §4 KK — tryb na wniosek | orka.sejm.gov.pl | 2026-05-25 | ✅ |
| art. 12 §4 KPK — wyjątek wnioskowy | isap.sejm.gov.pl (Dz.U.2026.490) | 2026-05-25 | ✅ |
| Wyrok SN V KK 123/22 | sn.pl (nie znaleziono) | 2026-05-25 | ⚠️ NIEWERYFIKOWANE |
```

---

## KIEDY STOSOWAĆ KTÓRY FORMAT

```
Analiza ≤ 3 przepisów            → poziom minimalny (znaczniki śródtekstowe)
Analiza ≥ 4 przepisów            → poziom pełny (tabela na końcu)
Pismo procesowe (.docx)          → tabela WYŁĄCZNIE w wiadomości (nie w .docx) — patrz STRIP-VER-GATE
Umowa / regulamin / wzorzec      → tabela WYŁĄCZNIE w wiadomości (nie w dokumencie) — patrz STRIP-VER-GATE
Orzeczenie                       → ZAWSZE URL bezpośredni do orzeczenia + data
```

---

## ⛔ STRIP-VER-GATE — BRAMKA OCZYSZCZANIA PRZED EKSPORTEM DOKUMENTU

> **Wersja:** 1.0 (2026-06-23) — patch STRIP-VER
> **Obowiązuje dla:** pism procesowych (.docx), umów, regulaminów, wzorców, OWU

```
TRIGGER: każdorazowo PRZED wywołaniem view /mnt/skills/public/docx/SKILL.md
         i przed finalnym zapisem umowy / regulaminu / wzorca.

⛔ ZAKAZ: znaczniki [VER: …] i [NIEWERYFIKOWANE] NIE mogą pojawić się
          w treści właściwej dokumentu kierowanego do sądu, kontrahenta
          lub klienta.

PROCEDURA:
  SVG-1: Zidentyfikuj WSZYSTKIE wystąpienia:
           ✅ [VER: …]
           ⚠️ [NIEWERYFIKOWANE]
         w treści właściwej pisma / umowy (nagłówek, uzasadnienie,
         żądania, petitum, klauzule, podpisy).

  SVG-2: USUŃ je z treści dokumentu — przepis pozostaje, znacznik znika.
         Przykład przed: „art. 25¹ §3 KP ✅ [VER: isap.sejm.gov.pl, 2026-06-23]"
         Przykład po:    „art. 25¹ §3 KP"

  SVG-3: Przenieś pełną tabelę śladu weryfikacji (format POZIOM PEŁNY)
         do wiadomości towarzyszącej — PRZED present_files:

         ## 🔍 Ślad weryfikacji (wewnętrzny — nie jest częścią dokumentu)
         | Element | Źródło | Data | Status |
         |---|---|---|---|
         | … | … | … | ✅ / ⚠️ |

  SVG-4: Dopiero po SVG-1–SVG-3 → generuj .docx / finalizuj dokument.

⛔ ZAKAZ pominięcia SVG-2: „sąd nie weryfikuje naszego procesu walidacji"
   nie jest uzasadnieniem — znaczniki VER są artefaktem wewnętrznym systemu
   i nigdy nie powinny trafiać do dokumentu urzędowego ani handlowego.

⛔ ZAKAZ „skrótu": przeniesienie tabeli do stopki .docx NIE jest
   równoważne usunięciu — stopka też trafia do adresata. Jedyne
   dopuszczalne miejsce: wiadomość w Claude (nie w pliku .docx).
```

---

## PROCEDURA WERYFIKACJI — SEKWENCJA OBOWIĄZKOWA

```
KROK W-1: Zidentyfikuj wszystkie artykuły / liczby / terminy / orzeczenia w planowanej odpowiedzi.

KROK W-2: Dla każdego elementu → wywołaj narzędzie:
  Przepis KK/KPC/KPA/KC/KP → web_search: "[art. X §Y ustawa]" + web_fetch: isap.sejm.gov.pl
  Orzeczenie SN/SA → web_search: "[sygnatura]" + web_fetch: sn.pl lub orzeczenia.ms.gov.pl
  Rejestr UOKiK → web_fetch: rejestr.uokik.gov.pl

KROK W-3: Przypisz znacznik do każdego elementu:
  Narzędzie zwróciło wynik → ✅ [VER: URL, data]
  Narzędzie nie zwróciło / brak dostępu → ⚠️ [NIEWERYFIKOWANE]
  ⛔ ZAKAZ: ✅ bez wywołania narzędzia

KROK W-4: Przy ≥ 3 nieudanych weryfikacjach z rzędu:
  → Wyświetl użytkownikowi komunikat:
    "⚠️ Weryfikacja online niedostępna (ISAP / sn.pl nie odpowiada).
     Dane poniżej pochodzą z ostatniej weryfikacji systemu (data).
     Zalecam samodzielną weryfikację na isap.sejm.gov.pl przed użyciem
     w postępowaniu."
  → Kontynuuj z oznaczeniem ⚠️ [NIEWERYFIKOWANE] dla wszystkich elementów.
  → NIE blokuj całkowicie odpowiedzi — informuj i kontynuuj z zastrzeżeniami.
```

---

## OBSŁUGA BŁĘDÓW SIECIOWYCH (naprawa WAŻNE-3: SLA)

```
TIMEOUT (brak odpowiedzi w ~15s):
  → Spróbuj alternatywne źródło (np. lexlege.pl / prawo.pl zamiast isap.gov.pl)
  → Jeśli alternatywa też niedostępna → ⚠️ [NIEWERYFIKOWANE]

HTTP 5xx / serwis niedostępny:
  → 1 ponowna próba po 5s
  → Jeśli nadal błąd → ⚠️ [NIEWERYFIKOWANE]

≥ 3 nieudane weryfikacje z rzędu (dowolna kombinacja):
  → Komunikat użytkownikowi (patrz KROK W-4 powyżej)
  → Dalsze odpowiedzi w trybie ⚠️ [NIEWERYFIKOWANE] aż do powrotu dostępu

Tryb awaryjny NIE oznacza pominięcia disclaimera — DISCLAIMER.md stosuje się zawsze.
```

---

## INTEGRACJA Z ROUTEREM

### Dodaj do SELF-CHECK:

```
□ [WERYFIKACJA-ŚLAD] Każdy artykuł / termin / orzeczenie ma znacznik VER lub NIEWERYFIKOWANE?
□ [WERYFIKACJA-ŚLAD] Użyłem narzędzia (web_search/web_fetch) dla każdego VER?
□ [WERYFIKACJA-ŚLAD] ≥3 błędy sieci → komunikat użytkownikowi wyświetlony?
□ [WERYFIKACJA-ŚLAD] Analiza ≥4 przepisów → tabela śladu na końcu odpowiedzi?
```

### Dodaj do REGUŁ NADRZĘDNYCH routera (punkt 14):

```
14. WERYFIKACJA-ŚLAD: Każdy artykuł / liczba / termin / orzeczenie musi mieć znacznik
    ✅ [VER: źródło, data] (po narzędziu) lub ⚠️ [NIEWERYFIKOWANE] (brak dostępu).
    ⛔ ZAKAZ oznaczania VER bez wywołania web_search / web_fetch.
```
