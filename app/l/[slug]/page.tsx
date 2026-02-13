import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import UnlockBox from "./unlock-box";
import { getLetter } from "@/lib/db";
import { cookieNameForSlug, verifyAccessToken } from "@/lib/letter-auth";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import EnvelopeReveal from "@/components/EnvelopeReveal";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getLetter(slug);
  if (!row) return {};

  return {
    title: row.title,
    description: row.preview,
    openGraph: {
      title: row.title,
      description: row.preview,
      type: "website",
    },
  };
}

export default async function LetterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getLetter(slug);
  if (!row) return notFound();

  if (row.expires_at && new Date(row.expires_at) < new Date()) return notFound();

  const needsPassword = !!row.password_hash;
  let unlocked = !needsPassword;

  if (needsPassword) {
    const jar = await cookies();
    const token = jar.get(cookieNameForSlug(slug))?.value;
    unlocked = token ? verifyAccessToken(token, slug) : false;
  }

  return (
  <main
    style={{
      minHeight: "100vh",
      background:
        "radial-gradient(60% 60% at 50% 0%, rgba(255, 0, 128, 0.12), transparent 60%), #000",
      color: "#fff",
      padding: "32px 18px"
    }}
  >
    <div style={{ maxWidth: 980, margin: "0 auto" }}>
      <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
        ← Home
      </Link>

      {/* Header */}
      <div style={{ marginTop: 30 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16
          }}
        >
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 72, margin: 0, letterSpacing: -1 }}>
              {row.title}
            </h1>

            {row.preview?.trim() ? (
              <p style={{ marginTop: 12, fontSize: 18, opacity: 0.75 }}>
                {row.preview}
              </p>
            ) : null}
          </div>

          <div style={{ marginTop: 10 }}>
            <ShareButton />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.10)",
          margin: "24px 0 40px"
        }}
      />

      {/* Letter */}
      <EnvelopeReveal
        title={row.title}
        preview={row.preview}
        letter={row.letter}
        ps={row.ps}
      />
    </div>
  </main>
);
}