// ============================================================
// BÚSQUEDA — desplazar al primer resultado
// app.js ya filtra las lecciones y actualiza el contador (p.ej. "6/31"),
// pero la barra de búsqueda queda arriba del listado: si el usuario no
// hace scroll manual, ve el contador cambiar y nada más — "no me lleva
// a nada". Este módulo añade un SEGUNDO listener sobre el mismo input
// (no toca app.js: se regenera con _build-curso.js) que desplaza a la
// primera lección visible y la resalta un momento.
// ============================================================
(function () {
  'use strict';
  var input = document.getElementById('searchInput');
  if (!input) return;

  var timer;
  var HIGHLIGHT_MS = 1400;

  function primerResultado() {
    return document.querySelector('.lesson-card:not(.hidden)');
  }

  function irAlPrimero() {
    var card = primerResultado();
    if (!card) return;
    card.scrollIntoView({ behavior: 'auto', block: 'center' });
    card.classList.add('search-hit');
    setTimeout(function () { card.classList.remove('search-hit'); }, HIGHLIGHT_MS);
  }

  function actualizarVacio(q) {
    var msg = document.getElementById('searchEmptyMsg');
    var hay = !!primerResultado();
    if (q.length >= 2 && !hay) {
      if (!msg) {
        msg = document.createElement('div');
        msg.id = 'searchEmptyMsg';
        msg.className = 'search-empty';
        var wrap = document.querySelector('.search-wrap');
        if (wrap && wrap.parentNode) wrap.parentNode.insertBefore(msg, wrap.nextSibling);
      }
      msg.textContent = 'Sin resultados para "' + q + '" — prueba con otro término.';
    } else if (msg) {
      msg.remove();
    }
  }

  input.addEventListener('input', function () {
    clearTimeout(timer);
    var q = input.value.trim();
    // Espera a que termine de escribir: app.js ya filtró en su propio
    // listener 'input' (se ejecuta antes, quedó registrado primero).
    timer = setTimeout(function () {
      actualizarVacio(q);
      if (q.length >= 2) irAlPrimero();
    }, 320);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    clearTimeout(timer);
    var q = input.value.trim();
    actualizarVacio(q);
    irAlPrimero();
  });

  var css =
    '.search-hit{border-color:var(--claude);box-shadow:0 0 0 3px rgba(217,119,6,.22),0 10px 30px rgba(217,119,6,.15)}' +
    '.search-empty{max-width:480px;margin:-38px auto 40px;padding:0 16px;text-align:center;font-size:13px;color:var(--muted)}';
  var st = document.createElement('style');
  st.id = 'searchScrollCss';
  st.textContent = css;
  document.head.appendChild(st);
})();
