// ============================================================
// BUILD SEO — concurso-docente
//
// El problema que resuelve: las 31 lecciones y las 346 preguntas viven en
// content.js (549 KB) y solo entran al DOM cuando alguien hace clic y corre
// openDrawer(). Google no hace clic, así que todo ese contenido es invisible.
// El sitio entero competía con las ~1.000 palabras del index y una sola URL en
// el sitemap; en julio trajo 4 sesiones de búsqueda orgánica.
//
// Qué hace: emite una página estática por lección en /leccion/<id>.html con el
// contenido real ya renderizado, regenera el sitemap con las 32 URLs e inyecta
// JSON-LD de curso en el index. No toca app.js ni content.js: los lee.
//
// No son páginas puente: sirven el mismo contenido que la lección, accesible
// directamente, con navegación real entre lecciones y de vuelta al curso.
//
// Uso: node build-seo.js
// Volver a correrlo después de cada cambio en content.js o en PHASES.
// ============================================================
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DIR = __dirname;
const SITE = 'https://concurso-docente-ral.netlify.app';
const OUT_DIR = path.join(DIR, 'leccion');
const HOY = new Date().toISOString().slice(0, 10);

// ── Carga de datos ──────────────────────────────────────────────────────────
// De app.js se recorta solo el literal PHASES: evaluarlo entero arrancaría el
// código de DOM que trae debajo.
function cargarPhases() {
  const src = fs.readFileSync(path.join(DIR, 'app.js'), 'utf8');
  const ini = src.indexOf('const PHASES = [');
  if (ini === -1) throw new Error('No se encontró "const PHASES = [" en app.js');
  const fin = src.indexOf('\n];', ini);
  if (fin === -1) throw new Error('No se encontró el cierre de PHASES en app.js');
  const ctx = { OUT: null };
  vm.createContext(ctx);
  vm.runInContext(src.slice(ini, fin + 3) + '\nthis.OUT = PHASES;', ctx);
  return ctx.OUT;
}

// content.js termina en window.LESSON_CONTENT = CONTENT, así que basta un stub
// de window para leerlo sin tocar el archivo.
function cargarContent() {
  const src = fs.readFileSync(path.join(DIR, 'content.js'), 'utf8');
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  if (!ctx.window.LESSON_CONTENT) throw new Error('content.js no expuso window.LESSON_CONTENT');
  return ctx.window.LESSON_CONTENT;
}

// Netlify sirve los .html como "pretty URLs": pide /leccion/A1.html y responde
// 301 hacia /leccion/a1 (sin extensión y en minúscula). Si el canonical, el
// sitemap y los enlaces apuntan a la forma con .html, cada URL del sitio pasa
// por un redirect antes de llegar. Se emite directamente la forma final.
const slug = id => String(id).toLowerCase();
const urlLeccion = id => `${SITE}/leccion/${slug(id)}`;

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// La meta description se arma con los bullets, que ya son el resumen real de la
// lección. Se corta en 155 para que Google no la trunque a media frase.
function descripcion(lesson) {
  const txt = (lesson.bullets || []).join('. ').replace(/\s+/g, ' ').trim();
  if (txt.length <= 155) return txt;
  const corte = txt.slice(0, 152);
  return corte.slice(0, corte.lastIndexOf(' ')) + '…';
}

