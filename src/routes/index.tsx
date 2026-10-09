import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircleMore, ChevronRight, Lightbulb, Target, Heart, Ear, PersonStanding, Utensils, Flower2, HeartHandshake, TrendingUp, BookOpen, type LucideIcon } from "lucide-react";
import { AppShell, IconButtons, Logo } from "@/components/vl/AppShell";
import {
  Trend, PillSelect, LineChart, SectionHeader,
} from "@/components/vl/primitives";
import { patient, insight, focus, painMonth } from "@/data/mock";
import hero from "@/assets/hero-mist.jpg";
import qaMove from "@/assets/qa-move.jpg";
import qaFood from "@/assets/qa-food.jpg";
import qaRelax from "@/assets/qa-relax.jpg";
import qaCommunity from "@/assets/qa-community.jpg";
import qaEvolution from "@/assets/qa-evolution.jpg";
import qaLibrary from "@/assets/qa-library.jpg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DailyCheckIn, type DailyRecord } from "@/components/vl/daily-check-in";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Início — VivaLeve" },
      { name: "description", content: "Seu acompanhamento da fibromialgia: panorama da semana, percepções e seu foco agora." },
      { property: "og:title", content: "Início — VivaLeve" },
      { property: "og:description", content: "Seu acompanhamento da fibromialgia, sempre ao seu lado." },
    ],
  }),
  component: Index,
});

const quickActions: { label: string; description: string; icon: LucideIcon; image: string; to?: string }[] = [
  { label: "Exercitar", description: "Seu plano de movimento", icon: PersonStanding, image: qaMove, to: "/plano" },
  { label: "Receitas", description: "Refeições e lista de compras", icon: Utensils, image: qaFood, to: "/alimentacao" },
  { label: "Relaxamento e controle", description: "Pausas para respirar e desacelerar", icon: Flower2, image: qaRelax, to: "/relaxamento" },
  { label: "Acolhimento e comunidade", description: "Você não está sozinha", icon: HeartHandshake, image: qaCommunity },
  { label: "Evolução e relatórios", description: "Como você está ao longo do tempo", icon: TrendingUp, image: qaEvolution, to: "/evolucao" },
  { label: "Biblioteca de conhecimento", description: "Conteúdos de confiança", icon: BookOpen, image: qaLibrary },
];

