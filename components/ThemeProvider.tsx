"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * App-level theme provider (light/dark) using `class` on <html>. It starts light and stays
 * so until someone flips the switch, which only phones show (ThemeSwitch).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}
