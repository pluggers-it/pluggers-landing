-- Pre-iscrizione: chi cerca un professionista lascia l'email o il telefono, il professionista il telefono
-- e l'email solo se vuole. Senza email la riga ha `email` = '' (come le altre colonne di testo).
-- L'unicità resta per le email vere: due iscrizioni senza email non devono scontrarsi sulla stringa vuota.
-- Finché non è applicata la seconda iscrizione senza email dà errore (l'API non la scambia per un doppione).
BEGIN;

ALTER TABLE public.waitlist
  DROP CONSTRAINT IF EXISTS waitlist_email_key;

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_unique_idx
  ON public.waitlist (email)
  WHERE email <> '';

COMMIT;
