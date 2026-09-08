# Moduł — Rejestr źródeł prawa i zarządzanie lifecycle (narzędzie metodyczne)


## Kiedy używać

Każda sprawa, w której trzeba sprawdzić aktualność prawa, Dz.U., tekst jednolity, zmianę po tekście jednolitym, datę wejścia w życie albo stan prawny na dzień zdarzenia.

## Źródła i metryki kontrolne

| Akt | Metryka | Status |
|---|---:|---|
| Rejestr centralny | `shared/LEGAL-REGISTRY.md` | nadrzędny |
| Protokół ISAP | `shared/ISAP-AUDIT-PROTOCOL.md` | obowiązkowy |
| Bramka jakości | `shared/LEGAL-QUALITY-GATE.md` | obowiązkowa |

**Zakaz:** nie cytuj przepisów z tego modułu jako literalnego brzmienia. Ten plik wskazuje akty, tryb, ryzyka i workflow. Brzmienie przepisu pobierz z ISAP na dzień użycia.

## Moduły wspólne wymagane

Przed analizą użyj:

- `shared/ISAP-AUDIT-PROTOCOL.md`
- `shared/LEGAL-REGISTRY.md`
- `shared/LEGAL-LIFECYCLE-MANAGEMENT.md`
- `shared/TEMPORAL-LAW-CHECK.md`
- `shared/LEGAL-QUALITY-GATE.md`
- `shared/RISK-ASSESSMENT.md`
- `shared/FORMAL-CHECK.md` — jeżeli wynikiem ma być pismo.

## Workflow kancelaryjny

1. Rozpoznaj akt prawny.
2. Sprawdź `LEGAL-REGISTRY`.
3. Jeżeli status to `PO-TJ-ZMIANY`, sprawdź ustawę zmieniającą i przepisy przejściowe.
4. Jeżeli status to `WYMAGA-KONTROLI-ISAP`, nie generuj finalnej podstawy prawnej bez aktualnego odczytu.
5. Oznacz stan prawny na konkretną datę.

## Minimalne dane wejściowe

- organ / sąd / regulator,
- etap sprawy,
- data zdarzenia,
- data doręczenia,
- decyzja/pismo/wezwanie,
- żądanie strony,
- termin procesowy/materialny,
- dowody,
- informacja czy występuje pełnomocnik profesjonalny.

## Kontrola temporalna

Ustal osobno:

1. stan prawny w dacie zdarzenia,
2. stan prawny w dacie wszczęcia postępowania,
3. stan prawny w dacie pisma,
4. przepisy przejściowe,
5. wejście w życie nowelizacji po tekście jednolitym.

## Ryzyka

- użycie nieaktualnego Dz.U.,
- użycie przepisu, który jeszcze nie wszedł w życie,
- pominięcie przepisu przejściowego,
- błędna subsumpcja przez pomieszanie stanów prawnych.

## Wynik modułu

Zwróć:

- stan faktyczny,
- właściwy tryb,
- podstawy prawne po weryfikacji ISAP,
- terminy,
- dowody,
- ryzyka formalne,
- strategię,
- projekt pisma tylko po przejściu `LEGAL-QUALITY-GATE`.
