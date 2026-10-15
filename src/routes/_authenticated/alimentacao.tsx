import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Check, ChevronLeft, Clock, Droplets, Leaf, ShoppingBasket, Users, Sparkles, RefreshCw, ChefHat, Search, Minus, Plus, ArrowRight,
} from "lucide-react";
import { AppShell, Logo } from "@/components/vl/AppShell";
import { ProgressBar, DialogShell } from "@/components/vl/movement";
import { Button } from "@/components/ui/button";
import { FoodVisual } from "@/components/vl/nutrition-visuals";
import {
  recipes, shopping, tagInfo, type Tag, recipeCategoryLabels, recipeCategoryOrder, type RecipeCategory,
} from "@/data/anti-inflammatory";
import { planDays } from "@/data/movement";
import { cn } from "@/lib/utils";
import { useRecipeSchedule, useSaveRecipeSchedule } from "@/lib/recipe-schedule";

const weekdayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const Route = createFileRoute("/_authenticated/alimentacao")({
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
  return <span className={cn("rounded-full px-2.5 py-0.5 text-sm font-medium", tagStyle[tag])} title={tagInfo[tag]}>{tag === "FÁCIL" ? "Fácil de preparar" : tag === "CRISE" ? "Dias difíceis" : "Prepare antes"}</span>;
}

function Alimentacao() {
  const [tab, setTab] = useState<TabKey>("cardapio");
  const [day, setDay] = useState(() => new Date().getDay());
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [water, setWater] = useState<Record<number, number>>({});
  const [bought, setBought] = useState<Record<string, boolean>>({});
  const [shopWeek, setShopWeek] = useState<1 | 2 | 3>(1);
  const [recipeFilter, setRecipeFilter] = useState<"todas" | Tag>("todas");
  const [openRecipe, setOpenRecipe] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"todas" | RecipeCategory>("todas");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const schedule = useRecipeSchedule();
  const saveSchedule = useSaveRecipeSchedule();
  const daysFor = (id: string) => schedule.data?.find((x) => x.recipe_id === id)?.weekdays ?? [];
  const openRecipeDialog = (id: string) => { saveSchedule.reset(); setSelectedDays(daysFor(id)); setOpenRecipe(id); };
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDay(load("vl-ai-weekday", new Date().getDay()));
    setDone(load("vl-ai-done", {}));
    setWater(load("vl-ai-water", {}));
    setBought(load("vl-ai-shop", {}));
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem("vl-ai-weekday", JSON.stringify(day)); }, [day, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("vl-ai-done", JSON.stringify(done)); }, [done, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("vl-ai-water", JSON.stringify(water)); }, [water, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("vl-ai-shop", JSON.stringify(bought)); }, [bought, hydrated]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [tab]);

  const mealsOfDay = useMemo(
    () => recipeCategoryOrder.flatMap((c) => recipes.filter((r) => r.category === c && daysFor(r.id).includes(day))),
    [schedule.data, day],
  );
  const doneToday = mealsOfDay.filter((r) => done[`${day}-${r.id}`]).length;
  const cups = water[day] ?? 0;
  const visibleRecipes = useMemo(
    () => recipes.filter((r) => (categoryFilter === "todas" || r.category === categoryFilter) && (recipeFilter === "todas" || r.tags.includes(recipeFilter)) && r.name.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR"))),
    [recipeFilter, categoryFilter, search],
  );
  const open = recipes.find((r) => r.id === openRecipe) ?? null;
  const list = shopping[shopWeek];
  const boughtCount = list.filter((i) => bought[`${shopWeek}-${i.name}`]).length;

  return (
    <AppShell>
      <div className="nutrition-screen">
      <header className="pt-4 sm:pt-6">
        <div className="min-w-0">
          <h1 className="sr-only text-3xl font-medium sm:text-4xl lg:not-sr-only">Minha alimentação</h1>
          <p className="mt-2 hidden text-base text-muted-foreground sm:text-lg lg:block">Organize suas refeições de um jeito mais leve.</p>
        </div>
      </header>
      <div>

      {/* ============ CARDÁPIO ============ */}
      {tab === "cardapio" && (
        <div className="mt-6 space-y-6">
          <section aria-label="Escolher dia do cardápio">
            <div className="grid grid-cols-7 gap-1.5" role="group" aria-label="Dias da semana">
              {planDays.map((d, i) => {
                const planDay = (week.n - 1) * 7 + i + 1;
                const selected = day === planDay;
                return (
                  <Button key={d} onClick={() => setDay(planDay)} aria-pressed={selected}
                    aria-label={`Dia ${planDay} · ${d}`} variant="ghost"
                    className={cn(
                      "pressable h-auto min-h-14 flex-col gap-0.5 rounded-2xl px-1 py-2 text-[11px] font-semibold transition sm:text-sm",
                      selected
                        ? "bg-primary text-primary-foreground shadow-float"
                        : i === todayIndex
                          ? "bg-primary-soft text-primary"
                          : "bg-secondary text-muted-foreground",
                    )}>
                    <span>{d}</span>
                    <span className="text-[10px] font-normal sm:text-xs">Dia {planDay}</span>
                  </Button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <Button variant="ghost" className="min-h-11 rounded-full px-3 text-sm text-muted-foreground" disabled={week.n === 1} aria-label="Voltar para a semana anterior" onClick={() => setDay((week.n - 2) * 7 + ((day - 1) % 7) + 1)}><ChevronLeft className="size-4" />Semana anterior</Button>
              <Button variant="ghost" className="min-h-11 rounded-full px-3 text-sm text-muted-foreground" disabled={week.n === 3} aria-label="Avançar para a próxima semana" onClick={() => setDay(week.n * 7 + ((day - 1) % 7) + 1)}>Próxima semana<ChevronRight className="size-4" /></Button>
            </div>
            <NutritionDisclosure title={`Sobre a semana ${week.n}`}>
              <h3 className="mb-3 text-lg font-medium">{week.title}</h3>
              <ul className="space-y-3 text-muted-foreground">{week.notes.map((n) => <li key={n} className="flex gap-2"><Leaf className="mt-1 size-5 shrink-0 text-good" />{n}</li>)}</ul>
            </NutritionDisclosure>
          </section>
          <section className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-medium">Suas refeições</h2>
            <span className="text-sm text-muted-foreground">{doneToday} de 5 registradas</span>
          </section>
          <ul className="space-y-3">
            {mealOrder.map((m) => {
              const { text, tags } = parseMeal(plan.meals[m]);
              const key = `${day}-${m}`;
              const isDone = !!done[key];
              return (
                <li key={m} className={cn("card-soft overflow-hidden transition", isDone && "border-good/40")}>
                  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4 sm:p-5">
                    <FoodVisual text={text} />
                    <div className="min-w-0">
                      <h3 className="text-lg font-medium sm:text-xl">{mealLabels[m]}</h3>
                      {m === "jantar" && <span className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Clock className="size-4" />{plan.dinnerTime}</span>}
                      <p className="mt-1 text-sm text-muted-foreground">{isDone ? "Refeição registrada" : "Seu cardápio do dia"}</p>
                    </div>
                    <Button variant="ghost" role="checkbox" aria-checked={isDone} aria-label={`Marcar ${mealLabels[m]} como feita`}
                      onClick={() => setDone((p) => ({ ...p, [key]: !isDone }))}
                      className={cn("size-12 shrink-0 rounded-full border-2 p-0", isDone ? "border-good bg-good text-primary-foreground hover:bg-good hover:text-primary-foreground" : "border-border bg-secondary text-muted-foreground")}>
                      <Check className="size-5" />
                    </Button>
                  </div>
                  <div className="border-t bg-secondary/40 px-4 py-4 sm:px-5">
                    <p className="text-base leading-relaxed sm:text-lg">{text.split(" + ")[0]}</p>
                    <NutritionDisclosure title="Ver refeição completa" className="border-0 pb-0">
                      <p>{text}</p>
                      <div className="mt-3 flex flex-wrap gap-2">{tags.map((t) => <TagChip key={t} tag={t} />)}</div>
                    </NutritionDisclosure>
                  </div>
                </li>
              );
            })}
          </ul>
          {(() => {
            const wd = (day - 1) % 7;
            const mine = recipes.filter((r) => daysFor(r.id).includes(wd));
            if (mine.length === 0) return null;
            return (
              <section className="card-soft p-5">
                <h2 className="text-xl font-medium">Suas receitas de {weekdayNames[wd]?.toLowerCase()}</h2>
                <ul className="mt-3 space-y-2">
                  {recipeCategoryOrder.flatMap((c) => mine.filter((r) => r.category === c).map((r) => (
                    <li key={r.id}>
                      <Button variant="ghost" onClick={() => openRecipeDialog(r.id)} className="h-auto min-h-14 w-full justify-start gap-3 whitespace-normal rounded-xl bg-secondary/60 px-3 py-2 text-left">
                        <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-primary">{recipeCategoryLabels[c]}</span><span className="block text-base font-medium">{r.name}</span></span>
                        <ArrowRight className="shrink-0 text-primary" />
                      </Button>
                    </li>
                  )))}
                </ul>
              </section>
            );
          })()}
          {plan.tip && <p className="rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">Dica: {plan.tip}</p>}

          <section className="rounded-2xl bg-nutrition-blue-soft p-5 sm:p-6">
            <div className="flex items-center gap-3"><Droplets className="size-7 shrink-0 text-nutrition-blue" /><div><h2 className="text-xl font-medium">Sua água de hoje</h2><p className="text-base text-nutrition-blue">{cups} copos · {(cups * 0.25).toLocaleString("pt-BR")} litros</p></div></div>
            <div className="mt-5 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
              <Button variant="outline" className="size-12 rounded-full p-0" aria-label="Retirar um copo" disabled={cups === 0} onClick={() => setWater((w) => ({ ...w, [day]: Math.max(0, cups - 1) }))}><Minus /></Button>
              <div className="grid grid-cols-5 gap-2">{Array.from({ length: WATER_GOAL }, (_, i) => <Droplets key={i} className={cn("mx-auto size-5", i < cups ? "text-nutrition-blue" : "text-nutrition-blue/25")} />)}</div>
              <Button className="size-12 rounded-full bg-nutrition-blue p-0 hover:bg-nutrition-blue/90" aria-label="Adicionar um copo" disabled={cups >= WATER_GOAL} onClick={() => setWater((w) => ({ ...w, [day]: cups + 1 }))}><Plus /></Button>
            </div>
            <p className="mt-4 text-sm text-nutrition-blue">Referência do cardápio: 2,5 L por dia · copos de 250 ml.</p>
          </section>
          <div className="space-y-3">
            <Button variant="outline" className="h-auto min-h-14 w-full whitespace-normal rounded-2xl text-base" onClick={() => setTab("receitas")}><ChefHat />Editar cardápio<ArrowRight /></Button>
            <Button variant="outline" className="h-auto min-h-14 w-full whitespace-normal rounded-2xl text-base" onClick={() => { setShopWeek(week.n as 1 | 2 | 3); setTab("compras"); }}><ShoppingBasket />Ver compras da semana {week.n}<ArrowRight /></Button>
            <Button variant="outline" className="h-auto min-h-14 w-full whitespace-normal rounded-2xl text-base" onClick={() => setTab("guia")}><BookOpen />Ver guia da alimentação<ArrowRight /></Button>
          </div>
        </div>
      )}

      {/* ============ RECEITAS ============ */}
      {tab === "receitas" && (
        <div className="mt-6 space-y-5">
          <Button variant="ghost" onClick={() => setTab("cardapio")} className="min-h-12 rounded-full px-4 text-base text-muted-foreground"><ChevronLeft className="size-4" />Voltar ao cardápio</Button>
          <h2 className="text-2xl font-medium">O que vamos preparar?</h2>
          <label className="flex min-h-14 items-center gap-3 rounded-xl border bg-card px-4"><Search className="size-5 shrink-0 text-primary" /><input aria-label="Buscar receita" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar receita" className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none" /></label>
          <p className="text-base text-muted-foreground">Todas sem glúten, sem laticínios convencionais e sem açúcar refinado.</p>
          <div className="flex flex-wrap gap-2">
            {(["todas", "FÁCIL", "CRISE", "PREPARO"] as const).map((f) => (
              <Button variant="ghost" key={f} onClick={() => setRecipeFilter(f)} aria-pressed={recipeFilter === f}
                className={cn("min-h-12 rounded-xl border px-4 text-base font-medium transition",
                  recipeFilter === f ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
                {f === "todas" ? "Todas" : f === "CRISE" ? "Dias de crise" : f === "FÁCIL" ? "Fáceis" : "Preparo antecipado"}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Categorias">
            {(["todas", ...recipeCategoryOrder] as const).map((c) => (
              <Button variant="ghost" key={c} onClick={() => setCategoryFilter(c)} aria-pressed={categoryFilter === c}
                className={cn("min-h-11 rounded-full border px-4 text-sm font-medium", categoryFilter === c ? "border-primary bg-primary-soft text-primary" : "bg-card text-muted-foreground")}>
                {c === "todas" ? "Todas as refeições" : recipeCategoryLabels[c]}
              </Button>
            ))}
          </div>
          {recipeFilter !== "todas" && <p className="text-xs text-muted-foreground">{tagInfo[recipeFilter]}</p>}
          <ul className="grid gap-3 sm:grid-cols-2">
            {visibleRecipes.map((r) => (
              <li key={r.id}>
                <Button variant="ghost" onClick={() => openRecipeDialog(r.id)} className="card-soft pressable h-full w-full flex-col items-stretch justify-start overflow-hidden whitespace-normal p-0 text-left hover:bg-card">
                  <FoodVisual text={r.name} large />
                  <div className="p-5"><p className="text-sm font-semibold text-primary">{recipeCategoryLabels[r.category]}</p><p className="text-xl font-medium">{r.name}</p>
                    <p className="mt-3 flex flex-wrap items-center gap-3 text-base text-muted-foreground"><span className="flex items-center gap-1"><Clock />{r.time}</span><span className="flex items-center gap-1"><Users />{r.serves}</span></p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">{r.tags.map((t) => <TagChip key={t} tag={t} />)}
                      {daysFor(r.id).length > 0 && <span className="ml-auto flex flex-wrap justify-end gap-1">{daysFor(r.id).map((d) => <span key={d} className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">{planDays[d]}</span>)}</span>}
                    </div>
                    <span className="mt-4 flex items-center gap-2 text-base font-semibold text-primary">Ver receita<ArrowRight /></span>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
          {visibleRecipes.length === 0 && <p className="py-6 text-center text-lg">Nenhuma receita encontrada.</p>}
        </div>
      )}

      {/* ============ COMPRAS ============ */}
      {tab === "compras" && (
        <div className="mt-6 space-y-5">
          <Button variant="ghost" onClick={() => setTab("cardapio")} className="min-h-12 rounded-full px-4 text-base text-muted-foreground"><ChevronLeft className="size-4" />Voltar ao cardápio</Button>
          <h2 className="text-2xl font-medium">Sua lista está pronta</h2>
          <p className="text-base text-muted-foreground">Ingredientes do cardápio, organizados por semana.</p>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Lista da semana">
            {([1, 2, 3] as const).map((n) => (
              <Button variant="ghost" key={n} onClick={() => setShopWeek(n)} aria-pressed={shopWeek === n}
                className={cn("min-h-12 rounded-xl border text-base font-medium transition",
                  shopWeek === n ? "border-primary bg-primary text-primary-foreground shadow-float" : "bg-card text-muted-foreground")}>
                Semana {n}
              </Button>
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
                  <Button variant="ghost" role="checkbox" aria-checked={c} onClick={() => setBought((b) => ({ ...b, [k]: !c }))}
                    className={cn("flex min-h-20 w-full items-center gap-3 rounded-2xl border bg-card px-4 py-4 text-left transition whitespace-normal h-auto justify-start", c && "opacity-70")}>
                    <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border-2", c ? "border-good bg-good text-primary-foreground" : "border-border")}>
                      {c && <Check className="size-3.5" />}
                    </span>
                    <span className="min-w-0 flex-1"><span className={cn("block text-base font-medium", c && "line-through")}>{i.name}</span><span className="mt-1 block text-base text-muted-foreground">{i.qty}</span></span>
                  </Button>
                </li>
              );
            })}
          </ul>
          {boughtCount > 0 && (
            <Button variant="ghost" onClick={() => setBought((b) => Object.fromEntries(Object.entries(b).filter(([k]) => !k.startsWith(`${shopWeek}-`))))}
              className="mx-auto flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-muted-foreground hover:text-foreground">
              <RefreshCw className="size-4" />Desmarcar todos
            </Button>
          )}
        </div>
      )}

      {/* ============ GUIA ============ */}
      {tab === "guia" && (
        <div className="mt-6 space-y-8">
          <Button variant="ghost" onClick={() => setTab("cardapio")} className="min-h-12 rounded-full px-4 text-base text-muted-foreground"><ChevronLeft className="size-4" />Voltar ao cardápio</Button>
          <h2 className="text-2xl font-medium">Seu guia de alimentação</h2>
          <p className="text-base text-muted-foreground">Orientações do material da Dra. Nadya Kazzaz.</p>
          <NutritionDisclosure title="Os 5 princípios">
            <ol className="mt-3 space-y-3">
              {principles.map((p, i) => (
                <li key={p.title} className="flex gap-4 border-b py-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
                  <div><p className="font-medium">{p.title}</p><p className="mt-1 text-base leading-relaxed text-muted-foreground">{p.text}</p></div>
                </li>
              ))}
            </ol>
          </NutritionDisclosure>
          <section>
            <NutritionDisclosure title="O que consumir livremente" className="text-good">
              <ul className="mt-3 space-y-2 text-base">{eatFreely.map((x) => <li key={x} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-good" />{x}</li>)}</ul>
            </NutritionDisclosure>
            <NutritionDisclosure title="O que evitar durante os 21 dias">
              <ul className="mt-3 space-y-2 text-base">{avoid.map((x) => <li key={x} className="flex gap-2"><X className="mt-0.5 size-4 shrink-0 text-alert" />{x}</li>)}</ul>
            </NutritionDisclosure>
          </section>
          <NutritionDisclosure title="Trocas de ingredientes">
            <p className="mt-1 text-sm text-muted-foreground">Não achou ou não gosta de um ingrediente? Troque sem perder o efeito anti-inflamatório.</p>
            <ul className="mt-3 space-y-2">
              {substitutions.map(([a, b, note]) => (
                <li key={a} className="rounded-2xl border bg-card px-4 py-3">
                  <p className="text-base"><span className="font-medium">{a}</span> <span className="text-muted-foreground">→</span> <span className="font-medium text-primary">{b}</span></p>
                  <p className="mt-2 text-base text-muted-foreground">{note}</p>
                </li>
              ))}
            </ul>
          </NutritionDisclosure>
          <p className="rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">
            Conteúdo do Cardápio anti-inflamatório 21 dias — Dra. Nadya Kazzaz. Pequenas escolhas diárias constroem grandes resultados.
          </p>
        </div>
      )}

      </div>
      {open && (
        <DialogShell title={open.name} onClose={() => setOpenRecipe(null)}>
          <div className="mb-5 overflow-hidden rounded-2xl"><FoodVisual text={open.name} large /></div>
          <div className="flex flex-wrap gap-1.5">{open.tags.map((t) => <TagChip key={t} tag={t} />)}</div>
          <h2 className="mt-2 text-2xl font-medium">{open.name}</h2>
          <p className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="size-3.5" />{open.time}</span>
            <span className="flex items-center gap-1"><Users className="size-3.5" />{open.serves}</span>
          </p>
          <h3 className="mt-6 text-xl font-medium">Ingredientes</h3>
          <ul className="mt-2 space-y-3 text-lg leading-relaxed">{open.ingredients.map((x) => <li key={x} className="flex gap-2"><Leaf className="mt-1 size-3.5 shrink-0 text-primary" />{x}</li>)}</ul>
          <h3 className="mt-6 text-xl font-medium">Modo de preparo</h3>
          <ol className="mt-2 space-y-4 text-lg leading-relaxed">
            {open.steps.map((s, i) => <li key={s} className="flex gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-base font-semibold text-primary">{i + 1}</span>{s}</li>)}
          </ol>
          {open.tip && <p className="mt-5 rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">Dica: {open.tip}</p>}
          <fieldset className="mt-6 rounded-2xl border p-4">
            <legend className="px-1 text-xl font-medium">Adicionar aos dias</legend>
            <p className="text-sm text-muted-foreground">Em quais dias você quer esta receita no {recipeCategoryLabels[open.category].toLowerCase()}?</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {weekdayNames.map((n, i) => {
                const on = selectedDays.includes(i);
                return (
                  <label key={n} className={cn("flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 text-base", on ? "border-primary bg-primary-soft text-primary" : "bg-card")}>
                    <input type="checkbox" className="size-5 accent-[var(--color-primary)]" checked={on}
                      onChange={() => setSelectedDays((p) => on ? p.filter((x) => x !== i) : [...p, i])} />{n}
                  </label>
                );
              })}
            </div>
            {saveSchedule.error && <p role="alert" className="mt-3 text-sm text-destructive">Não foi possível salvar. Tente de novo.</p>}
          </fieldset>
          <Button disabled={saveSchedule.isPending} onClick={() => saveSchedule.mutate({ recipeId: open.id, weekdays: selectedDays }, { onSuccess: () => setOpenRecipe(null) })}
            className="mt-4 min-h-14 w-full rounded-full text-lg">{saveSchedule.isPending ? "Salvando…" : "Salvar no meu cardápio"}</Button>
          <Button variant="ghost" onClick={() => setOpenRecipe(null)} className="mt-3 min-h-14 w-full rounded-full bg-secondary text-lg font-medium text-foreground hover:bg-secondary/80 hover:text-foreground">Cancelar</Button>
        </DialogShell>
      )}
      </div>
    </AppShell>
  );
}
