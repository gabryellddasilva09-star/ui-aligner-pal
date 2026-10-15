import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/vl/AppShell";
import { knowledgeIcons, knowledgeImage } from "@/components/vl/knowledge-visuals";
import { knowledgeTopics } from "@/data/knowledge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/conhecimento/$assunto")({
  loader: ({ params }) => {
    const topic = knowledgeTopics.find(t => t.id === params.assunto);
    if (!topic) throw notFound();
    return topic;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.title ?? "Assunto não encontrado"} — Biblioteca VivaLeve` },
    { name: "description", content: loaderData?.summary ?? "Conteúdo educativo da Biblioteca VivaLeve." },
    { property: "og:title", content: `${loaderData?.title ?? "Assunto não encontrado"} — VivaLeve` },
    { property: "og:description", content: loaderData?.summary ?? "Conteúdo educativo da Biblioteca VivaLeve." },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: KnowledgeArticle,
});

function KnowledgeArticle() {
  const topic = Route.useLoaderData();
  const navigate = useNavigate();
  const Icon = knowledgeIcons[topic.icon];
  const image = knowledgeImage(topic);
  return <AppShell backAction={{ label: "Voltar à Biblioteca", onClick: () => { void navigate({ to: "/biblioteca" }); } }}>
    <article className="mx-auto max-w-3xl [&_h1]:tracking-normal [&_h2]:tracking-normal">
      <header className="mb-6">
        <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary"><Icon className="size-7" /></span>
        <p className="mb-2 text-sm font-semibold text-primary">Biblioteca de conhecimento</p>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{topic.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{topic.summary}</p>
      </header>
      <img src={image.src} alt={image.alt} width={816} height={816} className="mb-7 max-h-80 w-full rounded-3xl object-cover" />
      <div className="divide-y">
        {topic.questions.map(question => <section key={question.q} className="py-6 first:pt-0">
          <h2 className="text-xl font-semibold leading-snug sm:text-2xl">{question.q}</h2>
          <p className="mt-3 text-lg leading-relaxed text-foreground/85">{question.a}</p>
        </section>)}
      </div>
      <p className="my-6 rounded-2xl bg-muted p-5 text-base leading-relaxed text-muted-foreground">Estas informações são educativas e não substituem a consulta. Converse com sua profissional de saúde antes de mudar seu tratamento.</p>
      <Button variant="outline" className="h-12 rounded-full px-5 text-base" onClick={() => { void navigate({ to: "/biblioteca" }); }}><ArrowLeft /> Voltar à Biblioteca</Button>
    </article>
  </AppShell>;
}