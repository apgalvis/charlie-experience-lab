// Motor de conversación simulado: respuestas guionizadas, sin IA ni backend.
import type { Diagnosis, StateKind } from "@/components/charlie/blocks";
import { ACCOUNTS, getAccount, type Persona, type ScenarioId, type Variant } from "./data";

export type Block =
  | { t: "summary"; text: string }
  | { t: "diagnosis"; d: Diagnosis }
  | { t: "next"; title: string; detail: string; cta: string; prompt?: string }
  | { t: "evidence"; steps: string[]; caveats: string[] }
  | { t: "tech"; calls: { name: string; result: string; ms: number }[] }
  | { t: "clarify"; question: string; hint: string; options?: string[] }
  | { t: "product"; opportunity?: string | undefined }
  | { t: "coverage" }
  | { t: "table" }
  | { t: "chart" }
  | { t: "draft"; text: string }
  | { t: "state"; kind: StateKind };

export interface CaseCtx {
  investigating: string;
  status: string;
  next: string;
  situation: { label: string; value: string; tone?: "ok" | "warn" | "neutral" } | null;
}

export type Msg =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "switch"; from?: string; to: string }
  | { id: string; role: "charlie"; accountId: string | null; time: string; blocks: Block[]; feedback?: boolean; historical?: boolean; ctx: CaseCtx };

export interface ConvState {
  scenario: ScenarioId;
  persona: Persona;
  variant: Variant;
  techAllowed: boolean;
  accountId: string | null;
}

let n = 0;
const techIf = (p: Persona, tech: boolean, calls: { name: string; result: string; ms: number }[]): Block[] => (p === "tecnologia" && tech ? [{ t: "tech", calls }] : []);
function main(id: string): (typeof MAIN)[string] { const m = MAIN[id]; if (!m) throw new Error(id); return m; }
const uid = () => `m${++n}`;
const now = () => new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

const SITUATION: Record<string, CaseCtx["situation"]> = {
  "BRK-SYN-2041": { label: "Contactos 30 días", value: "−38 % · 12 de 48 evaluadas sin contactos", tone: "warn" },
  "OWN-SYN-0187": { label: "Aviso", value: "1 de 1 en revisión de calidad", tone: "warn" },
  "AGT-SYN-3310": { label: "Paquete Visibilidad 20", value: "Por vencer · 5 días", tone: "warn" },
  "ENT-SYN-0009": { label: "Inventario", value: "87 con alerta · 640 evaluadas de 1,000", tone: "warn" },
  "ENT-SYN-0112": { label: "Leads 4 semanas", value: "+12.3 % vs. 4 previas", tone: "ok" },
};

