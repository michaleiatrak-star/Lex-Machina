# Sprostowanie metodologiczne — raporty TEST1/TEST2/TEST3 (Lex Machina, port Codex vs Claude.ai)

**Data:** 2026-08-23f. **Adresat:** autor/zespół raportów porównawczych
TEST1, TEST2, TEST3. **Kontekst:** trzy raporty oceniały odpowiedzi systemu
prawnego (skille `/mnt/skills/user/`) wobec kryteriów zawierających etykietę
`MEM` i rejestr statusów `VER / MEM / NIEWERYFIKOWANE`.

## Istota sprostowania

System oceniany w raportach **nie posiada i nie może posiadać** etykiety
`MEM` w swoim rejestrze statusów. Reguła `AF-4` w `shared/PRAWO-HARDGATE.md`
(v2.6) wprost zakazuje oznaczania pamięci modelu jakąkolwiek własną etykietą,
z wyraźnym wymienieniem skrótu `MEM` jako zakazanego. Powód reguły: etykieta
sugerująca, że treść pochodzi z ustrukturyzowanej, nazwanej kategorii pamięci
modelu, tworzy pozór metodycznej weryfikacji tam, gdzie żadna weryfikacja
się nie odbyła. Jedyne dopuszczalne oznaczenia treści niezweryfikowanej
online to `⚠️ [NIEWERYFIKOWANE]` — bez dalszego różnicowania powodu.

**Skutek dla trzech ocenionych pozycji, które prosimy o przeliczenie:**

| Pozycja w raporcie | Ocena wystawiona | Co faktycznie zaobserwowano |
|---|---|---|
| TEST2, kryterium K2 (CL-01) | FAIL — „łączono status `MEM` z `NIEWERYFIKOWANE`" | Zgodność z kryterium wymagałaby naruszenia AF-4. Kryterium mierzy zgodność ze specyfikacją, której system celowo nie implementuje |
| TEST1 | „Codex nie użył etykiety `MEM`" odnotowane jako przewaga portu porównawczego | To zachowanie WYMAGANE przez AF-4, nie przewaga jednego portu nad drugim — oba porty powinny je spełniać |
| TEST1 | „Claude oznaczył art. 111 k.c. etykietą `MEM`" odnotowane jako błąd | Zachowanie wymuszone treścią promptu testowego, który wprowadził tę etykietę jako oczekiwaną kategorię odpowiedzi |
| TEST3, CX-02 | „Etykieta `MEM` przypisana blokowi pytań do świadków" odnotowane jako błąd | Ten sam mechanizm — etykieta nie istnieje w systemie niezależnie od promptu, więc nie może być „poprawnie" ani „niepoprawnie" przypisana |

## Rozróżnienie ważne dla dalszej współpracy

Nie twierdzimy, że propozycja rejestru `VER/MEM/NIEWERYFIKOWANE` (dokument
LM-K2-01) była nieuprawniona czy zmyślona — istnieje jako propozycja robocza.
Rozróżnienie, które prosimy uwzględnić: **grep nieobecności reguły w plikach
systemu dowodzi, że reguła nie jest wdrożona — nie że nigdy nie istniała
jako propozycja.** System rozważył tę propozycję i świadomie ją odrzucił
na rzecz istniejącej czterostopniowej hierarchii (`✅ [VER]` /
`🟨 [KOTWICA-URZĘDOWA]` / `⚠️ [NIEWERYFIKOWANE]` / `⬛ [DO UZUPEŁNIENIA]`,
`shared/PRAWO-HARDGATE.md`), rozszerzonej o poziom TREŚĆ/FRAGMENT
w `shared/WERYFIKACJA-SLAD.md`.

## Prośba do przyszłych rund testowych

Aby wynik testu mierzył zachowanie systemu, a nie zgodność z zewnętrznie
narzuconą specyfikacją: prompt testowy nie powinien wprowadzać własnego
rejestru etykiet statusów ani wymieniać z góry kryteriów oceny w treści
polecenia dla modelu. Jedyne źródło etykiet dopuszczalnych to sekcja
statusów w `shared/PRAWO-HARDGATE.md` i rozszerzenie w
`shared/WERYFIKACJA-SLAD.md` — obydwa pliki są udostępnialne do wglądu
przed zaprojektowaniem kolejnej rundy testowej.

---
*Powiązane wpisy: `AUDIT-JOURNAL.md`, sesje AUDYT-2026-08-23d (blok
SPROSTOWANIE), AUDYT-2026-08-23e (sekcja 1, USTALENIE NADRZĘDNE),
AUDYT-2026-08-23f. Flaga: F-116 (część 3/3 — niniejszy dokument zamyka
tę część flagi).*
