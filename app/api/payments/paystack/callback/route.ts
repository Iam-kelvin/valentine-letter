import { NextResponse } from "next/server";
import { getPaymentByReference, markPaymentFailed } from "@/lib/db";
import { completePaidPremiumPayment } from "@/lib/payment-fulfillment";
import { verifyPaystackTransaction } from "@/lib/payment-providers";

type PaymentRecord = {
  slug?: string | null;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const reference = url.searchParams.get("reference") ?? "";

  try {
    if (!reference) throw new Error("Missing payment reference.");

    const payment = await getPaymentByReference(reference);
    if (!payment) throw new Error("Payment record not found.");

    const verified = await verifyPaystackTransaction(reference);

    if (verified.status !== "success") {
      await markPaymentFailed({ providerReference: reference, providerPayload: verified });
      return NextResponse.redirect(new URL(`/l/${String((payment as PaymentRecord).slug)}?payment=failed`, req.url));
    }

    const paidPayment = await completePaidPremiumPayment({
      providerReference: reference,
      amount: Number(verified.amount),
      currency: verified.currency,
      providerPayload: verified,
    });

    return NextResponse.redirect(new URL(`/l/${String((paidPayment as PaymentRecord).slug)}?payment=success`, req.url));
  } catch {
    const payment = reference ? await getPaymentByReference(reference).catch(() => null) : null;
    const slug = payment ? String((payment as PaymentRecord).slug) : "";
    return NextResponse.redirect(new URL(slug ? `/l/${slug}?payment=failed` : "/create", req.url));
  }
}
