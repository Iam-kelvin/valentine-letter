"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  slug: string;
  preview?: string | null;
  recipientName?: string | null;
};

export default function PremiumUpgradeCard({ slug, preview, recipientName }: Props) {
  const router = useRouter();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sections = useMemo(() => {
    const cleanPreview = preview?.trim();
    const name = recipientName?.trim() || "them";

    return [
      {
        label: "Opening",
        text: cleanPreview
          ? `Turns "${clipText(cleanPreview, 74)}" into a stronger first paragraph.`
          : `Starts with a more specific first paragraph for ${name}.`,
      },
      {
        label: "Body",
        text: "Adds grounded memories, smoother rhythm, and less generic phrasing.",
      },
      {
        label: "Closing",
        text: "Ends with a more personal final line instead of a plain wrap-up.",
      },
    ];
  }, [preview, recipientName]);

  async function unlockPremium() {
    setIsUnlocking(true);
    setError(null);

    try {
      const res = await fetch(`/api/letters/${slug}/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error ?? "Could not unlock Premium.");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not unlock Premium.");
    } finally {
      setIsUnlocking(false);
    }
  }

  return (
    <section style={cardStyle} aria-label="Premium Letter upgrade">
      <div style={topRowStyle}>
        <div>
          <div style={eyebrowStyle}>Premium Letter</div>
          <h2 style={titleStyle}>Want the fuller version?</h2>
          <p style={bodyStyle}>
            Keep this same link, then unlock a deeper rewrite with editing, premium styling,
            photos, and soundtrack controls.
          </p>
        </div>
      </div>

      <div style={sectionsStyle}>
        {sections.map((section) => (
          <div key={section.label} style={sectionCardStyle}>
            <strong>{section.label}</strong>
            <span>{section.text}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => void unlockPremium()}
        disabled={isUnlocking}
        style={primaryButtonStyle}
      >
        {isUnlocking ? "Creating Premium Letter..." : "Simulate Premium Unlock"}
      </button>

      <p style={noteStyle}>Payment is temporarily paused. This upgrades only this letter.</p>
      {error ? <p style={errorStyle}>{error}</p> : null}
    </section>
  );
}

function clipText(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

const cardStyle: React.CSSProperties = {
  margin: "28px auto 0",
  maxWidth: 860,
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.14)",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(143,32,80,0.16))",
  boxShadow: "0 22px 60px rgba(0,0,0,0.26)",
  padding: 18,
};

const topRowStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const eyebrowStyle: React.CSSProperties = {
  display: "inline-flex",
  marginBottom: 10,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.08)",
  padding: "6px 10px",
  color: "#ffc3d1",
  fontSize: 12,
  fontWeight: 850,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.08,
  letterSpacing: 0,
};

const bodyStyle: React.CSSProperties = {
  margin: "8px 0 0",
  color: "rgba(255,255,255,0.76)",
  fontSize: 15,
  lineHeight: 1.55,
};

const sectionsStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 10,
  marginTop: 16,
};

const sectionCardStyle: React.CSSProperties = {
  display: "grid",
  gap: 5,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.11)",
  background: "rgba(0,0,0,0.16)",
  padding: 13,
  color: "#fff",
  fontSize: 13,
  lineHeight: 1.45,
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 16,
  minHeight: 46,
  borderRadius: 15,
  border: "0",
  background: "#fff",
  color: "#1a1014",
  fontWeight: 900,
  cursor: "pointer",
};

const noteStyle: React.CSSProperties = {
  margin: "11px 0 0",
  color: "rgba(255,255,255,0.62)",
  fontSize: 13,
};

const errorStyle: React.CSSProperties = {
  margin: "10px 0 0",
  color: "#ff9bad",
  fontSize: 13,
};
