import { useEffect, useId, useState, type ReactNode } from "react";
import {
  Zap, Moon, BatteryMedium, Utensils, Footprints, Smile,
  CheckCircle2, AlertCircle, AlertTriangle, ArrowUp, ArrowDown, ChevronDown,
} from "lucide-react";
import type { IndicatorKey, Status } from "@/data/mock";
import { cn } from "@/lib/utils";

export const indicatorMeta: Record<IndicatorKey, { icon: typeof Zap; color: string; text: string }> = {
  pain: { icon: Zap, color: "var(--pain)", text: "text-pain" },
  sleep: { icon: Moon, color: "var(--sleep)", text: "text-sleep" },
  energy: { icon: BatteryMedium, color: "var(--energy)", text: "text-energy" },
  food: { icon: Utensils, color: "var(--food)", text: "text-food" },
  move: { icon: Footprints, color: "var(--move)", text: "text-move" },
  mood: { icon: Smile, color: "var(--mood)", text: "text-mood" },
};

export function ProgressRing({ value, color, size = 64, stroke = 5, children }: {
  value: number; color: string; size?: number; stroke?: number; children?: ReactNode;
}) {
  const [v, setV] = useState(0);
  useEffect(() => { const t = setTimeout(() => setV(value), 80); return () => clearTimeout(t); }, [value]);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeOpacity={0.1} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v)}
          style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(.3,.7,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center" style={{ color }}>{children}</div>
    </div>
  );
}

const statusMeta: Record<Status, { label: string; icon: typeof CheckCircle2; cls: string }> = {
  good: { label: "Bem", icon: CheckCircle2, cls: "bg-good-soft text-good" },
  attention: { label: "Em atenção", icon: AlertCircle, cls: "bg-warn-soft text-warn" },
  priority: { label: "Prioridade", icon: AlertTriangle, cls: "bg-alert-soft text-alert" },
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const m = statusMeta[status];
  const Icon = m.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium", m.cls, className)}>
      <Icon className="size-3" aria-hidden /> {m.label}
    </span>
  );
}

export function Trend({ change, improving }: { change: number; improving: boolean }) {
  const Icon = change >= 0 ? ArrowUp : ArrowDown;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-semibold", improving ? "text-good" : "text-alert")}>
      <Icon className="size-3.5" aria-hidden />
      {change > 0 ? "+" : ""}{change}%
    </span>
  );
}

export function PillSelect({ label }: { label: string }) {
  return (
    <button className="inline-flex shrink-0 items-center gap-1 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-secondary">
      {label} <ChevronDown className="size-3.5" />
    </button>
  );
}

export function Segmented<T extends string | number>({ options, value, onChange }: {
  options: { value: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full border bg-card p-1">
      {options.map((o) => (
        <button
          key={String(o.value)}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
            value === o.value ? "bg-primary text-primary-foreground shadow-float" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function LineChart({ data, color = "var(--primary)", height = 120, dots = true }: {
  data: number[]; color?: string; height?: number; dots?: boolean;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const w = 300;
  const min = Math.min(...data), max = Math.max(...data);
  const pad = 10;
  const pts = data.map((d, i) => [
    pad + (i * (w - pad * 2)) / Math.max(1, data.length - 1),
    pad + (1 - (d - min) / (max - min || 1)) * (height - pad * 2),
  ]);
  const path = pts.map((p, i) => {
    if (i === 0) return `M${p[0]},${p[1]}`;
    const prev = pts[i - 1] as number[];
    const px = prev[0] as number, py = prev[1] as number;
    const cx = (px + (p[0] as number)) / 2;
    return `C${cx},${py} ${cx},${p[1]} ${p[0]},${p[1]}`;
  }).join(" ");
  const area = `${path} L${pts[pts.length - 1]![0]},${height} L${pts[0]![0]},${height} Z`;
  const step = data.length > 20 ? Math.ceil(data.length / 15) : 1;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="h-full w-full overflow-visible" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} className="animate-rise" />
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke"
        pathLength={1000} strokeDasharray={1000} className="animate-draw" />
      {dots && pts.filter((_, i) => i % step === 0 || i === pts.length - 1).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} fill="var(--card)" stroke={color} strokeWidth={1.5} vectorEffect="non-scaling-stroke" className="animate-rise" style={{ animationDelay: `${0.6 + i * 0.03}s` }} />
      ))}
    </svg>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
      <div className="min-w-0">
        <h2 className="text-xl font-medium">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
