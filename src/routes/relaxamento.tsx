import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Wind, Leaf, Brain, Moon, Flower2 } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { Button } from "@/components/ui/button";
import { RelaxationSession } from "@/components/vl/relaxation";
import { InlineBreathing } from "@/components/vl/inline-breathing";
import { historySchema, relaxationActivities, type RelaxationActivity, type RelaxationRecord } from "@/data/relaxation";

export const Route = createFileRoute("/relaxamento")({
  head: () => ({ meta: [
    { title: "Respiração guiada — VivaLeve" },
    { name: "description", content: "Reserve uma pausa no seu ritmo com respiração guiada, meditação e relaxamento corporal." },
    { property: "og:title", content: "Respiração guiada — VivaLeve" },
    { property: "og:description", content: "Um momento para você desacelerar, respirar e cuidar de si, sem cobranças." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: RelaxationPage,
});

const activityIcons = [Wind, Brain, Leaf, Moon, Flower2];
function RelaxationPage() {
  const [session, setSession] = useState<{ activity: RelaxationActivity; duration: number } | null>(null);
  const [records, setRecords] = useState<RelaxationRecord[]>([]);
  const recordsRef = useRef<RelaxationRecord[]>([]);
  recordsRef.current = records;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  useEffect(() => {
    try {
      const history = localStorage.getItem("vl-relax-history");
      if (history) { const parsed = historySchema.safeParse(JSON.parse(history)); if (parsed.success) setRecords(parsed.data); else setError("Não foi possível ler o histórico salvo neste dispositivo."); }
    } catch { setError("O armazenamento deste dispositivo não está disponível. Suas pausas continuarão visíveis enquanto esta tela estiver aberta."); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("vl-relax-history", JSON.stringify(records)); }
    catch { setError("Não foi possível salvar o histórico neste dispositivo. O registro permanece nesta tela."); }
  }, [records, ready]);
  function start(activity: RelaxationActivity) { setSession({ activity, duration: activity.seconds }); }
  function saveRecord(record: RelaxationRecord) {
    if (recordsRef.current.some(item => item.id === record.id)) return;
    const next = [record, ...recordsRef.current];
    recordsRef.current = next;
    try { localStorage.setItem("vl-relax-history", JSON.stringify(next)); }
    catch { setError("Não foi possível salvar o histórico neste dispositivo. O registro permanece nesta tela."); }
    setRecords(next);
    setConfirmation("Seu tempo de relaxamento foi registrado.");
  }
  return <AppShell>
    <div className="mx-auto max-w-3xl">
    <header className="mb-7">
      <Button asChild variant="ghost" className="mb-4 h-11 px-0 text-muted-foreground"><Link to="/"><ArrowLeft />Voltar ao início</Link></Button>
      <div className="flex items-start gap-3"><span className="mt-1 grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Wind className="size-6" /></span><div><h1 className="text-3xl font-medium leading-tight sm:text-4xl">Respiração guiada</h1><p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">Um momento para você desacelerar, respirar e cuidar de si.</p></div></div>
    </header>
    {error && <p role="alert" className="mb-6 rounded-xl bg-alert-soft p-4 text-alert">{error}</p>}
    {confirmation && <p role="status" className="mb-6 text-sm text-good">{confirmation}</p>}
    <div className="max-w-3xl space-y-10">
      <InlineBreathing onRecord={saveRecord} suspended={session !== null} />
      <section><h2 className="text-2xl font-medium">Meditação guiada</h2><p className="mt-2 text-base text-muted-foreground">Uma pausa, um passo de cada vez.</p><div className="mt-5 space-y-3">{relaxationActivities.slice(1, 4).map((activity, index) => { const Icon = activityIcons[index + 1] ?? Leaf; return <article key={activity.id} className="card-soft flex items-center gap-3 p-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Icon className="size-5" /></span><div className="min-w-0 flex-1"><h3 className="text-lg font-medium">{activity.name}</h3><p className="mt-1 text-sm text-muted-foreground">{activity.seconds / 60} minutos</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{activity.description}</p><Button variant="secondary" className="mt-3 h-11 rounded-xl" onClick={() => start(activity)}><PlayIcon />Começar</Button></div></article>; })}</div></section>
      <section className="border-t pt-8"><h2 className="flex items-center gap-3 text-2xl font-medium"><Flower2 className="size-6 text-primary" />Relaxamento corporal</h2><p className="mt-3 text-base leading-relaxed text-muted-foreground">{relaxationActivities[4].description}</p><Button variant="outline" className="mt-5 h-14 w-full rounded-xl text-base" onClick={() => start(relaxationActivities[4])}>Começar relaxamento corporal</Button></section>
      </div>
    </div>
    {session && <RelaxationSession activity={session.activity} duration={session.duration} onRecord={saveRecord} onClose={() => setSession(null)} />}
  </AppShell>;
}

function PlayIcon() { return <span aria-hidden className="text-base">▷</span>; }
