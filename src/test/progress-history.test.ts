import { describe, it, expect } from "vitest";
import { shouldSaveSnapshot } from "@/lib/daily-progress-history";
describe("histórico do progresso", () => {
  it("não salva dia com 0% e sem água", () => expect(shouldSaveSnapshot({ pct: 0, water: 0 })).toBe(false));
  it("salva quando o progresso é maior que 0%", () => expect(shouldSaveSnapshot({ pct: 13, water: 0 })).toBe(true));
});
