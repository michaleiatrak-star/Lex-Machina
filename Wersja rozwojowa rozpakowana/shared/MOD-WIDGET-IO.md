# MOD-WIDGET-IO — Obligatoryjny pasek Import / Export widgetów analitycznych

> **Wersja:** 1.0 (2026-06-23)
> **Typ:** moduł shared — JEDYNE ŹRÓDŁO PRAWDY dla IO widgetów
> **Wywołanie:** `view /mnt/skills/user/shared/MOD-WIDGET-IO.md`
>   przed każdym `show_widget` w skillach analitycznych

---

## 1. ZASADA OGÓLNA

Każdy widget analityczny MUSI zawierać pasek IO (import / export) jako
**obligatoryjny element** interfejsu — widoczny bez przewijania, w nagłówku
lub bezpośrednio pod nagłówkiem widgetu.

```
⛔ ZAKAZ generowania widgetu analitycznego bez paska IO.
⛔ ZAKAZ umieszczania IO wyłącznie na końcu strony / w stopce.
✅ IO musi być dostępne od razu po otwarciu widgetu.
```

---

## 2. MATRYCA WYMAGAŃ PER SKILL

| Skill | Export JSON | Export MD | Export CSV | Export PDF/druk | Import JSON |
|---|:---:|:---:|:---:|:---:|:---:|
| `analizator-dowodow-v3` | ✅ OBL | ✅ OBL | ✅ OBL | — | ✅ OBL |
| `analiza-sadowa-v6` | ✅ OBL | ✅ OBL | — | ✅ OBL | ✅ OBL |
| `analizator-przepisow-v2` | ✅ OBL | ✅ OBL | — | — | ✅ OBL |
| `orzeczenia-sadowe-v2` | ✅ OBL | ✅ OBL | — | — | — |
| `chronologia-sprawy-v1` | ✅ OBL | ✅ OBL | — | — | ✅ OBL |
| `raport-sytuacyjny-v2` | ✅ OBL | — | — | ✅ OBL | ✅ OBL |
| `raport-klienta-v1` | — | ✅ OBL | — | ✅ OBL | — |

> OBL = obligatoryjny w danym typie narzędzia
> — = niewymagany (nie pasuje do charakteru narzędzia)

---

## 3. STANDARD HTML PASKA IO

Wklej poniższy blok jako **pierwszą sekcję** wewnątrz `<body>` widgetu
(po ewentualnym nagłówku z nazwą sprawy, przed zakładkami):

```html
<!-- ═══ MOD-WIDGET-IO v1.0 — PASEK IMPORT/EXPORT ═══ -->
<div class="io-bar" id="io-bar">
  <!-- EXPORT — renderuj przyciski wg matrycy §2 -->
  <div class="io-group">
    <span class="io-label">Eksport</span>
    <!-- JSON (gdy w matrycy ✅) -->
    <button class="io-btn io-json" onclick="ioExportJSON()" title="Eksportuj stan widgetu do pliku JSON — do reimportu w innej sesji">
      💾 JSON
    </button>
    <!-- MD (gdy w matrycy ✅) -->
    <button class="io-btn io-md" onclick="ioExportMD()" title="Eksportuj raport jako Markdown">
      📄 MD
    </button>
    <!-- CSV (gdy w matrycy ✅) -->
    <button class="io-btn io-csv" onclick="ioExportCSV()" title="Eksportuj dane do arkusza">
      📊 CSV
    </button>
    <!-- PDF (gdy w matrycy ✅) -->
    <button class="io-btn io-pdf" onclick="window.print()" title="Drukuj / zapisz jako PDF">
      🖨️ PDF
    </button>
  </div>
  <!-- IMPORT — renderuj tylko gdy w matrycy ✅ -->
  <div class="io-group">
    <span class="io-label">Import</span>
    <label class="io-btn io-import" title="Wczytaj poprzednio zapisany plik JSON — przywraca stan widgetu">
      📂 Wczytaj JSON
      <input type="file" accept=".json" style="display:none" onchange="ioImportJSON(event)">
    </label>
  </div>
  <!-- STATUS IMPORTU -->
  <div class="io-status" id="io-status" style="display:none"></div>
</div>
<!-- ═══ koniec MOD-WIDGET-IO ═══ -->
```

