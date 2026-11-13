import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { AppShell, PageHeader } from "@/components/charlie/shell";
import {
  AccountCoverage, AccountStamp, ChartWithInsight, ChatMessage, ClarificationPrompt, ContextSwitch, DiagnosisSummary,
  DraftResponse, EmptyState, EvidenceDisclosure, Feedback, HistoricalResultBadge, LoadingMessage, NextBestAction,
  Pill, ProductStatusCompact, PropertyDataTable, StateBlock, Summary, TechTrace,
} from "@/components/charlie/blocks";
import { getAccount, WEEKLY_LEADS } from "@/lib/charlie/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/componentes")({
  head: () => ({
    meta: [
      { title: "Atelier de componentes · Charlie Experience Lab" },
      { name: "description", content: "Galería de componentes de Charlie con propósito, estados, cuándo usar y anti-patrones." },
      { property: "og:title", content: "Atelier de componentes · Charlie" },
      { property: "og:description", content: "Componentes de Charlie con propósito, estados y anti-patrones." },
    ],
  }),
  component: Componentes,
});

type S = "normal" | "vacio" | "error";
const brk = getAccount("BRK-SYN-2041");
const ent = getAccount("ENT-SYN-0009");

interface Spec { name: string; tier: "Respuesta" | "Profundizar" | "Actuar" | "Contexto" | "Sistema"; purpose: string; trigger: string; use: string; avoid: string; risk: string; anti: string; render: (s: S) => React.ReactNode }

