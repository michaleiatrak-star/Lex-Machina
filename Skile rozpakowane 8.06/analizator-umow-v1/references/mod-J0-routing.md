# MODUŁ J — ROUTING WEWNĘTRZNY I MASTER CHECKLISTA
## Analizator Umów v1 · Moduł J — Nawigacja

> Ten plik służy do wyboru właściwego modułu tematycznego i finalnej walidacji.
> Dla analizy konkretnego typu umowy — wczytaj odpowiedni moduł poniżej.
> **Uwaga:** numery sekcji J.X poniżej to wewnętrzne etykiety; nazwy plików są rozstrzygające.

---

> ⛔ HARD GATE — moduł routingowy: nie podawaj artykułów z pamięci.
> Każdy moduł docelowy (J1–J7, G, H, I, MA) zawiera własny HARD GATE z konkretnymi źródłami.
> Weryfikacja online obowiązkowa przed podaniem jakiejkolwiek podstawy prawnej.
## J.1 ROUTING WEWNĘTRZNY

| Typ umowy | Sekcja | Plik do wczytania |
|---|---|---|
| Najem mieszkaniowy (lokator–właściciel) | J.2 | `view references/mod-J1-najem.md` |
| Najem komercyjny (biuro, lokal usługowy) | J.3 | `view references/mod-J1-najem.md` |
| Umowa deweloperska / przedwstępna nieruchomości | J.4 | `view references/mod-J2-nieruchomosci.md` |
| Franczyza | J.5 | `view references/mod-J3-dystrybucja.md` |
| Agencyjna | J.6 | `view references/mod-J3-dystrybucja.md` |
| Pożyczka / chwilówka / pożyczka prywatna | J.7 | `view references/mod-J4-finansowanie.md` |
| Leasing operacyjny / finansowy | J.8 | `view references/mod-J4-finansowanie.md` |
| Umowa o dzieło | J.9 | `view references/mod-J5-umowy-wykonawcze.md` |
| Umowa zlecenia | J.10 | `view references/mod-J5-umowy-wykonawcze.md` |
| Ugoda / porozumienie | J.11 | `view references/mod-J5-umowy-wykonawcze.md` |
| Umowy IT: SLA, licencyjna, software development, SaaS | J.12 | `view references/mod-J6-it-konsorcjum.md` |
| Factoring / finansowanie wierzytelności | J.13 | `view references/mod-J4-finansowanie.md` |
| Konsorcjum / joint venture | J.14 | `view references/mod-J6-it-konsorcjum.md` |
| Transakcje M&A: SPA, SHA, LOI, earn-out | J.15 | `view references/mod-MA-transakcje.md` |
| Zamówienia publiczne / PZP / FIDIC | J.16 | `view references/mod-J7-pzp.md` |
| Umowa konsumencka B2C (sprzedaż, OWU, e-commerce, reklamacja, odstąpienie, treść cyfrowa) | J.17 | `view references/mod-J8-b2c.md` |
| Własność intelektualna: przeniesienie praw autorskich, licencja, umowa z twórcą, wydawnicza, IP (utwory nie-software) | J.18 | `view references/mod-J9-ip-prawa-autorskie.md` |
| Ubezpieczenia: OWU/polisa majątkowa lub życiowa poza B2C (mienie, OC, D&O, cargo, UFK/IBIP, grupowe) | J.19 | `view references/mod-J10-ubezpieczenia.md` |
| Routing wielotypowy / niejasny | — | zacznij od tego pliku → tabela J.1 |

---

## MASTER CHECKLISTA — KAŻDA UMOWA (stosuj niezależnie od modułu)

