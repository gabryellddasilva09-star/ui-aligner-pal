import { Droplets, Minus, Plus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHydration } from "@/lib/hydration";
import { MAX_WATER_ML, waterLabel, waterPercent } from "@/lib/hydration-values";

export function WaterControl({ date }: { date?: string | undefined }) {
  const water = useHydration(date);
  const pct = waterPercent(water.amount, water.goal);
  const disabled = !water.ready || water.change.isPending;
  return (
    <section aria-label="Consumo de água" className="min-w-0">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base font-semibold"><Droplets className="size-5 text-nutrition-blue" aria-hidden />Água do dia</h3>
        <span className="text-sm text-muted-foreground">Meta: {waterLabel(water.goal)}</span>
      </div>
      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-3">
        <div>
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1" aria-live="polite" aria-atomic="true">
            <span className="text-xl font-semibold text-nutrition-blue">{waterLabel(water.amount)}</span>
            <span className="text-xs font-medium text-muted-foreground">{pct}% da meta</span>
          </div>
          <div className="water-tank" role="progressbar" aria-label="Meta diária de água" aria-valuemin={0} aria-valuemax={water.goal} aria-valuenow={Math.min(water.amount, water.goal)} aria-valuetext={`${waterLabel(water.amount)} de ${waterLabel(water.goal)}`}>
            <div className="water-tank-marks" aria-hidden><span /><span /><span /></div>
            <div className="water-liquid" style={{ height: `${pct}%`, opacity: pct === 0 ? 0 : 1 }} aria-hidden>
              <svg className="water-wave water-wave-back" viewBox="0 0 800 28" preserveAspectRatio="none"><path d="M0 14 Q50 0 100 14 T200 14 T300 14 T400 14 T500 14 T600 14 T700 14 T800 14 V28 H0 Z" /></svg>
              <svg className="water-wave" viewBox="0 0 800 28" preserveAspectRatio="none"><path d="M0 14 Q50 28 100 14 T200 14 T300 14 T400 14 T500 14 T600 14 T700 14 T800 14 V28 H0 Z" /></svg>
              <div className="water-reflection" />
            </div>
            <Droplets className="water-tank-icon" aria-hidden />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button variant="outline" className="size-12 rounded-full border-nutrition-blue/30 bg-card/80 p-0 text-nutrition-blue" aria-label="Adicionar 500 ml de água" title="Adicionar 500 ml" disabled={disabled || water.amount >= MAX_WATER_ML} onClick={() => water.change.mutate(1)}><Plus className="size-5" /></Button>
          <span className="text-xs font-medium text-nutrition-blue">500 ml</span>
          <Button variant="outline" className="size-12 rounded-full border-nutrition-blue/30 bg-card/80 p-0 text-nutrition-blue" aria-label="Retirar 500 ml de água" title="Retirar 500 ml" disabled={disabled || water.amount === 0} onClick={() => water.change.mutate(-1)}><Minus className="size-5" /></Button>
        </div>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-nutrition-blue">
        {pct === 100 ? <><CheckCircle2 className="size-4" aria-hidden />Meta de água alcançada!</> : `Faltam ${waterLabel(Math.max(0, water.goal - water.amount))}`}
      </p>
      {water.error && <p role="alert" className="mt-2 text-sm text-destructive">Não foi possível carregar ou salvar sua água. Tente novamente.</p>}
    </section>
  );
}