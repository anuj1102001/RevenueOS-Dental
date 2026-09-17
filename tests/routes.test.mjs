import { spawn } from "node:child_process";
import assert from "node:assert/strict";
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3099",
  ],
  {
    env: { ...process.env, STAFF_PASSWORD: "" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error("startup timeout")), 20000);
    server.stdout.on("data", (d) => {
      if (String(d).includes("Ready")) {
        clearTimeout(timer);
        resolve();
      }
    });
    server.on("exit", () => reject(Error("server exited")));
  });
  const cases = [
    ["/api/leads", "GET", null, null, 401],
    ["/api/leads/example", "PATCH", {}, "http://localhost:3099", 401],
    ["/dashboard", "GET", null, null, 307],
    [
      "/api/staff/login",
      "POST",
      { password: "wrong" },
      "https://evil.example",
      403,
    ],
    [
      "/api/staff/login",
      "POST",
      { password: "wrong" },
      "http://localhost:3099",
      503,
    ],
    ["/api/staff/logout", "POST", {}, "https://evil.example", 403],
  ];
  for (const [path, method, body, origin, status] of cases) {
    const r = await fetch("http://localhost:3099" + path, {
      method,
      redirect: "manual",
      headers: {
        "Content-Type": "application/json",
        ...(origin ? { Origin: origin } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    assert.equal(r.status, status, path);
    if (path === "/dashboard")
      assert.ok(r.headers.get("location").includes("/staff/login"));
    console.log(method, path, status, "PASS");
  }
} finally {
  server.kill();
}
