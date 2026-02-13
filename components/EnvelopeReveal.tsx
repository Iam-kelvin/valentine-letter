"use client";

import React from "react";
import Link from "next/link";

type Props = {
  title: string;
  preview?: string | null;
  letter: string;
  ps?: string | null;
  /** optional override */
  ctaHref?: string;
  ctaTitle?: string;
  ctaBody?: string;
  ctaButtonText?: string;
};

export default function EnvelopeReveal({
  title,
  preview,
  letter,
  ps,
  ctaHref = "/create",
  ctaTitle = "Aww 😌 want one like this?",
  ctaBody = "Now go make one for your person in seconds, then share the link.",
  ctaButtonText = "Create my letter 💌",
}: Props) {
  const [opened, setOpened] = React.useState(false);

  return (
    <div style={{ width: "100%" }}>
      {/* CLOSED / TEASER */}
      {!opened ? (
        <div
          onClick={() => setOpened(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setOpened(true);
          }}
          style={{
            cursor: "pointer",
            userSelect: "none",
            width: "100%",
            maxWidth: 560,
            margin: "28px auto 0",
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.16)",
            background:
              "radial-gradient(120% 90% at 50% 0%, rgba(255,0,128,0.20), rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.02) 100%)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            position: "relative",
            overflow: "hidden",
            aspectRatio: "16 / 10",
            display: "grid",
            placeItems: "center",
          }}
        >
          {/* simple envelope flap */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "55%",
              background:
                "linear-gradient(180deg, rgba(255,0,128,0.25), rgba(0,0,0,0))",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              opacity: 0.55,
            }}
          />

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 999,
                margin: "0 auto 14px",
                display: "grid",
                placeItems: "center",
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), rgba(255,0,128,0.35))",
                border: "1px solid rgba(255,255,255,0.22)",
              }}
            >
              <span style={{ fontSize: 22 }}>♥</span>
            </div>

            <div style={{ opacity: 0.75, fontSize: 14 }}>
              Tap to open <span style={{ marginLeft: 6 }}>💌</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* OPENED LETTER */}
      {opened ? (
        <div
          style={{
            marginTop: 18,
            borderRadius: 20,
            padding: "22px 22px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              lineHeight: 1.85,
              fontSize: 20,
              whiteSpace: "pre-wrap",
            }}
          >
            {letter}
          </div>

          {ps?.trim() ? (
            <div style={{ marginTop: 18, opacity: 0.8, fontStyle: "italic" }}>
              {ps}
            </div>
          ) : null}

          {/* ✅ CTA AFTER OPEN */}
          <div
            style={{
              marginTop: 22,
              padding: "16px 16px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.14)",
              background:
                "radial-gradient(90% 120% at 0% 0%, rgba(255,0,128,0.20), rgba(255,255,255,0.02))",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 220 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                {ctaTitle}
              </div>
              <div style={{ opacity: 0.8, fontSize: 14 }}>{ctaBody}</div>
            </div>

            <Link
              href={ctaHref}
              style={{
                textDecoration: "none",
                padding: "12px 16px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.20)",
                background: "rgba(255,0,128,0.22)",
                color: "#fff",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {ctaButtonText}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
