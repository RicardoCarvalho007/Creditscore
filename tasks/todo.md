# CreditSmart build plan

- [x] Scaffold Next.js 14 + Tailwind + TypeScript
- [x] Add Supabase client, env, DB schema (config/supabase-schema.sql)
- [x] Auth pages (login/signup) and middleware
- [x] Landing page + bottom nav
- [x] Onboarding steps 1–3
- [x] Score calculation + AI summary + AI plan APIs
- [x] Dashboard (score gauge, AI summary, breakdown)
- [x] Offers page + Plan page
- [x] Profile page and wiring

## Review

1. Run `config/supabase-schema.sql` in Supabase SQL Editor.
2. Ensure `.env.local` has Supabase URL, anon key, service role key, and GEMINI_API_KEY.
3. Build: `npm run build`. Dev: `npm run dev`.
4. Core loop: sign up → onboarding (3 steps) → score calculated + AI summary/plan → dashboard → offers & plan.
