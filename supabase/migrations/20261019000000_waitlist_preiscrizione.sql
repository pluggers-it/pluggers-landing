-- Pre-iscrizione (landing in pre-lancio): da quale pagina arriva l'iscrizione e,
-- per chi cerca un professionista, il problema in una riga.
-- Il ruolo sta in `profession`: «cliente» per chi cerca, il mestiere per chi lo fa.
-- Finché questa non è applicata l'API inserisce la riga senza le due colonne.
ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS page TEXT NOT NULL DEFAULT '';

ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS problem TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.waitlist.page IS 'Pagina del sito da cui è partito il modulo (percorso, es. /torino/idraulico).';
COMMENT ON COLUMN public.waitlist.problem IS 'Problema scritto dal cliente nella pre-iscrizione (facoltativo, max 200).';
