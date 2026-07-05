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

export async function upgradeLetterToPremium({
  slug,
  userId,
}: {
  slug: string;
  userId: string;
}) {
  const row = await getLetter(slug);
  if (!row) throw new Error("Letter not found.");

  const letter = row as LetterRow;

  if (letter.user_id !== userId) {
    throw new Error("Only the sender can upgrade this letter.");
  }

  if (letter.is_premium === true || letter.quality_tier === "premium") {
    return row;
  }

  const senderName = letter.sender_name ?? "Sender";
  const recipientName = letter.recipient_name ?? "Recipient";
  const occasion = letter.occasion || "love";

  const out = await generateLetterWithGroq({
    occasion,
    senderName,
    recipientName,
    tone: "warm, personal, polished",
    length: "long",
    qualityTier: "premium",
    privateDetailLevel: "high",
    languageMode: "english",
    occasionDetails:
      "Upgrade the existing standard letter into a Premium Letter version of the same message. Preserve the core sentiment, occasion, names, and emotional intent.",
    memories: [`Existing standard letter:\n${letter.letter}`],
    callToAction:
      "Make this a fuller, more polished Premium Letter version without changing the underlying message.",
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

  if (!updated) throw new Error("Could not upgrade this letter.");

  await updateSignatureAddOns({
    slug,
    userId,
    theme: getDefaultSignatureTheme(occasion),
    font: occasion === "birthday" ? "bright-hand" : occasion === "love" ? "love-note" : "storybook",
    music: getDefaultSignatureMusic(occasion),
    photoBackground: false,
  });

  return updated;
}
