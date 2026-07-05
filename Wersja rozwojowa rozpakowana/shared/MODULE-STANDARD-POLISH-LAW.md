# MODULE-STANDARD-POLISH-LAW — standard modułu prawa polskiego

## Cel
Każdy moduł prawa polskiego ma działać jak moduły wzorcowe `mod-A-prawo-pracy.md` i `mod-N-karne.md`: nie jako opis dziedziny, lecz jako praktyczny workflow kancelaryjny.

## Zakaz podstawowy — ⛔ HARD GATE

> ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA Z PAMIĘCI
> Aktywny globalnie we wszystkich modułach prawa polskiego. Bez wyjątków.
> Szczegółowa procedura: view /mnt/skills/user/shared/PRAWO-HARDGATE.md

Nie wolno cytować ani parafrazować aktualnego brzmienia przepisu z pamięci modelu. Przed podaniem przepisu, terminu ustawowego, progu kwotowego, sankcji, właściwości organu lub Dz.U. uruchom kontrolę:

1. `shared/PRAWO-HARDGATE.md` (procedura weryfikacji — zawsze pierwsze),
2. `shared/ISAP-AUDIT-PROTOCOL.md`,
3. `shared/ISAP-METRYKI-AKTOW.md`,
4. `shared/TEMPORAL-LAW-CHECK.md`,
5. `shared/LEGAL-LIFECYCLE-MANAGEMENT.md`.

Jeżeli nie ma dostępu do ISAP albo metryka nie została potwierdzona, oznacz element jako `WYMAGA WERYFIKACJI ISAP`.

## Minimalna struktura modułu
Każdy moduł prawa polskiego musi zawierać albo bezpośrednio, albo przez import tego standardu:

1. Zakres spraw.
2. Zasady absolutne.
3. Kluczowe akty prawne z metrykami ISAP albo odesłaniem do rejestru.
4. Intake.
5. Mapę proceduralną.
6. Warunki skuteczności pisma/środka.
7. Matrycę dowodową.
8. Typowe zarzuty i kontrzarzuty.
9. Ryzyka procesowe.
10. Strategię działania.
11. Eskalację do sądu/NSA/SN/TSUE/ETPC, jeśli właściwe.
12. Quality gate.
13. Powiązania z innymi skillami.

## Format odpowiedzi modułu
Każdy moduł ma generować odpowiedź w kolejności:

```text
1. Fakty ustalone
2. Fakty brakujące
3. Tryb / procedura
4. Podstawy prawne — wyłącznie po kontroli ISAP
5. Dowody i ciężar dowodu
6. Ryzyka
7. Strategia
8. Następne czynności
9. Braki formalne / terminy / opłaty
```

## Kontrola porównawcza z modułem wzorcowym
Jeżeli moduł nie posiada poziomu szczegółowości analogicznego do prawa pracy albo karnego, należy automatycznie zastosować `STANDARDOWE UZUPEŁNIENIE MODUŁU` z końca właściwego pliku modułu.
