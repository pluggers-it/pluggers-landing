import type { Metadata } from "next";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { BrandQr } from "@/components/landing/BrandQr";
import { KeepAwake } from "@/components/KeepAwake";

export const metadata: Metadata = {
  title: { absolute: "Pluggers" },
  robots: { index: false, follow: false },
};

// Shown from a phone to people met in person: they scan it and land on the home.
export default function QrPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-[radial-gradient(120%_80%_at_50%_0%,#8B5CF6_0%,#6D28D9_45%,#3B1A85_100%)] px-5 py-10 text-white">
      <KeepAwake />
      <div className="flex w-full max-w-[22rem] flex-col items-center text-center">
        <div className="flex items-center gap-2.5">
          <Image src="/brand/app-icon-512.png" alt="" width={40} height={40} className="h-10 w-10 rounded-[12px]" priority />
          <span className="text-[22px] font-extrabold tracking-[-0.02em]">Pluggers</span>
        </div>
        <p className="mt-5 text-balance text-[26px] font-extrabold leading-[1.1] tracking-[-0.03em]">
          La piattaforma per gli interventi in casa
        </p>

        <div className="mt-8 w-full rounded-[32px] bg-white p-5 shadow-[0_30px_80px_-30px_rgba(20,8,50,0.75)]">
          <BrandQr className="w-full" />
        </div>

        <p className="mt-7 text-[15px] font-medium text-white/75">Inquadra con la fotocamera</p>
        <p className="mt-1 text-[24px] font-extrabold tracking-[-0.02em]">plggrs.it</p>
        <p className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-white/75">
          <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden />
          Oggi attivi a Torino
        </p>
      </div>
    </main>
  );
}
