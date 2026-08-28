# Weryfikacja RZĄD 1 — Prawo wekslowe i Prawo czekowe

**Data weryfikacji:** 2026-08-28
**Zakres:** metryki aktów używanych w DR-02
**Źródła:** wyłącznie oficjalne ELI/ISAP.

## Wynik

1. **Prawo wekslowe** — aktualny tekst jednolity: **Dz.U. 2022 poz. 282**.
   - ELI: obwieszczenie Marszałka Sejmu z 21.12.2021 r. w sprawie ogłoszenia jednolitego tekstu ustawy – Prawo wekslowe.
   - ELI oznacza pozycję jako akt **obowiązujący**.
   - Tekst jednolity uwzględnia zmiany ogłoszone przed 14.12.2021 r., w tym ustawę z 11.08.2021 r. (Dz.U. 2021 poz. 1655).

2. **Prawo czekowe** — aktualny tekst jednolity: **Dz.U. 2016 poz. 462**.
   - ELI: obwieszczenie Marszałka Sejmu z 25.03.2016 r. w sprawie ogłoszenia jednolitego tekstu ustawy – Prawo czekowe.
   - ELI oznacza obwieszczenie jako **obowiązujące**; akt bazowy posiada tekst jednolity.

## Konsekwencja dla systemu

Wiersz DR-02:

`Prawo wekslowe (28.04.1936) + Prawo czekowe (28.04.1936)`

ma prawidłowe numery publikacyjne, ale jego znacznik `⚠️ zweryfikuj aktualne t.j.` jest nieaktualny i powinien zostać zastąpiony informacją:

`Dz.U. 2022 poz. 282 t.j. (Prawo wekslowe) + Dz.U. 2016 poz. 462 t.j. (Prawo czekowe) — RZĄD 1 ELI, VER 2026-08-28`.

Analogicznie należy traktować drugi wiersz mapy łączący oba akty z Prawem przedsiębiorców.

## Źródła urzędowe

- ELI, Dz.U. 2022 poz. 282 — Prawo wekslowe: `https://eli.gov.pl/eli/DU/2022/282/ogl`
- ELI, Dz.U. 2016 poz. 462 — Prawo czekowe: `https://eli.gov.pl/eli/DU/2016/462/ogl`

## Status

✅ Metryki obu aktów zweryfikowane w RZĄD 1.
⚠️ Do synchronizacji pozostaje usunięcie starego znacznika `zweryfikuj aktualne t.j.` z `dr-02-prawo-cywilne-rodzinne-gospodarcze/MAPA-AKTOW.md` oraz odpowiadającego HARDGATE w `modules/mod-prawo-wekslowe-czekowe.md`.