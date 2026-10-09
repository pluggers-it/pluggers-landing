"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useReducedMotionSafe } from "@/components/landing/useReducedMotionSafe";

/** The home link. Already on the home page, it scrolls back to the top. */
export function HomeLink({ className, label, children }: { className: string; label: string; children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotionSafe();
  return (
    <Link
      href="/"
      className={className}
      aria-label={label}
      onClick={(e) => {
        if (pathname !== "/") return;
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }}
    >
      {children}
    </Link>
  );
}
