import { Link } from "@tanstack/react-router";
import { BookOpen, LayoutGrid, MessagesSquare, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Cómo se siente", icon: BookOpen },
  { to: "/workspace", label: "Workspace", icon: MessagesSquare },
  { to: "/componentes", label: "Componentes", icon: LayoutGrid },
  { to: "/decisiones", label: "Decisiones", icon: Scale },
] as const;

export function AppShell({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2">Saltar al contenido</a>
      <nav aria-label="Principal" className="sticky top-0 z-30 flex shrink-0 items-center gap-1 border-b border-sidebar-border bg-sidebar text-sidebar-foreground px-3 py-2 md:h-dvh md:w-56 md:flex-col md:items-stretch md:gap-1 md:border-b-0 md:border-r md:px-3 md:py-5">
        <div className="mr-2 flex items-center gap-2 md:mb-6 md:mr-0 md:px-2">
          <span className="grid size-7 place-items-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">C</span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold">Charlie</span>
            <span className="block text-[11px] text-sidebar-muted">Experience Lab</span>
          </span>
        </div>
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: true }}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-sidebar-ring"
            activeProps={{ className: "bg-sidebar-primary !text-sidebar-primary-foreground font-medium hover:bg-primary-hover hover:!text-sidebar-primary-foreground" }}>
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">{label}</span>
            <span className="sr-only lg:hidden">{label}</span>
          </Link>
        ))}
        <p className="mt-auto hidden px-2 text-[11px] leading-snug text-sidebar-muted md:block">Prototipo UX/UI. Datos sintéticos. No es el producto real.</p>
      </nav>
      <main id="main" className={cn("min-w-0 flex-1", !wide && "")}>{children}</main>
    </div>
  );
}

export function PageHeader({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <header className="mx-auto max-w-5xl px-6 pb-8 pt-12 md:px-10 md:pt-16">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-[2.5rem] md:leading-[1.15]">{title}</h1>
      {lead && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{lead}</p>}
      {children}
    </header>
  );
}
