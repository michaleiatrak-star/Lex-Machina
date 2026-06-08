# Widget — Wyszukiwanie Orzeczeń Sądowych v2.1

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
- **Przed wyszukiwaniem** — z danymi Faz 0-A i 0-B; w zakładkach Orzeczenia, Alerty i Raport wstaw komunikat `Trwa wyszukiwanie…`
- **Po wyszukiwaniu** — z kompletnymi danymi wszystkich faz

## Mapowanie alertów → klasy CSS

| Alert                    | Klasa CSS          | Kolor     |
|--------------------------|--------------------|-----------|
| ⚠️ STARE                 | `alert-old`        | żółty     |
| 🔴 SPRZECZNE             | `alert-conflict`   | czerwony  |
| 🔴 ZMIANA PRAWA          | `alert-law`        | czerwony  |
| ℹ️ WYMIAR UE             | `alert-eu`         | niebieski |
| ⛔ BRAK URL              | `alert-nurl`       | szary     |
| 🏛️ ZASADA PRAWNA (6A)   | `alert-zp`         | fioletowy |
| ✅ brak alertów          | `alert-ok`         | zielony   |

## Mapowanie kategorii → etykiety

| Kat. | Etykieta              | Opis                                                      |
|------|-----------------------|-----------------------------------------------------------|
| 1    | Najnowsze             | Orzeczenia w granicach progu dziedzinowego                |
| 2    | Starsze               | Powyżej progu, poniżej 2× progu                          |
| 3A   | Linia dominująca      | Jednolita linia większościowa                             |
| 3B   | Linia mniejszościowa  | Zawsze prezentuj — zakaz ukrywania                       |
| 4    | Wspierające           | Potwierdzają linię główną                                 |
| 5    | UE / TSUE / ETPC      | Materia objęta dyrektywą lub wyrokiem                    |
| 6    | Interpretacje         | Zwykłe uchwały SN, wytyczne, interpretacje                |
| **6A** | **Zasada prawna SN** | **Uchwały z mocą zasady prawnej — PRIORYTET powołania** |
| 7    | Literatura            | Komentarze, glosy (pomocniczo)                            |

## Szablon zakładki Alerty — instrukcja wypełniania

Zakładka Alerty zawiera **jeden blok alert-detail per orzeczenie**, które ma co najmniej jeden aktywny alert.
Orzeczenia bez alertów (alert-ok) nie wymagają bloku.

Struktura bloku alert-detail:
```html
<div class="alert-detail">
  <div class="alert-detail-sig"><!-- DANE: sygnatura, np. II PK 123/22 --></div>
  <ul class="alert-detail-list">
    <!-- Wstaw jeden <li> na każdy aktywny alert tego orzeczenia: -->
    <li class="a-tag alert-old">⚠️ STARE — <span class="mode-laik"><!-- DANE: opis dla laika, np. „Wyrok wydany ponad 3 lata temu — sprawdź czy przepis nie zmienił się." --></span><span class="mode-prawnik"><!-- DANE: opis dla prawnika, np. „Data: 12.03.2020; próg dziedzinowy: 3 lata (prawo pracy); art. 52 KP nowelizowany 2022 r. — weryfikuj aktualność tezy." --></span></li>
    <li class="a-tag alert-conflict">🔴 SPRZECZNE — <span class="mode-laik"><!-- DANE: opis dla laika --></span><span class="mode-prawnik"><!-- DANE: opis dla prawnika z sygnaturą orzeczenia sprzecznego --></span></li>
    <li class="a-tag alert-law">🔴 ZMIANA PRAWA — <span class="mode-laik"><!-- DANE --></span><span class="mode-prawnik"><!-- DANE: przepis + data nowelizacji --></span></li>
    <li class="a-tag alert-eu">ℹ️ WYMIAR UE — <span class="mode-laik"><!-- DANE --></span><span class="mode-prawnik"><!-- DANE: dyrektywa lub sprawa TSUE --></span></li>
    <li class="a-tag alert-zp">🏛️ ZASADA PRAWNA — <span class="mode-laik"><!-- DANE: „To wiążąca zasada Sądu Najwyższego." --></span><span class="mode-prawnik"><!-- DANE: „Uchwała 7 sędziów SN z mocą zasady prawnej (art. 87 § 1 uSN). Wiąże wszystkie składy SN." --></span></li>
  </ul>
</div>
```

