import Link from "next/link";
import { OCCASIONS } from "@/lib/occasions";

const cardStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "inherit",
  borderRadius: 22,
  padding: 20,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
  display: "block",
};

export default function HomePage() {
  const items = Object.values(OCCASIONS);

  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: 28, lineHeight: 1.6 }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          style={{
            display: "inline-block",
            padding: "6px 12px",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 999,
            marginBottom: 14,
            opacity: 0.9,
          }}
        >
          💌 Occasion Letter Generator
        </div>

        <h1 style={{ fontSize: 48, margin: "0 0 10px" }}>Say it like you mean it.</h1>

        <p style={{ maxWidth: 700, margin: "0 auto", opacity: 0.82 }}>
          Create beautiful, private digital letters for love, Mother’s Day, birthdays,
          appreciation, and more.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {items.map((item) => (
          <Link key={item.key} href={item.path} style={cardStyle}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{item.emoji}</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 24 }}>{item.label}</h2>
            <p style={{ margin: 0, opacity: 0.78 }}>{item.subtitle}</p>
          </Link>
        ))}

        <Link href="/anonymous" style={cardStyle}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>👀</div>
          <h2 style={{ margin: "0 0 8px", fontSize: 24 }}>Anonymous Messages</h2>
          <p style={{ margin: 0, opacity: 0.78 }}>
            Create your own private link and let people send you anonymous messages.
          </p>
        </Link>
      </div>
    </main>
  );
}