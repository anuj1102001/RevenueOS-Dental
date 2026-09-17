import { redirect } from "next/navigation";
import { isStaff } from "@/lib/staff-auth";
import { prisma } from "@/lib/prisma";
import LeadDashboard from "@/components/LeadDashboard";
export const dynamic = "force-dynamic";
export default async function Dashboard() {
  if (!(await isStaff())) redirect("/staff/login");
  try {
    const [leads, total, open, booked, overdue] = await Promise.all([
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: { notIn: ["WON", "LOST"] } } }),
      prisma.lead.count({ where: { status: "APPOINTMENT_BOOKED" } }),
      prisma.lead.count({
        where: {
          followUpAt: { lte: new Date() },
          status: { notIn: ["WON", "LOST"] },
        },
      }),
    ]);
    return (
      <LeadDashboard
        leads={leads.map((l) => ({
          ...l,
          createdAt: l.createdAt.toISOString(),
          updatedAt: l.updatedAt.toISOString(),
          followUpAt: l.followUpAt?.toISOString() || null,
        }))}
        stats={{ total, open, booked, overdue }}
      />
    );
  } catch {
    return (
      <main className="login-shell">
        <section className="login-card">
          <h1>Enquiries are temporarily unavailable.</h1>
          <p>
            Please reload in a moment. Your saved enquiries have not been
            changed.
          </p>
          <a className="button" href="/dashboard">
            Try again
          </a>
        </section>
      </main>
    );
  }
}