---

## 4. STYLE CSS PASKA IO

Dodaj do sekcji `<style>` widgetu:

```css
/* MOD-WIDGET-IO v1.0 */
.io-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 8px 14px;
  background: var(--color-surface, #f5f5f5);
  border-bottom: 1px solid var(--color-border, #ddd);
  border-radius: 8px 8px 0 0;
  font-size: 12px;
}
.io-group {
  display: flex;
  align-items: center;
  gap: 6px;
}
.io-group + .io-group {
  border-left: 1px solid var(--color-border, #ccc);
  padding-left: 10px;
}
.io-label {
  color: var(--color-text-secondary, #666);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .04em;
  font-size: 10px;
  margin-right: 2px;
}
.io-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid var(--color-border, #ccc);
  border-radius: 4px;
  background: var(--color-bg, #fff);
  color: var(--color-text, #333);
  font-size: 12px;
  cursor: pointer;
  transition: background .15s;
}
.io-btn:hover { background: var(--color-accent-light, #e8f0fe); }
.io-import { cursor: pointer; }
.io-status {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--color-success-bg, #e6f4ea);
  color: var(--color-success, #188038);
}
.io-status.error {
  background: var(--color-error-bg, #fce8e6);
  color: var(--color-error, #c5221f);
}
```

---

## 5. FUNKCJE JS — WZORZEC

Dostosuj poniższy wzorzec do schematu danych konkretnego widgetu.
Kluczowe wymaganie: `ioGetState()` i `ioSetState()` muszą operować
na kompletnym stanie widgetu (wszystkie tablice, metadane).

```javascript
// ── MOD-WIDGET-IO v1.0 ──────────────────────────────────────

// Eksport pomocniczy — pobierz blob
function _ioDL(content, filename, mime) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = Object.assign(document.createElement('a'),
    { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 500);
}

// Status info
function _ioStatus(msg, isError) {
  const el = document.getElementById('io-status');
  if (!el) return;
  el.textContent = msg;
  el.className = 'io-status' + (isError ? ' error' : '');
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3000);
}

// ── EKSPORT JSON ──────────────────────────────────────────────
function ioExportJSON() {
  try {
    const state = ioGetState();           // zdefiniuj w skill-widgecie
    const payload = {
      _meta: {
        skill: IO_SKILL_ID,               // np. 'analiza-sadowa-v6'
        version: IO_SKILL_VERSION,        // np. '6.0'
        exported_at: new Date().toISOString(),
        case_id: IO_CASE_ID || 'brak'
      },
      state
    };
    _ioDL(
      JSON.stringify(payload, null, 2),
      `${IO_SKILL_ID}_${(IO_CASE_ID||'').replace(/\//g,'-')}_${new Date().toISOString().slice(0,10)}.json`,
      'application/json'
    );
    _ioStatus('✅ Zapisano JSON');
  } catch(e) {
    _ioStatus('❌ Błąd eksportu: ' + e.message, true);
  }
}

// ── EKSPORT MD ────────────────────────────────────────────────
function ioExportMD() {
  try {
    const md = ioGetMarkdown();           // zdefiniuj w skill-widgecie
    _ioDL(
      md,
      `${IO_SKILL_ID}_${(IO_CASE_ID||'').replace(/\//g,'-')}_${new Date().toISOString().slice(0,10)}.md`,
      'text/markdown;charset=utf-8'
    );
    _ioStatus('✅ Zapisano Markdown');
  } catch(e) {
    _ioStatus('❌ Błąd eksportu MD: ' + e.message, true);
  }
}

