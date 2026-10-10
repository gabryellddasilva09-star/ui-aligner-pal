import { useState, type FormEvent } from "react";
import { z } from "zod";
import { BatteryLow, Check, CheckCircle2, Frown, Heart, Meh, Moon, Smile, Sparkles, Sun, Wind, Zap, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BodyPainMap } from "@/components/vl/body-pain-map";
import { bodyPainSchema, type BodyPainDraft } from "@/data/body-pain";

export const dailyRecordSchema = z.object({
  mood: z.enum(["Feliz", "Tranquila", "Neutra", "Triste", "Ansiosa"]),
  sleep: z.enum(["Dormi bem", "Dormi mais ou menos", "Dormi mal"]),
  pain: z.number().int().min(0).max(10),
  fatigue: z.enum(["Nenhum", "Leve", "Moderado", "Intenso"]),
  disposition: z.enum(["Boa", "Mais ou menos", "Baixa"]),
  bodyPain: bodyPainSchema.optional(),
});
export type DailyRecord = z.infer<typeof dailyRecordSchema>;
const moods = [{ label: "Feliz", icon: Smile }, { label: "Tranquila", icon: Wind }, { label: "Neutra", icon: Meh }, { label: "Triste", icon: Frown }, { label: "Ansiosa", icon: Heart }];
const sleeps = [{ label: "Dormi bem", icon: Moon }, { label: "Dormi mais ou menos", icon: Meh }, { label: "Dormi mal", icon: BatteryLow }];

function Choices({ title, icon: Icon, options, value, onChange, className }: {
  title: string; icon: LucideIcon; options: { label: string; icon?: LucideIcon }[];
  value: string | undefined; onChange: (value: string) => void; className?: string;
}) {
  return <fieldset className="min-w-0">
    <legend className="mb-3 flex items-center gap-2 text-base font-semibold"><Icon className="size-5 text-primary" />{title}</legend>
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {options.map(({ label, icon: OptionIcon }) => <Button key={label} type="button" variant="outline" aria-pressed={value === label}
        onClick={() => onChange(label)} className={cn("h-auto min-h-14 whitespace-normal rounded-xl px-2 py-3 text-center leading-snug shadow-none", OptionIcon && "flex-col gap-2", value === label && "border-primary bg-primary-soft text-primary ring-1 ring-primary")}>
        {OptionIcon && <OptionIcon className="size-6" strokeWidth={1.7} />}{label}
      </Button>)}
    </div>
  </fieldset>;
}

export function DailyCheckIn({ open, onOpenChange, record, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; record: DailyRecord | null; onSave: (record: DailyRecord) => void }) {
  const [draft, setDraft] = useState<Partial<DailyRecord>>(record ?? {});
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [bodyPain, setBodyPain] = useState<BodyPainDraft>(record?.bodyPain ?? {});
  function select(key: keyof DailyRecord, value: string | number) {
    setDraft(current => ({ ...current, [key]: value }));
    setError(false);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    const result = dailyRecordSchema.safeParse({ ...draft, ...(Object.keys(bodyPain).length ? { bodyPain } : {}) });
    if (!result.success) { setError(true); return; }
    onSave(result.data);
    setSaved(true);
  }
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="checkin-dialog max-h-[100dvh] overflow-y-auto border-0 p-0 sm:max-h-[90dvh] sm:max-w-xl sm:rounded-3xl">
      {saved ? <div className="px-6 py-12 text-center sm:px-9">
        <CheckCircle2 className="mx-auto mb-5 size-14 text-good" strokeWidth={1.5} />
        <DialogTitle className="text-2xl">Seu registro foi salvo</DialogTitle>
        <DialogDescription className="mt-3">Obrigada por compartilhar como foi seu dia.</DialogDescription>
        <dl className="my-7 grid grid-cols-2 gap-3 rounded-2xl bg-secondary p-5 text-left text-sm">
          {[["Humor", draft.mood], ["Sono", draft.sleep], ["Dor", `${draft.pain}/10`], ["Cansaço", draft.fatigue], ["Disposição", draft.disposition]].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}
        </dl>
        {Object.keys(bodyPain).length > 0 && <div className="mb-7 text-left"><h3 className="mb-3 font-semibold">Mapa corporal da dor</h3><dl className="space-y-2 text-sm">{Object.entries(bodyPain).map(([region, intensity]) => <div key={region} className="flex justify-between gap-3"><dt className="text-muted-foreground">{region}</dt><dd className="font-medium text-primary">{intensity}/10</dd></div>)}</dl></div>}
        <Button className="h-14 w-full rounded-xl text-base" onClick={() => onOpenChange(false)}>Voltar ao início</Button>
        <Button variant="ghost" className="mt-2 h-12" onClick={() => setSaved(false)}>Editar meu registro</Button>
      </div> : <form onSubmit={submit} noValidate>
        <div className="bg-checkin px-5 pb-6 pt-8 sm:px-8">
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-primary"><Sparkles className="size-4" /> SEU MOMENTO DE CUIDADO</span>
          <DialogTitle className="pr-5 text-2xl font-medium leading-tight tracking-normal">Como você está se sentindo hoje?</DialogTitle>
          <DialogDescription className="mt-2 text-muted-foreground">Cada dia é diferente. Como foi o seu?</DialogDescription>
        </div>
        <div className="space-y-7 px-5 py-7 sm:px-8">
          <Choices title="Humor" icon={Smile} options={moods} value={draft.mood} onChange={value => select("mood", value)} className="grid-cols-3 sm:grid-cols-5" />
          <Choices title="Sono" icon={Moon} options={sleeps} value={draft.sleep} onChange={value => select("sleep", value)} />
          <fieldset>
            <legend className="mb-3 flex items-center gap-2 text-base font-semibold"><Heart className="size-5 text-pain" />Nível de dor{draft.pain !== undefined && <span className="ml-1 text-sm font-medium text-primary">{draft.pain}/10</span>}</legend>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 11 }, (_, value) => <Button key={value} type="button" variant="outline" aria-label={`Dor ${value} de 10`} aria-pressed={draft.pain === value} onClick={() => select("pain", value)}
                className={cn("h-12 rounded-xl px-0 text-base shadow-none", value <= 3 ? "bg-good-soft" : value <= 6 ? "bg-warn-soft" : "bg-alert-soft", draft.pain === value && "border-primary bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background")}>{value}</Button>)}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>0 · Sem dor</span><span>10 · Dor máxima</span></div>
          </fieldset>
          <BodyPainMap value={bodyPain} onChange={value => { setBodyPain(value); setError(false); }} />
          <Choices title="Cansaço" icon={BatteryLow} options={["Nenhum", "Leve", "Moderado", "Intenso"].map(label => ({ label }))} value={draft.fatigue} onChange={value => select("fatigue", value)} className="grid-cols-2 sm:grid-cols-4" />
          <Choices title="Como foi sua disposição hoje?" icon={Sun} options={[{ label: "Boa", icon: Zap }, { label: "Mais ou menos", icon: Meh }, { label: "Baixa", icon: BatteryLow }]} value={draft.disposition} onChange={value => select("disposition", value)} />
          {error && <p role="alert" className="text-sm text-destructive">Selecione uma opção em cada pergunta e a intensidade de cada região marcada para salvar seu registro.</p>}
          <Button type="submit" className="h-14 w-full rounded-xl text-base shadow-float"><Check className="size-5" />Salvar meu registro</Button>
        </div>
      </form>}
    </DialogContent>
  </Dialog>;
}
