import { describe, expect, it } from "vitest";
import { adjustWater, waterGoal, waterPercent } from "@/lib/hydration-values";

describe("consumo de água", () => {
  it("começa com meta de 2 L", () => expect(waterGoal(undefined)).toBe(2000));
  it("adiciona 500 ml por vez", () => expect(adjustWater(1000, 1)).toBe(1500));
  it("retira 500 ml por vez", () => expect(adjustWater(1500, -1)).toBe(1000));
  it("não permite consumo negativo", () => expect(adjustWater(0, -1)).toBe(0));
  it("enche completamente ao atingir 2 L", () => {
    expect(waterPercent(500, 2000)).toBe(25);
    expect(waterPercent(2000, 2000)).toBe(100);
  });
  it("adapta o nível à meta escolhida no perfil", () => {
    expect(waterGoal(3000)).toBe(3000);
    expect(waterPercent(1500, 3000)).toBe(50);
    expect(waterPercent(3000, 3000)).toBe(100);
  });
  it("não transborda quando o consumo supera a meta", () => expect(waterPercent(2500, 2000)).toBe(100));
});