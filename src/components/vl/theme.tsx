import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export const themeStorageKey = "vivaleve-theme";
type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });

// Runs before the page paints; only the visual preference is browser-local.
export const themeInitScript = `try{if(localStorage.getItem("${themeStorageKey}")==="dark")document.documentElement.classList.add("dark")}catch{}`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    const sync = (event: StorageEvent) => {
      if (event.key !== themeStorageKey) return;
      const next = event.newValue === "dark" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      setTheme(next);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    setTheme(next);
    try { localStorage.setItem(themeStorageKey, next); } catch { /* Works without browser storage. */ }
  }
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeContext);
  const label = theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro";
  return (
    <Button type="button" variant="outline" size="icon" onClick={toggle}
      aria-label={label} title={label} aria-pressed={theme === "dark"}
      className="size-10 shrink-0 rounded-full bg-card text-muted-foreground">
      {theme === "dark" ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </Button>
  );
}