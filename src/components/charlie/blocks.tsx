import { useMemo, useState } from "react";
import {
  AlertTriangle, Check, ChevronDown, ChevronLeft, ChevronRight, Copy, Eye, Info, Lock,
  Search, ShieldAlert, ThumbsDown, ThumbsUp, ArrowRight, History, Ban, Inbox, Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Account, Property, PropertyState, ProductStatus } from "@/lib/charlie/data";
import { makeProperties } from "@/lib/charlie/data";

/* ---------- primitives ---------- */

export function Pill({ tone = "neutral", children, className }: { tone?: "neutral" | "ok" | "warn" | "err" | "info"; children: React.ReactNode; className?: string }) {
  const tones = {
    neutral: "bg-muted text-muted-foreground",
    ok: "bg-primary-soft text-primary",
    warn: "bg-warning-soft text-warning-foreground",
    err: "bg-destructive-soft text-destructive",
    info: "bg-accent text-foreground",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", tones[tone], className)}>{children}</span>;
}

export function SyntheticTag() {
  return <Pill tone="neutral" className="font-mono">datos sintéticos</Pill>;
}

function BlockShell({ title, icon, children, className, aside }: { title?: string; icon?: React.ReactNode; children: React.ReactNode; className?: string; aside?: React.ReactNode }) {
  return (
    <section className={cn("rounded-xl border bg-card p-4", className)}>
      {title && (
        <header className="mb-3 flex items-center justify-between gap-2">
          <h4 className="flex items-center gap-2 text-sm font-semibold">{icon}{title}</h4>
          {aside}
        </header>
      )}
      {children}
    </section>
  );
}

/* ---------- ChatMessage ---------- */

export function AccountStamp({ account, time, historical }: { account: Account | null; time: string; historical?: boolean | undefined }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
      <span className="font-medium text-foreground">Charlie</span>
      <span aria-hidden>·</span>
      <span>{time}</span>
      {account ? (
        <>
          <span aria-hidden>·</span>
          <span>Sobre <span className="font-mono text-foreground">{account.id}</span></span>
        </>
      ) : (
        <><span aria-hidden>·</span><span>Sin cuenta identificada</span></>
      )}
      {historical && <HistoricalResultBadge />}
    </div>
  );
}

export function ChatMessage({ role, children, meta }: { role: "user" | "charlie"; children: React.ReactNode; meta?: React.ReactNode }) {
  if (role === "user") {
    return (
      <div className="rise flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-sm leading-relaxed text-background">{children}</div>
      </div>
    );
  }
  return (
    <div className="rise flex gap-3">
      <div aria-hidden className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">C</div>
      <div className="min-w-0 flex-1 space-y-3">
        {meta}
        {children}
      </div>
    </div>
  );
}

export function Summary({ children }: { children: React.ReactNode }) {
  return <p className="max-w-prose text-[15px] leading-relaxed">{children}</p>;
}

/* ---------- DiagnosisSummary ---------- */

export interface Diagnosis {
  confirmed: string[];
  unknown: string[];
  impact: string;
  recommend: string;
  confidence: "alta" | "media" | "baja";
}

export function DiagnosisSummary({ d }: { d: Diagnosis }) {
  const conf = { alta: { tone: "ok" as const, t: "Confianza alta" }, media: { tone: "warn" as const, t: "Confianza media" }, baja: { tone: "warn" as const, t: "Confianza baja" } }[d.confidence];
  return (
    <BlockShell title="Lo que encontramos" aside={<Pill tone={conf.tone}>{conf.t}</Pill>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="eyebrow mb-1.5">Hechos confirmados</p>
          <ul className="space-y-1.5 text-sm">
            {d.confirmed.map((c) => (
              <li key={c} className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-1.5">Qué no sabemos</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {d.unknown.length ? d.unknown.map((c) => (
              <li key={c} className="flex gap-2"><Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />{c}</li>
            )) : <li>Nada relevante pendiente.</li>}
          </ul>
        </div>
      </div>
      <div className="mt-4 grid gap-3 border-t pt-3 text-sm sm:grid-cols-2">
        <p><span className="eyebrow block">Impacto</span>{d.impact}</p>
        <p><span className="eyebrow block">Qué recomendamos</span>{d.recommend}</p>
      </div>
    </BlockShell>
  );
}

/* ---------- NextBestAction ---------- */

export function NextBestAction({ title, detail, cta, onCta }: { title: string; detail: string; cta: string; onCta?: (() => void) | undefined }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary-soft p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="eyebrow text-primary">Siguiente mejor acción</p>
        <p className="mt-0.5 text-sm font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </div>
      <Button size="sm" onClick={onCta} className="shrink-0">{cta}<ArrowRight className="size-3.5" /></Button>
    </div>
  );
}

