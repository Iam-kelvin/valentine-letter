"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UnlockBox({ slug }: { slug: string }) {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function unlock() {
    setLoading(true);
    setErr(null);

    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) router.refresh();
    else setErr(data?.error ?? "Failed");
  }

  const disabled = loading || !password;

  return (
    <div
      style={{
        marginTop: 18,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 18,
        padding: 18,
        width: "50%",
      }}
    >
      <p style={{ marginTop: 0, marginBottom: 12, opacity: 0.9 }}>
        This letter is locked. Enter the password to view it.
      </p>

      <label style={{ display: "block", marginBottom: 8, opacity: 0.8 }}>
        Password
      </label>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.06)",
          color: "white",
          outline: "none",
          marginBottom: 12,
        }}
      />

      <button
        onClick={unlock}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.18)",
          background: disabled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.16)",
          color: disabled ? "rgba(255,255,255,0.45)" : "white",
          fontWeight: 700,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Unlocking..." : "Unlock"}
      </button>

      {err ? <p style={{ marginTop: 12, color: "#ff5a6a" }}>{err}</p> : null}
    </div>
  );
}
