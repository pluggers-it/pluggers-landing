import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConsentProvider } from "@/lib/consent";
import { CookieBanner } from "@/components/CookieBanner";
import { Analytics } from "@/components/Analytics";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pluggers",
  description: "Lavori di mano d'opera, fatti bene.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        {/*
          ConsentProvider wraps everything so both CookieBanner and Analytics
          can read and update the same consent state via context.
        */}
        <ConsentProvider>
          <ThemeProvider>{children}</ThemeProvider>

          {/*
            Rendered outside ThemeProvider children so they overlay all pages
            without being affected by page-level layout shifts.
          */}
          <CookieBanner />
          <Analytics />
        </ConsentProvider>
      </body>
    </html>
  );
}
