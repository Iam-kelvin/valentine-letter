"use client";

export default function BackButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      style={{
        background: "transparent",
        border: "none",
        color: "rgba(255,255,255,0.78)",
        fontSize: 16,
        cursor: "pointer",
        padding: 0,
        textDecoration: "none",
      }}
    >
      Back →
    </button>
  );
}
