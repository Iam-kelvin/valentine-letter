import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getLetter } from "@/lib/db";
import { cookieNameForSlug, verifyAccessToken } from "@/lib/letter-auth";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import EnvelopeReveal from "@/components/EnvelopeReveal";
import PaperLetterReveal from "@/components/PaperLetterReveal";
import UnlockBox from "./unlock-box";

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

  if (!unlocked) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(255, 0, 128, 0.12), transparent 60%), #000",
          color: "#fff",
          padding: "32px 18px",
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
            ← Home
          </Link>

          <div style={{ marginTop: 30 }}>
            <UnlockBox slug={slug} />
          </div>
        </div>
      </main>
    );
  }

  const isPaperOccasion =
    row.occasion === "mothers-day" ||
    row.occasion === "womens-day" ||
    row.occasion === "appreciation" ||
    row.occasion === "just-because";

  const senderName = (row as any).sender_name ?? (row as any).senderName ?? null;
  const senderRole =
    (row as any).sender_role ??
    (row as any).senderRole ??
    (row as any).relationship ??
    null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(60% 60% at 50% 0%, rgba(255, 0, 128, 0.12), transparent 60%), #000",
        color: "#fff",
        padding: "32px 18px",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
          ← Home
        </Link>

        <div style={{ marginTop: 30 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
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

        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.10)",
            margin: "24px 0 40px",
          }}
        />

        {isPaperOccasion ? (
          <PaperLetterReveal
            title={row.title}
            recipientLine={
              (row as any).recipient_name
              ? `To the most wonderful mom, ${(row as any).recipient_name}`
              : (row as any).recipientName
              ? `To the most wonderful mom, ${(row as any).recipientName}`
              : "To the most wonderful mom in the world"
        }
              preview={row.preview}
              letter={row.letter}
              ps={row.ps}
              senderName={senderName}
              senderRole={senderRole}
              ctaHref={`/create/${row.occasion || "mothers-day"}`}
              ctaTitle="Aww 😌 Want one like this?"
              ctaBody="Now go make one for your person in seconds."
              ctaButtonText="Create my letter 💌"
          />
        ) : (
          <EnvelopeReveal
            title={row.title}
            preview={row.preview}
            letter={row.letter}
            ps={row.ps}
            ctaHref={`/create/${row.occasion || "love"}`}
            ctaTitle="Aww 😌 Want one like this?"
            ctaBody="Now go make one for your person in seconds."
            ctaButtonText="Create my letter 💌"
          />
        )}
      </div>
    </main>
  );
}
