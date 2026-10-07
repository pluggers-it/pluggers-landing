/**
 * Presentation-time formatting for blog posts.
 *
 * Most posts were pasted from the newsletter as plain text: a menu, section titles led by an emoji,
 * "Il Consiglio di Pluggers" blocks, the newsletter call to action, a disclaimer and a sign-off.
 * This turns those recurring lines into structure (headings, boxes, a real list, a link) before the
 * markdown is rendered. The stored content is never changed, and anything that does not match a
 * known pattern goes through as it is.
 */

const EMOJI_SRC = "(?![©®™])\\p{Extended_Pictographic}(?:\\uFE0F|\\u200D\\p{Extended_Pictographic}\\uFE0F?)*";
const LEADING_EMOJI = new RegExp(`^(${EMOJI_SRC})\\s*`, "u");

const MD_HEADING = /^#{1,6}\s/;
const MENU = /^il men[uù] di oggi\s*:?$/i;
const CORNER = new RegExp(`^(?:${EMOJI_SRC}\\s*)?l['’]angolo di pluggers$`, "iu");
const CTA = /^👉/u;
const SIGNOFF = /^ci sentiamo\b/i;
const NOTE = /^(?:nota\s*:|i nostri sono (?:solo )?consigli)/i;
const COPYRIGHT = /^©\s*\d{4}/;
const TIP = new RegExp(
  `^#{0,6}\\s*(?:${EMOJI_SRC}\\s*)?[*_]*\\s*(il (?:nostro )?consiglio(?: [^:*_\\n]{1,60})?)\\s*[*_]*\\s*(:?)\\s*[*_]*\\s*(.*)$`,
  "iu"
);
const NEWSLETTER_URL = /(?:https?:\/\/)?(?:www\.)?plggrs\.it\/newsletter\/?/gi;

