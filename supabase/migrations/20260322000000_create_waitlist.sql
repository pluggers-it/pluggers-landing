-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: initial schema
-- Created:   2026-03-22
-- Tables:    waitlist, posts
-- ─────────────────────────────────────────────────────────────────────────────


-- ════════════════════════════════════════════════════════════════════════════
-- 1. WAITLIST
-- ════════════════════════════════════════════════════════════════════════════

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

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_anon_insert" ON public.waitlist;

-- Anyone can sign up; nobody can read the data (privacy)
CREATE POLICY "allow_anon_insert"
  ON public.waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS waitlist_email_idx ON public.waitlist (email);


-- ════════════════════════════════════════════════════════════════════════════
-- 2. POSTS (blog)
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.posts (
  id          BIGSERIAL    PRIMARY KEY,
  title       TEXT         NOT NULL,
  category    TEXT         NOT NULL DEFAULT '',
  content     TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_public_read" ON public.posts;

-- Posts are publicly readable (it's a blog)
CREATE POLICY "allow_public_read"
  ON public.posts
  FOR SELECT
  TO anon
  USING (true);

-- Inserts and deletes happen server-side via the service_role key,
-- which bypasses RLS — no additional policies needed.

CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts (created_at DESC);
