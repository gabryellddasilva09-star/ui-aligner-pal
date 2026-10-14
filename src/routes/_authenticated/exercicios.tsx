import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/vl/AppShell";
import { DialogShell } from "@/components/vl/movement";
import { cn } from "@/lib/utils";
import pescoco from "@/assets/ex-pescoco.jpg";
import ombros from "@/assets/ex-ombros.jpg";
import bracos from "@/assets/ex-bracos.jpg";
import quadril from "@/assets/ex-quadril.jpg";
import pernas from "@/assets/ex-pernas.jpg";
import cadeira from "@/assets/ex-cadeira.jpg";

export const Route = createFileRoute("/_authenticated/exercicios")({
  head: () => ({
    meta: [
      { title: "Exercícios — VivaLeve" },
      { name: "description", content: "Todos os exercícios suaves disponíveis para montar seu plano de movimento." },
      { property: "og:title", content: "Exercícios — VivaLeve" },
      { property: "og:description", content: "Exercícios de baixo impacto para se movimentar no seu ritmo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Exercicios,
});

type Ex = { id: string; name: string; min: number; cat: string; img: string; beginner: boolean; guided: boolean; steps: string[] };

const exercises: Ex[] = [
  { id: "pescoco", name: "Alongamento de pescoço", min: 5, cat: "Mobilidade", img: pescoco, beginner: true, guided: false,
    steps: ["Sente-se com a coluna reta.", "Incline a cabeça devagar para um lado, sem forçar.", "Respire fundo por alguns segundos.", "Volte ao centro e repita do outro lado."] },
  { id: "ombros", name: "Rotação de ombros", min: 5, cat: "Mobilidade", img: ombros, beginner: true, guided: false,
    steps: ["Deixe os braços soltos ao lado do corpo.", "Faça círculos lentos com os ombros para trás.", "Depois, faça círculos para frente.", "Mantenha a respiração tranquila."] },
  { id: "bracos", name: "Alongamento de braços", min: 6, cat: "Mobilidade", img: bracos, beginner: true, guided: false,
    steps: ["Entrelace os dedos à frente do corpo.", "Estique os braços para frente com suavidade.", "Segure alguns segundos respirando.", "Solte devagar."] },
  { id: "quadril", name: "Mobilidade de quadril", min: 7, cat: "Mobilidade", img: quadril, beginner: false, guided: true,
    steps: ["Sente-se no chão ou num colchonete.", "Dobre uma perna e gire o tronco suavemente.", "Fique alguns segundos e volte.", "Repita do outro lado."] },
  { id: "pernas", name: "Fortalecimento de pernas", min: 8, cat: "Fortalecimento", img: pernas, beginner: false, guided: true,
    steps: ["Fique em pé com os pés afastados.", "Dobre levemente os joelhos, como se fosse sentar.", "Suba devagar.", "Faça poucas repetições, sem dor."] },
  { id: "cadeira", name: "Exercícios na cadeira", min: 10, cat: "Fortalecimento", img: cadeira, beginner: true, guided: true,
    steps: ["Sente-se em uma cadeira firme.", "Levante os braços devagar, com ou sem peso leve.", "Estique uma perna de cada vez.", "Descanse sempre que precisar."] },
];

const filters = [
  { key: "all", label: "Todos" },
  { key: "beginner", label: "Para iniciantes" },
  { key: "guided", label: "Com orientação" },
] as const;

function Exercicios() {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");
  const [open, setOpen] = useState<Ex | null>(null);
  const list = exercises.filter((e) => filter === "all" || (filter === "beginner" ? e.beginner : e.guided));

  return (
    <AppShell>
      <header className="flex items-center gap-3 pt-4">
        <Link to="/plano" aria-label="Voltar" className="pressable grid size-11 place-items-center rounded-full bg-card shadow-sm">
          <ChevronLeft className="size-5 text-primary" />
        </Link>
        <h1 className="text-3xl font-medium">Exercícios</h1>
      </header>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={cn("shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition",
              filter === f.key ? "bg-primary text-primary-foreground shadow" : "bg-secondary text-foreground")}>
            {f.label}
          </button>
        ))}
      </div>

      <ul className="mt-5 space-y-3">
        {list.map((e) => (
          <li key={e.id}>
            <button onClick={() => setOpen(e)} className="card-soft pressable flex w-full items-center gap-4 p-3 text-left">
              <img src={e.img} alt="" width={816} height={816} loading="lazy" className="size-24 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug">{e.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{e.min} min • {e.cat}</p>
                <span className="mt-2 inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">Baixo impacto</span>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <DialogShell title={open.name} onClose={() => setOpen(null)}>
          <img src={open.img} alt={open.name} className="aspect-square w-full rounded-3xl object-cover" />
          <h2 className="mt-4 font-display text-2xl font-medium">{open.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{open.min} min • {open.cat} • Baixo impacto</p>
          <ol className="mt-4 space-y-2">
            {open.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="mt-4 flex gap-3 rounded-2xl bg-secondary p-4 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="size-5 shrink-0 text-primary" />
            Faça só o que for confortável. Pare se sentir dor, tontura ou desconforto.
          </div>
          <button onClick={() => setOpen(null)} className="pressable mt-5 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground">Fechar</button>
        </DialogShell>
      )}
    </AppShell>
  );
}
