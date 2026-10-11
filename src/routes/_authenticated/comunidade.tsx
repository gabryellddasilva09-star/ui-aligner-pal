import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { HeartHandshake, Phone, Send, Users, Home, Briefcase, ShieldCheck, Clock3 } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { SectionHeader } from "@/components/vl/primitives";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/comunidade")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Acolhimento e comunidade — VivaLeve" },
      { name: "description", content: "Um espaço de acolhimento: mural entre pacientes, apoio psicológico e material para família e trabalho." },
      { property: "og:title", content: "Acolhimento e comunidade — VivaLeve" },
      { property: "og:description", content: "Você não está sozinha: mural, apoio psicológico e material para a família." },
    ],
  }),
  component: Comunidade,
});

const msgSchema = z.string().trim().min(3, "Escreva pelo menos algumas palavras.").max(1000, "Máximo de 1000 letras.");

function Comunidade() {
  const qc = useQueryClient();
  const wall = useQuery({
    queryKey: ["community"],
    queryFn: async () => {
      const { data, error } = await supabase.from("community_messages").select("id, author_name, body, status, created_at, user_id").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
  });
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const send = useMutation({
    mutationFn: async (body: string) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Sem sessão");
      const meta = u.user.user_metadata as Record<string, unknown>;
      const name = (typeof meta["name"] === "string" ? meta["name"] : "").split(" ")[0] || "Paciente";
      const { error } = await supabase.from("community_messages").insert({ user_id: u.user.id, author_name: name, body });
      if (error) throw error;
    },
    onSuccess: () => { setText(""); setSent(true); qc.invalidateQueries({ queryKey: ["community"] }); },
  });
  function submit() {
    const r = msgSchema.safeParse(text);
    if (!r.success) { setErr(r.error.issues[0]?.message ?? "Confira o texto."); return; }
    setErr(""); setSent(false); send.mutate(r.data);
  }
  const approved = wall.data?.filter(m => m.status === "approved") ?? [];
  const mod = useQuery({ queryKey: ["is-moderator"], queryFn: async () => { const { data } = await supabase.rpc("is_moderator"); return !!data; } });
  const pending = mod.data ? (wall.data?.filter(m => m.status === "pending") ?? []) : [];
  const review = useMutation({
    mutationFn: async ({ id, ok }: { id: string; ok: boolean }) => {
      const { error } = ok
        ? await supabase.from("community_messages").update({ status: "approved" }).eq("id", id)
        : await supabase.from("community_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["community"] }),
  });

  return (
    <AppShell>
      <header className="space-y-2">
        <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary"><HeartHandshake className="size-6" /></span>
        <h1 className="text-3xl font-medium">Acolhimento e comunidade</h1>
        <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">Você não está sozinha. Aqui você encontra outras pessoas que vivem com fibromialgia, apoio emocional e material para quem está ao seu lado.</p>
      </header>

      {/* Mural */}
      <section className="mt-8 space-y-4">
        <SectionHeader title="Mural da comunidade" subtitle="Mensagens de carinho e experiências entre pacientes. Tudo passa por uma revisão antes de aparecer." />
        {mod.data && (
          <div className="rounded-3xl border border-primary/30 bg-primary-soft p-5 space-y-3">
            <p className="text-lg font-medium">Aguardando sua aprovação ({pending.length})</p>
            {pending.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma mensagem para revisar agora.</p>}
            {pending.map(m => (
              <div key={m.id} className="rounded-2xl bg-card p-4">
                <p className="text-base leading-relaxed">“{m.body}”</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.author_name} · {new Date(m.created_at).toLocaleDateString("pt-BR")}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button className="h-12 rounded-xl" disabled={review.isPending} onClick={() => review.mutate({ id: m.id, ok: true })}>Aprovar</Button>
                  <Button variant="outline" className="h-12 rounded-xl" disabled={review.isPending} onClick={() => review.mutate({ id: m.id, ok: false })}>Recusar</Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="card-soft space-y-3 p-5">
          <label htmlFor="mural" className="text-lg font-medium">Deixe sua mensagem</label>
          <textarea id="mural" value={text} onChange={e => setText(e.target.value)} rows={3} maxLength={1000}
            placeholder="Escreva uma palavra de apoio ou conte como foi seu dia..."
            className="w-full rounded-2xl border border-border bg-background p-4 text-base outline-none focus:border-primary" />
          {err && <p className="text-sm text-destructive">{err}</p>}
          {sent && <p className="flex items-center gap-2 text-sm text-primary"><Clock3 className="size-4" />Mensagem enviada! Ela aparecerá no mural depois da revisão.</p>}
          <Button size="lg" className="w-full gap-2 rounded-full text-base" disabled={send.isPending} onClick={submit}>
            <Send className="size-5" />{send.isPending ? "Enviando..." : "Enviar mensagem"}
          </Button>
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 shrink-0" />Espaço de apoio, sem julgamentos. Mensagens ofensivas não são publicadas.</p>
        </div>
        {wall.isLoading && <p className="text-muted-foreground">Carregando mensagens...</p>}
        {wall.isError && <p className="text-destructive">Não foi possível carregar o mural agora. Tente de novo mais tarde.</p>}
        {!wall.isLoading && approved.length === 0 && (
          <div className="card-soft p-5 text-center text-muted-foreground">O mural ainda está começando. Sua mensagem pode ser a primeira a acolher alguém.</div>
        )}
        <ul className="space-y-3">
          {approved.map(m => (
            <li key={m.id} className="card-soft p-5">
              <p className="text-base leading-relaxed">“{m.body}”</p>
              <p className="mt-2 text-sm font-medium text-primary">{m.author_name} · {new Date(m.created_at).toLocaleDateString("pt-BR")}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Apoio psicológico */}
      <section className="mt-10 space-y-4">
        <SectionHeader title="Apoio emocional" subtitle="Ansiedade e tristeza são comuns em quem convive com dor. Pedir ajuda é um ato de cuidado." />
        <div className="grid gap-3 sm:grid-cols-3">
          <a href="tel:188" className="card-soft block p-5 transition hover:shadow-md">
            <Phone className="size-6 text-primary" />
            <p className="mt-2 text-lg font-medium">CVV — 188</p>
            <p className="text-sm text-muted-foreground">Centro de Valorização da Vida. Escuta gratuita, 24 horas, todos os dias. Toque para ligar.</p>
          </a>
          <div className="card-soft p-5">
            <Users className="size-6 text-primary" />
            <p className="mt-2 text-lg font-medium">CAPS</p>
            <p className="text-sm text-muted-foreground">Centros de Atenção Psicossocial oferecem acompanhamento gratuito pelo SUS. Procure a unidade mais perto de você.</p>
          </div>
          <a href="tel:136" className="card-soft block p-5 transition hover:shadow-md">
            <Phone className="size-6 text-primary" />
            <p className="mt-2 text-lg font-medium">SUS — 136</p>
            <p className="text-sm text-muted-foreground">Disque Saúde: informações sobre serviços públicos de saúde, inclusive psicólogo. Toque para ligar.</p>
          </a>
        </div>
        <p className="rounded-2xl bg-primary-soft p-4 text-sm leading-relaxed">Se você estiver passando por um momento muito difícil, não espere: ligue 188 agora. Você importa.</p>
      </section>

      {/* Família e trabalho */}
      <section className="mt-10 space-y-4">
        <SectionHeader title="Para a família e o trabalho" subtitle="Muita gente ouve “mas você não parece doente”. Este material ajuda a explicar." />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="card-soft p-5">
            <Home className="size-6 text-primary" />
            <p className="mt-2 text-lg font-medium">Para a sua família</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>A fibromialgia é uma doença real, reconhecida pela medicina. A dor não é “frescura”.</li>
              <li>A dor varia: um dia bom não significa cura, e um dia ruim não é preguiça.</li>
              <li>Cansaço e “névoa mental” (esquecimentos, dificuldade de focar) fazem parte da doença.</li>
              <li>O melhor apoio é acreditar, ter paciência e dividir as tarefas nos dias difíceis.</li>
            </ul>
          </div>
          <div className="card-soft p-5">
            <Briefcase className="size-6 text-primary" />
            <p className="mt-2 text-lg font-medium">Para o trabalho</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>A fibromialgia tem CID (M79.7) e laudos médicos podem orientar adaptações.</li>
              <li>Pausas curtas, alongamento e evitar esforço repetitivo ajudam a manter a rotina.</li>
              <li>Conversar com a chefia ou RH sobre horários flexíveis pode fazer diferença.</li>
              <li>Guarde seus registros do app: eles ajudam a mostrar como a dor se comporta.</li>
            </ul>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
