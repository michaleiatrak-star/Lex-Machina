import { memo, useCallback, useEffect, useMemo, useState } from "react";

/*
WITNESS ENGINE v2-min90 — SELF-CONTAINED JSX
- No imports from local component subfolders
- No portal rendering
- No external window rendering
- Inline render only
- Default system policy: text-first; this visual component is on explicit request only
*/

export const renderMode = "on_request_only";
export const defaultMode = "text";

const WITNESS_TYPES = [
  { id: "direct", label: "świadek bezpośredni", strategy: "krótkie pytania faktograficzne; kotwiczenie w czasie, miejscu i dokumentach", risk: "luki pamięci lub nadinterpretacja obserwacji" },
  { id: "indirect", label: "świadek pośredni", strategy: "ustalić źródło wiedzy i oddzielić relację od własnych obserwacji", risk: "zeznania ze słyszenia, niska moc dowodowa" },
  { id: "interested", label: "świadek zainteresowany", strategy: "ujawnić interes, następnie konfrontować z dokumentami", risk: "stronniczość" },
  { id: "hostile", label: "świadek wrogi", strategy: "pytania zamknięte, kontrola tempa, impeachment przez sprzeczności", risk: "eskalacja i konflikt z sądem" },
  { id: "employer_loyal", label: "lojalny wobec pracodawcy", strategy: "wykazać zależność organizacyjną i porównać zeznania z dokumentami", risk: "lojalnościowa wersja zdarzeń" },
  { id: "expert_like", label: "specjalista/techniczny", strategy: "oddzielić fakty od ocen specjalistycznych; doprecyzować podstawy wiedzy", risk: "pozorna eksperckość poza zakresem sprawy" },
  { id: "uncertain", label: "niepewny", strategy: "nie przeciążać, stosować pytania chronologiczne i neutralne", risk: "podatność na sugestię" },
  { id: "evasive", label: "unikający", strategy: "sekwencja pytań zamkniętych; powrót do pytania; dokument jako kotwica", risk: "brak konkretów" },
  { id: "emotional", label: "emocjonalny", strategy: "uspokoić tempo, skrócić pytania, oddzielić emocje od faktów", risk: "utrata wiarygodności przed formalistycznym sądem" },
  { id: "prepared", label: "przygotowany", strategy: "testować spontaniczność detalami i chronologią", risk: "wyuczona narracja" },
  { id: "documentary", label: "dokumentowy", strategy: "wiązać zeznania z konkretnymi dokumentami, datami i autorstwem", risk: "brak wiedzy własnej poza dokumentem" },
  { id: "memory", label: "pamięciowy", strategy: "chronologia, punkty kotwiczące, kontrola luk", risk: "zniekształcenia pamięci" }
];

const JUDGE_TYPES = [
  { id: "formalist", label: "formalistyczny", style: "krótko, precyzyjnie, zgodnie z tezą dowodową", risk: "ucięcie pytań narracyjnych lub irrelewantnych" },
  { id: "evidence_focused", label: "dowodowy", style: "każde pytanie powiązać z dokumentem lub faktem", risk: "niska tolerancja dla ogólnej narracji" },
  { id: "pragmatic", label: "pragmatyczny", style: "od razu do faktów decydujących", risk: "pominięcie tła, jeśli nie jest konieczne" },
  { id: "active", label: "aktywny", style: "krótkie bloki pytań, gotowość do zmiany kolejności", risk: "przejęcie kontroli przez sąd" },
  { id: "passive", label: "pasywny", style: "pełna kontrola struktury przez stronę", risk: "chaos, jeśli pytania nie są uporządkowane" },
  { id: "skeptical", label: "sceptyczny", style: "ostrożne twierdzenia, mocne kotwiczenie źródłowe", risk: "wysoki próg wiarygodności" },
  { id: "settlement_oriented", label: "ugodowy", style: "unikać teatralizacji, akcentować fakty pozwalające rozstrzygnąć spór", risk: "nacisk na kompromis zamiast pełnej ekspozycji" },
  { id: "literal", label: "literalny", style: "trzymać się literalnej treści dokumentów i przepisów", risk: "słabsza recepcja argumentów celowościowych" },
  { id: "anti_emotional", label: "antyemocjonalny", style: "emocje tylko jako skutek, nie jako oś pytań", risk: "negatywna reakcja na dramatyzację" },
  { id: "detail_oriented", label: "szczegółowy", style: "mikrochronologia, daty, osoby, miejsca, dokumenty", risk: "wychwycenie niespójności w detalach" }
];

