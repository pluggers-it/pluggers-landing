-- Città indicata nel modulo d'attesa: serve a scegliere le prossime zone.
-- Prende il posto di `region`, che resta per le righe già raccolte.
ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.waitlist.city IS 'Città scritta nel modulo (testo libero, max 60).';

-- `profession` è nella migrazione iniziale ma mancava sulla tabella viva:
-- l'API la scrive a ogni iscrizione, e senza la colonna l'inserimento falliva.
ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS profession TEXT NOT NULL DEFAULT '';
