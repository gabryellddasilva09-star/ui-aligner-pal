import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight, BookOpen, ChevronRight, Search, Smartphone,
} from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { appHelps, knowledgeTopics, quickFacts, type KnowledgeTone } from "@/data/knowledge";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/lib-hero.jpg";
import { Button } from "@/components/ui/button";
import { knowledgeCategory, knowledgeFilters, knowledgeIcons as icons } from "@/components/vl/knowledge-visuals";

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

const tones: Record<KnowledgeTone, string> = {
  primary: "bg-primary-soft text-primary",
  good: "bg-good-soft text-good",
  warn: "bg-warn-soft text-warn",
  alert: "bg-alert-soft text-alert",
  blue: "bg-nutrition-blue-soft text-nutrition-blue",
};

function normalize(s: string) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }

// Palavras extras que ajudam a encontrar cada assunto, mesmo sem a palavra exata.
const topicKeywords: Record<string, string> = {
  "o-que-e": "fibromialgia doença condição crônica o que é significado",
  causas: "causa origem hereditariedade genética desencadeia",
  sintomas: "dor cansaço sono fadiga névoa mental fibro fog frio calor formigamento intestino enxaqueca",
  diagnostico: "diagnóstico exame médico teste tender points exames",
  tratamento: "tratamento remédio medicamento remédios terapia medicação tto",
  movimento: "exercício exercícios atividade física alongamento caminhada movimento musculação",
  alimentacao: "alimentação comida dieta anti-inflamatória comida nutrição glúten açúcar",
  sono: "sono dormir insônia descanso cansaço fadiga sono reparador noite",
  emocoes: "ansiedade depressão estresse emoção humor tristeza psicológico apoio humor",
  "dia-a-dia": "trabalho casa rotina dia a dia energia economia tarefas",
  alerta: "médico urgência emergência sinal alerta gravidade piora",
};

function LibraryPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");
  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return knowledgeTopics
      .filter(t => active === "all" || knowledgeCategory(t.id) === active)
      .filter(t => !q || normalize(
        t.title + " " + t.summary + " " + (topicKeywords[t.id] ?? "") + " " +
        t.questions.map(x => x.q + " " + x.a).join(" ")
      ).includes(q));
  }, [query, active]);

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

      <section className="mt-6 [&_h2]:tracking-normal">
        <h2 className="text-xl font-semibold">Escolha um assunto</h2>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar assuntos">
          {knowledgeFilters.map(filter => <Button key={filter.id} variant={active === filter.id ? "default" : "outline"}
            aria-pressed={active === filter.id} onClick={() => setActive(filter.id)}
            className="h-11 rounded-full px-4 text-base sm:px-6">{filter.label}</Button>)}
        </div>
        <div className="mt-5 space-y-3">
          {filtered.map(topic => { const Icon = icons[topic.icon]; return <Button key={topic.id} asChild variant="ghost"
            className="h-auto w-full justify-start whitespace-normal rounded-3xl border bg-card p-4 text-left shadow-sm hover:bg-secondary sm:p-5 [&_svg]:size-6">
            <Link to="/conhecimento/$assunto" params={{ assunto: topic.id }} className="gap-4 sm:gap-5">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary sm:size-20 [&_svg]:size-8 sm:[&_svg]:size-10"><Icon aria-hidden /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-semibold leading-snug sm:text-xl">{topic.title}</span>
                <span className="mt-1 block text-base font-normal leading-snug text-muted-foreground sm:text-lg">{topic.summary}</span>
              </span>
              <ChevronRight className="shrink-0 text-primary" aria-hidden />
            </Link>
          </Button>; })}
          {filtered.length === 0 && <div className="py-8 text-center">
            <p className="text-lg font-medium">Não encontramos esse assunto.</p>
            <p className="mt-2 text-muted-foreground">Tente outra palavra ou escolha outro filtro.</p>
            <Button onClick={() => { setQuery(""); setActive("all"); }} className="mt-5 h-12 rounded-full px-6 text-base">Ver todos os assuntos</Button>
          </div>}
        </div>
      </section>

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

