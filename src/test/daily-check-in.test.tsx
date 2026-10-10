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
    for (const name of ["Tranquila", "Dormi bem", "Leve", "Boa"]) fireEvent.click(screen.getByRole("button", { name }));
    fireEvent.change(screen.getByLabelText("Nível de dor"), { target: { value: "0" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar meu registro" }));
    expect(onSave).toHaveBeenCalledWith({ mood: "Tranquila", sleep: "Dormi bem", pain: 0, fatigue: "Leve", disposition: "Boa" });
    expect(screen.getByText("Seu registro foi salvo")).toBeInTheDocument();
  });
  it("shares silhouette selection, validates regional pain and preserves it when editing", () => {
    const onSave = vi.fn();
    render(<DailyCheckIn open onOpenChange={vi.fn()} record={null} onSave={onSave} />);
    for (const name of ["Tranquila", "Dormi bem", "Leve", "Boa", "Ombros · frente"]) fireEvent.click(screen.getByRole("button", { name }));
    expect(screen.getByRole("button", { name: "Ombros · costas" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Salvar meu registro" }));
    expect(onSave).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText("Ombros: intensidade da dor"), { target: { value: "7" } });
    fireEvent.click(screen.getByRole("button", { name: "Costas" }));
    fireEvent.change(screen.getByLabelText("Costas: intensidade da dor"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar meu registro" }));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ bodyPain: { Ombros: 7, Costas: 3 } }));
    fireEvent.click(screen.getByRole("button", { name: "Editar meu registro" }));
    expect(screen.getByLabelText("Ombros: intensidade da dor")).toHaveAttribute("aria-valuenow", "7");
    fireEvent.click(screen.getByRole("button", { name: "Ombros" }));
    expect(screen.queryByLabelText("Ombros: intensidade da dor")).not.toBeInTheDocument();
  });
  it("rejects unknown regions and out-of-range regional intensity", () => {
    const record = { mood: "Feliz", sleep: "Dormi bem", pain: 0, fatigue: "Leve", disposition: "Boa" };
    expect(dailyRecordSchema.safeParse({ ...record, bodyPain: { Costas: 11 } }).success).toBe(false);
    expect(dailyRecordSchema.safeParse({ ...record, bodyPain: { Outra: 3 } }).success).toBe(false);
  });
});