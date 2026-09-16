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
3. Copy `.env.example` to `.env.local` and add a PostgreSQL `DATABASE_URL`.
4. Run `npx prisma generate`.
5. Run `npx prisma db push` for the demo database.
6. Optionally add `OPENAI_API_KEY` for the live concierge.
7. Run `npm run dev` and open `http://localhost:3000`.
8. RevenueOS dashboard: `http://localhost:3000/dashboard`.

## Deployment
Deploy the Next.js app to Vercel and use managed PostgreSQL. Add `DATABASE_URL` and optionally `OPENAI_API_KEY` in the hosting environment, then configure Prisma migrations for releases.

## Healthcare scope
The concierge is restricted to general service navigation and consultation-booking assistance. It must not diagnose, prescribe, determine suitability, promise outcomes or act as emergency care. Production use requires clinic-approved content, privacy/consent review, appropriate data-processing agreements and jurisdiction-specific healthcare/comms compliance.

## Next production milestones
Authentication and staff roles; real calendar integration; consented WhatsApp integration; lead detail/conversation view; auditable follow-up approvals; clinic-configurable knowledge base; real event analytics; monitoring, rate limiting and abuse controls.