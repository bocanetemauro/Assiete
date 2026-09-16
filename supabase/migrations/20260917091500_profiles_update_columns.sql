-- Profielen: alleen de velden die een gebruiker echt mag wijzigen.
-- RLS beperkt UPDATE al tot de eigen rij; dit voorkomt daarnaast dat iemand via
-- de API zijn eigen id of aanmaakdatum herschrijft. updated_at zet de trigger.

revoke update on public.profiles from authenticated;
grant update (display_name, username, bio, avatar_url) on public.profiles to authenticated;
