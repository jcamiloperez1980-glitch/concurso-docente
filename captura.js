// ============================================================
// CAPTURA Y CALIFICACIÓN — concurso-docente
//
// Por qué existe, con los números de julio (4–31, 477 visitantes):
//   · 219 vieron la pregunta del hero y 124 la respondieron  → 26% de todo el tráfico
//   ·  10 empezaron el diagnóstico y 7 lo terminaron         → 2%
//   ·   2 hicieron clic en la lista de espera del banco pago → 29% de los que terminan
//
// La lista de espera convierte bien; el problema es que está detrás del paso que
// solo encuentra el 2%. Este módulo mueve la pregunta de intención de pago al
// punto donde ya hay volumen: justo después de responder la pregunta del hero.
//
// Se piden tres datos y cada uno tiene un uso concreto:
//   correo    → poder avisar de la OPEC (sep) y las inscripciones (nov-dic), que es
//               la única ventana del año en que este público compra
//   cargo/área→ decidir cuáles 3 bancos construir; diagnostico.js dice que solo
//               alcanza a hacer 3 antes de las inscripciones
//   municipio → segmentar el aviso de la OPEC, que sale por municipio
//
// Se mantiene el marco honesto que ya funciona en diagnostico.js: se dice de
// frente que el banco será pago. Una lista que calla el precio mide "¿quieres algo
// gratis?" y esa señal no sirve para decidir qué construir.
//
// El curso sigue abierto y sin registro. Módulo autocontenido: no reescribe
// ofertas.js ni diagnostico.js.
// Backend: Netlify Forms (el <form> estático vive en index.html porque el detector
// de Netlify parsea HTML en el deploy y no ve formularios inyectados por JS).
// ============================================================
(function () {
  'use strict';

  var FORM = 'alertas-concurso';
  var YA_KEY = 'ral_captura_hecha';

  // Mismo catálogo que diagnostico.js: si un docente se describe distinto en cada
  // sitio, los datos no se pueden cruzar después.
  var CARGOS = [
    { v: 'aula',           label: 'Docente de aula',     area: true },
    { v: 'orientador',     label: 'Orientador' },
    { v: 'apoyo',          label: 'Apoyo pedagógico' },
    { v: 'rector',         label: 'Rector',              directivo: true },
    { v: 'coordinador',    label: 'Coordinador',         directivo: true },
    { v: 'director_rural', label: 'Director rural',      directivo: true }
  ];

  var AREAS = ['Preescolar', 'Básica primaria', 'Matemáticas',
    'Ciencias naturales y educación ambiental', 'Ciencias sociales',
    'Humanidades y lengua castellana', 'Idioma extranjero (inglés)',
    'Educación física, recreación y deportes', 'Educación artística y cultural',
    'Educación ética y valores / Filosofía', 'Educación religiosa',
    'Tecnología e informática', 'Ciencias económicas y políticas', 'Otra'];

  function track(n, p) { if (typeof gtag === 'function') gtag('event', n, p || {}); }
  function yaEsta() { try { return !!localStorage.getItem(YA_KEY); } catch (e) { return false; } }
  function marcar(c) { try { localStorage.setItem(YA_KEY, c || '1'); } catch (e) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }

  var css =
    '.cap-in{margin:18px 0 4px;padding:17px 19px;border:1px solid var(--border);border-left:3px solid var(--claude);' +
    'border-radius:12px;background:linear-gradient(135deg,rgba(217,119,6,.08),transparent 72%);text-align:left}' +
    '.cap-kicker{font-family:"JetBrains Mono",monospace;font-size:10.5px;font-weight:700;letter-spacing:.11em;' +
    'text-transform:uppercase;color:var(--claude);margin-bottom:7px}' +
    '.cap-h{font-size:15.5px;font-weight:800;line-height:1.35;color:var(--text);margin-bottom:7px}' +
    '.cap-p{font-size:13px;line-height:1.6;color:var(--muted);margin-bottom:12px}' +
    '.cap-p strong{color:var(--text)}' +
    '.cap-cargos{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:4px}' +
    '.cap-cargo{padding:9px 14px;border-radius:100px;background:var(--card-2);border:1px solid var(--border);' +
    'color:var(--muted);font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;transition:.16s}' +
    '.cap-cargo:hover{border-color:var(--claude);color:var(--text)}' +
    '.cap-f{display:block;width:100%;padding:11px 13px;margin-bottom:8px;border-radius:10px;' +
    'background:var(--card-2);border:1px solid var(--border);color:var(--text);font-family:inherit;' +
    'font-size:14px;transition:.15s;-webkit-appearance:none}' +
    '.cap-f:focus{outline:none;border-color:var(--claude)}' +
    '.cap-f::placeholder{color:var(--dim)}' +
    'select.cap-f{cursor:pointer}' +
    '.cap-hp{position:absolute;left:-9999px;opacity:0;height:0;width:0}' +
    '.cap-send{display:block;width:100%;margin-top:4px;padding:12px;border-radius:100px;border:none;' +
    'font-family:inherit;font-size:13.5px;font-weight:800;color:#fff;cursor:pointer;' +
    'background:linear-gradient(135deg,var(--claude),var(--claude-2));box-shadow:0 8px 24px var(--claude-glow)}' +
    '.cap-send:hover:not(:disabled){filter:brightness(1.07)}' +
    '.cap-send:disabled{opacity:.6;cursor:default}' +
    '.cap-fine{margin-top:10px;font-size:11.5px;line-height:1.5;color:var(--dim)}' +
    '.cap-err{margin-top:9px;font-size:12.5px;color:#dc2626;font-weight:700}' +
    '.cap-back{margin-top:9px;background:none;border:none;padding:0;font-family:inherit;font-size:12px;' +
    'font-weight:700;color:var(--dim);cursor:pointer}' +
    '.cap-back:hover{color:var(--claude)}' +
    // Modal (compuerta de los PDFs)
    '.cap-ov{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;' +
    'padding:20px;background:rgba(0,0,0,.62);backdrop-filter:blur(3px)}' +
    '.cap-box{width:100%;max-width:452px;max-height:92vh;overflow-y:auto;padding:24px;border-radius:18px;' +
    'background:var(--card);border:1px solid var(--border);border-top:3px solid var(--claude);' +
    'box-shadow:0 24px 70px rgba(0,0,0,.42)}' +
    '.cap-box .cap-in{margin:0;padding:0;border:none;background:none}' +
    '.cap-x{float:right;margin:-6px -4px 0 0;background:none;border:none;cursor:pointer;font-size:19px;' +
    'line-height:1;color:var(--dim);font-family:inherit;padding:4px 6px}' +
    '.cap-x:hover{color:var(--text)}' +
    // 16px en los campos no es capricho: por debajo de eso iOS Safari hace zoom al
    // enfocar el input y descuadra la página en pleno formulario.
    '@media(max-width:600px){.cap-f{font-size:16px;padding:12px 13px}.cap-box{padding:19px;border-radius:15px}' +
    '.cap-cargo{font-size:12px;padding:8px 12px}}';

  var st = document.createElement('style');
  st.id = 'capCss';
  st.textContent = css;
  document.head.appendChild(st);

  function enviar(d) {
    var body = Object.keys(d).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(d[k]);
    }).join('&');
    return fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'form-name=' + encodeURIComponent(FORM) + '&' + body
    }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r; });
  }

  // Copy por tipo de cargo. Se separa igual que en diagnostico.js porque a un
  // directivo no le sirve "todo el mundo estudia normativa": la normativa es lo suyo.
  function promesa(cargo) {
    if (cargo.directivo) {
      return 'Tu prueba se decide en los casos de gestión: convivencia, personal, recursos, ' +
             'secretaría. Estoy armando ese banco de casos y <strong>será pago</strong> — ' +
             'escribirlo bien toma semanas por cargo. Te aviso primero a ti.';
    }
    if (cargo.area) {
      return 'Pedagogía y normativa las estudia todo el mundo, y las tienes gratis acá. ' +
             'El concurso se desempata en tu área. Estoy armando los bancos por área y ' +
             '<strong>serán pagos</strong>: solo alcanzo a hacer 3 antes de las inscripciones. ' +
             'Dime la tuya y cuenta para decidir cuáles.';
    }
    return 'Las competencias pedagógicas las estudia todo aspirante, y las tienes gratis acá. ' +
           'Tu prueba se decide en los casos propios de tu cargo. Estoy armando ese banco y ' +
           '<strong>será pago</strong>. Te aviso primero a ti.';
  }

  // ── Bloque de captura: paso 1 elige cargo, paso 2 pide correo ──
  // Se parte en dos porque un clic cuesta mucho menos que un campo de texto: quien
  // elige cargo ya se comprometió y llega al correo con la promesa personalizada.
  function bloque(contexto, opts) {
    opts = opts || {};
    if (yaEsta()) return null;

    var div = document.createElement('div');
    div.className = 'cap-in';
    var elegido = null;

    function paso1() {
      div.innerHTML =
        '<div class="cap-kicker">📌 Falta lo tuyo</div>' +
        '<div class="cap-h">' + (opts.titulo || '¿A qué cargo aspiras?') + '</div>' +
        '<div class="cap-p">Lo uso para avisarte solo de lo que te sirve — y para decidir ' +
        'qué material construyo primero.</div>' +
        '<div class="cap-cargos">' +
          CARGOS.map(function (c, i) {
            return '<button class="cap-cargo" data-i="' + i + '">' + c.label + '</button>';
          }).join('') +
        '</div>';
      div.querySelector('.cap-cargos').addEventListener('click', function (e) {
        var b = e.target.closest('.cap-cargo');
        if (!b) return;
        elegido = CARGOS[+b.dataset.i];
        track('captura_cargo', { contexto: contexto, cargo: elegido.v });
        paso2();
      });
    }

    function paso2() {
      div.innerHTML =
        '<div class="cap-kicker">📌 ' + esc(elegido.label) + '</div>' +
        '<div class="cap-h">Te aviso cuando abran las inscripciones</div>' +
        '<div class="cap-p">' + promesa(elegido) + '</div>' +
        '<div class="cap-p">La OPEC sale en <strong>septiembre</strong> y las inscripciones se ' +
        'proyectan para <strong>noviembre–diciembre</strong>. Si se te pasa la ventana, el ' +
        'siguiente concurso tarda años.</div>' +
        (elegido.area
          ? '<select class="cap-f" id="capArea"><option value="">¿Cuál es tu área?</option>' +
            AREAS.map(function (a) { return '<option>' + a + '</option>'; }).join('') + '</select>'
          : '') +
        '<input class="cap-f" type="email" id="capMail" required autocomplete="email" ' +
          'placeholder="Tu correo electrónico">' +
        '<input class="cap-f" type="text" id="capMun" autocomplete="address-level2" ' +
          'placeholder="Municipio donde aspiras (opcional)">' +
        '<input class="cap-hp" type="text" id="capHp" tabindex="-1" aria-hidden="true" autocomplete="off">' +
        '<button class="cap-send" id="capBtn">Avísame</button>' +
        '<div class="cap-err" id="capErr"></div>' +
        '<div class="cap-fine">Sin spam y sin reenvíos a terceros. Hoy no estás comprando nada.</div>' +
        '<button class="cap-back" id="capBack">← me equivoqué de cargo</button>';

      var btn = div.querySelector('#capBtn');
      var mail = div.querySelector('#capMail');
      var err = div.querySelector('#capErr');

      div.querySelector('#capBack').onclick = paso1;

      btn.onclick = function () {
        var correo = (mail.value || '').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) {
          err.textContent = 'Revisa el correo, parece incompleto.';
          mail.focus();
          return;
        }
        if (div.querySelector('#capHp').value) return;   // bot

        err.textContent = '';
        btn.disabled = true;
        btn.textContent = 'Enviando…';

        var area = div.querySelector('#capArea');
        enviar({
          correo: correo,
          cargo: elegido.label,
          area: area ? area.value : '',
          municipio: (div.querySelector('#capMun').value || '').trim(),
          contexto: contexto,
          origen: location.search || '(directo)'
        }).then(function () {
          marcar(correo);
          track('captura_correo', {
            contexto: contexto,
            cargo: elegido.v,
            area: (area && area.value) || 'n/a'
          });
          div.innerHTML =
            '<div class="cap-h">✅ Listo, quedaste en la lista</div>' +
            '<div class="cap-p">Te escribo apenas la CNSC publique la OPEC y cuando abran ' +
            'las inscripciones.' + (opts.pdfUrl ? ' El PDF va en camino.' : '') + '</div>' +
            (opts.pdfUrl ? '<a class="cap-send" style="text-decoration:none;text-align:center" href="' +
              opts.pdfUrl + '" target="_blank" rel="noopener">Descargarlo ya →</a>' : '');
          if (opts.pdfUrl) window.open(opts.pdfUrl, '_blank', 'noopener');
          if (opts.alExito) opts.alExito();
        }).catch(function () {
          btn.disabled = false;
          btn.textContent = 'Avísame';
          err.textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo otra vez.';
        });
      };

      mail.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); btn.click(); }
      });
      mail.focus();
    }

    // Quien viene del diagnóstico ya declaró su cargo: volvérselo a preguntar
    // sería pedirle dos veces el mismo dato y le da una razón para abandonar.
    var pre = opts.cargo && CARGOS.filter(function (c) { return c.v === opts.cargo; })[0];
    if (pre) { elegido = pre; paso2(); } else { paso1(); }

    track('captura_vista', { contexto: contexto });
    return div;
  }

  // ── Modal, usado como compuerta de los PDFs propios ──
  function abrir(contexto, opts) {
    opts = opts || {};
    if (document.querySelector('.cap-ov') || yaEsta()) return;

    var ov = document.createElement('div');
    ov.className = 'cap-ov';
    var box = document.createElement('div');
    box.className = 'cap-box';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');

    function cerrar() {
      if (ov.parentNode) ov.parentNode.removeChild(ov);
      document.removeEventListener('keydown', esc2);
    }
    function esc2(e) { if (e.key === 'Escape') cerrar(); }

    var x = document.createElement('button');
    x.className = 'cap-x';
    x.setAttribute('aria-label', 'Cerrar');
    x.textContent = '✕';
    x.onclick = function () { track('captura_cerrada', { contexto: contexto }); cerrar(); };
    box.appendChild(x);

    var b = bloque(contexto, {
      pdfUrl: opts.pdfUrl,
      titulo: '¿A qué cargo aspiras?',
      alExito: function () { setTimeout(cerrar, 9000); }
    });
    if (!b) return;
    box.appendChild(b);
    ov.appendChild(box);
    ov.addEventListener('click', function (e) { if (e.target === ov) cerrar(); });
    document.addEventListener('keydown', esc2);
    document.body.appendChild(ov);
  }

  // ── Compuerta de los PDFs propios ──
  // Se intercepta por delegación en fase de captura para no depender de cómo los
  // inyecte ofertas.js. Los PDFs del MEN y la CNSC siguen libres: son consulta.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href$=".pdf"]');
    if (!a || yaEsta()) return;
    if (a.hostname && a.hostname !== location.hostname) return;
    e.preventDefault();
    e.stopPropagation();
    abrir('pdf:' + (a.getAttribute('href') || '').split('/').pop(), { pdfUrl: a.getAttribute('href') });
  }, true);

  // ── Bloque en el panel de novedades ──
  // Su pie ya promete "te avisamos cada vez que haya un avance real": hasta ahora
  // era una promesa sin forma de cumplirse.
  function enNovedades() {
    if (yaEsta()) return true;
    var panel = document.getElementById('nvPanel');
    if (!panel) return false;
    if (panel.querySelector('.cap-in')) return true;
    var b = bloque('novedades', { titulo: '¿Te aviso de las novedades que te sirven?' });
    if (!b) return true;
    var pie = panel.querySelector('.nv-foot');
    if (pie) panel.insertBefore(b, pie); else panel.appendChild(b);
    return true;
  }
  if (!enNovedades()) {
    document.addEventListener('DOMContentLoaded', enNovedades);
    document.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('#nvBtn')) setTimeout(enNovedades, 60);
    });
  }

  window.abrirCaptura = abrir;
  window.bloqueCaptura = bloque;
  window.capturaYaHecha = yaEsta;
  window.enviarCaptura = enviar;   // diagnostico.js manda por aquí el perfil completo
})();
