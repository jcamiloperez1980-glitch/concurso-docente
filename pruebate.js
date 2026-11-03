// ============================================================
// PRUÉBATE — pregunta rotativa de muestra en el hero
// Banco de 5 preguntas situacionales. Cada visita muestra una
// que el usuario no haya visto. Cuando agota el banco, se oculta.
// Módulo autocontenido: no toca app.js.
// ============================================================
(function () {
  'use strict';

  var BANCO = [
    {
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
    },
    {
      enunciado: 'Un rector revisa los resultados de las Pruebas Saber 11 y nota que el área de lectura crítica bajó 12 puntos respecto al año anterior en todos los grupos. La primera acción pertinente del rector, conforme al liderazgo pedagógico, es',
      correcta: 1,
      opciones: [
        {
          texto: 'contratar un taller externo de comprensión lectora para los estudiantes de grado 11.',
          tipo: 'verdadero pero incompleto',
          porque: 'Un taller externo puede ser útil, pero delega la solución sin involucrar a los docentes ni diagnosticar la causa del descenso.'
        },
        {
          texto: 'convocar al consejo académico para analizar las prácticas de lectura en todas las áreas y formular ajustes al plan de mejoramiento.',
          tipo: null,
          porque: 'Liderazgo pedagógico: diagnóstico participativo con el equipo docente antes de intervenir. La caída en todos los grupos señala un problema sistémico, no de un aula.'
        },
        {
          texto: 'solicitar a los docentes de lengua castellana que incrementen las horas de lectura en sus clases.',
          tipo: 'opuesta al principio',
          porque: 'La lectura crítica es transversal a todas las áreas, no exclusiva de lengua castellana. Además, más horas sin cambio de enfoque no ataca la causa.'
        },
        {
          texto: 'implementar simulacros semanales de Saber 11 durante el último trimestre del año.',
          tipo: 'absurda plausible',
          porque: 'Entrenar para la prueba sin modificar las prácticas de aula sacrifica formación por puntaje. Es la respuesta que suena eficiente pero esquiva el problema de fondo.'
        }
      ]
    },
    {
      enunciado: 'Una docente de primaria en zona rural tiene en su aula multigrado estudiantes de los grados 2.°, 3.° y 4.° con ritmos de aprendizaje muy distintos. Al planear una clase de matemáticas sobre fracciones, la estrategia más pertinente es',
      correcta: 3,
      opciones: [
        {
          texto: 'enseñar el tema al nivel del grado más avanzado y asignar ejercicios de repaso a los demás.',
          tipo: 'opuesta al principio',
          porque: 'Planear para el grado más alto y dejar que los demás "repasen" ignora que cada grupo necesita un punto de entrada distinto. No es diferenciación, es exclusión pasiva.'
        },
        {
          texto: 'dividir la clase en tres grupos fijos según el grado y enseñar el mismo contenido tres veces.',
          tipo: 'verdadero pero incompleto',
          porque: 'Separar por grado y repetir la clase tres veces triplica el esfuerzo sin aprovechar la interacción entre niveles, que es la fortaleza del aula multigrado.'
        },
        {
          texto: 'aplazar las fracciones para los grados menores hasta que dominen las operaciones básicas.',
          tipo: 'absurda plausible',
          porque: 'Las fracciones tienen representaciones accesibles desde grado 2.° (repartir en partes iguales). Aplazarlas crea una brecha artificial que no corresponde al currículo.'
        },
        {
          texto: 'diseñar una actividad con un contexto común y niveles de complejidad diferentes según el grado, permitiendo que los estudiantes más avanzados apoyen a los demás.',
          tipo: null,
          porque: 'Un contexto compartido (por ejemplo, repartir alimentos) con tareas escalonadas respeta los DBA de cada grado y aprovecha la tutoría entre pares, que es una fortaleza del modelo multigrado reconocida por el MEN.'
        }
      ]
    },
    {
      enunciado: 'Un orientador escolar recibe el reporte de que un estudiante de grado 9.° ha faltado 15 días consecutivos sin justificación. Los acudientes no responden las llamadas de la institución. La actuación más pertinente del orientador, conforme a la Ley 1098 de Infancia y Adolescencia, es',
      correcta: 0,
      opciones: [
        {
          texto: 'realizar visita domiciliaria para verificar la situación del estudiante y, si se identifica riesgo, activar la ruta de atención integral con el ICBF.',
          tipo: null,
          porque: 'La inasistencia prolongada sin contacto con la familia es un indicador de riesgo. La Ley 1098 (art. 44) obliga a las instituciones educativas a detectar y reportar situaciones que amenacen los derechos del menor, y la ruta de atención integral es el mecanismo.'
        },
        {
          texto: 'enviar una carta certificada al acudiente informando que el estudiante perderá el año por inasistencia.',
          tipo: 'opuesta al principio',
          porque: 'Amenazar con pérdida del año sin verificar la situación del menor prioriza lo administrativo sobre la protección integral. La prioridad es saber si el estudiante está bien.'
        },
        {
          texto: 'esperar a que se cumpla el porcentaje de inasistencia del manual de convivencia para iniciar el debido proceso.',
          tipo: 'verdadero pero incompleto',
          porque: 'El debido proceso de inasistencia existe, pero esperar pasivamente cuando hay indicadores de riesgo viola el deber de protección. Lo urgente no es el porcentaje, es la seguridad del menor.'
        },
        {
          texto: 'reportar la situación al comité de convivencia escolar para que defina la sanción correspondiente.',
          tipo: 'absurda plausible',
          porque: 'La inasistencia prolongada no es un problema de convivencia ni amerita sanción. Tratarla como falta disciplinaria revictimiza al estudiante en lugar de protegerlo.'
        }
      ]
    },
    {
      enunciado: 'Un docente de secundaria descubre que tres estudiantes copiaron sus respuestas de una prueba parcial a través de un grupo de WhatsApp durante el examen. Según los principios del debido proceso y la Ley 1620, la actuación más pertinente del docente es',
      correcta: 2,
      opciones: [
        {
          texto: 'anular la prueba de los tres estudiantes y asignarles la nota mínima sin posibilidad de recuperación.',
          tipo: 'opuesta al principio',
          porque: 'Anular sin escuchar vulnera el debido proceso (Decreto 1075). El estudiante tiene derecho a ser oído antes de cualquier consecuencia académica.'
        },
        {
          texto: 'ignorar el incidente para evitar un conflicto con los acudientes y aplicar la prueba de nuevo a todo el grupo.',
          tipo: 'absurda plausible',
          porque: 'Repetir la prueba a todos penaliza a quienes respondieron honestamente. Ignorar la falta envía el mensaje de que la deshonestidad académica no tiene consecuencias.'
        },
        {
          texto: 'dialogar con los estudiantes para establecer los hechos, aplicar el protocolo del manual de convivencia y ofrecer una oportunidad de demostrar el aprendizaje de otra forma.',
          tipo: null,
          porque: 'La Ley 1620 y su Decreto 1965 establecen que las situaciones de convivencia (tipo I) se atienden con diálogo restaurativo. El debido proceso exige escuchar antes de decidir, y la evaluación formativa permite verificar el aprendizaje por otro medio.'
        },
        {
          texto: 'remitir el caso directamente a coordinación de convivencia y desentenderse del seguimiento.',
          tipo: 'verdadero pero incompleto',
          porque: 'Remitir es parte del protocolo, pero el docente no se desentiende: sigue siendo responsable del seguimiento pedagógico y de la evaluación. Delegar todo fragmenta la atención.'
        }
      ]
    }
  ];

  var LETRAS = ['A', 'B', 'C', 'D'];
  var SEEN_KEY = 'ral_pruebate_seen';

  function track(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params || {});
  }

  function getSeen() {
    try {
      var raw = localStorage.getItem(SEEN_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function markSeen(idx) {
    try {
      var seen = getSeen();
      if (seen.indexOf(idx) === -1) seen.push(idx);
      localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
    } catch (e) {}
  }

  function pickQuestion() {
    var seen = getSeen();
    var unseen = [];
    for (var i = 0; i < BANCO.length; i++) {
      if (seen.indexOf(i) === -1) unseen.push(i);
    }
    if (unseen.length === 0) return -1;
    return unseen[Math.floor(Math.random() * unseen.length)];
  }

  function yaEmpezo() {
    try {
      if (typeof getCompleted === 'function' && getCompleted().length > 0) return true;
      return !!localStorage.getItem('concursoDocente_perfil');
    } catch (e) { return false; }
  }
  if (yaEmpezo()) return;

  var qIdx = pickQuestion();
  if (qIdx === -1) return;
  var Q = BANCO[qIdx];

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
    '@media(max-width:600px){.pb-card{padding:14px;margin-top:14px;border-radius:14px}' +
    '.pb-q{font-size:13.5px;line-height:1.5;margin-bottom:12px}' +
    '.pb-opt{padding:9px 11px;margin-bottom:6px;font-size:12.5px;line-height:1.4}}';

  var st = document.createElement('style');
  st.id = 'pbCss';
  st.textContent = css;
  document.head.appendChild(st);

  var letraCorrecta = LETRAS[Q.correcta];

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
          (acerto ? '✔ Correcto. Era la ' + letraCorrecta + '.' : '✗ Era la ' + letraCorrecta + ', no la ' + LETRAS[i] + '.') +
        '</span>' +
        Q.opciones[Q.correcta].porque;

    if (!acerto) {
      html += '<div class="pb-tec">🔍 <strong>La ' + LETRAS[i] + ' es un distractor de tipo ' +
              '<span class="pb-tipo">' + elegida.tipo + '</span>.</strong> ' + elegida.porque + '</div>';
    } else {
      html += '<div class="pb-tec">🔍 <strong>Las otras tres no eran relleno.</strong> ' +
              'Cada distractor tiene un tipo y una razón específica de por qué está ahí. ' +
              'Así están diseñadas las 430+ preguntas del curso.</div>';
    }

    html += '<div id="pbCapSlot"></div>' +
      '<button class="pb-cta" id="pbCta">Seguir practicando →</button>' +
      '<a class="pb-alt" href="#phase-' + PHASES[0].id + '" id="pbAlt">o ver el curso completo, gratis y sin registro</a>' +
      '</div>';

    document.getElementById('pbFb').innerHTML = html;

    if (typeof window.bloqueCaptura === 'function') {
      var cap = window.bloqueCaptura('pruebate', { acerto: acerto });
      if (cap) document.getElementById('pbCapSlot').appendChild(cap);
    }

    track('pruebate_answer', {
      opcion: LETRAS[i],
      acerto: acerto,
      tipo_distractor: elegida.tipo || 'correcta',
      pregunta: qIdx
    });
    markSeen(qIdx);

    document.getElementById('pbCta').onclick = function () {
      track('pruebate_cta', { destino: 'P1', acerto: acerto });
      if (typeof openDrawer === 'function') openDrawer('P1');
    };
    document.getElementById('pbAlt').onclick = function () {
      track('pruebate_cta', { destino: 'curso', acerto: acerto });
    };
  }

  function montar() {
    var meta = document.querySelector('.hero-meta');
    if (!meta || !meta.parentNode) return false;
    meta.parentNode.insertBefore(card, meta);
    card.querySelector('#pbOpts').addEventListener('click', function (e) {
      var b = e.target.closest('.pb-opt');
      if (b && !b.disabled) responder(+b.dataset.i);
    });
    track('pruebate_shown', { pregunta: qIdx });
    return true;
  }

  if (!montar()) {
    document.addEventListener('DOMContentLoaded', montar);
  }
})();
