// ============================================================
// REGALO / EMBUDO — concurso-docente
// Inyecta el marco de "regalo de Research AI Lab" y el bloque de
// productos/servicios (embudo hacia researchailab.com y el producto estrella).
// Módulo autocontenido: no toca la lógica de app.js.
// ============================================================
(function () {
  var SITE = "https://researchailab.com";
  var WA = "https://wa.me/573116128640";
  // Mensaje prellenado para quien quiere el informe preliminar gratis
  var WA_TEMA = WA + "?text=" + encodeURIComponent(
    "Hola Juan Camilo, tomé el curso gratuito del Concurso Docente. " +
    "Estoy haciendo una investigación/tesis sobre: [escribe tu tema]. " +
    "¿Me ayudas con el informe preliminar?"
  );

  var css = `
.ral-gift{margin:0 0 28px;padding:14px 20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;
  background:linear-gradient(135deg,rgba(217,119,6,.10),rgba(245,158,11,.06));
  border:1px solid var(--border);border-left:4px solid var(--claude);border-radius:14px}
.ral-gift .rg-emoji{font-size:22px;flex-shrink:0}
.ral-gift .rg-txt{font-size:13.5px;color:var(--muted);line-height:1.55;flex:1;min-width:220px}
.ral-gift .rg-txt strong{color:var(--text);font-weight:800}
.ral-gift .rg-link{font-size:13px;font-weight:800;color:var(--claude);text-decoration:none;white-space:nowrap}
.ral-gift .rg-link:hover{text-decoration:underline}

.ral-funnel{margin:64px 0 8px}
.ral-funnel .rf-head{text-align:center;max-width:640px;margin:0 auto 26px}
.ral-funnel .rf-kicker{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.12em;
  text-transform:uppercase;color:var(--claude)}
.ral-funnel .rf-title{font-size:23px;font-weight:900;letter-spacing:-.02em;margin:8px 0 10px;color:var(--text)}
.ral-funnel .rf-sub{font-size:14px;color:var(--muted);line-height:1.6}
.ral-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.rf-card{position:relative;padding:24px;background:var(--card);border:1px solid var(--border);border-radius:16px;
  display:flex;flex-direction:column;transition:.2s}
.rf-card:hover{border-color:var(--claude);transform:translateY(-2px)}
.rf-card.rf-hero{grid-column:1 / -1;border:1.5px solid var(--claude);
  background:linear-gradient(135deg,rgba(217,119,6,.07),transparent 60%)}
.rf-tag{align-self:flex-start;font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:700;
  letter-spacing:.08em;text-transform:uppercase;padding:4px 10px;border-radius:100px;
  background:var(--claude);color:#fff;margin-bottom:12px}
.rf-tag.rf-tag-soft{background:var(--card-2);color:var(--muted);border:1px solid var(--border)}
.rf-card h3{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0 0 8px;color:var(--text)}
.rf-card p{font-size:13.5px;color:var(--muted);line-height:1.6;margin:0 0 14px}
.rf-card ul{margin:0 0 16px;padding-left:18px}
.rf-card li{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:3px}
.rf-card .rf-spacer{flex:1}
.rf-cta{display:inline-flex;align-items:center;gap:8px;align-self:flex-start;padding:11px 22px;border-radius:100px;
  font-size:13.5px;font-weight:800;text-decoration:none;cursor:pointer;transition:.2s;border:none;font-family:inherit}
.rf-cta.rf-primary{color:#fff;background:linear-gradient(135deg,var(--claude),var(--claude-2));
  box-shadow:0 8px 24px var(--claude-glow)}
.rf-cta.rf-primary:hover{transform:translateY(-1px);filter:brightness(1.07)}
.rf-cta.rf-ghost{color:var(--claude);background:transparent;border:1.5px solid var(--claude)}
.rf-cta.rf-ghost:hover{background:var(--claude);color:#fff}
.rf-secondary{display:inline-flex;align-items:center;gap:6px;margin-top:10px;font-size:12.5px;font-weight:700;
  color:var(--muted);text-decoration:none}
.rf-secondary:hover{color:var(--claude)}
.rf-note{grid-column:1 / -1;text-align:center;font-size:12.5px;color:var(--dim);line-height:1.6;margin-top:6px;font-style:italic}
@media(max-width:720px){.ral-grid{grid-template-columns:1fr}.ral-funnel .rf-title{font-size:20px}}
`;
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  // ── Arranque limpio: la banda de "regalo" superior se retiró a propósito para no
  //    poner nada frente al estudiante al entrar. El marco de regalo vive en el bloque
  //    de productos del final y en las ofertas contextuales (ofertas.js). ──

  // ── Bloque de productos/servicios (embudo), antes del footer ──
  var funnel = document.createElement('section');
  funnel.className = 'ral-funnel';
  funnel.innerHTML =
    '<div class="rf-head">' +
      '<div class="rf-kicker">Detrás de este regalo</div>' +
      '<div class="rf-title">Soy Juan Camilo Pérez, y esto es Research AI Lab</div>' +
      '<div class="rf-sub">Ayudo a docentes e investigadores a usar la IA con método — no con humo. ' +
      'Este curso es gratis a propósito: es mi forma de aportar. Si te sirvió, mira lo demás que hago, ' +
      'diseñado con el mismo cuidado.</div>' +
    '</div>' +
    '<div class="ral-grid">' +

      // Card héroe: informe preliminar gratis (gancho de entrada)
      '<div class="rf-card rf-hero">' +
        '<span class="rf-tag">Regalo extra · para tu tesis o posgrado</span>' +
        '<h3>¿Estás haciendo una especialización, maestría o tesis?</h3>' +
        '<p>El concurso premia tu formación (vale el 25% en antecedentes) y muchos docentes avanzan con un posgrado. ' +
        'Si estás en esas, te hago un <strong>informe preliminar de investigación gratis</strong>: te devuelvo el mapa ' +
        'inicial de tu tema — qué se ha publicado, por dónde empezar a leer y dónde está el vacío del que puede salir tu aporte.</p>' +
        '<a class="rf-cta rf-primary" href="' + SITE + '/informe.html" target="_blank" rel="noopener">Envíame mi tema → informe gratis</a>' +
        '<a class="rf-secondary" href="' + WA_TEMA + '" target="_blank" rel="noopener">…o escríbeme directo por WhatsApp 📩</a>' +
      '</div>' +

      // Card producto estrella
      '<div class="rf-card">' +
        '<span class="rf-tag">Producto estrella</span>' +
        '<h3>El flujo del investigador</h3>' +
        '<p>El flujo de trabajo completo del investigador, montado contigo. De un tema difuso a una revisión de ' +
        'literatura sistemática lista para arrancar:</p>' +
        '<ul>' +
          '<li>Guía de literatura en modo profundo (decenas de papers verificables)</li>' +
          '<li>Vault de Obsidian con protocolo, PRISMA y matriz de extracción</li>' +
          '<li>Referencias listas para Zotero, etiquetadas por subárea</li>' +
          '<li>Asesoría 1:1 grabada para dejarte andando</li>' +
        '</ul>' +
        '<div class="rf-spacer"></div>' +
        '<a class="rf-cta rf-ghost" href="' + SITE + '/flujo.html" target="_blank" rel="noopener">Ver el flujo completo →</a>' +
      '</div>' +

      // Card cursos
      '<div class="rf-card">' +
        '<span class="rf-tag rf-tag-soft">Cursos del Lab</span>' +
        '<h3>Aprende IA aplicada, con método</h3>' +
        '<p>Cursos que se actualizan solos cada semana: desde IA para docentes hasta investigar con IA. ' +
        'Uno de ellos —Investiga con IA— es el que acompaña al Programa Investigador Digital.</p>' +
        '<div class="rf-spacer"></div>' +
        '<a class="rf-cta rf-ghost" href="' + SITE + '/#cursos" target="_blank" rel="noopener">Ver todos los cursos →</a>' +
      '</div>' +

      '<div class="rf-note">¿Dudas o quieres que hablemos de tu caso? Escríbeme a ' +
        '<a href="' + WA + '" target="_blank" rel="noopener" style="color:var(--claude);font-weight:700;text-decoration:none">WhatsApp +57 311 612 8640</a> ' +
        'o a jcamilope@researchailab.com. Sin compromiso.</div>' +

    '</div>';

  var anchor = document.querySelector('.instructor-card') || document.querySelector('.footer');
  if (anchor && anchor.parentNode) {
    anchor.parentNode.insertBefore(funnel, anchor);
  } else {
    document.body.appendChild(funnel);
  }
})();