const MAIN: Record<string, { blocks: (p: Persona, tech: boolean) => Block[]; ctx: Omit<CaseCtx, "situation"> }> = {
  "BRK-SYN-2041": {
    ctx: { investigating: "Por qué bajaron los contactos del broker", status: "Causa probable identificada: 12 avisos editados sin teléfono visible.", next: "Revisar las 12 propiedades con el broker" },
    blocks: (p, tech) => [
      { t: "summary", text: "Los contactos de Inmobiliaria Brisa bajaron 38 % en 30 días. La caída se concentra en 12 de sus 48 propiedades, que se editaron el 28 de octubre y desde entonces no muestran medio de contacto." },
      { t: "diagnosis", d: {
        confidence: "media",
        confirmed: ["12 propiedades sin contactos desde el 28 oct", "Esas 12 se editaron el mismo día", "El plan Destacado 50 sigue activo"],
        unknown: ["Si la edición fue manual o por carga masiva", "Si hubo cambios en el canal de WhatsApp del broker"],
        impact: "Una cuarta parte del inventario no está recibiendo contactos.",
        recommend: "Pedir al broker que revise el medio de contacto en esas 12 propiedades.",
      } },
      { t: "next", title: "Revisar las 12 propiedades afectadas", detail: "Te muestro cuáles son para compartirlas con el broker.", cta: "Ver propiedades", prompt: "¿Cuáles propiedades?" },
      { t: "evidence", steps: ["Identificamos la cuenta BRK-SYN-2041 con el ID que compartiste.", "Comparamos contactos de los últimos 30 días contra los 30 previos.", "Agrupamos las propiedades sin contactos por fecha de última edición."], caveats: ["Los contactos de las últimas 24 h pueden no estar reflejados.", "No vemos datos personales de quienes contactan."] },
      ...techIf(p, tech, [{ name: "cuenta.buscar(id)", result: "1 coincidencia", ms: 84 }, { name: "contactos.comparar(30d)", result: "−38 %", ms: 212 }, { name: "propiedades.agrupar(editado)", result: "12 en 28 oct", ms: 167 }]),
    ],
  },
  "OWN-SYN-0187": {
    ctx: { investigating: "Por qué el aviso del propietario no está visible", status: "El aviso está en revisión: faltan fotos y precio.", next: "Pedir 3 fotos y el precio" },
    blocks: (p, tech) => [
      { t: "summary", text: "El aviso del propietario no está publicado todavía: está en revisión de calidad porque tiene una sola foto y no indica precio. En cuanto los complete, vuelve a revisión automática." },
      { t: "diagnosis", d: { confidence: "alta", confirmed: ["Estado del aviso: en revisión", "1 foto de 3 mínimas", "Precio vacío"], unknown: ["Tiempo exacto de la siguiente revisión"], impact: "El aviso no aparece en búsquedas mientras siga en revisión.", recommend: "Explicarle qué falta con pasos concretos." } },
      { t: "next", title: "Explicarle qué completar", detail: "Te preparo un borrador sencillo, sin tecnicismos.", cta: "Preparar respuesta", prompt: "¿Me ayudas a responderle?" },
      { t: "evidence", steps: ["Consultamos el estado del único aviso de la cuenta.", "Comparamos contra los requisitos mínimos de publicación."], caveats: [] },
      ...techIf(p, tech, [{ name: "aviso.estado()", result: "revision_calidad", ms: 61 }, { name: "aviso.validar()", result: "2 faltantes", ms: 95 }]),
    ],
  },
  "AGT-SYN-3310": {
    ctx: { investigating: "Qué saber antes de llamar al agente", status: "Su paquete vence en 5 días y usa 16 de 20 espacios.", next: "Proponer renovación antes del vencimiento" },
    blocks: (p, tech) => [
      { t: "summary", text: "Lo más importante: su Paquete Visibilidad 20 vence en 5 días y está usando 16 de 20 espacios. Es buen momento para hablar de renovación." },
      { t: "product", opportunity: p === "comercial" ? "Usa el 80 % del paquete. Si renueva, sus 16 propiedades conservan visibilidad sin interrupción." : undefined },
      { t: "next", title: "Hablar de renovación esta semana", detail: "Evita que 16 propiedades pierdan visibilidad.", cta: "Preparar mensaje", prompt: "¿Me ayudas a responderle?" },
      { t: "evidence", steps: ["Consultamos productos vigentes de la cuenta.", "Contamos espacios en uso del paquete."], caveats: ["El estado del Plan Básico es desconocido; no lo usamos para concluir."] },
      ...techIf(p, tech, [{ name: "productos.vigentes()", result: "1 por vencer", ms: 73 }]),
    ],
  },
  "ENT-SYN-0009": {
    ctx: { investigating: "Qué pasa con el inventario de Grupo Hábitat", status: "87 propiedades con alerta en 640 evaluadas; 360 sin evaluar.", next: "Revisar las 87 con alerta" },
    blocks: (p, tech) => [
      { t: "summary", text: "Revisamos 640 de las 1,000 propiedades de Grupo Hábitat. 87 tienen alerta, sobre todo por no recibir contactos en 30 días. Las otras 360 aún no se evalúan, así que no podemos hablar de toda la cuenta." },
      { t: "coverage" },
      { t: "diagnosis", d: { confidence: "media", confirmed: ["87 de 640 evaluadas con alerta", "La mayoría viene de la carga masiva de hace 2 días"], unknown: ["Estado de las 360 no evaluadas"], impact: "Cerca del 14 % de lo evaluado no está generando contactos.", recommend: "Compartir la lista de las 87 y pedir revisión de la carga." } },
      { t: "next", title: "Ver las 87 propiedades con alerta", detail: "Con filtros y búsqueda, sin listar las 1,000.", cta: "Ver propiedades", prompt: "¿Cuáles propiedades?" },
      ...techIf(p, tech, [{ name: "inventario.contar()", result: "1000", ms: 120 }, { name: "inventario.evaluar(lote)", result: "640/1000", ms: 1840 }]),
    ],
  },
  "ENT-SYN-0112": {
    ctx: { investigating: "Tendencia de leads: 4 semanas vs. 4 previas", status: "Subieron 12.3 % de forma sostenida.", next: "Identificar qué propiedades explican el aumento" },
    blocks: (p, tech) => [
      { t: "summary", text: "Los leads de Desarrollos Norte subieron 12.3 % en las últimas 4 semanas frente a las 4 previas (668 contra 580). El aumento es constante, no un pico aislado." },
      { t: "chart" },
      { t: "next", title: "Ver qué propiedades explican el aumento", detail: "Antes de atribuirlo a la campaña activa.", cta: "Explorar el cambio", prompt: "¿Qué explica el cambio?" },
      ...techIf(p, tech, [{ name: "leads.serie(8 sem)", result: "8 puntos", ms: 140 }]),
    ],
  },
};

