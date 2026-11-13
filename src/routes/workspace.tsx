import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, PanelRight, RotateCcw, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/charlie/shell";
import { AccountStamp, ChatMessage, ContextSwitch, Feedback, LoadingMessage, Pill } from "@/components/charlie/blocks";
import { ContextPanel } from "@/components/charlie/context-panel";
import { RenderBlock } from "@/components/charlie/render-blocks";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getAccount, PERSONAS, SCENARIOS, VARIANTS, type Persona, type ScenarioId, type Variant } from "@/lib/charlie/data";
import { respond, type Msg } from "@/lib/charlie/script";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace · Charlie Experience Lab" },
      { name: "description", content: "Demostración interactiva de una conversación con Charlie por rol y escenario, con datos sintéticos." },
      { property: "og:title", content: "Workspace · Charlie Experience Lab" },
      { property: "og:description", content: "Demostración interactiva de una conversación con Charlie por rol y escenario." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Workspace,
});

type CharlieMsg = Extract<Msg, { role: "charlie" }>;

function Workspace() {
  const [persona, setPersona] = useState<Persona>("soporte");
  const [scenario, setScenario] = useState<ScenarioId>("broker");
  const [variant, setVariant] = useState<Variant>("normal");
  const [techAllowed, setTechAllowed] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sc = SCENARIOS.find((s) => s.id === scenario)!;

  const reset = () => { setMsgs([]); setAccountId(null); setBusy(false); setDraft(""); };
  useEffect(reset, [scenario, persona, variant]);
  useEffect(() => { if (persona !== "tecnologia") setTechAllowed(false); }, [persona]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, busy]);

  const lastCharlie = useMemo(() => [...msgs].reverse().find((m): m is CharlieMsg => m.role === "charlie") ?? null, [msgs]);
  const lastUser = useMemo(() => [...msgs].reverse().find((m) => m.role === "user") as Extract<Msg, { role: "user" }> | undefined, [msgs]);

  function send(text: string, opts: { redo?: boolean } = {}) {
    const clean = text.trim();
    if (!clean || busy) return;
    let v = variant;
    if (clean === "Reintentar" || clean === "Continuar") { v = "normal"; }
    if (!opts.redo) setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "user", text: clean }]);
    setDraft("");
    setBusy(true);
    window.setTimeout(() => {
      const r = respond(clean === "Reintentar" || clean === "Continuar" ? sc.opening : clean, { scenario, persona, variant: v, techAllowed, accountId });
      setMsgs((m) => [...m, ...r.msgs]);
      setAccountId(r.accountId);
      setBusy(false);
      inputRef.current?.focus();
    }, 850);
  }

  const moment = !msgs.length ? "Sé por dónde empezar"
    : draft || !accountId ? "Puedo hablar como hablo con alguien del equipo"
    : msgs.some((m) => m.role === "switch") && lastCharlie?.historical ? "Charlie reconoce el contexto sin mezclar cuentas"
    : lastCharlie?.blocks.some((b) => b.t === "draft") ? "Sé cuál es el siguiente paso, y sigo teniendo el control"
    : lastCharlie?.blocks.some((b) => b.t === "table" || b.t === "evidence") && msgs.length > 2 ? "Tengo información relevante, con trazabilidad, sin ser abrumadora"
    : "Entiendo el problema sin tener que reconstruirlo";

  const suggestions = !msgs.length ? [sc.opening] : accountId ? sc.suggestions : [];

  const panel = <ContextPanel msg={lastCharlie} persona={persona} techAllowed={techAllowed} onTechAllowed={setTechAllowed} onNext={() => { const nb = lastCharlie?.blocks.find((b) => b.t === "next"); if (nb && nb.t === "next" && nb.prompt) send(nb.prompt); }} />;

  return (
    <AppShell wide>
      <div className="flex h-[calc(100dvh-49px)] flex-col md:h-dvh">
        {/* Controles de demostración */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b bg-card px-4 py-2.5 md:px-6">
          <Field label="Rol interno">
            <select value={persona} onChange={(e) => setPersona(e.target.value as Persona)} className="sel">
              {PERSONAS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </Field>
          <Field label="Escenario">
            <select value={scenario} onChange={(e) => { const s = SCENARIOS.find((x) => x.id === e.target.value)!; setScenario(s.id); setPersona(s.suggestedPersona); }} className="sel">
              {SCENARIOS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Simular estado">
            <select value={variant} onChange={(e) => setVariant(e.target.value as Variant)} className="sel">
              {VARIANTS.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
          </Field>
          <div className="ml-auto flex items-center gap-2">
            <Pill className="hidden font-mono sm:inline-flex">datos sintéticos</Pill>
            <Button size="sm" onClick={reset}><RotateCcw className="size-3.5" />Reiniciar</Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden"><PanelRight className="size-3.5" />Contexto</Button>
              </SheetTrigger>
              <SheetContent className="w-full overflow-y-auto bg-background sm:max-w-sm">
                <SheetHeader><SheetTitle>Contexto del caso</SheetTitle></SheetHeader>
                <div className="px-4 pb-6">{panel}</div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Conversación */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between gap-2 px-4 pt-3 text-xs text-muted-foreground md:px-8">
              <span>Anunciante: <b className="font-medium text-foreground">{sc.advertiser}</b> · Tú: <b className="font-medium text-foreground">{PERSONAS.find((p) => p.id === persona)!.label}</b></span>
              <span className="hidden italic sm:inline" aria-live="polite">“{moment}”</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto" aria-live="polite" aria-busy={busy}>
              <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-8">
                {!msgs.length && <Welcome persona={persona} />}
                {msgs.map((m) => {
                  if (m.role === "user") return <ChatMessage key={m.id} role="user">{m.text}</ChatMessage>;
                  if (m.role === "switch") return <ContextSwitch key={m.id} from={m.from} to={m.to} />;
                  const isLast = m === lastCharlie;
                  return (
                    <ChatMessage key={m.id} role="charlie" meta={<AccountStamp account={m.accountId ? getAccount(m.accountId) : null} time={m.time} historical={m.historical} />}>
                      {m.blocks.map((b, i) => <RenderBlock key={i} b={b} accountId={m.accountId} onSend={send} />)}
                      {(m.feedback || isLast) && (
                        <div className="flex items-center gap-3">
                          {m.feedback && <Feedback />}
                          {isLast && lastUser && !busy && (
                            <button onClick={() => send(lastUser.text, { redo: true })} className="flex items-center gap-1 rounded px-1 text-xs text-muted-foreground hover:text-foreground"><RefreshCw className="size-3" />Rehacer</button>
                          )}
                        </div>
                      )}
                    </ChatMessage>
                  );
                })}
                {busy && <LoadingMessage />}
                <div ref={endRef} />
              </div>
            </div>

            {/* Composer */}
            <div className="border-t bg-background px-4 pb-4 pt-3 md:px-8">
              <div className="mx-auto max-w-3xl">
                {suggestions.length > 0 && !busy && (
                  <div className="mb-2 flex flex-wrap gap-1.5" aria-label="Sugerencias">
                    {suggestions.map((s) => (
                      <button key={s} onClick={() => send(s)} className="max-w-full truncate rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">{s}</button>
                    ))}
                  </div>
                )}
                <form onSubmit={(e) => { e.preventDefault(); send(draft); }} className="flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-sm focus-within:border-primary/50">
                  <label htmlFor="composer" className="sr-only">Escribe a Charlie</label>
                  <textarea id="composer" ref={inputRef} value={draft} rows={2}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(draft); } }}
                    placeholder={busy ? "Esperando a Charlie…" : "Escribe como se lo dirías a alguien del equipo"}
                    className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground" />
                  <Button type="submit" size="icon" disabled={busy || !draft.trim()} aria-label="Enviar" className="size-9 rounded-xl"><ArrowUp className="size-4" /></Button>
                </form>
                <p className="mt-1.5 text-center text-[11px] text-muted-foreground">Enter envía · Shift+Enter salto de línea · Charlie no ejecuta acciones ni envía mensajes</p>
              </div>
            </div>
          </div>

          {/* Panel contexto */}
          <aside aria-label="Contexto del caso" className="hidden w-[300px] shrink-0 border-l bg-surface p-4 lg:block xl:w-[340px]">
            {panel}
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex items-center gap-2 text-xs text-muted-foreground">{label}{children}</label>;
}

function Welcome({ persona }: { persona: Persona }) {
  const p = PERSONAS.find((x) => x.id === persona)!;
  return (
    <div className="rise py-10 text-center">
      <div className="mx-auto mb-4 grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">C</div>
      <h1 className="text-xl font-semibold tracking-tight">Hola, ¿qué caso revisamos?</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Cuéntame qué te dijo el anunciante, con tus palabras. Si me falta algo, te pregunto solo eso.</p>
      <p className="mt-4 text-xs text-muted-foreground">Vista de {p.label}: {p.wants.toLowerCase()}.</p>
    </div>
  );
}
