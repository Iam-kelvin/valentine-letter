import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import {
  createAnonymousMessage,
  getAnonymousProfileById,
} from "@/lib/anonymous-db";

const BodySchema = z.object({
  profileId: z.number().int().positive(),
  message: z.string().min(1).max(500),
  senderHint: z.string().max(80).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = BodySchema.parse(body);

    const targetProfile = await getAnonymousProfileById(input.profileId);

    if (!targetProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { userId } = await auth();

    if (userId && targetProfile.user_id === userId) {
      return NextResponse.json(
        { error: "You cannot send anonymous messages to yourself." },
        { status: 400 }
      );
    }

    const message = await createAnonymousMessage({
      profileId: input.profileId,
      message: input.message,
      senderHint: input.senderHint,
    });

    return NextResponse.json({ ok: true, id: message.id });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to send message" },
      { status: 400 }
    );
  }
}