const DRAFTS: Record<string, string> = {
  "BRK-SYN-2041": "Hola, gracias por avisarnos.\n\nRevisamos tu cuenta y vimos que 12 de tus propiedades dejaron de recibir contactos desde el 28 de octubre, el mismo día en que se editaron. En esas propiedades no aparece un medio de contacto visible.\n\n¿Podrías revisar que el teléfono o WhatsApp esté completo en esas publicaciones? Te comparto la lista. Si después de corregirlo sigues sin recibir contactos, lo revisamos juntos.",
  "OWN-SYN-0187": "Hola, gracias por escribirnos.\n\nTu aviso está en revisión y todavía no aparece en búsquedas. Para publicarlo, necesitamos:\n• Al menos 3 fotos (hoy tiene 1).\n• El precio de la propiedad.\n\nEn cuanto lo completes, se revisa de nuevo automáticamente.",
  "AGT-SYN-3310": "Hola, ¿cómo estás?\n\nTe escribo porque tu Paquete Visibilidad 20 vence en 5 días. Hoy lo estás aprovechando bien: 16 de tus propiedades lo usan.\n\nSi te interesa, revisamos juntos la renovación para que no pierdan visibilidad. ¿Te parece una llamada corta esta semana?",
  "ENT-SYN-0009": "Hola equipo de Grupo Hábitat:\n\nRevisamos 640 de sus 1,000 propiedades. 87 no han recibido contactos en los últimos 30 días; la mayoría proviene de la carga masiva de hace dos días. Les compartimos la lista para que revisen la información de contacto.\n\nLas 360 restantes aún están en revisión; les confirmaremos cuando tengamos el resultado.",
  "ENT-SYN-0112": "Resumen para el equipo: los leads de Desarrollos Norte subieron 12.3 % en las últimas 4 semanas (668 vs. 580). El aumento es sostenido. Siguiente paso: identificar qué propiedades lo explican antes de atribuirlo a la campaña.",
};

const SWITCH_TO: Record<string, string> = { "BRK-SYN-2041": "ENT-SYN-0009", "ENT-SYN-0009": "BRK-SYN-2041", "OWN-SYN-0187": "AGT-SYN-3310", "AGT-SYN-3310": "OWN-SYN-0187", "ENT-SYN-0112": "ENT-SYN-0009" };

function charlie(accountId: string | null, blocks: Block[], ctx: Omit<CaseCtx, "situation">, extra: { feedback?: boolean; historical?: boolean } = {}): Msg {
  return { id: uid(), role: "charlie", accountId, time: now(), blocks, ctx: { ...ctx, situation: accountId ? SITUATION[accountId] ?? null : null }, ...extra };
}

export const SCENARIO_ACCOUNT: Record<ScenarioId, string> = { broker: "BRK-SYN-2041", owner: "OWN-SYN-0187", agente: "AGT-SYN-3310", enterprise: "ENT-SYN-0009", marketing: "ENT-SYN-0112" };

