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
  var _openDrawer = window.openDrawer;
  window.openDrawer = function (lessonId) {
    _openDrawer(lessonId);
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

  // ── Clics en CTA y YouTube (delegación) ───────────────────────────────────
  document.addEventListener('click', function (e) {
    var ralLink = e.target && e.target.closest && e.target.closest('a[href*="researchailab.com"]');
    if (ralLink) {
      track('cta_click', { destination: ralLink.href, context: 'quiz_result' });
    }
    // Botón "Empieza gratis / Continuar" (hero o cierre de página) y avisos por WhatsApp
    var startBtn = e.target && e.target.closest && e.target.closest('[data-cta="start"]');
    if (startBtn) {
      track('start_course_click', { location: startBtn.closest('#finalCta') ? 'final' : 'hero' });
    }
    var waLink = e.target && e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (waLink) {
      track('whatsapp_click', { location: waLink.className || 'link' });
    }
    var ytLink = e.target && e.target.closest && e.target.closest('.yt-link');
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
