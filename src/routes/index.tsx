import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell, PageHeader } from "@/components/charlie/shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cómo debe sentirse Charlie · Experience Lab" },
      { name: "description", content: "Narrativa, principios y emociones que guían la experiencia de Charlie, asistente interno de soporte y operaciones." },
      { property: "og:title", content: "Cómo debe sentirse Charlie" },
      { property: "og:description", content: "Narrativa, principios y emociones que guían la experiencia de Charlie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ROLES = [
  { role: "Soporte", quote: "Un anunciante me escribe molesto. Necesito entender qué pasó sin abrir cinco herramientas, y responderle algo que sea cierto." },
  { role: "Comercial", quote: "Antes de llamar, quiero saber lo que importa: qué tiene contratado, qué vence y si hay una oportunidad real. Nada más." },
  { role: "Marketing", quote: "Quiero ver si algo cambió de verdad, contra qué lo comparo y qué hago con eso. Sin gráficas de adorno." },
  { role: "Tecnología", quote: "Cuando algo no cuadra, quiero ver qué revisó Charlie y en qué orden. Solo si estoy autorizado." },
];

const PRINCIPLES = [
  ["Primero la respuesta", "De 1 a 3 frases que resuelven. El detalle llega cuando se pide."],
  ["Hechos separados de supuestos", "Lo confirmado, lo que no sabemos y la confianza, siempre a la vista."],
  ["Una cuenta a la vez", "Cada respuesta dice de qué cuenta habla y cuándo. Nunca se mezclan."],
  ["Mostrar solo lo que ayuda", "Un dato aparece si mejora la respuesta al anunciante. Si no, se queda en la ficha."],
  ["Acompaña, no actúa", "Charlie sugiere y redacta. La persona decide y envía."],
];

const MOMENTS = [
  ["Al entrar", "Sé por dónde empezar"],
  ["Al escribir", "Puedo hablar como hablo con alguien del equipo"],
  ["Al recibir el diagnóstico", "Entiendo el problema sin tener que reconstruirlo"],
  ["Al profundizar", "Tengo información relevante, con trazabilidad, sin ser abrumadora"],
  ["Al actuar", "Sé cuál es el siguiente paso, y sigo teniendo el control"],
  ["Al volver", "Charlie reconoce el contexto sin mezclar cuentas"],
];

function Index() {
  return (
    <AppShell>
      <PageHeader eyebrow="Charlie · Experience Lab" title="Un colega experto que te orienta, no una herramienta que te intimida." lead="Este laboratorio explora cómo debe sentirse Charlie en el trabajo diario de Soporte, Comercial, Marketing y Tecnología. Es un prototipo visual con datos sintéticos, no el producto real.">
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link to="/workspace">Explorar una conversación<ArrowRight className="size-4" /></Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/componentes">Ver componentes</Link></Button>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-5xl space-y-20 px-6 pb-24 md:px-10">
        <section aria-labelledby="voces">
          <h2 id="voces" className="eyebrow mb-5">En primera persona</h2>
          <div className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2">
            {ROLES.map((r) => (
              <figure key={r.role} className="bg-card p-6">
                <blockquote className="text-[15px] leading-relaxed">“{r.quote}”</blockquote>
                <figcaption className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary-text">{r.role}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section aria-labelledby="principios">
          <h2 id="principios" className="eyebrow mb-5">Cinco principios de experiencia</h2>
          <ol className="divide-y border-y">
            {PRINCIPLES.map(([t, d], i) => (
              <li key={t} className="grid gap-1 py-5 sm:grid-cols-[3rem_16rem_1fr] sm:items-baseline">
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                <span className="font-semibold">{t}</span>
                <span className="text-muted-foreground">{d}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="momentos">
          <h2 id="momentos" className="eyebrow mb-5">Lo que la persona debería sentir</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MOMENTS.map(([k, v]) => (
              <div key={k} className="rounded-xl border bg-card p-5">
                <p className="text-xs text-muted-foreground">{k}</p>
                <p className="mt-2 font-medium leading-snug">“{v}”</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
