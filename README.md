# Charlie Experience Lab

Crea un proyecto NUEVO de Lovable llamado conceptualmente “Charlie · Experience Lab” (laboratorio UX/UI, NO la aplicación real). El objetivo es un prototipo visual INTERACTIVO de la experiencia de un asistente interno de soporte y operaciones para propiedades.com. No conectes APIs reales, Supabase, servicios externos, GitHub ni backend; NO configures autenticación, publicación ni despliegue. Todo debe correr con datos 100% SINTÉTICOS, estado local React, sin datos personales reales. No usar los correos, teléfonos, nombres o IDs que se vean en capturas privadas. Idioma español.

PRINCIPIO NARRATIVO / NORTE
Charlie debe sentirse como un colega experto, discreto, calmado, útil y confiable: al abrirlo el usuario siente orientación, no intimidación; al investigar, claridad y control; al resolver, seguridad para responderle al anunciante y capacidad de acción sin prometer lo no probado. Debe ser igual de usable para personas de Soporte, Comercial, Marketing y Tecnología, sin imponer jerga técnica ni tecnicismos. NO diseñes sobre supuestas capacidades agentic: nos concentramos en composición UX, componentes, narrativa, ejemplos de interacción, estados y jerarquía de información.

ESTILO VISUAL
Diseño enterprise premium de alta calidad, extremadamente limpio, tipografía legible, contraste correcto, blanco roto/gris muy suave, negro carbón, verde institucional discreto para acciones, ámbar para alertas y rojo solo para errores. Mucho aire, bordes sutiles, microinteracciones rápidas y sobrias, sin gradientes decorativos, sin gráficos de adorno, sin paneles tipo dashboard recargado. Inspiración en interfaces de producto profesional de última generación (sin copiar marcas). Reglas WCAG AA, estados de foco, teclado, reduced motion, layout responsive. Escritorio recomendado: barra lateral navegación compacta (izq), área de conversación dominante (centro 65–75%), panel contexto complementario (derecha 25–30%); derecha muy compacta, sin largas listas ni scroll interno. En móvil: chat prioritario, contexto en drawer/sheet bajo demanda. Evitar que overlays flotantes invadan el input. Evitar layout shift.

ENTREGABLES COMO RUTAS INTERNAS INTERACTIVAS
1) / — portada “Cómo debe sentirse Charlie”: narrativa en primera persona de cada rol, cinco principios de experiencia, botones “Explorar una conversación” y “Ver componentes”.
2) /workspace — demostración funcional de interfaz, con selector de PERSONA USUARIA INTERNA (Soporte, Comercial, Marketing, Tecnología) y selector de ESCENARIO (broker sin contactos; owner con duda sobre publicación; agente inmobiliario con producto por vencer; enterprise revisando inventario; marketing preguntando por evolución). Los tipos de anunciante son broker, owner, agente inmobiliario, enterprise; NO confundir con el rol del usuario interno. Contenido y panel se adaptan al escenario.
3) /componentes — galería/atelier de componentes con ejemplos, “cuándo usar / cuándo no usar”, tres estados (normal, vacío/incompleto, error), controles de alternar presentación y simulaciones responsive. Mostrar jerarquía y decisiones, no solo colección decorativa.
4) /decisiones — guía de evaluación de experiencia con trade-offs claros y propuestas, sin pretender que ya han sido aprobadas para el producto real.

NARRATIVA EN EL WORKSPACE (debe sentirse real, demostrable)
Ejemplo A, Soporte y broker: usuario escribe “Un broker dice que dejaron de llegarle contactos. ¿Qué está pasando?”; Charlie solicita solo identificador si no se conoce; identifica el anunciante sintético; produce un resumen fiable y distingue “hechos confirmados”, “qué no sabemos”, “impacto”, “siguiente mejor acción”. Permite hacer seguimiento “¿Cuáles propiedades?” -> tabla compacta/paginada dentro del chat; “¿Me ayudas a responderle?” -> borrador editable/copiable para el anunciante, nunca simular envío; “Gracias” -> cierre natural.
Ejemplo B Comercial con producto por vencer: muestra una única tarjeta relevante de plan y vencimiento + oportunidad comercial, no todos los productos.
Ejemplo C Marketing: pregunta tendencia de leads de 4 semanas vs previas; SOLO aquí gráfica de líneas/barras con ejes, periodo, denominador/comparación, nota de lectura accionable; escenario de datos insuficientes debe NO mostrar gráfica.
Ejemplo D Tecnología: respuesta “Qué verificó Charlie” con detalle expandible sujeto a permisos simulados, claramente separado de evidencia pública. Por defecto Comercial NO ve detalle de tools.
Ejemplo E Enterprise con hasta 1000 propiedades: no mostrar 1000 barras; ofrecer total conocido vs evaluadas vs afectadas, tabla con filtros, búsqueda y paginación, y una acción para ver más resultados sin saturar.
Todos los datos sintéticos claramente indicados. Nunca afirmar acciones hechas por sistema, leads enviados, liberación completada o contactos personales accesibles.

