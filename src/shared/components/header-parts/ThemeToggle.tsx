"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface ThemeToggleProps {
  mounted: boolean;
  theme?: string;
  setTheme: (theme: string) => void;
}

export function ThemeToggle({ mounted, theme, setTheme }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => mounted && setTheme(theme === "dark" ? "light" : "dark")}
      className="shrink-0"
      disabled={!mounted}
    >
      {!mounted ? (
        <Moon className="h-5 w-5 animate-pulse" />
      ) : theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Chuyển đổi theme</span>
    </Button>
  );
}
