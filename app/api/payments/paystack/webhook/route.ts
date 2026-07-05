import crypto from "crypto";
import { NextResponse } from "next/server";
import { completePaidPremiumPayment } from "@/lib/payment-fulfillment";
import { verifyPaystackTransaction } from "@/lib/payment-providers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature") ?? "";

    if (!process.env.PAYSTACK_SECRET_KEY || !signature) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const expected = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: { reference?: string };
    };

    if (event.event !== "charge.success" || !event.data?.reference) {
      return NextResponse.json({ ok: true });
    }

    const verified = await verifyPaystackTransaction(event.data.reference);

    if (verified.status === "success") {
      await completePaidPremiumPayment({
        providerReference: verified.reference,
        amount: Number(verified.amount),
        currency: verified.currency,
        providerPayload: event,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
