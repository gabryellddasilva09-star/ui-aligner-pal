import { Link, useRouterState } from "@tanstack/react-router";
import { Home, CalendarDays, LineChart, UserRound, Bell, PersonStanding, Utensils } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { patient } from "@/data/mock";

const nav = [
  { to: "/", label: "Início", icon: Home },
  { to: "/diario", label: "Diário", icon: CalendarDays },
  { to: "/plano", label: "Movimento", icon: PersonStanding },
  { to: "/alimentacao", label: "Alimentação", icon: Utensils },
  { to: "/evolucao", label: "Evolução", icon: LineChart },
  { to: "/profissional", label: "Profissional", icon: UserRound },
] as const;

export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 32" className={cn("text-primary", className)} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" aria-hidden>
      <path d="M20 29c-4-4-5-11 0-19 5 8 4 15 0 19Z" />
      <path d="M19 29C13 28 8 22 8 14c6 2 10 7 11 15Z" />
      <path d="M21 29c6-1 11-7 11-15-6 2-10 7-11 15Z" />
      <path d="M17 29c-6 0-12-4-14-10 5-1 10 2 14 10ZM23 29c6 0 12-4 14-10-5-1-10 2-14 10Z" opacity={0.5} />
    </svg>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-card/60 px-5 py-8 backdrop-blur lg:flex">
        <div className="flex items-center gap-2.5 px-2">
          <Logo className="size-9" />
          <div>
            <p className="font-display text-lg font-semibold leading-none">VivaLeve</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{patient.program}</p>
          </div>
        </div>
        <nav className="mt-10 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = path === to;
            return (
              <Link key={to} to={to} className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}>
                <Icon className="size-[18px]" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-checkin p-4">
          <p className="text-xs font-medium text-accent-foreground">Acompanhamento ativo</p>
          <p className="mt-1 text-xs text-muted-foreground">Sua profissional vê sua evolução em tempo real.</p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Desktop top bar */}
        <div className="hidden items-center justify-end gap-3 px-10 pt-6 lg:flex">
          <IconButtons />
        </div>
        <main key={path} className="mx-auto w-full max-w-5xl px-5 pb-10 pt-4 animate-rise sm:px-8 lg:px-10 lg:pb-16">
          {children}
        </main>
      </div>

    </div>
  );
}

export function IconButtons() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button aria-label="Notificações" className="relative grid size-10 place-items-center rounded-full border bg-card transition hover:bg-secondary">
        <Bell className="size-[18px]" />
        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-pain ring-2 ring-card" />
      </button>
      <Link to="/profissional" aria-label="Perfil" className="grid size-10 place-items-center rounded-full bg-primary-soft font-display text-sm font-semibold text-primary">
        A
      </Link>
    </div>
  );
}
