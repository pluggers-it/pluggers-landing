import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HomeLink } from "./HomeLink";
import { WEB_APP_URL } from "./links";
import { BTN_OUTLINE, CONTAINER } from "./styles";

const NAV = [
  { href: "/clienti", label: "Per i clienti" },
  { href: "/professionisti", label: "Per i professionisti" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/blog", label: "Blog" },
];

const NAV_LINK =
  "inline-flex h-12 items-center rounded-full px-4 text-[15px] font-semibold transition hover:bg-surface";

export function LandingHeader() {
  return (
    <div className="sticky top-0 z-40 border-b border-hair bg-page/90 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:backdrop-blur-none">
      <header
        className={`${CONTAINER} flex h-16 items-center justify-between sm:h-20`}
      >
        <HomeLink
          className="flex items-center gap-2.5 rounded-full py-2 pr-2"
          label="Pluggers, pagina iniziale"
        >
          <Image
            src={logo}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-[10px]"
            priority
          />
          <span className="hidden text-lg font-bold tracking-[-0.02em] sm:inline">
            Pluggers
          </span>
        </HomeLink>

        <nav
          className="flex items-center gap-1 sm:gap-2"
          aria-label="Principale"
        >
          <ul className="hidden items-center lg:flex">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={NAV_LINK}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <a href={WEB_APP_URL} className={BTN_OUTLINE}>
            Apri Pluggers
          </a>
          {/* phones and tablets: the same links behind a menu, no script needed */}
          <details className="group relative lg:hidden">
            <summary
              className="flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-full transition hover:bg-surface [&::-webkit-details-marker]:hidden"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </summary>
            <ul className="absolute right-0 top-14 z-50 w-64 rounded-card border border-hair bg-surface p-2 shadow-card">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex min-h-12 items-center rounded-xl px-4 text-[16px] font-semibold hover:bg-page"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </nav>
      </header>
    </div>
  );
}
