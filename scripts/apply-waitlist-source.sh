#!/usr/bin/env bash
# Applica la migration source sulla tabella waitlist usando la connessione Postgres diretta.
#
# 1. Supabase Dashboard → Project Settings → Database → Connection string → URI
#    (usa "Direct connection", non il pooler, per DDL).
# 2. Esempio:
#    export DATABASE_URL='postgresql://postgres.[ref]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'
#    oppure la stringa "Direct" che ti mostra la dashboard.
# 3. ./scripts/apply-waitlist-source.sh
#
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SQL="$ROOT/supabase/migrations/20260325000000_waitlist_source.sql"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Errore: imposta DATABASE_URL con la connection string Postgres (vedi commenti nello script)."
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "Errore: serve psql (client PostgreSQL). Installa: brew install libpq && brew link --force libpq"
  exit 1
fi

echo "Applico migration: $SQL"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$SQL"
echo "OK."
