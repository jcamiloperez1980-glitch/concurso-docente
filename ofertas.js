// ═══════════════════════════════════════════════════
// OFERTAS CONTEXTUALES — Concurso Docente · Research AI Lab
// Inyecta una tarjeta discreta al FINAL del drawer de casi todas las lecciones,
// ROTANDO varias ofertas distintas para que ninguna se vuelva ruido.
// Regla: A1 (primera lección) queda limpia · una oferta por lección · al pie · gratis/valor primero.
// Todas las ofertas son honestas (sin prometer entregables inexistentes).
// No toca app.js. Envuelve openDrawer (corre después de videos.js).
// ═══════════════════════════════════════════════════
(function () {
  'use strict';
  var WA = 'https://wa.me/573116128640';
  var SITE = 'https://researchailab.com';
  function wa(msg) { return WA + '?text=' + encodeURIComponent(msg); }

  // ── Catálogo de ofertas (rotan) ──
  var OFFERS = {
    thesis: {
      kicker: "Mientras te preparas",
      titulo: "¿Estás haciendo (o vas a hacer) tu tesis?",
      texto: "Para subir en el escalafón necesitas un posgrado, y toda tesis empieza por la revisión de literatura. Cuéntanos tu tema y te devolvemos <strong>gratis</strong> un informe preliminar con las referencias que necesitas, organizadas por categorías.",
      cta: { text: "Enviar mi tema → informe gratis", href: SITE + "/informe.html" },
      alt: { text: "…o por WhatsApp 📩", href: wa("Hola Juan Camilo, tomé el curso del Concurso Docente. Estoy haciendo o planeando mi tesis sobre: [escribe tu tema]. ¿Me ayudan con el informe de referencias?") }
    },
    novedades: {
      kicker: "Que no se te pase nada",
      titulo: "¿Quieres más simulacros y las fechas oficiales?",
      texto: "Te avisamos por WhatsApp cuando salgan nuevas fechas del concurso, cambios en la convocatoria y más simulacros de práctica. Sin spam: solo lo importante.",
      cta: { text: "Sí, mantenme al día 📩", href: wa("Hola Juan Camilo, tomé el curso del Concurso Docente. Quiero recibir más simulacros y las novedades oficiales del concurso.") }
    },
    cursos: {
      kicker: "Una idea para después del concurso",
      titulo: "¿Te gustó cómo está hecho este curso?",
      texto: "Lo construí con un método que también enseño: crear cursos digitales como este y venderlos. Si te interesa una fuente de ingresos con lo que ya sabes enseñar, cuéntanos tu idea.",
      cta: { text: "Me interesa → cuéntanos", href: wa("Hola Juan Camilo, tomé el curso del Concurso Docente. Me interesa aprender a crear y vender cursos digitales como este.") }
    },
    automatizar: {
      kicker: "Recupera tu tiempo",
      titulo: "¿Ahogado en formatos y planeaciones?",
      texto: "Muchos docentes pierden más de 15 horas a la semana en tareas administrativas. Cuéntanos qué formato te quita más tiempo y hablamos de cómo automatizarlo con IA.",
      cta: { text: "Cuéntanos qué automatizar", href: wa("Hola Juan Camilo, tomé el curso del Concurso Docente. Me gustaría automatizar este formato o tarea administrativa: [escríbelo].") }
    }
  };

  // ── Reparto: A1 limpia; el resto rota. Tesis fijada en su contexto fuerte (C1, F1). ──
  var ROT = ["thesis", "novedades", "thesis", "cursos", "thesis", "automatizar"];
  var ORDER = ["A1", "A2", "A3", "P1", "B1", "B2", "B3", "B4", "P2",
               "C1", "C2", "C3", "C4", "P3", "D1", "D2", "D3", "P4",
               "E1", "E2", "E3", "P5", "F1", "F2", "P6"];
  var MAP = {};
  var k = 0;
  for (var i = 1; i < ORDER.length; i++) { MAP[ORDER[i]] = ROT[k % ROT.length]; k++; }
  MAP["C1"] = "thesis";
  MAP["F1"] = "thesis";

  var css =
    '.oc-card{margin:26px 0 4px;padding:18px 20px;border:1px solid var(--border);border-left:3px solid var(--claude);' +
    'border-radius:12px;background:linear-gradient(135deg,rgba(217,119,6,.07),transparent 72%)}' +
    '.oc-kicker{font-family:"JetBrains Mono",monospace;font-size:10.5px;font-weight:700;letter-spacing:.1em;' +
    'text-transform:uppercase;color:var(--claude);margin-bottom:6px}' +
    '.oc-title{font-size:15px;font-weight:800;color:var(--text);margin-bottom:7px;line-height:1.35}' +
    '.oc-text{font-size:13.5px;color:var(--muted);line-height:1.6;margin-bottom:14px}' +
    '.oc-text strong{color:var(--text)}' +
    '.oc-cta{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:100px;border:none;' +
    'font-size:13px;font-weight:800;text-decoration:none;cursor:pointer;color:#fff;' +
    'background:linear-gradient(135deg,var(--claude),var(--claude-2));box-shadow:0 6px 20px var(--claude-glow)}' +
    '.oc-cta:hover{filter:brightness(1.07)}' +
    '.oc-alt{display:inline-flex;align-items:center;gap:6px;margin-left:14px;font-size:12.5px;font-weight:700;' +
    'color:var(--muted);text-decoration:none}' +
    '.oc-alt:hover{color:var(--claude)}' +
    '.ral-cta{margin:22px 0;padding:16px 20px;border-radius:12px;border-left:3px solid var(--claude);' +
    'background:linear-gradient(135deg,rgba(217,119,6,.08),transparent 60%);font-size:14px;line-height:1.7;color:var(--muted)}' +
    '.ral-cta strong{color:var(--text)}.ral-cta a{color:var(--claude);font-weight:700;text-decoration:none}' +
    '.ral-cta a:hover{text-decoration:underline}';
  var st = document.createElement('style'); st.id = 'ocCss'; st.textContent = css; document.head.appendChild(st);

  function inject(id) {
    var key = MAP[id]; if (!key) return;
    var o = OFFERS[key]; if (!o) return;
    var body = document.getElementById('drawerBody'); if (!body) return;
    if (body.querySelector('.oc-card')) return;
    var card = document.createElement('div');
    card.className = 'oc-card';
    var html =
      '<div class="oc-kicker">💡 ' + o.kicker + '</div>' +
      '<div class="oc-title">' + o.titulo + '</div>' +
      '<div class="oc-text">' + o.texto + '</div>' +
      '<a class="oc-cta" href="' + o.cta.href + '" target="_blank" rel="noopener">' + o.cta.text + '</a>';
    if (o.alt) html += '<a class="oc-alt" href="' + o.alt.href + '" target="_blank" rel="noopener">' + o.alt.text + '</a>';
    card.innerHTML = html;
    body.appendChild(card);
  }

  if (typeof window.openDrawer === 'function') {
    var prev = window.openDrawer;
    window.openDrawer = function (id) {
      prev.apply(this, arguments);
      try { inject(id); } catch (e) {}
    };
  }
})();
