-- Consenso facoltativo al marketing dal modulo contatti: data e ora in cui è stato dato e versione del testo accettato.
-- NULL = consenso non dato. Separato dal consenso privacy (privacy_accepted_at).
ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS marketing_consent_at TIMESTAMPTZ;

ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS marketing_consent_version TEXT;

COMMENT ON COLUMN public.waitlist.marketing_consent_at IS 'Quando ha spuntato il consenso marketing nel modulo (NULL se non dato).';
COMMENT ON COLUMN public.waitlist.marketing_consent_version IS 'Versione del testo del consenso marketing accettato (MARKETING_CONSENT_VERSION in lib/marketingConsent.ts).';
