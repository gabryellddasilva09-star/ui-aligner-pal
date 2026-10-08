import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarPlus, Check, ChevronLeft, Clock, Heart, ListChecks, Plus, RefreshCw, Search,
  Share2, ShoppingBasket, Trash2, Users, X,
} from "lucide-react";
import { AppShell, IconButtons, Logo } from "@/components/vl/AppShell";
import { SectionHeader } from "@/components/vl/primitives";
import { ProgressBar, DialogShell } from "@/components/vl/movement";
import { Tabs, RecipeTile, ShoppingRow, EmptyState } from "@/components/vl/nutrition";
import {
  consolidateIngredients, formatQty, initialPlan, mealSlots, recipeFilters, recipes, shopCategories,
  weekDays, type MealSlot, type Recipe, type RecipeFilter, type ShopCategory, type ShoppingItem, type WeekDayKey,
} from "@/data/nutrition";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alimentacao")({
  head: () => ({
    meta: [
      { title: "Minha alimentação — VivaLeve" },
      { name: "description", content: "Organize suas refeições, descubra receitas práticas e monte sua lista de compras." },
      { property: "og:title", content: "Minha alimentação — VivaLeve" },
      { property: "og:description", content: "Planeje refeições, encontre receitas e gere sua lista de compras automaticamente." },
    ],
  }),
  component: Alimentacao,
});

