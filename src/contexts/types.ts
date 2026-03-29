import type { User } from "../services/types";

export type ColorScheme = "light" | "dark";

export const COLOR_SCHEME_STORAGE_KEY = "rr-color-scheme";

export interface AppContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}
