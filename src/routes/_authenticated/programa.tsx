import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Clock, Lock, Sparkles, ChevronRight, BellRing } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { Button } from "@/components/ui/button";
import { PushToggle } from "@/components/vl/push-toggle";
import { supabase } from "@/integrations/supabase/client";
import { programDays, programWeeks, type ProgramDay } from "@/data/program";
import { useProgram, unlockedDay } from "@/lib/program";
import { ProgramActivity } from "@/components/vl/program-activity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/programa")({
  head: () => ({
    meta: [
      { title: "Programa guiado de 30 dias — VivaLeve" },
      { name: "description", content: "Um programa leve de 30 dias com uma atividade diferente por dia e lembrete no seu horário." },
      { property: "og:title", content: "Programa guiado de 30 dias — VivaLeve" },
      { property: "og:description", content: "Uma atividade suave por dia para cuidar da fibromialgia no seu ritmo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Programa,
});

const feelings = ["Me fez bem", "Foi difícil", "Não senti diferença"];

function Programa() {
  const qc = useQueryClient();
  const { data, isLoading } = useProgram();
  const [time, setTime] = useState("09:00");
  const [open, setOpen] = useState<ProgramDay | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["program"] });
  const uid = async () => { const { data } = await supabase.auth.getUser(); if (!data.user) throw new Error("Sem sessão"); return data.user.id; };

  const join = useMutation({
    mutationFn: async () => {
      const user_id = await uid();
      await supabase.from("program_progress").delete().eq("user_id", user_id);
      const today = new Date(); const started_on = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const { error } = await supabase.from("program_enrollments").upsert({ user_id, remind_time: time, remind: true, active: true, started_on });
      if (error) throw error;
    }, onSuccess: refresh,
  });
  const update = useMutation({
    mutationFn: async (patch: { remind_time?: string; remind?: boolean; active?: boolean }) => {
      const { error } = await supabase.from("program_enrollments").update(patch).eq("user_id", await uid()); if (error) throw error;
    }, onSuccess: refresh,
  });
  const complete = useMutation({
    mutationFn: async ({ day, feeling }: { day: number; feeling: string | null }) => {
      const { error } = await supabase.from("program_progress").upsert({ user_id: await uid(), day, feeling }, { onConflict: "user_id,day" }); if (error) throw error;
    }, onSuccess: () => { refresh(); setOpen(null); },
  });

  if (isLoading) return <AppShell><p className="py-20 text-center text-muted-foreground">Carregando…</p></AppShell>;
  const enr = data?.enrollment?.active ? data.enrollment : null;
  const done = new Set((data?.progress ?? []).map(p => p.day));

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-sm font-medium text-primary">Programa guiado</p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">30 dias de cuidado</h1>
        <p className="mt-2 text-lg text-muted-foreground">Uma atividade leve por dia, no seu ritmo. Sem cobranças.</p>
      </header>

      {!enr ? (
        <section className="card-soft space-y-5 p-6">
          <span className="grid size-14 place-items-center rounded-full bg-primary-soft text-primary"><Sparkles className="size-7" /></span>
          <div>
            <h2 className="font-display text-2xl font-semibold">Quer participar?</h2>
            <p className="mt-2 text-lg leading-relaxed text-muted-foreground">Um cuidado intensivo para aliviar a dor: todo dia um exercício que evolui aos poucos, uma orientação de alimentação, uma de sono e uma atividade interativa nova. De 8 a 25 minutos por dia.</p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">{programWeeks.map(w => <li key={w.week} className="rounded-2xl bg-secondary p-4"><p className="text-sm text-primary">Semana {w.week}</p><p className="font-medium">{w.title}</p></li>)}</ul>
          <label className="block">
            <span className="text-lg font-medium">Em que horário quer ser lembrada?</span>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-2 block h-14 w-full rounded-2xl border bg-card px-4 text-xl" />
          </label>
          <Button className="h-14 w-full rounded-2xl text-lg" disabled={join.isPending || !time} onClick={() => join.mutate()}>{join.isPending ? "Começando…" : "Quero participar"}</Button>
          <PushToggle />
        </section>
      ) : (
        <ActiveProgram enr={enr} done={done} onOpen={setOpen} onTime={t => update.mutate({ remind_time: t })} onRemind={r => update.mutate({ remind: r })} onLeave={() => { if (confirm("Deseja sair do programa? Seu progresso será guardado até você recomeçar.")) update.mutate({ active: false }); }} />
      )}

      {open && <DayDialog day={open} done={done.has(open.day)} saving={complete.isPending} onClose={() => setOpen(null)} onDone={f => complete.mutate({ day: open.day, feeling: f })} />}
    </AppShell>
  );
}

function ActiveProgram({ enr, done, onOpen, onTime, onRemind, onLeave }: { enr: { started_on: string; remind_time: string; remind: boolean }; done: Set<number>; onOpen: (d: ProgramDay) => void; onTime: (t: string) => void; onRemind: (r: boolean) => void; onLeave: () => void }) {
  const unlocked = unlockedDay(enr.started_on);
  const today = programDays[unlocked - 1]!;
  const pct = Math.round((done.size / 30) * 100);
  return (
    <div className="space-y-6">
      <section className="checkin-invitation rounded-3xl p-6 text-primary-foreground shadow-float">
        <p className="text-sm opacity-90">Dia {unlocked} de 30 · {done.size} concluídos</p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-primary-foreground/25"><div className="h-full rounded-full bg-primary-foreground transition-all duration-700" style={{ width: `${pct}%` }} /></div>
        <h2 className="mt-5 font-display text-2xl font-semibold">{today.title}</h2>
        <p className="mt-1 opacity-90">{today.kind} · {today.minutes} min</p>
        <Button variant="secondary" className="mt-4 h-14 w-full rounded-2xl text-lg sm:w-auto sm:px-8" onClick={() => onOpen(today)}>{done.has(today.day) ? "Ver atividade de hoje ✓" : "Fazer atividade de hoje"}</Button>
      </section>

      <section className="card-soft space-y-3 p-5">
        <p className="flex items-center gap-2 text-lg font-medium"><BellRing className="size-5 text-primary" /> Lembrete diário</p>
        <div className="flex flex-wrap items-center gap-3">
          <input type="time" defaultValue={enr.remind_time} onBlur={e => e.target.value && e.target.value !== enr.remind_time && onTime(e.target.value)} className="h-12 rounded-xl border bg-card px-3 text-lg" aria-label="Horário do lembrete" />
          <Button variant="outline" className="h-12 rounded-xl" onClick={() => onRemind(!enr.remind)}>{enr.remind ? "Pausar lembrete" : "Ligar lembrete"}</Button>
        </div>
        <PushToggle />
      </section>

      {programWeeks.map(w => (
        <section key={w.week}>
          <h3 className="font-display text-xl font-semibold">Semana {w.week} · {w.title}</h3>
          <p className="mb-3 text-muted-foreground">{w.text}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {programDays.filter(d => d.week === w.week).map(d => {
              const locked = d.day > unlocked; const ok = done.has(d.day);
              return (
                <button key={d.day} disabled={locked} onClick={() => onOpen(d)} className={cn("card-soft flex min-h-16 items-center gap-3 p-4 text-left transition", locked ? "opacity-50" : "pressable", d.day === unlocked && "ring-2 ring-primary")}>
                  <span className={cn("grid size-10 shrink-0 place-items-center rounded-full font-semibold", ok ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary")}>{ok ? <Check className="size-5" /> : locked ? <Lock className="size-4" /> : d.day}</span>
                  <span className="min-w-0 flex-1"><span className="block font-medium leading-snug">{d.title}</span><span className="text-sm text-muted-foreground">{d.kind} · {d.minutes} min</span></span>
                  {!locked && <ChevronRight className="size-5 text-muted-foreground" />}
                </button>
              );
            })}
          </div>
        </section>
      ))}
      <p className="text-sm text-muted-foreground">Um dia novo é liberado a cada dia. Perdeu algum? Tudo bem, você pode fazer os anteriores quando quiser.</p>
      <Button variant="ghost" className="text-muted-foreground" onClick={onLeave}>Sair do programa</Button>
    </div>
  );
}

function DayDialog({ day, done, saving, onClose, onDone }: { day: ProgramDay; done: boolean; saving: boolean; onClose: () => void; onDone: (f: string | null) => void }) {
  const [feeling, setFeeling] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 sm:items-center" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={day.title} onClick={e => e.stopPropagation()} className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-card p-6 sm:max-w-lg sm:rounded-3xl">
        <p className="text-sm font-medium text-primary">Dia {day.day} · {day.kind}</p>
        <h2 className="mt-1 font-display text-2xl font-semibold">{day.title}</h2>
        <p className="mt-1 flex items-center gap-1 text-muted-foreground"><Clock className="size-4" /> cerca de {day.minutes} minutos</p>
        <p className="mt-4 text-lg leading-relaxed">{day.intro}</p>
        <h3 className="mt-5 font-display text-lg font-semibold">🧘 Exercício · {day.exercise.title} ({day.exercise.minutes} min)</h3>
        <ol className="mt-3 space-y-3">{day.exercise.steps.map((s, i) => <li key={i} className="flex gap-3 text-lg"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft font-semibold text-primary">{i + 1}</span><span className="leading-relaxed">{s}</span></li>)}</ol>
        <div className="mt-4 grid gap-2">
          <p className="rounded-2xl bg-secondary p-4 text-lg leading-relaxed"><span className="font-semibold">🥗 Alimentação: </span>{day.food}</p>
          <p className="rounded-2xl bg-secondary p-4 text-lg leading-relaxed"><span className="font-semibold">🌙 Sono: </span>{day.sleep}</p>
        </div>
        <ProgramActivity key={day.day} activity={day.interactive} />
        <p className="mt-4 rounded-2xl bg-secondary p-4 leading-relaxed">💜 {day.tip}</p>
        {day.link && <Link to={day.link} className="mt-3 inline-flex items-center gap-1 font-medium text-primary">Abrir no app <ChevronRight className="size-4" /></Link>}
        {!done && <>
          <p className="mt-5 font-medium">Como foi? (opcional)</p>
          <div className="mt-2 flex flex-wrap gap-2">{feelings.map(f => <button key={f} onClick={() => setFeeling(feeling === f ? null : f)} className={cn("min-h-11 rounded-full border px-4", feeling === f && "border-primary bg-primary-soft text-primary")}>{f}</button>)}</div>
          {feeling === "Foi difícil" && <p className="mt-3 text-muted-foreground">Tudo bem. Amanhã pode ser mais leve. Se a dor piorou muito, descanse e procure orientação.</p>}
        </>}
        <div className="mt-6 grid gap-2">
          {!done && <Button className="h-14 rounded-2xl text-lg" disabled={saving} onClick={() => onDone(feeling)}>{saving ? "Salvando…" : "Concluí a atividade"}</Button>}
          {done && <p className="text-center font-medium text-primary">✓ Atividade concluída</p>}
          <Button variant="outline" className="h-12 rounded-2xl" onClick={onClose}>Voltar</Button>
        </div>
      </div>
    </div>
  );
}
