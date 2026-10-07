# WORKFLOW: Generator Regulaminów
## Analizator Umów v1 · workflows/generator-regulaminu.md

**Wywołanie:** *„wygeneruj regulamin"*, *„napisz regulamin sklepu/SaaS/platformy/
usług elektronicznych"*.

Przed startem: `view references/generator/rdzen-generowania.md`, następnie
`view references/generator/essentialia-regulaminy-i-korporacyjne.md § 1`.

---

### KROK 0 — COLD START: jaki typ regulaminu?

| Sygnał | Ścieżka |
|---|---|
| Sklep internetowy / sprzedaż online konsumentom | ŚCIEŻKA E-COMMERCE (+ `mod-J8-b2c.md`) |
| Aplikacja/platforma SaaS, subskrypcja | ŚCIEŻKA SaaS (+ `mod-J6-it-konsorcjum.md`) |
| Usługa informacyjna/serwis bez sprzedaży (blog z kontem, forum, newsletter) | ŚCIEŻKA OGÓLNA |
| Platforma z treściami użytkowników (marketplace, UGC) | ŚCIEŻKA E-COMMERCE/SaaS + moderacja UGC (`mod-shared-regulatory-horizon.md`) |

Jeśli niejasne — zapytaj wprost, zanim przejdziesz do wywiadu (rozjazd essentialia
między ścieżkami jest duży).

### KROK 1 — WYWIAD

Zbierz (wg `INTAKE-GAP`):
- usługodawca (pełne dane, KRS/NIP, dane kontaktowe do reklamacji),
- dokładny katalog usług (art. 8 ust. 3 pkt 1 u.ś.u.d.e. — nie ogólnikowo),
- wymagania techniczne po stronie usługobiorcy,
- czy są konsumenci wśród usługobiorców (→ ŚCIEŻKA E-COMMERCE, dodatkowe wymogi
  z ustawy o prawach konsumenta, prawo odstąpienia),
- czy regulamin ma obejmować dane osobowe, czy będzie osobna Polityka Prywatności
  (domyślnie: **rozdziel dokumenty**, patrz §1 w pliku essentialia),
- model płatności (jednorazowa/cykliczna) → wpływa na warunki rozwiązania umowy.

### KROK 2 — SZKIELET wg essentialia art. 8 ust. 3 u.ś.u.d.e.

```
1. Postanowienia ogólne (definicje, dane usługodawcy)
2. Rodzaje i zakres usług świadczonych drogą elektroniczną
3. Warunki świadczenia usług (wymagania techniczne + zakaz treści bezprawnych)
4. Warunki zawierania i rozwiązywania umów o świadczenie usług
5. [ŚCIEŻKA E-COMMERCE] Zamówienia, płatności, dostawa, prawo odstąpienia
6. [ŚCIEŻKA SaaS] Okres rozliczeniowy, SLA, warunki wypowiedzenia subskrypcji
7. Tryb postępowania reklamacyjnego
8. Odpowiedzialność usługodawcy / ograniczenia
9. Dane osobowe — krótkie odesłanie do Polityki Prywatności (nie duplikuj treści)
10. Postanowienia końcowe (zmiany regulaminu, prawo właściwe, spory)
```

Zatrzymaj się i pokaż szkielet (R6), chyba że tryb express.

### KROK 3 — TREŚĆ

Wypełnij treścią wg `style-format-generowania.md`. Dla ŚCIEŻKI E-COMMERCE/UGC —
**przed** finalizacją uruchom `mod-shared-abusive-clauses.md` na cały projekt
(nie tylko wyrywkowo), ponieważ regulamin generowany od zera dla konsumentów
jest najczęstszym miejscem nieświadomego wprowadzenia klauzuli abuzywnej
(np. jednostronna zmiana cen bez prawa odstąpienia, ograniczenie rękojmi).

Uruchom ocenę czytelności `mod-shared-legal-design.md` (D1–D5) — regulaminy
konsumenckie są głównym celem wymogów Omnibus/DSA co do przejrzystości.

### KROK 4 — BRAMKA WALIDACJI

Jak w `generator-umowy.md` KROK 5 (w tym `legal-design-produkcyjny.md` przed
eksportem — regulaminy konsumenckie niemal zawsze kwalifikują się do „light
legal design", patrz LD-P.6), z dodatkowym punktem bramki:

```
5. Klauzule abuzywne — skan mod-shared-abusive-clauses.md wykonany i czysty?
6. Legal design — wynik D1–D5 ≥ 30/50 (60%)?
```

Po potwierdzeniu → finalna wersja + `HYBRID-VALIDATION` + (jeśli .docx)
`STRIP-VER-GATE` + `POST-VALIDATION`, identycznie jak w generatorze umów.

### Disclaimer

> *Regulamin ma charakter roboczy i wymaga weryfikacji prawnej przed publikacją,
> w szczególności pod kątem zgodności z przepisami o ochronie konsumentów i RODO.*
