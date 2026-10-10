import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DURATION = 550; // ms da passagem lateral

/**
 * Carrossel em loop lateral: avança sozinho, pode ser arrastado com o dedo
 * e nunca para no fim — ao cruzar a borda volta ao meio sem salto visível.
 */
export function LoopCarousel<T>({ items, label, itemName = "item", renderItem, autoMs = 5200, suspended = false }: {
  items: readonly T[];
  label: string;
  itemName?: string;
  renderItem: (item: T, index: number) => ReactNode;
  autoMs?: number;
  suspended?: boolean;
}) {
  const n = items.length;
  const [index, setIndex] = useState(n); // começa no bloco do meio
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const drag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // ao cruzar a borda, volta para o bloco do meio sem transição (posição idêntica)
  useEffect(() => {
    let jump: number | undefined;
    if (n >= 2 && (index >= 2 * n || index < n)) {
      jump = window.setTimeout(() => {
        setAnimate(false);
        setIndex((i) => (i >= 2 * n ? i - n : i + n));
      }, DURATION + 40);
    }
    return () => { if (jump !== undefined) window.clearTimeout(jump); };
  }, [index, n]);

  useEffect(() => {
    let back: number | undefined;
    if (!animate) back = window.setTimeout(() => setAnimate(true), 60);
    return () => { if (back !== undefined) window.clearTimeout(back); };
  }, [animate]);

  const auto = n > 1 && !reduced && !paused && !suspended;
  useEffect(() => {
    let tick: number | undefined;
    if (auto) tick = window.setInterval(() => setIndex((i) => i + 1), autoMs);
    return () => { if (tick !== undefined) window.clearInterval(tick); };
  }, [auto, autoMs]);

  if (n === 0) return null;
  if (n === 1) {
    const only = items[0];
    return only === undefined ? null : <div className="w-full">{renderItem(only, 0)}</div>;
  }

  const copies = [...items, ...items, ...items];
  const active = index % n;

  return (
    <div role="group" aria-roledescription="carrossel" aria-label={label}
      onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div className="overflow-hidden rounded-3xl" style={{ touchAction: "pan-y" }}
        onPointerDown={(event) => { drag.current = { x: event.clientX, y: event.clientY }; }}
        onPointerUp={(event) => {
          const start = drag.current; drag.current = null;
          if (!start) return;
          const dx = event.clientX - start.x; const dy = event.clientY - start.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) setIndex((i) => i + (dx < 0 ? 1 : -1));
        }}>
        <div className="flex" aria-live="off" style={{
          transform: `translate3d(-${index * 100}%, 0, 0)`,
          transition: animate && !reduced ? `transform ${DURATION}ms cubic-bezier(0.2, 0.7, 0.2, 1)` : "none",
        }}>
          {copies.map((item, position) => (
            <div key={position} className="w-full shrink-0 px-0.5" aria-hidden={position !== index} inert={position !== index}>
              {renderItem(item, position % n)}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <Button variant="outline" size="icon" className="size-12 shrink-0 rounded-full" aria-label={`${itemName} anterior`}
          onClick={() => setIndex((i) => i - 1)}><ChevronLeft className="size-5" /></Button>
        <div className="flex items-center gap-1">
          {items.map((item, position) => (
            <Button key={position} variant="ghost" className="grid size-11 place-items-center rounded-full p-0"
              aria-current={active === position ? "true" : undefined} aria-label={`Ir para ${itemName} ${position + 1}`}
              onClick={() => setIndex(n + position)}>
              <span aria-hidden className={cn("size-3 rounded-full transition-colors", active === position ? "bg-primary" : "bg-primary-soft")} />
            </Button>
          ))}
        </div>
        <Button variant="outline" size="icon" className="size-12 shrink-0 rounded-full" aria-label={`Próxima ${itemName}`}
          onClick={() => setIndex((i) => i + 1)}><ChevronRight className="size-5" /></Button>
      </div>
    </div>
  );
}
