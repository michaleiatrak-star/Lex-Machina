<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--font-sans,'system-ui');font-size:15px;color:var(--color-text-primary,#1a1a1a);background:transparent;line-height:1.6}
h2.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
.wrap{padding:1rem 0}
.tabs{display:flex;gap:6px;margin-bottom:1.25rem;border-bottom:0.5px solid var(--color-border-tertiary,#e0e0e0);padding-bottom:0}
.tab{padding:8px 18px;border:none;background:none;cursor:pointer;font-size:14px;color:var(--color-text-secondary,#666);border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s}
.tab.active{color:var(--color-text-primary,#111);border-bottom-color:var(--color-text-primary,#111);font-weight:500}
.tab:hover:not(.active){color:var(--color-text-primary,#111)}
.panel{display:none}.panel.active{display:block}
.card{background:var(--color-background-primary,#fff);border:0.5px solid var(--color-border-tertiary,#e0e0e0);border-radius:var(--border-radius-lg,12px);padding:1.25rem 1.5rem;margin-bottom:1rem}
.drop-zone{border:1.5px dashed var(--color-border-secondary,#bbb);border-radius:var(--border-radius-lg,12px);padding:2.5rem 1.5rem;text-align:center;cursor:pointer;transition:all .2s;background:var(--color-background-secondary,#f8f8f8);position:relative}
.drop-zone.over{border-color:#5DCAA5;background:rgba(93,202,165,.07)}
.drop-zone input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.drop-zone i{font-size:32px;color:var(--color-text-secondary,#888);display:block;margin-bottom:8px}
.drop-zone p{color:var(--color-text-secondary,#888);font-size:14px}
.drop-zone .filename{color:var(--color-text-primary,#111);font-weight:500;font-size:14px;margin-top:6px}
textarea{width:100%;min-height:220px;border:0.5px solid var(--color-border-tertiary,#e0e0e0);border-radius:var(--border-radius-md,8px);padding:.75rem 1rem;font-size:14px;font-family:inherit;resize:vertical;color:var(--color-text-primary,#111);background:var(--color-background-primary,#fff);line-height:1.6}
textarea:focus{outline:none;border-color:var(--color-border-secondary,#aaa)}
.options-grid{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:1rem}
.opt-btn{display:flex;align-items:center;gap:6px;padding:6px 14px;border:0.5px solid var(--color-border-secondary,#bbb);border-radius:20px;cursor:pointer;font-size:13px;background:var(--color-background-primary,#fff);color:var(--color-text-primary,#111);transition:all .15s;user-select:none}
.opt-btn.sel{background:#E1F5EE;border-color:#1D9E75;color:#0F6E56}
.opt-btn i{font-size:15px}
select{width:100%;padding:8px 12px;border:0.5px solid var(--color-border-tertiary,#e0e0e0);border-radius:var(--border-radius-md,8px);font-size:14px;font-family:inherit;color:var(--color-text-primary,#111);background:var(--color-background-primary,#fff);cursor:pointer;margin-bottom:1rem}
select:focus{outline:none;border-color:var(--color-border-secondary,#aaa)}
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border:0.5px solid var(--color-border-secondary,#bbb);border-radius:var(--border-radius-md,8px);cursor:pointer;font-size:14px;font-weight:500;background:var(--color-background-primary,#fff);color:var(--color-text-primary,#111);transition:all .15s}
.btn:hover{background:var(--color-background-secondary,#f5f5f5)}
.btn:active{transform:scale(.98)}
.btn.primary{background:#1D9E75;color:#fff;border-color:#1D9E75}
.btn.primary:hover{background:#0F6E56;border-color:#0F6E56}
.btn.primary:disabled{opacity:.5;cursor:not-allowed}
.btn.send{background:#185FA5;color:#fff;border-color:#185FA5}
.btn.send:hover{background:#0C447C;border-color:#0C447C}
.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.label{font-size:13px;font-weight:500;color:var(--color-text-secondary,#666);margin-bottom:6px;display:block}
.result-box{border:0.5px solid var(--color-border-tertiary,#e0e0e0);border-radius:var(--border-radius-md,8px);padding:1rem;background:var(--color-background-secondary,#f8f8f8);min-height:80px;font-size:14px;line-height:1.7;white-space:pre-wrap;word-break:break-word;max-height:400px;overflow-y:auto}
.status{padding:8px 14px;border-radius:var(--border-radius-md,8px);font-size:13px;margin-bottom:1rem;display:flex;align-items:center;gap:8px}
.status.info{background:#E6F1FB;color:#185FA5}
.status.ok{background:#E1F5EE;color:#0F6E56}
.status.err{background:#FCEBEB;color:#A32D2D}
.spinner{width:16px;height:16px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
.progress-bar{height:4px;background:var(--color-border-tertiary,#e0e0e0);border-radius:2px;overflow:hidden;margin-bottom:1rem}
.progress-fill{height:100%;background:#1D9E75;transition:width .3s;border-radius:2px}
.tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:12px;font-size:12px;background:#E1F5EE;color:#0F6E56;font-weight:500}
.section-title{font-size:14px;font-weight:500;margin-bottom:10px;color:var(--color-text-primary,#111)}
.divider{height:0.5px;background:var(--color-border-tertiary,#e0e0e0);margin:1rem 0}
.custom-input{display:flex;gap:8px;margin-bottom:.5rem}
.custom-input input{flex:1;padding:7px 12px;border:0.5px solid var(--color-border-tertiary,#e0e0e0);border-radius:var(--border-radius-md,8px);font-size:14px;font-family:inherit;color:var(--color-text-primary,#111);background:var(--color-background-primary,#fff)}
.custom-input input:focus{outline:none;border-color:var(--color-border-secondary,#aaa)}
.chip-list{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:1rem}
.chip{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:14px;font-size:12px;background:var(--color-background-secondary,#f0f0f0);color:var(--color-text-secondary,#666);cursor:pointer}
.chip:hover{background:#FCEBEB;color:#A32D2D}
.preview-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem}
</style>
</head>
<body>
<h2 class="sr-only">Anonimizer dokumentów prawnych v3.2 — tryb tekstowy i plikowy z AI</h2>
<div class="wrap">

<div class="tabs">
  <button class="tab active" onclick="switchTab('text')">Tekst</button>
  <button class="tab" onclick="switchTab('file')">Plik (PDF/DOCX/XLSX)</button>
  <button class="tab" onclick="switchTab('settings')">Ustawienia</button>
</div>

<!-- TAB: TEKST -->
<div id="panel-text" class="panel active">
  <div class="card">
    <span class="label">Co usunąć / anonimizować:</span>
    <div class="options-grid" id="opt-grid"></div>

    <div class="custom-input">
      <input type="text" id="custom-phrase" placeholder="Dodaj własną frazę do usunięcia…">
      <button class="btn" onclick="addCustomPhrase()">+ Dodaj</button>
    </div>
    <div class="chip-list" id="custom-chips"></div>

    <span class="label">Tryb zastępowania:</span>
    <select id="replace-mode">
      <option value="label">Etykieta opisowa (np. [IMIĘ], [PESEL])</option>
      <option value="black">Czarne bloki ████</option>
      <option value="star">Gwiazdki ****</option>
      <option value="remove">Usuń całkowicie</option>
      <option value="generic">Fikcyjne dane (AI generuje)</option>
    </select>

    <span class="label">Wklej tekst do anonimizacji:</span>
    <textarea id="input-text" placeholder="Wklej tutaj treść dokumentu, pisma procesowego, umowy…"></textarea>

    <div style="margin-top:1rem" class="row">
      <button class="btn primary" onclick="anonymizeText()" id="btn-anon">Anonimizuj</button>
      <button class="btn" onclick="clearText()">Wyczyść</button>
    </div>
  </div>

  <div id="text-status"></div>

  <div id="text-result" style="display:none">
    <div class="card">
      <div class="preview-header">
        <span class="section-title">Wynik anonimizacji</span>
        <div class="row">
          <span id="stats-tag" class="tag"></span>
          <button class="btn" onclick="copyResult()">Kopiuj</button>
        </div>
      </div>
      <div class="result-box" id="output-text"></div>
      <div style="margin-top:1rem" class="row">
        <button class="btn send" onclick="sendToRouter()">Wyślij do analizy prawnej ↗</button>
      </div>
    </div>
    <div class="card" id="report-card" style="display:none">
      <span class="section-title">Raport — co zostało wykryte</span>
      <div id="report-body" style="font-size:13px;color:var(--color-text-secondary,#666);line-height:1.8"></div>
    </div>
  </div>
</div>

<!-- TAB: PLIK -->
<div id="panel-file" class="panel">
  <div class="card">
    <span class="label">Przeciągnij plik lub kliknij aby wybrać:</span>
    <div class="drop-zone" id="drop-zone" ondrop="handleDrop(event)" ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)">
      <input type="file" id="file-input" accept=".pdf,.docx,.xlsx,.xls,.txt,.doc" onchange="handleFileSelect(event)">
      <span style="font-size:32px;display:block;margin-bottom:8px">📂</span>
      <p>Upuść tutaj PDF, DOCX, XLSX lub TXT</p>
      <div class="filename" id="file-name"></div>
    </div>

    <div id="file-options" style="display:none;margin-top:1.25rem">
      <div class="divider"></div>
      <span class="label">Co usunąć:</span>
      <div class="options-grid" id="opt-grid-file"></div>

      <span class="label">Tryb zastępowania:</span>
      <select id="replace-mode-file">
        <option value="label">Etykieta opisowa (np. [IMIĘ], [PESEL])</option>
        <option value="black">Czarne bloki ████</option>
        <option value="star">Gwiazdki ****</option>
        <option value="remove">Usuń całkowicie</option>
        <option value="generic">Fikcyjne dane (AI generuje)</option>
      </select>

      <div class="row">
        <button class="btn primary" onclick="anonymizeFile()" id="btn-file-anon">Anonimizuj plik</button>
        <button class="btn" onclick="resetFile()">Inny plik</button>
      </div>
    </div>
  </div>

  <div id="file-status"></div>
  <div id="file-progress" style="display:none">
    <div class="progress-bar"><div class="progress-fill" id="prog-fill" style="width:0%"></div></div>
  </div>

  <div id="file-result" style="display:none">
    <div class="card">
      <div class="preview-header">
        <span class="section-title">Podgląd zanonimizowanego tekstu</span>
        <span id="file-stats-tag" class="tag"></span>
      </div>
      <div class="result-box" id="file-output"></div>
      <div style="margin-top:1rem" class="row">
        <button class="btn send" onclick="sendFileToRouter()">Wyślij do analizy prawnej ↗</button>
        <button class="btn primary" onclick="downloadResult()">Pobierz plik</button>
        <button class="btn" onclick="copyFileResult()">Kopiuj tekst</button>
      </div>
    </div>
  </div>
</div>

<!-- TAB: USTAWIENIA -->
<div id="panel-settings" class="panel">
  <div class="card">
    <span class="section-title">Własne wzorce (regex)</span>
    <p style="font-size:13px;color:var(--color-text-secondary,#666);margin-bottom:1rem">Dodaj wyrażenia regularne do wykrywania niestandardowych danych.</p>
    <div class="custom-input">
      <input type="text" id="regex-name" placeholder="Nazwa (np. Nr klienta)">
      <input type="text" id="regex-pattern" placeholder="Wzorzec regex (np. KL-\d{6})">
      <button class="btn" onclick="addRegex()">+ Dodaj</button>
    </div>
    <div id="regex-list" class="chip-list"></div>
    <div class="divider"></div>
    <span class="section-title">Asystent AI</span>
    <p style="font-size:13px;color:var(--color-text-secondary,#666);margin-bottom:.75rem">AI wykrywa dodatkowe dane osobowe nieujęte w predefiniowanych kategoriach.</p>
    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:14px">
      <input type="checkbox" id="ai-assist" checked style="width:16px;height:16px">
      Włącz asystenta AI do wykrywania danych osobowych
    </label>
    <div class="divider"></div>
    <span class="section-title">Język dokumentu</span>
    <select id="doc-lang" style="margin-top:8px">
      <option value="pl">Polski</option>
      <option value="en">Angielski</option>
      <option value="de">Niemiecki</option>
      <option value="mixed">Mieszany</option>
    </select>
  </div>
</div>

</div>
<script>
const CATS=[
  {id:'names',label:'Imiona i nazwiska',pat:[/\b([A-ZŁÓŚŻŹĆĄĘŃ][a-złóśżźćąęń]+)\s+([A-ZŁÓŚŻŹĆĄĘŃ][a-złóśżźćąęń]+(?:\s+[A-ZŁÓŚŻŹĆĄĘŃ][a-złóśżźćąęń]+)?)\b/g],replace:'[IMIĘ NAZWISKO]'},
  {id:'pesel',label:'PESEL',pat:[/\b\d{11}\b/g],replace:'[PESEL]'},
  {id:'nip',label:'NIP',pat:[/\b\d{3}[-]?\d{3}[-]?\d{2}[-]?\d{2}\b|\bNIP\s*:?\s*\d[\d\s-]{9,}\d\b/gi],replace:'[NIP]'},
  {id:'regon',label:'REGON',pat:[/\b\d{9}\b|\b\d{14}\b/g],replace:'[REGON]'},
  {id:'dates',label:'Daty',pat:[/\b\d{1,2}[./\-]\d{1,2}[./\-]\d{2,4}\b/g],replace:'[DATA]'},
  {id:'address',label:'Adresy',pat:[/\b(ul\.|al\.|pl\.|os\.)\s*[A-ZŁÓŚŻŹĆĄĘŃ][^\n,]{2,40},?\s*\d{2}-\d{3}\s+[A-ZŁÓŚŻŹĆĄĘŃ][a-złóśżźćąęń]+\b/gi],replace:'[ADRES]'},
  {id:'phone',label:'Telefony',pat:[/(\+48\s?)?(\d{3}[\s\-]?\d{3}[\s\-]?\d{3})\b/g],replace:'[TELEFON]'},
  {id:'email',label:'E-mail',pat:[/\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/g],replace:'[E-MAIL]'},
  {id:'krs',label:'KRS',pat:[/\bKRS\s*:?\s*\d{10}\b/gi],replace:'[KRS]'},
  {id:'accounts',label:'Nr rachunków',pat:[/\b\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g],replace:'[NR KONTA]'},
  {id:'passport',label:'Nr dokumentów',pat:[/\b[A-Z]{3}\d{6}\b|\b[A-Z]{2}\d{7}\b/g],replace:'[NR DOKUMENTU]'},
  {id:'salary',label:'Kwoty',pat:[/\b\d[\d\s]*(?:\.\d{2})?\s*(?:zł|PLN|złotych)\b/gi],replace:'[KWOTA]'},
];

let selCats=new Set(['names','pesel','email','phone','address']);
let customPhrases=[];
let customRegexes=[];
let fileData=null;
let fileType='';
let anonymizedText='';
let fileAnonymizedText='';
let originalFilename='';
let currentSource='(tekst wklejony)';

function buildOptGrid(id){
  const g=document.getElementById(id);
  g.innerHTML='';
  CATS.forEach(c=>{
    const b=document.createElement('button');
    b.className='opt-btn'+(selCats.has(c.id)?' sel':'');
    b.textContent=c.label;
    b.onclick=()=>{
      if(selCats.has(c.id))selCats.delete(c.id);else selCats.add(c.id);
      document.querySelectorAll('#opt-grid .opt-btn, #opt-grid-file .opt-btn').forEach((el,i)=>{
        const cat=CATS[i%CATS.length];
        if(cat)el.className='opt-btn'+(selCats.has(cat.id)?' sel':'');
      });
    };
    g.appendChild(b);
  });
}
buildOptGrid('opt-grid');
buildOptGrid('opt-grid-file');

function switchTab(t){
  document.querySelectorAll('.tab').forEach((b,i)=>b.className='tab'+((['text','file','settings'][i]===t)?' active':''));
  document.querySelectorAll('.panel').forEach(p=>p.className='panel');
  document.getElementById('panel-'+t).className='panel active';
}

function addCustomPhrase(){
  const inp=document.getElementById('custom-phrase');
  const v=inp.value.trim();
  if(!v)return;
  customPhrases.push(v);renderChips();inp.value='';
}

function renderChips(){
  const c=document.getElementById('custom-chips');
  c.innerHTML=customPhrases.map((p,i)=>`<span class="chip" onclick="removePhrase(${i})">✕ ${p}</span>`).join('');
}
function removePhrase(i){customPhrases.splice(i,1);renderChips();}

function addRegex(){
  const n=document.getElementById('regex-name').value.trim();
  const p=document.getElementById('regex-pattern').value.trim();
  if(!n||!p)return;
  customRegexes.push({name:n,pattern:p});renderRegexList();
  document.getElementById('regex-name').value='';document.getElementById('regex-pattern').value='';
}
function renderRegexList(){
  const c=document.getElementById('regex-list');
  c.innerHTML=customRegexes.map((r,i)=>`<span class="chip" onclick="removeRegex(${i})">✕ ${r.name}: ${r.pattern}</span>`).join('');
}
function removeRegex(i){customRegexes.splice(i,1);renderRegexList();}

function applyPatterns(text,mode){
  let result=text,count=0,found={};
  CATS.filter(c=>selCats.has(c.id)).forEach(cat=>{
    cat.pat.forEach(pat=>{
      const re=new RegExp(pat.source,pat.flags);
      result=result.replace(re,m=>{
        count++;found[cat.label]=(found[cat.label]||0)+1;
        if(mode==='black')return'████████';
        if(mode==='star')return'****';
        if(mode==='remove')return'';
        return cat.replace;
      });
    });
  });
  customPhrases.forEach(ph=>{
    const re=new RegExp(ph.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');
    result=result.replace(re,m=>{count++;found['Własna: '+ph]=(found['Własna: '+ph]||0)+1;return mode==='black'?'████████':mode==='star'?'****':mode==='remove'?'':'[USUNIĘTO]';});
  });
  customRegexes.forEach(r=>{
    try{const re=new RegExp(r.pattern,'gi');result=result.replace(re,m=>{count++;found[r.name]=(found[r.name]||0)+1;return mode==='black'?'████████':mode==='star'?'****':mode==='remove'?'':'['+r.name.toUpperCase()+']';});}catch(e){}
  });
  return{text:result,count,found};
}

function setStatus(id,type,msg,spin=false){
  const el=document.getElementById(id);
  if(!msg){el.innerHTML='';return;}
  el.innerHTML=`<div class="status ${type}">${spin?'<div class="spinner"></div>':'ℹ️'} ${msg}</div>`;
}

async function anonymizeText(){
  const text=document.getElementById('input-text').value.trim();
  if(!text){setStatus('text-status','err','Wklej tekst do anonimizacji.');return;}
  const mode=document.getElementById('replace-mode').value;
  const useAI=document.getElementById('ai-assist').checked;
  const btn=document.getElementById('btn-anon');
  btn.disabled=true;
  setStatus('text-status','info','Anonimizuję…',true);
  document.getElementById('text-result').style.display='none';
  currentSource='(tekst wklejony)';

  let workText=text;

  if(mode==='generic'){
    try{
      const selC=CATS.filter(c=>selCats.has(c.id)).map(c=>c.label).join(', ');
      const lang=document.getElementById('doc-lang').value;
      const resp=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:4000,messages:[{role:'user',content:`Zanonimizuj poniższy tekst zastępując dane z kategorii: ${selC} FIKCYJNYMI ale realistycznie brzmiącymi danymi (język: ${lang}). Zachowaj pełny sens i strukturę. Zwróć WYŁĄCZNIE zanonimizowany tekst bez żadnych komentarzy.\n\nTekst:\n${text.substring(0,6000)}`}]})});
      const data=await resp.json();
      workText=data.content?.map(b=>b.text||'').join('')||workText;
      anonymizedText=workText;
      document.getElementById('output-text').textContent=workText;
      document.getElementById('stats-tag').textContent='AI – dane fikcyjne';
      document.getElementById('report-card').style.display='none';
      document.getElementById('text-result').style.display='block';
      setStatus('text-status','ok','Anonimizacja zakończona (fikcyjne dane AI).');
    }catch(e){setStatus('text-status','err','Błąd AI: '+e.message);}
    btn.disabled=false;return;
  }

  if(useAI){
    try{
      const selC=CATS.filter(c=>selCats.has(c.id)).map(c=>c.label).join(', ');
      const lang=document.getElementById('doc-lang').value;
      const resp=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,messages:[{role:'user',content:`Przeanalizuj tekst i znajdź TYLKO dane osobowe z kategorii: ${selC}. Odpowiedz WYŁĄCZNIE w JSON bez żadnych innych słów:\n{"found":[{"original":"wykryta_fraza","category":"kategoria","replace":"zastąp_czym"}]}\nTekst (język: ${lang}):\n${text.substring(0,3000)}`}]})});
      const data=await resp.json();
      const raw=data.content?.map(b=>b.text||'').join('');
      const cleaned=raw.replace(/```json|```/g,'').trim();
      const parsed=JSON.parse(cleaned);
      if(parsed.found?.length){
        const modeMap={label:r=>r.replace,black:()=>'████████',star:()=>'****',remove:()=>''};
        parsed.found.forEach(item=>{
          const rep=modeMap[mode]?.(item)??item.replace;
          workText=workText.replace(new RegExp(item.original.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'),rep);
        });
      }
    }catch(e){}
  }

  const{text:final,count,found}=applyPatterns(workText,mode);
  anonymizedText=final;
  document.getElementById('output-text').textContent=final;
  document.getElementById('stats-tag').textContent=`Wykryto: ${count} danych`;
  const reportEl=document.getElementById('report-body');
  if(Object.keys(found).length){
    reportEl.innerHTML=Object.entries(found).map(([k,v])=>`<b>${k}:</b> ${v} wystąpień`).join('<br>');
    document.getElementById('report-card').style.display='block';
  }else{document.getElementById('report-card').style.display='none';}
  document.getElementById('text-result').style.display='block';
  setStatus('text-status','ok',`Zakończono. Zastąpiono ${count} danych osobowych.`);
  btn.disabled=false;
}

function clearText(){document.getElementById('input-text').value='';document.getElementById('text-result').style.display='none';setStatus('text-status','','');}
function copyResult(){navigator.clipboard.writeText(anonymizedText).then(()=>{setStatus('text-status','ok','Skopiowano!');setTimeout(()=>setStatus('text-status','',''),2000);});}

function sendToRouter(){
  if(!anonymizedText)return;
  const countMatch=document.getElementById('stats-tag').textContent.match(/\d+/);
  const count=countMatch?countMatch[0]:'?';
  const msg=`##ANON_START##\nŹródło: ${currentSource}\nAnonimizacja: TAK | Usuniętych danych: ${count}\n##ANON_END##\n\nOto zanonimizowany dokument do analizy prawnej:\n\n${anonymizedText}`;
  if(typeof sendPrompt==='function')sendPrompt(msg);
  else{navigator.clipboard.writeText(msg);setStatus('text-status','ok','Skopiowano do schowka — wklej do czatu ↗');}
}

function sendFileToRouter(){
  if(!fileAnonymizedText)return;
  const countMatch=document.getElementById('file-stats-tag').textContent.match(/\d+/);
  const count=countMatch?countMatch[0]:'?';
  const msg=`##ANON_START##\nŹródło: ${originalFilename||'plik'}\nAnonimizacja: TAK | Usuniętych danych: ${count}\n##ANON_END##\n\nOto zanonimizowany dokument do analizy prawnej:\n\n${fileAnonymizedText}`;
  if(typeof sendPrompt==='function')sendPrompt(msg);
  else{navigator.clipboard.writeText(msg);setStatus('file-status','ok','Skopiowano do schowka — wklej do czatu ↗');}
}

function handleDragOver(e){e.preventDefault();document.getElementById('drop-zone').classList.add('over');}
function handleDragLeave(e){document.getElementById('drop-zone').classList.remove('over');}
function handleDrop(e){
  e.preventDefault();document.getElementById('drop-zone').classList.remove('over');
  const f=e.dataTransfer.files[0];if(f)processFile(f);
}
function handleFileSelect(e){const f=e.target.files[0];if(f)processFile(f);}

function processFile(f){
  originalFilename=f.name;
  fileType=f.name.split('.').pop().toLowerCase();
  document.getElementById('file-name').textContent=f.name;
  document.getElementById('file-options').style.display='block';
  document.getElementById('file-result').style.display='none';
  setStatus('file-status','info',`Plik wczytany: ${f.name} (${(f.size/1024).toFixed(1)} KB)`);
  const reader=new FileReader();
  if(fileType==='txt'){reader.onload=e2=>{fileData=e2.target.result;};reader.readAsText(f);}
  else{reader.onload=e2=>{fileData=e2.target.result;};reader.readAsDataURL(f);}
}

function resetFile(){
  fileData=null;fileType='';originalFilename='';
  document.getElementById('file-name').textContent='';
  document.getElementById('file-options').style.display='none';
  document.getElementById('file-result').style.display='none';
  document.getElementById('file-input').value='';
  setStatus('file-status','','');
}

function setProgress(pct){
  document.getElementById('file-progress').style.display=pct>=100||pct<=0?'none':'block';
  document.getElementById('prog-fill').style.width=pct+'%';
}

async function anonymizeFile(){
  if(!fileData){setStatus('file-status','err','Najpierw wybierz plik.');return;}
  const mode=document.getElementById('replace-mode-file').value;
  const btn=document.getElementById('btn-file-anon');
  btn.disabled=true;setProgress(20);

  let extractedText='';

  if(fileType==='txt'){
    extractedText=fileData;setProgress(40);
  }else{
    setStatus('file-status','info','Wysyłam plik do AI w celu ekstrakcji i anonimizacji…',true);
    try{
      const base64=fileData.split(',')[1];
      const mediaTypeMap={pdf:'application/pdf',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',doc:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',xls:'application/vnd.ms-excel'};
      const mediaType=mediaTypeMap[fileType]||'application/octet-stream';
      const selC=CATS.filter(c=>selCats.has(c.id)).map(c=>c.label).join(', ');
      const lang=document.getElementById('doc-lang').value;
      const useAI=document.getElementById('ai-assist').checked;
      const modeDesc={label:'etykietami opisowymi (np. [IMIĘ NAZWISKO], [PESEL], [ADRES])',black:'czarnymi blokami ████████',star:'gwiazdkami ****',remove:'(usuń całkowicie, bez zastępnika)',generic:'fikcyjnymi ale realistycznymi polskimi danymi'}[mode];
      setProgress(40);
      const resp=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:8000,messages:[{role:'user',content:[{type:'document',source:{type:'base64',media_type:mediaType,data:base64}},{type:'text',text:`Wykonaj dwie rzeczy jednocześnie:
1. Wyodrębnij PEŁNY tekst dokumentu zachowując układ, wcięcia, akapity i formatowanie jak najdokładniej.
2. Zanonimizuj go zastępując dane z kategorii: ${selC} — ${modeDesc}.
Język dokumentu: ${lang}.
${useAI?'Wykryj też inne dane osobowe niewidoczne w typowych wzorcach regex.':''}
Zwróć WYŁĄCZNIE zanonimizowany tekst bez żadnych komentarzy, wyjaśnień ani znaczników markdown.`}]}]})});
      setProgress(80);
      const data=await resp.json();
      if(data.error)throw new Error(data.error.message);
      extractedText=data.content?.map(b=>b.text||'').join('')||'';
      if(!extractedText.trim())throw new Error('Nie udało się odczytać treści pliku.');
    }catch(err){
      setStatus('file-status','err','Błąd odczytu pliku: '+err.message);
      btn.disabled=false;setProgress(0);return;
    }
  }

  setProgress(90);
  const{text:final,count,found}=applyPatterns(extractedText,mode);
  fileAnonymizedText=final;
  document.getElementById('file-output').textContent=final;
  document.getElementById('file-stats-tag').textContent=`Wykryto: ${count} danych`;
  document.getElementById('file-result').style.display='block';
  setProgress(0);
  setStatus('file-status','ok',`Anonimizacja zakończona. Zastąpiono ${count} danych osobowych.`);
  btn.disabled=false;
}

function copyFileResult(){navigator.clipboard.writeText(fileAnonymizedText).then(()=>{setStatus('file-status','ok','Skopiowano!');setTimeout(()=>setStatus('file-status','',''),2000);});}

function downloadResult(){
  if(!fileAnonymizedText)return;
  const base=originalFilename.replace(/\.[^.]+$/,'')||'dokument';
  const blob=new Blob([fileAnonymizedText],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=base+'_zanonimizowany.txt';
  document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
  setStatus('file-status','ok','Plik pobrany!');
}
</script>
</body>
</html>
