-- Blog: ruolo «autore», articoli in bozza e cambio password al primo accesso.
-- Comprende pluggers-it/pluggers-backend#755 (stesse istruzioni) più must_change_password:
-- è idempotente, quindi applicarla dopo #755 o al suo posto non cambia il risultato.
-- Va applicata PRIMA del rilascio del codice che legge role, status e must_change_password.

-- gli account che ci sono già restano admin
ALTER TABLE public.admin_users
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'autore'));

-- false per gli account che ci sono già; la landing lo mette a true per chi riceve una password temporanea
ALTER TABLE public.admin_users
  ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false;

-- gli articoli che ci sono già restano pubblicati; la landing imposta sempre lo stato in modo esplicito
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pubblicato' CHECK (status IN ('bozza', 'pubblicato'));

-- un articolo senza autore viene mostrato come scritto da un admin (HTML non ripulito): per questo la landing
-- non elimina un account finché ha articoli (409), e il SET NULL qui sotto non scatta mai dal pannello
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS author_id BIGINT REFERENCES public.admin_users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS posts_author_id_idx ON public.posts (author_id);

-- la lettura pubblica (anon) vedeva tutte le righe: le bozze non devono uscire
DROP POLICY IF EXISTS allow_public_read ON public.posts;
CREATE POLICY allow_public_read ON public.posts FOR SELECT TO anon USING (status = 'pubblicato');
