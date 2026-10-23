"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * App-level theme provider using `class` on <html>. The site is light only, like the app
 * (S-03): forcedTheme also overrides a «dark» left in localStorage by the old switch.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}
