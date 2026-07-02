"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  slug: string;
  preview?: string | null;
  recipientName?: string | null;
};

const features = [
  "Longer, deeper message",
  "More human and less generic",
  "Stronger opening and closing",
  "Better emotional flow",
  "Less cliche phrasing",
];

export default function PremiumUpgradeCard({ slug, preview, recipientName }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<"pitch" | "confirm">("pitch");
  const [loading, setLoading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const teaser = useMemo(() => {
    const cleanPreview = preview?.trim();
    const name = recipientName?.trim();

    if (cleanPreview) {
      return `${cleanPreview} Signature keeps the same heart, then adds more detail, rhythm, and a fuller closing.`;
    }

    if (name) {
      return `A fuller version for ${name}, with more detail, rhythm, and a stronger closing.`;
    }

    return "A fuller version with more detail, rhythm, and a stronger closing.";
  }, [preview, recipientName]);

  async function upgrade() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/letters/${slug}/upgrade`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error ?? "Could not upgrade this letter.");
      }

      setUpgraded(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upgrade this letter.");
    } finally {
      setLoading(false);
    }
  }

  if (upgraded) return null;

  return (
    <section style={cardStyle} aria-label="Signature Letter upgrade">
      <div style={eyebrowStyle}>Signature Letter</div>
      <div style={contentGridStyle}>
        <div>
          <h2 style={titleStyle}>Make this more personal, deeper, and more powerful</h2>
          <p style={bodyStyle}>
            Unlock a fuller version with a stronger opening, more grounded details,
            better emotional flow, and a more memorable ending.
          </p>
          <p style={teaserStyle}>{teaser}</p>
        </div>

        <div style={panelStyle}>
          {phase === "pitch" ? (
            <>
              <ul style={listStyle}>
                {features.map((feature) => (
                  <li key={feature} style={listItemStyle}>
                    <span style={dotStyle} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setPhase("confirm")}
                disabled={loading}
                style={buttonStyle}
              >
                Unlock Signature Letter
              </button>

              <p style={secondaryStyle}>You can still send the standard version for free.</p>
            </>
          ) : (
            <div>
              <div style={paymentHeaderStyle}>Unlock Signature Letter</div>
              <p style={paymentBodyStyle}>
                Signature checkout is being set up. For this launch, you can create the
                Signature version now and keep the same share link.
              </p>

              <div style={paymentLineStyle}>
                <span>Signature Letter</span>
                <strong>Beta access</strong>
              </div>

              <button type="button" onClick={upgrade} disabled={loading} style={buttonStyle}>
                {loading ? "Creating Signature Letter..." : "Create Signature Letter"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPhase("pitch");
                  setError(null);
                }}
                disabled={loading}
                style={backButtonStyle}
              >
                Back
              </button>
            </div>
          )}

          {error ? <p style={errorStyle}>{error}</p> : null}
        </div>
      </div>
    </section>
  );
}

const cardStyle: React.CSSProperties = {
  margin: "34px auto 0",
  maxWidth: 980,
  borderRadius: 28,
  border: "1px solid rgba(255,255,255,0.14)",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(143,32,80,0.18))",
  boxShadow: "0 28px 80px rgba(0,0,0,0.32)",
  padding: 22,
};

const eyebrowStyle: React.CSSProperties = {
  display: "inline-flex",
  marginBottom: 12,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.08)",
  padding: "7px 11px",
  color: "#ffc3d1",
  fontSize: 12,
  fontWeight: 850,
};

const contentGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
  gap: 18,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 38,
  lineHeight: 1.04,
  letterSpacing: -0.4,
};

const bodyStyle: React.CSSProperties = {
  margin: "14px 0 0",
  color: "rgba(255,255,255,0.78)",
  fontSize: 17,
  lineHeight: 1.55,
};

const teaserStyle: React.CSSProperties = {
  margin: "16px 0 0",
  borderLeft: "2px solid rgba(255,195,209,0.6)",
  paddingLeft: 14,
  color: "rgba(255,255,255,0.82)",
  fontSize: 15,
  lineHeight: 1.5,
};

const panelStyle: React.CSSProperties = {
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.20)",
  padding: 16,
};

const listStyle: React.CSSProperties = {
  display: "grid",
  gap: 9,
  margin: "0 0 16px",
  padding: 0,
  listStyle: "none",
};

const listItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 9,
  color: "rgba(255,255,255,0.80)",
  fontSize: 14,
};

const dotStyle: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: "#ffc3d1",
  flex: "0 0 auto",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  borderRadius: 16,
  border: "0",
  background: "#fff",
  color: "#1a1014",
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryStyle: React.CSSProperties = {
  margin: "10px 0 0",
  color: "rgba(255,255,255,0.62)",
  fontSize: 13,
};

const paymentHeaderStyle: React.CSSProperties = {
  color: "#fff",
  fontSize: 18,
  fontWeight: 900,
};

const paymentBodyStyle: React.CSSProperties = {
  margin: "10px 0 14px",
  color: "rgba(255,255,255,0.72)",
  fontSize: 14,
  lineHeight: 1.55,
};

const paymentLineStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 14,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.07)",
  padding: "12px 13px",
  color: "rgba(255,255,255,0.82)",
  fontSize: 14,
};

const backButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 42,
  marginTop: 9,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "transparent",
  color: "rgba(255,255,255,0.76)",
  fontWeight: 800,
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  margin: "10px 0 0",
  color: "#ff9bad",
  fontSize: 13,
};
