import { llmsIndex } from "@/lib/llms";
import { appInStores } from "@/lib/prelaunch";

export const dynamic = "force-static";
export const revalidate = 60;

export async function GET() {
  return new Response(llmsIndex(await appInStores()), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
