import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getLetter, SIGNATURE_REGENERATE_LIMIT, updateSignatureAddOns } from "@/lib/db";
import { generateLetterWithGroq } from "@/lib/groq-letter";
import {
  normalizeSignatureFont,
  normalizeSignatureMusic,
  normalizeStoredSignatureTheme,
  parseSignaturePhotos,
} from "@/lib/signature";

const BodySchema = z.object({
  title: z.string().min(1).max(80),
  preview: z.string().max(140),
  letter: z.string().min(60).max(5000),
  ps: z.string().max(280).optional().default(""),
  theme: z.string().optional(),
  font: z.string().optional(),
  music: z.string().optional(),
  photos: z.unknown().optional(),
  photoBackground: z.boolean().optional().default(false),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Please sign in to edit this letter." }, { status: 401 });
    }

    const row = await getLetter(slug);
    if (!row) {
      return NextResponse.json({ error: "Letter not found." }, { status: 404 });
    }

    const isOwner = (row as any).user_id === userId;
    const isPremium =
      (row as any).is_premium === true ||
      (row as any).quality_tier === "premium" ||
      (row as any).quality_tier === "signature";

    if (!isOwner) {
      return NextResponse.json({ error: "Only the sender can edit this letter." }, { status: 403 });
    }

    if (!isPremium) {
      return NextResponse.json({ error: "Upgrade to Signature Letter first." }, { status: 402 });
    }

    const regenerateCount = Number((row as any).signature_regenerate_count ?? 0);
    if (regenerateCount >= SIGNATURE_REGENERATE_LIMIT) {
      return NextResponse.json(
        { error: "This Signature Letter has reached its regenerate limit." },
        { status: 403 }
      );
    }

    const body = BodySchema.parse(await req.json());
    const out = await generateLetterWithGroq({
      occasion: row.occasion || "love",
      senderName: (row as any).sender_name ?? "Sender",
      recipientName: (row as any).recipient_name ?? "Recipient",
      tone: "warm, personal, polished",
      length: "long",
      qualityTier: "signature",
      privateDetailLevel: "high",
      languageMode: (row as any).language_mode ?? "english",
      nativeLanguage: (row as any).native_language ?? undefined,
      occasionDetails:
        "Regenerate this Signature Letter using the current edited version as the source. Preserve the meaning, names, and emotional intent while improving flow.",
      memories: [
        `Current title: ${body.title}`,
        `Current preview: ${body.preview}`,
        `Current letter:\n${body.letter}`,
        body.ps ? `Current PS: ${body.ps}` : "",
      ].filter(Boolean),
      callToAction:
        "Keep this as a premium Signature Letter. Do not make it theatrical or oversized; keep it human, grounded, and emotionally specific.",
    });

    const updated = await updateSignatureAddOns({
      slug,
      userId,
      title: out.title,
      preview: out.preview,
      letter: out.letter,
      ps: out.ps ?? "",
      theme: normalizeStoredSignatureTheme(body.theme),
      font: normalizeSignatureFont(body.font),
      music: normalizeSignatureMusic(body.music),
      photos: parseSignaturePhotos(body.photos),
      photoBackground: body.photoBackground,
      incrementRegenerateCount: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Could not regenerate this letter." }, { status: 500 });
    }

    return NextResponse.json({
      ...out,
      signature_edit_count: Number((updated as any).signature_edit_count ?? 0),
      signature_regenerate_count: Number(
        (updated as any).signature_regenerate_count ?? regenerateCount + 1
      ),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
