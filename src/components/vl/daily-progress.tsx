import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, Dumbbell, Moon, UtensilsCrossed } from "lucide-react";
import { allExercises } from "@/data/exercises";
import { recipes } from "@/data/anti-inflammatory";
import { useMovementCompletions, useMovementSchedule } from "@/lib/movement-schedule";
import { useRecipeSchedule } from "@/lib/recipe-schedule";
import { todayKey } from "@/lib/records";
import { dailyProgress, isSleepDone } from "@/lib/daily-progress";
import { cn } from "@/lib/utils";

function ProgressRing({ pct }: { pct: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(100, Math.max(0, pct)) / 100);
  return (
    <div className="relative size-16 shrink-0">
      <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden>
        <circle cx="32" cy="32" r={r} fill="none" className="stroke-primary-soft" strokeWidth="7" />
        <circle
          cx="32" cy="32" r={r} fill="none"
          className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
          strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-base font-semibold text-primary" aria-hidden>
        {pct}%
      </span>
    </div>
  );
}

export function DailyProgressCard() {
  const today = todayKey();
  const weekday = new Date().getDay();
  const moves = useMovementSchedule();
  const completions = useMovementCompletions(today, today);
  const meals = useRecipeSchedule();
  const [mealDone, setMealDone] = useState<Record<string, boolean>>({});
  const [sleepDone, setSleepDone] = useState(false);

  useEffect(() => {
    const read = () => {
      try { setMealDone(JSON.parse(localStorage.getItem("vl-ai-done") ?? "{}")); } catch { setMealDone({}); }
      setSleepDone(isSleepDone());
    };
    read();
    window.addEventListener("vl-progress", read); window.addEventListener("focus", read);
    return () => { window.removeEventListener("vl-progress", read); window.removeEventListener("focus", read); };
  }, []);

  const exIds = allExercises.filter(e => moves.data?.some(r => r.exercise_id === e.id && r.weekdays.includes(weekday))).map(e => e.id);
  const doneIds = new Set((completions.data ?? []).map(r => r.exercise_id));
  const exDone = exIds.filter(id => doneIds.has(id)).length;
  const mealIds = recipes.filter(r => meals.data?.some(m => m.recipe_id === r.id && m.weekdays.includes(weekday))).map(r => r.id);
  const mealCount = mealIds.filter(id => mealDone[`${weekday}-${id}`]).length;
  const pct = dailyProgress({ exDone, exTotal: exIds.length, mealDone: mealCount, mealTotal: mealIds.length, sleepDone });
  const doneCount = Math.min(exDone, exIds.length) + Math.min(mealCount, mealIds.length) + (sleepDone ? 1 : 0);
  const totalCount = exIds.length + mealIds.length + 1;

  const items = [
    {
      to: "/plano" as const, title: "Exercícios", icon: Dumbbell,
      tone: "text-move", soft: "bg-move/15", bar: "bg-move",
      value: exIds.length ? `${exDone}/${exIds.length}` : "Descanso",
      done: exIds.length > 0 && exDone === exIds.length,
      ratio: exIds.length ? exDone / exIds.length : 0,
    },
    {
      to: "/alimentacao" as const, title: "Alimentação", icon: UtensilsCrossed,
      tone: "text-food", soft: "bg-food/15", bar: "bg-food",
      value: mealIds.length ? `${mealCount}/${mealIds.length}` : "Livre",
      done: mealIds.length > 0 && mealCount === mealIds.length,
      ratio: mealIds.length ? mealCount / mealIds.length : 0,
    },
    {
      to: "/relaxamento" as const, search: { pratica: "sleep" }, title: "Sono", icon: Moon,
      tone: "text-sleep", soft: "bg-sleep/15", bar: "bg-sleep",
      value: sleepDone ? "Feito" : "Falta",
      done: sleepDone,
      ratio: sleepDone ? 1 : 0,
    },
  ];

  return (
    <section className="rounded-3xl border border-primary/20 bg-primary-soft/60 p-5 backdrop-blur-sm shadow-soft" aria-label="Progresso diário">
      <div className="flex items-center gap-4">
        <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${pct}% do dia concluído`}>
          <ProgressRing pct={pct} />
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-xl font-semibold leading-tight">Progresso Diário</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {doneCount === totalCount
              ? "Tudo feito por hoje! 💜"
              : `${doneCount} de ${totalCount} cuidados de hoje`}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.to}
              search={(item.search ?? {}) as never}
              className="group flex items-center gap-3 rounded-2xl border border-transparent bg-muted/60 p-3 transition hover:border-primary/20 hover:bg-card"
            >
              <span className={cn("grid size-11 shrink-0 place-items-center rounded-full", item.done ? "bg-good-soft" : item.soft)}>
                <Icon className={cn("size-5", item.done ? "text-good" : item.tone)} strokeWidth={1.8} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{item.title}</p>
                  <p className={cn("shrink-0 text-xs font-medium", item.done ? "text-good" : "text-muted-foreground")}>
                    {item.value}
                  </p>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-background">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", item.done ? "bg-good" : item.bar)}
                    style={{ width: `${Math.round(item.ratio * 100)}%` }}
                  />
                </div>
              </div>
              {item.done
                ? <CheckCircle2 className="size-5 shrink-0 text-good" aria-label="concluído" />
                : <ChevronRight className="size-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" aria-hidden />}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
