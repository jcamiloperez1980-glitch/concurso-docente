// GA4 Custom Event Tracking — Concurso Docente
// Envuelve funciones globales para capturar interacciones sin modificar app.js
(function () {
  'use strict';

  var MILESTONE_KEY = 'ral_seen_milestones';

  function track(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params || {});
    }
  }

  function getSeenMilestones() {
    try { return JSON.parse(localStorage.getItem(MILESTONE_KEY) || '[]'); } catch (e) { return []; }
  }

  function markMilestoneSeen(key) {
    var seen = getSeenMilestones();
    if (seen.indexOf(key) === -1) { seen.push(key); localStorage.setItem(MILESTONE_KEY, JSON.stringify(seen)); }
  }

  function lessonMeta(lessonId) {
    if (typeof PHASES === 'undefined') return { lesson_id: lessonId };
    for (var pi = 0; pi < PHASES.length; pi++) {
      var p = PHASES[pi];
      for (var li = 0; li < p.lessons.length; li++) {
        if (p.lessons[li].id === lessonId) {
          return { lesson_id: lessonId, lesson_title: p.lessons[li].title, phase_id: p.id, phase_title: p.title };
        }
      }
    }
    return { lesson_id: lessonId };
  }

  // ── Lección abierta ────────────────────────────────────────────────────────
  var currentLesson = null;
  var _openDrawer = window.openDrawer;
  window.openDrawer = function (lessonId) {
    _openDrawer(lessonId);
    currentLesson = lessonId;
    track('lesson_open', lessonMeta(lessonId));
  };

  // ── Lección marcada/desmarcada ─────────────────────────────────────────────
  var _toggleLesson = window.toggleLesson;
  window.toggleLesson = function (id, e) {
    var wasComplete = typeof getCompleted === 'function' && getCompleted().indexOf(id) !== -1;
    _toggleLesson(id, e);
    track(wasComplete ? 'lesson_incomplete' : 'lesson_complete', lessonMeta(id));
  };

  // ── Quiz enviado ───────────────────────────────────────────────────────────
  var _gradeQuiz = window.gradeQuiz;
  window.gradeQuiz = function (qid) {
    _gradeQuiz(qid);
    var qz = window.QUIZZES && window.QUIZZES[qid];
    if (!qz) return;
    var ok = 0;
    qz.qs.forEach(function (it, i) {
      var s = document.querySelector('input[name=qz' + i + ']:checked');
      if (s && +s.value === it.a) ok++;
    });
    var passed = ok === qz.qs.length;
    track('quiz_submit', { quiz_id: qid, score: ok, total: qz.qs.length, passed: passed });
    if (passed) track('quiz_pass', { quiz_id: qid });
  };

  // ── Hitos de progreso (solo se disparan una vez por hito) ──────────────────
  var _updateUI = window.updateUI;
  window.updateUI = function () {
    _updateUI();
    if (typeof getCompleted !== 'function' || typeof ALL_IDS === 'undefined') return;
    var completed = getCompleted();
    var total = ALL_IDS.length;
    var pct = total ? Math.round((completed.length / total) * 100) : 0;
    var seen = getSeenMilestones();

    [25, 50, 75, 100].forEach(function (m) {
      var key = 'progress_' + m;
      if (pct >= m && seen.indexOf(key) === -1) {
        markMilestoneSeen(key);
        track('course_progress', { milestone: m, completed_lessons: completed.length, total_lessons: total });
        if (m === 100) track('course_complete', { total_lessons: total });
      }
    });

    if (typeof PHASES !== 'undefined') {
      PHASES.forEach(function (p) {
        var done = p.lessons.filter(function (l) { return completed.indexOf(l.id) !== -1; }).length;
        if (done === p.lessons.length && done > 0) {
          var key = 'phase_' + p.id;
          if (seen.indexOf(key) === -1) {
            markMilestoneSeen(key);
            track('phase_complete', { phase_id: p.id, phase_title: p.title, lessons_count: p.lessons.length });
          }
        }
      });
    }
  };

  // ── Certificado descargado ─────────────────────────────────────────────────
  var _openCert = window.openCertificate;
  if (typeof _openCert === 'function') {
    window.openCertificate = function () {
      track('certificate_view', {});
      _openCert();
    };
  }

  // ── Dónde ocurrió el clic (para saber qué ubicación convierte) ─────────────
  function clickSurface(el) {
    if (el.closest('.oc-card')) return 'oferta_leccion';   // tarjeta rotativa dentro del drawer
    if (el.closest('.rf-hero')) return 'embudo_informe';   // card héroe del bloque final
    if (el.closest('.ral-funnel')) return 'embudo_final';  // resto del bloque de productos
    if (el.closest('.ral-cta')) return 'cta_inline';       // CTA embebido en una lección
    return 'otro';
  }

  // ── Qué lección estaba abierta cuando hizo clic ───────────────────────────
  function openLessonId() {
    var d = document.getElementById('drawer');
    var isOpen = d && d.classList.contains('open');
    return isOpen ? currentLesson : null;
  }

  // ── Clics de conversión, CTA y YouTube (delegación) ───────────────────────
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    // 1. WhatsApp — la señal de intención más fuerte que existe en el sitio
    var waLink = t.closest('a[href*="wa.me"]');
    if (waLink) {
      track('whatsapp_click', {
        surface: clickSurface(waLink),
        lesson_id: openLessonId(),
        link_text: (waLink.textContent || '').trim().slice(0, 60)
      });
    }

    // 2. PDFs. Solo los propios cuentan como conversión; los externos (MEN, CNSC)
    //    son material de consulta y se registran aparte para no ensuciar la métrica.
    var pdfLink = t.closest('a[href$=".pdf"]');
    if (pdfLink) {
      var raw = pdfLink.getAttribute('href') || '';
      var esPropio = pdfLink.hostname === location.hostname;
      track(esPropio ? 'lead_magnet_download' : 'recurso_externo_pdf', {
        file_name: raw.split('/').pop(),
        surface: clickSurface(pdfLink),
        lesson_id: openLessonId()
      });
    }

    // 3. Salto al sitio principal (informe gratis, flujo, cursos)
    var ralLink = t.closest('a[href*="researchailab.com"]');
    if (ralLink) {
      var href = ralLink.getAttribute('href') || '';
      var offer = href.indexOf('informe') !== -1 ? 'informe_preliminar'
                : href.indexOf('flujo')   !== -1 ? 'flujo_investigador'
                : href.indexOf('cursos')  !== -1 ? 'catalogo_cursos'
                : 'sitio_general';
      track('funnel_cta_click', {
        offer: offer,
        destination: ralLink.href,
        surface: clickSurface(ralLink),
        lesson_id: openLessonId()
      });
    }

    var ytLink = t.closest('.yt-link');
    if (ytLink) {
      var query = ytLink.textContent.replace(/▶️?\s*/g, '').trim();
      track('youtube_search', { search_query: query });
    }
  });

  // ── Búsqueda (dispara tras 1.2 s sin tipear, mínimo 3 caracteres) ──────────
  var searchInput = document.getElementById('searchInput');
  if (searchInput) {
    var searchTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      var q = this.value.trim();
      if (q.length >= 3) {
        searchTimer = setTimeout(function () {
          track('search', { search_term: q });
        }, 1200);
      }
    });
  }

  // ── Cambio de idioma ───────────────────────────────────────────────────────
  var _toggleLang = window.toggleLang;
  if (typeof _toggleLang === 'function') {
    window.toggleLang = function () {
      _toggleLang();
      track('language_toggle', { language: localStorage.getItem('lang_concursoDocente') || 'es' });
    };
  }

  // ── Cambio de tema ─────────────────────────────────────────────────────────
  var _toggleTheme = window.toggleTheme;
  if (typeof _toggleTheme === 'function') {
    window.toggleTheme = function () {
      _toggleTheme();
      var isDark = document.documentElement.classList.contains('dark');
      track('theme_toggle', { theme: isDark ? 'dark' : 'light' });
    };
  }

})();
