import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getLetter, SIGNATURE_EDIT_LIMIT, updateSignatureAddOns } from "@/lib/db";
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
      return NextResponse.json({ error: "Upgrade to Premium first." }, { status: 402 });
    }

    const editCount = Number((row as any).signature_edit_count ?? 0);
    if (editCount >= SIGNATURE_EDIT_LIMIT) {
      return NextResponse.json(
        { error: "This Premium Letter has reached its edit limit." },
        { status: 403 }
      );
    }

    const body = BodySchema.parse(await req.json());
    const updated = await updateSignatureAddOns({
      slug,
      userId,
      title: body.title.trim(),
      preview: body.preview.trim(),
      letter: body.letter.trim(),
      ps: body.ps.trim(),
      theme: normalizeStoredSignatureTheme(body.theme),
      font: normalizeSignatureFont(body.font),
      music: normalizeSignatureMusic(body.music),
      photos: parseSignaturePhotos(body.photos),
      photoBackground: body.photoBackground,
      incrementEditCount: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Could not save this letter." }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      signature_edit_count: Number((updated as any).signature_edit_count ?? editCount + 1),
      signature_regenerate_count: Number((updated as any).signature_regenerate_count ?? 0),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
