import { Analytics } from "@/components/Analytics";
import { MetaPixel } from "@/components/MetaPixel";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ConsentProvider } from "@/lib/consent";
import { ConsentGate } from "@/components/ConsentGate";
import { BackToTop } from "@/components/BackToTop";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { JsonLd } from "@/components/JsonLd";
import { InStoresProvider } from "@/components/landing/InStores";
import { HOME } from "@/lib/home";
import { appInStores } from "@/lib/prelaunch";
import { graph, organizationSchema, pageMetadata, websiteSchema } from "@/lib/seo";
import { ORG, SITE_URL } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const home = pageMetadata({ title: HOME.title, description: HOME.description, path: "/", absolute: true });

// Defaults for every page; each page sets its own title, description, canonical and preview.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: HOME.title, template: `%s | ${ORG.name}` },
  description: HOME.description,
  applicationName: ORG.name,
  authors: [{ name: ORG.legalName, url: SITE_URL }],
  publisher: ORG.legalName,
  openGraph: home.openGraph,
  twitter: home.twitter,
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const inStores = await appInStores();
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <JsonLd data={graph(organizationSchema, websiteSchema)} />
        <ConsentProvider>
          <ThemeProvider>
            <InStoresProvider value={inStores}>{children}</InStoresProvider>
            <ThemeSwitch />
          </ThemeProvider>
          <ConsentGate />
          <Analytics />
          <MetaPixel />
          <BackToTop />
        </ConsentProvider>
      </body>
    </html>
  );
}
