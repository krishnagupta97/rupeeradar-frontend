import type { ColorScheme } from "./types";
import { COLOR_SCHEME_STORAGE_KEY } from "./types";

export function readStoredColorScheme(): ColorScheme {
  if (typeof window === "undefined") return "dark";
  try {
    const t = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
    return t === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function persistColorScheme(scheme: ColorScheme): void {
  try {
    localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, scheme);
  } catch {
    /* ignore */
  }
}

export function applyColorSchemeToDocument(scheme: ColorScheme): void {
  document.documentElement.classList.toggle("dark", scheme === "dark");
}
