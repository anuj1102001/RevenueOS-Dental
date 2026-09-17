"use client";
import { FormEvent, useState } from "react";
export default function StaffLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const password = new FormData(event.currentTarget).get("password");
    try {
      const response = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to sign in.");
      window.location.assign("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign in.");
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="staff-form">
      <label htmlFor="password">Owner password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        maxLength={256}
        autoFocus
      />
      <p className="error" role="alert">
        {error}
      </p>
      <button className="button" disabled={busy}>
        {busy ? "Signing in…" : "Open dashboard"}
      </button>
    </form>
  );
}
