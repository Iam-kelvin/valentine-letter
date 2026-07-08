import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLetter } from "@/lib/db";
import { upgradeLetterToPremium } from "@/lib/premium-letter";

type LetterRow = {
  user_id?: string | null;
  is_premium?: boolean | null;
  quality_tier?: string | null;
  sender_name?: string | null;
  recipient_name?: string | null;
  occasion?: string | null;
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

    // Temporary production bypass: let Premium be simulated while checkout is paused.
    // const paid = await hasSuccessfulPremiumPayment(slug, userId);
    // if (!paid) {
    //   return NextResponse.json({ error: "Payment is required to unlock Premium." }, { status: 402 });
    // }

    await upgradeLetterToPremium({ slug, userId });

    return NextResponse.json({ ok: true, slug });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
