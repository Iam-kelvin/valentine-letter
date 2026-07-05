import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  createPaymentAttempt,
  getLetter,
  updatePaymentCheckout,
  type PaymentProvider,
} from "@/lib/db";
import {
  buildPaymentReference,
  getBaseUrl,
  getProviderPrice,
  getStripeClient,
  initializePaystackTransaction,
} from "@/lib/payment-providers";

const BodySchema = z.object({
  provider: z.enum(["paystack", "stripe"]),
});

type LetterRecord = {
  user_id?: string | null;
  is_premium?: boolean | null;
  quality_tier?: string | null;
};

export async function POST(
  req: Request,
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

    const letter = row as LetterRecord;

    if (letter.user_id !== userId) {
      return NextResponse.json({ error: "Only the sender can upgrade this letter." }, { status: 403 });
    }

    if (letter.is_premium === true || letter.quality_tier === "premium") {
      return NextResponse.json({ ok: true, alreadyPremium: true, redirectUrl: `/l/${slug}` });
    }

    const { provider } = BodySchema.parse(await req.json()) as { provider: PaymentProvider };
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "Please add an email address before upgrading this letter." },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl(req);
    const reference = buildPaymentReference(provider, slug);
    const price = getProviderPrice(provider);

    await createPaymentAttempt({
      slug,
      userId,
      provider,
      providerReference: reference,
      amount: price.amount,
      currency: price.currency,
      email,
    });

    if (provider === "paystack") {
      const paystack = await initializePaystackTransaction({
        email,
        amount: price.amount,
        currency: price.currency,
        reference,
        callbackUrl: `${baseUrl}/api/payments/paystack/callback?reference=${encodeURIComponent(reference)}`,
        slug,
        userId,
      });

      await updatePaymentCheckout({
        providerReference: reference,
        providerCheckoutId: paystack.access_code ?? null,
        checkoutUrl: paystack.authorization_url,
        providerPayload: paystack,
      });

      return NextResponse.json({
        ok: true,
        provider,
        authorizationUrl: paystack.authorization_url,
      });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      success_url: `${baseUrl}/api/payments/stripe/callback?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/l/${slug}?payment=cancelled`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: price.currency,
            unit_amount: price.amount,
            product_data: {
              name: "Letterly Premium Letter",
              description: "Unlock a deeper premium version of this specific letter.",
            },
          },
        },
      ],
      metadata: {
        slug,
        userId,
        reference,
      },
      payment_intent_data: {
        metadata: {
          slug,
          userId,
          reference,
        },
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    await updatePaymentCheckout({
      providerReference: reference,
      providerCheckoutId: session.id,
      checkoutUrl: session.url,
      providerPayload: { id: session.id, payment_status: session.payment_status },
    });

    return NextResponse.json({
      ok: true,
      provider,
      authorizationUrl: session.url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start checkout." },
      { status: 500 }
    );
  }
}
