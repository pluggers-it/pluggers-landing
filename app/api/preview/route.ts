import { NextRequest, NextResponse } from "next/server";
import { markdownToHtml } from "@/lib/posts";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { markdown?: string };
    const html = await markdownToHtml(body.markdown ?? "");
    return NextResponse.json({ html });
  } catch {
    return NextResponse.json({ html: "" }, { status: 400 });
  }
}
