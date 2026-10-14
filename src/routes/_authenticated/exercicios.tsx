import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { DialogShell } from "@/components/vl/movement";
import { cn } from "@/lib/utils";
import { exercises, type Exercise } from "@/data/exercises";
import { planDays, planDayNames } from "@/data/movement";
import { useMovementSchedule, useSaveMovementSchedule } from "@/lib/movement-schedule";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/_authenticated/exercicios")({
  head: () => ({
    meta: [
      { title: "Exercícios — VivaLeve" },
      { name: "description", content: "Todos os exercícios suaves disponíveis para montar seu plano de movimento." },
      { property: "og:title", content: "Exercícios — VivaLeve" },
      { property: "og:description", content: "Exercícios de baixo impacto para se movimentar no seu ritmo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Exercicios,
});

const filters = [
  { key: "all", label: "Todos" },
  { key: "beginner", label: "Para iniciantes" },
  { key: "guided", label: "Com orientação" },
] as const;

function Exercicios() {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");
  const [open, setOpen] = useState<Exercise | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const schedule = useMovementSchedule();
  const save = useSaveMovementSchedule();
  const daysFor = (id: string) => schedule.data?.find(row => row.exercise_id === id)?.weekdays ?? [];
  function openExercise(exercise: Exercise) {
    setSelectedDays(daysFor(exercise.id));
    save.reset();
    setOpen(exercise);
  }
  async function saveDays() {
    if (!open) return;
    try {
      await save.mutateAsync({ exerciseId: open.id, weekdays: selectedDays });
      setOpen(null);
    } catch { /* The dialog displays the error and keeps the selected days. */ }
  }
  const list = exercises.filter((e) => filter === "all" || (filter === "beginner" ? e.beginner : e.guided));

  return (
    <AppShell>
      <header className="flex items-center gap-3 pt-4">
        <Link to="/plano" aria-label="Voltar" className="pressable grid size-11 place-items-center rounded-full bg-card shadow-sm">
          <ChevronLeft className="size-5 text-primary" />
        </Link>
        <h1 className="text-3xl font-medium">Exercícios</h1>
      </header>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <Button variant="ghost" key={f.key} onClick={() => setFilter(f.key)} aria-pressed={filter === f.key}
            className={cn("shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition",
              filter === f.key ? "bg-primary text-primary-foreground shadow" : "bg-secondary text-foreground")}>
            {f.label}
          </Button>
        ))}
      </div>

      {schedule.error && <p role="alert" className="mt-4 text-sm text-destructive">Não foi possível carregar seu plano. <Button variant="link" onClick={() => schedule.refetch()}>Tentar novamente</Button></p>}
      <ul className="mt-5 space-y-3">
        {list.map((e) => (
          <li key={e.id}>
            <Button variant="ghost" disabled={schedule.isPending || !!schedule.error} onClick={() => openExercise(e)} className="card-soft pressable flex h-auto w-full flex-wrap justify-start gap-x-3 gap-y-2 whitespace-normal p-3 text-left">
              <img src={e.img} alt="" width={816} height={816} loading="lazy" className="size-20 shrink-0 rounded-2xl object-cover sm:size-24" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug">{e.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{e.min} min • {e.cat}</p>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              <div className="flex w-full items-center justify-between gap-2 border-t pt-2">
                <span className="shrink-0 rounded-full bg-primary-soft px-2 py-1 text-[11px] font-medium text-primary">Baixo impacto</span>
                <span className="flex min-w-0 flex-wrap justify-end gap-1 text-[10px] text-primary" aria-label={`Dias planejados: ${daysFor(e.id).map(d => planDayNames[d]).join(", ") || "nenhum"}`}>
                  {schedule.isPending ? <span className="text-muted-foreground">Carregando dias…</span> : daysFor(e.id).length ? daysFor(e.id).map(d => <span key={d} className="rounded bg-primary-soft px-1 py-1 font-semibold">{planDays[d]}</span>) : <span className="text-muted-foreground">Sem dias</span>}
                </span>
              </div>
            </Button>
          </li>
        ))}
      </ul>

      {open && (
        <DialogShell title={open.name} onClose={() => setOpen(null)}>
          <img src={open.img} alt={open.name} className="aspect-square w-full rounded-3xl object-cover" />
          <h2 className="mt-4 font-display text-2xl font-medium">{open.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{open.min} min • {open.cat} • Baixo impacto</p>
          <fieldset className="mt-5 border-y py-4" disabled={save.isPending}>
            <legend className="text-base font-semibold">Adicionar aos dias</legend>
            <label className="mb-3 flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
              <Checkbox checked={selectedDays.length === 7} onCheckedChange={checked => setSelectedDays(checked === true ? [0, 1, 2, 3, 4, 5, 6] : [])} className="size-5" />
              Todos os dias
            </label>
            <div className="grid grid-cols-2 gap-2">
              {planDayNames.map((name, i) => <label key={name} className={cn("flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm", selectedDays.includes(i) ? "border-primary bg-primary-soft text-primary" : "bg-card text-foreground")}>
                <Checkbox checked={selectedDays.includes(i)} onCheckedChange={checked => setSelectedDays(days => checked === true ? [...days, i] : days.filter(day => day !== i))} className="size-5" />
                {name}
              </label>)}
            </div>
          </fieldset>
          <ol className="mt-4 space-y-2">
            {open.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="mt-4 flex gap-3 rounded-2xl bg-secondary p-4 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="size-5 shrink-0 text-primary" />
            Faça só o que for confortável. Pare se sentir dor, tontura ou desconforto.
          </div>
          {save.error && <p role="alert" className="mt-4 text-sm text-destructive">Não foi possível salvar. Tente novamente.</p>}
          <Button disabled={save.isPending} onClick={saveDays} className="pressable mt-5 h-12 w-full rounded-full text-sm font-semibold">{save.isPending ? "Salvando…" : "Salvar no meu plano"}</Button>
          <Button variant="ghost" disabled={save.isPending} onClick={() => setOpen(null)} className="mt-2 h-11 w-full rounded-full">Cancelar</Button>
        </DialogShell>
      )}
    </AppShell>
  );
}
