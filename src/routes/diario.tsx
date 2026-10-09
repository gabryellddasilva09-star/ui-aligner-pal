import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { StatusBadge, indicatorMeta, SectionHeader } from "@/components/vl/primitives";
import { diary } from "@/data/mock";

export const Route = createFileRoute("/diario")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Diário — VivaLeve" },
      { name: "description", content: "Seus registros recentes de dor, sono e energia." },
      { property: "og:title", content: "Diário — VivaLeve" },
      { property: "og:description", content: "Seus registros recentes de dor, sono e energia." },
    ],
  }),
  component: Diario,
});

function Diario() {
  return (
    <AppShell>
      <div className="pt-6 lg:pt-0">
        <SectionHeader
          title="Diário"
          subtitle="Seus registros recentes, dia a dia."
          action={
            <button className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-float transition hover:opacity-90">
              <Plus className="size-4" /> Registrar
            </button>
          }
        />
        <ol className="relative mt-6 space-y-5 border-l border-dashed pl-6">
          {diary.map((d, i) => (
            <li key={d.day} className="animate-rise" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="absolute -left-[7px] mt-5 size-3.5 rounded-full border-2 border-card bg-primary" />
              <div className="card-soft p-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-medium">{d.day}</h3>
                  <span className="text-xs text-muted-foreground">{d.date}</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {d.items.map((it) => {
                    const m = indicatorMeta[it.key];
                    const Icon = m.icon;
                    return (
                      <div key={it.key} className="flex items-center gap-3 rounded-2xl bg-secondary p-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-card" style={{ color: m.color }}>
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground">{it.label}</p>
                          <p className="font-display font-medium">{it.value}</p>
                        </div>
                        <StatusBadge status={it.status} />
                      </div>
                    );
                  })}
                </div>
                {d.note && <p className="mt-4 text-sm italic leading-relaxed text-muted-foreground">“{d.note}”</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </AppShell>
  );
}
