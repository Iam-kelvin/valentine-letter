import Stripe from "stripe";
import type { PaymentProvider } from "@/lib/db";

export const premiumPrices = {
  paystack: {
    amount: Number(process.env.PAYSTACK_PREMIUM_AMOUNT_KOBO ?? 50000),
    currency: "NGN",
    label: "\u20A6500",
  },
  stripe: {
    amount: Number(process.env.STRIPE_PREMIUM_AMOUNT_CENTS ?? 499),
    currency: (process.env.STRIPE_PREMIUM_CURRENCY ?? "usd").toLowerCase(),
    label: "$4.99",
  },
};

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  stripeClient ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeClient;
}

export function getProviderPrice(provider: PaymentProvider) {
  return premiumPrices[provider];
}

export function buildPaymentReference(provider: PaymentProvider, slug: string) {
  const random = Math.random().toString(36).slice(2, 8);
  return `letterly_${provider}_${slug.slice(0, 32)}_${Date.now()}_${random}`.replace(
    /[^a-zA-Z0-9_-]/g,
    ""
  );
}

export function getBaseUrl(req: Request) {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    return `${forwardedProto ?? "https"}://${forwardedHost}`;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  return new URL(req.url).origin;
}

export async function initializePaystackTransaction(data: {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  callbackUrl: string;
  slug: string;
  userId: string;
}) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  }

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      amount: data.amount,
      currency: data.currency,
      reference: data.reference,
      callback_url: data.callbackUrl,
      metadata: {
        slug: data.slug,
        userId: data.userId,
        reference: data.reference,
      },
    }),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok || body?.status !== true || !body?.data?.authorization_url) {
    throw new Error(body?.message ?? "Could not start Paystack checkout.");
  }

  return body.data as {
    authorization_url: string;
    access_code?: string;
    reference: string;
  };
}

export async function verifyPaystackTransaction(reference: string) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const body = await res.json().catch(() => null);

  if (!res.ok || body?.status !== true) {
    throw new Error(body?.message ?? "Could not verify Paystack payment.");
  }

  return body.data as {
    reference: string;
    status: string;
    amount: number;
    currency: string;
    metadata?: Record<string, unknown>;
  };
}
