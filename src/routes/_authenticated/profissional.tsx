import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MessageSquareHeart, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { SectionHeader } from "@/components/vl/primitives";
import { professional, messages } from "@/data/mock";
import nadya from "@/assets/dra-nadya.jpg";

export const Route = createFileRoute("/_authenticated/profissional")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Sua profissional — VivaLeve" },
      { name: "description", content: "Sua profissional acompanha sua evolução através do VivaLeve." },
      { property: "og:title", content: "Sua profissional — VivaLeve" },
      { property: "og:description", content: "Sua profissional acompanha sua evolução através do VivaLeve." },
    ],
  }),
  component: Profissional,
});

function Profissional() {
  return (
    <AppShell>
      <div className="pt-6 lg:pt-0">
        <SectionHeader title="Seu acompanhamento" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="relative overflow-hidden rounded-3xl bg-checkin p-7 text-center shadow-float">
            <img src={nadya} alt="Dr(a). Nadya" width={816} height={816} loading="lazy"
              className="mx-auto size-28 rounded-full object-cover object-top ring-4 ring-card" />
            <h2 className="mt-4 text-2xl font-medium">{professional.name}</h2>
            <p className="text-sm text-accent-foreground">{professional.role}</p>
            <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Sua profissional acompanha sua evolução através deste aplicativo.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-card/70 px-3 py-1 text-xs text-good">
              <ShieldCheck className="size-3.5" /> {professional.lastSeen}
            </p>
            <button className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
              Ver acompanhamento <ArrowRight className="size-4" />
            </button>
          </section>

          <section className="card-soft flex flex-col p-6">
            <div className="flex items-center gap-2">
              <MessageSquareHeart className="size-5 text-primary" />
              <h3 className="font-medium">Mensagens da profissional</h3>
            </div>
            <div className="mt-5 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className="max-w-[90%] rounded-2xl rounded-tl-sm bg-primary-soft p-4">
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground">{m.from} · {m.when}</p>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-8">
              <div className="rounded-2xl border border-dashed p-4 text-center text-sm text-muted-foreground">
                Em breve você poderá conversar com sua profissional por aqui.
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
