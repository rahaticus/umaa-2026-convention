# Deploying UMAA 2026

Deploy the repository to Vercel with Node 20+ and set `NEXT_PUBLIC_SITE_URL` to the production HTTPS URL. The attendee experience works with no other environment variables.

For live announcements, configure a small protected data endpoint backed by Supabase and set the Supabase variables plus a comma-separated `ADMIN_EMAILS` allowlist. Never expose a Supabase service-role key to the browser. Configure the production domain before opening the PWA publicly.

Before launch, run `pnpm build`, verify the schedule at phone and desktop widths, and test a first visit followed by offline mode.
