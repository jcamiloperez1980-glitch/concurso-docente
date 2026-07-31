// ============================================================
// PRUÉBATE — pregunta de muestra en el hero
// El tráfico frío de redes rebotaba en ~27s contra ~1min23s del tráfico
// directo: llegaba a una página que pedía compromiso (31 lecciones) antes
// de entregar nada. Esto pone una pregunta real arriba del todo, respondible
// sin registro, y revela la lógica de distractores del ICFES — que es el
// diferenciador del curso y estaba invisible hasta abrir una lección.
// Módulo autocontenido: no toca app.js.
// ============================================================
(function () {
  'use strict';

  // Pregunta 3 del simulacro de evaluación formativa (P2). Se eligió porque
  // cualquier docente de aula se reconoce en el caso y el "ajá" es inmediato.
  var Q = {
    enunciado: 'Una docente observa que en sus evaluaciones escritas obtienen bajo desempeño casi siempre los mismos estudiantes, aunque participan bien en las clases. La interpretación más pertinente desde la evaluación formativa es que',
    correcta: 2,
    opciones: [
      {
        texto: 'el grupo presenta un nivel heterogéneo que exige ajustar la exigencia de las evaluaciones.',
        tipo: 'absurda plausible',
        porque: 'Bajarle el nivel a la prueba no dice nada nuevo sobre lo que esos estudiantes sí saben. Cambia el termómetro, no la fiebre.'
      },
      {
        texto: 'esos estudiantes requieren un plan de refuerzo en hábitos de estudio y mayor dedicación en casa.',
        tipo: 'opuesta al principio',
        porque: 'Suena responsable, y por eso es la trampa más elegida. Pone la causa en el estudiante sin ninguna evidencia: el caso dice que participan bien, y eso apunta al instrumento, no al hábito.'
      },
      {
        texto: 'conviene revisar si el instrumento escrito está capturando lo que esos estudiantes sí saben, y diversificar las formas de evaluar.',
        tipo: null,
        porque: 'La pista estaba en el contraste: participan bien pero fallan por escrito. El Decreto 1290 es explícito en que la evaluación informa para mejorar la enseñanza, no solo para calificar al estudiante.'
      },
      {
        texto: 'es necesario aplicar con más frecuencia la misma evaluación para consolidar los aprendizajes.',
        tipo: 'verdadero pero incompleto',
        porque: 'Repetir el mismo instrumento que ya está fallando no aporta información nueva. Más frecuencia no es más evidencia.'
      }
    ]
  };

  var ANSWERED_KEY = 'ral_pruebate_answered';

  function track(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params || {});
  }

  // Quien ya arrancó el curso no necesita la muestra: sería ruido sobre
  // contenido que ya decidió consumir. Quien ya respondió la pregunta en una
  // visita anterior tampoco: repetirla con la respuesta ya revelada quema
  // el efecto sorpresa sin aportar nada nuevo.
  function yaEmpezo() {
    try {
      if (localStorage.getItem(ANSWERED_KEY)) return true;
      if (typeof getCompleted === 'function' && getCompleted().length > 0) return true;
      return !!localStorage.getItem('concursoDocente_perfil');
    } catch (e) { return false; }
  }
  if (yaEmpezo()) return;

  var css =
    '.pb-card{max-width:640px;margin:30px auto 0;padding:22px;text-align:left;background:var(--card);' +
    'border:1px solid var(--border);border-left:3px solid var(--claude);border-radius:16px;' +
    'animation:fadeInUp 1s var(--ease)}' +
    '.pb-kicker{font-family:"JetBrains Mono",monospace;font-size:10.5px;font-weight:700;letter-spacing:.12em;' +
    'text-transform:uppercase;color:var(--claude);margin-bottom:10px}' +
    '.pb-q{font-size:15px;line-height:1.6;color:var(--text);font-weight:600;margin-bottom:16px}' +
    '.pb-opt{display:block;width:100%;text-align:left;padding:12px 14px;margin-bottom:8px;border-radius:10px;' +
    'background:var(--card-2);border:1px solid var(--border);color:var(--muted);font-size:13.5px;line-height:1.5;' +
    'font-family:inherit;cursor:pointer;transition:.18s}' +
    '.pb-opt:hover:not(:disabled){border-color:var(--claude);color:var(--text)}' +
    '.pb-opt:disabled{cursor:default}' +
    '.pb-opt .pb-l{font-weight:800;color:var(--text);margin-right:7px}' +
    '.pb-opt.pb-ok{border-color:#16a34a;background:rgba(22,163,74,.10);color:var(--text)}' +
    '.pb-opt.pb-no{border-color:#dc2626;background:rgba(220,38,38,.08);color:var(--text)}' +
    '.pb-opt.pb-dim{opacity:.45}' +
    '.pb-fb{margin-top:14px;padding:14px 16px;border-radius:10px;background:var(--card-2);' +
    'border:1px solid var(--border);font-size:13.5px;line-height:1.65;color:var(--muted)}' +
    '.pb-fb strong{color:var(--text)}' +
    '.pb-verdict{font-weight:800;font-size:14px;margin-bottom:8px;display:block}' +
    '.pb-tec{margin-top:10px;padding-top:10px;border-top:1px solid var(--border);font-size:13px}' +
    '.pb-tec .pb-tipo{color:var(--claude);font-weight:800}' +
    '.pb-cta{display:inline-flex;align-items:center;gap:8px;margin-top:14px;padding:11px 22px;border-radius:100px;' +
    'border:none;font-family:inherit;font-size:13.5px;font-weight:800;color:#fff;cursor:pointer;' +
    'background:linear-gradient(135deg,var(--claude),var(--claude-2));box-shadow:0 8px 24px var(--claude-glow)}' +
    '.pb-cta:hover{filter:brightness(1.07)}' +
    '.pb-alt{display:block;margin-top:10px;font-size:12.5px;color:var(--dim);text-decoration:none;font-weight:600}' +
    '.pb-alt:hover{color:var(--claude)}' +
    '@media(max-width:600px){.pb-card{padding:18px;margin-top:22px;border-radius:14px}.pb-q{font-size:14.5px}}';

  var st = document.createElement('style');
  st.id = 'pbCss';
  st.textContent = css;
  document.head.appendChild(st);

  var LETRAS = ['A', 'B', 'C', 'D'];

  var card = document.createElement('div');
  card.className = 'pb-card';
  card.innerHTML =
    '<div class="pb-kicker">✍️ Pruébate antes de empezar</div>' +
    '<div class="pb-q">' + Q.enunciado + '</div>' +
    '<div id="pbOpts">' +
      Q.opciones.map(function (o, i) {
        return '<button class="pb-opt" data-i="' + i + '">' +
               '<span class="pb-l">' + LETRAS[i] + '.</span>' + o.texto + '</button>';
      }).join('') +
    '</div>' +
    '<div id="pbFb"></div>';

  function responder(i) {
    var acerto = i === Q.correcta;
    var elegida = Q.opciones[i];

    document.querySelectorAll('#pbOpts .pb-opt').forEach(function (b) {
      var bi = +b.dataset.i;
      b.disabled = true;
      if (bi === Q.correcta) b.classList.add('pb-ok');
      else if (bi === i) b.classList.add('pb-no');
      else b.classList.add('pb-dim');
    });

    var html =
      '<div class="pb-fb">' +
        '<span class="pb-verdict" style="color:' + (acerto ? '#16a34a' : '#dc2626') + '">' +
          (acerto ? '✔ Correcto. Era la C.' : '✗ Era la C, no la ' + LETRAS[i] + '.') +
        '</span>' +
        Q.opciones[Q.correcta].porque;

    if (!acerto) {
      html += '<div class="pb-tec">🔍 <strong>La ' + LETRAS[i] + ' es un distractor de tipo ' +
              '<span class="pb-tipo">' + elegida.tipo + '</span>.</strong> ' + elegida.porque + '</div>';
    } else {
      html += '<div class="pb-tec">🔍 <strong>Las otras tres no eran relleno.</strong> ' +
              'La B es la trampa más elegida: suena responsable, pero culpa al estudiante sin evidencia. ' +
              'Así están diseñadas las 346 preguntas del curso.</div>';
    }

    html +=
      '<button class="pb-cta" id="pbCta">Seguir practicando →</button>' +
      '<a class="pb-alt" href="#fase-1" id="pbAlt">o ver el curso completo, gratis y sin registro</a>' +
      '</div>';

    document.getElementById('pbFb').innerHTML = html;
    track('pruebate_answer', {
      opcion: LETRAS[i],
      acerto: acerto,
      tipo_distractor: elegida.tipo || 'correcta'
    });
    try { localStorage.setItem(ANSWERED_KEY, '1'); } catch (e) {}

    document.getElementById('pbCta').onclick = function () {
      track('pruebate_cta', { destino: 'P1', acerto: acerto });
      if (typeof openDrawer === 'function') openDrawer('P1');
    };
    document.getElementById('pbAlt').onclick = function () {
      track('pruebate_cta', { destino: 'curso', acerto: acerto });
    };
  }

  // ── Montaje: justo debajo del título, antes de las cifras del currículum ──
  function montar() {
    var meta = document.querySelector('.hero-meta');
    if (!meta || !meta.parentNode) return false;
    meta.parentNode.insertBefore(card, meta);
    card.querySelector('#pbOpts').addEventListener('click', function (e) {
      var b = e.target.closest('.pb-opt');
      if (b && !b.disabled) responder(+b.dataset.i);
    });
    track('pruebate_shown', {});
    return true;
  }

  if (!montar()) {
    document.addEventListener('DOMContentLoaded', montar);
  }
})();
