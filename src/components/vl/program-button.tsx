import { Link } from "@tanstack/react-router";
import { Sparkles, ChevronRight } from "lucide-react";
import { useProgram, unlockedDay } from "@/lib/program";
import { programDays } from "@/data/program";

export function ProgramButton() {
  const { data } = useProgram();
  const enr = data?.enrollment?.active ? data.enrollment : null;
  if (!enr) {
    return (
      <Link to="/programa" className="card-soft pressable flex min-h-20 items-center gap-3 border-primary/30 p-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Sparkles className="size-6" /></span>
        <span className="min-w-0 flex-1"><span className="block text-lg font-medium">Programa guiado de 30 dias</span><span className="text-sm text-muted-foreground">Uma atividade leve por dia, com lembrete</span></span>
        <ChevronRight className="size-5 text-muted-foreground" />
      </Link>
    );
  }
  const done = data!.progress.length;
  const day = unlockedDay(enr.started_on);
  const today = programDays[day - 1]!;
  const todayDone = data!.progress.some(p => p.day === day);
  return (
    <Link to="/programa" className="checkin-invitation pressable block rounded-3xl p-5 text-primary-foreground shadow-float">
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-foreground/20"><Sparkles className="size-6" /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm opacity-90">Programa guiado · Dia {day} de 30</span>
          <span className="block text-lg font-semibold leading-snug">{todayDone ? "Atividade de hoje feita ✓" : today.title}</span>
        </span>
        <ChevronRight className="size-5" />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-primary-foreground/25" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={30} aria-label="Progresso do programa">
          <div className="h-full rounded-full bg-primary-foreground transition-all duration-700" style={{ width: `${(done / 30) * 100}%` }} />
        </div>
        <span className="text-sm font-medium">{done}/30</span>
      </div>
    </Link>
  );
}
