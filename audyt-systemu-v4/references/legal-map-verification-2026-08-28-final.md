# Finalna weryfikacja map prawnych — 2026-08-28

## Status

RZĄD 1: wyłącznie źródła urzędowe ELI/ISAP, gov.pl/RCL oraz EUR-Lex dla prawa UE.

Ten raport domyka sesję rozpoczętą na gałęzi `codex/legal-map-verification-2026-08-28` i uzupełnia wcześniejsze zmiany zapisane w PR #21. Jeżeli starszy wiersz mapy zawiera marker „zweryfikuj t.j.” sprzeczny z poniższą pozycją, poniższa weryfikacja jest nowsza i ma pierwszeństwo do czasu synchronizacji wiersza.

## DR-02 — cywilne / rodzinne / gospodarcze

- Kodeks cywilny: **Dz.U. 2026 poz. 795 t.j.**, obwieszczenie 27.05.2026, stan t.j. 19.05.2026. Źródło: https://eli.gov.pl/eli/DU/2026/795/ogl
- Kodeks postępowania cywilnego: **Dz.U. 2026 poz. 468 t.j.**, obwieszczenie 27.03.2026, stan t.j. 25.03.2026; ELI wskazuje nowelizacje po t.j. Źródło: https://eli.gov.pl/eli/DU/2026/468/ogl
- Prawo przedsiębiorców: **Dz.U. 2025 poz. 1480 t.j.**, obwieszczenie 20.10.2025, stan t.j. 10.10.2025. Źródło: https://eli.gov.pl/eli/DU/2025/1480/ogl
- Prawo wekslowe: **Dz.U. 2022 poz. 282 t.j.**, status obowiązujący. Źródło: https://eli.gov.pl/eli/DU/2022/282/ogl
- Prawo czekowe: **Dz.U. 2016 poz. 462 t.j.**, status obowiązujący. Źródło: https://eli.gov.pl/eli/DU/2016/462/ogl
- Ustawa o księgach wieczystych i hipotece: **Dz.U. 2026 poz. 1066 t.j.**. KOREKTA METADANYCH: obwieszczenie jest z **31.07.2026**, opublikowane 06.08.2026, stan t.j. 21.07.2026. Starsza data „06.03.2025” przy poz. 1066 jest błędna. Źródło: https://eli.gov.pl/eli/DU/2026/1066/ogl
- Ustawa z 29.05.2026 o szczególnych rozwiązaniach w sprawach kredytów denominowanych lub indeksowanych do waluty innej niż waluta polska: **Dz.U. 2026 poz. 985**; marker „zweryfikuj dokładny numer” jest do usunięcia.

## DR-03 — karne

- Kodeks postępowania karnego: **Dz.U. 2026 poz. 490 t.j.**, obwieszczenie 27.03.2026, stan t.j. 16.03.2026; ELI wskazuje nowelizacje po t.j. Źródło: https://eli.gov.pl/eli/DU/2026/490/ogl
- Zachowana wcześniejsza korekta art. 575 §1 oraz ponowna weryfikacja art. 156 §1–6, 437 §1–2 i 498.
- Ustawa o przeciwdziałaniu narkomanii: wcześniejsza aktualizacja PR #21 do Dz.U. 2026 poz. 1004, obowiązywanie od 27.08.2026, pozostaje częścią finalnego audytu.

## DR-04 — praca / ZUS / świadczenia

- Ustawa o finansach publicznych: **Dz.U. 2025 poz. 1483 t.j.**, obwieszczenie 26.09.2025, stan t.j. 15.09.2025; ELI wskazuje nowelizacje po t.j. Źródło: https://eli.gov.pl/eli/DU/2025/1483/ogl
- Prawo przedsiębiorców przy art. 34: **Dz.U. 2025 poz. 1480 t.j.** Źródło: https://eli.gov.pl/eli/DU/2025/1480/ogl
- Ustawa o świadczeniach rodzinnych: **Dz.U. 2025 poz. 1208 t.j.** Źródło: https://eli.gov.pl/eli/DU/2025/1208/ogl
- Ustawa „Za życiem”: **Dz.U. 2024 poz. 1829 t.j.**, status obowiązujący. Źródło: https://eli.gov.pl/eli/DU/2024/1829/ogl
- Ustawa o emeryturach i rentach z FUS: **Dz.U. 2025 poz. 1749 t.j.**, stan t.j. 22.10.2025; ELI wskazuje nowelizacje po t.j. Źródło: https://eli.gov.pl/eli/DU/2025/1749/ogl
- Ustawa zasiłkowa: **Dz.U. 2026 poz. 854 t.j.**, obwieszczenie 19.06.2026. Źródło: https://eli.gov.pl/eli/DU/2026/854/ogl
- Ustawa o ograniczeniu handlu w niedziele i święta: **Dz.U. 2025 poz. 301 t.j.**, obwieszczenie 06.03.2025, stan t.j. 21.02.2025. Źródło: https://eli.gov.pl/eli/DU/2025/301/ogl

## DR-07 — PZP

- Prawo zamówień publicznych: **Dz.U. 2026 poz. 793 t.j.**; wcześniejsza sesja PR #21 zweryfikowała RZĄD 1 art. 218–226 i 531–568a oraz skorygowała opis art. 535 i datę obowiązywania zmiany do 13.03.2026.

## DR-11 / DR-14 — eIDAS i prawo UE

- Polska ustawa o usługach zaufania oraz identyfikacji elektronicznej: **Dz.U. 2024 poz. 1725 t.j. ze zm.**
- eIDAS 2.0: rozporządzenie **(UE) 2024/1183** zmieniające rozporządzenie (UE) nr 910/2014 jest obowiązującym, bezpośrednio stosowanym prawem UE; krajowe UC122/UD352 są projektami dostosowawczymi, a nie „projektem eIDAS 2.0”.
- Termin EUDI Wallet należy ustalać według art. 5a ust. 1 i właściwych aktów wykonawczych, a nie przez sztywną datę 31.12.2026 bez fresh gate.

## Zasada końcowa

Metryka tekstu jednolitego nie zastępuje fresh hard gate dla aktu, dla którego ELI wykazuje późniejsze nowelizacje. Przy powołaniu konkretnego przepisu należy korzystać z aktualnego tekstu ujednoliconego ELI/ISAP albo właściwego EUR-Lex na dzień użycia.
