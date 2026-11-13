import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/charlie/shell";
import { Pill } from "@/components/charlie/blocks";

export const Route = createFileRoute("/decisiones")({
  head: () => ({
    meta: [
      { title: "Decisiones de experiencia · Charlie Experience Lab" },
      { name: "description", content: "Guía de evaluación con trade-offs y propuestas de diseño para Charlie, pendientes de validación." },
      { property: "og:title", content: "Decisiones de experiencia · Charlie" },
      { property: "og:description", content: "Trade-offs y propuestas de diseño para Charlie, pendientes de validación." },
    ],
  }),
  component: Decisiones,
});

const DECISIONS = [
  { q: "¿Dónde vive el contexto de la cuenta?", a: "Panel derecho con máximo 4–5 tarjetas", b: "Ficha completa siempre visible", pro: "El chat sigue siendo protagonista y el panel responde a la pregunta actual.", con: "Quien necesita el detalle hace un clic extra (Ver ficha completa)." },
  { q: "¿Cuándo mostrar una gráfica?", a: "Solo si hay comparación de periodos con datos suficientes", b: "Gráfica en cada respuesta numérica", pro: "Cada gráfica tiene un insight y un denominador explícito.", con: "Algunas personas esperan ver algo visual siempre." },
  { q: "¿Cuánto pregunta Charlie antes de responder?", a: "Una sola aclaración puntual", b: "Formulario de datos al inicio", pro: "Se siente como hablar con un colega; baja la fricción.", con: "Casos ambiguos pueden requerir una segunda pregunta." },
  { q: "¿Quién ve el detalle técnico?", a: "Solo perfiles autorizados, colapsado", b: "Visible para todos como transparencia", pro: "Comercial no se distrae con trazas; Tecnología conserva la inspección.", con: "Requiere definir permisos reales en backend (fuera de este prototipo)." },
  { q: "¿Cómo se maneja un cambio de cuenta?", a: "Separador explícito + identidad en cada respuesta", b: "Abrir un chat nuevo por cuenta", pro: "Mantiene el hilo del caso sin mezclar datos.", con: "Conversaciones largas pueden necesitar resumen por cuenta." },
  { q: "¿Qué hace Charlie con un borrador?", a: "Redacta, marca «No enviado» y pide revisión antes de copiar", b: "Botón «Enviar al anunciante»", pro: "La persona conserva el control y la responsabilidad.", con: "Un paso más que copiar y pegar." },
];

const FIELDS = [
  ["Tipo de anunciante", "Cambia el tono y lo que es razonable prometer.", "Siempre", "Visible"],
  ["ID sintético de cuenta", "Evita confundir cuentas y permite trazabilidad.", "Siempre", "Visible"],
  ["Productos pagos y vigencia", "Solo importa si afecta renovación o contactos.", "Renovación, visibilidad", "Bajo demanda"],
  ["Propiedades activas", "Útil si hay fuente; se distingue total vs. evaluadas.", "Inventario, contactos", "Bajo demanda"],
  ["Condición del broker", "Rara vez cambia la respuesta al anunciante.", "Casos de cuenta suspendida", "Ficha completa"],
  ["Último ingreso", "Ayuda a saber si el anunciante vio un cambio.", "Dudas de configuración", "Ficha completa"],
  ["Score de cuenta", "Sin definición acordada; puede inducir conclusiones.", "Ninguno por ahora", "Oculto"],
  ["FID", "Término pendiente de definir. No se interpreta.", "Ninguno por ahora", "Oculto"],
];

function Decisiones() {
  return (
    <AppShell>
      <PageHeader eyebrow="Guía de evaluación" title="Decisiones de experiencia y sus trade-offs" lead="Propuestas para discutir con el equipo. Ninguna está aprobada para el producto real; sirven para evaluar el prototipo con criterios explícitos." />
      <div className="mx-auto max-w-5xl space-y-16 px-6 pb-24 md:px-10">
        <section className="space-y-4">
          {DECISIONS.map((d) => (
            <article key={d.q} className="rounded-2xl border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{d.q}</h2>
                <Pill tone="warn">Propuesta · sin aprobar</Pill>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-primary-soft p-4"><p className="eyebrow text-primary">Proponemos</p><p className="mt-1 font-medium">{d.a}</p></div>
                <div className="rounded-xl bg-surface p-4"><p className="eyebrow">Alternativa descartada</p><p className="mt-1 text-muted-foreground">{d.b}</p></div>
              </div>
              <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div><dt className="font-medium">Lo que ganamos</dt><dd className="text-muted-foreground">{d.pro}</dd></div>
                <div><dt className="font-medium">Lo que cedemos</dt><dd className="text-muted-foreground">{d.con}</dd></div>
              </dl>
            </article>
          ))}
        </section>

        <section aria-labelledby="regla">
          <h2 id="regla" className="text-xl font-semibold">Regla para mostrar o no un dato</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">Si un campo no mejora la comprensión, la decisión o el siguiente paso, no aparece por defecto.</p>
          <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-xs text-muted-foreground">
                <th scope="col" className="p-3 font-medium">Campo</th><th scope="col" className="p-3 font-medium">Por qué ayuda (o no)</th><th scope="col" className="p-3 font-medium">Cuándo</th><th scope="col" className="p-3 font-medium">Por defecto</th>
              </tr></thead>
              <tbody>
                {FIELDS.map(([f, w, c, d]) => (
                  <tr key={f} className="border-b last:border-0">
                    <td className="p-3 font-medium">{f}</td><td className="p-3 text-muted-foreground">{w}</td><td className="p-3">{c}</td>
                    <td className="p-3"><Pill tone={d === "Visible" ? "ok" : d === "Oculto" ? "neutral" : "info"}>{d}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="criterios">
          <h2 id="criterios" className="text-xl font-semibold">Cómo evaluar una respuesta de Charlie</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {["¿El resumen se entiende en 10 segundos?", "¿Distingue lo confirmado de lo que no sabemos?", "¿Dice de qué cuenta habla y cuándo?", "¿Hay un único siguiente paso claro?", "¿Evita prometer acciones que no hizo?", "¿Alguien de otra área lo entendería sin jerga?"].map((c) => (
              <li key={c} className="rounded-xl border bg-card p-4 text-sm">{c}</li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