// ── Estilos de las páginas de lección ───────────────────────────────────────
// Hoja propia y compacta: la CSS del index está atada a la estructura de la SPA
// y arrastrarla entera aquí traería reglas que no aplican.
const CSS = `
:root{--bg:#faf9f7;--card:#fff;--text:#1c1a17;--muted:#5f5c56;--dim:#8a8680;
--border:#e6e3dd;--claude:#d97706;--claude-2:#f59e0b}
@media(prefers-color-scheme:dark){:root{--bg:#16150f;--card:#1e1d16;--text:#f5f3ee;
--muted:#b5b0a5;--dim:#8a8680;--border:#302e26}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);line-height:1.7;
font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
.wrap{max-width:760px;margin:0 auto;padding:28px 20px 64px}
.crumb{font-size:13px;color:var(--dim);margin-bottom:22px}
.crumb a{color:var(--claude);text-decoration:none}
.crumb a:hover{text-decoration:underline}
.kicker{font-size:11.5px;font-weight:700;letter-spacing:.11em;text-transform:uppercase;
color:var(--claude);margin-bottom:8px}
h1{font-size:31px;line-height:1.22;letter-spacing:-.02em;margin:0 0 16px}
.resumen{margin:0 0 26px;padding:16px 20px;background:var(--card);border:1px solid var(--border);
border-left:3px solid var(--claude);border-radius:12px}
.resumen ul{margin:0;padding-left:19px}
.resumen li{margin-bottom:5px;color:var(--muted);font-size:14.5px}
.cuerpo h2{font-size:22px;line-height:1.3;margin:34px 0 12px}
.cuerpo h3{font-size:17px;margin:26px 0 9px}
.cuerpo p,.cuerpo li{font-size:15.5px;color:var(--muted)}
.cuerpo strong{color:var(--text)}
.cuerpo table{width:100%;border-collapse:collapse;margin:18px 0;font-size:14.5px;display:block;overflow-x:auto}
.cuerpo th,.cuerpo td{border:1px solid var(--border);padding:9px 12px;text-align:left}
.cuerpo th{background:var(--card);color:var(--text);font-weight:700}
.cuerpo details{margin:12px 0;padding:13px 16px;background:var(--card);
border:1px solid var(--border);border-radius:10px}
.cuerpo summary{cursor:pointer;font-weight:700;color:var(--claude);font-size:14.5px}
.cuerpo details p{margin:10px 0 0}
.cuerpo blockquote{margin:16px 0;padding:2px 18px;border-left:3px solid var(--border);color:var(--dim)}
.cuerpo code{background:var(--card);padding:2px 6px;border-radius:5px;font-size:13.5px}
.cta{display:block;margin:38px 0 8px;padding:20px 22px;background:var(--card);
border:1px solid var(--border);border-left:3px solid var(--claude);border-radius:12px;
text-decoration:none;color:inherit}
.cta:hover{border-color:var(--claude)}
.cta b{display:block;font-size:16.5px;margin-bottom:5px;color:var(--text)}
.cta span{font-size:14px;color:var(--muted)}
.nav{display:flex;gap:12px;justify-content:space-between;margin-top:30px;
padding-top:22px;border-top:1px solid var(--border);font-size:14px}
.nav a{color:var(--claude);text-decoration:none;max-width:46%;font-weight:600}
.nav a:hover{text-decoration:underline}
footer{margin-top:44px;padding-top:20px;border-top:1px solid var(--border);
font-size:12.5px;color:var(--dim)}
footer a{color:var(--claude);text-decoration:none}
.ral-seo{margin:36px 0 8px;padding:22px 24px;background:var(--card);border:1px solid var(--border);
border-radius:12px;position:relative;overflow:hidden}
.ral-seo::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;
background:linear-gradient(180deg,var(--claude),var(--claude-2))}
.ral-seo .ral-k{font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
color:var(--claude);margin-bottom:6px}
.ral-seo .ral-t{font-size:17px;font-weight:700;line-height:1.3;margin-bottom:8px;color:var(--text)}
.ral-seo .ral-p{font-size:14px;color:var(--muted);line-height:1.6;margin-bottom:14px}
.ral-seo .ral-btn{display:inline-block;padding:10px 20px;background:var(--claude);color:#fff;
font-weight:700;font-size:14px;border-radius:8px;text-decoration:none;transition:opacity .2s}
.ral-seo .ral-btn:hover{opacity:.88}
.ral-seo .ral-alt{display:inline-block;margin-left:12px;font-size:13px;color:var(--claude);
text-decoration:none;font-weight:600}
.ral-seo .ral-alt:hover{text-decoration:underline}
@media(max-width:600px){h1{font-size:25px}.wrap{padding:20px 16px 48px}
.ral-seo .ral-btn,.ral-seo .ral-alt{display:block;text-align:center;margin:6px 0 0}}
`.trim();

