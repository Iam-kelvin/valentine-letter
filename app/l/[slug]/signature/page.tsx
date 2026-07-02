import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import SignatureEditor from "@/components/SignatureEditor";
import { getLetter, SIGNATURE_EDIT_LIMIT, SIGNATURE_REGENERATE_LIMIT } from "@/lib/db";
import {
  normalizeSignatureFont,
  normalizeSignatureMusic,
  normalizeStoredSignatureTheme,
  parseSignaturePhotos,
} from "@/lib/signature";
import { getOccasionPageBackground } from "@/lib/occasion-themes";

export default async function SignaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { userId } = await auth();

  if (!userId) return notFound();

  const row = await getLetter(slug);
  if (!row) return notFound();

  const isOwner = (row as any).user_id === userId;
  const isPremium =
    (row as any).is_premium === true ||
    (row as any).quality_tier === "premium" ||
    (row as any).quality_tier === "signature";

  if (!isOwner || !isPremium) return notFound();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: getOccasionPageBackground(row.occasion),
        color: "#fff",
        padding: "28px 16px 48px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto 28px" }}>
        <Link href={`/l/${slug}`} style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>
          {"\u2190 Back to letter"}
        </Link>
      </div>

      <SignatureEditor
        slug={slug}
        occasion={row.occasion}
        initialTitle={row.title}
        initialPreview={row.preview ?? ""}
        initialLetter={row.letter}
        initialPs={row.ps ?? ""}
        initialTheme={normalizeStoredSignatureTheme((row as any).signature_theme)}
        initialFont={normalizeSignatureFont((row as any).signature_font)}
        initialMusic={normalizeSignatureMusic((row as any).signature_music)}
        initialPhotos={parseSignaturePhotos((row as any).signature_photos)}
        initialPhotoBackground={(row as any).signature_photo_background === true}
        initialEditCount={Number((row as any).signature_edit_count ?? 0)}
        initialRegenerateCount={Number((row as any).signature_regenerate_count ?? 0)}
        editLimit={SIGNATURE_EDIT_LIMIT}
        regenerateLimit={SIGNATURE_REGENERATE_LIMIT}
      />
    </main>
  );
}
