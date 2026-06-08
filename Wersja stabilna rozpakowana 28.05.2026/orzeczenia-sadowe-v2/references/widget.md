# Widget — Wyszukiwanie Orzeczeń Sądowych v2

Plik zawiera kompletny kod HTML widgetu do wklejenia w `show_widget`.

## Instrukcja użycia

```
show_widget(
  title="orzeczenia_sadowe",
  loading_messages=["Przeszukuję portale sądowe...", "Weryfikuję sygnatury...", "Oceniam linię orzeczniczą..."],
  widget_code=<kod poniżej z podstawionymi danymi>
)
```

Wywołujesz widget **dwukrotnie**:
- **Przed wyszukiwaniem** — z danymi Faz 0-A i 0-B; w zakładkach Orzeczenia i Raport wstaw komunikat `Trwa wyszukiwanie…`
- **Po wyszukiwaniu** — z kompletnymi danymi wszystkich faz

## Mapowanie alertów → klasy CSS

| Alert              | Klasa CSS        | Kolor     |
|--------------------|------------------|-----------|
| ⚠️ STARE           | `alert-old`      | żółty     |
| 🔴 SPRZECZNE       | `alert-conflict` | czerwony  |
| 🔴 ZMIANA PRAWA    | `alert-law`      | czerwony  |
| ℹ️ WYMIAR UE       | `alert-eu`       | niebieski |
| ⛔ BRAK URL        | `alert-nurl`     | szary     |
| ✅ brak alertów    | `alert-ok`       | zielony   |

## Mapowanie kategorii → etykiety

| Kat. | Etykieta              | Opis                                    |
|------|-----------------------|-----------------------------------------|
| 1    | Najnowsze             | Orzeczenia z ostatnich 2 lat            |
| 2    | Starsze               | Orzeczenia 2–5 lat                      |
| 3A   | Linia dominująca      | Jednolita linia większościowa           |
| 3B   | Linia mniejszościowa  | Zawsze prezentuj — zakaz ukrywania      |
| 4    | Wspierające           | Potwierdzają linię główną               |
| 5    | UE / TSUE             | Materia objęta dyrektywą lub wyrokiem   |
| 6    | Interpretacje         | Uchwały, wytyczne, interpretacje SN     |
| 7    | Literatura            | Komentarze, glosy (pomocniczo)          |

## Kod widgetu HTML

Wklej poniższy kod jako `widget_code`. Wypełnij miejsca oznaczone `<!-- DANE: ... -->`.

