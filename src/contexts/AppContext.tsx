import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "../services/types";
import { AppContext } from "./appContext";
import {
  applyColorSchemeToDocument,
  persistColorScheme,
  readStoredColorScheme,
} from "./colorScheme";
import type { AppContextValue, ColorScheme } from "./types";

export function AppProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [user, setUserState] = useState<User | null>(initialUser);
  const setUser = useCallback((next: User | null) => {
    setUserState(next);
  }, []);

  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(
    readStoredColorScheme,
  );

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    persistColorScheme(scheme);
    applyColorSchemeToDocument(scheme);
  }, []);

  const toggleColorScheme = useCallback(() => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  }, [colorScheme, setColorScheme]);

  useEffect(() => {
    applyColorSchemeToDocument(colorScheme);
  }, [colorScheme]);

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      setUser,
      colorScheme,
      setColorScheme,
      toggleColorScheme,
    }),
    [user, setUser, colorScheme, setColorScheme, toggleColorScheme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
