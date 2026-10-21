import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircleMore, ChevronRight, Lightbulb, Target, Heart, Ear, PersonStanding, Utensils, Flower2, HeartHandshake, TrendingUp, BookOpen, CheckCircle2, type LucideIcon } from "lucide-react";
import { AppShell, IconButtons, Logo } from "@/components/vl/AppShell";
import { SectionHeader } from "@/components/vl/primitives";
import { patient } from "@/data/mock";
import { useRecords, useSaveRecord, todayKey, describePatterns, fmt } from "@/lib/records";
import hero from "@/assets/hero-mist.jpg";
import qaMove from "@/assets/qa-move.jpg";
import qaFood from "@/assets/qa-food.jpg";
import qaRelax from "@/assets/qa-relax.jpg";
import qaCommunity from "@/assets/qa-community.jpg";
import qaEvolution from "@/assets/qa-evolution.jpg";
import qaLibrary from "@/assets/qa-library.jpg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CrisisMode } from "@/components/vl/crisis-mode";
import { HoldButton } from "@/components/vl/hold-button";
import { InstallAppButton } from "@/components/vl/install-app";
import { Pill, CalendarHeart, LifeBuoy } from "lucide-react";
import { DailyCheckIn, type DailyRecord } from "@/components/vl/daily-check-in";
import { useCurrentUser } from "@/lib/user";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Início — VivaLeve" },
      { name: "description", content: "Seu cuidado diário com a fibromialgia: registro do dia, percepções e atalhos." },
      { property: "og:title", content: "Início — VivaLeve" },
      { property: "og:description", content: "Seu acompanhamento da fibromialgia, sempre ao seu lado." },
    ],
    links: [hero, qaMove, qaFood, qaRelax, qaCommunity, qaEvolution, qaLibrary].map((href) => ({
      rel: "preload",
      as: "image",
      href,
    })),
  }),
  component: Index,
});

const quickActions: { label: string; description: string; icon: LucideIcon; image: string; to?: string }[] = [
  { label: "Exercitar", description: "Seu plano de movimento", icon: PersonStanding, image: qaMove, to: "/plano" },
  { label: "Receitas", description: "Refeições e lista de compras", icon: Utensils, image: qaFood, to: "/alimentacao" },
  { label: "Relaxamento e controle", description: "Pausas para respirar e desacelerar", icon: Flower2, image: qaRelax, to: "/relaxamento" },
  { label: "Acolhimento e comunidade", description: "Você não está sozinha", icon: HeartHandshake, image: qaCommunity, to: "/comunidade" },
  { label: "Evolução e relatórios", description: "Como você está ao longo do tempo", icon: TrendingUp, image: qaEvolution, to: "/evolucao" },
  { label: "Biblioteca de conhecimento", description: "Conteúdos de confiança", icon: BookOpen, image: qaLibrary, to: "/biblioteca" },
];

