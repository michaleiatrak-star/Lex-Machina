# HARMONOGRAM-CRON.md
## SYNC-DZU-AUTOMATYCZNY.md — przykłady harmonogramu (do adaptacji przez developera)

## Opcja A — cron na własnym serwerze/VM portalu

```cron
# Codziennie o 05:00, logi do pliku, raport trafia do katalogu współdzielonego
# z zespołem odpowiedzialnym za sesje audytowe.
0 5 * * * /usr/bin/python3 /opt/portal/sync-dzu/sync_dzu_eli.py \
  --mapa /opt/portal/skills/audyt-systemu-v4/references/mapa_dzu_aktualna.md \
  --since $(cat /opt/portal/sync-dzu/.last_sync_date) \
  --out /opt/portal/raporty/raport_roznic_$(date +\%Y-\%m-\%d).md \
  && date +\%Y-\%m-\%d > /opt/portal/sync-dzu/.last_sync_date
```

## Opcja B — GitHub Actions (jeśli mapa_dzu jest w repo developera)

```yaml
name: sync-dzu-eli
on:
  schedule:
    - cron: "0 5 * * *"   # codziennie 05:00 UTC
  workflow_dispatch: {}    # + możliwość ręcznego uruchomienia

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Uruchom detekcję różnic
        run: |
          python skills/audyt-systemu-v4/scripts/sync_dzu_eli.py \
            --mapa skills/audyt-systemu-v4/references/mapa_dzu_aktualna.md \
            --since "$(cat .last_sync_date)" \
            --out raporty/raport_roznic_$(date +%Y-%m-%d).md
      - name: Zapisz nową datę synchronizacji
        run: date +%Y-%m-%d > .last_sync_date
      - name: Commit raportu
        run: |
          git config user.name "sync-dzu-bot"
          git config user.email "bot@example.invalid"
          git add raporty/ .last_sync_date
          git commit -m "sync-dzu: raport automatyczny $(date +%Y-%m-%d)" || echo "brak zmian"
          git push
```

## Częstotliwość

- **Codziennie** jest sensownym domyślnym interwałem — Dz.U./M.P. publikują
  nowe pozycje praktycznie codziennie w dni robocze, a raport jest tani
  (jedno zapytanie do publicznego API, brak kosztu tokenowego LLM).
- Nie ma potrzeby częstszego odpytywania — żadna sesja audytowa i tak nie
  będzie reagować szybciej niż raz dziennie w praktyce.

## Uwaga bezpieczeństwa

Ten harmonogram nie wymaga żadnych sekretów/kluczy API (Sejm ELI API jest
publiczne, bez autoryzacji na dzień pisania tego skilla) — do zweryfikowania
przez developera, czy nadal tak jest w momencie wdrożenia.
