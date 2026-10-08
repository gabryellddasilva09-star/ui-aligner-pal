export type MealSlot = "cafe" | "almoco" | "lanche" | "jantar";

export const mealSlots: { key: MealSlot; label: string }[] = [
  { key: "cafe", label: "Café da manhã" },
  { key: "almoco", label: "Almoço" },
  { key: "lanche", label: "Lanche" },
  { key: "jantar", label: "Jantar" },
];

export const weekDays = [
  { key: "seg", label: "Seg" },
  { key: "ter", label: "Ter" },
  { key: "qua", label: "Qua" },
  { key: "qui", label: "Qui" },
  { key: "sex", label: "Sex" },
  { key: "sab", label: "Sáb" },
  { key: "dom", label: "Dom" },
] as const;

export type WeekDayKey = (typeof weekDays)[number]["key"];

export type ShopCategory =
  | "Hortifruti"
  | "Proteínas"
  | "Laticínios e ovos"
  | "Grãos e cereais"
  | "Mercearia"
  | "Temperos"
  | "Outros";

export const shopCategories: ShopCategory[] = [
  "Hortifruti",
  "Proteínas",
  "Laticínios e ovos",
  "Grãos e cereais",
  "Mercearia",
  "Temperos",
  "Outros",
];

export interface Ingredient {
  name: string;
  qty: number;
  unit: string; // "un", "g", "ml", "xícara", "colher de sopa", "fatia"...
  category: ShopCategory;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  time?: string;
  servings?: number;
  tags: ("rapida" | "facil" | "economica")[];
  ingredients: Ingredient[];
  steps: string[];
}

export const recipes: Recipe[] = [
  {
    id: "mingau-banana",
    name: "Mingau de banana com aveia",
    description: "Um café da manhã quentinho e reconfortante, pronto em poucos minutos.",
    time: "10 min",
    servings: 1,
    tags: ["rapida", "facil", "economica"],
    ingredients: [
      { name: "Banana", qty: 1, unit: "un", category: "Hortifruti" },
      { name: "Aveia em flocos", qty: 3, unit: "colher de sopa", category: "Grãos e cereais" },
      { name: "Leite", qty: 200, unit: "ml", category: "Laticínios e ovos" },
      { name: "Canela em pó", qty: 1, unit: "pitada", category: "Temperos" },
    ],
    steps: [
      "Amasse a banana com um garfo em uma panela pequena.",
      "Adicione o leite e a aveia e misture bem.",
      "Leve ao fogo baixo, mexendo até engrossar.",
      "Sirva com uma pitada de canela por cima.",
    ],
  },
  {
    id: "omelete-legumes",
    name: "Omelete de legumes",
    description: "Leve, colorido e versátil — use os legumes que tiver em casa.",
    time: "15 min",
    servings: 1,
    tags: ["rapida", "facil"],
    ingredients: [
      { name: "Ovos", qty: 2, unit: "un", category: "Laticínios e ovos" },
      { name: "Tomate", qty: 1, unit: "un", category: "Hortifruti" },
      { name: "Cebola", qty: 0.5, unit: "un", category: "Hortifruti" },
      { name: "Azeite", qty: 1, unit: "colher de chá", category: "Mercearia" },
      { name: "Sal", qty: 1, unit: "pitada", category: "Temperos" },
    ],
    steps: [
      "Bata os ovos com uma pitada de sal.",
      "Refogue o tomate e a cebola picados no azeite.",
      "Despeje os ovos batidos e cozinhe em fogo baixo.",
      "Dobre ao meio e sirva.",
    ],
  },
  {
    id: "frango-arroz",
    name: "Frango grelhado com arroz e cenoura",
    description: "Um almoço completo e simples, com ingredientes do dia a dia.",
    time: "35 min",
    servings: 2,
    tags: ["facil"],
    ingredients: [
      { name: "Peito de frango", qty: 300, unit: "g", category: "Proteínas" },
      { name: "Arroz branco", qty: 1, unit: "xícara", category: "Grãos e cereais" },
      { name: "Cenoura", qty: 2, unit: "un", category: "Hortifruti" },
      { name: "Alho", qty: 2, unit: "dente", category: "Temperos" },
      { name: "Azeite", qty: 1, unit: "colher de sopa", category: "Mercearia" },
      { name: "Sal", qty: 1, unit: "pitada", category: "Temperos" },
    ],
    steps: [
      "Tempere o frango com alho e sal.",
      "Cozinhe o arroz como de costume.",
      "Grelhe o frango em fogo médio até dourar dos dois lados.",
      "Cozinhe a cenoura em rodelas até ficar macia e sirva junto.",
    ],
  },
  {
    id: "sopa-abobora",
    name: "Sopa cremosa de abóbora",
    description: "Aconchegante e suave, ótima para os dias mais frios.",
    time: "40 min",
    servings: 4,
    tags: ["facil", "economica"],
    ingredients: [
      { name: "Abóbora", qty: 500, unit: "g", category: "Hortifruti" },
      { name: "Cebola", qty: 1, unit: "un", category: "Hortifruti" },
      { name: "Alho", qty: 2, unit: "dente", category: "Temperos" },
      { name: "Azeite", qty: 1, unit: "colher de sopa", category: "Mercearia" },
      { name: "Sal", qty: 1, unit: "pitada", category: "Temperos" },
    ],
    steps: [
      "Refogue a cebola e o alho no azeite.",
      "Adicione a abóbora em cubos e cubra com água.",
      "Cozinhe até amolecer e bata no liquidificador.",
      "Ajuste o sal e sirva quente.",
    ],
  },
  {
    id: "salada-grao",
    name: "Salada de grão-de-bico",
    description: "Fresca e prática — dá para preparar com antecedência.",
    time: "20 min",
    servings: 2,
    tags: ["rapida", "facil", "economica"],
    ingredients: [
      { name: "Grão-de-bico cozido", qty: 1, unit: "xícara", category: "Grãos e cereais" },
      { name: "Tomate", qty: 2, unit: "un", category: "Hortifruti" },
      { name: "Pepino", qty: 0.5, unit: "un", category: "Hortifruti" },
      { name: "Azeite", qty: 1, unit: "colher de sopa", category: "Mercearia" },
      { name: "Limão", qty: 1, unit: "un", category: "Hortifruti" },
      { name: "Sal", qty: 1, unit: "pitada", category: "Temperos" },
    ],
    steps: [
      "Pique o tomate e o pepino em cubos.",
      "Misture com o grão-de-bico cozido.",
      "Tempere com azeite, limão e sal.",
      "Sirva fria.",
    ],
  },
  {
    id: "vitamina-mamao",
    name: "Vitamina de mamão com aveia",
    description: "Um lanche cremoso e refrescante para o meio da tarde.",
    time: "5 min",
    servings: 1,
    tags: ["rapida", "facil"],
    ingredients: [
      { name: "Mamão", qty: 1, unit: "fatia", category: "Hortifruti" },
      { name: "Leite", qty: 200, unit: "ml", category: "Laticínios e ovos" },
      { name: "Aveia em flocos", qty: 1, unit: "colher de sopa", category: "Grãos e cereais" },
      { name: "Mel", qty: 1, unit: "colher de chá", category: "Mercearia" },
    ],
    steps: [
      "Coloque todos os ingredientes no liquidificador.",
      "Bata até ficar homogêneo.",
      "Sirva gelado.",
    ],
  },
  {
    id: "sanduiche-natural",
    name: "Sanduíche natural de frango",
    description: "Prático para levar ou para um lanche mais reforçado.",
    time: "15 min",
    servings: 2,
    tags: ["rapida", "facil"],
    ingredients: [
      { name: "Pão de forma integral", qty: 4, unit: "fatia", category: "Grãos e cereais" },
      { name: "Peito de frango", qty: 150, unit: "g", category: "Proteínas" },
      { name: "Cenoura", qty: 1, unit: "un", category: "Hortifruti" },
      { name: "Iogurte natural", qty: 2, unit: "colher de sopa", category: "Laticínios e ovos" },
      { name: "Sal", qty: 1, unit: "pitada", category: "Temperos" },
    ],
    steps: [
      "Desfie o frango cozido.",
      "Misture com a cenoura ralada e o iogurte.",
      "Tempere com sal e monte os sanduíches.",
    ],
  },
  {
    id: "macarrao-integral",
    name: "Macarrão integral ao molho de tomate",
    description: "Um jantar simples e acolhedor, com molho caseiro.",
    time: "30 min",
    servings: 2,
    tags: ["facil", "economica"],
    ingredients: [
      { name: "Macarrão integral", qty: 200, unit: "g", category: "Grãos e cereais" },
      { name: "Tomate", qty: 3, unit: "un", category: "Hortifruti" },
      { name: "Cebola", qty: 0.5, unit: "un", category: "Hortifruti" },
      { name: "Alho", qty: 1, unit: "dente", category: "Temperos" },
      { name: "Azeite", qty: 1, unit: "colher de sopa", category: "Mercearia" },
      { name: "Sal", qty: 1, unit: "pitada", category: "Temperos" },
    ],
    steps: [
      "Cozinhe o macarrão conforme a embalagem.",
      "Refogue cebola e alho, adicione o tomate picado e cozinhe até virar molho.",
      "Misture o macarrão ao molho e sirva.",
    ],
  },
];