const SPECS: Spec[] = [
  { name: "ChatMessage", tier: "Respuesta", purpose: "Contenedor de cada respuesta con identidad de cuenta y hora.", trigger: "Toda respuesta de Charlie.", use: "Siempre que Charlie hable.", avoid: "Para avisos globales del sistema.", risk: "Encadenar demasiados bloques en un mensaje.", anti: "Respuestas sin cuenta identificada que parecen referirse a la anterior.",
    render: (s) => <ChatMessage role="charlie" meta={<AccountStamp account={s === "vacio" ? null : brk} time="10:42" />}><Summary>{s === "error" ? "No pude leer los datos de la cuenta. No voy a suponer nada; inténtalo de nuevo en unos minutos." : s === "vacio" ? "Claro, lo reviso. ¿Cuál es el ID de la cuenta?" : "Los contactos bajaron 38 % en 30 días, concentrados en 12 de 48 propiedades."}</Summary></ChatMessage> },
  { name: "DiagnosisSummary", tier: "Respuesta", purpose: "Separar hechos, incógnitas, impacto y recomendación.", trigger: "Preguntas de «qué está pasando».", use: "Cuando hay un diagnóstico con evidencia.", avoid: "En respuestas de una sola frase o saludos.", risk: "Listas largas de hechos.", anti: "Mezclar supuestos con hechos confirmados.",
    render: (s) => s === "error" ? <StateBlock kind="error" /> : <DiagnosisSummary d={s === "vacio" ? { confidence: "baja", confirmed: ["La cuenta existe"], unknown: ["Contactos de los últimos 30 días", "Estado de las propiedades"], impact: "Dato no disponible.", recommend: "Volver a revisar cuando la fuente responda." } : { confidence: "media", confirmed: ["12 propiedades sin contactos", "Editadas el 28 oct"], unknown: ["Si fue carga masiva"], impact: "Un cuarto del inventario sin contactos.", recommend: "Revisar el medio de contacto." }} /> },
  { name: "NextBestAction", tier: "Actuar", purpose: "Una sola acción prioritaria, separada de los hallazgos.", trigger: "Después de un diagnóstico.", use: "Cuando hay un paso claro.", avoid: "Si no hay acción razonable: mejor no mostrarla.", risk: "Tres o más CTAs compitiendo.", anti: "CTA que simula ejecutar algo («Liberar», «Enviar leads»).",
    render: (s) => s === "vacio" ? <EmptyState title="Sin acción sugerida" detail="No mostramos el componente si no hay un paso útil." /> : s === "error" ? <StateBlock kind="restringido" /> : <NextBestAction title="Revisar las 12 propiedades" detail="Te muestro cuáles son." cta="Ver propiedades" /> },
  { name: "EvidenceDisclosure", tier: "Profundizar", purpose: "Trazabilidad en lenguaje simple, colapsada por defecto.", trigger: "Cualquier conclusión.", use: "Para que la persona confíe y explique.", avoid: "Como lugar para trazas técnicas.", risk: "Pasos demasiado detallados.", anti: "Abrirlo por defecto.",
    render: (s) => <EvidenceDisclosure steps={s === "vacio" ? ["Identificamos la cuenta."] : ["Identificamos la cuenta.", "Comparamos 30 días vs. 30 previos.", "Agrupamos por fecha de edición."]} caveats={s === "error" ? ["La fuente de inventario no respondió; las conclusiones son parciales."] : s === "vacio" ? [] : ["Las últimas 24 h pueden no estar reflejadas."]} /> },
  { name: "ClarificationPrompt", tier: "Respuesta", purpose: "Pedir solo el dato que falta.", trigger: "Falta identificar la cuenta o hay ambigüedad.", use: "Una pregunta, con ejemplo.", avoid: "Para recolectar datos «por si acaso».", risk: "Encadenar preguntas.", anti: "Formularios largos al inicio.",
    render: (s) => s === "error" ? <StateBlock kind="duplicado" /> : <ClarificationPrompt question="¿Cuál es el ID de la cuenta?" hint="Con el ID basta. No compartas datos personales." options={s === "vacio" ? undefined : ["BRK-SYN-2041"]} /> },
  { name: "ProductStatusCompact", tier: "Contexto", purpose: "Un producto relevante y su vigencia.", trigger: "Renovación o contactos afectados por el plan.", use: "Cuando el producto cambia la respuesta.", avoid: "Para listar todos los productos.", risk: "Volver la tarjeta un catálogo.", anti: "Mostrar productos inactivos sin motivo.",
    render: (s) => <ProductStatusCompact product={s === "vacio" ? null : s === "error" ? { name: "Plan Básico", status: "desconocido", endsIn: null } : getAccount("AGT-SYN-3310").product} opportunity={s === "normal" ? "Usa el 80 % del paquete." : undefined} /> },
  { name: "AccountCoverage", tier: "Contexto", purpose: "Distinguir total, evaluadas y afectadas.", trigger: "Inventarios grandes o revisiones parciales.", use: "Siempre que la revisión no cubra el 100 %.", avoid: "Cuentas de 1 propiedad.", risk: "Agregar más métricas.", anti: "Presentar afectadas como porcentaje del total sin evaluar.",
    render: (s) => <AccountCoverage total={s === "error" ? null : 1000} evaluated={s === "vacio" ? null : 640} affected={s === "normal" ? 87 : null} /> },
  { name: "PropertyDataTable", tier: "Profundizar", purpose: "Explorar propiedades con búsqueda, filtros y paginación.", trigger: "«¿Cuáles propiedades?»", use: "Listas de 5 a 1,000 elementos.", avoid: "Para 1–3 propiedades: mejor texto.", risk: "Demasiadas columnas.", anti: "1,000 barras o filas sin paginar.",
    render: (s) => s === "error" ? <StateBlock kind="error" /> : <PropertyDataTable account={s === "vacio" ? { ...brk, affected: 0 } : ent} /> },
  { name: "ChartWithInsight", tier: "Profundizar", purpose: "Comparar periodos con definición, denominador y lectura.", trigger: "Preguntas de tendencia con datos suficientes.", use: "Comparaciones de periodo.", avoid: "Con menos de 8 semanas de datos.", risk: "Gráficas decorativas.", anti: "Barras por propiedad repetitivas.",
    render: (s) => s === "normal" ? <ChartWithInsight data={WEEKLY_LEADS} /> : <StateBlock kind={s === "vacio" ? "incertidumbre" : "error"} /> },
  { name: "DraftResponse", tier: "Actuar", purpose: "Borrador editable y copiable, claramente no enviado.", trigger: "«¿Me ayudas a responderle?»", use: "Respuestas al anunciante.", avoid: "Para comunicaciones internas con datos sensibles.", risk: "Textos largos.", anti: "Botón «Enviar».",
    render: (s) => s === "error" ? <StateBlock kind="restringido" /> : <DraftResponse initial={s === "vacio" ? "" : "Hola, gracias por avisarnos. Revisamos tu cuenta y vimos que 12 propiedades…"} /> },
  { name: "RoleVisibility · TechTrace", tier: "Sistema", purpose: "Detalle técnico solo para perfiles autorizados.", trigger: "Rol Tecnología con permiso simulado.", use: "Inspeccionar el recorrido.", avoid: "En vista Comercial o Soporte.", risk: "Trazas que parecen evidencia pública.", anti: "Renderizar trazas en modo comercial.",
    render: (s) => s === "normal" ? <TechTrace calls={[{ name: "cuenta.buscar(id)", result: "1 coincidencia", ms: 84 }, { name: "contactos.comparar(30d)", result: "−38 %", ms: 212 }]} /> : <StateBlock kind="restringido" /> },
  { name: "ContextSwitch · HistoricalResultBadge", tier: "Sistema", purpose: "Marcar cambios de cuenta y datos históricos.", trigger: "Otra cuenta en el mismo chat o resultados previos.", use: "Siempre al cambiar de cuenta.", avoid: "Dentro de la misma cuenta.", risk: "Separadores muy frecuentes.", anti: "Mostrar la cuenta anterior como actual.",
    render: (s) => s === "error" ? <StateBlock kind="historial" /> : <div className="space-y-3"><ContextSwitch from="BRK-SYN-2041" to="ENT-SYN-0009" />{s === "normal" && <HistoricalResultBadge />}</div> },
  { name: "CaseStatus · Feedback", tier: "Sistema", purpose: "Estado del caso y valoración discreta.", trigger: "Después de un resultado.", use: "Al final de respuestas útiles.", avoid: "Antes del resultado o tras «Gracias».", risk: "Competir con la acción.", anti: "Encuestas largas o estrellas.",
    render: (s) => <div className="flex flex-wrap items-center gap-3"><Pill tone={s === "error" ? "err" : s === "vacio" ? "neutral" : "ok"}>{s === "error" ? "Bloqueado" : s === "vacio" ? "Esperando dato" : "Causa probable identificada"}</Pill>{s === "normal" && <Feedback />}</div> },
  { name: "Empty · Error · Loading", tier: "Sistema", purpose: "Estados honestos sin progreso ficticio.", trigger: "Esperas, fallas o ausencia de datos.", use: "Siempre con un siguiente paso.", avoid: "Porcentajes de progreso inventados.", risk: "Mensajes alarmistas.", anti: "Rellenar con datos supuestos.",
    render: (s) => s === "normal" ? <LoadingMessage /> : s === "vacio" ? <StateBlock kind="vacio" /> : <StateBlock kind="error" /> },
];