```html
<style>
  :root {
    --c-bg: var(--color-bg-primary, #fff);
    --c-surface: var(--color-bg-secondary, #f8f9fa);
    --c-border: var(--color-border-primary, #dee2e6);
    --c-text: var(--color-text-primary, #212529);
    --c-muted: var(--color-text-secondary, #6c757d);
    --c-accent: var(--color-accent-primary, #0d6efd);
    --c-green: #198754; --c-red: #dc3545;
    --c-yellow: #ffc107; --c-blue: #0dcaf0;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; font-size: 14px;
         color: var(--c-text); background: var(--c-bg); }

  .header { padding: 14px 16px; border-bottom: 1px solid var(--c-border);
            display: flex; justify-content: space-between; align-items: center; }
  .header h2 { font-size: 15px; font-weight: 700; }
  .mode-toggle { display: flex; gap: 4px; }
  .mode-btn { padding: 4px 12px; border-radius: 20px; border: 1px solid var(--c-border);
              cursor: pointer; font-size: 12px; background: var(--c-surface); }
  .mode-btn.active { background: var(--c-accent); color: #fff; border-color: var(--c-accent); }

  .tabs { display: flex; border-bottom: 1px solid var(--c-border); overflow-x: auto; }
  .tab { padding: 9px 14px; cursor: pointer; white-space: nowrap; font-size: 13px;
         border-bottom: 2px solid transparent; color: var(--c-muted); }
  .tab.active { color: var(--c-accent); border-bottom-color: var(--c-accent); font-weight: 600; }

  .panel { display: none; padding: 14px 16px; }
  .panel.active { display: block; }

  /* Profil ryzyka */
  .alert-box { border-radius: 8px; padding: 10px 14px; margin-bottom: 10px;
               border-left: 4px solid; }
  .alert-box.high  { background: #fff5f5; border-color: var(--c-red); }
  .alert-box.mid   { background: #fffbf0; border-color: var(--c-yellow); }
  .alert-box.low   { background: #f0fff4; border-color: var(--c-green); }
  .alert-label { font-size: 11px; font-weight: 700; text-transform: uppercase;
                 letter-spacing: .5px; margin-bottom: 4px; }
  .alert-text { font-size: 13px; line-height: 1.5; }
  .mode-laik { } .mode-prawnik { display: none; }
  body.prawnik .mode-laik { display: none; }
  body.prawnik .mode-prawnik { display: block; }

  /* Przesłanki */
  .preslanka { margin-bottom: 12px; }
  .preslanka-header { display: flex; justify-content: space-between;
                      font-size: 12px; margin-bottom: 4px; }
  .bar-track { height: 8px; background: var(--c-border); border-radius: 4px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; transition: width .4s; }
  .bar-fill.ok   { background: var(--c-green); }
  .bar-fill.warn { background: var(--c-yellow); }
  .bar-fill.gap  { background: var(--c-red); }

  /* Orzeczenia */
  .orz-card { border: 1px solid var(--c-border); border-radius: 8px;
               padding: 12px 14px; margin-bottom: 10px; }
  .orz-header { display: flex; justify-content: space-between;
                align-items: flex-start; gap: 8px; margin-bottom: 6px; }
  .orz-sig { font-weight: 700; font-size: 13px; }
  .kat-badge { font-size: 10px; padding: 2px 8px; border-radius: 10px;
               background: var(--c-surface); border: 1px solid var(--c-border);
               white-space: nowrap; }
  .orz-sad { font-size: 12px; color: var(--c-muted); margin-bottom: 4px; }
  .orz-teza { font-size: 13px; line-height: 1.5; margin-bottom: 8px; }
  .orz-alerts { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; }
  .a-tag { font-size: 11px; padding: 2px 8px; border-radius: 10px; }
  .alert-old  { background: #fffbf0; color: #856404; }
  .alert-conflict { background: #fff5f5; color: var(--c-red); }
  .alert-law  { background: #fff5f5; color: var(--c-red); }
  .alert-eu   { background: #e7f5ff; color: #0c5460; }
  .alert-nurl { background: var(--c-surface); color: var(--c-muted); }
  .alert-ok   { background: #f0fff4; color: var(--c-green); }
  .orz-link a { font-size: 12px; color: var(--c-accent); text-decoration: none; }

  /* Raport */
  .wskaznik { margin-bottom: 16px; }
  .wskaznik-title { font-weight: 600; font-size: 13px; margin-bottom: 8px; }
  .rekomendacja { background: var(--c-surface); border-radius: 8px;
                  padding: 10px 14px; font-size: 13px; line-height: 1.6; }

  .loading-msg { color: var(--c-muted); font-style: italic; text-align: center;
                 padding: 24px; font-size: 13px; }
  .empty-msg { color: var(--c-muted); font-style: italic; padding: 12px 0; font-size: 13px; }
</style>

<div class="header">
  <h2>⚖️ <!-- DANE: tytuł sprawy, np. "Rozwiązanie umowy bez wypowiedzenia — art. 52 KP" --></h2>
  <div class="mode-toggle">
    <button class="mode-btn active" onclick="setMode('laik')">LAIK</button>
    <button class="mode-btn" onclick="setMode('prawnik')">PRAWNIK</button>
  </div>
</div>

<div class="tabs">
  <div class="tab active" onclick="showTab('ryzyko')">Profil ryzyka</div>
  <div class="tab" onclick="showTab('preslanka')">Przesłanki</div>
  <div class="tab" onclick="showTab('orzeczenia')">Orzeczenia</div>
  <div class="tab" onclick="showTab('alerty')">Alerty</div>
  <div class="tab" onclick="showTab('raport')">Raport</div>
</div>

<!-- ZAKŁADKA: Profil ryzyka -->
<div id="tab-ryzyko" class="panel active">
  <!-- DANE: wstaw tyle bloków alert-box ile alertów wstępnych, zmień klasę na high/mid/low -->
  <div class="alert-box high">
    <div class="alert-label">Alert wysoki</div>
    <div class="alert-text mode-laik"><!-- DANE: treść dla laika --></div>
    <div class="alert-text mode-prawnik"><!-- DANE: treść dla prawnika z przepisem i terminem --></div>
  </div>
  <div class="alert-box mid">
    <div class="alert-label">Alert średni</div>
    <div class="alert-text mode-laik"><!-- DANE: treść dla laika --></div>
    <div class="alert-text mode-prawnik"><!-- DANE: treść dla prawnika --></div>
  </div>
</div>

<!-- ZAKŁADKA: Przesłanki -->
<div id="tab-preslanka" class="panel">
  <p style="font-size:12px;color:var(--c-muted);margin-bottom:12px;">
    Przepis: <!-- DANE: np. art. 52 §1 pkt 1 KP --> |
    Instytucja: <!-- DANE: np. ciężkie naruszenie podstawowych obowiązków -->
  </p>
  <!-- DANE: wstaw tyle bloków preslanka ile przesłanek; width% i klasa (ok/warn/gap) -->
  <div class="preslanka">
    <div class="preslanka-header">
      <span>P1: <!-- DANE: treść przesłanki --> (ciężar: <!-- DANE: strona -->)</span>
      <span><!-- DANE: 0–100 -->%</span>
    </div>
    <div class="bar-track"><div class="bar-fill ok" style="width:<!-- DANE -->%"></div></div>
  </div>
  <div class="preslanka">
    <div class="preslanka-header">
      <span>P2: <!-- DANE --> (ciężar: <!-- DANE -->)</span>
      <span><!-- DANE -->%</span>
    </div>
    <div class="bar-track"><div class="bar-fill warn" style="width:<!-- DANE -->%"></div></div>
  </div>
</div>

<!-- ZAKŁADKA: Orzeczenia -->
<div id="tab-orzeczenia" class="panel">
  <!-- DANE: przed wyszukiwaniem wstaw <p class="loading-msg">Trwa wyszukiwanie…</p> -->
  <!-- DANE: po wyszukiwaniu wstaw tyle bloków orz-card ile orzeczeń -->
  <div class="orz-card">
    <div class="orz-header">
      <span class="orz-sig"><!-- DANE: pełna sygnatura, np. II PK 123/22 --></span>
      <span class="kat-badge">Kat. <!-- DANE: 1/2/3A/3B/4/5/6 --></span>
    </div>
    <div class="orz-sad"><!-- DANE: pełna nazwa sądu + izba + data, np. SN, Izba Pracy, 15 marca 2023 --></div>
    <div class="orz-teza mode-laik"><!-- DANE: teza w prostym języku --></div>
    <div class="orz-teza mode-prawnik"><!-- DANE: pełna teza z kwalifikacją prawną --></div>
    <div class="orz-alerts">
      <!-- DANE: wstaw odpowiednie a-tag z klasą; usuń niepotrzebne -->
      <span class="a-tag alert-old">⚠️ STARE</span>
      <span class="a-tag alert-conflict">🔴 SPRZECZNE</span>
      <span class="a-tag alert-law">🔴 ZMIANA PRAWA</span>
      <span class="a-tag alert-eu">ℹ️ WYMIAR UE</span>
      <span class="a-tag alert-nurl">⛔ BRAK URL</span>
      <span class="a-tag alert-ok">✅</span>
    </div>
    <div class="orz-link">
      <a href="<!-- DANE: URL oryginału -->" target="_blank" rel="noopener">
        🔗 Otwórz oryginał w nowym oknie
      </a>
    </div>
  </div>
</div>

<!-- ZAKŁADKA: Alerty -->
<div id="tab-alerty" class="panel">
  <!-- DANE: przed wyszukiwaniem wstaw <p class="loading-msg">Trwa wyszukiwanie…</p> -->
  <!-- DANE: po wyszukiwaniu wstaw wyjaśnienia alertów per orzeczenie -->
  <div class="empty-msg"><!-- DANE: np. "Brak alertów dla tej linii orzeczniczej." --></div>
</div>

<!-- ZAKŁADKA: Raport -->
<div id="tab-raport" class="panel">
  <!-- DANE: przed wyszukiwaniem wstaw <p class="loading-msg">Trwa wyszukiwanie…</p> -->
  <div class="wskaznik">
    <div class="wskaznik-title">Wskaźnik pokrycia przesłanek</div>
    <!-- DANE: skopiuj preslanka-bloki z zakładki Przesłanki z ostatecznymi wartościami -->
  </div>
  <div class="rekomendacja">
    <strong>Ocena linii:</strong>
    <span class="mode-laik"><!-- DANE: opis dla laika --></span>
    <span class="mode-prawnik"><!-- DANE: opis procesowy dla prawnika --></span>
    <br><br>
    <strong>Kolejność powołania w piśmie:</strong>
    <ol style="padding-left:18px;margin-top:6px;font-size:13px;">
      <!-- DANE: po 1 orzeczeniu na punkt, w kolejności od najsilniejszego -->
      <li><!-- DANE: sygnatura + dlaczego pierwsze --></li>
    </ol>
  </div>
</div>

<script>
  function showTab(name) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + name).classList.add('active');
    event.target.classList.add('active');
  }
  function setMode(mode) {
    document.body.className = mode === 'prawnik' ? 'prawnik' : '';
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
  }
</script>
```