/* ---------- EvidenceDisclosure ---------- */

export function EvidenceDisclosure({ steps, caveats }: { steps: string[]; caveats: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border bg-card">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-accent/50 rounded-xl">
        Cómo llegó Charlie a esta conclusión
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="rise space-y-3 border-t px-4 py-3 text-sm">
          <ol className="space-y-1.5">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-2"><span className="font-mono text-xs text-muted-foreground">{i + 1}.</span>{s}</li>
            ))}
          </ol>
          {caveats.length > 0 && (
            <div className="rounded-lg bg-warning-soft px-3 py-2 text-warning-foreground">
              <p className="text-xs font-semibold">Ten en cuenta</p>
              <ul className="mt-1 list-disc pl-4 text-xs">{caveats.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- TechTrace (RoleVisibility) ---------- */

export function TechTrace({ calls }: { calls: { name: string; result: string; ms: number }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-dashed bg-surface">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm">
        <span className="flex items-center gap-2 font-medium"><Eye className="size-4" aria-hidden />Qué verificó Charlie <Pill>Vista Tecnología</Pill></span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="rise border-t px-4 py-3">
          <p className="mb-2 text-xs text-muted-foreground">Detalle interno simulado. No es evidencia para compartir con el anunciante. El control de acceso aquí es solo de interfaz, no representa seguridad real.</p>
          <ul className="space-y-1 font-mono text-xs">
            {calls.map((c) => (
              <li key={c.name} className="flex justify-between gap-3 rounded bg-card px-2 py-1.5">
                <span>{c.name} → {c.result}</span><span className="text-muted-foreground">{c.ms} ms</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------- ClarificationPrompt ---------- */

export function ClarificationPrompt({ question, hint, options, onPick }: { question: string; hint: string; options?: string[] | undefined; onPick?: ((v: string) => void) | undefined }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm font-medium">{question}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      {options && (
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((o) => (
            <Button key={o} variant="outline" size="sm" className="font-mono" onClick={() => onPick?.(o)}>{o}</Button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- ProductStatusCompact ---------- */

const statusTone: Record<ProductStatus, "ok" | "warn" | "neutral" | "err"> = { activo: "ok", "por vencer": "warn", inactivo: "neutral", desconocido: "neutral" };

export function ProductStatusCompact({ product, opportunity }: { product: Account["product"]; opportunity?: string | undefined }) {
  if (!product) return <BlockShell title="Producto relevante"><p className="text-sm text-muted-foreground">Dato no disponible. La cuenta no tiene productos registrados en la fuente consultada.</p></BlockShell>;
  return (
    <BlockShell title="Producto relevante" aside={<Pill tone={statusTone[product.status]}>{product.status}</Pill>}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-base font-semibold">{product.name}</p>
        <p className="text-sm text-muted-foreground">{product.endsIn ? `Vence ${product.endsIn}` : "Vigencia desconocida"}</p>
      </div>
      {opportunity && (
        <div className="mt-3 rounded-lg bg-surface px-3 py-2 text-sm">
          <span className="eyebrow block">Oportunidad comercial</span>{opportunity}
        </div>
      )}
    </BlockShell>
  );
}

/* ---------- AccountCoverage ---------- */

export function AccountCoverage({ total, evaluated, affected }: { total: number | null; evaluated: number | null; affected: number | null }) {
  const cells = [
    { k: "Total en la cuenta", v: total },
    { k: "Evaluadas", v: evaluated },
    { k: "Con alerta", v: affected },
  ];
  const pct = total && evaluated ? Math.round((evaluated / total) * 100) : null;
  return (
    <BlockShell title="Alcance de la revisión">
      <dl className="grid grid-cols-3 gap-3">
        {cells.map((c) => (
          <div key={c.k}>
            <dt className="text-xs text-muted-foreground">{c.k}</dt>
            <dd className="text-xl font-semibold tabular-nums">{c.v == null ? <span className="text-sm font-normal text-muted-foreground">No disponible</span> : c.v.toLocaleString("es-MX")}</dd>
          </div>
        ))}
      </dl>
      {pct != null && pct < 100 && (
        <p className="mt-3 text-xs text-muted-foreground">Revisamos el {pct} % del inventario. Las conclusiones aplican solo a las evaluadas.</p>
      )}
    </BlockShell>
  );
}

/* ---------- PropertyDataTable ---------- */

const stateTone: Record<PropertyState, "ok" | "warn" | "neutral" | "err"> = { Activa: "ok", "Sin contactos": "warn", Pausada: "neutral", "Datos incompletos": "err" };

export function PropertyDataTable({ account, rows: rowsProp, defaultFilter = "afectadas" }: { account: Account; rows?: Property[]; defaultFilter?: "todas" | "afectadas" }) {
  const rows = useMemo(() => rowsProp ?? makeProperties(account.id, account.evaluated ?? account.totalProperties ?? 0, account.affected ?? 0), [account, rowsProp]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"todas" | "afectadas" | PropertyState>(defaultFilter);
  const [sort, setSort] = useState<"contacts" | "id">("contacts");
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let r = rows;
    if (filter === "afectadas") r = r.filter((x) => x.state === "Sin contactos" || x.state === "Datos incompletos");
    else if (filter !== "todas") r = r.filter((x) => x.state === filter);
    if (q) r = r.filter((x) => (x.id + x.title).toLowerCase().includes(q.toLowerCase()));
    return [...r].sort((a, b) => (sort === "id" ? a.id.localeCompare(b.id) : (a.contacts ?? -1) - (b.contacts ?? -1)));
  }, [rows, q, filter, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const cur = Math.min(page, pages - 1);
  const shown = filtered.slice(cur * size, cur * size + size);

  return (
    <BlockShell title="Propiedades" aside={<SyntheticTag />}>
      <p className="mb-3 text-xs text-muted-foreground">
        Total cuenta <b className="text-foreground">{account.totalProperties?.toLocaleString("es-MX") ?? "—"}</b> · Evaluadas <b className="text-foreground">{rows.length.toLocaleString("es-MX")}</b> · Coinciden <b className="text-foreground">{filtered.length}</b> · Mostradas <b className="text-foreground">{shown.length}</b>
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        <label className="relative flex-1 min-w-40">
          <span className="sr-only">Buscar propiedad</span>
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Buscar por ID o título" className="h-8 w-full rounded-md border bg-background pl-8 pr-2 text-sm" />
        </label>
        <select aria-label="Filtrar por estado" value={filter} onChange={(e) => { setFilter(e.target.value as typeof filter); setPage(0); }} className="h-8 rounded-md border bg-background px-2 text-sm">
          <option value="afectadas">Solo con alerta</option>
          <option value="todas">Todas</option>
          <option value="Sin contactos">Sin contactos</option>
          <option value="Datos incompletos">Datos incompletos</option>
          <option value="Pausada">Pausadas</option>
          <option value="Activa">Activas</option>
        </select>
        <select aria-label="Ordenar" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="h-8 rounded-md border bg-background px-2 text-sm">
          <option value="contacts">Menos contactos primero</option>
          <option value="id">Por ID</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="Sin resultados con estos filtros" detail="Prueba con «Todas» o limpia la búsqueda." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th scope="col" className="py-2 pr-3 font-medium">ID</th>
                <th scope="col" className="py-2 pr-3 font-medium">Propiedad</th>
                <th scope="col" className="py-2 pr-3 font-medium">Estado</th>
                <th scope="col" className="py-2 text-right font-medium">Contactos 30 d</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-mono text-xs">{r.id}</td>
                  <td className="py-2 pr-3">{r.title}</td>
                  <td className="py-2 pr-3"><Pill tone={stateTone[r.state]}>{r.state}</Pill></td>
                  <td className="py-2 text-right tabular-nums">{r.contacts ?? <span className="text-muted-foreground">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <label className="flex items-center gap-2">Filas
          <select value={size} onChange={(e) => { setSize(+e.target.value); setPage(0); }} className="h-7 rounded border bg-background px-1">
            {[10, 20, 50].map((n) => <option key={n}>{n}</option>)}
          </select>
        </label>
        <div className="flex items-center gap-1">
          <span className="mr-2">Página {cur + 1} de {pages}</span>
          <Button variant="outline" size="icon" className="size-7" disabled={cur === 0} onClick={() => setPage(cur - 1)} aria-label="Página anterior"><ChevronLeft className="size-3.5" /></Button>
          <Button variant="outline" size="icon" className="size-7" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)} aria-label="Página siguiente"><ChevronRight className="size-3.5" /></Button>
        </div>
      </div>
    </BlockShell>
  );
}

/* ---------- ChartWithInsight ---------- */

export function ChartWithInsight({ data }: { data: { week: string; value: number }[] }) {
  const prev = data.slice(0, 4).reduce((a, b) => a + b.value, 0);
  const recent = data.slice(4).reduce((a, b) => a + b.value, 0);
  const delta = Math.round(((recent - prev) / prev) * 1000) / 10;
  const max = Math.ceil(Math.max(...data.map((d) => d.value)) / 50) * 50;
  const W = 520, H = 180, pl = 36, pb = 24, pt = 8;
  const bw = (W - pl) / data.length;
  const y = (v: number) => pt + (H - pb - pt) * (1 - v / max);
  return (
    <BlockShell title="Leads semanales · 4 semanas vs. 4 previas" aside={<SyntheticTag />}>
      <dl className="mb-3 grid grid-cols-3 gap-3 text-sm">
        <div><dt className="text-xs text-muted-foreground">4 semanas previas</dt><dd className="text-lg font-semibold tabular-nums">{prev}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Últimas 4 semanas</dt><dd className="text-lg font-semibold tabular-nums">{recent}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Variación</dt><dd className="text-lg font-semibold tabular-nums text-primary">+{delta} %</dd></div>
      </dl>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Leads por semana. Previas suman ${prev}, recientes ${recent}, variación de ${delta} por ciento.`}>
        {[0, max / 2, max].map((t) => (
          <g key={t}>
            <line x1={pl} x2={W} y1={y(t)} y2={y(t)} className="stroke-border" />
            <text x={pl - 6} y={y(t) + 4} textAnchor="end" className="fill-muted-foreground text-[10px]">{t}</text>
          </g>
        ))}
        {data.map((d, i) => (
          <g key={d.week}>
            <rect x={pl + i * bw + bw * 0.22} y={y(d.value)} width={bw * 0.56} height={H - pb - y(d.value)} rx={3} className={i < 4 ? "fill-chart-2" : "fill-chart-1"} />
            <text x={pl + i * bw + bw / 2} y={H - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">{d.week}</text>
          </g>
        ))}
      </svg>
      <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-chart-2" />Previas (S1–S4)</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-chart-1" />Recientes (S5–S8)</span>
      </div>
      <p className="mt-3 border-t pt-3 text-sm"><span className="eyebrow block">Cómo leerlo</span>Leads = contactos únicos recibidos por la cuenta. Denominador: suma de las 4 semanas previas. El aumento es sostenido (3 de 4 semanas por encima del máximo previo), así que vale la pena revisar qué propiedades lo explican antes de atribuirlo a una campaña.</p>
    </BlockShell>
  );
}

/* ---------- DraftResponse ---------- */

export function DraftResponse({ initial }: { initial: string }) {
  const [text, setText] = useState(initial);
  const [reviewed, setReviewed] = useState(false);
  return (
    <BlockShell title="Borrador para el anunciante" aside={<Pill tone="warn">No enviado</Pill>}>
      <label className="sr-only" htmlFor="draft">Texto del borrador</label>
      <textarea id="draft" value={text} onChange={(e) => setText(e.target.value)} rows={7} className="w-full resize-y rounded-lg border bg-background p-3 text-sm leading-relaxed" />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} className="accent-primary" />
          Revisé el texto y los datos antes de usarlo
        </label>
        <Button size="sm" variant="outline" disabled={!reviewed} onClick={() => { navigator.clipboard?.writeText(text); toast("Borrador copiado", { description: "Charlie no envía mensajes. Pégalo en tu canal habitual." }); }}>
          <Copy className="size-3.5" />Copiar
        </Button>
      </div>
    </BlockShell>
  );
}

/* ---------- ContextSwitch / Historical ---------- */

export function ContextSwitch({ from, to }: { from?: string | undefined; to: string }) {
  return (
    <div role="separator" className="rise flex items-center gap-3 py-2 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      <span className="flex items-center gap-1.5 rounded-full border bg-card px-3 py-1"><Users className="size-3" aria-hidden />Ahora revisamos otra cuenta · {from && <span className="font-mono line-through opacity-60">{from}</span>} <span className="font-mono text-foreground">{to}</span></span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function HistoricalResultBadge() {
  return <Pill tone="warn"><History className="size-3" aria-hidden />Revisión anterior · datos de hace 2 días</Pill>;
}

/* ---------- Feedback ---------- */

export function Feedback() {
  const [v, setV] = useState<null | "up" | "down">(null);
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      {v ? <span>Gracias, lo tomaremos en cuenta.</span> : (
        <>
          <span className="mr-1">¿Fue útil?</span>
          <button aria-label="Sí, fue útil" onClick={() => setV("up")} className="rounded p-1 hover:bg-accent hover:text-foreground"><ThumbsUp className="size-3.5" /></button>
          <button aria-label="No fue útil" onClick={() => setV("down")} className="rounded p-1 hover:bg-accent hover:text-foreground"><ThumbsDown className="size-3.5" /></button>
        </>
      )}
    </div>
  );
}

/* ---------- States ---------- */

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed px-4 py-8 text-center">
      <Inbox className="size-5 text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

export type StateKind = "restringido" | "historial" | "error" | "vacio" | "duplicado" | "incertidumbre";

const STATE_COPY: Record<StateKind, { icon: React.ElementType; tone: string; title: string; body: string; action?: string }> = {
  restringido: { icon: Lock, tone: "bg-muted", title: "No tienes acceso a esta información", body: "Tu perfil no puede ver el detalle de esta cuenta. Puedes pedir acceso a tu líder o compartir el caso con Soporte.", action: "Cómo pedir acceso" },
  historial: { icon: Ban, tone: "bg-muted", title: "Historial no disponible para tu perfil", body: "Esta cuenta tuvo conversaciones previas, pero no estás autorizado a verlas. Charlie responde solo con datos actuales." },
  error: { icon: ShieldAlert, tone: "bg-destructive-soft", title: "No pudimos leer los datos de la cuenta", body: "La fuente de inventario no respondió. No vamos a suponer nada: intenta de nuevo en unos minutos.", action: "Reintentar" },
  vacio: { icon: Inbox, tone: "bg-muted", title: "No encontramos esa cuenta", body: "Revisa el identificador o prueba con el correo de la cuenta (sin compartir datos del anunciante en el chat)." },
  duplicado: { icon: AlertTriangle, tone: "bg-warning-soft", title: "Encontramos dos cuentas posibles", body: "El identificador coincide con dos cuentas sintéticas. Elige una para no mezclar información.", action: "Elegir cuenta" },
  incertidumbre: { icon: Info, tone: "bg-warning-soft", title: "Datos insuficientes para comparar", body: "La cuenta tiene menos de 8 semanas de actividad. Mostrar una gráfica sería engañoso; te comparto lo que sí sabemos." },
};

export function StateBlock({ kind, onAction }: { kind: StateKind; onAction?: (() => void) | undefined }) {
  const c = STATE_COPY[kind];
  const Icon = c.icon;
  return (
    <div role={kind === "error" ? "alert" : "status"} className={cn("flex gap-3 rounded-xl p-4", c.tone)}>
      <Icon className={cn("mt-0.5 size-4 shrink-0", kind === "error" ? "text-destructive" : "text-muted-foreground")} aria-hidden />
      <div className="text-sm">
        <p className="font-semibold">{c.title}</p>
        <p className="mt-0.5 text-muted-foreground">{c.body}</p>
        {c.action && <Button variant="outline" size="sm" className="mt-3" onClick={onAction}>{c.action}</Button>}
      </div>
    </div>
  );
}

export function LoadingMessage() {
  return (
    <div className="flex gap-3" role="status" aria-live="polite">
      <div aria-hidden className="mt-0.5 size-7 shrink-0 rounded-full bg-muted" />
      <div className="flex-1 space-y-2 pt-1">
        <span className="sr-only">Charlie está revisando</span>
        <p className="text-xs text-muted-foreground">Revisando la cuenta…</p>
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