COMPONENTES CENTRALES DEL CHAT, CON JERARQUÍA Y ESTADOS
- Chat composer generoso, barra de entrada fija al pie, enter enviar / shift+enter salto, accesibilidad, sugerencias contextuales discretas, estado esperando/errores/rehacer.
- Mensaje breve de Charlie con resumen de 1–3 frases primero, sin sobrecargar.
- Bloque “Lo que encontramos” con hecho principal, nivel de confianza/limitación, impacto y “qué recomendamos”.
- Tarjeta de siguiente acción visible, accionable y separada de hallazgos.
- Aclaración puntual con 1 pregunta, no formulario largo.
- Tabla compacta de propiedades (búsqueda, orden, filtros, paginación 10/20/50, identificación de alcance total/evaluadas/mostradas/afectadas, estados), soportar hasta 1000 y casos incompletos.
- Comparador de periodos/KPI con definición, denominador y tendencia solo cuando el caso justifica comparación.
- Visualización cuantitativa con propósito y explicación textual, nada de barras por propiedad repetitivas o charts sin insight.
- Borrador editable/copiable con indicador “No enviado” y control de revisar; CTA no ejecutar.
- Evidencia/caveats/procedencia colapsables “Cómo llegó Charlie a esta conclusión”, no técnicos por defecto.
- Cambios de cuenta dentro del mismo chat: separador “Ahora revisamos otra cuenta”, identidad por respuesta, hora y aclaración de datos recuperados históricos; nunca mezclar cuentas.
- Estados distintos: inicio, loading/skeleton sin progreso ficticio, success, incertidumbre, acceso restringido, historial sin autorización, error de datos, sin resultados, duplicidad y cambio de anunciante.
- Feedback “¿Fue útil?” discreto después del resultado, no compite con acción.
- Microcopies reales, respetuosos, no grandilocuentes.

PANEL DERECHO: CONTEXTO COMPLEMENTARIO EN COMPONENTES, NO FICHA COMPLETA DUMP
El panel debe ser un resumen ejecutivo modular, máximo 4–5 tarjetas breves visibles y sin scroll interno. Priorizar lo útil según pregunta y rol. Diseñar:
A) Identidad compacta: tipo anunciante (Broker, Owner, Agente inmobiliario, Enterprise), ID sintético, estado identificación, nombre ficticio. Evitar PII irrelevante.
B) “Cuenta en contexto”: cuenta exacta a la que pertenece la última respuesta, referencia temporal, indicador “revisión anterior” si aplica; cuando respuesta actual no identifica cuenta, estado “Sin cuenta identificada en esta respuesta” y NO mostrar cuenta anterior como si fuera actual.
C) “Situación relevante”: 1 dato clave del caso (productos pagos y estado SOLO si importa a renovación o contactos; propiedades activas SOLO si hay fuente; caso contrario “Dato no disponible”, no inventar). Distinguir “total cuenta” vs “evaluadas”.
D) “Qué estamos investigando”: objetivo en una línea; estado actual y hallazgo en máximo 2 líneas.
E) “Próximo paso”: la acción prioritaria, sin duplicar párrafos del chat.
F) “Ver ficha completa” abre drawer/modal de información secundaria (el equivalente a un CRM/PCOM profundo) opcional, agrupada por Identificación, Productos y vigencias, Inventario, Actividad, Salud de cuenta; NO volcar esta ficha completa al panel. Si no es relevante, no presentar el componente.
G) Detalle técnico “Lo que hizo Charlie” SOLO para perfil autorizado, con control explícito simulado por UI y aviso de que no representa seguridad real de backend; jamás renderizar trazas técnicas en el modo comercial.

REGLA DE MOSTRAR O NO UN DATO
Para cada campo explicitar por qué ayuda a responder al anunciante. Si no impacta comprensión, decisión o siguiente acción: no mostrar por defecto. Productos pagos, condición del broker, último login, score, inventario, FID (término pendiente de definir) NO deben mostrarse a todos siempre. No inventar definiciones de FID. Añadir casos sintéticos de estados activo, por vencer, inactivo, desconocido, y avisos de “dato no disponible” sin ruido.

GALERÍA DE COMPONENTES
Cada componente con vista, propósito, disparador, riesgos de saturación y anti-patrones. Componentes: ChatMessage, DiagnosisSummary, EvidenceDisclosure, NextBestAction, ContextIdentity, ProductStatusCompact, AccountCoverage, PropertyDataTable, ChartWithInsight, DraftResponse, CaseStatus, ClarificationPrompt, RoleVisibility, ContextSwitch, HistoricalResultBadge, Feedback, Empty/Error/Loading. Vista comparativa "Actual saturado vs Propuesto minimalista" mostrando UN ejemplo sin copiar screenshots privados.

NARRACIÓN DE LAS EMOCIONES, explícita en interfaz y guía:
Al entrar: “Sé por dónde empezar”.
Al escribir: “Puedo hablar como hablo con alguien del equipo”.
Al recibir diagnóstico: “Entiendo el problema sin tener que reconstruirlo”.
Al profundizar: “Tengo información relevante, con trazabilidad, sin ser abrumadora”.
Al actuar: “Sé cuál es el siguiente paso, y sigo teniendo el control”.
Al volver: “Charlie reconoce el contexto sin mezclar cuentas”.
Personas: Comercial quiere responder con seguridad y detectar oportunidades; Soporte quiere resolver y contener dudas; Marketing quiere entender tendencias con evidencia; Tecnología quiere inspeccionar el recorrido cuando está autorizado.

IMPORTANTE
No construir agentes reales, tools, evaluaciones LangGraph ni backend; no conectar datos reales; no copiar valores reales de referencias visuales. El objetivo es un prototipo UX/UI de alta fidelidad, usable y navegable, con estados y respuestas simuladas. No publicar en Internet. Quiero un proyecto hermoso, disciplinado y con componentes reutilizables y narrativa de producto, priorizando lo que importa al trabajo diario.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9fe79d22-d2b0-4952-a2d2-ada1155a2d1c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