function Index() {
  const [open, setOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const { data: records = [] } = useRecords();
  const me = useCurrentUser();
  const save = useSaveRecord();
  const record: DailyRecord | null = records.find(r => r.date === todayKey()) ?? null;
  const pattern = describePatterns(records);
  const insight = pattern
    ? { title: "O que percebemos", text: `Nos dias em que ${pattern.label === "dormiu mal" ? "você dormiu mal" : `você marcou “${pattern.label}”`}, sua dor média foi ${fmt(pattern.with)}. Nos outros dias, ${fmt(pattern.without)}.`, detail: "Isso é só uma observação dos seus próprios registros, não um diagnóstico. Vale levar para conversar na sua próxima consulta." }
    : { title: "O que percebemos", text: records.length < 5 ? `Com alguns dias de registro, vamos mostrar aqui o que se repete no seu dia a dia. Você já tem ${records.length} ${records.length === 1 ? "dia" : "dias"}.` : "Ainda não apareceu nenhuma relação clara nos seus registros. Continue no seu ritmo.", detail: "As observações usam apenas o que você registrou. Ninguém além de você vê essas informações." };
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 6);
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return todayKey(d); });
  const weekDone = weekDays.filter(d => records.some(r => r.date === d)).length;
  return (
    <AppShell>
      {/* Greeting */}
      <header className="relative -mx-5 -mt-4 overflow-hidden px-5 pb-6 pt-8 sm:-mx-8 sm:px-8 lg:mx-0 lg:mb-8 lg:mt-0 lg:rounded-3xl lg:px-10 lg:py-10">
        <img src={hero} alt="" loading="eager" fetchPriority="high" decoding="async" width={1536} height={640} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-90 dark:opacity-20" />
        <div className="relative">
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 lg:hidden">
              <div className="flex min-w-0 items-center gap-2">
                <Logo className="size-6 shrink-0" />
                <span className="truncate text-xs font-medium tracking-wide text-muted-foreground">VivaLeve</span>
              </div>
              <IconButtons />
            </div>
            <h1 className="mt-3 text-4xl font-medium lg:mt-0 lg:text-5xl">Olá{me.data?.firstName ? `, ${me.data.firstName}` : ""}</h1>
            <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              Seu acompanhamento está ativo. Você não está sozinha!{" "}
              <Heart className="inline size-4 fill-primary text-primary" aria-hidden />
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8">
        <div className="space-y-8">
          {/* Check-in */}
          {record ? (
            <section className="rounded-3xl border border-good/25 bg-good-soft p-6 shadow-soft sm:p-7">
              <p role="status" className="flex items-center gap-3 text-lg font-medium text-good">
                <CheckCircle2 className="size-6 shrink-0" aria-hidden />
                Registro do dia feito. Até amanhã! 💜
              </p>
            </section>
          ) : (
            <section className="checkin-invitation checkin-float relative overflow-hidden rounded-3xl p-6 shadow-float sm:p-7">
              <div aria-hidden className="breathe-glow" />
              <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div>
                  <p className="text-xs font-semibold text-primary-foreground/80">HOJE · UM MOMENTO PARA VOCÊ</p>
                  <h2 className="mt-3 text-3xl font-medium leading-snug text-primary-foreground">Como você<br />está se sentindo hoje?</h2>
                  <Button onClick={() => setCheckInOpen(true)} variant="secondary" className="group mt-6 flex h-14 w-full items-center justify-start gap-3 rounded-2xl bg-card px-5 text-left text-base text-primary shadow-soft transition hover:bg-card/90 sm:max-w-sm">
                    <MessageCircleMore className="size-5" />
                    <span className="flex-1">Registrar</span>
                    <ChevronRight className="size-4 transition group-hover:translate-x-0.5" />
                  </Button>
                </div>
                <div className="hidden items-center gap-2 px-1 py-3 text-sm text-primary-foreground/90 sm:flex">
                  <Ear className="size-4" /> Eu te escuto, sempre.
                </div>
              </div>
            </section>
          )}


          <div className="grid gap-3">
            <HoldButton onComplete={() => setCrisis(true)}>
              <LifeBuoy className="size-6" /> Estou em crise
            </HoldButton>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/remedios" className="card-soft pressable flex min-h-20 items-center gap-3 p-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Pill className="size-5" /></span><span className="font-medium leading-snug">Meus remédios</span></Link>
              <Link to="/consultas" className="card-soft pressable flex min-h-20 items-center gap-3 p-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><CalendarHeart className="size-5" /></span><span className="font-medium leading-snug">Consultas e exames</span></Link>
            </div>
          </div>

          {/* Quick actions */}
          <section>
            <SectionHeader title="O que você quer fazer hoje?" subtitle="Toque em um atalho para começar." />
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                const featured = i < 3;
                const inner = <>
                  <img src={action.image} alt="" loading="eager" fetchPriority="high" decoding="async" width={768} height={512} className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
                  <div aria-hidden className={cn("absolute inset-0 transition duration-500", featured ? "bg-gradient-to-b from-primary/20 via-transparent to-transparent" : "bg-gradient-to-b from-primary/10 via-transparent to-transparent")} />
                  <div className="relative flex h-full flex-col justify-end p-4 sm:p-5">
                    <span className="grid size-10 place-items-center rounded-full bg-card/90 text-primary shadow-soft backdrop-blur-sm transition duration-500 group-hover:scale-110 sm:size-11">
                      <Icon className="size-5" strokeWidth={1.8} />
                    </span>
                    <p className="mt-3 text-[17px] font-semibold leading-snug tracking-tight sm:text-lg">{action.label}</p>
                    <p className="mt-1 text-[13px] leading-snug text-muted-foreground sm:text-sm">{action.description}</p>
                    <span aria-hidden className="mt-3 h-0.5 w-8 rounded-full bg-primary/40 transition-all duration-500 group-hover:w-14 group-hover:bg-primary/60" />
                  </div>
                </>;
                const cardClass = cn(
                  "card-soft pressable animate-rise group relative block overflow-hidden rounded-3xl border border-primary/10 shadow-soft ring-1 ring-inset ring-card/40 transition duration-300 hover:-translate-y-1 hover:shadow-float",
                  featured ? "min-h-56 sm:min-h-60" : "min-h-48 sm:min-h-52",
                );
                return action.to
                  ? <Link key={action.label} to={action.to} className={cardClass} style={{ animationDelay: `${i * 60}ms` }}>{inner}</Link>
                  : <button key={action.label} type="button" className={cn(cardClass, "text-left")} style={{ animationDelay: `${i * 60}ms` }}>{inner}</button>;
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
                <h3 className="font-medium text-good">Seus últimos 7 dias</h3>
                <p className="mt-1 text-sm text-foreground">Você registrou {weekDone} de 7 dias. Cada registro ajuda você a se conhecer melhor — sem cobranças.</p>
                <div className="mt-3 flex items-center gap-1.5" aria-label={`${weekDone} de 7 dias registrados`}>
                  {weekDays.map(d => (
                    <span key={d} className={cn("h-1.5 flex-1 rounded-full", records.some(r => r.date === d) ? "bg-good" : "bg-card")} />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-10">
        <InstallAppButton />
      </div>
      <HomeFooter />

      <CrisisMode open={crisis} onOpenChange={setCrisis} />

      {checkInOpen && <DailyCheckIn open={checkInOpen} onOpenChange={setCheckInOpen} record={record} onSave={r => save.mutateAsync(r)} />}
    </AppShell>
  );
}

function HomeFooter() {
  return (
    <footer className="mt-12 lg:mt-14">
      <div className="rounded-3xl border bg-checkin px-6 py-8 text-center shadow-soft">
        <Logo className="mx-auto size-8" />
        <p className="mt-3 text-lg font-medium leading-snug">Você não precisa dar conta de tudo hoje.</p>
        <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          Um passo leve por vez já é progresso. Seus registros ficam guardados só para você.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link to="/profissional" className="inline-flex min-h-11 items-center gap-2 rounded-full border bg-card px-5 text-sm font-medium text-primary shadow-soft transition hover:bg-secondary">
            <HeartHandshake className="size-4" aria-hidden /> Quem criou o VivaLeve
          </Link>
          <Link to="/biblioteca" className="inline-flex min-h-11 items-center gap-2 rounded-full border bg-card/70 px-5 text-sm font-medium text-muted-foreground transition hover:bg-card hover:text-foreground">
            <BookOpen className="size-4" aria-hidden /> Tirar uma dúvida
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-5 max-w-md text-center text-xs leading-relaxed text-muted-foreground">
        O VivaLeve é um apoio para o seu dia a dia e não substitui a consulta com sua profissional.
        Em um momento difícil, ligue 188 (CVV) — gratuito, 24 horas.
      </p>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">VivaLeve · feito com carinho para o seu dia a dia</p>
    </footer>
  );
}
