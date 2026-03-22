import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WaitlistForm } from "@/components/WaitlistForm";

/**
 * Hidden registration page — reachable only via direct URL (/newsletter).
 * Not linked in SiteHeader, footer, or any navigation element.
 */
export const metadata: Metadata = {
  title: "Registrati — Pluggers",
  description: "Iscriviti alla lista di attesa di Pluggers.",
  robots: { index: false, follow: false },
};

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-16 sm:px-10">

        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-56 left-1/2 h-[620px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.32),rgba(0,0,0,0)_60%)] blur-3xl" />
          <div className="absolute bottom-[-280px] right-[-220px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.20),rgba(0,0,0,0)_62%)] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.18]" />
        </div>

        {/* Minimal header — logo + theme toggle only, no nav links */}
        <header className="relative flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src={logo} alt="Pluggers" width={34} height={34} className="rounded-lg" />
            <span className="font-mono text-xs tracking-[0.25em] text-[var(--color-muted)]">
              PLUGGERS
            </span>
          </Link>
          <ThemeToggle />
        </header>

        {/* Page heading */}
        <div className="relative mt-16 mb-8 text-center">
          <h1 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl">
            Iscriviti alla Newsletter.
          </h1>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            Iscriviti per rimanere aggiornato sulle novità più utili per il tuo settore.
          </p>
        </div>

        {/* Form — same endpoint, same fields as the landing waitlist */}
        <div className="relative">
          <WaitlistForm
            badge="NEWSLETTER"
            title="Ricevi i nostri aggiornamenti."
            description="Inserisci i tuoi dati per ricevere le nostre comunicazioni. Niente spam, solo contenuti rilevanti."
            successMessage="Registrazione completata! Ti contatteremo presto."
            formName="newsletter"
          />
        </div>

        {/* Minimal footer */}
        <footer className="relative mt-auto pt-12 text-center font-mono text-[10px] tracking-widest text-[var(--color-muted)]">
          PLUGGERS © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
