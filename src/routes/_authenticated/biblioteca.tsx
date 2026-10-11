import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowRight, BookOpen, Brain, ChevronDown, Heart, Home, Info, Moon, PersonStanding,
  Pill, Search, Smartphone, Stethoscope, Utensils, type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { appHelps, knowledgeTopics, quickFacts, type KnowledgeTone, type KnowledgeTopic } from "@/data/knowledge";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/lib-hero.jpg";
import bodyImg from "@/assets/lib-body.jpg";
import careImg from "@/assets/lib-care.jpg";
import doctorImg from "@/assets/lib-doctor.jpg";

export const Route = createFileRoute("/_authenticated/biblioteca")({
  head: () => ({ meta: [
    { title: "Biblioteca de conhecimento — VivaLeve" },
    { name: "description", content: "Tudo sobre fibromialgia em linguagem simples: sintomas, causas, tratamento, sono, alimentação, emoções e como o VivaLeve ajuda." },
    { property: "og:title", content: "Biblioteca de conhecimento — VivaLeve" },
    { property: "og:description", content: "Tire suas dúvidas sobre fibromialgia com conteúdos claros e acolhedores." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: LibraryPage,
});

const icons: Record<KnowledgeTopic["icon"], LucideIcon> = {
  info: Info, brain: Brain, activity: Activity, stethoscope: Stethoscope, pill: Pill, move: PersonStanding,
  food: Utensils, moon: Moon, heart: Heart, home: Home, alert: AlertTriangle, app: Smartphone,
};
const tones: Record<KnowledgeTone, string> = {
  primary: "bg-primary-soft text-primary",
  good: "bg-good-soft text-good",
  warn: "bg-warn-soft text-warn",
  alert: "bg-alert-soft text-alert",
  blue: "bg-nutrition-blue-soft text-nutrition-blue",
};
const images = { body: bodyImg, care: careImg, doctor: doctorImg };

function normalize(s: string) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }

function LibraryPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");
  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return knowledgeTopics
      .filter(t => active === "all" || t.id === active)
      .map(t => ({ ...t, questions: q ? t.questions.filter(x => normalize(x.q + " " + x.a).includes(q)) : t.questions }))
      .filter(t => t.questions.length > 0);
  }, [query, active]);
  const total = filtered.reduce((n, t) => n + t.questions.length, 0);

  return <AppShell>
    <div className="mx-auto max-w-4xl">
      <header className="mb-6 hidden items-start gap-3 lg:flex">
        <span className="mt-1 grid size-11 place-items-center rounded-full bg-primary-soft text-primary"><BookOpen className="size-6" /></span>
        <div><h1 className="text-4xl font-medium">Biblioteca de conhecimento</h1><p className="mt-2 text-lg text-muted-foreground">Respostas claras para suas dúvidas sobre fibromialgia.</p></div>
      </header>

      <section className="card-soft relative overflow-hidden">
        <img src={heroImg} alt="Mulher lendo tranquila em uma sala iluminada" width={1536} height={768} className="h-56 w-full object-cover object-[30%_center] sm:h-72" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Entender é cuidar</p>
          <h2 className="mt-1 text-2xl font-medium leading-tight sm:text-3xl lg:hidden">Biblioteca de conhecimento</h2>
          <p className="mt-1 max-w-md text-base text-foreground/80 sm:text-lg">Tudo sobre fibromialgia, explicado com calma e sem termos difíceis.</p>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {quickFacts.map(f => <div key={f.value} className={cn("rounded-3xl p-4 text-center", tones[f.tone])}>
          <p className="text-xl font-semibold sm:text-2xl">{f.value}</p>
          <p className="mt-1 text-xs leading-snug text-foreground/75 sm:text-sm">{f.label}</p>
        </div>)}
      </div>

      <label className="relative mt-6 block">
        <span className="sr-only">Buscar uma dúvida</span>
        <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Qual é a sua dúvida? Ex.: sono, remédio, frio"
          className="h-14 w-full rounded-full border bg-card pl-14 pr-5 text-base shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary" />
      </label>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Escolha um assunto</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <TopicChip label="Todos os assuntos" icon={BookOpen} tone="primary" selected={active === "all"} onClick={() => setActive("all")} />
          {knowledgeTopics.map(t => <TopicChip key={t.id} label={t.title} icon={icons[t.icon]} tone={t.tone} selected={active === t.id}
            onClick={() => setActive(active === t.id ? "all" : t.id)} />)}
        </div>
      </section>

      <p className="mt-6 text-base text-muted-foreground" aria-live="polite">
        {total === 0 ? "" : `${total} ${total === 1 ? "resposta encontrada" : "respostas encontradas"}`}
      </p>

      <div className="mt-3 space-y-5">
        {filtered.length === 0 && <div className="card-soft p-8 text-center">
          <p className="text-lg font-medium">Não encontramos essa dúvida ainda.</p>
          <p className="mt-2 text-muted-foreground">Tente outra palavra ou leve essa pergunta para sua próxima consulta.</p>
          <button onClick={() => { setQuery(""); setActive("all"); }} className="mt-5 h-12 rounded-full bg-primary px-6 font-medium text-primary-foreground">Ver todos os assuntos</button>
        </div>}
        {filtered.map(t => <TopicSection key={t.id} topic={t} openFirst={!!query || active !== "all"} />)}
      </div>

      <section className="mt-10 rounded-[2rem] bg-gradient-to-br from-primary-soft to-card p-6 sm:p-8">
        <div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><Smartphone className="size-6" /></span>
          <div><h2 className="text-2xl font-medium">Como o VivaLeve te ajuda</h2><p className="text-muted-foreground">Cada parte do app cuida de um pedacinho de você.</p></div></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {appHelps.map(h => { const Icon = icons[h.icon]; return <Link key={h.title} to={h.to}
            className="pressable flex min-h-20 items-center gap-4 rounded-3xl bg-card p-4 shadow-sm">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary"><Icon className="size-6" /></span>
            <span className="min-w-0 flex-1"><span className="block text-lg font-semibold">{h.title}</span><span className="block text-sm leading-snug text-muted-foreground">{h.text}</span></span>
            <ArrowRight className="size-5 shrink-0 text-primary" />
          </Link>; })}
        </div>
      </section>

      <p className="mt-8 rounded-3xl bg-muted p-5 text-sm leading-relaxed text-muted-foreground">
        Estas informações são educativas e não substituem a consulta. Converse sempre com sua profissional de saúde antes de mudar seu tratamento.
      </p>
    </div>
  </AppShell>;
}

