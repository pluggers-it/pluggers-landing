-- Traccia la provenenza dell'iscrizione (waitlist vs newsletter) per finalità GDPR.
ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'waitlist';

ALTER TABLE public.waitlist
  DROP CONSTRAINT IF EXISTS waitlist_source_check;

ALTER TABLE public.waitlist
  ADD CONSTRAINT waitlist_source_check
  CHECK (source IN ('waitlist', 'newsletter'));

COMMENT ON COLUMN public.waitlist.source IS 'Origine modulo: waitlist (landing) o newsletter (pagina dedicata).';
