import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WEB_APP_URL } from "./links";
import { BTN_OUTLINE, CONTAINER } from "./styles";

export function LandingHeader() {
  return (
    <header className={`${CONTAINER} flex h-16 items-center justify-between sm:h-20`}>
      <Link
        href="/"
        className="flex items-center gap-2.5 rounded-full py-2 pr-2"
        aria-label="Pluggers, pagina iniziale"
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
      </Link>

      <nav className="flex items-center gap-2" aria-label="Principale">
        <Link
          href="/blog"
          className="inline-flex h-12 items-center rounded-full px-4 text-[15px] font-semibold transition hover:bg-surface"
        >
          Blog
        </Link>
        <ThemeToggle />
        <a href={WEB_APP_URL} className={BTN_OUTLINE}>
          Apri Pluggers
        </a>
      </nav>
    </header>
  );
}
