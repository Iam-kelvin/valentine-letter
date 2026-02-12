import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { generateLetterWithGroq } from "@/lib/groq-letter";
import { saveLetter } from "@/lib/db";
import { hashPassword } from "@/lib/letter-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Generate unique slug
    const slug = nanoid(10);
    
    // Generate letter content using Groq
    const { title, preview, letter, ps } = await generateLetterWithGroq(body);
    
    // Save to database
    await saveLetter({
      slug,
      title,
      preview,
      letter,
      ps,
      senderName: body.senderName,
      recipientName: body.recipientName,
      passwordHash: body.password ? hashPassword(body.password) : null,
      expiresAt: body.expiresAt || null,
    });
    
    return NextResponse.json({ slug });
  } catch (err: any) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate letter" },
      { status: 500 }
    );
  }
}