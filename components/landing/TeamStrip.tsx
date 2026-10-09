import Image from "next/image";
import Link from "next/link";
import { TEAM } from "@/lib/about";
import { ORG } from "@/lib/site";
import { CONTAINER, H2, LEDE } from "./styles";

const initials = (name: string) => name.split(" ").map((w) => w[0]).slice(0, 2).join("");

export function TeamStrip() {
  return (
    <section className={`${CONTAINER} py-20 lg:py-28`} aria-labelledby="team-strip-title">
      <h2 id="team-strip-title" className={H2}>
        Le persone di Pluggers
      </h2>
      <p className={LEDE}>{ORG.legalName}, costituita a Torino il 6 ottobre 2026.</p>
      <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {TEAM.map((m) => (
          <li key={m.name} className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
            {m.photo ? (
              <Image src={m.photo} alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-full object-cover" />
            ) : (
              <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent-soft text-[18px] font-extrabold text-accent-text">
                {initials(m.name)}
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-[15px] font-bold leading-snug">{m.name}</span>
              <span className="block text-[13px] leading-snug text-muted">{m.role}</span>
            </span>
          </li>
        ))}
      </ul>
      <Link href="/chi-siamo" className="mt-8 inline-flex min-h-12 items-center font-semibold text-accent-text underline underline-offset-4">
        Chi siamo
      </Link>
    </section>
  );
}
