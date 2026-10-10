import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Check, ChevronLeft, ChevronRight, Clock, Droplets, Leaf, ShoppingBasket, Users, X, Ban, Sparkles, RefreshCw,
} from "lucide-react";
import { AppShell, IconButtons, Logo } from "@/components/vl/AppShell";
import { ProgressBar, DialogShell } from "@/components/vl/movement";
import { Tabs } from "@/components/vl/nutrition";
import {
  avoid, eatFreely, getDay, mealLabels, mealOrder, parseMeal, principles, recipes, shopping, substitutions,
  tagInfo, weeks, type Tag,
} from "@/data/anti-inflammatory";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alimentacao")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Cardápio anti-inflamatório 21 dias — VivaLeve" },
      { name: "description", content: "Cardápio anti-inflamatório de 21 dias para fibromialgia: refeições do dia, receitas, lista de compras e guia." },
      { property: "og:title", content: "Cardápio anti-inflamatório 21 dias — VivaLeve" },
      { property: "og:description", content: "Três semanas progressivas de alimentação anti-inflamatória, com receitas e compras organizadas." },
    ],
  }),
  component: Alimentacao,
});

type TabKey = "cardapio" | "receitas" | "compras" | "guia";
const WATER_GOAL = 10; // copos de 250 ml = 2,5 L

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const tagStyle: Record<Tag, string> = {
  "FÁCIL": "bg-good-soft text-good",
  CRISE: "bg-primary-soft text-primary",
  PREPARO: "bg-warn-soft text-warn",
};
function TagChip({ tag }: { tag: Tag }) {
  return <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide", tagStyle[tag])} title={tagInfo[tag]}>{tag}</span>;
}

