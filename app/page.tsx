import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "radial-gradient(60% 60% at 50% 20%, rgba(255, 0, 128, 0.18), transparent 60%), #000",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      textAlign: "center"
    }}>
      <div style={{ maxWidth: 820 }}>
        <div style={{ display: "inline-block", padding: "6px 12px", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, marginBottom: 18, opacity: 0.9 }}>
          💌 Valentine Letter Generator
        </div>

        <h1 style={{ fontSize: 54, lineHeight: 1.05, margin: "0 0 14px" }}>
          Say it like you mean it.
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.85, margin: "0 auto 26px", maxWidth: 620 }}>
          Create a beautiful, unforgettable Valentine letter in seconds.
          Share it with someone special, or keep it as a memory forever.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/create" style={{
            padding: "12px 18px",
            borderRadius: 999,
            background: "#ff2d87",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700
          }}>
            Create a letter 💖
          </Link>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 26, opacity: 0.75 }}>
          <span>🔒 Password optional</span>
          <span>⏳ Expiry optional</span>
          <span>🔗 Shareable link</span>
        </div>
      </div>
    </main>
  );
}
