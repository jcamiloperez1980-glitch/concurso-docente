// ============================================================
// DIAGNÓSTICO + RUTA PERSONALIZADA — concurso-docente
// Fase 1 del embudo de monetización: PERFILA (no examina) para
//   1) darle valor real al estudiante gratis: una ruta ordenada y un plan semanal
//   2) medir demanda por cargo/área/zona en GA4 antes de construir el banco Pro
//
// La evaluación de conocimiento ya existe (quizzes Q1-Q6 + examen final P6);
// este módulo la LEE y la combina con el autorreporte para ordenar la ruta.
//
// Módulo autocontenido, sin backend: perfil en localStorage, señal en GA4,
// lista de espera por WhatsApp. Sigue el patrón de dashboard.js (abre el drawer
// directamente, sin pasar por openDrawer, para no disparar ofertas.js).
// ============================================================
(function () {
  'use strict';

  var WA = 'https://wa.me/573116128640';
  var PERFIL_KEY = 'concursoDocente_perfil';
  var QUIZ_KEY = 'concursoDocente_quizScores';
  var EXAM_KEY = 'concursoDocente_examHistory';
  var NUDGE_KEY = 'concursoDocente_ultimaVisita';

  // Cuando exista backend (Supabase/Formspree), poner aquí la URL y el módulo
  // hará POST del perfil además de la señal a GA4. null = solo GA4 + WhatsApp.
  var WAITLIST_ENDPOINT = null;

  // ── Catálogos ───────────────────────────────────────────────────────────────
  // Cargos según la lección A1. Áreas basadas en las áreas obligatorias y
  // fundamentales de la Ley 115 de 1994 (art. 23). PROVISIONAL: la lista
  // definitiva sale con la OPEC en septiembre de 2026.
  var CARGOS = [
    { v: 'aula', label: 'Docente de aula', area: true },
    { v: 'orientador', label: 'Docente orientador', area: false },
    { v: 'apoyo', label: 'Docente de apoyo pedagógico (inclusión)', area: false },
    { v: 'rector', label: 'Rector', area: false, directivo: true },
    { v: 'coordinador', label: 'Coordinador', area: false, directivo: true },
    { v: 'director_rural', label: 'Director rural', area: false, directivo: true }
  ];

  var AREAS = [
    'Preescolar',
    'Básica primaria',
    'Matemáticas',
    'Ciencias naturales y educación ambiental',
    'Ciencias sociales',
    'Humanidades y lengua castellana',
    'Idioma extranjero (inglés)',
    'Educación física, recreación y deportes',
    'Educación artística y cultural',
    'Educación ética y valores / Filosofía',
    'Educación religiosa',
    'Tecnología e informática',
    'Ciencias económicas y políticas',
    'Otra (la escribo abajo)'
  ];

  var ZONAS = [
    { v: 'urbana', label: 'Urbana' },
    { v: 'rural', label: 'Rural' },
    { v: 'ambas', label: 'Me da igual / aún no decido' }
  ];

  // minutos por día → lecciones por semana
  var TIEMPOS = [
    { v: 'menos30', label: 'Menos de 30 min', porSemana: 2 },
    { v: '30a60', label: 'Entre 30 min y 1 hora', porSemana: 3 },
    { v: '1a2h', label: 'Entre 1 y 2 horas', porSemana: 5 },
    { v: 'mas2h', label: 'Más de 2 horas', porSemana: 7 }
  ];

  // Competencias ↔ fases del curso (ids reales de PHASES en app.js)
  var COMPETENCIAS = [
    { v: 'pedagogia', label: 'Pedagogía y didáctica', fase: 'pedagogia' },
    { v: 'normativa', label: 'Normativa educativa', fase: 'normativa' },
    { v: 'lectura_cuant', label: 'Lectura crítica y razonamiento', fase: 'aptitudes' },
    { v: 'area', label: 'Mi área disciplinar', fase: 'areas' }
  ];

  // ── Estado del asistente ────────────────────────────────────────────────────
  var draft = {};
  var paso = 0;

  function getPerfil() {
    try { return JSON.parse(localStorage.getItem(PERFIL_KEY) || 'null'); } catch (e) { return null; }
  }
  function savePerfil(p) {
    try { localStorage.setItem(PERFIL_KEY, JSON.stringify(p)); } catch (e) {}
  }
  function cargoMeta(v) {
    for (var i = 0; i < CARGOS.length; i++) if (CARGOS[i].v === v) return CARGOS[i];
    return CARGOS[0];
  }
  function track(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params || {});
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // ── Desempeño real (quizzes + examen final), mismo cálculo que dashboard.js ──
  var QUIZ_COMP = { Q1: 'general', Q2: 'pedagogia', Q3: 'normativa', Q4: 'lectura_cuant', Q5: 'area', Q6: 'general' };

  function statsReales() {
    var stats = {};
    function add(comp, ok, max) {
      if (!stats[comp]) stats[comp] = { ok: 0, max: 0 };
      stats[comp].ok += ok; stats[comp].max += max;
    }
    var qs = {};
    try { qs = JSON.parse(localStorage.getItem(QUIZ_KEY) || '{}'); } catch (e) {}
    Object.keys(qs).forEach(function (qid) {
      if (QUIZ_COMP[qid]) add(QUIZ_COMP[qid], qs[qid].ok, qs[qid].total);
    });
    var hist = [];
    try { hist = JSON.parse(localStorage.getItem(EXAM_KEY) || '[]'); } catch (e) {}
    hist.forEach(function (att) {
      Object.keys(att.byCompetency || {}).forEach(function (c) {
        add(c, att.byCompetency[c].ok, att.byCompetency[c].max);
      });
    });
    return stats;
  }

  // ── Prioridad de fases ──────────────────────────────────────────────────────
  // Menor score = mayor prioridad. El dato objetivo (quizzes rendidos) pesa el
  // doble que el autorreporte; si no hay datos objetivos, manda el autorreporte.
  function ordenarFases(perfil) {
    var reales = statsReales();
    var flojas = perfil.flojo || [];
    var meta = cargoMeta(perfil.cargo);

    var scored = COMPETENCIAS.map(function (c) {
      var s = 0.5; // neutro
      var r = reales[c.v];
      if (r && r.max > 0) {
        s = (r.ok / r.max) * 2 + (flojas.indexOf(c.v) !== -1 ? 0 : 1);
        s = s / 3;
      } else {
        s = flojas.indexOf(c.v) !== -1 ? 0.2 : 0.7;
      }
      // Un directivo no compite por área disciplinar: baja al final.
      if (c.v === 'area' && meta.directivo) s = 9;
      // Un directivo sí necesita normativa institucional de entrada.
      if (c.v === 'normativa' && meta.directivo) s = s - 0.3;
      return { fase: c.fase, label: c.label, key: c.v, score: s };
    });

    scored.sort(function (a, b) { return a.score - b.score; });
    return scored;
  }

  function lessonsDeFase(faseId) {
    if (typeof PHASES === 'undefined') return [];
    for (var i = 0; i < PHASES.length; i++) if (PHASES[i].id === faseId) return PHASES[i].lessons;
    return [];
  }
  function tituloFase(faseId) {
    if (typeof PHASES === 'undefined') return faseId;
    for (var i = 0; i < PHASES.length; i++) if (PHASES[i].id === faseId) return PHASES[i].title;
    return faseId;
  }

  // Ruta completa: orientación siempre primero, examen final siempre último.
  function construirRuta(perfil) {
    var orden = ['conoce-examen'];
    ordenarFases(perfil).forEach(function (f) { orden.push(f.fase); });
    orden.push('final');
    return orden;
  }

  // ── Nudge de constancia (versión gratuita de las "alertas de estudio") ──────
  function diasSinEstudiar() {
    var last = null;
    try { last = localStorage.getItem(NUDGE_KEY); } catch (e) {}
    if (!last) return null;
    var d = Math.floor((Date.now() - (+last)) / 86400000);
    return isNaN(d) ? null : d;
  }
  function marcarVisita() {
    try { localStorage.setItem(NUDGE_KEY, String(Date.now())); } catch (e) {}
  }

  function siguienteLeccion(perfil) {
    var completed = (typeof getCompleted === 'function') ? getCompleted() : [];
    var ruta = construirRuta(perfil);
    for (var i = 0; i < ruta.length; i++) {
      var ls = lessonsDeFase(ruta[i]);
      for (var j = 0; j < ls.length; j++) {
        if (completed.indexOf(ls[j].id) === -1) return { id: ls[j].id, title: ls[j].title, fase: ruta[i] };
      }
    }
    return null;
  }

  // ── UI ──────────────────────────────────────────────────────────────────────
  var css =
    '.dg-step{margin:0 0 22px}' +
    '.dg-q{font-size:15.5px;font-weight:800;color:var(--text);margin:0 0 4px;line-height:1.35}' +
    '.dg-hint{font-size:12.5px;color:var(--dim);margin:0 0 14px;line-height:1.5}' +
    '.dg-opts{display:flex;flex-direction:column;gap:8px}' +
    '.dg-opt{display:flex;align-items:center;gap:10px;padding:11px 14px;border:1px solid var(--border);' +
    'border-radius:10px;background:var(--card);cursor:pointer;font-size:13.5px;color:var(--text);' +
    'font-family:inherit;text-align:left;transition:.15s;width:100%}' +
    '.dg-opt:hover{border-color:var(--claude);transform:translateX(2px)}' +
    '.dg-opt.on{border-color:var(--claude);background:linear-gradient(135deg,rgba(217,119,6,.10),transparent 70%);font-weight:700}' +
    '.dg-opt .dg-box{flex-shrink:0;width:17px;height:17px;border-radius:5px;border:1.5px solid var(--border);' +
    'display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff}' +
    '.dg-opt.on .dg-box{background:var(--claude);border-color:var(--claude)}' +
    '.dg-input{width:100%;padding:10px 13px;border:1px solid var(--border);border-radius:10px;' +
    'background:var(--card);color:var(--text);font-size:13.5px;font-family:inherit;margin-top:8px}' +
    '.dg-input:focus{outline:none;border-color:var(--claude)}' +
    '.dg-nav{display:flex;gap:10px;align-items:center;margin-top:24px}' +
    '.dg-next{padding:11px 24px;border-radius:100px;border:none;color:#fff;font-size:13.5px;font-weight:800;' +
    'cursor:pointer;font-family:inherit;background:linear-gradient(135deg,var(--claude),var(--claude-2));' +
    'box-shadow:0 6px 20px var(--claude-glow)}' +
    '.dg-next:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}' +
    '.dg-back{background:none;border:none;color:var(--muted);font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}' +
    '.dg-back:hover{color:var(--claude)}' +
    '.dg-dots{margin-left:auto;font-family:"JetBrains Mono",monospace;font-size:11px;color:var(--dim)}' +
    '.dg-rank{counter-reset:dgr;margin:16px 0 0;padding:0;list-style:none}' +
    '.dg-rank li{counter-increment:dgr;position:relative;padding:12px 14px 12px 46px;margin-bottom:8px;' +
    'border:1px solid var(--border);border-radius:10px;background:var(--card);font-size:13.5px;line-height:1.5}' +
    '.dg-rank li:before{content:counter(dgr);position:absolute;left:14px;top:12px;width:21px;height:21px;' +
    'border-radius:50%;background:var(--claude);color:#fff;font-size:11px;font-weight:800;' +
    'display:flex;align-items:center;justify-content:center}' +
    '.dg-rank li.dg-focus{border-color:var(--claude);background:linear-gradient(135deg,rgba(217,119,6,.09),transparent 70%)}' +
    '.dg-rank .dg-why{display:block;font-size:12px;color:var(--muted);margin-top:3px}' +
    '.dg-plan{margin:18px 0;padding:15px 18px;border-radius:12px;border-left:3px solid var(--claude);' +
    'background:linear-gradient(135deg,rgba(217,119,6,.08),transparent 60%);font-size:13.5px;line-height:1.7;color:var(--muted)}' +
    '.dg-plan strong{color:var(--text)}' +
    // `.drawer-body a` de index.html pinta los enlaces de azul y les pone borde
    // punteado; hay que ganarle en especificidad para que el botón se vea como botón.
    '.dg-go,.drawer-body a.dg-go{display:inline-flex;align-items:center;gap:8px;margin-top:10px;padding:10px 20px;' +
    'border-radius:100px;border:none;color:#fff;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;' +
    'text-decoration:none;background:linear-gradient(135deg,var(--claude),var(--claude-2))}' +
    '.drawer-body a.dg-go:hover{color:#fff;filter:brightness(1.07)}' +
    '.dg-wait{margin:26px 0 4px;padding:18px 20px;border:1px solid var(--border);border-left:3px solid var(--claude);' +
    'border-radius:12px;background:linear-gradient(135deg,rgba(217,119,6,.07),transparent 72%)}' +
    '.dg-wait-kicker{font-family:"JetBrains Mono",monospace;font-size:10.5px;font-weight:700;letter-spacing:.1em;' +
    'text-transform:uppercase;color:var(--claude);margin-bottom:6px}' +
    '.dg-wait-title{font-size:16px;font-weight:800;color:var(--text);margin-bottom:10px;line-height:1.3}' +
    '.dg-wait-p{font-size:13.5px;color:var(--muted);line-height:1.65;margin:0 0 11px}' +
    '.dg-wait-p strong{color:var(--text)}' +
    '.dg-wait-note{font-size:12px;color:var(--dim);line-height:1.5;margin-top:9px}' +
    '.dg-nudge{margin:0 0 18px;padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.6;' +
    'background:var(--card-2);border:1px solid var(--border);color:var(--muted)}' +
    '.dg-nudge strong{color:var(--text)}' +
    // Botón de la barra: se resalta con el color de marca en vez del gris
    // apagado de las utilidades (tema, progreso) — es la puerta de entrada al
    // diagnóstico y al embudo de pago, no una utilidad más.
    '#diagBtn{flex-shrink:0;padding:6px 16px;border-radius:100px;border:none;color:#fff;' +
    'font-size:12px;font-weight:800;cursor:pointer;font-family:inherit;' +
    'background:linear-gradient(135deg,var(--claude),var(--claude-2));' +
    'box-shadow:0 4px 14px var(--claude-glow);transition:.2s}' +
    '#diagBtn:hover{filter:brightness(1.08);transform:translateY(-1px)}';
  var st = document.createElement('style');
  st.id = 'dgCss';
  st.textContent = css;
  document.head.appendChild(st);

  function abrirDrawer(titulo, emoji, html, foot) {
    var body = document.getElementById('drawerBody');
    if (!body) return;
    var dNum = document.getElementById('dNum');
    var dTitle = document.getElementById('dTitle');
    var dFoot = document.getElementById('drawerFoot');
    if (dNum) dNum.textContent = emoji;
    if (dTitle) dTitle.textContent = titulo;
    body.innerHTML = html;
    if (dFoot) dFoot.innerHTML = foot || '';
    document.getElementById('drawerOverlay').classList.add('open');
    document.getElementById('drawer').classList.add('open');
    document.body.style.overflow = 'hidden';
    body.scrollTop = 0;
  }

  // ── Definición de los pasos ─────────────────────────────────────────────────
  function pasos() {
    var lista = [
      {
        key: 'cargo', multi: false,
        q: '¿A qué cargo te vas a presentar?',
        hint: 'Define toda tu ruta: un rector y un docente de aula no presentan la misma prueba.',
        opts: CARGOS.map(function (c) { return { v: c.v, label: c.label }; })
      }
    ];
    if (cargoMeta(draft.cargo).area) {
      lista.push({
        key: 'area', multi: false, free: 'area_otra',
        q: '¿Cuál es tu área disciplinar?',
        hint: 'La lista definitiva sale con la OPEC en septiembre de 2026. Si la tuya no está, escríbela.',
        opts: AREAS.map(function (a) { return { v: a, label: a }; })
      });
    }
    lista.push(
      {
        key: 'zona', multi: false,
        q: '¿En qué zona quieres tu plaza?',
        hint: 'El MEN confirmó que la prueba incluirá contextos territoriales. Esto cambia qué casos debes practicar.',
        opts: ZONAS.map(function (z) { return { v: z.v, label: z.label }; })
      },
      {
        key: 'tiempo', multi: false,
        q: '¿Cuánto puedes estudiar al día, de verdad?',
        hint: 'Sé honesto: el plan sirve si lo puedes cumplir.',
        opts: TIEMPOS.map(function (t) { return { v: t.v, label: t.label }; })
      },
      {
        key: 'flojo', multi: true,
        q: '¿Dónde te sientes más flojo?',
        hint: 'Puedes marcar varias. Si ya hiciste quizzes o el simulacro, tus resultados reales también cuentan.',
        opts: COMPETENCIAS.map(function (c) { return { v: c.v, label: c.label }; })
      }
    );
    return lista;
  }

  function renderPaso() {
    var ps = pasos();
    if (paso >= ps.length) return renderResultado();
    var s = ps[paso];
    var val = draft[s.key];
    var seleccion = s.multi ? (val || []) : val;

    var opts = s.opts.map(function (o) {
      var on = s.multi ? (seleccion.indexOf(o.v) !== -1) : (seleccion === o.v);
      return '<button class="dg-opt' + (on ? ' on' : '') + '" data-v="' + esc(o.v) + '">' +
        '<span class="dg-box">' + (on ? '✓' : '') + '</span>' + esc(o.label) + '</button>';
    }).join('');

    var free = '';
    if (s.free && seleccion && String(seleccion).indexOf('Otra') === 0) {
      free = '<input class="dg-input" id="dgFree" placeholder="Escribe tu área…" value="' + esc(draft[s.free] || '') + '">';
    }

    var listo = s.multi ? true : !!seleccion;

    abrirDrawer('Tu ruta personalizada', '🧭',
      '<div class="dg-step">' +
        '<p class="dg-q">' + esc(s.q) + '</p>' +
        '<p class="dg-hint">' + esc(s.hint) + '</p>' +
        '<div class="dg-opts" id="dgOpts">' + opts + '</div>' + free +
        '<div class="dg-nav">' +
          (paso > 0 ? '<button class="dg-back" id="dgBack">← Atrás</button>' : '') +
          '<button class="dg-next" id="dgNext"' + (listo ? '' : ' disabled') + '>' +
            (paso === ps.length - 1 ? 'Ver mi ruta →' : 'Siguiente →') + '</button>' +
          '<span class="dg-dots">' + (paso + 1) + ' / ' + ps.length + '</span>' +
        '</div>' +
      '</div>');

    document.getElementById('dgOpts').addEventListener('click', function (e) {
      var btn = e.target.closest('.dg-opt');
      if (!btn) return;
      var v = btn.getAttribute('data-v');
      if (s.multi) {
        var arr = draft[s.key] || [];
        var i = arr.indexOf(v);
        if (i === -1) arr.push(v); else arr.splice(i, 1);
        draft[s.key] = arr;
      } else {
        draft[s.key] = v;
      }
      renderPaso();
    });

    var freeEl = document.getElementById('dgFree');
    if (freeEl) freeEl.addEventListener('input', function () { draft[s.free] = this.value; });

    var back = document.getElementById('dgBack');
    if (back) back.onclick = function () { paso--; renderPaso(); };
    document.getElementById('dgNext').onclick = function () { paso++; renderPaso(); };
  }

  // ── Resultado: ruta + plan + lista de espera ────────────────────────────────
  function zonaFrase(z) {
    if (z === 'urbana') return 'zona urbana';
    if (z === 'rural') return 'zona rural';
    return 'sin preferencia de zona';
  }

  // Copy de la lista de espera. Tres variantes reales, no una plantilla con el
  // nombre sustituido: a un directivo no le sirve "todo el mundo estudia
  // normativa" — la normativa es justamente lo suyo.
  //
  // Decisión deliberada: se dice que el banco SERÁ PAGO. Una lista de espera que
  // calla el precio mide "¿te gustaría algo gratis?", y a eso todo el mundo dice
  // que sí; la señal de demanda quedaría inservible para decidir qué construir.
  function waitCopy(meta, area) {
    if (meta.area) {
      // Eligió "Otra" sin escribir cuál: se habla en genérico y el mensaje de
      // WhatsApp le pide el nombre del área, que es justo el dato que falta.
      var nombrada = !!area;
      return {
        titulo: 'Falta lo tuyo: ' + (nombrada ? area : 'tu área'),
        comun: 'Pedagogía y normativa las estudia todo el mundo — y las tienes gratis acá. ' +
               'El concurso se desempata en tu área, y ahí no hay nada bueno gratis.',
        que: 'Estoy armando los bancos por área' + (nombrada ? ', y <strong>' + esc(area) + '</strong> es candidata' : '') +
             ': preguntas tipo examen con la explicación de por qué cada distractor está mal, igual que en el curso. ' +
             'Será pago — escribirlo bien toma semanas por área, y solo alcanzo a hacer 3 antes de las inscripciones.',
        pedido: nombrada
          ? 'Dime que quieres ' + esc(area) + ', y de paso qué tema se te atraviesa. Lo uso para armar las preguntas.'
          : 'Dime cuál es tu área y qué tema se te atraviesa. Lo uso para armar las preguntas.',
        cta: nombrada ? 'Quiero el banco de ' + area + ' →' : 'Quiero el banco de mi área →',
        waAsunto: nombrada ? 'Quiero el banco de ' + area : 'Quiero el banco de mi área',
        waTema: nombrada ? 'El tema que más se me atraviesa es: ' : 'Mi área es ___ y el tema que más se me atraviesa es: '
      };
    }
    if (meta.directivo) {
      return {
        titulo: 'Falta lo tuyo: los casos de gestión',
        comun: 'Las competencias pedagógicas las estudia todo aspirante — y las tienes gratis acá. ' +
               'Tu prueba se decide en los casos de gestión directiva: convivencia, personal, recursos, ' +
               'relación con la secretaría. Ahí no hay nada bueno gratis.',
        que: 'Estoy armando el banco de casos para <strong>' + esc(meta.label) + '</strong>: situaciones tipo ' +
             'examen con la explicación de por qué cada distractor está mal, igual que en el curso. Será pago — ' +
             'escribirlo bien toma semanas por cargo, y alcanzo a hacer muy pocos antes de las inscripciones.',
        pedido: 'Dime que quieres el de ' + esc(meta.label) + ', y de paso qué situación se te atraviesa. La uso para armar los casos.',
        cta: 'Quiero el banco de ' + meta.label + ' →',
        waAsunto: 'Quiero el banco de casos para ' + meta.label,
        waTema: 'La situación de gestión que más se me atraviesa es: '
      };
    }
    return {
      titulo: 'Falta lo tuyo: los casos de tu cargo',
      comun: 'Las competencias pedagógicas las estudia todo aspirante — y las tienes gratis acá. ' +
             'Tu prueba se decide en los casos propios de tu cargo, y ahí no hay nada bueno gratis.',
      que: 'Estoy armando el banco de casos para <strong>' + esc(meta.label) + '</strong>: situaciones tipo ' +
           'examen con la explicación de por qué cada distractor está mal, igual que en el curso. Será pago — ' +
           'escribirlo bien toma semanas por cargo, y alcanzo a hacer muy pocos antes de las inscripciones.',
      pedido: 'Dime que quieres el de ' + esc(meta.label) + ', y de paso qué caso se te atraviesa. Lo uso para armar las preguntas.',
      cta: 'Quiero el banco de ' + meta.label + ' →',
      waAsunto: 'Quiero el banco de casos para ' + meta.label,
      waTema: 'El caso que más se me atraviesa es: '
    };
  }

  // Devuelve null si eligió "Otra" y no escribió nada: el copy no puede decir
  // "Quiero el banco de Otra (sin especificar)".
  function areaFinal(p) {
    if (!p.area) return null;
    if (String(p.area).indexOf('Otra') === 0) return (p.area_otra || '').trim() || null;
    return p.area;
  }

  function renderResultado() {
    var perfil = {
      cargo: draft.cargo,
      area: draft.area || null,
      area_otra: draft.area_otra || null,
      zona: draft.zona,
      tiempo: draft.tiempo,
      flojo: draft.flojo || [],
      ts: Date.now()
    };
    savePerfil(perfil);
    marcarVisita();

    var meta = cargoMeta(perfil.cargo);
    var area = areaFinal(perfil);
    var wc = waitCopy(meta, area);

    // Señal de demanda a GA4 — esto es lo que decide qué áreas se construyen.
    track('diagnostic_complete', {
      cargo: perfil.cargo,
      // 'otra_sin_especificar' se distingue de 'n/a' (cargos sin área) a propósito:
      // si aparece mucho, el selector de áreas se está quedando corto.
      area: area || (meta.area ? 'otra_sin_especificar' : 'n/a'),
      zona: perfil.zona,
      tiempo: perfil.tiempo,
      debilidades: perfil.flojo.join(',') || 'ninguna'
    });
    if (WAITLIST_ENDPOINT) {
      try {
        fetch(WAITLIST_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(perfil)
        }).catch(function () {});
      } catch (e) {}
    }

    var ruta = construirRuta(perfil);
    var prioridad = ordenarFases(perfil);
    var razones = {};
    prioridad.forEach(function (f, i) {
      razones[f.fase] = i === 0
        ? 'Empiezas aquí: es tu punto más débil según lo que marcaste y tus resultados.'
        : (i === prioridad.length - 1 ? 'Lo dejas para el final: aquí ya vas bien.' : '');
    });
    razones['conoce-examen'] = 'Siempre primero: sin entender el formato, estudiar contenido rinde poco.';
    razones['final'] = 'Cierre: simulacro integral cronometrado y logística del día del examen.';

    var items = ruta.map(function (f, i) {
      var n = lessonsDeFase(f).length;
      var why = razones[f] || '';
      return '<li class="' + (i === 1 ? 'dg-focus' : '') + '"><strong>' + esc(tituloFase(f)) + '</strong> · ' + n + ' lecciones' +
        (why ? '<span class="dg-why">' + esc(why) + '</span>' : '') + '</li>';
    }).join('');

    var t = TIEMPOS.filter(function (x) { return x.v === perfil.tiempo; })[0] || TIEMPOS[1];
    var total = (typeof ALL_IDS !== 'undefined') ? ALL_IDS.length : 31;
    var semanas = Math.ceil(total / t.porSemana);
    var sig = siguienteLeccion(perfil);

    var html =
      '<h3>🧭 Tu ruta</h3>' +
      '<p style="color:var(--muted);line-height:1.6">' +
        'Perfil: <strong style="color:var(--text)">' + esc(meta.label) + '</strong>' +
        (area ? ' · <strong style="color:var(--text)">' + esc(area) + '</strong>' : '') +
        ' · zona ' + esc(perfil.zona) + '.' +
      '</p>' +
      '<ol class="dg-rank">' + items + '</ol>' +
      '<div class="dg-plan">' +
        '<strong>Tu plan:</strong> ' + t.porSemana + ' lecciones por semana → terminas el curso completo en ' +
        '<strong>~' + semanas + ' semanas</strong>. Las inscripciones se proyectan para noviembre–diciembre de 2026 ' +
        'y la fecha de la prueba escrita todavía no es oficial, así que vas con margen.' +
        (sig ? '<br><a class="dg-go" href="#" id="dgGo">Empezar por ' + esc(sig.id) + ' — ' + esc(sig.title) + ' →</a>' : '') +
      '</div>' +
      (meta.directivo
        ? '<p style="font-size:13px;color:var(--muted);line-height:1.6">Como aspirante a directivo, tu puntaje mínimo hoy es <strong>70/100</strong> (hay un proyecto de decreto que propone bajarlo a 60 — revisa Novedades). Tu módulo de área disciplinar queda al final: no compites por ella.</p>'
        : '') +
      '<div class="dg-wait">' +
        '<div class="dg-wait-kicker">🎯 Lo que sigue</div>' +
        '<div class="dg-wait-title">' + esc(wc.titulo) + '</div>' +
        '<p class="dg-wait-p">' + wc.comun + '</p>' +
        '<p class="dg-wait-p">' + wc.que + '</p>' +
        '<p class="dg-wait-p">' + wc.pedido + '</p>' +
        '<a class="dg-go" id="dgWait" href="' + WA + '?text=' +
          encodeURIComponent('Hola Juan Camilo, tomé el curso del Concurso Docente. ' + wc.waAsunto +
            ' (' + (meta.area ? meta.label.toLowerCase() + ', ' : '') + zonaFrase(perfil.zona) + '). ' +
            wc.waTema) +
        '" target="_blank" rel="noopener">' + esc(wc.cta) + '</a>' +
        '<div class="dg-wait-note">Es para saber qué construyo primero. Hoy no estás comprando nada.</div>' +
      '</div>' +
      '<p style="margin-top:18px;font-size:12px;color:var(--muted)">Tu perfil se guarda solo en este navegador (localStorage). ' +
        'Puedes rehacer el diagnóstico cuando quieras desde 🧭 Mi ruta.</p>';

    abrirDrawer('Tu ruta personalizada', '🧭', html,
      '<button class="nav-btn" id="dgRedo" style="width:auto;padding:0 16px">↻ Rehacer diagnóstico</button>');

    var go = document.getElementById('dgGo');
    if (go && sig) go.onclick = function (e) {
      e.preventDefault();
      track('diagnostic_start_lesson', { lesson_id: sig.id });
      if (typeof openDrawer === 'function') openDrawer(sig.id);
    };
    var wait = document.getElementById('dgWait');
    if (wait) wait.onclick = function () {
      track('waitlist_click', { cargo: perfil.cargo, area: area || 'n/a' });
    };
    var redo = document.getElementById('dgRedo');
    if (redo) redo.onclick = function () { draft = {}; paso = 0; renderPaso(); };
  }

  // ── Entrada pública ─────────────────────────────────────────────────────────
  window.openDiagnostico = function (forzarWizard) {
    var p = getPerfil();
    if (p && !forzarWizard) {
      draft = {
        cargo: p.cargo, area: p.area, area_otra: p.area_otra,
        zona: p.zona, tiempo: p.tiempo, flojo: p.flojo || []
      };
      renderResultado();
    } else {
      draft = {}; paso = 0;
      track('diagnostic_start', {});
      renderPaso();
    }
  };

  // ── Botón en la barra de navegación ─────────────────────────────────────────
  function addBtn() {
    if (document.getElementById('diagBtn')) return;
    var bar = document.getElementById('tocBar');
    if (!bar) return;
    var btn = document.createElement('button');
    btn.id = 'diagBtn';
    btn.textContent = '🧭 Mi ruta';
    btn.onclick = function () { window.openDiagnostico(false); };
    var ref = document.getElementById('dashboardBtn') || document.getElementById('themeBtn');
    if (ref) bar.insertBefore(btn, ref); else bar.appendChild(btn);
  }
  addBtn();

  // ── Nudge suave: si ya tiene perfil y lleva días sin volver, se lo recuerda ──
  // Es la versión gratuita y honesta de las "alertas de estudio" del plan Pro:
  // no manda nada, solo reacciona cuando la persona vuelve.
  (function nudge() {
    var p = getPerfil();
    if (!p) { marcarVisita(); return; }
    var dias = diasSinEstudiar();
    marcarVisita();
    if (dias === null || dias < 3) return;
    var sig = siguienteLeccion(p);
    if (!sig) return;
    var host = document.querySelector('.toc-bar');
    if (!host || !host.parentNode) return;
    var div = document.createElement('div');
    div.className = 'dg-nudge';
    div.innerHTML = 'Llevas <strong>' + dias + ' días</strong> sin estudiar. Según tu ruta te toca ' +
      '<strong>' + esc(sig.id) + ' — ' + esc(sig.title) + '</strong>. ' +
      '<a href="#" id="dgNudgeGo" style="color:var(--claude);font-weight:700;text-decoration:none">Retomar ahí →</a>';
    host.parentNode.insertBefore(div, host.nextSibling);
    track('nudge_shown', { days_away: dias, lesson_id: sig.id });
    var a = document.getElementById('dgNudgeGo');
    if (a) a.onclick = function (e) {
      e.preventDefault();
      track('nudge_click', { days_away: dias, lesson_id: sig.id });
      if (typeof openDrawer === 'function') openDrawer(sig.id);
    };
  })();

})();
