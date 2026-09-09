# F-171 — pomiar osiągalności źródeł prawnych, 2026-09-09

Surowy wynik `scripts/check_domeny_allowlist.py` (T25) uruchomionego bez
argumentów, kanał kodu, host Claude. Materiał dowodowy do §5/§6
`PORTALE-ORZECZNICZE-API.md` i do flag F-157 / F-171.

**Wynik zbiorczy:** 52 sondy, 40 zgodnych ze stanem odniesienia z 2026-09-04
(`F-152-pomiar-domen-2026-09-04.md`), **4 regresje**, 8 pozycji z grupy
`kandydaci` odpowiadających poprawnie.

⛔ Ten plik jest zapisem POMIARU o konkretnej dacie, nie stanem trwałym.
Nie przepisuj tych statusów do tabel w `PORTALE-ORZECZNICZE-API.md` —
dokładnie ten wzorzec („status `⬛ host` przetrwał w tabeli po tym, jak
domeny faktycznie dopisano") był powodem powstania T25.

---

## 1. Regresje — było OK 2026-09-04, nie działa 2026-09-09

| Sonda | Wynik | Kod | Próby |
|---|---|---|---|
| SAOS `/api/search` | NIEOSIĄGALNE | HTTP 502 (warstwa proxy/serwera) | 3/3 |
| SAOS `/api/dump` | NIEOSIĄGALNE | HTTP 502 | 3/3 |
| SAOS `/api/judgments/{id}` | NIEOSIĄGALNE | HTTP 502 | 3/3 |
| `decyzje.uokik.gov.pl` | NIEOSIĄGALNE | HTTP 503 | 3/3 |

**Zakres skutku.** SAOS jest kanałem maszynowym RZĘDU 2A dla orzecznictwa
sądów powszechnych i administracyjnych. Przy 502 na wszystkich trzech
ścieżkach nie ma z niego weryfikacji sygnatur — do czasu powrotu obowiązuje
ścieżka zastępcza z `PORTALE-ORZECZNICZE-API.md` (portale pojedynczych sądów;
`orzeczenia.warszawa.so.gov.pl` odpowiada 200 i ma RSS, więc agregat jest
niedostępny, a nie cała warstwa). `decyzje.uokik.gov.pl` dotyczy decyzji
Prezesa UOKiK; `sudop.uokik.gov.pl` i `rejestr.uokik.gov.pl` odpowiadają 200,
więc awaria jest punktowa, nie obejmuje całego hosta organu.

⚠️ **Czego ten pomiar NIE rozstrzyga.** 502/503 z warstwy proxy bywa skutkiem
kształtu żądania, nie awarii serwisu (PUŁAPKA 1, flagi F-151/F-157).
Sonda używa neutralnego UA i ponowień, ale nie testowała wariantów ścieżki.
Przed orzeczeniem „SAOS wygaszony" powtórz pomiar w innym dniu i sprawdź
§1 `shared/DOSTEP-MASZYNOWY-API.md`. Trzykrotna porażka jednego dnia dowodzi
niedostępności TEGO DNIA, nie trwałej.

Dodatkowo: `decyzje.uokik.gov.pl` w rootcie robi 302 na `uokik.gov.pl`
(poza listą) — PUŁAPKA 2, mierz ścieżkę roboczą, nie root.

## 2. Pozycje ze stanem niezmienionym — wybrane obserwacje

- `bzp.uzp.gov.pl`: CAŁY host niedeterministyczny (~20% 404), potwierdzone
  ponownie. Nie orzekać z jednej próby.
- `websrv.bzp.uzp.gov.pl`: 503 3/3 — SOAP starego BZP wygaszony po migracji.
- `legislacja.rcl.gov.pl`: 503 3/3, także pod UA neutralnym. Brak zamiennika
  dla przebiegu prac RCL.
- `orzeczenia.ms.gov.pl`: sygnatura bota — 200 pod curl, 502 pod UA Chrome.
- `rm.coe.int`: 403; `rdf-przegladarka.ms.gov.pl`: 403.

## 3. Grupa `kandydaci` — odniesienie POZA_LISTA, dziś osiągalne

Osiem hostów odpowiedziało 200 mimo statusu „poza listą" w inwentarzu.
Materiał do F-157 (braki listy dozwolonych po stronie dewelopera):

| Host | Kod | Dlaczego istotny |
|---|---|---|
| `api.dane.gov.pl` | 200 | jedyny host API katalogu danych — `dane.gov.pl` to sama SPA |
| `wl-api.mf.gov.pl` | 200 | biała lista VAT; jedyna maszynowa weryfikacja rachunku |
| `op.europa.eu` | 200 | cel przekierowania z `publications.europa.eu` |
| `www.gov.pl` | 200 | bez tego BIP GIP (interpretacje art. 14b, F-153) nieosiągalny |
| `www.pip.gov.pl` | 200 | cel przekierowania z `pip.gov.pl` |
| `api.stat.gov.pl` (REGON/BIR) | 200 | wymóg klucza i sesji NIEZWERYFIKOWANY |
| `orzeczenia.warszawa.so.gov.pl` | 200 | portal jednego sądu, niezależny od SAOS, ma RSS |
| `rdf-przegladarka.ms.gov.pl` | 403 | sprawozdania finansowe KRS — nadal zablokowane |

⛔ Konsekwencja dla `escalation` w `prawny-router-v3`: wpis o białej liście VAT
jako NIEOSIĄGALNEJ maszynowo opisuje stan listy dozwolonych, a nie stan
serwisu. `wl-api.mf.gov.pl` odpowiada. Rozstrzygnięcie należy do dewelopera
(F-157) — do tego czasu wpis routera zostaje bez zmian, bo z kanału kodu
tego skilla host faktycznie bywa niedostępny.