type Tab = "planejar" | "receitas" | "compras";
type Plan = Partial<Record<WeekDayKey, Partial<Record<MealSlot, string>>>>;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function Alimentacao() {
  const [tab, setTab] = useState<Tab>("planejar");
  const [day, setDay] = useState<WeekDayKey>("seg");
  const [plan, setPlan] = useState<Plan>(() => load("vl-plan", initialPlan));
  const [favorites, setFavorites] = useState<string[]>(() => load("vl-favs", ["mingau-banana"]));
  const [items, setItems] = useState<ShoppingItem[]>(() => load("vl-shopping", []));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<RecipeFilter>("todas");
  const [openRecipe, setOpenRecipe] = useState<string | null>(null);
  const [picker, setPicker] = useState<{ recipeId: string; day: WeekDayKey; slot: MealSlot } | null>(null);
  const [addItem, setAddItem] = useState<Partial<ShoppingItem> | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem("vl-plan", JSON.stringify(plan)); }, [plan]);
  useEffect(() => { localStorage.setItem("vl-favs", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("vl-shopping", JSON.stringify(items)); }, [items]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const recipe = (id: string | null | undefined) => recipes.find((r) => r.id === id) ?? null;
  const open = recipe(openRecipe);

  const plannedCount = useMemo(
    () => Object.values(plan).reduce((n, meals) => n + Object.keys(meals ?? {}).length, 0),
    [plan],
  );
  const plannedDays = useMemo(
    () => Object.values(plan).filter((m) => m && Object.keys(m).length > 0).length,
    [plan],
  );
  const plannedRecipeIds = useMemo(
    () => [...new Set(Object.values(plan).flatMap((m) => Object.values(m ?? {})))],
    [plan],
  );

  const visibleRecipes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => {
      if (filter === "favoritas" && !favorites.includes(r.id)) return false;
      if (filter !== "todas" && filter !== "favoritas" && !r.tags.includes(filter)) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(q))
      );
    });
  }, [query, filter, favorites]);

  const checkedCount = items.filter((i) => i.checked).length;

  function setMeal(d: WeekDayKey, slot: MealSlot, recipeId: string | null) {
    setPlan((p) => {
      const meals = { ...(p[d] ?? {}) };
      if (recipeId) meals[slot] = recipeId;
      else delete meals[slot];
      return { ...p, [d]: meals };
    });
  }

  function toggleFav(id: string) {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  function addIngredientsToList(recipeIds: string[], message: string) {
    const ings = recipeIds.flatMap((id) => recipe(id)?.ingredients ?? []);
    const consolidated = consolidateIngredients(ings);
    setItems((prev) => {
      const next = [...prev];
      for (const c of consolidated) {
        const match = next.find(
          (i) => i.name.toLowerCase() === c.name.toLowerCase() && i.unit.toLowerCase() === c.unit.toLowerCase(),
        );
        if (match) match.qty += c.qty;
        else next.push({ ...c, id: crypto.randomUUID(), checked: false });
      }
      return next;
    });
    setToast(message);
  }

  function generateFromPlan() {
    if (plannedRecipeIds.length === 0) return;
    addIngredientsToList(plannedRecipeIds, "Tudo organizado! Você pode revisar sua lista quando quiser.");
    setTab("compras");
  }

  async function shareList() {
    const text = [
      "Minha lista de compras — VivaLeve",
      "",
      ...items.map((i) => `${i.checked ? "✓" : "•"} ${i.name} — ${formatQty(i.qty)} ${i.unit}`),
    ].join("\n");
    try {
      if (navigator.share) await navigator.share({ title: "Lista de compras", text });
      else {
        await navigator.clipboard.writeText(text);
        setToast("Lista copiada para a área de transferência.");
      }
    } catch {
      /* usuário cancelou */
    }
  }

  const tabs = [
    { key: "planejar", label: "Planejar" },
    { key: "receitas", label: "Receitas" },
    { key: "compras", label: "Compras" },
  ];

  return (
    <AppShell>
      {/* Cabeçalho */}
      <header className="relative -mx-5 -mt-4 px-5 pb-2 pt-8 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-0 lg:rounded-3xl lg:px-10 lg:py-10">
        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 lg:hidden">
              <Logo className="size-6" />
              <span className="text-xs font-medium tracking-wide text-muted-foreground">VivaLeve</span>
            </div>
            <h1 className="mt-3 text-4xl font-medium lg:mt-0 lg:text-5xl">Minha alimentação</h1>
            <p className="mt-2 text-[15px] text-muted-foreground">Organize suas refeições de um jeito mais leve.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden size-14 place-items-center rounded-2xl bg-checkin text-primary sm:grid" aria-hidden>
              <ShoppingBasket className="size-7" strokeWidth={1.5} />
            </span>
            <div className="lg:hidden"><IconButtons /></div>
          </div>
        </div>
        <div className="relative mt-5">
          <Tabs tabs={tabs} value={tab} onChange={(k) => setTab(k as Tab)} />
        </div>
      </header>

      {/* ============ PLANEJAR ============ */}
      {tab === "planejar" && (
        <div className="mt-6 space-y-8">
          <section aria-label="Dias da semana">
            <div className="grid grid-cols-7 gap-1.5">
              {weekDays.map((d) => {
                const active = day === d.key;
                const hasMeals = Object.keys(plan[d.key] ?? {}).length > 0;
                return (
                  <button
                    key={d.key}
                    onClick={() => setDay(d.key)}
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-2xl border py-2.5 text-xs font-medium transition",
                      active ? "border-primary bg-primary-soft text-primary" : "bg-card text-muted-foreground hover:bg-secondary",
                    )}
                  >
                    {d.label}
                    <span className={cn("size-1.5 rounded-full", hasMeals ? "bg-good" : "bg-border")} aria-hidden />
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-label="Refeições do dia">
            <SectionHeader title="Refeições do dia" subtitle="Seu planejamento começa com pequenos passos." />
            <ul className="space-y-3">
              {mealSlots.map((slot, i) => {
                const r = recipe(plan[day]?.[slot.key]);
                return (
                  <li key={slot.key} className="animate-rise" style={{ animationDelay: `${i * 50}ms` }}>
                    {r ? (
                      <div className="card-soft flex items-center gap-4 p-3.5 sm:p-4">
                        <button onClick={() => setOpenRecipe(r.id)} aria-label={`Ver receita ${r.name}`} className="pressable shrink-0">
                          <RecipeTile id={r.id} />
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{slot.label}</p>
                          <p className="truncate font-medium">{r.name}</p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {r.ingredients.slice(0, 3).map((ing) => ing.name).join(", ")}
                            {r.ingredients.length > 3 ? "…" : ""}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                          <button
                            onClick={() => setPicker({ recipeId: r.id, day, slot: slot.key })}
                            aria-label={`Trocar ${slot.label}`}
                            className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                          >
                            <RefreshCw className="size-4" />
                          </button>
                          <button
                            onClick={() => setMeal(day, slot.key, null)}
                            aria-label={`Remover ${slot.label} do planejamento`}
                            className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-alert"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="card-soft flex items-center justify-between gap-4 border-dashed p-4">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{slot.label}</p>
                          <p className="mt-0.5 text-sm text-muted-foreground">Que tal escolher uma receita para este momento?</p>
                        </div>
                        <button
                          onClick={() => setPicker({ recipeId: "", day, slot: slot.key })}
                          className="pressable inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                        >
                          <Plus className="size-3.5" aria-hidden /> Escolher receita
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="card-soft p-5" aria-label="Resumo semanal">
            <div className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><ListChecks className="size-5" /></span>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium">Resumo da semana</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plannedDays} {plannedDays === 1 ? "dia" : "dias"} com refeições planejadas · {plannedCount}{" "}
                  {plannedCount === 1 ? "receita selecionada" : "receitas selecionadas"}
                </p>
              </div>
            </div>
            <button
              onClick={generateFromPlan}
              disabled={plannedRecipeIds.length === 0}
              className="pressable mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              <ShoppingBasket className="size-4" aria-hidden /> Gerar lista de compras
            </button>
          </section>
        </div>
      )}

      {/* ============ RECEITAS ============ */}
      {tab === "receitas" && (
        <div className="mt-6 space-y-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar receitas ou ingredientes..."
              aria-label="Buscar receitas ou ingredientes"
              className="w-full rounded-full border bg-card py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtros de receitas">
            {recipeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
                  filter === f.key ? "border-primary bg-primary-soft text-primary" : "bg-card text-muted-foreground hover:bg-secondary",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {visibleRecipes.length === 0 ? (
            <EmptyState
              title="Nenhuma receita encontrada"
              subtitle="Tente buscar por outro ingrediente ou limpar os filtros."
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {visibleRecipes.map((r, i) => (
                <li key={r.id} className="card-soft animate-rise p-4" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-start gap-4">
                    <RecipeTile id={r.id} large />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium leading-snug">{r.name}</p>
                        <button
                          onClick={() => toggleFav(r.id)}
                          aria-label={favorites.includes(r.id) ? `Remover ${r.name} dos favoritos` : `Favoritar ${r.name}`}
                          aria-pressed={favorites.includes(r.id)}
                          className={cn("grid size-8 shrink-0 place-items-center rounded-full transition hover:bg-secondary", favorites.includes(r.id) ? "text-pain" : "text-muted-foreground")}
                        >
                          <Heart className="size-4.5" fill={favorites.includes(r.id) ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        {r.time && <span className="inline-flex items-center gap-1"><Clock className="size-3" aria-hidden /> {r.time}</span>}
                        {r.servings && <span className="inline-flex items-center gap-1"><Users className="size-3" aria-hidden /> {r.servings} {r.servings === 1 ? "porção" : "porções"}</span>}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
                  <button
                    onClick={() => setOpenRecipe(r.id)}
                    className="pressable mt-3 w-full rounded-full border py-2.5 text-sm font-medium transition hover:bg-secondary"
                  >
                    Ver receita
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ============ COMPRAS ============ */}
      {tab === "compras" && (
        <div className="mt-6 space-y-6">
          <section className="relative overflow-hidden rounded-3xl bg-checkin p-6 shadow-float sm:p-7" aria-label="Minha lista de compras">
            <div className="absolute -right-10 -top-10 size-48 rounded-full bg-card/40 blur-2xl" />
            <div className="relative">
              <h2 className="text-2xl font-normal">Minha lista de compras</h2>
              <p className="mt-1 text-sm text-accent-foreground">Tudo o que você precisa, organizado em um só lugar.</p>
              <div className="mt-5 flex items-end justify-between gap-4">
                <p className="text-sm font-medium">{checkedCount} de {items.length} itens comprados</p>
                <p className="font-display text-2xl font-medium">{items.length ? Math.round((checkedCount / items.length) * 100) : 0}%</p>
              </div>
              <div className="mt-2">
                <ProgressBar value={items.length ? checkedCount / items.length : 0} />
              </div>
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={generateFromPlan}
              disabled={plannedRecipeIds.length === 0}
              className="pressable inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-40"
            >
              <ShoppingBasket className="size-3.5" aria-hidden /> Gerar lista com meu planejamento
            </button>
            <button
              onClick={() => setAddItem({ name: "", qty: 1, unit: "un", category: "Outros" })}
              className="pressable inline-flex items-center gap-1.5 rounded-full border bg-card px-4 py-2 text-xs font-semibold transition hover:bg-secondary"
            >
              <Plus className="size-3.5" aria-hidden /> Adicionar item
            </button>
          </div>

          {items.length === 0 ? (
            <EmptyState
              title="Sua lista está vazia"
              subtitle="Gere a lista a partir do seu planejamento ou adicione itens manualmente."
            />
          ) : (
            <>
              {shopCategories.map((cat) => {
                const catItems = items.filter((i) => i.category === cat);
                if (catItems.length === 0) return null;
                return (
                  <section key={cat} aria-label={cat}>
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{cat}</h3>
                    <ul className="space-y-2">
                      {catItems.map((item) => (
                        <ShoppingRow
                          key={item.id}
                          item={item}
                          onToggle={() => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i)))}
                          onEdit={() => setAddItem(item)}
                          onRemove={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                        />
                      ))}
                    </ul>
                  </section>
                );
              })}

              <div className="flex flex-wrap gap-2 border-t pt-4">
                <button
                  onClick={() => setItems((prev) => prev.map((i) => ({ ...i, checked: false })))}
                  className="rounded-full border bg-card px-4 py-2 text-xs font-medium transition hover:bg-secondary"
                >
                  Desmarcar todos
                </button>
                <button
                  onClick={() => setConfirmClear(true)}
                  disabled={checkedCount === 0}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card px-4 py-2 text-xs font-medium transition hover:bg-secondary disabled:opacity-40"
                >
                  <Trash2 className="size-3.5" aria-hidden /> Limpar itens concluídos
                </button>
                <button
                  onClick={shareList}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card px-4 py-2 text-xs font-medium transition hover:bg-secondary"
                >
                  <Share2 className="size-3.5" aria-hidden /> Compartilhar lista
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div role="status" className="animate-rise fixed inset-x-4 bottom-24 z-50 mx-auto max-w-sm rounded-2xl border bg-card px-4 py-3 text-center text-sm font-medium shadow-float lg:bottom-8">
          {toast}
        </div>
      )}

      {/* Detalhes da receita */}
      {open && (
        <DialogShell title={open.name} onClose={() => setOpenRecipe(null)}>
          <button
            onClick={() => setOpenRecipe(null)}
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden /> Voltar às receitas
          </button>
          <div className="flex items-center gap-4">
            <RecipeTile id={open.id} large />
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-medium leading-tight">{open.name}</h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                {open.time && <span className="inline-flex items-center gap-1"><Clock className="size-3" aria-hidden /> {open.time}</span>}
                {open.servings && <span className="inline-flex items-center gap-1"><Users className="size-3" aria-hidden /> {open.servings} {open.servings === 1 ? "porção" : "porções"}</span>}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{open.description}</p>

          <h3 className="mt-5 text-sm font-semibold">Ingredientes</h3>
          <ul className="mt-2 space-y-1.5">
            {open.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center justify-between gap-3 text-sm">
                <span>{ing.name}</span>
                <span className="shrink-0 text-muted-foreground">{formatQty(ing.qty)} {ing.unit}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-5 text-sm font-semibold">Modo de preparo</h3>
          <ol className="mt-2 space-y-2">
            {open.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>

          <div className="mt-6 grid gap-2">
            <button
              onClick={() => { setPicker({ recipeId: open.id, day, slot: "almoco" }); }}
              className="pressable inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
            >
              <CalendarPlus className="size-4" aria-hidden /> Adicionar ao planejamento
            </button>
            <button
              onClick={() => addIngredientsToList([open.id], "Ingredientes adicionados à sua lista.")}
              className="pressable inline-flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold transition hover:bg-secondary"
            >
              <ShoppingBasket className="size-4" aria-hidden /> Adicionar ingredientes à lista de compras
            </button>
            <button
              onClick={() => toggleFav(open.id)}
              className="pressable inline-flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold transition hover:bg-secondary"
            >
              <Heart className="size-4" fill={favorites.includes(open.id) ? "currentColor" : "none"} aria-hidden />
              {favorites.includes(open.id) ? "Remover dos favoritos" : "Favoritar"}
            </button>
          </div>
        </DialogShell>
      )}

      {/* Seletor de receita para o planejamento */}
      {picker && (
        <DialogShell title="Escolher receita" onClose={() => setPicker(null)}>
          <h2 className="font-display text-xl font-medium">Escolher receita</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Para {mealSlots.find((s) => s.key === picker.slot)?.label.toLowerCase()} de{" "}
            {weekDays.find((d) => d.key === picker.day)?.label}.
          </p>
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {weekDays.map((d) => (
              <button
                key={d.key}
                onClick={() => setPicker({ ...picker, day: d.key })}
                aria-pressed={picker.day === d.key}
                className={cn(
                  "rounded-xl border py-2 text-xs font-medium transition",
                  picker.day === d.key ? "border-primary bg-primary-soft text-primary" : "bg-card text-muted-foreground hover:bg-secondary",
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {mealSlots.map((s) => (
              <button
                key={s.key}
                onClick={() => setPicker({ ...picker, slot: s.key })}
                aria-pressed={picker.slot === s.key}
                className={cn(
                  "rounded-xl border px-2 py-2 text-xs font-medium transition",
                  picker.slot === s.key ? "border-primary bg-primary-soft text-primary" : "bg-card text-muted-foreground hover:bg-secondary",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto">
            {recipes.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => {
                    setMeal(picker.day, picker.slot, r.id);
                    setPicker(null);
                    setToast("Receita adicionada ao seu planejamento.");
                  }}
                  className="card-soft pressable flex w-full items-center gap-3 p-3 text-left"
                >
                  <RecipeTile id={r.id} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    {r.time && <p className="text-[11px] text-muted-foreground">{r.time}</p>}
                  </div>
                  <Check className="size-4 text-muted-foreground" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </DialogShell>
      )}

      {/* Adicionar / editar item */}
      {addItem && (
        <DialogShell title="Item da lista" onClose={() => setAddItem(null)}>
          <h2 className="font-display text-xl font-medium">{addItem.id ? "Editar item" : "Adicionar item"}</h2>
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!addItem.name?.trim()) return;
              const item: ShoppingItem = {
                id: addItem.id ?? crypto.randomUUID(),
                name: addItem.name.trim(),
                qty: Number(addItem.qty) || 1,
                unit: addItem.unit || "un",
                category: (addItem.category as ShopCategory) ?? "Outros",
                checked: addItem.checked ?? false,
              };
              setItems((prev) => (addItem.id ? prev.map((i) => (i.id === item.id ? item : i)) : [...prev, item]));
              setAddItem(null);
              setToast(addItem.id ? "Item atualizado." : "Item adicionado à sua lista.");
            }}
          >
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Nome do item</span>
              <input
                required
                value={addItem.name ?? ""}
                onChange={(e) => setAddItem({ ...addItem, name: e.target.value })}
                className="w-full rounded-2xl border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
                placeholder="Ex.: Maçã"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Quantidade</span>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={addItem.qty ?? 1}
                  onChange={(e) => setAddItem({ ...addItem, qty: Number(e.target.value) })}
                  className="w-full rounded-2xl border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Unidade</span>
                <input
                  value={addItem.unit ?? "un"}
                  onChange={(e) => setAddItem({ ...addItem, unit: e.target.value })}
                  className="w-full rounded-2xl border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="un, g, ml..."
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Categoria</span>
              <select
                value={addItem.category ?? "Outros"}
                onChange={(e) => setAddItem({ ...addItem, category: e.target.value as ShopCategory })}
                className="w-full rounded-2xl border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                {shopCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="pressable w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">
              {addItem.id ? "Salvar alterações" : "Adicionar à lista"}
            </button>
          </form>
        </DialogShell>
      )}

      {/* Confirmar limpeza */}
      {confirmClear && (
        <DialogShell title="Limpar itens concluídos" onClose={() => setConfirmClear(false)}>
          <h2 className="font-display text-xl font-medium">Limpar itens concluídos?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Isso removerá da lista os {checkedCount} {checkedCount === 1 ? "item já marcado" : "itens já marcados"} como comprados. Os demais itens serão mantidos.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <button onClick={() => setConfirmClear(false)} className="rounded-full border py-3 text-sm font-medium transition hover:bg-secondary">
              Cancelar
            </button>
            <button
              onClick={() => {
                setItems((prev) => prev.filter((i) => !i.checked));
                setConfirmClear(false);
                setToast("Itens concluídos removidos.");
              }}
              className="pressable rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
            >
              Limpar
            </button>
          </div>
        </DialogShell>
      )}
    </AppShell>
  );
}
