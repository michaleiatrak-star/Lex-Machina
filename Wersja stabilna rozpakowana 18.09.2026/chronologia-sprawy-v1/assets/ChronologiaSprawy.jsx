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

function normalizeEvents(bp){ return asArray(bp.events).map((e,i)=>({...e,id:e.id||`e${i+1}`,date_sort:e.date_sort||e.sort||e.date||"9999-12-31"})).sort((a,b)=>String(a.date_sort).localeCompare(String(b.date_sort))); }
const Timeline = memo(function Timeline({bp}){ const events=normalizeEvents(bp); return <Section title="Oś czasu">{events.map((e,i)=><div key={e.id} style={{display:"grid",gridTemplateColumns:"110px 1fr",gap:12,padding:"10px 0",borderBottom:".5px solid var(--color-border-tertiary)"}}><div><b>{val(e.date)}</b><div style={cx.badge}>{val(e.significance||e.waga)}</div></div><div><b>{val(e.description||e.opis)}</b><div style={cx.sub}>Strona: {val(e.party||e.strona)} · Źródło: {val(e.source||e.zrodlo)}</div>{e.conflict&&<div style={{...cx.sub,color:"#A32D2D"}}>Sprzeczność: {e.conflict}</div>}</div></div>)}</Section>; });
const Conflicts = memo(function Conflicts({bp}){ return <Section title="Sprzeczności dat i wersji">{asArray(bp.conflicts).map((c,i)=><div key={i} style={{padding:"8px 0",borderBottom:".5px solid var(--color-border-tertiary)"}}><b>{val(c.impact||c.waga)}</b><div style={cx.sub}>{val(c.description||c.opis)}</div><div style={cx.sub}>Rekomendacja: {val(c.recommendation||c.rekomendacja)}</div></div>)}</Section>; });
const Gaps = memo(function Gaps({bp}){ return <Section title="Luki czasowe">{asArray(bp.gaps).map((g,i)=><p key={i} style={cx.sub}><b>{val(g.from)} → {val(g.to)}</b> ({val(g.days)} dni): {val(g.note||g.opis)}</p>)}</Section>; });
const panels={timeline:lazy(()=>Promise.resolve({default:Timeline})),conflicts:lazy(()=>Promise.resolve({default:Conflicts})),gaps:lazy(()=>Promise.resolve({default:Gaps}))};
export default function App(props = {}){ const bp=useMemo(()=>resolveInjected(props)||{},[props]); const [tab,setTab]=useState("timeline"); const Panel=panels[tab]; const tabs=[["timeline","Chronologia"],["conflicts","Sprzeczności"],["gaps","Luki"]]; return <div style={cx.wrap}><header style={{marginBottom:14}}><div style={cx.badge}>CHRONOLOGIA_BLUEPRINT</div><h1 style={cx.h1}>{val(bp.title,"Chronologia sprawy")}</h1><div style={cx.sub}>{val(bp.caseRef,"Renderer gotowej osi czasu z SKILL.md")}</div></header><div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>{tabs.map(([k,l])=><button key={k} style={cx.tab(tab===k)} onClick={()=>setTab(k)}>{l}</button>)}</div>{Object.keys(bp).length?<Suspense fallback={<Section title="Ładowanie">Ładowanie panelu…</Section>}><Panel bp={bp}/></Suspense>:<Empty/>}</div> }