function Alimentacao() {
  const [tab, setTab] = useState<TabKey>("cardapio");
  const [day, setDay] = useState(1);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [water, setWater] = useState<Record<number, number>>({});
  const [bought, setBought] = useState<Record<string, boolean>>({});
  const [shopWeek, setShopWeek] = useState(1);
  const [recipeFilter, setRecipeFilter] = useState<"todas" | Tag>("todas");
  const [openRecipe, setOpenRecipe] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDay(load("vl-ai-day", 1));
    setDone(load("vl-ai-done", {}));
    setWater(load("vl-ai-water", {}));
    setBought(load("vl-ai-shop", {}));
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem("vl-ai-day", JSON.stringify(day)); }, [day, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("vl-ai-done", JSON.stringify(done)); }, [done, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("vl-ai-water", JSON.stringify(water)); }, [water, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("vl-ai-shop", JSON.stringify(bought)); }, [bought, hydrated]);

  const { week, plan } = getDay(day);
  const doneToday = mealOrder.filter((m) => done[`${day}-${m}`]).length;
  const cups = water[day] ?? 0;
  const visibleRecipes = useMemo(
    () => recipes.filter((r) => recipeFilter === "todas" || r.tags.includes(recipeFilter)),
    [recipeFilter],
  );
  const open = recipes.find((r) => r.id === openRecipe) ?? null;
  const list = shopping[shopWeek];
  const boughtCount = list.filter((i) => bought[`${shopWeek}-${i.name}`]).length;

  const tabs = [
    { key: "cardapio", label: "Cardápio" },
    { key: "receitas", label: "Receitas" },
    { key: "compras", label: "Compras" },
    { key: "guia", label: "Guia" },
  ];

  return (
    <AppShell>
      <header className="relative -mx-5 -mt-4 px-5 pb-2 pt-8 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-0 lg:px-10 lg:py-10">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 lg:hidden">
              <Logo className="size-6" />
              <span className="text-xs font-medium tracking-wide text-muted-foreground">VivaLeve</span>
            </div>
            <h1 className="mt-3 text-4xl font-medium lg:mt-0 lg:text-5xl">Minha alimentação</h1>
            <p className="mt-2 text-[15px] text-muted-foreground">Cardápio anti-inflamatório de 21 dias, no seu ritmo.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden size-14 place-items-center rounded-2xl bg-checkin text-primary sm:grid" aria-hidden>
              <Leaf className="size-7" strokeWidth={1.5} />
            </span>
            <div className="lg:hidden"><IconButtons /></div>
          </div>
        </div>
        <div className="mt-5">
          <Tabs tabs={tabs} value={tab} onChange={(k) => setTab(k as TabKey)} />
        </div>
      </header>

      {/* ============ CARDÁPIO ============ */}
      {tab === "cardapio" && (
        <div className="mt-6 space-y-6">
          <section className="card-soft bg-checkin p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Semana {week.n} de 3</p>
            <h2 className="mt-1 text-xl font-medium">{week.title}</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {week.notes.map((n) => <li key={n} className="flex gap-2"><Leaf className="mt-0.5 size-4 shrink-0 text-primary" />{n}</li>)}
            </ul>
            <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Escolher semana">
              {weeks.map((w) => (
                <button key={w.n} onClick={() => setDay(w.days[0].day)} aria-pressed={week.n === w.n}
                  className={cn("min-h-11 rounded-full text-sm font-medium transition",
                    week.n === w.n ? "bg-primary text-primary-foreground shadow-float" : "bg-card text-muted-foreground hover:text-foreground")}>
                  Semana {w.n}
                </button>
              ))}
            </div>
          </section>

          <section aria-label="Dias da semana">
            <div className="grid grid-cols-7 gap-1.5">
              {week.days.map((x) => {
                const active = x.day === day;
                const complete = mealOrder.every((m) => done[`${x.day}-${m}`]);
                return (
                  <button key={x.day} onClick={() => setDay(x.day)} aria-pressed={active} aria-label={`Dia ${x.day}`}
                    className={cn("relative flex min-h-14 flex-col items-center justify-center rounded-2xl border transition",
                      active ? "border-primary bg-primary text-primary-foreground shadow-float" : "bg-card hover:border-primary/50")}>
                    <span className="text-[10px] uppercase tracking-wide opacity-80">Dia</span>
                    <span className="text-lg font-medium leading-none">{x.day}</span>
                    {complete && <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-good text-primary-foreground"><Check className="size-3" /></span>}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button disabled={day === 1} onClick={() => setDay(day - 1)} className="flex min-h-11 items-center gap-1 rounded-full px-3 text-sm text-muted-foreground disabled:opacity-40"><ChevronLeft className="size-4" />Anterior</button>
              <span className="text-sm font-medium">Dia {day} de 21</span>
              <button disabled={day === 21} onClick={() => setDay(day + 1)} className="flex min-h-11 items-center gap-1 rounded-full px-3 text-sm text-muted-foreground disabled:opacity-40">Próximo<ChevronRight className="size-4" /></button>
            </div>
          </section>

          <section className="card-soft p-5">
            <div className="flex items-baseline justify-between">
              <p className="font-medium">Refeições de hoje</p>
              <p className="text-sm text-muted-foreground">{doneToday} de 5</p>
            </div>
            <div className="mt-3"><ProgressBar value={doneToday / 5} /></div>
            <p className="mt-2 text-xs text-muted-foreground">Não há necessidade de perfeição — cada dia melhor já é uma vitória.</p>
          </section>

          <ul className="space-y-3">
            {mealOrder.map((m) => {
              const { text, tags } = parseMeal(plan.meals[m]);
              const key = `${day}-${m}`;
              const isDone = !!done[key];
              return (
                <li key={m} className={cn("card-soft p-5 transition", isDone && "opacity-75")}>
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{mealLabels[m]}</p>
                        {m === "jantar" && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" />{plan.dinnerTime}</span>}
                        {tags.map((t) => <TagChip key={t} tag={t} />)}
                      </div>
                      <p className="mt-2 text-[15px] leading-relaxed">{text}</p>
                    </div>
                    <button role="checkbox" aria-checked={isDone} aria-label={`Marcar ${mealLabels[m]} como feita`}
                      onClick={() => setDone((p) => ({ ...p, [key]: !isDone }))}
                      className={cn("grid size-11 shrink-0 place-items-center rounded-full border-2 transition",
                        isDone ? "border-good bg-good text-primary-foreground" : "border-border hover:border-primary")}>
                      {isDone && <Check className="size-5" />}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          {plan.tip && <p className="rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">Dica: {plan.tip}</p>}

          <section className="card-soft p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-primary-soft text-primary"><Droplets className="size-5" /></span>
              <div className="flex-1">
                <p className="font-medium">Hidratação — regra de ouro</p>
                <p className="text-sm text-muted-foreground">Pelo menos 2,5 litros por dia, de água filtrada.</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {Array.from({ length: WATER_GOAL }, (_, i) => (
                <button key={i} aria-label={`${i + 1} copos`} onClick={() => setWater((w) => ({ ...w, [day]: cups === i + 1 ? i : i + 1 }))}
                  className={cn("grid h-12 place-items-center rounded-2xl border transition", i < cups ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
                  <Droplets className="size-4" />
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{(cups * 0.25).toLocaleString("pt-BR")} L de 2,5 L · copos de 250 ml</p>
          </section>
        </div>
      )}

      {/* ============ RECEITAS ============ */}
      {tab === "receitas" && (
        <div className="mt-6 space-y-5">
          <p className="text-sm text-muted-foreground">Todas sem glúten, sem laticínios convencionais e sem açúcar refinado.</p>
          <div className="flex flex-wrap gap-2">
            {(["todas", "FÁCIL", "CRISE", "PREPARO"] as const).map((f) => (
              <button key={f} onClick={() => setRecipeFilter(f)} aria-pressed={recipeFilter === f}
                className={cn("min-h-10 rounded-full border px-4 text-sm font-medium transition",
                  recipeFilter === f ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
                {f === "todas" ? "Todas" : f === "CRISE" ? "Dias de crise" : f === "FÁCIL" ? "Fáceis" : "Preparo antecipado"}
              </button>
            ))}
          </div>
          {recipeFilter !== "todas" && <p className="text-xs text-muted-foreground">{tagInfo[recipeFilter]}</p>}
          <ul className="grid gap-3 sm:grid-cols-2">
            {visibleRecipes.map((r) => (
              <li key={r.id}>
                <button onClick={() => setOpenRecipe(r.id)} className="card-soft pressable flex h-full w-full flex-col items-start p-5 text-left">
                  <div className="flex flex-wrap gap-1.5">{r.tags.map((t) => <TagChip key={t} tag={t} />)}</div>
                  <p className="mt-2 font-medium">{r.name}</p>
                  <p className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="size-3.5" />{r.time}</span>
                    <span className="flex items-center gap-1"><Users className="size-3.5" />{r.serves}</span>
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ============ COMPRAS ============ */}
      {tab === "compras" && (
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Lista da semana">
            {[1, 2, 3].map((n) => (
              <button key={n} onClick={() => setShopWeek(n)} aria-pressed={shopWeek === n}
                className={cn("min-h-11 rounded-full border text-sm font-medium transition",
                  shopWeek === n ? "border-primary bg-primary text-primary-foreground shadow-float" : "bg-card text-muted-foreground")}>
                Semana {n}
              </button>
            ))}
          </div>
          <section className="card-soft p-5">
            <div className="flex items-baseline justify-between">
              <p className="flex items-center gap-2 font-medium"><ShoppingBasket className="size-4 text-primary" />Lista da semana {shopWeek}</p>
              <p className="text-sm text-muted-foreground">{boughtCount} de {list.length}</p>
            </div>
            <div className="mt-3"><ProgressBar value={boughtCount / list.length} /></div>
            <p className="mt-2 text-xs text-muted-foreground">Prefira alimentos naturais, frescos e integrais. Planeje e evite industrializados.</p>
          </section>
          <ul className="space-y-2">
            {list.map((i) => {
              const k = `${shopWeek}-${i.name}`;
              const c = !!bought[k];
              return (
                <li key={k}>
                  <button role="checkbox" aria-checked={c} onClick={() => setBought((b) => ({ ...b, [k]: !c }))}
                    className={cn("flex min-h-14 w-full items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-left transition", c && "opacity-70")}>
                    <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border-2", c ? "border-good bg-good text-primary-foreground" : "border-border")}>
                      {c && <Check className="size-3.5" />}
                    </span>
                    <span className={cn("flex-1 text-sm font-medium", c && "line-through")}>{i.name}</span>
                    <span className="text-xs text-muted-foreground">{i.qty}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {boughtCount > 0 && (
            <button onClick={() => setBought((b) => Object.fromEntries(Object.entries(b).filter(([k]) => !k.startsWith(`${shopWeek}-`))))}
              className="mx-auto flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-muted-foreground hover:text-foreground">
              <RefreshCw className="size-4" />Desmarcar todos
            </button>
          )}
        </div>
      )}

      {/* ============ GUIA ============ */}
      {tab === "guia" && (
        <div className="mt-6 space-y-8">
          <section>
            <h2 className="text-xl font-medium">Os 5 princípios</h2>
            <ol className="mt-3 space-y-3">
              {principles.map((p, i) => (
                <li key={p.title} className="card-soft flex gap-4 p-5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
                  <div><p className="font-medium">{p.title}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p></div>
                </li>
              ))}
            </ol>
          </section>
          <section className="grid gap-3 sm:grid-cols-2">
            <div className="card-soft p-5">
              <p className="flex items-center gap-2 font-medium text-good"><Sparkles className="size-4" />Consuma livremente</p>
              <ul className="mt-3 space-y-2 text-sm">{eatFreely.map((x) => <li key={x} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-good" />{x}</li>)}</ul>
            </div>
            <div className="card-soft p-5">
              <p className="flex items-center gap-2 font-medium text-alert"><Ban className="size-4" />Evite durante os 21 dias</p>
              <ul className="mt-3 space-y-2 text-sm">{avoid.map((x) => <li key={x} className="flex gap-2"><X className="mt-0.5 size-4 shrink-0 text-alert" />{x}</li>)}</ul>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-medium">Substituições</h2>
            <p className="mt-1 text-sm text-muted-foreground">Não achou ou não gosta de um ingrediente? Troque sem perder o efeito anti-inflamatório.</p>
            <ul className="mt-3 space-y-2">
              {substitutions.map(([a, b, note]) => (
                <li key={a} className="rounded-2xl border bg-card px-4 py-3">
                  <p className="text-sm"><span className="font-medium">{a}</span> <span className="text-muted-foreground">→</span> <span className="font-medium text-primary">{b}</span></p>
                  <p className="text-xs text-muted-foreground">{note}</p>
                </li>
              ))}
            </ul>
          </section>
          <p className="rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">
            Conteúdo do Cardápio anti-inflamatório 21 dias — Dra. Nadya Kazzaz. Pequenas escolhas diárias constroem grandes resultados.
          </p>
        </div>
      )}

      {open && (
        <DialogShell title={open.name} onClose={() => setOpenRecipe(null)}>
          <div className="flex flex-wrap gap-1.5">{open.tags.map((t) => <TagChip key={t} tag={t} />)}</div>
          <h2 className="mt-2 text-2xl font-medium">{open.name}</h2>
          <p className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="size-3.5" />{open.time}</span>
            <span className="flex items-center gap-1"><Users className="size-3.5" />{open.serves}</span>
          </p>
          <h3 className="mt-5 font-medium">Ingredientes</h3>
          <ul className="mt-2 space-y-1.5 text-[15px]">{open.ingredients.map((x) => <li key={x} className="flex gap-2"><Leaf className="mt-1 size-3.5 shrink-0 text-primary" />{x}</li>)}</ul>
          <h3 className="mt-5 font-medium">Modo de preparo</h3>
          <ol className="mt-2 space-y-2 text-[15px]">
            {open.steps.map((s, i) => <li key={s} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">{i + 1}</span>{s}</li>)}
          </ol>
          {open.tip && <p className="mt-5 rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">Dica: {open.tip}</p>}
          <button onClick={() => setOpenRecipe(null)} className="mt-6 min-h-12 w-full rounded-full bg-primary font-medium text-primary-foreground">Voltar</button>
        </DialogShell>
      )}
    </AppShell>
  );
}
