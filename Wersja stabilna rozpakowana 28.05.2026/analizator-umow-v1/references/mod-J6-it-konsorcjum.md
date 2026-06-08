# MODUŁ J6 — UMOWY IT, LICENCYJNE, KONSORCJUM I JOINT VENTURE
## Analizator Umów v2 · Moduł J6

> Wczytaj dla: umowa SLA (service level agreement), umowa licencyjna (IP),
> umowa software development, umowa wdrożeniowa IT, konsorcjum, joint venture,
> umowa o wspólnym przedsięwzięciu.

---
## J.12 UMOWY IT: SLA I LICENCYJNE

### Pułapki:

**IT-SLA-1 — Dostępność "99,9%" bez definicji "niedostępności" (HIGH RISK)**
```
PUŁAPKA: SLA gwarantuje 99,9% uptime, ale:
  → "Niedostępność" = brak odpowiedzi przez [X] sekund z ich systemu monitoringu
  → Prace konserwacyjne wyłączone z czasu niedostępności (maintenance window = 8h/m-c)
  → Faktyczna dostępność: 99,9% z wykluczeniem konserwacji ≈ 99% realnej dostępności

REKOMENDACJA:
  „§X. 'Niedostępność' oznacza brak odpowiedzi Systemu przez ponad [60] sekund
  mierzony przez niezależny zewnętrzny monitoring ([tool/URL]).
  Prace konserwacyjne planowane: max [4]h/m-c, wyłącznie w godz. [02:00–06:00],
  z [72]-godzinnym powiadomieniem. Prace niezapowiedziane wliczane do czasu niedostępności."
```

**IT-SLA-2 — Kary SLA niższe niż wartość przestoju (CRITICAL)**
```
SCHEMAT: SLA kara = 5% miesięcznej opłaty za każdą godzinę niedostępności ponad normę
  → Przy niedostępności 24h = kara 120% miesięcznej opłaty = 1 miesiąc free
  → Rzeczywista strata klienta (B2B): 10x więcej niż kara SLA

REKOMENDACJA:
  → Negocjuj wyższe kary SLA lub prawo do natychmiastowego rozwiązania przy przekroczeniu
    [X] godzin niedostępności w roku (prawo opuszczenia bez kary)
  → "Service Credit" nie zastępuje odszkodowania za rzeczywistą szkodę
```

---

---
## J.14 KONSORCJUM I JOINT VENTURE

### Pułapki:

**KJ-1 — Solidarna odpowiedzialność bez wewnętrznych limitów (CRITICAL)**
```
REŻIM DOMYŚLNY (zamówienia publiczne): Konsorcjum = solidarna odpowiedzialność wobec zamawiającego
  → Jeden partner nie wykonuje → cały dług spada na drugiego

WEWNĘTRZNA UMOWA KONSORCJUM:
  → Musi precyzyjnie określić zakres odpowiedzialności każdego partnera
  → Roszczenia regresowe między partnerami
  → Co się dzieje gdy jeden bankrutuje?

REKOMENDACJA:
  „§X. Partnerzy Konsorcjum ustalają następujący podział odpowiedzialności
  wewnętrznej: Lider odpowiada za [zakres] / Partner za [zakres].
  W przypadku szkody wynikłej z działania Partnera, Lider ma prawo pełnego
  regresu wobec Partnera w terminie [30] dni od zapłaty."
```

---

---
*← Powrót do routingu: `view references/mod-J0-routing.md`*
