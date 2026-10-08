import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  BatteryLow, CloudRainWind, Smile, Waves, Wind, PersonStanding, Flower2, type LucideIcon,
} from "lucide-react";
import { dailyStates, type WeekDay } from "@/data/movement";
import { cn } from "@/lib/utils";

const tileMeta: Record<string, { icon: LucideIcon; bg: CSSProperties }> = {
  mobilidade: { icon: Waves, bg: { background: "var(--gradient-checkin)" } },
  respiracao: { icon: Wind, bg: { background: "var(--gradient-insight)" } },
  alongamento: { icon: PersonStanding, bg: { background: "var(--gradient-focus)" } },
  pausa: { icon: Flower2, bg: { background: "linear-gradient(135deg, var(--warn-soft), var(--good-soft))" } },
};

export function ActivityTile({ id, large = false, className }: { id: string; large?: boolean; className?: string }) {
  const m = tileMeta[id] ?? tileMeta.mobilidade!;
  const Icon = m.icon;
  return (
    <div
      className={cn("grid shrink-0 place-items-center rounded-2xl", large ? "size-20" : "size-16", className)}
      style={m.bg}
      aria-hidden
    >
      <Icon className={cn("text-primary", large ? "size-9" : "size-7")} strokeWidth={1.6} />
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setV(value), 100);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-secondary"
      role="progressbar"
      aria-valuenow={Math.round(value * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out"
        style={{ width: `${v * 100}%` }}
      />
    </div>
  );
}

const stateIcons: Record<string, LucideIcon> = {
  bem: Smile,
  cansada: BatteryLow,
  dificil: CloudRainWind,
};

export function DailyStateSelector({ value, onChange }: { value: string | null; onChange: (key: string) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {dailyStates.map((o) => {
        const Icon = stateIcons[o.key] ?? Smile;
        const active = value === o.key;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            aria-pressed={active}
            className={cn(
              "flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-medium transition",
              active
                ? "border-primary bg-primary-soft text-primary"
                : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="size-[18px] shrink-0" strokeWidth={1.8} /> {o.label}
          </button>
        );
      })}
    </div>
  );
}

const weekMeta: Record<WeekDay["state"], { className: string; label: string }> = {
  done: { className: "bg-good", label: "Atividade registrada" },
  none: { className: "border-2 border-border bg-card", label: "Nenhuma atividade registrada" },
  nodata: { className: "bg-muted", label: "Dia sem informação" },
};

export function WeekHistoryStrip({ days }: { days: WeekDay[] }) {
  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5" aria-hidden>
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span
              className={cn("h-9 w-full rounded-xl transition", weekMeta[d.state]!.className, d.isToday && "ring-2 ring-primary/40")}
            />
            <span className={cn("text-[11px]", d.isToday ? "font-semibold text-primary" : "text-muted-foreground")}>
              {d.day}
            </span>
          </div>
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {(["done", "none", "nodata"] as const).map((s) => (
          <li key={s} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className={cn("size-2.5 rounded-full", weekMeta[s]!.className)} aria-hidden />
            {weekMeta[s]!.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DialogShell({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Fechar detalhes" onClick={onClose} className="absolute inset-0 bg-foreground/25 backdrop-blur-sm" />
      <div className="animate-rise relative max-h-[92vh] w-full overflow-y-auto rounded-t-4xl border bg-card p-6 shadow-float sm:max-w-lg sm:rounded-4xl sm:p-8">
        {children}
      </div>
    </div>
  );
}
