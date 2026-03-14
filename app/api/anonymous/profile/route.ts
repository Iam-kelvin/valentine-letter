import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  createAnonymousProfile,
  getAnonymousProfileByUsername,
  getAnonymousProfileByUserId,
} from "@/lib/anonymous-db";

const BodySchema = z.object({
  username: z
    .string()
    .min(3)
    .max(24)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  displayName: z.string().max(60).optional(),
  bio: z.string().max(160).optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await getAnonymousProfileByUserId(userId);
    if (existing) {
      return NextResponse.json({ error: "Profile already exists" }, { status: 400 });
    }

    const body = await req.json();
    const input = BodySchema.parse(body);

    const usernameTaken = await getAnonymousProfileByUsername(input.username.toLowerCase());
    if (usernameTaken) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    const profile = await createAnonymousProfile({
      userId,
      username: input.username.toLowerCase(),
      displayName: input.displayName,
      bio: input.bio,
    });

    return NextResponse.json({ ok: true, profile });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create profile" }, { status: 400 });
  }
}