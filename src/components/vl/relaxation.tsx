import { useEffect, useRef, useState } from "react";
import { Bird, Music2, Sparkles, Play, Pause, Volume2, VolumeX, SkipForward, Check, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatSessionTime, safetyMessage, type RelaxationActivity, type RelaxationRecord } from "@/data/relaxation";
import meditacao from "@/assets/relax-meditacao.mp3.asset.json";
import passaros from "@/assets/relax-passaros.mp3.asset.json";
import musica from "@/assets/relax-musica.mp3.asset.json";

const soundscapes = [{ id: "meditacao", name: "Som de meditação", icon: Sparkles, url: meditacao.url }, { id: "passaros", name: "Pássaros cantando", icon: Bird, url: passaros.url }, { id: "musica", name: "Música relaxante", icon: Music2, url: musica.url }] as const;
export function NatureSounds({ paused = false, running }: { paused?: boolean; running?: boolean }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [selected, setSelected] = useState("meditacao");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [error, setError] = useState("");
  const sound = soundscapes.find(item => item.id === selected) ?? soundscapes[0];
  useEffect(() => { if (audio.current) audio.current.volume = volume / 100; }, [volume]);
  useEffect(() => { if (paused) { audio.current?.pause(); setPlaying(false); } }, [paused]);
  useEffect(() => {
    if (running === undefined) return;
    if (running && !paused) void play();
    else { audio.current?.pause(); setPlaying(false); }
  }, [running, paused, selected]);
  useEffect(() => () => { audio.current?.pause(); }, []);
  async function play() {
    if (!audio.current) return;
    try { await audio.current.play(); setPlaying(true); setError(""); }
    catch { setPlaying(false); setError("Não foi possível reproduzir o som. Toque em ouvir para tentar novamente."); }
  }
  return <div className="space-y-4">
    <div className="grid grid-cols-3 gap-2">{soundscapes.map(({ id, name, icon: Icon }) => <Button key={id} variant="outline" aria-pressed={selected === id} className={cn("h-auto min-h-24 flex-col whitespace-normal rounded-2xl px-2 text-sm", selected === id && "border-primary bg-primary-soft text-primary")} onClick={() => { audio.current?.pause(); setPlaying(false); setSelected(id); setError(""); }}><Icon className="size-5" />{name}</Button>)}</div>
    <audio ref={audio} src={sound.url} loop preload="none" onError={() => { setPlaying(false); setError("O som não carregou. Verifique sua conexão e tente novamente."); }} />
    <div className="flex items-center gap-4">{running === undefined && <Button variant="secondary" className="h-12 shrink-0 rounded-xl" disabled={paused} onClick={() => { if (playing) { audio.current?.pause(); setPlaying(false); } else void play(); }}>{playing ? <Pause /> : <Play />}{playing ? "Pausar som" : "Ouvir som"}</Button>}<label className="flex min-w-0 flex-1 items-center gap-2">{volume === 0 ? <VolumeX className="size-5 shrink-0 text-primary" /> : <Volume2 className="size-5 shrink-0 text-primary" />}<span className="sr-only">Volume</span><input aria-label="Volume" type="range" min="0" max="100" value={volume} onChange={event => setVolume(Number(event.target.value))} className="w-full accent-primary" /></label></div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
  </div>;
}

