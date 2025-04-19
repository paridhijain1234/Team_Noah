"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-transparent border-0 focus:outline-none"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5 transition-transform duration-300 ease-in-out" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-300 ease-in-out" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
