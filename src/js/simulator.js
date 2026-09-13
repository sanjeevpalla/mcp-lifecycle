const STEPS = [
  {phase:'init', dir:'client', label:'Step 1 · initialize request', caption:'Client speaks first: version, capabilities, identity.',
   json:{jsonrpc:"2.0", id:1, method:"initialize", params:{protocolVersion:"2025-11-25", capabilities:{roots:{listChanged:true}}, clientInfo:{name:"RecipeBoxDesktopClient", version:"1.0.0"}}}},
  {phase:'init', dir:'server', label:'Step 2 · initialize response', caption:'Server answers with its own version, capabilities, identity.',
   json:{jsonrpc:"2.0", id:1, result:{protocolVersion:"2025-11-25", capabilities:{tools:{listChanged:true}}, serverInfo:{name:"RecipeBox", version:"1.0.0"}}}},
  {phase:'init', dir:'client', label:'Step 3 · initialized notification', caption:'No id — an announcement, not a question. Handshake sealed.',
   json:{jsonrpc:"2.0", method:"notifications/initialized"}},
  {phase:'operation', dir:'client', label:'Discovery · tools/list', caption:'Fires automatically the instant the handshake completes.',
   json:{jsonrpc:"2.0", id:2, method:"tools/list"}},
  {phase:'operation', dir:'server', label:'Discovery response', caption:'The host quietly stores this for later matching.',
   json:{jsonrpc:"2.0", id:2, result:{tools:[{name:"list_recipes",description:"List every recipe"},{name:"get_recipe",description:"Get one recipe's detail"},{name:"search_recipes",description:"Search by tag"}]}}},
  {phase:'operation', dir:'client', label:'tools/call · search_recipes', caption:'A real question finally arrives.',
   json:{jsonrpc:"2.0", id:3, method:"tools/call", params:{name:"search_recipes", arguments:{tag:"quick"}}}},
  {phase:'operation', dir:'server', label:'Tool call response', caption:'Placing the order, after reading the menu.',
   json:{jsonrpc:"2.0", id:3, result:{content:[{type:"text", text:"Weeknight Pasta, Five-Minute Salsa"}]}}},
  {phase:'operation', dir:'client', label:'A request for something never negotiated', caption:'The host asks for prompts anyway — this genuinely happens.',
   json:{jsonrpc:"2.0", id:4, method:"prompts/list"}},
  {phase:'operation', dir:'server', label:'Error · Method not found', caption:'Not a crash — just an honest "we don\'t have that."',
   json:{jsonrpc:"2.0", id:4, error:{code:-32601, message:"Method not found"}}},
  {phase:'operation', dir:'client', label:'A long-running call, tagged for progress', caption:'A progressToken lets the server report back mid-task.',
   json:{jsonrpc:"2.0", id:7, method:"tools/call", params:{name:"search_recipes", arguments:{tag:"sunday"}, _meta:{progressToken:"tok-7"}}}},
  {phase:'operation', dir:'server', label:'notifications/progress', caption:'No id — a status update, not a reply yet.',
   json:{jsonrpc:"2.0", method:"notifications/progress", params:{progressToken:"tok-7", progress:60, total:100, message:"Searching 60 of 100 recipes"}}},
  {phase:'operation', dir:'client', label:'notifications/cancelled', caption:'A decision already made, announced — not a request for permission.',
   json:{jsonrpc:"2.0", method:"notifications/cancelled", params:{requestId:"7", reason:"Timeout exceeded (30s)"}}},
  {phase:'operation', dir:'client', label:'ping', caption:'Carries no information at all — just proving the line is still open.',
   json:{jsonrpc:"2.0", id:42, method:"ping"}},
  {phase:'operation', dir:'server', label:'ping response', caption:'An empty result is the entire point.',
   json:{jsonrpc:"2.0", id:42, result:{}}},
  {phase:'shutdown', dir:'event', label:'EVENT — not a JSON-RPC message', caption:'Shutdown has no message format of its own. The transport closing IS the goodbye.',
   json:null, raw:'Server transport closed { metadata: undefined }'},
];

let idx = 0, playing = false, timer = null;
const log = document.getElementById('log');
const badge = document.getElementById('phaseBadge');
const playBtn = document.getElementById('playBtn');

function phaseClass(p){ return {init:'phase-init', operation:'phase-operation', shutdown:'phase-shutdown'}[p]; }
function phaseLabel(p){ return {init:'Initialization', operation:'Operation', shutdown:'Shutdown'}[p]; }

function render(step){
  const el = document.createElement('div');
  el.className = 'msg ' + step.dir;
  const dirLabel = step.dir === 'client' ? 'Client → Server' : step.dir === 'server' ? 'Server → Client' : 'Event';
  el.innerHTML = `<div class="lbl">${dirLabel} · ${step.label}</div>
    <div class="caption">${step.caption}</div>
    <div class="hint">click to ${step.json || step.raw ? 'toggle JSON' : ''}</div>
    <pre class="mono">${step.json ? JSON.stringify(step.json, null, 2) : (step.raw || '')}</pre>`;
  el.onclick = () => el.classList.toggle('expanded');
  log.appendChild(el);
  badge.className = 'phase-badge ' + phaseClass(step.phase);
  badge.textContent = phaseLabel(step.phase);
  el.scrollIntoView({behavior:'smooth', block:'end'});
}

function stepOnce(){
  if (idx >= STEPS.length) { pause(); return; }
  render(STEPS[idx]);
  idx++;
  if (idx >= STEPS.length) pause();
}
function togglePlay(){ playing ? pause() : play(); }
function play(){
  playing = true; playBtn.textContent = '⏸ Pause';
  timer = setInterval(stepOnce, 1400);
}
function pause(){
  playing = false; playBtn.textContent = '▶ Play';
  clearInterval(timer);
}
function reset(){
  pause(); idx = 0; log.innerHTML = '';
  badge.className = 'phase-badge phase-init'; badge.textContent = 'Initialization';
}