export function respond(input: string, s: ConvState): { msgs: Msg[]; accountId: string | null } {
  const t = input.toLowerCase();
  const id = s.accountId;
  const idInText = Object.keys(ACCOUNTS).find((k) => t.includes(k.toLowerCase()));

  if (/gracias/.test(t)) {
    return { accountId: id, msgs: [charlie(id, [{ t: "summary", text: "Con gusto. Si el anunciante responde, retomamos desde aquí con el mismo contexto." }], { investigating: "Caso en pausa", status: "Conversación cerrada por ahora.", next: "Esperar respuesta del anunciante" })] };
  }

  if (/otra cuenta/.test(t) && id) {
    const to = SWITCH_TO[id] ?? "BRK-SYN-2041";
    const m = main(to);
    return { accountId: to, msgs: [
      { id: uid(), role: "switch", from: id, to },
      charlie(to, [{ t: "summary", text: `Cambiamos a ${getAccount(to).name}. Hay una revisión anterior de hace 2 días; la marco como histórica y no la mezclo con la cuenta previa.` }, ...m.blocks(s.persona, s.techAllowed).slice(1)], m.ctx, { feedback: true, historical: true }),
    ] };
  }

  // Identificación
  if (!id) {
    const target = idInText ?? (s.scenario !== "broker" ? SCENARIO_ACCOUNT[s.scenario] : null);
    if (!target) {
      return { accountId: null, msgs: [charlie(null, [
        { t: "summary", text: "Claro, lo reviso. Para no confundir cuentas, necesito un solo dato." },
        { t: "clarify", question: "¿Cuál es el ID de la cuenta del broker?", hint: "Con el ID basta. No compartas teléfonos ni correos del anunciante en el chat.", options: ["BRK-SYN-2041"] },
      ], { investigating: "Por qué bajaron los contactos del broker", status: "Esperando el ID de la cuenta.", next: "Compartir el ID de la cuenta" })] };
    }
    const v = s.variant;
    const holdCtx = { investigating: main(target).ctx.investigating, status: "Sin datos confiables para concluir.", next: "Resolver el bloqueo antes de responder" };
    if (v === "restringido") return { accountId: null, msgs: [charlie(null, [{ t: "summary", text: "Encontré la cuenta, pero no puedo mostrarte su información con tu perfil." }, { t: "state", kind: "restringido" }], holdCtx)] };
    if (v === "vacio") return { accountId: null, msgs: [charlie(null, [{ t: "state", kind: "vacio" }], { ...holdCtx, next: "Verificar el identificador" })] };
    if (v === "error") return { accountId: null, msgs: [charlie(null, [{ t: "state", kind: "error" }], { ...holdCtx, status: "La fuente de datos no respondió." })] };
    if (v === "duplicado") return { accountId: null, msgs: [charlie(null, [{ t: "state", kind: "duplicado" }, { t: "clarify", question: "¿Cuál de estas cuentas es?", hint: "Elegir una evita mezclar datos.", options: [target, `${target.slice(0, -1)}9`] }], { ...holdCtx, next: "Elegir la cuenta correcta" })] };
    const mm = main(target);
    let blocks = mm.blocks(s.persona, s.techAllowed);
    if (target === "ENT-SYN-0112" && v === "insuficiente") {
      blocks = [{ t: "state", kind: "incertidumbre" }, { t: "summary", text: "Desarrollos Norte tiene 5 semanas de actividad. En ese periodo recibió 410 leads, pero no hay 4 semanas previas completas para comparar. Te sugiero volver a revisar en 3 semanas." }];
      return { accountId: target, msgs: [charlie(target, blocks, { investigating: mm.ctx.investigating, status: "No hay datos suficientes para comparar periodos.", next: "Revisar de nuevo en 3 semanas" }, { feedback: true })] };
    }
    if (v === "historial") blocks = [{ t: "state", kind: "historial" }, ...blocks];
    return { accountId: target, msgs: [charlie(target, blocks, mm.ctx, { feedback: true })] };
  }

  const acc = getAccount(id);
  if (/propiedad|cuál|cual|falta/.test(t)) {
    if (id === "OWN-SYN-0187") {
      return { accountId: id, msgs: [charlie(id, [{ t: "summary", text: "Le faltan dos cosas: al menos 2 fotos más (tiene 1 de 3) y el precio. Todo lo demás está completo." }], { ...main(id).ctx, next: "Preparar respuesta al propietario" }, { feedback: true })] };
    }
    if (!acc.evaluated) {
      return { accountId: id, msgs: [charlie(id, [{ t: "summary", text: "No evaluamos propiedades en esta revisión, así que no puedo listarlas con confianza." }], main(id).ctx)] };
    }
    return { accountId: id, msgs: [charlie(id, [{ t: "summary", text: `Estas son las ${acc.affected} propiedades con alerta de ${acc.evaluated?.toLocaleString("es-MX")} evaluadas. Puedes cambiar el filtro para ver todas.` }, { t: "table" }], { ...main(id).ctx, next: "Compartir la lista con el anunciante" }, { feedback: true })] };
  }
  if (/respond|borrador|resum|mensaje/.test(t)) {
    return { accountId: id, msgs: [charlie(id, [{ t: "summary", text: "Aquí tienes un borrador. Revísalo y ajústalo a tu tono; Charlie no lo envía." }, { t: "draft", text: DRAFTS[id] ?? "" }], { ...main(id).ctx, status: "Borrador listo, sin enviar.", next: "Revisar y enviar desde tu canal" }, { feedback: true })] };
  }
  if (/oportunidad/.test(t)) {
    return { accountId: id, msgs: [charlie(id, [{ t: "summary", text: "Sí: la renovación es la oportunidad más clara. No veo señales suficientes para sugerir un producto adicional." }, { t: "product", opportunity: "Usa el 80 % del paquete. Una renovación anticipada evita que 16 propiedades pierdan visibilidad." }], main(id).ctx, { feedback: true })] };
  }
  if (/explica|cambio/.test(t)) {
    return { accountId: id, msgs: [charlie(id, [{ t: "summary", text: "El 70 % del aumento viene de 9 propiedades nuevas publicadas en la semana 5. La campaña activa empezó en la semana 7, así que no explica el cambio por sí sola." }, { t: "evidence", steps: ["Separamos leads por fecha de publicación de la propiedad.", "Comparamos contra el inicio de la campaña."], caveats: ["No medimos atribución de campañas; es una lectura temporal."] }], main(id).ctx, { feedback: true })] };
  }
  return { accountId: id, msgs: [charlie(id, [{ t: "summary", text: "No estoy seguro de haber entendido. ¿Quieres ver las propiedades afectadas, preparar una respuesta o revisar otra cuenta?" }], main(id).ctx)] };
}
