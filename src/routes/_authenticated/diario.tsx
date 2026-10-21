import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Zap, Moon, BatteryMedium, Brain, Dumbbell, UtensilsCrossed, Droplets, CheckCircle2 } from "lucide-react";
import { useProgressHistory, type ProgressSnapshot } from "@/lib/daily-progress-history";
import { allExercises } from "@/data/exercises";
import { recipes } from "@/data/anti-inflammatory";
import { AppShell } from "@/components/vl/AppShell";
import { SectionHeader } from "@/components/vl/primitives";
import { useRecords, sleepHours, fmt, todayKey } from "@/lib/records";

export const Route = createFileRoute("/_authenticated/diario")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Diário — VivaLeve" },
      { name: "description", content: "Seus registros diários de dor, sono, disposição e do que aconteceu no dia." },
      { property: "og:title", content: "Diário — VivaLeve" },
      { property: "og:description", content: "Seus registros diários de dor, sono, disposição e do que aconteceu no dia." },
    ],
  }),
  component: Diario,
});

function label(date: string) {
  const y = new Date(); y.setDate(y.getDate() - 1);
  if (date === todayKey()) return "Hoje";
  if (date === todayKey(y)) return "Ontem";
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "short" });
}

const exName = (id: string) => allExercises.find(e => e.id === id)?.name ?? id;
const mealName = (id: string) => recipes.find(r => r.id === id)?.name ?? id;

function ProgressBlock({ p }: { p: ProgressSnapshot }) {
  return <div className="mt-4 rounded-2xl border border-primary/20 bg-primary-soft/60 p-4">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-semibold">Progresso do dia</p>
      <p className="text-sm font-semibold text-primary">{p.pct}%</p>
    </div>
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-background"><div className="h-full rounded-full bg-primary" style={{ width: `${p.pct}%` }} /></div>
    <ul className="mt-3 space-y-2 text-sm">
      <li className="flex gap-2"><Dumbbell className="mt-0.5 size-4 shrink-0 text-move" aria-hidden /><span><span className="font-medium">Exercícios {p.exercises.length}/{p.exercisesTotal}</span>{p.exercises.length > 0 && <span className="text-muted-foreground">: {p.exercises.map(exName).join(", ")}</span>}</span></li>
      <li className="flex gap-2"><UtensilsCrossed className="mt-0.5 size-4 shrink-0 text-food" aria-hidden /><span><span className="font-medium">Alimentação {p.meals.length}/{p.mealsTotal}</span>{p.meals.length > 0 && <span className="text-muted-foreground">: {p.meals.map(mealName).join(", ")}</span>}</span></li>
      <li className="flex items-center gap-2"><Moon className="size-4 shrink-0 text-sleep" aria-hidden /><span className="font-medium">Preparar para dormir: {p.sleepDone ? "feito" : "não feito"}</span>{p.sleepDone && <CheckCircle2 className="size-4 text-good" aria-hidden />}</li>
      <li className="flex items-center gap-2"><Droplets className="size-4 shrink-0 text-primary" aria-hidden /><span className="font-medium">Água: {p.water} {p.water === 1 ? "copo" : "copos"} ({(p.water * 0.25).toLocaleString("pt-BR")} L)</span></li>
    </ul>
  </div>;
}

function Diario() {
  const { data: progress = [] } = useProgressHistory();
  const { data: records = [], isLoading, isError } = useRecords();
  const byDate = new Map(progress.filter(p => p.pct > 0 || p.water > 0).map(p => [p.date, p]));
  const dates = [...new Set([...records.map(r => r.date), ...byDate.keys()])].sort().reverse();
  const recByDate = new Map(records.map(r => [r.date, r]));
  return (
    <AppShell>
      <div className="pt-6 lg:pt-0">
        <SectionHeader title="Diário" subtitle="Seus registros, dia a dia. Só você vê."
          action={<Link to="/" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-float"><Plus className="size-4" /> Registrar</Link>} />
        {isLoading ? <p className="mt-6 text-muted-foreground">Carregando…</p>
          : isError ? <p role="alert" className="mt-6 text-destructive">Não conseguimos carregar seus registros agora.</p>
          : dates.length === 0 ? <div className="card-soft mt-6 p-8 text-center text-muted-foreground">Você ainda não tem registros. Toque em “Registrar” para contar como está.</div>
          : <ol className="relative mt-6 space-y-5 border-l border-dashed pl-6">
            {dates.map(date => {
              const r = recByDate.get(date); const p = byDate.get(date);
              if (!r) return <li key={date}>
                <span className="absolute -left-[7px] mt-5 size-3.5 rounded-full border-2 border-card bg-primary" />
                <div className="card-soft p-5"><h3 className="text-lg font-medium capitalize">{label(date)}</h3><p className="text-sm text-muted-foreground">Sem registro de como se sentiu.</p>{p && <ProgressBlock p={p} />}</div>
              </li>;
              const h = sleepHours(r);
              const items = [
                { icon: Zap, label: "Dor", value: `${r.pain}/10`, color: "var(--pain)" },
                { icon: Moon, label: "Sono", value: h ? `${fmt(h)}h · ${r.sleep.replace("Dormi ", "")}` : r.sleep.replace("Dormi ", ""), color: "var(--sleep)" },
                { icon: BatteryMedium, label: "Disposição", value: r.disposition, color: "var(--energy)" },
                ...(r.brainFog ? [{ icon: Brain, label: "Névoa mental", value: r.brainFog, color: "var(--primary)" }] : []),
              ];
              return <li key={r.date}>
                <span className="absolute -left-[7px] mt-5 size-3.5 rounded-full border-2 border-card bg-primary" />
                <div className="card-soft p-5">
                  <h3 className="text-lg font-medium capitalize">{label(r.date)}</h3>
                  <p className="text-sm text-muted-foreground">Humor: {r.mood} · Cansaço: {r.fatigue}{r.cycle && r.cycle !== "Não se aplica" ? ` · ${r.cycle}` : ""}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {items.map(it => { const Icon = it.icon; return <div key={it.label} className="flex items-center gap-3 rounded-2xl bg-secondary p-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-card" style={{ color: it.color }}><Icon className="size-4" /></span>
                      <div className="min-w-0"><p className="text-xs text-muted-foreground">{it.label}</p><p className="font-medium">{it.value}</p></div>
                    </div>; })}
                  </div>
                  {r.bodyPain && <p className="mt-3 text-sm"><span className="text-muted-foreground">Onde doeu: </span>{Object.entries(r.bodyPain).map(([k, v]) => `${k} (${v})`).join(", ")}</p>}
                  {r.triggers && <div className="mt-3 flex flex-wrap gap-2">{r.triggers.map(t => <span key={t} className="rounded-full bg-primary-soft px-3 py-1 text-xs text-primary">{t}</span>)}</div>}
                  {r.brainFogNote && <p className="mt-3 text-sm italic text-muted-foreground">“{r.brainFogNote}”</p>}
                  {p && <ProgressBlock p={p} />}
                </div>
              </li>;
            })}
          </ol>}
      </div>
    </AppShell>
  );
}
