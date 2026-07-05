import { NextResponse } from "next/server";
import { completePaidPremiumPayment } from "@/lib/payment-fulfillment";
import { getStripeClient } from "@/lib/payment-providers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!process.env.STRIPE_WEBHOOK_SECRET || !signature) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ ok: true });
    }

    const session = event.data.object;
    const reference = session.metadata?.reference;

    if (!reference || session.payment_status !== "paid") {
      return NextResponse.json({ ok: true });
    }

    await completePaidPremiumPayment({
      providerReference: reference,
      providerCheckoutId: session.id,
      amount: Number(session.amount_total ?? 0),
      currency: String(session.currency ?? ""),
      providerPayload: {
        id: session.id,
        event: event.type,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
