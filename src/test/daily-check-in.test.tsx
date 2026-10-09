import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DailyCheckIn, dailyRecordSchema } from "@/components/vl/daily-check-in";

afterEach(cleanup);
describe("Daily check-in", () => {
  it("rejects incomplete records and invalid pain values", () => {
    expect(dailyRecordSchema.safeParse({}).success).toBe(false);
    expect(dailyRecordSchema.safeParse({ mood: "Feliz", sleep: "Dormi bem", pain: 11, fatigue: "Leve", disposition: "Boa" }).success).toBe(false);
  });
  it("validates all choices and saves the selected record", () => {
    const onSave = vi.fn();
    render(<DailyCheckIn open onOpenChange={vi.fn()} record={null} onSave={onSave} />);
    fireEvent.click(screen.getByRole("button", { name: "Salvar meu registro" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
    for (const name of ["Tranquila", "Dormi bem", "Dor 0 de 10", "Leve", "Boa"]) fireEvent.click(screen.getByRole("button", { name, exact: true }));
    fireEvent.click(screen.getByRole("button", { name: "Salvar meu registro" }));
    expect(onSave).toHaveBeenCalledWith({ mood: "Tranquila", sleep: "Dormi bem", pain: 0, fatigue: "Leve", disposition: "Boa" });
    expect(screen.getByText("Seu registro foi salvo")).toBeInTheDocument();
  });
});