Jeśli brak jakichkolwiek alertów: `<p class="empty-msg">Brak alertów dla tej linii orzeczniczej.</p>`

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
    --c-purple: #7c3aed;
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
  .orz-card.zp { border-left: 3px solid var(--c-purple); }
  .orz-header { display: flex; justify-content: space-between;
                align-items: flex-start; gap: 8px; margin-bottom: 6px; }
  .orz-sig { font-weight: 700; font-size: 13px; }
  .kat-badge { font-size: 10px; padding: 2px 8px; border-radius: 10px;
               background: var(--c-surface); border: 1px solid var(--c-border);
               white-space: nowrap; }
  .kat-badge.kat-6a { background: #f3e8ff; border-color: var(--c-purple);
                      color: var(--c-purple); font-weight: 700; }
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
  .alert-zp   { background: #f3e8ff; color: var(--c-purple); font-weight: 600; }
  .orz-link { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  .orz-link a { font-size: 12px; color: var(--c-accent); text-decoration: none; }

  /* Alerty (zakładka) */
  .alert-detail { border: 1px solid var(--c-border); border-radius: 8px;
                  padding: 10px 14px; margin-bottom: 10px; }
  .alert-detail-sig { font-weight: 700; font-size: 13px; margin-bottom: 6px; }
  .alert-detail-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
  .alert-detail-list li { font-size: 12px; padding: 4px 8px; border-radius: 6px; line-height: 1.5; }

  /* Eksport */
  .export-btn { font-size: 12px; padding: 5px 14px; border-radius: 20px;
                border: 1px solid var(--c-border); cursor: pointer;
                background: var(--c-surface); color: var(--c-text);
                margin-top: 12px; }
  .export-btn:hover { background: var(--c-border); }

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
  <div class="tab active" onclick="showTab('ryzyko', this)">Profil ryzyka</div>
  <div class="tab" onclick="showTab('preslanka', this)">Przesłanki</div>
  <div class="tab" onclick="showTab('orzeczenia', this)">Orzeczenia</div>
  <div class="tab" onclick="showTab('alerty', this)">Alerty</div>
  <div class="tab" onclick="showTab('raport', this)">Raport</div>
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
    Instytucja: <!-- DANE: np. ciężkie naruszenie podstawowych obowiązków --> |
    Jurysdykcja: <!-- DANE: PL / UE / zagraniczna -->
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
  <!-- DANE: po wyszukiwaniu — najpierw karty Kat. 6A, potem pozostałe -->
  <!-- Przykład karty Kat. 6A (usuń lub skopiuj według potrzeby): -->
  <div class="orz-card zp">
    <div class="orz-header">
      <span class="orz-sig"><!-- DANE: sygnatura --></span>
      <span class="kat-badge kat-6a">Kat. 6A — Zasada prawna</span>
    </div>
    <div class="orz-sad"><!-- DANE: SN + izba + data --></div>
    <div class="orz-teza mode-laik"><!-- DANE: teza w prostym języku --></div>
    <div class="orz-teza mode-prawnik"><!-- DANE: pełna teza z kwalifikacją + podstawa art. 87 § 1 uSN --></div>
    <div class="orz-alerts">
      <span class="a-tag alert-zp">🏛️ ZASADA PRAWNA</span>
    </div>
    <div class="orz-link">
      <a href="<!-- DANE: URL -->" target="_blank" rel="noopener">🔗 Otwórz oryginał</a>
    </div>
  </div>
  <!-- Przykład karty zwykłej (usuń lub skopiuj według potrzeby): -->
  <div class="orz-card">
    <div class="orz-header">
      <span class="orz-sig"><!-- DANE: pełna sygnatura --></span>
      <span class="kat-badge">Kat. <!-- DANE: 1/2/3A/3B/4/5/6 --></span>
    </div>
    <div class="orz-sad"><!-- DANE: sąd + izba + data --></div>
    <div class="orz-teza mode-laik"><!-- DANE: teza w prostym języku --></div>
    <div class="orz-teza mode-prawnik"><!-- DANE: pełna teza z kwalifikacją prawną --></div>
    <div class="orz-alerts">
      <!-- DANE: wstaw odpowiednie a-tag; usuń niepotrzebne -->
      <span class="a-tag alert-old">⚠️ STARE</span>
      <span class="a-tag alert-conflict">🔴 SPRZECZNE</span>
      <span class="a-tag alert-law">🔴 ZMIANA PRAWA</span>
      <span class="a-tag alert-eu">ℹ️ WYMIAR UE</span>
      <span class="a-tag alert-nurl">⛔ BRAK URL</span>
      <span class="a-tag alert-ok">✅</span>
    </div>
    <div class="orz-link">
      <a href="<!-- DANE: URL -->" target="_blank" rel="noopener">🔗 Otwórz oryginał</a>
    </div>
  </div>
</div>

<!-- ZAKŁADKA: Alerty -->
<div id="tab-alerty" class="panel">
  <!-- DANE: przed wyszukiwaniem wstaw <p class="loading-msg">Trwa wyszukiwanie…</p> -->
  <!-- DANE: po wyszukiwaniu — jeden blok alert-detail na orzeczenie z alertami.
       Orzeczenia bez alertów (✅ ok) — nie wstawiaj bloku.
       Jeśli brak jakichkolwiek alertów: wstaw <p class="empty-msg">Brak alertów...</p> -->
  <div class="alert-detail">
    <div class="alert-detail-sig"><!-- DANE: sygnatura orzeczenia --></div>
    <ul class="alert-detail-list">
      <!-- Wstaw po jednym <li> na każdy aktywny alert, z klasą CSS alertu: -->
      <li class="a-tag alert-old">⚠️ STARE —
        <span class="mode-laik"><!-- DANE: opis dla laika --></span>
        <span class="mode-prawnik"><!-- DANE: opis dla prawnika: data orzeczenia, próg dziedzinowy, nowelizacja jeśli dotyczy --></span>
      </li>
      <li class="a-tag alert-conflict">🔴 SPRZECZNE —
        <span class="mode-laik"><!-- DANE --></span>
        <span class="mode-prawnik"><!-- DANE: sygnatura orzeczenia sprzecznego --></span>
      </li>
      <li class="a-tag alert-law">🔴 ZMIANA PRAWA —
        <span class="mode-laik"><!-- DANE --></span>
        <span class="mode-prawnik"><!-- DANE: przepis + data i zakres nowelizacji --></span>
      </li>
      <li class="a-tag alert-eu">ℹ️ WYMIAR UE —
        <span class="mode-laik"><!-- DANE --></span>
        <span class="mode-prawnik"><!-- DANE: dyrektywa lub sprawa TSUE/ETPC --></span>
      </li>
      <li class="a-tag alert-zp">🏛️ ZASADA PRAWNA —
        <span class="mode-laik">To wiążąca zasada prawna Sądu Najwyższego.</span>
        <span class="mode-prawnik">Uchwała z mocą zasady prawnej (art. 87 § 1 ustawy z 8 XII 2017 r. o SN). Wiąże wszystkie składy SN.</span>
      </li>
    </ul>
  </div>
  <!-- Przycisk eksportu listy orzeczeń -->
  <button class="export-btn" onclick="exportOrzeczenia()">📋 Kopiuj listę sygnatur</button>
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
      <!-- DANE: 1. najpierw Kat. 6A (uchwały z mocą zasady prawnej), potem Kat. 1, 3A, 5 -->
      <li><!-- DANE: sygnatura + dlaczego pierwsze --></li>
    </ol>
    <br>
    <!-- DANE: jeśli jurysdykcja zagraniczna: -->
    <strong style="color:var(--c-muted);font-size:12px;">Jurysdykcja zagraniczna:</strong>
    <span style="font-size:12px;color:var(--c-muted);"><!-- DANE: oznaczenie Tier 4 + portal weryfikacji --></span>
  </div>
  <button class="export-btn" onclick="exportRaport()">📄 Kopiuj raport</button>
</div>

<script>
  function showTab(name, el) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + name).classList.add('active');
    if (el) el.classList.add('active');
  }
  function setMode(mode) {
    document.body.className = mode === 'prawnik' ? 'prawnik' : '';
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
  }
  function exportOrzeczenia() {
    const sigs = [...document.querySelectorAll('.orz-sig')].map(s => s.textContent.trim());
    const sads = [...document.querySelectorAll('.orz-sad')].map(s => s.textContent.trim());
    const text = sigs.map((sig, i) => sig + ' | ' + (sads[i] || '')).join('\n');
    navigator.clipboard.writeText(text).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    });
  }
  function exportRaport() {
    const raport = document.querySelector('#tab-raport').innerText || '';
    navigator.clipboard.writeText(raport).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = raport; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    });
  }
</script>
```
