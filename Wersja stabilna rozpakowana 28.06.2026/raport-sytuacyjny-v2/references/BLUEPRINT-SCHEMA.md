# RAPORT_SYTUACYJNY_BLUEPRINT

```json
{
  "tryb":"A|B|C", "przepis":"", "czyn":"", "zagrozenie":"", "data":"", "etap":"",
  "dziedzina":"karne|cywilne|pracownicze|admin|rodzinne|spadkowe|gospodarcze",
  "sygnatura":null, "termin":null,
  "s1rola":"", "s1opis":"", "s2rola":"", "s2opis":"",
  "zdarzenie":"", "skutki":null, "wartosc":0,
  "dowody":[{"typ":"", "opis":"", "poziom":"A|B|C|D"}],
  "p1lbl":"", "p1pct":0, "p1opis":"", "p2lbl":null, "p2pct":0, "p2war":null,
  "pilnosc":"natychmiastowa|wysoka|normalna|niska", "nastepnyKrok":"",
  "skille":[], "brakujace":[]
}
```


---

# Rozszerzenie v2.3-min85

Blueprint raportu sytuacyjnego powinien obsługiwać pola:

```json
{
  "chronologia": [],
  "ustaleniaZeStatusemŹródła": [],
  "mapaRyzyk": [],
  "sprzecznościILuki": [],
  "rekomendacjeProcesowe": [],
  "poziomPewnościRaportu": 0,
  "ograniczeniaRaportu": []
}
```

Renderer może pominąć wizualizację pola, jeżeli UI go jeszcze nie obsługuje, ale SKILL.md musi je zbudować w danych wyjściowych.
