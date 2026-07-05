import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getLetter, recordLetterReceipt } from "@/lib/db";
import { cookieNameForSlug, verifyAccessToken } from "@/lib/letter-auth";
import ShareButton from "@/components/ShareButton";
import PaperLetterReveal from "@/components/PaperLetterReveal";
import PremiumUpgradeCard from "@/components/PremiumUpgradeCard";
import UnlockBox from "./unlock-box";
import { getOccasionPageBackground } from "@/lib/occasion-themes";
import {
  hasSignatureAddOns,
  getSignatureAccentFontFamily,
  normalizeSignatureFont,
  normalizeSignatureMusic,
  normalizeSignatureTheme,
  normalizeStoredSignatureTheme,
  parseSignaturePhotos,
} from "@/lib/signature";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getLetter(slug);
  if (!row) return {};
  const headerList = await headers();
  const host = headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  const url = host ? `${proto}://${host}/l/${slug}` : undefined;

  return {
    title: row.title,
    description: row.preview,
    openGraph: {
      title: row.title,
      description: row.preview,
      type: "website",
      url,
      siteName: "Letterly",
    },
    twitter: {
      card: "summary",
      title: row.title,
      description: row.preview,
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
            {"\u2190 Home"}
          </Link>

          <div style={{ marginTop: 30 }}>
            <UnlockBox slug={slug} />
          </div>
        </div>
      </main>
    );
  }

  const senderName = (row as any).sender_name ?? (row as any).senderName ?? null;
  const senderRole =
    (row as any).sender_role ??
    (row as any).senderRole ??
    (row as any).relationship ??
    null;
  const { userId } = await auth();
  const isOwner = !!userId && (row as any).user_id === userId;
  if (userId && !isOwner) {
    await recordLetterReceipt(slug, userId);
  }
  const isPremium =
    (row as any).is_premium === true ||
    (row as any).quality_tier === "premium" ||
    (row as any).quality_tier === "signature";
  const recipientLine =
    (row as any).recipient_name
      ? `To ${(row as any).recipient_name}:`
      : (row as any).recipientName
      ? `To ${(row as any).recipientName}:`
      : "To you:";
  const storedSignatureTheme = normalizeStoredSignatureTheme((row as any).signature_theme);
  const signatureFont = normalizeSignatureFont((row as any).signature_font);
  const signatureMusic = normalizeSignatureMusic((row as any).signature_music);
  const signaturePhotos = parseSignaturePhotos((row as any).signature_photos);
  const showSignatureAddOns =
    isPremium &&
    hasSignatureAddOns({
      storedTheme: storedSignatureTheme,
      font: signatureFont,
      music: signatureMusic,
      photos: signaturePhotos,
    });
  const signatureAddOns = showSignatureAddOns
    ? {
        theme: normalizeSignatureTheme(storedSignatureTheme, row.occasion),
        font: signatureFont,
        music: signatureMusic,
        photos: signaturePhotos,
        photoBackground: (row as any).signature_photo_background === true,
      }
    : null;
  const heroTitleFont = showSignatureAddOns
    ? getSignatureAccentFontFamily(signatureFont)
    : undefined;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: getOccasionPageBackground(row.occasion),
        color: "#fff",
        padding: "28px 16px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
          {"\u2190 Home"}
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
              {isPremium ? <div style={signatureBadgeStyle}>Premium Letter</div> : null}

              <h1
                style={{
                  fontSize: showSignatureAddOns
                    ? "clamp(34px, 4.8vw, 58px)"
                    : "clamp(44px, 8vw, 92px)",
                  margin: 0,
                  letterSpacing: 0,
                  lineHeight: 1.04,
                  fontFamily: heroTitleFont,
                }}
              >
                {row.title}
              </h1>

              {row.preview?.trim() ? (
                <p style={{ marginTop: 12, fontSize: 18, opacity: 0.75 }}>{row.preview}</p>
              ) : null}
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "flex-end" }}>
                {isOwner && isPremium ? (
                  <Link href={`/l/${slug}/premium`} style={editSignatureStyle}>
                    Edit Premium
                  </Link>
                ) : null}
                {isOwner ? <ShareButton title={row.title} text={row.preview} /> : null}
              </div>
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

        <PaperLetterReveal
          occasion={row.occasion}
          title={row.title}
          recipientLine={recipientLine}
          preview={row.preview}
          letter={row.letter}
          ps={row.ps}
          senderName={senderName}
          senderRole={senderRole}
          ctaHref={`/create/${row.occasion || "mothers-day"}`}
          ctaTitle={"Aww \u{1F60C} Want one like this?"}
          ctaBody="Now go make one for your person in seconds."
          ctaButtonText={"Create my letter \u{1F48C}"}
          signatureAddOns={signatureAddOns}
        />

        {isOwner && !isPremium ? (
          <PremiumUpgradeCard
            slug={slug}
            preview={row.preview}
            recipientName={(row as any).recipient_name ?? (row as any).recipientName ?? null}
          />
        ) : null}
      </div>
    </main>
  );
}

const signatureBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  marginBottom: 14,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.09)",
  padding: "8px 12px",
  color: "#ffd0dc",
  fontSize: 13,
  fontWeight: 900,
  letterSpacing: 0.2,
};

const editSignatureStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 40,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.07)",
  color: "#fff",
  padding: "0 14px",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 900,
};
