import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLetter, updateLetterToPremium, updateSignatureAddOns } from "@/lib/db";
import { generateLetterWithGroq } from "@/lib/groq-letter";
import { getDefaultSignatureMusic, getDefaultSignatureTheme } from "@/lib/signature";

type LetterRow = {
  user_id?: string | null;
  is_premium?: boolean | null;
  quality_tier?: string | null;
  sender_name?: string | null;
  recipient_name?: string | null;
  occasion?: string | null;
  letter: string;
};

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Please sign in to upgrade this letter." }, { status: 401 });
    }

    const row = await getLetter(slug);
    if (!row) {
      return NextResponse.json({ error: "Letter not found." }, { status: 404 });
    }

    const letter = row as LetterRow;

    if (letter.user_id !== userId) {
      return NextResponse.json({ error: "Only the sender can upgrade this letter." }, { status: 403 });
    }

    if (letter.is_premium === true || letter.quality_tier === "premium") {
      return NextResponse.json({ ok: true, slug, alreadyPremium: true });
    }

    const senderName = letter.sender_name ?? "Sender";
    const recipientName = letter.recipient_name ?? "Recipient";
    const occasion = letter.occasion || "love";

    if (process.env.NODE_ENV !== "production") {
      console.info("[Letterly] generation qualityTier:", "signature");
    }

    const out = await generateLetterWithGroq({
      occasion,
      senderName,
      recipientName,
      tone: "warm, personal, polished",
      length: "long",
      qualityTier: "signature",
      privateDetailLevel: "high",
      languageMode: "english",
      occasionDetails:
        "Upgrade the existing standard letter into a Signature Letter version of the same message. Preserve the core sentiment, occasion, names, and emotional intent.",
      memories: [`Existing standard letter:\n${letter.letter}`],
      callToAction:
        "Make this a fuller, more polished Signature Letter version without changing the underlying message.",
    });

    const updated = await updateLetterToPremium({
      slug,
      userId,
      title: out.title,
      preview: out.preview,
      letter: out.letter,
      ps: out.ps ?? "",
      languageMode: "english",
      nativeLanguage: null,
    });

    if (!updated) {
      return NextResponse.json({ error: "Could not upgrade this letter." }, { status: 500 });
    }

    await updateSignatureAddOns({
      slug,
      userId,
      theme: getDefaultSignatureTheme(occasion),
      font: occasion === "birthday" ? "bright-hand" : occasion === "love" ? "love-note" : "storybook",
      music: getDefaultSignatureMusic(occasion),
      photoBackground: false,
    });

    return NextResponse.json({ ok: true, slug });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
