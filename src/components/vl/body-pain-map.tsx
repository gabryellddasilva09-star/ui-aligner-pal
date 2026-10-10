import { useState } from "react";
import { Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { painRegions, type PainRegion, type BodyPainDraft } from "@/data/body-pain";

const shapes: { region: PainRegion; path: string }[] = [
  { region: "Cabeça e pescoço", path: "M70 12 C57 12 51 21 51 34 C51 45 56 51 62 54 L62 66 L78 66 L78 54 C84 51 89 45 89 34 C89 21 83 12 70 12Z" },
  { region: "Ombros", path: "M62 62 L78 62 L95 69 Q102 72 103 83 L85 89 L55 89 L37 83 Q38 72 45 69Z" },
  { region: "Braços e mãos", path: "M37 84 L52 91 L44 129 L38 164 L37 186 Q34 198 28 194 L23 190 L24 172 L29 135Z M103 84 L88 91 L96 129 L102 164 L103 186 Q106 198 112 194 L117 190 L116 172 L111 135Z" },
  { region: "Peito", path: "M55 87 L85 87 L91 119 L84 145 L56 145 L49 119Z" },
  { region: "Quadril", path: "M56 146 L84 146 L91 177 L87 196 L71 200 L69 200 L53 196 L49 177Z" },
  { region: "Pernas", path: "M53 198 L68 202 L67 239 L64 273 L62 300 L49 300 L46 271 L48 234Z M87 198 L72 202 L73 239 L76 273 L78 300 L91 300 L94 271 L92 234Z" },
  { region: "Pés", path: "M49 302 L62 302 L63 315 Q63 321 57 321 L42 321 Q36 320 39 314Z M78 302 L91 302 L101 314 Q104 320 98 321 L83 321 Q77 321 77 315Z" },
];

export function BodyPainMap({ value, onChange }: { value: BodyPainDraft; onChange: (value: BodyPainDraft) => void }) {
  const [active, setActive] = useState<PainRegion | null>(null);
  const selected = (region: PainRegion) => Object.prototype.hasOwnProperty.call(value, region);
  function toggle(region: PainRegion) {
    if (selected(region)) {
      const next = { ...value }; delete next[region]; onChange(next);
      if (active === region) setActive(null);
    } else { onChange({ ...value, [region]: null }); setActive(region); }
  }
  return <section aria-labelledby="body-pain-title" className="space-y-4">
    <div><p className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary"><MapPin className="size-4" />MAPA CORPORAL DA DOR</p><h2 id="body-pain-title" className="text-xl font-semibold">Onde você sente dor?</h2><p className="mt-2 text-sm text-muted-foreground">Toque nas regiões onde sente dor.</p></div>
    <div className="grid grid-cols-2 gap-4 rounded-2xl bg-secondary/50 px-3 py-4">
      {["Frente", "Costas"].map(view => <div key={view} className="min-w-0 text-center"><p className="mb-2 text-sm font-medium text-muted-foreground">{view}</p><svg viewBox="0 0 140 334" className="mx-auto h-auto w-full max-w-36" aria-label={`Mapa corporal de ${view.toLowerCase()}`}>
        {shapes.map(shape => {
          const region = shape.region === "Peito" && view === "Costas" ? "Costas" : shape.region;
          return <path key={region} d={shape.path} role="button" tabIndex={0} aria-label={`${region} · ${view.toLowerCase()}`} aria-pressed={selected(region)} onClick={() => toggle(region)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(region); } }} stroke="currentColor" strokeWidth="1.5" className={cn("cursor-pointer fill-primary-soft text-primary/35 transition-colors hover:fill-primary/40 focus:fill-primary/40 focus:outline-none", selected(region) && "fill-primary text-primary")} />;
        })}
      </svg></div>)}
    </div>
    <div className="grid grid-cols-2 gap-2">{painRegions.map(region => <Button key={region} type="button" variant="outline" aria-pressed={selected(region)} className={cn("h-auto min-h-12 whitespace-normal rounded-xl px-2 py-3 text-sm", selected(region) && "border-primary bg-primary-soft text-primary")} onClick={() => toggle(region)}>{selected(region) && <Check className="size-4 shrink-0" />}{region}</Button>)}</div>
    {painRegions.filter(selected).map(region => <fieldset key={region} className={cn("rounded-xl border p-3", active === region && "border-primary/50 bg-primary-soft/30")}>
      <legend className="px-1 text-sm font-semibold">{region}{typeof value[region] === "number" && <span className="ml-2 text-primary">{value[region]}/10</span>}</legend>
      <div className="grid grid-cols-6 gap-2">{Array.from({ length: 11 }, (_, intensity) => <Button key={intensity} type="button" variant="outline" aria-label={`${region}: dor ${intensity} de 10`} aria-pressed={value[region] === intensity} onClick={() => { onChange({ ...value, [region]: intensity }); setActive(region); }} className={cn("h-11 rounded-lg px-0 text-base shadow-none", value[region] === intensity && "border-primary bg-primary text-primary-foreground")}>{intensity}</Button>)}</div>
      <div className="mt-2 flex justify-between gap-2 text-xs text-muted-foreground"><span>0 · Sem dor</span><span>10 · Dor máxima</span></div>
    </fieldset>)}
  </section>;
}