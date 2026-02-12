import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getLetter } from "@/lib/db";
import { cookieNameForSlug, makeAccessToken, verifyPassword } from "@/lib/letter-auth";

const UnlockSchema = z.object({
  slug: z.string().min(1),
  password: z.string().min(1)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, password } = UnlockSchema.parse(body);

    const row = await getLetter(slug);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (row.expires_at && new Date(row.expires_at) < new Date()) {
      return NextResponse.json({ error: "Expired" }, { status: 404 });
    }

    if (!row.password_hash) return NextResponse.json({ ok: true });

    const ok = verifyPassword(password, row.password_hash);
    if (!ok) return NextResponse.json({ error: "Wrong password" }, { status: 401 });

    const token = makeAccessToken(slug, row.expires_at);

    (await cookies()).set({
        name: cookieNameForSlug(slug),
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: `/l/${slug}`,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}