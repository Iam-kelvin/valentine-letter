import {
  getPaymentByReference,
  markPaymentFailed,
  markPaymentPaid,
} from "@/lib/db";
import { upgradeLetterToPremium } from "@/lib/premium-letter";

type PaymentRecord = {
  slug?: string | null;
  user_id?: string | null;
  amount?: number | string | null;
  currency?: string | null;
};

export async function completePaidPremiumPayment({
  providerReference,
  providerCheckoutId,
  amount,
  currency,
  providerPayload,
}: {
  providerReference: string;
  providerCheckoutId?: string | null;
  amount: number;
  currency: string;
  providerPayload?: unknown;
}) {
  const payment = await getPaymentByReference(providerReference);
  if (!payment) throw new Error("Payment record not found.");

  const paymentRecord = payment as PaymentRecord;
  const expectedAmount = Number(paymentRecord.amount);
  const expectedCurrency = String(paymentRecord.currency ?? "").toUpperCase();
  const receivedCurrency = currency.toUpperCase();

  if (expectedAmount !== Number(amount) || expectedCurrency !== receivedCurrency) {
    await markPaymentFailed({ providerReference, providerPayload });
    throw new Error("Payment amount did not match this letter.");
  }

  const paidPayment = await markPaymentPaid({
    providerReference,
    providerCheckoutId,
    providerPayload,
  });

  if (!paidPayment) throw new Error("Could not mark payment as paid.");

  const paidPaymentRecord = paidPayment as PaymentRecord;

  await upgradeLetterToPremium({
    slug: String(paidPaymentRecord.slug),
    userId: String(paidPaymentRecord.user_id),
  });

  return paidPayment;
}
