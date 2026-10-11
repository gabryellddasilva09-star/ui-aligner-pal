import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/vl/AppShell";
import { LineChart, Segmented, SectionHeader, StatusBadge, Trend, indicatorMeta } from "@/components/vl/primitives";
import { evolutionSeries, weeklyIndicators } from "@/data/mock";

export const Route = createFileRoute("/evolucao")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Evolução — VivaLeve" },
      { name: "description", content: "Acompanhe a evolução dos seus indicadores em 7, 30 ou 90 dias." },
      { property: "og:title", content: "Evolução — VivaLeve" },
      { property: "og:description", content: "Acompanhe a evolução dos seus indicadores em 7, 30 ou 90 dias." },
    ],
  }),
  component: Evolucao,
});

type Range = 7 | 30 | 90;

function Evolucao() {
  const [range, setRange] = useState<Range>(30);
  return (
    <AppShell>
      <div className="pt-6 lg:pt-0">
        <SectionHeader title="Evolução" subtitle="Como cada indicador vem se comportando." />
        <Segmented<Range>
          value={range}
          onChange={setRange}
          options={[{ value: 7, label: "7 dias" }, { value: 30, label: "30 dias" }, { value: 90, label: "90 dias" }]}
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {weeklyIndicators.map((ind, i) => {
            const m = indicatorMeta[ind.key];
            const Icon = m.icon;
            return (
              <div key={`${ind.key}-${range}`} className="card-soft animate-rise p-5" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-full bg-secondary" style={{ color: m.color }}>
                      <Icon className="size-4" />
                    </span>
                    <span className="font-medium">{ind.label}</span>
                  </div>
                  <StatusBadge status={ind.status} />
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-medium">{ind.value}</span>
                  <span className="text-sm text-muted-foreground">{ind.unit}</span>
                  <span className="ml-auto"><Trend change={ind.change} improving={ind.improving} /></span>
                </div>
                <div className="mt-3">
                  <LineChart data={evolutionSeries[ind.key][range]} color={m.color} height={80} dots={range === 7} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
