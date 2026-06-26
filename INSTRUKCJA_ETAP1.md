# Etap 1 — chmura + logowanie (Supabase)

Cel: Twoje dane mają być online i prywatne, te same na telefonie i komputerze, z logowaniem przez link e-mail (bez hasła). To same kliknięcia + jedno wklejenie. Zrób to **na komputerze**, ok. 15 minut. Wszystko darmowe.

Masz paczkę `portfel-cloud.zip` — rozpakuj ją.

---

## Krok 1 — Załóż projekt Supabase

1. Wejdź na **supabase.com** → **Start your project** → załóż konto (możesz przez GitHub).
2. Kliknij **New project**.
3. Nazwa: `portfel`. Hasło do bazy: wpisz dowolne mocne i **zapisz je** (nie będzie potrzebne na co dzień).
4. **Region**: wybierz **Central EU (Frankfurt)** — najbliżej Polski.
5. Kliknij **Create new project** i poczekaj ~2 minuty, aż się postawi.

---

## Krok 2 — Utwórz tabele (jedno wklejenie)

1. W menu po lewej wejdź w **SQL Editor** → **New query**.
2. Wklej **całość** poniższego kodu i kliknij **Run** (prawy dół). Powinno pojawić się „Success”.

```sql
-- Tabela transakcji
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  date date not null,
  account text,
  type text not null default 'buy',
  ticker text,
  country text default 'US',
  qty numeric,
  price numeric,
  amount_pln numeric,
  amount_usd numeric,
  funding_source text,
  note text,
  created_at timestamptz default now()
);
alter table public.transactions enable row level security;
grant all on public.transactions to authenticated;
create policy "own_transactions" on public.transactions
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Tabela ustawień (na przyszłość: krypto, PPK, Tiery, cele rebalansu)
create table public.settings (
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  data jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);
alter table public.settings enable row level security;
grant all on public.settings to authenticated;
create policy "own_settings" on public.settings
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

To tworzy bazę i zabezpieczenie, dzięki któremu **tylko Ty** widzisz swoje dane.

---

## Krok 3 — Włącz logowanie e-mailem

1. Menu po lewej: **Authentication** → **Sign In / Providers** (lub **Providers**).
2. Upewnij się, że **Email** jest włączony (zwykle jest domyślnie).
3. Wejdź w **Authentication** → **URL Configuration**:
   - **Site URL**: wpisz adres swojej aplikacji z Vercel, np. `https://portfel-twojanazwa.vercel.app`
   - **Redirect URLs**: dodaj ten sam adres (możesz dopisać `/**` na końcu, np. `https://portfel-twojanazwa.vercel.app/**`).
   - Zapisz (**Save**).

---

## Krok 4 — Skopiuj dwa klucze do aplikacji

1. Menu po lewej: **Project Settings** (ikona koła zębatego) → **API**.
2. Skopiuj dwie wartości:
   - **Project URL** (np. `https://abcxyz.supabase.co`)
   - **anon public** (długi klucz w sekcji „Project API keys”)
3. Otwórz plik **config.js** z paczki (np. w Notatniku / TextEdit) i wklej je w miejsce `WKLEJ_TUTAJ_...`:

```js
window.SUPABASE_URL = "https://abcxyz.supabase.co";
window.SUPABASE_ANON_KEY = "tu-długi-klucz-anon-public";
```

Uwaga: klucz **anon public** jest publiczny z założenia — może być w aplikacji, to bezpieczne. Klucza **service_role** NIE używamy nigdzie.

---

## Krok 5 — Wgraj pliki na GitHub

1. Wejdź do swojego repozytorium **portfel** na github.com.
2. **Add file → Upload files**.
3. Przeciągnij z rozpakowanej paczki: **index.html**, **config.js** (z wklejonymi kluczami) oraz resztę plików (ikony, manifest, folder `api`). GitHub nadpisze stare.
4. Na dole **Commit changes**.
5. Vercel sam zauważy zmianę i zaktualizuje stronę w ~30 sekund.

---

## Krok 6 — Test (najważniejsze!)

1. Otwórz swój adres `…vercel.app` (najlepiej najpierw na komputerze).
2. Wpisz e-mail → **Wyślij link logowania**.
3. Sprawdź skrzynkę, kliknij link — wróci do aplikacji już zalogowanej.
4. Dodaj przykładową transakcję (np. CRWD, US, Kup, dowolna data, 1 szt).
5. Otwórz aplikację **na iPhonie** (z ikonki) → zaloguj się tym samym e-mailem → powinieneś zobaczyć **tę samą transakcję**. To znaczy, że chmura działa. 🎉

---

## Dobrze wiedzieć

- **Darmowe.** Limity Supabase są dla Ciebie nieosiągalne (jesteś jednym użytkownikiem).
- **Jeden haczyk:** darmowy projekt usypia po 7 dniach całkowitej bezczynności — dane zostają, a pierwsze wejście po przerwie trwa ~30 s. Przy regularnym używaniu w ogóle tego nie zauważysz.
- **Logowanie rzadkie:** po zalogowaniu sesja trzyma się długo, więc na co dzień nie musisz logować się za każdym razem.
- **Maile z linkiem:** darmowy plan ma limit kilku maili na godzinę — przy jednym użytkowniku bez znaczenia.
- To etap fundamentu — wygląda skromnie (logowanie + lista). W kolejnych etapach przelejemy tu wykres, benchmark i resztę.
