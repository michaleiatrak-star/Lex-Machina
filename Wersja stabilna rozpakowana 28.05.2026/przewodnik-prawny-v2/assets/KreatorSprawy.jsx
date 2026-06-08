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

const Intake = memo(function Intake({bp,onSet}){ const steps=asArray(bp.steps); return <Section title="Kreator krokowy">{steps.map((s,i)=><div key={i} style={{padding:"10px 0",borderBottom:".5px solid var(--color-border-tertiary)"}}><b>{i+1}. {val(s.title)}</b><div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>{asArray(s.options).map((o,j)=><button key={j} style={cx.btn(false)} onClick={()=>onSet(i,o.label||o)}>{val(o.icon,"")} {val(o.label||o)}</button>)}</div></div>)}</Section>; });
const Result = memo(function Result({bp,answers,opis,setOpis}){ return <><Section title="Opis sprawy"><textarea style={cx.textarea} value={opis} onChange={e=>setOpis(e.target.value)} placeholder="Uzupełnij krótki opis sprawy — ten tekst zostanie użyty w promptach skilla." /></Section><Section title="Podsumowanie wyborów"><pre style={cx.pre}>{JSON.stringify({answers, opis},null,2)}</pre></Section><Section title="Następny prompt dla skilla"><pre style={cx.pre}>{val(bp.nextPrompt,"SKILL.md powinien na podstawie tych wyborów wskazać właściwy moduł, pytania doprecyzowujące i następny krok.")}</pre></Section></>; });
const panels={intake:lazy(()=>Promise.resolve({default:Intake})),result:lazy(()=>Promise.resolve({default:Result}))};
export default function App(props = {}){ const bp=useMemo(()=>resolveInjected(props)||{},[props]); const [tab,setTab]=useState("intake"); const [answers,setAnswers]=useState({}); const [opis,setOpis]=useState(bp.description||""); const setAns=useCallback((i,v)=>setAnswers(a=>({...a,[i+1]:v})),[]); const Panel=panels[tab]; return <div style={cx.wrap}><header style={{marginBottom:14}}><div style={cx.badge}>KREATOR_SPRAWY_BLUEPRINT</div><h1 style={cx.h1}>{val(bp.title,"Przewodnik prawny — kreator sprawy")}</h1><div style={cx.sub}>JSX zbiera wybory, ale decyzje i treść porad prowadzi SKILL.md.</div></header><div style={{display:"flex",gap:6,marginBottom:12}}><button style={cx.tab(tab==="intake")} onClick={()=>setTab("intake")}>Kroki</button><button style={cx.tab(tab==="result")} onClick={()=>setTab("result")}>Wynik</button></div>{Object.keys(bp).length?<Suspense fallback={<Section title="Ładowanie">Ładowanie…</Section>}><Panel bp={bp} answers={answers} onSet={setAns} opis={opis} setOpis={setOpis}/></Suspense>:<Empty/>}</div> }
