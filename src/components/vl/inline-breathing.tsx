import { useEffect, useRef, useState } from "react";
import { Play, Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NatureSounds } from "@/components/vl/relaxation";
import { formatSessionTime, safetyMessage, type RelaxationRecord } from "@/data/relaxation";
import { cn } from "@/lib/utils";

export function InlineBreathing({ onRecord, suspended = false }: { onRecord: (record: RelaxationRecord) => void; suspended?: boolean }) {
  const [minutes, setMinutes] = useState(2);
  const [elapsed, setElapsed] = useState(0);
  const [state, setState] = useState<"idle" | "running" | "paused" | "finished">("idle");
  const measured = useRef(0);
  const saved = useRef(false);
  const date = useRef("");
  const callback = useRef(onRecord);
  callback.current = onRecord;
  const duration = minutes * 60;
  const running = state === "running" && !suspended;
  const inSession = state === "running" || state === "paused";
  function save() {
    const seconds = Math.floor(measured.current);
    if (seconds < 1 || saved.current) return;
    saved.current = true;
    callback.current({ id: crypto.randomUUID(), name: "Respiração guiada", date: date.current, seconds });
  }
  function start() {
    measured.current = 0; saved.current = false; date.current = new Date().toISOString();
    setElapsed(0); setState("running");
  }
  function end() { save(); setState("finished"); }
  useEffect(() => {
    if (!running) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now(); const delta = (now - previous) / 1000; previous = now;
      if (document.hidden) return;
      measured.current = Math.min(duration, measured.current + delta);
      setElapsed(Math.floor(measured.current));
    }, 100);
    return () => window.clearInterval(timer);
  }, [running, duration]);
  useEffect(() => { if (state === "running" && elapsed >= duration) end(); }, [elapsed, duration, state]);
  useEffect(() => { if (suspended) setState(current => current === "running" ? "paused" : current); }, [suspended]);
  useEffect(() => {
    const hide = () => { if (document.hidden) setState(current => current === "running" ? "paused" : current); };
    document.addEventListener("visibilitychange", hide);
    return () => { document.removeEventListener("visibilitychange", hide); save(); };
  }, []);
  const progress = Math.min(100, elapsed / duration * 100);
  const instruction = state === "idle" ? "No seu ritmo" : state === "finished" ? "Sua pausa foi encerrada" : !running ? "Respiração pausada" : elapsed % 10 < 4 ? "Inspire suavemente" : "Expire devagar";
  return <section aria-label="Prática de respiração" className="space-y-5">
    <div className="relative mx-auto aspect-[320/200] w-full max-w-md">
      <svg viewBox="0 0 320 200" className="h-full w-full overflow-visible" role="progressbar" aria-label="Progresso da respiração" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.floor(progress)}>
        <path d="M 22 176 Q 160 -130 298 176" pathLength="100" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" className="text-primary-soft" />
        <path d="M 22 176 Q 160 -130 298 176" pathLength="100" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeDasharray="100" strokeDashoffset={100 - progress} className="text-primary motion-safe:transition-[stroke-dashoffset] motion-safe:duration-300" />
      </svg>
      <div className="absolute inset-x-6 bottom-5 text-center">
        <p className="text-sm text-muted-foreground">Tempo restante</p>
        <p aria-label="Tempo restante" className="mt-1 font-display text-5xl font-medium tabular-nums text-primary">{formatSessionTime(duration - elapsed)}</p>
        <p className="mt-3 text-base font-medium" role="status">{instruction}</p>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2" aria-label="Duração da respiração">{[2, 5, 10].map(value => <Button key={value} variant="outline" disabled={inSession} aria-pressed={minutes === value} className={cn("h-14 rounded-xl text-base", minutes === value && "border-primary bg-primary-soft text-primary")} onClick={() => { setMinutes(value); setElapsed(0); setState("idle"); }}>{value} min</Button>)}</div>
    <div><h2 className="mb-3 text-lg font-medium">Sons para acompanhar</h2><NatureSounds running={running} /></div>
    {inSession ? <div className="grid grid-cols-2 gap-3"><Button className="h-14 rounded-xl text-base" onClick={() => setState(running ? "paused" : "running")}>{running ? <Pause /> : <Play />}{running ? "Pausar" : "Retomar"}</Button><Button variant="outline" className="h-14 rounded-xl text-base" onClick={end}><Square />Encerrar</Button></div> : <Button className="h-14 w-full rounded-xl text-base" onClick={start}><Play />Iniciar respiração</Button>}
    <p className="text-sm leading-relaxed text-muted-foreground">Sem prender o ar ou forçar a respiração. Escolha um ritmo confortável.</p>
    <p className="text-sm leading-relaxed text-muted-foreground">{safetyMessage}</p>
  </section>;
}