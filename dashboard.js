// ============================================================
// DASHBOARD DE PROGRESO POR COMPETENCIA
// Combina los 6 mini-quizzes de módulo + el historial del examen final cronometrado
// (examen-final.js). Monkey-patch de gradeQuiz/resetProgress, sin tocar app.js.
// ============================================================
(function(){

const QUIZ_COMP = { Q1:'general', Q2:'pedagogia', Q3:'normativa', Q4:'lectura_cuant', Q5:'area', Q6:'general' };
const COMP_LABEL = { pedagogia:'Pedagogía', normativa:'Normativa', lectura_cuant:'Lectura y cuantitativo', area:'Área disciplinar', general:'General / estrategia' };
const COMP_ORDER = ['pedagogia','normativa','lectura_cuant','area','general'];
const QUIZ_KEY = 'concursoDocente_quizScores';
const EXAM_KEY = 'concursoDocente_examHistory';

function getQuizScores(){ try{ return JSON.parse(localStorage.getItem(QUIZ_KEY)||'{}'); }catch(e){ return {}; } }
function saveQuizScore(qid, ok, total){
  const s = getQuizScores();
  s[qid] = {ok:ok, total:total, ts:Date.now()};
  localStorage.setItem(QUIZ_KEY, JSON.stringify(s));
}
function getExamHistory(){ try{ return JSON.parse(localStorage.getItem(EXAM_KEY)||'[]'); }catch(e){ return []; } }

const _gradeQuiz = gradeQuiz;
gradeQuiz = function(qid){
  _gradeQuiz(qid);
  const qz = window.QUIZZES[qid];
  if(!qz) return;
  let ok = 0;
  qz.qs.forEach(function(it,i){
    const sel = document.querySelector('input[name=qz'+i+']:checked');
    if(sel && +sel.value===it.a) ok++;
  });
  saveQuizScore(qid, ok, qz.qs.length);
};

const _resetProgress = resetProgress;
resetProgress = function(){
  const before = getCompleted();
  _resetProgress();
  const after = getCompleted();
  if(before.length && !after.length){
    localStorage.removeItem(QUIZ_KEY);
    localStorage.removeItem(EXAM_KEY);
  }
};

function computeCompetencyStats(){
  const stats = {};
  const qs = getQuizScores();
  Object.keys(qs).forEach(function(qid){
    const comp = QUIZ_COMP[qid]; if(!comp) return;
    if(!stats[comp]) stats[comp] = {ok:0,max:0};
    stats[comp].ok += qs[qid].ok; stats[comp].max += qs[qid].total;
  });
  getExamHistory().forEach(function(att){
    Object.keys(att.byCompetency||{}).forEach(function(comp){
      if(!stats[comp]) stats[comp] = {ok:0,max:0};
      stats[comp].ok += att.byCompetency[comp].ok;
      stats[comp].max += att.byCompetency[comp].max;
    });
  });
  return stats;
}

function barsHtml(stats){
  return COMP_ORDER.map(function(k){
    const s = stats[k];
    const pct = (s && s.max) ? Math.round(s.ok/s.max*100) : 0;
    return '<div style="margin:14px 0">'
      + '<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;margin-bottom:4px"><span>'+COMP_LABEL[k]+'</span><span>'+(s ? s.ok+'/'+s.max : '—')+'</span></div>'
      + '<div class="global-progress-track"><div class="global-progress-fill" style="width:'+pct+'%"></div></div>'
      + '</div>';
  }).join('');
}

function historyHtml(){
  const hist = getExamHistory();
  if(!hist.length) return '<p style="color:var(--muted);margin-top:12px">Aún no has presentado el examen final cronometrado (lección P6).</p>';
  const w=40, gap=10, h=90;
  const bars = hist.map(function(a,i){
    const pct = a.total/a.max;
    const barH = Math.max(4, Math.round(pct*h));
    const x = i*(w+gap);
    const color = pct>=0.7 ? 'var(--p6)' : (pct>=0.5 ? 'var(--p1)' : 'var(--p3)');
    return '<rect x="'+x+'" y="'+(h-barH)+'" width="'+w+'" height="'+barH+'" rx="4" fill="'+color+'"></rect>'
      + '<text x="'+(x+w/2)+'" y="'+(h+16)+'" text-anchor="middle" font-size="10" fill="var(--muted)">'+a.total+'/'+a.max+'</text>';
  }).join('');
  const svgW = hist.length*(w+gap);
  return '<div style="overflow-x:auto"><svg viewBox="0 0 '+svgW+' '+(h+24)+'" width="100%" style="max-width:'+svgW+'px;margin-top:10px;display:block">'+bars+'</svg></div>';
}

window.openDashboard = function(){
  const dTitle = document.getElementById('dTitle');
  const dNum = document.getElementById('dNum');
  const drawerBody = document.getElementById('drawerBody');
  const drawerFoot = document.getElementById('drawerFoot');
  if(!drawerBody) return;
  if(dNum) dNum.textContent = '📊';
  if(dTitle) dTitle.textContent = 'Mi progreso por competencia';
  const stats = computeCompetencyStats();
  drawerBody.innerHTML = '<h3>📊 Mi progreso</h3>'
    + '<p style="color:var(--muted)">Combina tus mini-quizzes de módulo (Q1-Q6) y tus intentos del examen final cronometrado (P6).</p>'
    + barsHtml(stats)
    + '<h4 style="margin-top:24px">Historial del examen final</h4>' + historyHtml()
    + '<p style="margin-top:18px;font-size:12px;color:var(--muted)">Los datos se guardan solo en este navegador (localStorage). "↻ Reiniciar progreso" también borra este historial.</p>';
  if(drawerFoot) drawerFoot.innerHTML = '';
  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
};

function addDashboardBtn(){
  if(document.getElementById('dashboardBtn')) return;
  const bar = document.getElementById('tocBar');
  if(!bar) return;
  const btn = document.createElement('button');
  btn.id = 'dashboardBtn';
  btn.textContent = '📊 Mi progreso';
  btn.onclick = openDashboard;
  btn.style.cssText = 'flex-shrink:0;padding:5px 12px;border-radius:100px;background:var(--ui-2);border:1px solid var(--border);color:var(--muted);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit';
  const themeBtn = document.getElementById('themeBtn');
  if(themeBtn) bar.insertBefore(btn, themeBtn); else bar.appendChild(btn);
}
addDashboardBtn();

})();
