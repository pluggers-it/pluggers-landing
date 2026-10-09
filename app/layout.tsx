import { Analytics } from "@/components/Analytics";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConsentProvider } from "@/lib/consent";
import { ConsentGate } from "@/components/ConsentGate";
import { BackToTop } from "@/components/BackToTop";
import { JsonLd } from "@/components/JsonLd";
import { HOME } from "@/lib/home";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <JsonLd data={graph(organizationSchema, websiteSchema)} />
        <ConsentProvider>
          <ThemeProvider>{children}</ThemeProvider>
          <ConsentGate />
          <Analytics />
          <BackToTop />
        </ConsentProvider>
      </body>
    </html>
  );
}
