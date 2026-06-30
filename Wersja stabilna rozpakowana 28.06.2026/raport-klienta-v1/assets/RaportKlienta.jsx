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

const Summary = memo(function Summary({bp}){ const a=bp.assessment||{}; return <><Section title="Status sprawy"><div style={cx.sub}>{val(bp.status)}</div></Section><Section title="Ocena dla klienta"><b>{val(a.label)}</b><div style={cx.sub}>{val(a.text)}</div></Section>{bp.exec_summary&&<Section title="Executive summary"><div style={cx.sub}>{bp.exec_summary}</div></Section>}</>; });
const Timeline = memo(function Timeline({bp}){ return <Section title="Harmonogram">{asArray(bp.timeline).map((t,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"120px 1fr 100px",gap:10,padding:"8px 0",borderBottom:".5px solid var(--color-border-tertiary)"}}><b>{val(t.data||t.date)}</b><span>{val(t.etap||t.title)}</span><span style={cx.badge}>{val(t.status)}</span></div>)}</Section>; });
const Actions = memo(function Actions({bp}){ const items=asArray(bp.steps_ind||bp.actions_biz||bp.actions); return <Section title="Co dalej">{items.map((a,i)=><p key={i} style={cx.sub}>{i+1}. {val(a.text||a.dzialanie||a)} {a.deadline||a.termin ? <b> — {a.deadline||a.termin}</b> : null}</p>)}</Section>; });
const Risk = memo(function Risk({bp}){ return <><Section title="Predykcja / warianty">{bp.prediction?.pct!=null?<div style={{fontSize:28,fontWeight:700}}>{bp.prediction.pct}%</div>:null}<div style={cx.sub}>{val(bp.prediction?.desc_ind||bp.prediction?.desc_biz)}</div></Section>{bp.risk_table&&<Section title="Tabela wariantów">{asArray(bp.risk_table).map((r,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",gap:10,padding:"7px 0",borderBottom:".5px solid var(--color-border-tertiary)"}}><span>{val(r.wariant)}</span><span>{val(r.kwota)}</span><span style={cx.badge}>{val(r.pct)}</span></div>)}</Section>}</>; });
const panels={summary:lazy(()=>Promise.resolve({default:Summary})),timeline:lazy(()=>Promise.resolve({default:Timeline})),actions:lazy(()=>Promise.resolve({default:Actions})),risk:lazy(()=>Promise.resolve({default:Risk}))};
export default function App(props = {}){ const bp=useMemo(()=>resolveInjected(props)||{},[props]); const [tab,setTab]=useState("summary"); const Panel=panels[tab]; const tabs=[["summary","Raport"],["timeline","Harmonogram"],["actions","Co dalej"],["risk","Ryzyka"]]; return <div style={cx.wrap}><header style={{marginBottom:14}}><div style={cx.badge}>RAPORT_KLIENTA_BLUEPRINT · {val(bp.profile,"IND/BIZ")}</div><h1 style={cx.h1}>{val(bp.sprawa||bp.title,"Raport dla klienta")}</h1><div style={cx.sub}>Klient: {val(bp.klient)} · Prawnik: {val(bp.prawnik)}</div></header><div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{tabs.map(([k,l])=><button key={k} style={cx.tab(tab===k)} onClick={()=>setTab(k)}>{l}</button>)}</div>{Object.keys(bp).length?<Suspense fallback={<Section title="Ładowanie">Ładowanie panelu…</Section>}><Panel bp={bp}/></Suspense>:<Empty/>}</div> }
