import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Interactive } from "@/data/program";
import { cn } from "@/lib/utils";

export function ProgramActivity({ activity }: { activity: Interactive }) {
  return (
    <section className="mt-5 rounded-3xl border-2 border-primary/30 bg-primary-soft/50 p-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Atividade interativa de hoje</p>
      <h3 className="mt-1 font-display text-xl font-semibold">{activity.title}</h3>
      <p className="mt-1 text-lg leading-relaxed text-muted-foreground">{activity.prompt}</p>
      <div className="mt-4">
        {activity.type === "pain" && <PainCompare />}
        {activity.type === "timer" && <Timer seconds={activity.seconds} cues={activity.cues} />}
        {activity.type === "checklist" && <Checklist items={activity.items} />}
        {activity.type === "choice" && <Choice options={activity.options} />}
        {activity.type === "write" && <textarea rows={3} placeholder={activity.placeholder} className="w-full rounded-2xl border bg-card p-4 text-lg" aria-label={activity.title} />}
      </div>
    </section>
  );
}

function Range({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="flex justify-between text-lg font-medium"><span>{label}</span><span className="text-primary">{value}/10</span></span>
      <input type="range" min={0} max={10} value={value} onChange={e => onChange(+e.target.value)} className="mt-2 h-3 w-full accent-primary" />
    </label>
  );
}

function PainCompare() {
  const [before, setBefore] = useState(5);
  const [after, setAfter] = useState<number | null>(null);
  const diff = after === null ? null : before - after;
  return (
    <div className="space-y-4">
      <Range label="Antes" value={before} onChange={setBefore} />
      {after === null ? <Button variant="outline" className="h-12 w-full rounded-2xl" onClick={() => setAfter(before)}>Já fiz a atividade, marcar depois</Button>
        : <Range label="Depois" value={after} onChange={setAfter} />}
      {diff !== null && <p className="rounded-2xl bg-card p-4 text-lg">{diff > 0 ? `Sua dor diminuiu ${diff} ${diff === 1 ? "ponto" : "pontos"}. Isso funciona para você! 💜` : diff === 0 ? "A dor ficou igual. Tudo bem, o efeito pode aparecer com a repetição." : "A dor aumentou. Descanse e use seu kit de alívio. Se continuar, procure orientação."}</p>}
    </div>
  );
}

function Timer({ seconds, cues }: { seconds: number; cues: string[] }) {
  const [left, setLeft] = useState(seconds);
  const [run, setRun] = useState(false);
  useEffect(() => {
    if (!run || left <= 0) return;
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [run, left]);
  const elapsed = seconds - left;
  const cue = left === 0 ? "Muito bem. Terminou! 💜" : cues[Math.floor(elapsed / 6) % cues.length];
  return (
    <div className="text-center">
      <p className="min-h-16 font-display text-2xl font-semibold text-primary" aria-live="polite">{run || elapsed ? cue : "Toque em começar"}</p>
      <p className="mt-2 text-3xl tabular-nums">{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</p>
      <div className="mt-4 flex justify-center gap-2">
        <Button className="h-12 rounded-2xl px-6" disabled={left === 0} onClick={() => setRun(!run)}>{run ? <><Pause className="size-5" /> Pausar</> : <><Play className="size-5" /> {elapsed ? "Continuar" : "Começar"}</>}</Button>
        {elapsed > 0 && <Button variant="outline" className="h-12 rounded-2xl" aria-label="Recomeçar" onClick={() => { setRun(false); setLeft(seconds); }}><RotateCcw className="size-5" /></Button>}
      </div>
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  const [on, setOn] = useState<Set<number>>(new Set());
  return (
    <div className="space-y-2">
      {items.map((it, i) => {
        const c = on.has(i);
        return <button key={it} aria-pressed={c} onClick={() => setOn(s => { const n = new Set(s); c ? n.delete(i) : n.add(i); return n; })} className={cn("flex min-h-14 w-full items-center gap-3 rounded-2xl border bg-card px-4 text-left text-lg", c && "border-primary text-primary")}>
          <span className={cn("grid size-7 shrink-0 place-items-center rounded-full border-2", c ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40")}>{c && <Check className="size-4" />}</span>{it}
        </button>;
      })}
      <p className="pt-1 text-muted-foreground">{on.size} de {items.length} marcados</p>
    </div>
  );
}

function Choice({ options }: { options: { label: string; reply: string }[] }) {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {options.map((o, i) => <button key={o.label} aria-pressed={sel === i} onClick={() => setSel(i)} className={cn("min-h-14 w-full rounded-2xl border bg-card px-4 text-left text-lg", sel === i && "border-primary bg-primary-soft text-primary")}>{o.label}</button>)}
      {sel !== null && <p className="rounded-2xl bg-card p-4 text-lg leading-relaxed">💜 {options[sel]!.reply}</p>}
    </div>
  );
}
