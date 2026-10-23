import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Check, Clock, Droplets, Leaf, ShoppingBasket, Users, Sparkles, RefreshCw, ChefHat, Search, Minus, Plus, ArrowRight, ArrowLeftRight,
} from "lucide-react";
import { AppShell, Logo } from "@/components/vl/AppShell";
import { ProgressBar, DialogShell } from "@/components/vl/movement";
import { Button } from "@/components/ui/button";
import { RecipeImage } from "@/components/vl/nutrition-visuals";
import {
  recipes, substitutions, tagInfo, type Tag, recipeCategoryLabels, recipeCategoryOrder, type RecipeCategory,
} from "@/data/anti-inflammatory";
import { planDays } from "@/data/movement";
import { cn } from "@/lib/utils";
import { useRecipeSchedule, useSaveRecipeSchedule } from "@/lib/recipe-schedule";
import { substitutionsFor } from "@/lib/ingredient-substitutions";

const weekdayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
import { movementWeek } from "@/lib/movement-progress";

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
  const [weekDates, setWeekDates] = useState<{ key: string; label: string }[]>([]);
  useEffect(() => { setWeekDates(movementWeek()); }, []);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [bought, setBought] = useState<Record<string, boolean>>({});
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
    setDay(new Date().getDay());
    setDone(load("vl-ai-done", {}));
    setBought(load("vl-ai-shop", {}));
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem("vl-ai-weekday", JSON.stringify(day)); }, [day, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("vl-ai-done", JSON.stringify(done)); }, [done, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("vl-ai-shop", JSON.stringify(bought)); }, [bought, hydrated]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [tab]);

  const mealsOfDay = useMemo(
    () => recipeCategoryOrder.flatMap((c) => recipes.filter((r) => r.category === c && daysFor(r.id).includes(day))),
    [schedule.data, day],
  );
  const doneToday = mealsOfDay.filter((r) => done[`${day}-${r.id}`]).length;
  const visibleRecipes = useMemo(
    () => recipes.filter((r) => (categoryFilter === "todas" || r.category === categoryFilter) && r.name.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR"))),
    [categoryFilter, search],
  );
  const [showSubs, setShowSubs] = useState(false);
  const [swapFor, setSwapFor] = useState<string | null>(null);
  const open = recipes.find((r) => r.id === openRecipe) ?? null;
  const list = useMemo(() => {
    const chosen = recipes.filter((r) => daysFor(r.id).length > 0);
    return [...new Set(chosen.flatMap((r) => r.ingredients))];
  }, [schedule.data]);
  const boughtCount = list.filter((name) => bought[name]).length;

  return (
    <AppShell backAction={tab === "cardapio" ? undefined : { onClick: () => setTab("cardapio"), label: "Voltar ao cardápio" }}>
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
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-soft via-card to-good-soft p-6 sm:p-8">
            <Sparkles className="size-8 text-primary" />
            <h2 className="mt-3 text-2xl font-medium sm:text-3xl">Cuidado em cada refeição</h2>
            <p className="mt-2 max-w-md text-base text-muted-foreground sm:text-lg">Alimentação anti-inflamatória para cuidar de você, um dia de cada vez.</p>
          </section>
          <section aria-label="Escolher dia da semana">
            <div className="grid grid-cols-7 gap-1.5" role="group" aria-label="Dias da semana">
              {planDays.map((d, i) => {
                const selected = day === i;
                return (
                  <Button key={d} onClick={() => setDay(i)} aria-pressed={selected} aria-label={d} variant="ghost"
                    className={cn(
                      "pressable h-auto min-h-14 flex-col gap-0.5 rounded-2xl px-1 py-2 text-[11px] font-semibold transition sm:text-sm",
                      selected
                        ? "bg-primary text-primary-foreground shadow-float"
                        : "bg-secondary text-muted-foreground",
                    )}>
                    <span>{d}</span>
                    <span className="text-[10px] font-medium opacity-80 sm:text-xs">{weekDates[i]?.label}</span>
                  </Button>
                );
              })}
            </div>
          </section>
          <section className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-medium">Suas refeições</h2>
            <span className="text-sm text-muted-foreground">{doneToday} de {mealsOfDay.length} registradas</span>
          </section>
          {mealsOfDay.length === 0 && (
            <p className="rounded-2xl bg-secondary px-4 py-4 text-base text-muted-foreground">
              Nenhuma refeição para este dia ainda. Toque em “Editar cardápio” para escolher as receitas deste dia.
            </p>
          )}
          <ul className="space-y-3">
            {mealsOfDay.map((r) => {
              const key = `${day}-${r.id}`;
              const isDone = !!done[key];
              return (
                <li key={r.id} className={cn("card-soft overflow-hidden transition", isDone && "border-good/40")}>
                  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4 sm:p-5">
                    <RecipeImage id={r.id} name={r.name} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary">{recipeCategoryLabels[r.category]}</p>
                      <h3 className="text-lg font-medium sm:text-xl">{r.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{isDone ? "Refeição registrada" : "Seu cardápio do dia"}</p>
                    </div>
                    <Button variant="ghost" role="checkbox" aria-checked={isDone} aria-label={`Marcar ${r.name} como feita`}
                      onClick={() => setDone((p) => ({ ...p, [key]: !isDone }))}
                      className={cn("size-12 shrink-0 rounded-full border-2 p-0", isDone ? "border-good bg-good text-primary-foreground hover:bg-good hover:text-primary-foreground" : "border-border bg-secondary text-muted-foreground")}>
                      <Check className="size-5" />
                    </Button>
                  </div>
                  <div className="border-t bg-secondary/40 px-4 py-3">
                    <Button variant="ghost" onClick={() => openRecipeDialog(r.id)} className="min-h-11 w-full justify-start rounded-xl text-base font-semibold text-primary">
                      Ver receita<ArrowRight className="size-4" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="space-y-3">
            <Button variant="outline" className="h-auto min-h-14 w-full whitespace-normal rounded-2xl text-base" onClick={() => setTab("receitas")}><ChefHat />Editar cardápio<ArrowRight /></Button>
            <Button variant="outline" className="h-auto min-h-14 w-full whitespace-normal rounded-2xl text-base" onClick={() => setTab("compras")}><ShoppingBasket />Ver compras da semana<ArrowRight /></Button>
          </div>
        </div>
      )}

      {/* ============ RECEITAS ============ */}
      {tab === "receitas" && (
        <div className="mt-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-medium">O que vamos preparar?</h2>
            <Button variant="outline" onClick={() => setShowSubs(true)} className="min-h-12 rounded-full text-base"><ArrowLeftRight />Substituições</Button>
          </div>
          <label className="flex min-h-14 items-center gap-3 rounded-xl border bg-card px-4"><Search className="size-5 shrink-0 text-primary" /><input aria-label="Buscar receita" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar receita" className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none" /></label>
          <p className="text-base text-muted-foreground">Todas sem glúten, sem laticínios convencionais e sem açúcar refinado.</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por refeição">
            {(["todas", ...recipeCategoryOrder] as const).map((c) => (
              <Button variant="ghost" key={c} onClick={() => setCategoryFilter(c)} aria-pressed={categoryFilter === c}
                className={cn("min-h-12 rounded-xl border px-4 text-base font-medium transition", categoryFilter === c ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
                {c === "todas" ? "Todas as refeições" : recipeCategoryLabels[c]}
              </Button>
            ))}
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {visibleRecipes.map((r) => (
              <li key={r.id}>
                <Button variant="ghost" onClick={() => openRecipeDialog(r.id)} className="card-soft pressable h-full w-full flex-col items-stretch justify-start overflow-hidden whitespace-normal p-0 text-left hover:bg-card">
                  <RecipeImage id={r.id} name={r.name} large />
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
          <h2 className="text-2xl font-medium">Sua lista está pronta</h2>
          <p className="text-base text-muted-foreground">Ingredientes das receitas que você escolheu para a semana.</p>
          {list.length === 0 ? (
            <section className="card-soft p-5 text-center">
              <ShoppingBasket className="mx-auto size-8 text-primary" />
              <p className="mt-3 text-base font-medium">Nenhuma receita escolhida ainda</p>
              <p className="mt-1 text-sm text-muted-foreground">Toque em "Editar cardápio", escolha suas receitas e marque os dias da semana — os ingredientes aparecem aqui.</p>
              <Button variant="outline" className="mt-4 min-h-12 rounded-2xl text-base" onClick={() => setTab("receitas")}>Editar cardápio<ArrowRight /></Button>
            </section>
          ) : (
            <>
              <section className="card-soft p-5">
                <div className="flex items-baseline justify-between">
                  <p className="flex items-center gap-2 font-medium"><ShoppingBasket className="size-4 text-primary" />Lista da semana</p>
                  <p className="text-sm text-muted-foreground">{boughtCount} de {list.length}</p>
                </div>
                <div className="mt-3"><ProgressBar value={boughtCount / list.length} /></div>
                <p className="mt-2 text-xs text-muted-foreground">Prefira alimentos naturais, frescos e integrais. Planeje e evite industrializados.</p>
              </section>
              <ul className="space-y-2">
                {list.map((name) => {
                  const c = !!bought[name];
                  return (
                    <li key={name}>
                      <Button variant="ghost" role="checkbox" aria-checked={c} onClick={() => setBought((b) => ({ ...b, [name]: !c }))}
                        className={cn("flex min-h-16 w-full items-center gap-3 rounded-2xl border bg-card px-4 py-4 text-left transition whitespace-normal h-auto justify-start", c && "opacity-70")}>
                        <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border-2", c ? "border-good bg-good text-primary-foreground" : "border-border")}>
                          {c && <Check className="size-3.5" />}
                        </span>
                        <span className={cn("min-w-0 flex-1 text-base font-medium", c && "line-through")}>{name}</span>
                      </Button>
                    </li>
                  );
                })}
              </ul>
              {boughtCount > 0 && (
                <Button variant="ghost" onClick={() => setBought({})}
                  className="mx-auto flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-muted-foreground hover:text-foreground">
                  <RefreshCw className="size-4" />Desmarcar todos
                </Button>
              )}
            </>
          )}
        </div>
      )}


      </div>
      {showSubs && (
        <DialogShell title="Tabela de substituições" onClose={() => setShowSubs(false)}>
          <h2 className="text-2xl font-medium">Tabela de substituições</h2>
          <p className="mt-2 text-base text-muted-foreground">Não encontrou um ingrediente ou não gosta de algum alimento? Troque sem perder o efeito anti-inflamatório.</p>
          <ul className="mt-5 space-y-3">
            {substitutions.map(([from, to, note]) => (
              <li key={from} className="rounded-2xl border bg-card p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
                  <p className="text-base font-medium">{from}</p>
                  <ArrowLeftRight aria-label="pode ser trocado por" className="size-5 text-primary" />
                  <p className="text-base font-semibold text-primary">{to}</p>
                </div>
                <p className="mt-2 flex gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 size-4 shrink-0 text-good" />{note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">As substituições mantêm o poder anti-inflamatório das receitas sem abrir mão do sabor e dos nutrientes.</p>
          <Button onClick={() => setShowSubs(false)} className="mt-5 min-h-14 w-full rounded-full text-lg">Fechar</Button>
        </DialogShell>
      )}
      {open && (
        <DialogShell title={open.name} onClose={() => (swapFor ? setSwapFor(null) : setOpenRecipe(null))}>
          <div className="mb-5 overflow-hidden rounded-2xl"><RecipeImage id={open.id} name={open.name} large /></div>
          <div className="flex flex-wrap gap-1.5">{open.tags.map((t) => <TagChip key={t} tag={t} />)}</div>
          <h2 className="mt-2 text-2xl font-medium">{open.name}</h2>
          <p className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="size-3.5" />{open.time}</span>
            <span className="flex items-center gap-1"><Users className="size-3.5" />{open.serves}</span>
          </p>
          <h3 className="mt-6 text-xl font-medium">Ingredientes</h3>
          {open.ingredients.some((x) => substitutionsFor(x).length > 0) && (
            <p className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
              <span aria-hidden className="mt-1.5 inline-block size-3 shrink-0 rounded-full bg-primary-soft ring-1 ring-primary/40" />
              Os ingredientes destacados têm uma troca sugerida — toque em “Trocar” para ver as opções.
            </p>
          )}
          <ul className="mt-2 space-y-2 text-lg leading-relaxed">
            {open.ingredients.map((x) => {
              const subs = substitutionsFor(x);
              return subs.length === 0 ? (
                <li key={x} className="flex gap-2 px-1 py-1.5"><Leaf className="mt-1 size-3.5 shrink-0 text-primary" />{x}</li>
              ) : (
                <li key={x} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-2xl border border-primary/40 bg-primary-soft px-3 py-2">
                  <span className="flex min-w-0 gap-2"><Leaf className="mt-1 size-3.5 shrink-0 text-primary" />{x}</span>
                  <Button variant="ghost" onClick={() => setSwapFor(x)}
                    className="min-h-10 shrink-0 gap-1.5 rounded-full bg-card px-3 text-sm font-semibold text-primary">
                    <ArrowLeftRight className="size-4" />Trocar
                  </Button>
                </li>
              );
            })}
          </ul>
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
      {swapFor && (
        <DialogShell title={`Trocar ${swapFor}`} onClose={() => setSwapFor(null)}>
          <p className="text-sm font-semibold text-primary">Este ingrediente pode ser trocado</p>
          <h2 className="mt-1 text-2xl font-medium">{swapFor}</h2>
          <ul className="mt-5 space-y-3">
            {substitutionsFor(swapFor).map((s) => (
              <li key={`${s.from}-${s.to}`} className="rounded-2xl border bg-card p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
                  <p className="text-base font-medium">{s.from}</p>
                  <ArrowLeftRight aria-label="pode ser trocado por" className="size-5 text-primary" />
                  <p className="text-base font-semibold text-primary">{s.to}</p>
                </div>
                <p className="mt-2 flex gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 size-4 shrink-0 text-good" />{s.note}</p>
              </li>
            ))}
          </ul>
          <Button variant="ghost" onClick={() => { setSwapFor(null); setOpenRecipe(null); setShowSubs(true); }}
            className="mt-5 min-h-14 w-full rounded-full bg-secondary text-base font-medium text-foreground hover:bg-secondary/80 hover:text-foreground">Ver todas as substituições</Button>
          <Button onClick={() => setSwapFor(null)} className="mt-3 min-h-14 w-full rounded-full text-lg">Fechar</Button>
        </DialogShell>
      )}
      </div>
    </AppShell>
  );
}
