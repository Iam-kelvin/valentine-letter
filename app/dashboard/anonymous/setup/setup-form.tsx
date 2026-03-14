"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  anonCardStyle,
  anonInputStyle,
  anonTextareaStyle,
  anonButtonStyle,
} from "@/lib/anonymous-ui";

export default function SetupForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const res = await fetch("/api/anonymous/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, displayName, bio }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setErr(data.error || "Failed");
      return;
    }

    router.push("/dashboard/anonymous");
  }

  return (
    <form onSubmit={onSubmit} style={{ ...anonCardStyle, display: "grid", gap: 16 }}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
        required
        style={anonInputStyle}
      />
      <input
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Display name (optional)"
        style={anonInputStyle}
      />
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Short bio (optional)"
        rows={4}
        style={anonTextareaStyle}
      />
      <button type="submit" disabled={loading} style={anonButtonStyle}>
        {loading ? "Saving..." : "Create my link"}
      </button>
      {err ? <p style={{ color: "#ff8ea1", margin: 0 }}>{err}</p> : null}
    </form>
  );
}