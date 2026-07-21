// ═══════════════════════════════════════════════════
// VIDEOS — Micro-videos por módulo y por lección · Research AI Lab (jul-2026)
// Módulos: reproductor plegable tras el header de los módulos con entrada
//   en window.MODULE_VIDEOS (videos-data.js, por curso).
// Lecciones: reproductor al inicio del drawer de las lecciones con entrada
//   en window.LESSON_VIDEOS (envuelve openDrawer; corre después de a11y).
// Video sound-off (tipografía cinética): la transcripción textual es
// la alternativa accesible (el texto del video está en píxeles).
// No toca app.js/content.js. Sin datos es no-op.
// ═══════════════════════════════════════════════════
(function(){
'use strict';
var MV=window.MODULE_VIDEOS, LV=window.LESSON_VIDEOS;
if(!MV&&!LV) return;

function esES(){ var lb=document.getElementById('langBtn'); return !lb||lb.textContent.indexOf('EN')>-1; }

var css=[
'.mv-wrap{margin:6px 0 14px;border:1px solid var(--border);border-radius:16px;background:var(--card);overflow:hidden}',
'.mv-wrap>summary{cursor:pointer;padding:14px 18px;font-size:13.5px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:10px;list-style:none}',
'.mv-wrap>summary::-webkit-details-marker{display:none}',
'.mv-wrap>summary:hover{color:var(--c,var(--claude))}',
'.mv-wrap>summary .mv-badge{margin-left:auto;font-family:"JetBrains Mono",monospace;font-size:11px;font-weight:800;color:var(--muted)}',
'.mv-body{padding:0 18px 16px}',
'.mv-body video{width:100%;max-height:70vh;border-radius:12px;background:#000;display:block}',
'.mv-tr{margin-top:10px;font-size:13px;color:var(--muted)}',
'.mv-tr summary{cursor:pointer;font-weight:700;padding:4px 0}',
'.mv-tr div{margin-top:8px;line-height:1.7;white-space:pre-line}',
'.mv-inline{margin:0 0 18px}',
'.mv-inline .mv-cap{font-size:12px;font-weight:700;opacity:.7;margin-bottom:6px}',
'.mv-inline video{width:100%;max-height:60vh;border-radius:12px;background:#000;display:block}'
].join('\n');
var st=document.createElement('style'); st.id='mvCss'; st.textContent=css; document.head.appendChild(st);

function transcriptEl(text,es){
  var tr=document.createElement('details'); tr.className='mv-tr';
  var ts=document.createElement('summary'); ts.textContent=es?'📄 Leer transcripción del video':'📄 Read the video transcript';
  var tx=document.createElement('div'); tx.textContent=text;
  tr.appendChild(ts); tr.appendChild(tx);
  return tr;
}

// ── Videos de módulo (tras el phase-header) ──
function render(){
  if(!MV) return;
  Object.keys(MV).forEach(function(pid){
    var section=document.getElementById('phase-'+pid); if(!section) return;
    if(section.querySelector('.mv-wrap')) return;
    var header=section.querySelector('.phase-header'); if(!header) return;
    var v=MV[pid], es=esES();

    var d=document.createElement('details'); d.className='mv-wrap';
    var s=document.createElement('summary');
    s.innerHTML='<span aria-hidden="true">🎬</span><span>'+(es?'Ver el video del módulo':'Watch the module video')+'</span>'+
      '<span class="mv-badge">'+(v.dur||'1 min')+'</span>';
    d.appendChild(s);

    var body=document.createElement('div'); body.className='mv-body';
    var vid=document.createElement('video');
    vid.controls=true; vid.preload='none'; vid.playsInline=true;
    vid.src=v.src; if(v.poster) vid.poster=v.poster;
    vid.setAttribute('aria-label',(es?'Video del módulo: ':'Module video: ')+(v.title||''));
    body.appendChild(vid);
    if(v.transcript) body.appendChild(transcriptEl(v.transcript,es));
    d.appendChild(body);
    header.after(d);
  });
}

// ── Videos de lección (al inicio del drawer) ──
function injectLesson(id){
  if(!LV) return;
  var v=LV[id]; if(!v) return;
  var body=document.getElementById('drawerBody'); if(!body) return;
  if(body.querySelector('.mv-inline')) return;
  var es=esES();

  var wrap=document.createElement('div'); wrap.className='mv-inline';
  var cap=document.createElement('div'); cap.className='mv-cap';
  cap.textContent='🎬 '+(es?'Video de la lección':'Lesson video')+' · '+(v.dur||'1 min');
  wrap.appendChild(cap);
  var vid=document.createElement('video');
  vid.controls=true; vid.preload='none'; vid.playsInline=true;
  vid.src=v.src; if(v.poster) vid.poster=v.poster;
  vid.setAttribute('aria-label',(es?'Video de la lección: ':'Lesson video: ')+(v.title||''));
  wrap.appendChild(vid);
  if(v.transcript) wrap.appendChild(transcriptEl(v.transcript,es));
  // La intro de audio del instructor va primero; el video de la lección después
  var au=body.querySelector('audio');
  var intro=au?au.closest('#drawerBody > div'):null;
  if(intro) intro.after(wrap); else body.insertBefore(wrap,body.firstChild);
}

if(LV && typeof window.openDrawer==='function'){
  var prevOpen=window.openDrawer;
  window.openDrawer=function(id){
    prevOpen.apply(this,arguments);
    try{ injectLesson(id); }catch(e){}
  };
}

var pc=document.getElementById('phasesContainer');
if(pc&&MV) new MutationObserver(function(){ render(); }).observe(pc,{childList:true});
render();
})();
