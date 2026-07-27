// ============================================================
// GLOSARIO — leyendas breves con fuente verificada
// Marca la PRIMERA aparición de cada término en cada lección y la vuelve
// desplegable. Colapsado por defecto: la lección se ve igual hasta que el
// usuario toca un término. No modifica content.js ni app.js — hace
// monkey-patch de openDrawer, igual que examen-final.js y dashboard.js.
//
// Todas las URLs fueron abiertas y verificadas antes de incluirse (jul 2026).
// Si alguna deja de responder, corrígela SOLO aquí: se propaga a todo el curso.
// ============================================================
(function () {
  'use strict';

  // t: alternativas de escritura del término (se marca la primera que aparezca)
  // def: qué es (2-3 líneas) · aula: cómo se ve en la práctica · src: fuente verificada
  var TERMINOS = [
    {
      t: ['zona de desarrollo próximo', 'zona de desarrollo proximo', 'ZDP'],
      titulo: 'Zona de desarrollo próximo (Vygotsky)',
      def: 'La distancia entre lo que el estudiante ya logra solo y lo que logra con ayuda de alguien más capaz. La enseñanza es más eficaz cuando apunta a esa franja: ni a lo que ya domina, ni a lo que aún le queda lejos.',
      aula: 'Si resuelve el ejercicio con una pista tuya pero no sin ella, ahí está su ZDP: ese es el nivel al que debes enseñar.',
      src: { t: 'El concepto de zona de desarrollo próximo — Pensando Psicología (U. Cooperativa de Colombia)', u: 'https://revistas.ucc.edu.co/index.php/pe/article/view/775', tipo: 'Artículo · acceso abierto' }
    },
    {
      t: ['andamiaje'],
      titulo: 'Andamiaje (scaffolding)',
      def: 'Apoyo temporal que el docente ofrece dentro de la zona de desarrollo próximo y que retira progresivamente a medida que el estudiante gana autonomía. Su rasgo esencial es que decrece: un apoyo permanente no es andamiaje.',
      aula: 'Modelas el primer ejercicio, acompañas el segundo con preguntas, el tercero lo hace solo.',
      src: { t: 'El concepto de zona de desarrollo próximo — Pensando Psicología (U. Cooperativa de Colombia)', u: 'https://revistas.ucc.edu.co/index.php/pe/article/view/775', tipo: 'Artículo · acceso abierto' }
    },
    {
      t: ['aprendizaje significativo'],
      titulo: 'Aprendizaje significativo (Ausubel)',
      def: 'Lo nuevo se aprende cuando se ancla en lo que el estudiante ya sabe. Exige dos condiciones: material potencialmente significativo y disposición del estudiante a relacionarlo con su estructura cognitiva previa.',
      aula: 'Antes de introducir un tema, indagas qué saben ya: ese saber previo es el gancho del que cuelga lo nuevo.',
      src: { t: 'Guía Docente — Modelo Aceleración del Aprendizaje (MEN)', u: 'https://contenidos.mineducacion.gov.co/ntg/men/archivos/Referentes_Calidad/Modelos_Flexibles/Aceleracion_del_Aprendizaje/Guia_del_docente/Guia%20Docente.pdf', tipo: 'Documento oficial del MEN' }
    },
    {
      t: ['constructivismo', 'constructivista'],
      titulo: 'Constructivismo (Piaget)',
      def: 'El conocimiento no se transmite: el estudiante lo construye activamente al interactuar con el medio, mediante asimilación (integrar lo nuevo a lo que ya tiene) y acomodación (reajustar sus esquemas cuando lo nuevo no encaja).',
      aula: 'El examen premia casi siempre la opción donde el estudiante construye y el docente media, no donde el docente expone y el estudiante recibe.',
      src: { t: 'La teoría constructivista de Jean Piaget y su significación para la pedagogía contemporánea', u: 'https://dialnet.unirioja.es/servlet/articulo?codigo=5802932', tipo: 'Artículo · Dialnet' }
    },
    {
      t: ['metacognición', 'metacognitivo', 'metacognitiva'],
      titulo: 'Metacognición',
      def: 'Que el estudiante piense sobre su propio proceso de aprendizaje: qué estrategia usó, dónde se atascó, qué haría distinto. Es la base de la autorregulación, y se enseña explícitamente.',
      aula: 'Cierras la clase con "¿qué aprendí y cómo lo aprendí?" — no con "¿qué vimos hoy?", que es contenido, no metacognición.',
      src: { t: 'Autorregulación del aprendizaje: una revisión sistemática — Universitas Psychologica (Javeriana)', u: 'https://www.redalyc.org/pdf/647/64732221031.pdf', tipo: 'Revisión sistemática · acceso abierto' }
    },
    {
      t: ['transposición didáctica'],
      titulo: 'Transposición didáctica (Chevallard)',
      def: 'El paso del saber científico ("saber sabio") al saber que efectivamente se enseña en el aula. Simplificar es legítimo y necesario; deformar el concepto en el proceso, no.',
      aula: 'La analogía "la célula es como una fábrica" ayuda, pero si no marcas sus límites, los estudiantes terminan creyendo que la célula tiene chimeneas.',
      src: { t: 'La transposición didáctica: historia de un concepto — Universidad de Caldas', u: 'https://www.redalyc.org/pdf/1341/134116845006.pdf', tipo: 'Artículo colombiano · acceso abierto' }
    },
    {
      t: ['currículo oculto', 'curriculo oculto'],
      titulo: 'Currículo oculto',
      def: 'Todo lo que la escuela enseña sin declararlo: tratos, rutinas, expectativas, ejemplos que eliges, a quién llamas primero. Término acuñado por Philip Jackson (1968).',
      aula: 'Si siempre pides a los niños que carguen las sillas y a las niñas que decoren, eso también se está enseñando — aunque no esté en la malla.',
      src: { t: 'La educación en valores: currículum formal, oculto y temas transversales — Díaz Barriga', u: 'https://www.redalyc.org/pdf/155/15508101.pdf', tipo: 'Artículo · acceso abierto' }
    },
    {
      t: ['aprendizaje basado en problemas', 'ABP'],
      titulo: 'Aprendizaje basado en problemas (ABP)',
      def: 'Se aprende resolviendo un problema auténtico y con sentido, no recibiendo primero la teoría para aplicarla después. El problema es el punto de partida, no el ejercicio final.',
      aula: 'Arrancas con "¿por qué se está secando la quebrada del barrio?" y el contenido de ciencias aparece porque hace falta para responder.',
      src: { t: 'ABP y competencias científicas en grado quinto, Manizales — PANORAMA', u: 'https://www.redalyc.org/journal/3439/343965146008/html/', tipo: 'Estudio colombiano · acceso abierto' }
    },
    {
      t: ['evaluación formativa'],
      titulo: 'Evaluación formativa',
      def: 'Evaluar para ajustar la enseñanza y el aprendizaje mientras todavía se puede hacer algo, no para certificar un resultado al final. Su propósito es informar decisiones pedagógicas, no calificar.',
      aula: 'Si el 60 % reprobó, la evaluación formativa te dice que revises tu enseñanza y el instrumento — no que programes la recuperación.',
      src: { t: 'La evaluación formativa del aprendizaje en el aula — Martínez Rizo, RMIE', u: 'https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1405-66662012000300008', tipo: 'Revisión · SciELO' }
    },
    {
      t: ['retroalimentación'],
      titulo: 'Retroalimentación efectiva',
      def: 'Información que le dice al estudiante dónde está, hacia dónde va y cuál es el siguiente paso. Es específica, priorizada y accionable — no una nota con una frase motivacional.',
      aula: 'Una fortaleza concreta + una mejora prioritaria + el siguiente paso. Marcar todo en rojo satura y no orienta.',
      src: { t: 'Modelo de retroalimentación para el aprendizaje — RMIE', u: 'https://www.scielo.org.mx/scielo.php?pid=S1405-66662021000100225&script=sci_arttext', tipo: 'Revisión · SciELO' }
    },
    {
      t: ['diseño inverso'],
      titulo: 'Diseño inverso (Wiggins y McTighe)',
      def: 'Se planea al revés: primero el resultado de aprendizaje esperado, luego la evidencia que aceptarías como prueba de que se logró, y solo al final las actividades.',
      aula: 'Antes de elegir la actividad, respóndete: ¿qué tendría que hacer el estudiante para convencerme de que ya lo aprendió?',
      src: { t: 'El diseño instruccional inverso — Education in the Knowledge Society', u: 'https://www.redalyc.org/pdf/5355/535554766002.pdf', tipo: 'Artículo · acceso abierto' }
    },
    {
      t: ['taxonomía de Bloom', 'taxonomia de Bloom'],
      titulo: 'Taxonomía de Bloom (y su revisión)',
      def: 'Clasificación de los niveles de demanda cognitiva. La revisión de Anderson y Krathwohl (2001) los convirtió en verbos: recordar, comprender, aplicar, analizar, evaluar y crear.',
      aula: 'Sirve para calibrar preguntas: "define" se queda en recordar; "decide y justifica" llega a evaluar.',
      src: { t: 'La taxonomía de Bloom y sus actualizaciones — Eduteka (Universidad Icesi)', u: 'https://eduteka.icesi.edu.co/articulos/taxonomiabloomcuadro', tipo: 'Guía colombiana con tablas descargables' }
    },
    {
      t: ['Diseño Universal para el Aprendizaje', 'DUA'],
      titulo: 'DUA — Diseño Universal para el Aprendizaje',
      def: 'Diseñar la clase DESDE EL INICIO con múltiples formas de implicación, de representación y de acción y expresión, para que sirva a todos. No es adaptar después para algunos: eso es ajuste razonable.',
      aula: 'Si preparas la clase estándar y luego adaptas el material para un estudiante, eso no es DUA. DUA es que el diseño original ya contemple la diversidad.',
      src: { t: 'Pautas sobre el DUA — traducción al español del texto del CAST', u: 'https://www.educadua.es/html/dua/pautasDUA/dua_pautas.html', tipo: 'Traducción de la fuente primaria (CAST)' }
    },
    {
      t: ['PIAR'],
      titulo: 'PIAR — Plan Individual de Ajustes Razonables',
      def: 'Instrumento del Decreto 1421 de 2017 que documenta los ajustes que requiere UN estudiante con discapacidad. Se construye con la familia y el equipo de apoyo, y sus apoyos aplican en toda la práctica cotidiana, no solo en las evaluaciones.',
      aula: 'No es un diagnóstico clínico ni una excusa para bajar expectativas: ajusta el camino, nunca la meta de aprendizaje.',
      src: { t: 'Guía de implementación del Decreto 1421 de 2017 — Colombia Aprende', u: 'https://especiales.colombiaaprende.edu.co/emociones-conexion-vital/pdf/L2_R1_Mod2_Guia_apoyo_Decreto_1421.pdf', tipo: 'Documento oficial del MEN' }
    },
    {
      t: ['ajustes razonables'],
      titulo: 'Ajustes razonables',
      def: 'Modificaciones y apoyos concretos que permiten a un estudiante con discapacidad participar en igualdad de condiciones. Cambian el medio (formato, tiempo, modalidad), nunca el aprendizaje esperado.',
      aula: 'Evaluación oral, tiempo adicional o lectura en voz alta de las preguntas SÍ. Simplificar el contenido o bajar la exigencia NO.',
      src: { t: 'Decreto 1421 de 2017 — texto oficial (compilación jurídica ICBF)', u: 'https://www.icbf.gov.co/cargues/avance/compilacion/docs/decreto_1421_2017.htm', tipo: 'Norma oficial' }
    },
    {
      t: ['barreras para el aprendizaje'],
      titulo: 'Barreras para el aprendizaje y la participación',
      def: 'Las barreras están en el ENTORNO —metodologías, actitudes, materiales, organización del aula—, no "en" el estudiante. Es el giro del modelo médico al modelo social de la discapacidad.',
      aula: 'Decir "Juan no aprende porque tiene discapacidad" ubica la causa en el niño. La pregunta correcta es qué del aula le está impidiendo participar.',
      src: { t: 'Guía de implementación del Decreto 1421 de 2017 — Colombia Aprende', u: 'https://especiales.colombiaaprende.edu.co/emociones-conexion-vital/pdf/L2_R1_Mod2_Guia_apoyo_Decreto_1421.pdf', tipo: 'Documento oficial del MEN' }
    },
    {
      t: ['situaciones tipo I', 'situaciones tipo II', 'situaciones tipo III', 'situación tipo'],
      titulo: 'Situaciones tipo I, II y III (Decreto 1965)',
      def: 'Tipo I: conflictos esporádicos mal manejados que no generan daño al cuerpo ni a la salud. Tipo II: agresión escolar, acoso o ciberacoso reiterados, sin llegar a delito. Tipo III: situaciones constitutivas de presunto delito.',
      aula: 'La pregunta clave es doble: ¿es reiterado? y ¿hay daño al cuerpo o delito? Un empujón por primera vez sin lesión es tipo I y lo maneja el docente.',
      src: { t: 'Decreto 1965 de 2013, artículo 40 — texto oficial', u: 'https://www.icbf.gov.co/cargues/avance/compilacion/docs/decreto_1965_2013.htm', tipo: 'Norma oficial' }
    },
    {
      t: ['Ley 1620'],
      titulo: 'Ley 1620 de 2013',
      def: 'Crea el Sistema Nacional de Convivencia Escolar y de formación para los derechos humanos, la educación para la sexualidad y la prevención de la violencia escolar. El Decreto 1965 de 2013 la reglamenta y define las rutas de atención.',
      aula: 'Es la norma que obliga a cada institución a tener comité escolar de convivencia, manual actualizado y ruta de atención integral.',
      src: { t: 'Decreto 1965 de 2013 — reglamenta la Ley 1620', u: 'https://www.icbf.gov.co/cargues/avance/compilacion/docs/decreto_1965_2013.htm', tipo: 'Norma oficial' }
    },
    {
      t: ['comité escolar de convivencia'],
      titulo: 'Comité escolar de convivencia',
      def: 'Instancia obligatoria en cada establecimiento educativo (Ley 1620) que lidera la promoción de la convivencia, la prevención y la activación de los protocolos ante situaciones tipo II y III.',
      aula: 'Ante una situación tipo II no actúas solo: activas el protocolo y el caso pasa por el comité, con seguimiento documentado.',
      src: { t: 'Decreto 1965 de 2013 — texto oficial', u: 'https://www.icbf.gov.co/cargues/avance/compilacion/docs/decreto_1965_2013.htm', tipo: 'Norma oficial' }
    },
    {
      t: ['aprendizaje cooperativo'],
      titulo: 'Aprendizaje cooperativo (Johnson y Johnson)',
      def: 'Trabajo en grupo estructurado sobre cinco elementos: interdependencia positiva, interacción promotora, responsabilidad individual y grupal, habilidades interpersonales y procesamiento grupal. Sin ellos es solo "trabajo en grupo".',
      aula: 'Si uno solo hace la tarea y los demás firman, falló la responsabilidad individual — no basta con sentarlos juntos.',
      src: { t: 'El método de aprendizaje cooperativo y su aplicación en las aulas — Perfiles Educativos', u: 'https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S0185-26982018000300181', tipo: 'Artículo · SciELO' }
    },
    {
      t: ['Escuela Nueva'],
      titulo: 'Escuela Nueva',
      def: 'Modelo colombiano para el aula multigrado rural: guías de aprendizaje diferenciadas por nivel, monitores estudiantiles, trabajo colaborativo y vínculo con la comunidad. Permite ofrecer los cinco grados de primaria con uno a tres docentes.',
      aula: 'En multigrado, el patrón ganador es tema común + actividades diferenciadas por nivel + tutoría entre pares, nunca "la misma clase para todos".',
      src: { t: 'Modelo Escuela Nueva — guías de docente y estudiante descargables (MEN)', u: 'https://www.mineducacion.gov.co/portal/Preescolar-basica-y-media/Modelos-Educativos-Flexibles/340089:Escuela-Nueva', tipo: 'Documento oficial del MEN' }
    }
  ];

  // ── Estilos ────────────────────────────────────────────────────────────────
  var css = ''
    + '.glo{border-bottom:1.5px dotted var(--claude);cursor:pointer;font-weight:inherit;'
    + 'transition:background .18s;padding:0 1px;border-radius:2px}'
    + '.glo:hover{background:color-mix(in oklab,var(--claude) 14%,transparent)}'
    + '.glo::after{content:"?";font-size:.62em;vertical-align:super;font-weight:800;'
    + 'color:var(--claude);margin-left:1px;font-family:Inter,sans-serif}'
    + '.glo.open{background:color-mix(in oklab,var(--claude) 16%,transparent)}'
    + '.glo-card{margin:12px 0 16px;padding:14px 16px;background:var(--card);'
    + 'border:1px solid var(--border);border-left:3px solid var(--claude);border-radius:10px;'
    + 'font-size:13.5px;line-height:1.6;animation:gloIn .22s ease}'
    + '@keyframes gloIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}'
    + '.glo-card .glo-t{font-weight:800;font-size:14px;color:var(--text);'
    + 'display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:7px}'
    + '.glo-card .glo-x{background:none;border:none;color:var(--dim);font-size:16px;'
    + 'cursor:pointer;line-height:1;padding:2px 5px;border-radius:5px;flex-shrink:0}'
    + '.glo-card .glo-x:hover{color:var(--text);background:var(--ui-2)}'
    + '.glo-card .glo-d{color:var(--muted);margin:0 0 9px}'
    + '.glo-card .glo-a{color:var(--text);margin:0 0 11px;padding:8px 11px;'
    + 'background:var(--ui-2);border-radius:7px;font-size:13px}'
    + '.glo-card .glo-a b{color:var(--claude)}'
    + '.glo-card .glo-s{display:flex;align-items:center;gap:7px;font-size:12px;'
    + 'text-decoration:none;color:var(--muted);border-bottom:none;line-height:1.45}'
    + '.glo-card .glo-s:hover{color:var(--claude)}'
    + '.glo-card .glo-s .glo-tipo{display:block;font-family:"JetBrains Mono",monospace;'
    + 'font-size:9.5px;color:var(--faint);letter-spacing:.04em;text-transform:uppercase;margin-top:2px}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  // ── Utilidades ─────────────────────────────────────────────────────────────
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  // Límite de palabra que respeta acentos y ñ (\b es ASCII y rompería "metacognición")
  var L = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9_';
  function reFor(term) {
    return new RegExp('(?<![' + L + '])(' + esc(term) + ')(?![' + L + '])', 'i');
  }

  // Bloque de nivel superior del drawer donde insertar la tarjeta (siempre HTML válido)
  function anchorFor(node, root) {
    var el = node.parentNode;
    while (el && el.parentNode && el.parentNode !== root) el = el.parentNode;
    return (el && el.parentNode === root) ? el : null;
  }

  function track(term) {
    if (typeof gtag === 'function') gtag('event', 'glossary_open', { term: term });
  }

  function cardHtml(d) {
    return '<div class="glo-t"><span>' + d.titulo + '</span>'
      + '<button class="glo-x" aria-label="Cerrar">✕</button></div>'
      + '<p class="glo-d">' + d.def + '</p>'
      + '<p class="glo-a"><b>En el aula:</b> ' + d.aula + '</p>'
      + '<a class="glo-s" href="' + d.src.u + '" target="_blank" rel="noopener">'
      + '<span>🔗</span><span>' + d.src.t + '<span class="glo-tipo">' + d.src.tipo + '</span></span></a>';
  }

  function toggle(span, d) {
    var root = document.getElementById('drawerBody');
    var open = span.classList.contains('open');
    // Solo una tarjeta abierta a la vez
    root.querySelectorAll('.glo-card').forEach(function (c) { c.remove(); });
    root.querySelectorAll('.glo.open').forEach(function (s) { s.classList.remove('open'); });
    if (open) return;

    var anchor = anchorFor(span, root);
    if (!anchor) return;
    var card = document.createElement('div');
    card.className = 'glo-card';
    card.innerHTML = cardHtml(d);
    card.querySelector('.glo-x').onclick = function (e) {
      e.stopPropagation();
      card.remove();
      span.classList.remove('open');
    };
    anchor.after(card);
    span.classList.add('open');
    track(d.titulo);
  }

  // ── Marcado: primera aparición de cada término, solo en nodos de texto ──────
  function marcar(root) {
    TERMINOS.forEach(function (d) {
      for (var i = 0; i < d.t.length; i++) {
        if (marcarUno(root, d, d.t[i])) return; // marcado: pasa al siguiente término
      }
    });
  }

  function marcarUno(root, d, term) {
    var re = reFor(term);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || n.nodeValue.length < 3) return NodeFilter.FILTER_REJECT;
        // No marcar dentro de enlaces, código, títulos ni sobre un término ya marcado
        if (n.parentElement.closest('a,code,pre,h1,h2,h3,h4,.glo,.glo-card')) {
          return NodeFilter.FILTER_REJECT;
        }
        return re.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var node = walker.nextNode();
    if (!node) return false;

    var m = re.exec(node.nodeValue);
    if (!m) return false;
    var after = node.splitText(m.index);
    after.nodeValue = after.nodeValue.slice(m[0].length);
    var span = document.createElement('span');
    span.className = 'glo';
    span.textContent = m[0];
    span.title = 'Ver explicación breve';
    span.onclick = function (e) { e.stopPropagation(); toggle(span, d); };
    after.parentNode.insertBefore(span, after);
    return true;
  }

  // ── Enganche con el drawer ─────────────────────────────────────────────────
  // Solo se marca en LECCIONES. Se excluyen quizzes (Q1-Q6) y simulacros/examen
  // (P1-P6) a propósito: son evaluaciones, y definir el término al lado de la
  // pregunta sería darle la respuesta al aspirante (p. ej. Q2 pregunta qué es
  // el PIAR, y el glosario lo define).
  function esEvaluacion(id) { return /^[QP]\d+$/i.test(id); }

  var _openDrawer = openDrawer;
  openDrawer = function (id) {
    _openDrawer(id);
    if (esEvaluacion(id)) return;
    var body = document.getElementById('drawerBody');
    if (body) { try { marcar(body); } catch (e) { /* nunca romper la lección */ } }
  };

  window.GLOSARIO = TERMINOS; // expuesto para depuración
})();
