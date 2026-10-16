import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const HOLD_MS = 1200;

/**
 * Botão que exige pressionar e segurar: uma barra vermelha enche
 * enquanto o usuário segura; ao encher, dispara onComplete.
 * Soltar antes zera o progresso.
 */
export function HoldButton({
  onComplete,
  children,
  hint,
  className,
}: {
  onComplete: () => void;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const doneRef = useRef(false);

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (!doneRef.current) setProgress(0);
  }, []);

  const tick = useCallback(() => {
    const elapsed = performance.now() - startRef.current;
    const pct = Math.min(1, elapsed / HOLD_MS);
    setProgress(pct);
    if (pct >= 1) {
      doneRef.current = true;
      rafRef.current = null;
      onComplete();
      setProgress(0);
      doneRef.current = false;
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [onComplete]);

  const start = useCallback(() => {
    if (rafRef.current !== null) return;
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => () => stop(), [stop]);

  return (
    <button
      type="button"
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "relative h-16 select-none overflow-hidden rounded-2xl border border-pain/40 bg-card px-5 text-left text-lg font-medium text-pain shadow-soft touch-none",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 bg-pain/25 transition-none"
        style={{ width: `${progress * 100}%` }}
      />
      <span className="relative flex items-center gap-3">
        {children}
        <span className="ml-auto text-sm font-normal text-muted-foreground">
          {progress > 0 ? "continue segurando…" : (hint ?? "segure para abrir")}
        </span>
      </span>
    </button>
  );
}
