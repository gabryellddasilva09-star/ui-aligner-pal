import { z } from "zod";

export const painRegions = ["Cabeça e pescoço", "Ombros", "Braços e mãos", "Costas", "Peito", "Quadril", "Pernas", "Pés"] as const;
export type PainRegion = typeof painRegions[number];
export const bodyPainSchema = z.record(z.enum(painRegions), z.number().int().min(0).max(10));
export type BodyPainDraft = Partial<Record<PainRegion, number | null>>;