function TopicChip({ label, icon: Icon, tone, selected, onClick }: { label: string; icon: LucideIcon; tone: KnowledgeTone; selected: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-pressed={selected}
    className={cn("pressable flex min-h-16 items-center gap-3 rounded-3xl border bg-card p-3 text-left text-base font-medium transition",
      selected && "border-primary ring-2 ring-primary/30")}>
    <span className={cn("grid size-10 shrink-0 place-items-center rounded-2xl", tones[tone])}><Icon className="size-5" /></span>
    <span className="min-w-0 leading-snug">{label}</span>
  </button>;
}

function TopicSection({ topic, openFirst }: { topic: KnowledgeTopic; openFirst: boolean }) {
  const Icon = icons[topic.icon];
  return <section className="card-soft overflow-hidden">
    {topic.image && <img src={images[topic.image]} alt="" loading="lazy" width={816} height={816} className="h-40 w-full object-cover sm:h-52" />}
    <div className="p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", tones[topic.tone])}><Icon className="size-6" /></span>
        <div><h3 className="text-xl font-semibold">{topic.title}</h3><p className="text-muted-foreground">{topic.summary}</p></div>
      </div>
      <div className="mt-3 divide-y">
        {topic.questions.map((x, i) => <details key={x.q} open={openFirst && i === 0} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-medium [&::-webkit-details-marker]:hidden">
            {x.q}<ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
          </summary>
          <p className="pb-4 text-base leading-relaxed text-foreground/80">{x.a}</p>
        </details>)}
      </div>
    </div>
  </section>;
}
