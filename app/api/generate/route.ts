import { NextResponse } from "next/server";
import { z } from "zod";
import { generateLetterWithGroq } from "@/lib/groq-letter";
import { saveLetter } from "@/lib/db";
import { hashPassword } from "@/lib/letter-auth";
import { slugify, shortId } from "@/lib/slug";

const InputSchema = z.object({
  senderName: z.string().min(1),
  recipientName: z.string().min(1),
  relationshipType: z.string(),
  tone: z.string(),
  length: z.string(),
  privateDetailLevel: z.string(),
  memories: z.array(z.string()).optional(),
  insideJokes: z.array(z.string()).optional(),
  qualities: z.array(z.string()).optional(),
  futurePlans: z.array(z.string()).optional(),
  callToAction: z.string().optional(),
  password: z.string().optional(),
  expiresAt: z.string().nullable().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = InputSchema.parse(body);

    if (input.expiresAt) {
      const t = new Date(input.expiresAt).getTime();
      if (!Number.isFinite(t) || t <= Date.now()) {
        return NextResponse.json({ error: "expiresAt must be a future datetime" }, { status: 400 });
      }
    }

    const out = await generateLetterWithGroq(input);

    const base = slugify(out.title || `${input.senderName}-to-${input.recipientName}`);
    const slug = `${base}-${shortId(4)}`;
    const passwordHash = input.password ? hashPassword(input.password) : null;

    await saveLetter({
      slug,
      title: out.title,
      preview: out.preview,
      letter: out.letter,
      ps: out.ps ?? "",
      senderName: input.senderName,
      recipientName: input.recipientName,
      passwordHash,
      expiresAt: input.expiresAt ?? null
    });

    return NextResponse.json({ slug });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}