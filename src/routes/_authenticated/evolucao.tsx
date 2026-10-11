import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Zap, Moon, BatteryMedium, Smile, Brain, MessageCircleMore } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { LineChart, Segmented, SectionHeader } from "@/components/vl/primitives";
import { useRecords, sleepHours, scoreMaps, fmt, todayKey, type StoredRecord } from "@/lib/records";

export const Route = createFileRoute("/_authenticated/evolucao")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Evolução — VivaLeve" },
      { name: "description", content: "Acompanhe como você está a partir dos seus próprios registros." },
      { property: "og:title", content: "Evolução — VivaLeve" },
      { property: "og:description", content: "Acompanhe como você está a partir dos seus próprios registros." },
    ],
  }),
  component: Evolucao,
});

type Range = 7 | 30 | 90;
const fogScore: Record<string, number> = { Nenhuma: 0, Leve: 3, Moderada: 6, Intensa: 9 };

const metrics: { key: string; label: string; unit: string; icon: typeof Zap; color: string; get: (r: StoredRecord) => number | null }[] = [
  { key: "pain", label: "Dor", unit: "/10", icon: Zap, color: "var(--pain)", get: r => r.pain },
  { key: "sleep", label: "Horas de sono", unit: "h", icon: Moon, color: "var(--sleep)", get: r => sleepHours(r) },
  { key: "sleepq", label: "Qualidade do sono", unit: "/10", icon: Moon, color: "var(--sleep)", get: r => scoreMaps.sleepQuality[r.sleep] ?? null },
  { key: "energy", label: "Disposição", unit: "/10", icon: BatteryMedium, color: "var(--energy)", get: r => scoreMaps.disposition[r.disposition] ?? null },
  { key: "mood", label: "Humor", unit: "/10", icon: Smile, color: "var(--mood)", get: r => scoreMaps.mood[r.mood] ?? null },
  { key: "fog", label: "Névoa mental", unit: "/10", icon: Brain, color: "var(--primary)", get: r => (r.brainFog ? fogScore[r.brainFog] : null) },
];

function Evolucao() {
  const [range, setRange] = useState<Range>(30);
  const { data: records = [], isLoading, isError } = useRecords();
  const from = new Date(); from.setDate(from.getDate() - (range - 1));
  const inRange = records.filter(r => r.date >= todayKey(from)).slice().reverse();
  return (
    <AppShell showMobileBack>
      <div className="pt-6 lg:pt-0">
        <SectionHeader title="Evolução" subtitle="Feita só com o que você registrou. Só você vê." />
        <Segmented<Range> value={range} onChange={setRange}
          options={[{ value: 7, label: "7 dias" }, { value: 30, label: "30 dias" }, { value: 90, label: "90 dias" }]} />
        {isLoading ? <p className="mt-8 text-muted-foreground">Carregando seus registros…</p>
          : isError ? <p role="alert" className="mt-8 text-destructive">Não conseguimos carregar agora. Tente de novo em instantes.</p>
          : inRange.length === 0 ? <div className="card-soft mt-6 p-8 text-center">
              <p className="text-lg font-medium">Ainda não há registros neste período.</p>
              <p className="mt-2 text-muted-foreground">Conte como você está na tela inicial e sua evolução aparece aqui.</p>
              <Link to="/" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground"><MessageCircleMore className="size-5" />Fazer meu registro</Link>
            </div>
          : <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {metrics.map((m, i) => {
              const vals = inRange.map(m.get).filter((v): v is number => v !== null);
              const Icon = m.icon;
              const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
              return <div key={`${m.key}-${range}`} className="card-soft animate-rise p-5" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-full bg-secondary" style={{ color: m.color }}><Icon className="size-4" /></span>
                  <span className="font-medium">{m.label}</span>
                </div>
                {avg === null ? <p className="mt-4 text-sm text-muted-foreground">Sem informação neste período.</p> : <>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-medium">{fmt(avg)}</span>
                    <span className="text-sm text-muted-foreground">{m.unit} · média de {vals.length} {vals.length === 1 ? "dia" : "dias"}</span>
                  </div>
                  {vals.length >= 2 && <div className="mt-3"><LineChart data={vals} color={m.color} height={80} dots={vals.length <= 10} /></div>}
                </>}
              </div>;
            })}
          </div>}
      </div>
    </AppShell>
  );
}