// ── CTAs de Research AI Lab para páginas SEO ──────────────────────────────
// Las páginas SEO son la puerta de entrada orgánica: Google las indexa y las
// sirve a gente que busca "concurso docente". Si solo tienen un enlace de
// vuelta al curso, el visitante nunca descubre los servicios de pago.
const WA = 'https://wa.me/573116128640';
const RAL = 'https://researchailab.com';
function waMsg(msg) { return WA + '?text=' + encodeURIComponent(msg); }

const RAL_CTAS = {
  thesis: {
    kicker: 'Research AI Lab',
    titulo: '¿Estás haciendo o planeas tu tesis de posgrado?',
    texto: 'Para subir en el escalafón necesitas un posgrado, y toda tesis empieza por la revisión de literatura. Cuéntanos tu tema y te devolvemos <strong>gratis</strong> un informe preliminar con las referencias que necesitas.',
    btn: { text: 'Enviar mi tema → informe gratis', href: RAL + '/informe.html' },
    alt: { text: 'O por WhatsApp', href: waMsg('Hola, vi el curso del Concurso Docente. Estoy haciendo mi tesis sobre: [mi tema]. ¿Me ayudan con el informe de referencias?') }
  },
  flujo: {
    kicker: 'Research AI Lab',
    titulo: '¿Necesitas ayuda con tu investigación?',
    texto: 'Asesoría personalizada + entregables reales: revisión de literatura sistematizada, vault de Obsidian con tus referencias organizadas y guía paso a paso con tu tutor de tesis.',
    btn: { text: 'Conocer el Flujo del Investigador', href: RAL + '/flujo.html' },
    alt: { text: 'Preguntar por WhatsApp', href: waMsg('Hola, vi el curso del Concurso Docente. Me interesa la asesoría de investigación. ¿Cómo funciona?') }
  },
  prompts: {
    kicker: 'Recurso gratuito',
    titulo: '8 prompts de IA para planeación docente',
    texto: 'Pack listo para copiar y pegar en Claude o ChatGPT: planeación de clase, rúbricas, retroalimentación y gestión de aula. Descárgalo gratis.',
    btn: { text: 'Descargar el pack gratis', href: '/Pack-8-Prompts-Planeacion-Docente.pdf' },
    alt: { text: 'Más recursos en Research AI Lab', href: RAL }
  },
  cursos: {
    kicker: 'Research AI Lab',
    titulo: '¿Te gustó este curso? Aprende a crear el tuyo',
    texto: 'Guía gratuita con el método completo: backward design, IA para generar contenido validado, y cómo un curso gratis se convierte en el imán de un negocio real.',
    btn: { text: 'Descargar la guía gratis', href: '/Metodo-Crea-tu-Curso-con-IA.pdf' },
    alt: { text: 'Ver todos los cursos', href: RAL + '/#cursos' }
  }
};

// Rotación: tesis en lecciones de normativa/final (C, F, P), flujo en aptitudes
// (D), prompts en pedagogía (B), cursos en orientación (A, E).
function elegirCta(id) {
  const letra = id.charAt(0).toUpperCase();
  if (letra === 'C' || letra === 'F') return RAL_CTAS.thesis;
  if (letra === 'P') return RAL_CTAS.flujo;
  if (letra === 'D') return RAL_CTAS.prompts;
  if (letra === 'B') return RAL_CTAS.prompts;
  if (letra === 'A') return RAL_CTAS.cursos;
  if (letra === 'E') return RAL_CTAS.thesis;
  return RAL_CTAS.thesis;
}

function htmlCta(id) {
  const c = elegirCta(id);
  return `
<div class="ral-seo">
  <div class="ral-k">${c.kicker}</div>
  <div class="ral-t">${c.titulo}</div>
  <div class="ral-p">${c.texto}</div>
  <a class="ral-btn" href="${esc(c.btn.href)}" target="_blank" rel="noopener">${c.btn.text}</a>
  <a class="ral-alt" href="${esc(c.alt.href)}" target="_blank" rel="noopener">${c.alt.text} →</a>
</div>`;
}

