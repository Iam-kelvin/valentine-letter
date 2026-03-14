import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createAnonymousMessage,
  checkAnonymousRateLimit,
  logAnonymousRateLimitHit,
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

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

    const allowed = await checkAnonymousRateLimit({
      ip,
      profileId: input.profileId,
    });

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many messages sent recently. Please try again later." },
        { status: 429 }
      );
    }

    const message = await createAnonymousMessage({
      profileId: input.profileId,
      message: input.message,
      senderHint: input.senderHint,
    });

    await logAnonymousRateLimitHit({
      ip,
      profileId: input.profileId,
    });

    return NextResponse.json({ ok: true, id: message.id });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to send message" },
      { status: 400 }
    );
  }
}