function Index() {
  const [open, setOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [record, setRecord] = useState<DailyRecord | null>(null);
  return (
    <AppShell>
      {/* Greeting */}
      <header className="relative -mx-5 -mt-4 overflow-hidden px-5 pb-6 pt-8 sm:-mx-8 sm:px-8 lg:mx-0 lg:mb-8 lg:mt-0 lg:rounded-3xl lg:px-10 lg:py-10">
        <img src={hero} alt="" width={1536} height={640} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-90" />
        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 lg:hidden">
              <Logo className="size-6" />
              <span className="text-xs font-medium tracking-wide text-muted-foreground">VivaLeve</span>
            </div>
            <h1 className="mt-3 text-4xl font-medium lg:mt-0 lg:text-5xl">Olá, {patient.name}</h1>
            <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              Seu acompanhamento está ativo. Você não está sozinha!{" "}
              <Heart className="inline size-4 fill-primary text-primary" aria-hidden />
            </p>
          </div>
          <div className="lg:hidden"><IconButtons /></div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8">
        <div className="space-y-8">
          {/* Check-in */}
          <section className="checkin-invitation relative overflow-hidden rounded-3xl p-6 shadow-float sm:p-7">
            <div aria-hidden className="breathe-glow" />
            <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div>
                <p className="text-xs font-semibold text-primary-foreground/80">HOJE · UM MOMENTO PARA VOCÊ</p>
                <h2 className="mt-3 text-3xl font-medium leading-snug text-primary-foreground">Como você<br />está se sentindo hoje?</h2>
                <Button onClick={() => setCheckInOpen(true)} variant="secondary" className="group mt-6 flex h-14 w-full items-center justify-start gap-3 rounded-2xl bg-card px-5 text-left text-base text-primary shadow-soft transition hover:bg-card/90 sm:max-w-sm">
                  <MessageCircleMore className="size-5" />
                  <span className="flex-1">{record ? "Ver meu registro" : "Conte para mim"}</span>
                  <ChevronRight className="size-4 transition group-hover:translate-x-0.5" />
                </Button>
                {record && <p role="status" className="mt-3 text-sm text-primary-foreground">Registro de hoje salvo nesta sessão.</p>}
              </div>
              <div className="hidden items-center gap-2 px-1 py-3 text-sm text-primary-foreground/90 sm:flex">
                <Ear className="size-4" /> Eu te escuto, sempre.
              </div>
            </div>
          </section>

          {/* Quick actions */}
          <section>
            <SectionHeader title="O que você quer fazer hoje?" subtitle="Toque em um atalho para começar." />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                const inner = <>
                  <img src={action.image} alt="" loading="lazy" width={768} height={512} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/5" />
                  <div className="relative flex h-full flex-col justify-end p-4">
                    <span className="grid size-9 place-items-center rounded-full bg-card/90 text-primary shadow-soft">
                      <Icon className="size-[18px]" strokeWidth={1.8} />
                    </span>
                    <p className="mt-2.5 text-base font-semibold leading-snug">{action.label}</p>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{action.description}</p>
                  </div>
                </>;
                return action.to
                  ? <Link key={action.label} to={action.to} className="card-soft pressable animate-rise group relative block min-h-44 overflow-hidden sm:min-h-48" style={{ animationDelay: `${i * 60}ms` }}>{inner}</Link>
                  : <button key={action.label} type="button" className="card-soft pressable animate-rise group relative min-h-44 overflow-hidden text-left sm:min-h-48" style={{ animationDelay: `${i * 60}ms` }}>{inner}</button>;
              })}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          {/* Insight */}
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full rounded-3xl border bg-insight p-5 text-left transition hover:shadow-float">
            <div className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-card text-primary"><Lightbulb className="size-5" /></span>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium">{insight.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{insight.text}</p>
                <div className={cn("grid transition-all duration-500", open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <p className="overflow-hidden text-sm leading-relaxed text-accent-foreground">{insight.detail}</p>
                </div>
              </div>
              <ChevronRight className={cn("mt-1 size-5 shrink-0 text-muted-foreground transition", open && "rotate-90")} />
            </div>
          </button>

          {/* Focus */}
          <div className="rounded-3xl border bg-focus p-5">
            <div className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-card text-good"><Target className="size-5" /></span>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-good">{focus.title}</h3>
                <p className="mt-1 text-sm text-foreground">{focus.text}</p>
                <div className="mt-3 flex items-center gap-1.5" aria-label={`Dia ${focus.day} de ${focus.total}`}>
                  {Array.from({ length: focus.total }).map((_, i) => (
                    <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < focus.day ? "bg-good" : "bg-card")} />
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">Dia {focus.day} de {focus.total}</p>
              </div>
            </div>
          </div>

          {/* Evolution */}
          <section className="pt-4">
            <SectionHeader title="Evolução" subtitle="Você está no caminho certo!" action={<PillSelect label="Últimos 30 dias" />} />
            <div className="card-soft p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium text-primary">Média atual da dor</p>
                  <p className="font-display text-3xl font-medium">{painMonth.average}</p>
                </div>
                <div className="text-right">
                  <Trend change={painMonth.change} improving={false} />
                  <p className="text-[11px] text-muted-foreground">vs. mês anterior</p>
                </div>
              </div>
              <div className="mt-4"><LineChart data={painMonth.data} height={110} /></div>
            </div>
          </section>
        </div>
      </div>
      {checkInOpen && <DailyCheckIn open={checkInOpen} onOpenChange={setCheckInOpen} record={record} onSave={setRecord} />}
    </AppShell>
  );
}
