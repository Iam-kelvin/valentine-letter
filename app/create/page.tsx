"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Tone = "romantic" | "cute" | "funny" | "poetic" | "spicy_pg13";
type Length = "short" | "medium" | "long";
type Privacy = "low" | "medium" | "high";
type Relationship =
  | "crush"
  | "dating"
  | "spouse"
  | "situationship"
  | "longDistance"
  | "friend"
  | "other";

const fieldStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.10)",
  color: "white",
  outline: "none",
  width: "100%",
};

// Special style for select dropdowns to fix white background issue
const selectStyle: React.CSSProperties = {
  ...fieldStyle,
  background: "rgba(0,0,0,0.6)", // Darker background for better contrast
  WebkitAppearance: "none", // Remove default browser styling
  MozAppearance: "none",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: "20px",
  paddingRight: "40px",
};

// Style for option elements
const optionStyle: React.CSSProperties = {
  background: "#1a1a1a",
  color: "white",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  opacity: 0.85,
  marginBottom: 6,
};

const buttonStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.18)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
  width: "100%",
  transition: "all 0.2s ease",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(0,0,0,0.35)",
  borderRadius: 18,
  padding: 16,
};

function toList(s: string) {
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function CreatePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [relationshipType, setRelationshipType] = useState<Relationship>("dating");
  const [tone, setTone] = useState<Tone>("romantic");
  const [length, setLength] = useState<Length>("medium");
  const [privateDetailLevel, setPrivateDetailLevel] = useState<Privacy>("medium");

  const [memoriesText, setMemoriesText] = useState("");
  const [insideJokesText, setInsideJokesText] = useState("");
  const [qualitiesText, setQualitiesText] = useState("");
  const [futurePlansText, setFuturePlansText] = useState("");
  const [callToAction, setCallToAction] = useState("");

  const [password, setPassword] = useState("");
  const [expiryMode, setExpiryMode] = useState<"never" | "24h" | "7d" | "custom">("never");
  const [customExpiry, setCustomExpiry] = useState("");

  function buildExpiresAt(): string | null {
    if (expiryMode === "never") return null;

    const now = new Date();

    if (expiryMode === "24h") return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    if (expiryMode === "7d") return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // custom datetime-local gives "YYYY-MM-DDTHH:mm"
    if (expiryMode === "custom") {
      if (!customExpiry) return null;
      const d = new Date(customExpiry);
      if (Number.isNaN(d.getTime())) return null;
      return d.toISOString();
    }

    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const payload = {
        senderName,
        recipientName,
        relationshipType,
        tone,
        length,
        privateDetailLevel,
        memories: toList(memoriesText),
        insideJokes: toList(insideJokesText),
        qualities: toList(qualitiesText),
        futurePlans: toList(futurePlansText),
        callToAction: callToAction.trim() || undefined,
        password: password.trim() || undefined,
        expiresAt: buildExpiresAt(),
      };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to generate");

      router.push(`/l/${data.slug}`);
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 28, color: "white" }}>
      <a href="/" style={{ display: "inline-block", marginBottom: 14, opacity: 0.85 }}>
        ← Home
      </a>

      <h1 style={{ fontSize: 36, marginBottom: 6 }}>Create a Valentine Letter 💌</h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>
        Fill the details → generate → share the link.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
        <div style={{ ...cardStyle, display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Your name (sender)</label>
              <input
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g., Kelvin"
                style={fieldStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Their name (recipient)</label>
              <input
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g., Sarah"
                style={fieldStyle}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Relationship</label>
              <select
                value={relationshipType}
                onChange={(e) => setRelationshipType(e.target.value as Relationship)}
                style={selectStyle}
              >
                <option value="crush" style={optionStyle}>Crush</option>
                <option value="dating" style={optionStyle}>Dating</option>
                <option value="spouse" style={optionStyle}>Spouse</option>
                <option value="situationship" style={optionStyle}>Situationship</option>
                <option value="longDistance" style={optionStyle}>Long-distance</option>
                <option value="friend" style={optionStyle}>Friend</option>
                <option value="other" style={optionStyle}>Other</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Tone</label>
              <select 
                value={tone} 
                onChange={(e) => setTone(e.target.value as Tone)} 
                style={selectStyle}
              >
                <option value="romantic" style={optionStyle}>Romantic</option>
                <option value="cute" style={optionStyle}>Cute</option>
                <option value="funny" style={optionStyle}>Funny</option>
                <option value="poetic" style={optionStyle}>Poetic</option>
                <option value="spicy_pg13" style={optionStyle}>Spicy (PG-13)</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as Length)}
                style={selectStyle}
              >
                <option value="short" style={optionStyle}>Short</option>
                <option value="medium" style={optionStyle}>Medium</option>
                <option value="long" style={optionStyle}>Long</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Detail level</label>
            <select
              value={privateDetailLevel}
              onChange={(e) => setPrivateDetailLevel(e.target.value as Privacy)}
              style={selectStyle}
            >
              <option value="low" style={optionStyle}>Low detail (general)</option>
              <option value="medium" style={optionStyle}>Medium detail</option>
              <option value="high" style={optionStyle}>High detail (more specific)</option>
            </select>
          </div>
        </div>

        <div style={{ ...cardStyle, display: "grid", gap: 12 }}>
          <div>
            <label style={labelStyle}>Memories (one per line)</label>
            <textarea
              value={memoriesText}
              onChange={(e) => setMemoriesText(e.target.value)}
              placeholder={"- First date at the beach\n- That time we got lost and laughed\n- Late night calls"}
              rows={5}
              style={{ ...fieldStyle, resize: "vertical" }}
            />
          </div>

          <div>
            <label style={labelStyle}>Inside jokes (one per line)</label>
            <textarea
              value={insideJokesText}
              onChange={(e) => setInsideJokesText(e.target.value)}
              placeholder={"- “CEO of snacks”\n- “Don’t start”\n- “Blue car!”"}
              rows={3}
              style={{ ...fieldStyle, resize: "vertical" }}
            />
          </div>

          <div>
            <label style={labelStyle}>Their qualities (one per line)</label>
            <textarea
              value={qualitiesText}
              onChange={(e) => setQualitiesText(e.target.value)}
              placeholder={"- Kind\n- Loyal\n- Funny\n- Ambitious"}
              rows={3}
              style={{ ...fieldStyle, resize: "vertical" }}
            />
          </div>

          <div>
            <label style={labelStyle}>Future plans (one per line)</label>
            <textarea
              value={futurePlansText}
              onChange={(e) => setFuturePlansText(e.target.value)}
              placeholder={"- Trip to Abuja\n- Start the business together\n- Movie night every Friday"}
              rows={3}
              style={{ ...fieldStyle, resize: "vertical" }}
            />
          </div>

          <div>
            <label style={labelStyle}>Call-to-action (optional)</label>
            <input
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              placeholder='e.g., "Be my Valentine tonight"'
              style={fieldStyle}
            />
          </div>
        </div>

        <div style={{ ...cardStyle, display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Password lock (optional)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set a password to lock this letter"
                style={fieldStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Expiry</label>
              <select 
                value={expiryMode} 
                onChange={(e) => setExpiryMode(e.target.value as any)} 
                style={selectStyle}
              >
                <option value="never" style={optionStyle}>No expiry</option>
                <option value="24h" style={optionStyle}>Expires in 24 hours</option>
                <option value="7d" style={optionStyle}>Expires in 7 days</option>
                <option value="custom" style={optionStyle}>Custom expiry</option>
              </select>
            </div>
          </div>

          {expiryMode === "custom" ? (
            <div>
              <label style={labelStyle}>Custom expiry time</label>
              <input
                type="datetime-local"
                value={customExpiry}
                onChange={(e) => setCustomExpiry(e.target.value)}
                style={{
                  ...fieldStyle,
                  colorScheme: "dark" // This helps with the datetime picker on dark backgrounds
                }}
              />
            </div>
          ) : null}
        </div>

        <button 
          disabled={loading} 
          type="submit" 
          style={{ 
            ...buttonStyle, 
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Generating..." : "Generate letter"}
        </button>

        {err ? <p style={{ color: "#ff6b6b", margin: 0, fontWeight: 500 }}>{err}</p> : null}
      </form>
    </main>
  );
}
