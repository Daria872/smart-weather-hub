import { Sun, Moon, Thermometer } from "lucide-react";
import type { TemperatureUnit } from "@/types/weather";

interface HeaderProps {
  dark: boolean;
  onToggleTheme: () => void;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
}

export function Header({ dark, onToggleTheme, unit, onToggleUnit }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl sky-gradient flex items-center justify-center">
          <Sun className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold font-display text-foreground">Smart Weather</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Unit toggle */}
        <button
          onClick={onToggleUnit}
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-card border border-border text-sm font-display font-semibold text-foreground hover:bg-muted transition-colors"
          title={`Switch to ${unit === "metric" ? "Fahrenheit" : "Celsius"}`}
        >
          <Thermometer className="h-4 w-4" />
          {unit === "metric" ? "°C" : "°F"}
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="h-9 w-9 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-foreground" />}
        </button>
      </div>
    </header>
  );
}
