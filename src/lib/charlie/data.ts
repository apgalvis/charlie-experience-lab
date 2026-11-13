// Datos 100% sintéticos. Ningún valor corresponde a personas, cuentas o propiedades reales.

export type Persona = "soporte" | "comercial" | "marketing" | "tecnologia";
export type AdvertiserType = "Broker" | "Owner" | "Agente inmobiliario" | "Enterprise";
export type ScenarioId = "broker" | "owner" | "agente" | "enterprise" | "marketing";
export type Variant = "normal" | "insuficiente" | "restringido" | "historial" | "error" | "vacio" | "duplicado";

export const PERSONAS: { id: Persona; label: string; wants: string }[] = [
  { id: "soporte", label: "Soporte", wants: "Resolver y contener la duda del anunciante" },
  { id: "comercial", label: "Comercial", wants: "Responder con seguridad y detectar oportunidades" },
  { id: "marketing", label: "Marketing", wants: "Entender tendencias con evidencia" },
  { id: "tecnologia", label: "Tecnología", wants: "Inspeccionar el recorrido cuando está autorizado" },
];

export const VARIANTS: { id: Variant; label: string }[] = [
  { id: "normal", label: "Caso normal" },
  { id: "insuficiente", label: "Datos insuficientes" },
  { id: "restringido", label: "Acceso restringido" },
  { id: "historial", label: "Historial sin autorización" },
  { id: "error", label: "Error de datos" },
  { id: "vacio", label: "Sin resultados" },
  { id: "duplicado", label: "Cuenta duplicada" },
];

export type ProductStatus = "activo" | "por vencer" | "inactivo" | "desconocido";

export interface Account {
  id: string;
  name: string;
  type: AdvertiserType;
  totalProperties: number | null;
  evaluated: number | null;
  affected: number | null;
  product: { name: string; status: ProductStatus; endsIn: string | null } | null;
  sheet: Record<string, [string, string][]>;
}

export const ACCOUNTS: Record<string, Account> = {
  "BRK-SYN-2041": {
    id: "BRK-SYN-2041",
    name: "Inmobiliaria Brisa (ficticia)",
    type: "Broker",
    totalProperties: 48,
    evaluated: 48,
    affected: 12,
    product: { name: "Plan Destacado 50", status: "activo", endsIn: "en 74 días" },
    sheet: {
      Identificación: [["Tipo", "Broker"], ["ID sintético", "BRK-SYN-2041"], ["Alta", "mar 2024 (ficticio)"]],
      "Productos y vigencias": [["Plan Destacado 50", "Activo · vence en 74 días"], ["Impulso local", "Inactivo desde ago"]],
      Inventario: [["Total cuenta", "48"], ["Activas", "41"], ["Pausadas", "7"]],
      Actividad: [["Último ingreso", "hace 3 días"], ["Cambios recientes", "12 avisos editados el 28 oct"]],
      "Salud de cuenta": [["Contactos 30 días", "−38 % vs. periodo previo"], ["FID", "Término pendiente de definir"]],
    },
  },
  "OWN-SYN-0187": {
    id: "OWN-SYN-0187",
    name: "Propietario Demo 0187",
    type: "Owner",
    totalProperties: 1,
    evaluated: 1,
    affected: 1,
    product: null,
    sheet: {
      Identificación: [["Tipo", "Owner"], ["ID sintético", "OWN-SYN-0187"]],
      Inventario: [["Total cuenta", "1"], ["Estado", "En revisión"]],
      Actividad: [["Último ingreso", "hoy"]],
    },
  },
  "AGT-SYN-3310": {
    id: "AGT-SYN-3310",
    name: "Agente Demo L. Ficticio",
    type: "Agente inmobiliario",
    totalProperties: 17,
    evaluated: null,
    affected: null,
    product: { name: "Paquete Visibilidad 20", status: "por vencer", endsIn: "en 5 días" },
    sheet: {
      Identificación: [["Tipo", "Agente inmobiliario"], ["ID sintético", "AGT-SYN-3310"]],
      "Productos y vigencias": [["Paquete Visibilidad 20", "Por vencer · 5 días"], ["Plan Básico", "Estado desconocido"]],
      Inventario: [["Total cuenta", "17"], ["Usando el paquete", "16 de 20 espacios"]],
      Actividad: [["Último ingreso", "Dato no disponible"]],
    },
  },
  "ENT-SYN-0009": {
    id: "ENT-SYN-0009",
    name: "Grupo Hábitat Ejemplo",
    type: "Enterprise",
    totalProperties: 1000,
    evaluated: 640,
    affected: 87,
    product: { name: "Contrato Enterprise", status: "activo", endsIn: "en 8 meses" },
    sheet: {
      Identificación: [["Tipo", "Enterprise"], ["ID sintético", "ENT-SYN-0009"]],
      "Productos y vigencias": [["Contrato Enterprise", "Activo · 8 meses"]],
      Inventario: [["Total cuenta", "1,000"], ["Evaluadas", "640"], ["Con alerta", "87"]],
      Actividad: [["Carga masiva", "Última: hace 2 días"]],
      "Salud de cuenta": [["Score", "Sin definición acordada · no se muestra"]],
    },
  },
  "ENT-SYN-0112": {
    id: "ENT-SYN-0112",
    name: "Desarrollos Norte Demo",
    type: "Enterprise",
    totalProperties: 230,
    evaluated: 230,
    affected: null,
    product: { name: "Contrato Enterprise", status: "activo", endsIn: "en 5 meses" },
    sheet: {
      Identificación: [["Tipo", "Enterprise"], ["ID sintético", "ENT-SYN-0112"]],
      Inventario: [["Total cuenta", "230"]],
      Actividad: [["Campañas", "1 activa (ficticia)"]],
    },
  },
};