const TIERS = ["Respuesta", "Profundizar", "Actuar", "Contexto", "Sistema"] as const;

function Componentes() {
  const [mobile, setMobile] = useState(false);
  const [notes, setNotes] = useState(true);
  return (
    <AppShell>
      <PageHeader eyebrow="Atelier" title="Componentes con jerarquía, no una colección" lead="Cada pieza existe para un momento de la conversación. Primero responde, luego deja profundizar, después ayuda a actuar. El contexto y el sistema acompañan sin competir.">
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {TIERS.map((t, i) => <span key={t} className="flex items-center gap-2 text-xs"><Pill tone={i === 0 ? "ok" : "neutral"}>{i + 1}. {t}</Pill></span>)}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <div role="group" aria-label="Simulación de pantalla" className="inline-flex rounded-lg border bg-card p-0.5">
            <button aria-pressed={!mobile} onClick={() => setMobile(false)} className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs", !mobile && "bg-accent font-medium")}><Monitor className="size-3.5" />Escritorio</button>
            <button aria-pressed={mobile} onClick={() => setMobile(true)} className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs", mobile && "bg-accent font-medium")}><Smartphone className="size-3.5" />Móvil</button>
          </div>
          <label className="flex items-center gap-2 rounded-lg border bg-card px-3 text-xs"><input type="checkbox" checked={notes} onChange={(e) => setNotes(e.target.checked)} className="accent-primary" />Mostrar anotaciones</label>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-5xl space-y-6 px-6 pb-16 md:px-10">
        {SPECS.map((s) => <SpecCard key={s.name} spec={s} mobile={mobile} notes={notes} />)}
      </div>

      <section className="mx-auto max-w-5xl px-6 pb-24 md:px-10" aria-labelledby="compare">
        <h2 id="compare" className="text-xl font-semibold">Actual saturado vs. propuesto minimalista</h2>
        <p className="mt-2 text-muted-foreground">El mismo caso ficticio, dos formas de presentarlo.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-4">
            <Pill tone="err">Saturado</Pill>
            <div className="mt-3 grid grid-cols-3 gap-1.5 text-[10px] text-muted-foreground">
              {["Score 72", "FID 0.84", "Login 3d", "Plan A", "Plan B", "Plan C", "48 props", "41 act.", "7 paus.", "Leads 312", "CTR 2.1", "Visitas 9k", "Condición OK", "Región N", "Ejecutivo X"].map((x) => <div key={x} className="rounded border bg-surface p-1.5">{x}</div>)}
            </div>
            <div className="mt-2 flex h-14 items-end gap-0.5">{Array.from({ length: 48 }, (_, i) => <div key={i} className="flex-1 bg-chart-2" style={{ height: `${20 + ((i * 37) % 80)}%` }} />)}</div>
            <p className="mt-2 text-[11px] text-muted-foreground">El problema existe, pero la persona debe reconstruirlo. 48 barras sin insight, métricas sin definición.</p>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <Pill tone="ok">Propuesto</Pill>
            <div className="mt-3 space-y-3">
              <Summary>Los contactos bajaron 38 %. La caída viene de 12 propiedades editadas el 28 oct sin medio de contacto visible.</Summary>
              <NextBestAction title="Revisar las 12 propiedades" detail="Compartirlas con el broker." cta="Ver" />
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">Una conclusión, un siguiente paso. Lo demás, bajo demanda.</p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function SpecCard({ spec, mobile, notes }: { spec: Spec; mobile: boolean; notes: boolean }) {
  const [state, setState] = useState<S>("normal");
  return (
    <article id={spec.name} className="overflow-hidden rounded-2xl border bg-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
        <div className="flex items-center gap-3">
          <h2 className="font-mono text-sm font-medium">{spec.name}</h2>
          <Pill>{spec.tier}</Pill>
        </div>
        <div role="group" aria-label={`Estado de ${spec.name}`} className="inline-flex rounded-lg border p-0.5 text-xs">
          {(["normal", "vacio", "error"] as S[]).map((k) => (
            <button key={k} aria-pressed={state === k} onClick={() => setState(k)} className={cn("rounded-md px-2.5 py-1", state === k && "bg-accent font-medium")}>{k === "vacio" ? "Vacío / incompleto" : k === "error" ? "Error" : "Normal"}</button>
          ))}
        </div>
      </header>
      <div className={cn("grid", notes && "lg:grid-cols-[1fr_17rem]")}>
        <div className="bg-surface p-5">
          <div className={cn("mx-auto transition-[max-width] duration-200", mobile ? "max-w-[375px]" : "max-w-full")}>{spec.render(state)}</div>
        </div>
        {notes && (
          <dl className="space-y-3 border-t p-5 text-sm lg:border-l lg:border-t-0">
            <Note k="Propósito" v={spec.purpose} />
            <Note k="Disparador" v={spec.trigger} />
            <Note k="Cuándo usar" v={spec.use} />
            <Note k="Cuándo no" v={spec.avoid} />
            <Note k="Riesgo de saturación" v={spec.risk} />
            <Note k="Anti-patrón" v={spec.anti} warn />
          </dl>
        )}
      </div>
    </article>
  );
}

function Note({ k, v, warn }: { k: string; v: string; warn?: boolean }) {
  return <div><dt className={cn("eyebrow", warn && "text-destructive")}>{k}</dt><dd className="mt-0.5 text-muted-foreground">{v}</dd></div>;
}
