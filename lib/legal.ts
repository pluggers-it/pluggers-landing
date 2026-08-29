import { promises as fs } from "fs";
import path from "path";
import { fillLegalTokens } from "./company";
import { markdownToHtml } from "./posts";

/**
 * Rende una pagina legale (content/legal/<slug>.md): riempie i token societari
 * da lib/company.ts e converte in HTML con la stessa pipeline remark del blog.
 * Fonte unica: aggiorni il markdown → si aggiorna la pagina.
 */
export async function renderLegalDoc(slug: "privacy" | "termini" | "cookie"): Promise<string> {
  const file = path.join(process.cwd(), "content", "legal", `${slug}.md`);
  const md = await fs.readFile(file, "utf8");
  return markdownToHtml(fillLegalTokens(md));
}