// content.js escribe h3/h4 porque dentro del drawer cuelgan del título de la
// lección. Acá el título es el h1 de la página, así que se suben un nivel para
// no dejar el hueco de h2 que rompe la jerarquía de encabezados.
// El orden importa: primero h3→h2 y después h4→h3. Al revés, los h4 originales
// pasarían a h3 y la segunda pasada los subiría otra vez hasta h2.
function subirEncabezados(html) {
  return html
    .replace(/<h3>/g, '<h2>').replace(/<\/h3>/g, '</h2>')
    .replace(/<h4>/g, '<h3>').replace(/<\/h4>/g, '</h3>');
}

// ── Plantilla de página ─────────────────────────────────────────────────────
function pagina(lesson, fase, prev, next, html) {
  const url = urlLeccion(lesson.id);
  const titulo = `${lesson.title} — Concurso Docente Colombia 2026`;
  const desc = descripcion(lesson);

  // LearningResource describe mejor una lección suelta que Course, y el
  // isPartOf la amarra al curso completo que vive en la raíz.
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lesson.title,
    description: desc,
    url,
    inLanguage: 'es-CO',
    learningResourceType: 'Lección',
    educationalLevel: 'Profesional',
    teaches: (lesson.bullets || []).join(' · '),
    isAccessibleForFree: true,
    author: { '@type': 'Person', name: 'Juan Camilo Pérez Hernández' },
    provider: { '@type': 'Organization', name: 'Research AI Lab', url: 'https://researchailab.com' },
    isPartOf: { '@type': 'Course', name: 'Concurso Docente Colombia 2026', url: SITE + '/' }
  };

  const migas = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Concurso Docente Colombia', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: fase.title, item: `${SITE}/#phase-${fase.id}` },
      { '@type': 'ListItem', position: 3, name: lesson.title, item: url }
    ]
  };

  return `<!DOCTYPE html>
<html lang="es-CO">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="es_CO">
<meta name="author" content="Juan Camilo Perez Hernandez">
<meta name="theme-color" content="#d97706">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#127793;</text></svg>">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script type="application/ld+json">${JSON.stringify(migas)}</script>
<style>${CSS}</style>
</head>
<body>
<div class="wrap">

<nav class="crumb"><a href="/">Concurso Docente Colombia</a> › <a href="/#phase-${fase.id}">${esc(fase.title)}</a> › ${esc(lesson.id)}</nav>

<div class="kicker">Módulo ${esc(fase.num)} · ${esc(fase.title)}</div>
<h1>${esc(lesson.title)}</h1>

<div class="resumen"><ul>${(lesson.bullets || []).map(b => `<li>${b}</li>`).join('')}</ul></div>

<article class="cuerpo">${subirEncabezados(html)}</article>

${htmlCta(lesson.id)}

<a class="cta" href="/#phase-${fase.id}">
  <b>Practica esta lección en el curso completo</b>
  <span>31 lecciones y más de 430 preguntas tipo examen, con la explicación de por qué cada distractor está mal. Gratis y sin registro.</span>
</a>

<nav class="nav">
  ${prev ? `<a href="/leccion/${slug(prev.id)}">← ${esc(prev.title)}</a>` : '<span></span>'}
  ${next ? `<a href="/leccion/${slug(next.id)}" style="text-align:right">${esc(next.title)} →</a>` : '<span></span>'}
</nav>

<footer>
  Parte del curso gratuito <a href="/">Concurso Docente Colombia 2026</a>, de
  <a href="https://researchailab.com" target="_blank" rel="noopener">Research AI Lab</a>.
  Contenido verificado contra el Decreto 1278 de 2002, la Ley 115 de 1994 y las
  convocatorias vigentes de la CNSC.
</footer>

</div>
</body>
</html>
`;
}

// ── Ejecución ───────────────────────────────────────────────────────────────
const PHASES = cargarPhases();
const CONTENT = cargarContent();

// Orden plano: hace falta para los enlaces anterior/siguiente, que son los que
// le dan a Google un camino para recorrer las 31 páginas.
const plano = [];
PHASES.forEach(f => (f.lessons || []).forEach(l => plano.push({ lesson: l, fase: f })));

