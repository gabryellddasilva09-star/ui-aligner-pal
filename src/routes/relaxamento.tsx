import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Wind, Waves, Leaf, Brain, Moon, Flower2, Heart, History, Clock, Bell, Smile, CloudRain, BatteryLow, HeartHandshake, Sparkles } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { Button } from "@/components/ui/button";
import { NatureSounds, RelaxationSession } from "@/components/vl/relaxation";
import { cn } from "@/lib/utils";
import { defaultReminder, emotionalOptions, formatSessionTime, historySchema, relaxationActivities, reminderSchema, safetyMessage, welcomingMessages, weeklySessions, type RelaxationActivity, type RelaxationRecord } from "@/data/relaxation";
import nature from "@/assets/qa-relax.jpg";

export const Route = createFileRoute("/relaxamento")({
  head: () => ({ meta: [
    { title: "Relaxamento e bem-estar — VivaLeve" },
    { name: "description", content: "Reserve uma pausa no seu ritmo com respiração guiada, meditação, relaxamento corporal e sons suaves de natureza." },
    { property: "og:title", content: "Relaxamento e bem-estar — VivaLeve" },
    { property: "og:description", content: "Um momento para você desacelerar, respirar e cuidar de si, sem cobranças." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: RelaxationPage,
});

const activityIcons = [Wind, Brain, Leaf, Moon, Flower2];
const moodIcons = [CloudRain, Wind, BatteryLow, Smile, HeartHandshake];
function RelaxationPage() {
  const [duration, setDuration] = useState(2);
  const [session, setSession] = useState<{ activity: RelaxationActivity; duration: number } | null>(null);
  const [emotion, setEmotion] = useState<number | null>(null);
  const [records, setRecords] = useState<RelaxationRecord[]>([]);
  const [reminder, setReminder] = useState(defaultReminder);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState(welcomingMessages[0]);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const selection = useRef<HTMLElement>(null);
  useEffect(() => {
    try {
      const history = localStorage.getItem("vl-relax-history");
      if (history) { const parsed = historySchema.safeParse(JSON.parse(history)); if (parsed.success) setRecords(parsed.data); else setError("Não foi possível ler o histórico salvo neste dispositivo."); }
      const preferences = localStorage.getItem("vl-relax-reminder");
      if (preferences) { const parsed = reminderSchema.safeParse(JSON.parse(preferences)); if (parsed.success) setReminder(parsed.data); }
    } catch { setError("O armazenamento deste dispositivo não está disponível. Suas pausas continuarão visíveis enquanto esta tela estiver aberta."); }
    setMessage(welcomingMessages[Math.floor(Math.random() * welcomingMessages.length)] ?? welcomingMessages[0]);
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("vl-relax-history", JSON.stringify(records)); }
    catch { setError("Não foi possível salvar o histórico neste dispositivo. O registro permanece nesta tela."); }
  }, [records, ready]);
  function start(activity: RelaxationActivity) { setSession({ activity, duration: activity.id === "breathing" ? duration * 60 : activity.seconds }); }
  function saveRecord(record: RelaxationRecord) {
    setRecords(previous => previous.some(item => item.id === record.id) ? previous : [record, ...previous]);
    setConfirmation("Seu tempo de relaxamento foi registrado.");
  }
  function updateReminder(next: typeof reminder) {
    setReminder(next);
    try { localStorage.setItem("vl-relax-reminder", JSON.stringify(next)); setConfirmation("Preferência salva neste dispositivo. Nenhuma notificação foi agendada."); }
    catch { setError("Não foi possível salvar a preferência de lembrete neste dispositivo."); }
  }
  const weekly = weeklySessions(records);
  const seconds = weekly.reduce((sum, record) => sum + record.seconds, 0);
  return <AppShell>
    <header className="mb-7">
      <Button asChild variant="ghost" className="mb-4 h-11 px-0 text-muted-foreground"><Link to="/"><ArrowLeft />Voltar ao início</Link></Button>
      <div className="flex items-start gap-3"><span className="mt-1 grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Wind className="size-6" /></span><div><h1 className="text-3xl font-medium leading-tight sm:text-4xl">Relaxamento e bem-estar</h1><p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">Um momento para você desacelerar, respirar e cuidar de si.</p></div></div>
    </header>
    <section className="relative mb-9 overflow-hidden rounded-3xl bg-primary-soft px-6 py-8 sm:px-8">
      <img src={nature} alt="Folhas e uma vela em um ambiente tranquilo" className="absolute inset-0 h-full w-full object-cover object-right" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" />
      <div className="relative max-w-md"><p className="mb-3 flex items-center gap-2 text-sm font-medium text-primary"><Leaf className="size-4" />SEU MOMENTO DE PAUSA</p><h2 className="text-3xl font-medium leading-snug">Você não precisa dar conta de tudo agora.</h2><p className="mt-4 text-base leading-relaxed text-muted-foreground">Reserve alguns minutos para cuidar de você. Vá no seu ritmo, sem cobranças.</p><Button className="mt-6 h-14 rounded-xl px-6 text-base" onClick={() => { selection.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }); selection.current?.focus({ preventScroll: true }); }}><Leaf />Começar a relaxar</Button></div>
    </section>
    {error && <p role="alert" className="mb-6 rounded-xl bg-alert-soft p-4 text-alert">{error}</p>}
    {confirmation && <p role="status" className="mb-6 text-sm text-good">{confirmation}</p>}
    <div className="grid gap-9 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="space-y-9">
        <section ref={selection} tabIndex={-1} className="scroll-mt-6 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <h2 className="flex items-center gap-3 text-2xl font-medium"><Wind className="size-6 text-primary" />Respiração guiada</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{relaxationActivities[0].description}</p>
          <div className="my-5 grid grid-cols-3 gap-2" aria-label="Duração da respiração">{[2, 5, 10].map(minutes => <Button variant="outline" key={minutes} aria-pressed={duration === minutes} className={cn("h-14 rounded-xl text-base", duration === minutes && "border-primary bg-primary-soft text-primary")} onClick={() => setDuration(minutes)}>{minutes} min</Button>)}</div>
          <Button className="h-14 w-full rounded-xl text-base" onClick={() => start(relaxationActivities[0])}><PlayIcon />Iniciar respiração</Button>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Sem prender o ar ou forçar a respiração. Escolha um ritmo confortável.</p>
        </section>
        <section><h2 className="text-2xl font-medium">Meditação guiada</h2><p className="mt-2 text-base text-muted-foreground">Uma pausa, um passo de cada vez.</p><div className="mt-5 space-y-3">{relaxationActivities.slice(1, 4).map((activity, index) => { const Icon = activityIcons[index + 1] ?? Leaf; return <article key={activity.id} className="card-soft flex items-center gap-3 p-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Icon className="size-5" /></span><div className="min-w-0 flex-1"><h3 className="text-lg font-medium">{activity.name}</h3><p className="mt-1 text-sm text-muted-foreground">{activity.seconds / 60} minutos</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{activity.description}</p><Button variant="secondary" className="mt-3 h-11 rounded-xl" onClick={() => start(activity)}><PlayIcon />Começar</Button></div></article>; })}</div></section>
        <section className="border-t pt-7"><h2 className="flex items-center gap-3 text-2xl font-medium"><Flower2 className="size-6 text-primary" />Relaxamento corporal</h2><p className="mt-3 text-base leading-relaxed text-muted-foreground">{relaxationActivities[4].description}</p><Button variant="outline" className="mt-5 h-14 w-full rounded-xl text-base" onClick={() => start(relaxationActivities[4])}>Começar relaxamento corporal</Button></section>
      </div>
      <div className="space-y-9">
        <section><h2 className="flex items-center gap-3 text-2xl font-medium"><HeadphonesIcon />Sons de natureza</h2><p className="mb-5 mt-3 text-base leading-relaxed text-muted-foreground">Sons leves para acompanhar sua pausa, no volume que você preferir.</p>{!session && <NatureSounds />}<p className="mt-3 text-xs leading-relaxed text-muted-foreground">Paisagens sonoras ilustrativas de chuva, água e mar. Sem narração.</p></section>
        <section className="border-t pt-7"><h2 className="text-2xl font-medium">Como você está se sentindo?</h2><p className="mt-2 text-base text-muted-foreground">Como você está neste momento?</p><div className="mt-5 space-y-2">{emotionalOptions.map((option, index) => { const Icon = moodIcons[index] ?? Heart; return <Button key={option.label} variant="outline" aria-pressed={emotion === index} className={cn("h-auto min-h-14 w-full justify-start gap-3 whitespace-normal rounded-xl px-4 py-3 text-left text-base", emotion === index && "border-primary bg-primary-soft text-primary")} onClick={() => setEmotion(index)}><Icon />{option.label}</Button>; })}</div>{emotion !== null && <div role="status" className="mt-4 rounded-2xl bg-primary-soft p-4"><p className="text-base leading-relaxed">{emotionalOptions[emotion]?.message}</p><Button variant="link" className="mt-2 h-auto whitespace-normal px-0 text-left" onClick={() => { const activity = relaxationActivities.find(item => item.id === emotionalOptions[emotion]?.activity); if (activity) start(activity); }}>Ver uma opção de pausa <ArrowLeft className="rotate-180" /></Button></div>}</section>
        <div className="flex items-start gap-3 border-t pt-6"><Heart className="mt-1 size-5 shrink-0 text-primary" /><p className="font-display text-xl leading-relaxed">{message}</p></div>
      </div>
    </div>
    <section className="mt-10 border-t pt-8"><h2 className="flex items-center gap-3 text-2xl font-medium"><History className="size-6 text-primary" />Meu histórico</h2><div className="my-5 flex flex-wrap gap-6"><div><p className="font-display text-3xl text-primary">{weekly.length}</p><p className="text-sm text-muted-foreground">sessões nesta semana</p></div><div><p className="font-display text-3xl text-primary">{seconds > 0 ? (seconds / 60).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) : "0"}</p><p className="text-sm text-muted-foreground">minutos de pausa</p></div></div>{!ready ? <p role="status">Carregando seu histórico…</p> : records.length === 0 ? <p className="rounded-2xl bg-secondary p-5 text-base leading-relaxed text-muted-foreground">Seu histórico começa com a sua primeira pausa. As sessões realizadas aparecerão aqui, sem metas ou cobranças.</p> : <ul className="divide-y">{records.slice(0, 10).map(record => <li key={record.id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-medium">{record.name}</p><p className="mt-1 text-sm text-muted-foreground">{new Date(record.date).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p></div><span className="flex shrink-0 items-center gap-2 text-sm text-primary"><Clock className="size-4" />{formatSessionTime(record.seconds)}</span></li>)}</ul>}</section>
    <section className="mt-9 border-t pt-7"><h2 className="flex items-center gap-3 text-2xl font-medium"><Bell className="size-6 text-primary" />Minha pausa diária</h2><p className="mt-3 text-base leading-relaxed text-muted-foreground">Você pode guardar um horário para sua pausa. As notificações ainda não estão disponíveis; nenhum aviso será enviado.</p><label className="mt-4 flex min-h-14 items-center gap-3 text-base"><input type="checkbox" checked={reminder.enabled} onChange={event => updateReminder({ ...reminder, enabled: event.target.checked })} className="size-5 accent-primary" />Guardar preferência de lembrete</label>{reminder.enabled && <div className="mt-4 space-y-4"><label className="flex items-center gap-4 text-base">Horário<input aria-label="Horário da pausa" type="time" value={reminder.time} onChange={event => { if (event.target.value) updateReminder({ ...reminder, time: event.target.value }); }} className="min-h-12 rounded-xl border bg-card px-4 text-base" /></label><div className="flex flex-wrap gap-2" aria-label="Dias da pausa">{["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day, index) => <Button variant="outline" key={day} aria-pressed={reminder.days.includes(index)} className={cn("h-12 min-w-12 rounded-xl", reminder.days.includes(index) && "border-primary bg-primary-soft text-primary")} onClick={() => updateReminder({ ...reminder, days: reminder.days.includes(index) ? reminder.days.filter(value => value !== index) : [...reminder.days, index] })}>{day}</Button>)}</div></div>}</section>
    <footer className="mt-9 border-t pt-6 text-sm leading-relaxed text-muted-foreground"><p className="mb-2 flex items-center gap-2 font-medium text-foreground"><Sparkles className="size-4 text-primary" />Cuidado com você, sem cobranças</p><p>Esta área tem finalidade de bem-estar e não substitui acompanhamento médico ou psicológico. {safetyMessage}</p></footer>
    {session && <RelaxationSession activity={session.activity} duration={session.duration} onRecord={saveRecord} onClose={() => setSession(null)} />}
  </AppShell>;
}

function PlayIcon() { return <span aria-hidden className="text-base">▷</span>; }
function HeadphonesIcon() { return <Waves className="size-6 text-primary" />; }