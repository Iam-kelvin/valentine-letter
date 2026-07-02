// import { NextResponse } from "next/server";
// import { z } from "zod";
// import { generateLetterWithGroq } from "@/lib/groq-letter";
// import { saveLetter } from "@/lib/db";
// import { hashPassword } from "@/lib/letter-auth";
// import { slugify, shortId } from "@/lib/slug";

// const InputSchema = z.object({
//   senderName: z.string().min(1),
//   recipientName: z.string().min(1),
//   relationshipType: z.string(),
//   tone: z.string(),
//   length: z.string(),
//   privateDetailLevel: z.string(),
//   memories: z.array(z.string()).optional(),
//   insideJokes: z.array(z.string()).optional(),
//   qualities: z.array(z.string()).optional(),
//   futurePlans: z.array(z.string()).optional(),
//   callToAction: z.string().optional(),
//   password: z.string().optional(),
//   expiresAt: z.string().nullable().optional()
// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const input = InputSchema.parse(body);

//     if (input.expiresAt) {
//       const t = new Date(input.expiresAt).getTime();
//       if (!Number.isFinite(t) || t <= Date.now()) {
//         return NextResponse.json({ error: "expiresAt must be a future datetime" }, { status: 400 });
//       }
//     }

//     const out = await generateLetterWithGroq(input);

//     const base = slugify(out.title || `${input.senderName}-to-${input.recipientName}`);
//     const slug = `${base}-${shortId(4)}`;
//     const passwordHash = input.password ? hashPassword(input.password) : null;

//     await saveLetter({
//       slug,
//       title: out.title,
//       preview: out.preview,
//       letter: out.letter,
//       ps: out.ps ?? "",
//       senderName: input.senderName,
//       recipientName: input.recipientName,
//       passwordHash,
//       expiresAt: input.expiresAt ?? null
//     });

//     return NextResponse.json({ slug });
//   } catch (e: any) {
//     return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { z } from "zod";
import { generateLetterWithGroq } from "@/lib/groq-letter";
import { saveLetter } from "@/lib/db";
import { hashPassword } from "@/lib/letter-auth";
import { slugify, shortId } from "@/lib/slug";
import { auth } from "@clerk/nextjs/server";

const InputSchema = z.object({
  occasion: z.string().min(1),
  senderName: z.string().min(1),
  recipientName: z.string().min(1),
  relationship: z.string().optional(),
  senderRole: z.string().optional(),
  recipientType: z.string().optional(),
  tone: z.string().optional(),
  length: z.string(),
  qualityTier: z.enum(["standard", "premium", "signature"]).default("standard"),
  languageMode: z.string().optional(),
  nativeLanguage: z.string().optional(),
  occasionDetails: z.string().optional(),
  privateDetailLevel: z.string(),
  memories: z.array(z.string()).optional(),
  insideJokes: z.array(z.string()).optional(),
  qualities: z.array(z.string()).optional(),
  futurePlans: z.array(z.string()).optional(),
  callToAction: z.string().optional(),
  extraEmotional: z.boolean().optional(),
  password: z.string().optional(),
  expiresAt: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in to create letters." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = InputSchema.parse(body);
    const requestedQualityTier =
      parsed.qualityTier === "signature" ? "premium" : parsed.qualityTier;
    const forcedQualityTier =
      process.env.NODE_ENV !== "production" &&
      process.env.LETTERLY_FORCE_QUALITY_TIER === "premium"
        ? "premium"
        : requestedQualityTier;
    const input = {
      ...parsed,
      senderRole: parsed.senderRole ?? parsed.relationship,
      qualityTier: forcedQualityTier,
      languageMode: parsed.languageMode ?? "english",
      nativeLanguage: parsed.nativeLanguage ?? undefined,
    };

    if (process.env.NODE_ENV !== "production") {
      console.info("[Letterly] generation qualityTier:", input.qualityTier);
    }

    if (input.expiresAt) {
      const t = new Date(input.expiresAt).getTime();
      if (!Number.isFinite(t) || t <= Date.now()) {
        return NextResponse.json({ error: "expiresAt must be a future datetime" }, { status: 400 });
      }
    }

    const out = await generateLetterWithGroq(input);

    const base = slugify(out.title || `${input.occasion}-${input.senderName}-to-${input.recipientName}`);
    const slug = `${base}-${shortId(4)}`;

    const passwordHash = input.password ? hashPassword(input.password) : null;

    await saveLetter({
      slug,
      userId,
      occasion: input.occasion,
      title: out.title,
      preview: out.preview,
      letter: out.letter,
      ps: out.ps ?? "",
      senderName: input.senderName,
      recipientName: input.recipientName,
      passwordHash,
      expiresAt: input.expiresAt ?? null,
      qualityTier: input.qualityTier,
      languageMode: input.languageMode,
      nativeLanguage: input.nativeLanguage ?? null,
      isPremium: input.qualityTier === "premium",
    });

    return NextResponse.json({ slug });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
