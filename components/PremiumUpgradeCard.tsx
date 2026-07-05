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
  const [loadingProvider, setLoadingProvider] = useState<"paystack" | "stripe" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const teaser = useMemo(() => {
    const cleanPreview = preview?.trim();
    const name = recipientName?.trim();

    if (cleanPreview) {
      return `${cleanPreview} Premium keeps the same heart, then adds more detail, rhythm, and a fuller closing.`;
    }

    if (name) {
      return `A fuller version for ${name}, with more detail, rhythm, and a stronger closing.`;
    }

    return "A fuller version with more detail, rhythm, and a stronger closing.";
  }, [preview, recipientName]);

  async function startCheckout(provider: "paystack" | "stripe") {
    setLoadingProvider(provider);
    setError(null);

    try {
      const res = await fetch(`/api/letters/${slug}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error ?? "Could not start checkout.");
      }

      if (data?.redirectUrl) {
        router.push(data.redirectUrl);
        return;
      }

      if (!data?.authorizationUrl) {
        throw new Error("Checkout did not return a payment link.");
      }

      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
    } finally {
      setLoadingProvider(null);
    }
  }

  return (
    <section style={cardStyle} aria-label="Premium Letter upgrade">
      <div style={eyebrowStyle}>Premium Letter</div>
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
          <ul style={listStyle}>
            {features.map((feature) => (
              <li key={feature} style={listItemStyle}>
                <span style={dotStyle} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>

          <div style={paymentHeaderStyle}>Unlock Premium Letter</div>
          <p style={paymentBodyStyle}>
            Pay once for this letter. The same share link updates to the Premium version after
            payment.
          </p>

          <div style={paymentLineStyle}>
            <span>Nigeria</span>
            <strong>{"\u20A6"}500</strong>
          </div>

          <button
            type="button"
            onClick={() => void startCheckout("paystack")}
            disabled={!!loadingProvider}
            style={buttonStyle}
          >
            {loadingProvider === "paystack" ? "Opening Paystack..." : "Pay with Paystack"}
          </button>

          <div style={{ ...paymentLineStyle, marginTop: 12 }}>
            <span>International</span>
            <strong>$5</strong>
          </div>

          <button
            type="button"
            onClick={() => void startCheckout("stripe")}
            disabled={!!loadingProvider}
            style={secondaryButtonStyle}
          >
            {loadingProvider === "stripe" ? "Opening Stripe..." : "Pay with card"}
          </button>

          <p style={secondaryStyle}>You can still send the standard version for free.</p>

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

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  marginTop: 0,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
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

const errorStyle: React.CSSProperties = {
  margin: "10px 0 0",
  color: "#ff9bad",
  fontSize: 13,
};
