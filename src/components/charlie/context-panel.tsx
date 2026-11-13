import { ArrowRight, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { getAccount, type Persona } from "@/lib/charlie/data";
import type { Msg } from "@/lib/charlie/script";
import { HistoricalResultBadge, Pill } from "./blocks";
import { cn } from "@/lib/utils";

type CharlieMsg = Extract<Msg, { role: "charlie" }>;

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border bg-card p-3.5", className)}>
      <h3 className="eyebrow mb-1.5">{title}</h3>
      {children}
    </section>
  );
}

export function ContextPanel({ msg, persona, techAllowed, onTechAllowed, onNext }: { msg: CharlieMsg | null; persona: Persona; techAllowed: boolean; onTechAllowed: (v: boolean) => void; onNext?: () => void }) {
  if (!msg) {
    return (
      <div className="space-y-3">
        <Card title="Contexto"><p className="text-sm text-muted-foreground">Aparecerá cuando Charlie identifique una cuenta. Nada se carga antes de tiempo.</p></Card>
      </div>
    );
  }
  const acc = msg.accountId ? getAccount(msg.accountId) : null;
  return (
    <div className="space-y-3">
      <Card title="Cuenta en contexto">
        {acc ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold">{acc.name}</p>
              <Pill tone="ok">Identificada</Pill>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{acc.type} · <span className="font-mono">{acc.id}</span></p>
            <p className="mt-2 text-[11px] text-muted-foreground">Respuesta de las {msg.time}</p>
            {msg.historical && <div className="mt-1.5"><HistoricalResultBadge /></div>}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Sin cuenta identificada en esta respuesta.</p>
        )}
      </Card>

      {acc && (
        <Card title="Situación relevante">
          {msg.ctx.situation ? (
            <>
              <p className="text-xs text-muted-foreground">{msg.ctx.situation.label}</p>
              <p className={cn("text-sm font-medium", msg.ctx.situation.tone === "warn" && "text-warning-foreground")}>{msg.ctx.situation.value}</p>
            </>
          ) : <p className="text-sm text-muted-foreground">Dato no disponible.</p>}
        </Card>
      )}

      <Card title="Qué estamos investigando">
        <p className="text-sm font-medium">{msg.ctx.investigating}</p>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{msg.ctx.status}</p>
      </Card>

      <Card title="Próximo paso" className="border-primary/25">
        <button onClick={onNext} className="group flex w-full items-center justify-between gap-2 text-left text-sm font-medium text-primary-text">
          {msg.ctx.next}<ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </button>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        {acc && <FullSheet accountId={acc.id} />}
        {persona === "tecnologia" && (
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3" aria-hidden />Detalle técnico
            <Switch checked={techAllowed} onCheckedChange={onTechAllowed} aria-label="Simular permiso para ver detalle técnico" />
          </label>
        )}
      </div>
      {persona === "tecnologia" && <p className="px-1 text-[11px] leading-snug text-muted-foreground">Permiso simulado por interfaz. No representa seguridad real.</p>}
    </div>
  );
}

function FullSheet({ accountId }: { accountId: string }) {
  const acc = getAccount(accountId);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground"><FileText className="size-3.5" />Ver ficha completa</Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{acc.name}</SheetTitle>
          <SheetDescription>Información secundaria. Úsala solo si el caso lo pide. Datos sintéticos.</SheetDescription>
        </SheetHeader>
        <div className="space-y-5 px-4 pb-6">
          {Object.entries(acc.sheet).map(([group, rows]) => (
            <section key={group}>
              <h3 className="eyebrow mb-2">{group}</h3>
              <dl className="divide-y rounded-lg border">
                {rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-3 py-2 text-sm">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className={cn("text-right", /no disponible|pendiente|desconocido|no se muestra/i.test(v) && "text-muted-foreground italic")}>{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
