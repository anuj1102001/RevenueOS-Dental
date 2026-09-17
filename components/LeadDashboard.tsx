"use client";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LeadView,
  leadStatuses,
  leadTemperatures,
  label,
} from "@/lib/lead-fields";
type Stats = { total: number; open: number; booked: number; overdue: number };
function displayDate(value: string | null) {
  return value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Not scheduled";
}
function inputDate(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
export default function LeadDashboard({
  leads,
  stats,
}: {
  leads: LeadView[];
  stats: Stats;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const filtered = useMemo(
    () =>
      leads.filter(
        (l) =>
          (filter === "ALL" || l.status === filter) &&
          [l.name, l.phone, l.email, l.treatment]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [leads, query, filter],
  );
  const lead = leads.find((l) => l.id === selected);
  async function logout() {
    setLoggingOut(true);
    try {
      const r = await fetch("/api/staff/logout", { method: "POST" });
      if (!r.ok) throw Error();
      window.location.assign("/staff/login");
    } catch {
      setNotice("Could not sign out. Try again.");
      setLoggingOut(false);
    }
  }
  return (
    <main className="workspace">
      <aside className="workspace-nav">
        <Link href="/dashboard" className="workspace-brand">
          Revenue<span>OS</span>
        </Link>
        <p>THE CLINIC WORKSPACE</p>
        <a href="#pipeline" className="nav-active">
          Enquiry pipeline
        </a>
        <Link href="/">View clinic website ↗</Link>
        <div className="workspace-nav-bottom">
          <span>Owner workspace</span>
          <button onClick={logout} disabled={loggingOut}>
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>
      <section className="workspace-main">
        <header className="workspace-header">
          <div>
            <span className="eyebrow">PRIVATE WORKSPACE</span>
            <h1>
              Every enquiry.
              <br />
              <em>A thoughtful next step.</em>
            </h1>
            <p className="muted">
              Manage consultation requests and keep follow-ups moving.
            </p>
          </div>
          <button className="button secondary" onClick={() => router.refresh()}>
            Refresh enquiries
          </button>
        </header>
        <div className="live-note">
          <span className="live-dot" />
          Connected to saved enquiries{" "}
          <span>· Includes any test submissions</span>
        </div>
        <div className="workspace-stats">
          {[
            ["Total enquiries", stats.total],
            ["Open enquiries", stats.open],
            ["Appointments booked", stats.booked],
            ["Follow-ups due", stats.overdue],
          ].map(([title, count]) => (
            <div key={title} className="workspace-stat">
              <span>{title}</span>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
        <p role="status">{notice}</p>
        <section className="pipeline" id="pipeline">
          <div className="pipeline-heading">
            <div>
              <h2>Enquiry pipeline</h2>
              <p>
                Showing {filtered.length} of the latest {leads.length}{" "}
                enquiries.
              </p>
            </div>
            <div className="pipeline-filters">
              <label>
                <span className="sr-only">Search enquiries</span>
                <input
                  placeholder="Search name, contact or treatment"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <label>
                <span className="sr-only">Filter by status</span>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="ALL">All statuses</option>
                  {leadStatuses.map((s) => (
                    <option key={s} value={s}>
                      {label(s)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Enquiry</th>
                  <th>Treatment</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Follow-up</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <strong>{l.name}</strong>
                      <small>{l.phone}</small>
                    </td>
                    <td>{l.treatment}</td>
                    <td>
                      <span className="status-pill">{label(l.status)}</span>
                    </td>
                    <td>
                      <span className={`pill ${l.temperature.toLowerCase()}`}>
                        {label(l.temperature)}
                      </span>
                    </td>
                    <td suppressHydrationWarning>
                      {displayDate(l.followUpAt)}
                    </td>
                    <td>
                      <button
                        className="text-button"
                        onClick={() => setSelected(l.id)}
                      >
                        Manage →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <div className="empty-state">
                <h3>
                  {leads.length
                    ? "No matching enquiries."
                    : "Your pipeline starts here."}
                </h3>
                <p>
                  {leads.length
                    ? "Try a different search or status."
                    : "Consultation requests from your website will appear here."}
                </p>
              </div>
            )}
          </div>
        </section>
        <footer className="workspace-footer">
          RevenueOS Dental · Independent sales demo. Follow-up dates are
          reminders here; messages are not sent automatically.
        </footer>
      </section>
      {lead && (
        <LeadDialog close={() => setSelected(null)}>
          <LeadEditor
            key={lead.id + lead.updatedAt}
            lead={lead}
            close={() => setSelected(null)}
            saved={() => {
              setNotice("Enquiry updated.");
              setSelected(null);
              router.refresh();
            }}
          />
        </LeadDialog>
      )}
    </main>
  );
}
function LeadEditor({
  lead,
  close,
  saved,
}: {
  lead: LeadView;
  close: () => void;
  saved: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(event.currentTarget);
    const followUp = String(f.get("followUpAt") || "");
    try {
      const r = await fetch("/api/leads/" + lead.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: f.get("status"),
          temperature: f.get("temperature"),
          notes: f.get("notes"),
          followUpAt: followUp ? new Date(followUp).toISOString() : null,
          updatedAt: lead.updatedAt,
        }),
      });
      const data = await r.json();
      if (r.status === 401) {
        window.location.assign("/staff/login");
        return;
      }
      if (!r.ok) throw Error(data.error || "Unable to save.");
      saved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save.");
      setBusy(false);
    }
  }
  return (
    <>
      <div className="drawer-top">
        <span className="eyebrow">ENQUIRY DETAILS</span>
        <button
          className="text-button"
          onClick={close}
          disabled={busy}
          autoFocus
          aria-label="Close enquiry"
        >
          Close ×
        </button>
      </div>
      <h2 id="lead-title">{lead.name}</h2>
      <p className="muted">{lead.treatment}</p>
      <dl className="lead-contact">
        <dt>Phone</dt>
        <dd>{lead.phone}</dd>
        <dt>Email</dt>
        <dd>{lead.email || "Not provided"}</dd>
        <dt>Preferred time</dt>
        <dd>{lead.preferredTime || "Not provided"}</dd>
        <dt>Received</dt>
        <dd suppressHydrationWarning>{displayDate(lead.createdAt)}</dd>
        <dt>Contact consent</dt>
        <dd>{lead.consent ? "Provided" : "Not provided"}</dd>
      </dl>
      <form className="staff-form" onSubmit={save}>
        <label htmlFor="status">Status</label>
        <select name="status" id="status" defaultValue={lead.status}>
          {leadStatuses.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </select>
        <label htmlFor="temperature">Priority</label>
        <select
          name="temperature"
          id="temperature"
          defaultValue={lead.temperature}
        >
          {leadTemperatures.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </select>
        <label htmlFor="followUpAt">Follow-up date and time</label>
        <input
          type="datetime-local"
          id="followUpAt"
          name="followUpAt"
          defaultValue={inputDate(lead.followUpAt)}
        />
        <small>Shown in your device’s local time. Clear to remove.</small>
        <label htmlFor="notes">Team notes</label>
        <textarea
          name="notes"
          id="notes"
          rows={5}
          maxLength={5000}
          defaultValue={lead.notes || ""}
          placeholder="Add the next step or a contact update."
        />
        <small>
          Use this demo for enquiry management, not medical records.
        </small>
        <p role="alert" className="error">
          {error}
        </p>
        <button className="button" disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
        </button>
      </form>
    </>
  );
}

function LeadDialog({
  children,
  close,
}: {
  children: React.ReactNode;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="lead-drawer drawer-dialog"
      aria-labelledby="lead-title"
      onCancel={close}
    >
      {children}
    </dialog>
  );
}
