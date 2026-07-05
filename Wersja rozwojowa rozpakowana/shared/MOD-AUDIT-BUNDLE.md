# MOD-AUDIT-BUNDLE — Paczka Audytowa Outputu (AI Act art. 12)

> **Plik:** `/mnt/skills/user/shared/MOD-AUDIT-BUNDLE.md`
> **Wersja:** 1.0.0 (2026-07-05)
> **Status:** NOWY — AUDYT-2026-07-05a
> **Wzorzec:** legal-ai-audit-bundle (fundament-weryfikacyjny, awesome-matematic-skills-pl)
> **Pozycja w pipeline:**
>   - wywoływany PO zakończeniu deliverable wysokiej stawki (pismo FINAL, opinia,
>     analiza sądowa) — na żądanie użytkownika lub w trybie PRAWNIK/kancelaria
>   - konsumuje: raport MOD-STEP-TRACKER, tabelę WERYFIKACJA-SLAD, DISCLAIMER
>   - NIE zastępuje żadnej bramki jakości — pakuje ich WYNIKI w artefakt

---

## DLACZEGO TEN MODUŁ ISTNIEJE

**Zasada:** *jeśli nie potrafisz odtworzyć, jak AI doszło do wyniku, nie powinieneś
wysyłać tego wyniku.*

Dotychczas system dokumentował proces narracyjnie (MOD-STEP-TRACKER w treści
odpowiedzi, tabela śladu weryfikacji w wiadomości). To dobry fundament, ale nie
tworzy PRZENOŚNEGO ARTEFAKTU: klient compliance, audytor lub regulator pyta
o twardy dowód (AI Act art. 12 — rejestrowanie zdarzeń; art. 14 — nadzór
człowieka; art. 50 — transparentność), nie o narrację w czacie.

Ten moduł składa wyniki istniejących bramek w JEDNĄ paczkę audytową z manifestem
i sumami kontrolnymi. Paczka jest deliverable dla AUDYTORA — nigdy dla sądu
ani kontrahenta (STRIP-VER-GATE stosuje się do dokumentu głównego bez zmian).

---

## CO WCHODZI DO PACZKI

| Artefakt | Źródło w systemie | Wymagane |
|---|---|---|
| Deliverable finalny | pismo / opinia / analiza (wersja FINAL lub DRAFT z oznaczeniem) | TAK |
| Ślad weryfikacji | tabela z WERYFIKACJA-SLAD.md (poziom pełny, z kolumną gradientu) | TAK, jeśli były przepisy/orzeczenia |
| Raport kroków | output MOD-STEP-TRACKER (wykonane / pominięte kroki i bramki) | TAK dla wysokiej stawki |
| Raport walidacji | wyniki bramek: LEGAL-QUALITY-GATE, AUDYT-KONCOWY, PEER-REVIEW / POST-VALIDATION | jeśli uruchomione |
| Metadane | model, data, tryb (PRAWNIK/LAIK), użyte skille/moduły, źródła, kto zatwierdza | TAK |
| Disclaimer | wariant użyty z DISCLAIMER.md | TAK |

⛔ **NIGDY w paczce:** mapa anonimizacji / pseudonimizacji (KROK 0A routera) —
to klucz do re-identyfikacji, czyli dane osobowe. Trzymana OSOBNO, dostęp ograniczony.

---

## PROCEDURA AB (Audit Bundle)

