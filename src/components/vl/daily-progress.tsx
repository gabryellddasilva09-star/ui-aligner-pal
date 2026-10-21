import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Dumbbell, Moon, UtensilsCrossed } from "lucide-react";
import { allExercises } from "@/data/exercises";
import { recipes } from "@/data/anti-inflammatory";
import { useMovementCompletions, useMovementSchedule } from "@/lib/movement-schedule";
import { useRecipeSchedule } from "@/lib/recipe-schedule";
import { todayKey } from "@/lib/records";
import { dailyProgress, isSleepDone } from "@/lib/daily-progress";
import { cn } from "@/lib/utils";

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

  const items = [
    { to: "/plano" as const, title: "Exercícios", icon: Dumbbell, value: `${exDone}/${exIds.length}`, label: "Treino", done: exIds.length > 0 && exDone === exIds.length, ratio: exIds.length ? exDone / exIds.length : 0 },
    { to: "/alimentacao" as const, title: "Alimentação", icon: UtensilsCrossed, value: `${mealCount}/${mealIds.length}`, label: "Refeições", done: mealIds.length > 0 && mealCount === mealIds.length, ratio: mealIds.length ? mealCount / mealIds.length : 0 },
    { to: "/relaxamento" as const, search: { pratica: "sleep" }, title: "Sono", icon: Moon, value: sleepDone ? "Feito" : "Falta", label: "Preparar para dormir", done: sleepDone, ratio: sleepDone ? 1 : 0 },
  ];

  return (
    <section className="rounded-3xl border border-primary/15 bg-primary-soft/60 p-5 shadow-soft sm:p-6" aria-label="Progresso diário">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-2xl font-semibold text-primary">Progresso Diário</h2>
        <p className="text-lg"><span className="font-semibold">{pct}%</span> Concluído</p>
      </div>
      <div className="relative mt-4 h-4 rounded-full bg-card" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 text-right text-xs text-muted-foreground">Meta: 100%</p>
      <div className="mt-3 grid grid-cols-3 divide-x divide-primary/15">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.title} to={item.to} search={item.search} className="group min-w-0 rounded-xl px-2 py-1 transition first:pl-0 hover:bg-card/60 sm:px-4">
              <p className="truncate text-sm font-semibold sm:text-base">{item.title}</p>
              <div className="mt-2 flex items-center gap-2">
                <Icon className="size-7 shrink-0 text-primary" strokeWidth={1.6} aria-hidden />
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-lg font-medium leading-none">
                    {item.value}
                    {item.done && <CheckCircle2 className="size-4 text-good" aria-label="concluído" />}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
              {!item.done && <div className={cn("mt-2 h-1.5 rounded-full bg-card")}><div className="h-full rounded-full bg-primary/70" style={{ width: `${item.ratio * 100}%` }} /></div>}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
