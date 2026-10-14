import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2, ChevronDown, ChevronLeft, Clock, ShieldCheck,
} from "lucide-react";
import { AppShell, Logo } from "@/components/vl/AppShell";
import { SectionHeader } from "@/components/vl/primitives";
import { ActivityTile, ProgressBar, DialogShell } from "@/components/vl/movement";
import { planDays, planDayNames } from "@/data/movement";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/user";
import { exercises } from "@/data/exercises";
import { useMovementSchedule, useMovementCompletions, useCompleteMovementExercise } from "@/lib/movement-schedule";
import { movementWeek, movementProgress } from "@/lib/movement-progress";
import { todayKey } from "@/lib/records";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/plano")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Meu plano de movimento — VivaLeve" },
      { name: "description", content: "Atividades físicas e exercícios sugeridos para o seu dia, no seu ritmo." },
      { property: "og:title", content: "Meu plano de movimento — VivaLeve" },
      { property: "og:description", content: "Movimente-se no seu ritmo, com acolhimento e autonomia." },
    ],
  }),
  component: Plano,
});

type Phase = "details" | "doing" | "feedback" | "thanks";

const feedbackOptions = ["Foi confortável", "Foi difícil", "Não consegui concluir", "Prefiro não responder"];

function Plano() {
  const me = useCurrentUser();
  const schedule = useMovementSchedule();
  const week = movementWeek();
  const today = todayKey();
  const completions = useMovementCompletions(week[0]?.key ?? today, week[6]?.key ?? today);
  const saveCompletion = useCompleteMovementExercise();
  const allActivities = exercises.map(exercise => ({
    id: exercise.id, name: exercise.name, category: exercise.cat, duration: `${exercise.min} min`,
    description: "Baixo impacto", objective: "Movimentar-se com suavidade, respeitando seus limites.",
    steps: exercise.steps, safety: ["Faça só o que for confortável. Pare se sentir dor, tontura ou desconforto."],
    image: exercise.img,
  }));
  const activitiesForDay = (index: number) => allActivities.filter(activity =>
    schedule.data?.some(row => row.exercise_id === activity.id && row.weekdays.includes(index)),
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const [openDate, setOpenDate] = useState(today);
  const [phase, setPhase] = useState<Phase>("details");
  const [feedback, setFeedback] = useState<string | null>(null);
  const todayIndex = new Date().getDay();
  const [dayIndex, setDayIndex] = useState(todayIndex);

  const todayActivities = activitiesForDay(todayIndex);
  const dayActivities = activitiesForDay(dayIndex);
  const selectedDate = week[dayIndex]?.key ?? today;
  const isDone = (id: string, date: string) => completions.data?.some(row => row.exercise_id === id && row.activity_date === date) ?? false;
  const progress = movementProgress(todayActivities.map(a => a.id), (completions.data ?? []).filter(row => row.activity_date === today).map(row => row.exercise_id));
  const total = progress.total;
  const doneCount = progress.done;
  const pct = Math.round(progress.value * 100);
  const totalMinutes = todayActivities.reduce((sum, a) => {
    const m = a.duration ? parseInt(a.duration, 10) : 10;
    return sum + (Number.isNaN(m) ? 10 : m);
  }, 0);
  const open = allActivities.find((a) => a.id === openId) ?? null;
  function activityVisual(activity: (typeof allActivities)[number], large = false) {
    return "image" in activity && typeof activity.image === "string"
      ? <img src={activity.image} alt="" className={cn("shrink-0 rounded-2xl object-cover", large ? "size-20" : "size-16")} />
      : <ActivityTile id={activity.id} large={large} />;
  }

  function openActivity(id: string) {
    setOpenId(id);
    setOpenDate(selectedDate);
    saveCompletion.reset();
    setPhase("details");
    setFeedback(null);
  }
  function close() {
    setOpenId(null);
    setPhase("details");
    setFeedback(null);
  }
  async function complete() {
    if (!openId || saveCompletion.isPending) return;
    try {
      await saveCompletion.mutateAsync({ exerciseId: openId, date: openDate });
      setPhase("feedback");
    } catch {
      // Keep the activity open so the patient can retry without losing context.
    }
  }

  return (
    <AppShell>
      {/* Cabeçalho */}
      <header className="relative -mx-5 -mt-4 px-5 pb-2 pt-8 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-0 lg:rounded-3xl lg:px-10 lg:py-10">
        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 lg:hidden">
              <Logo className="size-6" />
              <span className="text-xs font-medium tracking-wide text-muted-foreground">VivaLeve</span>
            </div>
            <h1 className="mt-3 text-4xl font-medium lg:mt-0 lg:text-5xl">Meu plano de movimento</h1>
            <p className="mt-2 text-[15px] text-muted-foreground">Movimente-se no seu ritmo.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Olá{me.data?.firstName ? `, ${me.data.firstName}` : ""} <span aria-hidden>🌿</span> — Pequenos passos também são progresso.
            </p>
          </div>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-8 [&>*]:min-w-0 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-8">
          {/* Plano de hoje */}
          <section className="relative overflow-hidden rounded-3xl bg-checkin p-6 shadow-float sm:p-7" aria-label="Seu plano de hoje">
            <div className="absolute -right-10 -top-10 size-48 rounded-full bg-card/40 blur-2xl" />
            <div className="relative">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-accent-foreground">HOJE</p>
              <h2 className="mt-2 text-2xl font-normal">Seu plano de hoje</h2>
              <p className="mt-1 text-sm text-accent-foreground">
                {total ? "As atividades que você escolheu para hoje, no seu ritmo." : "Escolha seus exercícios em Editar plano para começar."}
              </p>
              <div className="mt-5 flex items-end justify-between gap-4">
                <p className="text-sm font-medium">
                  {doneCount} de {total} atividades concluídas
                </p>
                <p className="font-display text-2xl font-medium">{pct}%</p>
              </div>
              <div className="mt-2">
                <ProgressBar value={total ? doneCount / total : 0} />
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-accent-foreground">
                <Clock className="size-3.5" aria-hidden /> Tempo estimado: ≈ {totalMinutes} min no total
              </p>
            </div>
          </section>


          {/* Atividades do dia */}
          <section aria-label="Suas atividades">
            <SectionHeader title="Suas atividades" subtitle="Uma etapa de cada vez." />
            <div className="mt-3 grid grid-cols-7 gap-1.5" role="group" aria-label="Escolher o dia da semana">
              {planDays.map((d, i) => (
                <Button variant="ghost"
                  key={d}
                  onClick={() => setDayIndex(i)}
                  aria-pressed={dayIndex === i}
                  className={cn(
                    "pressable h-auto min-h-14 flex-col gap-0.5 rounded-2xl px-1 py-2 text-[11px] font-semibold transition sm:text-sm",
                    dayIndex === i
                      ? "bg-primary text-primary-foreground shadow-float"
                      : i === todayIndex
                        ? "bg-primary-soft text-primary"
                        : "bg-secondary text-muted-foreground",
                  )}
                >
                  <span>{d}</span>
                  <span className="text-[10px] font-normal sm:text-xs">{week[i]?.label}</span>
                </Button>
              ))}
            </div>
            {dayIndex !== todayIndex && (
              <p className="mt-2 text-xs text-muted-foreground">
                Você está vendo os exercícios de {(planDayNames[dayIndex] ?? "esse dia").toLowerCase()}.
              </p>
            )}
            {schedule.isPending || completions.isPending ? (
              <p className="py-6 text-center text-sm text-muted-foreground" role="status">Carregando seu plano…</p>
            ) : schedule.error || completions.error ? (
              <div className="py-6 text-center" role="alert">
                <p className="text-sm text-muted-foreground">Não foi possível carregar seu plano.</p>
                <Button variant="ghost" onClick={() => { void schedule.refetch(); void completions.refetch(); }}>Tentar novamente</Button>
              </div>
            ) : dayActivities.length === 0 ? (
              <div className="card-soft p-6 text-center">
                <p className="font-medium">Nenhum exercício programado para este dia.</p>
                <p className="mt-1 text-sm text-muted-foreground">Escolha os exercícios e os dias em Editar plano.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {dayActivities.map((a, i) => (
                  <li key={a.id} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
                    <button
                      onClick={() => openActivity(a.id)}
                      className="card-soft pressable flex w-full items-center gap-4 p-3.5 text-left sm:p-4"
                      aria-label={`${a.name} — abrir detalhes`}
                    >
                      {activityVisual(a)}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="font-medium">{a.name}</p>
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">{a.category}</span>
                          {a.duration && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Clock className="size-3" aria-hidden /> {a.duration}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">{a.description}</p>
                      </div>
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-full",
                          isDone(a.id, selectedDate) ? "bg-good-soft text-good" : "bg-secondary text-muted-foreground",
                        )}
                        aria-label={isDone(a.id, selectedDate) ? "Concluída" : "Não iniciada"}
                      >
                        {isDone(a.id, selectedDate) ? <CheckCircle2 className="size-4.5" /> : <ChevronDown className="size-4.5 -rotate-90" />}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <Link to="/exercicios" className="pressable rounded-full bg-primary-soft px-5 py-2 text-sm font-semibold text-primary">
              Editar plano
            </Link>
          </div>


          <p className="rounded-2xl border bg-card px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            As atividades são sugeridas a partir de um plano geral de autocuidado. Elas não substituem a orientação da
            sua profissional — combinado{me.data?.firstName ? `, ${me.data.firstName}` : ""}? <span aria-hidden>💚</span>
          </p>
        </div>
      </div>

      {/* Detalhes da atividade */}
      {open && (
        <DialogShell title={open.name} onClose={close}>
          {phase === "details" && (
            <div>
              <button
                onClick={close}
                className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <ChevronLeft className="size-4" aria-hidden /> Voltar
              </button>
              <div className="flex items-center gap-4">
                {activityVisual(open, true)}
                <div className="min-w-0">
                  <h2 className="font-display text-2xl font-medium">{open.name}</h2>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] text-muted-foreground">{open.category}</span>
                    {open.duration && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="size-3" aria-hidden /> {open.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">Objetivo: </span>
                {open.objective}
              </p>
              <h3 className="mt-5 text-sm font-semibold">Passo a passo</h3>
              <ol className="mt-2 space-y-2">
                {open.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
              <div className="mt-5 flex gap-3 rounded-2xl bg-secondary p-4">
                <ShieldCheck className="size-5 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="text-sm font-medium">Orientações de segurança</p>
                  <ul className="mt-1 space-y-0.5">
                    {open.safety.map((s, i) => (
                      <li key={i} className="text-xs leading-relaxed text-muted-foreground">• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setPhase("doing")}
                className="pressable mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
              >
                Iniciar atividade
              </button>
            </div>
          )}

          {phase === "doing" && (
            <div>
              <button
                onClick={() => setPhase("details")}
                className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <ChevronLeft className="size-4" aria-hidden /> Voltar
              </button>
              <div className="flex items-center gap-4">
                {activityVisual(open, true)}
                <div>
                  <h2 className="font-display text-2xl font-medium">{open.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">No seu tempo. Sem pressa.</p>
                </div>
              </div>
              <ol className="mt-6 space-y-3">
                {open.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                Lembre-se: faça apenas o que for confortável. Você pode parar a qualquer momento.
              </p>
              <Button
                onClick={complete}
                disabled={saveCompletion.isPending || isDone(open.id, openDate)}
                className="pressable mt-6 h-auto w-full rounded-full py-3.5 text-sm font-semibold"
              >
                {saveCompletion.isPending ? "Salvando…" : isDone(open.id, openDate) ? "Atividade concluída" : "Concluir atividade"}
              </Button>
              {saveCompletion.isError && <p className="mt-3 text-sm text-destructive" role="alert">Não foi possível salvar. Tente novamente.</p>}
            </div>
          )}

          {phase === "feedback" && (
            <div>
              <h2 className="font-display text-xl font-medium">Como você se sentiu?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Sua resposta é opcional e ajuda a registrar sua experiência.</p>
              <div className="mt-5 grid gap-2">
                {feedbackOptions.map((o) => (
                  <button
                    key={o}
                    onClick={() => {
                      setFeedback(o);
                      setPhase("thanks");
                    }}
                    className="rounded-2xl border bg-card px-4 py-3 text-sm font-medium transition hover:bg-secondary"
                  >
                    {o}
                  </button>
                ))}
              </div>
              <button
                onClick={close}
                className="mt-4 w-full rounded-full py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                Prefiro fazer isso depois
              </button>
            </div>
          )}

          {phase === "thanks" && (
            <div className="py-4 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-good-soft text-good">
                <CheckCircle2 className="size-7" aria-hidden />
              </span>
              <h2 className="mt-4 font-display text-xl font-medium">Atividade registrada</h2>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Obrigado por registrar como foi sua experiência.
              </p>
              {feedback === "Não consegui concluir" && (
                <p className="mx-auto mt-3 max-w-xs rounded-2xl bg-secondary px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                  Se sentir piora importante ou sintomas novos, não é preciso continuar. Consulte as orientações de
                  segurança e procure avaliação da sua profissional quando necessário.
                </p>
              )}
              <button
                onClick={close}
                className="pressable mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
              >
                Fechar
              </button>
            </div>
          )}
        </DialogShell>
      )}
    </AppShell>
  );
}
