# przyklad-adapter-normalizujacy.md
## mcp-zrodla-prawa-v1/scripts — ilustracja, NIE gotowy serwer produkcyjny

> ⚠️ To jest przykład koncepcyjny (kilkanaście linii), pokazujący jak owinąć
> istniejący serwer MCP (np. connector Sejm ELI) cienką warstwą normalizującą
> jego natywną odpowiedź do `shared/SCHEMAT-ODPOWIEDZI-MCP.md`. To NIE jest
> gotowy do wdrożenia serwer produkcyjny — nie było testowane względem żadnego
> realnego API w tym środowisku (sandbox audytowy nie ma dostępu sieciowego do
> domen rządowych .gov.pl). Developer musi dostosować do konkretnego, wybranego
> connectora z `shared/KONEKTORY-REKOMENDOWANE.md` i przetestować end-to-end.

```javascript
// normalizuj-eli.js — przykład adaptera dla connectora Sejm ELI (Dziennik Ustaw)
// Zakłada, że connector MCP zwraca coś w rodzaju: { pozycje: [...] }

function normalizujOdpowiedzELI(rawResponse, queryTerm) {
  const pozycje = rawResponse?.pozycje ?? [];

  if (pozycje.length === 0) {
    return { status: "NOT_FOUND", query_type: "akt_prawny", source: "sejm-eli" };
  }
  if (pozycje.length > 1) {
    return {
      status: "AMBIGUOUS",
      query_type: "akt_prawny",
      source: "sejm-eli",
      kandydaci: pozycje.map(p => p.identyfikator),
    };
  }

  const p = pozycje[0];
  return {
    status: "FOUND",
    query_type: "akt_prawny",
    source: "sejm-eli",
    result: {
      identyfikator: p.identyfikator,           // np. "Dz.U. 2025 poz. 1071"
      tytul_lub_nazwa: p.tytul,
      status_obowiazywania: p.uchylony ? "uchylony" : "obowiazuje",
      data_publikacji_lub_wyroku: p.dataOgloszenia,
      url_zrodlowy: p.url,
    },
    retrieved_at: new Date().toISOString(),
    confidence: "deterministic",
  };
}

module.exports = { normalizujOdpowiedzELI };
```

## Co developer musi zrobić, żeby to zadziałało naprawdę

1. Wybrać konkretny, utrzymywany connector MCP z `shared/KONEKTORY-REKOMENDOWANE.md`
   (lub dowolny inny spełniający te same kryteria).
2. Sprawdzić natywny format odpowiedzi tego connectora (może się różnić od
   założeń w przykładzie powyżej) i dopasować funkcję normalizującą.
3. Podłączyć connector do środowiska, w którym działa portal (Claude Desktop /
   Claude Code / własna integracja API) — sam Skill nie instaluje ani nie
   uruchamia serwerów MCP.
4. Przetestować wszystkie 4 ścieżki (FOUND / NOT_FOUND / AMBIGUOUS / ERROR) na
   realnych zapytaniach przed przejściem na produkcję.
5. Dodać wynik testów jako wpis w `audyt-systemu-v4/references/AUDIT-JOURNAL.md`
   przy najbliższej sesji audytowej (zamyka flagę integracyjną — patrz
   WARN-OTWARTE.md, flaga dot. testów MCP).
