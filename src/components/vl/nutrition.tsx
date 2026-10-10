import type { CSSProperties, ReactNode } from "react";
import {
  Soup, Egg, Drumstick, Salad, CupSoda, Sandwich, Wheat, Apple, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatQty, type ShoppingItem } from "@/data/nutrition";
import { Pencil, Trash2 } from "lucide-react";

const tileMeta: Record<string, { icon: LucideIcon; bg: CSSProperties }> = {
  "mingau-banana": { icon: Wheat, bg: { background: "var(--gradient-checkin)" } },
  "omelete-legumes": { icon: Egg, bg: { background: "var(--gradient-focus)" } },
  "frango-arroz": { icon: Drumstick, bg: { background: "linear-gradient(135deg, var(--warn-soft), var(--good-soft))" } },
  "sopa-abobora": { icon: Soup, bg: { background: "var(--gradient-insight)" } },
  "salada-grao": { icon: Salad, bg: { background: "linear-gradient(135deg, var(--good-soft), var(--primary-soft))" } },
  "vitamina-mamao": { icon: CupSoda, bg: { background: "var(--gradient-checkin)" } },
  "sanduiche-natural": { icon: Sandwich, bg: { background: "var(--gradient-focus)" } },
  "macarrao-integral": { icon: Wheat, bg: { background: "var(--gradient-insight)" } },
};

export function RecipeTile({ id, large = false, className }: { id: string; large?: boolean; className?: string }) {
  const m = tileMeta[id] ?? { icon: Apple, bg: { background: "var(--gradient-checkin)" } };
  const Icon = m.icon;
  return (
    <div
      className={cn("grid shrink-0 place-items-center rounded-2xl", large ? "size-24" : "size-16", className)}
      style={m.bg}
      aria-hidden
    >
      <Icon className={cn("text-primary", large ? "size-11" : "size-7")} strokeWidth={1.4} />
    </div>
  );
}

export function Tabs({ tabs, value, onChange }: {
  tabs: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <div role="tablist" aria-label="Seções de alimentação" className="grid gap-1 rounded-full border bg-card p-1" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={cn(
            "rounded-full px-3 py-2 text-sm font-medium transition",
            value === t.key ? "bg-primary text-primary-foreground shadow-float" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function ShoppingRow({ item, onToggle, onEdit, onRemove }: {
  item: ShoppingItem;
  onToggle: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <li className={cn("flex items-center gap-3 rounded-2xl border bg-card px-3.5 py-3 transition", item.checked && "opacity-70")}>
      <button
        role="checkbox"
        aria-checked={item.checked}
        aria-label={`Marcar ${item.name} como comprado`}
        onClick={onToggle}
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-full border-2 transition",
          item.checked ? "border-good bg-good text-primary-foreground" : "border-border bg-card hover:border-primary",
        )}
      >
        {item.checked && (
          <svg viewBox="0 0 12 12" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 6.5 4.8 9 10 3.5" />
          </svg>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium", item.checked && "line-through decoration-muted-foreground/60")}>{item.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatQty(item.qty)} {item.unit}
        </p>
      </div>
      <button onClick={onEdit} aria-label={`Editar ${item.name}`} className="grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground">
        <Pencil className="size-4" />
      </button>
      <button onClick={onRemove} aria-label={`Remover ${item.name}`} className="grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-alert">
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}

export function EmptyState({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="card-soft p-8 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary-soft text-primary" aria-hidden>
        <Apple className="size-6" strokeWidth={1.6} />
      </span>
      <p className="mt-3 font-medium">{title}</p>
      {subtitle && <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