const DEFAULT_BLUEPRINT = {
  schemaVersion: "2.90",
  mode: "trener",
  caseContext: "Blueprint nie został jeszcze przekazany.",
  keyFact: "",
  documents: [],
  witness: { typeId: "", label: "", role: "", function: "", personality: "", risk: "", strategy: "" },
  judge: { typeId: "", label: "", function: "", personality: "" },
  stages: [],
  finalTemplates: { courtReadyQuestions: [], closingNotes: [], doNotAsk: [] },
  warnings: [],
  judgeInterventions: []
};

const s = {
  wrap: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 13, maxWidth: "100%", width: "100%", boxSizing: "border-box" },
  header: { padding: "1rem 0", borderBottom: "1px solid #ddd", marginBottom: "1rem" },
  h1: { fontSize: 17, fontWeight: 700, margin: 0 },
  sub: { fontSize: 12, opacity: 0.72, marginTop: 4, lineHeight: 1.5 },
  nav: { display: "flex", gap: 6, flexWrap: "wrap", margin: "1rem 0" },
  navBtn: active => ({ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #bbb", background: active ? "#eee" : "transparent", cursor: "pointer", fontFamily: "inherit" }),
  card: { border: "1px solid #ddd", borderRadius: 8, padding: "0.9rem 1.1rem", marginBottom: "0.75rem", boxSizing: "border-box" },
  textarea: { width: "100%", minHeight: 160, resize: "vertical", fontSize: 12, padding: "8px 10px", borderRadius: 6, border: "1px solid #bbb", fontFamily: "monospace", boxSizing: "border-box" },
  btn: () => ({ fontSize: 12, padding: "6px 14px", borderRadius: 6, border: "1px solid #bbb", background: "#eee", cursor: "pointer", fontFamily: "inherit" }),
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 10 },
  metric: { border: "1px solid #ddd", borderRadius: 8, padding: "0.75rem 0.9rem" },
  muted: { fontSize: 12, opacity: 0.72, lineHeight: 1.55 },
  error: { color: "#A32D2D", borderLeft: "3px solid #A32D2D", borderRadius: 6, padding: "0.65rem 0.9rem", fontSize: 12, marginTop: 8 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
  th: { textAlign: "left", borderBottom: "1px solid #bbb", padding: "6px 5px" },
  td: { borderBottom: "1px solid #e5e5e5", padding: "6px 5px", verticalAlign: "top" },
  pill: { display: "inline-block", padding: "2px 7px", borderRadius: 999, border: "1px solid #bbb", fontSize: 11, opacity: 0.8 }
};

function parseMaybe(value) {
  if (!value) return null;
  if (typeof value === "string") { try { return JSON.parse(value); } catch { return null; } }
  if (typeof value === "object" && !Array.isArray(value)) return value;
  return null;
}

function safeBlueprintFromWindow(props = {}) {
  for (const source of [props.blueprint, props.data, props.payload, props.chatData, props.input]) {
    const parsed = parseMaybe(source);
    if (parsed) return parsed;
  }
  if (typeof window === "undefined") return null;
  for (const source of [
    window.WITNESS_TRAINING_BLUEPRINT,
    window.PRZESLUCHANIE_SWIADKOW_BLUEPRINT,
    window.__INJECTED__,
    window.__CHAT_DATA__,
    window.CLAUDE_BLUEPRINT
  ]) {
    const parsed = parseMaybe(source);
    if (parsed) return parsed;
  }
  return null;
}

function asArray(value) { return Array.isArray(value) ? value : []; }

function normaliseBlueprint(parsed = {}) {
  return {
    ...DEFAULT_BLUEPRINT,
    ...parsed,
    witness: { ...DEFAULT_BLUEPRINT.witness, ...(parsed.witness || {}) },
    judge: { ...DEFAULT_BLUEPRINT.judge, ...(parsed.judge || {}) },
    finalTemplates: { ...DEFAULT_BLUEPRINT.finalTemplates, ...(parsed.finalTemplates || {}) },
    documents: asArray(parsed.documents || parsed.dokumenty),
    stages: asArray(parsed.stages || parsed.etapy),
    warnings: asArray(parsed.warnings || parsed.ostrzezenia),
    judgeInterventions: asArray(parsed.judgeInterventions || parsed.interwencjeSedziego)
  };
}

function findById(list, id) { return list.find(x => x.id === id) || null; }

function validateBlueprint(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "Blueprint musi być obiektem JSON.";
  const stages = parsed.stages || parsed.etapy;
  if (stages && !Array.isArray(stages)) return "Pole stages/etapy musi być tablicą.";
  return "";
}

const Summary = memo(function Summary({ blueprint }) {
  const wt = findById(WITNESS_TYPES, blueprint.witness?.typeId);
  const jt = findById(JUDGE_TYPES, blueprint.judge?.typeId);
  return (
    <div style={s.grid}>
      <div style={s.metric}><strong>Tryb</strong><div style={s.muted}>{blueprint.mode || "tekstowy"}</div></div>
      <div style={s.metric}><strong>Świadek</strong><div style={s.muted}>{blueprint.witness?.label || wt?.label || "—"}<br />{wt?.strategy || blueprint.witness?.function || blueprint.witness?.role || ""}</div></div>
      <div style={s.metric}><strong>Sędzia</strong><div style={s.muted}>{blueprint.judge?.label || jt?.label || "—"}<br />{jt?.style || blueprint.judge?.function || ""}</div></div>
      <div style={s.metric}><strong>Etapy</strong><div style={s.muted}>{asArray(blueprint.stages).length}</div></div>
    </div>
  );
});

function BlueprintLoader({ raw, setRaw, onLoad, error }) {
  return (
    <div style={s.card}>
      <strong>TRAINING_BLUEPRINT_JSON</strong>
      <div style={{ ...s.muted, marginTop: 5 }}>Wklej blueprint. Ten build jest samowystarczalny i nie ładuje zewnętrznych komponentów.</div>
      <textarea style={{ ...s.textarea, marginTop: 8 }} value={raw} onChange={e => setRaw(e.target.value)} placeholder="Wklej TRAINING_BLUEPRINT_JSON..." />
      <button style={{ ...s.btn(), marginTop: 8 }} onClick={onLoad}>Załaduj blueprint</button>
      {error && <div style={s.error}>{error}</div>}
    </div>
  );
}

function StepTrainer({ blueprint }) {
  const stages = asArray(blueprint.stages);
  const [idx, setIdx] = useState(0);
  const current = stages[idx] || null;
  if (!stages.length) return <div style={s.card}><strong>Brak etapów treningu.</strong><div style={s.muted}>Przekaż `stages[]` / `etapy[]`.</div></div>;
  return (
    <div style={s.card}>
      <strong>Etap {idx + 1}/{stages.length}: {current?.title || current?.nazwa || current?.id}</strong>
      <div style={{ ...s.muted, marginTop: 8 }}>{current?.description || current?.opis || current?.goal || current?.cel || ""}</div>
      <ol>{asArray(current?.questions || current?.pytania || current?.actions || current?.czynnosci).map((q, i) => <li key={i}>{typeof q === "string" ? q : (q.text || q.pytanie || JSON.stringify(q))}</li>)}</ol>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button style={s.btn()} disabled={idx === 0} onClick={() => setIdx(Math.max(0, idx - 1))}>Wstecz</button>
        <button style={s.btn()} disabled={idx >= stages.length - 1} onClick={() => setIdx(Math.min(stages.length - 1, idx + 1))}>Dalej</button>
      </div>
    </div>
  );
}

function TypologyView() {
  return (
    <div style={s.card}>
      <strong>Typologie strategiczne</strong>
      <h3>Typy świadków</h3>
      <table style={s.table}><thead><tr><th style={s.th}>Typ</th><th style={s.th}>Strategia</th><th style={s.th}>Ryzyko</th></tr></thead>
      <tbody>{WITNESS_TYPES.map(x => <tr key={x.id}><td style={s.td}>{x.label}</td><td style={s.td}>{x.strategy}</td><td style={s.td}>{x.risk}</td></tr>)}</tbody></table>
      <h3>Typy sędziów</h3>
      <table style={s.table}><thead><tr><th style={s.th}>Typ</th><th style={s.th}>Styl</th><th style={s.th}>Ryzyko</th></tr></thead>
      <tbody>{JUDGE_TYPES.map(x => <tr key={x.id}><td style={s.td}>{x.label}</td><td style={s.td}>{x.style}</td><td style={s.td}>{x.risk}</td></tr>)}</tbody></table>
    </div>
  );
}

function MatrixView({ blueprint }) {
  const wt = findById(WITNESS_TYPES, blueprint.witness?.typeId);
  const jt = findById(JUDGE_TYPES, blueprint.judge?.typeId);
  const rec = wt && jt ? `Dostosuj strategię: ${wt.strategy}. Wobec sędziego: ${jt.style}. Kontroluj ryzyko: ${wt.risk}; ${jt.risk}.` : "Wybierz witness.typeId i judge.typeId w blueprintcie, aby uzyskać rekomendację matrycową.";
  return <div style={s.card}><strong>Macierz: typ świadka × typ sędziego</strong><p style={s.muted}>{rec}</p></div>;
}

function FinalTemplates({ blueprint }) {
  const templates = blueprint.finalTemplates || {};
  const rows = [
    ["Pytania gotowe do sądu", asArray(templates.courtReadyQuestions || templates.pytaniaDoSadu)],
    ["Uwagi końcowe", asArray(templates.closingNotes || templates.uwagiKoncowe)],
    ["Nie zadawać", asArray(templates.doNotAsk || templates.nieZadawac)]
  ];
  return <div style={s.card}><strong>Gotowe wzory</strong>{rows.map(([label, arr]) => <div key={label} style={{ marginTop: 10 }}><span style={s.pill}>{label}</span>{arr.length ? <ol>{arr.map((x, i) => <li key={i}>{typeof x === "string" ? x : JSON.stringify(x)}</li>)}</ol> : <div style={s.muted}>Brak danych.</div>}</div>)}</div>;
}

function BlueprintPreview({ blueprint }) {
  return <div style={s.card}><strong>Podgląd blueprintu</strong><textarea readOnly style={{ ...s.textarea, marginTop: 12 }} value={JSON.stringify(blueprint, null, 2)} /></div>;
}

export default function WitnessExaminationStepLazy(props = {}) {
  const initial = useMemo(() => normaliseBlueprint(safeBlueprintFromWindow(props) || DEFAULT_BLUEPRINT), [props]);
  const [blueprint, setBlueprint] = useState(initial);
  const [raw, setRaw] = useState(JSON.stringify(initial, null, 2));
  const [tab, setTab] = useState("load");
  const [error, setError] = useState("");

  useEffect(() => {
    const fromWindow = safeBlueprintFromWindow(props);
    if (!fromWindow) return;
    const normalized = normaliseBlueprint(fromWindow);
    setBlueprint(normalized);
    setRaw(JSON.stringify(normalized, null, 2));
  }, [props]);

  const loadBlueprint = useCallback(() => {
    try {
      const parsed = JSON.parse(raw);
      const validationError = validateBlueprint(parsed);
      if (validationError) throw new Error(validationError);
      setBlueprint(normaliseBlueprint(parsed));
      setError("");
      setTab("train");
    } catch (e) {
      setError(e?.message || "Nieprawidłowy JSON.");
    }
  }, [raw]);

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <h1 style={s.h1}>Przesłuchanie świadków v2-min90 — grafika na żądanie</h1>
        <div style={s.sub}>Self-contained JSX. Domyślnie system powinien pracować tekstowo; ten widok uruchamiać tylko na wyraźne żądanie.</div>
      </div>
      <Summary blueprint={blueprint} />
      <div style={s.nav}>
        {[["load", "Blueprint"], ["train", "Trening"], ["typology", "Typologie"], ["matrix", "Macierz"], ["templates", "Wzory"], ["preview", "JSON"]].map(([id, label]) => (
          <button key={id} style={s.navBtn(tab === id)} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      {tab === "load" && <BlueprintLoader raw={raw} setRaw={setRaw} onLoad={loadBlueprint} error={error} />}
      {tab === "train" && <StepTrainer blueprint={blueprint} />}
      {tab === "typology" && <TypologyView />}
      {tab === "matrix" && <MatrixView blueprint={blueprint} />}
      {tab === "templates" && <FinalTemplates blueprint={blueprint} />}
      {tab === "preview" && <BlueprintPreview blueprint={blueprint} />}
    </div>
  );
}
