import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const descriptors = ["sem dor", "muito leve", "leve", "leve", "moderada", "moderada", "moderada", "forte", "forte", "muito forte", "máxima"];

export function PainSlider({ label, value, onChange, className }: {
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
  className?: string;
}) {
  const current = value ?? 0;
  const percent = current * 10;
  const thumb = current <= 3 ? "var(--good)" : current <= 6 ? "var(--warn)" : "var(--alert)";
  const chip = current <= 3 ? "bg-good-soft text-good" : current <= 6 ? "bg-warn-soft text-warn" : "bg-alert-soft text-alert";
  return <div className={cn("min-w-0", className)}>
    <div className="relative h-9" aria-hidden="true">
      <div className="absolute top-0 -translate-x-1/2 transition-[left] duration-150" style={{ left: `${percent}%` }}>
        <span className={cn("inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-sm font-semibold", value === undefined ? "bg-muted text-muted-foreground" : chip)}>
          {value ?? "–"}
        </span>
      </div>
    </div>
    <div className="relative h-12">
      <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full bg-secondary" aria-hidden="true" />
      <div className="pain-fill absolute left-0 top-1/2 h-3 -translate-y-1/2 rounded-full" style={{ width: `${percent}%` }} aria-hidden="true" />
      <input type="range" min={0} max={10} step={1} value={current}
        aria-label={label}
        aria-valuetext={`${current} de 10 · dor ${descriptors[current]}`}
        onChange={event => onChange(Number(event.target.value))}
        style={{ "--thumb-color": thumb } as CSSProperties}
        className="pain-range absolute inset-0 h-full w-full cursor-pointer touch-none" />
    </div>
    <div className="mt-1 flex justify-between text-[11px] leading-none text-muted-foreground" aria-hidden="true">
      {Array.from({ length: 11 }, (_, n) => <span key={n}>{n}</span>)}
    </div>
  </div>;
}
