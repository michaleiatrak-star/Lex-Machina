# WIDGET-MENU — Interaktywne menu wyboru elementów audytu

## Cel
Widget React renderowany przez `show_widget` — pozwala użytkownikowi wybrać jeden lub więcej elementów audytu przed jego uruchomieniem. Eliminuje potrzebę przepisywania poleceń tekstowych.

---

## Kiedy renderować

Renderuj widget gdy:
- Użytkownik wywołuje audyt bez precyzowania zakresu: *"przeprowadź audyt"*, *"audytuj system"*
- Użytkownik pyta *"co możesz sprawdzić"* / *"jakie masz opcje audytu"*
- Użytkownik chce audyt częściowy ale nie wie jak go nazwać

**Nie renderuj** gdy użytkownik podał już konkretny tryb: *"audytuj analizator-umow"*, *"sprawdź description"*.

---

## Kod widgetu

```jsx
import { useState } from "react";

const AUDIT_ITEMS = [
  {
    id: "inventory",
    group: "Podstawowe",
    label: "📋 Inwentaryzacja systemu",
    desc: "Lista wszystkich skilli, rozmiary, status vs snapshot",
    phase: "FAZA 1"
  },
  {
    id: "paths",
    group: "Zależności",
    label: "🔗 Spójność ścieżek",
    desc: "Weryfikacja czy view/load wskazują na istniejące pliki",
    phase: "FAZA 2A"
  },
  {
    id: "versions",
    group: "Zależności",
    label: "🔄 Wersje cross-referencji",
    desc: "Sprawdzenie czy skille nie odwołują się do starych wersji",
    phase: "FAZA 2B"
  },
  {
    id: "description",
    group: "Jakość",
    label: "📏 Długość description (limit 1024)",
    desc: "Walidacja czy description nie przekracza limitu technicznego",
    phase: "FAZA 2C / MOD-DESCRIPTION"
  },
  {
    id: "interlinie",
    group: "Czystość kodu",
    label: "↕️ Zbędne interlinie",
    desc: "Wykrycie i usunięcie wielokrotnych pustych linii",
    phase: "MOD-INTERLINIE"
  },
  {
    id: "wstawki",
    group: "Czystość kodu",
    label: "🗑️ Wstawki opisowe",
    desc: "Usunięcie tautologicznych wstawek narracyjnych bez wartości operacyjnej",
    phase: "MOD-WSTAWKI"
  },
  {
    id: "dzu",
    group: "Prawo",
    label: "📖 Mapa Dz.U.",
    desc: "Weryfikacja nowych t.j. i aktualizacja statusów aktów prawnych",
    phase: "FAZA 3"
  },
  {
    id: "antihalucynacje",
    group: "Prawo",
    label: "🛡️ Testy antyhalucynacyjne",
    desc: "Brak hardkodowanych Dz.U. bez źródła + PRAWO-HARDGATE",
    phase: "FAZA 4"
  },
  {
    id: "scoring",
    group: "Raport",
    label: "🏆 Scoring skilli",
    desc: "Ocena 0–10 dla każdego skilla wg kryteriów jakości",
    phase: "FAZA 5"
  },
  {
    id: "raport",
    group: "Raport",
    label: "📄 Raport audytu",
    desc: "Generowanie raportu wg szablonu AUDIT-JOURNAL",
    phase: "FAZA 6"
  },
  {
    id: "references",
    group: "Raport",
    label: "💾 Aktualizacja references",
    desc: "Zapis do AUDIT-JOURNAL.md, mapa Dz.U., SKILLS-MAP-AND-FIXES",
    phase: "FAZA 7"
  }
];

const GROUPS = [...new Set(AUDIT_ITEMS.map(i => i.group))];

const PRESETS = [
  { label: "Pełny audyt", ids: AUDIT_ITEMS.map(i => i.id) },
  { label: "Tylko czystość", ids: ["interlinie", "wstawki", "description"] },
  { label: "Tylko zależności", ids: ["inventory", "paths", "versions"] },
  { label: "Tylko prawo", ids: ["dzu", "antihalucynacje"] },
  { label: "Raport i zapis", ids: ["scoring", "raport", "references"] }
];

export default function AuditMenu() {
  const [selected, setSelected] = useState(new Set());
  const [sent, setSent] = useState(false);

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const applyPreset = (ids) => setSelected(new Set(ids));

  const handleStart = () => {
    if (selected.size === 0) return;
    const labels = AUDIT_ITEMS
      .filter(i => selected.has(i.id))
      .map(i => i.label.replace(/^[^\s]+ /, ""));
    const msg = `Uruchom audyt dla następujących elementów:\n${labels.map((l, i) => `${i+1}. ${l}`).join("\n")}`;
    if (window.sendPrompt) {
      window.sendPrompt(msg);
      setSent(true);
    }
  };

  if (sent) return (
    <div style={{padding:"2rem",textAlign:"center",fontFamily:"system-ui"}}>
      <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>✅</div>
      <p style={{color:"#374151",fontWeight:600}}>Audyt uruchomiony dla {selected.size} elementów</p>
    </div>
  );

  return (
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:680,margin:"0 auto",padding:"1.25rem"}}>
      <h2 style={{margin:"0 0 0.25rem",fontSize:"1.1rem",color:"#111827",fontWeight:700}}>
        🔍 Wybierz elementy audytu
      </h2>
      <p style={{margin:"0 0 1rem",fontSize:"0.8rem",color:"#6B7280"}}>
        Możesz wybrać dowolną kombinację lub skorzystać z presetu.
      </p>

      {/* Presety */}
      <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"1.25rem"}}>
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => applyPreset(p.ids)}
            style={{padding:"0.3rem 0.75rem",fontSize:"0.75rem",borderRadius:999,
              border:"1.5px solid #D1D5DB",background:"#F9FAFB",cursor:"pointer",
              color:"#374151",fontWeight:500,transition:"all 0.15s"}}
            onMouseOver={e=>e.target.style.borderColor="#6366F1"}
            onMouseOut={e=>e.target.style.borderColor="#D1D5DB"}>
            {p.label}
          </button>
        ))}
        <button onClick={() => setSelected(new Set())}
          style={{padding:"0.3rem 0.75rem",fontSize:"0.75rem",borderRadius:999,
            border:"1.5px solid #FCA5A5",background:"#FEF2F2",cursor:"pointer",
            color:"#DC2626",fontWeight:500}}>
          Wyczyść
        </button>
      </div>

      {/* Grupy */}
      {GROUPS.map(group => (
        <div key={group} style={{marginBottom:"1rem"}}>
          <div style={{fontSize:"0.7rem",fontWeight:700,color:"#9CA3AF",
            textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.4rem"}}>
            {group}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.35rem"}}>
            {AUDIT_ITEMS.filter(i => i.group === group).map(item => {
              const active = selected.has(item.id);
              return (
                <div key={item.id} onClick={() => toggle(item.id)}
                  style={{display:"flex",alignItems:"flex-start",gap:"0.75rem",
                    padding:"0.6rem 0.85rem",borderRadius:8,cursor:"pointer",
                    border:`1.5px solid ${active ? "#6366F1" : "#E5E7EB"}`,
                    background: active ? "#EEF2FF" : "#FAFAFA",
                    transition:"all 0.15s"}}>
                  <div style={{width:18,height:18,borderRadius:4,flexShrink:0,
                    border:`2px solid ${active ? "#6366F1" : "#D1D5DB"}`,
                    background: active ? "#6366F1" : "white",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    marginTop:1}}>
                    {active && <span style={{color:"white",fontSize:12,lineHeight:1}}>✓</span>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"0.85rem",fontWeight:600,
                      color: active ? "#4338CA" : "#1F2937"}}>
                      {item.label}
                    </div>
                    <div style={{fontSize:"0.75rem",color:"#6B7280",marginTop:2}}>
                      {item.desc}
                      <span style={{marginLeft:"0.4rem",fontSize:"0.7rem",
                        color:"#9CA3AF",fontStyle:"italic"}}>[{item.phase}]</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{marginTop:"1.25rem",display:"flex",alignItems:"center",
        justifyContent:"space-between",paddingTop:"1rem",
        borderTop:"1px solid #E5E7EB"}}>
        <span style={{fontSize:"0.8rem",color:"#6B7280"}}>
          {selected.size === 0 ? "Nic nie wybrano" :
           `Wybrano: ${selected.size} element${selected.size>1?"y/ów":""}`}
        </span>
        <button onClick={handleStart} disabled={selected.size===0}
          style={{padding:"0.5rem 1.25rem",borderRadius:8,fontWeight:600,
            fontSize:"0.85rem",cursor:selected.size===0?"not-allowed":"pointer",
            border:"none",background:selected.size===0?"#E5E7EB":"#6366F1",
            color:selected.size===0?"#9CA3AF":"white",transition:"all 0.2s"}}>
          ▶ Uruchom audyt
        </button>
      </div>
    </div>
  );
}
```

---

## Integracja z SKILL.md

W sekcji `## TRYBY WYWOŁANIA` dodaj:

```
### TRYB INTERAKTYWNY (menu wyboru)
Wywołanie: "przeprowadź audyt" / "audytuj system" (bez precyzowania zakresu)
→ Załaduj WIDGET-MENU.md → renderuj widget → czekaj na wybór użytkownika
→ Po otrzymaniu wyboru: uruchom tylko wskazane fazy/moduły
```

Wywołanie widgetu w kodzie:
```
view /mnt/skills/user/audyt-systemu-v4/widgets/WIDGET-MENU.md
→ skopiuj kod JSX → show_widget(...)
```
