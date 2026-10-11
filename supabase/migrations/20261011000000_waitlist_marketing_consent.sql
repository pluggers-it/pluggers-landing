-- Consenso facoltativo al marketing dal modulo contatti: data e ora in cui è stato dato.
-- NULL = consenso non dato. Separato dal consenso privacy (privacy_accepted_at).
ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS marketing_consent_at TIMESTAMPTZ;

COMMENT ON COLUMN public.waitlist.marketing_consent_at IS 'Quando ha spuntato il consenso marketing nel modulo (NULL se non dato).';
