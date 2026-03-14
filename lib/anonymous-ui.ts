import type { CSSProperties } from "react";

export const anonPageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(255, 71, 133, 0.16), transparent 28%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.10), transparent 28%), #09090b",
  color: "#fff",
  padding: "28px 20px 40px",
};

export const anonWrapStyle: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
};

export const anonHeroStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: 20,
};

export const anonBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "8px 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.05)",
  fontSize: 14,
  marginBottom: 14,
};

export const anonTitleStyle: CSSProperties = {
  fontSize: 64,
  lineHeight: 1.05,
  margin: "0 0 10px",
  letterSpacing: "-0.02em",
};

export const anonSubtitleStyle: CSSProperties = {
  fontSize: 18,
  opacity: 0.82,
  margin: 0,
};

export const anonCardStyle: CSSProperties = {
  borderRadius: 26,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.24)",
  padding: 22,
  backdropFilter: "blur(8px)",
};

export const anonInputStyle: CSSProperties = {
  width: "100%",
  padding: "16px 18px",
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  fontSize: 16,
  outline: "none",
};

export const anonTextareaStyle: CSSProperties = {
  ...anonInputStyle,
  resize: "vertical",
  minHeight: 180,
};

export const anonButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "14px 22px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "linear-gradient(135deg, #ff4d8d, #a855f7)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 16,
  textDecoration: "none",
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(255,77,141,0.22)",
};

export const anonSecondaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "12px 18px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontWeight: 600,
  fontSize: 15,
  textDecoration: "none",
  cursor: "pointer",
};

export const anonMessageCardStyle: CSSProperties = {
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  padding: 20,
  boxShadow: "0 14px 40px rgba(0,0,0,0.18)",
};

export const anonMutedStyle: CSSProperties = {
  opacity: 0.72,
};

export const anonLinkStyle: CSSProperties = {
  color: "#f9a8d4",
  textDecoration: "none",
  fontWeight: 600,
};