```
NIEZALEŻNIE OD TYPU — sprawdź zawsze:

STRONY I FORMA:
□ Pełna identyfikacja stron (KRS / CEiDG / PESEL / NIP)?
□ Umocowanie do podpisania (pełnomocnik → pełnomocnictwo)?
□ Wymagana forma szczególna (akt notarialny / pisemna / dokumentowa)?

PRZEDMIOT I WYNAGRODZENIE:
□ Jednoznaczny opis przedmiotu (co, ile, jakość, termin)?
□ Wynagrodzenie netto/brutto, waluta, termin płatności?
□ Co jeśli przedmiot zmienia się w trakcie? (aneks / zmiana ceny)

CZAS I WYPOWIEDZENIE:
□ Czas trwania (określony / nieokreślony)?
□ Tryb wypowiedzenia → kto, kiedy, z jakim wyprzedzeniem, z jakim skutkiem?
□ Automatyczne przedłużenie — czy jest? Na jakich warunkach?

ODPOWIEDZIALNOŚĆ:
□ Limit odpowiedzialności — czy jest? Czy uwzględnia winę umyślną?
□ Wyłączenia odpowiedzialności — czy legalne (art. 473 §2 KC)?
□ Kary umowne — symetria, cap, proporcjonalność?
□ Siła wyższa — definicja, procedura notyfikacji?

WŁASNOŚĆ INTELEKTUALNA:
□ Kto nabywa IP? Przeniesienie czy licencja?
□ Pola eksploatacji wskazane? (art. 41 PrAut)
□ Wynagrodzenie za przeniesienie zawarte w cenie?

POUFNOŚĆ:
□ Zakres — co jest informacją poufną?
□ Wyjątki — informacje publiczne, znane wcześniej, organ?
□ Termin — ile lat po zakończeniu?

ROZWIĄZYWANIE SPORÓW:
□ Prawo właściwe wskazane?
□ Sąd właściwy wskazany?
□ Mediacja / arbitraż? (potencjalnie szybciej)

KLAUZULE KOŃCOWE:
□ Klauzula salwatoryjna (nieważność części ≠ całości)?
□ Forma zmian (pisemna pod rygorem nieważności)?
□ Liczba egzemplarzy (co najmniej 2)?
```

---

## MAPA KRZYŻOWA — KIEDY WCZYTAĆ KILKA MODUŁÓW JEDNOCZEŚNIE

| Sytuacja | Moduły do wczytania łącznie |
|---|---|
| B2B IT (kontrakt menedżerski + software) | G (b2b) + J6 (it) |
| Umowa IT z dostępem do danych | J6 + SHARED-RODO |
| Umowa deweloperska z zakazem konkurencji | J2 + I (zakaz-konkurencji) |
| Podwykonawstwo budowlane (GW + Inwestor) | G.3 (b2b) + J7 (PZP jeśli publiczne) |
| SaaS wieloletni z danymi | J6 + SHARED-RODO + SHARED-LIFECYCLE + SHARED-FM |
| Transakcja M&A z zakazem konkurencji | MA + I (zakaz-konkurencji) + SHARED-RYZYKO |
| Umowa o pracę z zakazem konkurencji | H (uop) + I (zakaz-konkurencji) |
| Franczyza wieloletnia | J3 + SHARED-LIFECYCLE + SHARED-FM |
| Umowa B2B z ESG / dużą korporacją | G (b2b) + SHARED-ESG |
| Umowa AI / automatyczne decyzje | J6 + SHARED-AI-ACT + SHARED-RODO |
| Umowa z twórcą + oprogramowanie (gra, aplikacja z grafiką) | J9 (IP nie-software) + J6 (SD-1 software) |
| Umowa B2B / podwykonawcza z przeniesieniem praw autorskich | G (b2b) + J9 (IP) |
| Ubezpieczenie grupowe pracownicze (pracodawca + ubezpieczony konsument) | J10 + J8 (B2C dla ubezpieczonego) |
| Ubezpieczenie inwestycyjne UFK/IBIP dla konsumenta | J10 + J8 + SHARED-RYZYKO |
| Wymóg polisy/ubezpieczenia w umowie B2B lub PZP | J10 + G (b2b) lub J7 (PZP) |

---

*Moduł J / analizator-umow-v1 · Dla zakazu konkurencji → references/zakaz-konkurencji.md*
*Dla B2B → references/b2b-podwykonawcze.md · Dla UoP → references/umowy-o-prace.md*
*Dla M&A → references/mod-MA-transakcje.md · Dla PZP → references/mod-J7-pzp.md*
*Prawo weryfikuj ZAWSZE w ISAP · Parametry (kwoty, stawki) weryfikuj online — zmieniają się!*
