import { SiteFooter } from "@/components/SiteFooter";
import { LandingHeader } from "./LandingHeader";
import { CONTAINER } from "./styles";

/** Header and footer of the home around an inner page (blog, legal documents). */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-page text-ink">
      <LandingHeader />
      <main className="pb-20 sm:pb-28">{children}</main>
      <div className={CONTAINER}>
        <div
          aria-hidden
          className="mx-auto mb-8 h-[30px] w-[30px] bg-[color-mix(in_srgb,var(--ink)_30%,transparent)] [mask-image:url(/brand/brand-mark.png)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
        />
        <SiteFooter />
      </div>
    </div>
  );
}
