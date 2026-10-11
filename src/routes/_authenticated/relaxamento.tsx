import { supabase } from "@/integrations/supabase/client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Wind, Leaf, Brain, Moon, Flower2 } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { Button } from "@/components/ui/button";
import { RelaxationSession } from "@/components/vl/relaxation";
import { InlineBreathing } from "@/components/vl/inline-breathing";
import { LoopCarousel } from "@/components/vl/carousel";

import { relaxationActivities, type RelaxationActivity, type RelaxationRecord } from "@/data/relaxation";

export const Route = createFileRoute("/_authenticated/relaxamento")({
  head: () => ({ meta: [
    { title: "Respiração guiada — VivaLeve" },
    { name: "description", content: "Reserve uma pausa no seu ritmo com respiração guiada, meditação e relaxamento corporal." },
    { property: "og:title", content: "Respiração guiada — VivaLeve" },
    { property: "og:description", content: "Um momento para você desacelerar, respirar e cuidar de si, sem cobranças." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: RelaxationPage,
});

const activityIcons = [Wind, Brain, Leaf, Moon, Flower2];
const meditations = relaxationActivities.slice(1, 4);

function RelaxationPage() {
  const [session, setSession] = useState<{ activity: RelaxationActivity; duration: number } | null>(null);
  const [records, setRecords] = useState<RelaxationRecord[]>([]);
  const recordsRef = useRef<RelaxationRecord[]>([]);
  recordsRef.current = records;
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  function start(activity: RelaxationActivity) { setSession({ activity, duration: activity.seconds }); }
  function saveRecord(record: RelaxationRecord) {
    if (recordsRef.current.some(item => item.id === record.id)) return;
    const next = [record, ...recordsRef.current];
    recordsRef.current = next;
    setRecords(next);
    supabase.from("relaxation_sessions").insert({ name: record.name, seconds: record.seconds, created_at: record.date })
      .then(({ error }) => { if (error) setError("Não conseguimos guardar esta pausa na sua conta. Confira sua internet."); else setConfirmation("Seu tempo de relaxamento foi registrado na sua conta."); });
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
      <section><h2 className="text-2xl font-medium">Meditação guiada</h2><p className="mt-2 text-base text-muted-foreground">Uma pausa, um passo de cada vez.</p><div className="mt-5"><LoopCarousel items={meditations} label="Meditações guiadas" itemName="meditação" suspended={session !== null} renderItem={(activity, index) => { const Icon = activityIcons[index + 1] ?? Leaf; return <article className="card-soft flex h-full min-h-72 flex-col p-5 sm:p-6"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Icon className="size-6" /></span><h3 className="mt-4 text-xl font-medium">{activity.name}</h3><p className="mt-1 text-base text-muted-foreground">{activity.seconds / 60} minutos</p><p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">{activity.description}</p><Button variant="secondary" className="mt-5 h-12 w-full rounded-xl text-base" onClick={() => start(activity)}><PlayIcon />Começar</Button></article>; }} /></div></section>
      <section className="border-t pt-8"><h2 className="flex items-center gap-3 text-2xl font-medium"><Flower2 className="size-6 text-primary" />Relaxamento corporal</h2><p className="mt-3 text-base leading-relaxed text-muted-foreground">{relaxationActivities[4].description}</p><Button variant="outline" className="mt-5 h-14 w-full rounded-xl text-base" onClick={() => start(relaxationActivities[4])}>Começar relaxamento corporal</Button></section>
      </div>
    </div>
    {session && <RelaxationSession activity={session.activity} duration={session.duration} onRecord={saveRecord} onClose={() => setSession(null)} />}
  </AppShell>;
}

function PlayIcon() { return <span aria-hidden className="text-base">▷</span>; }
