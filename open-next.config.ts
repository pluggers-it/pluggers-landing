// @ts-expect-error - types are resolved at build time
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config — uses the default in-memory cache layer.
// If/when we add ISR-heavy pages or KV caching, plug them in here:
//   incrementalCache, queue, tagCache, etc.
export default defineCloudflareConfig();
