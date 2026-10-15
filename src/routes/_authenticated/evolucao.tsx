import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Zap, BedDouble, BatteryMedium, Smile, TrendingUp, BarChart3, Download, ArrowDown, ArrowUp, MessageCircleMore } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { useRecords, scoreMaps, fmt, todayKey, type StoredRecord } from "@/lib/records";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/evolucao")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Evolução e relatórios — VivaLeve" },
      { name: "description", content: "Veja como estão seus sintomas, descubra padrões e baixe seu relatório." },
      { property: "og:title", content: "Evolução e relatórios — VivaLeve" },
      { property: "og:description", content: "Veja como estão seus sintomas, descubra padrões e baixe seu relatório." },
    ],
  }),
  component: Evolucao,
});

type RangeKind = "30" | "90" | "custom";
const DAY = 86400000;
const parse = (k: string) => { const [y, m, d] = k.split("-").map(Number); return new Date(y!, m! - 1, d!); };
const ddmm = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

const energyOf = (r: StoredRecord) => {
  const parts = [scoreMaps.disposition[r.disposition], r.fatigue in scoreMaps.fatigue ? 10 - scoreMaps.fatigue[r.fatigue]! : undefined].filter((v): v is number => v !== undefined);
  return avg(parts);
};
const sleepOf = (r: StoredRecord) => scoreMaps.sleepQuality[r.sleep] ?? null;
const wellOf = (r: StoredRecord) => {
  const parts = [scoreMaps.mood[r.mood], 10 - r.pain, energyOf(r) ?? undefined].filter((v): v is number => v !== undefined);
  return avg(parts);
};

const metrics = [
  { key: "pain", label: "Dor média", icon: Zap, get: (r: StoredRecord) => r.pain as number | null, lowerIsBetter: true },
  { key: "sleep", label: "Qualidade do sono", icon: BedDouble, get: sleepOf, lowerIsBetter: false },
  { key: "energy", label: "Nível de energia", icon: BatteryMedium, get: energyOf, lowerIsBetter: false },
  { key: "well", label: "Bem-estar geral", icon: Smile, get: wellOf, lowerIsBetter: false },
];

const series = [
  { key: "pain", label: "Dor", color: "var(--primary)", get: (r: StoredRecord) => r.pain as number | null },
  { key: "sleep", label: "Sono", color: "var(--mood)", get: sleepOf },
  { key: "well", label: "Bem-estar", color: "var(--energy)", get: wellOf },
];

const mean = (rs: StoredRecord[], get: (r: StoredRecord) => number | null) => avg(rs.map(get).filter((v): v is number => v !== null));

