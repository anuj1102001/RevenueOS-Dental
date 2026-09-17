import Link from "next/link";
import { redirect } from "next/navigation";
import StaffLogin from "@/components/StaffLogin";
import { isStaff } from "@/lib/staff-auth";
import { staffPassword } from "@/lib/staff-session";
export const dynamic = "force-dynamic";
export default async function Login() {
  if (await isStaff()) redirect("/dashboard");
  return (
    <main className="login-shell">
      <section className="login-card">
        <Link href="/" className="eyebrow">
          Precision Reimagined
        </Link>
        <h1>Welcome back.</h1>
        <p className="muted">
          Your enquiries. Your next steps. One private workspace.
        </p>
        {staffPassword() ? (
          <StaffLogin />
        ) : (
          <p role="status" className="notice">
            Staff sign-in is not available yet. Contact the site owner to finish
            access setup.
          </p>
        )}
        <p className="muted login-foot">RevenueOS · Owner access</p>
        <Link href="/">← Return to the clinic experience</Link>
      </section>
    </main>
  );
}
