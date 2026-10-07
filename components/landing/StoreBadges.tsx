import { APP_STORE_URL, PLAY_STORE_URL } from "./links";

const BADGE =
  "inline-flex h-12 items-center gap-2.5 rounded-full border border-line bg-surface pl-3.5 pr-4 text-left leading-none";

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M16.37 12.7c.02 2.52 2.2 3.36 2.23 3.37-.02.06-.35 1.2-1.15 2.37-.69 1.01-1.41 2.02-2.55 2.04-1.12.02-1.47-.66-2.75-.66-1.27 0-1.67.64-2.72.68-1.1.04-1.93-1.09-2.63-2.1C5.37 16.33 4.27 12.5 5.74 9.96c.73-1.26 2.03-2.06 3.44-2.08 1.07-.02 2.09.72 2.75.72.66 0 1.89-.89 3.19-.76.54.02 2.07.22 3.05 1.65-.08.05-1.82 1.06-1.8 3.21zM14.27 6.47c.58-.71 .98-1.69.87-2.67-.84.03-1.86.56-2.46 1.27-.54.63-1.01 1.63-.89 2.59.94.07 1.9-.48 2.48-1.19z" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M4.5 3.3c-.3.3-.5.8-.5 1.4v14.6c0 .6.2 1.1.5 1.4l8.3-8.7-8.3-8.7zm9.4 9.8 2.8 2.9 3.5-2c1-.6 1-1.5 0-2.1l-3.5-2-2.8 3.2zm-1-1.1 2.9-3.3L6.4 3.4c-.5-.3-1-.3-1.4-.2l7.9 8.8zm0 2.1L5 22.7c.4.1.9.1 1.4-.2l9.4-5.3-2.9-3.1z" />
    </svg>
  );
}

function Badge({
  href,
  store,
  children,
}: {
  href: string;
  store: string;
  children: React.ReactNode;
}) {
  const body = (
    <>
      <span className="text-ink">{children}</span>
      <span>
        <span className="block text-[11px] font-medium text-muted">
          {href ? "Scarica su" : "In arrivo su"}
        </span>
        <span className="mt-1 block text-sm font-semibold text-ink">{store}</span>
      </span>
    </>
  );

  return href ? (
    <a href={href} className={`${BADGE} transition hover:border-ink`}>
      {body}
    </a>
  ) : (
    <span className={BADGE} aria-label={`${store}: in arrivo`}>
      {body}
    </span>
  );
}

export function StoreBadges() {
  return (
    <>
      <Badge href={APP_STORE_URL} store="App Store">
        <AppleGlyph />
      </Badge>
      <Badge href={PLAY_STORE_URL} store="Google Play">
        <PlayGlyph />
      </Badge>
    </>
  );
}