function Evolucao() {
  const today = todayKey();
  const [kind, setKind] = useState<RangeKind>("30");
  const [cFrom, setCFrom] = useState(todayKey(new Date(Date.now() - 29 * DAY)));
  const [cTo, setCTo] = useState(today);
  const { data: records = [], isLoading, isError } = useRecords();

  const { from, to } = useMemo(() => {
    if (kind === "custom") return cFrom <= cTo ? { from: cFrom, to: cTo } : { from: cTo, to: cFrom };
    const days = kind === "30" ? 30 : 90;
    return { from: todayKey(new Date(Date.now() - (days - 1) * DAY)), to: today };
  }, [kind, cFrom, cTo, today]);

  const span = Math.round((parse(to).getTime() - parse(from).getTime()) / DAY) + 1;
  const inRange = records.filter(r => r.date >= from && r.date <= to);
  const prevFrom = todayKey(new Date(parse(from).getTime() - span * DAY));
  const prev = records.filter(r => r.date >= prevFrom && r.date < from);

  const buckets = useMemo(() => {
    const n = Math.min(4, span);
    const size = span / n;
    return Array.from({ length: n }, (_, i) => {
      const start = new Date(parse(from).getTime() + Math.floor(i * size) * DAY);
      const end = new Date(parse(from).getTime() + (Math.floor((i + 1) * size) - 1) * DAY);
      const rs = inRange.filter(r => r.date >= todayKey(start) && r.date <= todayKey(end));
      return { label: ddmm(start), values: series.map(s => mean(rs, s.get)) };
    });
  }, [inRange, from, span]);

  const summary = metrics.map(m => {
    const cur = mean(inRange, m.get), before = mean(prev, m.get);
    const change = cur !== null && before !== null && before > 0 ? ((cur - before) / before) * 100 : null;
    return { ...m, cur, change };
  });

  const [generating, setGenerating] = useState(false);
  const downloadReport = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const [{ buildReportPdf, downloadBlob }, { supabase }] = await Promise.all([
        import("@/lib/report-pdf"),
        import("@/integrations/supabase/client"),
      ]);
      const { data: u } = await supabase.auth.getUser();
      const name = (u.user?.user_metadata?.full_name as string | undefined) ?? u.user?.email?.split("@")[0];
      const bytes = await buildReportPdf({
        from: parse(from),
        to: parse(to),
        records: inRange,
        summary: summary.map(s => ({ label: s.label, cur: s.cur, change: s.change })),
        patientName: name,
      });
      downloadBlob(bytes, `relatorio-vivaleve-${from}_a_${to}.pdf`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-4 pt-6 lg:pt-0">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-soft via-card to-primary-soft p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-card text-primary"><BarChart3 className="size-8" /></span>
            <div>
              <h1 className="font-display text-xl font-semibold">Acompanhe sua jornada!</h1>
              <p className="mt-1 text-sm text-muted-foreground">Veja como estão seus sintomas, descubra padrões e celebre suas conquistas.</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-3 gap-2">
          {([["30", "Últimos 30 dias"], ["90", "Últimos 3 meses"], ["custom", "Personalizado"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setKind(k)} aria-pressed={kind === k}
              className={cn("min-h-12 rounded-full border px-2 text-sm font-medium transition", kind === k ? "border-primary bg-primary text-primary-foreground shadow" : "border-border bg-card")}>{l}</button>
          ))}
        </div>
        {kind === "custom" && (
          <div className="card-soft grid grid-cols-2 gap-3 p-4">
            <label className="text-sm">De<input type="date" max={today} value={cFrom} onChange={e => setCFrom(e.target.value)} className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-2" /></label>
            <label className="text-sm">Até<input type="date" max={today} value={cTo} onChange={e => setCTo(e.target.value)} className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-2" /></label>
          </div>
        )}

        {isLoading ? <p className="text-muted-foreground">Carregando seus registros…</p>
          : isError ? <p role="alert" className="text-destructive">Não conseguimos carregar agora. Tente de novo em instantes.</p>
          : inRange.length === 0 ? (
            <div className="card-soft p-8 text-center">
              <p className="text-lg font-medium">Ainda não há registros neste período.</p>
              <p className="mt-2 text-muted-foreground">Faça seu registro na tela inicial e sua evolução aparece aqui.</p>
              <Link to="/" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground"><MessageCircleMore className="size-5" />Fazer meu registro</Link>
            </div>
          ) : <>
            <section className="card-soft p-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold"><TrendingUp className="size-6 text-primary" />Resumo da sua evolução</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {summary.map(s => {
                  const Icon = s.icon;
                  const better = s.change !== null && (s.lowerIsBetter ? s.change < 0 : s.change > 0);
                  return (
                    <div key={s.key} className="rounded-2xl bg-secondary/60 p-3">
                      <Icon className="size-6 text-primary" />
                      <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                      <p className="text-xl font-semibold">{s.cur === null ? "—" : `${fmt(s.cur)} / 10`}</p>
                      {s.change !== null && Math.round(s.change) !== 0 ? (
                        <p className={cn("mt-1 flex items-center gap-1 text-sm font-medium", better ? "text-good" : "text-muted-foreground")}>
                          {s.change < 0 ? <ArrowDown className="size-4" /> : <ArrowUp className="size-4" />}{Math.abs(Math.round(s.change))}%
                        </p>
                      ) : <p className="mt-1 text-xs text-muted-foreground">{s.change === null ? "Sem período anterior" : "Estável"}</p>}
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Comparado aos {span} dias anteriores · {inRange.length} {inRange.length === 1 ? "registro" : "registros"}</p>
            </section>

            <section className="card-soft p-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold"><BarChart3 className="size-6 text-primary" />Sua evolução ao longo do tempo</h2>
              <div className="mt-3 flex justify-center gap-4 text-sm">
                {series.map(s => <span key={s.key} className="flex items-center gap-1.5"><span className="size-3 rounded-full" style={{ background: s.color }} />{s.label}</span>)}
              </div>
              <Chart buckets={buckets} />
            </section>
          </>}

        <button onClick={downloadReport} disabled={inRange.length === 0}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary-soft font-medium text-primary transition active:scale-[0.98] disabled:opacity-50">
          <Download className="size-5" />Baixar relatório (PDF)
        </button>
        <p className="text-center text-xs text-muted-foreground">Feito só com o que você registrou. Só você vê.</p>
      </div>
    </AppShell>
  );
}

function Chart({ buckets }: { buckets: { label: string; values: (number | null)[] }[] }) {
  const W = 320, H = 200, L = 24, R = 12, T = 10, B = 26;
  const x = (i: number) => L + (buckets.length === 1 ? (W - L - R) / 2 : (i * (W - L - R)) / (buckets.length - 1));
  const y = (v: number) => T + (1 - v / 10) * (H - T - B);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label="Gráfico de dor, sono e bem-estar ao longo do período">
      {[0, 2, 4, 6, 8, 10].map(v => <g key={v}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--border)" /><text x={L - 6} y={y(v) + 4} textAnchor="end" fontSize="10" fill="var(--muted-foreground)">{v}</text></g>)}
      {buckets.map((b, i) => <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">{b.label}</text>)}
      {series.map((s, si) => {
        const pts = buckets.map((b, i) => (b.values[si] == null ? null : [x(i), y(b.values[si]!)] as const)).filter((p): p is readonly [number, number] => p !== null);
        return <g key={s.key}>
          {pts.length > 1 && <polyline points={pts.map(p => p.join(",")).join(" ")} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
          {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="4.5" fill="var(--card)" stroke={s.color} strokeWidth="2.5" />)}
        </g>;
      })}
    </svg>
  );
}
