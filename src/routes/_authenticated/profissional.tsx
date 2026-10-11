import { createFileRoute } from "@tanstack/react-router";
import { Lock, Sparkles } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { SectionHeader } from "@/components/vl/primitives";
import { professional } from "@/data/mock";
import nadya from "@/assets/dra-nadya.jpg";

export const Route = createFileRoute("/_authenticated/profissional")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Quem criou o VivaLeve" },
      { name: "description", content: "O VivaLeve foi idealizado pela Dra. Nadya para apoiar o dia a dia de quem vive com fibromialgia." },
      { property: "og:title", content: "Quem criou o VivaLeve" },
      { property: "og:description", content: "O VivaLeve foi idealizado pela Dra. Nadya para apoiar o dia a dia de quem vive com fibromialgia." },
    ],
  }),
  component: Profissional,
});

function Profissional() {
  return (
    <AppShell>
      <div className="pt-6 lg:pt-0">
        <SectionHeader title="Quem criou o VivaLeve" />
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-checkin p-7 text-center shadow-float">
            <img src={nadya} alt={professional.name} width={816} height={816} loading="lazy" className="mx-auto size-28 rounded-full object-cover object-top ring-4 ring-card" />
            <h2 className="mt-4 text-2xl font-medium">{professional.name}</h2>
            <p className="text-sm text-accent-foreground">{professional.role}</p>
            <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">
              O VivaLeve nasceu de uma ideia da {professional.name}: oferecer um apoio simples e acolhedor para o dia a dia de quem vive com fibromialgia.
            </p>
          </section>
          <section className="card-soft space-y-5 p-6">
            <div className="flex gap-3"><Sparkles className="mt-0.5 size-5 shrink-0 text-primary" /><p className="leading-relaxed">Aqui você registra como está, acompanha sua evolução e encontra práticas de movimento, alimentação e relaxamento.</p></div>
            <div className="flex gap-3"><Lock className="mt-0.5 size-5 shrink-0 text-primary" /><p className="leading-relaxed">Seus registros ficam guardados na sua conta e <strong>só você vê</strong>. Ninguém mais tem acesso a eles.</p></div>
            <p className="rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">O aplicativo não substitui suas consultas. Se quiser, mostre sua evolução no próprio celular para quem cuida de você.</p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
