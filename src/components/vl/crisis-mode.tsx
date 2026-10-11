import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Wind, Bed, Flame, Phone, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const steps = [
  { icon: Wind, title: "Primeiro, respire", text: ["Você não está sozinha. Esta crise vai passar.", "Inspire devagar pelo nariz contando até 4.", "Solte o ar pela boca, bem devagar, contando até 6.", "Repita algumas vezes, no seu ritmo."], extra: "breath" },
  { icon: Bed, title: "Encontre uma posição de alívio", text: ["Deite-se de lado com um travesseiro entre os joelhos, ou de barriga para cima com um travesseiro embaixo dos joelhos.", "Se preferir ficar sentada, apoie bem as costas e os pés.", "Solte os ombros e a mandíbula. Não force nenhum movimento."] },
  { icon: Flame, title: "Calor suave", text: ["Uma compressa morna ou bolsa de água morna nas áreas doloridas pode trazer conforto.", "Use por cerca de 15 a 20 minutos, sempre com um pano entre a pele e a bolsa.", "Confira a temperatura antes: morna, nunca quente. Um banho morno também ajuda."] },
  { icon: Phone, title: "Quando procurar ajuda", text: ["Procure atendimento se a dor for muito diferente da habitual, vier com febre, falta de ar, dor no peito, fraqueza ou dormência repentina.", "Também procure ajuda se a dor não melhorar com o que costuma aliviar.", "Se estiver pensando em se machucar, ligue 188 (CVV), gratuito e 24 horas."] },
] as const;

export function CrisisMode({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [i, setI] = useState(0);
  const step = steps[i]!;
  const Icon = step.icon;
  const last = i === steps.length - 1;
  return <Dialog open={open} onOpenChange={o => { onOpenChange(o); if (!o) setI(0); }}>
    <DialogContent className="checkin-dialog max-h-[100dvh] overflow-y-auto border-0 p-0 sm:max-h-[90dvh] sm:max-w-lg sm:rounded-3xl">
      <div className="bg-checkin px-6 pb-6 pt-9">
        <p className="text-sm font-semibold text-primary">Passo {i + 1} de {steps.length}</p>
        <div className="mt-2 flex gap-1.5">{steps.map((_, j) => <span key={j} className={`h-1.5 flex-1 rounded-full ${j <= i ? "bg-primary" : "bg-card"}`} />)}</div>
        <span className="mt-6 grid size-14 place-items-center rounded-full bg-card text-primary"><Icon className="size-7" /></span>
        <DialogTitle className="mt-4 text-3xl font-medium leading-tight">{step.title}</DialogTitle>
        <DialogDescription className="sr-only">Passo a passo calmo para atravessar uma crise de dor.</DialogDescription>
      </div>
      <div className="space-y-5 px-6 py-7">
        {"extra" in step && <div aria-hidden className="relax-breath-moving mx-auto size-32 rounded-full bg-primary-soft" />}
        <ul className="space-y-4">{step.text.map(t => <li key={t} className="text-lg leading-relaxed">{t}</li>)}</ul>
        {last && <div className="grid gap-2">
          <Button asChild className="h-14 rounded-xl text-base"><a href="tel:192"><Phone className="size-5" />Emergência: ligar 192 (SAMU)</a></Button>
          <Button asChild variant="outline" className="h-14 rounded-xl text-base"><a href="tel:188"><HeartHandshake className="size-5" />Conversar: ligar 188 (CVV)</a></Button>
          <Button asChild variant="ghost" className="h-12 text-base"><Link to="/relaxamento" onClick={() => onOpenChange(false)}>Ir para a respiração guiada</Link></Button>
        </div>}
        <div className="flex gap-2 pt-2">
          {i > 0 && <Button variant="outline" className="h-14 flex-1 rounded-xl text-base" onClick={() => setI(i - 1)}><ArrowLeft />Voltar</Button>}
          {last ? <Button className="h-14 flex-1 rounded-xl text-base" onClick={() => { onOpenChange(false); setI(0); }}>Estou melhor</Button>
            : <Button className="h-14 flex-1 rounded-xl text-base" onClick={() => setI(i + 1)}>Próximo<ArrowRight /></Button>}
        </div>
      </div>
    </DialogContent>
  </Dialog>;
}
