"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * App-level theme provider (light/dark) using `class` on <html>.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}