export const recipeFilters = [
  { key: "todas", label: "Todas" },
  { key: "rapida", label: "Rápidas" },
  { key: "facil", label: "Fáceis" },
  { key: "economica", label: "Econômicas" },
  { key: "favoritas", label: "Favoritas" },
] as const;

export type RecipeFilter = (typeof recipeFilters)[number]["key"];

/** Planejamento inicial demonstrativo: dia → refeição → receita */
export const initialPlan: Partial<Record<WeekDayKey, Partial<Record<MealSlot, string>>>> = {
  seg: { cafe: "mingau-banana", almoco: "frango-arroz" },
  ter: { cafe: "vitamina-mamao", jantar: "sopa-abobora" },
  qua: { almoco: "salada-grao", lanche: "sanduiche-natural" },
  sex: { cafe: "mingau-banana", jantar: "macarrao-integral" },
};

export interface ShoppingItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  category: ShopCategory;
  checked: boolean;
}

/**
 * Consolida ingredientes de várias receitas: soma quantidades quando
 * nome e unidade são compatíveis; mantém separado o que não pode ser somado.
 */
export function consolidateIngredients(ings: Ingredient[]): Omit<ShoppingItem, "id" | "checked">[] {
  const byKey = new Map<string, Omit<ShoppingItem, "id" | "checked">>();
  for (const ing of ings) {
    const key = `${ing.name.trim().toLowerCase()}|${ing.unit.trim().toLowerCase()}`;
    const existing = byKey.get(key);
    if (existing) {
      existing.qty += ing.qty;
    } else {
      byKey.set(key, { name: ing.name, qty: ing.qty, unit: ing.unit, category: ing.category });
    }
  }
  return [...byKey.values()];
}

export function formatQty(qty: number): string {
  return Number.isInteger(qty) ? String(qty) : qty.toFixed(1).replace(".", ",").replace(",0", "");
}
