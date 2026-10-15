// Correspondência entre um ingrediente escrito na receita e a tabela de substituições do cardápio.
// Só faz casar textos: não altera nem reinterpreta o conteúdo fornecido no PDF.

import { substitutions } from "@/data/anti-inflammatory";

export type Substitution = { from: string; to: string; note: string };

// Termos que identificam, dentro do texto do ingrediente, um alimento que tem troca na tabela.
const MATCH_TERMS: Record<string, string[]> = {
  "Salmão": ["salmão"],
  "Leite de coco": ["leite de coco"],
  "Batata-doce": ["batata-doce"],
  "Biomassa de banana verde": ["biomassa", "banana verde"],
  "Kefir de água": ["kefir"],
  "Grão-de-bico": ["grão-de-bico"],
  "Frutas vermelhas": ["frutas vermelhas", "morango", "mirtilo", "amora"],
  "Espinafre": ["espinafre"],
  "Cúrcuma fresca": ["cúrcuma"],
  "Gengibre fresco": ["gengibre"],
  "Castanha-do-pará": ["castanha-do-pará"],
  "Azeite de oliva": ["azeite"],
  "Arroz de couve-flor": ["arroz de couve-flor", "couve-flor"],
  "Mel (1 colher de chá)": ["mel"],
};

function norm(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[-/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRe(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// "batata-doce" casa com "2 batatas-doces médias": aceita plural solto e separadores.
function termSource(term: string): string {
  return norm(term)
    .split(" ")
    .filter(Boolean)
    .map((word) => `${escapeRe(word)}s?`)
    .join("\\s+");
}

const rows = substitutions.map(([from, to, note]) => ({
  from,
  to,
  note,
  pattern: new RegExp(`(?<![a-z0-9])${(MATCH_TERMS[from] ?? [from]).map(termSource).join("|")}(?![a-z0-9])`, "i"),
}));

const cache = new Map<string, Substitution[]>();

export function substitutionsFor(ingredient: string): Substitution[] {
  const cached = cache.get(ingredient);
  if (cached) return cached;
  const value = norm(ingredient);
  const found = value
    ? rows.filter((row) => row.pattern.test(value)).map(({ from, to, note }) => ({ from, to, note }))
    : [];
  cache.set(ingredient, found);
  return found;
}

export function hasSubstitution(ingredient: string): boolean {
  return substitutionsFor(ingredient).length > 0;
}
