"use client";

import {
  useTheme as useNextTheme,
} from "next-themes";

export function useTheme() {
  const {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
  } = useNextTheme();

  const isDark =
    resolvedTheme === "dark";

  const isLight =
    resolvedTheme === "light";

  const toggleTheme = () => {
    setTheme(
      resolvedTheme === "dark"
        ? "light"
        : "dark",
    );
  };

  const setLightTheme = () => {
    setTheme("light");
  };

  const setDarkTheme = () => {
    setTheme("dark");
  };

  return {
    theme,
    resolvedTheme,
    systemTheme,
    isDark,
    isLight,
    setTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
  };
}