export interface Scenario {
  id: ScenarioId;
  label: string;
  advertiser: AdvertiserType;
  accountId: string;
  opening: string;
  suggestions: string[];
  goal: string;
  suggestedPersona: Persona;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "broker",
    label: "Broker sin contactos",
    advertiser: "Broker",
    accountId: "BRK-SYN-2041",
    opening: "Un broker dice que dejaron de llegarle contactos. ¿Qué está pasando?",
    suggestions: ["¿Cuáles propiedades?", "¿Me ayudas a responderle?", "Gracias"],
    goal: "Entender por qué bajaron los contactos del broker",
    suggestedPersona: "soporte",
  },
  {
    id: "owner",
    label: "Owner con duda sobre publicación",
    advertiser: "Owner",
    accountId: "OWN-SYN-0187",
    opening: "Un propietario pregunta por qué su aviso no aparece publicado.",
    suggestions: ["¿Qué le falta al aviso?", "¿Me ayudas a responderle?", "Gracias"],
    goal: "Explicar por qué el aviso no está visible",
    suggestedPersona: "soporte",
  },
  {
    id: "agente",
    label: "Agente con producto por vencer",
    advertiser: "Agente inmobiliario",
    accountId: "AGT-SYN-3310",
    opening: "Un agente me escribió, ¿qué debería saber antes de llamarle?",
    suggestions: ["¿Hay una oportunidad?", "¿Me ayudas a responderle?", "Gracias"],
    goal: "Preparar la conversación de renovación",
    suggestedPersona: "comercial",
  },
  {
    id: "enterprise",
    label: "Enterprise revisando inventario",
    advertiser: "Enterprise",
    accountId: "ENT-SYN-0009",
    opening: "Grupo Hábitat quiere saber qué pasa con su inventario, tienen como mil propiedades.",
    suggestions: ["¿Cuáles propiedades?", "¿Me ayudas a responderle?", "Revisemos otra cuenta"],
    goal: "Dimensionar el alcance del problema en el inventario",
    suggestedPersona: "soporte",
  },
  {
    id: "marketing",
    label: "Marketing pregunta por evolución",
    advertiser: "Enterprise",
    accountId: "ENT-SYN-0112",
    opening: "¿Cómo van los leads de Desarrollos Norte en las últimas 4 semanas contra las 4 previas?",
    suggestions: ["¿Qué explica el cambio?", "¿Me ayudas a resumirlo?", "Gracias"],
    goal: "Comparar leads 4 semanas vs. 4 previas",
    suggestedPersona: "marketing",
  },
];

// Leads semanales sintéticos (8 semanas: 4 previas + 4 recientes)
export const WEEKLY_LEADS = [
  { week: "S1", value: 142 }, { week: "S2", value: 151 }, { week: "S3", value: 138 }, { week: "S4", value: 149 },
  { week: "S5", value: 163 }, { week: "S6", value: 171 }, { week: "S7", value: 158 }, { week: "S8", value: 176 },
];

// Generador determinista de propiedades sintéticas
export type PropertyState = "Activa" | "Sin contactos" | "Pausada" | "Datos incompletos";
export interface Property {
  id: string;
  title: string;
  kind: string;
  state: PropertyState;
  contacts: number | null;
  updated: string;
}

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

const KINDS = ["Departamento", "Casa", "Oficina", "Terreno", "Local"];
const ZONES = ["Colonia Ejemplo", "Barrio Demo", "Fracc. Ficticio", "Zona Norte Demo", "Sector Prueba"];

export function makeProperties(accountId: string, total: number, affected: number): Property[] {
  const r = rng(accountId.split("").reduce((a, c) => a + c.charCodeAt(0), 7));
  const prefix = accountId.split("-")[0];
  return Array.from({ length: total }, (_, i) => {
    const step = affected > 0 ? Math.max(1, Math.floor(total / affected)) : Infinity;
    const isAffected = i % step === 0 && i / step < affected;
    const roll = r();
    const state: PropertyState = isAffected ? (roll < 0.15 ? "Datos incompletos" : "Sin contactos") : roll < 0.12 ? "Pausada" : "Activa";
    return {
      id: `${prefix}-P${String(i + 1).padStart(4, "0")}`,
      title: `${KINDS[Math.floor(r() * KINDS.length)]} en ${ZONES[Math.floor(r() * ZONES.length)]} ${Math.floor(r() * 90) + 1}`,
      kind: KINDS[i % KINDS.length] ?? "Casa",
      state,
      contacts: state === "Datos incompletos" ? null : state === "Sin contactos" ? 0 : Math.floor(r() * 30) + 1,
      updated: `${Math.floor(r() * 27) + 1} oct`,
    };
  });
}

export function getAccount(id: string): Account {
  const a = ACCOUNTS[id];
  if (!a) throw new Error(`Cuenta sintética desconocida: ${id}`);
  return a;
}