// Se vacía primero: si una lección se renombra o desaparece de PHASES, su página
// vieja quedaría publicada y sin enlaces, y el sitemap ya no la nombraría.
if (fs.existsSync(OUT_DIR)) {
  fs.readdirSync(OUT_DIR)
    .filter(f => f.endsWith('.html'))
    .forEach(f => fs.unlinkSync(path.join(OUT_DIR, f)));
} else {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// La cadena anterior/siguiente se arma solo con las lecciones que sí tienen
// página. Recorriendo `plano` se enlazaba a los quizzes Q1–Q6, que no generan
// archivo, y cada lección contigua a un quiz quedaba apuntando a un 404.
const sinContenido = plano
  .filter(i => !(CONTENT[i.lesson.id] && CONTENT[i.lesson.id].html))
  .map(i => i.lesson.id);

const conPagina = plano.filter(i => CONTENT[i.lesson.id] && CONTENT[i.lesson.id].html);

let escritas = 0;

conPagina.forEach((item, i) => {
  const html = CONTENT[item.lesson.id].html;
  const prev = i > 0 ? conPagina[i - 1].lesson : null;
  const next = i < conPagina.length - 1 ? conPagina[i + 1].lesson : null;

  fs.writeFileSync(
    path.join(OUT_DIR, slug(item.lesson.id) + '.html'),
    pagina(item.lesson, item.fase, prev, next, html),
    'utf8'
  );
  escritas++;
});

// ── Sitemap ─────────────────────────────────────────────────────────────────
const urls = [`  <url>
    <loc>${SITE}/</loc>
    <lastmod>${HOY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`];

plano.forEach(item => {
  if (!CONTENT[item.lesson.id] || !CONTENT[item.lesson.id].html) return;
  urls.push(`  <url>
    <loc>${urlLeccion(item.lesson.id)}</loc>
    <lastmod>${HOY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
});

fs.writeFileSync(path.join(DIR, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
  'utf8');

// ── JSON-LD de curso en el index ────────────────────────────────────────────
// Se inserta entre marcas para poder reemplazarlo en cada corrida sin duplicar.
const curso = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Concurso Docente Colombia 2026',
  description: 'Curso gratuito de preparación para el concurso docente colombiano 2026 (ingreso y ascenso): pedagogía, normativa, lectura crítica y área disciplinar, con simulacros tipo examen.',
  url: SITE + '/',
  inLanguage: 'es-CO',
  isAccessibleForFree: true,
  educationalLevel: 'Profesional',
  provider: { '@type': 'Organization', name: 'Research AI Lab', url: 'https://researchailab.com' },
  author: { '@type': 'Person', name: 'Juan Camilo Pérez Hernández' },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    courseWorkload: 'P6W',
    instructor: { '@type': 'Person', name: 'Juan Camilo Pérez Hernández' }
  },
  hasPart: plano
    .filter(i => CONTENT[i.lesson.id] && CONTENT[i.lesson.id].html)
    .map(i => ({
      '@type': 'LearningResource',
      name: i.lesson.title,
      url: urlLeccion(i.lesson.id)
    }))
};

const MARCA_INI = '<!-- SEO-JSONLD:inicio (generado por build-seo.js) -->';
const MARCA_FIN = '<!-- SEO-JSONLD:fin -->';
const bloque = `${MARCA_INI}\n<script type="application/ld+json">${JSON.stringify(curso)}</script>\n${MARCA_FIN}`;

const idxPath = path.join(DIR, 'index.html');
let idx = fs.readFileSync(idxPath, 'utf8');

if (idx.includes(MARCA_INI)) {
  idx = idx.replace(new RegExp(MARCA_INI.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + MARCA_FIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), bloque);
} else {
  idx = idx.replace('</head>', bloque + '\n</head>');
}
fs.writeFileSync(idxPath, idx, 'utf8');

// ── Reporte ─────────────────────────────────────────────────────────────────
console.log(`Páginas de lección escritas : ${escritas} en /leccion/`);
console.log(`URLs en sitemap.xml         : ${urls.length}`);
console.log(`JSON-LD de curso en index   : ${curso.hasPart.length} lecciones enlazadas`);
if (sinContenido.length) {
  // Q1–Q6 son los quizzes: no tienen prosa en content.js, así que no les
  // corresponde página propia. Si aparece otra cosa acá, revisar.
  console.log(`Sin página (sin html propio): ${sinContenido.join(', ')}`);
}
