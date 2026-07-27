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
    },

    // ── El concurso: proceso y etapas ────────────────────────────────────────
    {
      t: ['SIMO'],
      titulo: 'SIMO',
      def: 'Sistema de apoyo para la Igualdad, el Mérito y la Oportunidad: la plataforma de la CNSC donde te inscribes, cargas soportes y consultas resultados. Todo el concurso se tramita ahí.',
      aula: 'Solo puntúa lo que subas certificado y dentro del plazo. Un título real sin soporte cargado vale cero.',
      src: { t: 'SIMO — plataforma oficial de la CNSC', u: 'https://simo.cnsc.gov.co', tipo: 'Plataforma oficial' }
    },
    {
      t: ['lista de elegibles'],
      titulo: 'Lista de elegibles',
      def: 'Listado en estricto orden de puntaje con quienes superaron todo el proceso. De ahí se nombra según el número de vacantes: el orden lo decide tu puntaje total, no el orden de inscripción.',
      aula: 'Por eso cada punto sobre el mínimo importa: no compites contra el umbral, compites contra los demás aspirantes de tu misma vacante.',
      src: { t: 'CNSC — Comisión Nacional del Servicio Civil', u: 'https://www.cnsc.gov.co', tipo: 'Entidad oficial' }
    },
    {
      t: ['valoración de antecedentes'],
      titulo: 'Valoración de antecedentes',
      def: 'Prueba clasificatoria que puntúa tu formación (posgrados) y tu experiencia certificada. No elimina, pero suma al puntaje total que define tu lugar en la lista de elegibles.',
      aula: 'Es la única parte que puedes mejorar antes del examen: reunir y certificar bien tus soportes.',
      src: { t: 'MEN — Carrera docente y concursos', u: 'https://www.mineducacion.gov.co/portal/adelante-maestros/Carrera-Docente/Concursos/', tipo: 'Portal oficial del MEN' }
    },
    {
      t: ['período de prueba', 'periodo de prueba'],
      titulo: 'Período de prueba',
      def: 'Etapa posterior al nombramiento que va hasta culminar el año escolar. Se cierra con evaluación de desempeño: si es satisfactoria, se inscribe en el escalafón (Decreto 1278, art. 31).',
      aula: 'Ojo con la trampa del examen: la norma dice "año escolar", no "año calendario" ni "seis meses".',
      src: { t: 'Decreto 1278 de 2002 — Estatuto de Profesionalización Docente', u: 'https://www.mineducacion.gov.co/1621/articles-86102_archivo_pdf.pdf', tipo: 'Norma oficial (MEN)' }
    },
    {
      t: ['escalafón', 'escalafon'],
      titulo: 'Escalafón docente',
      def: 'Estructura de grados y niveles salariales del Decreto 1278. Se asciende de grado por formación y de nivel dentro del grado por evaluación de competencias, no por antigüedad.',
      aula: 'Un posgrado es lo que más mueve tu ubicación en el escalafón — y también suma en antecedentes del concurso.',
      src: { t: 'Decreto 1278 de 2002 — Estatuto de Profesionalización Docente', u: 'https://www.mineducacion.gov.co/1621/articles-86102_archivo_pdf.pdf', tipo: 'Norma oficial (MEN)' }
    },

    // ── Normativa general ───────────────────────────────────────────────────
    {
      t: ['Ley 115'],
      titulo: 'Ley 115 de 1994 (Ley General de Educación)',
      def: 'La norma marco del sistema educativo colombiano: fines de la educación, estructura del servicio, autonomía escolar, PEI, gobierno escolar y áreas obligatorias.',
      aula: 'Cuando una pregunta va de fines de la educación, autonomía o PEI, la respuesta se ancla aquí.',
      src: { t: 'Ley 115 de 1994 — texto completo', u: 'https://www.mineducacion.gov.co/1621/articles-85906_archivo_pdf.pdf', tipo: 'Norma oficial (MEN)' }
    },
    {
      t: ['Decreto 1278'],
      titulo: 'Decreto 1278 de 2002',
      def: 'Estatuto de Profesionalización Docente: regula ingreso (solo por concurso de méritos), período de prueba, escalafón, evaluación y retiro de quienes se vincularon desde 2002.',
      aula: 'Convive con el Decreto 2277 de 1979, que rige a los docentes vinculados antes. Aplicar uno al otro es error clásico del examen.',
      src: { t: 'Decreto 1278 de 2002 — texto completo', u: 'https://www.mineducacion.gov.co/1621/articles-86102_archivo_pdf.pdf', tipo: 'Norma oficial (MEN)' }
    },
    {
      t: ['PEI'],
      titulo: 'PEI — Proyecto Educativo Institucional',
      def: 'La carta de navegación de cada institución (art. 73, Ley 115). Debe construirse con participación de la comunidad educativa y responder al contexto propio; por eso no se puede copiar de otro colegio.',
      aula: 'Un PEI que nadie usa es letra muerta: vive cuando se revisa periódicamente contra la práctica real del aula.',
      src: { t: 'Ley 115 de 1994 — artículo 73', u: 'https://www.mineducacion.gov.co/1621/articles-85906_archivo_pdf.pdf', tipo: 'Norma oficial (MEN)' }
    },
    {
      t: ['Ley 715'],
      titulo: 'Ley 715 de 2001',
      def: 'Distribuye competencias y recursos entre nación, departamentos y municipios. Define qué le toca a la entidad territorial certificada (nombrar docentes, calendario) y qué al rector (dirigir la institución).',
      aula: 'La pregunta de fondo casi siempre es "¿a quién le corresponde esto?". El rector no vincula ni nombra personal: eso es de la ETC.',
      src: { t: 'Ley 715 de 2001 — texto completo', u: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=4452', tipo: 'Norma oficial' }
    },
    {
      t: ['entidad territorial certificada', 'ETC'],
      titulo: 'ETC — Entidad territorial certificada',
      def: 'Departamento, distrito o municipio certificado para administrar el servicio educativo: nombra y traslada docentes, fija el calendario escolar y autoriza aperturas o cierres de sedes.',
      aula: 'Si la respuesta implica vincular personal, cerrar una sede o mover el calendario, la competencia es de la ETC, no de la institución.',
      src: { t: 'Ley 715 de 2001 — texto completo', u: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=4452', tipo: 'Norma oficial' }
    },
    {
      t: ['gobierno escolar'],
      titulo: 'Gobierno escolar',
      def: 'Lo integran tres órganos (Decreto 1860, art. 20): el rector, el consejo directivo y el consejo académico. El consejo de padres y el consejo estudiantil son de participación, no de gobierno.',
      aula: 'Meter al consejo de padres dentro del gobierno escolar es un distractor frecuente: participa, pero no gobierna.',
      src: { t: 'Decreto 1860 de 1994 — texto oficial', u: 'https://www.mineducacion.gov.co/1621/articles-86240_archivo_pdf.pdf', tipo: 'Norma oficial (MEN)' }
    },
    {
      t: ['consejo directivo'],
      titulo: 'Consejo directivo',
      def: 'Máxima instancia de participación y orientación académico-administrativa. ADOPTA el PEI y el manual de convivencia, aprueba el presupuesto del Fondo de Servicios Educativos y resuelve conflictos que no se resolvieron en instancias previas.',
      aula: 'Regla mnemotécnica: el académico ORIENTA lo pedagógico, el directivo ADOPTA y aprueba.',
      src: { t: 'Decreto 1860 de 1994 — texto oficial', u: 'https://www.mineducacion.gov.co/1621/articles-86240_archivo_pdf.pdf', tipo: 'Norma oficial (MEN)' }
    },
    {
      t: ['consejo académico'],
      titulo: 'Consejo académico',
      def: 'Instancia superior para orientar lo pedagógico: plan de estudios, evaluación institucional, y recomendación de la promoción anticipada. Orienta y recomienda; no adopta documentos institucionales.',
      aula: 'Si la pregunta es sobre plan de estudios o criterios de evaluación, la instancia es esta — no el consejo directivo.',
      src: { t: 'Decreto 1860 de 1994 — texto oficial', u: 'https://www.mineducacion.gov.co/1621/articles-86240_archivo_pdf.pdf', tipo: 'Norma oficial (MEN)' }
    },
    {
      t: ['Fondo de Servicios Educativos', 'FSE'],
      titulo: 'FSE — Fondo de Servicios Educativos',
      def: 'Cuenta de la institución para gastos de funcionamiento y calidad, con el rector como ordenador del gasto y el consejo directivo aprobando el presupuesto. Tiene destinaciones prohibidas.',
      aula: 'Con FSE NO se paga nómina docente ni bonificaciones. Sí mantenimiento y material pedagógico.',
      src: { t: 'Decreto 1075 de 2015 — Decreto Único Reglamentario de Educación', u: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=77913', tipo: 'Norma oficial' }
    },
    {
      t: ['personero'],
      titulo: 'Personero estudiantil',
      def: 'Estudiante del último grado, elegido por votación de todos los estudiantes, encargado de promover y defender los derechos de sus compañeros. NO es el representante de los estudiantes ante el consejo directivo.',
      aula: 'Ese representante es otro estudiante del último grado, elegido por el consejo estudiantil. Confundirlos es distractor recurrente.',
      src: { t: 'Decreto 1860 de 1994 — artículo 28', u: 'https://www.mineducacion.gov.co/1621/articles-86240_archivo_pdf.pdf', tipo: 'Norma oficial (MEN)' }
    },
    {
      t: ['Ley 1098'],
      titulo: 'Ley 1098 de 2006 (Código de Infancia y Adolescencia)',
      def: 'Establece la protección integral de niños, niñas y adolescentes, el interés superior del menor y la prevalencia de sus derechos sobre los de los demás.',
      aula: 'Ante indicios de vulneración, el docente reporta y activa la ruta. No investiga, no reúne pruebas, no confronta a la familia.',
      src: { t: 'Ley 1098 de 2006 — texto completo', u: 'https://www.icbf.gov.co/cargues/avance/docs/ley_1098_2006.htm', tipo: 'Norma oficial (ICBF)' }
    },
    {
      t: ['corresponsabilidad'],
      titulo: 'Corresponsabilidad',
      def: 'La protección de la niñez es responsabilidad conjunta de familia, sociedad y Estado — y la escuela es parte del Estado. Por eso el docente tiene deber de actuar, no opción de hacerlo.',
      aula: 'Omitir el reporte es falta. El reporte procede por indicios: no necesitas pruebas para activar la ruta.',
      src: { t: 'Ley 1098 de 2006 — texto completo', u: 'https://www.icbf.gov.co/cargues/avance/docs/ley_1098_2006.htm', tipo: 'Norma oficial (ICBF)' }
    },
    {
      t: ['restablecimiento de derechos'],
      titulo: 'Restablecimiento de derechos',
      def: 'Conjunto de actuaciones que las autoridades adelantan para devolver a un menor el ejercicio pleno de un derecho vulnerado. Lo lidera el ICBF o la comisaría de familia, con la escuela colaborando.',
      aula: 'Cuando el ICBF pide información académica dentro de un proceso, la institución colabora por canales formales: no exige orden judicial.',
      src: { t: 'Ley 1098 de 2006 — texto completo', u: 'https://www.icbf.gov.co/cargues/avance/docs/ley_1098_2006.htm', tipo: 'Norma oficial (ICBF)' }
    },
    {
      t: ['Cátedra de la Paz', 'Catedra de la Paz'],
      titulo: 'Cátedra de la Paz (Ley 1732 de 2014)',
      def: 'De obligatoria implementación en todas las instituciones educativas del país. Busca crear un espacio de aprendizaje y reflexión sobre cultura de paz, y se articula con competencias ciudadanas y memoria histórica.',
      aula: 'Al enseñar el conflicto armado: múltiples voces, enfoque de derechos, cuidado emocional y orientación a la no repetición. Ni versión única ni evasión del tema.',
      src: { t: 'Ley 1732 de 2014 — texto oficial', u: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=59313', tipo: 'Norma oficial' }
    },

    // ── Evaluación y currículo ──────────────────────────────────────────────
    {
      t: ['SIEE'],
      titulo: 'SIEE — Sistema Institucional de Evaluación de los Estudiantes',
      def: 'Cada institución define en su SIEE los criterios de evaluación y promoción, la escala institucional y su equivalencia con la nacional, y las estrategias de apoyo (Decreto 1290, art. 4).',
      aula: 'Que algo no esté en el SIEE no anula un derecho de la norma superior: la promoción anticipada procede aunque el SIEE no la regule.',
      src: { t: 'Decreto 1290 de 2009 — texto oficial', u: 'https://www.mineducacion.gov.co/1621/articles-187765_archivo_pdf_decreto_1290.pdf', tipo: 'Norma oficial (MEN)' }
    },
    {
      t: ['promoción anticipada'],
      titulo: 'Promoción anticipada',
      def: 'Figura del Decreto 1290 (art. 7): el consejo académico recomienda promover a un estudiante con desempeño superior, con aval institucional y consentimiento de los acudientes.',
      aula: 'No la decide la familia sola, ni un examen único, ni es automática por buenas notas: es vía institucional con deliberación.',
      src: { t: 'Decreto 1290 de 2009 — artículo 7', u: 'https://www.mineducacion.gov.co/1621/articles-187765_archivo_pdf_decreto_1290.pdf', tipo: 'Norma oficial (MEN)' }
    },
    {
      t: ['estándares básicos'],
      titulo: 'Estándares básicos de competencias',
      def: 'Referentes nacionales de lo que todo estudiante debe saber y saber hacer, organizados por GRUPOS de grados (1-3, 4-5, 6-7, 8-9, 10-11), no grado por grado.',
      aula: 'Esa es la distinción que más preguntan: los estándares van por grupos de grados; los DBA sí van por grado individual.',
      src: { t: 'Estándares básicos de competencias — MEN', u: 'https://www.mineducacion.gov.co/1621/article-116042.html', tipo: 'Referente oficial del MEN' }
    },
    {
      t: ['DBA'],
      titulo: 'DBA — Derechos Básicos de Aprendizaje',
      def: 'Conjunto de aprendizajes estructurantes por grado. Complementan a los estándares y orientan la planeación; no los reemplazan ni son un temario obligatorio en orden.',
      aula: 'Si un DBA de tu grado no aparece explícito en los estándares, no hay contradicción: operan en niveles distintos y se articulan.',
      src: { t: 'Derechos Básicos de Aprendizaje — Colombia Aprende', u: 'https://www.colombiaaprende.edu.co/contenidos/coleccion/derechos-basicos-de-aprendizaje', tipo: 'Referente oficial del MEN' }
    },

    // ── Educación inicial y áreas ───────────────────────────────────────────
    {
      t: ['actividades rectoras'],
      titulo: 'Actividades rectoras de la primera infancia',
      def: 'Juego, arte, literatura y exploración del medio. No son "materias" ni relleno: son las vías privilegiadas por las que el niño aprende y se desarrolla en educación inicial.',
      aula: 'Escolarizar el preescolar con planas, dictados y tareas tipo primaria es el error que más castiga el examen en este nivel.',
      src: { t: 'Lineamientos de educación inicial y Decreto 2247 — MEN', u: 'https://www.mineducacion.gov.co/1780/articles-341880_recurso_1.pdf', tipo: 'Documento oficial del MEN' }
    },
    {
      t: ['dimensiones del desarrollo'],
      titulo: 'Dimensiones del desarrollo',
      def: 'Ejes desde los que se observa el desarrollo integral en preescolar: corporal, cognitiva, comunicativa, socioafectiva, estética, espiritual y ética. La evaluación se describe por dimensiones.',
      aula: 'En preescolar la evaluación es cualitativa y descriptiva, y no hay reprobación (Decreto 2247).',
      src: { t: 'Lineamientos de educación inicial y Decreto 2247 — MEN', u: 'https://www.mineducacion.gov.co/1780/articles-341880_recurso_1.pdf', tipo: 'Documento oficial del MEN' }
    },
    {
      t: ['indagación'],
      titulo: 'Indagación científica',
      def: 'Enfoque en el que el estudiante recorre el ciclo completo: observa un fenómeno, formula hipótesis propias, diseña cómo contrastarlas y construye el concepto desde la evidencia.',
      aula: 'Que el docente demuestre y el estudiante registre NO es indagación: falta que el estudiante genere la pregunta y contraste su hipótesis.',
      src: { t: 'Estándares básicos de competencias en matemáticas y ciencias — MEN', u: 'https://www.mineducacion.gov.co/1621/articles-340021_recurso_1.pdf', tipo: 'Referente oficial del MEN' }
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
  // Dos reglas contra la saturación visual:
  //   1. Máximo MAX_POR_LECCION marcas en toda la lección.
  //   2. Máximo una marca por bloque de nivel superior. Sin esto, una tabla que
  //      lista cinco modelos pedagógicos en filas contiguas recibía cinco
  //      subrayados apiñados en la misma pantalla.
  var MAX_POR_LECCION = 8;

  function marcar(root) {
    // 1. Nodos de texto marcables, en orden de documento
    var nodos = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || n.nodeValue.length < 3) return NodeFilter.FILTER_REJECT;
        // Nunca dentro de enlaces, código, títulos ni sobre una marca existente
        if (n.parentElement.closest('a,code,pre,h1,h2,h3,h4,.glo,.glo-card')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) nodos.push(n);

    // 2. Primera posición de cada término DENTRO DE ESTA LECCIÓN.
    //    La prioridad la da el texto, no el orden de este archivo: así gana el
    //    término central de la lección (en C3, "gobierno escolar") y no uno que
    //    aparece de refilón en una pregunta del final ("retroalimentación").
    var cand = [];
    TERMINOS.forEach(function (d) {
      for (var i = 0; i < d.t.length; i++) {
        var re = reFor(d.t[i]);
        for (var k = 0; k < nodos.length; k++) {
          if (re.test(nodos[k].nodeValue)) { cand.push({ d: d, re: re, pos: k }); return; }
        }
      }
    });
    cand.sort(function (a, b) { return a.pos - b.pos; });

    // 3. Marcar respetando un bloque por marca y el tope de la lección
    var usados = [], puestas = 0;
    cand.forEach(function (c) {
      if (puestas >= MAX_POR_LECCION) return;
      // Desde su primera aparición hacia adelante, hasta hallar un bloque libre.
      // Sin este reintento, un término cuyo bloque inicial ya está ocupado (p. ej.
      // cuatro conceptos listados en la misma viñeta) se perdería por completo.
      for (var k = c.pos; k < nodos.length; k++) {
        var node = nodos[k];
        if (!node.parentNode) continue;
        var bloque = anchorFor(node, root);
        if (!bloque || usados.indexOf(bloque) !== -1) continue;
        var m = c.re.exec(node.nodeValue);
        if (!m) continue;
        usados.push(bloque);
        puestas++;
        var after = node.splitText(m.index);
        after.nodeValue = after.nodeValue.slice(m[0].length);
        var span = document.createElement('span');
        span.className = 'glo';
        span.textContent = m[0];
        span.title = 'Ver explicación breve';
        span.onclick = (function (sp, d) {
          return function (e) { e.stopPropagation(); toggle(sp, d); };
        })(span, c.d);
        after.parentNode.insertBefore(span, after);
        return;
      }
    });
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
