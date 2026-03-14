import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { archiveAnonymousMessage } from "@/lib/anonymous-db";

const BodySchema = z.object({
  messageId: z.number().int().positive(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const input = BodySchema.parse(body);

    const updated = await archiveAnonymousMessage({
      messageId: input.messageId,
      userId,
    });

    if (!updated) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to archive" }, { status: 400 });
  }
}