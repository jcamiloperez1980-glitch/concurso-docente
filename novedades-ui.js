// ============================================================
// NOVEDADES UI — renderizador compartido (idéntico en los 3 cursos)
// Lee window.NOVEDADES (novedades.js) y pinta:
//  - botón flotante "🆕 Novedades" (abajo-izquierda, con badge si hay items nuevos)
//  - panel deslizante con los items, fecha de actualización y CTA al pack
// No depende de app.js ni content.js. Si novedades.js falta, no hace nada.
// ============================================================
(function () {
  'use strict';
  var DATA = window.NOVEDADES;
  if (!DATA || !DATA.items || !DATA.items.length) return;

  var ACCENT = DATA.color || '#7c4dff';
  var SEEN_KEY = 'ral_novedades_visto';
  var isNew = (function () {
    try { return localStorage.getItem(SEEN_KEY) !== DATA.actualizado; } catch (e) { return true; }
  })();

  function fechaBonita(iso) {
    var m = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    var p = (iso || '').split('-');
    if (p.length !== 3) return iso || '';
    return parseInt(p[2], 10) + ' ' + m[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }

  var css = document.createElement('style');
  css.textContent =
    '#nvBtn{position:fixed;bottom:18px;left:18px;z-index:9990;display:flex;align-items:center;gap:8px;' +
    'min-height:44px;padding:10px 18px;box-sizing:border-box;border-radius:100px;border:1px solid ' + ACCENT + '55;background:rgba(10,10,18,0.92);' +
    'color:#fff;font:600 0.82rem/1 system-ui,sans-serif;cursor:pointer;backdrop-filter:blur(8px);' +
    'box-shadow:0 6px 24px rgba(0,0,0,0.35);transition:transform .25s,box-shadow .25s;}' +
    '#nvBtn:hover{transform:translateY(-2px);box-shadow:0 10px 30px ' + ACCENT + '44;}' +
    '#nvBtn .nv-dot{width:9px;height:9px;border-radius:50%;background:' + ACCENT + ';animation:nvPulse 2s infinite;}' +
    '@keyframes nvPulse{0%,100%{opacity:1}50%{opacity:.35}}' +
    '#nvPanel{position:fixed;top:0;left:0;height:100%;height:100dvh;width:min(420px,94vw);max-width:100vw;box-sizing:border-box;z-index:9991;' +
    'background:#0d0d16;color:#e8e8f2;border-right:1px solid ' + ACCENT + '44;' +
    'transform:translateX(-105%);transition:transform .35s cubic-bezier(.16,1,.3,1);' +
    'display:flex;flex-direction:column;font-family:system-ui,sans-serif;box-shadow:20px 0 60px rgba(0,0,0,.45);}' +
    '#nvPanel.open{transform:translateX(0);}' +
    '#nvPanel .nv-head{padding:20px 22px 14px;border-bottom:1px solid rgba(255,255,255,.08);}' +
    '#nvPanel .nv-head h3{margin:0 0 6px;font-size:1.05rem;color:#fff;}' +
    '#nvPanel .nv-head p{margin:0;font-size:.78rem;opacity:.65;}' +
    '#nvPanel .nv-list{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:16px 22px;}' +
    '#nvPanel h3,#nvPanel h4,#nvPanel p,#nvPanel .nv-accion{overflow-wrap:break-word;word-break:break-word;}' +
    '#nvPanel .nv-item{padding:14px 0;border-bottom:1px solid rgba(255,255,255,.07);}' +
    '#nvPanel .nv-item:last-child{border-bottom:none;}' +
    '#nvPanel .nv-meta{display:flex;gap:8px;align-items:center;margin-bottom:6px;}' +
    '#nvPanel .nv-tag{font-size:.62rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;' +
    'padding:3px 9px;border-radius:100px;background:' + ACCENT + '22;color:' + ACCENT + ';border:1px solid ' + ACCENT + '55;}' +
    '#nvPanel .nv-fecha{font-size:.68rem;opacity:.5;}' +
    '#nvPanel .nv-item h4{margin:0 0 6px;font-size:.92rem;color:#fff;line-height:1.35;}' +
    '#nvPanel .nv-item p{margin:0 0 8px;font-size:.8rem;line-height:1.55;opacity:.82;}' +
    '#nvPanel .nv-accion{font-size:.76rem;line-height:1.5;padding:9px 12px;border-radius:10px;' +
    'background:rgba(255,255,255,.04);border-left:3px solid ' + ACCENT + ';opacity:.9;}' +
    '#nvPanel .nv-foot{padding:14px 22px;border-top:1px solid rgba(255,255,255,.08);font-size:.72rem;opacity:.75;line-height:1.5;}' +
    '#nvClose{position:absolute;top:14px;right:14px;width:44px;height:44px;border-radius:9px;' +
    'border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff;font-size:14px;cursor:pointer;}' +
    '#nvOverlay{position:fixed;inset:0;z-index:9989;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .3s;}' +
    '#nvOverlay.show{opacity:1;pointer-events:auto;}' +
    '@media (prefers-reduced-motion:reduce){#nvBtn .nv-dot{animation:none}#nvPanel,#nvOverlay,#nvBtn{transition:none}}' +
    '@media print{#nvBtn,#nvPanel,#nvOverlay{display:none!important}}';
  document.head.appendChild(css);

  var btn = document.createElement('button');
  btn.id = 'nvBtn';
  btn.setAttribute('aria-label', 'Abrir novedades oficiales del concurso');
  btn.setAttribute('aria-controls', 'nvPanel');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = (isNew ? '<span class="nv-dot"></span>' : '') + '📢 Novedades' +
    (isNew ? ' <span style="opacity:.7;font-weight:400;">· ' + DATA.items.length + ' nuevas</span>' : '');

  var overlay = document.createElement('div');
  overlay.id = 'nvOverlay';

  var panel = document.createElement('div');
  panel.id = 'nvPanel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Novedades oficiales del concurso docente');
  var itemsHtml = DATA.items.map(function (it) {
    return '<div class="nv-item">' +
      '<div class="nv-meta"><span class="nv-tag">' + it.tag + '</span>' +
      '<span class="nv-fecha">' + fechaBonita(it.fecha) + '</span></div>' +
      '<h4>' + it.titulo + '</h4>' +
      '<p>' + it.resumen + '</p>' +
      (it.accion ? '<div class="nv-accion">💡 ' + it.accion + '</div>' : '') +
      (it.url ? '<div style="margin-top:8px;"><a href="' + it.url + '" target="_blank" rel="noopener" style="color:' + ACCENT + ';font-size:.76rem;">Ver fuente →</a></div>' : '') +
      '</div>';
  }).join('');
  panel.innerHTML =
    '<button id="nvClose" aria-label="Cerrar">✕</button>' +
    '<div class="nv-head"><h3>📢 Novedades oficiales del concurso</h3>' +
    '<p>Seguimiento verificado de la CNSC, el MEN y resoluciones oficiales. Última actualización: <strong>' + fechaBonita(DATA.actualizado) + '</strong></p></div>' +
    '<div class="nv-list">' + itemsHtml + '</div>' +
    '<div class="nv-foot">Estas novedades se verifican contra fuentes oficiales (CNSC, MEN, resoluciones). Te avisamos cada vez que haya un avance real del concurso.</div>';

  document.body.appendChild(overlay);
  document.body.appendChild(panel);
  document.body.appendChild(btn);

  function abrir() {
    panel.classList.add('open');
    overlay.classList.add('show');
    btn.setAttribute('aria-expanded', 'true');
    try { localStorage.setItem(SEEN_KEY, DATA.actualizado); } catch (e) {}
    var dot = btn.querySelector('.nv-dot');
    if (dot) dot.remove();
    var closeBtn = panel.querySelector('#nvClose');
    if (closeBtn) closeBtn.focus();
  }
  function cerrar() {
    panel.classList.remove('open');
    overlay.classList.remove('show');
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }
  btn.addEventListener('click', function () {
    panel.classList.contains('open') ? cerrar() : abrir();
  });
  overlay.addEventListener('click', cerrar);
  panel.querySelector('#nvClose').addEventListener('click', cerrar);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) cerrar(); });
  panel.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = panel.querySelectorAll('button, a[href]');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
