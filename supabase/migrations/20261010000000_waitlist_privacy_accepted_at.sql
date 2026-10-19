-- Quando ha accettato l'informativa privacy nel modulo: l'API la scrive a ogni iscrizione dal 24/03/2026.
-- Sulla tabella viva la colonna è stata creata a mano; qui serve perché `db:push` su un database nuovo funzioni.
ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMPTZ;

COMMENT ON COLUMN public.waitlist.privacy_accepted_at IS 'Quando ha spuntato la casella privacy nel modulo.';
