"use client";

import { useState } from "react";
import Link from "next/link";
import {
  anonCardStyle,
  anonTextareaStyle,
  anonInputStyle,
  anonButtonStyle,
  anonSecondaryButtonStyle,
} from "@/lib/anonymous-ui";

export default function AnonymousSendForm({
  username,
  profileId,
}: {
  username: string;
  profileId: number;
}) {
  const [message, setMessage] = useState("");
  const [senderHint, setSenderHint] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/anonymous/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId,
          message,
          senderHint: senderHint || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.error || "Failed to send");
        setLoading(false);
        return;
      }

      setDone(true);
      setMessage("");
      setSenderHint("");
    } catch {
      setErr("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div style={{ ...anonCardStyle, textAlign: "center" }}>
        <div style={{ fontSize: 38, marginBottom: 12 }}>✅</div>
        <p style={{ fontSize: 20, marginTop: 0 }}>Message sent anonymously</p>
        <p style={{ opacity: 0.8, marginBottom: 20 }}>
          Want your own anonymous inbox link too?
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/anonymous/sign-up" style={anonButtonStyle}>
            Create your own link
          </Link>
          <Link href="/anonymous/sign-in" style={anonSecondaryButtonStyle}>
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ ...anonCardStyle, display: "grid", gap: 14 }}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Write something anonymous to @${username}`}
        rows={6}
        required
        disabled={loading}
        style={anonTextareaStyle}
      />

      <input
        value={senderHint}
        onChange={(e) => setSenderHint(e.target.value)}
        placeholder="Optional hint"
        disabled={loading}
        style={anonInputStyle}
      />

      <button
        type="submit"
        disabled={loading || !message.trim()}
        style={anonButtonStyle}
      >
        {loading ? "Sending..." : "Send anonymously"}
      </button>

      {err ? <p style={{ color: "#ff8ea1", margin: 0 }}>{err}</p> : null}
    </form>
  );
}
