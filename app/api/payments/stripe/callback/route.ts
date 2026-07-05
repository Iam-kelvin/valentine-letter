import { NextResponse } from "next/server";
import { getPaymentByCheckoutId, markPaymentFailed } from "@/lib/db";
import { completePaidPremiumPayment } from "@/lib/payment-fulfillment";
import { getStripeClient } from "@/lib/payment-providers";

type PaymentRecord = {
  slug?: string | null;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id") ?? "";

  try {
    if (!sessionId) throw new Error("Missing Stripe session.");

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const reference = session.metadata?.reference;

    if (!reference) throw new Error("Missing Stripe payment reference.");

    const payment = await getPaymentByCheckoutId("stripe", sessionId);
    if (!payment) throw new Error("Payment record not found.");

    if (session.payment_status !== "paid") {
      await markPaymentFailed({ providerReference: reference, providerPayload: session });
      return NextResponse.redirect(new URL(`/l/${String((payment as PaymentRecord).slug)}?payment=failed`, req.url));
    }

    const paidPayment = await completePaidPremiumPayment({
      providerReference: reference,
      providerCheckoutId: session.id,
      amount: Number(session.amount_total ?? 0),
      currency: String(session.currency ?? ""),
      providerPayload: {
        id: session.id,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
      },
    });

    return NextResponse.redirect(new URL(`/l/${String((paidPayment as PaymentRecord).slug)}?payment=success`, req.url));
  } catch {
    const payment = sessionId ? await getPaymentByCheckoutId("stripe", sessionId).catch(() => null) : null;
    const slug = payment ? String((payment as PaymentRecord).slug) : "";
    return NextResponse.redirect(new URL(slug ? `/l/${slug}?payment=failed` : "/create", req.url));
  }
}