// ── EKSPORT CSV (jeśli dotyczy) ───────────────────────────────
function ioExportCSV() {
  try {
    const csv = ioGetCSV();              // zdefiniuj w skill-widgecie
    _ioDL(
      csv,
      `${IO_SKILL_ID}_${(IO_CASE_ID||'').replace(/\//g,'-')}_${new Date().toISOString().slice(0,10)}.csv`,
      'text/csv;charset=utf-8'
    );
    _ioStatus('✅ Zapisano CSV');
  } catch(e) {
    _ioStatus('❌ Błąd eksportu CSV: ' + e.message, true);
  }
}

// ── IMPORT JSON ───────────────────────────────────────────────
function ioImportJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const payload = JSON.parse(e.target.result);
      // walidacja minimalnej struktury
      if (!payload._meta || !payload.state) {
        _ioStatus('❌ Nieprawidłowy format pliku JSON', true);
        return;
      }
      if (payload._meta.skill && payload._meta.skill !== IO_SKILL_ID) {
        // ostrzeżenie, ale nie blokada — pozwól na import cross-skill
        _ioStatus(`⚠️ Plik z innego narzędzia (${payload._meta.skill}) — ładuję`, false);
      }
      ioSetState(payload.state);          // zdefiniuj w skill-widgecie
      _ioStatus(`✅ Wczytano: ${file.name} (${payload._meta.exported_at ? payload._meta.exported_at.slice(0,10) : '?'})`);
    } catch(err) {
      _ioStatus('❌ Błąd parsowania JSON: ' + err.message, true);
    }
  };
  reader.readAsText(file);
  // reset input żeby ten sam plik można wczytać ponownie
  event.target.value = '';
}

// ── STAŁE — ustaw per widget ──────────────────────────────────
// const IO_SKILL_ID      = 'analiza-sadowa-v6';
// const IO_SKILL_VERSION = '6.0';
// const IO_CASE_ID       = CASE_SYG; // sygnatura sprawy z danych widgetu

// ── WYMAGANE IMPLEMENTACJE w każdym widgecie ──────────────────
// function ioGetState()    { return { /* wszystkie tablice i metadane */ }; }
// function ioSetState(s)   { /* odtwórz UI z obiektu state */ }
// function ioGetMarkdown() { return '# Raport\n...'; }
// function ioGetCSV()      { return 'col1,col2\nval1,val2'; } // tylko gdy CSV w matrycy
```

---

## 6. REGUŁY INTEGRACJI — obowiązki skill-developera

```
IO-1: Pasek IO renderowany ZAWSZE — nie pod warunkiem, bezwarunkowo.
IO-2: Przyciski aktywne wg matrycy §2 — pozostałe pominięte (nie wyszarzone).
IO-3: ioGetState() MUSI zawierać 100% danych potrzebnych do odtworzenia widgetu.
IO-4: ioSetState(s) MUSI odświeżać UI w całości — bez partial load.
IO-5: Nazwa pliku eksportu: {skill_id}_{case_id}_{data_iso}.{ext}
IO-6: _meta.skill w JSON umożliwia identyfikację źródła przy reimporcie.
IO-7: Import cross-skill (z innego narzędzia) dozwolony z ostrzeżeniem ⚠️,
      nie blokowany — dane mogą być częściowe, widget renderuje co może.
IO-8: Status (✅/❌/⚠️) wyświetla się przez 3 sekundy i znika automatycznie.
```

---

## 7. TRIGGER WYWOŁANIA

```
WYWOŁAJ ten moduł (view /mnt/skills/user/shared/MOD-WIDGET-IO.md):
  → ZANIM wygenerujesz kod HTML widgetu analitycznego
  → Skopiuj pasek IO (§3), style (§4), funkcje JS (§5) do widgetu
  → Zaimplementuj ioGetState / ioSetState / ioGetMarkdown per dane widgetu
  → Ustaw stałe IO_SKILL_ID, IO_SKILL_VERSION, IO_CASE_ID

⛔ NIE generuj widgetu bez wykonania powyższych kroków.
```