```
AB-1 ZBIERZ: skompletuj artefakty z tabeli wyżej. Artefakt nieistniejący →
     wpisz do manifestu jako MISSING z powodem (np. "PEER-REVIEW nieuruchomiony —
     stawka NISKA"). Paczka powstaje MIMO braków — audytor musi widzieć, czego nie ma.

AB-2 MANIFEST: zbuduj manifest (format niżej): identyfikator, metadane,
     lista artefaktów ze statusem OBECNY/MISSING.

AB-3 INTEGRALNOŚĆ: dla każdego pliku paczki policz sumę SHA-256 i wpisz do
     manifestu. (W środowisku z narzędziem plikowym: `sha256sum <plik>`;
     bez narzędzia: oznacz "hash: NIEDOSTĘPNY W ŚRODOWISKU" — nie zmyślaj sum.)

AB-4 INDEX: wygeneruj INDEX.md — czytelne streszczenie dla człowieka:
     co, kiedy, jakim modelem, jakie źródła, jaka kompletność, kto zatwierdza.

AB-5 RAPORT: zwróć użytkownikowi raport kompletności (format niżej) +
     przypomnienie o archiwizacji w rejestrze AI kancelarii i o osobnym
     przechowywaniu mapy anonimizacji.
```

---

## FORMAT MANIFESTU

```json
{
  "bundle_id": "OPINIA-RRRR-NNN",
  "tytul": "…",
  "data": "RRRR-MM-DD",
  "model": "…",
  "tryb": "PRAWNIK | LAIK",
  "skille_uzyte": ["prawny-router-v3", "dr-11", "pisma-procesowe-v3"],
  "stawka": "WYSOKA | ŚREDNIA | NISKA",
  "zrodla": ["art. 385¹ §1 KC (t.j. Dz.U. …)", "II CSK 123/19", "CELEX 32016R0679"],
  "anonimizacja_uzyta": true,
  "zatwierdzajacy": "— (uzupełnia człowiek)",
  "artefakty": [
    {"plik": "01-deliverable/…", "status": "OBECNY", "sha256": "…"},
    {"plik": "02-slad-weryfikacji/…", "status": "OBECNY", "sha256": "…"},
    {"plik": "03-step-tracker/…", "status": "MISSING", "powod": "…"}
  ]
}
```

Struktura katalogu paczki:

```
<BUNDLE-ID>/
├── INDEX.md                 # streszczenie dla człowieka
├── manifest.json            # metadane + SHA-256 + statusy MISSING
├── 01-deliverable/
├── 02-slad-weryfikacji/
├── 03-step-tracker/
└── 04-walidacja/
```

---

## RAPORT KOMPLETNOŚCI (do wiadomości użytkownika)

```
## Paczka audytowa: <BUNDLE-ID>

Artefakty: N/M obecne | K MISSING (lista z powodami)
Integralność: pliki zahashowane SHA-256 w manifest.json
Stawka WYSOKA → wymóg raportu kroków (MOD-STEP-TRACKER): SPEŁNIONY ✅ / BRAK ⛔
Anonimizacja użyta → mapa NIE jest w paczce (przechowuj osobno) ⚠️
Zatwierdzający: do uzupełnienia przez człowieka przed archiwizacją

Archiwizuj w rejestrze AI kancelarii. Paczka = dowód dla audytora,
nie załącznik do pisma procesowego.
```

---

## INTEGRACJA

- **prawny-router-v3:** w trybie PRAWNIK po CP końcowym zaproponuj złożenie paczki
  ("czy przygotować paczkę audytową AI Act art. 12 dla tego deliverable?").
- **MOD-STEP-TRACKER:** raport kroków wchodzi do paczki bez modyfikacji — także
  wtedy, gdy raportuje pominięcia (pominięcia to właśnie treść audytu).
- **WERYFIKACJA-SLAD:** do paczki trafia tabela POZIOMU PEŁNEGO z kolumną
  gradientu (wym.→osiąg.) — wersja sprzed STRIP-VER-GATE.
- **DISCLAIMER.md:** wariant użyty w deliverable jest częścią metadanych.
- **dr-11 / mod-AI-Act-framework:** kwalifikacja czy system podlega obowiązkom
  art. 12 (wysokie ryzyko) — paczkę można składać także dobrowolnie (należyta
  staranność, art. 4 Prawa o adwokaturze / art. 6 u.r.p. — weryfikuj przepis
  wg PRAWO-HARDGATE przed cytowaniem w dokumencie).
