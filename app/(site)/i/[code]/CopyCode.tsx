"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** The invite code with a copy button: from the store apps it has to be typed in. */
export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked: the code stays visible and selectable
    }
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
      <p className="text-[15px] text-muted">
        Codice invito: <span className="select-all text-[17px] font-bold tracking-[0.08em] text-ink">{code}</span>
      </p>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-4 text-[15px] font-semibold text-ink transition hover:bg-surface active:scale-[0.98]"
      >
        {copied ? <Check className="h-4 w-4 text-accent-text" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
        <span aria-live="polite">{copied ? "Copiato" : "Copia"}</span>
      </button>
    </div>
  );
}
