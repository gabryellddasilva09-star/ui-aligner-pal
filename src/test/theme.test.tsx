import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider, ThemeToggle, themeInitScript, themeStorageKey } from "@/components/vl/theme";

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("visual preference", () => {
  it("saves dark mode and can return to light mode", () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Ativar modo escuro" }));
    expect(localStorage.getItem(themeStorageKey)).toBe("dark");
    fireEvent.click(screen.getByRole("button", { name: "Ativar modo claro" }));
    expect(localStorage.getItem(themeStorageKey)).toBe("light");
  });

  it("restores the saved choice before rendering and across navigation", () => {
    localStorage.setItem(themeStorageKey, "dark");
    new Function(themeInitScript)();
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Ativar modo claro" }));
    expect(localStorage.getItem(themeStorageKey)).toBe("light");
  });
});