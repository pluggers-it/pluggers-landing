"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useConsent } from "@/lib/consent";

const ICON = "relative h-[18px] w-8 transition-colors motion-reduce:transition-none";

/**
 * Light/dark switch, phones only, bottom-right; wider screens follow the system theme.
 * Like «torna su» it waits for the cookie choice, since the banner owns the bottom edge until then.
 */
export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const { choice } = useConsent();
  const pathname = usePathname();

  // the QR page is held up to someone else's camera
  if (choice === null || pathname === "/qr") return null;

  const dark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Tema scuro"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="fixed z-40 flex h-11 w-[76px] items-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-[5px] shadow-[var(--shadow-card)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:hidden"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))", right: "max(1rem, env(safe-area-inset-right))" }}
    >
      <span
        aria-hidden
        className="absolute left-[5px] top-[5px] h-8 w-8 rounded-full bg-[var(--accent-soft)] transition-transform duration-200 motion-reduce:transition-none dark:translate-x-8"
      />
      <Sun aria-hidden className={`${ICON} text-[var(--accent-text)] dark:text-[var(--muted)]`} strokeWidth={2.25} />
      <Moon aria-hidden className={`${ICON} text-[var(--muted)] dark:text-[var(--accent-text)]`} strokeWidth={2.25} />
    </button>
  );
}
