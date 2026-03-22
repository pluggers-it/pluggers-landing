-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: create_waitlist
-- Created:   2026-03-22
-- Purpose:   Initial schema for the Pluggers waitlist.
--            Includes phone (NOT NULL), RLS enabled, INSERT-only for anon.
-- ─────────────────────────────────────────────────────────────────────────────


-- ─── 1. TABLE ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.waitlist (
  id          BIGSERIAL    PRIMARY KEY,
  email       TEXT         NOT NULL UNIQUE,
  first_name  TEXT         NOT NULL DEFAULT '',
  last_name   TEXT         NOT NULL DEFAULT '',
  phone       TEXT         NOT NULL,
  profession  TEXT         NOT NULL DEFAULT '',
  region      TEXT         NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


-- ─── 2. ROW LEVEL SECURITY ───────────────────────────────────────────────────

-- Enable RLS: by default ALL operations are denied to everyone.
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Drop policies if they already exist (makes this migration idempotent).
DROP POLICY IF EXISTS "allow_anon_insert" ON public.waitlist;

-- Allow anonymous users to INSERT (sign up) — no conditions needed.
CREATE POLICY "allow_anon_insert"
  ON public.waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- SELECT / UPDATE / DELETE: no policy is defined → denied for everyone,
-- including authenticated users and the service role via PostgREST.
-- The service_role key used server-side bypasses RLS entirely by design,
-- so the backend API can still read data if ever needed.


-- ─── 3. INDEX (optional but recommended for lookups by email) ────────────────

CREATE INDEX IF NOT EXISTS waitlist_email_idx ON public.waitlist (email);
