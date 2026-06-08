import React, { Suspense, lazy, memo, useMemo, useState, useCallback } from "react";

function resolveInjected(props = {}) {
  const parseMaybe = (value) => {
    if (!value) return null;
    if (typeof value === "string") {
      try { return JSON.parse(value); } catch { return null; }
    }
    if (typeof value === "object" && !Array.isArray(value)) return value;
    return null;
  };
  const propSources = [props.blueprint, props.data, props.payload, props.chatData, props.input, props.injected];
  for (const source of propSources) {
    const parsed = parseMaybe(source);
    if (parsed) return parsed;
  }
  if (typeof window !== "undefined") {
    const windowSources = [
      window.__INJECTED__,
      window.__CHAT_DATA__,
      window.CLAUDE_BLUEPRINT,
      window.BLUEPRINT_JSON,
      window.__BLUEPRINT__
    ];
    for (const source of windowSources) {
      const parsed = parseMaybe(source);
      if (parsed) return parsed;
    }
    const script = typeof document !== "undefined" ? document.querySelector('script[type="application/json"][data-blueprint]') : null;
    if (script) {
      const parsed = parseMaybe(script.textContent);
      if (parsed) return parsed;
    }
  }
  return null;
}

const cx = {
  wrap:{fontFamily:"var(--font-sans, system-ui, sans-serif)",fontSize:13,color:"var(--color-text-primary)",maxWidth:980},
  card:{background:"var(--color-background-primary)",border:".5px solid var(--color-border-tertiary)",borderRadius:8,padding:"14px 16px",marginBottom:10},
  btn:(a=false)=>({fontSize:12,padding:"7px 12px",borderRadius:6,border:".5px solid var(--color-border-secondary)",background:a?"var(--color-background-secondary)":"transparent",color:"var(--color-text-primary)",cursor:"pointer",fontFamily:"inherit"}),
  tab:(a=false)=>({fontSize:12,padding:"7px 11px",borderRadius:6,border:".5px solid var(--color-border-secondary)",background:a?"var(--color-background-secondary)":"transparent",color:a?"var(--color-text-primary)":"var(--color-text-secondary)",cursor:"pointer",fontFamily:"inherit"}),
  badge:{fontSize:10,padding:"2px 8px",borderRadius:99,border:".5px solid var(--color-border-secondary)",color:"var(--color-text-secondary)",display:"inline-block"},
  h1:{fontSize:18,fontWeight:650,margin:"0 0 4px"},
  sub:{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.55},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10},
  pre:{whiteSpace:"pre-wrap",fontFamily:"var(--font-mono, monospace)",fontSize:12,lineHeight:1.55,background:"var(--color-background-secondary)",border:".5px solid var(--color-border-tertiary)",borderRadius:6,padding:10},
  input:{width:"100%",boxSizing:"border-box",fontSize:13,padding:"8px 10px",borderRadius:6,border:".5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontFamily:"inherit"},
  textarea:{width:"100%",boxSizing:"border-box",minHeight:96,fontSize:13,padding:"8px 10px",borderRadius:6,border:".5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontFamily:"inherit",resize:"vertical"}
};
function asArray(v){ return Array.isArray(v) ? v : []; }
function val(v, d="—"){ return v===0 || v ? String(v) : d; }
function Section({title, children}){ return <section style={cx.card}><div style={{fontWeight:650,marginBottom:8}}>{title}</div>{children}</section>; }
function Empty(){ return <div style={cx.card}><div style={cx.sub}>Brak danych blueprintu. Uruchom skill, aby przygotował gotowy JSON i wstrzyknął go do JSX.</div></div>; }

const Intake = memo(function Intake({bp}){ return <div style={cx.grid}><Section title="Sprawa"><b>{val(bp.rodzaj)}</b><div style={cx.sub}>{val(bp.syg)} · {val(bp.sad)}</div></Section><Section title="Rola klienta"><b>{val(bp.rola)}</b><div style={cx.sub}>Przeciwnik: {val(bp.przeciwnik)}</div></Section><Section title="Etap"><b>{val(bp.etap)}</b><div style={cx.sub}>WPS/kwota: {val(bp.wartosc)}</div></Section></div>; });
const Filters = memo(function Filters({bp}){ return <Section title="11 filtrów analitycznych">{asArray(bp.filters).map((f,i)=><div key={i} style={{padding:"8px 0",borderBottom:".5px solid var(--color-border-tertiary)"}}><b>{i+1}. {val(f.name||f.nazwa)}</b> <span style={cx.badge}>{val(f.status||f.ocena)}</span><div style={cx.sub}>{val(f.result||f.wniosek)}</div></div>)}</Section>; });
const Modules = memo(function Modules({bp}){ return <Section title="Moduły specjalistyczne">{asArray(bp.modules).map((m,i)=><div key={i} style={{padding:"8px 0",borderBottom:".5px solid var(--color-border-tertiary)"}}><b>{val(m.code||m.modul)} — {val(m.title||m.tytul)}</b><div style={cx.sub}>{val(m.result||m.wniosek)}</div></div>)}</Section>; });
const Report = memo(function Report({bp}){ return <><Section title="Executive summary"><div style={cx.sub}>{val(bp.summary)}</div></Section><Section title="Rekomendacje procesowe">{asArray(bp.recommendations).map((r,i)=><p key={i} style={cx.sub}>{i+1}. {val(r.text||r)}</p>)}</Section><Section title="Raport końcowy"><pre style={cx.pre}>{val(bp.finalReport||bp.report,"Brak raportu końcowego.")}</pre></Section></>; });
const panels={intake:lazy(()=>Promise.resolve({default:Intake})),filters:lazy(()=>Promise.resolve({default:Filters})),modules:lazy(()=>Promise.resolve({default:Modules})),report:lazy(()=>Promise.resolve({default:Report}))};
export default function App(props = {}){ const bp=useMemo(()=>resolveInjected(props)||{},[props]); const [tab,setTab]=useState("intake"); const Panel=panels[tab]; const tabs=[["intake","Intake"],["filters","Filtry"],["modules","Moduły"],["report","Raport"]]; return <div style={cx.wrap}><header style={{marginBottom:14}}><div style={cx.badge}>ANALIZA_SADOWA_BLUEPRINT</div><h1 style={cx.h1}>{val(bp.title,"Analiza sądowa v5")}</h1><div style={cx.sub}>{val(bp.notatki,"Renderer gotowego wyniku przygotowanego przez SKILL.md")}</div></header><div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{tabs.map(([k,l])=><button key={k} style={cx.tab(tab===k)} onClick={()=>setTab(k)}>{l}</button>)}</div>{Object.keys(bp).length?<Suspense fallback={<Section title="Ładowanie">Ładowanie panelu…</Section>}><Panel bp={bp}/></Suspense>:<Empty/>}</div> }
