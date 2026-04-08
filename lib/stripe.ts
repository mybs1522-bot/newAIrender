import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-03-31.basil",
    });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_t, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const PLANS = {
  monthly: {
    label: "Monthly",
    price: "$20",
    period: "/month",
    priceId: process.env.STRIPE_PRICE_MONTHLY_ID!,
    trialDays: 3,
  },
  yearly: {
    label: "Yearly",
    price: "$200",
    period: "/year",
    priceId: process.env.STRIPE_PRICE_YEARLY_ID!,
    trialDays: 3,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
