# RevenueOS Dental

An independent sales-demo product showing how a premium dental website can connect visitor acquisition, an AI Smile Concierge, consultation lead capture and a revenue-operations dashboard.

> **Demo only.** This project is not an official website or product of Precision Dental Clinic or any other clinic. Sample dashboard metrics are fictional/demo data.

## Product flow
Visitor → Smile Concierge → consultation request → PostgreSQL lead → RevenueOS dashboard → follow-up / appointment / conversion.

## Stack
- Next.js 15 + React 19 + TypeScript
- PostgreSQL + Prisma
- OpenAI API (optional; concierge has a safe fallback without a key)
- Responsive custom CSS

## Run locally
1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and add a PostgreSQL `DATABASE_URL`.
4. Run `npx prisma generate`.
5. Run `npm run db:migrate` to create the database tables.
6. Optionally add `OPENAI_API_KEY` for the live concierge.
7. Run `npm run dev` and open `http://localhost:3000`.
8. RevenueOS dashboard: `http://localhost:3000/dashboard`.

## Deployment
Deploy the Next.js app to Vercel and use managed PostgreSQL. Add `DATABASE_URL` and optionally `OPENAI_API_KEY` in the hosting environment, run `npm run db:migrate` once against the database before using lead capture. Run migrations with a direct (non-pooler) PostgreSQL URL; the deployed application can use the pooled URL. The build generates Prisma Client automatically.

## Healthcare scope
The concierge is restricted to general service navigation and consultation-booking assistance. It must not diagnose, prescribe, determine suitability, promise outcomes or act as emergency care. Production use requires clinic-approved content, privacy/consent review, appropriate data-processing agreements and jurisdiction-specific healthcare/comms compliance.

## Next production milestones
Individual staff accounts and roles; real calendar integration; consented WhatsApp integration; lead detail/conversation view; auditable follow-up approvals; clinic-configurable knowledge base; real event analytics; monitoring, rate limiting and abuse controls.
## Private owner dashboard

Set `STAFF_PASSWORD` to a unique password of at least 32 characters in Vercel (Production, and Preview if needed), then redeploy. Never prefix it with `NEXT_PUBLIC_`, commit it, or send it in chat. Open `/staff/login` and use that password. A missing/short value disables sign-in; the dashboard and lead read/update APIs remain locked.

This is a single-owner sales-demo login, not individual staff accounts or a clinical records system. Signed and encrypted HttpOnly cookies expire after eight hours. Rotating the password revokes existing sessions. Login has a database-backed global limit of 30 attempts per 15 minutes; an attacker can exhaust the shared bucket, so replace this with managed identity before multi-user rollout.

The dashboard loads the latest 200 enquiries, with total counts across all records. It supports search, status filtering, priority, notes, local-time follow-up dates, and optimistic update conflict detection. Follow-up dates are reminders only; no messages or calendar invitations are sent. Test submissions are included in the real counts.

## Migration baseline for the existing demo

The two checked-in migration SQL files were applied to this demo through the Neon connector because direct migration-engine connections from the build workspace were unavailable. Before running `prisma migrate deploy` against this existing database, confirm the schema matches and baseline both migrations using a direct database connection:

```sh
npx prisma migrate resolve --applied 20260916000000_init
npx prisma migrate resolve --applied 20260917000000_staff_dashboard
```

Fresh databases can use `npm run db:migrate` normally. Do not reset the existing database.

## Verification

Run `npm run build`, `node --experimental-strip-types --test tests/staff-session.test.mjs` (Node 22.6+), and `node tests/routes.test.mjs`. Route tests start a local server with staff login disabled and assert access denial and origin checks. Successful production sign-in and lead edits must also be checked after setting the private Vercel password.

## Precision proposal experience

The public homepage uses self-hosted Cormorant Garamond and DM Sans fonts, a cream/charcoal/champagne palette, original abstract SVG artwork, responsive navigation, treatment-category cards, an enquiry journey, FAQs, and an accessible demo enquiry form. No clinic photographs, clinician profiles, testimonials or patient outcomes are fabricated.

The concierge offers preset navigation replies when `OPENAI_API_KEY` is missing and visibly labels that state. When the existing OpenAI integration returns a response, the UI labels it as AI. Real AI activation still requires configuring the server-side key and redeploying; do not put credentials in source control. Before clinic use, add durable usage limits, approved clinic information, a privacy review and appropriate staff accounts. The current site is an independent sales demo, not an official Precision Dental Clinic website.

Visual changes are scoped under `.clinic-site` in `app/clinic.css` to preserve the working owner dashboard. The enquiry API and database schema are unchanged.