export function RelaxationSession({ activity, duration, onClose, onRecord }: { activity: RelaxationActivity; duration: number; onClose: () => void; onRecord: (record: RelaxationRecord) => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [motion, setMotion] = useState(true);
  const measured = useRef(0);
  const saved = useRef(false);
  const recordCallback = useRef(onRecord); recordCallback.current = onRecord;
  const active = useRef(false);
  const startedAt = useRef(new Date().toISOString());
  const completed = duration > 0 && elapsed >= duration;
  function save() {
    const seconds = Math.floor(measured.current);
    if (!saved.current && seconds >= 1) { saved.current = true; recordCallback.current({ id: crypto.randomUUID(), name: activity.name, date: startedAt.current, seconds }); }
  }
  useEffect(() => { setMotion(!window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  useEffect(() => {
    active.current = !paused && !finished && !completed;
    if (!active.current) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now(); const delta = (now - previous) / 1000; previous = now;
      if (document.hidden) return;
      measured.current = duration > 0 ? Math.min(duration, measured.current + delta) : measured.current + delta;
      setElapsed(Math.floor(measured.current));
    }, 200);
    return () => window.clearInterval(timer);
  }, [paused, finished, completed, duration]);
  useEffect(() => {
    const hide = () => { if (document.hidden) setPaused(true); };
    document.addEventListener("visibilitychange", hide);
    return () => { document.removeEventListener("visibilitychange", hide); save(); };
  }, []);
  useEffect(() => { if (completed) { save(); setFinished(true); } }, [completed]);
  const currentStep = activity.id === "body" ? step : Math.min(activity.steps.length - 1, Math.floor((elapsed / Math.max(duration, 1)) * activity.steps.length));
  const breathingText = elapsed % 10 < 4 ? "Inspire suavemente" : "Expire devagar";
  function end() { save(); setFinished(true); }
  return <Dialog open onOpenChange={open => { if (!open) { save(); onClose(); } }}><DialogContent className="relax-session max-h-[92dvh] overflow-y-auto rounded-3xl sm:max-w-xl">
    <DialogTitle className="pr-7 text-center text-2xl">{activity.name}</DialogTitle>
    <DialogDescription className="text-center">{finished ? "Obrigado por reservar este momento para você." : "Vá no seu ritmo. Você pode parar quando quiser."}</DialogDescription>
    {finished ? <div className="space-y-5 py-8 text-center"><Check className="mx-auto size-12 text-good" /><h2 className="text-2xl">Sua pausa foi encerrada</h2><p>{formatSessionTime(elapsed)} dedicados a você.</p><p className="text-sm text-muted-foreground">{saved.current ? "Sessão registrada no seu histórico neste dispositivo." : "Nenhuma duração foi registrada nesta sessão."}</p><Button className="h-14 w-full rounded-xl text-base" onClick={onClose}>Voltar às atividades</Button></div> : <>
      <div className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-2xl bg-primary-soft">
        {activity.id === "breathing" ? <div aria-hidden className={cn("relax-breath-circle flex size-40 items-center justify-center rounded-full border-2 border-primary/30 bg-card text-primary", motion && "relax-breath-moving", paused && "relax-breath-paused")}><Wind className="size-10" /></div> : <span className="font-display text-6xl text-primary">{currentStep + 1}<span className="text-2xl text-muted-foreground"> / {activity.steps.length}</span></span>}
      </div>
      <div className="min-h-28 text-center"><p className="text-2xl font-medium leading-relaxed">{paused ? "Sua pausa está pausada" : activity.id === "breathing" ? breathingText : activity.steps[currentStep]}</p>{activity.id === "breathing" && <p className="mt-2 text-muted-foreground">Respire no seu ritmo, sem prender o ar.</p>}</div>
      <p className="text-center font-display text-3xl tabular-nums" aria-label={duration > 0 ? "Tempo restante" : "Tempo dedicado"}>{formatSessionTime(duration > 0 ? Math.max(0, duration - elapsed) : elapsed)}</p>
      {activity.id === "breathing" && <label className="flex min-h-12 items-center justify-center gap-3 text-base"><input type="checkbox" checked={!motion} onChange={event => setMotion(!event.target.checked)} className="size-5 accent-primary" />Somente instruções, sem animação</label>}
      {activity.id === "body" && <div className="flex gap-3"><Button variant="outline" className="h-12 flex-1" onClick={() => { if (step < activity.steps.length - 1) setStep(step + 1); else end(); }}><SkipForward />Pular etapa</Button><Button className="h-12 flex-1" onClick={() => { if (step < activity.steps.length - 1) setStep(step + 1); else end(); }}>{step === activity.steps.length - 1 ? "Concluir" : "Próximo"}</Button></div>}
      <div className="flex gap-3"><Button className="h-14 flex-1 rounded-xl text-base" onClick={() => setPaused(!paused)}>{paused ? <Play /> : <Pause />}{paused ? "Retomar" : "Pausar"}</Button><Button variant="outline" className="h-14 flex-1 rounded-xl text-base" onClick={end}>Encerrar sessão</Button></div>
      <details className="rounded-xl border p-4"><summary className="cursor-pointer text-sm font-medium text-primary">Sons para acompanhar · opcionais</summary><div className="mt-4"><NatureSounds paused={paused} /></div></details>
      <p className="text-sm leading-relaxed text-muted-foreground">{safetyMessage} {activity.id === "body" && "Se uma etapa aumentar o desconforto, interrompa essa etapa. Não force os movimentos."}</p>
    </>}
  </DialogContent></Dialog>;
}