/** The line as text: tags, heading hashes and emphasis markers removed. */
function plain(line: string): string {
  return line
    .replace(/<[^>]+>/g, "")
    .replace(/^#{1,6}\s+/, "")
    .replace(/[*_]/g, "")
    .trim();
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function emojiSpan(emoji: string): string {
  return `<span class="post-emoji" aria-hidden="true">${emoji}</span>`;
}

/**
 * Markdown blocks inside a wrapper: blank lines around each block keep the inner markdown parsed.
 */
function box(className: string, label: string | null, blocks: string[]): string[] {
  const out = ["", `<div class="${className}">`, ""];
  if (label) out.push(`<p class="post-label">${escapeHtml(label)}</p>`, "");
  for (const block of blocks) out.push(block, "");
  out.push("</div>", "");
  return out;
}

/**
 * Some posts lost their line breaks when pasted ("…serramentisti.In questo articolo…",
 * "…dell'installatoreLa richiesta…"). Puts them back where the join is unambiguous.
 * Lines with HTML or links are left alone.
 * A heuristic: the real fix is re-saving those posts with their line breaks.
 */
export function repairJoins(md: string): string {
  return md
    .split("\n")
    .map((line) => {
      if (line.includes("<") || line.includes("](")) return line;
      if (MD_HEADING.test(line)) {
        // A heading swallowed the first sentence of its paragraph.
        const m = line.match(/^(#{1,6} .{20,}?[a-zà-öø-ÿ]{4})([A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ'’].{30,}[.!?]\s*)$/);
        return m ? `${m[1]}\n\n${m[2].trim()}` : line;
      }
      return line
        .replace(/([a-zà-öø-ÿ)"»”])([.!?:])(?=[A-ZÀ-ÖØ-Þ](?!\.))/g, "$1$2\n\n")
        .replace(/([a-zà-öø-ÿ])([.!?])(?=\d{4}\s[-–])/g, "$1$2\n\n")
        .replace(/(^|[\s(])([a-zà-öø-ÿ]{4,})(?=[A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ'’])/g, "$1$2\n\n");
    })
    .join("\n");
}

/** Whether a line opens one of the structured blocks. */
function opensBlock(line: string): boolean {
  const p = plain(line);
  return (
    MENU.test(p) ||
    CORNER.test(p) ||
    CTA.test(p) ||
    SIGNOFF.test(p) ||
    NOTE.test(p) ||
    COPYRIGHT.test(p) ||
    TIP.test(line)
  );
}

/** A tip label: "Il Consiglio di Pluggers:", "Il Nostro Consiglio", "Il consiglio per l'idraulico", "Il consiglio gestionale: …". */
function matchTip(line: string): { label: string; rest: string } | null {
  const m = line.match(TIP);
  if (!m) return null;
  const [, label, colon, rest] = m;
  // Without a colon or text after it, the whole line has to be the label, not a sentence.
  if (!colon && !rest && (label.length > 70 || /[.!?…]$/.test(label))) return null;
  if (!colon && rest) return null;
  return { label: label.trim(), rest: rest.trim() };
}

function ctaBlock(line: string): string {
  let text = line.replace(/^#{1,6}\s+/, "").replace(/^👉\s*/u, "").trim();
  if (/plggrs\.it\/newsletter/i.test(text)) {
    text = text
      .replace(/\s*-+>\s*(?=(?:https?:\/\/)?(?:www\.)?plggrs\.it)/i, ": ")
      .replace(NEWSLETTER_URL, "[plggrs.it/newsletter](/newsletter)");
  } else {
    // No address written out: the last mention of the newsletter becomes the link.
    text = text.replace(/newsletter(?![^<]*>)(?![\s\S]*newsletter)/i, "[$&](/newsletter)");
  }
  return text;
}

/** Turns the newsletter patterns into markdown + HTML wrappers ready for remark. */
export function formatPost(md: string): string {
  const lines = repairJoins(md.replace(/\r\n?/g, "\n")).split("\n");
  const inferTitles = !lines.some((l) => MD_HEADING.test(l));
  const out: string[] = [];
  const prevBlank = () => out.length === 0 || out[out.length - 1].trim() === "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const p = plain(line);

    if (!p) {
      out.push("");
      continue;
    }

    if (COPYRIGHT.test(p)) continue; // already in the footer

    if (MENU.test(p)) {
      const items: string[] = [];
      while (i + 1 < lines.length && plain(lines[i + 1])) {
        items.push(lines[++i].replace(/^#{1,6}\s+/, "").replace(/^\s*\d+\s*[).]\s*/, "").trim());
      }
      if (items.length === 0) {
        out.push(line);
        continue;
      }
      const icons = items.every((t) => LEADING_EMOJI.test(plain(t)));
      out.push(
        ...box(
          `post-box post-menu${icons ? " post-menu--icons" : ""}`,
          "In questo numero",
          [items.map((t, n) => `${n + 1}. ${t}`).join("\n")]
        )
      );
      continue;
    }

    if (CORNER.test(p)) {
      let j = i + 1;
      while (j < lines.length && !plain(lines[j])) j++;
      if (j < lines.length && CTA.test(plain(lines[j]))) {
        out.push(...box("post-box post-cta", "L'Angolo di Pluggers", [ctaBlock(lines[j])]));
        i = j;
        continue;
      }
    }

    if (CTA.test(p)) {
      out.push(...box("post-box post-cta", null, [ctaBlock(line)]));
      continue;
    }

    if (SIGNOFF.test(p)) {
      const signoff = [line.trim()];
      while (i + 1 < lines.length && plain(lines[i + 1])) {
        const next = lines[++i];
        if (!COPYRIGHT.test(plain(next))) signoff.push(next.trim());
      }
      out.push(...box("post-signoff", null, [signoff.join("\n")]));
      continue;
    }

    if (NOTE.test(p)) {
      out.push(...box("post-note", null, [line.replace(/^#{1,6}\s+/, "").trim()]));
      continue;
    }

    const tip = matchTip(line);
    if (tip) {
      const body = tip.rest ? [tip.rest] : [];
      while (
        i + 1 < lines.length &&
        plain(lines[i + 1]) &&
        !MD_HEADING.test(lines[i + 1]) &&
        !opensBlock(lines[i + 1])
      ) {
        body.push(lines[++i].trim());
      }
      if (body.length > 0) {
        out.push(
          ...box(
            "post-box post-tip",
            tip.label.replace(/^il/i, "Il"),
            body.map((b) => b.replace(/^la mossa vincente\s*:/i, "**$&**"))
          )
        );
        continue;
      }
    }

    const heading = line.match(new RegExp(`^(#{1,6})\\s+(${EMOJI_SRC})\\s*(.*)$`, "u"));
    if (heading) {
      out.push(`${heading[1]} ${emojiSpan(heading[2])} ${heading[3]}`);
      continue;
    }

    // A line that is only emphasis ("*Cosa si rischia*"), with text right below, is a subheading.
    const emphasis = line.match(/^\s*([*_])([^*_]{2,60})\1\s*$/);
    if (emphasis && !/[.!?…:]$/.test(emphasis[2].trim()) && plain(lines[i + 1] ?? "")) {
      if (!prevBlank()) out.push("");
      out.push(`#### ${emphasis[2].trim()}`);
      continue;
    }

    // Plain-text posts: a short line opening a block, with its paragraph right below, is a title.
    const next = lines[i + 1] ?? "";
    if (
      inferTitles &&
      prevBlank() &&
      plain(next) &&
      !opensBlock(next) &&
      p.length <= 90 &&
      !/[.,;:!?…]$/.test(p) &&
      !/^[-*+>|<]|^\d+\s*[.)]/.test(line.trim()) &&
      new RegExp(`^(?:${EMOJI_SRC}|[A-ZÀ-ÖØ-Þ"«])`, "u").test(p)
    ) {
      const emoji = line.trim().match(LEADING_EMOJI);
      const title = emoji ? line.trim().slice(emoji[0].length) : line.trim();
      const level = emoji || /:\s/.test(title) ? "##" : "###";
      out.push(`${level} ${emoji ? `${emojiSpan(emoji[1])} ` : ""}${title}`);
      continue;
    }

    // Lines led by an emoji ("🛵 **1948:** …") are separate items, not one paragraph.
    if (LEADING_EMOJI.test(p) && !prevBlank() && !MD_HEADING.test(out[out.length - 1])) {
      out.push("");
    }

    out.push(line);
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * The post's own words for excerpts and reading time: the menu, box labels and sign-off are left out.
 */
export function postText(md: string): string {
  return formatPost(md)
    .replace(/<div class="post-box post-menu[^"]*">[\s\S]*?<\/div>/g, "")
    .replace(/<div class="post-signoff">[\s\S]*?<\/div>/g, "")
    .replace(/<p class="post-label">[\s\S]*?<\/p>/g, "");
}
