/**
 * Usage: node scripts/create-admin.mjs <username> <password>
 *
 * Generates a bcrypt hash and prints the SQL INSERT to create
 * the first (or any additional) admin user.
 * Copy the output and paste it into the Supabase SQL Editor.
 *
 * Example:
 *   node scripts/create-admin.mjs gianmarco MySecurePass99!
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const bcrypt  = require("bcryptjs");

const [,, username, password] = process.argv;

if (!username || !password) {
  console.error("Usage: node scripts/create-admin.mjs <username> <password>");
  process.exit(1);
}

const SALT_ROUNDS = 12;
const hash = await bcrypt.hash(password, SALT_ROUNDS);
const safe = username.trim().toLowerCase().replace(/'/g, "''");

console.log("\n── SQL to run in Supabase SQL Editor ──────────────────────────────\n");
console.log(`INSERT INTO public.admin_users (username, password_hash)`);
console.log(`VALUES ('${safe}', '${hash}');`);
console.log("\n────────────────────────────────────────────────────────────────────\n");
console.log("Done. Paste the SQL above into https://supabase.com/dashboard");
console.log(`   → Project: zfmcltiraiyxryjfahgw → SQL Editor → Run\n`);
