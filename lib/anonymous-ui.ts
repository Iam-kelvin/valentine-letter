import type { CSSProperties } from "react";

export const anonPageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(255, 71, 133, 0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.12), transparent 30%), #09090b",
  color: "#fff",
  padding: "32px 20px",
};

export const anonWrapStyle: CSSProperties = {
  maxWidth: 860,
  margin: "0 auto",
};

export const anonHeroStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: 28,
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
  fontSize: 48,
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
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.05)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
  padding: 24,
  backdropFilter: "blur(8px)",
};

export const anonInputStyle: CSSProperties = {
  width: "100%",
  padding: "16px 18px",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontSize: 16,
  outline: "none",
};

export const anonTextareaStyle: CSSProperties = {
  ...anonInputStyle,
  resize: "vertical",
  minHeight: 140,
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
  padding: "14px 22px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontWeight: 600,
  fontSize: 16,
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